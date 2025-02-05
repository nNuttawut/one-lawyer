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
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import DetailModal from "../detail/DetailModal";

import MotionHoc from "../../../utils/MotionHoc";

import {
  baseUrl,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
} from "../../API/apiUrls";

import axios from "axios";
import { NOTICE } from "../../../utils/constant/StatusConstant";
import DateCustom from "../../../hook/DateCustom";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const Main = () => {
  const [convertDateThai] = DateCustom();

  const [isModal, setIsModal] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalDocument, setIsModalDocument] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const [dataRecord, setDataRecord] = useState();
  const userCompany = localStorage.getItem("COMPANY_ID");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.get(
        baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + NOTICE,
        {
          HEADERS_EXPORT,
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
    // if (Array.isArray(data)) {
    //   const newData = data.filter(
    //     (item) =>
    //       item.LAWYER_ID === userId.id || ROLE_ID === "1" || ROLE_ID === "2"
    //   );
    function containsNumber(str) {
      return /\d/.test(str); // เช็คว่า str เป็นตัวเลขทั้งหมด
    }

    function isEnglishOnly(str) {
      return /^[A-Za-z]+$/.test(str); // เช็คว่า str เป็นตัวอักษรภาษาอังกฤษทั้งหมด
    }

    let filteredData;

    if (userCompany === "3") {
      filteredData = data.filter((item) => {
        const containsEng = item.CONTNO.substring(0, 1) === "4";
        // ถ้า 2 เป็นภาษาอังกฤษทั้งหมด
        if (isEnglishOnly(item.CONTNO.substring(0, 2)) || containsEng) {
          return item;
        } else {
          return false;
        }
      });
    } else {
      filteredData = data.filter((item) => {
        const containsNo = containsNumber(item.CONTNO.substring(0, 2)); // ตรวจสอบว่า 2 ตัวแรกมีตัวเลขไหม
        const containsEng = item.CONTNO.substring(0, 1) === "4";
        // ถ้า 2 ตัวแรกไม่ใช่ตัวเลข และไม่ได้เป็นภาษาอังกฤษทั้งหมด
        if (containsNo && !containsEng) {
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
    // } else {
    //   console.error("data is not an array or is undefined");
    //   setTableLength(0);
    // }
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter((item) => item.CONTNO.includes(value));
    setArrayTable(result);
  };

  const onSearchByDate = (startDate, endDate) => {
    console.log(endDate[0]);
    console.log(endDate[1]);

    const start = dayjs(endDate[0], "YYYY-MM-DD");
    const end = dayjs(endDate[1], "YYYY-MM-DD");

    const timestampStart = start.valueOf();
    const timestampEnd = end.valueOf();
    console.log("dataArr--->", dataArr);

    if (startDate && endDate) {
      const selectSearch = dataArr.filter((item) => {
        const date = dayjs(item.DATE, "YYYY-MM-DD");
        const itemDate = date.valueOf();
        if (itemDate >= timestampStart && itemDate <= timestampEnd) {
          console.log("item", item);
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
      const arr = result.filter((item) => item.MAIN_STATUS_ID === NOTICE);
      console.log("arr", arr);
      setArrayTable(arr);
    } else {
      loadData();
      console.log("handleUpdateData loadData");
    }
  };

  //ทำ render record ของตาราถ้าใช้ logic เยอะ
  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    // if (!record.DATE) {
    //   return null;
    // }
    const recordDate = dayjs(record.created_date).startOf("day");
    // console.log("recordDate", recordDate);

    const today = dayjs().startOf("day");
    // console.log("today", today);

    const daysDifference = today.diff(recordDate, "days");
    // console.log("daysDifference", daysDifference);

    let color = daysDifference > 30 ? "red" : "green";
    const formattedDate = record.DATE ? convertDateThai(record.DATE) : null;

    return (
      <Tag color="blue" key={daysDifference} style={{ textAlign: "center" }}>
        {daysDifference}
      </Tag>
    );
  };

  const rederDataStatus = (record) => {
    console.log(record);

    if (record === 1) {
      return <Tag color="orange">ส่ง NOTICE</Tag>;
    } else if (record === 2) {
      return <Tag color="orange">ส่งคำฟ้อง</Tag>;
    } else if (record === 3) {
      return <Tag color="violet">รอพิพากษา</Tag>;
    } else if (record === 4) {
      return <Tag color="blue">พิพากษา</Tag>;
    } else if (record === 5) {
      return <Tag color="violet">ทำยอม</Tag>;
    } else if (record === 6) {
      return <Tag color="violet">คดีถึงที่สุด</Tag>;
    } else if (record === 7) {
      return <Tag color="violet">สืบทรัพย์หลังฟ้อง</Tag>;
    } else if (record === 8) {
      return <Tag color="violet">บังคับคดี</Tag>;
    } else if (record === 9) {
      return <Tag color="violet">เจรจาทรัพย์</Tag>;
    } else if (record === 10) {
      return <Tag color="violet">ขายทรัพย์</Tag>;
    } else if (record === 11) {
      return <Tag color="violet">สิ้นสุด</Tag>;
    }
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
      title: "ระยะเวลา",
      align: "center",
      render: (record) => <>{renderDate(record)}</>,
    },
    {
      title: "สถานะคดี",
      align: "center",
      render: (record) => <>{rederDataStatus(record.MAIN_STATUS_ID)}</>,
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

  if (ROLE_ID === "1" || ROLE_ID === "2") {
    return (
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
  } else {
    return <b>ไม่มีสิทธ์เข้าถึง</b>;
  }
};

const ReportCourt = MotionHoc(Main);
export default ReportCourt;
