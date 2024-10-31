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
} from "antd";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_ID,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  PUT_LAWSUIT_DETAIL,
  PUT_STATUS,
} from "../../../API/apiUrls";
import axios from "axios";
import moment from "moment";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import DocumentEnforce from "./DocumentEnforce";

const EditFrom = ({ open, close, dataDefualt, funcUpdateStatus }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const [isModal, setIsModal] = useState(false);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const { TextArea } = Input;
  const [dataStore, setDataStore] = useState();
  const [dataForm, setDataForm] = useState({});
  const [isModalDocument, setIsModalDocument] = useState(false);
  const [currencyFormatNoPoint, currencyFormatComma, currencyFormatPoint] =
    CurrencyFormat();

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      setLawType();
      console.log("dataDefualt", dataDefualt);
    }
  }, [isModal]);

  useEffect(() => {
    if (dataLoadLawSuit && dataLoadLoan) {
      form.setFieldsValue({
        dateCourt: moment(dataDefualt.DATE),
        court: dataLoadLawSuit?.provincial_court,
        subject: dataLoadLawSuit?.subject,
        trackingFee: currencyFormatNoPoint(dataLoadLawSuit?.tracking_fee),
        suspensionAmount: currencyFormatNoPoint(
          dataLoadLawSuit?.suspension_amount
        ),
      });

      let dateCurrent = moment(dataDefualt.DATE);
      let lastPayDate = moment(dataLoadLoan?.LOAN?.LPAYD);

      const differenceMonth = dateCurrent.diff(lastPayDate, "month");
      const lossBenefitValue = dataLoadLoan?.LOAN?.TOT_UPAY
        ? differenceMonth * dataLoadLoan?.LOAN?.TOT_UPAY
        : 0;
      setDataForm((prev) => ({
        ...prev,
        nopay: differenceMonth,
        lossBenefit: lossBenefitValue,
      }));

      let balance = dataLoadLoan?.LOAN?.TOTPRC - dataLoadLoan?.LOAN?.SMPAY;
      let result = balance + lossBenefitValue + dataLoadLawSuit?.tracking_fee;

      let resultTotal = result - dataLoadLawSuit?.suspension_amount;

      let calculatedFee;

      if (resultTotal < 300000) {
        calculatedFee = 1000;
      } else {
        calculatedFee = result * 0.02;
      }

      setDataForm((prev) => ({
        ...prev,
        intigationFounds: result,

        fee: calculatedFee,
      }));

      setDataForm((prev) => ({
        ...prev,
        intigationFounds: resultTotal,
        amountTotalCal: resultTotal,
        suspensionAmount: dataLoadLawSuit?.suspension_amount,
        fee: calculatedFee,
      }));
    }
  }, [dataLoadLawSuit, dataLoadLoan]);

  const handleOk = () => {};

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        baseUrl + GET_LAWSUIT_DETAIL_BY_ID + dataDefualt.LAWSUIT_ID,
        {
          HEADERS_EXPORT,
        }
      );

      if (response.status === 200) {
        console.log("lawsuitRes", response.data);
        setDataLoadLawSuit(response.data);
        setDataStore(response.data);
      } else {
        message.error("ไม่พบข้อมูลคดี");
      }

      const res = await axios.get(
        baseUrl + GET_LOAN_BY_CONTNO + dataDefualt.CONTNO,
        {
          HEADERS_EXPORT,
        }
      );
      if (res.status === 200) {
        console.log("res--->", res.data);
        setDataLoadLoan(res.data);
      } else {
        message.error("ไม่พบข้อมูลคดี");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendStatus = async (status, data) => {
    setLoading(true);
    try {
      console.log("status", status);
      await axios
        .put(baseUrl + PUT_STATUS, status, { HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status > 400) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
        });
      console.log("data", data);
      await axios
        .put(baseUrl + PUT_LAWSUIT_DETAIL, data, { HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
            message.success("อัพเดทข้อมูลสำเร็จ");
            funcUpdateStatus({
              ...dataDefualt,
              DATE: status.DATE,
            });
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status > 400) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
    }
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    const putData = {
      ...dataLoadLawSuit,
      subject: values.subject,
      provincial_court: values.court,
      tracking_fee: parseInt(values.trackingFee.replace(/,/g, "")),
      litigation_funds: dataForm.intigationFounds,
      suspension_amount: parseFloat(dataForm.suspensionAmount),
      interest_rate: null,
      fee: dataForm.fee,
      MEMO: values.memo,
    };

    const putStatus = {
      WORK_LOG_ID: dataDefualt.WORK_LOG_ID,
      USER_ID: dataDefualt.LAWYER_ID,
      LOAN_ID: dataDefualt.id,
      MEMO: values.memo ? values.memo : dataDefualt.MEMO,
      PROCESS_ID: values.PROCESS_ID,
      DATE: dataForm.dateCourt
        ? dataForm.dateCourt
        : moment(dataDefualt.DATE).format("YYYY-MM-DD"),
    };

    setDataStore((prev) => ({
      ...prev,
      subject: values.subject,
      provincial_court: values.court,
      tracking_fee: parseInt(values.trackingFee.replace(/,/g, "")),
      litigation_funds: dataForm.intigationFounds,
      MAIN_STATUS_ID: dataDefualt.MAIN_STATUS_ID,
      LOAN_ID: dataDefualt.id,
      USER_ID: dataDefualt.LAWYER_ID,
      LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
      LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
      MEMO: values.memo,
      DATE: dataForm.dateCourt,
      lossBenefit: dataForm.lossBenefit,
      suspensionAmount: dataForm.suspensionAmount,
      nopay: dataForm.nopay,
    }));

    console.log("putData", putData);
    console.log("putStatus", putStatus);

    sendStatus(putStatus, putData);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputCourt = (value) => {
    console.log(value);
  };

  const onChangeInputSubject = (value) => {
    console.log(value);
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const onChangeCourt = (date, dateString) => {
    console.log("date, dateString", date, dateString);
    setDataForm({ ...dataForm, dateCourt: dateString });
    handleLossPay(dateString);
  };

  const onChangeTrackingFee = (value) => {
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        trackingFee: formattedValue,
      });
      setDataForm({
        ...dataForm,
        trackingFee: parseFloat(inputValue),
      });
    } else {
      form.setFieldsValue({
        trackingFee: inputValue,
      });
      setDataForm({
        ...dataForm,
        trackingFee: parseFloat(inputValue),
      });
    }
    let balance = dataLoadLoan?.LOAN?.TOTPRC - dataLoadLoan?.LOAN?.SMPAY;
    let result =
      balance + dataForm.lossBenefit + parseInt(value.replace(/,/g, ""));

    let calculatedFee;

    if (result < 300000) {
      calculatedFee = 1000;
    } else {
      calculatedFee = result * 0.02;
    }

    setDataForm((prev) => ({
      ...prev,
      intigationFounds: result,
      amountTotalCal: result,
      fee: calculatedFee,
    }));
  };

  const onChangeSuspensionAmount = (value) => {
    let inputValue = value;
    console.log(value);
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        suspensionAmount: formattedValue,
      });
      setDataForm({
        ...dataForm,
        suspensionAmount: parseFloat(inputValue),
      });
    } else {
      form.setFieldsValue({
        suspensionAmount: inputValue,
      });
      setDataForm({
        ...dataForm,
        suspensionAmount: parseFloat(inputValue),
      });
    }
    let result = dataForm?.amountTotalCal - parseInt(value.replace(/,/g, ""));

    let calculatedFee;

    if (result < 300000) {
      calculatedFee = 1000;
    } else {
      calculatedFee = result * 0.02;
    }

    setDataForm((prev) => ({
      ...prev,
      intigationFounds: result,
      suspensionAmount: parseFloat(value.replace(/,/g, "")),
      fee: calculatedFee,
    }));
  };

  const handleLossPay = (value) => {
    let dateCurrent = moment(value);
    let lastPayDate = moment(dataLoadLoan?.LOAN?.LPAYD);

    const differenceMonth = dateCurrent.diff(lastPayDate, "month");
    const lossBenefitValue = dataLoadLoan?.LOAN?.TOT_UPAY
      ? differenceMonth * dataLoadLoan?.LOAN?.TOT_UPAY
      : 0;
    setDataForm((prev) => ({
      ...prev,
      nopay: differenceMonth,
      lossBenefit: lossBenefitValue,
    }));
  };

  function isNotNumber(value) {
    const regex = /^\d+$/; // กำหนดให้ตรงกับตัวเลขทั้งหมด
    if (!regex.test(value)) {
      message.error("กรุณากรอกข้อมูลเป็นตัวเลขเท่านั้น");
    }
  }

  const setLawType = () => {
    let result = dataDefualt
      ? dataDefualt.LAW_TYPE_ID === 1
        ? "แพ่ง"
        : dataDefualt.LAW_TYPE_ID === 2
        ? "อาญา"
        : dataDefualt.LAW_TYPE_ID === 3
        ? "แพ่ง, อาญา"
        : null
      : null;
    setDataForm((prev) => ({ ...prev, lawTypeTH: result }));
    return result;
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
          suspensionAmount: 0,
        }}
      >
        <Form.Item
          label="วันที่ส่งฟ้อง"
          name="dateCourt"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกวันที่จัดทำ",
            },
          ]}
        >
          <DatePicker onChange={onChangeCourt} />
        </Form.Item>
        <Form.Item
          label="ศาล"
          name="court"
          rules={[
            {
              required: true,
              message: "กรุณาพิมพ์ศาลที่ยื่นฟ้อง !",
            },
          ]}
        >
          <Input onChange={(e) => onChangeInputCourt(e.target.value)} />
        </Form.Item>
        <Form.Item label="ความ">
          <p>{dataForm.lawTypeTH ? dataForm.lawTypeTH : "-"}</p>
        </Form.Item>
        <Form.Item
          label="เรื่อง"
          name="subject"
          rules={[
            {
              required: true,
              message: "กรุณาพิมพ์เรื่องที่ยื่นฟ้อง !",
            },
          ]}
        >
          <Input onChange={(e) => onChangeInputSubject(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="ค่าติดตาม"
          name="trackingFee"
          rules={[
            {
              required: true,
              message: "กรุณาใส่ค่าติดตาม !",
            },
          ]}
        >
          <Input
            autoComplete="off"
            name="trackingFee"
            onChange={(e) => onChangeTrackingFee(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="เบี้ยตั้งพัก"
          name="suspensionAmount"
          rules={[
            {
              required: true,
              message: "หากไม่มีให้ใส่ 0 !",
            },
          ]}
        >
          <Input
            autoComplete="off"
            name="suspensionAmount"
            onChange={(e) => onChangeSuspensionAmount(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="ผิดนัดชำระจำนวน" name="noPay">
          <p>{dataForm.nopay ? dataForm.nopay + " งวด" : "-"}</p>
        </Form.Item>
        <Form.Item label="ค่าขาดประโยชน์" name="lossBenefit">
          <p>
            {dataForm.lossBenefit
              ? currencyFormatNoPoint(dataForm.lossBenefit) + " บาท"
              : "-"}
          </p>
        </Form.Item>
        <Form.Item label="จำนวนทุนทรัพย์" name="intigationFounds">
          <p>
            {dataForm.intigationFounds
              ? currencyFormatNoPoint(dataForm.intigationFounds) + " บาท"
              : "-"}
          </p>
        </Form.Item>
        <Form.Item label="ค่าฤชา" name="fee">
          <p>
            {dataForm.intigationFounds
              ? currencyFormatPoint(dataForm.fee) + " บาท"
              : "-"}
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
        title="แก้ไขคำฟ้องคดีผู้บริโภค"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>{formDataSet()}</Card>
        </Spin>
      </Modal>
      {isModalDocument ? (
        <DocumentEnforce open={isModalDocument} close={setIsModalDocument} />
      ) : null}
    </>
  );
};
export default EditFrom;
