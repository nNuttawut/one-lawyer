import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Modal,
  Card,
  message,
  Spin,
  Radio,
  Tabs,
  Tooltip,
  Checkbox,
  Space,
} from "antd";
import {
  baseUrl,
  GET_LOAN_BY_CONTNO,
  GET_WORK_LOG_DETAIL_BY_ID,
  HEADERS_EXPORT,
  POST_AGREEMENTS,
  POST_JUDGE,
  POST_JUDGE_DEFENDANTS,
  POST_STATUS,
  PUT_LAWSUIT_DETAIL,
  PUT_STATUS,
  GET_JUDGE_BY_ID,
  GET_JUDGE_DEFENDANTS_BY_ID,
} from "../../../API/apiUrls";
import axios from "axios";

import CurrencyFormat from "../../../../hook/CurrencyFormat";
import { optionsInterest } from "../../../../utils/constant/ Interest";
import CheckGovermentOfficer from "../../../../hook/CeckGovermentOfficer";
import { optionsMonth } from "../../../../utils/constant/MonthSelect";
import {
  JUDGEMENT,
  PAYMENT,
  STATUS_PROCESS_PROGRESS,
} from "../../../../utils/constant/StatusConstant";
import dayjs from "dayjs";

const EditAwaitingJudgement = ({
  open,
  close,
  dataDefualt,
  funcUpdateStatus,
}) => {
  const [setupGovernmentOfficerList, governmentOfficers] =
    CheckGovermentOfficer();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const { TextArea } = Input;
  const [dataStore, setDataStore] = useState();
  const [checkLenght, setCheckLenght] = useState([]);
  const [preData, setPreData] = useState({
    considerationDate: null,
    dateAgreement: null,
  });
  const [defaultRadio, setDefaultRadio] = useState("normal");
  const [arrow, setArrow] = useState("Show");
  const [tabsKey, setTabsKey] = useState("1");
  const [checkboxTab1, setCheckBoxTab1] = useState({});
  const [checkboxTab2, setCheckBoxTab2] = useState({});
  const [currencyFormatNoPoint, currencyFormatComma, currencyFormatPoint] =
    CurrencyFormat();
  const [dataJudgement, setDataJudgement] = useState(null);
  const [dataJudgeDefendants, setDataJudgeDefendants] = useState(null);

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();

      console.log("loadData", dataDefualt);
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
  }, [arrow]);

  const handleOk = () => {};

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  useEffect(() => {
    if (dataJudgement && dataJudgeDefendants) {
      let judgeNumber1 = dataJudgeDefendants.filter(
        (item) => item.judge_number === 1
      );
      let judgeNumber2 = dataJudgeDefendants.filter(
        (item) => item.judge_number === 2
      );

      console.log("judgeNumber1", judgeNumber1);

      form.setFieldsValue({
        redNumber: dataJudgement?.red_case_number,
        judgement1: currencyFormatNoPoint(dataJudgement?.judgement),
        costUnless1: currencyFormatNoPoint(
          judgeNumber1[0]?.cost_of_uselessness
        ),
        interestRate: dataJudgement?.interest_rate,
        costPermonth1: currencyFormatNoPoint(
          judgeNumber1[0]?.cost_of_useleseness_per_month
        ),
        costMonth1: judgeNumber1[0]?.cost_of_useleseness_month,
        trackingFeeEnforce: currencyFormatNoPoint(dataJudgement?.tracking_fee),
        lawyerFeeEnforce: currencyFormatNoPoint(dataJudgement?.attorney_fees),
        judgementFile: dataJudgement?.judgement_filepath,
        costUnless2: currencyFormatNoPoint(
          judgeNumber2[0]?.cost_of_uselessness
        ),
        costPermonth2: currencyFormatNoPoint(
          judgeNumber2[0]?.cost_of_useleseness_per_month
        ),
        costMonth2: judgeNumber2[0]?.cost_of_useleseness_month,
      });
    }
  }, [dataJudgement, dataJudgeDefendants]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [worklogs, loanRes, judgement, judgeDefendants] = await Promise.all(
        [
          axios.get(
            `${baseUrl}${GET_WORK_LOG_DETAIL_BY_ID}${dataDefualt.WORK_LOG_ID}`,
            {
              headers: HEADERS_EXPORT,
            }
          ),
          axios.get(`${baseUrl}${GET_LOAN_BY_CONTNO}${dataDefualt.CONTNO}`, {
            headers: HEADERS_EXPORT,
          }),
          axios.get(`${baseUrl}${GET_JUDGE_BY_ID}${dataDefualt.LAWSUIT_ID}`, {
            headers: HEADERS_EXPORT,
          }),
          axios.get(
            `${baseUrl}${GET_JUDGE_DEFENDANTS_BY_ID}${dataDefualt.LAWSUIT_ID}`,
            {
              headers: HEADERS_EXPORT,
            }
          ),
        ]
      );

      if (worklogs.status === 200) {
        setDataLoadLawSuit(worklogs.data);
        setDataStore(worklogs.data);
        console.log("worklogs.data---->", worklogs.data);
      } else {
        message.error("ไม่พบข้อมูลคดี");
      }

      if (loanRes.status === 200) {
        console.log("loanRes", loanRes.data);
        setDataLoadLoan(loanRes.data);
        setupGovernmentOfficerList(loanRes.data);
        listGovermentList(loanRes.data);
        console.log("loanRes.data---->", loanRes.data);
      } else {
        message.error("ไม่พบข้อมูลเงิน");
      }

      if (judgement.status === 200) {
        setDataJudgement(judgement.data);
        console.log("judge.data---->", judgement.data);
      } else {
        message.error("ไม่พบข้อมูลเงิน");
      }

      if (judgeDefendants.status === 200) {
        setDataJudgeDefendants(judgeDefendants.data);
        console.log("judgeDefendants.data---->", judgeDefendants.data);
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

  const sendStatus = async (
    status,
    putData,
    defendants,
    judgement,
    agreement
  ) => {
    setLoading(true);

    try {
      if (defaultRadio === "normal" || defaultRadio === "payment") {
        console.log("status----> normal,payment", status);
        await axios
          .post(baseUrl + POST_STATUS, status, { headers: HEADERS_EXPORT })
          .then(async (res) => {
            if (res.status === 201) {
              console.log("resQuery", res.data);
              let statusSend;
              if (defaultRadio === "normal") {
                statusSend = JUDGEMENT;
              } else {
                statusSend = PAYMENT;
              }
              funcUpdateStatus({
                ...dataDefualt,
                MAIN_STATUS_ID: statusSend,
              });
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
          });
      } else {
        console.log("status---->", status);
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
            console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
          });
      }
      if (defaultRadio === "normal") {
        console.log("normal---> defendants", defendants);
        console.log("data", judgement);
        await axios
          .post(baseUrl + POST_JUDGE, judgement, { headers: HEADERS_EXPORT })
          .then(async (res) => {
            if (res.status === 201) {
              console.log("resQuery", res.data);
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
          });
        const promises = defendants.map(async (item) => {
          let arrayData = item;
          await axios
            .post(baseUrl + POST_JUDGE_DEFENDANTS, arrayData, {
              headers: HEADERS_EXPORT,
            })
            .then(async (res) => {
              if (res.status === 201) {
                console.log("resQuery", res.data);
              } else {
                message.error("ไม่สามารถส่งข้อมูลได้");
                console.log("ไม่สามารถส่งข้อมูลได้");
                setLoading(false);
              }
            })
            .catch((err) => {
              console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
            });
          const results = await Promise.all(promises);
          console.log("results promise", results);
        });
      } else if (defaultRadio === "postponed") {
        console.log("postpone--->", putData);
        await axios
          .put(baseUrl + PUT_LAWSUIT_DETAIL, putData, {
            headers: HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 200) {
              console.log("resQuery", res.data);
              message.success("อัพเดทข้อมูลสำเร็จ");
              funcUpdateStatus({
                ...dataDefualt,
                DATE: putData.consideration_date,
              });
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
          });
      } else {
        console.log("agreement", agreement);
        await axios
          .post(baseUrl + POST_AGREEMENTS, agreement, {
            headers: HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 201) {
              console.log("resQuery", res.data);
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
          });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
      // window.location.reload();
    }
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    let putDataLawSuit;
    let statusData;
    let defendants = [];
    let judgementData;
    let agreement;

    console.log("defendants", defendants);

    if (defaultRadio === "postponed") {
      statusData = {
        WORK_LOG_ID: dataDefualt.WORK_LOG_ID,
        MEMO: values.memo,
        DATE: preData.considerationDate,
        USER_ID: dataDefualt.LAWYER_ID,
        LOAN_ID: dataDefualt.id,
      };
      putDataLawSuit = {
        ...dataLoadLawSuit.lawsuit,
        consideration_date: preData.considerationDate,
      };
    } else if (defaultRadio === "normal") {
      const govermentResult1 = values.governmentOfficer1.filter((item) => item);
      const govermentfinal1 = govermentResult1.map((item) => ({
        LAWSUIT_ID: dataLoadLawSuit.lawsuit.id,
        CUSTOMER_ID: item.id,
        defendant_number: item.GARNO + 1,
        cost_of_uselessness: values.costUnless1
          ? parseInt(values.costUnless1.replace(/,/g, ""))
          : null,
        cost_of_useleseness_per_month: values.costPermonth1
          ? parseInt(values.costPermonth1.replace(/,/g, ""))
          : null,
        cost_of_useleseness_month: values.costMonth1,
        judge_number: 1,
      }));
      defendants.push(...govermentfinal1);

      const govermentResult2 = values.governmentOfficer2.filter((item) => item);
      const govermentfinal2 = govermentResult2.map((item) => ({
        LAWSUIT_ID: dataLoadLawSuit.lawsuit.id,
        CUSTOMER_ID: item.id,
        defendant_number: item.GARNO + 1,
        cost_of_uselessness: values.costUnless2
          ? parseInt(values.costUnless2.replace(/,/g, ""))
          : null,
        cost_of_useleseness_per_month: values.costPermonth2
          ? parseInt(values.costPermonth2.replace(/,/g, ""))
          : null,
        cost_of_useleseness_month: values.costMonth2,
        judge_number: 2,
      }));

      defendants.push(...govermentfinal2);
      statusData = {
        USER_ID: dataDefualt.LAWYER_ID,
        LOAN_ID: dataDefualt.id,
        LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
        LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
        MEMO: values.memo,
        DATE: dayjs(dataDefualt.DATE).format("YYYY-MM-DD"),
        MAIN_STATUS_ID: JUDGEMENT,
        PROCESS_ID: STATUS_PROCESS_PROGRESS,
      };
      judgementData = {
        LAWSUIT_ID: dataLoadLawSuit.lawsuit.id,
        red_case_number: values.redNumber,
        judgement: parseInt(values.judgement1.replace(/,/g, "")),
        judgement_filepath: values.judgementFile,
        interest_rate: values.interestRate,
        final_case_date: null,
        final_case_filepath: null,
        suspension_amount: dataLoadLawSuit.lawsuit.suspension_amount,
        tracking_fee: dataLoadLawSuit.lawsuit.tracking_fee,
        fee: dataLoadLawSuit.lawsuit.fee,
        enforce_case_date: null,
        enforce_case_filepath: null,
        attorney_fees: values.lawyerFeeEnforce
          ? parseInt(values.lawyerFeeEnforce.replace(/,/g, ""))
          : null,
      };
    } else {
      statusData = {
        USER_ID: dataDefualt.LAWYER_ID,
        LOAN_ID: dataDefualt.id,
        LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
        LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
        MEMO: values.memo,
        DATE: preData.dateAgreement,
        MAIN_STATUS_ID: PAYMENT,
        PROCESS_ID: STATUS_PROCESS_PROGRESS,
      };
      agreement = {
        LAWSUIT_ID: dataLoadLawSuit.lawsuit.id,
        total_amount: parseInt(values.paymentAmount.replace(/,/g, "")),
        installment_amount: parseInt(
          values.paymentPerMonthAmount.replace(/,/g, "")
        ),
        installment_count: values.costMonth3,
        document_filepath: values.paymentFile,
        mark: values.memo,
        due_date: preData.dateAgreement,
        already_paid: null,
        payment_status: null,
        payment_status_date: null,
        negotiator_id: dataDefualt.LAWYER_ID,
        NEW_CONTNO: values.newContno ? values.newContno : null,
      };
    }

    console.log("putStatus", statusData);
    console.log("putData", putDataLawSuit);
    console.log("defendants", defendants);
    console.log("judgementData", judgementData);
    console.log("agreement", agreement);

    sendStatus(
      statusData,
      putDataLawSuit,
      defendants,
      judgementData,
      agreement
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputRedNumber = (value) => {
    console.log(value);
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const onChangeJudgement = (value) => {
    console.log(value);
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        judgement1: formattedValue,
      });
    } else {
      form.setFieldsValue({
        judgement1: inputValue,
      });
    }
  };

  const onChangPaymentAmount = (value) => {
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        paymentAmount: formattedValue,
      });
    } else {
      form.setFieldsValue({
        paymentAmount: inputValue,
      });
    }
  };

  const onChangeInputCost1 = (value) => {
    console.log(value);
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        costUnless1: formattedValue,
      });
    } else {
      form.setFieldsValue({
        costUnless1: inputValue,
      });
    }
  };

  const onChangeInputCost2 = (value) => {
    console.log(value);
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        costUnless2: formattedValue,
      });
    } else {
      form.setFieldsValue({
        costUnless2: inputValue,
      });
    }
  };

  const onChangecostPermonth1 = (value) => {
    console.log(value);
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        costPermonth1: formattedValue,
      });
    } else {
      form.setFieldsValue({
        costPermonth1: inputValue,
      });
    }
  };

  const onChangPaymentPerMonthAmount = (value) => {
    console.log(value);
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        paymentPerMonthAmount: formattedValue,
      });
    } else {
      form.setFieldsValue({
        paymentPerMonthAmount: inputValue,
      });
    }
  };

  const onChangecostPermonth2 = (value) => {
    console.log(value);
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        costPermonth2: formattedValue,
      });
    } else {
      form.setFieldsValue({
        costPermonth2: inputValue,
      });
    }
  };

  const onChangTrackingFeeEnforce = (value) => {
    console.log(value);
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        trackingFeeEnforce: formattedValue,
      });
    } else {
      form.setFieldsValue({
        trackingFeeEnforce: inputValue,
      });
    }
  };

  const onChangLawyerFeeEnforce = (value) => {
    console.log(value);
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        lawyerFeeEnforce: formattedValue,
      });
    } else {
      form.setFieldsValue({
        lawyerFeeEnforce: inputValue,
      });
    }
  };

  const onChangeJudgementFile = (value) => {
    console.log(value);
  };

  const onChangePaymentFile = (value) => {
    console.log(value);
  };

  const onChangeNewContno = (value) => {
    console.log(value);
  };

  function isNotNumber(value) {
    const regex = /^\d+$/; // กำหนดให้ตรงกับตัวเลขทั้งหมด
    if (!regex.test(value)) {
      message.error("กรุณากรอกข้อมูลเป็นตัวเลขเท่านั้น");
    }
  }

  const onChange = (e) => {
    setDefaultRadio(e.target.value);
    console.log(e.target.value);
  };

  const onChangeDate = (date, dateString) => {
    console.log(date, dateString);
    setPreData({ ...preData, considerationDate: dateString });
  };

  const onChangeDateAgreement = (date, dateString) => {
    console.log(date, dateString);
    setPreData({ ...preData, dateAgreement: dateString });
  };

  const buttonCustom = () => {
    return (
      <div style={{ textAlign: "center" }}>
        {defaultRadio === "normal" ? (
          <Button
            style={{ color: "blue", marginRight: "20px" }}
            onClick={() => {
              setTabsKey("1");
            }}
          >
            ย้อนกลับ
          </Button>
        ) : null}
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
    );
  };

  const buttonCustomNext = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={handleCancel}
          style={{ color: "red", marginRight: "20px" }}
        >
          ปิด
        </Button>
        <Button
          style={{ color: "blue" }}
          htmlType="submit"
          onClick={() => {
            setTabsKey("2");
          }}
        >
          ถัดไป
        </Button>
      </div>
    );
  };

  const listGovermentList = (data) => {
    if (data) {
      if (data?.GUARANTORS) {
        const listLength = data?.GUARANTORS?.filter((item) => item);
        console.log("listLength", listLength.length);
        setCheckLenght(listLength.length);
      }
    }
  };

  const onChangeGovermentOfficer = (checkedValues) => {
    console.log("checked = ", checkedValues);
    // setGovernmentOfficerLength(checkedValues.length);
    if (tabsKey === "1") {
      setCheckBoxTab1(checkedValues);
    } else {
      setCheckBoxTab2(checkedValues);
    }
    console.log("checkboxTrap1", checkboxTab1);
    console.log("checkboxTrap2", checkboxTab2);
  };

  const handleCheckBoxGroupGoverment = () => {
    let checker;
    if (checkLenght && dataJudgeDefendants) {
      checker = dataJudgeDefendants.map((item) => ({
        judgeNumber: item.judge_number,
        customerId: item.CUSTOMER_ID,
      }));

      // console.log(checker);
      // console.log(governmentOfficers);

      return (
        <>
          <Checkbox.Group onChange={onChangeGovermentOfficer}>
            <Space direction="vertical" style={{ marginTop: "5px" }}>
              {tabsKey === "1" ? (
                <Checkbox value={governmentOfficers}>
                  {governmentOfficers
                    ? `จำเลยที่ 1 ${governmentOfficers?.SNAM} ${governmentOfficers?.NAME1} ${governmentOfficers?.NAME2}`
                    : "-"}
                </Checkbox>
              ) : null}
              {checkLenght > 0 ? (
                <Checkbox value={governmentOfficers?.guarantors[0]}>
                  {governmentOfficers?.guarantors?.length > 0
                    ? `จำเลยที่ 2 ${governmentOfficers?.guarantors[0]?.SNAM} ${governmentOfficers?.guarantors[0]?.NAME1} ${governmentOfficers?.guarantors[0]?.NAME2}`
                    : "ไม่มีจำเลยที่ 2"}
                </Checkbox>
              ) : null}
              {checkLenght > 1 ? (
                <Checkbox value={governmentOfficers?.guarantors[1]}>
                  {governmentOfficers?.guarantors?.length > 1
                    ? `จำเลยที่ 3 ${governmentOfficers?.guarantors[1]?.SNAM} ${governmentOfficers?.guarantors[1]?.NAME1} ${governmentOfficers?.guarantors[1]?.NAME2}`
                    : "ไม่มีจำเลยที่ 3"}
                </Checkbox>
              ) : null}
              {checkLenght > 2 ? (
                <Checkbox value={governmentOfficers?.guarantors[2]}>
                  {governmentOfficers?.guarantors?.length > 2
                    ? `จำเลยที่ 4 ${governmentOfficers?.guarantors[2]?.SNAM} ${governmentOfficers?.guarantors[2]?.NAME1} ${governmentOfficers?.guarantors[2]?.NAME2}`
                    : "ไม่มีจำเลยที่ 4"}
                </Checkbox>
              ) : null}
            </Space>
            <Space direction="vertical" style={{ marginTop: "5px" }}>
              {checkLenght > 3 ? (
                <Checkbox value={governmentOfficers?.guarantors[3]}>
                  {governmentOfficers?.guarantors?.length > 3
                    ? `จำเลยที่ 5 ${governmentOfficers?.guarantors[3]?.SNAM} ${governmentOfficers?.guarantors[3]?.NAME1} ${governmentOfficers?.guarantors[3]?.NAME2}`
                    : "ไม่มีจำเลยที่ 5"}
                </Checkbox>
              ) : null}
              {checkLenght > 4 ? (
                <Checkbox
                  value={governmentOfficers?.guarantors[4]}
                  disabled="false"
                >
                  {governmentOfficers?.guarantors?.length > 4
                    ? `จำเลยที่ 6 ${governmentOfficers?.guarantors[4]?.SNAM} ${governmentOfficers?.guarantors[4]?.NAME1} ${governmentOfficers?.guarantors[4]?.NAME2}`
                    : "ไม่มีจำเลยที่ 6"}
                </Checkbox>
              ) : null}
              {checkLenght > 5 ? (
                <Checkbox value={governmentOfficers?.guarantors[5]}>
                  {governmentOfficers?.guarantors?.length > 5
                    ? `จำเลยที่ 7 ${governmentOfficers?.guarantors[5]?.SNAM} ${governmentOfficers?.guarantors[5]?.NAME1} ${governmentOfficers?.guarantors[5]?.NAME2}`
                    : "ไม่มีจำเลยที่ 7"}
                </Checkbox>
              ) : null}
              {checkLenght > 6 ? (
                <Checkbox value={governmentOfficers?.guarantors[6]}>
                  {governmentOfficers?.guarantors?.length > 6
                    ? `จำเลยที่ 8 ${governmentOfficers?.guarantors[6]?.SNAM} ${governmentOfficers?.guarantors[6]?.NAME1} ${governmentOfficers?.guarantors[6]?.NAME2}`
                    : "ไม่มีจำเลยที่ 8"}
                </Checkbox>
              ) : null}
            </Space>
          </Checkbox.Group>
        </>
      );
    } else {
      return null;
    }
  };

  const formJudge1 = () => {
    return (
      <Card>
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
            costUnless1: null,
            interest: null,
            costPermonth1: null,
            costMonth1: null,
            trackingFeeEnforce: null,
            lawyerFeeEnforce: null,
            costUnless2: null,
            costPermonth2: null,
            costMonth2: null,
            judgement2: null,
          }}
        >
          <Form.Item
            label="เลขคดีแดง"
            name="redNumber"
            rules={[
              {
                required: true,
                message: "กรุณาพิมพ์เลขคดีแดง !",
              },
            ]}
          >
            <Input onChange={(e) => onChangeInputRedNumber(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="คำพิพากษา"
            name="judgement1"
            rules={[
              {
                required: true,
                message: "กรุณาใส่คำพิพากษา !",
              },
            ]}
          >
            <Input
              name="judgement1"
              onChange={(e) => onChangeJudgement(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="ค่าขาดประโยชน์" name="costUnless1">
            <Input
              name="costUnless1"
              onChange={(e) => onChangeInputCost1(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="ดอกเบี้ยคำพิพากษา" name="interestRate">
            <Select name="interestRate" options={optionsInterest} />
          </Form.Item>
          <Form.Item label="ค่าขาดประโยชน์เดือนละ" name="costPermonth1">
            <Input
              name="costPermonth1"
              onChange={(e) => onChangecostPermonth1(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="จำนวนกี่เดือน" name="costMonth1">
            <Select type="number" name="costMonth1" options={optionsMonth} />
          </Form.Item>
          <Form.Item label="ค่าติดตาม" name="trackingFeeEnforce">
            <Input
              name="trackingFeeEnforce"
              onChange={(e) => onChangTrackingFeeEnforce(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="ค่าทนายความ" name="lawyerFeeEnforce">
            <Input
              name="lawyerFeeEnforce"
              onChange={(e) => onChangLawyerFeeEnforce(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="ไฟล์คำพิพากษา"
            name="judgementFile"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ url ของคำพิพากษาจากไฟล์กลาง !",
              },
            ]}
          >
            <Input
              name="judgementFile"
              onChange={(e) => onChangeJudgementFile(e.target.value)}
            />
          </Form.Item>

          <Tooltip
            placement="bottom"
            title="เลือกจำเลยที่โดนพิพากษาในคำตัดสินนี้ !"
            arrow={mergedArrow}
          >
            <Form.Item
              label="จำเลยที่ร่วมคำพิพากษานี้"
              name="governmentOfficer1"
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกจำเลย !",
                },
              ]}
            >
              {handleCheckBoxGroupGoverment()}
            </Form.Item>
          </Tooltip>
          <Form.Item label="หมายเหตุ" name="memo">
            <TextArea
              rows={5}
              onChange={(e) => onChangeInputMemo(e.target.value)}
            />
          </Form.Item>
          {buttonCustomNext()}
        </Form>
      </Card>
    );
  };

  const formJudge2 = () => {
    return (
      <Card>
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
        >
          <Form.Item label="ค่าขาดประโยชน์" name="costUnless2">
            <Input
              name="costUnless2"
              onChange={(e) => onChangeInputCost2(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="ค่าขาดประโยชน์เดือนละ" name="costPermonth2">
            <Input
              name="costPermonth2"
              onChange={(e) => onChangecostPermonth2(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="จำนวนกี่เดือน" name="costMonth2">
            <Select type="number" name="costMonth2" options={optionsMonth} />
          </Form.Item>

          <Tooltip
            placement="bottom"
            title="เลือกจำเลยที่โดนพิพากษาในคำตัดสินนี้ !"
            arrow={mergedArrow}
          >
            <Form.Item
              label="จำเลยที่ร่วมคำพิพากษานี้"
              name="governmentOfficer2"
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกจำเลย !",
                },
              ]}
            >
              {handleCheckBoxGroupGoverment()}
            </Form.Item>
          </Tooltip>
          <Form.Item label="หมายเหตุ" name="memo">
            <TextArea
              rows={5}
              onChange={(e) => onChangeInputMemo(e.target.value)}
            />
          </Form.Item>
          {buttonCustom()}
        </Form>
      </Card>
    );
  };

  const formDataPostponed = () => {
    return (
      <Card>
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
        >
          <Form.Item
            label="วันนัดพิจารณาคดีใหม่"
            name="considerationDate"
            rules={[
              {
                required: true,
                message: "โปรดเลือกวันที่เลื่อนนัด",
              },
            ]}
          >
            <DatePicker onChange={onChangeDate} />
          </Form.Item>
          <Form.Item label="หมายเหตุ" name="memo">
            <TextArea
              rows={5}
              onChange={(e) => onChangeInputMemo(e.target.value)}
            />
          </Form.Item>
          {buttonCustom()}
        </Form>
      </Card>
    );
  };

  const formDataPayment = () => {
    return (
      <Card>
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
        >
          <Form.Item
            label="เลขสัญญาใหม่"
            name="newContno"
            // rules={[
            //   {
            //     required: true,
            //     message: "กรุณาใส่สัญญาใหม่ !",
            //   },
            // ]}
          >
            <Input
              name="newContno"
              onChange={(e) => onChangeNewContno(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="ยินยอมชำระเงินจำนวน"
            name="paymentAmount"
            rules={[
              {
                required: true,
                message: "กรุณาใส่เงินต้นที่ทำยอม",
              },
            ]}
          >
            <Input
              name="paymentAmount"
              onChange={(e) => onChangPaymentAmount(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="งวดละไม่น้อยกว่า"
            name="paymentPerMonthAmount"
            rules={[
              {
                required: true,
                message: "กรุณาใส่เงินที่ต้องชำระรายเดือน",
              },
            ]}
          >
            <Input
              name="paymentMonthAmount"
              onChange={(e) => onChangPaymentPerMonthAmount(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="จำนวนกี่เดือน"
            name="costMonth3"
            rules={[
              {
                required: true,
                message: "กรุณาใส่จำนวนงวด",
              },
            ]}
          >
            <Select type="number" name="costMonth3" options={optionsMonth} />
          </Form.Item>

          <Form.Item
            label="ไฟล์ทำยอม"
            name="paymentFile"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ url ของคำพิพากษาจากไฟล์กลาง !",
              },
            ]}
          >
            <Input
              name="paymentFile"
              onChange={(e) => onChangePaymentFile(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="วันนัดชำระครั้งแรก"
            name="dateAgreement"
            rules={[
              {
                required: true,
                message: "โปรดเลือกวันที่นัดชำระ",
              },
            ]}
          >
            <DatePicker onChange={onChangeDateAgreement} />
          </Form.Item>
          <Form.Item label="หมายเหตุ" name="memo">
            <TextArea
              rows={5}
              onChange={(e) => onChangeInputMemo(e.target.value)}
            />
          </Form.Item>
          {buttonCustom()}
        </Form>
      </Card>
    );
  };

  const onChangeTabs = (key) => {
    console.log(key);
    setTabsKey(key);
  };

  const items = [
    {
      key: "1",
      label: "คำพิพากษาจำเลยที่ ๑",
      children: formJudge1(),
    },
    {
      key: "2",
      label: "คำพิพากษาจำเลยถัดไป",
      children: formJudge2(),
    },
  ];

  return (
    <>
      <Modal
        title={`อัพเดทสถานะ ${dataDefualt?.CONTNO}/${dataDefualt?.CUSTOMER_TNAME}
        ${dataDefualt?.CUSTOMER_FNAME} ${dataDefualt?.CUSTOMER_LNAME}`}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Radio.Group
            onChange={onChange}
            defaultValue="normal"
            value={defaultRadio}
            style={{ margin: "10px" }}
          >
            <Radio value="normal">ปกติ</Radio>
            <Radio value="postponed">เลื่อนวันนัดพิจารณาคดี</Radio>
            <Radio value="payment">ทำยอม</Radio>
          </Radio.Group>
          {defaultRadio === "postponed" ? (
            formDataPostponed()
          ) : defaultRadio === "normal" ? (
            <Tabs activeKey={tabsKey} onChange={onChangeTabs} centered>
              {items.map((item) => (
                <Tabs.TabPane tab={item.label} key={item.key}>
                  {item.children}
                </Tabs.TabPane>
              ))}
            </Tabs>
          ) : (
            formDataPayment()
          )}
        </Spin>
      </Modal>
    </>
  );
};
export default EditAwaitingJudgement;
