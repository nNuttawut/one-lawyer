import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeOutlined as HomeOutlinedIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  ShoppingOutlined,
  DollarOutlined,
  BarsOutlined,
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
      icon: <HomeOutlinedIcon />,
      title: "หน้าแรก",
    },
    {
      key: 2,
      pageName: "orders",
      path: "/orders",
      icon: <ShoppingCartOutlinedIcon />,
      title: "ขายสินค้า",
    },
    {
      key: 3,
      pageName: "myorders",
      path: "/myorders",
      icon: <ShoppingOutlined />,
      title: "รายการขายของฉัน",
    },
    {
      key: 4,
      pageName: "toi-jee",
      path: "/toi-jee",
      icon: <DollarOutlined />,
      title: "งานโต่ยจี๊",
    },
    {
      key: 5,
      pageName: "toi-jee-list",
      path: "/toi-jee-list",
      icon: <BarsOutlined />,
      title: "รายการบิลงานโต๋ยจี๊",
    },
    // {
    //   key: 4,
    //   pageName: "ticket-config",
    //   path: "/ticket-config",
    //   icon: <ShoppingCartOutlinedIcon />,
    //   title: "เลือกโต๊ะงานง่วนเซียว",
    // },
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
        <img src={drawerHeader} width={100} alt="" />
      </div>
      <hr />
      <Menu theme="light" mode="inline">
        {menuList.map((item) => renderMenuItem(item))}
      </Menu>
    </>
  );
}

export default Sidenav;
