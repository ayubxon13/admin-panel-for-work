import {
  Button,
  ConfigProvider,
  Space,
  Table,
  TableProps,
  Tag,
  Tooltip,
} from "antd";
import ModalPromise from "../components/antdUI/ModalPromise";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import {IServiceData} from "../interface";
import {useQuery} from "@tanstack/react-query";
import {customFetch} from "../utils";
import {useState} from "react";
import AddService from "../components/service/AddService";
import dayjs from "dayjs";
import EditService from "../components/service/EditService";

export default function Service() {
  const [addModal, setAddModal] = useState(false);
  const [editData, setEditData] = useState<null | IServiceData>(null);
  const [editShow, setEditShow] = useState(false);

  const {data, isFetching} = useQuery({
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

  const filterFunction = (value: any, record: any): any => {
    return record.service_title.toLowerCase().startsWith(value.toLowerCase());
  };
  const columns: TableProps<IServiceData>["columns"] = [
    {
      title: "Xizmat nomi",
      dataIndex: "staff_first_name",
      key: "staff_first_name",
      filters: data?.data?.map((single) => ({
        text: single.service_title,
        value: single.service_title,
      })),
      filterSearch: true,
      onFilter: filterFunction,
      render: (_, record) => <p>{`${record.service_title}`}</p>,
    },
    {
      title: "Qachon boshlangan",
      dataIndex: "service_created_at",
      key: "service_created_at",
      render: (text) => <p>{dayjs(text).format("MMMM D, YYYY")}</p>,
    },
    {
      title: "Status",
      dataIndex: "",
      key: "",
      render: () => <Tag color="green">Active</Tag>,
    },
    {
      title: "Tahrirlash",
      className: "w-[120px]",
      key: "options",
      render: (service: IServiceData) => (
        <Space size="small">
          <ModalPromise
            key="service"
            title="service"
            url={`v1/service/${service._id}`}
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
                setEditData(service);
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
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-[40px] font-bold">Xizmatlar</h1>
        <Button onClick={() => setAddModal(true)} size="large" type="primary">
          {"YANGI USLUGA QO'SHISH"}
        </Button>
      </div>
      <AddService show={addModal} close={() => setAddModal(false)} />
      <EditService
        close={() => setEditShow(false)}
        show={editShow}
        singleData={editData}
      />
      <ConfigProvider>
        <Table
          rowKey="_id"
          loading={isFetching}
          className="mt-10"
          columns={columns}
          dataSource={data?.data ?? []}
        />
      </ConfigProvider>
    </>
  );
}
