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
  Select,
  Tooltip,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useMemo, useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import { baseUrl, GET_CANCEL, HEADERS_EXPORT } from "../../API/apiUrls";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

//use redux
import axios from "axios";
import {
  NOTICE,
  STATUS_PROCESS_PROCESS,
  STATUS_PROCESS_SUCCESSFUL,
  STATUS_PROCESS_UNSUCCESSFUL,
} from "../../../utils/constant/StatusConstant";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import CurrencyFormat from "../../../hook/CurrencyFormat";

const Main = () => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [isModal, setIsModal] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [selectCallback, setSelectCallback] = useState("ทั้งหมด");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [arrow, setArrow] = useState("Show");

  const optionSelectCallback = [
    { value: "all", label: "ทั้งหมด" },
    { value: 1, label: "รอดำเนินการ" },
    { value: 2, label: "ตอบกลับ" },
  ];

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

  const loadData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(baseUrl + GET_CANCEL, {
        headers: HEADERS_EXPORT,
      });
      if (response.data) {
        if (response.data) {
          console.log(response.data);

          mergeDataWithGuarantors(response.data);
          // setSearchEdit(response.data);
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
    const newData = sortedData.map((item) => ({
      ...item,
      key: i++,
    }));

    setArrayTable(newData);
    setDataArr(newData);
    setTableLength(newData.length);
    console.log("preData", newData);
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter(
      (item) =>
        (item.contract_no && item.contract_no.includes(value)) ||
        (item.customer_fullname && item.customer_fullname.includes(value)) ||
        (item.register_no && item.register_no.includes(value)) ||
        (item.parcel_no && item.parcel_no.includes(value))
    );
    console.log("ssdss", value.length);

    if (value) {
      setArrayTable(result);
    } else {
      setArrayTable(dataArr);
    }
  };

  const onSearchByDate = (startDate) => {
    console.log(startDate);

    let selectData;
    if (selectCallback === 2) {
      selectData = dataArr.filter(
        (item) => item.status === 1 || item.status === 2
      );
    } else if (selectCallback === 1) {
      selectData = dataArr.filter((item) => !item.status);
    } else {
      selectData = dataArr;
    }

    if (startDate) {
      const selectSearch = selectData.filter(
        (item) =>
          item.datetime.includes(dayjs(startDate).format("YYYY-MM-DD")) &&
          selectCallback
      );
      console.log(dayjs(startDate).format("YYYY-MM-DD"));

      console.log(selectSearch);

      setArrayTable(selectSearch);
    } else {
      setArrayTable(selectData);
    }
  };

  const handleChangeSelect = (value) => {
    console.log(`selected ${value}`);
    setSelectCallback(value);
    let selectData;
    if (value === 2) {
      selectData = dataArr.filter(
        (item) => item.status === 1 || item.status === 2
      );
    } else if (value === 3) {
      selectData = dataArr.filter((item) => item.status === value);
    } else if (value === 1) {
      selectData = dataArr.filter((item) => !item.status);
    } else {
      selectData = dataArr;
    }

    setArrayTable(selectData);
    setTableLength(selectData.length);
  };

  //ทำ render record ของตาราถ้าใช้ logic เยอะ
  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record.created_date) {
      return null;
    }
    const recordDate = dayjs(record.created_date).startOf("day");
    const today = dayjs().startOf("day");
    const daysDifference = today.diff(recordDate, "days");
    let color;
    color = daysDifference > 30 ? "red" : "green";
    const formattedDate = record.created_date
      ? convertDateThaiShort(record.created_date)
      : null;
    return (
      <Tag color={color} key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
        <br />
        {
          <span>
            {daysDifference >= 30 ? `เกินมา ${daysDifference} วัน ` : null}{" "}
          </span>
        }
      </Tag>
    );
  };

  const renderProcess = (record) => {
    let value =
      record === 3
        ? "ยังไม่ตอบกลับ"
        : record === 1 || record === 2
        ? "ตอบกลับ"
        : "รอดำเนินการ";
    let color =
      record === 3 ? "red" : record === 1 || record === 2 ? "green" : "blue";

    return (
      <Tag color={color} key={value} style={{ textAlign: "center" }}>
        {value}
      </Tag>
    );
  };

  const renderType = (record) => {
    const options = [
      { value: 116, label: "จดหมายส่งผู้คนค้ำ(116)" },
      { value: 119, label: "บอกเลิกสัญญา(119)" },
      { value: 129, label: "ค่าบอกเลิกสัญญา(No ems)(129)" },
      { value: "vsfhp", label: "สัญญา 2" },
      { value: "psfhp", label: "สัญญา 3" },
      { value: "rpsl", label: "สัญญา 3(ใหม่)" },
      { value: "sfhp", label: "สัญญา 8" },
    ];

    if (!record) {
      return null;
    }
    const matchedOption = options.find((opt) => opt.value === record);
    return matchedOption ? matchedOption.label : "-"; // ถ้าไม่เจอ ให้แสดง "-"
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

  const createAndDownloadExcel = async () => {
    // สร้าง Workbook
    const workbook = new ExcelJS.Workbook();

    // กำหนดประเภท GCODE ที่ต้องการแยก (ไม่ซ้ำกัน)
    const uniqueGCodes = [
      ...new Set(arrayTable.map((data) => data.account_type)),
    ];

    // วนลูปสร้าง Sheet สำหรับแต่ละ GCODE
    uniqueGCodes.forEach((account_type) => {
      const worksheet = workbook.addWorksheet(`ประเภท ${account_type}`); // ใช้ GCODE เป็นชื่อ Sheet

      // กำหนดคอลัมน์ของ Worksheet
      worksheet.columns = [
        { header: "ลำดับ", key: "no", width: 10 },
        { header: "รอบวันออกจดหมายในระบบ", key: "date", width: 20 },
        { header: "เลขที่สัญญา", key: "contno", width: 20 },
        { header: "ชื่อลูกค้า", key: "cusName", width: 30 },
        { header: "ประเภทลูกค้า", key: "cusType", width: 10 },
        { header: "ems no.", key: "emsNo", width: 25 },
        { header: "เวลาดำเนินงาน/วัน", key: "createDate", width: 20 },
        { header: "สถานะ", key: "status", width: 15 },
        { header: "ลิ้งค์แสกนรูป", key: "urlFile", width: 45 },
      ];

      // กรองข้อมูลที่ตรงกับ GCODE
      const filteredData = arrayTable.filter(
        (data) => data.account_type === account_type
      );

      // เพิ่มข้อมูลในแต่ละแถว
      filteredData.forEach((data, index) => {
        const rowIndex = index + 2; // ข้ามแถว Header
        worksheet.addRow([
          index + 1,
          convertDateThaiShort(data.datetime), // วันที่ส่ง
          data.contract_no,
          data.customer_fullname,
          data.customer_type_id === 0
            ? "ผู้เช่าซื้อ"
            : `คนค้ำที่ ${data.customer_type_id}`,
          data.parcel_no ? data.parcel_no : "-",
          renderDateProcess(data),
          data.status === 1
            ? "ใบตอบกลับ"
            : data.status === 2
            ? "เว็บไปรษณย์"
            : "รอดำเนินการ",
          data.remark ? data.remark : "-",
        ]);
        if (renderDateProcess(data) >= 30) {
          const cell = worksheet.getCell(`G${rowIndex}`);
          cell.font = {
            color: { argb: "FFFF0000" }, // ตัวอักษรสีแดง
            bold: true, // ตัวหนังสือหนา
          };
        }
        if (!data.status || data.status === 3) {
          const cell = worksheet.getCell(`H${rowIndex}`);
          cell.font = {
            color: { argb: "FF0000FF" },
            bold: true, // ตัวหนังสือหนา
          };
        } else {
          const cell = worksheet.getCell(`H${rowIndex}`);
          cell.font = {
            color: { argb: "FF008000" },
            bold: true, // ตัวหนังสือหนา
          };
        }
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
    saveAs(
      blob,
      `รายงานตรวจสอบการตอบกลับ ${dayjs().format("YYYY_MM_DD")}.xlsx`
    );
  };

  const columns = [
    {
      title: "ลำดับ",
      align: "center",
      render: (text, record, index) => (
        <>{index + 1}</> // คำนวณลำดับจาก index ของแถวใน Table
      ),
    },
    // {
    //   title: "สัญญา",
    //   dataIndex: "contract_schema",
    //   key: "contract_schema", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
    //   align: "center",
    //   render: (text, record) => <>{renderType(record.contract_schema)}</>,
    // },
    // {
    //   title: "ประเภทจ่าย",
    //   dataIndex: "pay_type",
    //   key: "pay_type", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
    //   align: "center",
    //   render: (text, record) => <>{record.pay_type}</>,
    // },
    // {
    //   title: "ประเภทบัญชี",
    //   dataIndex: "account_type",
    //   key: "account_type", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
    //   align: "center",
    // },
    // {
    //   title: "วันที่ออกจดหมาย",
    //   align: "center",
    //   render: (text, record) => (
    //     <>{record.datetime ? convertDateThaiShort(record.datetime) : null}</>
    //   ),
    // },
    {
      title: "เลขที่สัญญา",
      dataIndex: "contract_no",
      key: "contract_no",
      align: "center",
      render: (text, record) => (
        <>
          {record.contract_no ? record.contract_no : null} <br />
          {renderType(record.contract_schema)}
        </>
      ),
    },
    {
      title: "รายละเอียด",
      dataIndex: "contract_no",
      key: "contract_no",
      align: "center",
      render: (text, record) => (
        <>
          {convertDateThaiShort(record.datetime)} <br />
          {renderType(record.pay_type)}
          <br />
          {record.account_type}
        </>
      ),
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "customer_fullname",
      key: "customer_fullname",
      align: "center",
      render: (text, record) => (
        <>{record.customer_fullname ? record.customer_fullname : null} </>
      ),
    },
    {
      title: "ประเภทลูกค้า",
      align: "center",
      render: (text, record) => (
        <>
          {record.customer_type_id === 0
            ? "ผู้เช่าซื้อ"
            : `ผู้ค้ำที่ ${record.customer_type_id}`}
        </>
      ),
    },
    // {
    //   title: "ยี่ห้อ",
    //   dataIndex: "brand",
    //   key: "brand", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
    //   align: "center",
    // },
    // {
    //   title: "ทะเบียน",
    //   dataIndex: "register_no",
    //   key: "register_no", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
    //   align: "center",
    // },
    // {
    //   title: "ค้างงวด",
    //   align: "center",
    //   render: (text, record) => (
    //     <>
    //       {record.overdue_installment_count
    //         ? record.overdue_installment_count
    //         : null}{" "}
    //     </>
    //   ),
    // },
    // {
    //   title: "เงินค้าง",
    //   align: "center",
    //   render: (text, record) => (
    //     <>
    //       {record.overdue_installment_amount
    //         ? currencyFormatPoint(record.overdue_installment_amount)
    //         : null}{" "}
    //     </>
    //   ),
    // },
    // {
    //   title: "ค่าทวงถาม",
    //   align: "center",
    //   render: (text, record) => (
    //     <>
    //       {record.dept_collection_fees
    //         ? currencyFormatComma(record.dept_collection_fees)
    //         : null}{" "}
    //     </>
    //   ),
    // },
    {
      title: "วันที่นำข้อมูลเข้า",
      align: "center",
      render: (text, record) => (
        <>{record.datetime ? renderDate(record) : null}</>
      ),
    },
    {
      title: "ems no.",
      dataIndex: "parcel_no",
      key: "parcel_no", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
      align: "center",
    },
    {
      title: "สถานะ",
      align: "center",
      render: (text, record) => <>{renderProcess(record.status)}</>,
    },
  ];

  return (
    <>
      {ROLE_ID === "1" || ROLE_ID === "2" ? (
        <>
          <Card>
            <Spin spinning={loading} size="large" tip=" Loading... ">
              <Row>
                <Col
                  span={"12"}
                  style={{ textAlign: "start", marginBottom: "10px" }}
                >
                  <Select
                    style={{
                      width: "auto",
                      marginRight: "5px",
                      marginBottom: "5px",
                    }}
                    onChange={handleChangeSelect}
                    popupMatchSelectWidth={false}
                    options={optionSelectCallback}
                    value={selectCallback}
                    size="large"
                  />
                </Col>
                <Col
                  span={"12"}
                  style={{ textAlign: "end", marginBottom: "10px" }}
                >
                  <Space direction="vertical" size={12}>
                    <DatePicker
                      size="large"
                      style={{ marginRight: "10px" }}
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
                <Col
                  span={"24"}
                  style={{ textAlign: "start", marginBottom: "10px" }}
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
                <Col span={"24"}>
                  <Table
                    size="small"
                    columns={columns}
                    dataSource={arrayTable}
                    scroll={{ x: 850 }}
                    footer={() => <p>จำนวนสัญญาทั้งหมด {tableLength}</p>}
                  />
                </Col>
              </Row>
            </Spin>
          </Card>
        </>
      ) : (
        <Card>
          <b>ไม่มีสิทธ์เข้าถึงข้อมูล</b>
        </Card>
      )}
    </>
  );
};

const ReportTerminate = MotionHoc(Main);
export default ReportTerminate;
