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
import { EditOutlined, SyncOutlined, FormOutlined } from "@ant-design/icons";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  baseUrl,
  GET_EXPENSES_LIST,
  GET_LAWSUIT_LIST,
  HEADERS_EXPORT,
} from "../../API/apiUrls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import DateCustom from "../../../hook/DateCustom";
import dayjs from "dayjs";
import CurrencyFormat from "../../../hook/CurrencyFormat";
// import DetailWithdraw from "./modal/DetailWithdraw";
import ClearAdvanePayment from "./modal/ClearAdvanePaymentCourt";
import {
  STATUS_PROCESS_PROCESS,
  STATUS_PROCESS_SUCCESSFUL,
  STATUS_PROCESS_UNSUCCESSFUL,
} from "../../../utils/constant/StatusConstant";

const Main = () => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const userCompany = localStorage.getItem("COMPANY_ID");
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userName = localStorage.getItem("NNAME");
  const [isModal, setIsModal] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState();
  const [dataModal, setDataModal] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [dataRecord, setDataRecord] = useState();
  const [searchEdit, setSearchEdit] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [lawsuitsData, setLawsuitsData] = useState([]);
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

  const loadData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(baseUrl + GET_EXPENSES_LIST, {
        headers: HEADERS_EXPORT,
      });
      if (response.data) {
        if (response.data) {
          setSearchEdit(response.data);
          setLoading(false);
          filterData(response.data);
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
      console.log("data00", data);

      const newData = data.filter(
        (item) =>
          (item.withdraw_process_id <= 4 && item.USER_ID === userId) ||
          ROLE_ID === "1"
      );
      console.log("newData", newData);
      function containsNumber(str) {
        return /\d/.test(str); // เช็คว่า str เป็นตัวเลขทั้งหมด
      }

      function isEnglishOnly(str) {
        return /^[A-Za-z]+$/.test(str); // เช็คว่า str เป็นตัวอักษรภาษาอังกฤษทั้งหมด
      }

      let filteredData;

      if (userCompany === "3") {
        filteredData = newData.filter((item) => {
          const containsEng = item.CONTNO.substring(0, 1) === "4";
          // ถ้า 2 เป็นภาษาอังกฤษทั้งหมด
          if (isEnglishOnly(item.CONTNO.substring(0, 2)) || containsEng) {
            return item;
          } else {
            return false;
          }
        });
      } else {
        filteredData = newData.filter((item) => {
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
      const preData = groupByCreatedDateWithContno(filteredData);

      const useData = preData.filter((item) => item.reference_no);

      setArrayTable(useData);
      setDataArr(preData);
      setTableLength(useData.length);
      console.log("newData", useData);
      // console.log("Length of filtered data:", preData.length);
    } else {
      console.error("data is not an array or is undefined");
      setTableLength(0);
    }
  };

  const groupByCreatedDateWithContno = (data) => {
    if (!Array.isArray(data)) {
      console.error("Input data is not an array");
      return [];
    }

    const groupedData = data.reduce((acc, current, index) => {
      const {
        reference_no,
        CONTNO,
        withdraw_datetime,
        COMPANY_ID,
        NNAME,
        withdraw_process_id,
        USER_ID,
        created_date,
        withdraw_mark,
        pay_type_id,
        pay_datetime,
        file_path,
      } = current;

      // ถ้ายังไม่มี reference_no นี้ใน acc ให้สร้าง object ใหม่
      if (!acc[reference_no]) {
        acc[reference_no] = {
          reference_no,
          contnoList: new Set(), // ใช้ Set เพื่อเก็บ contno ไม่ให้ซ้ำ
          expenseList: [],
          withdraw_datetime: withdraw_datetime || null, // กำหนดค่า withdraw_datetime
          key: index + 1, // กำหนด key โดยใช้ index + 1
          COMPANY_ID,
          NNAME,
          withdraw_process_id,
          USER_ID,
          created_date,
          withdraw_mark,
          pay_type_id,
          pay_datetime,
          file_path,
        };
      }

      // เพิ่ม CONTNO ลงใน Set (ป้องกันค่าซ้ำ)
      acc[reference_no].contnoList.add(CONTNO);
      // เพิ่มข้อมูลทั้งหมดลงใน expenseList
      acc[reference_no].expenseList.push(current);

      return acc;
    }, {});

    // แปลง Object กลับเป็น Array และเปลี่ยน Set เป็น Array
    return Object.values(groupedData).map((group, groupIndex) => ({
      reference_no: group.reference_no,
      contnoList: Array.from(group.contnoList), // แปลง Set เป็น Array
      expenseList: group.expenseList,
      withdraw_datetime: group.withdraw_datetime,
      key: groupIndex + 1, // ใช้ index ใหม่ใน array ที่ถูก map
      COMPANY_ID: group.COMPANY_ID,
      lawyerName: group.NNAME, // เปลี่ยนชื่อ NNAME → lawyerName
      withdraw_process_id: group.withdraw_process_id,
      USER_ID: group.USER_ID,
      created_date: group.created_date,
      withdraw_mark: group.withdraw_mark,
      pay_type_id: group.pay_type_id,
      pay_datetime: group.pay_datetime,
      file_path: group.file_path,
    }));
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter(
      (item) =>
        (item.contnoList && item.contnoList.includes(value)) ||
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
        const date = dayjs(item.created_date, "YYYY-MM-DD");
        const itemDate = date.valueOf();
        if (itemDate >= timestampStart && itemDate <= timestampEnd) {
          return item;
        } else {
          return null;
        }
      });
      setArrayTable(selectSearch);
      setTableLength(selectSearch.length);
    } else {
      setArrayTable(dataArr);
      setTableLength(dataArr.length);
    }
  };

  const handleUpdateData = (data) => {
    loadData();
    // console.log("data---->update", data);
    // console.log("dataArr data---->update", dataArr);
    // if (data.length > 0) {
    //   const result = dataArr.map((item) => ({
    //     ...item,
    //     expenseList: item.expenseList.map((expense) =>
    //       expense.id === data.id ? { ...expense, ...data } : expense
    //     ),
    //   }));

    //   console.log("result data---->update", result);
    //   return result;
    //   // setDataArr(result);
    //   // const arr = result.filter(
    //   //   (item) =>
    //   //     item.LAWYER_ID === userId || ROLE_ID === "1" || ROLE_ID === "2"
    //   // );
    //   // console.log("arr", arr);
    //   // setArrayTable(arr);
    // } else {
    //   loadData();
    //   console.log("handleUpdateData loadData");
    // }
  };

  const renderDate = (date, status) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!date) {
      return null;
    }

    let color;
    const recordDate = dayjs(date).startOf("day");
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
    const remainingDays = today.diff(recordDate, "day");

    color =
      status === STATUS_PROCESS_SUCCESSFUL
        ? "green"
        : status === STATUS_PROCESS_UNSUCCESSFUL
        ? "red"
        : remainingDays > 7 && status === STATUS_PROCESS_PROCESS
        ? "red"
        : "blue";

    const formattedDate = date ? convertDateThaiShort(date) : null;
    return (
      <Tag color={color} key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
        <br />
        {status !== 3 && (
          <>
            {remainingDays > 7 ? "นาน" : null} {remainingDays} วัน
          </>
        )}
      </Tag>
    );
  };

  const renderContnoList = (record) => {
    return record.contnoList.map((contno, index) => (
      <React.Fragment key={index}>
        {contno}
        <br />
      </React.Fragment>
    ));
  };

  const renderStatusWithdraw = (record) => {
    // ตรวจสอบว่า withdraw_process_id ของทุกรายการใน expenseList ตรงกันหรือไม่
    const allMatch = record.expenseList.every(
      (expense) =>
        expense.withdraw_process_id ===
        record.expenseList[0]?.withdraw_process_id
    );
    let status;
    let color;
    if (allMatch) {
      // ถ้าทุก withdraw_process_id ตรงกัน ให้แสดง withdraw_description ของรายการแรก
      status =
        record.expenseList[0]?.withdraw_process_id === STATUS_PROCESS_PROCESS
          ? "รออนุมัติ"
          : record.expenseList[0]?.withdraw_process_id ===
            STATUS_PROCESS_SUCCESSFUL
          ? "อนุมัติ"
          : record.expenseList[0]?.withdraw_process_id ===
            STATUS_PROCESS_UNSUCCESSFUL
          ? "ไม่อนุมัติ"
          : null;
      color =
        record.expenseList[0]?.withdraw_process_id === STATUS_PROCESS_PROCESS
          ? "blue"
          : record.expenseList[0]?.withdraw_process_id ===
            STATUS_PROCESS_SUCCESSFUL
          ? "green"
          : "red";
    } else {
      color = "red";
      status = "บางรายการไม่ตรงกัน"; // หรือข้อความอื่นๆ ที่คุณต้องการ
    }

    // แสดงข้อมูล status หรืออย่างอื่นตามที่ต้องการ
    return <Tag color={color}>{status}</Tag>;
  };

  const renderStatusPay = (record) => {
    let i = 0;
    const allMatch = record.expenseList.every((expense) => expense.pay);
    let status;
    let color;
    let totalPay = 0;
    let totalWithdraw = 0;

    record.expenseList.forEach((expense) => {
      totalWithdraw += expense.withdraw;
    });

    record.expenseList.forEach((expense) => {
      totalPay += expense.pay;
    });

    if (allMatch) {
      status =
        record.pay_type_id === 1
          ? "สำเร็จ"
          : record.pay_type_id === 2 || record.pay_type_id === 3
          ? "รอการเงินตรวจสอบ"
          : record.pay_type_id === 4
          ? "รอบัญชีตรวจสอบ"
          : null;
      color =
        record.pay_type_id === 1
          ? "green"
          : record.pay_type_id === 4
          ? "blue"
          : "red";
      // console.log("ทุก pay id ตรงกัน:", status);
    } else {
      color = "red";
      // console.log("บางรายการ withdraw_process_id ไม่ตรงกัน");
      status = "กรุณาทำรายการให้ครบ"; // หรือข้อความอื่นๆ ที่คุณต้องการ
    }

    // แสดงข้อมูล status หรืออย่างอื่นตามที่ต้องการ
    return (
      <Tag
        color={status && record.pay_type_id ? color : "white"}
        style={{ textAlign: "center" }}
      >
        {record.pay_type_id ? status : null} <br />
      </Tag>
    );
  };

  const renderTotalAmountWithdraw = (record) => {
    // ตรวจสอบว่า record เป็น array หรือไม่
    if (!Array.isArray(record.expenseList)) {
      console.error("record is not an array");
      return null;
    }

    let totalWithdraw = 0;

    record.expenseList.forEach((expense) => {
      totalWithdraw += expense.withdraw;
    });

    // แสดงข้อมูล totalWithdraw
    return (
      <div>
        <p> {currencyFormatPoint(totalWithdraw)} บาท</p>
      </div>
    );
  };

  const renderTotalAmountPay = (record) => {
    // ตรวจสอบว่า record เป็น array หรือไม่
    if (!Array.isArray(record.expenseList)) {
      console.error("record is not an array");
      return null;
    }

    let totalPay = 0;

    let totalWithdraw = 0;

    record.expenseList.forEach((expense) => {
      totalWithdraw += expense.withdraw;
    });

    record.expenseList.forEach((expense) => {
      totalPay += expense.pay;
    });

    return (
      <p
        style={{
          color:
            totalPay === totalWithdraw
              ? null
              : totalPay > totalWithdraw
              ? "green"
              : "red",
        }}
      >
        {totalPay !== 0 && (
          <>
            <FontAwesomeIcon
              icon={
                totalPay < totalWithdraw
                  ? faArrowDown
                  : totalPay > totalWithdraw
                  ? faArrowUp
                  : null
              }
            />{" "}
            {currencyFormatPoint(totalPay)} บาท
          </>
        )}
        <br />
        {totalPay !== 0 && (
          <>
            {totalPay > totalWithdraw
              ? `เบิกขาด ${currencyFormatPoint(totalPay - totalWithdraw)} บาท`
              : totalPay < totalWithdraw
              ? `เบิกเกิน ${currencyFormatPoint(totalPay - totalWithdraw)} บาท`
              : null}
          </>
        )}
      </p>
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
      title: "เลขที่อ้างอิง",
      align: "center",
      render: (text, record) => (
        <p
        // onClick={() => {
        //   setIsModal(true);
        //   setDataRecord(record);
        // }}
        >
          {record.reference_no}
        </p>
      ),
    },
    {
      title: "เลขที่สัญญา",
      align: "center",
      render: (text, record) => (
        <Link
          onClick={() => {
            setIsModal(true);
            setDataRecord(record);
          }}
        >
          {renderContnoList(record)}
        </Link>
      ),
    },
    {
      title: "ขอเบิกเมื่อ",
      align: "center",
      render: (record) => (
        <>{renderDate(record.created_date, record.withdraw_process_id)}</>
      ),
    },
    {
      title: "จำนวนที่เบิก",
      align: "center",
      render: (record) => <>{renderTotalAmountWithdraw(record)}</>,
    },
    {
      title: "อนุมัติเบิกเมื่อ",
      align: "center",
      render: (record) => (
        <>{renderDate(record.withdraw_datetime, record.withdraw_process_id)}</>
      ),
    },
    {
      title: "สถานะเบิก",
      align: "center",
      render: (record) => <>{renderStatusWithdraw(record)}</>,
    },
    {
      title: "จำนวนที่เคลียร์",
      align: "center",
      render: (record) => <>{renderTotalAmountPay(record)}</>,
    },
    {
      title: "อนุมัติเคลียร์เมื่อ",
      align: "center",
      render: (record) => (
        <>{renderDate(record.pay_datetime, record.pay_type_id)}</>
      ),
    },
    {
      title: "สถานะเคลียร์ทดลอง",
      align: "center",
      render: (record) => <>{renderStatusPay(record)}</>,
    },
    {
      title: "หมายเหตุ",
      align: "center",
      render: (record) => <>{record.withdraw_mark}</>,
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
                      {record.withdraw_datetime ? (
                        <>
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
                        </>
                      ) : (
                        <>
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
                              style={{ color: "orange", fontSize: "16px" }}
                            />
                          </Button>
                        </>
                      )}
                    </p>
                  ),
                  rowExpandable: (record) =>
                    record.withdraw_process_id === STATUS_PROCESS_SUCCESSFUL &&
                    !record.pay_datetime,
                  expandedRowKeys, // เก็บ state ของ row ที่ขยาย
                  onExpand, // ฟังก์ชันที่ควบคุมการขยาย
                }}
                rowKey="key"
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {/* {isModal ? (
        <DetailWithdraw
          open={isModal}
          close={setIsModal}
          dataDefault={dataRecord}
        />
      ) : null} */}
      {isModalCreate ? (
        <ClearAdvanePayment
          open={isModalCreate}
          close={setIsModalCreate}
          dataDefault={dataModal}
          funcUpdateStatus={handleUpdateData}
        />
      ) : null}
    </>
  );
};

const CourtClearAdvanePayment = MotionHoc(Main);
export default CourtClearAdvanePayment;
