import React, { useState, useEffect } from "react";
import { Button, Modal, List, Row, Col, Tag, Table } from "antd";
import {
  MailOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import {
  STATUS_PROCESS_PROCESS,
  STATUS_PROCESS_SUCCESSFUL,
  STATUS_PROCESS_UNSUCCESSFUL,
} from "../../../../utils/constant/StatusConstant";
import dayjs from "dayjs";

const DataCheck = ({ open, close, data, status }) => {
  const [dataArr, setDataArr] = useState([]);
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    if (data) {
      loadData();
    }
    console.log("dataFailed1111", data);
    console.log("status", status);
  }, []);

  const loadData = () => {
    if (status === "all") {
      setDataArr(data.item);
    } else if (status === 1) {
      setDataArr(data.clearSuccessData);
    } else if (status === 2) {
      setDataArr(data.clearUnSuccessData);
    } else {
      setDataArr(data.clearUnSuccessOverSevenDayData);
    }
  };

  const handleCancel = () => {
    close(false);
  };

  const tagStyle = {
    fontSize: "16px",
    padding: "10px 16px",
    borderRadius: "10px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "bold",
  };

  const renderContnoList = (record) => {
    return record.contnoList.map((contno, index) => (
      <React.Fragment key={index}>
        {contno}
        <br />
      </React.Fragment>
    ));
  };

  const renderDate = (record, data) => {
    //ส่งค่า null ออกไปถ้า record นี่ยังไม่มี
    if (!record) {
      return null;
    }
    let color;
    const recordDate = dayjs(record);
    const recordDateCal = dayjs(record).startOf("day");
    const today = dayjs().startOf("day");

    // คำนวณความแตกต่างในหน่วยปี
    const yearsDifference = today.diff(recordDateCal, "year");

    // คำนวณความแตกต่างในหน่วยเดือน
    const monthsDifference = today.diff(recordDateCal, "month");

    // คำนวณความแตกต่างในหน่วยวัน
    const daysDifference = today.diff(recordDateCal, "day");

    // คำนวณส่วนที่เหลือหลังจากคำนวณปีแล้ว (คำนวณเดือนที่เหลือ)
    const remainingMonths = today.subtract(yearsDifference, "year");

    // คำนวณส่วนที่เหลือหลังจากคำนวณปีและเดือนแล้ว (คำนวณวันที่เหลือ)
    const remainingDays = today.diff(recordDateCal, "day");

    // color = remainingDays > 7 ? "red" : "green";

    color = remainingDays > 7 ? "red" : "blue";

    const formattedDate = record ? convertDateThaiShort(recordDate) : null;
    return (
      <Tag color={color} key={daysDifference} style={{ textAlign: "center" }}>
        {formattedDate}
        <br />
        {status === 3 || status === 2 ? (
          <>
            {remainingDays > 7 ? "นาน" : null} {remainingDays} วัน
          </>
        ) : null}
      </Tag>
    );
  };

  const renderStatus = (record) => {
    if (!Array.isArray(record.expenseList)) {
      console.error("record is not an array");
      return null;
    }

    if (!record.pay_type_id) {
      return null;
    }

    let totalPay = 0;
    let totalWithdraw = 0;

    record.expenseList.forEach((expense) => {
      totalPay += expense.pay;
    });

    record.expenseList.forEach((expense) => {
      totalWithdraw += expense.withdraw;
    });
    let status =
      record.pay_type_id === 1
        ? "ตรวจสอบแล้ว"
        : totalPay === totalWithdraw
        ? "ยอดตรง"
        : totalPay > totalWithdraw
        ? "โอนคืนทนาย"
        : totalPay < totalWithdraw
        ? "โอนคืนการเงิน"
        : null;
    let color =
      record.pay_type_id === 1
        ? "green"
        : totalPay === totalWithdraw
        ? "green"
        : totalPay > totalWithdraw
        ? "blue"
        : totalPay < totalWithdraw
        ? "red"
        : null;
    // แสดงข้อมูล totalWithdraw
    return <Tag color={color}>{status}</Tag>;
  };

  const renderTotalAmount = (record) => {
    // ตรวจสอบว่า record เป็น array หรือไม่
    if (!Array.isArray(record.expenseList)) {
      console.error("record is not an array");
      return null;
    }

    let totalWithdraw = 0;

    record.expenseList.forEach((expense) => {
      totalWithdraw += expense.withdraw;
    });

    let totalPay = 0;

    record.expenseList.forEach((expense) => {
      totalPay += expense.pay;
    });

    let color =
      totalPay === totalWithdraw
        ? "green"
        : totalPay > totalWithdraw
        ? "orange"
        : totalPay < totalWithdraw
        ? "red"
        : null;

    // แสดงข้อมูล totalWithdraw
    return (
      <div>
        <p style={{ fontWeight: "bold" }}>
          {" "}
          {currencyFormatPoint(totalWithdraw)} บาท
        </p>
      </div>
    );
  };

  const renderTotalAmountPay = (record) => {
    // ตรวจสอบว่า record เป็น array หรือไม่
    if (!Array.isArray(record.expenseList)) {
      console.error("record is not an array");
      return null;
    }

    let totalWithdraw = 0;

    record.expenseList.forEach((expense) => {
      totalWithdraw += expense.withdraw;
    });

    let totalPay = 0;

    record.expenseList.forEach((expense) => {
      totalPay += expense.pay;
    });

    let color =
      totalPay === totalWithdraw
        ? "green"
        : totalPay > totalWithdraw
        ? "orange"
        : totalPay < totalWithdraw
        ? "red"
        : null;
    // แสดงข้อมูล totalWithdraw
    return (
      <div>
        <p style={{ fontWeight: "bold" }}>
          {" "}
          {currencyFormatPoint(totalPay)} บาท
        </p>
      </div>
    );
  };

  const renderTotalAmountCal = (record) => {
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
              ? "blue"
              : "red",
        }}
      >
        {totalPay !== 0 && (
          <>
            {totalPay > totalWithdraw
              ? ` เบิกขาด    ${currencyFormatPoint(
                  totalWithdraw - totalPay
                )} บาท`
              : totalPay < totalWithdraw
              ? `เบิกเกิน ${currencyFormatPoint(totalWithdraw - totalPay)} บาท`
              : " 0 บาท"}
          </>
        )}
      </p>
    );
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

  const renderDataDetail = (record) => {
    if (Array.isArray(record.contnoList)) {
      // ✅ จัดกลุ่ม expenses ตาม CONTNO
      const groupedExpenses = record.expenseList.reduce((acc, expense) => {
        const { CONTNO } = expense;
        if (!acc[CONTNO]) {
          acc[CONTNO] = [];
        }
        acc[CONTNO].push(expense);
        return acc;
      }, {});

      // ✅ แปลง Object เป็น Array
      const expenseArray = Object.keys(groupedExpenses).map((contno) => ({
        CONTNO: contno,
        expenses: groupedExpenses[contno],
      }));

      console.log("expenseArray-----?", expenseArray);

      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          {expenseArray.map((data, index) => {
            const totalWithdraw = data.expenses.reduce(
              (sum, expense) => sum + (expense.withdraw || 0),
              0
            );
            const totalPay = data.expenses.reduce(
              (sum, expense) => sum + (expense.pay || 0),
              0
            );

            return (
              <div
                key={index}
                style={{
                  flex: "1 1 calc(30% - 20px)", // แสดงข้อมูลเป็น 3 คอลัมน์ (ปรับได้ตามหน้าจอ)
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    color: "#027a3a",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {`เลขสัญญา: ${data.CONTNO}`}
                </h3>
                <div style={{ marginTop: "10px" }}>
                  {data.expenses
                    .sort((a, b) => a.expense_type_id - b.expense_type_id)
                    .map((expense, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                          padding: "10px",
                          backgroundColor: "#f8f8f8",
                          borderRadius: "8px",
                        }}
                      >
                        <div style={{ color: "#333", fontSize: "14px" }}>
                          {expense.expense_description}:
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ color: "#1a73e8", fontSize: "14px" }}>
                            {`เบิก: ${expense.withdraw || 0}`}
                          </p>
                          <p style={{ color: "#e53935", fontSize: "14px" }}>
                            {`จ่ายจริง: ${expense.pay || 0}`}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                <div
                  style={{
                    marginTop: "20px",
                    borderTop: "1px solid #ddd",
                    paddingTop: "10px",
                    textAlign: "right",
                  }}
                >
                  <p
                    style={{
                      color: "#1a73e8",
                      fontSize: "16px",
                    }}
                  >
                    {`รวมเบิกทั้งหมด: ${currencyFormatPoint(
                      totalWithdraw
                    )} บาท`}
                  </p>
                  <p
                    style={{
                      color: "#e53935",
                      fontSize: "16px",
                    }}
                  >
                    {`รวมจ่ายจริงทั้งหมด: ${currencyFormatPoint(totalPay)} บาท`}
                  </p>
                  <p
                    style={{
                      color: "green",
                      fontSize: "16px",
                    }}
                  >
                    {`ผลลัพธ์: ${currencyFormatPoint(
                      totalPay - totalWithdraw
                    )} บาท`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      console.error("record is not an array");
      return null;
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
      // sorter: {
      //   compare: (a, b) => a.key - b.key,
      //   multiple: 5,
      // },
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
        <p
        // onClick={() => {
        //   setIsModal(true);
        //   setDataRecord(record);
        // }}
        >
          {renderContnoList(record)}
        </p>
      ),
    },
    {
      title: "จำนวนที่เบิก",
      align: "center",
      render: (record) => <>{renderTotalAmount(record)}</>,
    },
    {
      title: "จำนวนที่เคลียร์",
      align: "center",
      render: (record) => <>{renderTotalAmountPay(record)}</>,
    },
    {
      title: "ส่วนต่าง",
      align: "center",
      render: (record) => <>{renderTotalAmountCal(record)}</>,
    },
    {
      title: "วันที่เบิก",
      align: "center",
      render: (record) => (
        <>
          {record.withdraw_datetime
            ? renderDate(record.withdraw_datetime)
            : null}
        </>
      ),
    },
    {
      title: "วันที่ตรวจสอบ",
      align: "center",
      render: (record) => (
        <>{record.pay_type_id === 1 ? renderDate(record.updated_date) : null}</>
      ),
    },
    {
      title: "ผู้เบิก",
      align: "center",
      render: (record) => (
        <Tag color={"red"} style={{ textAlign: "center" }}>
          {record.lawyerName}
        </Tag>
      ),
    },

    {
      title: "หมายเหตุ",
      align: "center",
      render: (record) => (
        <p color="black" style={{ fontSize: "13px" }}>
          {record.pay_mark}
        </p>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={`รายละเอียด ${
          status === "all"
            ? "ทั้งหมด"
            : status === 1
            ? "เคลียร์สำเร็จ"
            : status === 2
            ? "รอดำเนินการ"
            : "เกินกำหนดเคลียร์"
        }`}
        open={open}
        width={"80%"}
        onCancel={handleCancel}
        footer={[
          <Button style={{ color: "red" }} onClick={handleCancel}>
            ปิด
          </Button>,
        ]}
      >
        <Table
          size="small"
          columns={columns}
          dataSource={dataArr}
          scroll={{ x: 850 }}
          footer={() => (
            <>
              <p>จำนวนสัญญาทั้งหมด {dataArr?.length || 0}</p>
            </>
          )}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>{renderDataDetail(record)}</p>
            ),
            rowExpandable: (record) => record,
            expandedRowKeys, // เก็บ state ของ row ที่ขยาย
            onExpand, // ฟังก์ชันที่ควบคุมการขยาย
          }}
        />
      </Modal>
    </>
  );
};
export default DataCheck;
