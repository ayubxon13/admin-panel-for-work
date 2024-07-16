import {Button, Space, Table, TableProps, Tooltip} from "antd";
import {IPartners} from "../interface";
import ModalPromise from "../components/antdUI/ModalPromise";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import {useQuery} from "@tanstack/react-query";
import {customFetch} from "../utils";
import dayjs from "dayjs";
import {useState} from "react";
import AddPartners from "../components/partners/AddPartners";
import EditParters from "../components/partners/EditPartners";

function Partners() {
  const [addModal, setAddModal] = useState(false);
  const [editData, setEditData] = useState<null | IPartners>(null);
  const [editShow, setEditShow] = useState(false);

  const {data, isFetching} = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const res: {data: {data: IPartners[]}} = await customFetch(
        "v1/partners",
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
    return record.partner_title.toLowerCase().startsWith(value.toLowerCase());
  };
  const columns: TableProps<IPartners>["columns"] = [
    {
      title: "Xamkor nomi",
      dataIndex: "partner_title",
      key: "partner_title",
      filters: data?.data?.map((single) => ({
        text: single.partner_title,
        value: single.partner_title,
      })),
      filterSearch: true,
      onFilter: filterFunction,
      render: (text) => <p>{`${text}`}</p>,
    },
    {
      title: "Xamkor xaqida",
      dataIndex: "about_partner",
      key: "about_partner",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Yaratilgan sanasi",
      dataIndex: "partner_created_at",
      key: "partner_created_at",
      render: (text) => <p>{dayjs(text).format("MMMM D, YYYY")}</p>,
    },
    {
      title: "Tahrirlash",
      className: "w-[120px]",
      key: "options",
      render: (partner: IPartners) => (
        <Space size="small">
          <ModalPromise
            key="partners"
            title="partner"
            url={`v1/partners/${partner._id}`}
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
                setEditData(partner);
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
          {"YANGI XAMKOR QO'SHISH"}
        </Button>
      </div>

      <AddPartners close={() => setAddModal(false)} show={addModal} />
      <EditParters
        close={() => setEditShow(false)}
        show={editShow}
        singleData={editData}
      />

      <Table
        loading={isFetching}
        rowKey="_id"
        className="mt-10"
        columns={columns}
        dataSource={data?.data ?? []}
      />
    </>
  );
}

export default Partners;
