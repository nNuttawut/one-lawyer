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
} from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import DetailModal from "../detail/DetailModal";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_LAWSUIT_LIST,
  HEADERS_EXPORT,
  PUT_LAWSUIT_DETAIL,
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

const Main = () => {
  const [convertDateThai] = DateCustom();
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
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [dataRecord, setDataRecord] = useState();
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [lawyerId, setLawyerId] = useState(null);
  const [lawyerName, setLawyerName] = useState();
  const [lawyersOption, setLawyersOption] = useState();
  const [statusId, setStatusId] = useState(0);
  const [companiesOption, setCompaniesOption] = useState(null);
  const { Option } = Select;
  const [companieSelect, setCompanieSelect] = useState();
  const [printOption, setPrintOption] = useState(false);
  const [dataExport, setDataExport] = useState([]);

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
    setDataExportPrint();
  }, [arrayTable]);

  const loadSelectCompany = (value) => {
    const selectedOption = value.find((option) => option.value === 2);
    if (selectedOption) {
      console.log("Selected Option:", selectedOption); // แสดงข้อมูลทั้งหมด
      setCompanieSelect(selectedOption); // เก็บข้อมูลทั้งหมดใน state
    }
  };

  const setOptionCompany = () => {
    const options = companiesListCompany.map((item) => ({
      value: item.id,
      label: item.company_name,
      address: item.address,
    }));

    console.log("options", options);
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
    setLawyersOption(options);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + GET_LAWSUIT_LIST, {
        headers: HEADERS_EXPORT,
      });
      if (response.data) {
        let i = 1;
        if (response.data) {
          const newData = response.data.map((item) => ({
            ...item,
            key: i++,
          }));
          filterDataLawyer(newData);
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
  };

  const sendStatus = async (dataLawsuit) => {
    setLoading(true);
    try {
      await axios
        .put(baseUrl + PUT_LAWSUIT_DETAIL, dataLawsuit, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      if (dataLawsuit.fee_payment_status === 1) {
        message.success(`อนุมัติสัญญาเลขท่ี ${dataLawsuit.CONTNO}`);
      } else {
        message.error(`ไม่อนุมัติสัญญาเลขที่ ${dataLawsuit.CONTNO}`);
      }
      handleUpdate(dataLawsuit);
    }
  };

  const filterDataLawyer = (data) => {
    if (Array.isArray(data)) {
      const preData = data.filter((item) => item.black_case_number);
      const newData = preData.filter((item) => !item.fee_payment_status);

      function containsNumber(str) {
        return /\d/.test(str); // เช็คว่า str เป็นตัวเลขทั้งหมด
      }

      function isEnglishOnly(str) {
        return /^[A-Za-z]+$/.test(str); // เช็คว่า str เป็นตัวอักษรภาษาอังกฤษทั้งหมด
      }

      console.log("list lawsuit--->", newData);

      let filteredData;

      if (userCompany === "3") {
        filteredData = newData.filter((item) => {
          // ถ้า 2 เป็นภาษาอังกฤษทั้งหมด
          if (isEnglishOnly(item.CONTNO.substring(0, 2))) {
            return item;
          } else {
            return false;
          }
        });
      } else {
        filteredData = newData.filter((item) => {
          const test = containsNumber(item.CONTNO.substring(0, 2)); // ตรวจสอบว่า 2 ตัวแรกมีตัวเลขไหม
          console.log("test12", test);

          // ถ้า 2 ตัวแรกไม่ใช่ตัวเลข และไม่ได้เป็นภาษาอังกฤษทั้งหมด
          if (test || !isEnglishOnly(item.CONTNO.substring(0, 2))) {
            return item; // เก็บ item นี้ไว้
          } else {
            return false; // ไม่เก็บ item นี้ (กรณีเป็นภาษาอังกฤษทั้งหมด หรือมีตัวเลขใน 2 ตัวแรก)
          }
        });
      }

      let dataUse = filteredData.filter(
        (item) => item.COMPANY_ID === 2 && !item.fee_payment_status
      );

      console.log("dataUse", dataUse);

      setArrayTable(dataUse);
      setDataArr(preData);
      setTableLength(dataUse.length);
      console.log("newData", dataUse);
      console.log("Length of filtered data:", dataUse.length);
    } else {
      console.error("data is not an array or is undefined");
      setTableLength(0);
    }
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    if (value) {
      let result = dataArr.filter(
        (item) => item.CONTNO.includes(value) || item.NNAME.includes(value)
      );
      setArrayTable(result);
    } else {
      setArrayTable(dataArr);
    }
  };

  const onSearchLawyers = (value) => {
    // if (value === "all") {
    //   let result = dataArr.filter((item) => item);
    //   setArrayTable(result);
    //   setTableLength(result.length);
    // } else {
    //   let result = dataArr.filter((item) => item.USER_ID === value);
    //   setArrayTable(result);
    //   setTableLength(result.length);
    // }
    let result = dataArr.filter((item) => item.USER_ID === value);
    setArrayTable(result);
    setTableLength(result.length);
  };

  const onSearchStatus = (value) => {
    let result;
    // if (lawyerId && lawyerId !== "all") {
    //   result = dataArr.filter(
    //     (item) => item.fee_payment_status === value && item.USER_ID === lawyerId
    //   );
    //   console.log("if", result);
    // } else {
    //   if (!value) {
    //     result = dataArr.filter((item) => !item.fee_payment_status);
    //   } else {
    //     result = dataArr.filter((item) => item.fee_payment_status === value);
    //   }
    //   console.log("else", result);
    // }
    result = dataArr.filter(
      (item) => item.fee_payment_status === value && item.USER_ID === lawyerId
    );
    setArrayTable(result);
    setTableLength(result.length);
  };

  const onChangeSelectLawyer = (value, label) => {
    console.log("onChangeSelectLawyer-->", value, label);
    onSearchLawyers(value);
    setLawyerId(value);
    let lawyerSet = lawyersList.find((item) => item.id === value);
    console.log("lawyerSet", lawyerSet);
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

    if (startDate && endDate) {
      const selectSearch = dataArr.filter((item) => {
        const date = dayjs(item.DATE, "YYYY-MM-DD");
        const itemDate = date.valueOf();
        if (itemDate >= timestampStart && itemDate <= timestampEnd) {
          return item;
        } else {
          return null;
        }
      });
      setArrayTable(selectSearch);
    } else {
      setArrayTable(dataArr);
    }
  };

  const renderStatus = (record) => {
    let color =
      record.fee_payment_status === 1
        ? "green"
        : record.fee_payment_status === 2
        ? "red"
        : "silver";

    return (
      <Tag color={color} key={record} style={{ textAlign: "center" }}>
        {record.fee_payment_status === 1
          ? "อนุมัติ"
          : record.fee_payment_status === 2
          ? "ไม่อนุมัติ"
          : "รอดำเนินการ"}
      </Tag>
    );
  };

  const renderOpteionStatus = () => {
    return (
      <>
        <Option value={0}>
          <span style={{ marginRight: 8 }}>🕒</span>
          รอดำเนินการ
        </Option>
        <Option value={1}>
          <CheckCircleOutlined style={{ color: "green", marginRight: 8 }} />
          อนุมัติ
        </Option>
        <Option value={2}>
          <CloseCircleOutlined style={{ color: "red", marginRight: 8 }} />
          ไม่อนุมัติ
        </Option>
      </>
    );
  };

  const confirmInsertOne = (data) => {
    const dataLawsuit = {
      ...data,
      fee_payment_status: 1,
      fee_payment_datetime: dayjs().format(),
    };

    console.log(dataLawsuit);
    sendStatus(dataLawsuit);
  };

  const cancel = (data) => {
    const dataLawsuit = {
      ...data,
      fee_payment_status: 2,
      fee_payment_datetime: dayjs().format(),
    };
    console.log(dataLawsuit);
    sendStatus(dataLawsuit);
  };

  const onChangeSelect = (value) => {
    console.log(`selected ${value} `);

    const selectedOption = companiesOption.find(
      (option) => option.value === value
    );

    if (selectedOption) {
      console.log("Selected Option:", selectedOption); // แสดงข้อมูลทั้งหมด
      setCompanieSelect(selectedOption); // เก็บข้อมูลทั้งหมดใน state
    }

    const dataUse = dataArr.filter(
      (item) => item.COMPANY_ID === selectedOption.value
    );

    setArrayTable(dataUse);
  };

  const calDate = (value) => {
    const recordDate = dayjs(value).startOf("day");
    console.log("valueDate", value);
    const today = dayjs().add(1, "days").startOf("days");
    console.log("today", today);

    const daysDifference = today.diff(recordDate, "days");
    console.log("daysDifference", daysDifference);

    let color = daysDifference > 30 ? "red" : "green";
    const formattedDate = value.date_of_plaint
      ? convertDateThai(value.date_of_plaint)
      : null;

    return daysDifference;
  };

  const createAndDownloadExcel = async () => {
    // สร้าง Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ค่าฤชาส่วนฟ้อง");

    // การตั้งค่า column width อัตโนมัติ
    worksheet.columns = [
      {
        header: "เลขสัญญา",
        key: "contno",
        width: 20,
      },
      {
        header: "วันที่ส่งฟ้อง",
        key: "date",
        width: 20,
      },
      {
        header: "ทนายที่รับผิดชอบ",
        key: "lawyer",
        width: 20,
      },
      {
        header: "สถานะ",
        key: "status",
        width: 20,
      },
      {
        header: "วันที่ทำรายการ",
        key: "statusDate",
        width: 20,
      },
      {
        header: "ค่าธรรมเนียมศาล",
        key: "chargeCourt",
        width: 20,
      },
      {
        header: "ค่าอากรสแตมป์",
        key: "chargeStamp",
        width: 20,
      },
      {
        header: "ค่าส่งหมาย/เอกสาร",
        key: "chargeCourt",
        width: 20,
      },
      {
        header: "จำนวนเงินรวม",
        key: "chargeTotal",
        width: 20,
      },
    ];
    arrayTable.forEach((data, index) => {
      const rowIndex = index + 2; // ข้ามแถว Header
      worksheet.addRow([
        data.CONTNO,
        convertDateThai(data.DATE), // วันที่ส่ง
        data.NNAME,
        data.fee_payment_status === 1
          ? "อนุมัติ"
          : data.fee_payment_status === 2
          ? "ไม่อนุมัติ"
          : "รออนุมัติ",
        data.fee_payment_datetime
          ? convertDateThai(data.fee_payment_datetime)
          : "-",
        `${currencyFormatNoPoint(data.fee)} บาท`,
        `${currencyFormatNoPoint(data.attorney_fees_payment_status)} บาท`,
        `${currencyFormatNoPoint(data.attorney_fees)} บาท`,
        `${currencyFormatNoPoint(
          data.attorney_fees + data.fee + data.attorney_fees_payment_status
        )} บาท`,
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
    // คำนวณยอดรวม
    const totalAmount = arrayTable.reduce(
      (sum, data) =>
        sum + data.attorney_fees + data.fee + data.attorney_fees_payment_status,
      0
    );

    // เพิ่มแถวสำหรับสรุปยอดรวม
    const totalRow = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "", // คอลัมน์ที่สอง: เว้นว่าง
      "รวมทั้งหมด", // คอลัมน์แรก: ข้อความ
      `${currencyFormatNoPoint(totalAmount)} บาท`, // คอลัมน์ที่สาม: ยอดรวม
    ]);

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
    saveAs(blob, dayjs().format("YYYY_MM_DD"));
  };

  const handleUpdate = (data) => {
    const result = dataArr.map((item) => {
      if (item.id === data.id) {
        return { ...data };
      } else {
        return { ...item };
      }
    });
    let newData;
    newData = result.filter(
      (item) =>
        item.fee_payment_status === statusId && item.USER_ID === lawyerId
    );
    // if (lawyerId !== "all" && statusId) {
    //   newData = result.filter(
    //     (item) =>
    //       item.fee_payment_status === statusId && item.USER_ID === lawyerId
    //   );
    // } else {
    //   newData = result.filter((item) => item.fee_payment_status === statusId);
    // }

    setDataArr(result);
    setArrayTable(newData);
    setTableLength(newData.length);
  };

  const setDataExportPrint = () => {
    let preData = [];
    let totalResult = 0;
    if (arrayTable) {
      arrayTable.forEach(function (element, index) {
        preData.push([
          (index += 1),
          element.CONTNO,
          // element.fee_payment_status === 1
          //   ? "อนุมัติ"
          //   : element.fee_payment_status === 2
          //   ? "ไม่อนุมัติ"
          //   : "รออนุมัติ",
          element.fee_payment_datetime
            ? convertDateThai(element.fee_payment_datetime)
            : "-",
          element.fee ? currencyFormatNoPoint(element.fee) : 0,
          element.stamp_cost ? currencyFormatNoPoint(element.stamp_cost) : 0,
          element.delivery_of_summons
            ? currencyFormatNoPoint(element.delivery_of_summons)
            : 0,
          element.document_cost
            ? currencyFormatNoPoint(element.document_cost)
            : 0,
          currencyFormatNoPoint(
            element.fee +
              element.stamp_cost +
              element.delivery_of_summons +
              element.document_cost
          ),
        ]);
        totalResult +=
          element.fee +
          element.stamp_cost +
          element.delivery_of_summons +
          element.document_cost;
      });
      console.log(totalResult);
      preData.push([
        "", // ลำดับ
        "", // เลขที่สัญญา
        "", // ข้อความในคอลัมน์วันที่ทำรายการ
        "", // ค่าธรรมเนียมศาล
        "", // ค่าอากรสแตมป์
        "", // ค่าส่งเอกสาร
        "รวม", // ค่าจัดทำเอกสาร
        currencyFormatPoint(totalResult), // ค่ารวมในคอลัมน์สุดท้าย
      ]);
    }
    // เพิ่มแถวรวมไปใน fakeData

    setDataExport(preData);
    console.log("preData", preData);
  };

  const createPdf = () => {
    const pdf = new jsPDF();

    let pdfPositionX = 0;
    let pdfPositionY = 0;
    let pdfPositionXCenter = 0;
    const marginL = 0;
    const marginC = 0;
    let imageWidth = 45; // Adjust width to fit your needs
    let imageHeight = 25; // Adjust height to fit your needs

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

    pdf.text(`วันที่พิมพ์ ${convertDateThai()}`, pdfPositionX + 10, 20);

    if (companieSelect.value === 1) {
      pdfPositionY += 30;
      pdf.text(`${companieSelect.label}`, pdfPositionXCenter - 3, pdfPositionY);
      pdf.text(`${companieSelect.address}`, 110, (pdfPositionY += 8));
    } else if (companieSelect.value === 2) {
      pdfPositionY += 33;
      pdf.text(`${companieSelect.label}`, pdfPositionXCenter - 2, pdfPositionY);
      pdf.text(
        `${companieSelect.address}`,
        pdfPositionXCenter - 41,
        (pdfPositionY += 8)
      );
    } else if (companieSelect.value === 3) {
      pdfPositionY += 25;
      pdf.text(
        `${companieSelect.label}`,
        pdfPositionXCenter - 22,
        (pdfPositionY += 3)
      );
      pdf.text(
        `${companieSelect.address}`,
        pdfPositionXCenter - 49,
        (pdfPositionY += 8)
      );
    }

    pdfPositionY += 10;
    // เพิ่มข้อความ
    pdf.text(
      "ใบเบิกเงินทดรองจ่ายค่าฤชาส่วนฟ้อง",
      pdfPositionX + 90,
      pdfPositionY
    );
    if (statusId === 1) {
      pdf.setTextColor(144, 238, 144);
      pdf.text(" (อนุมัติ)", pdfPositionXCenter + 35, pdfPositionY);
    } else if (statusId === 2) {
      pdf.setTextColor(255, 0, 0); // สีแดง (RGB)
      pdf.text(" (ไม่อนุมัติ)", pdfPositionXCenter + 35, pdfPositionY);
    } else {
      pdf.setTextColor(0, 0, 255);
      pdf.text(" (รอดำเนินการ)", pdfPositionXCenter + 28, pdfPositionY);
    }

    pdfPositionY += 5;
    // เพิ่มตาราง
    pdf.autoTable({
      head: [
        [
          "ลำดับ",
          "เลขที่สัญญา",
          "วันที่ทำรายการ",
          "ค่าธรรมเนียมศาล",
          "ค่าอากรสแตมป์",
          "ค่าส่งเอกสาร",
          "ค่าจัดทำเอกสาร",
          "จำนวนรวม",
        ],
      ],
      body: dataExport,
      startY: pdfPositionY,
      styles: {
        font: "THSarabunNew", // ฟอนต์ภาษาไทย
        fontSize: 12,
      },
      headStyles: {
        fillColor: [0, 102, 204], // สีพื้นหลัง (RGB) ของ header
        textColor: [255, 255, 255], // สีข้อความ (สีขาว)
        fontSize: 12, // ขนาดตัวอักษรใน header
        halign: "center", // จัดข้อความให้อยู่ตรงกลางใน header
      },
      columnStyles: {
        0: { halign: "center" }, // ลำดับอยู่ตรงกลาง
        1: { halign: "center" }, // ค่าธรรมเนียมศาลอยู่ตรงกลาง
        2: { halign: "center" }, // ค่าอากรสแตมป์อยู่ตรงกลาง
        3: { halign: "center" }, // ค่าส่งเอกสารอยู่ตรงกลาง
        4: { halign: "center" }, // จำนวนรวมอยู่ตรงกลาง
        5: { halign: "center" }, // ค่าอากรสแตมป์อยู่ตรงกลาง
        6: { halign: "center" }, // ค่าส่งเอกสารอยู่ตรงกลาง
        7: { halign: "center" }, // จำนวนรวมอยู่ตรงกลาง
      },
      margin: { top: 10, left: 10, right: 10 },
    });
    const finalY = pdf.lastAutoTable.finalY;
    pdf.setTextColor(0, 0, 0);
    // เพิ่มข้อความด้านล่างตาราง
    pdf.text(
      `ลงชื่อผู้เบิก...................................`,
      40,
      finalY + 20
    ); // (x, y)
    pdf.text(`(${lawyerName?.NNAME})`, 55, finalY + 25); // (x, y)
    pdf.text(`${lawyerName?.FNAME}  ${lawyerName?.LNAME}`, 45, finalY + 30); // (x, y)
    pdf.text(`ธ.กรุงไทย 982-3-92728-6`, 45, finalY + 35); // (x, y)
    pdf.text(
      `ลงชื่อผู้อนุมัติ..................................`,
      120,
      finalY + 20
    ); // (x, y)

    // สร้าง Blob ของ PDF
    const pdfBlob = pdf.output("blob");

    // เปิดในหน้าต่างใหม่
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const newWindow = window.open(pdfUrl);

    // สั่งพิมพ์
    if (newWindow) {
      newWindow.onload = () => {
        newWindow.print();
      };
    } else {
      alert("กรุณาปิดการบล็อกป๊อปอัปเพื่อใช้งานฟังก์ชันนี้");
    }
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "10%",
      render: (text, object, key) => key + 1,
      sorter: {
        compare: (a, b) => a.key - b.key,
        multiple: 5,
      },
    },
    {
      title: "เลขที่สัญญา",
      dataIndex: "CONTNO",
      key: "CONTNO",
      align: "center",
      render: (text, record) => (
        <Link
          onClick={() => {
            setIsModal(true);
            setDataRecord(record);
          }}
        >
          {record.CONTNO ? record.CONTNO : null}
        </Link>
      ),
    },
    {
      title: "จำนวนเงิน",
      align: "center",
      render: (record) => (
        <>
          {currencyFormatNoPoint(
            record.attorney_fees +
              record.fee +
              record.attorney_fees_payment_status
          )}
        </>
      ),
    },
    {
      title: "ผู้รับผิดชอบคดี",
      align: "center",
      render: (record) => <>{record.NNAME ? record.NNAME : null}</>,
    },
    {
      title: "วันที่อนุมัติ",
      align: "center",
      render: (record) => (
        <>
          {record.fee_payment_datetime
            ? convertDateThai(record.fee_payment_datetime)
            : null}
        </>
      ),
    },
    {
      title: "สถานะการอนุมัติ",
      align: "center",
      render: (record) => <>{renderStatus(record)}</>,
    },
    {
      title: "การจัดการ",
      align: "center",
      render: (record) => (
        <>
          <Popconfirm
            placement="topLeft"
            title="อัพเดทสถานะ"
            description="คุณต้องการอัพเดทสถานะให้ทนายใช่หรือไม่ ?"
            onConfirm={() => confirmInsertOne(record)}
            onCancel={() => cancel(record)}
            okText="อนุมัติ"
            cancelText="ไม่อนุมัติ"
          >
            <Button style={{ fontSize: "20px", color: "green" }}>
              <DollarOutlined />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  if (ROLE_ID === "1" || ROLE_ID === "5") {
    return (
      <>
        <Card>
          <Spin spinning={loading} size="large" tip=" Loading... ">
            <Row>
              <Col
                span={"24"}
                style={{ textAlign: "end", marginBottom: "10px" }}
              >
                <Select
                  placeholder="เลือกบริษัท"
                  optionFilterProp="value"
                  options={companiesOption}
                  onChange={(value) => onChangeSelect(value)}
                  defaultValue={userCompany === "3" ? 3 : 2}
                  popupMatchSelectWidth={false}
                  style={{
                    width: "auto", // ทำให้ Select ขยายตามเนื้อหา
                    // maxWidth: 200, // จำกัดความกว้างสูงสุด
                  }}
                  size="large"
                />
              </Col>
              <Col
                span={"24"}
                style={{ textAlign: "end", marginBottom: "10px" }}
              >
                <Space direction="vertical" size={12}>
                  <Select
                    placeholder="เลือกทนาย"
                    optionFilterProp="value"
                    onChange={(value, label) =>
                      onChangeSelectLawyer(value, label)
                    }
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
                  defaultValue={0}
                  style={{
                    width: 200,
                  }}
                  size="large"
                >
                  {renderOpteionStatus()}
                </Select>
              </Col>
            </Row>

            <Row>
              <Col
                span={6}
                style={{
                  display: "flex", // ใช้ Flexbox
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
                  onChange={() => setPrintOption(!printOption)}
                  style={{
                    backgroundColor: printOption ? "green" : "blue", // สีพื้นหลังตามสถานะ
                    color: "white", // สีตัวอักษร
                  }}
                />
                {printOption ? (
                  <FileExcelOutlined
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
                  <FilePdfOutlined
                    style={{
                      fontSize: "40px",
                      color: printOption ? "green" : "blue",
                      cursor: "pointer",
                    }}
                    key="print"
                    onClick={() => {
                      createPdf();
                    }}
                  />
                )}
              </Col>

              <Col
                span={"18"}
                style={{ textAlign: "end", marginBottom: "10px" }}
              >
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

              <Col span={"24"}>
                <Table
                  size="small"
                  columns={columns}
                  dataSource={arrayTable}
                  scroll={{ x: 850 }}
                  footer={() => (
                    <>
                      <p>จำนวนสัญญาทั้งหมด {tableLength}</p>
                    </>
                  )}
                  expandable={{
                    expandedRowRender: (record) => (
                      <p style={{ margin: 0 }}>
                        {/* {!record.DATE ? (
                          <Button
                            name="create"
                            style={{
                              boxShadow: "0 4px 3px",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              setDataModal(record);
                            }}
                          >
                            <EditOutlined
                              style={{ color: "orange", fontSize: "16px" }}
                            />
                          </Button>
                        ) : null}
                        {record.DATE ? (
                          <>
                            <Button
                              name="formPrint"
                              style={{
                                boxShadow: "0 4px 3px",
                                marginRight: "10px",
                              }}
                              onClick={() => {}}
                            >
                              <FileDoneOutlined
                                style={{ color: "green", fontSize: "16px" }}
                              />
                            </Button>
                            <Button
                              name="updateStatus"
                              style={{ boxShadow: "0 4px 3px" }}
                              onClick={() => {
                                setDataModal(record);
                              }}
                            >
                              <SyncOutlined
                                style={{ color: "green", fontSize: "16px" }}
                              />
                            </Button>
                          </>
                        ) : null} */}
                      </p>
                    ),
                    rowExpandable: (record) => !record,
                  }}
                />
              </Col>
            </Row>
          </Spin>
        </Card>
        {isModal ? (
          <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
        ) : null}
      </>
    );
  } else {
    return <>ไม่มีสิทธ์เข้าถึงข้อมูล</>;
  }
};

const AdvanePay = MotionHoc(Main);
export default AdvanePay;
