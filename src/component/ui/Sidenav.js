import { Menu, message } from "antd";
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
  WalletOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
// import drawerHeader from "../../assets/images/logo.png";
import drawerHeader from "../../assets/images/logoLogin.png";
import { useEffect, useState } from "react";
import axios from "axios";
import TokenCheck from "../../hook/TokenCheck";
import { baseUrl, GET_COMPANIES_LIST, HEADERS_EXPORT } from "../API/apiUrls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScaleBalanced,
  faGavel,
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";

function Sidenav({ color, onClick }) {
  const [signOut] = TokenCheck();
  const [openKeys, setOpenKeys] = useState([]);
  const ROLE_ID = localStorage.getItem("ROLE_ID");

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

    ROLE_ID === "1" || ROLE_ID === "2"
      ? {
          key: "2",
          pageName: "terminate",
          label: "terminate-contract",
          path: "/terminate-contract",
          icon: <FileExcelOutlined />,
          title: "บอกเลิกสัญญา",
          children: [
            {
              key: "21",
              icon: <CaretRightOutlined />,
              pageName: "create-terminate-Contract",
              path: "terminate-contract/create-terminate-Contract",
              label: "1. ออกบอกเลิกสัญญา",
            },
            {
              key: "22",
              icon: <CaretRightOutlined />,
              pageName: "create-terminate-Contract",
              path: "terminate-contract/import-terminate-Contract-ems",
              label: "2. นำเข้าข้อมูล EMS",
            },
            {
              key: "23",
              icon: <CaretRightOutlined />,
              pageName: "reply-terminate-Contract",
              path: "terminate-contract/reply-terminate-Contract",
              label: "3. ตอบกลับบอกเลิกสัญญา",
            },
            {
              key: "24",
              icon: <CaretRightOutlined />,
              pageName: "terminate-Contract-to-lawsuit",
              path: "terminate-contract/terminate-Contract-to-lawsuit",
              label: "4. สัญญาเตรียมส่งฟ้อง",
            },
          ],
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "2"
      ? {
          key: "17",
          pageName: "terminate",
          label: "terminate-contract-hand",
          path: "/terminate-contract-hand",
          icon: <FileExcelOutlined />,
          title: "บอกเลิกสัญญา(มือ)",
          children: [
            {
              key: "171",
              icon: <CaretRightOutlined />,
              pageName: "create-terminate-Contract",
              path: "terminate-contract-hand/create-terminate-Contract",
              label: "1. ออกบอกเลิกสัญญา",
            },
            {
              key: "172",
              icon: <CaretRightOutlined />,
              pageName: "create-terminate-Contract",
              path: "terminate-contract-hand/import-terminate-Contract-ems",
              label: "2. นำเข้าข้อมูล EMS",
            },
            {
              key: "173",
              icon: <CaretRightOutlined />,
              pageName: "reply-terminate-Contract",
              path: "terminate-contract-hand/reply-terminate-Contract",
              label: "3. ตอบกลับบอกเลิกสัญญา",
            },
            {
              key: "174",
              icon: <CaretRightOutlined />,
              pageName: "terminate-Contract-to-lawsuit",
              path: "terminate-contract-hand/terminate-Contract-to-lawsuit",
              label: "4. สัญญาเตรียมส่งฟ้อง",
            },
          ],
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "2"
      ? {
          key: "3",
          pageName: "notice",
          label: "notice",
          path: "/notice",
          icon: <FileExcelOutlined />,
          title: "ออก notice",
          children: [
            {
              key: "31",
              icon: <CaretRightOutlined />,
              pageName: "assign-lawyers",
              path: "manage-data/assign-lawyers",
              label: "1. มอบหมายงาน",
            },

            {
              key: "32",
              icon: <CaretRightOutlined />,
              pageName: "create-notice",
              path: "notice/create-notice",
              label: "2. ออกโนติส",
            },
            {
              key: "33",
              icon: <CaretRightOutlined />,
              pageName: "reply-notice",
              path: "notice/reply-notice",
              label: "3. ตอบกลับโนติส",
            },
            {
              key: "34",
              icon: <CaretRightOutlined />,
              pageName: "create-notice-ems",
              path: "notice/create-notice-ems",
              label: "2. สร้างโนติส EMS",
            },
            {
              key: "35",
              icon: <CaretRightOutlined />,
              pageName: "reply-notice-ems",
              path: "notice/reply-notice-ems",
              label: "3. ตอบกลับโนติส EMS",
            },
          ],
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3"
      ? {
          key: "4",
          pageName: "lawsuit",
          label: "lawsuit",
          path: "/lawsuit",
          icon: <FormOutlined />,
          title: "ส่วนฟ้อง",
          children: [
            {
              key: "41",
              icon: <CaretRightOutlined />,
              pageName: "create-lawsuit",
              path: "lawsuit/pre-lawsuit-filed",
              label: "1. สร้างคำฟ้อง",
            },
            {
              key: "42",
              icon: <CaretRightOutlined />,
              pageName: "lawsuit-advane-patment",
              path: "lawsuit/advane-payment",
              label: "2. เบิกเงินทดรองจ่าย",
            },
            {
              key: "43",
              icon: <CaretRightOutlined />,
              pageName: "lawsuit-clear-advane-patment",
              path: "lawsuit/clear-advane-payment",
              label: "3. เคลียร์เงินทดรองจ่าย",
            },
            {
              key: "44",
              icon: <CaretRightOutlined />,
              pageName: "lawsuit-import-old-data",
              path: "lawsuit/import-old-data",
              label: "นำเข้าสัญญาส่วนฟ้อง",
            },
          ],
        }
      : null,
    ROLE_ID === "1" ||
    ROLE_ID === "2" ||
    ROLE_ID === "3" ||
    ROLE_ID === "4" ||
    ROLE_ID === "7"
      ? {
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
              pageName: "create-invitigate-assets",
              path: "investigate-assets/create-invitigate-assets",
              label: "1. สืบทรัพย์",
            },
            {
              key: "52",
              icon: <CaretRightOutlined />,
              pageName: "estimate-assets",
              path: "investigate-assets/estimate-assets",
              label: "2. ประเมินทรัพย์",
            },
            {
              key: "53",
              icon: <CaretRightOutlined />,
              pageName: "assets-found",
              path: "investigate-assets/assets-found",
              label: "3. ทรัพย์สินที่พบ",
            },
          ],
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3"
      ? {
          key: "6",
          pageName: "awaiting-judgment",
          label: "awaiting-judgment",
          path: "/awaiting-judgment",
          icon: <FontAwesomeIcon icon={faScaleBalanced} />,
          title: "ชั้นศาล",
          children: [
            {
              key: "61",
              icon: <CaretRightOutlined />,
              pageName: "awaiting-judgment",
              path: "court/awaiting-judgment",
              label: "1. พิพากษา",
            },
            {
              key: "62",
              icon: <CaretRightOutlined />,
              pageName: "judgement",
              path: "court/judgement",
              label: "2. หมายคดีตั้ง",
            },
            {
              key: "63",
              icon: <CaretRightOutlined />,
              pageName: "adjudge",
              path: "court/case-is-final",
              label: "3. คดีถึงที่สุด",
            },
            // {
            //   key: "64",
            //   icon: <CaretRightOutlined />,
            //   pageName: "report-court",
            //   path: "court/report-court",
            //   label: "รายงาน",
            // },
          ],
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3" || ROLE_ID === "4"
      ? {
          key: "7",
          pageName: "negotiate",
          label: "negotiate",
          path: "/negotiate",
          icon: <ScheduleOutlined />,
          title: "เจรจาทรัพย์",
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3" || ROLE_ID === "4"
      ? {
          key: "8",
          pageName: "debt-payment",
          label: "debt-payment",
          path: "/debt-payment",
          icon: <FontAwesomeIcon icon={faFileSignature} />,
          title: "ทำยอม/รีสัญญา",
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3"
      ? {
          key: "9",
          pageName: "send-to-enforcement",
          label: "enforcement",
          path: "/enforcement",
          icon: <FontAwesomeIcon icon={faGavel} />,
          title: "ส่วนบังคับคดี",
          children: [
            {
              key: "91",
              icon: <CaretRightOutlined />,
              pageName: "send-to-enforcement",
              path: "enforcement/send-to-enforcement",
              label: "1. เคสบังคับคดี",
            },
            {
              key: "92",
              icon: <CaretRightOutlined />,
              pageName: "import-lawsuit-data",
              path: "enforcement/import-lawsuit-data",
              label: "นำเข้าสัญญาบังคับคดี",
            },
          ],
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3" || ROLE_ID === "4"
      ? {
          key: "10",
          pageName: "sale-announcement",
          label: "sale-announcement",
          path: "/sale-announcement",
          icon: <NotificationOutlined />,
          title: "ประกาศขายทรัพย์",
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3"
      ? {
          key: "11",
          pageName: "final-case",
          label: "final-case",
          path: "/final-case",
          icon: <CheckOutlined />,
          title: "คดีสิ้นสุด",
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "6" || ROLE_ID === "5"
      ? {
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
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "6" || ROLE_ID === "5"
      ? {
          key: "16",
          pageName: "charge-indict",
          label: "charge-indict",
          path: "/charge-indict",
          icon: <WalletOutlined />,
          title: "เบิกเงินทดรองจ่าย",
          children: [
            {
              key: "161",
              icon: <CaretRightOutlined />,
              pageName: "advane-pay",
              path: "charge-indict/advane-pay",
              label: "1. ค่าฤชาส่วนคำฟ้อง",
            },
            {
              key: "162",
              icon: <CaretRightOutlined />,
              pageName: "clear-advane-pay",
              path: "charge-indict/clear-advane-pay",
              label: "2. การเงินตรวจสอบจ่ายจริง",
            },
            // {
            //   key: "163",
            //   icon: <CaretRightOutlined />,
            //   pageName: "approved-clear-advane-pay",
            //   path: "charge-indict/approved-clear-advane-pay",
            //   label: "บัญชีตรวจสอบจ่ายจริง",
            // },
          ],
        }
      : null,

    // {
    //   key: "16",
    //   pageName: "disbursement",
    //   label: "disbursement",
    //   path: "/disbursement",
    //   icon: <WalletOutlined />,
    //   title: "งบเบิกจ่าย",
    //   children: [
    //     {
    //       key: "161",
    //       icon: <CaretRightOutlined />,
    //       pageName: "disbursement",
    //       path: "disbursement/indict-charge",
    //       label: "ค่าฤชาส่วนฟ้อง",
    //     },
    //   ],
    // },
    // {
    //   key: "13",
    //   pageName: "bad-debt",
    //   label: "bad-debt",
    //   path: "/bad-debt",
    //   icon: <UsergroupAddOutlined />,
    //   title: "ลูกหนี้สูญ",
    // },
    ROLE_ID === "1" || ROLE_ID === "2"
      ? {
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
              pageName: "change-lawyers-jobs",
              path: "manage-data/change-lawyers-jobs",
              label: "เปลี่ยนทนาย",
            },
          ],
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "5"
      ? {
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
              path: "report/terminate",
              label: "รายงาน บอกเลิกสัญญา",
            },
            {
              key: "142",
              icon: <CaretRightOutlined />,
              pageName: "notice",
              path: "report/notice",
              label: "รายงาน โนติส",
            },
          ],
        }
      : null,
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
  ].filter(Boolean);

  const handleClick = (value) => {
    // console.log(value);
    loadData();
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

  useEffect(() => {
    console.log("check token");

    loadData();
  }, []);

  const loadData = async () => {
    await axios
      .get(baseUrl + GET_COMPANIES_LIST, { headers: HEADERS_EXPORT })
      .then(async (res) => {
        console.log("check token =>", res.status);

        if (res.status === 401 || res.status === 403) {
          message.error("หมดเวลาเข้าระบบ");
          signOut();
        }
      })
      .catch((err) => {
        console.log("ไม่มี ข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
        message.error("หมดเวลาเข้าระบบ");
        signOut();
      });
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
