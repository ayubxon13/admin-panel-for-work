import {Button, Input} from "antd";
import {FormEvent, useState} from "react";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import {toast} from "sonner";
import {customFetch} from "../utils";

function Login() {
  const [loading, setLoading] = useState(false);

  async function addUser(user: {username: string; password: string}) {
    try {
      setLoading(true);
      const res = await customFetch.post("v1/auth/login", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem(
        "fish",
        JSON.stringify(
          `${res.data.data.staff_first_name} ${res.data.data.staff_last_name}`
        )
      );
      console.log(res.data.data);

      localStorage.setItem("token", JSON.stringify(res.data.token));
      localStorage.setItem("profileImg", JSON.stringify(res.data.data.img));
      window.location.href = "/";
      toast.success("Muvaffaqiyatli ro'yhatdan o'tildi");
    } catch (error) {
      toast.error("Kirishda xatolikka uchradi");
      throw error;
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("user") as string;
    const password = formData.get("password") as string;
    const user = {username, password};
    addUser(user);
  };

  return (
    <div className="w-full mt-[300px]">
      <div className="mx-auto p-6 w-[500px] shadow-xl">
        <h4 className="text-center font-bold text-3xl">Login</h4>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-2 mt-6">
          <Input name="user" className="h-10" placeholder="Login" />
          <Input.Password
            name="password"
            placeholder="Parol"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
          <Button
            type="primary"
            size="large"
            loading={loading}
            htmlType="submit"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
