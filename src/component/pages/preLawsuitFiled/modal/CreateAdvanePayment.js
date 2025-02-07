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
  STAMP_COST,
  STATUS_WITHDRAW_PROCESS,
  STATUS_WITHDRAW_SUCCESSFUL,
} from "../../../../utils/constant/ExpenseType";

const CreateAdvanePayment = ({
  open,
  close,
  dataDefault,
  funcUpdateStatus,
}) => {
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

  const sendData = async (setPutLawsuit, setPreExpense) => {
    setLoading(true);

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

      // รวม Promise ทั้งหมด
      const allPromises = [...promisesLawsuit, ...promisesExpense];

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
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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

    const initDataExpense = {
      withdraw_process_id: STATUS_WITHDRAW_PROCESS,
      withdraw_datetime: null,
      withdraw_mark: values.memo,
      pay_type_id: null,
      pay_datetime: null,
      pay_mark: null,
      file_path: null,
      reference_no: "BN" + dayjs().format("YYYYMMDDHHmmss"),
    };

    dataPropertyList?.forEach((lawsuit, index) => {
      setPutLawsuit.push({
        ...lawsuit,
        fee_payment_datetime: dayjs(values.dateWithdraw).format("YYYY-MM-DD"),
        fee_payment_status: STATUS_WITHDRAW_SUCCESSFUL,
      });

      setPreExpense.push({
        ...initDataExpense,
        LAWSUIT_ID: lawsuit.id,
        expense_type_id: FEE_COURT,
        withdraw: lawsuit.fee ? lawsuit.fee : 0,
      });

      setPreExpense.push({
        ...initDataExpense,
        LAWSUIT_ID: lawsuit.id,
        expense_type_id: STAMP_COST,
        withdraw: lawsuit.stamp_cost ? lawsuit.stamp_cost : 0,
      });

      setPreExpense.push({
        ...initDataExpense,
        LAWSUIT_ID: lawsuit.id,
        expense_type_id: DOCUMENT_COST,
        withdraw: lawsuit.document_cost ? lawsuit.document_cost : 0,
      });

      setPreExpense.push({
        ...initDataExpense,
        LAWSUIT_ID: lawsuit.id,
        expense_type_id: DELIVERY_OF_SUMMONS,
        withdraw: lawsuit.delivery_of_summons ? lawsuit.delivery_of_summons : 0,
      });
    });

    console.log("putLawsuit---->", setPutLawsuit);
    console.log("setDataExpense---->", setPreExpense);
    sendData(setPutLawsuit, setPreExpense);
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
          label="วันที่ขอเบิก"
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
                        {item.CONTNO}
                        {` ${item.customer_title}${item.customer_name} ${item.customer_lastname}`}
                      </Link>
                    }
                    description={
                      <>
                        <p>
                          ค่าธรรมเนียมศาล {currencyFormatPoint(item.fee)} บาท
                        </p>
                        <p>
                          ค่าอากรณ์สแตมป์ {currencyFormatPoint(item.stamp_cost)}{" "}
                          บาท
                        </p>
                        <p>
                          ค่าจัดทำเอกสาร{" "}
                          {currencyFormatPoint(item.document_cost)} บาท
                        </p>
                        <p>
                          ค่าส่งจดหมาย{" "}
                          {currencyFormatPoint(item.delivery_of_summons)} บาท
                        </p>
                        <p>
                          รวม{" "}
                          {currencyFormatPoint(
                            item.fee +
                              item.stamp_cost +
                              item.document_cost +
                              item.delivery_of_summons
                          )}{" "}
                          บาท
                        </p>
                      </>
                    }
                  />
                  <div>
                    {" "}
                    {item.investigation_type_id === 1
                      ? "ก่อนฟ้อง"
                      : item.investigation_type_id === 2
                      ? "หลังฟ้อง"
                      : null}
                  </div>
                </List.Item>
              )}
            />
          </Form.Item>
        </>

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
