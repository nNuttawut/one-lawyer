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
import { ExportOutlined, PlusOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_INVESTIGATE_LOANS_LIST,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
  POST_PRE_INVESTIGATE_REPORT,
  PUT_STATUS,
} from "../../API/apiUrls";

import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import { optionsLocat } from "../../../utils/constant/LocatOption";
import {
  NOTICE,
  STATUS_PROCESS_SUCCESSFUL,
} from "../../../utils/constant/StatusConstant";

const Main = () => {
  const { Option } = Select;
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [isModal, setIsModal] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [dataRecord, setDataRecord] = useState();
  useState(false);
  const [statusId, setStatusId] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);

    try {
      await axios
        .get(baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + NOTICE, {
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

      const newData = filteredData.filter((item) => item.STATUS_ID);
      console.log("filteredData", filteredData);

      const sortedData = newData.sort((a, b) => {
        // ถ้า a ไม่มี investigation_date ให้เอาไว้ล่าง
        if (!a.DATE && b.DATE) return 1;
        // ถ้า b ไม่มี investigation_date ให้เอาไว้ล่าง
        if (a.DATE && !b.DATE) return -1;
        // ถ้าทั้งคู่มี investigation_date ให้เปรียบเทียบปกติ (ล่าสุดก่อน)
        if (a.DATE && b.DATE) {
          return new Date(a.DATE) - new Date(b.DATE);
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

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter((item) => item.CONTNO.includes(value));
    setArrayTable(result);
    setTableLength(result.length);
  };

  const onSearchByDate = (range) => {
    if (!Array.isArray(range) || range.length !== 2 || !range[0] || !range[1]) {
      // ถ้าไม่ได้เลือกหรือเลือกไม่ครบ 2 ค่า
      setStartDate(null);
      setEndDate(null);
      applyFilters(null, null, statusId); // เคลียร์ filter วันที่
      return;
    }

    const [start, end] = range;
    setStartDate(start);
    setEndDate(end);
    applyFilters(start, end, statusId);
  };

  const sendStatus = async (status) => {
    setLoading(true);
    //  .put("http://localhost:8080/lawyer/dev/api/loans/status", status, {
    try {
      await axios
        .put(baseUrl + PUT_STATUS, status, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status > 400) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      loadData();
      setSelectedRowKeys([]);
      setSelectedRows([]);
    }
  };

  // const handleUpdateData = (data) => {
  //   console.log("data---->update", data);
  //   console.log("dataArr", dataArr);
  //   if (data) {
  //     const result = dataArr.map((item) => {
  //       if (item.id === data.id) {
  //         return { ...data };
  //       } else {
  //         return { ...item };
  //       }
  //     });
  //     let newData;
  //     if (statusId) {
  //       newData = result.filter(
  //         (item) => item.investigation_status === statusId
  //       );
  //     } else {
  //       newData = result;
  //     }

  //     console.log("result", newData);
  //     setDataArr(newData);
  //     setArrayTable(newData);
  //   } else {
  //     loadData();
  //     console.log("handleUpdateData loadData");
  //   }
  // };

  const renderDataAssetBefor = (record) => {
    if (record.PROCESS_ID === null) {
      return null;
    }

    let color =
      record.PROCESS_ID === 1
        ? "red"
        : record.PROCESS_ID === 3
        ? "green"
        : null;

    return (
      <Tag color={color} key={record.id} style={{ textAlign: "center" }}>
        {record.PROCESS_ID === 3
          ? "รับงาน"
          : record.PROCESS_ID === 1
          ? "ยังไม่รับงาน"
          : null}
        <p style={{ color: color }}>{record.investigation_log_count}</p>
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
        <Option value={1}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span role="img" aria-label="pending">
              🕒
            </span>
            <span>รอรับงาน</span>
          </div>
        </Option>

        <Option value={3}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span role="img" aria-label="found">
              ✅
            </span>
            <span style={{ color: "green" }}>รับงานแล้ว</span>
          </div>
        </Option>
      </>
    );
  };

  const onChangeSelectStatus = (value) => {
    setStatusId(value);
    applyFilters(startDate, endDate, value); // ใช้ state ล่าสุดของ date
  };

  //ทำ render record ของตาราถ้าใช้ logic เยอะ
  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record.DATE) {
      return null;
    }
    let color;
    const recordDate = dayjs(record.DATE);
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

    if (record.PROCESS_ID === 1) {
      color = daysDifference >= 7 ? "red" : "blue";
    } else if (record.PROCESS_ID === 3) {
      color = "green";
    }
    const formattedDate = record.DATE ? convertDateThai(recordDate) : null;
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

  const applyFilters = (startDate, endDate, statusId) => {
    let filteredData = dataArr;

    // กรองตามวันที่
    if (startDate && endDate) {
      const start = dayjs(startDate).startOf("day").valueOf();
      const end = dayjs(endDate).endOf("day").valueOf();

      filteredData = filteredData.filter((item) => {
        const itemDate = dayjs(item.DATE, "YYYY-MM-DD").valueOf();
        return itemDate >= start && itemDate <= end;
      });
    }

    // กรองตามสถานะ
    if (statusId) {
      filteredData = filteredData.filter(
        (item) => item.PROCESS_ID === statusId
      );
    }

    setArrayTable(filteredData);
    setTableLength(filteredData.length);
  };

  const createAndDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ข้อมูลสัญญา");

    // กำหนด column
    worksheet.columns = [
      { header: "ลำดับ", key: "no", width: 8 },
      { header: "เลขสัญญา", key: "contno", width: 15 },
      { header: "ชื่อ", key: "firstname", width: 20 },
      { header: "สกุล", key: "lastName", width: 20 },
    ];

    // เพิ่มข้อมูลลงแถว
    selectedRows.forEach((item, index) => {
      worksheet.addRow({
        no: index + 1,
        contno: item.CONTNO || "-",
        firstname: item.CUSTOMER_TNAME + item.CUSTOMER_FNAME || "-",
        lastName: item.CUSTOMER_LNAME || "-",
      });
    });

    // จัด alignment ทุกเซลล์
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
    });

    // สร้างไฟล์และดาวน์โหลด
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `รายการส่งใบบอกเลิก_${dayjs().format("YYYY_MM_DD")}.xlsx`);
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Row Keys:", selectedRowKeys); // คีย์ของแถวที่เลือก
    console.log("Selected Rows Data:", selectedRows); // ข้อมูลของแถวที่เลือก
    setSelectedRows(selectedRows); // เก็บข้อมูลแถวที่เลือกใน state;
  };

  const handleData = () => {
    console.log("selectedRows", selectedRows);

    const putStatus = selectedRows.map((row) => ({
      id: row.WORK_LOG_ID,
      USER_ID: row.LAWYER_ID,
      LOAN_ID: row.id,
      MEMO: row.memo || null,
      DATE: row.DATE,
      PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
    }));

    console.log(putStatus);
    sendStatus(putStatus);
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "10%",
      render: (text, object, key) => key + 1,
      // sorter: {
      //   compare: (a, b) => a.key - b.key,
      //   multiple: 5,
      // },
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
      title: "แจ้งส่งเมื่อ",
      align: "center",
      render: (record) => <>{renderDate(record)}</>,
      sorter: (a, b) => {
        // กรณีถ้า a.investigation_date เป็น null ให้ขึ้นก่อน
        if (a.DATE === null) return -1;
        if (b.DATE === null) return 1;

        // เปรียบเทียบวันที่ระหว่าง a.DATE และ b.DATE
        const dateA = dayjs(a.DATE);
        const dateB = dayjs(b.DATE);

        if (dateA.isBefore(dateB)) return -1;
        if (dateA.isAfter(dateB)) return 1;
        return 0; // ถ้าเท่ากัน
      },
      defaultSortOrder: "descend", // กำหนดการเรียงลำดับเริ่มต้น
      sortDirections: ["ascend", "descend"], // เพิ่มการรองรับการสลับลำดับ
    },
    {
      title: "สถานะ",
      align: "center",
      render: (record) => <>{renderDataAssetBefor(record)}</>,
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
                  style={{ color: "green", marginRight: "5px" }}
                  icon={<ExportOutlined />}
                  onClick={() => {
                    createAndDownloadExcel();
                  }}
                >
                  พิมพ์สัญญา
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
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />} // ไอคอน
                size="small" // ขนาดเล็ก
                onClick={() => handleData()}
                disabled={
                  selectedRowKeys.length === 0 || selectedRowKeys.length > 100
                }
                loading={loading}
              >
                กดรับงาน
              </Button>
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
                // expandable={{
                //   expandedRowRender: (record) => {
                //     return record?.parcel_list?.length > 0 ? (
                //       <div>
                //         {record.parcel_list.map((item, index) => (
                //           <div
                //             key={index}
                //             style={{
                //               marginBottom: "16px",
                //               padding: "12px",
                //               border: "1px solid #e8e8e8",
                //               borderRadius: "8px",
                //             }}
                //           >
                //             <Row gutter={16}>
                //               <Col span={12}>
                //                 <strong>ประเภทลูกค้า:</strong>{" "}
                //                 {item.GARNO === 0
                //                   ? "ผู้เช่าซื้อ"
                //                   : `คนค้ำที่ ${item.GARNO}`}
                //               </Col>
                //               <Col span={12}>
                //                 <strong>วันที่ตอบกลับ:</strong>{" "}
                //                 {item.dateResponse
                //                   ? convertDateThai(item.dateResponse)
                //                   : "-"}
                //               </Col>
                //               <Col span={12}>
                //                 <strong>ชื่อ:</strong>{" "}
                //                 {item.customerFullname || "-"}
                //               </Col>
                //               <Col span={12}>
                //                 <strong>สถานะ:</strong>{" "}
                //                 <span
                //                   style={{
                //                     color: item.status ? "green" : "red",
                //                   }}
                //                 >
                //                   {item.status === 1
                //                     ? "ใบตอบกลับ"
                //                     : item.status === 2
                //                     ? "เว็บไปษณีย์"
                //                     : item.status === 3
                //                     ? "ตีกลับ"
                //                     : "ยังไม่ตอบ"}
                //                 </span>
                //               </Col>
                //             </Row>
                //           </div>
                //         ))}
                //       </div>
                //     ) : (
                //       <p style={{ color: "red" }}>ไม่มีข้อมูล</p>
                //     );
                //   },
                //   rowExpandable: (record) => record?.parcel_list?.length > 0,
                //   expandedRowKeys,
                //   onExpand,
                // }}
                rowKey="key"
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? (
        <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
      ) : null}
    </>
  );
};

const CreateCancelContract = MotionHoc(Main);
export default CreateCancelContract;
