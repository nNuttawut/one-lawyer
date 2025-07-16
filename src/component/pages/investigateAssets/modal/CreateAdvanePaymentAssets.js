import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Modal, Card, message, Spin, List } from "antd";
import {
  baseUrl,
  HEADERS_EXPORT,
  POST_EXPENSES,
  POST_EXPENSES_REFERENCE,
} from "../../../API/apiUrls";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
// import EditAdvancePaymentDetail from "./EditAdvancePaymentDetail";
import {
  PAYADVANCE_STATUS_PROCESS,
  STATUS_WITHDRAW_PROCESS,
} from "../../../../utils/constant/ExpenseType";
import { optionsLone } from "../../../../utils/constant/LoanTypeConstant";
import ExpenseList from "./ExpenseList";
import {
  ENFORCEMENT,
  INVESTIGATE,
  JUDGEMENT,
} from "../../../../utils/constant/StatusConstant";

const CreateAdvanePayment = ({
  open,
  close,
  dataDefault,
  funcUpdateStatus,
  company,
}) => {
  const USER_ID = localStorage.getItem("USER_ID");
  const [form] = Form.useForm();
  const [convertDateThai] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const { TextArea } = Input;
  const [isModal, setIsModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrow, setArrow] = useState("Show");
  const [dataPropertyList, setDataPropertyList] = useState([]);
  const [editPayment, setEditPayment] = useState();
  const [dataExpense, setDataExpense] = useState([]);

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      setDataPropertyList(dataDefault);
      console.log("loadData---->", dataDefault);
    }
  }, [isModal]);

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
  }, []);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const sendData = async (setPreExpenseSend, setReference) => {
    setLoading(true);

    try {
      const hasInvalidExpense = setPreExpenseSend.some((item) => !item);

      if (hasInvalidExpense) {
        message.warning("พบค่าที่ไม่ถูกต้อง");
        setLoading(false);
        return;
      }

      // สร้างคำสั่ง Promise สำหรับ `setPreExpenseSend`
      const promisesExpense = setPreExpenseSend.map((item) =>
        axios.post(`${baseUrl}${POST_EXPENSES}`, item, {
          headers: HEADERS_EXPORT,
        })
      );

      const promissReference = axios.post(
        `${baseUrl}${POST_EXPENSES_REFERENCE}`,
        setReference,
        {
          headers: HEADERS_EXPORT,
        }
      );

      // รวม Promise ทั้งหมด
      const allPromises = [...promisesExpense, promissReference];

      // รอให้ทุกคำสั่งสำเร็จ
      const results = await Promise.all(allPromises);

      // จัดการผลลัพธ์
      const allSuccessful = results.every(
        (res) => res.status === 200 || res.status === 201
      );

      if (allSuccessful) {
        console.log("อัพเดทข้อมูลสำเร็จทั้งหมด");
        message.success("อัพเดทข้อมูลสำเร็จทั้งหมด");
      } else {
        console.error("มีข้อมูลบางรายการที่อัพเดทไม่สำเร็จ");
        message.error("มีข้อมูลบางรายการที่อัพเดทไม่สำเร็จ");
      }
      // หากสำเร็จทั้งหมดให้ปรับสถานะ
      // funcUpdateStatus([...setPutJudgement]);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleEdit = (item, index) => {
    console.log("item", item, index);
    setEditPayment(dataPropertyList[index]);
    setIsEditModal(true);
  };

  const handleDelete = (index) => {
    Modal.confirm({
      title: "ต้องการลบสัญญานี้ใช่หรือไม่​?",
      okText: "ยืนยัน",
      cancelText: "ปิด",
      onOk: () => {
        console.log("delete--->", index);
        setDataPropertyList((prevData) =>
          prevData.filter((_, i) => i !== index)
        );
      },
    });
  };
  console.log("prop--->", dataPropertyList);
  console.log("company,", company);

  const onFinish = (values) => {
    console.log("values", values);
    console.log(dataPropertyList);

    let setPreExpenseSend = [];

    let defindNo;
    const formatTwoDigit = (num) => (num < 10 ? "0" + num : num);
    if (company.value === 1 || company.value === 4) {
      defindNo = `${INVESTIGATE}LBN${formatTwoDigit(USER_ID)}${formatTwoDigit(
        dataDefault.length
      )}-${dayjs().format("YYYYMMDDHHmmss")}`;
    } else if (company.value === 2 || company.value === 5) {
      defindNo = `${INVESTIGATE}MBN${formatTwoDigit(USER_ID)}${formatTwoDigit(
        dataDefault.length
      )}-${dayjs().format("YYYYMMDDHHmmss")}`;
    } else {
      defindNo = `${INVESTIGATE}KBN${formatTwoDigit(USER_ID)}${formatTwoDigit(
        dataDefault.length
      )}-${dayjs().format("YYYYMMDDHHmmss")}`;
    }

    const dataReference = {
      reference_no: defindNo,
      user_id: USER_ID,
      pay_status_id: PAYADVANCE_STATUS_PROCESS,
    };

    const initDataExpense = {
      withdraw_process_id: STATUS_WITHDRAW_PROCESS,
      withdraw_datetime: null,
      withdraw_mark: values.memo,
      pay_type_id: null,
      pay_datetime: null,
      pay_mark: null,
      file_path: null,
      reference_no: defindNo,
    };

    try {
      dataPropertyList?.forEach((expense) => {
        // ดันข้อมูลรายการย่อยทั้งหมดเข้า setPreExpenseSend
        expense?.setPreExpense.forEach((value) => {
          setPreExpenseSend.push({
            ...initDataExpense,
            ...value,
          });
        });
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error.message);
      message.error("กรุณาทำรายการเบิกให้ถูกต้อง");
    }

    console.log("setDataExpense---->", setPreExpenseSend);
    console.log("dataReference---->", dataReference);

    sendData(setPreExpenseSend, dataReference);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputInvestigateDate = (date, dateSting) => {
    console.log(date);
    console.log(dateSting);
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const handleUpdateDataEdit = (data) => {
    console.log("data---->update", data);
    if (data) {
      const result = dataPropertyList.map((item) => {
        if (item.id === data.id) {
          return { ...data };
        } else {
          return { ...item };
        }
      });
      console.log(result);

      setDataPropertyList(result);
    }
  };

  const renderLoanType = (value) => {
    return (
      optionsLone.find((item) => item.value === value)?.label ||
      "ไม่พบประเภทสัญญา"
    );
  };

  const formDataSet = () => {
    return (
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          memo: null,
        }}
      >
        <Form.Item label="วันที่ทำรายการ" name="dateWithdraw">
          {convertDateThai()}
          {/* <DatePicker onChange={onChangeInputInvestigateDate} /> */}
        </Form.Item>

        <Form.Item
          label="รายการที่เบิก"
          name="contnoWithdraw"
          labelCol={{ span: 6 }} // กำหนดความกว้างของ label
          wrapperCol={{ span: 16 }} // กำหนดความกว้างของ input หรือ content
        >
          <List
            itemLayout="horizontal"
            dataSource={dataPropertyList}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  !item?.setPreExpense ? (
                    <Link
                      key="list-loadmore-edit"
                      onClick={() => handleEdit(item, index)}
                    >
                      เพิ่ม
                    </Link>
                  ) : (
                    <Link
                      key="list-loadmore-edit"
                      style={{ color: "orange" }}
                      onClick={() => handleEdit(item, index)}
                    >
                      แก้ไข
                    </Link>
                  ),
                  <Link
                    key="list-loadmore-more"
                    style={{ color: "red" }}
                    onClick={() => handleDelete(index)} // ส่ง index เข้าไปในฟังก์ชัน
                  >
                    ลบ
                  </Link>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <>
                      <p>
                        {item.CONTNO} {item.CUSTOMER_TNAME}
                        {item.CUSTOMER_FNAME} {item.CUSTOMER_LNAME}
                        {item.mark}
                      </p>
                      {/* <p style={{ color: "orange" }}>
                        เลขโฉนด {item.deed_number} {item.dist_desc} จังหวัด
                        {item.prov_desc}
                      </p> */}
                    </>
                  }
                  description={
                    <div style={{ color: "blue" }}>
                      {item?.setPreExpense?.map((expense, index) => (
                        <div key={index}>
                          - {expense.label} :{" "}
                          {currencyFormatPoint(expense.withdraw)} บาท
                        </div>
                      ))}

                      {/* รวมยอดทั้งหมด */}
                      <div
                        style={{
                          marginTop: 8,
                          fontWeight: "bold",
                          color: "green",
                        }}
                      >
                        รวมทั้งหมด :{" "}
                        {currencyFormatPoint(
                          item?.setPreExpense?.reduce(
                            (total, expense) =>
                              total + Number(expense.withdraw || 0),
                            0
                          )
                        )}{" "}
                        บาท
                      </div>
                    </div>
                  }
                />

                {/* <div>
                    {" "}
                    {item?.initDataExpense?.withdraw ? "ก่อนฟ้อง" : null}
                  </div> */}
              </List.Item>
            )}
          />
        </Form.Item>

        <Form.Item label="หมายเหตุ" name="memo">
          <TextArea
            rows={5}
            onChange={(e) => onChangeInputMemo(e.target.value)}
          />
        </Form.Item>
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={handleCancel}
            style={{ color: "red", marginRight: "20px" }}
          >
            ปิด
          </Button>

          <Button style={{ color: "green" }} htmlType="submit">
            บันทึก
          </Button>
        </div>
      </Form>
    );
  };

  return (
    <>
      <Modal
        title={`สร้างรายการเบิกเงินทดรองจ่าย`}
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>{formDataSet()}</Card>
        </Spin>
        {isEditModal ? (
          <ExpenseList
            open={isEditModal}
            close={setIsEditModal}
            dataDefault={editPayment}
            handleEdit={handleUpdateDataEdit}
          />
        ) : null}
      </Modal>
    </>
  );
};
export default CreateAdvanePayment;
