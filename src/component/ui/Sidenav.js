import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  UsergroupAddOutlined,
  ShoppingOutlined,
  SearchOutlined,
  BarcodeOutlined,
  FileTextOutlined,
  AuditOutlined,
  NotificationOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import drawerHeader from "../../assets/images/logo.png";

function Sidenav({ color, onClick }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const menuList = [
    {
      key: 1,
      pageName: "dashboard",
      path: "/dashboard",
      icon: <HomeOutlined />,
      title: "หน้าแรก",
    },
    {
      key: 2,
      pageName: "debtor",
      path: "/debtor",
      icon: <UsergroupAddOutlined />,
      title: "ลูกหนี้มีปัญหา",
    },
    {
      key: 3,
      pageName: "pre-lawsuit-filed",
      path: "/pre-lawsuit-filed",
      icon: <AuditOutlined />,
      title: "เตรียมส่งฟ้อง",
    },
    {
      key: 4,
      pageName: "investigate-assets",
      path: "/Investigate-assets",
      icon: <SearchOutlined />,
      title: "สืบทรัพย์ลูกหนี้",
    },
    {
      key: 5,
      pageName: "send-to-enforcement",
      path: "/send-to-enforcement",
      icon: <ShoppingOutlined />,
      title: "ส่งบังคับคดี",
    },
    {
      key: 6,
      pageName: "sale-announcement",
      path: "/sale-announcement",
      icon: <NotificationOutlined />,
      title: "ประกาศขายทรัพย์",
    },
    {
      key: 7,
      pageName: "debt-payment",
      path: "/debt-payment",
      icon: <BarcodeOutlined />,
      title: "ชำระหนี้/ประนอมหนี้",
    },
    {
      key: 8,
      pageName: "disbursement",
      path: "/disbursement",
      icon: <WalletOutlined />,
      title: "งบเบิกจ่าย",
    },
    {
      key: 9,
      pageName: "report",
      path: "/report",
      icon: <FileTextOutlined />,
      title: "รายงาน",
    },
  ];

  const handleClick = (value) => {
    // console.log(value);
    onClick(value);
  };

  const renderMenuItem = (item) => {
    return (
      <Menu.Item
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
        </NavLink>
      </Menu.Item>
    );
  };

  return (
    <>
      <div style={{ justifyContent: "center", display: "flex" }}>
        <img src={drawerHeader} width={100} alt="drawerHeader" />
      </div>
      <hr />
      <Menu theme="light" mode="inline">
        {menuList.map((item) => renderMenuItem(item))}
      </Menu>
    </>
  );
}

export default Sidenav;
