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
  Switch,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useMemo, useState } from "react";
import {
  EditOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { baseUrl, GET_CANCEL, HEADERS_EXPORT } from "../../API/apiUrls";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import logoSendPostOffice from "../../../assets/images/logoSendPostOffice.png";
import summaryPostOffice from "../../../assets/images/summaryPostOffice.png";

//use redux
import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import CurrencyFormat from "../../../hook/CurrencyFormat";
import UpdateReplyEms from "./modal/UpdateReplyEms";
import { PARAM_PUBLIC } from "../../../utils/constant/StatusConstant";

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
  const [printOption, setPrintOption] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
  });

  const optionSelectCallback = [
    { value: "all", label: "ทั้งหมด" },
    { value: 1, label: "รอดำเนินการ" },
    { value: 2, label: "ตอบกลับ" },
    { value: 3, label: "ตีกลับ" },
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
  };

  const filterDataLawyer = (data) => {
    if (Array.isArray(data)) {
      const newData = data.filter(
        (item) =>
          (item.LAWYER_ID === userId || ROLE_ID === "1" || ROLE_ID === "2") &&
          (!item.account_type || item.account_type === "cancelLand")
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
          const containsEngFirst = isEnglishOnly(
            item.contract_no.substring(0, 1)
          ); // ตรวจสอบว่า 1 ตัวแรกมีเป็น eng
          const containsEng = item.contract_no.substring(0, 1) === "4";
          // ถ้า 2 ตัวแรกไม่ใช่ตัวเลข และไม่ได้เป็นภาษาอังกฤษทั้งหมด
          if ((containsNo || containsEngFirst) && !containsEng) {
            return item; // เก็บ item นี้ไว้
          } else {
            return false; // ไม่เก็บ item นี้ (กรณีเป็นภาษาอังกฤษทั้งหมด หรือมีตัวเลขใน 2 ตัวแรก)
          }
        });
      }

      const sortEms = filteredData.sort((a, b) => {
        const dateComparison = dayjs(b.datetime) - dayjs(a.datetime);
        //เรียงจาก วันที่ก่อน
        if (dateComparison !== 0) return dateComparison;
        //ถ้าวันที่เท่ากันให้เรียงจาก parcel
        return a.parcel_no.localeCompare(b.parcel_no, undefined, {
          numeric: true,
        });
      });

      console.log(sortEms);
      let i = 1;
      const preData = filteredData.map((item) => ({
        ...item,
        no: i++,
      }));

      setArrayTable(preData);
      setDataArr(preData);
      setTableLength(preData.length);
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
        (item.parcel_no && item.parcel_no.includes(value)) ||
        (item.parcel_no_response && item.parcel_no_response.includes(value))
    );
    console.log("ssdss", value.length);

    let resultReturn = dataArr
      .filter((item) => item.parcel_no_response === value) // กรองเฉพาะค่าที่ตรงกับ value
      .map((item) => item.parcel_no_response); // ดึงเฉพาะค่าที่ต้องการออกมาฃ

    if (value.length === 13 && result.length > 0 && resultReturn[0] === value) {
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
        (item) => item.status === 1 || item.status === 2 || item.status === 3
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

      setArrayTable(selectSearch);
      setTableLength(selectSearch.length);
    } else {
      setArrayTable(selectData);
      setTableLength(selectData.length);
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
        (item) => item.status === 1 || item.status === 2 || item.status === 3
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

    const recordDate = dayjs(record.created_date)
      .subtract(7, "hour")
      .startOf("day");

    const today = dayjs().startOf("day");
    const daysDifference = today.diff(recordDate, "days");
    let color;
    color = daysDifference > 30 ? "red" : "green";
    const formattedDate = record.created_date
      ? convertDateThaiShort(recordDate)
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
      record === 1
        ? "ใบตอบกลับ"
        : record === 2
        ? "ไปรษณีย์"
        : record === 3
        ? "ตีกลับ"
        : "รอดำเนินการ";
    let color = record === 1 || record === 2 || record === 3 ? "green" : "blue";

    return (
      <Tag color={color} key={value} style={{ textAlign: "center" }}>
        {value}
      </Tag>
    );
  };

  const renderType = (record) => {
    const options = [
      { value: 115, label: "จดหมายส่งผู้คนค้ำ(115)" },
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
            : data.status === 3
            ? "ตีกลับ"
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

  const excelForPostOffice = async () => {
    const workbook = new ExcelJS.Workbook();
    let sheetIndex = 1;
    let imageBuffer2;
    // **ฟังก์ชันสร้างชีตใหม่**
    const createNewSheet = async (workbook, sheetIndex) => {
      const worksheet = workbook.addWorksheet(`${sheetIndex}`);

      const response = await fetch(logoSendPostOffice);
      const summary = await fetch(summaryPostOffice);

      const imageBuffer = await response.arrayBuffer();
      imageBuffer2 = await summary.arrayBuffer();

      // เพิ่มรูปภาพลงใน workbook
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: "png",
      });

      // ใส่รูปภาพลงในชีต
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 2 }, // ระบุตำแหน่งเริ่มต้นของรูป (เช่น B2)
        ext: { width: 180, height: 105 }, // ขนาดของรูป
      });

      worksheet.mergeCells("A1:H1");
      worksheet.getCell("A1").value =
        "ใบนำส่งสิ่งของทางไปรษณีย์โดยชำระค่าบริการเป็นเงินเชื่อ";
      worksheet.getCell("A1").font = {
        bold: true,
        size: 16,
        name: "Angsana New",
      };
      worksheet.getCell("A1").alignment = { horizontal: "center" };

      worksheet.mergeCells("F5:G5");
      worksheet.getCell("F5").value = "วันที่/เดือน/ปี.....................";
      worksheet.getCell("F5").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("F5").alignment = { horizontal: "center" };

      worksheet.mergeCells("F6:G6");
      worksheet.getCell("G6").value = "บริษัท วัน มันนี่ จำกัด";
      worksheet.getCell("G6").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("F6").alignment = { horizontal: "center" };

      worksheet.mergeCells("F7:G7");
      worksheet.getCell("G7").value = "ใบอนุญาตเลขที่ 215/2560";
      worksheet.getCell("G7").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("F7").alignment = { horizontal: "center" };

      worksheet.mergeCells("A8:E8");
      worksheet.getCell("A8").value =
        "ได้ฝากส่งสิ่งของส่งทางไปรษณีย์โดยชำระค่าบริการเป็นเงินเชื่อดังรายการต่อไปนี้";
      worksheet.getCell("A8").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("A8").alignment = { horizontal: "lift" };

      worksheet.mergeCells("F8:G8");
      worksheet.getCell("F8").value = "ศฝ/ปณ.เทพารักษ์  40001";
      worksheet.getCell("F8").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("F8").alignment = { horizontal: "center" };

      worksheet.mergeCells("F9:G9");
      worksheet.getCell("F9").value = "ฝากส่งครั้งที่..............ของเดือนนี้";
      worksheet.getCell("F9").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("F9").alignment = { horizontal: "center" };

      worksheet.getColumn(1).width = 5;
      worksheet.mergeCells("A10:A11");
      worksheet.getCell("A10").value = "ลำดับ";
      worksheet.getCell("A10").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("A10").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getColumn(2).width = 23;
      worksheet.mergeCells("B10:B11");
      worksheet.getCell("B10").value = "ผู้รับ";
      worksheet.getCell("B10").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("B10").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getColumn(3).width = 8;
      worksheet.mergeCells("C10:C11");
      worksheet.getCell("C10").value = "ปลายทาง";
      worksheet.getCell("C10").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("C10").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getCell("F10").value = "เลขที่บริการ (13 หลัก)";
      worksheet.getCell("F10").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("F10").alignment = { horizontal: "center" };

      worksheet.getColumn(4).width = 6;
      worksheet.getCell("D11").value = "ธรรมดา";
      worksheet.getCell("D11").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("D11").alignment = { horizontal: "center" };

      worksheet.getColumn(5).width = 10;
      worksheet.getCell("E11").value = "ลงทะเบียน";
      worksheet.getCell("E11").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("E11").alignment = { horizontal: "center" };

      worksheet.getColumn(6).width = 15;
      worksheet.getCell("F11").value = "EMS";
      worksheet.getCell("F11").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("F11").alignment = { horizontal: "center" };

      worksheet.getColumn(7).width = 7;
      worksheet.mergeCells("G10:G11");
      worksheet.getCell("G10").value = "ค่าบริการ";
      worksheet.getCell("G10").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("G10").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getColumn(8).width = 7;
      worksheet.mergeCells("H10:H11");
      worksheet.getCell("H10").value = "หมายเหตุ";
      worksheet.getCell("H10").font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell("H10").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getCell("A10").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      worksheet.getCell("B10").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      worksheet.getCell("C10").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      worksheet.getCell("D10").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      worksheet.getCell("D11").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      worksheet.getCell("E10").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      worksheet.getCell("F10").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      worksheet.getCell("F11").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      worksheet.getCell("G11").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      worksheet.getCell("G10").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      worksheet.getCell("H10").border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      return worksheet;
    };

    // เริ่มสร้างชีตแรก
    let worksheet = await createNewSheet(workbook, sheetIndex);

    if (!worksheet) {
      console.error("Worksheet not created successfully.");
    }

    let dataExport = [];
    if (selectedRows.length > 0) {
      dataExport = selectedRows;
    } else {
      dataExport = arrayTable;
    }

    let rowIndex = 12; // เริ่มที่แถวที่ 12
    let recNo = 1;
    for (const [index, row] of dataExport.entries()) {
      // ตรวจสอบว่า index มากกว่า 0 และเป็นข้อมูลที่ 15 แล้วค่อยสร้างชีตใหม่
      if (index > 0 && index % 15 === 0) {
        sheetIndex += 1;
        worksheet = await createNewSheet(workbook, sheetIndex);
        rowIndex = 12; // รีเซ็ตแถวใหม่ให้เริ่มที่ 12
        recNo = 1;
      }

      // เพิ่มแถวข้อมูลใหม่ในชีต
      worksheet.addRow([
        recNo ? recNo : "",
        row.customer_fullname ? row.customer_fullname : "",
        row.zipcode ? row.zipcode : "",
        row.customer_type_id === 0 ? "ผชซ." : `คค ${row.customer_type_id}.`,
        row.contract_no ? row.contract_no : "",
        row.parcel_no ? row.parcel_no : "",
        "",
        "",
      ]);

      const currentRow = worksheet.getRow(rowIndex);
      currentRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          name: "Angsana New",
        };
      });

      // กำหนดเฉพาะ column B ให้เป็นชิดซ้าย
      const cellB = worksheet.getCell(`B${rowIndex}`);
      cellB.alignment = {
        vertical: "middle",
        horizontal: "left", // จัดชิดซ้าย
      };

      rowIndex++;
      recNo++;
    }

    workbook.eachSheet((worksheet) => {
      // คำนวณแถวถัดไปหลังจากแถวสุดท้ายของข้อมูล
      const lastRowNumber = worksheet.lastRow.number + 2;

      worksheet.mergeCells(`D${lastRowNumber + 1}:G${lastRowNumber + 1}`);
      worksheet.getCell(`D${lastRowNumber + 1}`).value =
        "ไปรษณียภัณฑ์ธรรมดา         รวม  Express  จำนวน..........................ชิ้น";
      worksheet.getCell(`D${lastRowNumber + 1}`).font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };
      worksheet.getCell(`A${lastRowNumber + 1}`).alignment = {
        horizontal: "right",
      };

      // ทำการเพิ่มข้อความที่ตำแหน่งต่าง ๆ ตามความต้องการ
      worksheet.getCell(`D${lastRowNumber + 2}`).value = "รวมทั้งสิ้น";
      worksheet.getCell(`D${lastRowNumber + 2}`).font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };

      worksheet.getCell(`D${lastRowNumber + 3}`).value =
        "(ตัวอักษร).................................................................................";
      worksheet.getCell(`D${lastRowNumber + 3}`).font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };

      worksheet.getCell(`D${lastRowNumber + 4}`).value =
        "ได้ตรวจสอบความถูกต้องแล้ว";
      worksheet.getCell(`D${lastRowNumber + 4}`).font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };

      worksheet.getCell(`F${lastRowNumber + 5}`).value = "ตราประจำวัน";
      worksheet.getCell(`F${lastRowNumber + 5}`).font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };

      worksheet.getCell(`D${lastRowNumber + 6}`).value =
        "ลงชื่อ..............................................";
      worksheet.getCell(`D${lastRowNumber + 6}`).font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };

      worksheet.getCell(`D${lastRowNumber + 7}`).value =
        "เจ้าหน้าที่ผู้รับผิดชอบในการฝากส่ง";
      worksheet.getCell(`D${lastRowNumber + 7}`).font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };

      worksheet.getCell(`F${lastRowNumber + 7}`).value =
        "ได้ตรวจสอบและรับฝากไว้ถูกต้องแล้ว";
      worksheet.getCell(`F${lastRowNumber + 7}`).font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };

      worksheet.getCell(`D${lastRowNumber + 9}`).value =
        "ลงชื่อ..............................................";
      worksheet.getCell(`D${lastRowNumber + 9}`).font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };

      worksheet.getCell(`F${lastRowNumber + 9}`).value =
        "ลงชื่อ.............................................";
      worksheet.getCell(`F${lastRowNumber + 9}`).font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };

      worksheet.getCell(`D${lastRowNumber + 10}`).value =
        "        เจ้าหน้าที่ผู้ฝากส่ง";
      worksheet.getCell(`D${lastRowNumber + 10}`).font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };

      worksheet.getCell(`F${lastRowNumber + 10}`).value =
        "  เจ้าหน้าที่ผู้รับฝาก";
      worksheet.getCell(`F${lastRowNumber + 10}`).font = {
        bold: true,
        size: 14,
        name: "Angsana New",
      };

      const imageId2 = workbook.addImage({
        buffer: imageBuffer2,
        extension: "png",
      });

      worksheet.addImage(imageId2, {
        tl: { col: 1, row: lastRowNumber + 1 }, // ระบุตำแหน่งเริ่มต้นของรูป (เช่น B2)
        ext: { width: 240, height: 170 }, // ขนาดของรูป
      });
    });

    // **สร้างไฟล์ Excel และให้ดาวน์โหลด**
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `นำส่งไปษณีย์(มือ) ${dayjs().format("DD-MM-YYYY")}.xlsx`);
    });
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Row Keys:", selectedRowKeys); // คีย์ของแถวที่เลือก
    console.log("Selected Rows Data:", selectedRows); // ข้อมูลของแถวที่เลือก
    setSelectedRows(selectedRows); // เก็บข้อมูลแถวที่เลือกใน state;
  };

  const donwLoadFile = (record) => {
    loadImagesProduct(record);
  };

  const loadImagesProduct = async (record) => {
    await axios
      .get(
        baseUrl +
          `/files/lawyer/cancel_contract/${PARAM_PUBLIC}/hand${
            record.contract_no + record.parcel_no_response
          }`
      )
      .then((response) => {
        console.log("setFileList", response.data);

        if (response.data.length > 0) {
          downloadAllFiles(record, response.data);
        } else {
          message.error("ไม่พบไฟล์ดาวน์โหลด");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const downloadAllFiles = async (record, fileItem) => {
    const zip = new JSZip();
    const folder = zip.folder(
      `${record.contract_no}_${record.parcel_no_response}`
    );
    const downloadPromises = fileItem.map(async (file) => {
      const response = await fetch(file.url);
      const blob = await response.blob();

      // นำเฉพาะชื่อไฟล์สุดท้าย ตัด path ออก
      const fileName = file.name.split("/").pop();
      console.log("Saved file as:", fileName);

      folder.file(fileName, blob);
    });

    await Promise.all(downloadPromises);

    console.log("Generating ZIP...");
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${record.contract_no}_${record.parcel_no_response}.zip`);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys, selectedRows) => {
      onSelectChange(rowKeys, selectedRows);
    },
  };

  const columns = [
    {
      title: "ลำดับ",
      align: "center",
      dataIndex: "no", // ใช้ dataIndex เพื่อรองรับการ sort
      render: (text, record, index) => <>{record.no}</>, // แสดงค่า no + 1
    },

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
    // {
    //   title: "รายละเอียด",
    //   dataIndex: "contract_no",
    //   key: "contract_no",
    //   align: "center",
    //   render: (text, record) => (
    //     <>
    //       {convertDateThaiShort(record.datetime)} <br />
    //     </>
    //   ),
    // },
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
      title: "ems จดหมาย",
      dataIndex: "parcel_no",
      key: "parcel_no", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
      align: "center",
    },
    {
      title: "ems ใบตอบกลับ",
      dataIndex: "parcel_no_response",
      key: "parcel_no_response", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
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
                  marginRight: "10px",
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
              span={24}
              style={{
                display: "flex", // ใช้ Flexbox
                justifyContent: "flex-end", // จัดไปที่มุมขวาสุด
                alignItems: "center", // จัดให้อยู่ในแนวเดียวกัน (แนวตั้ง)
                gap: "10px", // ระยะห่างระหว่าง Switch และ Icon
                marginBottom: "10px",
              }}
            >
              <Switch
                checkedChildren="รายงาน"
                unCheckedChildren="ส่งไปรษณีย์"
                checked={printOption}
                onChange={() => setPrintOption(!printOption)}
                style={{
                  backgroundColor: printOption ? "green" : "blue", // สีพื้นหลังตามสถานะ
                  color: printOption ? "green" : "blue", // สีตัวอักษร
                }}
              />
              <Space direction="vertical" size={12}>
                {printOption ? (
                  <Tooltip
                    placement="bottom"
                    title="คลิกเพื่อบันทึกสรุปรายงาน"
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
                        createAndDownloadExcel();
                      }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    placement="bottom"
                    title="คลิกเพื่อบันทึกข้อมูลส่งไปรษณีย์"
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
                        excelForPostOffice();
                      }}
                    />
                  </Tooltip>
                )}
              </Space>
            </Col>
            <Col span={"24"}>
              <Table
                size="small"
                columns={columns}
                dataSource={arrayTable}
                rowSelection={rowSelection}
                scroll={{ x: 850 }}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  showSizeChanger: true,
                  pageSizeOptions: ["15", "20", "50", "100"],
                  onChange: (page, pageSize) => {
                    setPagination({ current: page, pageSize });
                  },
                }}
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
                      {record.status ? (
                        <Tooltip
                          placement="bottom"
                          title="ดาวน์โหลดไฟล์"
                          arrow={mergedArrow}
                        >
                          <Button
                            style={{
                              boxShadow: "0 4px 3px",
                              marginLeft: "10px",
                            }}
                            onClick={() => {
                              donwLoadFile(record);
                              console.log("---->", record);
                            }}
                          >
                            <DownloadOutlined
                              style={{ color: "green", fontSize: "16px" }}
                            />
                          </Button>
                        </Tooltip>
                      ) : null}
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

const ReplyTerminateContractLand = MotionHoc(Main);
export default ReplyTerminateContractLand;
