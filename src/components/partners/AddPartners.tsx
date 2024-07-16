import {Button, Input, Modal, Upload, UploadProps} from "antd";
import {Controller, useForm} from "react-hook-form";
import {UploadOutlined} from "@ant-design/icons";
import {customFetch} from "../../utils";
import {toast} from "sonner";
import {useMutation, useQueryClient} from "@tanstack/react-query";

type compPorps = {
  show: boolean;
  close: () => void;
};

type InputType = {
  partnersTitle: string;
  partnersAbout: string;
  filePhoto: UploadProps;
};

async function addPartners(data: InputType) {
  const formData = new FormData();
  formData.append("partner_title", data.partnersTitle);
  formData.append("about_partner", data.partnersAbout);
  if (data.filePhoto.fileList?.[0]?.originFileObj) {
    formData.append("files", data.filePhoto.fileList[0].originFileObj as File);
  }

  try {
    await customFetch.post("v1/partners", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: JSON.parse(localStorage.getItem("token") || ""),
      },
    });
    toast.success("Reklama muvaffaqiyatli yaratildi");
  } catch (error: any) {
    console.error("Error posting data:", error.response?.data || error.message);
    toast.error(
      `Yaratishda xatolikka uchradi: ${
        error.response?.data?.message || error.message
      }`
    );
    throw error;
  } finally {
    toast.dismiss();
  }
}

function AddPartners({close, show}: compPorps) {
  const {control, reset, handleSubmit} = useForm<InputType>();

  const queryClient = useQueryClient();

  const {mutateAsync, isPending} = useMutation({
    mutationFn: addPartners,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["partners"]});
      close();
    },
  });

  const onSubmit = (inputData: InputType) => {
    const isEmpty = Object.values(inputData).some(
      (val) => val == null || val === ""
    );
    if (isEmpty) {
      return toast.error("Please fill out the form");
    } else {
      mutateAsync(inputData).then(() => {
        reset();
      });
    }
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
            name="partnersTitle"
            control={control}
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

export default AddPartners;
