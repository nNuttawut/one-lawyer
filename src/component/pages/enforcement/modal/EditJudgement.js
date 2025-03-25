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
  InputNumber,
  Row,
  Col,
  Upload,
  Popconfirm,
} from "antd";
import {
  baseUrl,
  GET_JUDGE_BY_ID,
  GET_JUDGE_DEFENDANTS_BY_ID,
  GET_LOAN_BY_CONTNO,
  GET_WORK_LOG_DETAIL_BY_ID,
  HEADERS_EXPORT,
  POST_AGREEMENTS,
  POST_JUDGE,
  POST_JUDGE_DEFENDANTS,
  POST_STATUS,
  PUT_STATUS,
} from "../../../API/apiUrls";
import axios from "axios";
import { InboxOutlined } from "@ant-design/icons";
import { optionsInterest } from "../../../../utils/constant/ Interest";
import CheckGovermentOfficer from "../../../../hook/CeckGovermentOfficer";
import { optionsMonth } from "../../../../utils/constant/MonthSelect";
import dayjs from "dayjs";
import LoadLawyers from "../../../../hook/LoadLawyers";
import {
  ENFORCEMENT,
  FINISH,
  PARAM_PUBLIC,
  PAYMENT,
  STATUS_PROCESS_PROGRESS,
  STATUS_PROCESS_SUCCESSFUL,
} from "../../../../utils/constant/StatusConstant";
import Dragger from "antd/es/upload/Dragger";
import CurrencyFormat from "../../../../hook/CurrencyFormat";

const EditJudgement = ({ open, close, dataDefualt, responseData }) => {
  const [setupGovernmentOfficerList, governmentOfficers] =
    CheckGovermentOfficer();
  const [currencyFormatNoPoint, currencyFormatComma, currencyFormatPoint] =
    CurrencyFormat();
  const USER_ID = localStorage.getItem("USER_ID");
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [form] = Form.useForm();
  const COMPANY = parseInt(localStorage.getItem("COMPANY_ID"));
  const [loading, setLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [assistantOption, setAssistantOption] = useState();
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const { TextArea } = Input;
  const [dataStore, setDataStore] = useState();
  const [checkLenght, setCheckLenght] = useState([]);
  const [preData, setPreData] = useState({
    considerationDate: null,
    dateAgreement: null,
  });
  const [radioDecide, setRadioDecide] = useState("enforce");
  const [arrow, setArrow] = useState("Show");

  const [tabsKey, setTabsKey] = useState("1");
  const [checkboxTab1, setCheckBoxTab1] = useState({});
  const [checkboxTab2, setCheckBoxTab2] = useState({});
  const [fileList, setFileList] = useState([]);
  const [dataJudgement, setDataJudgement] = useState(null);
  const [dataJudgeDefendants, setDataJudgeDefendants] = useState(null);

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      setLoadingData(true);
      console.log("loadData", dataDefualt);
    }
  }, [isModal]);

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
        interestRateLack: dataJudgement?.interest_rate_of_lack,
        costPermonth1: currencyFormatNoPoint(
          judgeNumber1[0]?.cost_of_useleseness_per_month
        ),
        costMonth1: judgeNumber1[0]?.cost_of_useleseness_month,
        judgementLack: currencyFormatNoPoint(dataJudgement?.judgement_lack),
        trackingFeeEnforce: currencyFormatNoPoint(dataJudgement?.tracking_fee),
        lawyerFeeEnforce: currencyFormatNoPoint(dataJudgement?.attorney_fees),
        suspensionAmount: currencyFormatNoPoint(
          dataJudgement?.suspension_amount
        ),
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

  const handleCancel = () => {
    Modal.confirm({
      title: "โปรดอ่านก่อนดำเนินการ",
      content:
        "กรุณาทำรายการให้เสร็จเนื่องจากการปิดจะทำให้ข้อมูลไม่ถูกต้อง หากดำเนินการผิดพลาดโปรดแจ้งผู้ดูแลระบบทันที !",
      okText: "ยืนยัน",
      cancelText: "ปิด",
      onOk: () => {
        // close(false);
        // setIsModal(false);
        message.error("กรุณากรอกข้อมูลให้ครบและกดบันทึก");
      },
    });
  };

  useEffect(() => {
    if (lawyersList) {
      setOptionAssistant();
    }
  }, [lawyersList]);

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
    judgement,
    defendants,
    finishStatus,
    agreement,
    statusData,
    putStatus
  ) => {
    setLoading(true);

    try {
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
          console.log(err);
          if (err.status > 400) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
        });

      if (defendants?.length > 0) {
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
      if (radioDecide === "agreementFinish") {
        await axios
          .post(baseUrl + POST_STATUS, finishStatus, {
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
      }
      if (radioDecide === "payment") {
        console.log("agreement", agreement);

        await axios
          .post(baseUrl + POST_STATUS, statusData, { headers: HEADERS_EXPORT })
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

      // await axios
      //   .put(baseUrl + PUT_STATUS, putStatus, { headers: HEADERS_EXPORT })
      //   .then(async (res) => {
      //     if (res.status === 200) {
      //       console.log("resQuery", res.data);
      //     } else {
      //       message.error("ไม่สามารถส่งข้อมูลได้");
      //       console.log("ไม่สามารถส่งข้อมูลได้");
      //       setLoading(false);
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     if (err.status > 400) {
      //       message.error("ไม่สามารถส่งข้อมูลได้");
      //     }
      //   });
      handleUploadAllImage();
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    let defendants = [];
    let statusData;
    let judgementData;
    let agreement;
    let finishStatus;
    let putStatus;

    if (values?.file?.fileList?.length < 1 || fileList.length < 1) {
      message.error("กรุณาใส่ไฟล์เพื่อบันทึก");
    } else {
      const govermentResult1 = values?.governmentOfficer1.filter(
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
        cost_of_useleseness_month: values.costMonth1,
        judge_number: 1,
      }));
      defendants.push(...govermentfinal1);

      if (
        dataDefualt.LOAN_TYPE_ID !== 2 &&
        values?.governmentOfficer2?.length > 0
      ) {
        const govermentResult2 = values?.governmentOfficer2?.filter(
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
          cost_of_useleseness_month: values.costMonth2,
          judge_number: 2,
        }));
        defendants.push(...govermentfinal2);
      }

      if (radioDecide === "agreementFinish") {
        finishStatus = {
          USER_ID: parseInt(USER_ID),
          LOAN_ID: dataDefualt.LOAN_ID,
          LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
          LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
          MEMO: "คำพิพากษาไม่ผ่านระบบไม่บันทึกหมายตั้งและคดีถึงที่สุด",
          DATE: dayjs(values.enforceCaseDate).format("YYYY-MM-DD"),
          MAIN_STATUS_ID: FINISH,
          PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
        };
      }

      // putStatus = {
      //   id: responseData.WORK_LOG_ID,
      //   USER_ID: dataDefualt.LAWYER_ID,
      //   LOAN_ID: dataDefualt.LOAN_ID,
      //   MEMO:
      //     values.memo + "คำพิพากษาไม่ผ่านระบบไม่บันทึกหมายตั้งและคดีถึงที่สุด",
      //   DATE: dataDefualt.DATE,
      //   PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
      //   LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
      // };

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
        interest_rate: values.interestRate,
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
        fee: dataLoadLawSuit?.lawsuit?.fee,
        enforce_case_date: dayjs(values.enforceCaseDate).format("YYYY-MM-DD"),
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
          : null,
        judgement_lack: values.judgement_lack ? values.judgement_lack : null,
        interest_rate_of_lack: values.interestRateLack
          ? values.interestRateLack
          : null,
      };
      console.log("dataDefualt", dataDefualt);

      if (radioDecide === "agreement") {
        statusData = {
          USER_ID: parseInt(USER_ID),
          LOAN_ID: dataDefualt.LOAN_ID,
          LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
          LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
          MEMO: values.memo + "ไม่ผ่านระบบไม่บันทึกหมายตั้งและคดีถึงที่สุด",
          DATE: dayjs(values.enforceCaseDate).format("YYYY-MM-DD"),
          MAIN_STATUS_ID: PAYMENT,
          PROCESS_ID: STATUS_PROCESS_PROGRESS,
        };

        agreement = {
          LAWSUIT_ID: dataLoadLawSuit?.lawsuit.id,
          total_amount:
            values?.judgement1 &&
            typeof values.judgement1 === "string" &&
            values.judgement1.includes(",")
              ? parseInt(values.judgement1.replace(/,/g, ""))
              : parseInt(values.judgement1)
              ? parseInt(values.judgement1)
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
          document_filepath: null,
          mark: values.memo,
          due_date: preData?.dateAgreement,
          already_paid: null,
          payment_status: null,
          payment_status_date: null,
          negotiator_id: parseInt(USER_ID),
          NEW_CONTNO: dataDefualt?.contno,
        };
      }
      console.log("defendants", defendants);
      console.log("judgementData", judgementData);
      console.log("statusData", statusData);
      console.log("agreement", agreement);
      console.log("finishStatus", finishStatus);
      console.log("putStatus", putStatus);

      //   sendStatus(
      //     judgementData,
      //     defendants,
      //     finishStatus,
      //     agreement,
      //     statusData,
      //     putStatus
      //   );
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบ");
  };

  const onChange = (e) => {
    setRadioDecide(e.target.value);
    let textStatus;
    console.log(e.target.value);
    if (e.target.value === "agreement") {
      textStatus = "ทำยอม(ประนีประนอม)";
    } else if (e.target.value === "agreementFinish") {
      textStatus = "ทำยอม(ปิดบัญชี)";
    }
    form.setFieldsValue({
      memo: textStatus,
      governmentOfficer1: [],
      governmentOfficer2: [],
    });
  };

  const onChangeInputRedNumber = (value) => {
    console.log(value);
  };

  const onChangeCourt = (date, dateString) => {
    console.log(date, dateString);
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

  const onChangeInputCost1 = (value) => {
    console.log(value);
  };

  const onChangeInputCost2 = (value) => {
    console.log(value);
  };

  const onChangecostPermonth1 = (value) => {
    console.log(value);
  };

  const onChangecostPermonth2 = (value) => {
    console.log(value);
  };

  const onChangTrackingFeeEnforce = (value) => {
    console.log(value);
  };

  const onChangLawyerFeeEnforce = (value) => {
    console.log(value);
  };

  const onChangSuspensionAmount = (value) => {
    console.log(value);
  };

  const confirm = () => {
    form.submit(); // ส่งฟอร์มเมื่อกด "ยืนยัน"
  };

  const buttonCustom = () => {
    return (
      <div style={{ textAlign: "center" }}>
        {radioDecide === "enforce" ? (
          <Button
            style={{ color: "blue", marginRight: "20px" }}
            onClick={() => {
              setTabsKey("1");
            }}
          >
            ย้อนกลับ
          </Button>
        ) : null}
        {/* <Button
          onClick={handleCancel}
          style={{ color: "red", marginRight: "20px" }}
        >
          ปิด
        </Button> */}

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
        {/* <Button
          onClick={handleCancel}
          style={{ color: "red", marginRight: "20px" }}
        >
          ปิด
        </Button> */}

        {dataDefualt.LOAN_TYPE_ID !== 2 && radioDecide === "enforce" ? (
          <Button
            style={{ color: "blue" }}
            // htmlType="submit"
            onClick={() => {
              setTabsKey("2");
            }}
          >
            ถัดไป
          </Button>
        ) : (
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
        )}
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

  const handleUploadAllImage = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);

    axios
      .post(
        baseUrl +
          `/files/lawyer/enforcement/${PARAM_PUBLIC}/คำพิพากษา${dataDefualt.contno}`,
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
            suspensionAmount: null,
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
            <DatePicker onChange={onChangeCourt} size="large" />
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
                  onChange={(value) => onChangeInputCost1(value)}
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
                  onChange={(value) => onChangeInputCost1(value)}
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
                  onChange={(value) => onChangecostPermonth1(value)}
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
              onChange={(value) => onChangTrackingFeeEnforce(value)}
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
              onChange={(value) => onChangLawyerFeeEnforce(value)}
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
              onChange={(value) => onChangSuspensionAmount(value)}
            />
          </Form.Item>
          <Form.Item label="จำเลยประสงค์">
            <Radio.Group
              onChange={onChange}
              defaultValue="enforce"
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
            <InputNumber
              suffix="บาท"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              size="large"
              // placeholder="กรุณากรอกจัดทำเอกสารไม่มีใส่ 0"
              style={{ width: "100%", color: "black" }}
              onChange={(value) => onChangecostPermonth2(value)}
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
                  onChange={(value) => onChangeInputCost2(value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="จำนวน"
                name="costMonth2"
                style={{ marginBottom: 0 }}
                labelCol={{ span: 6 }}
              >
                <Select
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

  const onChangeTabs = (key) => {
    console.log(key);
    setTabsKey(key);
  };

  const onChangeDateAgreement = (date, dateString) => {
    console.log(date, dateString);
    setPreData({ ...preData, dateAgreement: dateString });
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
        {radioDecide === "agreement" ? (
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

  const items = [
    {
      key: "1",
      label:
        radioDecide === "enforce" ? "คำพิพากษาจำเลยที่ ๑" : "คำพิพากษาจำเลย",
      children: formJudge1(),
    },
    ...(dataDefualt.LOAN_TYPE_ID !== 2 && radioDecide === "enforce"
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
        title={`ข้อมูลพิพากษา ${dataLoadLawSuit?.lawsuit?.CONTNO}/${
          dataLoadLawSuit?.lawsuit?.customer_title
        }${dataLoadLawSuit?.lawsuit?.customer_name} ${
          dataLoadLawSuit?.lawsuit?.customer_lastname
            ? dataLoadLawSuit?.lawsuit?.customer_lastname
            : ""
        }`}
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Tabs activeKey={tabsKey} onChange={onChangeTabs} centered>
            {items.map((item) => (
              <Tabs.TabPane tab={item.label} key={item.key}>
                {item.children}
              </Tabs.TabPane>
            ))}
          </Tabs>
        </Spin>
      </Modal>
    </>
  );
};
export default EditJudgement;
