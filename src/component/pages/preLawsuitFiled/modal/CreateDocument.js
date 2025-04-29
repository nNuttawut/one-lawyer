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
} from "antd";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_LOAN,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  POST_DETAIL_PAYMENT,
  PUT_LAWSUIT_DETAIL,
  PUT_STATUS,
} from "../../../API/apiUrls";
import axios from "axios";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import DocumentEnforce from "./DocumentEnforce";
import { STATUS_PROCESS_SUCCESSFUL } from "../../../../utils/constant/StatusConstant";
import dayjs from "dayjs";
import LoadCompanies from "../../../../hook/LoadCompanies";
import { optionsLone } from "../../../../utils/constant/LoanTypeConstant";
import {
  interest,
  optionsInterest,
} from "../../../../utils/constant/ Interest";
import DateCustom from "../../../../hook/DateCustom";

const CreateDocument = ({ open, close, dataDefault, funcUpdateStatus }) => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [companiesListCompany, setLoadingDataCompany] = LoadCompanies();
  const [companiesOption, setCompaniesOption] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const [isModal, setIsModal] = useState(false);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const [dataFormApiJojo, setDataFormApiJojo] = useState(null);
  const { TextArea } = Input;
  const [dataStore, setDataStore] = useState();
  const [dataForm, setDataForm] = useState({
    dateCourt: "",
    trackingFee: 0,
    lossBenefit: 0,
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
  const [loanType, setLoanType] = useState(
    dataDefault?.LOAN_TYPE_ID ? dataDefault?.LOAN_TYPE_ID : 2
  );

  console.log("dataDefault------>", dataDefault);
  console.log("dataLoadLawSuit---->", dataLoadLawSuit);
  console.log("dataLoadLoan----->", dataLoadLoan);

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      setLawType();
      setLoadingDataCompany(true);
      console.log("loadData", dataDefault);
    }
  }, [isModal]);

  useEffect(() => {
    setOption();
  }, [companiesListCompany]);

  const setOption = () => {
    const options = companiesListCompany.map((item) => ({
      value: item.id,
      label: item.company_name,
      address: item.address,
    }));
    setCompaniesOption(options);
  };

  useEffect(() => {
    form.setFieldsValue({
      subject:
        loanType === 2 || loanType === 5
          ? "บอกกล่าวบังคับจำนอง"
          : loanType === 6
          ? "ผิดสัญญาเช่าซื้อ, สัญญาค้ำประกัน, เรียกค่าเสียหาย (ฟ้องส่วนต่าง)"
          : "ผิดสัญญาเช่าซื้อ, สัญญาค้ำประกัน, เรียกค่าเสียหาย",
    });
  }, [loanType]);

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

    let calFeeCourt;
    let calStampDuty;

    if (buttonCal) {
      console.log("values.intigationFounds--->", values.intigationFounds);

      if (values.intigationFounds <= 300000) {
        calFeeCourt = values.intigationFounds * 0.02;
        if (calFeeCourt > 1000) {
          calFeeCourt = 1000;
        }
      } else {
        calFeeCourt = values.intigationFounds * 0.02;
      }

      console.log();

      if (loanType === 1) {
        calStampDuty = values.intigationFounds / 1000;
      } else {
        calStampDuty = values.intigationFounds / 2000;
      }

      if (calStampDuty > 10000) {
        calStampDuty = 10000;
      }

      console.log("calFeeCourt", Math.round(calFeeCourt));

      if (dataForm.dateCourt) {
        form.setFieldsValue({
          feeCourt: Math.round(calFeeCourt),
          stampDuty:
            (loanType !== 2 && loanType !== 5) ||
            (values.LOAN_TYPE_ID !== 2 && values.LOAN_TYPE_ID !== 5)
              ? Math.round(calStampDuty)
              : 0,
        });
      }

      setButtonCal(false);
    }

    if (buttonSubmit) {
      const putData = {
        ...dataLoadLawSuit,
        COMPANY_ID: values.company
          ? values.company
          : dataLoadLawSuit.COMPANY_ID,
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
        delivery_of_summons:
          values?.docShipingCost &&
          typeof values.docShipingCost === "string" &&
          values.docShipingCost.includes(",")
            ? parseInt(values.docShipingCost.replace(/,/g, ""))
            : parseInt(values.docShipingCost)
            ? parseInt(values.docShipingCost)
            : 0,
        document_cost:
          values?.documentCost &&
          typeof values.documentCost === "string" &&
          values.documentCost.includes(",")
            ? parseInt(values.documentCost.replace(/,/g, ""))
            : parseInt(values.documentCost)
            ? parseInt(values.documentCost)
            : 0,
        LOAN_TYPE_ID: values.loanType,
      };

      const putStatus = {
        id: dataDefault.WORK_LOG_ID,
        USER_ID: dataDefault.LAWYER_ID,
        LOAN_ID: dataDefault.id,
        MEMO: values.memo,
        DATE: dataForm.dateCourt,
        PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
        LOAN_TYPE_ID: values.loanType,
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
        LOAN_TYPE_ID: values.loanType,
        LAW_TYPE_ID: dataDefault.LAW_TYPE_ID,
        MEMO: values.memo,
        DATE: dataForm.dateCourt,
        lossBenefit: dataForm.lossBenefit,
        suspensionAmount: dataForm.suspensionAmount,
        nopay: dataForm.nopay,
        delivery_of_summons:
          values?.docShipingCost &&
          typeof values.docShipingCost === "string" &&
          values.docShipingCost.includes(",")
            ? parseInt(values.docShipingCost.replace(/,/g, ""))
            : parseInt(values.docShipingCost)
            ? parseInt(values.docShipingCost)
            : 0,
        document_cost:
          values?.documentCost &&
          typeof values.documentCost === "string" &&
          values.documentCost.includes(",")
            ? parseInt(values.documentCost.replace(/,/g, ""))
            : parseInt(values.documentCost)
            ? parseInt(values.documentCost)
            : 0,
      }));
      console.log("putData", putData);
      console.log("status", putStatus);
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
  };

  const onChangeSuspensionAmount = (value) => {
    console.log(value);
  };

  const onChangeInpuutLossBenefit = (value) => {
    console.log(value);
  };

  const onChangeInputLitigationFunds = (value) => {
    console.log(value);
  };

  const onChangeSelectLoanType = (value) => {
    console.log(`selected ${value} `);
    setLoanType(value);
  };

  const feeCourt = (value) => {
    console.log(value);
  };

  const stampDutyCost = (value) => {
    console.log(value);
  };

  const docShipingCost = (value) => {
    console.log(value);
  };

  const documentCost = (value) => {
    console.log(value);
  };

  const handleLossPay = (value) => {
    console.log("date", value);
    let dateCurrent = dayjs(value);
    let lastPayDate = dayjs(dataLoadLoan?.LOAN?.LPAYD);
    const differenceDay = dateCurrent.diff(lastPayDate, "day");
    const differenceMonth = dateCurrent.diff(lastPayDate, "month");
    console.log("differenceDay", differenceDay);

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
        // result =
        //   balance +
        //   parseInt(lossBenefitValue) +
        //   dataForm.trackingFee -
        //   dataForm.suspensionAmount;
        result = balance;
      } else {
        balance = dataLoadLoan?.LOAN?.NCSHPRC - dataLoadLoan?.LOAN?.SMPAY;
        // result = balance + dataForm.trackingFee - dataForm.suspensionAmount;
        result = balance;
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
      let calStampDuty;

      if (loanType === 1) {
        // calStampDuty = dataLoadLoan?.LOAN?.TOTPRC / 1000;
        calStampDuty = result / 1000;
      } else {
        // calStampDuty = dataLoadLoan?.LOAN?.NCSHPRC / 2000;
        calStampDuty = result / 2000;
      }

      if (calStampDuty > 10000) {
        calStampDuty = 10000;
      }

      console.log("balance", balance);
      console.log("lossBenefitValue", lossBenefitValue);
      console.log("dataForm.trackingFee", dataForm.trackingFee);
      console.log("dataForm.suspensionAmount", dataForm.suspensionAmount);
      console.log("calFeeCourt", calFeeCourt);
      console.log("calStampDuty", Math.ceil(calStampDuty));
      console.log("calStampDuty----->", calStampDuty);

      form.setFieldsValue({
        intigationFounds: result,
        // lossBenefit: lossBenefitValue,  เปลี่ยนไปใช้ แบบ 0 ก่อน
        lossBenefit: 0,
        feeCourt: Math.round(calFeeCourt),
        stampDuty:
          loanType !== 2 || loanType !== 5 ? Math.ceil(calStampDuty) : 0,
      });

      setDataForm((prev) => ({
        ...prev,
        nopay: differenceMonth,
      }));
    }
  };

  const onChangeSelect = (value) => {
    console.log(`selected ${value} `);
  };

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
              : "ผิดสัญญาเช่าซื้อ, สัญญาค้ำประกัน, เรียกค่าเสียหาย",
          suspensionAmount: 0,
          trackingFee: 0,
          stampDuty: 0,
          docShipingCost: 0,
          documentCost: 0,
          lossBenefit: 0,
          company: dataDefault?.COMPANY_ID,
          loanType: loanType,
          interestRate: dataDefault?.LOAN_TYPE_ID === 3 ? 0.24 : 0.15,
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
        {/* <Form.Item label="ดอกเบี้ยตามวัน" name="interestRate">
          <Select
            showSearch
            name="interestRate"
            options={optionsInterest}
            style={{ width: "auto" }}
            placeholder="เลือกอัตราดอกเบี้ย"
            optionFilterProp="value"
            popupMatchSelectWidth={false}
            defaultValue={dataDefault?.LOAN_TYPE_ID === 3 ? 0.24 : 0.15}
          />
        </Form.Item> */}
        <Form.Item
          label="บริษัทที่ส่งคำฟ้อง"
          name="company"
          rules={[
            {
              required: true,
              message: "โปรดเลือกข้อมูล",
            },
          ]}
        >
          <Select
            popupMatchSelectWidth={false}
            style={{
              width: "auto",
            }}
            placeholder="เลือกบริษัท"
            showSearch
            optionFilterProp="label"
            options={companiesOption}
            onChange={(value) => onChangeSelect(value)}
          />
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
        <Form.Item
          label="ความ"
          name="loanType"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกประเภทสัญญา",
            },
          ]}
        >
          <Select
            popupMatchSelectWidth={false}
            style={{
              width: "auto",
            }}
            placeholder="โปรดเลือกประเภทสัญญา"
            showSearch
            optionFilterProp="label"
            options={optionsLone}
            onChange={(value) => onChangeSelectLoanType(value)}
          />
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
          <InputNumber
            suffix="บาท"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            size="large"
            placeholder="กรุณาใส่ค่าติดตาม !"
            style={{ width: "100%", color: "black" }}
            onChange={(value) => onChangeTrackingFee(value)}
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
          <InputNumber
            suffix="บาท"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            size="large"
            placeholder="หากไม่มีให้ใส่ 0 !"
            style={{ width: "100%", color: "black" }}
            onChange={(value) => onChangeSuspensionAmount(value)}
          />
        </Form.Item>

        {dataForm.dateCourt ? (
          <>
            <Form.Item label="จ่ายล่าสุด" name="noPay">
              <p>{convertDateThai(dataLoadLoan?.LOAN?.LPAYD)}</p>
            </Form.Item>
            <Form.Item label="ยอดกู้" name="principle">
              <p>{currencyFormatComma(dataLoadLoan?.LOAN?.NCSHPRC)} บาท</p>
            </Form.Item>
            <Form.Item label="ยอดกู้รวมดอก" name="principle">
              <p>{currencyFormatComma(dataLoadLoan?.LOAN?.TOTPRC)} บาท</p>
            </Form.Item>
            <Form.Item label="ยอดที่จ่ายมาทั้งหมด" name="sumaryPay">
              <p>{currencyFormatComma(dataLoadLoan?.LOAN?.SMPAY) + " บาท"}</p>
            </Form.Item>
            <Form.Item label="เงินค้างจ่าย ≈" name="balance">
              <p>
                {loanType !== 2 || loanType !== 5
                  ? currencyFormatComma(
                      dataLoadLoan?.LOAN?.TOTPRC - dataLoadLoan?.LOAN?.SMPAY
                    ) + " บาท"
                  : currencyFormatComma(
                      dataLoadLoan?.LOAN?.NCSHPRC - dataLoadLoan?.LOAN?.SMPAY
                    ) + " บาท"}
              </p>
            </Form.Item>
            {loanType === 1 || loanType === 4 || loanType === 6 ? (
              <Form.Item label="ค่าขาดประโยชน์" name="lossBenefit">
                <InputNumber
                  suffix="บาท"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="large"
                  placeholder="กรุณาใส่ค่าขาดประโยชน์"
                  style={{ width: "100%", color: "black" }}
                  onChange={(value) => onChangeInpuutLossBenefit(value)}
                />
              </Form.Item>
            ) : null}
            {/* <Form.Item label="คำนวณทุนทรัพย์โดยประมาณ">
              <Button
                style={{ color: "blue" }}
                htmlType="submit"
                onClick={() => setButtonCalFounds(true)}
              >
                คำนวณ
              </Button>
            </Form.Item> */}
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
              <InputNumber
                suffix="บาท"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                size="large"
                placeholder="กรุณาใส่จำนวนทุนทรัพย์"
                style={{ width: "100%", color: "black" }}
                onChange={(value) => onChangeInputLitigationFunds(value)}
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
              <InputNumber
                suffix="บาท"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                size="large"
                placeholder="กรุณาใส่ค่าธรรมเนียมศาล"
                style={{ width: "100%", color: "black" }}
                onChange={(value) => feeCourt(value)}
              />
            </Form.Item>
            {loanType === 1 ||
            loanType === 3 ||
            loanType === 4 ||
            loanType === 6 ? (
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
                <InputNumber
                  suffix="บาท"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="large"
                  placeholder="กรุณาใส่ค่าค่าอากรสแตมป์"
                  style={{ width: "100%", color: "black" }}
                  onChange={(value) => stampDutyCost(value)}
                />
              </Form.Item>
            ) : null}
            <Form.Item
              label="ค่าส่งหมาย"
              name="docShipingCost"
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกค่าส่งหมาย !",
                },
              ]}
            >
              <InputNumber
                suffix="บาท"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                size="large"
                placeholder="กรุณากรอกค่าส่งหมาย"
                style={{ width: "100%", color: "black" }}
                onChange={(value) => docShipingCost(value)}
              />
            </Form.Item>
            <Form.Item
              label="ค่าจัดทำเอกสาร"
              name="documentCost"
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกค่าจัดทำเอกสาร !",
                },
              ]}
            >
              <InputNumber
                suffix="บาท"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                size="large"
                placeholder="กรุณากรอกจัดทำเอกสารไม่มีใส่ 0"
                style={{ width: "100%", color: "black" }}
                onChange={(value) => documentCost(value)}
              />
            </Form.Item>
            <Form.Item label="คำนวณค่าธรรมเนียม">
              <Button
                style={{ color: "blue" }}
                htmlType="submit"
                onClick={() => setButtonCal(true)}
              >
                คำนวณ
              </Button>
            </Form.Item>
          </>
        ) : null}

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
        // onOk={handleOk}
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
