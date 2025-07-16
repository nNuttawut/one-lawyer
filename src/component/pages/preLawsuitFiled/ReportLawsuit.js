import {
  Col,
  Row,
  DatePicker,
  Card,
  message,
  Spin,
  Tooltip,
  Tag,
  Button,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import MotionHoc from "../../../utils/MotionHoc";
import {
  baseUrl,
  GET_CANCEL,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
  HEADERS_EXPORT_BEN,
  POST_LOAN_DB2,
} from "../../API/apiUrls";
import ReactECharts from "echarts-for-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  BarChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

//use redux
import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import CurrencyFormat from "../../../hook/CurrencyFormat";
import DataCheck from "./modal/DataCheck";
import {
  BAD_DEBTOR,
  FINISH,
  INDICT,
  TIMEOUT,
  WITHDRAW_CASE,
} from "../../../utils/constant/StatusConstant";

const Main = () => {
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [loading, setLoading] = useState();
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [arrow, setArrow] = useState("Show");
  const [cancelData, setCancelData] = useState([]);
  const [arrData, setArrData] = useState();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalCheckData, setIsModalCheckData] = useState(false);
  const [statusData, setStatusData] = useState();
  const [isActive, setIsActive] = useState(false);
  const [contnos, setContnos] = useState({});
  const [dataContnos, setDataContnos] = useState();

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

  const loadData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + INDICT,
        {
          headers: HEADERS_EXPORT,
        }
      );
      if (response.data) {
        if (response.data) {
          console.log(response.data);

          filterDataLawyer(response.data);

          setLoading(false);
        }
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

  const filterDataLawyer = (data) => {
    if (Array.isArray(data)) {
      const newData = data.filter(
        (item) =>
          (ROLE_ID === "1" || ROLE_ID === "3") &&
          (item.MAIN_STATUS_ID !== FINISH ||
            item.MAIN_STATUS_ID !== TIMEOUT ||
            item.MAIN_STATUS_ID !== WITHDRAW_CASE ||
            item.MAIN_STATUS_ID !== BAD_DEBTOR)
      );
      let filteredData = newData;

      setArrData(filteredData);

      let groupedByLawyer = {};

      filteredData.forEach((item) => {
        const lawyerName = item.LAWYER_NNAME;

        if (!groupedByLawyer[lawyerName]) {
          groupedByLawyer[lawyerName] = {
            all: [],
            waitLawsuit: [],
            withBackCase: [],
            withRedCase: [],
          };
        }
        // 1️⃣ ข้อมูลทั้งหมด
        groupedByLawyer[lawyerName].all.push(item);
        if (item.red_case_number !== null) {
          groupedByLawyer[lawyerName].withRedCase.push(item);
        } else if (
          !item.red_case_number &&
          !item.consideration_date &&
          !item.black_case_number
        ) {
          groupedByLawyer[lawyerName].waitLawsuit.push(item);
        } // 2️⃣ ข้อมูลที่ STATUS_ID === 2 && MAIN_STATUS_ID === 3
        else if (item.consideration_date && item.black_case_number) {
          groupedByLawyer[lawyerName].withBackCase.push(item);
        } // 3️⃣ ข้อมูลที่ red_case_number !== null
      });
      console.log("groupedByLawyer", groupedByLawyer);

      setCancelData(groupedByLawyer);
    } else {
      console.error("data is not an array or is undefined");
    }
  };

  const loadDataReport = async (data) => {
    console.log(data);
    setLoading(true);

    try {
      const response = await axios.post(POST_LOAN_DB2, data, {
        headers: HEADERS_EXPORT_BEN,
      });
      if (response.data) {
        if (response.data) {
          console.log(response.data);
          setDataContnos(response.data);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      message.error(`ไม่พบข้อมูลรายงาน`);
    }
  };

  const BarChart = () => {
    // ✅ 1) ใช้ Object.keys แทน map()
    const lawyerNames = Object.keys(cancelData).filter(Boolean);
    console.log("cancelData", cancelData);

    // ✅ 2) สร้าง chartData ตาม lawyerNames ที่หาได้
    const chartData = [
      [
        "ทนาย",
        "ทั้งหมด",
        "รอฟ้อง",
        "STATUS=2 & MAIN=3",
        "red_case_number != null",
      ],
      ...lawyerNames.map((lawyerName) => {
        const data = cancelData[lawyerName] || {
          all: [],
          waitLawsuit: [],
          withBackCase: [],
          withRedCase: [],
        };
        return [
          lawyerName,
          data.all.length,
          data.waitLawsuit.length,
          data.withBackCase.length,
          data.withRedCase.length,
        ];
      }),
    ];

    const option = {
      legend: {},

      toolbox: {
        show: true,
        feature: {
          saveAsImage: {},
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      dataset: {
        source: chartData,
      },
      xAxis: { type: "category" },
      yAxis: { type: "value" },

      series: [
        {
          type: "bar",
          name: "ทั้งหมด",
          label: {
            show: true,
          },
          itemStyle: {
            color: "#3357FF",
            borderRadius: [20, 20, 0, 0],
          },
        },
        {
          type: "bar",
          name: "รอฟ้อง",
          label: {
            show: true,
          },
          itemStyle: {
            color: "red",
            borderRadius: [20, 20, 0, 0],
          },
        },
        {
          type: "bar",
          name: "มีวันนัดศาล",
          label: {
            show: true,
          },
          itemStyle: {
            color: "orange",
            borderRadius: [20, 20, 0, 0],
          },
        },
        {
          type: "bar",
          name: "พิพากษาแล้ว",
          stack: "response",
          label: {
            show: true,
          },
          itemStyle: {
            color: "#33FF57",
            borderRadius: [20, 20, 0, 0],
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

    setSelectedMonth(month);
    setSelectedData(data);
    preLoadContnos(data.all);
  };

  const preLoadContnos = (data) => {
    console.log("preLoadContnos", data);
    const preData = data
      .filter((item) => {
        return !item.red_case_number;
      })
      .map((item) => item.CONTNO); // ดึงเฉพาะ CONTNO
    const formattedData = preData.map((val) => `'${val}'`).join(",");
    setContnos({ CONTNO: formattedData });
    loadDataReport({ CONTNO: formattedData });
  };

  console.log(selectedData);

  const createAndDownloadExcel = async () => {
    if (selectedData) {
      const workbook = new ExcelJS.Workbook();

      // วนลูปตามทนาย
      Object.entries(selectedData).forEach(([lawyerName, data]) => {
        const worksheet = workbook.addWorksheet(
          lawyerName === "all"
            ? "ทั้งหมด"
            : lawyerName === "waitLawsuit"
            ? "รอฟ้อง"
            : lawyerName === "withBackCase"
            ? "มีวันนัดศาล"
            : "พิพากษาแล้ว"
        );

        // 🔻 กำหนดคอลัมน์ รวมถึงวันนัดศาล และวันพิพากษา
        worksheet.columns = [
          { header: "ลำดับ", key: "no", width: 8 },
          { header: "เลขที่สัญญา", key: "contno", width: 20 },
          { header: "ชื่อลูกค้า", key: "customer_name", width: 30 },
          { header: "เลขคดีดำ", key: "black_case_number", width: 20 },
          { header: "วันนัดศาล", key: "consideration_date", width: 20 },
          {
            header: "เลขคดีแดง",
            key: "red_case_number",
            width: 20,
            color: { argb: "FF0000" },
            bold: true,
          },
          { header: "วันพิพากษา", key: "judge_date", width: 20 },
          { header: "สถานะ", key: "status", width: 15 },
        ];

        // 🔻 เพิ่มข้อมูล
        data.forEach((item, index) => {
          const row = worksheet.addRow({
            no: index + 1,
            contno: item.CONTNO || "-",
            customer_name: `${item.CUSTOMER_TNAME}${item.CUSTOMER_FNAME} ${item.CUSTOMER_LNAME}`,
            black_case_number: item.black_case_number || "-",
            consideration_date: item.consideration_date
              ? convertDateThaiShort(item.consideration_date)
              : "-",
            red_case_number: item.red_case_number || "-",
            judge_date: item.judge_date
              ? convertDateThaiShort(item.judge_date)
              : "-",
            status: item.red_case_number
              ? "มีเลขคดีแดง"
              : item.consideration_date && item.black_case_number
              ? "นัดศาลแล้ว"
              : "รอฟ้อง",
          });

          // 🔻 สีตามสถานะ
          const statusCell = row.getCell("status");
          if (statusCell.value === "มีเลขคดีแดง") {
            statusCell.font = { color: { argb: "008000" }, bold: true }; // เขียว
          } else if (statusCell.value === "นัดศาลแล้ว") {
            statusCell.font = { color: { argb: "FFA500" }, bold: true }; // น้ำเงิน
          } else {
            statusCell.font = { color: { argb: "FF0000" }, bold: true }; // แดง
          }
          const redCaseNumberCell = row.getCell("red_case_number");
          redCaseNumberCell.font = { color: { argb: "FF0000" }, bold: true }; // แดง
        });

        // 🔻 สรุปท้ายตาราง
        worksheet.addRow([]);
        worksheet.addRow({
          judge_date: "รวมทั้งหมด:",
          status: selectedData.all.length,
        }).font = { bold: true };

        worksheet.addRow({
          judge_date: "รอฟ้อง:",
          status: selectedData.waitLawsuit.length,
        }).font = { bold: true, color: { argb: "FF0000" } };

        worksheet.addRow({
          judge_date: "นัดศาลแล้ว:",
          status: selectedData.withBackCase.length,
        }).font = { bold: true, color: { argb: "FFA500" } };

        worksheet.addRow({
          judge_date: "มีเลขคดีแดง:",
          status: selectedData.withRedCase.length,
        }).font = { bold: true, color: { argb: "008000" } };

        // 🔻 จัดกึ่งกลาง
        worksheet.eachRow((row) => {
          row.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });
        });
      });

      // 🔻 ดาวน์โหลดไฟล์
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `รายงาน_${selectedMonth}${dayjs().format("YYYY_MM_DD")}.xlsx`
      );
    } else {
      message.error("กรุณาเลือกข้อมูล");
    }
  };

  const sumaryReportExcel = async () => {
    console.log("data", dataContnos);

    if (dataContnos) {
      const workbook = new ExcelJS.Workbook();

      // 🔻 Group data by CONTNO prefix
      const grouped = {
        1: [],
        2: [],
        3: [],
        other: [],
      };

      dataContnos.forEach((item) => {
        const contno = item?.LOAN?.CONTNO || "";
        let groupKey = "8"; // default = สัญญา 8

        if (contno.startsWith("1-") || contno.startsWith("222")) {
          groupKey = "1";
        } else if (contno.startsWith("2-") || contno.startsWith("022")) {
          groupKey = "2";
        } else if (contno.startsWith("3-")) {
          groupKey = "3";
        }

        if (!grouped[groupKey]) {
          grouped[groupKey] = [];
        }

        grouped[groupKey].push(item);
      });

      const groupNames = {
        1: "สัญญา 1 ",
        2: "สัญญา 2",
        3: "สัญญา 3",
        8: "สัญญา 8",
      };

      Object.entries(grouped).forEach(([key, groupData]) => {
        if (groupData.length === 0) return; // ข้ามถ้าไม่มีข้อมูลในกลุ่มนั้น

        const worksheet = workbook.addWorksheet(`${groupNames[key]}`);
        console.log(`${groupNames[key]}`);

        worksheet.columns = [
          { header: "ลำดับ", key: "no", width: 8 },
          { header: "สาขา", key: "LOCAT", width: 10 },
          { header: "เลขที่สัญญา", key: "CONTNO", width: 15 },
          { header: "ชื่อลูกค้า", key: "cusName", width: 35 },
          {
            header: `${key === "1" ? "ประเภท" : "จังหวัด"}`,
            key: "DORECV",
            width: 15,
          },
          {
            header: `${key === "1" ? "จังหวัด" : "ยี่ห้อ/รุ่น"}`,
            key: "TYPE",
            width: 15,
          },
          {
            header: `${key === "1" ? "เลข" : "ทะเบียน"}`,
            key: "REGNO",
            width: 15,
          },
          { header: "ค่างวด", key: "TOT_UPAY", width: 15 },
          { header: "ค่างวดค้าง(โดยประมาณ)", key: "OverdueAmount", width: 20 },
          { header: "งวดที่ค้าง", key: "Overdue", width: 15 },
          { header: "ยอดหนี้", key: "NCSHPRC", width: 15 },
          { header: "ยอดหนี้รวมดอก", key: "TOTPRC", width: 15 },
          { header: "จ่ายมาทั้งหมด", key: "SMPAY", width: 15 },
          { header: "จ่ายล่าสุด", key: "LPAYD", width: 15 },
        ];

        groupData.forEach((item, index) => {
          worksheet.addRow({
            no: index + 1,
            LOCAT: item?.LOAN?.LOCAT || "-",
            CONTNO: item?.LOAN?.CONTNO || "-",
            cusName:
              item?.CUSTOMER?.SNAM +
                item?.CUSTOMER?.NAME1 +
                " " +
                item?.CUSTOMER?.NAME1 || "",
            DORECV: key === "1" ? item?.MORTGAGE.COLOR : item?.MORTGAGE.DORECV,
            TYPE: item?.MORTGAGE.TYPE,
            REGNO: key === "1" ? item?.MORTGAGE.STRNO : item?.MORTGAGE.REGNO,
            TOT_UPAY: currencyFormatComma(item?.LOAN?.TOT_UPAY),
            OverdueAmount: currencyFormatComma(
              (item?.LOAN?.EXP_TO - item?.LOAN?.EXP_FRM) * item?.LOAN?.TOT_UPAY
            ),
            Overdue: item?.LOAN?.EXP_TO - item?.LOAN?.EXP_FRM,
            NCSHPRC: currencyFormatComma(item?.LOAN?.NCSHPRC),
            TOTPRC: currencyFormatComma(item?.LOAN?.TOTPRC),
            SMPAY: currencyFormatComma(item?.LOAN?.SMPAY),
            LPAYD: convertDateThaiShort(item?.LOAN?.LPAYD),
          });
        });

        worksheet.eachRow((row) => {
          row.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });
        });
      });

      // 🔻 ดาวน์โหลดไฟล์
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `รายงาน_${selectedMonth}_${dayjs().format("YYYY_MM_DD")}.xlsx`
      );
    } else {
      message.error("กรุณาเลือกข้อมูล");
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
  console.log("userCompany", userCompany);
  console.log("ROLE_ID", ROLE_ID);

  if ((userCompany === "3" && ROLE_ID === "3") || ROLE_ID === "4") {
    return <Card>ไม่มีสิทธ์เข้าถึงข้อมูล</Card>;
  } else {
    return (
      <>
        <Card>
          <Spin spinning={loading} size="large" tip=" Loading... ">
            <Row>
              {/* <Col span={12} style={{ textAlign: "start" }}>
              <b>บอกเลิกสัญญา</b>
              <DatePicker
                style={{ marginTop: "5px", marginLeft: "5px" }}
                onChange={onChange}
                picker="year"
                defaultValue={dayjs().startOf("year")}
                placeholder="โปรดเลือกปี"
              />
            </Col> */}
              <Col span={24} style={{ textAlign: "end" }}>
                {/* <Tooltip
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
                    createAndDownloadExcel();
                  }}
                />
              </Tooltip> */}
              </Col>
            </Row>
            {BarChart()}
            {selectedMonth && selectedData && (
              <>
                <Button
                  style={{
                    fontSize: "14px",
                    marginRight: "10px",
                    marginTop: "10px",
                    color: "blue",
                  }}
                  onClick={() => {
                    createAndDownloadExcel();
                  }}
                >
                  พิมพ์ port {selectedMonth}
                </Button>

                <Button
                  style={{
                    fontSize: "14px",
                    marginRight: "10px",
                    marginTop: "10px",
                    color: "green",
                  }}
                  onClick={() => {
                    sumaryReportExcel();
                  }}
                >
                  รายงานประชุม {selectedMonth}
                </Button>

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
                    รายละเอียดข้อมูล: <b>{selectedMonth}</b>
                  </h3>

                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}
                  >
                    <Tag
                      color="#3357FF"
                      style={{ ...tagStyle, color: "#fff" }}
                      onClick={() => handleData("all")}
                      className="clickable-tag"
                      onMouseDown={() => setIsActive(true)}
                      onMouseUp={() => setIsActive(false)}
                      onMouseLeave={() => setIsActive(false)}
                    >
                      <InboxOutlined /> ทั้งหมด: {selectedData?.all?.length}{" "}
                      สัญญา
                    </Tag>

                    <Tag
                      color="red"
                      style={{ ...tagStyle, color: "#000" }}
                      onClick={() => handleData(3)}
                      className="clickable-tag"
                      onMouseDown={() => setIsActive(true)}
                      onMouseUp={() => setIsActive(false)}
                      onMouseLeave={() => setIsActive(false)}
                    >
                      <CalendarOutlined /> รอฟ้อง:{" "}
                      {selectedData?.waitLawsuit?.length} สัญญา
                      {/* (
                  {(
                    (selectedData?.withBackCase?.length /
                      selectedData?.all?.length) *
                    100
                  ).toFixed(2)}
                  %) */}
                    </Tag>

                    <Tag
                      color="#FFD699"
                      style={{ ...tagStyle, color: "#000" }}
                      onClick={() => handleData(1)}
                      className="clickable-tag"
                      onMouseDown={() => setIsActive(true)}
                      onMouseUp={() => setIsActive(false)}
                      onMouseLeave={() => setIsActive(false)}
                    >
                      <CalendarOutlined /> มีวันนัดศาล:{" "}
                      {selectedData?.withBackCase?.length} สัญญา
                      {/* (
                  {(
                    (selectedData?.withBackCase?.length /
                      selectedData?.all?.length) *
                    100
                  ).toFixed(2)}
                  %) */}
                    </Tag>

                    <Tag
                      color="#4DFF88"
                      style={{ ...tagStyle, color: "#000" }}
                      onClick={() => handleData(2)}
                      className="clickable-tag"
                      onMouseDown={() => setIsActive(true)}
                      onMouseUp={() => setIsActive(false)}
                      onMouseLeave={() => setIsActive(false)}
                    >
                      <CheckCircleOutlined /> พิพากษาแล้ว:{" "}
                      {selectedData?.withRedCase?.length} สัญญา
                      {/* (
                  {(
                    (selectedData?.withRedCase?.length /
                      selectedData?.all?.length) *
                    100
                  ).toFixed(2)}
                  %) */}
                    </Tag>
                  </div>
                </div>
              </>
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
  }
};

const ReportLawsuit = MotionHoc(Main);
export default ReportLawsuit;
