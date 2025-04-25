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
import UpdateReplyNotice from "./modal/updateReplyNotice";
import EditReplyNotice from "./modal/EditReplyNotice";

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
import UpdateStatusNotice from "./modal/UpdateStatusNotice";
import { optionsLocat } from "../../../utils/constant/LocatOption";

const Main = () => {
  const [convertDateThai] = DateCustom();
  const [isModal, setIsModal] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [isModalUpdateStatus, setIsModalUpdateStatus] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
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
      let filteredData;

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

      setSearchEdit(filteredData);
      const newData = filteredData.filter(
        (item) =>
          (item.LAWYER_ID === userId || ROLE_ID === "1" || ROLE_ID === "2") &&
          item.MAIN_STATUS_ID === item.STATUS_ID &&
          (item.PROCESS_ID === STATUS_PROCESS_SUCCESSFUL ||
            item.PROCESS_ID === STATUS_PROCESS_PROCESS ||
            item.PROCESS_ID === STATUS_PROCESS_UNSUCCESSFUL)
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
        (item.CUSTOMER_LNAME && item.CUSTOMER_LNAME.includes(value))
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
    const formattedDate = record.DATE ? convertDateThai(recordDate) : null;
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
                      {record.PROCESS_ID === STATUS_PROCESS_PROCESS ? (
                        <Button
                          style={{ boxShadow: "0 4px 3px" }}
                          onClick={() => {
                            setIsModalUpdate(true);
                            setDataModal(record);
                            console.log("---->", record);
                          }}
                        >
                          <FormOutlined
                            style={{ color: "blue", fontSize: "16px" }}
                          />
                        </Button>
                      ) : (
                        <Button
                          style={{
                            boxShadow: "0 4px 3px",
                            marginLeft: "10px",
                          }}
                          onClick={() => {
                            setIsModalEdit(true);
                            setDataModal(record);
                            console.log("---->", record);
                          }}
                        >
                          <EditOutlined
                            style={{ color: "orange", fontSize: "16px" }}
                          />
                        </Button>
                      )}
                      {record.PROCESS_ID === STATUS_PROCESS_SUCCESSFUL ? (
                        <Button
                          style={{
                            boxShadow: "0 4px 3px",
                            marginLeft: "10px",
                          }}
                          onClick={() => {
                            setIsModalUpdateStatus(true);
                            setDataModal(record);
                            console.log("---->", record);
                          }}
                        >
                          <SyncOutlined
                            style={{ color: "green", fontSize: "16px" }}
                          />
                        </Button>
                      ) : null}
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
        <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
      ) : null}
      {isModalUpdate ? (
        <UpdateReplyNotice
          open={isModalUpdate}
          close={setIsModalUpdate}
          dataDefault={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
      {isModalEdit ? (
        <EditReplyNotice
          open={isModalEdit}
          close={setIsModalEdit}
          dataDefault={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
      {isModalUpdateStatus ? (
        <UpdateStatusNotice
          open={isModalUpdateStatus}
          close={setIsModalUpdateStatus}
          dataDefault={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
    </>
  );
};

const Notice = MotionHoc(Main);
export default Notice;
