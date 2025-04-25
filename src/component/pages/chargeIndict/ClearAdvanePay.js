import {
  Col,
  Row,
  Space,
  Table,
  Tag,
  DatePicker,
  Card,
  message,
  Spin,
  Button,
  Popconfirm,
  Select,
  Switch,
  Tooltip,
} from "antd";
import {
  PrinterOutlined,
  CheckOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import React, { useEffect, useMemo, useState } from "react";
import DetailModal from "../detail/DetailModal";
import MotionHoc from "../../../utils/MotionHoc";
import {
  baseUrl,
  GET_EXPENSES_LIST,
  GET_LAWSUIT_LIST,
  HEADERS_EXPORT,
  PUT_EXPENSES,
} from "../../API/apiUrls";

import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import CurrencyFormat from "../../../hook/CurrencyFormat";
import LoadLawyers from "../../../hook/LoadLawyers";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../../assets/font/THSarabunNew-normal";
import "../../../assets/font/THSarabunNew-bold";
import logoLeasing from "../../../assets/images/drawable-header.png";
import logoMoney from "../../../assets/images/money.png";
import logoKSM from "../../../assets/images/ksm.png";
import LoadCompanies from "../../../hook/LoadCompanies";
import {
  STATUS_PROCESS_PROCESS,
  STATUS_PROCESS_SUCCESSFUL,
  STATUS_PROCESS_UNSUCCESSFUL,
} from "../../../utils/constant/StatusConstant";
import lawyerJumbo from "../../../assets/images/license/lawyerJumbo.png";
import lawyerYut from "../../../assets/images/license/lawyerYut.png";
import lawyerTon from "../../../assets/images/license/lawyerTon.png";
import oneTome from "../../../assets/images/license/oneTome.png";
import BillTranfer from "./modal/BillTranfer";
import { optionsLocat } from "../../../utils/constant/LocatOption";

const Main = () => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [companiesListCompany, setLoadingDataCompany] = LoadCompanies();
  const [isModal, setIsModal] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [dataRecord, setDataRecord] = useState();
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [lawyerId, setLawyerId] = useState(2);
  const [lawyerName, setLawyerName] = useState(2);
  const [lawyersOption, setLawyersOption] = useState();
  const [statusId, setStatusId] = useState(4);
  const [companiesOption, setCompaniesOption] = useState(2);
  const { Option } = Select;
  const [companieSelect, setCompanieSelect] = useState();
  const [printOption, setPrintOption] = useState(false);
  const [dataExport, setDataExport] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [lawsuitsData, setLawsuitsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState([]);
  const [arrow, setArrow] = useState("Show");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalFile, setIsModalFile] = useState(false);

  const onExpand = (expanded, record) => {
    if (expanded) {
      // เมื่อแถวถูกขยาย, ให้เพิ่ม key ของแถวนั้นลงใน expandedRowKeys
      setExpandedRowKeys([record.key]);
    } else {
      // เมื่อแถวถูกยุบ, ให้ลบ key ของแถวนั้นออกจาก expandedRowKeys
      setExpandedRowKeys([]);
    }
  };

  useEffect(() => {
    setLoadingData(true);
    setLoadingDataCompany(true);
    loadData();
  }, [setLoadingData, setLoadingDataCompany]);

  useEffect(() => {
    if (lawyersList && dataArr) {
      setOptionLawyer();
    }
    if (companiesListCompany) {
      setOptionCompany();
    }
  }, [lawyersList, dataArr, companiesListCompany]);

  useEffect(() => {
    if (selectedRows?.length > 0) {
      setDataExportPrint();
    }
  }, [selectedRows]);

  const loadSelectCompany = (value) => {
    const selectedOption = value.find((option) => option.value === 2);
    if (selectedOption) {
      setCompanieSelect(selectedOption); // เก็บข้อมูลทั้งหมดใน state
    }
  };

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

  const setOptionCompany = () => {
    const options = companiesListCompany.map((item) => ({
      value: item.id,
      label: item.company_name,
      address: item.address,
    }));
    setCompaniesOption(options);
    loadSelectCompany(options);
  };

  const setOptionLawyer = () => {
    let companySelect = null;

    if (dataArr.COMPANY_ID === 3) {
      companySelect = lawyersList.filter(
        (item) => item.COMPANY_ID === 3 && item.ROLE_ID === 3
      );
    } else {
      companySelect = lawyersList.filter(
        (item) =>
          (item.COMPANY_ID === 1 || item.COMPANY_ID === 2) && item.ROLE_ID === 3
      );
    }
    const options = companySelect.map((item) => ({
      value: item.id,
      label: item.NNAME,
      fNmae: item.FNAME,
      lName: item.LNAME,
    }));

    // options.unshift({
    //   value: "all", // ค่าที่แทน "ทั้งหมด"
    //   label: "ทั้งหมด", // ข้อความที่แสดงใน dropdown
    // });

    let lawyerSet = lawyersList.find((item) => item.id === 2);
    setLawyerName(lawyerSet);

    setLawyersOption(options);
  };

  const loadData = async () => {
    setLoading(true);
    let setExpense;
    let setLawsuits;
    try {
      const response = await axios.get(baseUrl + GET_EXPENSES_LIST, {
        headers: HEADERS_EXPORT,
      });
      if (response.data) {
        if (response.data) {
          setExpense = response.data;
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
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    }
    try {
      const response = await axios.get(baseUrl + GET_LAWSUIT_LIST, {
        headers: HEADERS_EXPORT,
      });
      if (response.data) {
        if (response.data) {
          setLawsuits = response.data;
          setLawsuitsData(response.data);
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
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    }
    filterData(setExpense, setLawsuits);
  };

  const filterData = (data, lawsuit) => {
    if (Array.isArray(data)) {
      const newData = data.filter(
        (item) =>
          item.withdraw_process_id === 3 && (ROLE_ID === "1" || ROLE_ID === "6")
      );

      let filteredData;

      if (userCompany === "3") {
        filteredData = newData.filter((item) => {
          const branch = item.LOCAT;
          // ถ้า branch เป็น null หรือ undefined ให้ return true ไปเลย (หรือ false ก็ได้ ขึ้นกับความต้องการ)
          if (!branch) return true; // หรือ false ก็ได้ ถ้าอยาก "กรองออก"

          // ถ้า branch มีค่า → เช็กตามปกติ
          return (
            !optionsLocat.some((opt) => branch.includes(opt.label)) ||
            item.CONTNO.includes("UD")
          );
        });
      } else {
        filteredData = newData.filter((item) => {
          const branch = item.LOCAT;
          if (!branch) return false; // ไม่มี branch ไม่ผ่านเงื่อนไข

          return optionsLocat.some((opt) => branch.includes(opt.label));
        });
      }

      const preData = groupByCreatedDateWithContno(filteredData, lawsuit);
      setDataArr(preData);

      const useData = preData?.filter(
        (item) =>
          item.USER_ID === lawyerId &&
          item.COMPANY_ID === 2 &&
          item.pay_type_id === 4
      );

      setArrayTable(useData);
      setTableLength(useData.length);
      console.log("newData", useData);
    } else {
      console.error("data is not an array or is undefined");
      setTableLength(0);
    }
  };

  const groupByCreatedDateWithContno = (data) => {
    if (!Array.isArray(data)) {
      console.error("Input data is not an array");
      return [];
    }

    const groupedData = data.reduce((acc, current, index) => {
      const {
        reference_no,
        CONTNO,
        withdraw_datetime,
        COMPANY_ID,
        NNAME,
        withdraw_process_id,
        USER_ID,
        created_date,
        updated_date,
        withdraw_mark,
        pay_type_id,
        pay_datetime,
      } = current;

      // ถ้ายังไม่มี reference_no นี้ใน acc ให้สร้าง object ใหม่
      if (!acc[reference_no]) {
        acc[reference_no] = {
          reference_no,
          contnoList: new Set(), // ใช้ Set เพื่อเก็บ contno ไม่ให้ซ้ำ
          expenseList: [],
          withdraw_datetime: withdraw_datetime || null, // กำหนดค่า withdraw_datetime
          key: index + 1, // กำหนด key โดยใช้ index + 1
          COMPANY_ID,
          NNAME,
          withdraw_process_id,
          USER_ID,
          created_date,
          updated_date,
          withdraw_mark,
          pay_type_id,
          pay_datetime,
        };
      }

      // เพิ่ม CONTNO ลงใน Set (ป้องกันค่าซ้ำ)
      acc[reference_no].contnoList.add(CONTNO);
      // เพิ่มข้อมูลทั้งหมดลงใน expenseList
      acc[reference_no].expenseList.push(current);

      return acc;
    }, {});

    // แปลง Object กลับเป็น Array และเปลี่ยน Set เป็น Array
    return Object.values(groupedData).map((group, groupIndex) => ({
      reference_no: group.reference_no,
      contnoList: Array.from(group.contnoList), // แปลง Set เป็น Array
      expenseList: group.expenseList,
      withdraw_datetime: group.withdraw_datetime,
      key: groupIndex + 1, // ใช้ index ใหม่ใน array ที่ถูก map
      COMPANY_ID: group.COMPANY_ID,
      lawyerName: group.NNAME, // เปลี่ยนชื่อ NNAME → lawyerName
      withdraw_process_id: group.withdraw_process_id,
      USER_ID: group.USER_ID,
      created_date: group.created_date,
      updated_date: group.updated_date,
      withdraw_mark: group.withdraw_mark,
      pay_type_id: group.pay_type_id,
      pay_datetime: group.pay_datetime,
    }));
  };

  const sendData = async (data) => {
    setLoading(true);

    try {
      // สร้างคำสั่ง Promise สำหรับ `setPreExpense`
      const promisesExpense = data.expenseList.map((item) =>
        axios.put(`${baseUrl}${PUT_EXPENSES}`, item, {
          headers: HEADERS_EXPORT,
        })
      );

      // รวม Promise ทั้งหมด
      const allPromises = [...promisesExpense];

      // รอให้ทุกคำสั่งสำเร็จ
      const results = await Promise.all(allPromises);

      // จัดการผลลัพธ์
      const allSuccessful = results.every(
        (res) => res.status === 200 || res.status === 201
      );

      if (allSuccessful) {
        console.log("อัพเดทข้อมูลสำเร็จทั้งหมด");
        message.success("อัพเดทข้อมูลสำเร็จทั้งหมด");
      } else {
        console.error("มีข้อมูลบางรายการที่อัพเดทไม่สำเร็จ");
        message.error("มีข้อมูลบางรายการที่อัพเดทไม่สำเร็จ");
      }
      // หากสำเร็จทั้งหมดให้ปรับสถานะ
      handleUpdate(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter(
      (item) => item.contnoList && item.contnoList.includes(value)
    );

    if (value) {
      setArrayTable(result);
    } else {
      setArrayTable(dataArr);
    }
  };

  const onSearchLawyers = (value) => {
    let dataUse;
    if (value && !selectedDate.timestampEnd && !selectedDate.timestampStart) {
      console.log("onSearchLawyers 1  ----->");

      dataUse = dataArr.filter(
        (item) =>
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === statusId &&
          item.USER_ID === value
      );
    } else if (
      !value &&
      selectedDate.timestampEnd &&
      selectedDate.timestampStart
    ) {
      console.log("onSearchLawyers 2 ----->");

      dataUse = dataArr.filter((item) => {
        // แปลงวันที่ใน item.created_date ด้วย dayjs
        const date = dayjs(item.pay_datetime, "YYYY-MM-DD");
        const itemDate = date.valueOf(); // แปลงเป็น timestamp

        // เงื่อนไขการกรอง
        return (
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === statusId &&
          itemDate >= selectedDate.timestampStart &&
          itemDate <= selectedDate.timestampEnd
        );
      });
    } else if (
      value &&
      selectedDate.timestampEnd &&
      selectedDate.timestampStart
    ) {
      console.log("onSearchLawyers 3 ----->");
      dataUse = dataArr.filter((item) => {
        // แปลงวันที่ใน item.created_date ด้วย dayjs
        const date = dayjs(item.pay_datetime, "YYYY-MM-DD");
        const itemDate = date.valueOf(); // แปลงเป็น timestamp

        // เงื่อนไขการกรอง
        return (
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === statusId &&
          item.USER_ID === value &&
          itemDate >= selectedDate.timestampStart &&
          itemDate <= selectedDate.timestampEnd
        );
      });
    } else {
      console.log("onSearchLawyers 4 ------->");

      dataUse = dataArr.filter(
        (item) =>
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === statusId
      );
    }
    setArrayTable(dataUse);
    setTableLength(dataUse.length);
  };

  const onSearchStatus = (value) => {
    let dataUse;
    console.log("companieSelect.value", companieSelect.value);
    console.log("lawyerId", lawyerId);

    if (
      lawyerId &&
      !selectedDate.timestampEnd &&
      !selectedDate.timestampStart
    ) {
      console.log("onSearchStatus 1  ----->");

      dataUse = dataArr.filter(
        (item) =>
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === value &&
          item.USER_ID === lawyerId
      );
    } else if (
      !lawyerId &&
      selectedDate.timestampEnd &&
      selectedDate.timestampStart
    ) {
      console.log("onSearchStatus 2 ----->");

      dataUse = dataArr.filter((item) => {
        // แปลงวันที่ใน item.created_date ด้วย dayjs
        const date = dayjs(item.pay_datetime, "YYYY-MM-DD");
        const itemDate = date.valueOf(); // แปลงเป็น timestamp

        // เงื่อนไขการกรอง
        return (
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === value &&
          itemDate >= selectedDate.timestampStart &&
          itemDate <= selectedDate.timestampEnd
        );
      });
    } else if (
      lawyerId &&
      selectedDate.timestampEnd &&
      selectedDate.timestampStart
    ) {
      console.log("onSearchStatus 3 ----->");
      dataUse = dataArr.filter((item) => {
        // แปลงวันที่ใน item.created_date ด้วย dayjs
        const date = dayjs(item.pay_datetime, "YYYY-MM-DD");
        const itemDate = date.valueOf(); // แปลงเป็น timestamp

        // เงื่อนไขการกรอง
        return (
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === value &&
          item.USER_ID === lawyerId &&
          itemDate >= selectedDate.timestampStart &&
          itemDate <= selectedDate.timestampEnd
        );
      });
    } else {
      console.log("onSearchStatus 4 ------->");

      dataUse = dataArr.filter(
        (item) =>
          item.COMPANY_ID === companieSelect.value && item.pay_type_id === value
      );
    }

    setArrayTable(dataUse);
    setTableLength(dataUse.length);
  };

  const onChangeSelectCompany = (value) => {
    console.log(`selected ${value} `);

    const selectedOption = companiesOption.find(
      (option) => option.value === value
    );

    if (selectedOption) {
      console.log("Selected Option:", selectedOption); // แสดงข้อมูลทั้งหมด
      setCompanieSelect(selectedOption); // เก็บข้อมูลทั้งหมดใน state
    }
    let dataUse;

    if (
      lawyerId &&
      !selectedDate.timestampEnd &&
      !selectedDate.timestampStart
    ) {
      console.log("onChangeSelectCompany 1  ----->", lawyerId);
      console.log("dataArr-->", dataArr);

      dataUse = dataArr.filter(
        (item) =>
          item.COMPANY_ID === selectedOption.value &&
          item.pay_type_id === statusId &&
          item.USER_ID === lawyerId
      );
    } else if (
      !lawyerId &&
      selectedDate.timestampEnd &&
      selectedDate.timestampStart
    ) {
      console.log("onChangeSelectCompany 2 ----->");

      dataUse = dataArr.filter((item) => {
        // แปลงวันที่ใน item.created_date ด้วย dayjs
        const date = dayjs(item.pay_datetime, "YYYY-MM-DD");
        const itemDate = date.valueOf(); // แปลงเป็น timestamp

        // เงื่อนไขการกรอง
        return (
          item.COMPANY_ID === selectedOption.value &&
          item.pay_type_id === statusId &&
          itemDate >= selectedDate.timestampStart &&
          itemDate <= selectedDate.timestampEnd
        );
      });
    } else if (
      lawyerId &&
      selectedDate.timestampEnd &&
      selectedDate.timestampStart
    ) {
      console.log("onChangeSelectCompany 3 ----->");
      dataUse = dataArr.filter((item) => {
        // แปลงวันที่ใน item.created_date ด้วย dayjs
        const date = dayjs(item.pay_datetime, "YYYY-MM-DD");
        const itemDate = date.valueOf(); // แปลงเป็น timestamp

        // เงื่อนไขการกรอง
        return (
          item.COMPANY_ID === selectedOption.value &&
          item.pay_type_id === statusId &&
          item.USER_ID === lawyerId &&
          itemDate >= selectedDate.timestampStart &&
          itemDate <= selectedDate.timestampEnd
        );
      });
    } else {
      console.log("onChangeSelectCompany 4 ------->");

      dataUse = dataArr.filter(
        (item) =>
          item.COMPANY_ID === selectedOption.value &&
          item.pay_type_id === statusId
      );
    }
    console.log("dataUse---->", dataUse, statusId, lawyerId);

    setArrayTable(dataUse);
  };

  const onChangeSelectLawyer = (value, label) => {
    console.log("onChangeSelectLawyer-->", value, label);

    onSearchLawyers(value);
    console.log("label.label", label.label);

    setLawyerId(value);
    let lawyerSet = lawyersList.find((item) => item.NNAME === label.label);
    console.log(lawyerSet);
    setLawyerName(lawyerSet);
  };

  const onChangeSelectStatus = (value) => {
    console.log("onChangeSelectStatus-->", value);
    onSearchStatus(value);
    setStatusId(value);
  };

  const onSearchByDate = (startDate, endDate) => {
    console.log(endDate[0]);
    console.log(endDate[1]);

    const start = dayjs(endDate[0], "YYYY-MM-DD");
    const end = dayjs(endDate[1], "YYYY-MM-DD");

    const timestampStart = start.valueOf();
    const timestampEnd = end.valueOf();

    let dataUse;

    if (lawyerId && !startDate && !endDate) {
      console.log("onSearchByDate 1  ----->");

      dataUse = dataArr.filter(
        (item) =>
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === statusId &&
          item.USER_ID === lawyerId
      );
    } else if (!lawyerId && startDate && endDate) {
      console.log("onSearchByDate 2 ----->");

      dataUse = dataArr.filter((item) => {
        // แปลงวันที่ใน item.created_date ด้วย dayjs
        const date = dayjs(item.pay_datetime, "YYYY-MM-DD");
        const itemDate = date.valueOf(); // แปลงเป็น timestamp

        // เงื่อนไขการกรอง
        return (
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === statusId &&
          itemDate >= timestampStart &&
          itemDate <= timestampEnd
        );
      });
    } else if (lawyerId && startDate && endDate) {
      console.log("onSearchByDate 3 ----->");
      dataUse = dataArr.filter((item) => {
        // แปลงวันที่ใน item.created_date ด้วย dayjs
        const date = dayjs(item.pay_datetime, "YYYY-MM-DD");
        const itemDate = date.valueOf(); // แปลงเป็น timestamp

        // เงื่อนไขการกรอง
        return (
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === statusId &&
          item.USER_ID === lawyerId &&
          itemDate >= timestampStart &&
          itemDate <= timestampEnd
        );
      });
    } else {
      console.log("onSearchByDate 4 ------->");

      dataUse = dataArr.filter(
        (item) =>
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === statusId
      );
    }
    setArrayTable(dataUse);
    setTableLength(dataUse.length);
    setSelectedDate({ timestampStart, timestampEnd });
  };

  const renderOpteionStatus = () => {
    return (
      <>
        <Option value={4}>
          <span style={{ marginRight: 8 }}>🕒</span>
          รอตรวจสอบ
        </Option>
        <Option value={1}>
          <span style={{ marginRight: 8 }}>✅</span>
          ตรวจสอบแล้ว
        </Option>
        <Option value={null}>
          <span style={{ marginRight: 8 }}>💤</span>
          ยังไม่เคลียร์เงิน
        </Option>
      </>
    );
  };

  const confirmInsertOne = (data) => {
    const preData = {
      ...data,
      // pay_datetime: dayjs().format("YYYY-MM-DD"),
      pay_type_id: 1,
    };
    const putExpense = preData.expenseList.forEach((expense) => {
      expense.pay_type_id = 1;
      // expense.pay_datetime = dayjs().format("YYYY-MM-DD");
    });
    console.log(preData);
    sendData(preData);
  };

  const createAndDownloadExcel = async () => {
    // สร้าง Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ค่าฤชาส่วนฟ้อง");

    // การตั้งค่า column width อัตโนมัติ
    worksheet.columns = [
      {
        header: "ลำดับ",
        key: "no",
        width: 15,
      },
      {
        header: "เลขสัญญา",
        key: "contno",
        width: 20,
      },
      {
        header: "วันที่ขอเบิก",
        key: "date",
        width: 20,
      },
      {
        header: "รายการ",
        key: "charge",
        width: 20,
      },
      {
        header: "จำนวนเงินรวม",
        key: "chargeTotal",
        width: 20,
      },
    ];
    dataExport.forEach((data, index) => {
      const rowIndex = index + 3; // ข้ามแถว Header
      worksheet.addRow([
        data[0],
        data[1], // วันที่ส่ง
        `${data[2]} `,
        `${data[3]}`,
        `${data[4]}`,
      ]);
      // ถ้า dateOver เกิน 30, ให้ทำการไฮไลท์เซลล์ในคอลัมน์ "ระยะเวลา"
      //   if (calDate(data.date_of_plaint) > 30) {
      //     const cell = worksheet.getCell(`H${rowIndex}`);
      //     cell.fill = {
      //       type: "pattern",
      //       pattern: "solid",
      //       fgColor: { argb: "FFFF0000" }, // พื้นหลังสีแดง
      //     };
      //     cell.font = {
      //       color: { argb: "FFFFFFFF" }, // ตัวอักษรสีขาว
      //     };
      //   }
    });

    // กำหนดรูปแบบให้ทุกเซลล์ใน Worksheet
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" }; // จัดกึ่งกลางแนวตั้งและแนวนอน
      });
    });

    // สร้างไฟล์และดาวน์โหลด
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // ดาวน์โหลดไฟล์
    saveAs(blob, `ค่าฤชาส่วนฟ้อง ${dayjs().format("YYYY_MM_DD")}`);
  };

  const handleUpdate = (data) => {
    console.log("handleUpdate", data);

    const result = dataArr.map((item) => {
      if (item.id === data.id) {
        return { ...data };
      } else {
        return { ...item };
      }
    });
    let newData;

    if (
      lawyerId &&
      !selectedDate.timestampEnd &&
      !selectedDate.timestampStart
    ) {
      console.log("onSearchStatus 1  ----->");

      newData = result.filter(
        (item) =>
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === statusId &&
          item.USER_ID === lawyerId
      );
    } else if (
      !lawyerId &&
      selectedDate.timestampEnd &&
      selectedDate.timestampStart
    ) {
      console.log("onSearchStatus 2 ----->");

      newData = result.filter((item) => {
        const date = dayjs(item.pay_datetime, "YYYY-MM-DD");
        const itemDate = date.valueOf(); // แปลงเป็น timestamp

        // เงื่อนไขการกรอง
        return (
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === statusId &&
          itemDate >= selectedDate.timestampStart &&
          itemDate <= selectedDate.timestampEnd
        );
      });
    } else if (
      lawyerId &&
      selectedDate.timestampEnd &&
      selectedDate.timestampStart
    ) {
      console.log("onSearchStatus 3 ----->");
      newData = result.filter((item) => {
        // แปลงวันที่ใน item.created_date ด้วย dayjs
        const date = dayjs(item.pay_datetime, "YYYY-MM-DD");
        const itemDate = date.valueOf(); // แปลงเป็น timestamp

        // เงื่อนไขการกรอง
        return (
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === statusId &&
          item.USER_ID === lawyerId &&
          itemDate >= selectedDate.timestampStart &&
          itemDate <= selectedDate.timestampEnd
        );
      });
    } else {
      console.log("onSearchStatus 4 ------->");

      newData = result.filter(
        (item) =>
          item.COMPANY_ID === companieSelect.value &&
          item.pay_type_id === statusId
      );
    }

    setDataArr(result);
    setArrayTable(newData);
    setTableLength(newData.length);
  };

  // const setDataExportPrint = () => {
  //   let preData = [];
  //   let totalResult = 0;
  //   let totalResultPay = 0;
  //   let groupedData = {}; // ใช้เก็บข้อมูลที่รวมแล้ว

  //   if (arrayTable) {
  //     selectedRows.forEach((expense) => {
  //       expense.expenseList.forEach((element) => {
  //         const key = `${element.CONTNO}-${element.reference_no}`;

  //         if (!groupedData[key]) {
  //           groupedData[key] = {
  //             CONTNO: element.CONTNO,
  //             pay_datetime: element?.pay_datetime
  //               ? convertDateThai(element?.pay_datetime)
  //               : "-",
  //             expenses: [],
  //           };
  //         }

  //         // เพิ่มข้อมูลรายการค่าใช้จ่ายแต่ละรายการ
  //         if (element.withdraw) {
  //           groupedData[key].expenses.push({
  //             description: element.expense_description,
  //             amount: currencyFormatPoint(element.withdraw),
  //             amountPay: currencyFormatPoint(element.pay),
  //             expense_type_id: element.expense_type_id, // เพิ่มเพื่อการจัดเรียง
  //           });
  //         }

  //         totalResult += element.withdraw;
  //         totalResultPay += element.pay;
  //       });
  //     });

  //     // จัดเรียง expenses ตาม expense_type_id (น้อยไปหามาก) ภายในแต่ละกลุ่ม
  //     Object.values(groupedData).forEach((item) => {
  //       item.expenses.sort((a, b) => a.expense_type_id - b.expense_type_id);
  //     });

  //     // แปลงข้อมูลจาก Object เป็น Array และจัดรูปแบบ rowspan
  //     Object.values(groupedData).forEach((item, index) => {
  //       item.expenses.forEach((expense, expenseIndex) => {
  //         preData.push([
  //           expenseIndex === 0 ? index + 1 : "", // ลำดับ (rowspan)
  //           expenseIndex === 0 ? item.CONTNO : "", // เลขที่สัญญา (rowspan)
  //           expenseIndex === 0 && item.pay_datetime ? item.pay_datetime : "", // วันที่ทำรายการ (rowspan)
  //           expense.description, // รายการ
  //           expense.amount, // จำนวนเงิน
  //           expense.amountPay,
  //         ]);
  //       });
  //     });
  //     console.log(preData);

  //     // เพิ่มแถวรวมยอด
  //     preData.push([
  //       "",
  //       "",
  //       "",
  //       "รวม",
  //       currencyFormatPoint(totalResult),
  //       currencyFormatPoint(totalResultPay),
  //     ]);
  //     preData.push([
  //       "",
  //       "",
  //       "",
  //       "",
  //       "ยอดสุทธิ",
  //       currencyFormatPoint(totalResultPay - totalResult),
  //     ]);

  //     if (totalResultPay < totalResult) {
  //       setStatusClear(2);
  //     } else if (totalResultPay > totalResult) {
  //       setStatusClear(3);
  //     } else if (totalResultPay === totalResult) {
  //       setStatusClear(4);
  //     } else {
  //       setStatusClear(1);
  //     }
  //   }

  //   setDataExport(preData);
  // };

  const setDataExportPrint = () => {
    let groupedData = {}; // เก็บข้อมูลแยกตาม reference_no
    let totalResultByRef = {}; // เก็บยอดรวมของแต่ละ reference_no
    let totalResultPayByRef = {}; // เก็บยอดจ่ายของแต่ละ reference_no

    if (arrayTable) {
      selectedRows.forEach((expense) => {
        expense.expenseList.forEach((element) => {
          const refKey = element.reference_no; // ใช้ reference_no เป็น key

          if (!groupedData[refKey]) {
            groupedData[refKey] = {};
            totalResultByRef[refKey] = 0; // กำหนดยอดรวมของ reference_no
            totalResultPayByRef[refKey] = 0; // กำหนดยอดจ่ายของ reference_no
          }

          const key = `${element.CONTNO}-${element.reference_no}`;

          if (!groupedData[refKey][key]) {
            groupedData[refKey][key] = {
              CONTNO: element.CONTNO,
              pay_datetime: element?.pay_datetime
                ? convertDateThai(element?.pay_datetime)
                : "-",
              expenses: [],
            };
          }

          // เพิ่มข้อมูลรายการค่าใช้จ่ายแต่ละรายการ
          if (element.withdraw) {
            groupedData[refKey][key].expenses.push({
              description: element.expense_description,
              amount: element.withdraw,
              amountPay: element.pay,
              expense_type_id: element.expense_type_id, // ใช้จัดเรียง
            });

            // คำนวณยอดรวมของ reference_no นี้
            totalResultByRef[refKey] += element.withdraw;
            totalResultPayByRef[refKey] += element.pay;
          }
        });
      });

      let allPreData = {}; // เก็บข้อมูลทั้งหมดตาม reference_no

      // จัดเรียง expenses ตาม expense_type_id และจัดรูปแบบ rowspan
      Object.keys(groupedData).forEach((refKey) => {
        let preData = [];

        Object.values(groupedData[refKey]).forEach((item, index) => {
          item.expenses.sort((a, b) => a.expense_type_id - b.expense_type_id);
          item.expenses.forEach((expense, expenseIndex) => {
            preData.push([
              expenseIndex === 0 ? index + 1 : "", // ลำดับ (rowspan)
              expenseIndex === 0 ? item.CONTNO : "", // เลขที่สัญญา (rowspan)
              expenseIndex === 0 && item.pay_datetime ? item.pay_datetime : "", // วันที่ทำรายการ (rowspan)
              expense.description, // รายการ
              currencyFormatPoint(expense.amount), // จำนวนเงินเบิก
              currencyFormatPoint(expense.amountPay), // จำนวนเงินจ่ายจริง
            ]);
          });
        });

        // เพิ่มแถว "รวม" และ "ยอดสุทธิ" สำหรับแต่ละ reference_no
        preData.push([
          "",
          "",
          "",
          "รวม",
          currencyFormatPoint(totalResultByRef[refKey]),
          currencyFormatPoint(totalResultPayByRef[refKey]),
        ]);
        preData.push([
          "",
          "",
          "",
          "",
          "ส่วนต่าง",
          currencyFormatPoint(
            totalResultPayByRef[refKey] - totalResultByRef[refKey]
          ),
        ]);

        allPreData[refKey] = preData;
      });

      setDataExport(allPreData);
    }
  };

  // const createPdf = () => {
  //   const pdf = new jsPDF();

  //   let pdfPositionX = 0;
  //   let pdfPositionY = 0;
  //   let pdfPositionXCenter = 0;
  //   const marginL = 0;
  //   const marginC = 0;
  //   let imageWidth = 45; // Adjust width to fit your needs
  //   let imageHeight = 25; // Adjust height to fit your needs
  //   let imageWidthImg = 25; // Adjust width to fit your needs
  //   let imageHeightImg = 15; // Adjust height to fit your needs

  //   const imageUrl =
  //     companieSelect.value === 1
  //       ? logoLeasing
  //       : companieSelect.value === 2
  //       ? logoMoney
  //       : companieSelect.value === 3
  //       ? logoKSM
  //       : logoLeasing;
  //   // PDF configuration
  //   if (companieSelect.value === 2) {
  //     pdfPositionY += 5;
  //   } else if (companieSelect.value === 3) {
  //     imageHeight = 30;
  //   }
  //   pdfPositionXCenter += 150;
  //   pdf.addImage(
  //     imageUrl,
  //     "PNG",
  //     pdfPositionXCenter,
  //     pdfPositionY,
  //     imageWidth,
  //     imageHeight
  //   );
  //   // pdf.setFont("THSarabunNew", "normal");
  //   pdf.setFont("THSarabunNew", "bold");
  //   pdf.setFontSize(14);

  //   pdf.text(`วันที่พิมพ์ ${convertDateThai()}`, pdfPositionX + 10, 10);
  //   pdf.text(`เลขที่อ้างอิง ${null}`, pdfPositionX + 10, 15);

  //   pdf.setFontSize(16);
  //   if (companieSelect.value === 1) {
  //     pdfPositionY += 30;
  //     pdf.text(
  //       `${companieSelect.label}`,
  //       pdfPositionXCenter - 11,
  //       pdfPositionY
  //     );
  //     pdf.text(`${companieSelect.address}`, 95, (pdfPositionY += 8));
  //   } else if (companieSelect.value === 2) {
  //     pdfPositionY += 33;
  //     pdf.text(
  //       `${companieSelect.label}`,
  //       pdfPositionXCenter - 10,
  //       pdfPositionY
  //     );
  //     pdf.text(
  //       `${companieSelect.address}`,
  //       pdfPositionXCenter - 54,
  //       (pdfPositionY += 8)
  //     );
  //   } else if (companieSelect.value === 3) {
  //     pdfPositionY += 25;
  //     pdf.text(
  //       `${companieSelect.label}`,
  //       pdfPositionXCenter - 40,
  //       (pdfPositionY += 3)
  //     );
  //     pdf.text(
  //       `${companieSelect.address}`,
  //       pdfPositionXCenter - 60,
  //       (pdfPositionY += 8)
  //     );
  //   }

  //   pdfPositionY += 10;
  //   // เพิ่มข้อความ
  //   pdf.text(
  //     "ใบเคลียร์เงินทดรองจ่ายค่าฤชาส่วนฟ้อง",
  //     pdfPositionX + 80,
  //     pdfPositionY
  //   );
  //   if (statusClear === 2) {
  //     pdf.setTextColor(255, 0, 0); // สีแดง (RGB)
  //     pdf.text(" (ทนายโอนคืนการเงิน)", pdfPositionXCenter, pdfPositionY);
  //   } else if (statusClear === 3) {
  //     pdf.setTextColor(255, 0, 0); // สีแดง (RGB)
  //     pdf.text(" (การเงินโอนให้ทนาย)", pdfPositionXCenter, pdfPositionY);
  //   } else if (statusClear === 4) {
  //     pdf.setTextColor(144, 238, 144);
  //     pdf.text(" (ยอดตรง)", pdfPositionXCenter + 28, pdfPositionY);
  //   } else {
  //     pdf.setTextColor(144, 238, 144);
  //     pdf.text(" (สำเร็จ)", pdfPositionXCenter + 28, pdfPositionY);
  //   }

  //   pdfPositionY += 5;
  //   // เพิ่มตาราง
  //   pdf.autoTable({
  //     head: [
  //       [
  //         "ลำดับ",
  //         "เลขที่สัญญา",
  //         "วันที่ตรวจสอบ",
  //         "รายการ",
  //         "จำนวนเบิก",
  //         "จ่ายจริง",
  //       ],
  //     ],
  //     body: dataExport,
  //     startY: pdfPositionY,
  //     styles: {
  //       font: "THSarabunNew", // ฟอนต์ภาษาไทย
  //       fontSize: 14,
  //     },
  //     headStyles: {
  //       fillColor: [0, 102, 204], // สีพื้นหลัง (RGB) ของ header
  //       textColor: [255, 255, 255], // สีข้อความ (สีขาว)
  //       fontSize: 12, // ขนาดตัวอักษรใน header
  //       halign: "center", // จัดข้อความให้อยู่ตรงกลางใน header
  //     },
  //     columnStyles: {
  //       0: { halign: "center" }, // ลำดับอยู่ตรงกลาง
  //       1: { halign: "center" }, // ค่าธรรมเนียมศาลอยู่ตรงกลาง
  //       2: { halign: "center" }, // ค่าอากรสแตมป์อยู่ตรงกลาง
  //       3: { halign: "center" }, // ค่าส่งเอกสารอยู่ตรงกลาง
  //       4: { halign: "center" }, // จำนวนรวมอยู่ตรงกลาง
  //       5: { halign: "center" }, // ค่าอากรสแตมป์อยู่ตรงกลาง
  //       6: { halign: "center" }, // ค่าส่งเอกสารอยู่ตรงกลาง
  //       7: { halign: "center" }, // จำนวนรวมอยู่ตรงกลาง
  //     },
  //     margin: { top: 10, left: 10, right: 10 },
  //   });
  //   const finalY = pdf.lastAutoTable.finalY;
  //   pdf.setTextColor(0, 0, 0);
  //   // เพิ่มข้อความด้านล่างตาราง
  //   // เพิ่มข้อความด้านล่างตาราง
  //   if (lawyerName.id === 2) {
  //     //ลายเซ็นต์ ทนาย
  //     const imageUrl = lawyerYut; // Replace with your image URL or base64
  //     pdf.addImage(
  //       imageUrl,
  //       "PNG",
  //       60,
  //       finalY + 7,
  //       imageWidthImg,
  //       imageHeightImg
  //     );
  //   } else if (lawyerName.id === 3) {
  //     //ลายเซ็นต์ ทนาย
  //     const imageUrl = lawyerJumbo; // Replace with your image URL or base64
  //     pdfPositionY += 40;
  //     pdf.addImage(
  //       imageUrl,
  //       "PNG",
  //       60,
  //       finalY + 7,
  //       imageWidthImg,
  //       imageHeightImg
  //     );
  //   } else if (lawyerName.id === 11) {
  //     //ลายเซ็นต์ ทนาย
  //     const imageUrl = lawyerTon; // Replace with your image URL or base64
  //     pdfPositionY += 40;
  //     pdf.addImage(
  //       imageUrl,
  //       "PNG",
  //       60,
  //       finalY + 7,
  //       imageWidthImg,
  //       imageHeightImg
  //     );
  //   }
  //   pdf.text(
  //     `ลงชื่อผู้เคลียร์...................................`,
  //     40,
  //     finalY + 20
  //   ); // (x, y)
  //   pdf.text(
  //     `(${lawyerName ? lawyerName?.NNAME : "                         "})`,
  //     50,
  //     finalY + 27
  //   ); // (x, y)
  //   pdf.text(
  //     `${lawyerName ? lawyerName?.FNAME : "                        "}  ${
  //       lawyerName ? lawyerName?.LNAME : "                         "
  //     }`,
  //     45,
  //     finalY + 32
  //   ); // (x, y)
  //   pdf.text(`${lawyerName ? lawyerName?.book_bank : ""}`, 45, finalY + 37); // (x, y)

  //   pdfPositionY += 40;
  //   pdf.addImage(
  //     oneTome,
  //     "PNG",
  //     143,
  //     finalY + 7,
  //     imageWidthImg,
  //     imageHeightImg
  //   );
  //   pdf.text(
  //     `ลงชื่อผู้อนุมัติ..................................`,
  //     120,
  //     finalY + 20
  //   ); // (x, y)
  //   if (dateApproved) {
  //     pdf.text(
  //       `(วันที่อนุมัติ ${convertDateThai(dateApproved)})`,
  //       125,
  //       finalY + 28
  //     ); // (x, y)
  //   } else {
  //     pdf.text(`(                                     )`, 125, finalY + 28); // (x, y)
  //   }
  //   pdf.text(
  //     `ลงชื่อผู้ตรวจ..................................`,
  //     120,
  //     finalY + 50
  //   ); // (x, y)

  //   const pdfBlob = pdf.output("blob");
  //   const pdfUrl = URL.createObjectURL(pdfBlob);
  //   const newWindow = window.open(pdfUrl);

  //   if (newWindow) {
  //     newWindow.onload = () => {
  //       newWindow.print();
  //     };
  //   } else {
  //     alert("กรุณาปิดการบล็อกป๊อปอัปเพื่อใช้งานฟังก์ชันนี้");
  //   }
  // };

  const createPdf = () => {
    const pdf = new jsPDF();

    let pdfPositionX = 0;
    let pdfPositionY = 0;
    let pdfPositionXCenter = 0;
    const marginL = 0;
    const marginC = 0;
    let imageWidth = 45; // Adjust width to fit your needs
    let imageHeight = 25; // Adjust height to fit your needs
    let imageWidthImg = 25; // Adjust width to fit your needs
    let imageHeightImg = 15; // Adjust height to fit your needs

    Object.keys(dataExport).forEach((refNo, index) => {
      if (index !== 0) {
        pdf.addPage();
        pdfPositionY = 0; // รีเซ็ตตำแหน่งที่เริ่มต้น
        pdfPositionX = 0;
        pdfPositionXCenter = 0;
        imageWidth = 45; // Adjust width to fit your needs
        imageHeight = 25; // Adjust height to fit your needs
        imageWidthImg = 25; // Adjust width to fit your needs
        imageHeightImg = 15; // Adjust height to fit your needs

        const imageUrl =
          companieSelect.value === 1
            ? logoLeasing
            : companieSelect.value === 2
            ? logoMoney
            : companieSelect.value === 3
            ? logoKSM
            : logoLeasing;
        // PDF configuration
        if (companieSelect.value === 2) {
          pdfPositionY += 5;
        } else if (companieSelect.value === 3) {
          imageHeight = 30;
        }
        pdfPositionXCenter += 150;
        pdf.addImage(
          imageUrl,
          "PNG",
          pdfPositionXCenter,
          pdfPositionY,
          imageWidth,
          imageHeight
        );
        // pdf.setFont("THSarabunNew", "normal");
        pdf.setFont("THSarabunNew", "bold");
        pdf.setFontSize(14);

        pdf.text(`วันที่พิมพ์ ${convertDateThai()}`, pdfPositionX + 10, 10);
        pdf.text(`เลขที่อ้างอิง ${refNo}`, pdfPositionX + 10, 15);

        pdf.setFontSize(16);
        if (companieSelect.value === 1) {
          pdfPositionY += 30;
          pdf.text(
            `${companieSelect.label}`,
            pdfPositionXCenter - 11,
            pdfPositionY
          );
          pdf.text(`${companieSelect.address}`, 95, (pdfPositionY += 8));
        } else if (companieSelect.value === 2) {
          pdfPositionY += 33;
          pdf.text(
            `${companieSelect.label}`,
            pdfPositionXCenter - 10,
            pdfPositionY
          );
          pdf.text(
            `${companieSelect.address}`,
            pdfPositionXCenter - 54,
            (pdfPositionY += 8)
          );
        } else if (companieSelect.value === 3) {
          pdfPositionY += 25;
          pdf.text(
            `${companieSelect.label}`,
            pdfPositionXCenter - 40,
            (pdfPositionY += 3)
          );
          pdf.text(
            `${companieSelect.address}`,
            pdfPositionXCenter - 60,
            (pdfPositionY += 8)
          );
        }

        pdfPositionY += 10;
        // เพิ่มข้อความ
        pdf.text("ใบเคลียร์เงินทดรองจ่าย", pdfPositionX + 80, pdfPositionY);

        if (selectedRows[index]?.pay_type_id === 1) {
          pdf.setTextColor(144, 238, 144);
          pdf.text("(ตรวจสอบแล้ว)", pdfPositionXCenter + 25, pdfPositionY);
        } else if (selectedRows[index]?.pay_type_id === 4) {
          pdf.setTextColor(255, 0, 0); // สีแดง (RGB)
          pdf.text(" (รอตรวจสอบ)", pdfPositionXCenter + 25, pdfPositionY);
        } else {
          pdf.text("(ยังไม่ทำรายการ)", pdfPositionXCenter + 23, pdfPositionY);
        }

        pdf.setTextColor(0, 0, 0);
        pdfPositionY += 5;
      }
      if (index === 0) {
        const imageUrl =
          companieSelect.value === 1
            ? logoLeasing
            : companieSelect.value === 2
            ? logoMoney
            : companieSelect.value === 3
            ? logoKSM
            : logoLeasing;
        // PDF configuration
        if (companieSelect.value === 2) {
          pdfPositionY += 5;
        } else if (companieSelect.value === 3) {
          imageHeight = 30;
        }
        pdfPositionXCenter += 150;
        pdf.addImage(
          imageUrl,
          "PNG",
          pdfPositionXCenter,
          pdfPositionY,
          imageWidth,
          imageHeight
        );
        // pdf.setFont("THSarabunNew", "normal");
        pdf.setFont("THSarabunNew", "bold");
        pdf.setFontSize(14);

        pdf.text(`วันที่พิมพ์ ${convertDateThai()}`, pdfPositionX + 10, 10);
        pdf.text(`เลขที่อ้างอิง ${refNo}`, pdfPositionX + 10, 15);

        pdf.setFontSize(16);
        if (companieSelect.value === 1) {
          pdfPositionY += 30;
          pdf.text(
            `${companieSelect.label}`,
            pdfPositionXCenter - 11,
            pdfPositionY
          );
          pdf.text(`${companieSelect.address}`, 95, (pdfPositionY += 8));
        } else if (companieSelect.value === 2) {
          pdfPositionY += 33;
          pdf.text(
            `${companieSelect.label}`,
            pdfPositionXCenter - 10,
            pdfPositionY
          );
          pdf.text(
            `${companieSelect.address}`,
            pdfPositionXCenter - 54,
            (pdfPositionY += 8)
          );
        } else if (companieSelect.value === 3) {
          pdfPositionY += 25;
          pdf.text(
            `${companieSelect.label}`,
            pdfPositionXCenter - 40,
            (pdfPositionY += 3)
          );
          pdf.text(
            `${companieSelect.address}`,
            pdfPositionXCenter - 60,
            (pdfPositionY += 8)
          );
        }

        pdfPositionY += 10;
        // เพิ่มข้อความ
        pdf.text("ใบเคลียร์เงินทดรองจ่าย", pdfPositionX + 80, pdfPositionY);

        if (selectedRows[index]?.pay_type_id === 1) {
          pdf.setTextColor(144, 238, 144);
          pdf.text("(ตรวจสอบแล้ว)", pdfPositionXCenter + 25, pdfPositionY);
        } else if (selectedRows[index]?.pay_type_id === 4) {
          pdf.setTextColor(255, 0, 0); // สีแดง (RGB)
          pdf.text(" (รอตรวจสอบ)", pdfPositionXCenter + 25, pdfPositionY);
        } else {
          pdf.text("(ยังไม่ทำรายการ)", pdfPositionXCenter + 23, pdfPositionY);
        }
        pdf.setTextColor(0, 0, 0);
        pdfPositionY += 5;
      }
      // เพิ่มตาราง
      pdf.autoTable({
        head: [
          [
            "ลำดับ",
            "เลขที่สัญญา",
            "วันที่เคลียร์เงิน",
            "รายการ",
            "จำนวนเบิก",
            "จ่ายจริง",
          ],
        ],
        body: dataExport[refNo],
        startY: pdfPositionY,
        styles: { font: "THSarabunNew", fontSize: 14 },
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: [255, 255, 255],
          fontSize: 12,
          halign: "center",
        },
        columnStyles: {
          0: { halign: "center" },
          1: { halign: "center" },
          2: { halign: "center" },
          3: { halign: "center" },
          4: { halign: "center" },
          5: { halign: "center" },
        },
        margin: { top: 10, left: 10, right: 10 },
      });

      const finalY = pdf.lastAutoTable.finalY;
      pdf.setTextColor(0, 0, 0);
      // เพิ่มข้อความด้านล่างตาราง
      // เพิ่มข้อความด้านล่างตาราง
      if (lawyerName.id === 2) {
        //ลายเซ็นต์ ทนาย
        const imageUrl = lawyerYut; // Replace with your image URL or base64
        pdf.addImage(
          imageUrl,
          "PNG",
          60,
          finalY + 7,
          imageWidthImg,
          imageHeightImg
        );
      } else if (lawyerName.id === 3) {
        //ลายเซ็นต์ ทนาย
        const imageUrl = lawyerJumbo; // Replace with your image URL or base64
        pdfPositionY += 40;
        pdf.addImage(
          imageUrl,
          "PNG",
          60,
          finalY + 7,
          imageWidthImg,
          imageHeightImg
        );
      } else if (lawyerName.id === 11) {
        //ลายเซ็นต์ ทนาย
        const imageUrl = lawyerTon; // Replace with your image URL or base64
        pdfPositionY += 40;
        pdf.addImage(
          imageUrl,
          "PNG",
          60,
          finalY + 7,
          imageWidthImg,
          imageHeightImg
        );
      }
      pdf.text(
        `ลงชื่อผู้เคลียร์...................................`,
        40,
        finalY + 20
      ); // (x, y)
      pdf.text(
        `(${lawyerName ? lawyerName?.NNAME : "                         "})`,
        50,
        finalY + 27
      ); // (x, y)
      pdf.text(
        `${lawyerName ? lawyerName?.FNAME : "                        "}  ${
          lawyerName ? lawyerName?.LNAME : "                         "
        }`,
        45,
        finalY + 32
      ); // (x, y)
      pdf.text(`${lawyerName ? lawyerName?.book_bank : ""}`, 45, finalY + 37); // (x, y)

      pdfPositionY += 40;
      if (selectedRows[index]?.pay_type_id === 1) {
        pdf.addImage(
          oneTome,
          "PNG",
          143,
          finalY + 7,
          imageWidthImg,
          imageHeightImg
        );
      }
      pdf.text(
        `ลงชื่อผู้อนุมัติ..................................`,
        120,
        finalY + 20
      ); // (x, y)
      if (selectedRows[index]?.pay_type_id === 1) {
        pdf.text(
          `(วันที่อนุมัติ ${convertDateThai(
            selectedRows[index]?.updated_date
          )})`,
          125,
          finalY + 28
        ); // (x, y)
      } else {
        pdf.text(`(                                     )`, 125, finalY + 28); // (x, y)
      }
      pdf.text(
        `ลงชื่อผู้ตรวจ..................................`,
        120,
        finalY + 50
      ); // (x, y)
    });

    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const newWindow = window.open(pdfUrl);

    if (newWindow) {
      newWindow.onload = () => {
        newWindow.print();
      };
    } else {
      alert("กรุณาปิดการบล็อกป๊อปอัปเพื่อใช้งานฟังก์ชันนี้");
    }
  };

  const renderContnoList = (record) => {
    return record.contnoList.map((contno, index) => (
      <React.Fragment key={index}>
        {contno}
        <br />
      </React.Fragment>
    ));
  };

  const renderStatus = (record) => {
    if (!Array.isArray(record.expenseList)) {
      console.error("record is not an array");
      return null;
    }

    if (!record.pay_type_id) {
      return null;
    }

    let totalPay = 0;
    let totalWithdraw = 0;

    record.expenseList.forEach((expense) => {
      totalPay += expense.pay;
    });

    record.expenseList.forEach((expense) => {
      totalWithdraw += expense.withdraw;
    });
    let status =
      record.pay_type_id === 1
        ? "ตรวจสอบแล้ว"
        : totalPay === totalWithdraw
        ? "ยอดตรง"
        : totalPay > totalWithdraw
        ? "โอนคืนทนาย"
        : totalPay < totalWithdraw
        ? "โอนคืนการเงิน"
        : null;
    let color =
      record.pay_type_id === 1
        ? "green"
        : totalPay === totalWithdraw
        ? "green"
        : totalPay > totalWithdraw
        ? "blue"
        : totalPay < totalWithdraw
        ? "red"
        : null;
    // แสดงข้อมูล totalWithdraw
    return <Tag color={color}>{status}</Tag>;
  };

  const renderTotalAmount = (record) => {
    // ตรวจสอบว่า record เป็น array หรือไม่
    if (!Array.isArray(record.expenseList)) {
      console.error("record is not an array");
      return null;
    }

    let totalWithdraw = 0;

    record.expenseList.forEach((expense) => {
      totalWithdraw += expense.withdraw;
    });

    let totalPay = 0;

    record.expenseList.forEach((expense) => {
      totalPay += expense.pay;
    });

    let color =
      totalPay === totalWithdraw
        ? "green"
        : totalPay > totalWithdraw
        ? "orange"
        : totalPay < totalWithdraw
        ? "red"
        : null;

    // แสดงข้อมูล totalWithdraw
    return (
      <div>
        <p style={{ fontWeight: "bold" }}>
          {" "}
          {currencyFormatPoint(totalWithdraw)} บาท
        </p>
      </div>
    );
  };

  const renderTotalAmountPay = (record) => {
    // ตรวจสอบว่า record เป็น array หรือไม่
    if (!Array.isArray(record.expenseList)) {
      console.error("record is not an array");
      return null;
    }

    let totalWithdraw = 0;

    record.expenseList.forEach((expense) => {
      totalWithdraw += expense.withdraw;
    });

    let totalPay = 0;

    record.expenseList.forEach((expense) => {
      totalPay += expense.pay;
    });

    let color =
      totalPay === totalWithdraw
        ? "green"
        : totalPay > totalWithdraw
        ? "orange"
        : totalPay < totalWithdraw
        ? "red"
        : null;
    // แสดงข้อมูล totalWithdraw
    return (
      <div>
        <p style={{ fontWeight: "bold" }}>
          {" "}
          {currencyFormatPoint(totalPay)} บาท
        </p>
      </div>
    );
  };

  // const renderTotalAmountCal = (record) => {
  //   // ตรวจสอบว่า record เป็น array หรือไม่
  //   if (!Array.isArray(record.expenseList)) {
  //     console.error("record is not an array");
  //     return null;
  //   }
  //   let totalWithdraw = 0;

  //   record.expenseList.forEach((expense) => {
  //     totalWithdraw += expense.withdraw;
  //   });

  //   let totalPay = 0;

  //   record.expenseList.forEach((expense) => {
  //     totalPay += expense.pay;
  //   });

  //   let color =
  //     totalPay === totalWithdraw
  //       ? null
  //       : totalPay > totalWithdraw
  //       ? "green"
  //       : totalPay < totalWithdraw
  //       ? "red"
  //       : null;
  //   // แสดงข้อมูล totalWithdraw
  //   return (
  //     <div>
  //       <p style={{ color: color, fontWeight: "bold" }}>
  //         {" "}
  //         {currencyFormatPoint(totalPay - totalWithdraw)} บาท
  //       </p>
  //     </div>
  //   );
  // };

  const renderTotalAmountCal = (record) => {
    // ตรวจสอบว่า record เป็น array หรือไม่
    if (!Array.isArray(record.expenseList)) {
      console.error("record is not an array");
      return null;
    }

    let totalPay = 0;

    let totalWithdraw = 0;

    record.expenseList.forEach((expense) => {
      totalWithdraw += expense.withdraw;
    });

    record.expenseList.forEach((expense) => {
      totalPay += expense.pay;
    });

    return (
      <p
        style={{
          color:
            totalPay === totalWithdraw
              ? null
              : totalPay > totalWithdraw
              ? "green"
              : "red",
        }}
      >
        {totalPay !== 0 && (
          <>
            {totalPay > totalWithdraw
              ? `เบิกขาด ${currencyFormatPoint(totalPay - totalWithdraw)} บาท`
              : totalPay < totalWithdraw
              ? `เบิกเกิน ${currencyFormatPoint(totalPay - totalWithdraw)} บาท`
              : " 0 บาท"}
          </>
        )}
      </p>
    );
  };

  const renderDataDetail = (record) => {
    if (Array.isArray(record.contnoList)) {
      // ✅ จัดกลุ่ม expenses ตาม CONTNO
      const groupedExpenses = record.expenseList.reduce((acc, expense) => {
        const { CONTNO } = expense;
        if (!acc[CONTNO]) {
          acc[CONTNO] = [];
        }
        acc[CONTNO].push(expense);
        return acc;
      }, {});

      // ✅ แปลง Object เป็น Array
      const expenseArray = Object.keys(groupedExpenses).map((contno) => ({
        CONTNO: contno,
        expenses: groupedExpenses[contno],
      }));

      console.log("expenseArray-----?", expenseArray);

      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {expenseArray.map((data, index) => {
            const totalWithdraw = data.expenses.reduce(
              (sum, expense) => sum + (expense.withdraw || 0),
              0
            );
            const totalPay = data.expenses.reduce(
              (sum, expense) => sum + (expense.pay || 0),
              0
            );

            return (
              <div
                key={index}
                style={{
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    color: "#027a3a",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {`เลขสัญญา: ${data.CONTNO}`}
                </h3>
                <div style={{ marginTop: "10px" }}>
                  {data.expenses
                    .sort((a, b) => a.expense_type_id - b.expense_type_id)
                    .map((expense, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                          padding: "10px",
                          backgroundColor: "#f8f8f8",
                          borderRadius: "8px",
                        }}
                      >
                        <div style={{ color: "#333", fontSize: "14px" }}>
                          {expense.expense_description}:
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ color: "#1a73e8", fontSize: "14px" }}>
                            {`เบิก: ${expense.withdraw}`}
                          </p>
                          <p style={{ color: "#e53935", fontSize: "14px" }}>
                            {`จ่ายจริง: ${expense.pay || "-"}`}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                <div
                  style={{
                    marginTop: "20px",
                    borderTop: "1px solid #ddd",
                    paddingTop: "10px",
                    textAlign: "right",
                  }}
                >
                  <p
                    style={{
                      color: "#1a73e8",
                      fontSize: "16px",
                    }}
                  >
                    {`รวมเบิกทั้งหมด: ${currencyFormatPoint(
                      totalWithdraw
                    )} บาท`}
                  </p>
                  <p
                    style={{
                      color: "#e53935",
                      fontSize: "16px",
                    }}
                  >
                    {`รวมจ่ายจริงทั้งหมด: ${currencyFormatPoint(totalPay)} บาท`}
                  </p>
                  <p
                    style={{
                      color: "green",
                      fontSize: "16px",
                    }}
                  >
                    {`ผลลัพธ์: ${currencyFormatPoint(
                      totalPay - totalWithdraw
                    )} บาท`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      console.error("record is not an array");
      return null;
    }
  };

  const renderDate = (record, status) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record) {
      return null;
    }
    let color;
    const recordDate = dayjs(record).startOf("day");
    const today = dayjs().startOf("day");

    // คำนวณความแตกต่างในหน่วยปี
    const yearsDifference = today.diff(recordDate, "year");

    // คำนวณความแตกต่างในหน่วยเดือน
    const monthsDifference = today.diff(recordDate, "month");

    // คำนวณความแตกต่างในหน่วยวัน
    const daysDifference = today.diff(recordDate, "day");

    // คำนวณส่วนที่เหลือหลังจากคำนวณปีแล้ว (คำนวณเดือนที่เหลือ)
    const remainingMonths = today
      .subtract(yearsDifference, "year")
      .diff(recordDate, "month");

    // คำนวณส่วนที่เหลือหลังจากคำนวณปีและเดือนแล้ว (คำนวณวันที่เหลือ)
    const remainingDays = today.diff(recordDate, "day");

    // color = remainingDays > 7 ? "red" : "green";

    color =
      status === STATUS_PROCESS_SUCCESSFUL
        ? "green"
        : status === STATUS_PROCESS_UNSUCCESSFUL
        ? "red"
        : remainingDays > 7 && status === STATUS_PROCESS_PROCESS
        ? "red"
        : "blue";

    const formattedDate = record ? convertDateThaiShort(recordDate) : null;
    return (
      <Tag color={color} key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
        <br />
        {status !== 3 && (
          <>
            {remainingDays > 7 ? "นาน" : null} {remainingDays} วัน
          </>
        )}
      </Tag>
    );
  };

  const renderManage = (record) => {
    if (!record.pay_type_id) {
      return null;
    }

    return (
      <>
        <Tooltip
          placement="bottom"
          title="กรุณากดเพื่อดูรูปใบเสร็จ !"
          arrow={mergedArrow}
        >
          <Button
            style={{ fontSize: "20px", marginRight: "5px", color: "blue" }}
            onClick={() => {
              setDataRecord(record);
              console.log(record);

              setIsModalFile(true);
            }}
          >
            <FileImageOutlined />
          </Button>
        </Tooltip>
        {record.pay_type_id === 1 ? null : (
          <Tooltip
            placement="bottom"
            title="คลิกเพื่อยืนยันการตรวจสอบ !"
            arrow={mergedArrow}
          >
            <Popconfirm
              placement="topLeft"
              title="อัพเดทสถานะ"
              description="ยืนยันผลการตรวจสอบถูกต้องหรือไม่ ?"
              onConfirm={() => confirmInsertOne(record)}
              // onCancel={() => cancel(record)}
              okText="ยืนยัน"
              cancelText="ปิด"
            >
              <Button style={{ fontSize: "20px", color: "green" }}>
                <CheckOutlined />
              </Button>
            </Popconfirm>
          </Tooltip>
        )}
      </>
    );
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Row Keys:", selectedRowKeys); // คีย์ของแถวที่เลือก
    console.log("Selected Rows Data:", selectedRows); // ข้อมูลของแถวที่เลือก
    setSelectedRows(selectedRows); // เก็บข้อมูลแถวที่เลือกใน state;
  };

  console.log("setSelectedRows", selectedRows);

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys, selectedRows) => {
      onSelectChange(rowKeys, selectedRows);
    },
  };

  const clearSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "10%",
      render: (text, object, key) => key + 1,
      // sorter: {
      //   compare: (a, b) => a.key - b.key,
      //   multiple: 5,
      // },
    },
    {
      title: "เลขที่อ้างอิง",
      align: "center",
      render: (text, record) => (
        <p
        // onClick={() => {
        //   setIsModal(true);
        //   setDataRecord(record);
        // }}
        >
          {record.reference_no}
        </p>
      ),
    },
    {
      title: "เลขที่สัญญา",
      align: "center",
      render: (text, record) => (
        <p
        // onClick={() => {
        //   setIsModal(true);
        //   setDataRecord(record);
        // }}
        >
          {renderContnoList(record)}
        </p>
      ),
    },
    {
      title: "จำนวนที่เบิก",
      align: "center",
      render: (record) => <>{renderTotalAmount(record)}</>,
    },
    {
      title: "จำนวนที่เคลียร์",
      align: "center",
      render: (record) => <>{renderTotalAmountPay(record)}</>,
    },
    {
      title: "ส่วนต่าง",
      align: "center",
      render: (record) => <>{renderTotalAmountCal(record)}</>,
    },
    {
      title: "วันที่เคลียร์",
      align: "center",
      render: (record) => (
        <>{record.pay_type_id ? renderDate(record.pay_datetime) : null}</>
      ),
    },
    {
      title: "วันที่ตรวจสอบ",
      align: "center",
      render: (record) => (
        <>{record.pay_type_id === 1 ? renderDate(record.updated_date) : null}</>
      ),
    },
    {
      title: "สถานะ",
      align: "center",
      render: (record) => <>{renderStatus(record)}</>,
    },
    {
      title: "การจัดการ",
      align: "center",
      render: (record) => <> {renderManage(record)}</>,
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
                placeholder="เลือกบริษัท"
                showSearch
                optionFilterProp="label"
                options={companiesOption}
                onChange={(value) => onChangeSelectCompany(value)}
                defaultValue={userCompany === "3" ? 3 : 2}
                popupMatchSelectWidth={false}
                style={{
                  width: "auto", // ทำให้ Select ขยายตามเนื้อหา
                  // maxWidth: 200, // จำกัดความกว้างสูงสุด
                }}
                size="large"
              />
            </Col>

            <Col span={"12"} style={{ textAlign: "end", marginBottom: "10px" }}>
              <Space direction="vertical" size={12}>
                <RangePicker
                  size="large"
                  style={{ marginRight: "10px", width: 310 }}
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
              span={"12"}
              style={{ textAlign: "start", marginBottom: "10px" }}
            >
              <Space direction="vertical" size={12}>
                <Select
                  placeholder="เลือกทนาย"
                  showSearch
                  optionFilterProp="label"
                  onChange={(value, label) =>
                    onChangeSelectLawyer(value, label)
                  }
                  defaultValue={2}
                  options={lawyersOption}
                  style={{
                    width: 150,
                    marginRight: "10px",
                  }}
                  size="large"
                />
              </Space>
              <Select
                placeholder="เลือกสถานะ"
                optionFilterProp="value"
                onChange={(value) => onChangeSelectStatus(value)}
                defaultValue={4}
                style={{
                  width: 200,
                }}
                size="large"
              >
                {renderOpteionStatus()}
              </Select>
            </Col>
            <Col
              span={12}
              style={{
                display: "flex", // ใช้ Flexbox
                justifyContent: "flex-end", // จัดไปที่มุมขวาสุด
                alignItems: "center", // จัดให้อยู่ในแนวเดียวกัน (แนวตั้ง)
                gap: "10px", // ระยะห่างระหว่าง Switch และ Icon
                textAlign: "start",
                marginBottom: "10px",
              }}
            >
              <Switch
                checkedChildren="EXCEL"
                unCheckedChildren="PDF"
                checked={printOption}
                disabled
                onChange={() => setPrintOption(!printOption)}
                style={{
                  backgroundColor: printOption ? "green" : "blue", // สีพื้นหลังตามสถานะ
                  color: "white", // สีตัวอักษร
                }}
              />
              {printOption ? (
                <PrinterOutlined
                  style={{
                    fontSize: "40px",
                    color: printOption ? "green" : "blue",
                    cursor: "pointer",
                  }}
                  key="print"
                  onClick={() => {
                    console.log("createAndDownloadExcel");
                    createAndDownloadExcel();
                  }}
                />
              ) : (
                <Tooltip
                  placement="bottom"
                  title="คลิกเพื่อปริ้น PDF !"
                  arrow={mergedArrow}
                >
                  <PrinterOutlined
                    style={{
                      fontSize: "40px",
                      color: printOption ? "green" : "blue",
                      cursor: "pointer",
                    }}
                    key="print"
                    onClick={() => {
                      if (selectedRowKeys.length > 0) {
                        createPdf();
                        clearSelectedRows();
                        // loadImagesProductTranferMoney();
                      } else {
                        message.error("กรุณาเลือกข้อมูลที่ต้องการพิมพ์");
                      }
                    }}
                  />
                </Tooltip>
              )}
            </Col>
          </Row>

          <Row>
            <Col span={"24"}>
              <Table
                size="small"
                columns={columns}
                dataSource={arrayTable}
                scroll={{ x: 850 }}
                rowSelection={rowSelection}
                footer={() => (
                  <>
                    <p>จำนวนสัญญาทั้งหมด {tableLength}</p>
                  </>
                )}
                expandable={{
                  expandedRowRender: (record) => (
                    <p style={{ margin: 0 }}>{renderDataDetail(record)}</p>
                  ),
                  rowExpandable: (record) => record,
                  expandedRowKeys, // เก็บ state ของ row ที่ขยาย
                  onExpand, // ฟังก์ชันที่ควบคุมการขยาย
                }}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? (
        <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
      ) : null}
      {isModalFile ? (
        <BillTranfer
          open={isModalFile}
          close={setIsModalFile}
          dataDefault={dataRecord}
        />
      ) : null}
    </>
  );
};

const ClearAdvanePay = MotionHoc(Main);
export default ClearAdvanePay;
