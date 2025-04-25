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
import { EditOutlined, FormOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
} from "../../API/apiUrls";

import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import {
  ENFORCEMENT,
  STATUS_PROCESS_PROGRESS,
} from "../../../utils/constant/StatusConstant";
import dayjs from "dayjs";
import ReportSeize from "./modal/ReportSeize";
import EditJudgement from "./modal/EditJudgement";
import { optionsLocat } from "../../../utils/constant/LocatOption";

const Main = () => {
  const [
    convertDateThai,
    convertDateThaiShort,
    convertDateThaiYear,
    convertDateThaiMonth,
    convertDateThaiDate,
    dateNow,
  ] = DateCustom();

  const [isModal, setIsModal] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [dataRecord, setDataRecord] = useState();
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [arrow, setArrow] = useState("Show");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.get(
        baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + ENFORCEMENT,
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
          console.log(newData);

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

  const onExpand = (expanded, record) => {
    if (expanded) {
      // เมื่อแถวถูกขยาย, ให้เพิ่ม key ของแถวนั้นลงใน expandedRowKeys
      setExpandedRowKeys([record.key]);
    } else {
      // เมื่อแถวถูกยุบ, ให้ลบ key ของแถวนั้นออกจาก expandedRowKeys
      setExpandedRowKeys([]);
    }
  };

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

  const filterDataLawyer = (data) => {
    if (Array.isArray(data)) {
      const newData = data.filter(
        (item) =>
          (item.LAWYER_ID === userId ||
            ROLE_ID === "1" ||
            ROLE_ID === "2" ||
            ROLE_ID === "9") &&
          item.PROCESS_ID === STATUS_PROCESS_PROGRESS
      );

      let filteredData;

      if (userCompany === "3") {
        filteredData = newData.filter((item) => {
          const branch = item.LOCAT;
          // ถ้า branch เป็น null หรือ undefined ให้ return true ไปเลย (หรือ false ก็ได้ ขึ้นกับความต้องการ)
          if (!branch) return true; // หรือ false ก็ได้ ถ้าอยาก "กรองออก"

          // ถ้า branch มีค่า → เช็กตามปกติ
          return !optionsLocat.some((opt) => branch.includes(opt.label));
        });
      } else {
        filteredData = newData.filter((item) => {
          const branch = item.LOCAT;
          if (!branch) return false; // ไม่มี branch ไม่ผ่านเงื่อนไข

          return optionsLocat.some((opt) => branch.includes(opt.label));
        });
      }

      setArrayTable(filteredData);
      setDataArr(filteredData);
      setTableLength(filteredData.length);
      console.log("filteredData", filteredData);
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

  //ทำ render record ของตาราถ้าใช้ logic เยอะ
  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record.DATE) {
      return null;
    }
    const recordDate = dayjs(record.DATE).startOf("day");
    const today = dayjs().startOf("day");
    const daysDifference = today.diff(recordDate, "days");
    const formattedDate = record.DATE ? convertDateThai(recordDate) : null;
    return (
      <Tag color="orange" key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
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
      title: "วันที่พิพากษา",
      align: "center",
      render: (record) => <>{renderDate(record)}</>,
    },
    ...(ROLE_ID === "1" || ROLE_ID === "2" || ROLE_ID === "3" || ROLE_ID === "4"
      ? [
          {
            title: "เจ้าของคดี",
            align: "center",
            render: (record) => <>{record?.LAWYER_NNAME}</>,
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
                      {ROLE_ID === "1" || ROLE_ID === "3" || ROLE_ID === "4" ? (
                        <Tooltip
                          placement="bottom"
                          title="คลิกเพื่อสร้างบันทึกการยึด !"
                          arrow={mergedArrow}
                        >
                          <Button
                            name="create"
                            style={{
                              boxShadow: "0 4px 3px",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              setIsModalCreate(true);
                              setDataRecord(record);
                            }}
                          >
                            <FormOutlined
                              style={{ color: "blue", fontSize: "16px" }}
                            />
                          </Button>
                        </Tooltip>
                      ) : null}
                      <Tooltip
                        placement="bottom"
                        title="คลิกเพื่อแก้ไขคำพิพากษา !"
                        arrow={mergedArrow}
                      >
                        <Button
                          name="edit"
                          style={{
                            boxShadow: "0 4px 3px",
                            marginRight: "10px",
                          }}
                          onClick={() => {
                            setIsModalEdit(true);
                            setDataRecord(record);
                          }}
                        >
                          <EditOutlined
                            style={{ color: "orange", fontSize: "16px" }}
                          />
                        </Button>
                      </Tooltip>
                    </p>
                  ),
                  rowExpandable: (record) => record,
                  // userId === record.LAWYER_ID,
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
      {isModalCreate ? (
        <ReportSeize
          open={isModalCreate}
          close={setIsModalCreate}
          dataDefualt={dataRecord}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
      {isModalEdit ? (
        <EditJudgement
          open={isModalEdit}
          close={setIsModalEdit}
          dataDefualt={dataRecord}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
    </>
  );
};

const MainEnforcement = MotionHoc(Main);
export default MainEnforcement;
