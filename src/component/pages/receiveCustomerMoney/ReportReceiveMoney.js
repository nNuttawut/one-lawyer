import { Col, Row, DatePicker, Card, message, Spin, Tag } from "antd";
import React, { useEffect, useState } from "react";
import MotionHoc from "../../../utils/MotionHoc";
import {
  baseUrl,
  GET_RECEIVE_PAYMENT,
  HEADERS_EXPORT,
} from "../../API/apiUrls";
import ReactECharts from "echarts-for-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  BarChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";

//use redux
import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import CurrencyFormat from "../../../hook/CurrencyFormat";
import DataCheck from "./modal/DataCheck";

import LoadLawyers from "../../../hook/LoadLawyers";

const Main = () => {
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [loading, setLoading] = useState();
  const [cancelData, setCancelData] = useState([]);
  const [arrData, setArrData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalCheckData, setIsModalCheckData] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [assistantOption, setAssistantOption] = useState();
  const [lawyerName, setLawyerName] = useState();
  const [dataReload, setDataReload] = useState([]);

  useEffect(() => {
    loadData();
    setLoadingData(true);
  }, []);

  useEffect(() => {
    BarChart();
  }, [cancelData]);

  useEffect(() => {
    if (lawyersList) {
      setOptionAssistant();
    }
  }, [lawyersList]);

  useEffect(() => {
    const now = dayjs();
    onChangeMonthYear(now);
  }, [arrData]);

  const setOptionAssistant = () => {
    console.log("lawyersList", lawyersList);

    const optionsAssistant = lawyersList.map((item) => ({
      value: item.id,
      label: item.NNAME,
    }));
    setAssistantOption(optionsAssistant);
  };

  const loadData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(baseUrl + GET_RECEIVE_PAYMENT, {
        headers: HEADERS_EXPORT,
      });
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
      let filteredData = data;
      setArrData(filteredData);

      let groupedByLawyer = {};

      data.forEach((item) => {
        const lawyerId = item.payee_id;
        const createdDate = new Date(item.created_date); // ใช้ field ที่เป็นวันที่
        const year = createdDate.getFullYear();
        const month = String(createdDate.getMonth() + 1).padStart(2, "0");

        // ✅ เพิ่ม year และ month ลงใน item เพื่อให้ค้นหาภายหลังได้
        const itemWithDate = {
          ...item,
          year,
          month,
        };

        if (!groupedByLawyer[lawyerId]) {
          groupedByLawyer[lawyerId] = {
            totalAmount: 0,
            items: [],
            id: lawyerId,
          };
        }

        groupedByLawyer[lawyerId].totalAmount += item.amount || 0;
        groupedByLawyer[lawyerId].items.push(itemWithDate);
      });

      console.log("groupedByLawyer (with year/month):", groupedByLawyer);
      setCancelData(groupedByLawyer);
      setDataReload(groupedByLawyer);
    } else {
      console.error("data is not an array or is undefined");
    }
  };

  const BarChart = () => {
    const lawyerNames = Object.keys(cancelData).filter(Boolean);

    // ✅ แปลง payee_id → NNAME
    const idToName = {};
    lawyersList.forEach((lawyer) => {
      idToName[lawyer.id] = lawyer.NNAME;
    });

    const chartData = [
      ["ทนาย", "จำนวน", "ยอดรวม (บาท)"],
      ...lawyerNames.map((id) => {
        const data = cancelData[id] || { items: [], totalAmount: 0 };
        const name = idToName[id] || `ID ${id}`; // fallback ถ้าไม่เจอ
        return [name, data.totalAmount, id];
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
          name: "จำนวนเงิน (บาท)",
          label: {
            show: true,
            formatter: (params) =>
              `${Number(params.value[1]).toLocaleString()} บาท`,
          },
          itemStyle: {
            color: (params) => {
              const colors = [
                "#3357FF", // Blue
                "#FF5733", // Red-Orange
                "#33CC99", // Teal
                "#FFAA00", // Amber
                "#9966FF", // Purple
                "#0099FF", // Light Blue
                "#FF66CC", // Pink
                "#66FF66", // Light Green
                "#FF4444", // Bright Red
                "#00CCCC", // Cyan
                "#FF9966", // Peach
                "#CCCC00", // Mustard
                "#66B2FF", // Soft Blue
                "#CC66FF", // Lavender
                "#33FFCC", // Mint
              ];

              return colors[params.dataIndex % colors.length]; // วนสี
            },
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
    console.log(params.value[2]);

    const month = params.value[2];
    const data = cancelData[month];
    setLawyerName(params.name);
    console.log(data);

    setSelectedMonth(month);
    setSelectedData(data);
  };

  const handleData = () => {
    setIsModalCheckData(true);
  };

  const onChangeMonthYear = (date) => {
    if (!date) return;

    const selectedYear = date.year();
    const selectedMonth = String(date.month() + 1).padStart(2, "0"); // month 0-based

    const grouped = {};
    console.log(cancelData);

    Object.entries(dataReload).forEach(([lawyerId, lawyerData]) => {
      const filteredItems = lawyerData.items.filter((item) => {
        const itemDate = dayjs(item.created_date);
        return (
          itemDate.year() === selectedYear &&
          String(itemDate.month() + 1).padStart(2, "0") === selectedMonth
        );
      });

      if (filteredItems.length > 0) {
        const totalAmount = filteredItems.reduce(
          (sum, item) => sum + (item.amount || 0),
          0
        );

        grouped[lawyerId] = {
          totalAmount,
          items: filteredItems,
        };
      }
    });
    console.log("grouped", grouped);

    setCancelData(grouped);
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

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col span={12}>
              <b>เลือกปีและเดือน</b>
              <DatePicker
                picker="month"
                onChange={onChangeMonthYear}
                format="MMMM YYYY"
                allowClear={false}
                defaultValue={dayjs()}
              />
            </Col>
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
                รายละเอียดข้อมูล: <b>{lawyerName}</b>
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
                  <InboxOutlined /> รับทั้งหมด:{" "}
                  {currencyFormatComma(selectedData?.totalAmount)} บาท
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
        />
      ) : null}
    </>
  );
};

const ReportReceiveMoney = MotionHoc(Main);
export default ReportReceiveMoney;
