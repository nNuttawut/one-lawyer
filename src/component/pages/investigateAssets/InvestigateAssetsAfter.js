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
  GET_JOB_IN_PROGRESS,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
} from "../../API/apiUrls";

//use redux
import { useSelector } from "react-redux";
import axios from "axios";
import {
  CASE_IS_FINAL,
  INVESTIGATE,
  NOTICE,
} from "../../../utils/constant/StatusConstant";
import InvestigateAssetsDetail from "./modal/InvestigateAssetsDetail";
import dayjs from "dayjs";

const Main = () => {
  const [isModal, setIsModal] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const profileRedux = useSelector((state) => state.authReducer.profile);
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [dataRecord, setDataRecord] = useState();
  const [isModalInvestigateAssetsDetail, setIsModalInvestigateAssetsDetail] =
    useState(false);
  console.log(profileRedux.id);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);

    try {
      await axios
        .get(baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + NOTICE, {
          HEADERS_EXPORT,
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
        .catch((err) => console.log("ไม่มีข้อมูล", err));
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data) => {
    if (data) {
      const newData = data.filter((item) => item.MAIN_STATUS_ID >= 4);
      console.log("newDataLawsuit 11", newData);
      setArrayTable(newData);
      setDataArr(newData);
      setTableLength(newData.length);
      console.log(newData);
      console.log("Length of filtered data:", newData.length);
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
      const newData = result.filter((item) => item.MAIN_STATUS_ID >= 4);
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
    if (record.INVESTIGATE_AFTER_ID === null) {
      return null;
    }

    let color = record.INVESTIGATE_AFTER_ID ? "green" : "red";

    return (
      <Tag color={color} key={record.id} style={{ textAlign: "center" }}>
        {record.INVESTIGATE_AFTER_ID ? "เจอทรัพย์" : "ไม่เจอทรัพย์"}
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
      title: "สถานะการสืบทรัพย์",
      align: "center",
      render: (record) => <>{renderDataAsset(record)}</>,
    },
    {
      title: "หมายเหตุ",
      align: "center",
      render: (record) => <>{record.MEMO}</>,
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
                          setIsModalInvestigateAssetsDetail(true);
                          setDataModal(record);
                        }}
                      >
                        <FormOutlined
                          style={{ color: "blue", fontSize: "16px" }}
                        />
                      </Button>
                    </p>
                  ),
                  rowExpandable: (record) => !record.INVESTIGATE_AFTER_ID,
                }}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? (
        <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
      ) : null}
      {isModalInvestigateAssetsDetail ? (
        <InvestigateAssetsDetail
          open={isModalInvestigateAssetsDetail}
          close={setIsModalInvestigateAssetsDetail}
          dataDefualt={dataModal}
          funcUpdateStatus={handleUpdateData}
          investigate={"after"}
        />
      ) : null}
    </>
  );
};

const InvestigateAssetsAfter = MotionHoc(Main);
export default InvestigateAssetsAfter;
