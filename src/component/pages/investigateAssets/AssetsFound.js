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
import { FormOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_INVESTIGATE_LOANS_LIST,
  HEADERS_EXPORT,
} from "../../API/apiUrls";

import axios from "axios";

import DateCustom from "../../../hook/DateCustom";
import InvestigateAssets from "./modal/InvestigateAssets";
import dayjs from "dayjs";
import AssetsListSuccess from "./modal/AssetsListSuccess";

const Main = () => {
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const [convertDateThai] = DateCustom();
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [isModal, setIsModal] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [dataRecord, setDataRecord] = useState();
  const [isModalInvestigateAssets, setIsModalInvestigateAssets] =
    useState(false);
  const [isModalassetsListSuccess, setIsModalassetsListSuccess] =
    useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

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
      const newData = data.filter((item) => item.investigation_status === 1);
      console.log("newDataLawsuit 11", newData);

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
      const newData = result.filter((item) => item.investigation_status === 1);
      console.log("result", newData);
      setDataArr(newData);
      setArrayTable(newData);
    } else {
      loadData();
      console.log("handleUpdateData loadData");
    }
  };

  //ทำ render record ของตาราถ้าใช้ logic เยอะ
  const renderDataAsset = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    const checkData = record.map((item) => !item.estimated_price); // ได้ array ของ true, false
    console.log(checkData);
    // ถ้าทุกค่าภายใน checkData เป็น false (หมายความว่า ประเมินหมดแล้ว)
    const allFalse = checkData.every((value) => value === false);

    // ถ้าทุกค่าภายใน checkData เป็น true (หมายความว่า ยังไม่ได้ประเมิน)
    const allTrue = checkData.every((value) => value === true);

    // if (allFalse) {
    //   console.log("ทุกค่าถูกประเมินแล้ว");
    // } else if (allTrue) {
    //   console.log("ทุกค่ายังไม่ได้รับการประเมิน");
    // } else {
    //   console.log("มีค่าทั้งที่ประเมินแล้วและยังไม่ได้ประเมิน");
    // }

    let color = allTrue === true ? "blue" : allFalse ? "green" : "orange";

    return (
      <Tag color={color} key={record.id} style={{ textAlign: "center" }}>
        {allFalse
          ? "ประเมินเสร็จสิ้น"
          : allTrue
          ? "รอประเมินทรัพย์"
          : "อยู่ในระหว่างการประเมินทรัพย์"}
      </Tag>
    );
  };

  //ทำ render record ของตาราถ้าใช้ logic เยอะ
  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record.investigation_date) {
      return null;
    }
    let color;
    const recordDate = dayjs(record.investigation_date).startOf("day");
    const today = dayjs().startOf("day");

    const checkData = record.property_list.map((item) => !item.estimated_price); // ได้ array ของ true, false
    console.log(checkData);
    // ถ้าทุกค่าภายใน checkData เป็น false (หมายความว่า ประเมินหมดแล้ว)
    const allFalse = checkData.every((value) => value === false);

    // ถ้าทุกค่าภายใน checkData เป็น true (หมายความว่า ยังไม่ได้ประเมิน)
    const allTrue = checkData.every((value) => value === true);

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

    if (allTrue) {
      color = remainingDays > 7 ? "red" : "blue";
    } else if (allFalse) {
      color = "green";
    } else {
      color = "orange";
    }

    const formattedDate = record.investigation_date
      ? convertDateThai(record.investigation_date)
      : null;
    return (
      <Tag color={color} key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
        <br />
        {
          <span>
            {remainingDays > 7 ? "เกิน" : null} {remainingDays} วัน
          </span>
        }
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
      title: "สถานะ",
      align: "center",
      render: (record) => <>{renderDataAsset(record.property_list)}</>,
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
            <Col span={"24"} style={{ textAlign: "end", marginBottom: "10px" }}>
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
                      {!record.investigation_date ? (
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
                      ) : null}

                      {record.investigation_date ? (
                        <Button
                          style={{
                            boxShadow: "0 4px 3px",
                            marginRight: "10px",
                          }}
                          onClick={() => {
                            setIsModalassetsListSuccess(true);
                            setDataModal(record);
                          }}
                        >
                          <FormOutlined
                            style={{ color: "orange", fontSize: "16px" }}
                          />
                        </Button>
                      ) : null}
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
        <InvestigateAssets
          open={isModalInvestigateAssets}
          close={setIsModalInvestigateAssets}
          dataDefualt={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
      {isModalassetsListSuccess ? (
        <AssetsListSuccess
          open={isModalassetsListSuccess}
          close={setIsModalassetsListSuccess}
          dataDefualt={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
    </>
  );
};

const AssetsFound = MotionHoc(Main);
export default AssetsFound;
