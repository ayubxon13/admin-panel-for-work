import {Button, Input, Modal, Upload, UploadProps} from "antd";
import {customFetch, formatPhoneNumber} from "../../utils";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import {UploadOutlined} from "@ant-design/icons";
import {Controller, useForm} from "react-hook-form";
import {toast} from "sonner";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UserData} from "../../interface";

type compPorps = {
  show: boolean;
  close: () => void;
  singleData: UserData | null;
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

function EditStaff({show, close, singleData}: compPorps) {
  async function editStaff(data: InputType) {
    try {
      await customFetch.put(
        `v1/staff/${singleData?._id}`,
        {
          staff_first_name: data.firstName,
          staff_last_name: data.lastName,
          staff_phone_number: `998` + data.phoneNumber.split(" ").join(""),
          username: data.userName,
          password: data.password,
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
    mutationFn: editStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["staff"]});
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
      title="Ishchini tahrirlash"
      centered
      confirmLoading={isPending}
      open={show}
      onOk={() => handleSubmit(onSubmit)()}
      onCancel={() => {
        close();
        reset();
      }}
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
            defaultValue={singleData?.staff_first_name}
            key={singleData?.staff_first_name}
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
            defaultValue={singleData?.username}
            key={singleData?.username}
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
            defaultValue={singleData?.staff_last_name}
            key={singleData?.staff_last_name}
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
            defaultValue={singleData?.staff_phone_number.slice(3)}
            key={singleData?.staff_phone_number.slice(3)}
            render={({field}) => (
              <Input
                {...field}
                name="phone"
                addonBefore="+998"
                size="large"
                onChange={(e) => {
                  const formattedValue = formatPhoneNumber(e.target.value);
                  return field.onChange(formattedValue);
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
            key={singleData?.password}
            render={({field}) => (
              <Input.Password
                {...field}
                size="large"
                placeholder="password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            )}
          />
        </div>
        <div>
          <h5 className="text-lg opacity-70 font-medium">Password:</h5>
          <Controller
            name="password2"
            control={control}
            key={singleData?.password}
            render={({field}) => (
              <Input.Password
                {...field}
                size="large"
                placeholder="password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            )}
          />
        </div>
        <div>
          <h5 className="text-lg opacity-70 font-medium">Password:</h5>
          <Controller
            name="filePhoto"
            control={control}
            key={singleData?.img}
            render={({field}) => (
              <Upload {...field} maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            )}
          />
        </div>
      </form>
    </Modal>
  );
}
export default EditStaff;
