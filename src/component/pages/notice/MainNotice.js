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
import { EditOutlined, FormOutlined, SyncOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import CreateNotice from "./modal/CreateNotice";
import { Link } from "react-router-dom";
import EditNotice from "./modal/EditNotice";
import {
  baseUrl,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
} from "../../API/apiUrls";

//use redux
import axios from "axios";
import {
  NOTICE,
  STATUS_PROCESS_PROGRESS,
} from "../../../utils/constant/StatusConstant";
import DateCustom from "../../../hook/DateCustom";
import UpdateReplyNotice from "./modal/UpdateReplyNotic";
import dayjs from "dayjs";

const Main = () => {
  const [convertDateThai] = DateCustom();
  const [isModal, setIsModal] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModaUpdateReply, setIsModalUpdateReply] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const [dataRecord, setDataRecord] = useState();
  const [dateUpdate, setDateUpdate] = useState(null);

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
          console.log("newData", newData);

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
    if (Array.isArray(data)) {
      const newData = data.filter(
        (item) =>
          (item.LAWYER_ID === userId || ROLE_ID === "1" || ROLE_ID === "2") &&
          item.MAIN_STATUS_ID === item.STATUS_ID &&
          item.PROCESS_ID === STATUS_PROCESS_PROGRESS
      );
      setArrayTable(newData);
      setDataArr(newData);
      setTableLength(newData.length);
      console.log("newData", newData);
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
      console.log("result", result);
      setDataArr(result);
      const arr = result.filter(
        (item) =>
          (item.LAWYER_ID === userId || ROLE_ID === "1" || ROLE_ID === "2") &&
          item.MAIN_STATUS_ID === item.STATUS_ID &&
          item.PROCESS_ID === STATUS_PROCESS_PROGRESS
      );
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
    if (!record.DATE) {
      return null;
    }
    const recordDate = dayjs(record.DATE);
    const today = dayjs().startOf("day");
    const daysDifference = today.diff(recordDate, "days");
    let color = daysDifference > 30 ? "green" : "red";
    const formattedDate = record.DATE ? convertDateThai(record.DATE) : null;

    return (
      <Tag color={color} key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
        <br />
        {daysDifference > 30 ? <span>เกินมา {daysDifference} วัน</span> : null}
      </Tag>
    );
  };

  const updateDate = (record) => {
    const recordDate = dayjs(record.DATE);
    const today = dayjs().startOf("day");
    const daysDifference = today.diff(recordDate, "days");

    return (
      <>
        {daysDifference > 30 ? (
          <Button
            style={{
              boxShadow: "0 4px 3px",
              marginRight: "10px",
            }}
            onClick={() => {
              setIsModalUpdateReply(true);
              setDataModal(record);
            }}
          >
            <SyncOutlined style={{ color: "green", fontSize: "16px" }} />
          </Button>
        ) : null}
      </>
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
    },
    {
      title: "หมายเลข EMS",
      align: "center",
      render: (record) => <>{record.PARCEL_NO ? record.PARCEL_NO : null}</>,
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
                      {!record.DATE ? (
                        <Button
                          style={{
                            boxShadow: "0 4px 3px",
                            marginRight: "10px",
                          }}
                          onClick={() => {
                            setIsModalCreate(true);
                            setDataModal(record);
                          }}
                        >
                          <FormOutlined
                            style={{ color: "blue", fontSize: "16px" }}
                          />
                        </Button>
                      ) : null}
                      {record.DATE ? (
                        <>
                          <Button
                            style={{
                              boxShadow: "0 4px 3px",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              setIsModalEdit(true);
                              setDataModal(record);
                            }}
                          >
                            <EditOutlined
                              style={{ color: "orange", fontSize: "16px" }}
                            />
                          </Button>
                          {updateDate(record)}
                        </>
                      ) : null}
                    </p>
                  ),
                  rowExpandable: (record) => ROLE_ID === "1" || ROLE_ID === "2",
                }}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? (
        <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
      ) : null}
      {isModalCreate ? (
        <CreateNotice
          open={isModalCreate}
          close={setIsModalCreate}
          dataDefualt={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
      {isModalEdit ? (
        <EditNotice
          open={isModalEdit}
          close={setIsModalEdit}
          dataDefualt={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
      {isModaUpdateReply ? (
        <UpdateReplyNotice
          open={isModaUpdateReply}
          close={setIsModalUpdateReply}
          dataDefualt={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
    </>
  );
};

const Notice = MotionHoc(Main);
export default Notice;
