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
import {
  EditOutlined,
  SyncOutlined,
  FormOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  HEADERS_EXPORT,
} from "../../API/apiUrls";

import axios from "axios";
import { INDICT } from "../../../utils/constant/StatusConstant";
import DateCustom from "../../../hook/DateCustom";
import CreateDocument from "./modal/CreateDocument";
import DocumentEnforce from "./modal/DocumentEnforce";
import UpdateStatusBlackNumber from "./modal/UpdateStatusBlackNumber";
import EditFrom from "./modal/EditForm";
import dayjs from "dayjs";
import EditUpdateStatusBlackNumber from "./modal/EditUpdateStatusBlackNumber";
import { optionsLone } from "../../../utils/constant/LoanTypeConstant";
import { optionsLocat } from "../../../utils/constant/LocatOption";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const Main = () => {
  const [
    convertDateThai,
    convertDateThaiShort,
    convertDateThaiYear,
    convertDateThaiMonth,
    convertDateThaiDate,
    dateNow,
  ] = DateCustom();
  const userCompany = localStorage.getItem("COMPANY_ID");
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const [isModal, setIsModal] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalDocument, setIsModalDocument] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalEditUpdate, setIsModalEditUpdate] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [dataRecord, setDataRecord] = useState();
  const [searchEdit, setSearchEdit] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const onExpand = (expanded, record) => {
    if (expanded) {
      // เมื่อแถวถูกขยาย, ให้เพิ่ม key ของแถวนั้นลงใน expandedRowKeys
      setExpandedRowKeys([record.key]);
    } else {
      // เมื่อแถวถูกยุบ, ให้ลบ key ของแถวนั้นออกจาก expandedRowKeys
      setExpandedRowKeys([]);
    }
  };

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.get(
        baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + INDICT,
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
          filterData(newData);
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

  const filterData = (data) => {
    if (Array.isArray(data)) {
      let filteredData;

      if (userCompany === "3") {
        filteredData = data.filter((item) => {
          const branch = item.LOCAT;
          // ถ้า branch เป็น null หรือ undefined ให้ return true ไปเลย (หรือ false ก็ได้ ขึ้นกับความต้องการ)
          if (!branch) return true; // หรือ false ก็ได้ ถ้าอยาก "กรองออก"

          // ถ้า branch มีค่า → เช็กตามปกติ
          return !optionsLocat.some((opt) => branch.includes(opt.label));
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
          item.MAIN_STATUS_ID === item.STATUS_ID
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

  const renderDate = (record) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record.DATE) {
      return null;
    }
    let color;
    const recordDate = dayjs.utc(record.DATE).startOf("day");
    const today = dayjs.utc().startOf("day");

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
    const remainingDays = today.diff(recordDate, "day");

    if (record.LOAN_TYPE_ID === 1) {
      color =
        remainingDays > 30 && record.PROCESS_ID === 1
          ? "green"
          : record.PROCESS_ID === 3
          ? "blue"
          : "red";
    } else {
      color =
        remainingDays > 60 && record.PROCESS_ID === 1
          ? "green"
          : record.PROCESS_ID === 3
          ? "blue"
          : "red";
    }
    console.log("recordDate----->", recordDate);
    console.log("record.DATE", record.DATE);
    console.log("con", record.CONTNO);

    const formattedDate = record.DATE ? convertDateThai(recordDate) : null;
    return (
      <Tag color={color} key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
        <br />
        {
          <span>
            {record.LOAN_TYPE_ID === 1 && remainingDays > 30
              ? "เกิน"
              : record.LOAN_TYPE_ID === 2 && remainingDays > 60
              ? "เกิน"
              : null}{" "}
            {remainingDays} วัน
          </span>
        }
      </Tag>
    );
  };

  const renderLoanType = (value) => {
    return (
      optionsLone.find((item) => item.value === value)?.label || "ไม่พบชื่อ"
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
      title: "ประเภทสัญญา",
      align: "center",
      render: (record) => <>{renderLoanType(record.LOAN_TYPE_ID)} </>,
    },
    {
      title: "วันที่นำเข้าส่วนฟ้อง",
      align: "center",
      render: (record) => <>{renderDate(record)}</>,
      sorter: (a, b) => {
        // เปรียบเทียบวันที่ระหว่าง a.DATE และ b.DATE
        return dayjs(b.DATE).isBefore(a.DATE) ? -1 : 1;
      },
      defaultSortOrder: "ascend", // ตั้งค่าเริ่มต้นเป็น "ascend"
    },
    ...(ROLE_ID === "1" || ROLE_ID === "2"
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
                      {record.PROCESS_ID !== 3 &&
                      record.MAIN_STATUS_ID === record.STATUS_ID ? (
                        <Button
                          name="create"
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
                      ) : record.PROCESS_ID === 3 &&
                        record.MAIN_STATUS_ID === record.STATUS_ID ? (
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
                          <Button
                            name="edit"
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
                          <Button
                            name="updateStatus"
                            style={{ boxShadow: "0 4px 3px" }}
                            onClick={() => {
                              setIsModalUpdate(true);
                              setDataModal(record);
                            }}
                          >
                            <SyncOutlined
                              style={{ color: "green", fontSize: "16px" }}
                            />
                          </Button>
                        </>
                      ) : null}
                      {record.MAIN_STATUS_ID !== record.STATUS_ID ? (
                        <Button
                          name="EditupdateStatus"
                          style={{ boxShadow: "0 4px 3px" }}
                          onClick={() => {
                            setIsModalEditUpdate(true);
                            setDataModal(record);
                          }}
                        >
                          <SyncOutlined
                            style={{ color: "orange", fontSize: "16px" }}
                          />
                        </Button>
                      ) : null}

                      {/* <Button
                        name="document"
                        style={{ boxShadow: "0 4px 3px" }}
                        // onClick={() => {}}
                      >
                        <FilePdfOutlined
                          style={{ color: "orange", fontSize: "16px" }}
                        />
                      </Button> */}
                    </p>
                  ),
                  rowExpandable: (record) => userId === record.LAWYER_ID,
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
        <CreateDocument
          open={isModalCreate}
          close={setIsModalCreate}
          dataDefault={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
      {isModalDocument ? (
        <DocumentEnforce open={isModalDocument} close={setIsModalDocument} />
      ) : null}
      {isModalUpdate ? (
        <UpdateStatusBlackNumber
          open={isModalUpdate}
          close={setIsModalUpdate}
          dataDefault={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
      {isModalEditUpdate ? (
        <EditUpdateStatusBlackNumber
          open={isModalEditUpdate}
          close={setIsModalEditUpdate}
          dataDefault={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
      {isModalEdit ? (
        <EditFrom
          open={isModalEdit}
          close={setIsModalEdit}
          dataDefault={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
    </>
  );
};

const PreLawsuitFiled = MotionHoc(Main);
export default PreLawsuitFiled;
