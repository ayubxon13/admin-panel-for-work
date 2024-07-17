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
  serviceTitle: string;
  serviceAbout: string;
  filePhoto: UploadProps;
};

async function addService(data: InputType) {
  const formData = new FormData();
  formData.append("service_title", data.serviceTitle);
  formData.append("about_service", data.serviceAbout);
  if (data.filePhoto.fileList?.[0]?.originFileObj) {
    formData.append("files", data.filePhoto.fileList[0].originFileObj as File);
  }

  try {
    await customFetch.post("v1/service", formData, {
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

function AddService({close, show}: compPorps) {
  const {control, reset, handleSubmit} = useForm<InputType>();

  const queryClient = useQueryClient();

  const {mutateAsync, isPending} = useMutation({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["service"]});
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
      title="Service qo'shish"
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

export default AddService;
