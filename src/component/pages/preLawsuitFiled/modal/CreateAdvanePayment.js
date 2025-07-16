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
  Popconfirm,
} from "antd";
import {
  baseUrl,
  HEADERS_EXPORT,
  POST_EXPENSES,
  POST_EXPENSES_REFERENCE,
  PUT_LAWSUIT_DETAIL,
} from "../../../API/apiUrls";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import EditAdvancePaymentDetail from "./EditAdvancePaymentDetail";
import {
  DELIVERY_OF_SUMMONS,
  DOCUMENT_COST,
  FEE_COURT,
  PAYADVANCE_STATUS_PROCESS,
  STAMP_COST,
  STATUS_WITHDRAW_PROCESS,
  STATUS_WITHDRAW_PROGRESS,
  STATUS_WITHDRAW_SUCCESSFUL,
} from "../../../../utils/constant/ExpenseType";
import { INDICT } from "../../../../utils/constant/StatusConstant";
import { color } from "framer-motion";

const CreateAdvanePayment = ({
  open,
  close,
  dataDefault,
  funcUpdateStatus,
  company,
}) => {
  const [form] = Form.useForm();
  const [convertDateThai] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const USER_ID = localStorage.getItem("USER_ID");
  const { TextArea } = Input;
  const [isModal, setIsModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrow, setArrow] = useState("Show");
  const [dataPropertyList, setDataPropertyList] = useState([]);
  const [editPayment, setEditPayment] = useState();
  const [totalAll, setTotalAll] = useState(0);

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      setDataPropertyList(dataDefault);
      console.log("loadData---->", dataDefault);
    }
  }, [isModal]);

  useEffect(() => {
    const total = dataPropertyList.reduce((sum, item) => {
      return (
        sum +
        (Number(item?.fee || 0) +
          Number(item?.stamp_cost || 0) +
          Number(item?.document_cost || 0) +
          Number(item?.delivery_of_summons || 0))
      );
    }, 0);

    setTotalAll(total);
  }, [dataPropertyList]);

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

  const sendData = async (setPutLawsuit, setPreExpense, setReference) => {
    setLoading(true);
    console.log("setPreExpense", setPreExpense);
    console.log("setReference", setReference);

    try {
      // ตรวจสอบข้อมูลก่อนส่ง
      const hasInvalidLawsuit = setPutLawsuit.some((item) => !item);
      const hasInvalidExpense = setPreExpense.some((item) => !item);

      if (hasInvalidLawsuit || hasInvalidExpense) {
        message.warning("พบค่าที่ไม่ถูกต้อง");
        setLoading(false);
        return;
      }

      // สร้างคำสั่ง Promise สำหรับ `setPutLawsuit`
      const promisesLawsuit = setPutLawsuit.map((item) =>
        axios.put(`${baseUrl}${PUT_LAWSUIT_DETAIL}`, item, {
          headers: HEADERS_EXPORT,
        })
      );

      // สร้างคำสั่ง Promise สำหรับ `setPreExpense`
      const promisesExpense = setPreExpense.map((item) =>
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
        ...promisesLawsuit,
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
      funcUpdateStatus([...setPutLawsuit]);
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
    console.log("item0", item, index);
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

  const onFinish = (values) => {
    console.log("values", values);
    console.log(dataPropertyList);
    let setPutLawsuit = [];
    let setPreExpense = [];
    let defindNo;
    const formatTwoDigit = (num) => (num < 10 ? "0" + num : num);
    if (company.value === 1 || company.value === 4) {
      defindNo = `${INDICT}LBN${formatTwoDigit(USER_ID)}${formatTwoDigit(
        dataPropertyList?.length
      )}-${dayjs().format("YYYYMMDDHHmmss")}`;
    } else if (company.value === 2 || company.value === 5) {
      defindNo = `${INDICT}MBN${formatTwoDigit(USER_ID)}${formatTwoDigit(
        dataPropertyList?.length
      )}-${dayjs().format("YYYYMMDDHHmmss")}`;
    } else {
      defindNo = `${INDICT}KBN${formatTwoDigit(USER_ID)}${formatTwoDigit(
        dataPropertyList?.length
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

    dataPropertyList?.forEach((lawsuit, index) => {
      setPutLawsuit.push({
        ...lawsuit,
        fee_payment_datetime: dayjs(values.dateWithdraw).format("YYYY-MM-DD"),
        fee_payment_status: STATUS_WITHDRAW_SUCCESSFUL,
      });

      if (lawsuit.fee) {
        setPreExpense.push({
          ...initDataExpense,
          LAWSUIT_ID: lawsuit.id,
          expense_type_id: FEE_COURT,
          withdraw: lawsuit.fee ? lawsuit.fee : 0,
        });
      }

      if (lawsuit?.stamp_cost) {
        setPreExpense.push({
          ...initDataExpense,
          LAWSUIT_ID: lawsuit.id,
          expense_type_id: STAMP_COST,
          withdraw: lawsuit.stamp_cost ? lawsuit.stamp_cost : 0,
        });
      }

      if (lawsuit?.document_cost) {
        setPreExpense.push({
          ...initDataExpense,
          LAWSUIT_ID: lawsuit.id,
          expense_type_id: DOCUMENT_COST,
          withdraw: lawsuit.document_cost ? lawsuit.document_cost : 0,
        });
      }

      if (lawsuit?.delivery_of_summons) {
        setPreExpense.push({
          ...initDataExpense,
          LAWSUIT_ID: lawsuit.id,
          expense_type_id: DELIVERY_OF_SUMMONS,
          withdraw: lawsuit.delivery_of_summons
            ? lawsuit.delivery_of_summons
            : 0,
        });
      }
    });

    // const totalWithdraw = setPreExpense.reduce((sum, item) => {
    //   return sum + Number(item.withdraw || 0);
    // }, 0);

    console.log("putLawsuit---->", setPutLawsuit);
    console.log("setDataExpense---->", setPreExpense);
    console.log("dataReference", dataReference);

    sendData(setPutLawsuit, setPreExpense, dataReference);
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
        if (item.CONTNO === data.CONTNO) {
          return { ...data };
        } else {
          return { ...item };
        }
      });
      console.log(result);

      setDataPropertyList(result);
    }
  };

  const confirm = () => {
    form.submit(); // ส่งฟอร์มเมื่อกด "ยืนยัน"
  };

  const cancel = () => {
    message.success("ยกเลิกทำรายการ");
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
          dateWithdraw: dayjs(),
        }}
      >
        <Form.Item
          label="วันที่ทำรายการ"
          name="dateWithdraw"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกวันที่สืบทรัพย์",
            },
          ]}
        >
          <DatePicker onChange={onChangeInputInvestigateDate} />
        </Form.Item>
        <>
          <Form.Item
            label="สัญญาที่ต้องการเบิก"
            name="contnoWithdraw"
            labelCol={{ span: 6 }} // กำหนดความกว้างของ label
            wrapperCol={{ span: 14 }} // กำหนดความกว้างของ input หรือ content
          >
            <List
              itemLayout="horizontal"
              dataSource={dataPropertyList}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Link
                      key="list-loadmore-edit"
                      onClick={() => handleEdit(item, index)}
                    >
                      แก้ไข
                    </Link>,
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
                      <Link onClick={() => handleEdit(item, index)}>
                        {`(${index + 1}). `}
                        {item?.CONTNO}
                        {` ${item?.customer_title}${item?.customer_name} ${
                          item?.customer_lastname ? item?.customer_lastname : ""
                        }`}
                      </Link>
                    }
                    description={
                      <>
                        <p>
                          ค่าธรรมเนียมศาล {currencyFormatPoint(item?.fee)} บาท
                        </p>
                        <p>
                          ค่าอากรณ์สแตมป์{" "}
                          {currencyFormatPoint(item?.stamp_cost)} บาท
                        </p>
                        <p>
                          ค่าส่งหมาย{" "}
                          {currencyFormatPoint(item?.delivery_of_summons)} บาท
                        </p>
                        <p>
                          ค่าจัดทำเอกสาร{" "}
                          {currencyFormatPoint(item?.document_cost)} บาท
                        </p>

                        <p>
                          รวม{" "}
                          {currencyFormatPoint(
                            item?.fee +
                              item?.stamp_cost +
                              item?.document_cost +
                              item?.delivery_of_summons
                          )}{" "}
                          บาท
                        </p>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Form.Item>
        </>
        <Form.Item label="ยอดเบิกทั้งสิ้น" name="totalAll">
          <p style={{ color: totalAll > 50000 ? "red" : "green" }}>
            {currencyFormatPoint(totalAll)} {" บาท"}
          </p>
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
          <Popconfirm
            placement="topLeft"
            title="บันทึกการเบิกทดรองคำฟ้อง"
            description={
              totalAll > 50000
                ? `มียอดเบิกเกินกำหนด จำนวน ${currencyFormatPoint(
                    totalAll - 50000
                  )} บาท ท่านต้องการจะยืนยันการทำรายการหรือไม่ ?`
                : `ยอดเบิกทั้งสิ้น ${currencyFormatPoint(totalAll)} ยืนยัน ?`
            }
            onConfirm={confirm}
            onCancel={() => cancel()}
            okText="ยืนยัน"
            cancelText="ปิด"
          >
            <Button style={{ color: "green" }}>บันทึก</Button>
          </Popconfirm>
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
          <EditAdvancePaymentDetail
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
