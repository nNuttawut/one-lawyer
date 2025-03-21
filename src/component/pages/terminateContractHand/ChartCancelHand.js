import { Col, Row, DatePicker, Card, message, Spin, Tooltip } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { baseUrl, GET_CANCEL, HEADERS_EXPORT } from "../../API/apiUrls";
import ReactECharts from "echarts-for-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

//use redux
import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";

const Main = () => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [loading, setLoading] = useState();
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [arrow, setArrow] = useState("Show");
  const [cancelData, setCancelData] = useState([]);
  const [cancelDataHand, setCancelDataHand] = useState([]);
  const [arrData, setArrData] = useState();
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
    BarChartHand();
  }, [cancelDataHand]);

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
      const newData = data.filter((item) => ROLE_ID === "1" || ROLE_ID === "2");
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

      setArrData(filteredData);
      let dataThisYear = [];

      dataThisYear = filteredData
        .filter((item) => {
          // ตรวจสอบว่าปีของ `item.datetime` ตรงกับปีปัจจุบัน
          return dayjs(item.datetime).format("YYYY") === dayjs().format("YYYY");
        })
        .sort((a, b) =>
          dayjs(a.datetime).isBefore(dayjs(b.datetime)) ? -1 : 1
        );

      let groupedByMonthHand = {};

      dataThisYear.forEach((item) => {
        let month = dayjs(item.datetime).format("MMM"); // ดึงค่าเดือน
        if (!item.account_type || item.account_type === "cancelHand") {
          if (!groupedByMonthHand[month]) {
            groupedByMonthHand[month] = {
              total: 0,
              withDateResponse: 0,
              normalResponse: 0,
              postResponse: 0,
              abnormalResponse: 0,
              items: [],
            }; // เริ่มต้นที่ 0
          }
          groupedByMonthHand[month].total++; // เพิ่มจำนวนข้อมูลทั้งหมดในเดือนนั้น
          groupedByMonthHand[month].items.push(item); // เพิ่มข้อมูลของเดือนนั้นลงไปใน items array

          if (item.date_response) {
            groupedByMonthHand[month].withDateResponse++; // เพิ่มจำนวนถ้ามี date_response
          }
          if (item.status === 1) {
            groupedByMonthHand[month].normalResponse++; // เพิ่มจำนวนถ้ามี date_response
          } else if (item.status === 2) {
            groupedByMonthHand[month].postResponse++; // เพิ่มจำนวนถ้ามี date_response
          } else if (item.status === 3) {
            groupedByMonthHand[month].abnormalResponse++; // เพิ่มจำนวนถ้ามี date_response
          }
        }
      });
      setCancelDataHand(groupedByMonthHand);
    } else {
      console.error("data is not an array or is undefined");
    }
  };

  const BarChartHand = () => {
    const chartData = [
      ["เดือน", "ทั้งหมด", "ยังไม่ตอบกลับ", "ไปรษณีย์", "ตีกลับ", "ใบตอบกลับ"], // Header
      ...Object.entries(cancelDataHand).map(([month, data]) => [
        month,
        data.total, // ข้อมูลทั้งหมด
        data.total - data.withDateResponse, // คำนวณ "ยังไม่ตอบกลับ"
        data.postResponse,
        data.abnormalResponse,
        data.normalResponse,
      ]),
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
          itemStyle: {
            color: "#3357FF",
            borderRadius: [20, 20, 0, 0],
          },
        },
        {
          type: "bar",
          name: "ยังไม่ตอบกลับ",
          itemStyle: {
            color: "#FF5733",
            borderRadius: [20, 20, 0, 0],
          },
        },
        {
          type: "bar",
          name: "ไปรษณีย์",
          stack: "response",
          itemStyle: {
            color: "yellow",
          },
        },
        {
          type: "bar",
          name: "ตีกลับ",
          stack: "response",
          itemStyle: {
            color: "orange",
          },
        },
        {
          type: "bar",
          name: "ใบตอบกลับ",
          stack: "response",
          itemStyle: {
            color: "#33FF57",
            borderRadius: [20, 20, 0, 0],
          },
        },
      ],
    };

    return (
      <ReactECharts option={option} style={{ height: 400, width: "100%" }} />
    );
  };

  const onChangeHand = (date, dateString) => {
    console.log(date, dateString);

    renderData(null, dateString);
  };

  const renderData = (cancelData, cancelHandData) => {
    let dataThisYear = [];
    let dataThisYearHand = [];
    if (cancelData) {
      dataThisYear = arrData
        .filter((item) => {
          // ตรวจสอบว่าปีของ `item.datetime` ตรงกับปีปัจจุบัน
          return dayjs(item.datetime).format("YYYY") === cancelData;
        })
        .sort((a, b) =>
          dayjs(a.datetime).isBefore(dayjs(b.datetime)) ? -1 : 1
        );

      let groupedByMonth = {};

      dataThisYear.forEach((item) => {
        let month = dayjs(item.datetime).format("MMM"); // ดึงค่าเดือน
        if (item.account_type) {
          if (!groupedByMonth[month]) {
            groupedByMonth[month] = {
              total: 0,
              withDateResponse: 0,
              items: [],
            }; // เริ่มต้นที่ 0
          }
          groupedByMonth[month].total++; // เพิ่มจำนวนข้อมูลทั้งหมดในเดือนนั้น
          groupedByMonth[month].items.push(item); // เพิ่มข้อมูลของเดือนนั้นลงไปใน items array
          if (item.date_response) {
            groupedByMonth[month].withDateResponse++; // เพิ่มจำนวนถ้ามี date_response
          }
        }
      });
      setCancelData(groupedByMonth);
    } else if (cancelHandData) {
      dataThisYearHand = arrData
        .filter((item) => {
          // ตรวจสอบว่าปีของ `item.datetime` ตรงกับปีปัจจุบัน
          return dayjs(item.datetime).format("YYYY") === cancelHandData;
        })
        .sort((a, b) =>
          dayjs(a.datetime).isBefore(dayjs(b.datetime)) ? -1 : 1
        );

      let groupedByMonthHand = {};

      dataThisYearHand.forEach((item) => {
        let month = dayjs(item.datetime).format("MMM"); // ดึงค่าเดือน
        if (!item.account_type) {
          console.log(item.account_type);

          if (!groupedByMonthHand[month]) {
            groupedByMonthHand[month] = {
              total: 0,
              withDateResponse: 0,
              items: [],
            }; // เริ่มต้นที่ 0
          }
          groupedByMonthHand[month].total++; // เพิ่มจำนวนข้อมูลทั้งหมดในเดือนนั้น
          groupedByMonthHand[month].items.push(item); // เพิ่มข้อมูลของเดือนนั้นลงไปใน items array
          if (item.date_response) {
            groupedByMonthHand[month].withDateResponse++; // เพิ่มจำนวนถ้ามี date_response
          }
        }
      });
      setCancelDataHand(groupedByMonthHand);
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

  const createAndDownloadExcelHand = async () => {
    if (cancelDataHand) {
      const workbook = new ExcelJS.Workbook(); // สร้าง Workbook
      // วนลูปสร้าง Sheet สำหรับแต่ละเดือน
      Object.entries(cancelDataHand).forEach(([month, data]) => {
        const worksheet = workbook.addWorksheet(`เดือน ${month}`); // ใช้ชื่อเดือนเป็นชื่อ Sheet

        // กำหนดคอลัมน์ของ Worksheet
        worksheet.columns = [
          { header: "ลำดับ", key: "no", width: 10 },
          { header: "วันที่ออกจดหมายในระบบ", key: "datetime", width: 20 },
          { header: "เลขที่สัญญา", key: "contno", width: 20 },
          { header: "ชื่อลูกค้า", key: "cusName", width: 30 },
          { header: "ประเภทลูกค้า", key: "customer_Type", width: 15 },
          { header: "ยี่ห้อ", key: "brand", width: 15 },
          { header: "ทะเบียน", key: "register_no", width: 15 },
          { header: "ems จดหมาย", key: "emsNo", width: 25 },
          { header: "ems ตอบกลับ", key: "emsNoResponse", width: 25 },
          { header: "วันที่ตอบกลับ", key: "date_response", width: 20 },
          { header: "เวลาดำเนินงาน", key: "createDate", width: 20 },
          { header: "สถานะ", key: "status", width: 15 },
        ];

        // เพิ่มข้อมูลจาก items ของเดือนนั้น ๆ
        data.items.forEach((item, index) => {
          worksheet.addRow({
            no: index + 1,
            datetime: convertDateThaiShort(item.datetime),
            contno: item.contract_no,
            cusName: item.customer_fullname,
            customer_Type:
              item.customer_type_id === 0
                ? "ผู้เช่าซื้อ"
                : `คนค้ำที่ ${item.customer_type_id}`,
            brand: item.brand,
            register_no: item.register_no,
            emsNo: item.parcel_no,
            emsNoResponse: item.parcel_no_response,
            date_response: item.date_response
              ? convertDateThaiShort(item.date_response)
              : "-",
            createDate: renderDateProcess(item),
            status:
              item.status === 1
                ? "ตอบกลับแล้ว"
                : item.status === 2
                ? "ไปรษณีย์"
                : item.status === 3
                ? "ตีกลับ"
                : "รอดำเนินการ",
          });
        });

        // เพิ่มแถวว่างเพื่อเว้นระยะ
        worksheet.addRow([]);

        // เพิ่มแถวสรุปข้อมูล
        worksheet.addRow({
          no: "",
          datetime: "",
          contno: "",
          cusName: "",
          customer_Type: "",
          brand: "",
          register_no: "",
          emsNo: "",
          emsNoResponse: "",
          date_response: "",
          createDate: "รวมทั้งหมด",
          status: "",
        }).font = { bold: true }; // ทำให้ตัวหนังสือเป็นตัวหนา

        // เพิ่มแถวจำนวนรายการทั้งหมด
        worksheet.addRow({
          no: "",
          datetime: "",
          contno: "",
          cusName: "",
          customer_Type: "",
          brand: "",
          register_no: "",
          emsNo: "",
          emsNoResponse: "",
          date_response: "",
          createDate: "สัญญาทั้งหมด:",
          status: data.total, // แสดงจำนวนทั้งหมดของ items
        }).font = { bold: true };

        // เพิ่มแถวจำนวนที่ตอบกลับแล้ว

        worksheet.addRow({
          no: "",
          datetime: "",
          contno: "",
          cusName: "",
          customer_Type: "",
          brand: "",
          register_no: "",
          emsNo: "",
          emsNoResponse: "",
          date_response: "",
          createDate: "ตอบกลับแล้ว:",
          status: data.withDateResponse, // แสดงจำนวนที่ตอบกลับแล้ว
        }).font = { bold: true };

        worksheet.addRow({
          no: "",
          datetime: "",
          contno: "",
          cusName: "",
          customer_Type: "",
          brand: "",
          register_no: "",
          emsNo: "",
          emsNoResponse: "",
          date_response: "",
          createDate: "ยังไม่ตอบกลับแล้ว:",
          status: data.total - data.withDateResponse, // แสดงจำนวนที่ตอบกลับแล้ว
        }).font = { bold: true };
        console.log("data------>", data);

        // จัดรูปแบบเซลล์ใน Worksheet
        worksheet.eachRow((row) => {
          row.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "center" }; // จัดกึ่งกลาง
          });
        });
      });

      // สร้างไฟล์ Excel และดาวน์โหลด
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `รายงานการตอบกลับ ${dayjs().format("YYYY_MM_DD")}.xlsx`);
    } else {
      message.error("กรุณาเลือกข้อมูล");
    }
  };

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col span={12} style={{ textAlign: "start" }}>
              <b>บอกเลิกสัญญา(มือ)</b>
              <DatePicker
                style={{ marginTop: "5px", marginLeft: "5px" }}
                onChange={onChangeHand}
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
                    createAndDownloadExcelHand();
                  }}
                />
              </Tooltip>
            </Col>
          </Row>
          {BarChartHand()}
        </Spin>
      </Card>
    </>
  );
};

const ChartCancelHand = MotionHoc(Main);
export default ChartCancelHand;
