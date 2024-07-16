import {
  CheckCircleIcon,
  CurrencyDollarIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {Space, Table, TableProps, Tag} from "antd";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "user",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, {tags}) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];
function HomeLayout() {
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
          Barcha ishchilar
        </div>
        <div className="bg-[#f5f5f5] rounded-xl flex p-5 items-center text-[1rem] text-black h-32">
          <div className="p-6 bg-white mr-5 rounded-2xl bg-[#fff2c6]">
            <UsersIcon color="#ffce26" width={33} height={33} />
          </div>
          Barcha xizmatlar
        </div>
        <div className="bg-[#f5f5f5] rounded-xl flex p-5 items-center text-[1rem] text-black h-32">
          <div className="p-6 bg-white mr-5 rounded-2xl bg-[#ffe0d3]">
            <CurrencyDollarIcon color="#fd7238" width={33} height={33} />
          </div>
          Barcha lidlar
        </div>
      </div>
      <Table className="mt-10" columns={columns} dataSource={data} />
    </>
  );
}

export default HomeLayout;
