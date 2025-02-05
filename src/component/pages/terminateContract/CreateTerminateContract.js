import {
  Col,
  Row,
  Space,
  Table,
  Card,
  Spin,
  Select,
  DatePicker,
  message,
  Tooltip,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useEffect, useMemo } from "react";
import MotionHoc from "../../../utils/MotionHoc";
import { PrinterOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import axios from "axios";
import dayjs from "dayjs";
import { POST_TERMINATE_CONTRACT_RECORD } from "../../API/apiUrls";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import DateCustom from "../../../hook/DateCustom";
import CurrencyFormat from "../../../hook/CurrencyFormat";

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
  const [arrData, setArrData] = useState([]);
  const [arrayTable, setArrayTable] = useState();
  const [tableLength, setTableLength] = useState(0);
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const [forPaySelect, setForPaySelect] = useState("116");
  const [optionsGCode, setOptionGCode] = useState();
  const [selectedGCode, setSelectedGCode] = useState([]);
  const [datePicker, setDatePicker] = useState(dayjs());
  const [selectedContract, setSelectedContract] = useState("vsfhp");
  const [arrow, setArrow] = useState("Show");
  let mockFCode;
  const optionsForPay = [
    { value: "116", label: "จดหมายส่งผู้คนค้ำ(116)" },
    { value: "119", label: "บอกเลิกสัญญา(119)" },
    { value: "129", label: "ค่าบอกเลิกสัญญา(No ems)(129)" },
  ];

  const optionsContract = [
    { value: "vsfhp", label: "สัญญา 2" },
    { value: "psfhp", label: "สัญญา 3" },
    { value: "rpsl", label: "สัญญา 3(ใหม่)" },
    { value: "sfhp", label: "สัญญา 8" },
  ];

  useEffect(() => {
    if (datePicker) {
      loadData();
    }
  }, [datePicker]);

  useEffect(() => {
    let optionsGCodeData = [];

    if (forPaySelect === "116") {
      console.log("in");
      optionsGCodeData = [
        {
          label: <span>บอกเลิกสัญญาคนค้ำ(116)</span>,
          title: "บอกเลิกสัญญาคนค้ำ(116)",
          options: [
            { value: "P21", label: "P21" },
            { value: "P22", label: "P22" },
            { value: "P23", label: "P23" },
            { value: "P31", label: "P31" },
            { value: "P32", label: "P32" },
            { value: "P33", label: "P33" },
            { value: "P41", label: "P41" },
          ],
        },
      ];
    } else if (forPaySelect === "119") {
      optionsGCodeData = [
        {
          label: <span>บอกเลิกสัญญาผู้เช่าซื้อ(119)</span>,
          title: "บอกเลิกสัญญาผู้เช่าซื้อ(119)",
          options: [
            { value: "P11", label: "P11" },
            { value: "P12", label: "P12" },
            { value: "P13", label: "P13" },
          ],
        },
      ];
    } else {
      optionsGCodeData = [
        {
          label: <span>บอกเลิกสัญญาคนค้ำ(116)</span>,
          title: "บอกเลิกสัญญาคนค้ำ(116)",
          options: [
            { value: "411", label: "411" },
            { value: "413", label: "413" },
            { value: "421", label: "421" },
            { value: "422", label: "422" },
            { value: "431", label: "431" },
            { value: "432", label: "432" },
            { value: "433", label: "433" },
            { value: "441", label: "441" },
            { value: "442", label: "442" },
            { value: "443", label: "443" },
            { value: "451", label: "451" },
            { value: "452", label: "452" },
            { value: "453", label: "453" },
            { value: "461", label: "461" },
            { value: "462", label: "462" },
            { value: "463", label: "463" },
          ],
        },
      ];
    }
    setOptionGCode(optionsGCodeData);
  }, [forPaySelect]);

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

  const handleChangeContract = (value) => {
    console.log(`selected ${value}`);
    setSelectedContract(value);
    setSelectedGCode([]);
    console.log("forPaySelect---->", forPaySelect);
    if (forPaySelect === "116") {
      mockFCode = "115";
      console.log("handleChangeContract if ---->", forPaySelect);
      let dataFilter = arrData.filter(
        (item) =>
          (forPaySelect.includes(item.FORCODE) ||
            mockFCode.includes(item.FORCODE)) &&
          value.includes(item.DATA_TYPE) &&
          item.cusType > 0
      );
      setArrayTable(dataFilter);
      setTableLength(dataFilter.length);
    } else {
      console.log("handleChangeContract else ---->", forPaySelect);
      let dataFilter = arrData.filter(
        (item) =>
          forPaySelect.includes(item.FORCODE) && value.includes(item.DATA_TYPE)
      );
      setArrayTable(dataFilter);
      setTableLength(dataFilter.length);
    }
  };

  const handleChangeForPay = (value) => {
    console.log(`selected ${value}`);
    setForPaySelect(value);
    setSelectedGCode([]);
    if (value === "116") {
      console.log("forPaySelect if-->", forPaySelect);
      mockFCode = "115";
      let dataFilter = arrData.filter(
        (item) =>
          (value.includes(item.FORCODE) || mockFCode.includes(item.FORCODE)) &&
          selectedContract.includes(item.DATA_TYPE) &&
          item.cusType > 0
      );
      setArrayTable(dataFilter);
      setTableLength(dataFilter.length);
      console.log("handleChangeForPay", dataFilter);
    } else {
      console.log("forPaySelect else-->", forPaySelect);
      let dataFilter = arrData.filter(
        (item) =>
          value.includes(item.FORCODE) &&
          selectedContract.includes(item.DATA_TYPE)
      );
      setArrayTable(dataFilter);
      setTableLength(dataFilter.length);
      console.log("handleChangeForPay", dataFilter);
    }
  };

  const handleChangeGCode = (values) => {
    console.log(values);
    setSelectedGCode(values); // อัปเดตค่าที่เลือกใน Select ด้านล่าง
    if (forPaySelect === "116") {
      mockFCode = "115";
      console.log("1");
      if (values.length > 0) {
        console.log("2");
        let dataFilter = arrData.filter(
          (item) =>
            values.includes(item.GCODE) &&
            selectedContract.includes(item.DATA_TYPE) &&
            item.cusType > 0
        );
        setArrayTable(dataFilter);
        setTableLength(dataFilter.length);
        console.log("dataFilter if", dataFilter);
      } else {
        console.log("3");
        let dataFilter = arrData.filter(
          (item) =>
            (forPaySelect.includes(item.FORCODE) ||
              mockFCode.includes(item.FORCODE)) &&
            selectedContract.includes(item.DATA_TYPE) &&
            item.cusType > 0
        );
        console.log("dataFilter else", dataFilter);

        setArrayTable(dataFilter);
        setTableLength(dataFilter.length);
      }
    } else {
      console.log("4");
      if (values.length > 0) {
        console.log("5");
        let dataFilter = arrData.filter(
          (item) =>
            values.includes(item.GCODE) &&
            selectedContract.includes(item.DATA_TYPE) &&
            item.cusType > 0
        );
        setArrayTable(dataFilter);
        setTableLength(dataFilter.length);
        console.log("dataFilter if", dataFilter);
      } else {
        console.log("6");
        let dataFilter = arrData.filter(
          (item) =>
            item.FORCODE === forPaySelect &&
            selectedContract.includes(item.DATA_TYPE)
        );
        console.log("dataFilter else", dataFilter);

        setArrayTable(dataFilter);
        setTableLength(dataFilter.length);
      }
    }
  };

  const handleChange = (date) => {
    if (date) {
      setDatePicker(date); // อัปเดตค่าเมื่อผู้ใช้เลือกวันที่
      console.log("Selected date:", date.format("YYYY-MM-DD"));
    } else {
      setDatePicker(null); // หากล้างค่าให้ตั้งเป็น null
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await axios
        .post(POST_TERMINATE_CONTRACT_RECORD, {
          date: dayjs(datePicker).format("YYYY-MM-DD"),
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("setLawsuitData", res.data);
            filterData(mergeDataWithGuarantors(res.data));
          } else {
            message.error("ไม่สามารถดึงข้อมูลได้");
            console.log("ไม่สามารถดึงข้อมูลได้", res.status);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status >= 300) {
            message.error("ไม่สามารถดึงข้อมูลได้", err.status);
          }
        });
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    }
  };

  const mergeDataWithGuarantors = (data) => {
    console.log("mergeDataWithGuarantors");

    return data.reduce((acc, record, index) => {
      // ข้อมูลหลัก
      const mainData = {
        ...record,
        cusType: 0,
        GCODE: record.GCODE,
        REGNO: record.REGNO,
        NAME: `${record.SNAM} ${record.NAME1} ${record.NAME2}`,
      };

      // ข้อมูลผู้ค้ำประกัน (guarantors)
      const guarantorData = (record.guarantors || []).map((guarantor) => ({
        ...record,
        cusType: parseInt(guarantor.GARNO),
        NAME: `${guarantor.SNAM} ${guarantor.NAME1} ${guarantor.NAME2}`,
      }));

      // รวมข้อมูลหลักและผู้ค้ำประกันใน array เดียว
      return [...acc, mainData, ...guarantorData];
    }, []);
  };

  const filterData = (value) => {
    if (value) {
      let data = [];
      if (userCompany === "3") {
        data = value.filter((item) => item.LOCAT.includes("K"));
      } else {
        console.log("else----->");
        data = value.filter((item) => !item.LOCAT.includes("K"));
      }

      console.log("data------->", data);
      console.log("forPaySelect---->", forPaySelect);

      setArrData(data);
      let dataFilter = data.filter(
        (item) =>
          (forPaySelect.includes(item.FORCODE) ||
            item.FORCODE.includes("115")) &&
          selectedContract.includes(item.DATA_TYPE) &&
          item.cusType > 0
      );
      // console.log("dataFilter", dataFilter);
      console.log("dataFilter--->", dataFilter);

      setArrayTable(dataFilter);
      setTableLength(dataFilter.length);
      setLoading(false);
    }
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = arrData.filter(
      (item) =>
        (item.CONTNO && item.CONTNO.includes(value)) ||
        (item.NAME && item.NAME.includes(value)) ||
        (item.REGNO && item.REGNO.includes(value))
    );
    console.log("result-->", result);

    if (value) {
      setArrayTable(result);
      setTableLength(result.length);
    } else {
      if (forPaySelect === "116") {
        console.log("1");
        mockFCode = "115";
        if (selectedGCode?.length > 0) {
          console.log("2");
          let dataFilter = arrData.filter(
            (item) =>
              selectedGCode?.includes(item.GCODE) &&
              selectedContract?.includes(item.DATA_TYPE) &&
              item?.cusType > 0
          );
          setArrayTable(dataFilter);
          setTableLength(dataFilter.length);
          console.log("dataFilter if", dataFilter);
        } else {
          console.log("3");
          let dataFilter = arrData.filter(
            (item) =>
              (forPaySelect?.includes(item?.FORCODE) ||
                mockFCode?.includes(item?.FORCODE)) &&
              selectedContract?.includes(item?.DATA_TYPE) &&
              item?.cusType > 0
          );
          console.log("dataFilter else", dataFilter);

          setArrayTable(dataFilter);
          setTableLength(dataFilter.length);
        }
      } else {
        console.log("4");
        if (selectedGCode?.length > 0) {
          console.log("5");
          let dataFilter = arrData.filter(
            (item) =>
              selectedGCode?.includes(item?.GCODE) &&
              selectedContract?.includes(item?.DATA_TYPE) &&
              item.cusType > 0
          );
          setArrayTable(dataFilter);
          setTableLength(dataFilter.length);
          console.log("dataFilter if", dataFilter);
        } else {
          console.log("6");
          let dataFilter = arrData.filter(
            (item) =>
              item?.FORCODE === forPaySelect &&
              selectedContract?.includes(item?.DATA_TYPE)
          );
          console.log("dataFilter else", dataFilter);

          setArrayTable(dataFilter);
          setTableLength(dataFilter.length);
        }
      }
    }
  };

  const createAndDownloadExcel = async () => {
    // สร้าง Workbook
    const workbook = new ExcelJS.Workbook();

    // กำหนดประเภท GCODE ที่ต้องการแยก (ไม่ซ้ำกัน)
    const uniqueGCodes = [...new Set(arrayTable.map((data) => data.GCODE))];

    // วนลูปสร้าง Sheet สำหรับแต่ละ GCODE
    uniqueGCodes.forEach((gCode) => {
      const worksheet = workbook.addWorksheet(`ประเภท ${gCode}`); // ใช้ GCODE เป็นชื่อ Sheet

      // กำหนดคอลัมน์ของ Worksheet
      worksheet.columns = [
        { header: "ลำดับ", key: "no", width: 10 },
        { header: "สัญญา", key: "data_type", width: 10 },
        { header: "ประเภทจ่าย", key: "forCode", width: 10 },
        { header: "ประเภทบัญชี", key: "gCode", width: 10 },
        { header: "รอบวันออกจดหมายในระบบ", key: "date", width: 20 },
        { header: "เลขที่สัญญา", key: "contno", width: 20 },
        { header: "ชื่อลูกค้า", key: "cusName", width: 30 },
        { header: "ประเภทลูกค้า", key: "cusType", width: 10 },
        { header: "ยี่ห้อ", key: "type", width: 15 },
        { header: "ทะเบียน", key: "regNo", width: 15 },
        { header: "ค้างงวด", key: "overdue", width: 15 },
        { header: "เงินค้าง", key: "arrears", width: 20 },
        { header: "ค่าทวงถาม", key: "letter", width: 15 },
        { header: "ems no.", key: "emsNo", width: 25 },
      ];

      // กรองข้อมูลที่ตรงกับ GCODE
      const filteredData = arrayTable.filter((data) => data.GCODE === gCode);

      // เพิ่มข้อมูลในแต่ละแถว
      filteredData.forEach((data, index) => {
        worksheet.addRow([
          index + 1,
          data.DATA_TYPE,
          data.FORCODE,
          data.GCODE,
          dayjs(data.DOCDT).format("YYYY-MM-DD"), // วันที่ส่ง
          data.CONTNO,
          data.NAME,
          data.cusType,
          data.TYPE,
          data.REGNO,
          data.EXP_PRD,
          data.TOTPRC - data.SMPAY,
          data.LETTER,
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
    saveAs(blob, `รายงานบอกเลิกสัญญา ${dayjs().format("YYYY_MM_DD")}.xlsx`);
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
      title: "วันที่ออกจดหมาย",
      align: "center",
      render: (record) => (
        <>{record.DOCDT ? convertDateThaiShort(record.DOCDT) : null}</>
      ),
    },
    {
      title: "ประเภท",
      dataIndex: "GCODE",
      key: "GCODE",
      align: "center",
    },
    {
      title: "เลขที่สัญญา",
      dataIndex: "CONTNO",
      key: "CONTNO",
      align: "center",
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "CUSTOMER",
      key: "CUSTOMER",
      align: "center",
      render: (text, record) => <>{record.NAME ? record.NAME : null}</>,
    },
    {
      title: "ประเภทลูกค้า",
      align: "center",
      render: (text, record) => (
        <>
          {record.cusType === 0 ? "ผู้เช่าซื้อ" : `ผู้ค้ำที่ ${record.cusType}`}
        </>
      ),
    },
    {
      title: "รายละเอียดรถ",
      dataIndex: "CONTNO",
      key: "CONTNO",
      align: "center",
      render: (text, record) => (
        <>
          {record.TYPE} <br />
          {record.REGNO}
        </>
      ),
    },
    {
      title: "ค้างงวด",
      dataIndex: "EXP_PRD",
      key: "EXP_PRD",
      align: "center",
      // render: (text, record) => (
      //   <>{record.LOAN.CONTNO ? record.LOAN.CONTNO : null}</>
      // ),
    },
    {
      title: "เงินค้าง",
      align: "center",
      render: (text, record) => (
        <>
          {currencyFormatPoint(record.TOTPRC - record.SMPAY)} <br />
        </>
      ),
    },
    {
      title: "ค่าทวงถาม",
      align: "center",
      render: (text, record) => <>{currencyFormatComma(record.LETTER)}</>,
    },
  ];

  return (
    <>
      {ROLE_ID === "1" || ROLE_ID === "2" ? (
        <>
          <Card>
            <Spin spinning={loading} size="large" tip=" Loading... ">
              <Row>
                <Col span={"14"} style={{ textAlign: "start" }}>
                  <Select
                    style={{
                      width: "auto",
                      marginRight: "5px",
                      marginBottom: "5px",
                    }}
                    onChange={handleChangeContract}
                    popupMatchSelectWidth={false}
                    options={optionsContract}
                    value={selectedContract}
                    size="large"
                  />
                  <Select
                    style={{
                      width: "auto",
                      marginRight: "5px",
                      marginBottom: "5px",
                    }}
                    onChange={handleChangeForPay}
                    popupMatchSelectWidth={false}
                    options={optionsForPay}
                    value={forPaySelect}
                    size="large"
                  />
                  <Select
                    style={{
                      width: selectedGCode.length > 0 ? "auto" : "150px",
                      marginBottom: "5px",
                    }}
                    mode="multiple"
                    allowClear
                    value={selectedGCode} // ใช้ state ในการควบคุมค่า
                    popupMatchSelectWidth={false}
                    onChange={handleChangeGCode}
                    options={optionsGCode}
                    placeholder="เลือกประเภท"
                    size="large"
                  />
                </Col>
                <Col span={"10"} style={{ textAlign: "end" }}>
                  <Space direction="vertical" size={12}>
                    <DatePicker
                      value={datePicker}
                      onChange={handleChange}
                      format="YYYY-MM-DD"
                      style={{ width: "auto", marginRight: "5px" }}
                      size="large"
                    />
                  </Space>
                  <Search
                    placeholder="ค้นหาสัญญา"
                    // onSearch={onQuery}
                    enterButton
                    onChange={search}
                    style={{
                      width: 200,
                    }}
                    size="large"
                  />
                </Col>
                <Col
                  span={"24"}
                  style={{ textAlign: "start", marginTop: "10px" }}
                >
                  <Space direction="vertical" size={12}>
                    <Tooltip
                      placement="bottom"
                      title="บันทึกข้อมูล excel"
                      arrow={mergedArrow}
                    >
                      <PrinterOutlined
                        style={{
                          fontSize: "40px",
                          color: "green",
                          cursor: "pointer",
                        }}
                        key="print"
                        onClick={createAndDownloadExcel}
                      />
                    </Tooltip>
                  </Space>
                </Col>
              </Row>
              <Row>
                <Col span={"24"}>
                  <Table
                    style={{ marginTop: "10px" }}
                    size="small"
                    columns={columns}
                    dataSource={arrayTable}
                    scroll={{ x: 850 }}
                    footer={() => (
                      <p>จำนวนสัญญาที่ค้นหาทั้งหมด {tableLength} </p>
                    )}
                  />
                </Col>
              </Row>
            </Spin>
          </Card>
        </>
      ) : (
        <Card>
          {" "}
          <b>ไม่มีสิทธ์เข้าถึงข้อมูล</b>
        </Card>
      )}
    </>
  );
};

const CreateTerminateContract = MotionHoc(Main);
export default CreateTerminateContract;
