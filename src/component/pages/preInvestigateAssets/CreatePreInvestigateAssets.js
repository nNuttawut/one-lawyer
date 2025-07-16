import {
  Col,
  Row,
  Space,
  Table,
  Tag,
  DatePicker,
  Card,
  Button,
  message,
  Spin,
  Select,
} from "antd";
import Search from "antd/es/input/Search";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import DetailModal from "../detail/DetailModal";
import {
  FormOutlined,
  CloseCircleOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_INVESTIGATE_LOANS_LIST,
  HEADERS_EXPORT,
  POST_PRE_INVESTIGATE_REPORT,
} from "../../API/apiUrls";

import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import InvestigateAssetsSearch from "./modal/InvestigateAssetsSearch";
import dayjs from "dayjs";
import { optionsLocat } from "../../../utils/constant/LocatOption";
import CurrencyFormat from "../../../hook/CurrencyFormat";

const Main = () => {
  const { Option } = Select;
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [isModal, setIsModal] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [dataRecord, setDataRecord] = useState();
  const [isModalInvestigateAssets, setIsModalInvestigateAssets] =
    useState(false);
  useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [statusId, setStatusId] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);

    try {
      await axios
        .get(baseUrl + GET_INVESTIGATE_LOANS_LIST, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          let i = 1;
          if (res.status === 200) {
            const newData = res.data.map((item) => ({
              ...item,
              key: i++,
            }));
            filterData(newData);
            console.log("res Role", newData);
          } else {
            message.error("ไม่มีข้อมูล");
            console.log("res Role", res.data);
          }
        })
        .catch((err) => {
          console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
        });
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data) => {
    if (data) {
      let filteredData;
      console.log("data", data);

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

      const newData = filteredData.filter(
        (item) => item.investigation_status >= 5
      );
      console.log("filteredData", filteredData);

      const sortedData = newData.sort((a, b) => {
        // ถ้า a ไม่มี investigation_date ให้เอาไว้ล่าง
        if (!a.investigation_date && b.investigation_date) return 1;
        // ถ้า b ไม่มี investigation_date ให้เอาไว้ล่าง
        if (a.investigation_date && !b.investigation_date) return -1;
        // ถ้าทั้งคู่มี investigation_date ให้เปรียบเทียบปกติ (ล่าสุดก่อน)
        if (a.investigation_date && b.investigation_date) {
          return (
            new Date(b.investigation_date) - new Date(a.investigation_date)
          );
        }
        return 0; // ถ้าทั้งคู่เป็น null
      });

      setArrayTable(sortedData);
      setDataArr(newData);
      setTableLength(sortedData?.length);
      console.log("newData", sortedData);
      console.log("Length of filtered data:", sortedData?.length);
    } else {
      console.error("data is not an array or is undefined");
      setTableLength(0);
    }
  };

  const onExpand = (expanded, record) => {
    if (expanded) {
      // เมื่อแถวถูกขยาย, ให้เพิ่ม key ของแถวนั้นลงใน expandedRowKeys
      setExpandedRowKeys([record.key]);
    } else {
      // เมื่อแถวถูกยุบ, ให้ลบ key ของแถวนั้นออกจาก expandedRowKeys
      setExpandedRowKeys([]);
    }
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter((item) => item.CONTNO.includes(value));
    setArrayTable(result);
    setTableLength(result.length);
  };

  const onSearchByDate = (startDate, endDate) => {
    console.log(endDate[0]);
    console.log(endDate[1]);

    const start = dayjs(endDate[0], "YYYY-MM-DD");
    const end = dayjs(endDate[1], "YYYY-MM-DD");

    const timestampStart = start.valueOf();
    const timestampEnd = end.valueOf();

    if (startDate && endDate) {
      const selectSearch = dataArr.filter((item) => {
        const date = dayjs(item.investigation_date, "YYYY-MM-DD");
        const itemDate = date.valueOf();
        if (itemDate >= timestampStart && itemDate <= timestampEnd) {
          return item;
        } else {
          return null;
        }
      });
      setArrayTable(selectSearch);
      setTableLength(selectSearch.length);
    } else {
      setArrayTable(dataArr);
      setTableLength(dataArr.length);
    }
  };

  const handleUpdateData = (data) => {
    console.log("data---->update", data);
    console.log("dataArr", dataArr);
    if (data) {
      const result = dataArr.map((item) => {
        if (item.id === data.id) {
          return { ...data };
        } else {
          return { ...item };
        }
      });
      let newData;
      if (statusId) {
        newData = result.filter(
          (item) => item.investigation_status === statusId
        );
      } else {
        newData = result;
      }

      console.log("result", newData);
      setDataArr(newData);
      setArrayTable(newData);
    } else {
      loadData();
      console.log("handleUpdateData loadData");
    }
  };

  const renderDataAssetBefor = (record) => {
    if (record.investigation_status === null) {
      return null;
    }

    let color =
      record.investigation_status === 6
        ? "red"
        : record.investigation_status === 5
        ? "blue"
        : record.investigation_status === 7
        ? "green"
        : null;

    return (
      <Tag color={color} key={record.id} style={{ textAlign: "center" }}>
        {record.investigation_status === 6
          ? "ไม่เจอทรัพย์"
          : record.investigation_status === 5
          ? "กำลังดำเนินการ"
          : record.investigation_status === 7
          ? "เจอทรัพย์"
          : null}
        <p style={{ color: color }}>
          สืบครั้งที่ {record.investigation_log_count}
        </p>
      </Tag>
    );
  };

  const renderOpteionStatus = () => {
    return (
      <>
        <Option value={0}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span role="img" aria-label="all">
              🗂️
            </span>
            <span>ทั้งหมด</span>
          </div>
        </Option>
        <Option value={5}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span role="img" aria-label="pending">
              🕒
            </span>
            <span>รอดำเนินการ</span>
          </div>
        </Option>
        <Option value={6}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CloseCircleOutlined style={{ color: "red" }} />
            <span style={{ color: "red" }}>ไม่เจอทรัพย์</span>
          </div>
        </Option>
        <Option value={7}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span role="img" aria-label="found">
              🏡
            </span>
            <span style={{ color: "green" }}>เจอทรัพย์</span>
          </div>
        </Option>
      </>
    );
  };

  const onSearchStatus = (value) => {
    console.log(value);
    let dataUse;
    if (value) {
      dataUse = dataArr.filter((item) => item.investigation_status === value);
    } else {
      dataUse = dataArr;
    }
    setArrayTable(dataUse);
    setTableLength(dataUse.length);
  };

  const onChangeSelectStatus = (value) => {
    console.log("onChangeSelectStatus-->", value);
    onSearchStatus(value);
    setStatusId(value);
  };

  //ทำ render record ของตาราถ้าใช้ logic เยอะ
  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record.investigation_date) {
      return null;
    }
    let color;
    const recordDate = dayjs(record.investigation_date);
    const today = dayjs().startOf("day");

    // คำนวณความแตกต่างในหน่วยปี
    const yearsDifference = today.diff(recordDate, "year");

    // คำนวณความแตกต่างในหน่วยเดือน
    const monthsDifference = today.diff(recordDate, "month");

    // คำนวณความแตกต่างในหน่วยวัน
    const daysDifference = today.diff(recordDate, "day");

    // คำนวณส่วนที่เหลือหลังจากคำนวณปีแล้ว (คำนวณเดือนที่เหลือ)
    const remainingMonths = today
      .subtract(yearsDifference, "year")
      .diff(recordDate, "month");

    // คำนวณส่วนที่เหลือหลังจากคำนวณปีและเดือนแล้ว (คำนวณวันที่เหลือ)
    const remainingDays = today
      .subtract(yearsDifference, "year")
      .subtract(remainingMonths, "month")
      .diff(recordDate, "day");

    if (record.investigation_status === 5) {
      color = yearsDifference >= 1 ? "red" : "blue";
    } else if (record.investigation_status === 6) {
      color = "red";
    } else if (record.investigation_status === 7) {
      color = "green";
    }
    const formattedDate = record.investigation_date
      ? convertDateThai(recordDate)
      : null;
    return (
      <Tag color={color} key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
        <br />
        {
          <span>
            {yearsDifference} ปี {remainingMonths} เดือน {remainingDays} วัน
          </span>
        }
      </Tag>
    );
  };

  const checkDataLoad = () => {
    if (selectedRows.length > 0 && selectedRows.length <= 100) {
      const contnos = selectedRows.map((row) => row.CONTNO);
      const formattedData = { contno: contnos };
      console.log("contnoSearch", formattedData);

      loadDataReport(formattedData);
    } else if (selectedRows.length > 100) {
      message.error("กรุณาเลือกข้อมูลไม่เกิน 100 สัญญา");
    } else {
      message.error("กรุณาเลือกข้อมูลในตารางก่อน !");
    }
  };

  const loadDataReport = async (data) => {
    setLoading(true);
    console.log(data);

    try {
      await axios
        .post(baseUrl + POST_PRE_INVESTIGATE_REPORT, data, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("res Role", res.data);
            createAndDownloadExcel(res.data);
          } else {
            message.error("ไม่มีข้อมูล");
            console.log("res Role", res.data);
          }
        })
        .catch((err) => {
          console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
        });
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderTime = (data) => {
    const daysDiff = dayjs().diff(dayjs(data), "day");
    console.log("daysDiff", daysDiff);

    return currencyFormatComma(daysDiff);
  };

  const createAndDownloadExcel = async (data) => {
    const contnoLogMap = {};
    selectedRows.forEach((row) => {
      contnoLogMap[row.CONTNO] = row.investigation_log_id;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ข้อมูลลูกหนี้");

    worksheet.columns = [
      { header: "ลำดับ", key: "no", width: 8 },
      { header: "ID", key: "investigateId", width: 10 },
      { header: "ประเภท", key: "type", width: 10 },
      { header: "สัญญา", key: "contno", width: 15 },
      { header: "ชื่อ", key: "firstname", width: 20 },
      { header: "สกุล", key: "lastName", width: 15 },
      { header: "รหัสบัตร", key: "cusCode", width: 20 },
      { header: "ที่ทำงาน", key: "office", width: 30 },
      { header: "ชำระเข้างวดล่าสุด", key: "LPAYD", width: 25 },
      { header: "ขาดการติดต่อ", key: "lostContact", width: 15 },
      { header: "งวดที่", key: "nopay", width: 15 },
      { header: "สถานะสืบ", key: "status", width: 10 },
    ];

    let flatData = [];

    Object.entries(data).forEach(([contno, info]) => {
      const loan = info.LOAN || {};
      const customer = info.CUSTOMER || {};
      const guarantors = info.GUARANTORS || [];

      // ลูกหนี้
      flatData.push({
        investigateId: contnoLogMap[contno] || "",
        type: "ลูกหนี้",
        contno,
        firstname: customer.NAME1 || "",
        lastName: customer.NAME2 || "",
        cusCode: customer.CUSCOD || "",
        office: customer.OFFIC || "",
        LPAYD: convertDateThaiShort(loan.LPAYD) || "",
        lostContact: renderTime(loan.LPAYD),
        nopay: loan.EXP_FRM + "-" + loan.EXP_TO || "",
        status: "",
      });

      // ผู้ค้ำ
      guarantors.forEach((g) => {
        flatData.push({
          investigateId: contnoLogMap[contno] || "",
          type: "ผู้ค้ำที่" + g.GARNO,
          contno,
          firstname: g.NAME1 || "",
          lastName: g.NAME2 || "",
          cusCode: g.CUSCOD || "",
          office: g.OFFIC || "",
          LPAYD: loan.status || "",
          lostContact: "",
          nopay: "",
          status: "",
        });
      });
    });

    // เรียงตาม contno และ type
    flatData.sort((a, b) => {
      if (a.contno < b.contno) return -1;
      if (a.contno > b.contno) return 1;
      if (a.type === "ลูกหนี้") return -1;
      return 1;
    });

    // เพิ่มข้อมูลลง worksheet
    flatData.forEach((row, index) => {
      worksheet.addRow({
        no: index + 1,
        ...row,
      });
    });

    // จัด alignment
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
    });

    // สร้างและดาวน์โหลด Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `รายการส่งสืบทรัพย์ ${dayjs().format("YYYY_MM_DD")}.xlsx`);
  };

  // const handleFileUpload = (file) => {
  //   const reader = new FileReader();

  //   reader.onload = (event) => {
  //     const arrayBuffer = event.target.result;
  //     const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
  //       type: "array",
  //     });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const sheetData = XLSX.utils.sheet_to_json(sheet);

  //     let filteredData = [];

  //     const columnName = "เลขสัญญา"; // ชื่อคอลัมน์ใน Excel
  //     sheetData.forEach((row) => {
  //       if (row[columnName] !== undefined) {
  //         const trimmedValue =
  //           typeof row[columnName] === "string"
  //             ? row[columnName].trim()
  //             : row[columnName];
  //         filteredData.push(trimmedValue);
  //       }
  //     });

  //     // แปลง Array ให้เป็น String ในฟอร์แมต "'value1','value2','value3'"
  //     const formattedData = filteredData.map((val) => `'${val}'`).join(",");

  //     // setData({ CONTNO: formattedData }); // เก็บค่าเป็น Object ที่มี key "CONTNO"
  //   };

  //   reader.readAsArrayBuffer(file);
  //   return false;
  // };

  // const uploadProps = {
  //   customRequest: ({ file, onSuccess, fileList }) => {
  //     // message.warning(`ไม่ควร import สัญญาได้เกิน 100 สัญญาต่อครั้ง`);
  //     message.warning(`ขออภัย ยังไม่สามารถใช้งานได้ !`);
  //     // setFailedData([]);
  //     // setMissedData([]);
  //     // setDuplicateData([]);
  //     // handleFileUpload(file);
  //     // if (file.status !== "uploading") {
  //     //   console.log(file, fileList);
  //     // } else {
  //     //   onSuccess(); // Call onSuccess when the file is handled
  //     // }
  //   },
  //   showUploadList: arrayTable?.length > 0 ? false : true,
  // };

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
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "10%",
      render: (text, object, key) => key + 1,
      sorter: {
        compare: (a, b) => a.key - b.key,
        multiple: 5,
      },
    },
    {
      title: "เลขที่สัญญา",
      dataIndex: "CONTNO",
      key: "CONTNO",
      align: "center",
      render: (text, record) => (
        <Link
          onClick={() => {
            setIsModal(true);
            setDataRecord(record);
          }}
        >
          {record.CONTNO ? record.CONTNO : null}
        </Link>
      ),
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "CUSTOMER_TNAM",
      key: "CUSTOMER_TNAM",
      align: "center",
      render: (text, record) => (
        <>
          {record.CUSTOMER_TNAME ? record.CUSTOMER_TNAME : null}{" "}
          {record.CUSTOMER_FNAME ? record.CUSTOMER_FNAME : null}{" "}
          {record.CUSTOMER_LNAME ? record.CUSTOMER_LNAME : null}
        </>
      ),
    },

    {
      title: "สถานะ",
      align: "center",
      render: (record) => <>{renderDataAssetBefor(record)}</>,
    },
    {
      title: "วันที่สืบทรัพย์",
      align: "center",
      render: (record) => <>{renderDate(record)}</>,
      sorter: (a, b) => {
        // กรณีถ้า a.investigation_date เป็น null ให้ขึ้นก่อน
        if (a.investigation_date === null) return -1;
        if (b.investigation_date === null) return 1;

        // เปรียบเทียบวันที่ระหว่าง a.investigation_date และ b.investigation_date
        const dateA = dayjs(a.investigation_date);
        const dateB = dayjs(b.investigation_date);

        if (dateA.isBefore(dateB)) return -1;
        if (dateA.isAfter(dateB)) return 1;
        return 0; // ถ้าเท่ากัน
      },
      defaultSortOrder: "ascend", // กำหนดการเรียงลำดับเริ่มต้น
      sortDirections: ["ascend", "descend"], // เพิ่มการรองรับการสลับลำดับ
    },
  ];

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col
              span={"8"}
              style={{ textAlign: "start", marginBottom: "10px" }}
            >
              {/* <Space direction="vertical" size={12}>
                <Upload {...uploadProps}>
                  <Button
                    style={{ color: "green", marginRight: "5px" }}
                    icon={<ImportOutlined />}
                  >
                    นำเข้า Excel
                  </Button>
                </Upload>
              </Space> */}
            </Col>
            <Col span={"16"} style={{ textAlign: "end", marginBottom: "10px" }}>
              <Space direction="vertical" size={12}>
                <Button
                  style={{ color: "blue", marginRight: "5px" }}
                  icon={<ExportOutlined />}
                  onClick={() => {
                    checkDataLoad();
                  }}
                >
                  พิมพ์รายการสืบ
                </Button>
              </Space>
            </Col>
          </Row>
          <Row>
            <Col
              span={"8"}
              style={{ textAlign: "start", marginBottom: "10px" }}
            >
              <Select
                placeholder="เลือกสถานะ"
                optionFilterProp="value"
                onChange={(value) => onChangeSelectStatus(value)}
                style={{
                  width: 200,
                }}
                size="large"
              >
                {renderOpteionStatus()}
              </Select>
            </Col>
            <Col span={"16"} style={{ textAlign: "end", marginBottom: "10px" }}>
              <Space direction="vertical" size={12}>
                <RangePicker
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
            <Col span={"24"}>
              <Table
                size="small"
                columns={columns}
                dataSource={arrayTable}
                scroll={{ x: 850 }}
                footer={() => (
                  <div
                    style={{
                      // display: "flex",
                      // justifyContent: "space-between", // จัดข้อความให้อยู่ซ้ายและขวา
                      alignItems: "center",
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      เลือก {selectedRowKeys.length} สัญญา
                    </p>

                    <p style={{ margin: 0 }}>จำนวนสัญญาทั้งหมด {tableLength}</p>
                  </div>
                )}
                rowSelection={{
                  selectedRowKeys,
                  onChange: onSelectChange,
                  preserveSelectedRowKeys: true,
                }}
                expandable={{
                  expandedRowRender: (record) => (
                    <p style={{ margin: 0 }}>
                      {/* {!record.investigation_date ? ( */}
                      <Button
                        style={{
                          boxShadow: "0 4px 3px",
                          marginRight: "10px",
                        }}
                        onClick={() => {
                          setIsModalInvestigateAssets(true);
                          setDataModal(record);
                        }}
                      >
                        <FormOutlined
                          style={{ color: "blue", fontSize: "16px" }}
                        />
                      </Button>
                    </p>
                  ),
                  rowExpandable: (record) =>
                    ROLE_ID === "2" ||
                    ROLE_ID === "3" ||
                    ROLE_ID === "4" ||
                    ROLE_ID === "1",
                  expandedRowKeys, // เก็บ state ของ row ที่ขยาย
                  onExpand, // ฟังก์ชันที่ควบคุมการขยาย
                }}
                rowKey="key"
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? (
        <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
      ) : null}
      {isModalInvestigateAssets ? (
        <InvestigateAssetsSearch
          open={isModalInvestigateAssets}
          close={setIsModalInvestigateAssets}
          dataDefualt={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
    </>
  );
};

const CreatePreInvestigateAssets = MotionHoc(Main);
export default CreatePreInvestigateAssets;
