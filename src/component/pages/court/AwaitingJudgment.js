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
  Tooltip,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useMemo, useState } from "react";
import DetailModal from "../detail/DetailModal";
import { FormOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
} from "../../API/apiUrls";

//use redux
import { useSelector } from "react-redux";

import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import { AWAITING_JUDMENT } from "../../../utils/constant/StatusConstant";
import UpdateStatusAwaitingJudgment from "./modal/UpdateStatusAwaitingJudgment";
import EditAwaitingJudgement from "./modal/EditAwaitingJudgement";
import dayjs from "dayjs";

const Main = () => {
  const [convertDateThai] = DateCustom();
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const [isModal, setIsModal] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalDocument, setIsModalDocument] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const profileRedux = useSelector((state) => state.authReducer.profile);
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [dataStore, setDataStore] = useState(null);
  const [arrow, setArrow] = useState("Show");
  const [dataRecord, setDataRecord] = useState();
  const companyId = localStorage.getItem("COMPANY_ID");
  const [searchEdit, setSearchEdit] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

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

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.get(
        baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + AWAITING_JUDMENT,
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
          console.log(newData);
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
    if (Array.isArray(data)) {
      const newData = data.filter(
        (item) =>
          (item.LAWYER_ID === userId || ROLE_ID === "1" || ROLE_ID === "2") &&
          item.MAIN_STATUS_ID === item.STATUS_ID
      );

      function containsNumber(str) {
        return /\d/.test(str); // เช็คว่า str เป็นตัวเลขทั้งหมด
      }

      function isEnglishOnly(str) {
        return /^[A-Za-z]+$/.test(str); // เช็คว่า str เป็นตัวอักษรภาษาอังกฤษทั้งหมด
      }

      let filteredData;

      if (companyId === "3") {
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

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = searchEdit.filter(
      (item) =>
        ((item.CONTNO && item.CONTNO.includes(value)) ||
          (item.CUSTOMER_FNAME && item.CUSTOMER_FNAME.includes(value)) ||
          (item.CUSTOMER_LNAME && item.CUSTOMER_LNAME.includes(value))) &&
        item.LAWYER_ID === userId
    );
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
    if (data !== 0) {
      const result = dataArr.map((item) => {
        if (item.id === data.id) {
          return { ...data };
        } else {
          return { ...item };
        }
      });
      console.log(result);
      setDataArr(result);
      const arr = result.filter(
        (item) =>
          (item.LAWYER_ID === userId || ROLE_ID === "1" || ROLE_ID === "2") &&
          item.MAIN_STATUS_ID === item.STATUS_ID
      );
      console.log("arr", arr);
      setArrayTable(arr);
    } else {
      loadData();
      console.log("handleUpdateData loadData");
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
      title: "วันนัดพิจารณาคดี",
      align: "center",
      sorter: (a, b) => dayjs(a.DATE).unix() - dayjs(b.DATE).unix(),
      render: (record) => (
        <Tag color="orange" style={{ textAlign: "center" }}>
          {convertDateThai(record.DATE)}
        </Tag>
      ),
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
                      {record.MAIN_STATUS_ID === AWAITING_JUDMENT ? (
                        <>
                          {/* <Button
                            name="formPrint"
                            style={{
                              boxShadow: "0 4px 3px",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              setIsModalDocument(true);
                            }}
                          >
                            <FileDoneOutlined
                              style={{ color: "green", fontSize: "16px" }}
                            />
                          </Button> */}
                          <Tooltip
                            placement="bottom"
                            title="บันทึกคำพิพากษา!"
                            arrow={mergedArrow}
                          >
                            <Button
                              name="updateStatus"
                              style={{ boxShadow: "0 4px 3px" }}
                              onClick={() => {
                                setIsModalUpdate(true);
                                setDataModal(record);
                              }}
                            >
                              <FormOutlined
                                style={{ color: "blue", fontSize: "16px" }}
                              />
                            </Button>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip
                            placement="bottom"
                            title="แก้่ไขคำพิพากษา!"
                            arrow={mergedArrow}
                          >
                            <Button
                              name="editStatus"
                              style={{ boxShadow: "0 4px 3px" }}
                              onClick={() => {
                                setIsModalEdit(true);
                                setDataModal(record);
                              }}
                            >
                              <FormOutlined
                                style={{ color: "orange", fontSize: "16px" }}
                              />
                            </Button>
                          </Tooltip>
                        </>
                      )}
                    </p>
                  ),
                  rowExpandable: (record) => userId === record.LAWYER_ID,
                }}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? (
        <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
      ) : null}
      {isModalEdit ? (
        <EditAwaitingJudgement
          open={isModalEdit}
          close={setIsModalEdit}
          dataDefualt={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
      {/* {isModalDocument ? (
        <DocumentEnforce open={isModalDocument} close={setIsModalDocument} />
      ) : null} */}
      {isModalUpdate ? (
        <UpdateStatusAwaitingJudgment
          open={isModalUpdate}
          close={setIsModalUpdate}
          dataDefualt={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
    </>
  );
};

const AwaitingJudgment = MotionHoc(Main);
export default AwaitingJudgment;
