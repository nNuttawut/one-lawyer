import {
  Col,
  Row,
  DatePicker,
  Card,
  message,
  Spin,
  Tooltip,
  Tag,
  Select,
  notification,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import MotionHoc from "../../../utils/MotionHoc";
import {
  baseUrl,
  GET_EXPENSES_LIST,
  GET_LAWSUIT_LIST,
  HEADERS_EXPORT,
} from "../../API/apiUrls";
import ReactECharts from "echarts-for-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InboxOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

//use redux
import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import CurrencyFormat from "../../../hook/CurrencyFormat";
import { optionsLocat } from "../../../utils/constant/LocatOption";
import LoadLawyers from "../../../hook/LoadLawyers";
import LoadCompanies from "../../../hook/LoadCompanies";
import DataCheck from "./modal/DataCheck";

const Main = () => {
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [loading, setLoading] = useState();
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [arrow, setArrow] = useState("Show");
  const [cancelData, setCancelData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalCheckData, setIsModalCheckData] = useState(false);
  const [statusData, setStatusData] = useState();
  const [isActive, setIsActive] = useState(false);
  const [lawyerName, setLawyerName] = useState();
  const [lawyersOption, setLawyersOption] = useState();
  const [companiesOption, setCompaniesOption] = useState();
  const { Option } = Select;
  const [companieSelect, setCompanieSelect] = useState();
  const [lawsuitsData, setLawsuitsData] = useState([]);

  const [lawyersList, setLoadingData] = LoadLawyers();
  const [companiesListCompany, setLoadingDataCompany] = LoadCompanies();
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();

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

  useEffect(() => {
    BarChart();
  }, [cancelData]);

  useEffect(() => {
    setLoadingData(true);
    setLoadingDataCompany(true);
  }, [setLoadingData, setLoadingDataCompany]);

  useEffect(() => {
    if (lawyersList) {
      setOptionLawyer();
    }
    if (companiesListCompany) {
      setOptionCompany();
    }
  }, [lawyersList, companiesListCompany]);

  const loadSelectCompany = (value) => {
    const selectedOption = value.find((option) => option.value === 2);
    if (selectedOption) {
      setCompanieSelect(selectedOption); // เก็บข้อมูลทั้งหมดใน state
    }
  };

  const setOptionCompany = () => {
    let options;
    if (userCompany === "3") {
      options = companiesListCompany
        .filter((item) => item.id === 3)
        .map((item) => ({
          value: item.id,
          label: item.company_name,
          address: item.address,
        }));
    } else {
      options = companiesListCompany
        .filter((item) => item.id === 1 || item.id === 2)
        .map((item) => ({
          value: item.id,
          label: item.company_name,
          address: item.address,
        }));
    }

    setCompaniesOption(options);
    loadSelectCompany(options);
  };

  const setOptionLawyer = () => {
    let companySelect = null;

    if (dataArr?.COMPANY_ID === 3) {
      companySelect = lawyersList?.filter(
        (item) =>
          item.COMPANY_ID === 3 && (item.ROLE_ID === 3 || item.ROLE_ID === 4)
      );
    } else {
      companySelect = lawyersList?.filter(
        (item) =>
          (item.COMPANY_ID === 1 || item.COMPANY_ID === 2) &&
          (item.ROLE_ID === 3 || item.ROLE_ID === 4)
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

    let lawyerSet = lawyersList.find((item) => item.id === 3);
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
        }
      }
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );

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
      let filteredData;

      if (userCompany === "3") {
        filteredData = data.filter((item) => {
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
        filteredData = data.filter((item) => {
          const branch = item.LOCAT;
          if (!branch) return false; // ไม่มี branch ไม่ผ่านเงื่อนไข

          return optionsLocat.some((opt) => branch.includes(opt.label));
        });
      }

      const preData = groupByCreatedDateWithContno(filteredData, lawsuit);
      const useData = preData?.filter((item) => item.withdraw_process_id === 3);
      setDataArr(useData);
      setArrayTable(useData);

      console.log("newData", useData);

      let dataThisYear = [];

      dataThisYear = useData
        .filter((item) => {
          // ตรวจสอบว่าปีของ `item.datetime` ตรงกับปีปัจจุบัน
          return (
            dayjs(item.withdraw_datetime).format("YYYY") ===
            dayjs().format("YYYY")
          );
        })
        .sort((a, b) =>
          dayjs(a.withdraw_datetime).isBefore(dayjs(b.withdraw_datetime))
            ? -1
            : 1
        );

      let groupedByMonth = {};

      dataThisYear.forEach((item) => {
        let month = dayjs(item.withdraw_datetime).format("MMM");
        let result = parseFloat(item.withdraw || 0);

        const dateRecord = dayjs(item.withdraw_datetime).startOf("day");
        const dateCurrent = dayjs().startOf("day");
        const diffInDays = dateCurrent.diff(dateRecord, "day");

        if (!groupedByMonth[month]) {
          groupedByMonth[month] = {
            totalBill: 0,
            totalAdvanePaySuccess: 0,
            clearSuccess: 0,
            clearSuccessData: [],
            totalAdvanePayUnSuccess: 0,
            clearUnSuccess: 0,
            clearUnSuccessData: [],
            totalAdvanePayUnSuccessOverSevenDay: 0,
            clearUnSuccessOverSevenDay: 0,
            clearUnSuccessOverSevenDayData: [],
            item: [],
          };
        }

        groupedByMonth[month].totalBill++; // เพิ่มจำนวนข้อมูลทั้งหมดในเดือนนั้น
        groupedByMonth[month].item.push(item); // เพิ่มข้อมูลของเดือนนั้นลงไปใน items array
        if (item.pay_type_id === 1) {
          groupedByMonth[month].totalAdvanePaySuccess += result;
          groupedByMonth[month].clearSuccess++; // เพิ่มจำนวนข้อมูลทั้งหมดในเดือนนั้น
          groupedByMonth[month].clearSuccessData.push(item); // เพิ่มข้อมูลของเดือนนั้นลงไปใน items array
        } else {
          if (diffInDays > 7) {
            console.log("item.withdraw_datetime", diffInDays);

            groupedByMonth[month].totalAdvanePayUnSuccessOverSevenDay += result;
            groupedByMonth[month].clearUnSuccessOverSevenDay++; // เพิ่มจำนวนข้อมูลทั้งหมดในเดือนนั้น
            groupedByMonth[month].clearUnSuccessOverSevenDayData.push(item); // เพิ่มข้อมูลของเดือนนั้นลงไปใน items array
          } else {
            groupedByMonth[month].totalAdvanePayUnSuccess += result;
            groupedByMonth[month].clearUnSuccess++; // เพิ่มจำนวนข้อมูลทั้งหมดในเดือนนั้น
            groupedByMonth[month].clearUnSuccessData.push(item); // เพิ่มข้อมูลของเดือนนั้นลงไปใน items array
          }
        }
      });

      console.log("groupedByMonth", groupedByMonth);

      setCancelData(groupedByMonth);
      setLoading(false);
    } else {
      console.error("data is not an array or is undefined");
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
        pay_mark,
        withdraw,
        pay,
      } = current;

      // ถ้ายังไม่มี reference_no นี้ใน acc ให้สร้าง object ใหม่
      if (!acc[reference_no]) {
        acc[reference_no] = {
          reference_no,
          contnoList: new Set(),
          expenseList: [],
          withdraw_datetime: withdraw_datetime || null,
          key: index + 1,
          COMPANY_ID,
          NNAME,
          withdraw_process_id,
          USER_ID,
          created_date,
          updated_date,
          withdraw_mark,
          pay_type_id,
          pay_datetime,
          pay_mark,
          withdraw: 0, // เริ่มต้นด้วย 0 แล้วสะสมยอด
          pay: 0,
        };
      }

      // เพิ่ม CONTNO ลงใน Set
      acc[reference_no].contnoList.add(CONTNO);

      // เพิ่ม withdraw เข้าไปในยอดรวม
      acc[reference_no].withdraw += parseFloat(withdraw || 0);

      acc[reference_no].pay += parseFloat(pay || 0);

      // เพิ่มข้อมูลเข้า expenseList
      acc[reference_no].expenseList.push(current);

      return acc;
    }, {});

    // แปลงเป็น array และ Set → array
    return Object.values(groupedData).map((group, groupIndex) => ({
      reference_no: group.reference_no,
      contnoList: Array.from(group.contnoList),
      expenseList: group.expenseList,
      withdraw_datetime: group.withdraw_datetime,
      key: groupIndex + 1,
      COMPANY_ID: group.COMPANY_ID,
      lawyerName: group.NNAME,
      withdraw_process_id: group.withdraw_process_id,
      USER_ID: group.USER_ID,
      created_date: group.created_date,
      updated_date: group.updated_date,
      withdraw_mark: group.withdraw_mark,
      pay_type_id: group.pay_type_id,
      pay_datetime: group.pay_datetime,
      pay_mark: group.pay_mark,
      withdraw: group.withdraw,
      pay: group.pay,
    }));
  };

  const BarChart = () => {
    const chartData = [
      [
        "เดือน",
        "จำนวนเบิกทั้งหมด",
        "เคลียร์สำเร็จ",
        "รอดำเนินการ",
        "เกินกำหนดเคลียร์",
      ], // Header
      ...Object.entries(cancelData).map(([month, data]) => [
        month,
        data.totalBill,
        data.clearSuccess,
        data.clearUnSuccess,
        data.clearUnSuccessOverSevenDay,
      ]),
    ];

    const option = {
      dataset: {
        source: chartData,
      },
      title: {
        text: "กราฟการเบิกเงินทดรองจ่าย",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "category",
      },
      series: [
        {
          name: "ทั้งหมด",
          type: "bar",
          itemStyle: {
            color: "#3357FF",
          },
        },
        {
          name: "เคลียร์สำเร็จ",
          type: "bar",
          itemStyle: {
            color: "#4DFF88",
          },
        },
        {
          name: "รอดำเนินการ",
          type: "bar",
          itemStyle: {
            color: "orange",
          },
        },
        {
          name: "เกินกำหนดเคลียร์",
          type: "bar",
          itemStyle: {
            color: "#FF5733",
          },
        },
      ],
    };

    return (
      <ReactECharts
        option={option}
        style={{ height: 400, width: "100%" }}
        onEvents={{ click: onChartClick }}
      />
    );
  };

  const onChartClick = (params) => {
    const month = params.name; // เช่น "มี.ค."
    const data = cancelData[month]; // ดึงข้อมูลของเดือนนั้น
    console.log(data);

    setSelectedMonth(month);
    setSelectedData(data);
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    renderData(dateString, null);
  };

  const renderData = (cancelData) => {
    let dataThisYear = [];

    if (cancelData) {
      dataThisYear = dataArr
        ?.filter((item) => {
          // ตรวจสอบว่าปีของ `item.datetime` ตรงกับปีปัจจุบัน
          return dayjs(item?.withdraw_datetime).format("YYYY") === cancelData;
        })
        .sort((a, b) =>
          dayjs(a.withdraw_datetime).isBefore(dayjs(b.withdraw_datetime))
            ? -1
            : 1
        );

      let groupedByMonth = {};

      dataThisYear?.forEach((item) => {
        let month = dayjs(item?.withdraw_datetime).format("MMM");
        let result = parseFloat(item?.withdraw || 0);
        const dateRecord = dayjs(item.withdraw_datetime).startOf("day");
        const dateCurrent = dayjs().startOf("day");
        const diffInDays = dateCurrent.diff(dateRecord, "day");
        if (!groupedByMonth[month]) {
          groupedByMonth[month] = {
            totalBill: 0,
            totalAdvanePaySuccess: 0,
            clearSuccess: 0,
            totalAdvanePayUnSuccess: 0,
            clearUnSuccess: 0,
            totalAdvanePayUnSuccessOverSevenDay: 0,
            clearUnSuccessOverSevenDay: 0,
            item: [],
          };
        }
        groupedByMonth[month].item.push(item); // เพิ่มข้อมูลของเดือนนั้นลงไปใน items array
        groupedByMonth[month].totalBill++; // เพิ่มจำนวนข้อมูลทั้งหมดในเดือนนั้น
        if (item.pay_type_id === 1) {
          groupedByMonth[month].totalAdvanePaySuccess += result;
          groupedByMonth[month].clearSuccess++; // เพิ่มจำนวนข้อมูลทั้งหมดในเดือนนั้น
        } else {
          if (diffInDays > 7) {
            groupedByMonth[month].totalAdvanePayUnSuccessOverSevenDay += result;
            groupedByMonth[month].clearUnSuccessOverSevenDay++; // เพิ่มจำนวนข้อมูลทั้งหมดในเดือนนั้น
          } else {
            groupedByMonth[month].totalAdvanePayUnSuccess += result;
            groupedByMonth[month].clearUnSuccess++; // เพิ่มจำนวนข้อมูลทั้งหมดในเดือนนั้น
          }
        }
      });

      setCancelData(groupedByMonth);
    } else {
      setCancelData([]);
      setSelectedData(null);
      setSelectedMonth(null);
    }
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

  const handleData = (status) => {
    setStatusData(status);
    setIsModalCheckData(true);
  };

  const tagStyle = {
    fontSize: "16px",
    padding: "10px 16px",
    borderRadius: "10px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    transform: isActive ? "scale(0.96)" : "scale(1)",
    boxShadow: isActive ? "inset 0 2px 5px rgba(0,0,0,0.2)" : "none",
    transition: "transform 0.1s ease, box-shadow 0.1s ease",
  };
  console.log(selectedData?.item);
  console.log(dataArr);
  console.log(cancelData);

  const createAndDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet();

    // กำหนดชื่อคอลัมน์
    worksheet.columns = [
      { header: "ลำดับ", key: "no", width: 5 },
      { header: "เลขที่อ้างอิง", key: "refNo", width: 25 },
      { header: "วันที่อนุมัติเบิก", key: "withdrawDate", width: 15 },
      { header: "เบิกจำนวน", key: "withdraw", width: 15 },
      { header: "วันที่อนุมัติเคลียร์", key: "payDate", width: 15 },
      { header: "เคลียร์จำนวน", key: "pay", width: 15 },
      { header: "รวม", key: "result", width: 15 },
      { header: "ผู้เบิก", key: "lawyerName", width: 15 },
      { header: "ระยะเวลา", key: "difDate", width: 15 },
      { header: "หมายเหตุ", key: "withdrawMark", width: 30 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.font = { bold: true }; // ทำให้ตัวหนังสือเป็นตัวหนา
    });

    let data = selectedData.item;
    console.log("data---->", data);

    // คำนวณยอดรวมเฉพาะที่อนุมัติ (attorney_fees_payment_status === 1)
    const totalWithdraw = data
      .filter((item) => item.withdraw)
      .reduce((sum, item) => sum + item.withdraw, 0);

    const totalPay = data
      .filter((item) => item.pay)
      .reduce((sum, item) => sum + item.pay, 0);

    // เพิ่มข้อมูลลงใน Excel
    data.forEach((item, index) => {
      let dateResult;
      const dateRecordWithdraw = dayjs(item.withdraw_datetime).startOf("day");
      const dateRecordPay = dayjs(item.pay_datetime).startOf("day");
      const dateCurrent = dayjs().startOf("day");

      if (item.pay_type_id === 1) {
        dateResult = dateRecordPay.diff(dateRecordWithdraw, "day");
      } else {
        dateResult = dateCurrent.diff(dateRecordWithdraw, "day");
      }
      let row = worksheet.addRow({
        no: index + 1,
        refNo: item.reference_no,
        withdrawDate: convertDateThaiShort(item.withdraw_datetime),
        withdraw:
          item.withdraw_process_id === 3
            ? currencyFormatPoint(item.withdraw)
            : "-",
        payDate:
          item.pay_type_id === 1
            ? convertDateThaiShort(item.pay_datetime)
            : "-",
        pay: item.pay_type_id === 1 ? currencyFormatComma(item.pay) : "-",
        result:
          item.pay_type_id === 1
            ? currencyFormatComma(item.withdraw - item.pay)
            : "-",
        lawyerName: item.lawyerName,
        difDate: dateResult,
        withdrawMark: item.withdraw_mark,
      });

      // จัดกึ่งกลางทุกเซลล์ในแถว
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });

    // เพิ่มแถวว่างเพื่อเว้นระยะ
    worksheet.addRow([]);

    worksheet.addRow({
      no: "",
      refNo: "",
      withdrawDate: "",
      withdraw: "",
      payDate: "",
      pay: "",
      result: "",
      lawyerName: "รวมเบิก",
      difDate: currencyFormatComma(totalWithdraw),
      withdrawMark: "บาท",
    }).font = { bold: true, color: { argb: "000000" } };

    worksheet.addRow({
      no: "",
      refNo: "",
      withdrawDate: "",
      withdraw: "",
      payDate: "",
      pay: "",
      result: "",
      lawyerName: "รวมเคลียร์",
      difDate: currencyFormatComma(totalPay),
      withdrawMark: "บาท",
    }).font = { bold: true, color: { argb: "000000" } };

    worksheet.addRow({
      no: "",
      refNo: "",
      withdrawDate: "",
      withdraw: "",
      payDate: "",
      pay: "",
      result: "",
      lawyerName: "ยอดสรุป",
      difDate: `${
        totalWithdraw - totalPay > 0
          ? "เบิกเกิน"
          : totalWithdraw - totalPay < 0
          ? "เบิกขาด"
          : ""
      } ${currencyFormatComma(totalWithdraw - totalPay)}`,
      withdrawMark: "บาท",
    }).font = { bold: true, color: { argb: "000000" } };

    // สร้างไฟล์และดาวน์โหลด
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // ดาวน์โหลดไฟล์
    saveAs(blob, `รายงานการเบิก ${selectedMonth || ""}.xlsx`);
  };

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col span={12} style={{ textAlign: "start" }}>
              <b>การเบิกของปี</b>
              <DatePicker
                style={{ marginTop: "5px", marginLeft: "5px" }}
                onChange={onChange}
                picker="year"
                defaultValue={dayjs().startOf("year")}
                placeholder="โปรดเลือกปี"
              />
            </Col>
            <Col span={12} style={{ textAlign: "end" }}>
              <Tooltip
                placement="bottom"
                title="คลิกเพื่อบันทึกสรุปรายงาน"
                arrow={mergedArrow}
              >
                <PrinterOutlined
                  style={{
                    fontSize: "40px",
                    color: "green",
                    cursor: "pointer",
                  }}
                  key="print"
                  onClick={() => {
                    if (selectedData) {
                      createAndDownloadExcel();
                    } else {
                      notification.error({
                        message: "กรุณาเลือกข้อมูล !",
                        description: (
                          <div>
                            โปรดเลือกข้อมูลเดือนที่ท่านต้องการจะ พิมพ์ excel
                          </div>
                        ),

                        duration: 5,
                      });
                    }
                  }}
                />
              </Tooltip>
            </Col>
          </Row>
          {BarChart()}
          {selectedMonth && selectedData && (
            <div
              style={{
                marginTop: 24,
                padding: "20px",
                border: "1px solid #e0e0e0",
                borderRadius: "16px",
                background: "#f9f9f9",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            >
              <h3
                style={{
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <BarChartOutlined
                  style={{ color: "#1890ff", fontSize: "20px" }}
                />
                ข้อมูลสำหรับเดือน: <b>{selectedMonth}</b>
              </h3>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <Tag
                  color="#3357FF"
                  style={{ ...tagStyle, color: "#fff" }}
                  onClick={() => handleData("all")}
                  className="clickable-tag"
                  onMouseDown={() => setIsActive(true)}
                  onMouseUp={() => setIsActive(false)}
                  onMouseLeave={() => setIsActive(false)}
                >
                  <InboxOutlined /> ทั้งหมด: {selectedData.totalBill}
                </Tag>
                <Tag
                  color="#4DFF88"
                  style={{ ...tagStyle, color: "#000" }}
                  onClick={() => handleData(1)}
                  className="clickable-tag"
                  onMouseDown={() => setIsActive(true)}
                  onMouseUp={() => setIsActive(false)}
                  onMouseLeave={() => setIsActive(false)}
                >
                  <CheckCircleOutlined /> เคลียร์สำเร็จ:{" "}
                  {selectedData.clearSuccess}
                  {/* {(
                    (selectedData.clearSuccess / selectedData.totalBill) *
                    100
                  ).toFixed(2)}
                  %) */}
                </Tag>
                <Tag
                  color="orange"
                  style={{ ...tagStyle }}
                  onClick={() => handleData(2)}
                  className="clickable-tag"
                  onMouseDown={() => setIsActive(true)}
                  onMouseUp={() => setIsActive(false)}
                  onMouseLeave={() => setIsActive(false)}
                >
                  <WarningOutlined /> รอดำเนินการ: {selectedData.clearUnSuccess}{" "}
                  {/* {(
                    (selectedData.clearUnSuccess / selectedData.totalBill) *
                    100
                  ).toFixed(2)}
                  %) */}
                  ({currencyFormatPoint(selectedData.totalAdvanePayUnSuccess)})
                </Tag>

                <Tag
                  color="#FF4D4F"
                  style={{ ...tagStyle, color: "#000" }}
                  onClick={() => handleData(3)}
                  className="clickable-tag"
                  onMouseDown={() => setIsActive(true)}
                  onMouseUp={() => setIsActive(false)}
                  onMouseLeave={() => setIsActive(false)}
                >
                  🚨 เกินกำหนดเคลียร์: {selectedData.clearUnSuccessOverSevenDay}{" "}
                  {/* (
                  {(
                    (selectedData.clearUnSuccessOverSevenDay /
                      selectedData.totalBill) *
                    100
                  ).toFixed(2)}
                  %) */}
                  (
                  {currencyFormatPoint(
                    selectedData.totalAdvanePayUnSuccessOverSevenDay
                  )}
                  )
                </Tag>
              </div>
            </div>
          )}
        </Spin>
      </Card>
      {isModalCheckData ? (
        <DataCheck
          open={isModalCheckData}
          close={setIsModalCheckData}
          data={selectedData}
          status={statusData}
        />
      ) : null}
    </>
  );
};

const ReportAdvanePay = MotionHoc(Main);
export default ReportAdvanePay;
