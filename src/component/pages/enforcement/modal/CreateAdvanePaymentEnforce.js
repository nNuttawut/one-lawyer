import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Card,
  message,
  Spin,
  List,
} from "antd";
import {
  baseUrl,
  HEADERS_EXPORT,
  POST_EXPENSES,
  POST_EXPENSES_REFERENCE,
  PUT_INVESTIGATE_ITEM_BY_ID,
  PUT_JUDGE,
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
  STATUS_PROCESS_SUCCESSFUL,
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

  const sendData = async (
    setPutInvestigateSeize,
    setPreExpenseSend,
    setReference
  ) => {
    setLoading(true);

    try {
      // ตรวจสอบข้อมูลก่อนส่ง
      const hasInvalidInvestigateSeize = setPutInvestigateSeize.some(
        (item) => !item
      );
      const hasInvalidExpense = setPreExpenseSend.some((item) => !item);

      if (hasInvalidInvestigateSeize || hasInvalidExpense) {
        message.warning("พบค่าที่ไม่ถูกต้อง");
        setLoading(false);
        return;
      }

      // สร้างคำสั่ง Promise สำหรับ `setPutJudgement`
      const promisesInvestigateSeize = setPutInvestigateSeize.map((item) =>
        axios.put(`${baseUrl}${PUT_INVESTIGATE_ITEM_BY_ID}`, item, {
          headers: HEADERS_EXPORT,
        })
      );

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
      const allPromises = [
        ...promisesInvestigateSeize,
        ...promisesExpense,
        promissReference,
      ];

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
      funcUpdateStatus([...setPutInvestigateSeize, company]);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    }
  };

  const handleEdit = (item, index) => {
    setEditPayment(dataExpense);
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

  const handleDeleteExpense = (index) => {
    Modal.confirm({
      title: "ต้องการลบรายการเบิกนี้ใช่หรือไม่​?",
      okText: "ยืนยัน",
      cancelText: "ปิด",
      onOk: () => {
        console.log("delete--->", index);
        setDataExpense((prevData) => prevData.filter((_, i) => i !== index));
      },
    });
  };

  const onFinish = (values) => {
    console.log("values", values);
    console.log(dataPropertyList);
    let setPutInvestigateSeize = [];
    let setPreExpenseSend = [];

    let defindNo;
    const formatTwoDigit = (num) => (num < 10 ? "0" + num : num);
    if (company.value === 1 || company.value === 4) {
      defindNo = `${ENFORCEMENT}LBN${formatTwoDigit(USER_ID)}${formatTwoDigit(
        dataDefault.length
      )}-${dayjs().format("YYYYMMDDHHmmss")}`;
    } else if (company.value === 2 || company.value === 5) {
      defindNo = `${ENFORCEMENT}MBN${formatTwoDigit(USER_ID)}${formatTwoDigit(
        dataDefault.length
      )}-${dayjs().format("YYYYMMDDHHmmss")}`;
    } else {
      defindNo = `${ENFORCEMENT}KBN${formatTwoDigit(USER_ID)}${formatTwoDigit(
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
      dataExpense?.forEach((expense) => {
        // ดันข้อมูลรายการย่อยทั้งหมดเข้า setPreExpenseSend

        const idInvestigate = dataDefault.map((item) => ({
          INVESTIGATE_PROPERTY_ID: item.id,
        }));

        setPreExpenseSend.push({
          ...initDataExpense,
          ...expense,
          investigate_list: idInvestigate,
        });

        console.log(expense);
      });

      dataDefault?.forEach((item) => {
        // ดันข้อมูลรายการย่อยทั้งหมดเข้า setPreExpenseSend

        setPutInvestigateSeize.push({
          ...item,
          seize_status: STATUS_PROCESS_SUCCESSFUL,
        });
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error.message);
      message.error("กรุณาทำรายการเบิกให้ถูกต้อง");
    }

    console.log("setPutInvestigate", setPutInvestigateSeize);
    console.log("setDataExpense---->", setPreExpenseSend);
    sendData(setPutInvestigateSeize, setPreExpenseSend, dataReference);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const handleUpdateDataEdit = (data) => {
    if (!data) return;

    setDataExpense((prev) => {
      // ดูว่าเจอ index ของ item ที่ต้องการจะอัปเดตหรือยัง
      const idx = prev.findIndex(
        (item) => item.expense_type_id === data.expense_type_id
      );

      if (idx > -1) {
        // ถ้าเจอแล้ว ให้ map ไปอัปเดตตัวนั้น
        return prev.map((item) =>
          item.expense_type_id === data.expense_type_id
            ? { ...item, ...data }
            : item
        );
      } else {
        // ยังไม่เจอ → push ตัวใหม่เข้าไป
        return [...prev, data];
      }
    });
  };

  const renderLoanType = (value) => {
    return (
      optionsLone.find((item) => item.value === value)?.label ||
      "ไม่พบประเภทสัญญา"
    );
  };

  console.log("dataExpense", dataExpense);

  console.log("prop--->", dataPropertyList);
  console.log("company,", company);

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
        </Form.Item>
        <Form.Item label="กรมบังคับคดี" name="dateWithdraw">
          {dataPropertyList[0]?.legal_execution_office}
        </Form.Item>
        <Form.Item
          label="แปลงที่เบิก"
          name="contnoWithdraw"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <List
            itemLayout="horizontal"
            dataSource={dataPropertyList}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Link
                    key="list-loadmore-more"
                    style={{ color: "red" }}
                    onClick={() => handleDelete(index)}
                  >
                    ลบ
                  </Link>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <>
                      <p>
                        {item.CONTNO} {item.possessor}
                        {item.mark}
                      </p>
                      <p style={{ color: "orange" }}>
                        เลขโฉนด {item.deed_number} {item.dist_desc} จังหวัด
                        {item.prov_desc}
                      </p>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </Form.Item>

        <Form.Item
          label="รายการที่ขอเบิก"
          name="contnoWithdraw"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          {!dataExpense?.length ? (
            <>
              <Button onClick={handleEdit} style={{ color: "blue" }}>
                เพิ่ม ➕
              </Button>
            </>
          ) : (
            <>
              <List
                itemLayout="horizontal"
                dataSource={dataExpense}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <Link
                        key="list-loadmore-edit"
                        style={{ color: "orange" }}
                        onClick={() => handleEdit(item, index)}
                      >
                        แก้ไข
                      </Link>,

                      <Link
                        key="list-loadmore-more"
                        style={{ color: "red" }}
                        onClick={() => handleDeleteExpense(index)}
                      >
                        ลบ
                      </Link>,
                    ]}
                  >
                    <List.Item.Meta
                      description={
                        <>
                          <div style={{ color: "blue" }}>
                            <div key={index}>
                              - {item.label} :{" "}
                              {currencyFormatPoint(item.withdraw)} บาท
                            </div>
                          </div>

                          {index === dataExpense.length - 1 && (
                            <div
                              style={{
                                marginTop: 8,
                                fontWeight: "bold",
                                color: "green",
                              }}
                            >
                              รวมทั้งหมด :{" "}
                              {currencyFormatPoint(
                                dataExpense?.reduce(
                                  (total, expense) =>
                                    total + Number(expense.withdraw || 0),
                                  0
                                )
                              )}{" "}
                              บาท
                            </div>
                          )}
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          )}
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
            dataDefault={dataPropertyList}
            handleEdit={handleUpdateDataEdit}
            editData={editPayment}
          />
        ) : null}
      </Modal>
    </>
  );
};
export default CreateAdvanePayment;
