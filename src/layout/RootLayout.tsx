import {useState} from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {Avatar, Button, Layout, Menu, theme, Tooltip} from "antd";
import {Link, Outlet} from "react-router-dom";
import {
  Bars3CenterLeftIcon,
  FaceSmileIcon,
  PhoneArrowUpRightIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

const {Header, Sider, Content} = Layout;

function RootLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  return (
    <>
      <Layout className="h-full">
        <Sider width={280} trigger={null} collapsible collapsed={collapsed}>
          <p className="text-white flex items-center gap-2 ml-[31px] text-[20px] my-[15px]">
            <FaceSmileIcon className="text-center" width={22} height={22} />
            <span className={`${collapsed ? "hidden" : "flex"} transition-all`}>
              Admin
            </span>
          </p>
          <Menu
            theme="dark"
            mode="inline"
            className="text-[18px] mt-[50px]"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <Bars3CenterLeftIcon width={22} height={22} />,
                label: <Link to="/">Dashboard</Link>,
              },
              {
                key: "2",
                icon: <UserGroupIcon width={22} height={22} />,
                label: <Link to="/staffs">Ishchilar</Link>,
              },
              {
                key: "3",
                icon: <WrenchScrewdriverIcon width={22} height={22} />,
                label: <Link to="/service">Service</Link>,
              },
              {
                key: "5",
                icon: <PhoneArrowUpRightIcon width={22} height={22} />,
                label: <Link to="/partners">Xamkorlar</Link>,
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            className="flex items-center justify-between"
            style={{padding: 0, background: colorBgContainer}}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className="flex items-center gap-3">
              <h1>{JSON.parse(localStorage.getItem("fish") || "")}</h1>
              <Tooltip className="mr-5" title="User">
                <Avatar
                  src={`https://admin-panel-c22z.onrender.com/${JSON.parse(
                    localStorage.getItem("profileImg") || ""
                  )}`}
                  size="large"
                  icon={<UserOutlined />}
                />
              </Tooltip>
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default RootLayout;
