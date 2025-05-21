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
  const [checkContno, setCheckContno] = useState(false);

  // const optionsContract = [
  //   { value: "LSFHP", label: "สัญญา 1" },
  //   { value: "PSFHP", label: "สัญญา 3(เก่า)" },
  //   { value: "RPSL", label: "สัญญา 3(ใหม่)" },
  //   { value: "KSM", label: "KSM" },
  // ];

  const onQuery = () => {
    if (queryContno) {
      let typeValue;
      let subData = queryContno.substring(0, 1);
      let subDataLand = queryContno.substring(0, 3);
      console.log("subDataLand", subDataLand);

      if (userCompany === "3") {
        typeValue = "KSM";
        queryData(queryContno, typeValue);
        console.log("subData", subData);
        console.log("typeValue", typeValue);
        console.log("queryContno--->", queryContno);
      } else {
        if (subData === "1" || subDataLand === "222") {
          typeValue = "LSFHP";
          setCheckContno(false);
          queryData(queryContno, typeValue);
        } else if (subData === "3") {
          setCheckContno(true);
          let checkType = queryContno.substring(5, 9);
          console.log("checkType", checkType);
          if (parseInt(checkType) > 1200) {
            typeValue = "RPSL";
            queryData(queryContno, typeValue);
          } else {
            // message.error("ไม่สามารถดูข้อมูล บัญชี 3(เก่า) ได้ ❌");
            typeValue = "PSFHP";
            queryData(queryContno, typeValue);
          }
        } else {
          typeValue = "RPSL";
          queryData(queryContno, typeValue);
        }

        console.log("subData", subData);
        console.log("typeValue", typeValue);
        console.log("queryContno--->", queryContno);
      }
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
      `ผู้ทำสัญญา : ${arrData?.customer[0]?.NAME}`,
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
          `คนค้ำที่ ${index + 1}: ${data.NAME}`,
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
        queryContno.substring(0, 1) === "3"
          ? ""
          : `จัวหวัด: ${arrData?.invtran?.baabdes}`
      }`,
      50,
      yLine + 10
    );
    doc.text(
      `${
        queryContno.substring(0, 1) === "3"
          ? ""
          : `อำเภอ: ${arrData?.invtran?.modeldes}`
      }`,
      50,
      yLine + 15
    );
    doc.text(
      `${
        queryContno.substring(0, 1) === "3"
          ? ""
          : `ประเภท: ${arrData?.invtran?.color}`
      }`,
      50,
      yLine + 20
    );
    doc.text(
      `${
        queryContno.substring(0, 1) === "3"
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
    // doc.text(
    //   `ต้นคงเหลือ: ${
    //     arrData?.loan?.tonkong
    //       ? currencyFormatPoint(arrData?.loan?.tonkong)
    //       : "-"
    //   } บาท`,
    //   120,
    //   yLine + 25
    // );
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

    // doc.text(
    //   `ผ่อน: ${
    //     arrData?.loan?.tnopay ? currencyFormatPoint(arrData?.loan?.tnopay) : 0
    //   } งวด`,
    //   120,
    //   yLine + 35
    // );
    // doc.text(
    //   `งวดละ: ${
    //     arrData?.loan?.totUpay ? currencyFormatPoint(arrData?.loan?.totUpay) : 0
    //   } บาท`,
    //   145,
    //   yLine + 35
    // );

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
        item.Payment ? currencyFormatPoint(item.Payment) : 0,
        item.DUEINTEFF ? currencyFormatPoint(item.DUEINTEFF) : 0,
        item.DUETONEFF ? currencyFormatPoint(item.DUETONEFF) : 0,
        item.KangDok ? currencyFormatPoint(item.KangDok) : 0,
        item.Ton ? currencyFormatPoint(item.Ton) : 0,
      ];
      tableRows.push(rowData);

      totalDays += Number(item.Days || 0);
      totalPayment += Number(item.Payment || 0);
      totalDUEINTEFF += Number(item.DUEINTEFF || 0);
      totalDUETONEFF += Number(item.DUETONEFF || 0);
      totalKangDok += Number(item.KangDok || 0);
    });

    tableRows.push([
      "",
      "รวมทั้งหมด",
      totalDays,
      currencyFormatPoint(totalPayment),
      currencyFormatPoint(totalDUEINTEFF),
      currencyFormatPoint(totalDUETONEFF),
      currencyFormatPoint(totalKangDok),
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
    });

    // ผลรวมด้านล่าง
    let finalY = doc.lastAutoTable.finalY + 10; // ตำแหน่งสุดท้ายของตาราง

    // doc.setFontSize(12);
    // doc.setTextColor(255, 165, 0);
    // doc.text(`จำนวนวันที่ค้าง : ${result?.totalDays} วัน`, 14, finalY);

    // doc.setTextColor(0, 0, 255);
    // doc.text(
    //   `ยอดเงินที่ชำระ : ${currencyFormatPoint(result?.totalPayment)} บาท`,
    //   14,
    //   finalY + 10
    // );

    // doc.setTextColor(255, 0, 0);
    // doc.text(
    //   `ดอกเบี้ยที่ชำระ : ${currencyFormatPoint(result?.totalDUEINTEFF)} บาท`,
    //   14,
    //   finalY + 20
    // );

    // doc.setTextColor(0, 128, 0);
    // doc.text(
    //   `เงินต้นที่ชำระ : ${currencyFormatPoint(result?.totalDUETONEFF)} บาท`,
    //   14,
    //   finalY + 30
    // );

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
              {/* <Select
                style={{
                  width: "auto",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
                // onChange={handleChangeContract}
                popupMatchSelectWidth={false}
                options={optionsContract}
                placeholder="โปรดเลือกสัญญา"
                size="large"
              /> */}
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
                ***หมายเหตุ: ค้นหาได้เฉพาะบัญชี 1,3
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
                <b>ผู้ทำสัญญา : {arrData?.customer[0]?.NAME}</b>
                <br />
                {arrData?.guarantor?.length > 0 &&
                queryContno.substring(0, 1) !== "1"
                  ? arrData.guarantor.map((data, index) => (
                      <>
                        <b key={index}>
                          คนค้ำที่ {data.GARNO}: {data.NAME}
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
                {/* {!checkContno ? ( */}
                <>
                  <p>
                    <b>
                      {queryContno.substring(0, 1) === "3"
                        ? "ประเภท "
                        : "จังหวัด "}
                      :{" "}
                    </b>{" "}
                    {arrData?.invtran?.baabdes}
                  </p>
                  <p>
                    <b>
                      {queryContno.substring(0, 1) === "3" ? "รุ่น" : "อำเภอ"} :{" "}
                    </b>{" "}
                    {arrData?.invtran?.modeldes}
                  </p>
                  <p>
                    <b>
                      {queryContno.substring(0, 1) === "3" ? "สี" : "ประเภท"} :{" "}
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
                {/* ) : null} */}
              </Col>

              <Col span={12} style={{ textAlign: "center" }}>
                <p>
                  <b>วันเริ่มทำสัญญา : </b>
                  {arrData?.loan?.sdate
                    ? convertDateThaiShort(arrData?.loan?.sdate)
                    : "-"}
                </p>
                <p>
                  <b>ชำระงวดแรกเมื่อ : </b>{" "}
                  {arrData?.chqtran[0]?.inpdt
                    ? convertDateThaiShort(arrData?.chqtran[0]?.inpdt)
                    : "-"}
                </p>
                <p>
                  <b>ยอดกู้ : </b>{" "}
                  {arrData?.loan?.ncshprc
                    ? currencyFormatPoint(arrData?.loan?.ncshprc)
                    : 0}{" "}
                  บาท
                </p>
                <p>
                  <b>วันที่คิดดอกเบี้ย : </b>
                  {arrData?.loan?.startdate
                    ? `${convertDateThaiShort(arrData?.loan?.startdate)} -
                        ${convertDateThaiShort(arrData?.loan?.enddate)}`
                    : "-"}
                </p>
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
                      )
                    : arrData?.loan?.kangdok}{" "}
                  บาท
                </p>
                <p style={{ color: "red" }}>
                  <b>รวมทุนฟ้อง : </b>{" "}
                  {arrData?.loan?.flag === 1
                    ? currencyFormatPoint(
                        arrData?.loan?.kangdok +
                          arrData?.loan?.dok +
                          arrData?.loan?.tonkong
                      )
                    : arrData?.loan?.kangdok + arrData?.loan?.tonkong}{" "}
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
                          {result.totalPayment
                            ? currencyFormatPoint(result.totalPayment)
                            : 0}
                          {" บาท"}
                        </p>
                        <p style={{ textAlign: "left", color: "red" }}>
                          ดอกเบี้ยที่ชำระ :{" "}
                          {result.totalKongdok
                            ? currencyFormatPoint(result.totalKongdok)
                            : 0}
                          {" บาท"}
                        </p>
                        <p style={{ textAlign: "left", color: "green" }}>
                          เงินต้นที่ชำระ :{" "}
                          {result.totalDUETONEFF
                            ? currencyFormatPoint(result.totalDUETONEFF)
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
};

const DetailPayment = MotionHoc(Main);
export default DetailPayment;
