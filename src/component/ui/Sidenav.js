import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  FormOutlined,
  SearchOutlined,
  BarcodeOutlined,
  AuditOutlined,
  NotificationOutlined,
  BookOutlined,
  ScheduleOutlined,
  ImportOutlined,
  CaretRightOutlined,
  SnippetsOutlined,
  DollarOutlined,
  CheckOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
// import drawerHeader from "../../assets/images/logo.png";
import drawerHeader from "../../assets/images/logoLogin.png";
import { useState } from "react";

function Sidenav({ color, onClick }) {
  const [openKeys, setOpenKeys] = useState([]);

  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const menuList = [
    {
      key: "1",
      pageName: "dashboard",
      label: "dashboard",
      path: "/",
      icon: <HomeOutlined />,
      title: "หน้าแรก",
    },
    // {
    //   key: "2",
    //   pageName: "calendar",
    //   label: "calendar",
    //   path: "/calendar",
    //   icon: <CalendarOutlined />,
    //   title: "ปฏิทินนัดหมาย",
    // },
    {
      key: "3",
      pageName: "notice",
      label: "notice",
      path: "/notice",
      icon: <FormOutlined />,
      title: "โนติส",
      children: [
        {
          key: "31",
          icon: <CaretRightOutlined />,
          pageName: "import-data",
          path: "notice/create-notice",
          label: "ออกโนติส",
        },
        {
          key: "32",
          icon: <CaretRightOutlined />,
          pageName: "assign-lawyers",
          path: "notice/reply-notice",
          label: "ตอบกลับโนติส",
        },
      ],
    },
    {
      key: "4",
      pageName: "pre-lawsuit-filed",
      label: "pre-lawsuit-filed",
      path: "/pre-lawsuit-filed",
      icon: <FormOutlined />,
      title: "ส่วนฟ้อง",
    },
    {
      key: "5",
      pageName: "investigate-assets",
      label: "investigate-assets",
      path: "/investigate-assets",
      icon: <SearchOutlined />,
      title: "สืบทรัพย์ลูกหนี้",
      children: [
        {
          key: "51",
          icon: <CaretRightOutlined />,
          pageName: "awaiting-judgment",
          path: "investigate-assets/before-indict",
          label: "ก่อนฟ้อง",
        },
        {
          key: "52",
          icon: <CaretRightOutlined />,
          pageName: "adjudge",
          path: "investigate-assets/after-indict",
          label: "หลังฟ้อง",
        },
      ],
    },
    {
      key: "6",
      pageName: "awaiting-judgment",
      label: "awaiting-judgment",
      path: "/awaiting-judgment",
      icon: <SnippetsOutlined />,
      title: "ชั้นศาล",
      children: [
        {
          key: "61",
          icon: <CaretRightOutlined />,
          pageName: "awaiting-judgment",
          path: "court/awaiting-judgment",
          label: "พิพากษา",
        },
        {
          key: "62",
          icon: <CaretRightOutlined />,
          pageName: "judgement",
          path: "court/judgement",
          label: "หมายคดีตั้ง",
        },
        {
          key: "63",
          icon: <CaretRightOutlined />,
          pageName: "adjudge",
          path: "court/case-is-final",
          label: "คดีถึงที่สุด",
        },

        {
          key: "64",
          icon: <CaretRightOutlined />,
          pageName: "report-court",
          path: "court/report-court",
          label: "รายงาน",
        },
      ],
    },
    {
      key: "7",
      pageName: "negotiate",
      label: "negotiate",
      path: "/negotiate",
      icon: <ScheduleOutlined />,
      title: "เจรจาทรัพย์",
    },

    {
      key: "8",
      pageName: "debt-payment",
      label: "debt-payment",
      path: "/debt-payment",
      icon: <BarcodeOutlined />,
      title: "ทำยอม/รีสัญญา",
    },
    {
      key: "9",
      pageName: "send-to-enforcement",
      label: "send-to-enforcement",
      path: "/send-to-enforcement",
      icon: <AuditOutlined />,
      title: "ส่วนบังคับคดี",
    },
    {
      key: "10",
      pageName: "sale-announcement",
      label: "sale-announcement",
      path: "/sale-announcement",
      icon: <NotificationOutlined />,
      title: "ประกาศขายทรัพย์",
    },
    {
      key: "11",
      pageName: "final-case",
      label: "final-case",
      path: "/final-case",
      icon: <CheckOutlined />,
      title: "คดีสิ้นสุด",
    },
    {
      key: "12",
      pageName: "commission",
      label: "commission",
      path: "/commission",
      icon: <DollarOutlined />,
      title: "คอมมิชชั่นทนาย",
      children: [
        {
          key: "121",
          icon: <CaretRightOutlined />,
          pageName: "commission-law",
          path: "commission/commission-law",
          label: "คดีในชั้นศาล",
        },
        // {
        //   key: "122",
        //   icon: <CaretRightOutlined />,
        //   pageName: "commission-investigate",
        //   path: "commission/commission-investigate",
        //   label: "ค่าคอมมิชชั่นสืบทรัพย์",
        // },
      ],
    },
    // {
    //   key: "12",
    //   pageName: "disbursement",
    //   label: "disbursement",
    //   path: "/disbursement",
    //   icon: <WalletOutlined />,
    //   title: "งบเบิกจ่าย",
    // },
    // {
    //   key: "13",
    //   pageName: "bad-debt",
    //   label: "bad-debt",
    //   path: "/bad-debt",
    //   icon: <UsergroupAddOutlined />,
    //   title: "ลูกหนี้สูญ",
    // },
    {
      key: "13",
      pageName: "import",
      label: "manage-data",
      path: "/manage-data",
      icon: <ImportOutlined />,
      title: "จัดการข้อมูล",
      children: [
        {
          key: "131",
          icon: <CaretRightOutlined />,
          pageName: "import-data",
          path: "manage-data/import-data",
          label: "นำข้อมูลเข้า",
        },
        {
          key: "132",
          icon: <CaretRightOutlined />,
          pageName: "assign-lawyers",
          path: "manage-data/assign-lawyers",
          label: "มอบหมายงาน",
        },
        {
          key: "133",
          icon: <CaretRightOutlined />,
          pageName: "change-lawyers-jobs",
          path: "manage-data/change-lawyers-jobs",
          label: "เปลี่ยนทนาย",
        },
      ],
    },
    {
      key: "14",
      pageName: "report",
      label: "report",
      path: "/report",
      icon: <FileTextOutlined />,
      title: "รายงาน",
      children: [
        {
          key: "141",
          icon: <CaretRightOutlined />,
          pageName: "notice",
          path: "report/notice",
          label: "รายงาน โนติส",
        },
      ],
    },
    {
      key: "15",
      pageName: "import",
      label: "guidbook",
      path: "/guidbook",
      icon: <BookOutlined />,
      title: "คู่มือ",
      children: [
        {
          key: "151",
          icon: <CaretRightOutlined />,
          pageName: "import-data",
          path: "guidbook/read-text",
          label: "วิธีแปลงรูปภาพเป็นตัวหนังสือ",
        },
        {
          key: "152",
          icon: <CaretRightOutlined />,
          pageName: "import-data",
          path: "guidbook/test",
          label: "ทดสอบอัพรูป",
        },
      ],
    },
  ];

  const handleClick = (value) => {
    // console.log(value);
    onClick(value);
  };

  const handleOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const renderMenuItem = (item) => {
    return item.children ? (
      <Menu.SubMenu
        key={item.key}
        title={<span className="label">{item.title}</span>}
        icon={
          <div>
            <span className="icon">{item.icon}</span>
          </div>
        }
      >
        {item.children.map((child) => (
          <Menu.Item
            key={child.key}
            onClick={() => {
              handleClick(child.label);
            }}
          >
            <NavLink to={child.path}>
              <span
                className="icon"
                style={{
                  marginLeft: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {child.icon}
              </span>
              <span style={{ fontSize: 13 }}>{child.label}</span>
            </NavLink>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
    ) : (
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
              height: "30px",
              display: "flex",
              alignItems: "center",
              marginLeft: "12px",
            }}
          >
            {item.icon}
          </span>
          <span className="label" style={{ marginLeft: "10px" }}>
            {item.title}
          </span>
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
        <img src={drawerHeader} width={"70%"} alt="drawerHeader" />
      </div>
      <hr />

      <Menu
        theme="light"
        mode="inline"
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        // triggerSubMenuAction="click"
        // inlineCollapsed={true}
        style={{
          width: 256,
        }}
      >
        {menuList.map((item) => renderMenuItem(item))}
      </Menu>
    </>
  );
}

export default Sidenav;
