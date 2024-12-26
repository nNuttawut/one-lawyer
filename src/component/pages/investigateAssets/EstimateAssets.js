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
  GET_INVESTIGATE_LIST,
  HEADERS_EXPORT,
} from "../../API/apiUrls";

import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import EstimateAssetsResult from "./modal/EstimateAssetsResult";

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
  const [dataLoadJob, setDataLoadJob] = useState(null);
  const [dataRecord, setDataRecord] = useState();
  const [isModalEstimateAssetsResult, setIsModalEstimateAssetsResult] =
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
        .get(baseUrl + GET_INVESTIGATE_LIST, {
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
            setDataArr(newData);
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
      const newData = data.filter((item) => item.estimated_price === null);
      console.log("newDataLawsuit 11", newData);

      setArrayTable(newData);
      setTableLength(newData.length);
      console.log("newData", newData);
      console.log("Length of filtered data:", newData.length);
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
    let result = dataArr.filter(
      (item) => item.CONTNO.includes(value) || item.possessor.includes(value)
    );
    console.log("result", result);

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
      const newData = result.filter((item) => item.estimated_price === null);
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

    // if (record.estimated_price === null) {
    //   return null;
    // }

    let color = record.estimated_price === null ? "blue" : "green";

    return (
      <Tag color={color} key={record.id} style={{ textAlign: "center" }}>
        {record.estimated_price === null ? "ยังไม่ประเมิน" : "ประเมินแล้ว"}
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

    if (record.estimated_price === null) {
      color = remainingDays > 7 ? "red" : "blue";
    } else {
      color = "green";
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
      sorter: (a, b) => {
        // เปรียบเทียบตามเลขที่สัญญา (CONTNO) - คำสั่งนี้จะเรียงจากน้อยไปมาก
        if (a.CONTNO && b.CONTNO) {
          return a.CONTNO.localeCompare(b.CONTNO); // การใช้ localeCompare สำหรับการเปรียบเทียบ string
        }
        return 0;
      },
      defaultSortOrder: "ascend",
      multiple: 1,
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "CUSTOMER_TNAM",
      key: "CUSTOMER_TNAM",
      align: "center",
      render: (text, record) => <>{record.possessor}</>,
    },
    {
      title: "สถานะ",
      align: "center",
      render: (record) => <>{renderDataAsset(record)}</>,
    },
    {
      title: "วันที่สืบทรัพย์",
      align: "center",
      render: (record) => <>{renderDate(record)}</>,
      sorter: (a, b) => {
        // เปรียบเทียบวันที่ระหว่าง a.DATE และ b.DATE
        return dayjs(a.investigation_date).isBefore(dayjs(b.investigation_date))
          ? -1
          : 1;
      },

      defaultSortOrder: "ascend", // ตั้งค่าเริ่มต้นเป็น "ascend"
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
                      <Button
                        style={{
                          boxShadow: "0 4px 3px",
                          marginRight: "10px",
                        }}
                        onClick={() => {
                          setIsModalEstimateAssetsResult(true);
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
      {isModalEstimateAssetsResult ? (
        <EstimateAssetsResult
          open={isModalEstimateAssetsResult}
          close={setIsModalEstimateAssetsResult}
          dataDefualt={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
    </>
  );
};

const CreateInvestigateAssets = MotionHoc(Main);
export default CreateInvestigateAssets;
