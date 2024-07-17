import {Button, Input, Modal, Upload, UploadProps} from "antd";
import {Controller, useForm} from "react-hook-form";
import {UploadOutlined} from "@ant-design/icons";
import {IServiceData} from "../../interface";
import {customFetch} from "../../utils";
import {toast} from "sonner";
import {useMutation, useQueryClient} from "@tanstack/react-query";

type compPorps = {
  show: boolean;
  close: () => void;
  singleData: IServiceData | null;
};

type InputType = {
  serviceTitle: string;
  serviceAbout: string;
  filePhoto: UploadProps;
};

function EditService({close, show, singleData}: compPorps) {
  async function editService(data: InputType) {
    try {
      await customFetch.put(
        `v1/service/${singleData?._id}`,
        {
          service_title: data.serviceTitle,
          about_service: data.serviceAbout,
          files:
            data.filePhoto.fileList?.[0]?.originFileObj &&
            data.filePhoto.fileList[0].originFileObj,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: JSON.parse(localStorage.getItem("token") || ""),
          },
        }
      );
      toast.success("Reklama muvaffaqiyatli yaratildi");
    } catch (error: any) {
      console.error(
        "Error posting data:",
        error.response?.data || error.message
      );
      toast.error(
        `Tahrirlashda xatolikka uchradi: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    } finally {
      toast.dismiss();
    }
  }

  const {control, handleSubmit, reset} = useForm<InputType>();

  const queryClient = useQueryClient();

  const {mutateAsync, isPending} = useMutation({
    mutationFn: editService,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["service"]});
      close();
    },
  });

  const onSubmit = (inputData: InputType) => {
    mutateAsync(inputData).then(() => {
      reset();
    });
  };

  return (
    <Modal
      title="Modal 1000px width"
      centered
      open={show}
      onOk={() => handleSubmit(onSubmit)()}
      onCancel={close}
      confirmLoading={isPending}
      width={1000}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-3"
      >
        <div>
          <h5 className="text-lg opacity-70 font-medium">Service title:</h5>
          <Controller
            name="serviceTitle"
            control={control}
            defaultValue={singleData?.service_title}
            key={singleData?.service_title}
            render={({field}) => (
              <Input {...field} className="h-10" size="large" />
            )}
          />
        </div>
        <div>
          <h5 className="text-lg opacity-70 font-medium">Service about:</h5>
          <Controller
            name="serviceAbout"
            control={control}
            defaultValue={singleData?.about_service}
            key={singleData?.about_service}
            render={({field}) => (
              <Input {...field} className="h-10" size="large" />
            )}
          />
        </div>
        <div>
          <h5 className="text-lg opacity-70 font-medium">File Upload:</h5>
          <Controller
            name="filePhoto"
            control={control}
            render={({field}) => (
              <Upload
                {...field}
                maxCount={1}
                beforeUpload={() => false} // Prevents automatic upload
                onChange={(info) => field.onChange(info)}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            )}
          />
        </div>
      </form>
    </Modal>
  );
}

export default EditService;
