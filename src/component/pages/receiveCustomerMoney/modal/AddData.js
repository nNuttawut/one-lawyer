import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Card,
  message,
  Spin,
  InputNumber,
  Select,
  Popconfirm,
  Image,
} from "antd";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_LOAN,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  POST_RECEIVE_PAYMENT,
  PUT_LAWSUIT_DETAIL,
  PUT_STATUS,
} from "../../../API/apiUrls";
import axios from "axios";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import DateCustom from "../../../../hook/DateCustom";
import TextArea from "antd/es/input/TextArea";
import Dragger from "antd/es/upload/Dragger";
import DateInput from "../../../../hook/DateInput";
import LoadLawyers from "../../../../hook/LoadLawyers";

const AddData = ({ open, close, funcUpdateStatus, data }) => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const COMPANY = parseInt(localStorage.getItem("COMPANY_ID"));
  const USER_ID = parseInt(localStorage.getItem("USER_ID"));
  const [form] = Form.useForm();
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [loading, setLoading] = useState();
  const [isModal, setIsModal] = useState(false);
  const [assistantOption, setAssistantOption] = useState();

  const optionsType = [
    { label: "บอกเลิกสัญญา/โนติส", value: "บอกเลิกสัญญา/โนติส" },
    { label: "ระหว่างส่งฟ้อง", value: "ระหว่างฟ้อง" },
    { label: "พิพากษา", value: "พิพากษา" },
    { label: "บังคับคดี(ยึดทรัพย์)", value: "บังคับคดี" },
    { label: "ประกาศขาย", value: "ประกาศขาย" },
  ];

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      setLoadingData(true);
      setLoading(false);
      setDataDefualt();
    }
  }, [isModal]);

  useEffect(() => {
    if (lawyersList) {
      setOptionAssistant();
    }
  }, [lawyersList]);

  const setOptionAssistant = () => {
    console.log("lawyersList", lawyersList);
    let companySelectAssistant = null;
    if (COMPANY === 3) {
      companySelectAssistant = lawyersList.filter(
        (item) =>
          item.COMPANY_ID === 3 &&
          (item.ROLE_ID === 2 || item.ROLE_ID === 3 || item.ROLE_ID === 4) &&
          item.ACTIVE_STATUS === 1
      );
    } else {
      companySelectAssistant = lawyersList.filter(
        (item) =>
          (item.COMPANY_ID === 1 || item.COMPANY_ID === 2) &&
          (item.ROLE_ID === 2 || item.ROLE_ID === 3 || item.ROLE_ID === 4) &&
          item.ACTIVE_STATUS === 1
      );
    }
    const optionsAssistant = companySelectAssistant.map((item) => ({
      value: item.id,
      label: item.NNAME,
    }));

    setAssistantOption(optionsAssistant);
  };

  const setDataDefualt = () => {
    form.setFieldsValue({
      payee: USER_ID,
      contno: data?.contno,
      amount: data?.amount,
      type: data?.type,
      receiveDate: data?.date,
      memo: data?.mark,
    });
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    const postData = {
      ...(data?.id && { id: data.id }), // เพิ่ม id ถ้ามี
      contno: values.contno,
      type: values.type,
      amount: values.amount,
      payer_id: null,
      payee_id: values.payee,
      date: values.receiveDate,
      mark: values.memo,
    };

    console.log("postData", postData);
    sendStatus(postData);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const sendStatus = async (postData) => {
    setLoading(true);
    try {
      if (!data) {
        await axios
          .post(baseUrl + POST_RECEIVE_PAYMENT, postData, {
            headers: HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 201) {
              console.log("resQuery", res);
              funcUpdateStatus(postData, "add");
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้1");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.status > 400) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
          });
      } else {
        await axios
          .put(baseUrl + POST_RECEIVE_PAYMENT, postData, {
            headers: HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 200) {
              console.log("resQuery", res);
              funcUpdateStatus(postData, "edit");
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้1");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.status > 400) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
          });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const formDataSet = () => {
    return (
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 16,
        }}
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="เลขที่สัญญา"
          name="contno"
          rules={[
            {
              required: true,
              message: "กรุณาใส่เลขที่สัญญา",
            },
          ]}
        >
          <Input placeholder="กรุณาใส่เลขสัญญาให้ถูกต้อง" />
        </Form.Item>
        <Form.Item
          label="จำนวน"
          name="amount"
          rules={[
            {
              required: true,
              message: "กรณากรอกข้อมูล !",
            },
          ]}
        >
          <InputNumber
            name="amount"
            suffix="บาท"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            size="large"
            placeholder="จำนวนเงินที่รับชำระ"
            style={{ width: "100%", color: "black" }}
          />
        </Form.Item>
        <Form.Item
          label="วันที่รับเงิน"
          name="receiveDate"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกวันที่สืบทรัพย์",
            },
          ]}
        >
          <DateInput />
        </Form.Item>
        <Form.Item
          label="สถานะลูกค้า"
          name="type"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกผู้สืบทรัพย์ !",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="เลือกสถานะ"
            optionFilterProp="label"
            options={optionsType}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="เลือกผู้รับเงิน"
          name="payee"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกผู้สืบทรัพย์ !",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="เลือกผู้รับเงิน"
            optionFilterProp="label"
            options={assistantOption}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="หมายเหตุ" name="memo">
          <TextArea rows={5} />
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
        title="บันทึกข้อมูลการรับเงิน"
        open={open}
        // onOk={handleOk}
        // onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>{formDataSet()}</Card>
        </Spin>
      </Modal>
    </>
  );
};
export default AddData;
