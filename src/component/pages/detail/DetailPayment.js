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
  Button,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useMemo } from "react";
import MotionHoc from "../../../utils/MotionHoc";
import { PrinterOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { POST_DETAIL_PAYMENT } from "../../API/apiUrls";
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
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const [arrow, setArrow] = useState("Show");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [queryContno, setQueryContno] = useState();
  const [date, setDate] = useState();
  const [result, setResult] = useState();

  const onQuery = () => {
    if (queryContno) {
      let typeValue;
      let subData = queryContno.substring(0, 1);
      if (subData === "1") {
        typeValue = "LSFHP";
        queryData(queryContno, typeValue);
      } else if (subData === "3") {
        let checkType = queryContno.substring(5, 9);
        console.log("checkType", checkType);
        if (parseInt(checkType) > 1200) {
          typeValue = "RPSL";
          queryData(queryContno, typeValue);
        } else {
          message.error("ไม่สามารถดูข้อมูล บัญชี 3(เก่า) ได้ ❌");
        }
      } else {
        message.error("ไม่พบข้อมูล กรุณาตรวจสอบเลขบัญชี ❌");
      }

      console.log("subData", subData);
      console.log("typeValue", typeValue);
      console.log("queryContno--->", queryContno);
    }
  };

  const queryData = async (queryContno, typeValue) => {
    setLoading(true);
    try {
      await axios
        .post(POST_DETAIL_PAYMENT, {
          contno: queryContno,
          todate: dayjs(date).format("YYYY-MM-DD"),
          type: typeValue,
        })
        .then(async (resQuery) => {
          let i = 1;
          if (resQuery.status === 200) {
            setArrData(resQuery?.data[0]);
            const newData = resQuery?.data[0]?.resultdata?.map((item) => ({
              ...item,
              key: i++,
            }));
            console.log("newData", newData);
            setArrayTable(newData);
            renderData(newData);
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
      renderData(selectedRows);
    } else {
      renderData(arrayTable);
    }
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
      (sum, item) => sum + (item.Payment || 0),
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
    let dataTotal = {
      totalDays,
      totalPayment,
      totalDUEINTEFF,
      totalDUETONEFF,
    };
    setResult(dataTotal);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // ตั้งค่าฟอนต์ภาษาไทย (ถ้าจำเป็น)
    doc.setFont("THSarabunNew");
    doc.setFontSize(16);

    // ส่วนหัวของเอกสาร
    doc.text("รายละเอียดสัญญา", 105, 15, null, null, "center");
    let yLine = 25;
    // ข้อมูลเลขที่สัญญา
    doc.setFontSize(12);
    doc.text(
      `ผู้เช่าซื้อ : ${arrData?.customer[0]?.NAME}`,
      105,
      yLine,
      null,
      null,
      "center"
    );

    if (arrData?.guarantor?.length > 0 && queryContno.substring(0, 1) !== "1") {
      arrData.guarantor.map((data, index) =>
        doc.text(
          `คนค้ำที่ ${index + data.GARNO}: ${data.NAME}`,
          105,
          yLine + 5,
          null,
          null,
          "center"
        )
      );
    }
    yLine += 5;
    doc.text(`เลขที่สัญญา: ${arrData?.chqtran[0]?.contno}`, 14, yLine + 10);
    doc.text(`ประเภท: ${arrData?.invtran?.baabdes}`, 14, yLine + 20);
    doc.text(`อำเภอ: ${arrData?.invtran?.modeldes}`, 14, yLine + 30);
    doc.text(`โฉนด: ${arrData?.invtran?.color}`, 14, yLine + 40);
    doc.text(`เลขโฉนด: ${arrData?.invtran?.strno}`, 14, yLine + 50);

    doc.text(
      `วันเริ่มทำสัญญา: ${
        arrData?.loan?.startdate
          ? convertDateThai(arrData?.loan?.startdate)
          : "-"
      }`,
      120,
      yLine + 10
    );
    doc.text(
      `ชำระงวดแรกเมื่อ: ${
        arrData?.loan?.Sdate ? convertDateThai(arrData?.loan?.Sdate) : "-"
      }`,
      120,
      yLine + 20
    );
    doc.text(
      `คงเหลือ: ${
        arrData?.loan?.tonkong
          ? currencyFormatPoint(arrData?.loan?.tonkong)
          : "-"
      } บาท`,
      120,
      yLine + 30
    );
    doc.text(
      `ผ่อน: ${
        arrData?.loan?.tnopay ? currencyFormatPoint(arrData?.loan?.tnopay) : 0
      } งวด`,
      120,
      yLine + 40
    );
    doc.text(
      `งวดละ: ${
        arrayTable[0]?.NETPAY ? currencyFormatPoint(arrayTable[0]?.NETPAY) : 0
      } บาท`,
      120,
      yLine + 50
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
    data.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.Inpdt ? convertDateThaiShort(item.Inpdt) : "-",
        item.Days ? item.Days : 0,
        item.Payment ? currencyFormatPoint(item.Payment) : 0,
        item.DUEINTEFF ? currencyFormatPoint(item.DUEINTEFF) : 0,
        item.DUETONEFF ? currencyFormatPoint(item.DUETONEFF) : 0,
        item.KangDok ? currencyFormatPoint(item.KangDok) : 0,
        item.Ton ? currencyFormatPoint(item.Ton) : 0,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yLine + 60,
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
    });

    // ผลรวมด้านล่าง
    let finalY = doc.lastAutoTable.finalY + 10; // ตำแหน่งสุดท้ายของตาราง

    doc.setFontSize(12);
    doc.setTextColor(255, 165, 0);
    doc.text(`จำนวนวันที่ค้าง : ${result?.totalDays} วัน`, 14, finalY);

    doc.setTextColor(0, 0, 255);
    doc.text(
      `ยอดเงินที่ชำระ : ${currencyFormatPoint(result?.totalPayment)} บาท`,
      14,
      finalY + 10
    );

    doc.setTextColor(255, 0, 0);
    doc.text(
      `ดอกเบี้ย : ${currencyFormatPoint(result?.totalDUEINTEFF)} บาท`,
      14,
      finalY + 20
    );

    doc.setTextColor(0, 128, 0);
    doc.text(
      `เงินต้น : ${currencyFormatPoint(result?.totalDUETONEFF)} บาท`,
      14,
      finalY + 30
    );

    // ดาวน์โหลด PDF
    doc.save(`ข้อมูลสัญญา ${queryContno}.pdf`);
  };

  const columns = [
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
        <>{record?.Inpdt ? convertDateThaiShort(record?.Inpdt) : null}</>
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
                <DatePicker
                  size="large"
                  style={{
                    marginRight: "10px",
                    marginBottom: "10px",
                  }}
                  defaultValue={dayjs()}
                  onChange={handleChange}
                />
              </Space>
              <Search
                placeholder="ค้นหาสัญญา"
                onSearch={onQuery}
                enterButton
                onChange={(e) => handleChangeContno(e.target.value)}
                style={{
                  width: 200,
                }}
                size="large"
              />
            </Col>
            <Col span={"24"} style={{ textAlign: "end" }}>
              <b style={{ color: "red" }}>
                ***หมายเหตุ: ค้นหาได้เฉพาะบัญชี 1,3(ใหม่)
              </b>
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
                <b>ผู้เช่าซื้อ : {arrData?.customer[0]?.NAME}</b>
                <br />
                {arrData?.guarantor?.length > 0 &&
                queryContno.substring(0, 1) !== "1"
                  ? arrData.guarantor.map((data, index) => (
                      <b key={index}>
                        คนค้ำที่ {index + data.GARNO}: {data.NAME}
                      </b>
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
                    onClick={generatePDF}
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
                  <b>เลขที่สัญญา : </b> {arrData?.customer[0]?.CONTNO}
                </p>
                <p>
                  <b>ประเภท : </b> {arrData?.invtran?.baabdes}
                </p>
                <p>
                  <b>
                    {queryContno.substring(0, 1) === "3" ? "รุ่น" : "อำเภอ"} :{" "}
                  </b>{" "}
                  {arrData?.invtran?.modeldes}
                </p>
                <p>
                  <b>
                    {queryContno.substring(0, 1) === "3" ? "สี" : "โฉนด"} :{" "}
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
              </Col>
              <Col span={12} style={{ textAlign: "center" }}>
                <p>
                  <b>วันเริ่มทำสัญญา : </b>
                  {arrData?.loan?.startdate
                    ? convertDateThai(arrData?.loan?.startdate)
                    : "-"}
                </p>
                <p>
                  <b>ชำระงวดแรกเมื่อ : </b>{" "}
                  {arrayTable[0]?.Sdate
                    ? convertDateThai(arrData[0]?.Sdate)
                    : "-"}
                </p>
                <p>
                  <b>คงเหลือ : </b>{" "}
                  {arrData?.loan?.tonkong
                    ? currencyFormatPoint(arrData?.loan?.tonkong)
                    : 0}{" "}
                  บาท
                </p>
                <p>
                  <b>
                    ผ่อน :{" "}
                    {arrData?.loan?.tnopay
                      ? currencyFormatPoint(arrData?.loan?.tnopay)
                      : 0}
                  </b>{" "}
                  งวด
                </p>
                <p>
                  <b>งวดละ : </b>{" "}
                  {arrayTable[0]?.NETPAY
                    ? currencyFormatPoint(arrayTable[0]?.NETPAY)
                    : 0}{" "}
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
                  columns={columns}
                  dataSource={arrayTable}
                  rowSelection={rowSelection}
                  scroll={{ x: 850 }}
                  footer={() => (
                    <>
                      <p style={{ textAlign: "left", color: "orange" }}>
                        จำนวนวันที่ค้าง : {result.totalDays}
                        {" วัน"}
                      </p>
                      <p style={{ textAlign: "left", color: "blue" }}>
                        ยอดเงินที่ชำระ :{" "}
                        {result.totalPayment
                          ? currencyFormatPoint(result.totalPayment)
                          : 0}
                        {" บาท"}
                      </p>
                      <p style={{ textAlign: "left", color: "red" }}>
                        ดอกเบี้ย :{" "}
                        {result.totalDUEINTEFF
                          ? currencyFormatPoint(result.totalDUEINTEFF)
                          : 0}
                        {" บาท"}
                      </p>
                      <p style={{ textAlign: "left", color: "green" }}>
                        เงินต้น :{" "}
                        {result.totalDUETONEFF
                          ? currencyFormatPoint(result.totalDUETONEFF)
                          : 0}
                        {" บาท"}
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
};

const DetailPayment = MotionHoc(Main);
export default DetailPayment;
