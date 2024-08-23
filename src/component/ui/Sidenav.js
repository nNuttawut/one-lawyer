import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  UsergroupAddOutlined,
  FormOutlined,
  SearchOutlined,
  BarcodeOutlined,
  FileTextOutlined,
  AuditOutlined,
  NotificationOutlined,
  WalletOutlined,
  ScheduleOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import drawerHeader from "../../assets/images/logo.png";
import { useState } from "react";

function Sidenav({ color, onClick }) {
  const [activeItem, setActiveItem] = useState(null);

  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const menuList = [
    {
      key: "sub1",
      label: "Navigation One",
      pageName: "dashboard",
      path: "/dashboard",
      icon: <HomeOutlined />,
      title: "หน้าแรก",
    },
    {
      key: 2,
      pageName: "pre-lawsuit-filed",
      path: "/pre-lawsuit-filed",
      icon: <FormOutlined />,
      title: "เตรียมส่งฟ้อง",
    },
    {
      key: 3,
      pageName: "investigate-assets",
      path: "/investigate-assets",
      icon: <SearchOutlined />,
      title: "สืบทรัพย์ลูกหนี้",
    },
    {
      key: 4,
      pageName: "awaiting-judgment",
      path: "/awaiting-judgment",
      icon: <SearchOutlined />,
      title: "ชั้นศาล",
      children: [
        {
          key: 41,
          icon: <SearchOutlined />,
          pageName: "awaiting-judgment",
          path: "/awaiting-judgment",
          label: "รอพิพากษา",
        },
        {
          key: 42,
          icon: <SearchOutlined />,
          pageName: "adjudge",
          path: "/adjudge",
          label: "คดีถึงที่สุด",
        },
        {
          key: 43,
          icon: <SearchOutlined />,
          pageName: "report-court",
          path: "/report-court",
          label: "รายงาน",
        },
      ],
    },
    {
      key: 5,
      pageName: "send-to-enforcement",
      path: "/send-to-enforcement",
      icon: <AuditOutlined />,
      title: "ส่งบังคับคดี",
    },
    {
      key: 6,
      pageName: "negotiate",
      path: "/negotiate",
      icon: <ScheduleOutlined />,
      title: "เจรจาหนี้",
    },
    {
      key: 7,
      pageName: "sale-announcement",
      path: "/sale-announcement",
      icon: <NotificationOutlined />,
      title: "ประกาศขายทรัพย์",
    },
    {
      key: 8,
      pageName: "debt-payment",
      path: "/debt-payment",
      icon: <BarcodeOutlined />,
      title: "ชำระหนี้/ประนอมหนี้",
    },
    {
      key: 9,
      pageName: "disbursement",
      path: "/disbursement",
      icon: <WalletOutlined />,
      title: "งบเบิกจ่าย",
    },
    {
      key: 10,
      pageName: "report",
      path: "/report",
      icon: <FileTextOutlined />,
      title: "รายงาน",
    },
    {
      key: 11,
      pageName: "bad-debt",
      path: "/bad-debt",
      icon: <UsergroupAddOutlined />,
      title: "หนี้สูญ",
    },
    {
      key: 12,
      pageName: "import-data",
      path: "/import-data",
      icon: <ImportOutlined />,
      title: "นำเข้าข้อมูล",
    },
  ];

  const handleClick = (value) => {
    // console.log(value);
    onClick(value);
  };

  const renderMenuItem = (item) => {
    console.log(item);
    return (
      <Menu.Item
        style={{
          width: 256,
        }}
        key={item.key}
        onClick={() => {
          handleClick(item.title);
        }}
      >
        <NavLink to={item.path}>
          <span
            className="icon"
            style={{
              background: page === item.pageName ? color : "",
            }}
          >
            {item.icon}
          </span>
          <span className="label">{item.title}</span>
          {item.children ? (
            <>
              <Menu>
                <Menu.SubMenu>
                  {item.children &&
                    item.children.map((child) => (
                      <Menu.Item
                        key={child.key}
                        onClick={() => {
                          handleClick(child.label);
                        }}
                      >
                        <NavLink to={child.path} key={child.key}>
                          <span className="icon">
                            <a style={{ marginRight: "30px" }}>{child.icon}</a>
                            <a className="label">{child.label}</a>
                          </span>
                        </NavLink>
                      </Menu.Item>
                    ))}
                </Menu.SubMenu>
              </Menu>
            </>
          ) : null}
        </NavLink>
      </Menu.Item>
    );
  };

  return (
    <>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
        }}
      >
        <img src={drawerHeader} width={70} alt="drawerHeader" />
      </div>
      <hr />

      <Menu theme="light" mode="inline">
        {menuList.map((item) => renderMenuItem(item))}
      </Menu>
    </>
  );
}

export default Sidenav;
