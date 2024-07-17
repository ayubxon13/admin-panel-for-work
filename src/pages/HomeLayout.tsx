import {
  CheckCircleIcon,
  CurrencyDollarIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {useQuery} from "@tanstack/react-query";
import {Table, TableProps} from "antd";
import {ILids, IServiceData, UserData} from "../interface";
import {customFetch} from "../utils";
import dayjs from "dayjs";

function HomeLayout() {
  const {data: staff} = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res: {data: {data: UserData[]}} = await customFetch("v1/staff", {
        headers: {
          "Content-Type": "application/json",
          token: JSON.parse(localStorage.getItem("token") || ""),
        },
      });
      return res.data;
    },
  });
  const filterFunction = (value: any, record: any): any => {
    return record.client_name.toLowerCase().startsWith(value.toLowerCase());
  };

  const {data: service} = useQuery({
    queryKey: ["service"],
    queryFn: async () => {
      const res: {data: {data: IServiceData[]}} = await customFetch(
        "v1/service",
        {
          headers: {
            "Content-Type": "application/json",
            token: JSON.parse(localStorage.getItem("token") || ""),
          },
        }
      );
      return res.data;
    },
  });
  const {data: lid} = useQuery({
    queryKey: ["lid"],
    queryFn: async () => {
      const res: {data: {data: ILids[]}} = await customFetch("v1/lids", {
        headers: {
          "Content-Type": "application/json",
          token: JSON.parse(localStorage.getItem("token") || ""),
        },
      });
      return res.data;
    },
  });
  const columns: TableProps<ILids>["columns"] = [
    {
      title: "Name",
      dataIndex: "client_name",
      key: "client_name",
      filters: lid?.data.map((single) => ({
        text: single.client_name,
        value: single.client_name,
      })),
      filterSearch: true,
      onFilter: filterFunction,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Phone number",
      dataIndex: "client_number",
      key: "client_number",
    },
    {
      title: "Created date",
      dataIndex: "lid_created_at",
      key: "lid_created_at",
      render: (text) => dayjs(text).format("MMMM D, YYYY"),
    },
  ];
  return (
    <>
      <div className="flex">
        <h1 className="text-[40px] font-bold">Dashboard</h1>
      </div>
      <div className="grid mt-14 grid-cols-3 gap-4">
        <div className="bg-[#f5f5f5] rounded-xl flex p-5 items-center text-[1rem] text-black h-32">
          <div className="p-6 bg-white mr-5 rounded-2xl bg-[#cfe8ff]">
            <CheckCircleIcon color="#3c91e6" width={33} height={33} />
          </div>
          Barcha ishchilar: {staff?.data.length ?? 0}
        </div>
        <div className="bg-[#f5f5f5] rounded-xl flex p-5 items-center text-[1rem] text-black h-32">
          <div className="p-6 bg-white mr-5 rounded-2xl bg-[#fff2c6]">
            <UsersIcon color="#ffce26" width={33} height={33} />
          </div>
          Barcha xizmatlar {service?.data.length ?? 0}
        </div>
        <div className="bg-[#f5f5f5] rounded-xl flex p-5 items-center text-[1rem] text-black h-32">
          <div className="p-6 bg-white mr-5 rounded-2xl bg-[#ffe0d3]">
            <CurrencyDollarIcon color="#fd7238" width={33} height={33} />
          </div>
          Barcha lidlar {lid?.data.length ?? 0}
        </div>
      </div>
      <Table
        rowKey="_id"
        className="mt-10"
        columns={columns}
        dataSource={lid?.data ?? []}
      />
    </>
  );
}

export default HomeLayout;
