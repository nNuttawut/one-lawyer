import { Menu, message } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  FormOutlined,
  SearchOutlined,
  FileSearchOutlined,
  NotificationOutlined,
  BookOutlined,
  ScheduleOutlined,
  ImportOutlined,
  CaretRightOutlined,
  DollarOutlined,
  CheckOutlined,
  FileTextOutlined,
  WalletOutlined,
  FileExcelOutlined,
  CloseOutlined,
  FieldTimeOutlined,
  CalendarOutlined,
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
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const menuList = [
    ROLE_ID !== "3"
      ? {
          key: "1",
          pageName: "dashboard",
          label: "dashboard",
          path: "/",
          icon: <HomeOutlined />,
          title: "หน้าแรก",
        }
      : {
          key: "1.1",
          icon: <CalendarOutlined />,
          pageName: "appointment-lawsuit",
          path: "lawsuit/appointment-lawsuit",
          label: "ตารางนัดศาล",
          title: "ตารางนัดศาล",
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
          items: [
            {
              key: "2.1",
              icon: <CaretRightOutlined />,
              pageName: "create-terminate-Contract",
              path: "terminate-contract/create-terminate-Contract",
              label: "1. ออกบอกเลิกสัญญา",
            },
            {
              key: "2.2",
              icon: <CaretRightOutlined />,
              pageName: "create-terminate-Contract",
              path: "terminate-contract/import-terminate-Contract-ems",
              label: "2. นำเข้าข้อมูล EMS",
            },
            {
              key: "2.3",
              icon: <CaretRightOutlined />,
              pageName: "reply-terminate-Contract",
              path: "terminate-contract/reply-terminate-Contract",
              label: "3. ตอบกลับบอกเลิกสัญญา",
            },
            {
              key: "2.4",
              icon: <CaretRightOutlined />,
              pageName: "terminate-Contract-to-lawsuit",
              path: "terminate-contract/terminate-Contract-to-lawsuit",
              label: "4. สัญญาเตรียมส่งฟ้อง",
            },
            {
              key: "2.5",
              icon: <CaretRightOutlined />,
              pageName: "terminate-Contract-chart",
              path: "terminate-contract/terminate-Contract-chart",
              label: "5. รายงาน",
            },
          ],
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "2"
      ? {
          key: "3",
          pageName: "terminate",
          label: "terminate-contract-hand",
          path: "/terminate-contract-hand",
          icon: <FileExcelOutlined />,
          title: "บอกเลิกสัญญา(มือ)",
          items: [
            {
              key: "3.1",
              icon: <CaretRightOutlined />,
              pageName: "terminate-contract-hand-Contract",
              path: "terminate-contract-hand/create-terminate-Contract",
              label: "1. ออกบอกเลิกสัญญา",
            },
            {
              key: "3.2",
              icon: <CaretRightOutlined />,
              pageName: "terminate-contract-hand-Contract",
              path: "terminate-contract-hand/import-terminate-Contract-ems",
              label: "2. นำเข้าข้อมูล EMS",
            },
            {
              key: "3.3",
              icon: <CaretRightOutlined />,
              pageName: "terminate-contract-hand-Contract",
              path: "terminate-contract-hand/reply-terminate-Contract",
              label: "3. ตอบกลับบอกเลิกสัญญา",
            },
            {
              key: "3.4",
              icon: <CaretRightOutlined />,
              pageName: "terminate-contract-hand-to-lawsuit",
              path: "terminate-contract-hand/terminate-Contract-to-lawsuit",
              label: "4. สัญญาเตรียมส่งฟ้อง",
            },
            {
              key: "3.5",
              icon: <CaretRightOutlined />,
              pageName: "terminate-contract-hand-chart",
              path: "terminate-contract-hand/terminate-Contract-chart",
              label: "5. รายงาน",
            },
          ],
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "2"
      ? {
          key: "4",
          pageName: "terminate",
          label: "terminate-contract-repurchase",
          path: "/terminate-contract-repurchase",
          icon: <FileExcelOutlined />,
          title: "หนังสือแจ้งสิทธ์ซื้อรถคืน",
          items: [
            {
              key: "4.1",
              icon: <CaretRightOutlined />,
              pageName: "create-terminate-Contract",
              path: "terminate-contract-repurchase/create-terminate-Contract",
              label: "1. ออกหนังสือแจ้งสิทธ์",
            },
            {
              key: "4.2",
              icon: <CaretRightOutlined />,
              pageName: "create-terminate-Contract",
              path: "terminate-contract-repurchase/import-terminate-Contract-ems",
              label: "2. นำเข้าข้อมูล EMS",
            },
            {
              key: "4.3",
              icon: <CaretRightOutlined />,
              pageName: "reply-terminate-Contract",
              path: "terminate-contract-repurchase/reply-terminate-Contract",
              label: "3. ตอบกลับหนังสือแจ้งสิทธ์",
            },
            {
              key: "4.4",
              icon: <CaretRightOutlined />,
              pageName: "terminate-Contract-to-lawsuit",
              path: "terminate-contract-repurchase/terminate-Contract-to-lawsuit",
              label: "4. สัญญาเตรียมส่งฟ้อง",
            },
            {
              key: "4.5",
              icon: <CaretRightOutlined />,
              pageName: "terminate-Contract-chart",
              path: "terminate-contract-repurchase/terminate-Contract-chart",
              label: "5. รายงาน",
            },
          ],
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "2"
      ? {
          key: "44",
          pageName: "terminate",
          label: "terminate-contract-land",
          path: "/terminate-contract-land",
          icon: <FileExcelOutlined />,
          title: "หนังสือบอกเลิกที่ดิน",
          items: [
            {
              key: "44.1",
              icon: <CaretRightOutlined />,
              pageName: "create-terminate-Contract",
              path: "terminate-contract-land/create-terminate-Contract",
              label: "1. ออกหนังสือบอกเลิก",
            },
            {
              key: "44.2",
              icon: <CaretRightOutlined />,
              pageName: "create-terminate-Contract",
              path: "terminate-contract-land/import-terminate-Contract-ems",
              label: "2. นำเข้าข้อมูล EMS",
            },
            {
              key: "44.3",
              icon: <CaretRightOutlined />,
              pageName: "reply-terminate-Contract",
              path: "terminate-contract-land/reply-terminate-Contract",
              label: "3. ตอบกลับบอกเลิก",
            },
            {
              key: "44.4",
              icon: <CaretRightOutlined />,
              pageName: "terminate-Contract-to-lawsuit",
              path: "terminate-contract-land/terminate-Contract-to-lawsuit",
              label: "4. สัญญาเตรียมส่งฟ้อง",
            },
            {
              key: "44.5",
              icon: <CaretRightOutlined />,
              pageName: "terminate-Contract-chart",
              path: "terminate-contract-land/terminate-Contract-chart",
              label: "5. รายงาน",
            },
          ],
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "3"
      ? {
          key: "5",
          pageName: "terminate",
          label: "terminate-contract",
          path: "/terminate-contract",
          icon: <FileExcelOutlined />,
          title: "บอกเลิกสัญญา",
          items: [
            {
              key: "5.1",
              icon: <CaretRightOutlined />,
              pageName: "terminate-Contract-to-lawsuit",
              path: "terminate-contract/terminate-Contract-to-lawsuit",
              label: "สัญญาเตรียมส่งฟ้อง",
            },
          ],
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "2"
      ? {
          key: "6",
          pageName: "notice",
          label: "notice",
          path: "/notice",
          icon: <FileExcelOutlined />,
          title: "ออก notice",
          items: [
            {
              key: "6.1",
              icon: <CaretRightOutlined />,
              pageName: "assign-lawyers",
              path: "manage-data/assign-lawyers",
              label: "1. มอบหมายงาน",
            },

            {
              key: "6.2",
              icon: <CaretRightOutlined />,
              pageName: "create-notice",
              path: "notice/create-notice",
              label: "2. ออกโนติส",
            },
            {
              key: "6.3",
              icon: <CaretRightOutlined />,
              pageName: "reply-notice",
              path: "notice/reply-notice",
              label: "3. ตอบกลับโนติส",
            },
            {
              key: "6.4",
              icon: <CaretRightOutlined />,
              pageName: "create-notice-ems",
              path: "notice/create-notice-ems",
              label: "2. สร้างโนติส EMS",
            },
            {
              key: "6.5",
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
          key: "7",
          pageName: "lawsuit",
          label: "lawsuit",
          path: "/lawsuit",
          icon: <FormOutlined />,
          title: "ส่วนฟ้อง",
          items: [
            {
              key: "7.1",
              icon: <CaretRightOutlined />,
              pageName: "create-lawsuit",
              path: "lawsuit/pre-lawsuit-filed",
              label: "1. สร้างคำฟ้อง",
            },
            {
              key: "7.2",
              icon: <CaretRightOutlined />,
              pageName: "lawsuit-advane-patment",
              path: "lawsuit/advane-payment",
              label: "2. เบิกเงินทดรองจ่าย",
            },
            {
              key: "7.3",
              icon: <CaretRightOutlined />,
              pageName: "lawsuit-clear-advane-patment",
              path: "lawsuit/clear-advane-payment",
              label: "3. เคลียร์เงินทดรองจ่าย",
            },
            {
              key: "7.4",
              icon: <CaretRightOutlined />,
              pageName: "lawsuit-import-old-data",
              path: "lawsuit/import-old-data",
              label: "นำเข้าสัญญาส่วนฟ้อง",
            },
            {
              key: "7.5",
              icon: <CaretRightOutlined />,
              pageName: "appointment-lawsuit",
              path: "lawsuit/appointment-lawsuit",
              label: "ตารางนัดศาล",
            },
          ],
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3"
      ? {
          key: "8",
          pageName: "awaiting-judgment",
          label: "awaiting-judgment",
          path: "/awaiting-judgment",
          icon: <FontAwesomeIcon icon={faScaleBalanced} />,
          title: "ชั้นศาล",
          items: [
            {
              key: "8.1",
              icon: <CaretRightOutlined />,
              pageName: "awaiting-judgment",
              path: "court/awaiting-judgment",
              label: "1. พิพากษา",
            },
            {
              key: "8.2",
              icon: <CaretRightOutlined />,
              pageName: "judgement",
              path: "court/judgement",
              label: "2. หมายคดีตั้ง",
            },
            {
              key: "8.3",
              icon: <CaretRightOutlined />,
              pageName: "adjudge",
              path: "court/case-is-final",
              label: "3. คดีถึงที่สุด",
            },
            {
              key: "8.4",
              icon: <CaretRightOutlined />,
              pageName: "court-advane-payment",
              path: "court/advane-payment",
              label: "4. เบิกเงินทดรอง",
            },
            {
              key: "8.5",
              icon: <CaretRightOutlined />,
              pageName: "court-clear-advane-payment",
              path: "court/clear-advane-payment",
              label: "5. เคลียร์เงินทดรอง",
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
          key: "9",
          pageName: "investigate-assets",
          label: "investigate-assets",
          path: "/investigate-assets",
          icon: <SearchOutlined />,
          title: "สืบทรัพย์ลูกหนี้",
          items: [
            {
              key: "9.1",
              icon: <CaretRightOutlined />,
              pageName: "create-invitigate-assets",
              path: "investigate-assets/create-invitigate-assets",
              label: "1. สืบทรัพย์",
            },
            {
              key: "9.2",
              icon: <CaretRightOutlined />,
              pageName: "estimate-assets",
              path: "investigate-assets/estimate-assets",
              label: "2. ประเมินทรัพย์",
            },
            {
              key: "9.3",
              icon: <CaretRightOutlined />,
              pageName: "assets-found",
              path: "investigate-assets/assets-found",
              label: "3. ทรัพย์สินที่พบ",
            },
            {
              key: "9.4",
              icon: <CaretRightOutlined />,
              pageName: "assets-found",
              path: "investigate-assets/advane-payment-assets-found",
              label: "4. เบิกทดรองสืบทรัพย์",
            },
            {
              key: "9.5",
              icon: <CaretRightOutlined />,
              pageName: "assets-found",
              path: "investigate-assets/clear-advane-payment-assets-found",
              label: "5. เคลียร์ทดรองสืบทรัพย์",
            },
          ],
        }
      : null,

    ROLE_ID === "1" ||
    ROLE_ID === "2" ||
    ROLE_ID === "3" ||
    ROLE_ID === "4" ||
    ROLE_ID === "9"
      ? {
          key: "10",
          pageName: "enforcement",
          label: "enforcement",
          path: "/enforcement",
          icon: <FontAwesomeIcon icon={faGavel} />,
          title: "ส่วนบังคับคดี",
          items: [
            {
              key: "10.1",
              icon: <CaretRightOutlined />,
              pageName: "create-enforcement",
              path: "enforcement/send-to-enforcement",
              label: "1. สร้างรายงานการยึด",
            },
            // {
            //   key: "10.2",
            //   icon: <CaretRightOutlined />,
            //   pageName: "send-to-enforcement",
            //   path: "enforcement/send-to-enforcement",
            //   label: "2. บันทึกยึดทรัพย์",
            // },
            {
              key: "10.3",
              icon: <CaretRightOutlined />,
              pageName: "enforcement-advane-payment",
              path: "enforcement/advane-payment",
              label: "2. เบิกเงินทดรอง",
            },
            {
              key: "10.4",
              icon: <CaretRightOutlined />,
              pageName: "enforcement-clear-advane-payment",
              path: "enforcement/clear-advane-payment",
              label: "3. เคลียร์เงินทดรอง",
            },
            {
              key: "10.5",
              icon: <CaretRightOutlined />,
              pageName: "import-lawsuit-data",
              path: "enforcement/import-lawsuit-data",
              label: "นำเข้าคำพิพากษา",
            },
            {
              key: "10.6",
              icon: <CaretRightOutlined />,
              pageName: "import-data",
              path: "manage-data/import-data",
              label: "นำข้อมูลเข้า",
            },
          ],
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3" || ROLE_ID === "4"
      ? {
          key: "11",
          pageName: "debt-payment",
          label: "debt-payment",
          path: "/debt-payment",
          icon: <FontAwesomeIcon icon={faFileSignature} />,
          title: "ทำยอม/รีสัญญา",
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3" || ROLE_ID === "4"
      ? {
          key: "12",
          pageName: "sale-announcement",
          label: "sale-announcement",
          path: "/sale-announcement",
          icon: <NotificationOutlined />,
          title: "ประกาศขายทรัพย์",
          items: [
            {
              key: "12.1",
              icon: <CaretRightOutlined />,
              pageName: "report-sale",
              path: "sale-announcement/report-sale",
              label: "1. บันทึกประกาศขายทรัพย์",
            },
            {
              key: "12.2",
              icon: <CaretRightOutlined />,
              pageName: "report-average",
              path: "sale-announcement/report-average",
              label: "2. บันทึกขอเฉลียทรัพย์",
            },
          ],
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3" || ROLE_ID === "4"
      ? {
          key: "13",
          pageName: "negotiate",
          label: "negotiate",
          path: "/negotiate",
          icon: <ScheduleOutlined />,
          title: "เจรจาทรัพย์",
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3"
      ? {
          key: "14",
          pageName: "final-case",
          label: "final-case",
          path: "/final-case",
          icon: <CheckOutlined />,
          title: "ปิดบัญชี",
        }
      : null,
    ROLE_ID === "1" || ROLE_ID === "3" || ROLE_ID === "2"
      ? {
          key: "15",
          pageName: "withdraw-case",
          label: "withdraw-case",
          path: "/withdraw-case",
          icon: <BookOutlined />,
          title: "ถอนฟ้อง",
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "3" || ROLE_ID === "2"
      ? {
          key: "16",
          pageName: "timeout-case",
          label: "timeout-case",
          path: "/timeout-case",
          icon: <FieldTimeOutlined />,
          title: "หมดอายุความ",
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "3" || ROLE_ID === "2"
      ? {
          key: "17",
          pageName: "bad-debt",
          label: "bad-debt",
          path: "/bad-debt",
          icon: <CloseOutlined />,
          title: "ลูกหนี้สูญ",
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "3" || ROLE_ID === "2" || ROLE_ID === "8"
      ? {
          key: "18",
          pageName: "contract-detail",
          label: "contract-detail",
          path: "/contract-detail",
          icon: <FileSearchOutlined />,
          title: "ข้อมูลสัญญา",
          items: [
            {
              key: "18.1",
              icon: <CaretRightOutlined />,
              pageName: "import-data",
              path: "contract-detail/detail-payment",
              label: "ตรวจสอบข้อมูลสัญญา",
            },
          ],
        }
      : null,
    // ROLE_ID === "1" || ROLE_ID === "3" || ROLE_ID === "4"
    //   ? {
    //       key: "25",
    //       pageName: "disbursement",
    //       label: "disbursement",
    //       path: "/disbursement",
    //       icon: <WalletOutlined />,
    //       title: "เบิกอื่น ๆ",
    //       items: [
    //         {
    //           key: "25.2",
    //           icon: <CaretRightOutlined />,
    //           pageName: "disbursement-advane-payment",
    //           path: "disbursement/advane-payment",
    //           label: "1. เบิกเงินทดรอง",
    //         },
    //         {
    //           key: "25.3",
    //           icon: <CaretRightOutlined />,
    //           pageName: "disbursement-clear-advane-payment",
    //           path: "disbursement/clear-advane-payment",
    //           label: "2. เคลียร์เงินทดรอง",
    //         },
    //       ],
    //     }
    //   : null,

    ROLE_ID === "1" || ROLE_ID === "2"
      ? {
          key: "19",
          pageName: "import",
          label: "manage-data",
          path: "/manage-data",
          icon: <ImportOutlined />,
          title: "จัดการข้อมูล",
          items: [
            {
              key: "19.1",
              icon: <CaretRightOutlined />,
              pageName: "import-data",
              path: "manage-data/import-data",
              label: "นำข้อมูลเข้า",
            },
            // {
            //   key: "19.2",
            //   icon: <CaretRightOutlined />,
            //   pageName: "assign-lawyers",
            //   path: "manage-data/assign-lawyers",
            //   label: "มอบหมายงานทนาย",
            // },
            {
              key: "19.3",
              icon: <CaretRightOutlined />,
              pageName: "change-lawyers-jobs",
              path: "manage-data/change-lawyers-jobs",
              label: "เปลี่ยนทนาย",
            },
            // {
            //   key: "19.4",
            //   icon: <CaretRightOutlined />,
            //   pageName: "assign-asset",
            //   path: "manage-data/assign-asset",
            //   label: "มอบหมายงานสืบ",
            // },
          ],
        }
      : null,

    // ค่าคอมมิชชั่นทนาย
    ROLE_ID === "1" || (ROLE_ID === "2" && userId === 4)
      ? {
          key: "20",
          pageName: "commission",
          label: "commission",
          path: "/commission",
          icon: <DollarOutlined />,
          title: "คอมมิชชั่นทนาย",
          items: [
            {
              key: "20.1",
              icon: <CaretRightOutlined />,
              pageName: "commission-law",
              path: "commission/commission-law",
              label: "คดีในชั้นศาล",
            },
            // {
            //   key: "20.2",
            //   icon: <CaretRightOutlined />,
            //   pageName: "commission-investigate",
            //   path: "commission/commission-investigate",
            //   label: "ค่าคอมมิชชั่นสืบทรัพย์",
            // },
          ],
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "6" || userId === 4
      ? {
          key: "21",
          pageName: "charge-indict",
          label: "charge-indict",
          path: "/charge-indict",
          icon: <WalletOutlined />,
          title: "เบิกเงินทดรองจ่าย",
          items: [
            {
              key: "21.1",
              icon: <CaretRightOutlined />,
              pageName: "advane-pay",
              path: "charge-indict/advane-pay",
              label: "1. เบิกเงินทดรองจ่าย",
            },
            {
              key: "21.2",
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

    // การเงินเบน
    ROLE_ID === "1" || ROLE_ID === "6"
      ? {
          key: "22",
          pageName: "closing-balance",
          label: "closing-balance",
          path: "/closing-balance",
          icon: <DollarOutlined />,
          title: "การเงิน",
          items: [
            {
              key: "22.1",
              icon: <CaretRightOutlined />,
              pageName: "request-closing-balance",
              path: "closing-balance/request-closing-balance",
              label: "ขอยอดปิด",
            },
          ],
        }
      : null,

    ROLE_ID === "1" || ROLE_ID === "5"
      ? {
          key: "23",
          pageName: "report",
          label: "report",
          path: "/report",
          icon: <FileTextOutlined />,
          title: "รายงาน",
          items: [
            {
              key: "23.1",
              icon: <CaretRightOutlined />,
              pageName: "notice",
              path: "report/chart-terminate",
              label: "สรุปบอกเลิกสัญญา",
            },
            // {
            //   key: "142",
            //   icon: <CaretRightOutlined />,
            //   pageName: "notice",
            //   path: "report/terminate",
            //   label: "รายงาน บอกเลิกสัญญา",
            // },
            // {
            //   key: "143",
            //   icon: <CaretRightOutlined />,
            //   pageName: "notice",
            //   path: "report/terminate-hand",
            //   label: "รายงาน บอกเลิกสัญญา(มือ)",
            // },
            // {
            //   key: "142",
            //   icon: <CaretRightOutlined />,
            //   pageName: "notice",
            //   path: "report/notice",
            //   label: "รายงาน โนติส",
            // },
          ],
        }
      : null,

    {
      key: "24",
      pageName: "import",
      label: "guidbook",
      path: "/guidbook",
      icon: <BookOutlined />,
      title: "คู่มือ",
      items: [
        {
          key: "24.1",
          icon: <CaretRightOutlined />,
          pageName: "read-text",
          path: "guidbook/read-text",
          label: "วิธีแปลงรูปภาพเป็นตัวหนังสือ",
        },
        {
          key: "24.2",
          icon: <CaretRightOutlined />,
          pageName: "resize",
          path: "guidbook/resize",
          label: "ลดขนาด รูปภาพ/ไฟล์",
        },
        {
          key: "24.3",
          icon: <CaretRightOutlined />,
          pageName: "contno",
          path: "guidbook/contno",
          label: "สร้างอัพเดทสัญญา",
        },
      ],
    },
  ].filter(Boolean);

  const handleClick = (value) => {
    loadData();
    onClick(value);
  };

  const handleOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const renderMenuItem = (item) => {
    return item.items ? (
      <Menu.SubMenu
        key={item.key}
        title={<span className="label">{item.title}</span>}
        icon={
          <div>
            <span className="icon">{item.icon}</span>
          </div>
        }
      >
        {item.items.map((child) => (
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
