import {Button, Input, Modal, Upload, UploadProps} from "antd";
import {customFetch, formatPhoneNumber} from "../../utils";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import {Controller, useForm} from "react-hook-form";
import {toast} from "sonner";
import {useMutation, useQueryClient} from "@tanstack/react-query";

type compPorps = {
  show: boolean;
  close: () => void;
};

type InputType = {
  firstName: string;
  userName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  password2: string;
  filePhoto: UploadProps;
};

async function addStaff(data: InputType) {
  const formData = new FormData();
  formData.append("staff_first_name", data.firstName);
  formData.append("staff_last_name", data.lastName);
  formData.append(
    "staff_phone_number",
    `998${data.phoneNumber.split(" ").join("")}`
  );
  formData.append("username", data.userName);
  formData.append("password", data.password);
  if (data.filePhoto.fileList?.[0]?.originFileObj) {
    formData.append("files", data.filePhoto.fileList[0].originFileObj as File);
  }

  try {
    await customFetch.post("v1/staff", formData, {
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

function AddStaff({show, close}: compPorps) {
  const {control, handleSubmit, reset} = useForm<InputType>();

  const queryClient = useQueryClient();

  const {mutateAsync, isPending} = useMutation({
    mutationFn: addStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["staff"]});
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
      title="Ishchi qo'shish"
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
          <h5 className="text-lg opacity-70 font-medium">First name:</h5>
          <Controller
            name="firstName"
            control={control}
            render={({field}) => (
              <Input {...field} className="h-10" size="large" />
            )}
          />
        </div>
        <div>
          <h5 className="text-lg opacity-70 font-medium">User name:</h5>
          <Controller
            name="userName"
            control={control}
            render={({field}) => (
              <Input {...field} className="h-10" size="large" />
            )}
          />
        </div>
        <div>
          <h5 className="text-lg opacity-70 font-medium">Last name:</h5>
          <Controller
            name="lastName"
            control={control}
            render={({field}) => (
              <Input {...field} className="h-10" size="large" />
            )}
          />
        </div>
        <div>
          <h5 className="text-lg opacity-70 font-medium">Phone number:</h5>
          <Controller
            name="phoneNumber"
            control={control}
            render={({field}) => (
              <Input
                {...field}
                name="phone"
                addonBefore="+998"
                size="large"
                onChange={(e) => {
                  const formattedValue = formatPhoneNumber(e.target.value);
                  field.onChange(formattedValue);
                }}
              />
            )}
          />
        </div>
        <div>
          <h5 className="text-lg opacity-70 font-medium">Password:</h5>
          <Controller
            name="password"
            control={control}
            render={({field}) => (
              <Input.Password
                {...field}
                size="large"
                placeholder="input password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            )}
          />
        </div>
        <div>
          <h5 className="text-lg opacity-70 font-medium">Confirm Password:</h5>
          <Controller
            name="password2"
            control={control}
            render={({field}) => (
              <Input.Password
                {...field}
                size="large"
                placeholder="input password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
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

export default AddStaff;
