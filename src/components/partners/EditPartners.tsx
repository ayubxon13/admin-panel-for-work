import {Button, Input, Modal, Upload, UploadProps} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {Controller, useForm} from "react-hook-form";
import {customFetch} from "../../utils";
import {toast} from "sonner";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {IPartners} from "../../interface";

type compPorps = {
  show: boolean;
  close: () => void;
  singleData: IPartners | null;
};

type InputType = {
  partnersTitle: string;
  partnersAbout: string;
  filePhoto: UploadProps;
};

function EditParters({close, show, singleData}: compPorps) {
  async function editPartners(data: InputType) {
    try {
      await customFetch.put(
        `v1/partners/${singleData?._id}`,
        {
          partner_title: data.partnersTitle,
          about_partner: data.partnersAbout,
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
    mutationFn: editPartners,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["partners"]});
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
      title="Xamkorni tahrirlash"
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
            name="partnersTitle"
            control={control}
            defaultValue={singleData?.partner_title}
            key={singleData?.partner_title}
            render={({field}) => (
              <Input {...field} className="h-10" size="large" />
            )}
          />
        </div>
        <div>
          <h5 className="text-lg opacity-70 font-medium">Service about:</h5>
          <Controller
            name="partnersAbout"
            control={control}
            defaultValue={singleData?.about_partner}
            key={singleData?.about_partner}
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

export default EditParters;
