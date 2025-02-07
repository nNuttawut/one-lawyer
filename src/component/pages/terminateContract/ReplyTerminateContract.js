import {
  Col,
  Row,
  Space,
  Table,
  Tag,
  DatePicker,
  Card,
  Button,
  message,
  Spin,
  Select,
  Tooltip,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useMemo, useState } from "react";
import { EditOutlined, PrinterOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_CANCEL,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
} from "../../API/apiUrls";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

//use redux
import axios from "axios";
import {
  NOTICE,
  STATUS_PROCESS_PROCESS,
  STATUS_PROCESS_SUCCESSFUL,
  STATUS_PROCESS_UNSUCCESSFUL,
} from "../../../utils/constant/StatusConstant";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import CurrencyFormat from "../../../hook/CurrencyFormat";
import UpdateReplyEms from "./modal/UpdateReplyEms";

const Main = () => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [isModal, setIsModal] = useState(false);
  const [isModalUpdateEms, setIsModalUpdateEms] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [selectCallback, setSelectCallback] = useState("all");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [searchEdit, setSearchEdit] = useState(null);
  const [arrow, setArrow] = useState("Show");

  const optionSelectCallback = [
    { value: "all", label: "ทั้งหมด" },
    { value: 1, label: "รอดำเนินการ" },
    { value: 2, label: "ตอบกลับ" },
    { value: 3, label: "ยังไม่ตอบกลับ" },
  ];

  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(baseUrl + GET_CANCEL, {
        headers: HEADERS_EXPORT,
      });
      if (response.data) {
        if (response.data) {
          console.log(response.data);

          filterDataLawyer(mergeDataWithGuarantors(response.data));
          // setSearchEdit(response.data);
          setLoading(false);
        }
      } else {
        setArrayTable([]);
      }
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      message.error(`ไม่พบข้อมูล`);
    }
  };

  const mergeDataWithGuarantors = (data) => {
    console.log("mergeDataWithGuarantors");
    const preData = data.reduce((acc, record, index) => {
      // ข้อมูลจาก parcel_list ที่ต้องการแปลงเป็น record ใหม่
      const parcelData = (record.parcel_list || []).map((parcel) => ({
        ...parcel,
        contract_no: record.contract_no, // นำ contract_no ของ record ปัจจุบันมาใส่ใน parcel
      }));
      // รวมข้อมูลที่แปลงแล้วเข้ากับ accumulator
      return [...acc, ...parcelData];
    }, []);

    const sortedData = preData.sort((a, b) => {
      if (a.contract_no === b.contract_no) {
        // หาก contract_no เหมือนกัน ให้เรียงตาม customer_type_id
        return a.customer_type_id - b.customer_type_id;
      }
      // หาก contract_no ไม่เหมือนกัน ให้เรียงตาม contract_no
      return a.contract_no.localeCompare(b.contract_no);
    });
    let i = 1;
    return sortedData.map((item) => ({
      ...item,
      key: i++,
    }));

    // setArrayTable(newData);
    // setDataArr(newData);
    // setTableLength(newData.length);
    // console.log("preData", newData);
  };

  const filterDataLawyer = (data) => {
    console.log("item.LAWYER_ID", data);
    console.log("userId.id ", userId);

    if (Array.isArray(data)) {
      const newData = data.filter(
        (item) =>
          item.LAWYER_ID === userId || ROLE_ID === "1" || ROLE_ID === "2"
      );
      function containsNumber(str) {
        return /\d/.test(str); // เช็คว่า str เป็นตัวเลขทั้งหมด
      }

      function isEnglishOnly(str) {
        return /^[A-Za-z]+$/.test(str); // เช็คว่า str เป็นตัวอักษรภาษาอังกฤษทั้งหมด
      }

      let filteredData;

      if (userCompany === "3") {
        filteredData = newData.filter((item) => {
          const containsEng = item.contract_no.substring(0, 1) === "4";
          // ถ้า 2 เป็นภาษาอังกฤษทั้งหมด
          if (isEnglishOnly(item.contract_no.substring(0, 2)) || containsEng) {
            return item;
          } else {
            return false;
          }
        });
      } else {
        filteredData = newData.filter((item) => {
          const containsNo = containsNumber(item.contract_no.substring(0, 2)); // ตรวจสอบว่า 2 ตัวแรกมีตัวเลขไหม
          const containsEng = item.contract_no.substring(0, 1) === "4";
          // ถ้า 2 ตัวแรกไม่ใช่ตัวเลข และไม่ได้เป็นภาษาอังกฤษทั้งหมด
          if (containsNo && !containsEng) {
            return item; // เก็บ item นี้ไว้
          } else {
            return false; // ไม่เก็บ item นี้ (กรณีเป็นภาษาอังกฤษทั้งหมด หรือมีตัวเลขใน 2 ตัวแรก)
          }
        });
      }

      setArrayTable(filteredData);
      setDataArr(filteredData);
      setTableLength(filteredData.length);
      // console.log("newData", filteredData);
      // console.log("Length of filtered data:", filteredData.length);
    } else {
      console.error("data is not an array or is undefined");
      setTableLength(0);
    }
  };

  const onExpand = (expanded, record) => {
    if (expanded) {
      // เมื่อแถวถูกขยาย, ให้เพิ่ม key ของแถวนั้นลงใน expandedRowKeys
      setExpandedRowKeys([record.key]);
    } else {
      // เมื่อแถวถูกยุบ, ให้ลบ key ของแถวนั้นออกจาก expandedRowKeys
      setExpandedRowKeys([]);
    }
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter(
      (item) =>
        (item.contract_no && item.contract_no.includes(value)) ||
        (item.customer_fullname && item.customer_fullname.includes(value)) ||
        (item.register_no && item.register_no.includes(value)) ||
        (item.parcel_no && item.parcel_no.includes(value))
    );
    console.log("ssdss", value.length);

    if (value.length === 13 && result.length > 0) {
      console.log("ssdss--->", value.length);
      setIsModalUpdateEms(true);
      setDataModal(result[0]);
      console.log("result---->", result);
    }
    if (value) {
      setArrayTable(result);
    } else {
      setArrayTable(dataArr);
    }
  };

  const onSearchByDate = (startDate) => {
    console.log(startDate);

    let selectData;
    if (selectCallback === 2) {
      selectData = dataArr.filter(
        (item) => item.status === 1 || item.status === 2
      );
    } else if (selectCallback === 3) {
      selectData = dataArr.filter((item) => item.status === selectCallback);
    } else if (selectCallback === 1) {
      selectData = dataArr.filter((item) => !item.status);
    } else {
      selectData = dataArr;
    }

    if (startDate) {
      const selectSearch = selectData.filter(
        (item) =>
          item.datetime.includes(dayjs(startDate).format("YYYY-MM-DD")) &&
          selectCallback
      );
      console.log(dayjs(startDate).format("YYYY-MM-DD"));

      console.log(selectSearch);

      setArrayTable(selectSearch);
    } else {
      setArrayTable(selectData);
    }
  };

  const handleUpdateData = (data) => {
    console.log("data---->update", data); // ข้อมูลที่ต้องการอัปเดต
    if (data) {
      // ใช้ .map เพื่อสร้าง array ใหม่ โดยเปรียบเทียบ id
      const updatedDataArr = dataArr.map(
        (item) => (item.id === data.id ? { ...data } : { ...item }) // ถ้า id ตรงกัน อัปเดตข้อมูล, ถ้าไม่ตรง คงเดิม
      );

      console.log("updatedDataArr", updatedDataArr);

      // อัปเดต state ของ dataArr ด้วยข้อมูลใหม่
      setDataArr(updatedDataArr);

      if (selectCallback === "all") {
        console.log("all");

        setArrayTable(updatedDataArr); // อัปเดตตารางด้วยข้อมูลใหม่ทั้งหมด
      } else {
        let callback = null;
        let callback2 = null;
        if (selectCallback === 1) {
          callback = null;
        } else if (selectCallback === 2) {
          callback = 1;
          callback2 = 2;
        } else {
          callback = 3;
        }
        console.log("no all");
        // ถ้า selectCallback ไม่ใช่ "all" (ในส่วนที่คอมเมนต์ไว้)
        // สามารถกรองข้อมูลตามเงื่อนไข และอัปเดต arrayTable ได้
        const arr = updatedDataArr.filter(
          (item) => item.status === callback || item.status === callback2
        );
        setArrayTable(arr);
      }
    } else {
      // ถ้าไม่มี data ที่ส่งมา เรียก loadData เพื่อโหลดข้อมูลใหม่
      loadData();
      console.log("handleUpdateData loadData");
    }
  };

  const handleChangeSelect = (value) => {
    console.log(`selected ${value}`);
    setSelectCallback(value);
    let selectData;
    if (value === 2) {
      selectData = dataArr.filter(
        (item) => item.status === 1 || item.status === 2
      );
    } else if (value === 3) {
      selectData = dataArr.filter((item) => item.status === value);
    } else if (value === 1) {
      selectData = dataArr.filter((item) => !item.status);
    } else {
      selectData = dataArr;
    }

    setArrayTable(selectData);
    setTableLength(selectData.length);
  };

  //ทำ render record ของตาราถ้าใช้ logic เยอะ
  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record.created_date) {
      return null;
    }
    const recordDate = dayjs(record.created_date).startOf("day");
    const today = dayjs().startOf("day");
    const daysDifference = today.diff(recordDate, "days");
    let color;
    color = daysDifference > 30 ? "red" : "green";
    const formattedDate = record.created_date
      ? convertDateThaiShort(record.created_date)
      : null;
    return (
      <Tag color={color} key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
        <br />
        {
          <span>
            {daysDifference >= 30 ? `เกินมา ${daysDifference} วัน ` : null}{" "}
          </span>
        }
      </Tag>
    );
  };

  const renderProcess = (record) => {
    let value =
      record === 3
        ? "ยังไม่ตอบกลับ"
        : record === 1 || record === 2
        ? "ตอบกลับ"
        : "รอดำเนินการ";
    let color =
      record === 3 ? "red" : record === 1 || record === 2 ? "green" : "blue";

    return (
      <Tag color={color} key={value} style={{ textAlign: "center" }}>
        {value}
      </Tag>
    );
  };

  const renderType = (record) => {
    const options = [
      { value: 116, label: "จดหมายส่งผู้คนค้ำ(116)" },
      { value: 119, label: "บอกเลิกสัญญา(119)" },
      { value: 129, label: "ค่าบอกเลิกสัญญา(No ems)(129)" },
      { value: "vsfhp", label: "สัญญา 2" },
      { value: "psfhp", label: "สัญญา 3" },
      { value: "rpsl", label: "สัญญา 3(ใหม่)" },
      { value: "sfhp", label: "สัญญา 8" },
    ];

    if (!record) {
      return null;
    }
    const matchedOption = options.find((opt) => opt.value === record);
    return matchedOption ? matchedOption.label : "-"; // ถ้าไม่เจอ ให้แสดง "-"
  };

  const renderDateProcess = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record) {
      return null;
    }
    if (record.status === 1 || record.status === 2) {
      const startDate = dayjs(record.created_date).startOf("day");
      const endDate = dayjs(record.updated_date).startOf("day");
      const daysDifference = endDate.diff(startDate, "days");
      return daysDifference;
    } else {
      const recordDate = dayjs(record.created_date).startOf("day");
      const today = dayjs().startOf("day");
      const daysDifference = today.diff(recordDate, "days");
      return daysDifference;
    }
  };

  const renderOption = (record) => {
    const options = [
      { value: 116, label: "จดหมายส่งผู้คนค้ำ(116)" },
      { value: 119, label: "บอกเลิกสัญญา(119)" },
      { value: 129, label: "ค่าบอกเลิกสัญญา(No ems)(129)" },
      { value: "vsfhp", label: "สัญญา 2" },
      { value: "psfhp", label: "สัญญา 3" },
      { value: "rpsl", label: "สัญญา 3(ใหม่)" },
      { value: "sfhp", label: "สัญญา 8" },
    ];

    if (!record) {
      return null;
    }
    const matchedOption = options.find((opt) => opt.value === record);
    return matchedOption ? matchedOption.label : "-"; // ถ้าไม่เจอ ให้แสดง "-"
  };

  const createAndDownloadExcel = async () => {
    // สร้าง Workbook
    const workbook = new ExcelJS.Workbook();

    // กำหนดประเภท GCODE ที่ต้องการแยก (ไม่ซ้ำกัน)
    const uniqueGCodes = [
      ...new Set(arrayTable.map((data) => data.account_type)),
    ];

    // วนลูปสร้าง Sheet สำหรับแต่ละ GCODE
    uniqueGCodes.forEach((account_type) => {
      const worksheet = workbook.addWorksheet(`ประเภท ${account_type}`); // ใช้ GCODE เป็นชื่อ Sheet

      // กำหนดคอลัมน์ของ Worksheet
      worksheet.columns = [
        { header: "ลำดับ", key: "no", width: 10 },
        { header: "สัญญา", key: "data_type", width: 15 },
        { header: "ประเภทจ่าย", key: "forCode", width: 20 },
        { header: "ประเภทบัญชี", key: "gCode", width: 10 },
        { header: "วันที่ออกจดหมายในระบบ", key: "date", width: 20 },
        { header: "เลขที่สัญญา", key: "contno", width: 20 },
        { header: "ชื่อลูกค้า", key: "cusName", width: 30 },
        { header: "ประเภทลูกค้า", key: "cusType", width: 10 },
        { header: "ยี่ห้อ", key: "type", width: 15 },
        { header: "ทะเบียน", key: "regNo", width: 15 },
        { header: "ค้างงวด", key: "overdue", width: 15 },
        { header: "เงินค้าง", key: "arrears", width: 20 },
        { header: "ค่าทวงถาม", key: "letter", width: 15 },
        { header: "ems no.", key: "emsNo", width: 25 },
        { header: "เวลาดำเนินงาน", key: "createDate", width: 20 },
        { header: "สถานะ", key: "status", width: 15 },
        { header: "ลิ้งค์แสกนรูป", key: "urlFile", width: 30 },
      ];

      // กรองข้อมูลที่ตรงกับ GCODE
      const filteredData = arrayTable.filter(
        (data) => data.account_type === account_type
      );

      // เพิ่มข้อมูลในแต่ละแถว
      filteredData.forEach((data, index) => {
        worksheet.addRow([
          index + 1,
          renderOption(data.contract_schema),
          renderOption(data.pay_type),
          data.account_type,
          convertDateThaiShort(data.datetime), // วันที่ส่ง
          data.contract_no,
          data.customer_fullname,
          data.customer_type_id === 0
            ? "ผู้เช่าซื้อ"
            : `คนค้ำที่ ${data.customer_type_id}`,
          data.brand,
          data.register_no,
          data.overdue_installment_count,
          currencyFormatPoint(data.overdue_installment_amount),
          currencyFormatComma(data.dept_collection_fees),
          data.parcel_no,
          renderDateProcess(data),
          data.status === 1
            ? "ใบตอบกลับ"
            : data.status === 2
            ? "เว็บไปรษณย์"
            : 3
            ? "ยังไม่ตอบกลับ"
            : "รอดำเนินการ",
          data.url_path,
        ]);
      });

      // // คำนวณยอดรวม
      // const totalArrears = filteredData.reduce(
      //   (sum, data) => sum + data.TOTPRC - data.SMPAY,
      //   0
      // );

      // const totalLetter = filteredData.reduce(
      //   (sum, data) => sum + data.LETTER,
      //   0
      // );

      // // เพิ่มแถวสำหรับสรุปยอดรวม
      // worksheet.addRow([
      //   "",
      //   "",
      //   "",
      //   "",
      //   "",
      //   "",
      //   "",
      //   "รวมทั้งหมด",
      //   `${currencyFormatPoint(totalArrears)} บาท`,
      //   `${currencyFormatComma(totalLetter)} บาท`,
      // ]);

      // จัดรูปแบบเซลล์ใน Worksheet
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" }; // จัดกึ่งกลางแนวตั้งและแนวนอน
        });
      });
    });

    // สร้างไฟล์และดาวน์โหลด
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // ดาวน์โหลดไฟล์
    saveAs(blob, `รายงานการตอบกลับ ${dayjs().format("YYYY_MM_DD")}.xlsx`);
  };

  const columns = [
    {
      title: "ลำดับ",
      align: "center",
      render: (text, record, index) => (
        <>{index + 1}</> // คำนวณลำดับจาก index ของแถวใน Table
      ),
    },
    // {
    //   title: "สัญญา",
    //   dataIndex: "contract_schema",
    //   key: "contract_schema", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
    //   align: "center",
    //   render: (text, record) => <>{renderType(record.contract_schema)}</>,
    // },
    // {
    //   title: "ประเภทจ่าย",
    //   dataIndex: "pay_type",
    //   key: "pay_type", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
    //   align: "center",
    //   render: (text, record) => <>{record.pay_type}</>,
    // },
    // {
    //   title: "ประเภทบัญชี",
    //   dataIndex: "account_type",
    //   key: "account_type", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
    //   align: "center",
    // },
    // {
    //   title: "วันที่ออกจดหมาย",
    //   align: "center",
    //   render: (text, record) => (
    //     <>{record.datetime ? convertDateThaiShort(record.datetime) : null}</>
    //   ),
    // },
    {
      title: "เลขที่สัญญา",
      dataIndex: "contract_no",
      key: "contract_no",
      align: "center",
      render: (text, record) => (
        <>
          {record.contract_no ? record.contract_no : null} <br />
          {renderType(record.contract_schema)}
        </>
      ),
    },
    {
      title: "รายละเอียด",
      dataIndex: "contract_no",
      key: "contract_no",
      align: "center",
      render: (text, record) => (
        <>
          {convertDateThaiShort(record.datetime)} <br />
          {renderType(record.pay_type)}
          <br />
          {record.account_type}
        </>
      ),
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "customer_fullname",
      key: "customer_fullname",
      align: "center",
      render: (text, record) => (
        <>{record.customer_fullname ? record.customer_fullname : null} </>
      ),
    },
    {
      title: "ประเภทลูกค้า",
      align: "center",
      render: (text, record) => (
        <>
          {record.customer_type_id === 0
            ? "ผู้เช่าซื้อ"
            : `ผู้ค้ำที่ ${record.customer_type_id}`}
        </>
      ),
    },
    // {
    //   title: "ยี่ห้อ",
    //   dataIndex: "brand",
    //   key: "brand", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
    //   align: "center",
    // },
    // {
    //   title: "ทะเบียน",
    //   dataIndex: "register_no",
    //   key: "register_no", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
    //   align: "center",
    // },
    // {
    //   title: "ค้างงวด",
    //   align: "center",
    //   render: (text, record) => (
    //     <>
    //       {record.overdue_installment_count
    //         ? record.overdue_installment_count
    //         : null}{" "}
    //     </>
    //   ),
    // },
    // {
    //   title: "เงินค้าง",
    //   align: "center",
    //   render: (text, record) => (
    //     <>
    //       {record.overdue_installment_amount
    //         ? currencyFormatPoint(record.overdue_installment_amount)
    //         : null}{" "}
    //     </>
    //   ),
    // },
    // {
    //   title: "ค่าทวงถาม",
    //   align: "center",
    //   render: (text, record) => (
    //     <>
    //       {record.dept_collection_fees
    //         ? currencyFormatComma(record.dept_collection_fees)
    //         : null}{" "}
    //     </>
    //   ),
    // },
    {
      title: "วันที่นำข้อมูลเข้า",
      align: "center",
      render: (text, record) => (
        <>{record.datetime ? renderDate(record) : null}</>
      ),
    },
    {
      title: "ems no.",
      dataIndex: "parcel_no",
      key: "parcel_no", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
      align: "center",
    },
    {
      title: "สถานะ",
      align: "center",
      render: (text, record) => <>{renderProcess(record.status)}</>,
    },
  ];

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col
              span={"12"}
              style={{ textAlign: "start", marginBottom: "10px" }}
            >
              <Select
                style={{
                  width: "auto",
                  marginRight: "5px",
                  marginBottom: "5px",
                }}
                onChange={handleChangeSelect}
                popupMatchSelectWidth={false}
                options={optionSelectCallback}
                value={selectCallback}
                size="large"
              />
            </Col>
            <Col span={"12"} style={{ textAlign: "end", marginBottom: "10px" }}>
              <Space direction="vertical" size={12}>
                <DatePicker
                  size="large"
                  style={{ marginRight: "10px" }}
                  onChange={onSearchByDate}
                />
              </Space>
              <Search
                placeholder="ค้นหาสัญญา"
                onChange={search}
                enterButton
                style={{
                  width: 200,
                }}
                size="large"
              />
            </Col>
            <Col
              span={"24"}
              style={{ textAlign: "start", marginBottom: "10px" }}
            >
              <Space direction="vertical" size={12}>
                <Tooltip
                  placement="bottom"
                  title="บันทึกข้อมูล excel"
                  arrow={mergedArrow}
                >
                  <PrinterOutlined
                    style={{
                      fontSize: "40px",
                      color: "green",
                      cursor: "pointer",
                    }}
                    key="print"
                    onClick={createAndDownloadExcel}
                  />
                </Tooltip>
              </Space>
            </Col>
            <Col span={"24"}>
              <Table
                size="small"
                columns={columns}
                dataSource={arrayTable}
                scroll={{ x: 850 }}
                footer={() => <p>จำนวนสัญญาทั้งหมด {tableLength}</p>}
                expandable={{
                  expandedRowRender: (record) => (
                    <p style={{ margin: 0 }}>
                      <Button
                        style={{
                          boxShadow: "0 4px 3px",
                          marginLeft: "10px",
                        }}
                        onClick={() => {
                          setIsModalUpdateEms(true);
                          setDataModal(record);
                          console.log("---->", record);
                        }}
                      >
                        <EditOutlined
                          style={{ color: "green", fontSize: "16px" }}
                        />
                      </Button>
                      {/* )} */}
                    </p>
                  ),
                  rowExpandable: (record) =>
                    (userId === record.LAWYER_ID && ROLE_ID === "3") ||
                    ROLE_ID === "2" ||
                    ROLE_ID === "1",
                  expandedRowKeys, // เก็บ state ของ row ที่ขยาย
                  onExpand, // ฟังก์ชันที่ควบคุมการขยาย
                }}
                rowKey="key"
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModalUpdateEms ? (
        <UpdateReplyEms
          open={isModalUpdateEms}
          close={setIsModalUpdateEms}
          dataDefault={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
    </>
  );
};

const ReplyTerminateContract = MotionHoc(Main);
export default ReplyTerminateContract;
