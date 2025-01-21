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
  GET_LAWSUIT_DETAIL_BY_LOAN,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  PUT_LAWSUIT_DETAIL,
  PUT_STATUS,
} from "../../../API/apiUrls";
import axios from "axios";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import DocumentEnforce from "./DocumentEnforce";
import { STATUS_PROCESS_SUCCESSFUL } from "../../../../utils/constant/StatusConstant";
import dayjs from "dayjs";

const CreateDocument = ({ open, close, dataDefault, funcUpdateStatus }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const [isModal, setIsModal] = useState(false);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const { TextArea } = Input;
  const [dataStore, setDataStore] = useState();
  const [dataForm, setDataForm] = useState({
    dateCourt: "",
    trackingFee: 0,
    lossBenefit: null,
    suspensionAmount: 0,
    memo: "",
    nopay: 0,
    idLawsuit: null,
    intigationFounds: 0,
    amountTotalCal: 0,
    docShipingCost: 0,
    feeCourt: 0,
  });
  const [isModalDocument, setIsModalDocument] = useState(false);
  const [buttonCal, setButtonCal] = useState(false);
  const [buttonSubmit, setButtonSubmit] = useState(false);
  const [buttonCalFounds, setButtonCalFounds] = useState(false);
  const [currencyFormatNoPoint, currencyFormatComma, currencyFormatPoint] =
    CurrencyFormat();

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      setLawType();
      console.log("loadData", dataDefault);
    }
  }, [isModal]);

  const handleOk = () => {};

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [lawsuitRes, loanRes] = await Promise.all([
        axios.get(`${baseUrl}${GET_LAWSUIT_DETAIL_BY_LOAN}${dataDefault.id}`, {
          headers: HEADERS_EXPORT,
        }),
        axios.get(`${baseUrl}${GET_LOAN_BY_CONTNO}${dataDefault.CONTNO}`, {
          headers: HEADERS_EXPORT,
        }),
      ]);

      if (lawsuitRes.status === 200) {
        console.log("lawsuitRes", lawsuitRes.data);
        setDataLoadLawSuit(lawsuitRes.data);
        setDataStore(lawsuitRes.data);
      } else {
        message.error("ไม่พบข้อมูลคดี");
      }

      if (loanRes.status === 200) {
        console.log("loanRes", loanRes.data);
        setDataLoadLoan(loanRes.data);
      } else {
        message.error("ไม่พบข้อมูลเงิน");
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
              ...dataDefault,
              DATE: status.DATE,
              PROCESS_ID: status.PROCESS_ID,
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
    let intTrackingFee =
      values?.trackingFee &&
      typeof values.trackingFee === "string" &&
      values.trackingFee.includes(",")
        ? parseInt(values.trackingFee.replace(/,/g, ""))
        : parseInt(values.trackingFee)
        ? parseInt(values.trackingFee)
        : 0;

    let intLostbenefit =
      values?.lossBenefit && typeof values.lossBenefit === "string"
        ? values.lossBenefit.includes(",")
          ? parseInt(values.lossBenefit.replace(/,/g, ""))
          : parseInt(values.lossBenefit)
        : parseInt(values.lossBenefit);

    console.log("intLostbenefit---->", intLostbenefit);
    let intSuspensionAmount =
      values?.suspensionAmount &&
      typeof values.suspensionAmount === "string" &&
      values.suspensionAmount.includes(",")
        ? parseInt(values.suspensionAmount.replace(/,/g, ""))
        : parseInt(values.suspensionAmount)
        ? parseInt(values.suspensionAmount)
        : 0;

    let valueIntigationFounds =
      values?.intigationFounds &&
      typeof values.intigationFounds === "string" &&
      values.intigationFounds.includes(",")
        ? parseInt(values.intigationFounds.replace(/,/g, ""))
        : parseInt(values.intigationFounds)
        ? parseInt(values.intigationFounds)
        : 0;

    let calFeeCourt;
    let calStampDuty;
    let balance;
    let calIntigationFounds;

    if (buttonCalFounds) {
      console.log("intTrackingFee", intTrackingFee);
      console.log("intLostbenefit", intLostbenefit);
      console.log("intSuspensionAmount", intSuspensionAmount);

      if (dataDefault?.LOAN_TYPE_ID === 1) {
        balance = dataLoadLoan?.LOAN?.TOTPRC - dataLoadLoan?.LOAN?.SMPAY;
        calIntigationFounds =
          balance + intTrackingFee + intLostbenefit - intSuspensionAmount;
      } else {
        balance = dataLoadLoan?.LOAN?.NCSHPRC - dataLoadLoan?.LOAN?.SMPAY;
        calIntigationFounds = balance + intTrackingFee - intSuspensionAmount;
      }

      console.log("calIntigationFounds--->", calIntigationFounds);
      if (calIntigationFounds < 0) {
        calIntigationFounds = 0;
        message.error("ไม่สามารถคำนวณได้เนื่องจากมีค่าติดลบ");
      }
      if (dataForm.dateCourt) {
        form.setFieldsValue({
          intigationFounds: currencyFormatComma(calIntigationFounds),
          feeCourt: 0,
          stampDuty: 0,
        });
      }

      setButtonCalFounds(false);
    }

    if (buttonCal) {
      console.log("values.intigationFounds--->", valueIntigationFounds);

      if (valueIntigationFounds < 300000) {
        calFeeCourt = valueIntigationFounds * 0.02;
        if (calFeeCourt > 1000) {
          calFeeCourt = 1000;
        }
      } else {
        calFeeCourt = valueIntigationFounds * 0.02;
      }

      calStampDuty = dataLoadLoan?.LOAN?.TOTPRC / 2000;
      if (calStampDuty > 10000) {
        calStampDuty = 10000;
      }

      console.log("calFeeCourt", Math.round(calFeeCourt));

      if (dataForm.dateCourt) {
        form.setFieldsValue({
          feeCourt: currencyFormatComma(Math.round(calFeeCourt)),
          stampDuty:
            dataDefault.LOAN_TYPE_ID === 1 ? Math.round(calStampDuty) : 0,
        });
      }

      setButtonCal(false);
    }

    if (buttonSubmit) {
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
        stamp_cost:
          values?.stampDuty &&
          typeof values.stampDuty === "string" &&
          values.stampDuty.includes(",")
            ? parseInt(values.stampDuty.replace(/,/g, ""))
            : parseInt(values.stampDuty)
            ? parseInt(values.stampDuty)
            : 0,
        date_of_plaint: dataForm.dateCourt,
        lack_of_benefits:
          values?.lossBenefit &&
          typeof values.lossBenefit === "string" &&
          values.lossBenefit.includes(",")
            ? parseInt(values.lossBenefit.replace(/,/g, ""))
            : parseInt(values.lossBenefit)
            ? parseInt(values.lossBenefit)
            : 0,
        fee:
          values?.feeCourt &&
          typeof values.feeCourt === "string" &&
          values.feeCourt.includes(",")
            ? parseInt(values.feeCourt.replace(/,/g, ""))
            : parseInt(values.feeCourt)
            ? parseInt(values.feeCourt)
            : 0,
      };

      const putStatus = {
        WORK_LOG_ID: dataDefault.WORK_LOG_ID,
        USER_ID: dataDefault.LAWYER_ID,
        LOAN_ID: dataDefault.id,
        MEMO: values.memo,
        DATE: dataForm.dateCourt,
        PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
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
        MAIN_STATUS_ID: dataDefault.MAIN_STATUS_ID,
        LOAN_ID: dataDefault.id,
        USER_ID: dataDefault.LAWYER_ID,
        LOAN_TYPE_ID: dataDefault.LOAN_TYPE_ID,
        LAW_TYPE_ID: dataDefault.LAW_TYPE_ID,
        MEMO: values.memo,
        DATE: dataForm.dateCourt,
        lossBenefit: dataForm.lossBenefit,
        suspensionAmount: dataForm.suspensionAmount,
        nopay: dataForm.nopay,
      }));
      console.log("putData", putData);

      sendStatus(putStatus, putData);
    }
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
    console.log(date, dateString);
    setDataForm({ ...dataForm, dateCourt: dateString });

    if (!date) {
      form.setFieldsValue({
        intigationFounds: 0,
        lossBenefit: 0,
        dateCourt: null,
        docShipingCost: 0,
        stampDuty: 0,
        feeCourt: 0,
      });
      setDataForm({
        ...dataForm,
        suspensionAmount: 0,
        trackingFee: 0,
        intigationFounds: 0,
        dateCourt: null,
        feeCourt: 0,
        docShipingCost: 0,
        lossBenefit: 0,
      });
      setButtonCal(false);
      setButtonCalFounds(false);
    }
    handleLossPay(dateString);
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
        trackingFee: inputValue.includes(",")
          ? inputValue.replace(",", "")
          : inputValue,
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
        suspensionAmount: inputValue.includes(",")
          ? inputValue.replace(",", "")
          : inputValue,
      });

      setDataForm({
        ...dataForm,
        suspensionAmount: parseFloat(rawValue),
      });
    }
  };

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
        lossBenefit: inputValue.includes(",")
          ? inputValue.replace(",", "")
          : inputValue,
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
        intigationFounds: inputValue.includes(",")
          ? inputValue.replace(",", "")
          : inputValue,
      });

      setDataForm({
        ...dataForm,
        intigationFounds: parseFloat(rawValue),
      });
    }
  };

  const feeCourt = (value) => {
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
        feeCourt: formattedValue,
      });

      setDataForm({
        ...dataForm,
        feeCourt: parseInt(rawValue), // ใช้ค่าที่ไม่ได้มีเครื่องหมาย , เพื่อการคำนวณ
      });
    } else {
      // หากค่าน้อยกว่า 1000 ก็ไม่ต้องจัดรูปแบบ
      form.setFieldsValue({
        feeCourt: inputValue.includes(",")
          ? inputValue.replace(",", "")
          : inputValue,
      });

      setDataForm({
        ...dataForm,
        feeCourt: parseInt(rawValue),
      });
    }
  };

  const stampDutyCost = (value) => {
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
        stampDuty: formattedValue,
      });

      setDataForm({
        ...dataForm,
        stampDuty: parseFloat(rawValue), // ใช้ค่าที่ไม่ได้มีเครื่องหมาย , เพื่อการคำนวณ
      });
    } else {
      // หากค่าน้อยกว่า 1000 ก็ไม่ต้องจัดรูปแบบ
      form.setFieldsValue({
        stampDuty: inputValue.includes(",")
          ? inputValue.replace(",", "")
          : inputValue,
      });

      setDataForm({
        ...dataForm,
        stampDuty: parseFloat(rawValue),
      });
    }
  };

  const handleLossPay = (value) => {
    console.log("date", value);
    let dateCurrent = dayjs(value);
    let lastPayDate = dayjs(dataLoadLoan?.LOAN?.LPAYD);
    const differenceMonth = dateCurrent.diff(lastPayDate, "month");

    if (value) {
      let lossBenefitValue;

      lossBenefitValue = dataLoadLoan?.LOAN?.TOT_UPAY
        ? differenceMonth * dataLoadLoan?.LOAN?.TOT_UPAY
        : 0;

      console.log(
        "differenceMonth * dataLoadLoan?.LOAN?.TOT_UPAY",
        differenceMonth * dataLoadLoan?.LOAN?.TOT_UPAY
      );

      let balance;
      let result;
      if (dataDefault?.LOAN_TYPE_ID === 1) {
        balance = dataLoadLoan?.LOAN?.TOTPRC - dataLoadLoan?.LOAN?.SMPAY;
        result =
          balance +
          parseInt(lossBenefitValue) +
          dataForm.trackingFee -
          dataForm.suspensionAmount;
      } else {
        balance = dataLoadLoan?.LOAN?.NCSHPRC - dataLoadLoan?.LOAN?.SMPAY;
        result = balance + dataForm.trackingFee - dataForm.suspensionAmount;
      }

      let calFeeCourt;

      if (result < 300000) {
        calFeeCourt = result * 0.02;
        if (calFeeCourt > 1000) {
          calFeeCourt = 1000;
        }
      } else {
        calFeeCourt = result * 0.02;
      }

      let calStampDuty = dataLoadLoan?.LOAN?.TOTPRC / 2000;

      if (calStampDuty > 10000) {
        calStampDuty = 10000;
      }

      console.log("balance", balance);
      console.log("lossBenefitValue", lossBenefitValue);
      console.log("dataForm.trackingFee", dataForm.trackingFee);
      console.log("dataForm.suspensionAmount", dataForm.suspensionAmount);
      console.log("calFeeCourt", calFeeCourt);
      console.log("calStampDuty", Math.round(calStampDuty));

      form.setFieldsValue({
        intigationFounds: currencyFormatComma(result),
        lossBenefit: currencyFormatComma(lossBenefitValue),
        feeCourt: currencyFormatComma(Math.round(calFeeCourt)),
        stampDuty:
          dataDefault.LOAN_TYPE_ID === 1 ? Math.round(calStampDuty) : 0,
      });

      setDataForm((prev) => ({
        ...prev,
        nopay: differenceMonth,
      }));
    }
  };

  function isNotNumber(value) {
    const regex = /^\d+$/; // กำหนดให้ตรงกับตัวเลขทั้งหมด
    if (!regex.test(value)) {
      message.error("กรุณากรอกข้อมูลเป็นตัวเลขเท่านั้น");
    }
  }

  const setLawType = () => {
    let result = dataDefault
      ? dataDefault.LAW_TYPE_ID === 1
        ? "แพ่ง"
        : dataDefault.LAW_TYPE_ID === 2
        ? "อาญา"
        : dataDefault.LAW_TYPE_ID === 3
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
          subject:
            dataDefault.LOAN_TYPE_ID === 2
              ? "บอกกล่าวบังคับจำนอง"
              : "บอกเลิกสัญญาให้ชำระหนี้/บอกเลิกสัญญา",
          suspensionAmount: 0,
          trackingFee: 0,
          stampDuty: 0,
        }}
      >
        <Form.Item label="เลขสัญญา/เจ้าของสัญญา" name="ownerSign">
          <p>
            {`${dataDefault?.CONTNO}/${dataDefault?.CUSTOMER_TNAME}
            ${dataDefault?.CUSTOMER_FNAME} ${dataDefault?.CUSTOMER_LNAME}`}
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
          label="ค่าติดตามทวงถาม"
          name="trackingFee"
          rules={[
            {
              required: true,
              message: "กรุณาใส่ค่าติดตาม !",
            },
          ]}
        >
          <Input
            suffix="บาท"
            autoComplete="off"
            name="trackingFee"
            placeholder="ไม่มีให้ใส่ 0"
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
            suffix="บาท"
            autoComplete="off"
            name="suspensionAmount"
            onChange={(e) => onChangeSuspensionAmount(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="ผิดนัดชำระจำนวน" name="noPay">
          <p>{dataForm.nopay ? dataForm.nopay + " งวด" : "-"}</p>
        </Form.Item>
        {dataForm.dateCourt ? (
          <>
            <Form.Item label="เงินต้น" name="principle">
              <p>
                {dataDefault.LOAN_TYPE_ID === 1
                  ? currencyFormatComma(dataLoadLoan?.LOAN?.TOTPRC) + " บาท"
                  : currencyFormatComma(dataLoadLoan?.LOAN?.NCSHPRC) + " บาท"}
              </p>
            </Form.Item>
            <Form.Item label="ยอดที่จ่ายมาทั้งหมด" name="sumaryPay">
              <p>{currencyFormatComma(dataLoadLoan?.LOAN?.SMPAY) + " บาท"}</p>
            </Form.Item>
            <Form.Item label="เงินค้างจ่ายโดยประมาณ" name="balance">
              <p>
                {dataDefault.LOAN_TYPE_ID === 1
                  ? currencyFormatComma(
                      dataLoadLoan?.LOAN?.TOTPRC - dataLoadLoan?.LOAN?.SMPAY
                    ) + " บาท"
                  : currencyFormatComma(
                      dataLoadLoan?.LOAN?.NCSHPRC - dataLoadLoan?.LOAN?.SMPAY
                    ) + " บาท"}
              </p>
            </Form.Item>
            {dataDefault.LOAN_TYPE_ID === 1 ? (
              <Form.Item label="ค่าขาดประโยชน์" name="lossBenefit">
                <Input
                  autoComplete="off"
                  name="lossBenefit"
                  onChange={(e) => onChangeInpuutLossBenefit(e.target.value)}
                />
              </Form.Item>
            ) : null}
            <Form.Item label="คำนวณทุนทรัพย์โดยประมาณ">
              <Button
                style={{ color: "blue" }}
                htmlType="submit"
                onClick={() => setButtonCalFounds(true)}
              >
                คำนวณ
              </Button>
            </Form.Item>
            <Form.Item
              label="จำนวนทุนทรัพย์"
              name="intigationFounds"
              rules={[
                {
                  required: true,
                  message: "กรุณาใส่จำนวนทุนทรัพย์ !",
                },
              ]}
            >
              <Input
                suffix="บาท"
                autoComplete="off"
                name="intigationFounds"
                onChange={(e) => onChangeInputLitigationFunds(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="ค่าธรรมเนียมศาล"
              name="feeCourt"
              rules={[
                {
                  required: true,
                  message: "กรุณาใส่ค่าธรรมเนียมศาล !",
                },
              ]}
            >
              <Input
                suffix="บาท"
                autoComplete="off"
                name="feeCourt"
                onChange={(e) => feeCourt(e.target.value)}
              />
            </Form.Item>
            {dataDefault.LOAN_TYPE_ID === 1 ? (
              <Form.Item
                label="ค่าอากรสแตมป์"
                name="stampDuty"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ค่าค่าอากรสแตมป์ !",
                  },
                ]}
              >
                <Input
                  name="stampDuty"
                  onChange={(e) => stampDutyCost(e.target.value)}
                />
              </Form.Item>
            ) : null}
          </>
        ) : null}
        <Form.Item label="คำนวณค่าธรรมเนียม">
          <Button
            style={{ color: "blue" }}
            htmlType="submit"
            onClick={() => setButtonCal(true)}
          >
            คำนวณ
          </Button>
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
        title="สร้างคำฟ้องคดีผู้บริโภค"
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
export default CreateDocument;
