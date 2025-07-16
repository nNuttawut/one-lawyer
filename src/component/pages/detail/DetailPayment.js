import {
  Col,
  Row,
  Space,
  Table,
  Card,
  Spin,
  DatePicker,
  message,
  Tooltip,
  Divider,
  Empty,
  Select,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useMemo, useEffect } from "react";
import MotionHoc from "../../../utils/MotionHoc";
import { PrinterOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import {
  HEADERS_EXPORT_BEN,
  POST_DETAIL_PAYMENT,
  POST_DETAIL_PAYMENT_LEASING,
} from "../../API/apiUrls";
import DateCustom from "../../../hook/DateCustom";
import CurrencyFormat from "../../../hook/CurrencyFormat";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { faMapLocationDot, faCarSide } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Main = () => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [arrData, setArrData] = useState();
  const [arrow, setArrow] = useState("Show");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [queryContno, setQueryContno] = useState();
  const [date, setDate] = useState();
  const [result, setResult] = useState();
  const [resultLeasing, setResultLeasing] = useState();
  const [optionsDataType, setOptionsDataType] = useState();
  const [dataTypeSelect, setDataTypeSelect] = useState();
  const [dataTypeSelectLable, setDataTypeSelectLable] = useState();

  let columns;

  useEffect(() => {
    let optionsContract = [];
    if (userCompany === "3") {
      optionsContract = [{ value: "KSM", label: "KSM" }];
    } else {
      optionsContract = [
        { value: "LSFHP", label: "สัญญา 1" },
        { value: "VSFHP", label: "สัญญา 2" },
        { value: "PSFHP", label: "สัญญา 3(เก่า)" },
        { value: "RPSL", label: "สัญญา 3(ใหม่)" },
        { value: "SFHP_LAND", label: "สัญญา 8(ที่ดิน)" },
        { value: "SFHP_CAR", label: "สัญญา 8(รถ)" },
      ];
    }

    setOptionsDataType(optionsContract);
  }, []);

  const onQuery = () => {
    if (queryContno && dataTypeSelect) {
      queryData(queryContno, dataTypeSelect);
      console.log("dataTypeSelect", dataTypeSelect);
    }
  };

  const queryData = async (queryContno, typeValue) => {
    setLoading(true);
    let apiUse;
    if (typeValue === "SFHP" || typeValue === "VSFHP") {
      apiUse = POST_DETAIL_PAYMENT_LEASING;
    } else {
      apiUse = POST_DETAIL_PAYMENT;
    }
    try {
      await axios
        .post(
          apiUse,
          {
            contno: queryContno,
            todate: dayjs(date).format("YYYY-MM-DD"),
            type: typeValue,
          },
          {
            headers: HEADERS_EXPORT_BEN,
          }
        )
        .then(async (resQuery) => {
          let i = 1;
          if (resQuery.status === 200) {
            console.log("resQuery------->", resQuery.data[0]);
            let newData;
            setArrData(resQuery?.data[0]);
            if (
              dataTypeSelectLable.value === "VSFHP" ||
              dataTypeSelectLable.value === "SFHP_CAR"
            ) {
              newData = resQuery?.data[0]?.result?.map((item) => ({
                ...item,
                key: i++,
              }));
              console.log("newData---->SFHP", newData);
              renderDataLeasing(newData, resQuery?.data[0]);
            } else {
              newData = resQuery?.data[0]?.resultdata?.map((item) => ({
                ...item,
                key: i++,
              }));
              renderData(newData);
            }
            console.log("newData", newData);
            setArrayTable(newData);

            console.log("resQuery", resQuery.data);
            setLoading(false);
          } else {
            setArrayTable();
            setArrData();
            message.error("ไม่มีเลขที่สัญญาที่ค้นหา");
            console.log("ไม่มีเลขที่สัญญาที่ค้นหา");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 404) {
            message.error("ไม่มีเลขที่สัญญาที่ค้นหา");
            setArrayTable();
            setArrData();
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
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

  const handleChange = (date) => {
    console.log("date", date);
    setDate(dayjs(date).format("YYYY-MM-DD"));
  };

  const handleChangeContno = (value) => {
    console.log("value", value);
    if (!value) {
      setArrData(null);
      setArrayTable(null);
      setResult(null);
    }
    setQueryContno(value);
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Row Keys:", selectedRowKeys); // คีย์ของแถวที่เลือก
    console.log("Selected Rows Data:", selectedRows); // ข้อมูลของแถวที่เลือก
    setSelectedRows(selectedRows); // เก็บข้อมูลแถวที่เลือกใน state;
    if (selectedRows.length > 0) {
      if (
        dataTypeSelectLable.value === "VSFHP" ||
        dataTypeSelectLable.value === "SFHP_CAR"
      ) {
        renderDataLeasing(arrayTable);
      } else {
        renderData(selectedRows);
      }
    } else {
      if (
        dataTypeSelectLable.value === "VSFHP" ||
        dataTypeSelectLable.value === "SFHP_CAR"
      ) {
        renderDataLeasing(arrayTable);
      } else {
        renderData(arrayTable);
      }
    }
  };

  const handleTypeContno = (value, label) => {
    console.log("value", value, label);
    setDataTypeSelect(
      value === "SFHP_CAR" || value === "SFHP_LAND" ? "SFHP" : value
    );
    setDataTypeSelectLable(label);
    setQueryContno(null);
    setArrayTable(null);
    setArrData(null);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys, selectedRows) => {
      onSelectChange(rowKeys, selectedRows);
    },
  };

  const renderData = (data) => {
    console.log("renderData", data);

    const totalDays = data.reduce((sum, item) => sum + (item.Days || 0), 0);
    const totalPayment = data.reduce(
      (sum, item) => sum + (item.NETPAY || 0),
      0
    );
    const totalDUEINTEFF = data.reduce(
      (sum, item) => sum + (item.DUEINTEFF || 0),
      0
    );
    const totalDUETONEFF = data.reduce(
      (sum, item) => sum + (item.DUETONEFF || 0),
      0
    );

    const totalKongdok = data.reduce(
      (sum, item) => sum + ((item.DUEINTEFF || 0) - (item.KangDok || 0)),
      0
    );
    console.log("totalKongdok");

    let dataTotal = {
      totalDays,
      totalPayment,
      totalDUEINTEFF,
      totalDUETONEFF,
      totalKongdok,
    };
    setResult(dataTotal);
  };

  const renderDataLeasing = (dataTable, data) => {
    console.log("renderDataLeasing", data);

    const totalLateDate = dataTable.reduce(
      (sum, item) => sum + (item.late_days || 0),
      0
    );
    const totalNoPaid = dataTable.reduce(
      (sum, item) => sum + (item.remaining || 0),
      0
    );
    const totalPaid = dataTable.reduce(
      (sum, item) => sum + (item.paid || 0),
      0
    );

    // หา record paid ล่าสุดจากท้าย โดยไม่กระทบ array เดิม
    const dataPaidLastNopay =
      [...dataTable]?.reverse().find((item) => Number(item.paid) !== 0) || {};

    // แยกช่วงงวด unpaid_count อย่างปลอดภัย
    const [nopayStart = 0, nopayEnd = 0] = String(
      data?.loan?.unpaid_count || "0-0"
    )
      .split("-")
      .map((num) => Number(num));

    // ตรวจสอบว่ามีข้อมูลพร้อมคำนวณ
    const resultNopay = dataPaidLastNopay.damt
      ? (nopayEnd - nopayStart + 1) * Number(dataPaidLastNopay.damt) -
        Number(dataPaidLastNopay.paid || 0) +
        Number(dataPaidLastNopay.remaining || 0)
      : 0;

    console.log("dataPaidLastNopay:", dataPaidLastNopay);
    console.log("resultNopay:", resultNopay);

    console.log("result", result);

    let dataTotal = {
      totalLateDate,
      totalNoPaid,
      totalPaid,
      resultNopay,
    };
    setResultLeasing(dataTotal);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont("THSarabunNew", "bold");
    // ส่วนหัวของเอกสาร
    doc.text("รายละเอียดสัญญา", 105, 15, null, null, "center");
    let yLine = 20;
    // ข้อมูลเลขที่สัญญา
    doc.setFontSize(14);
    doc.text(
      `ผู้ทำสัญญา : ${arrData?.customer[0]?.name}`,
      105,
      yLine,
      null,
      null,
      "center"
    );

    doc.setFont("THSarabunNew", "normal");
    if (arrData?.guarantor?.length > 0 && queryContno.substring(0, 1) !== "1") {
      arrData.guarantor.forEach((data, index) => {
        yLine += 6; // เพิ่มค่า yLine ทีละ 5
        doc.text(
          `คนค้ำที่ ${index + 1}: ${data.name}`,
          105,
          yLine,
          null,
          null,
          "center"
        );
      });
    }
    yLine += 5;
    doc.text(`เลขที่สัญญา: ${arrData?.chqtran[0]?.contno}`, 50, yLine + 5);
    doc.text(
      `${
        queryContno.substring(0, 1) === "3" ||
        dataTypeSelectLable.value === "SFHP_CAR"
          ? ""
          : `จัวหวัด: ${arrData?.invtran?.type}`
      }`,
      50,
      yLine + 10
    );
    doc.text(
      `${
        queryContno.substring(0, 1) === "3" ||
        dataTypeSelectLable.value === "SFHP_CAR"
          ? ""
          : `อำเภอ: ${arrData?.invtran?.modeldes}`
      }`,
      50,
      yLine + 15
    );
    doc.text(
      `${
        queryContno.substring(0, 1) === "3" ||
        dataTypeSelectLable.value === "SFHP_CAR"
          ? ""
          : `ประเภท: ${arrData?.invtran?.color}`
      }`,
      50,
      yLine + 20
    );
    doc.text(
      `${
        queryContno.substring(0, 1) === "3" ||
        dataTypeSelectLable.value === "SFHP_CAR"
          ? ""
          : `เลขโฉนด: ${arrData?.invtran?.strno}`
      }`,
      50,
      yLine + 25
    );

    doc.text(
      `วันเริ่มทำสัญญา: ${
        arrData?.loan?.sdate ? convertDateThaiShort(arrData?.loan?.sdate) : "-"
      }`,
      120,
      yLine + 5
    );
    doc.text(
      `ชำระงวดแรกเมื่อ: ${
        arrData?.chqtran[0]?.inpdt
          ? convertDateThaiShort(arrData?.chqtran[0]?.inpdt)
          : "-"
      }`,
      120,
      yLine + 10
    );
    doc.text(
      `ยอดกู้: ${
        arrData?.loan?.ncshprc
          ? currencyFormatPoint(arrData?.loan?.ncshprc)
          : "-"
      } บาท`,
      120,
      yLine + 15
    );

    doc.text(
      `วันที่คิดดอกเบี้ย: ${
        arrData?.loan?.startdate
          ? `${convertDateThaiShort(
              arrData?.loan?.startdate
            )} - ${convertDateThaiShort(arrData?.loan?.enddate)}`
          : "-"
      }`,
      120,
      yLine + 20
    );
    doc.setTextColor(255, 0, 0);
    doc.text(
      `ต้นคงเหลือ: ${
        arrData?.loan?.tonkong
          ? currencyFormatPoint(arrData?.loan?.tonkong)
          : "-"
      } บาท`,
      120,
      yLine + 25
    );
    doc.text(
      `ค้างดอกเบี้ย: ${
        arrData?.loan?.flag === 1
          ? currencyFormatPoint(arrData?.loan?.kangdok + arrData?.loan?.dok)
          : currencyFormatPoint(arrData?.loan?.kangdok)
      } บาท`,
      120,
      yLine + 30
    );
    doc.text(
      `รวมทุนฟ้อง: ${
        arrData?.loan?.flag === 1
          ? currencyFormatPoint(
              arrData?.loan?.kangdok +
                arrData?.loan?.dok +
                arrData?.loan?.tonkong
            )
          : currencyFormatPoint(arrData?.loan?.kangdok + arrData?.loan?.tonkong)
      } บาท`,
      120,
      yLine + 35
    );

    // สร้างตาราง
    const tableColumn = [
      "ลำดับ",
      "วันที่ชำระ",
      "จำนวนวันที่ค้าง",
      "ยอดเงินที่ชำระ",
      "ดอกเบี้ย",
      "เงินต้น",
      "ดอกเบี้ยที่ค้าง",
      "ต้นคงเหลือ",
    ];

    const tableRows = [];
    let data;
    if (selectedRows.length > 0) {
      data = selectedRows;
    } else {
      data = arrayTable;
    }
    let totalDays = 0;
    let totalPayment = 0;
    let totalDUEINTEFF = 0;
    let totalDUETONEFF = 0;
    let totalKangDok = 0;
    data.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.Inpdt ? convertDateThaiShort(item.Inpdt) : "-",
        item.Days ? item.Days : 0,
        item.NETPAY ? currencyFormatPoint(item.NETPAY) : 0,
        item.DUEINTEFF ? currencyFormatPoint(item.DUEINTEFF) : 0,
        item.DUETONEFF ? currencyFormatPoint(item.DUETONEFF) : 0,
        item.KangDok ? currencyFormatPoint(item.KangDok) : 0,
        item.Ton ? currencyFormatPoint(item.Ton) : 0,
      ];
      tableRows.push(rowData);

      totalDays += Number(item.Days || 0);
      totalPayment += Number(item.NETPAY || 0);
      totalDUEINTEFF += Number(item.DUEINTEFF || 0);
      totalDUETONEFF += Number(item.DUETONEFF || 0);
      totalKangDok += Number(item.KangDok || 0);
    });

    tableRows.push([
      "",
      "รวมทั้งหมด",
      `${currencyFormatComma(totalDays)} วัน`,
      `${currencyFormatPoint(totalPayment)} บาท`,
      `${currencyFormatPoint(totalDUEINTEFF)} บาท`,
      `${currencyFormatPoint(totalDUETONEFF)} บาท`,
      `${currencyFormatPoint(totalKangDok)} บาท`,
      "",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yLine + 40,
      theme: "striped",
      styles: {
        font: "THSarabunNew",
        fontSize: 12,
        textColor: [0, 0, 0],
        halign: "center",
      },
      headStyles: { fillColor: [0, 0, 139], textColor: [255, 255, 255] }, // หัวตารางสีน้ำเงินเข้ม
      alternateRowStyles: { fillColor: [173, 216, 230] }, // แถวสีน้ำเงินอ่อน
      rowStyles: { fillColor: [255, 255, 255] }, // แถวสีขาว

      didParseCell: function (data) {
        const isSummaryRow = data.row.cells[1]?.raw === "รวมทั้งหมด";

        if (isSummaryRow && data.section === "body") {
          data.cell.styles.textColor = [0, 0, 255]; // สีน้ำเงิน
          data.cell.styles.fontStyle = "bold"; // ตัวหนา
          data.cell.styles.fontSize = "14";
        }
      },
    });

    if (arrData?.arpay) {
      // ✅ เพิ่มหน้าใหม่
      doc.addPage();
      // ✅ หัวข้อ
      let yLine = 20;

      doc.setFontSize(16);
      doc.setFont("THSarabunNew", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(
        `ตารางนัดชำระสัญญา ${arrData?.arpay[0]?.contno}`,
        105,
        yLine,
        null,
        null,
        "center"
      );
      yLine += 5;
      // ข้อมูลเลขที่สัญญา
      doc.setFontSize(14);
      doc.text(
        `ผู้ทำสัญญา : ${arrData?.customer[0]?.name}`,
        105,
        yLine,
        null,
        null,
        "center"
      );

      doc.setFont("THSarabunNew", "normal");
      if (
        arrData?.guarantor?.length > 0 &&
        queryContno.substring(0, 1) !== "1"
      ) {
        arrData.guarantor.forEach((data, index) => {
          yLine += 6; // เพิ่มค่า yLine ทีละ 5
          doc.text(
            `คนค้ำที่ ${index + 1}: ${data.name}`,
            105,
            yLine,
            null,
            null,
            "center"
          );
        });
      }

      // ✅ สร้างตารางจาก resQuery[0].array
      const scheduleColumn = [
        "งวดที่",
        "วันที่นัดชำระ",
        "ยอดที่ต้องชำระ (บาท)",
      ];
      const scheduleRows = [];

      const scheduleData = arrData?.arpay; // ดึงจากข้อมูลคุณส่งมา

      scheduleData.forEach((item) => {
        scheduleRows.push([
          item.nopay,
          convertDateThaiShort(item.ddate),
          currencyFormatPoint(item.damt),
        ]);
      });
      yLine += 5;
      doc.autoTable({
        head: [scheduleColumn],
        body: scheduleRows,
        startY: yLine,
        theme: "striped",
        styles: {
          font: "THSarabunNew",
          fontSize: 12,
          halign: "center",
        },
        headStyles: {
          fillColor: [21, 101, 192], // ฟ้าเข้ม
          textColor: [255, 255, 255],
        },
        alternateRowStyles: {
          fillColor: [227, 242, 253], // ฟ้าอ่อน
        },
      });
    }

    // ดาวน์โหลด PDF
    doc.save(`ข้อมูลสัญญา ${queryContno}.pdf`);
  };

  const generateLeasingDataPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont("THSarabunNew", "bold");
    // ส่วนหัวของเอกสาร
    doc.text("รายละเอียดสัญญา", 105, 15, null, null, "center");
    let yLine = 20;
    // ข้อมูลเลขที่สัญญา
    doc.setFontSize(14);
    doc.text(
      `ผู้ทำสัญญา : ${arrData?.customer[0]?.name || "-"}`,
      105,
      yLine,
      null,
      null,
      "center"
    );

    doc.setFont("THSarabunNew", "normal");
    if (arrData?.guarantor?.length > 0 && queryContno.substring(0, 1) !== "1") {
      arrData.guarantor.forEach((data, index) => {
        yLine += 6; // เพิ่มค่า yLine ทีละ 5
        doc.text(
          `คนค้ำที่ ${index + 1}: ${data.name || "-"}`,
          105,
          yLine,
          null,
          null,
          "center"
        );
      });
    }
    yLine += 5;
    doc.text(
      `เลขที่สัญญา: ${arrData?.customer[0]?.contno || "-"}`,
      50,
      yLine + 5
    );
    doc.text(
      `${`ประเภท : ${arrData?.invtran?.baabdes || "-"}`}`,
      50,
      yLine + 10
    );
    doc.text(`${`รุ่น: ${arrData?.invtran?.modeldes || "-"}`}`, 50, yLine + 15);
    doc.text(`${`สี: ${arrData?.invtran?.color || "-"}`}`, 50, yLine + 20);
    doc.text(
      `${`เลขตัวถัง: ${arrData?.invtran?.strno || "-"}`}`,
      50,
      yLine + 25
    );

    doc.text(
      `${`ทะเบียน: ${arrData?.invtran?.regno} ${arrData?.invtran?.dorecv}`}`,
      50,
      yLine + 30
    );

    doc.text(`${`ปีจดทะเบียน: ${arrData?.invtran?.manuyr}`}`, 50, yLine + 35);

    doc.text(
      `วันเริ่มทำสัญญา: ${
        arrData?.loan?.sdate ? convertDateThaiShort(arrData?.loan?.sdate) : "-"
      }`,
      120,
      yLine + 5
    );
    doc.text(
      `ชำระงวดแรกเมื่อ: ${
        arrData?.result[0]?.ddate
          ? convertDateThaiShort(arrData?.result[0]?.ddate)
          : "-"
      }`,
      120,
      yLine + 10
    );
    doc.text(
      `ยอดเช่าซื่้อ: ${
        arrData?.loan?.balanc ? currencyFormatPoint(arrData?.loan?.balanc) : "-"
      } บาท`,
      120,
      yLine + 15
    );

    doc.text(
      `ยอดจัด: ${
        arrData?.loan?.ncshprc
          ? `${currencyFormatPoint(arrData?.loan?.ncshprc)} `
          : "-"
      }`,
      120,
      yLine + 20
    );
    doc.setTextColor(255, 0, 0);
    doc.text(
      `ผ่อนทั้งหมด: ${
        arrData?.loan?.tnopay ? currencyFormatPoint(arrData?.loan?.tnopay) : "-"
      } งวด`,
      120,
      yLine + 25
    );
    doc.text(
      `จ่ายมาทั้งหมด: ${currencyFormatPoint(
        arrData?.loan?.total_used_net_pay
      )} บาท`,
      120,
      yLine + 30
    );
    doc.text(
      `ลูกหนี้คงเหลือ: ${currencyFormatPoint(
        arrData?.loan?.remaining_debt
      )} บาท`,
      120,
      yLine + 35
    );
    // สร้างตาราง
    const tableColumn = [
      // "ลำดับ",
      "งวดที่",
      "วันดิว",
      "ค่างวด",
      "วันที่ชำระ",
      "จำนวนรับ",
      "จำนวนวันลาช้า",
      "เงินค้าง",
      "ลูกหนี้คงเหลือ",
    ];

    const tableRows = [];
    let data;
    if (selectedRows.length > 0) {
      data = selectedRows;
    } else {
      data = arrayTable;
    }

    let totalLateDate = 0;
    let totalNoPaid = 0;
    let totalPaid = 0;
    let previousNoPay = null;
    let previousDdate = null;
    let previousDamt = null;

    data.forEach((item, index) => {
      const showNoPay = item?.nopay !== previousNoPay ? item?.nopay : "";
      const showDdate = item?.ddate !== previousDdate ? item?.ddate : "";
      const showDamt = item?.nopay !== previousNoPay ? item?.damt : "";

      const rowData = [
        // index + 1,
        showNoPay ? showNoPay : "",
        showDdate ? convertDateThaiShort(showDdate) : "",
        showDamt ? currencyFormatPoint(showDamt) : "",
        item?.pay_date ? dayjs(item?.pay_date).format("DD/MM/YYYY") : 0,
        item?.paid ? currencyFormatPoint(item?.paid) : 0,
        item?.late_days ? item?.late_days : 0,
        item?.remaining ? currencyFormatPoint(item?.remaining) : 0,
        item?.remain_debt_total
          ? currencyFormatPoint(item?.remain_debt_total)
          : 0,
      ];

      tableRows.push(rowData);
      previousNoPay = item.nopay;
      previousDdate = item?.ddate;
      previousDamt = item?.damt;

      totalLateDate += Number(item.late_days || 0);
      totalNoPaid += Number(item.remaining || 0);
      totalPaid += Number(item.paid || 0);
    });

    tableRows.push([
      "ค้างค่างวด",
      `฿${currencyFormatPoint(resultLeasing.resultNopay)}`,
      `${arrData?.loan.unpaid_count} งวด`,
      "",
      `฿${currencyFormatPoint(totalPaid)}`,
      `${currencyFormatComma(totalLateDate)} วัน`,
      `฿${currencyFormatPoint(totalNoPaid)}`,
      `฿${currencyFormatPoint(arrData?.loan?.remaining_debt)}`,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yLine + 40,
      theme: "striped",
      styles: {
        font: "THSarabunNew",
        fontSize: 12,
        textColor: [0, 0, 0],
        halign: "center",
      },

      headStyles: { fillColor: [0, 0, 139], textColor: [255, 255, 255] }, // หัวตารางสีน้ำเงินเข้ม
      alternateRowStyles: { fillColor: [173, 216, 230] }, // แถวสีน้ำเงินอ่อน
      rowStyles: { fillColor: [255, 255, 255] }, // แถวสีขาว

      didParseCell: function (data) {
        if (
          data.row.cells[0]?.raw === "ค้างค่างวด" &&
          data.section === "body"
        ) {
          data.cell.styles.textColor = "blue"; // สีเขียว
          data.cell.styles.fontStyle = "bold"; // ตัวหนา
          data.cell.styles.fontSize = "14"; // ตัวหนา
        }
      },
    });

    // ดาวน์โหลด PDF
    doc.save(`ข้อมูลสัญญา ${queryContno}.pdf`);
  };

  const formatDateSafe = (dateStr) => {
    try {
      const date = dayjs(dateStr);
      return date.isValid() ? date.format("DD/MM/YYYY") : "-";
    } catch (e) {
      return "-";
    }
  };

  if (
    dataTypeSelectLable?.value === "SFHP_CAR" ||
    dataTypeSelectLable?.value === "VSFHP"
  ) {
    console.log("VSFHP_CAR---->", dataTypeSelectLable);
    console.log("arrayTable---->", arrayTable);

    columns = [
      // {
      //   title: "ลำดับ",
      //   key: "index", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
      //   align: "center",
      //   render: (text, record, index) => (
      //     <>{index + 1}</> // ใช้ index ที่ถูกส่งมาจาก Table เพื่อเพิ่มลำดับแถว
      //   ),
      // },
      {
        title: "งวดที่",
        key: "nopay",
        align: "center",
        render: (text, record, index) => {
          const sameNopay = arrayTable?.filter(
            (item) => item.nopay === record.nopay
          );
          const firstIndex = arrayTable?.findIndex(
            (item) => item.nopay === record.nopay
          );

          if (index === firstIndex) {
            return {
              children: record.nopay,
              props: {
                rowSpan: sameNopay.length,
              },
            };
          } else {
            return {
              children: null,
              props: {
                rowSpan: 0,
              },
            };
          }
        },
      },
      {
        title: "วันดิว",
        align: "center",
        render: (text, record, index) => {
          const sameDdate = arrayTable?.filter(
            (item) => item.ddate === record.ddate
          );
          const firstIndex = arrayTable?.findIndex(
            (item) => item.ddate === record.ddate
          );

          if (index === firstIndex) {
            return {
              children: dayjs(record.ddate).format("DD/MM/YYYY"),
              props: {
                rowSpan: sameDdate.length,
              },
            };
          } else {
            return {
              children: null,
              props: {
                rowSpan: 0,
              },
            };
          }
        },
      },

      {
        title: "ค่างวด",
        align: "center",
        render: (text, record, index) => {
          const sameDdate = arrayTable?.filter(
            (item) => item.nopay === record.nopay
          );
          const firstIndex = arrayTable?.findIndex(
            (item) => item.nopay === record.nopay
          );

          if (index === firstIndex) {
            return {
              children: currencyFormatPoint(record?.damt),
              props: {
                rowSpan: sameDdate.length,
              },
            };
          } else {
            return {
              children: null,
              props: {
                rowSpan: 0,
              },
            };
          }
        },
      },

      {
        title: "วันที่ชำระ",
        align: "center",
        render: (record) => (
          <>
            {record?.pay_date
              ? dayjs(record?.pay_date).format("DD/MM/YYYY")
              : null}
          </>
        ),
      },
      {
        title: "จำนวนรับ",
        align: "center",
        render: (record) => <>{currencyFormatPoint(record?.paid) || 0}</>,
      },
      {
        title: "จำนวนวันล่าช้า",
        align: "center",
        render: (text, record) => <>{record?.late_days || 0}</>,
      },
      {
        title: "เงินค้าง",
        align: "center",
        render: (text, record) => (
          <>{currencyFormatPoint(record?.remaining) || 0}</>
        ),
      },
      {
        title: "ลูกหนี้คงเหลือ",
        align: "center",
        render: (text, record) => (
          <>{currencyFormatPoint(record?.remain_debt_total) || 0}</>
        ),
      },
    ];

    return (
      <>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card style={{ marginBottom: "10px" }}>
            <Row>
              <Col span={"24"} style={{ textAlign: "end" }}>
                <Space direction="vertical" size={12}>
                  <Tooltip
                    placement="bottom"
                    title="วันที่คิดดอกเบี้ยถึง"
                    arrow={mergedArrow}
                  >
                    <DatePicker
                      size="large"
                      style={{
                        marginRight: "10px",
                        marginBottom: "10px",
                      }}
                      defaultValue={dayjs()}
                      onChange={handleChange}
                    />
                  </Tooltip>
                </Space>
                <Select
                  style={{
                    width: "auto",
                    marginRight: "5px",
                    marginBottom: "5px",
                  }}
                  onChange={(e, label) => handleTypeContno(e, label)}
                  popupMatchSelectWidth={false}
                  options={optionsDataType}
                  size="large"
                  placeholder="เลือกประเภทสัญญา"
                />
                <Search
                  placeholder="ค้นหาสัญญา"
                  onSearch={onQuery}
                  enterButton
                  value={queryContno}
                  onChange={(e) => handleChangeContno(e.target.value)}
                  style={{
                    width: 200,
                  }}
                  size="large"
                />
              </Col>
            </Row>
          </Card>
          {arrData ? (
            <Card>
              <Row>
                <Col
                  span={"12"}
                  style={{
                    textAlign: "start",
                  }}
                >
                  <b>ผู้ทำสัญญา : {arrData?.customer[0]?.name}</b>
                  <br />
                  {arrData?.guarantor?.length > 0 &&
                  queryContno.substring(0, 1) !== "1"
                    ? arrData.guarantor.map((data, index) => (
                        <>
                          <b key={index}>
                            คนค้ำที่ {data?.garno}: {data?.name}
                          </b>
                          <br />
                        </>
                      ))
                    : null}
                </Col>
                <Col
                  span={"12"}
                  style={{
                    textAlign: "end",
                  }}
                >
                  <Tooltip
                    placement="bottom"
                    title="พิมพ์ข้อมูล PDF"
                    arrow={mergedArrow}
                  >
                    <PrinterOutlined
                      style={{
                        fontSize: "40px",
                        color: "blue",
                        cursor: "pointer",
                      }}
                      key="print"
                      onClick={() => {
                        if (arrData.result) {
                          generateLeasingDataPDF();
                        } else {
                          message.error("ไม่สามารถพิพม์รายงานได้ !");
                        }
                      }}
                    />
                  </Tooltip>
                </Col>
              </Row>

              <Divider>
                รายละเอียดสัญญา{" "}
                <FontAwesomeIcon
                  icon={faCarSide}
                  size="2x"
                  color={"blue"}
                  style={{ marginLeft: "10px" }}
                />
              </Divider>
              <Row gutter={[16, 16]}>
                <Col span={12} style={{ textAlign: "center" }}>
                  <p>
                    <b>เลขที่สัญญา : </b>{" "}
                    {arrData?.customer ? arrData?.customer[0]?.contno : null}
                  </p>
                  <>
                    <p>
                      <b>{"ประเภท :"}</b> {arrData?.invtran?.baabdes}
                    </p>
                    <p>
                      <b>{"รุ่น :"}</b> {arrData?.invtran?.modeldes}
                    </p>
                    <p>
                      <b>{"สี : "}</b> {arrData?.invtran?.color}
                    </p>
                    <p>
                      <b>{"เลขตัวถัง : "}</b> {arrData?.invtran?.strno}
                    </p>
                    <p>
                      <b>{"ทะเบียน : "}</b> {arrData?.invtran?.regno}{" "}
                      {arrData?.invtran?.dorecv}
                    </p>
                    <p>
                      <b>{"ปีจดทะเบียน : "}</b> {arrData?.invtran?.manuyr}
                    </p>
                  </>
                </Col>

                <Col span={12} style={{ textAlign: "center" }}>
                  <p>
                    <b>วันเริ่มทำสัญญา : </b>
                    {arrData?.loan?.sdate
                      ? dayjs(arrData?.loan?.sdate).format("DD/MM/YYYY")
                      : "-"}
                  </p>
                  <p>
                    <b>ชำระงวดแรกเมื่อ : </b>{" "}
                    {formatDateSafe(arrData?.result[0]?.ddate)}
                  </p>
                  <p>
                    <b>ยอดเช่าซื้อ : </b>{" "}
                    {currencyFormatPoint(arrData?.loan?.balanc) || "-"} บาท
                  </p>
                  <p>
                    <b>ยอดจัด : </b>{" "}
                    {currencyFormatPoint(arrData?.loan?.ncshprc) || "-"} บาท
                  </p>
                  {
                    <p>
                      <b>ผ่อนทั้งหมด : </b> {arrData?.loan?.tnopay || "-"} งวด
                    </p>
                  }
                  <p style={{ color: "blue" }}>
                    <b>จ่ายมาทั้งหมด : </b>{" "}
                    {currencyFormatPoint(arrData?.loan?.total_used_net_pay)} บาท
                  </p>
                  <p style={{ color: "red" }}>
                    <b>ลูกหนี้คงเหลือ : </b>{" "}
                    {currencyFormatPoint(arrData?.loan?.remaining_debt) || 0}{" "}
                    บาท
                  </p>
                </Col>
              </Row>
              <Divider />
              <Row>
                <Col span={24}>
                  <Table
                    style={{ marginTop: "10px" }}
                    size="small"
                    pagination={false}
                    columns={columns}
                    dataSource={arrayTable}
                    rowSelection={rowSelection}
                    scroll={{ x: 850 }}
                    footer={() => (
                      <>
                        <p style={{ textAlign: "left", color: "blue" }}>
                          จำนวนรับรวม :{" "}
                          {resultLeasing?.totalPaid
                            ? currencyFormatPoint(resultLeasing?.totalPaid)
                            : 0}
                          {" บาท"}
                        </p>
                        <p style={{ textAlign: "left", color: "red" }}>
                          ค้างค่างวด :{" "}
                          {resultLeasing?.resultNopay
                            ? currencyFormatPoint(resultLeasing?.resultNopay)
                            : 0}
                          {" บาท"}
                        </p>
                        <p style={{ textAlign: "left", color: "orange" }}>
                          งวดที่ค้าง : {arrData?.loan?.unpaid_count || "-"}
                          {" งวด"}
                        </p>
                        <p style={{ textAlign: "left", color: "orange" }}>
                          จำนวนวันที่ค้างรวม :{" "}
                          {resultLeasing?.totalLateDate
                            ? currencyFormatComma(resultLeasing?.totalLateDate)
                            : 0}
                          {" วัน"}
                        </p>
                      </>
                    )}
                  />
                </Col>
              </Row>
            </Card>
          ) : (
            <Empty />
          )}
        </Spin>
      </>
    );
  } else {
    console.log("esle ---->", dataTypeSelectLable);
    columns = [
      {
        title: "ลำดับ",
        key: "index", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
        align: "center",
        render: (text, record, index) => (
          <>{index + 1}</> // ใช้ index ที่ถูกส่งมาจาก Table เพื่อเพิ่มลำดับแถว
        ),
      },
      {
        title: "วันที่ชำระ",
        align: "center",
        render: (record) => (
          <>
            {record?.Inpdt ? dayjs(record?.Inpdt).format("DD/MM/YYYY") : null}
          </>
        ),
      },
      {
        title: "จำนวนวันที่ค้าง",
        align: "center",
        render: (record) => <>{record?.Days ? record?.Days : "-"}</>,
      },
      {
        title: "ยอดเงินที่ชำระ",
        align: "center",
        render: (text, record) => (
          <>{record?.NETPAY ? currencyFormatComma(record?.NETPAY) : 0}</>
        ),
      },
      {
        title: "ดอกเบี้ย",
        align: "center",
        render: (text, record) => (
          <>{record?.DUEINTEFF ? currencyFormatPoint(record?.DUEINTEFF) : 0}</>
        ),
      },
      {
        title: "เงินต้น",
        align: "center",
        render: (text, record) => (
          <>{record?.DUETONEFF ? currencyFormatPoint(record?.DUETONEFF) : 0}</>
        ),
      },
      {
        title: "ดอกเบี้ยที่ค้าง",
        dataIndex: "CONTNO",
        key: "CONTNO",
        align: "center",
        render: (text, record) => (
          <>{record?.KangDok ? currencyFormatPoint(record?.KangDok) : 0}</>
        ),
      },
      {
        title: "ต้นคงเหลือ",
        dataIndex: "EXP_PRD",
        key: "EXP_PRD",
        align: "center",
        render: (text, record) => (
          <>{record.Ton ? currencyFormatPoint(record.Ton) : 0}</>
        ),
      },
    ];
    return (
      <>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card style={{ marginBottom: "10px" }}>
            <Row>
              <Col span={"24"} style={{ textAlign: "end" }}>
                <Space direction="vertical" size={12}>
                  <Tooltip
                    placement="bottom"
                    title="วันที่คิดดอกเบี้ยถึง"
                    arrow={mergedArrow}
                  >
                    <DatePicker
                      size="large"
                      style={{
                        marginRight: "10px",
                        marginBottom: "10px",
                      }}
                      defaultValue={dayjs()}
                      onChange={handleChange}
                    />
                  </Tooltip>
                </Space>
                <Select
                  style={{
                    width: "auto",
                    marginRight: "5px",
                    marginBottom: "5px",
                  }}
                  onChange={(e, label) => handleTypeContno(e, label)}
                  popupMatchSelectWidth={false}
                  options={optionsDataType}
                  size="large"
                  placeholder="เลือกประเภทสัญญา"
                />
                <Search
                  placeholder="ค้นหาสัญญา"
                  onSearch={onQuery}
                  enterButton
                  value={queryContno}
                  onChange={(e) => handleChangeContno(e.target.value)}
                  style={{
                    width: 200,
                  }}
                  size="large"
                />
              </Col>
            </Row>
          </Card>
          {arrData ? (
            <Card>
              <Row>
                <Col
                  span={"12"}
                  style={{
                    textAlign: "start",
                  }}
                >
                  <b>
                    ผู้ทำสัญญา :{" "}
                    {arrData?.customer.length > 0
                      ? arrData?.customer[0]?.name
                      : null}
                  </b>
                  <br />
                  {arrData?.guarantor?.length > 0 &&
                  queryContno.substring(0, 1) !== "1"
                    ? arrData.guarantor.map((data, index) => (
                        <>
                          <b key={index}>
                            คนค้ำที่ {data.garno}: {data.name}
                          </b>
                          <br />
                        </>
                      ))
                    : null}
                </Col>
                <Col
                  span={"12"}
                  style={{
                    textAlign: "end",
                  }}
                >
                  <Tooltip
                    placement="bottom"
                    title="พิมพ์ข้อมูล PDF"
                    arrow={mergedArrow}
                  >
                    <PrinterOutlined
                      style={{
                        fontSize: "40px",
                        color: "blue",
                        cursor: "pointer",
                      }}
                      key="print"
                      onClick={() => {
                        if (arrData.resultdata) {
                          generatePDF();
                        } else {
                          message.error("ไม่สามารถพิพม์รายงานได้ !");
                        }
                      }}
                    />
                  </Tooltip>
                </Col>
              </Row>

              <Divider>
                รายละเอียดสัญญา{" "}
                <FontAwesomeIcon
                  icon={
                    queryContno.substring(0, 1) === "3"
                      ? faCarSide
                      : queryContno.substring(0, 1) === "1"
                      ? faMapLocationDot
                      : null
                  }
                  size="2x"
                  color={
                    queryContno.substring(0, 1) === "3"
                      ? "blue"
                      : queryContno.substring(0, 1) === "1"
                      ? "green"
                      : null
                  }
                  style={{ marginLeft: "10px" }}
                />
              </Divider>
              <Row gutter={[16, 16]}>
                <Col span={12} style={{ textAlign: "center" }}>
                  <p>
                    <b>เลขที่สัญญา : </b>{" "}
                    {arrData?.customer ? arrData?.customer[0]?.contno : null}
                  </p>
                  <>
                    <p>
                      <b>
                        {queryContno.substring(0, 1) === "3"
                          ? "ประเภท "
                          : "จังหวัด "}
                        :{" "}
                      </b>{" "}
                      {arrData?.invtran?.type}
                    </p>
                    <p>
                      <b>
                        {queryContno.substring(0, 1) === "3" ? "รุ่น" : "อำเภอ"}{" "}
                        :{" "}
                      </b>{" "}
                      {arrData?.invtran?.modeldes}
                    </p>
                    <p>
                      <b>
                        {queryContno.substring(0, 1) === "3" ? "สี" : "ประเภท"}{" "}
                        :{" "}
                      </b>{" "}
                      {arrData?.invtran?.color}
                    </p>
                    <p>
                      <b>
                        {queryContno.substring(0, 1) === "3"
                          ? "เลขตัวถัง"
                          : queryContno.substring(0, 1) === "1"
                          ? "เลขโฉนด"
                          : null}{" "}
                        :{" "}
                      </b>{" "}
                      {arrData?.invtran?.strno}
                    </p>
                  </>
                </Col>

                <Col span={12} style={{ textAlign: "center" }}>
                  <p>
                    <b>วันเริ่มทำสัญญา : </b>
                    {arrData?.loan?.sdate
                      ? dayjs(arrData?.loan?.sdate).format("DD/MM/YYYY")
                      : "-"}
                  </p>
                  <p>
                    <b>ชำระงวดแรกเมื่อ : </b>{" "}
                    {formatDateSafe(arrData?.resultdata?.[0]?.Inpdt)}
                    บาท
                  </p>
                  <p>
                    <b>ยอดกู้ : </b>{" "}
                    {arrData?.loan?.ncshprc
                      ? currencyFormatPoint(arrData?.loan?.ncshprc)
                      : 0}{" "}
                    บาท
                  </p>
                  {
                    <p>
                      <b>วันที่คิดดอกเบี้ย : </b>
                      {arrData?.loan?.startdate
                        ? `${dayjs(arrData?.loan?.startdate).format(
                            "DD/MM/YYYY"
                          )} -
                        ${dayjs(arrData?.loan?.enddate).format("DD/MM/YYYY")}`
                        : "-"}
                    </p>
                  }
                  <p style={{ color: "red" }}>
                    <b>ต้นคงเหลือ : </b>{" "}
                    {arrData?.loan?.tonkong
                      ? currencyFormatPoint(arrData?.loan?.tonkong)
                      : 0}{" "}
                    บาท
                  </p>
                  <p style={{ color: "red" }}>
                    <b>ค้างดอกเบี้ย : </b>{" "}
                    {arrData?.loan?.flag === 1
                      ? currencyFormatPoint(
                          arrData?.loan?.kangdok + arrData?.loan?.dok
                        ) || 0
                      : arrData?.loan?.kangdok || 0}{" "}
                    บาท
                  </p>
                  <p style={{ color: "red" }}>
                    <b>รวมทุนฟ้อง : </b>{" "}
                    {arrData?.loan?.flag === 1
                      ? currencyFormatPoint(
                          arrData?.loan?.kangdok +
                            arrData?.loan?.dok +
                            arrData?.loan?.tonkong
                        ) || 0
                      : arrData?.loan?.kangdok + arrData?.loan?.tonkong ||
                        0}{" "}
                    บาท
                  </p>
                </Col>
              </Row>
              <Divider />
              <Row>
                <Col span={24}>
                  {arrData?.loan.flag === 1 ? (
                    <Table
                      style={{ marginTop: "10px" }}
                      size="small"
                      columns={columns}
                      dataSource={arrayTable}
                      rowSelection={rowSelection}
                      scroll={{ x: 850 }}
                      footer={() => (
                        <>
                          <p style={{ textAlign: "left", color: "orange" }}>
                            จำนวนวันที่ค้าง : {arrData?.loan?.days}
                            {" วัน"}
                          </p>
                          <p style={{ textAlign: "left", color: "blue" }}>
                            ยอดเงินที่ชำระ :{" "}
                            {result?.totalPayment
                              ? currencyFormatPoint(result?.totalPayment)
                              : 0}
                            {" บาท"}
                          </p>
                          <p style={{ textAlign: "left", color: "red" }}>
                            ดอกเบี้ยที่ชำระ :{" "}
                            {result?.totalKongdok
                              ? currencyFormatPoint(result?.totalKongdok)
                              : 0}
                            {" บาท"}
                          </p>
                          <p style={{ textAlign: "left", color: "green" }}>
                            เงินต้นที่ชำระ :{" "}
                            {result?.totalDUETONEFF
                              ? currencyFormatPoint(result?.totalDUETONEFF)
                              : 0}
                            {" บาท"}
                          </p>
                        </>
                      )}
                    />
                  ) : (
                    <>
                      <Empty>
                        <p style={{ color: "red" }}>
                          ***ยังไม่มีการจ่ายค่างวด***
                        </p>
                      </Empty>
                    </>
                  )}
                </Col>
              </Row>
            </Card>
          ) : (
            <Empty />
          )}
        </Spin>
      </>
    );
  }
};

const DetailPayment = MotionHoc(Main);
export default DetailPayment;
