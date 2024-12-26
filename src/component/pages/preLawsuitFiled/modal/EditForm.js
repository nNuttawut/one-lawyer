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
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import DocumentEnforce from "./DocumentEnforce";
import dayjs from "dayjs";
import TokenCheck from "../../../../hook/TokenCheck";

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
  const [buttonCal, setButtonCal] = useState(false);
  const [buttonSubmit, setButtonSubmit] = useState(false);
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
        dateCourt: dayjs(dataDefualt.DATE),
        court: dataLoadLawSuit?.provincial_court,
        subject: dataLoadLawSuit?.subject,
        trackingFee: currencyFormatNoPoint(dataLoadLawSuit?.tracking_fee),
        suspensionAmount: currencyFormatNoPoint(
          dataLoadLawSuit?.suspension_amount
        ),
        lossBenefit: currencyFormatNoPoint(dataLoadLawSuit?.lack_of_benefits),
        intigationFounds: currencyFormatNoPoint(
          dataLoadLawSuit?.litigation_funds
        ),
      });

      let dateCurrent = dayjs(dataDefualt.DATE);
      let lastPayDate = dayjs(dataLoadLoan?.LOAN?.LPAYD);

      const differenceMonth = dateCurrent.diff(lastPayDate, "month");
      const lossBenefitValue = dataLoadLoan?.LOAN?.TOT_UPAY
        ? differenceMonth * dataLoadLoan?.LOAN?.TOT_UPAY
        : 0;
      setDataForm((prev) => ({
        ...prev,
        nopay: differenceMonth,
        lossBenefit: currencyFormatNoPoint(dataLoadLawSuit?.fee),
      }));

      let balance;
      if (dataDefualt?.LOAN_TYPE_ID === 1) {
        balance = dataLoadLoan?.LOAN?.TOTPRC - dataLoadLoan?.LOAN?.SMPAY;
      } else {
        balance = dataLoadLoan?.LOAN?.NCSHPRC - dataLoadLoan?.LOAN?.SMPAY;
      }
      let result = balance + lossBenefitValue + dataLoadLawSuit?.tracking_fee;

      let resultTotal = result - dataLoadLawSuit?.suspension_amount;

      setDataForm((prev) => ({
        ...prev,
        intigationFounds: result,
      }));

      setDataForm((prev) => ({
        ...prev,
        intigationFounds: resultTotal,
        amountTotalCal: resultTotal,
        suspensionAmount: dataLoadLawSuit?.suspension_amount,
      }));
    }
  }, [dataLoadLawSuit, dataLoadLoan]);

  const handleCancel = () => {
    close(false);
    setIsModal(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        baseUrl + GET_LAWSUIT_DETAIL_BY_ID + dataDefualt.LAWSUIT_ID,
        {
          headers: HEADERS_EXPORT,
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
          headers: HEADERS_EXPORT,
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
        .put(baseUrl + PUT_STATUS, status, { headers: HEADERS_EXPORT })
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
        .put(baseUrl + PUT_LAWSUIT_DETAIL, data, { headers: HEADERS_EXPORT })
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
      tracking_fee:
        values?.trackingFee &&
        typeof values.trackingFee === "string" &&
        values.trackingFee.includes(",")
          ? parseInt(values.trackingFee.replace(/,/g, ""))
          : parseInt(values.trackingFee)
          ? parseInt(values.trackingFee)
          : 0,
      litigation_funds:
        values?.intigationFounds &&
        typeof values.intigationFounds === "string" &&
        values.intigationFounds.includes(",")
          ? parseInt(values.intigationFounds.replace(/,/g, ""))
          : parseInt(values.intigationFounds)
          ? parseInt(values.intigationFounds)
          : 0,
      suspension_amount:
        values?.suspensionAmount &&
        typeof values.suspensionAmount === "string" &&
        values.suspensionAmount.includes(",")
          ? parseInt(values.suspensionAmount.replace(/,/g, ""))
          : parseInt(values.suspensionAmount)
          ? parseInt(values.suspensionAmount)
          : 0,
      interest_rate: null,
      fee: null,
      MEMO: values.memo,
      date_of_plaint: dataForm.dateCourt,
      lack_of_benefits:
        values?.lossBenefit &&
        typeof values.lossBenefit === "string" &&
        values.lossBenefit.includes(",")
          ? parseInt(values.lossBenefit.replace(/,/g, ""))
          : parseInt(values.lossBenefit)
          ? parseInt(values.lossBenefit)
          : 0,
    };

    const putStatus = {
      WORK_LOG_ID: dataDefualt.WORK_LOG_ID,
      USER_ID: dataDefualt.LAWYER_ID,
      LOAN_ID: dataDefualt.id,
      MEMO: values.memo ? values.memo : dataDefualt.MEMO,
      PROCESS_ID: dataDefualt.PROCESS_ID,
      DATE: dataForm.dateCourt
        ? dataForm.dateCourt
        : dayjs(dataDefualt.DATE).format("YYYY-MM-DD"),
    };

    setDataStore((prev) => ({
      ...prev,
      subject: values.subject,
      provincial_court: values.court,
      tracking_fee:
        values?.trackingFee &&
        typeof values.trackingFee === "string" &&
        values.trackingFee.includes(",")
          ? parseInt(values.trackingFee.replace(/,/g, ""))
          : parseInt(values.trackingFee)
          ? parseInt(values.trackingFee)
          : 0,
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
    if (!date) {
      form.setFieldsValue({
        trackingFee: 0,
        intigationFounds: 0,
        lossBenefit: 0,
        suspensionAmount: 0,
      });
    }
  };

  const onChangeTrackingFee = (value) => {
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));

    // ตัดเครื่องหมาย , ออก
    let rawValue = inputValue.replace(/,/g, "");

    // ตรวจสอบว่าเป็นตัวเลขหรือไม่
    if (isNaN(rawValue)) {
      return; // ถ้าไม่ใช่ตัวเลขก็ไม่ทำการอะไร
    }

    // หากค่ามากกว่าหรือเท่ากับ 1000 ก็จะทำการจัดรูปแบบ
    if (parseInt(rawValue) >= 1000) {
      let intValue = parseInt(rawValue);
      let formattedValue = currencyFormatComma(intValue); // แสดงผลแบบมี comma
      console.log("formattedValue", formattedValue);

      form.setFieldsValue({
        trackingFee: formattedValue,
      });

      setDataForm({
        ...dataForm,
        trackingFee: parseFloat(rawValue), // ใช้ค่าที่ไม่ได้มีเครื่องหมาย , เพื่อการคำนวณ
      });
    } else {
      // หากค่าน้อยกว่า 1000 ก็ไม่ต้องจัดรูปแบบ
      form.setFieldsValue({
        trackingFee: inputValue,
      });

      setDataForm({
        ...dataForm,
        trackingFee: parseFloat(rawValue),
      });
    }
  };

  const onChangeSuspensionAmount = (value) => {
    let inputValue = value;
    console.log(value);
    isNotNumber(inputValue.replace(/,/g, ""));

    // ตัดเครื่องหมาย , ออก
    let rawValue = inputValue.replace(/,/g, "");

    // ตรวจสอบว่าเป็นตัวเลขหรือไม่
    if (isNaN(rawValue)) {
      return; // ถ้าไม่ใช่ตัวเลขก็ไม่ทำการอะไร
    }

    // หากค่ามากกว่าหรือเท่ากับ 1000 ก็จะทำการจัดรูปแบบ
    if (parseInt(rawValue) >= 1000) {
      let intValue = parseInt(rawValue);
      let formattedValue = currencyFormatComma(intValue); // แสดงผลแบบมี comma
      console.log("formattedValue", formattedValue);

      form.setFieldsValue({
        suspensionAmount: formattedValue,
      });

      setDataForm({
        ...dataForm,
        suspensionAmount: parseFloat(rawValue), // ใช้ค่าที่ไม่ได้มีเครื่องหมาย , เพื่อการคำนวณ
      });
    } else {
      // หากค่าน้อยกว่า 1000 ก็ไม่ต้องจัดรูปแบบ
      form.setFieldsValue({
        suspensionAmount: inputValue,
      });

      setDataForm({
        ...dataForm,
        suspensionAmount: parseFloat(rawValue),
      });
    }
  };
  console.log(dataForm);

  const onChangeInpuutLossBenefit = (value) => {
    let inputValue = value;
    console.log(value);
    isNotNumber(inputValue.replace(/,/g, ""));

    // ตัดเครื่องหมาย , ออก
    let rawValue = inputValue.replace(/,/g, "");

    // ตรวจสอบว่าเป็นตัวเลขหรือไม่
    if (isNaN(rawValue)) {
      return; // ถ้าไม่ใช่ตัวเลขก็ไม่ทำการอะไร
    }

    // หากค่ามากกว่าหรือเท่ากับ 1000 ก็จะทำการจัดรูปแบบ
    if (parseInt(rawValue) >= 1000) {
      let intValue = parseInt(rawValue);
      let formattedValue = currencyFormatComma(intValue); // แสดงผลแบบมี comma
      console.log("formattedValue", formattedValue);

      form.setFieldsValue({
        lossBenefit: formattedValue,
      });

      setDataForm({
        ...dataForm,
        lossBenefit: parseFloat(rawValue), // ใช้ค่าที่ไม่ได้มีเครื่องหมาย , เพื่อการคำนวณ
      });
    } else {
      // หากค่าน้อยกว่า 1000 ก็ไม่ต้องจัดรูปแบบ
      form.setFieldsValue({
        lossBenefit: inputValue,
      });

      setDataForm({
        ...dataForm,
        lossBenefit: parseFloat(rawValue),
      });
    }
  };

  const onChangeInputLitigationFunds = (value) => {
    let inputValue = value;
    console.log(value);
    isNotNumber(inputValue.replace(/,/g, ""));

    // ตัดเครื่องหมาย , ออก
    let rawValue = inputValue.replace(/,/g, "");

    // ตรวจสอบว่าเป็นตัวเลขหรือไม่
    if (isNaN(rawValue)) {
      return; // ถ้าไม่ใช่ตัวเลขก็ไม่ทำการอะไร
    }

    // หากค่ามากกว่าหรือเท่ากับ 1000 ก็จะทำการจัดรูปแบบ
    if (parseInt(rawValue) >= 1000) {
      let intValue = parseInt(rawValue);
      let formattedValue = currencyFormatComma(intValue); // แสดงผลแบบมี comma
      console.log("formattedValue", formattedValue);

      form.setFieldsValue({
        intigationFounds: formattedValue,
      });

      setDataForm({
        ...dataForm,
        intigationFounds: parseFloat(rawValue), // ใช้ค่าที่ไม่ได้มีเครื่องหมาย , เพื่อการคำนวณ
      });
    } else {
      // หากค่าน้อยกว่า 1000 ก็ไม่ต้องจัดรูปแบบ
      form.setFieldsValue({
        intigationFounds: inputValue,
      });

      setDataForm({
        ...dataForm,
        intigationFounds: parseFloat(rawValue),
      });
    }
  };

  const handleLossPay = (value) => {
    console.log("date", value);
    let dateCurrent = dayjs(value);
    let lastPayDate = dayjs(dataLoadLoan?.LOAN?.LPAYD);
    const differenceMonth = dateCurrent.diff(lastPayDate, "month");
    setDataForm((prev) => ({
      ...prev,
      nopay: differenceMonth,
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
        <Form.Item label="เลขสัญญา/เจ้าของสัญญา" name="ownerSign">
          <p>
            {`${dataDefualt?.CONTNO}/${dataDefualt?.CUSTOMER_TNAME}
            ${dataDefualt?.CUSTOMER_FNAME} ${dataDefualt?.CUSTOMER_LNAME}`}
          </p>
        </Form.Item>
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
        {dataDefualt.LOAN_TYPE_ID === 1 ? (
          <Form.Item label="ค่าขาดประโยชน์" name="lossBenefit">
            <Input
              autoComplete="off"
              name="lossBenefit"
              onChange={(e) => onChangeInpuutLossBenefit(e.target.value)}
            />
          </Form.Item>
        ) : null}
        <Form.Item label="จำนวนทุนทรัพย์" name="intigationFounds">
          <Input
            autoComplete="off"
            name="intigationFounds"
            onChange={(e) => onChangeInputLitigationFunds(e.target.value)}
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

          <Button
            style={{ color: "green" }}
            onClick={() => setButtonSubmit(true)}
            htmlType="submit"
          >
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
