import {Button, Space, Table, TableProps, Tooltip} from "antd";
import {UserData} from "../interface";
import {useQuery} from "@tanstack/react-query";
import {customFetch} from "../utils";
import ModalPromise from "../components/antdUI/ModalPromise";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import {useState} from "react";
import AddStaff from "../components/staff/AddStaff";
import EditStaff from "../components/staff/EditStaff";
import dayjs from "dayjs";

function Staffs() {
  const [editData, setEditData] = useState<null | UserData>(null);
  const [editShow, setEditShow] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const {data, isFetching} = useQuery({
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
    return record.staff_first_name
      .toLowerCase()
      .startsWith(value.toLowerCase());
  };

  const columns: TableProps<UserData>["columns"] = [
    {
      title: "FISH",
      dataIndex: "staff_first_name",
      key: "staff_first_name",
      filters: data?.data?.map((single) => ({
        text: single.staff_first_name,
        value: single.staff_first_name,
      })),
      filterSearch: true,
      onFilter: filterFunction,
      render: (_, record) => (
        <p>{`${record.staff_first_name} ${record.staff_last_name}`}</p>
      ),
    },
    {
      title: "Ishga qabul qilingan sana",
      dataIndex: "staff_created_at",
      key: "staff_created_at",
      render: (text) => <p>{dayjs(text).format("MMMM D, YYYY")}</p>,
    },
    {
      title: "Telefon raqami",
      dataIndex: "staff_phone_number",
      key: "staff_phone_number",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Tahrirlash",
      className: "w-[120px]",
      key: "options",
      render: (staff: UserData) => (
        <Space size="small">
          <ModalPromise
            key="staff"
            title="staff"
            url={`v1/staff/${staff?._id}`}
          >
            <Button
              type="primary"
              size="large"
              shape="default"
              danger
              icon={<TrashIcon width={24} height={24} />}
            />
          </ModalPromise>
          <Tooltip title="Edit">
            <Button
              onClick={() => {
                setEditShow(true);
                setEditData(staff);
              }}
              size="large"
              type="primary"
              shape="default"
              icon={<PencilSquareIcon width={24} height={24} />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[40px] font-bold">Ishchilar</h1>
        <Button onClick={() => setAddModal(true)} size="large" type="primary">
          {"YANGI ISHCHI QO'SHISH"}
        </Button>
      </div>

      <AddStaff close={() => setAddModal(false)} show={addModal} />
      <EditStaff
        singleData={editData}
        close={() => setEditShow(false)}
        show={editShow}
      />
      <Table
        rowKey="_id"
        loading={isFetching}
        className="mt-10"
        columns={columns}
        dataSource={data?.data ?? []}
      />
    </div>
  );
}

export default Staffs;
