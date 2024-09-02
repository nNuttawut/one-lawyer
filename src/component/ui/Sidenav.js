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
      key: 1,
      pageName: "dashboard",
      label: "dashboard",
      path: "/dashboard",
      icon: <HomeOutlined />,
      title: "หน้าแรก",
    },
    {
      key: 2,
      pageName: "notice",
      label: "notice",
      path: "/notice",
      icon: <FormOutlined />,
      title: "สร้าง โนติส",
    },
    {
      key: 3,
      pageName: "pre-lawsuit-filed",
      label: "pre-lawsuit-filed",
      path: "/pre-lawsuit-filed",
      icon: <FormOutlined />,
      title: "สร้างคำฟ้อง",
    },
    {
      key: 4,
      pageName: "investigate-assets",
      label: "investigate-assets",
      path: "/investigate-assets",
      icon: <SearchOutlined />,
      title: "สืบทรัพย์ลูกหนี้",
    },
    {
      key: 5,
      pageName: "awaiting-judgment",
      label: "awaiting-judgment",
      path: "/awaiting-judgment",
      icon: <SearchOutlined />,
      title: "ชั้นศาล",
      children: [
        {
          key: 51,
          icon: <SearchOutlined />,
          pageName: "awaiting-judgment",
          path: "/awaiting-judgment",
          label: "รอพิพากษา",
        },
        {
          key: 52,
          icon: <SearchOutlined />,
          pageName: "adjudge",
          path: "/adjudge",
          label: "คดีถึงที่สุด",
        },
        {
          key: 53,
          icon: <SearchOutlined />,
          pageName: "report-court",
          path: "/report-court",
          label: "รายงาน",
        },
      ],
    },
    {
      key: 6,
      pageName: "send-to-enforcement",
      label: "send-to-enforcement",
      path: "/send-to-enforcement",
      icon: <AuditOutlined />,
      title: "ส่งบังคับคดี",
    },
    {
      key: 7,
      pageName: "negotiate",
      label: "negotiate",
      path: "/negotiate",
      icon: <ScheduleOutlined />,
      title: "เจรจาหนี้",
    },
    {
      key: 8,
      pageName: "sale-announcement",
      label: "sale-announcement",
      path: "/sale-announcement",
      icon: <NotificationOutlined />,
      title: "ประกาศขายทรัพย์",
    },
    {
      key: 9,
      pageName: "debt-payment",
      label: "debt-payment",
      path: "/debt-payment",
      icon: <BarcodeOutlined />,
      title: "ชำระหนี้/ประนอมหนี้",
    },
    {
      key: 10,
      pageName: "disbursement",
      label: "disbursement",
      path: "/disbursement",
      icon: <WalletOutlined />,
      title: "งบเบิกจ่าย",
    },
    {
      key: 11,
      pageName: "report",
      label: "report",
      path: "/report",
      icon: <FileTextOutlined />,
      title: "รายงาน",
    },
    {
      key: 12,
      pageName: "bad-debt",
      label: "bad-debt",
      path: "/bad-debt",
      icon: <UsergroupAddOutlined />,
      title: "ลูกหนี้สูญ",
    },
    {
      key: 13,
      pageName: "import-data",
      label: "import-data",
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
              <Menu
              // mode="inline"
              >
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
                          <span
                            className="icon"
                            style={{ marginRight: "20px" }}
                          >
                            <div style={{ marginRight: "20px" }}>
                              {child.icon} {child.label}
                            </div>
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
