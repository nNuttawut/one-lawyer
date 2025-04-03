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
  Col,
  Row,
  InputNumber,
  Upload,
  Popconfirm,
} from "antd";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_ID,
  GET_LOAN_BY_CONTNO,
  GET_WORK_LOG_DETAIL_BY_ID,
  HEADERS_EXPORT,
  POST_AGREEMENTS,
  POST_JUDGE,
  POST_JUDGE_DEFENDANTS,
  POST_STATUS,
  PUT_LAWSUIT_DETAIL,
  PUT_STATUS,
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
  PARAM_PUBLIC,
  FINISH,
  WITHDRAW_CASE,
} from "../../../../utils/constant/StatusConstant";
import dayjs from "dayjs";
import LoadLawyers from "../../../../hook/LoadLawyers";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import {
  STATUS_FINAL_CASE,
  STATUS_JUDGEMENT,
  STATUS_JUDGEMENT_AND_AGREEMENT,
  STATUS_REFINANCE_CASE,
  STATUS_WITHDRAW_CASE,
} from "../../../../utils/constant/StatusCommission";

const UpdateStatus = ({ open, close, dataDefualt, funcUpdateStatus }) => {
  const [setupGovernmentOfficerList, governmentOfficers] =
    CheckGovermentOfficer();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [form] = Form.useForm();
  const [lawyersList, setLoadingData] = LoadLawyers();
  const COMPANY = parseInt(localStorage.getItem("COMPANY_ID"));
  const [assistantOption, setAssistantOption] = useState();
  const [loading, setLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const { TextArea } = Input;
  const [dataStore, setDataStore] = useState();
  const [preData, setPreData] = useState({
    considerationDate: null,
    dateAgreement: null,
  });
  const [defaultRadio, setDefaultRadio] = useState("normal");
  const [radioDecide, setRadioDecide] = useState();
  const [radioFinish, setRadioFinish] = useState();
  const [arrow, setArrow] = useState("Show");
  const [tabsKey, setTabsKey] = useState("1");
  const [checkboxTab1, setCheckBoxTab1] = useState({});
  const [checkboxTab2, setCheckBoxTab2] = useState({});
  const [fileList, setFileList] = useState([]);
  const [dataLawsuit, setDataLawsuit] = useState(null);

  console.log("governmentOfficers", governmentOfficers);

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      setLoadingData(true);
      console.log("loadData", dataDefualt);
    }
  }, [isModal]);

  useEffect(() => {
    if (lawyersList) {
      setOptionAssistant();
    }
  }, [lawyersList]);

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

  const handleOk = () => {
    console.log("ดำเนินการบันทึก");
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [worklogs, loanRes, lawsuit] = await Promise.all([
        axios.get(
          `${baseUrl}${GET_WORK_LOG_DETAIL_BY_ID}${dataDefualt.WORK_LOG_ID}`,
          {
            headers: HEADERS_EXPORT,
          }
        ),
        axios.get(`${baseUrl}${GET_LOAN_BY_CONTNO}${dataDefualt.CONTNO}`, {
          headers: HEADERS_EXPORT,
        }),
        axios.get(
          `${baseUrl}${GET_LAWSUIT_DETAIL_BY_ID}${dataDefualt.LAWSUIT_ID}`,
          {
            headers: HEADERS_EXPORT,
          }
        ),
      ]);

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

        console.log("loanRes.data---->", loanRes.data);
      } else {
        message.error("ไม่พบข้อมูลเงิน");
      }

      if (lawsuit.status === 200) {
        console.log("lawsuit.status", lawsuit.data);
        setDataLawsuit(lawsuit.data);

        console.log("loanRes.data---->", loanRes.data);
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

  const setOptionAssistant = () => {
    console.log("lawyersList", lawyersList);
    let companySelectAssistant = null;
    if (COMPANY === 1 || COMPANY === 2) {
      companySelectAssistant = lawyersList.filter(
        (item) =>
          (item.COMPANY_ID === 1 || item.COMPANY_ID === 2) &&
          (item.ROLE_ID === 2 || item.ROLE_ID === 3 || item.ROLE_ID === 4)
      );
    } else {
      companySelectAssistant = lawyersList.filter(
        (item) =>
          item.COMPANY_ID === 3 &&
          (item.ROLE_ID === 2 || item.ROLE_ID === 3 || item.ROLE_ID === 4)
      );
    }
    const optionsAssistant = companySelectAssistant.map((item) => ({
      value: item.id,
      label: item.NNAME,
    }));
    setAssistantOption(optionsAssistant);
  };

  const sendStatusReal = async (
    postponeStatus,
    enforceStatus,
    agreementStatus,
    defendants,
    judgementData,
    agreement,
    putDataLawSuit,
    postFinish,
    lawsuitData
  ) => {
    setLoading(true);
    try {
      await axios
        .put(baseUrl + PUT_LAWSUIT_DETAIL, lawsuitData, {
          headers: HEADERS_EXPORT,
        })
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
      if (defaultRadio === "postponed") {
        console.log("putDataLawSuit--->", putDataLawSuit);

        await axios
          .put(baseUrl + PUT_LAWSUIT_DETAIL, putDataLawSuit, {
            headers: HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 200) {
              console.log("resQuery", res.data);
              message.success("อัพเดทข้อมูลสำเร็จ");
              funcUpdateStatus({
                ...dataDefualt,
                DATE: dayjs(putDataLawSuit.consideration_date)
                  .add(7, "hour")
                  .format("YYYY-MM-DD HH:mm"),
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

        console.log("put postponeStatus---->", postponeStatus);
        await axios
          .put(baseUrl + PUT_STATUS, postponeStatus, {
            headers: HEADERS_EXPORT,
          })
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
      } else if (defaultRadio === "normal") {
        console.log("lawsuitData", lawsuitData);
        await axios
          .put(baseUrl + PUT_LAWSUIT_DETAIL, lawsuitData, {
            headers: HEADERS_EXPORT,
          })
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

        console.log("post judgement", judgementData);
        await axios
          .post(baseUrl + POST_JUDGE, judgementData, {
            headers: HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 201) {
              console.log("resQuery", res.data);
              handleUploadAllImage("enforcement", "ไฟล์คำพิพากษา");
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

        if (defendants.length > 0) {
          console.log("post normal---> defendants", defendants);
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
                console.log(err);
                if (err.status > 400) {
                  message.error("ไม่สามารถส่งข้อมูลได้");
                }
              });
            const results = await Promise.all(promises);
            console.log("results promise", results);
          });
        }

        console.log("post status enforceStatus---->", enforceStatus);
        await axios
          .post(baseUrl + POST_STATUS, enforceStatus, {
            headers: HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 200) {
              console.log("resQuery", res.data);
              message.success("อัพเดทข้อมูลสำเร็จ");
              funcUpdateStatus({
                ...dataDefualt,
                MAIN_STATUS_ID: enforceStatus.MAIN_STATUS_ID,
                DATE: dayjs(enforceStatus.DATE)
                  .add(7, "hour")
                  .format("YYYY-MM-DD HH:mm"),
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

        if (radioDecide === "agreement" || radioDecide === "agreementFinish") {
          console.log("post status agreement---->", agreementStatus);
          await axios
            .post(baseUrl + POST_STATUS, agreementStatus, {
              headers: HEADERS_EXPORT,
            })
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
              console.log(err);
              if (err.status > 400) {
                message.error("ไม่สามารถส่งข้อมูลได้");
              }
            });
        }
      } else {
        console.log("post status finish Status---->", postFinish);
        await axios
          .post(baseUrl + POST_STATUS, postFinish, {
            headers: HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 200) {
              console.log("resQuery", res.data);
              message.success("อัพเดทข้อมูลสำเร็จ");
              funcUpdateStatus({
                ...dataDefualt,
                MAIN_STATUS_ID: postFinish.MAIN_STATUS_ID,
                DATE: dayjs(postFinish.DATE)
                  .add(7, "hour")
                  .format("YYYY-MM-DD HH:mm"),
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

        if (radioFinish === "accountFinish" || radioFinish === "reAccount") {
          console.log("post status agreement---->", agreementStatus);
          console.log("agreement", agreement);
          await axios
            .post(baseUrl + POST_AGREEMENTS, agreement, {
              headers: HEADERS_EXPORT,
            })
            .then(async (res) => {
              if (res.status === 201) {
                console.log("resQuery", res.data);
                handleUploadAllImage("settlement_agreement", "ไฟล์เอกสาร");
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
        }
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
    let postponeStatus;
    let enforceStatus;
    let agreementStatus;
    let defendants = [];
    let judgementData;
    let agreement;
    let putDataLawSuit;
    let postFinish;
    let lawsuitData;

    if (values?.file?.fileList?.length < 1 && fileList.length < 1) {
      message.error("กรุณาอัปโหลดไฟล์เพื่อบันทึก");
    } else {
      if (defaultRadio === "postponed") {
        postponeStatus = {
          id: dataDefualt.WORK_LOG_ID,
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
        let statusJudgement;
        if (radioDecide === "enforce") {
          statusJudgement = STATUS_JUDGEMENT;
        } else {
          statusJudgement = STATUS_JUDGEMENT_AND_AGREEMENT;
        }
        lawsuitData = {
          ...dataLawsuit,
          attorney_fees:
            dataLawsuit?.LOAN_TYPE_ID === 2 || dataLawsuit?.LOAN_TYPE_ID === 5
              ? 2500
              : 3500,
          mark: values.memo,
          trial_money_cleared_datetime: dayjs(values.enforceCaseDate).format(
            "YYYY-MM-DD"
          ),
          trial_money_cleared_status: statusJudgement,
        };
        judgementData = {
          LAWSUIT_ID: dataLoadLawSuit.lawsuit.id,
          red_case_number: values.redNumber,
          judgement:
            values?.judgement1 &&
            typeof values.judgement1 === "string" &&
            values.judgement1.includes(",")
              ? parseInt(values.judgement1.replace(/,/g, ""))
              : parseInt(values.judgement1)
              ? parseInt(values.judgement1)
              : null,
          judgement_filepath: null,
          interest_rate: values.interestRate === 0 ? null : values.interestRate,
          final_case_date: null,
          final_case_filepath: null,
          tracking_fee:
            values?.trackingFeeEnforce &&
            typeof values.trackingFeeEnforce === "string" &&
            values.trackingFeeEnforce.includes(",")
              ? parseInt(values.trackingFeeEnforce.replace(/,/g, ""))
              : parseInt(values.trackingFeeEnforce)
              ? parseInt(values.trackingFeeEnforce)
              : null,
          fee: null,
          enforce_case_date: null,
          enforce_case_filepath: null,
          attorney_fees:
            values?.lawyerFeeEnforce &&
            typeof values.lawyerFeeEnforce === "string" &&
            values.lawyerFeeEnforce.includes(",")
              ? parseInt(values.lawyerFeeEnforce.replace(/,/g, ""))
              : parseInt(values.lawyerFeeEnforce)
              ? parseInt(values.lawyerFeeEnforce)
              : null,
          suspension_amount: values.suspensionAmount
            ? values.suspensionAmount
            : dataLoadLawSuit?.lawsuit?.suspension_amount
            ? dataLoadLawSuit?.lawsuit?.suspension_amount
            : null,
          judgement_lack: values.judgement_lack ? values.judgement_lack : null,
          interest_rate_of_lack:
            values.interestRateLack === 0 ? null : values.interestRateLack,
          lack_of_benefits:
            values?.costUnless1 &&
            typeof values.costUnless1 === "string" &&
            values.costUnless1.includes(",")
              ? parseInt(values.costUnless1.replace(/,/g, ""))
              : parseInt(values.costUnless1)
              ? parseInt(values.costUnless1)
              : null,
          mark: values.memo,
          judge_date: dayjs(values.enforceCaseDate).format("YYYY-MM-DD"),
        };
        if (checkboxTab1 && values.governmentOfficer1) {
          const govermentResult1 = values.governmentOfficer1.filter(
            (item) => item
          );
          const govermentfinal1 = govermentResult1.map((item) => ({
            LAWSUIT_ID: dataLoadLawSuit.lawsuit.id,
            CUSTOMER_ID: item.id,
            defendant_number: item.GARNO + 1,
            cost_of_uselessness:
              values?.costUnless1 &&
              typeof values.costUnless1 === "string" &&
              values.costUnless1.includes(",")
                ? parseInt(values.costUnless1.replace(/,/g, ""))
                : parseInt(values.costUnless1)
                ? parseInt(values.costUnless1)
                : null,
            cost_of_useleseness_per_month:
              values?.costPermonth1 &&
              typeof values.costPermonth1 === "string" &&
              values.costPermonth1.includes(",")
                ? parseInt(values.costPermonth1.replace(/,/g, ""))
                : parseInt(values.costPermonth1)
                ? parseInt(values.costPermonth1)
                : null,
            cost_of_useleseness_month:
              values.costMonth1 === 0 ? null : values.costMonth1,
            judge_number: 1,
          }));
          defendants.push(...govermentfinal1);
        }
        if (dataDefualt.LOAN_TYPE_ID !== 2 && values.governmentOfficer2) {
          const govermentResult2 = values.governmentOfficer2.filter(
            (item) => item
          );
          const govermentfinal2 = govermentResult2.map((item) => ({
            LAWSUIT_ID: dataLoadLawSuit.lawsuit.id,
            CUSTOMER_ID: item.id,
            defendant_number: item.GARNO + 1,
            cost_of_uselessness:
              values?.costUnless2 &&
              typeof values.costUnless2 === "string" &&
              values.costUnless2.includes(",")
                ? parseInt(values.costUnless2.replace(/,/g, ""))
                : parseInt(values.costUnless2)
                ? parseInt(values.costUnless2)
                : null,
            cost_of_useleseness_per_month:
              values?.costPermonth2 &&
              typeof values.costPermonth2 === "string" &&
              values.costPermonth2.includes(",")
                ? parseInt(values.costPermonth2.replace(/,/g, ""))
                : parseInt(values.costPermonth2)
                ? parseInt(values.costPermonth2)
                : null,
            cost_of_useleseness_month:
              values.costMonth2 === 0 ? null : values.costMonth2,
            judge_number: 2,
          }));
          defendants.push(...govermentfinal2);
        }
        enforceStatus = {
          USER_ID: dataDefualt.LAWYER_ID,
          LOAN_ID: dataDefualt.id,
          LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
          LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
          MEMO: values.memo,
          DATE: dayjs(values.enforceCaseDate).format("YYYY-MM-DD"),
          MAIN_STATUS_ID:
            radioDecide === "agreementFinish" ? FINISH : JUDGEMENT,
          PROCESS_ID: STATUS_PROCESS_PROGRESS,
        };

        if (radioDecide === "agreement" || radioDecide === "agreementFinish") {
          agreementStatus = {
            USER_ID: dataDefualt.LAWYER_ID,
            LOAN_ID: dataDefualt.id,
            LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
            LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
            MEMO: values.memo,
            DATE: preData.dateAgreement
              ? preData.dateAgreement
              : dayjs(values.enforceCaseDate).format("YYYY-MM-DD"),
            MAIN_STATUS_ID: PAYMENT,
            PROCESS_ID: STATUS_PROCESS_PROGRESS,
          };
          agreement = {
            LAWSUIT_ID: dataLoadLawSuit?.lawsuit.id,
            total_amount:
              values?.paymentDue &&
              typeof values.paymentDue === "string" &&
              values.paymentDue.includes(",")
                ? parseInt(values.paymentDue.replace(/,/g, ""))
                : parseInt(values.paymentDue)
                ? parseInt(values.paymentDue)
                : null,
            installment_amount:
              values?.paymentPerMonthAmount &&
              typeof values.paymentPerMonthAmount === "string" &&
              values.paymentPerMonthAmount.includes(",")
                ? parseInt(values.paymentPerMonthAmount.replace(/,/g, ""))
                : parseInt(values.paymentPerMonthAmount)
                ? parseInt(values.paymentPerMonthAmount)
                : null,
            installment_count: values.costMonth3,
            document_filepath: values.paymentFile,
            mark: values.memo,
            due_date: preData.dateAgreement
              ? preData.dateAgreement
              : dayjs(values.enforceCaseDate).format("YYYY-MM-DD"),
            // already_paid:
            //   radioDecide === "agreement" && dataDefualt.LOAN_TYPE_ID === 2
            //     ? values.paymentDue * 0.01 > 5000
            //       ? 5000
            //       : values.paymentDue * 0.01
            //     : radioDecide === "agreementFinish" &&
            //       dataDefualt.LOAN_TYPE_ID === 2
            //     ? values.paymentDue * 0.025 > 5000
            //       ? 5000
            //       : values.paymentDue * 0.025
            //     : radioDecide === "agreementFinish" &&
            //       dataDefualt.LOAN_TYPE_ID !== 2
            //     ? values.paymentDue * 0.1 > 30000
            //       ? 30000
            //       : values.paymentDue * 0.1
            //     : null,
            already_paid: null,
            payment_status: null,
            payment_status_date: null,
            negotiator_id: dataDefualt.LAWYER_ID,
            NEW_CONTNO: dataDefualt?.CONTNO,
          };
        }
      } else {
        let statusJudgement;
        if (radioFinish === "withdrawAccusation") {
          statusJudgement = STATUS_WITHDRAW_CASE;
        } else if (radioFinish === "accountFinish") {
          statusJudgement = STATUS_FINAL_CASE;
        } else {
          statusJudgement = STATUS_REFINANCE_CASE;
        }
        lawsuitData = {
          ...dataLawsuit,
          attorney_fees:
            dataLawsuit?.LOAN_TYPE_ID === 2 || dataLawsuit?.LOAN_TYPE_ID === 5
              ? 2500
              : 3500,
          mark: values.memo,
          trial_money_cleared_datetime: dayjs(values.actionDate).format(
            "YYYY-MM-DD"
          ),
          trial_money_cleared_status: statusJudgement,
        };

        postFinish = {
          USER_ID: dataDefualt.LAWYER_ID,
          LOAN_ID: dataDefualt.id,
          LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
          LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
          MEMO:
            radioFinish === "accountFinish"
              ? `${values.memo} ${currencyFormatComma(values?.paymentDue)} บาท`
              : values.memo,
          DATE: dayjs(values.actionDate).format("YYYY-MM-DD"),
          MAIN_STATUS_ID:
            radioFinish === "reAccount"
              ? PAYMENT
              : radioFinish === "accountFinish"
              ? FINISH
              : WITHDRAW_CASE,
          PROCESS_ID: STATUS_PROCESS_PROGRESS,
        };
        if (radioFinish === "reAccount") {
          agreement = {
            LAWSUIT_ID: dataLoadLawSuit?.lawsuit.id,
            total_amount:
              values?.paymentDue &&
              typeof values.paymentDue === "string" &&
              values.paymentDue.includes(",")
                ? parseInt(values.paymentDue.replace(/,/g, ""))
                : parseInt(values.paymentDue)
                ? parseInt(values.paymentDue)
                : null,
            installment_amount:
              values?.paymentPerMonthAmount &&
              typeof values.paymentPerMonthAmount === "string" &&
              values.paymentPerMonthAmount.includes(",")
                ? parseInt(values.paymentPerMonthAmount.replace(/,/g, ""))
                : parseInt(values.paymentPerMonthAmount)
                ? parseInt(values.paymentPerMonthAmount)
                : null,
            installment_count: values.costMonth3,
            document_filepath: values.paymentFile,
            mark: values.memo,
            due_date: dayjs(values.actionDate).format("YYYY-MM-DD"),
            // already_paid:
            //   radioDecide === "agreementFinish" && dataDefualt.LOAN_TYPE_ID !== 2
            //     ? values.paymentDue * 0.1 > 30000
            //       ? 30000
            //       : values.paymentDue * 0.1
            //     :radioDecide === "agreementFinish" && dataDefualt.LOAN_TYPE_ID === 2
            //     ? values.paymentDue * 0.1 > 30000
            //       ? 30000
            //       : values.paymentDue * 0.1
            //     : null,
            already_paid: null,
            payment_status: null,
            payment_status_date: null,
            negotiator_id: dataDefualt.LAWYER_ID,
            NEW_CONTNO: dataDefualt?.CONTNO,
          };
        }
      }
    }
    console.log("postponeStatus", postponeStatus);
    console.log("enforceStatus", enforceStatus);
    console.log("agreementStatus", agreementStatus);
    console.log("defendants", defendants);
    console.log("judgementData", judgementData);
    console.log("agreement", agreement);
    console.log("putDataLawSuit", putDataLawSuit);
    console.log("postFinish", postFinish);
    console.log("lawsuitData", lawsuitData);

    // sendStatusReal(
    //   postponeStatus,
    //   enforceStatus,
    //   agreementStatus,
    //   defendants,
    //   judgementData,
    //   agreement,
    //   putDataLawSuit,
    //   postFinish,
    //   lawsuitData
    // );
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const onChangeJudgement = (value) => {
    console.log(value);
    form.setFieldsValue({
      paymentDue: value,
    });
  };

  const onChange = (e) => {
    setDefaultRadio(e.target.value);
    console.log(e.target.value);
    form.setFieldsValue({
      memo: null,
    });
    form.setFieldsValue({
      wishes: null,
      governmentOfficer1: [],
      actionType: null,
    });
    setRadioDecide(null);
    setRadioFinish(null);
  };

  const onChangeDecide = (e) => {
    let textStatus;
    setRadioDecide(e.target.value);
    if (e.target.value === "agreement") {
      textStatus = "ทำยอม(ประนีประนอม)";
    } else if (e.target.value === "agreementFinish") {
      textStatus = "ทำยอม(ปิดบัญชี)";
    }
    form.setFieldsValue({
      governmentOfficer1: [],
    });
    form.setFieldsValue({
      memo: textStatus,
    });
    console.log(e.target.value);
  };

  const onChangeFinish = (e) => {
    setRadioFinish(e.target.value);
    let textStatus;
    console.log(e.target.value);
    setRadioDecide(e.target.value);
    if (e.target.value === "withdrawAccusation") {
      textStatus = "ถอนฟ้องเนื่องจาก";
    } else if (e.target.value === "accountFinish") {
      textStatus = "ปิดบัญชี";
    } else {
      textStatus = "ปรับโครงสร้าง";
    }
    form.setFieldsValue({
      memo: textStatus,
    });
  };

  const onChangeDate = (date, dateString) => {
    console.log(date, dateString);
    setPreData({ ...preData, considerationDate: dateString });
  };

  const onChangeDateAgreement = (date, dateString) => {
    console.log(date, dateString);
    setPreData({ ...preData, dateAgreement: dateString });
  };

  const confirm = () => {
    form.submit(); // ส่งฟอร์มเมื่อกด "ยืนยัน"
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
        <Popconfirm
          placement="topLeft"
          title="อัพเดทสถานะ"
          description="กรุณาตรวจสอบข้อมูลให้เรียบร้อย !"
          onConfirm={confirm}
          // onCancel={() => cancel(record)}
          okText="ยืนยัน"
          cancelText="ปิด"
        >
          <Button style={{ color: "green" }}>บันทึก</Button>
        </Popconfirm>
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
        {dataDefualt.LOAN_TYPE_ID !== 2 && radioDecide === "enforce" ? (
          <Button
            style={{ color: "blue" }}
            onClick={() => {
              setTabsKey("2");
            }}
          >
            ถัดไป
          </Button>
        ) : (
          <Popconfirm
            placement="topLeft"
            title="อัพเดทข้อมูล"
            description="กรุณาตรวจสอบข้อมูลให้เรียบร้อย !"
            onConfirm={confirm}
            // onCancel={() => cancel(record)}
            okText="ยืนยัน"
            cancelText="ปิด"
          >
            <Button style={{ color: "green" }}>บันทึก</Button>
          </Popconfirm>
        )}
      </div>
    );
  };

  const onChangeGovermentOfficer = (checkedValues, index) => {
    console.log("checked = ", checkedValues);
    // setGovernmentOfficerLength(checkedValues.length);
    if (tabsKey === "1") {
      setCheckBoxTab1(checkedValues);
      form.setFieldValue({
        governmentOfficer1: checkedValues,
      });
    } else {
      setCheckBoxTab2(checkedValues);
    }
    console.log("checkboxTrap1", checkboxTab1);
    console.log("checkboxTrap2", checkboxTab2);
  };

  const handleCheckBoxGroupGoverment = () => {
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
            {governmentOfficers?.guarantors?.map((guarantor, index) => (
              <Checkbox key={index} value={guarantor} disabled={false}>
                {`จำเลยที่ ${index + 2} ${guarantor?.SNAM} ${
                  guarantor?.NAME1
                } ${guarantor?.NAME2}`}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </>
    );
  };

  const onChangeCourt = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleUploadAllImage = (mainType, textName) => {
    console.log("mainType", mainType, textName);
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);

    axios
      .post(
        baseUrl +
          `/files/lawyer/${mainType}/${PARAM_PUBLIC}/${textName}${dataDefualt.CONTNO}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setFileList([]);
        setLoading(false);
      })
      .catch((err) => {
        Modal.error({
          title: "ผิดพลาด",
          content: err.message,
          centered: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const props = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList((prev) => [...prev, file]); // อัปเดตรายการไฟล์

      return false; // ป้องกันการอัปโหลดไฟล์อัตโนมัติ
    },

    fileList,
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
          nitialValues={{
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
            suspensionAmount: dataLoadLawSuit?.lawsuit?.suspension_amount
              ? dataLoadLawSuit?.lawsuit?.suspension_amount
              : null,
          }}
        >
          <Form.Item
            label="วันที่พิพากษา"
            name="enforceCaseDate"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกวันที่",
              },
            ]}
          >
            <DatePicker
              onChange={onChangeCourt}
              placeholder="กรุณาเลือกวันที่"
            />
          </Form.Item>
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
            <Input name="redNumber" />
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
            <InputNumber
              suffix="บาท"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              size="large"
              placeholder="จำนวนเงินที่จำเลยต้องชำระ"
              style={{ width: "100%", color: "black" }}
              onChange={(value) => onChangeJudgement(value)}
            />
          </Form.Item>
          <Row gutter={16} align="middle" style={{ marginBottom: "20px" }}>
            {/* ค่าขาดประโยชน์ */}

            <Col span={12}>
              <Form.Item
                label="ต้นเงิน"
                name="judgement_lack"
                style={{ marginBottom: 0 }}
                labelCol={{ span: 12 }}
              >
                <InputNumber
                  suffix="บาท"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="large"
                  placeholder="ไม่มีไม่ต้องกรอก"
                  style={{ width: "100%", color: "black" }}
                />
              </Form.Item>
            </Col>

            {/* ดอกเบี้ยคำพิพากษา */}
            <Col span={12}>
              <Form.Item
                label="ให้ดอกเบี้ย"
                name="interestRate"
                style={{ marginBottom: 0 }}
                labelCol={{ span: 6 }}
              >
                <Select
                  showSearch
                  name="interestRate"
                  options={optionsInterest}
                  size="large"
                  style={{ width: "auto" }}
                  placeholder="เลือกอัตราดอกเบี้ย"
                  popupMatchSelectWidth={false}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} align="middle" style={{ marginBottom: "20px" }}>
            {/* ค่าขาดประโยชน์ */}
            <Col span={12}>
              <Form.Item
                label="ค่าขาดประโยชน์"
                name="costUnless1"
                style={{ marginBottom: 0 }}
                labelCol={{ span: 12 }}
              >
                <InputNumber
                  suffix="บาท"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="large"
                  placeholder="ไม่มีไม่ต้องกรอก"
                  style={{ width: "100%", color: "black" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="ให้ดอกเบี้ย"
                name="interestRateLack"
                style={{ marginBottom: 0 }}
                labelCol={{ span: 6 }}
              >
                <Select
                  showSearch
                  name="interestRateLack"
                  options={optionsInterest}
                  size="large"
                  style={{ width: "auto" }}
                  placeholder="เลือกอัตราดอกเบี้ย"
                  popupMatchSelectWidth={false}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} align="middle" style={{ marginBottom: "20px" }}>
            {/* ค่าขาดประโยชน์ */}
            <Col span={12}>
              <Form.Item
                label="ค่าขาดประโยชน์เดือนละ"
                name="costPermonth1"
                style={{ marginBottom: 0 }}
                labelCol={{ span: 12 }}
              >
                <InputNumber
                  suffix="บาท"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="large"
                  placeholder="ไม่มีไม่ต้องกรอก"
                  style={{ width: "100%", color: "black" }}
                />
              </Form.Item>
            </Col>

            {/* ดอกเบี้ยคำพิพากษา */}
            <Col span={12}>
              <Form.Item
                label="จำนวน"
                name="costMonth1"
                style={{ marginBottom: 0 }}
                labelCol={{ span: 6 }}
              >
                <Select
                  showSearch
                  size="large"
                  style={{ width: "auto" }}
                  placeholder="เลือกจำนวนเดือน"
                  popupMatchSelectWidth={false}
                  options={optionsMonth}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="ค่าติดตาม" name="trackingFeeEnforce">
            <InputNumber
              suffix="บาท"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              size="large"
              placeholder="ไม่มีไม่ต้องกรอก"
              style={{ width: "100%", color: "black" }}
            />
          </Form.Item>
          <Form.Item label="ค่าทนายความ" name="lawyerFeeEnforce">
            <InputNumber
              suffix="บาท"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              size="large"
              placeholder="ไม่มีไม่ต้องกรอก"
              style={{ width: "100%", color: "black" }}
            />
          </Form.Item>
          <Form.Item label="เบี้ยตั้งพัก" name="suspensionAmount">
            <InputNumber
              suffix="บาท"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              size="large"
              placeholder="ไม่มีไม่ต้องกรอก"
              style={{ width: "100%", color: "black" }}
            />
          </Form.Item>
          <Form.Item
            label="จำเลยประสงค์"
            name="wishes"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกรายการ",
              },
            ]}
          >
            <Radio.Group
              onChange={onChangeDecide}
              defaultValue={null}
              value={radioDecide}
              style={{ margin: "10px" }}
            >
              <Radio value="enforce">พิพากษา</Radio>
              <Radio value="agreement">ทำยอม(ประนีประนอม)</Radio>
              {/* <Radio value="agreementFinish">ทำยอม(ปิดบัญชี)</Radio> */}
            </Radio.Group>
          </Form.Item>

          {radioDecide === "agreement" || radioDecide === "agreementFinish"
            ? formDataPayment()
            : null}
          <Form.Item
            label="ไฟล์คำพิพากษา"
            name="file"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ url ของคำพิพากษาจากไฟล์กลาง !",
              },
            ]}
          >
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "blue" }} />
              </p>
              <p className="ant-upload-text">กรุณาคลิกหรือลากเพื่อเลือกไฟล์</p>
              <p className="ant-upload-hint">
                รองรับการอัปโหลดแบบเดี่ยวหรือแบบกลุ่ม
              </p>
            </Dragger>
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
                  message: "กรุณาใส่คำพิพากษา !",
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
            <InputNumber
              suffix="บาท"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              size="large"
              // placeholder="กรุณากรอกจัดทำเอกสารไม่มีใส่ 0"
              style={{ width: "100%", color: "black" }}
            />
          </Form.Item>
          <Row gutter={16} align="middle" style={{ marginBottom: "20px" }}>
            {/* ค่าขาดประโยชน์ */}
            <Col span={12}>
              <Form.Item
                label="ค่าขาดประโยชน์เดือนละ"
                name="costPermonth2"
                style={{ marginBottom: 0 }}
                labelCol={{ span: 12 }}
              >
                <InputNumber
                  suffix="บาท"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="large"
                  // placeholder="กรุณากรอกจัดทำเอกสารไม่มีใส่ 0"
                  style={{ width: "100%", color: "black" }}
                />
              </Form.Item>
            </Col>

            {/* ดอกเบี้ยคำพิพากษา */}
            <Col span={12}>
              <Form.Item
                label="จำนวน"
                name="costMonth2"
                style={{ marginBottom: 0 }}
                labelCol={{ span: 6 }}
              >
                <Select
                  showSearch
                  size="large"
                  style={{ width: "auto" }}
                  placeholder="กรอกจำนวนเดือน"
                  popupMatchSelectWidth={false}
                  options={optionsMonth}
                />
              </Form.Item>
            </Col>
          </Row>
          <Tooltip
            placement="bottom"
            title="เลือกจำเลยที่โดนพิพากษาในคำตัดสินนี้ !"
            arrow={mergedArrow}
          >
            <Form.Item
              label="จำเลยที่ร่วมคำพิพากษานี้"
              name="governmentOfficer2"
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
            <DatePicker
              showTime={{
                format: "HH:mm",
              }}
              format="YYYY-MM-DD HH:mm"
              onChange={onChangeDate}
              placeholder="กรุณาเลือกวันที่"
            />
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
      <>
        <Form.Item
          label="ยินยอมชำระเงินจำนวน"
          name="paymentDue"
          rules={[
            {
              required: true,
              message: "กรุณาใส่เงินต้นที่ทำยอม",
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
          />
        </Form.Item>
        {radioDecide === "agreement" || radioFinish === "reAccount" ? (
          <Row gutter={16} align="middle" style={{ marginBottom: "20px" }}>
            <Col span={12}>
              <Form.Item
                label="งวดละไม่น้อยกว่า"
                name="paymentPerMonthAmount"
                style={{ marginBottom: 20 }}
                labelCol={{ span: 12 }}
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่เงินที่ต้องชำระรายเดือน",
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
                />
              </Form.Item>
              <Form.Item
                label="วันนัดชำระครั้งแรก"
                name="dateAgreement"
                style={{ marginBottom: 0 }}
                labelCol={{ span: 12 }}
                rules={[
                  {
                    required: true,
                    message: "โปรดเลือกวันที่นัดชำระ",
                  },
                ]}
              >
                <DatePicker
                  onChange={onChangeDateAgreement}
                  placeholder="กรุณาเลือกวันที่"
                  size="large"
                  style={{ width: "auto" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="จำนวนกี่เดือน"
                name="costMonth3"
                style={{ marginBottom: 60 }}
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่จำนวนงวด",
                  },
                ]}
              >
                <Select
                  showSearch
                  size="large"
                  style={{ width: "auto" }}
                  type="number"
                  name="costMonth3"
                  popupMatchSelectWidth={false}
                  options={optionsMonth}
                  placeholder="เลือกจำนวนเดือน"
                />
              </Form.Item>
              {/* <Form.Item
                label="เลือกผู้เจรจา"
                name="negotiator"
                style={{ marginBottom: 0 }}
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกผู้เจรจา !",
                  },
                ]}
              >
                <Select
                  showSearch
                  popupMatchSelectWidth={false}
                  placeholder="เลือกผู้เจรจา"
                  optionFilterProp="label"
                  options={assistantOption}
                  size="large"
                  style={{ width: "auto" }}
                />
              </Form.Item> */}
            </Col>
          </Row>
        ) : null}
      </>
    );
  };

  const formWithdrawAccusation = () => {
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
            label="ทำรายการ"
            name="actionType"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกรายการ",
              },
            ]}
          >
            <Radio.Group
              onChange={onChangeFinish}
              defaultValue="null"
              value={radioFinish}
              style={{ margin: "10px" }}
            >
              <Radio value="withdrawAccusation">ถอนฟ้อง</Radio>
              <Radio value="accountFinish">ปิดบัญชี</Radio>
              <Radio value="reAccount">ปรับโครงสร้าง</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="วันที่"
            name="actionDate"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกวันที่",
              },
            ]}
          >
            <DatePicker
              onChange={onChangeCourt}
              placeholder="กรุณาเลือกวันที่"
            />
          </Form.Item>
          {radioFinish === "accountFinish" ? (
            <>
              <Form.Item
                label="จำนวนที่ปิด"
                name="paymentDue"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ยอดจำนวนที่ปิด",
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
                  placeholder="จำนวนเงินที่ปิดบัญชี"
                  style={{ width: "100%", color: "black" }}
                />
              </Form.Item>
              {/* <Form.Item
                label="เลือกผู้เจรจา"
                name="negotiator"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกผู้เจรจา !",
                  },
                ]}
              >
                <Select
                  showSearch
                  popupMatchSelectWidth={false}
                  placeholder="เลือกผู้เจรจา"
                  optionFilterProp="label"
                  options={assistantOption}
                  size="large"
                  style={{ width: "auto" }}
                />
              </Form.Item> */}
            </>
          ) : radioFinish === "reAccount" ? (
            formDataPayment()
          ) : null}
          <Form.Item
            label="อัพโหลดไฟล์เอกสาร"
            name="file"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ url ของคำพิพากษาจากไฟล์กลาง !",
              },
            ]}
          >
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "blue" }} />
              </p>
              <p className="ant-upload-text">กรุณาคลิกหรือลากเพื่อเลือกไฟล์</p>
              <p className="ant-upload-hint">
                รองรับการอัปโหลดแบบเดี่ยวหรือแบบกลุ่ม
              </p>
            </Dragger>
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
      label:
        radioDecide === "enforce" ? "คำพิพากษาจำเลยที่ ๑" : "คำพิพากษาจำเลย",
      children: formJudge1(),
    },
    ...((dataDefualt.LOAN_TYPE_ID !== 2 || dataDefualt.LOAN_TYPE_ID !== 5) &&
    radioDecide === "enforce"
      ? [
          {
            key: "2",
            label: "คำพิพากษาจำเลยถัดไป",
            children: formJudge2(),
          },
        ]
      : []), // ถ้าเงื่อนไขไม่ตรง ก็ไม่ใส่ item นี้
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
            <Radio value="normal">ตัดสิน</Radio>
            <Radio value="postponed">เลื่อนวันนัดพิจารณาคดี</Radio>
            <Radio value="finish">ถอนฟ้อง/ปิดบัญชี/ปรับโครงสร้าง</Radio>
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
            formWithdrawAccusation()
          )}
        </Spin>
      </Modal>
    </>
  );
};
export default UpdateStatus;
