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
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import DetailModal from "../detail/DetailModal";
import { SyncOutlined, FormOutlined, EditOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";

import {
  baseUrl,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
} from "../../API/apiUrls";

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
import UpdateReplyNoticeEms from "./modal/UpdateReplyNoticfeEms";

const Main = () => {
  const [convertDateThai] = DateCustom();
  const [isModal, setIsModal] = useState(false);
  const [isModalUpdateNoticeEms, setIsModalUpdateNoticeEms] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [dataRecord, setDataRecord] = useState();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [searchEdit, setSearchEdit] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + NOTICE,
        {
          headers: HEADERS_EXPORT,
        }
      );
      if (response.data) {
        let i = 1;
        if (response.data) {
          const newData = response.data.map((item) => ({
            ...item,
            key: i++,
          }));
          filterDataLawyer(newData);
          setSearchEdit(newData);
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

  const filterDataLawyer = (data) => {
    console.log("item.LAWYER_ID", data);
    console.log("userId.id ", userId);

    if (Array.isArray(data)) {
      const newData = data.filter(
        (item) =>
          (item.LAWYER_ID === userId || ROLE_ID === "1" || ROLE_ID === "2") &&
          item.MAIN_STATUS_ID === item.STATUS_ID &&
          (item.PROCESS_ID === STATUS_PROCESS_SUCCESSFUL ||
            item.PROCESS_ID === STATUS_PROCESS_PROCESS ||
            item.PROCESS_ID === STATUS_PROCESS_UNSUCCESSFUL)
      );
      function containsNumber(str) {
        return /\d/.test(str); // เช็คว่า str เป็นตัวเลขทั้งหมด
      }

      function isEnglishOnly(str) {
        return /^[A-Za-z]+$/.test(str); // เช็คว่า str เป็นตัวอักษรภาษาอังกฤษทั้งหมด
      }

      let filteredData;

      if (userCompany === "3") {
        filteredData = newData.filter((item) => {
          // ถ้า 2 เป็นภาษาอังกฤษทั้งหมด
          if (isEnglishOnly(item.CONTNO.substring(0, 2))) {
            return item;
          } else {
            return false;
          }
        });
      } else {
        filteredData = newData.filter((item) => {
          const test = containsNumber(item.CONTNO.substring(0, 2)); // ตรวจสอบว่า 2 ตัวแรกมีตัวเลขไหม
          console.log("test12", test);

          // ถ้า 2 ตัวแรกไม่ใช่ตัวเลข และไม่ได้เป็นภาษาอังกฤษทั้งหมด
          if (test || !isEnglishOnly(item.CONTNO.substring(0, 2))) {
            return item; // เก็บ item นี้ไว้
          } else {
            return false; // ไม่เก็บ item นี้ (กรณีเป็นภาษาอังกฤษทั้งหมด หรือมีตัวเลขใน 2 ตัวแรก)
          }
        });
      }

      setArrayTable(filteredData);
      setDataArr(filteredData);
      setTableLength(filteredData.length);
      console.log("newData", filteredData);
      console.log("Length of filtered data:", filteredData.length);
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
    let result = searchEdit.filter(
      (item) =>
        (item.CONTNO && item.CONTNO.includes(value)) ||
        (item.CUSTOMER_FNAME && item.CUSTOMER_FNAME.includes(value)) ||
        (item.CUSTOMER_LNAME && item.CUSTOMER_LNAME.includes(value)) ||
        (item.parcel_list &&
          item.parcel_list.some((parcel) => parcel.parcel_no.includes(value)))
    );
    console.log("ssdss", value.length);

    if (value.length === 13 && result.length > 0) {
      console.log("ssdss--->", value.length);
      setIsModalUpdateNoticeEms(true);
      setDataModal(result[0]);
      console.log("result---->", result);
    }
    if (value) {
      setArrayTable(result);
    } else {
      setArrayTable(dataArr);
    }
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
        const date = dayjs(item.DATE, "YYYY-MM-DD");
        const itemDate = date.valueOf();
        if (itemDate >= timestampStart && itemDate <= timestampEnd) {
          return item;
        } else {
          return null;
        }
      });
      setArrayTable(selectSearch);
    } else {
      setArrayTable(dataArr);
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
      console.log("result", result);
      setDataArr(result);
      const arr = result.filter(
        (item) =>
          (item.LAWYER_ID === userId || ROLE_ID === "1" || ROLE_ID === "2") &&
          item.MAIN_STATUS_ID === item.STATUS_ID &&
          (item.PROCESS_ID === STATUS_PROCESS_SUCCESSFUL ||
            item.PROCESS_ID === STATUS_PROCESS_PROCESS ||
            item.PROCESS_ID === STATUS_PROCESS_UNSUCCESSFUL)
      );
      console.log("arr", arr);
      setArrayTable(arr);
      loadData();
    } else {
      loadData();
      console.log("handleUpdateData loadData");
    }
  };

  //ทำ render record ของตาราถ้าใช้ logic เยอะ
  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record.DATE) {
      return null;
    }
    const recordDate = dayjs(record.DATE).startOf("day");
    const today = dayjs().startOf("day");
    const daysDifference = today.diff(recordDate, "days");
    let color;
    if (record.LOAN_TYPE_ID === 1) {
      color = daysDifference > 30 ? "red" : "green";
      console.log(`${record.CONTNO}`, record.LOAN_TYPE_ID);
    } else if (record.LOAN_TYPE_ID === 2) {
      color = daysDifference > 60 ? "red" : "green";
      console.log(`${record.CONTNO}`, record.LOAN_TYPE_ID);
    }
    const formattedDate = record.DATE ? convertDateThai(record.DATE) : null;
    return (
      <Tag color={color} key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
        <br />
        {<span>เกินมา {daysDifference} วัน</span>}
      </Tag>
    );
  };

  const renderProcess = (record) => {
    let value =
      record.PROCESS_ID === 4
        ? "รอดำเนินการ"
        : record.PROCESS_ID === 3
        ? "เตรียมส่งฟ้อง"
        : record.PROCESS_ID === 2
        ? "ข้อมูลไม่ครบ"
        : null;
    let color =
      record.PROCESS_ID === 4
        ? "blue"
        : record.PROCESS_ID === 3
        ? "green"
        : record.PROCESS_ID === 2
        ? "red"
        : null;

    return (
      <Tag color={color} key={value} style={{ textAlign: "center" }}>
        {value}
      </Tag>
    );
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
      title: "วันส่ง notice",
      align: "center",
      render: (record) => <>{renderDate(record)}</>,
      sorter: (a, b) => {
        // เปรียบเทียบวันที่ระหว่าง a.DATE และ b.DATE
        return dayjs(a.DATE).isBefore(dayjs(b.DATE)) ? -1 : 1;
      },

      defaultSortOrder: "ascend",
    },
    {
      title: "การดำเนินการ",
      align: "center",
      render: (record) => <>{renderProcess(record)}</>,
    },
    //ทำ logic record
    ...(ROLE_ID === "1" || ROLE_ID === "2"
      ? [
          {
            title: "ทนายที่รับผิดชอบ",
            align: "center",
            render: (record) => <>{record.LAWYER_NNAME}</>,
          },
        ]
      : []),
  ];

  return (
    <>
      {ROLE_ID === "1" || ROLE_ID === "2" ? (
        <>
          <Card>
            <Spin spinning={loading} size="large" tip=" Loading... ">
              <Row>
                <Col
                  span={"24"}
                  style={{ textAlign: "end", marginBottom: "10px" }}
                >
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
                    footer={() => <p>จำนวนสัญญาทั้งหมด {tableLength}</p>}
                    expandable={{
                      expandedRowRender: (record) => (
                        <p style={{ margin: 0 }}>
                          <Button
                            style={{
                              boxShadow: "0 4px 3px",
                              marginLeft: "10px",
                            }}
                            onClick={() => {
                              setIsModalUpdateNoticeEms(true);
                              setDataModal(record);
                              console.log("---->", record);
                            }}
                          >
                            <EditOutlined
                              style={{ color: "orange", fontSize: "16px" }}
                            />
                          </Button>
                          {/* )} */}
                        </p>
                      ),

                      rowExpandable: (record) =>
                        (userId === record.LAWYER_ID && ROLE_ID === "3") ||
                        ROLE_ID === "2" ||
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
            <DetailModal
              open={isModal}
              close={setIsModal}
              dataRec={dataRecord}
            />
          ) : null}
          {isModalUpdateNoticeEms ? (
            <UpdateReplyNoticeEms
              open={isModalUpdateNoticeEms}
              close={setIsModalUpdateNoticeEms}
              dataDefault={dataModal}
              funcUpdateStatus={handleUpdateData}
            />
          ) : null}
        </>
      ) : (
        <Card>
          <b>ไม่มีสิทธ์เข้าถึงข้อมูล</b>
        </Card>
      )}
    </>
  );
};

const ReplyNoticeEms = MotionHoc(Main);
export default ReplyNoticeEms;
