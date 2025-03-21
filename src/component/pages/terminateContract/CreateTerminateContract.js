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
  Modal,
  Button,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useEffect, useMemo } from "react";
import MotionHoc from "../../../utils/MotionHoc";
import { PrinterOutlined, SearchOutlined } from "@ant-design/icons";
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
  const [datePicker1, setDatePicker1] = useState();
  const [datePicker2, setDatePicker2] = useState();
  const [selectedContract, setSelectedContract] = useState("vsfhp");
  const [arrow, setArrow] = useState("Show");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const { RangePicker } = DatePicker;
  let mockFCode;

  const optionsForPay = [
    { value: "116", label: "จดหมายส่งผู้คนค้ำ(116)" },
    { value: "119", label: "บอกเลิกสัญญา(119)" },
    { value: "129", label: "ค่าบอกเลิกสัญญา(No ems)(129)", disabled: true },
  ];

  const optionsContract = [
    { value: "vsfhp", label: "สัญญา 2" },
    { value: "psfhp", label: "สัญญา 3" },
    { value: "rpsl", label: "สัญญา 3(ใหม่)" },
    { value: "sfhp", label: "สัญญา 8" },
  ];

  const optionsCheckData = [
    { value: "P21", label: "P21" },
    { value: "P22", label: "P22" },
    { value: "P23", label: "P23" },
    { value: "P31", label: "P31" },
    { value: "P32", label: "P32" },
    { value: "P33", label: "P33" },
    { value: "P41", label: "P41" },
    { value: "P11", label: "P11" },
    { value: "P12", label: "P12" },
    { value: "P13", label: "P13" },
  ];

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
          value === item.DATA_TYPE &&
          item.cusType > 0
      );
      setArrayTable(dataFilter);
      setTableLength(dataFilter.length);
    } else {
      console.log("handleChangeContract else ---->", forPaySelect);
      let dataFilter = arrData.filter(
        (item) =>
          forPaySelect.includes(item.FORCODE) && value === item.DATA_TYPE
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
          selectedContract === item.DATA_TYPE &&
          item.cusType > 0
      );
      setArrayTable(dataFilter);
      setTableLength(dataFilter.length);
      console.log("handleChangeForPay", dataFilter);
    } else {
      console.log("forPaySelect else-->", forPaySelect);
      let dataFilter = arrData.filter(
        (item) =>
          value.includes(item.FORCODE) && selectedContract === item.DATA_TYPE
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
            selectedContract === item.DATA_TYPE &&
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
            selectedContract === item.DATA_TYPE &&
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
            selectedContract === item.DATA_TYPE &&
            item.cusType > 0
        );
        setArrayTable(dataFilter);
        setTableLength(dataFilter.length);
        console.log("dataFilter if", dataFilter);
      } else {
        console.log("6");
        let dataFilter = arrData.filter(
          (item) =>
            item.FORCODE === forPaySelect && selectedContract === item.DATA_TYPE
        );
        console.log("dataFilter else", dataFilter);

        setArrayTable(dataFilter);
        setTableLength(dataFilter.length);
      }
    }
  };

  const handleChange = (startDate, endDate) => {
    console.log("sssss");

    console.log(endDate[0]);
    console.log(endDate[1]);

    if (endDate[0] && endDate[1]) {
      setDatePicker1(endDate[0]); // อัปเดตค่าเมื่อผู้ใช้เลือกวันที่
      setDatePicker2(endDate[1]); // อัปเดตค่าเมื่อผู้ใช้เลือกวันที่
    } else {
      setDatePicker1(null); // หากล้างค่าให้ตั้งเป็น null
      setDatePicker2(null); // หากล้างค่าให้ตั้งเป็น null
      setArrayTable([]);
      setArrData([]);
    }
  };

  const handleLoad = () => {
    console.log("load");
    if (selectedContract && datePicker1 && datePicker2) {
      loadData();
    } else {
      message.error("กรุณาเลือกสัญญาและวันที่ !! ");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await axios
        .post(POST_TERMINATE_CONTRACT_RECORD, {
          date1: dayjs(datePicker1).format("YYYY-MM-DD"),
          date2: dayjs(datePicker2).format("YYYY-MM-DD"),
          DATA_TYPE: selectedContract,
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("setLawsuitData", res.data);
            filterData(mergeDataWithGuarantors(res.data));
          } else {
            message.error("ไม่มีข้อมูล");
            console.log("ไม่สามารถดึงข้อมูลได้", res.status);
            setArrayTable([]);
            setArrData([]);
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

    const mergedData = data.reduce((acc, record) => {
      const mainData = (record.address || []).map((addr) => ({
        ...record,
        cusType: 0,
        GCODE: record.GCODE,
        REGNO: record.REGNO,
        CONTNO: record.CONTNO, // เพิ่ม CONTNO ให้ชัดเจน
        NAME: `${record.SNAM} ${record.NAME1 || ""} ${
          record.NAME2 || ""
        }`.trim(),
        address: addr,
      }));

      const guarantorData = (record.guarantors || []).flatMap((guarantor) =>
        (guarantor.address || []).map((addr) => ({
          ...record,
          cusType: parseInt(guarantor.GARNO),
          NAME: `${guarantor.SNAM} ${guarantor.NAME1} ${guarantor.NAME2}`.trim(),
          address: addr,
        }))
      );

      return [...acc, ...mainData, ...guarantorData];
    }, []);

    // เรียงลำดับ CONTNO ก่อน แล้ว GARNO ทีหลัง
    const sortedData = mergedData.sort((a, b) => {
      const contnoComparison = a.CONTNO.localeCompare(b.CONTNO, undefined, {
        numeric: true,
      });
      if (contnoComparison !== 0) return contnoComparison; // เรียงตาม CONTNO ก่อน

      return (a.cusType || 0) - (b.cusType || 0); // GARNO: 0 (ลูกค้าหลัก) จะมาก่อน, จากนั้นเรียง 1, 2, 3...
    });

    // เพิ่ม key ให้แต่ละ record เริ่มจาก 1
    return sortedData.map((item, index) => ({
      ...item,
      key: index + 1, // เริ่ม key จาก 1
    }));
  };

  const filterData = (value) => {
    if (value) {
      let data = [];
      if (userCompany === "3") {
        data = value.filter(
          (item) =>
            item.LOCAT.includes("K") &&
            optionsCheckData.some((option) => item.GCODE.includes(option.value))
        );
      } else {
        console.log("else----->");
        data = value.filter(
          (item) =>
            !item.LOCAT.includes("K") &&
            optionsCheckData.some((option) => item.GCODE.includes(option.value))
        );
      }

      console.log("data------->", data);
      console.log("forPaySelect---->", selectedContract);

      setArrData(data);
      let dataFilter;

      if (forPaySelect === "116") {
        console.log("if");
        dataFilter = data.filter(
          (item) =>
            (forPaySelect.includes(item.FORCODE) ||
              item.FORCODE.includes("115")) &&
            selectedContract === item.DATA_TYPE &&
            item.cusType > 0
        );
      } else {
        console.log("else");

        dataFilter = data.filter(
          (item) =>
            forPaySelect.includes(item.FORCODE) &&
            selectedContract === item.DATA_TYPE
        );
      }
      console.log("dataFilter--->", dataFilter);
      if (dataFilter?.length === 0) {
        message.error("ไม่พบข้อมูล");
      }
      setArrayTable(dataFilter);
      setTableLength(dataFilter.length);
      setLoading(false);
    }
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onClickDownload = () => {
    Modal.confirm({
      title: "ต้องการดาวน์ข้อมูล excel ?",
      okText: "ยืนยัน",
      cancelText: "ปิด",
      onOk: () => {
        createAndDownloadExcel();
      },
    });
  };

  const onSearch = (value) => {
    let result = arrayTable.filter(
      (item) =>
        (item.CONTNO && item.CONTNO.includes(value)) ||
        (item.NAME && item.NAME.includes(value)) ||
        (item.REGNO && item.REGNO.includes(value)) ||
        convertDateThaiShort(item.DOCDT).includes(value)
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
    let uniqueGCodes = [];
    // กำหนดประเภท GCODE ที่ต้องการแยก (ไม่ซ้ำกัน)
    if (selectedRows && selectedRows.length > 0) {
      uniqueGCodes = [...new Set(selectedRows.map((data) => data.GCODE))];
      console.log("selectedRows if1", uniqueGCodes);
    } else {
      uniqueGCodes = [...new Set(arrayTable.map((data) => data.GCODE))];
      console.log("arrayTable else1", uniqueGCodes);
    }

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
        { header: "zipcode", key: "zipcode", width: 10 },
        { header: "ยี่ห้อ", key: "type", width: 15 },
        { header: "ทะเบียน", key: "regNo", width: 15 },
        { header: "ค้างงวด", key: "overdue", width: 15 },
        { header: "เงินค้าง", key: "arrears", width: 20 },
        { header: "ค่าทวงถาม", key: "letter", width: 15 },
        { header: "ems จดหมาย", key: "emsNo", width: 25 },
        { header: "ems ใบตอบกลับ", key: "emsResponeNo", width: 25 },
      ];

      // กรองข้อมูลที่ตรงกับ GCODE
      let filteredData = [];

      if (selectedRows && selectedRows.length > 0) {
        filteredData = selectedRows.filter((data) => data.GCODE === gCode);
        console.log("selectedRows if2", filteredData);
      } else {
        filteredData = arrayTable.filter((data) => data.GCODE === gCode);
        console.log("arrayTable else2", filteredData);
      }

      // เพิ่มข้อมูลในแต่ละแถว
      filteredData.forEach((data, index) => {
        worksheet.addRow([
          index + 1,
          data.DATA_TYPE,
          parseInt(data.FORCODE),
          data.GCODE,
          dayjs(data.DOCDT).format("YYYY-MM-DD"), // วันที่ส่ง
          data.CONTNO,
          data.NAME,
          data.cusType,
          data.address.ZIP,
          data.TYPE,
          data.REGNO,
          data.EXP_PRD,
          data.TOTPRC - data.SMPAY,
          data.LETTER,
        ]);
      });

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
    let contract = optionsContract.find(
      (item) => item.value === selectedContract
    );

    // ดาวน์โหลดไฟล์
    saveAs(
      blob,
      `รายงานบอกเลิกสัญญา${contract?.label}(${forPaySelect}) ${dayjs().format(
        "YYYY_MM_DD"
      )}.xlsx`
    );
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Row Keys:", selectedRowKeys); // คีย์ของแถวที่เลือก
    console.log("Selected Rows Data:", selectedRows); // ข้อมูลของแถวที่เลือก
    setSelectedRows(selectedRows); // เก็บข้อมูลแถวที่เลือกใน state;
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
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col span={"12"} style={{ textAlign: "start" }}>
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
            <Col span={"12"} style={{ textAlign: "end" }}>
              <Space size={16} style={{ marginTop: "10px" }}>
                <Search
                  placeholder="ค้นหาสัญญา"
                  enterButton
                  onChange={search}
                  style={{
                    width: 250,
                    borderRadius: "8px",
                  }}
                  size="large"
                />
                <Tooltip placement="bottom" title="บันทึกข้อมูล Excel">
                  <Button
                    type="text"
                    icon={
                      <PrinterOutlined
                        style={{ fontSize: "24px", color: "green" }}
                      />
                    }
                    onClick={onClickDownload}
                    style={{
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      padding: "10px",
                      backgroundColor: "#f0fdf4",
                    }}
                  />
                </Tooltip>
              </Space>
            </Col>
            <Col
              span={24}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Range Picker & Search Button */}
              <Space size={16}>
                <RangePicker
                  size="large"
                  style={{
                    width: 310,
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                  onChange={handleChange}
                />
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  size="large"
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    fontWeight: "bold",
                    background: "linear-gradient(135deg, #667eea, blue)",
                    border: "none",
                  }}
                  onClick={handleLoad}
                >
                  ค้นหา
                </Button>
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
                rowSelection={rowSelection}
                scroll={{ x: 850 }}
                footer={() => <p>จำนวนสัญญาที่ค้นหาทั้งหมด {tableLength} </p>}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
    </>
  );
};

const CreateTerminateContract = MotionHoc(Main);
export default CreateTerminateContract;
