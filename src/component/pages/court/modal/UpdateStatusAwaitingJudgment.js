import React, { memo, useEffect, useMemo, useState } from "react";
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
import TokenCheck from "../../../../hook/TokenCheck";

const UpdateStatus = ({ open, close, dataDefualt, funcUpdateStatus }) => {
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
  const [currencyFormatComma] = CurrencyFormat();
  const [arrow, setArrow] = useState("Show");
  const [tabsKey, setTabsKey] = useState("1");
  const [checkboxTab1, setCheckBoxTab1] = useState({});
  const [checkboxTab2, setCheckBoxTab2] = useState({});

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

  const loadData = async () => {
    setLoading(true);
    try {
      const [worklogs, loanRes] = await Promise.all([
        axios.get(
          `${baseUrl}${GET_WORK_LOG_DETAIL_BY_ID}${dataDefualt.WORK_LOG_ID}`,
          {
            headers: HEADERS_EXPORT,
          }
        ),
        axios.get(`${baseUrl}${GET_LOAN_BY_CONTNO}${dataDefualt.CONTNO}`, {
          headers: HEADERS_EXPORT,
        }),
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
        listGovermentList(loanRes.data);
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
            if (res.status === 200) {
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
                DATE: dayjs(status.considerationDate)
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
            console.log(err);
            if (err.status > 400) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
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
            console.log(err);
            if (err.status > 400) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
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
              console.log(err);
              if (err.status > 400) {
                message.error("ไม่สามารถส่งข้อมูลได้");
              }
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
                DATE: dayjs(status.considerationDate)
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
      const govermentResult1 = values.governmentOfficer1.filter((item) => item);
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
            : 0,
        cost_of_useleseness_per_month:
          values?.costPermonth1 &&
          typeof values.costPermonth1 === "string" &&
          values.costPermonth1.includes(",")
            ? parseInt(values.costPermonth1.replace(/,/g, ""))
            : parseInt(values.costPermonth1)
            ? parseInt(values.costPermonth1)
            : 0,
        cost_of_useleseness_month: values.costMonth1,
        judge_number: 1,
      }));
      defendants.push(...govermentfinal1);

      if (dataDefualt.LOAN_TYPE_ID === 1) {
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
              : 0,
          cost_of_useleseness_per_month:
            values?.costPermonth2 &&
            typeof values.costPermonth2 === "string" &&
            values.costPermonth2.includes(",")
              ? parseInt(values.costPermonth2.replace(/,/g, ""))
              : parseInt(values.costPermonth2)
              ? parseInt(values.costPermonth2)
              : 0,
          cost_of_useleseness_month: values.costMonth2,
          judge_number: 2,
        }));
        defendants.push(...govermentfinal2);
      }
      statusData = {
        USER_ID: dataDefualt.LAWYER_ID,
        LOAN_ID: dataDefualt.id,
        LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
        LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
        MEMO: values.memo,
        DATE: dayjs(values.enforceCaseDate).format("YYYY-MM-DD"),
        MAIN_STATUS_ID: JUDGEMENT,
        PROCESS_ID: STATUS_PROCESS_PROGRESS,
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
            : 0,
        judgement_filepath: values.judgementFile,
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
            : 0,
        fee: dataLoadLawSuit?.lawsuit?.fee,
        enforce_case_date: null,
        enforce_case_filepath: null,
        attorney_fees:
          values?.lawyerFeeEnforce &&
          typeof values.lawyerFeeEnforce === "string" &&
          values.lawyerFeeEnforce.includes(",")
            ? parseInt(values.lawyerFeeEnforce.replace(/,/g, ""))
            : parseInt(values.lawyerFeeEnforce)
            ? parseInt(values.lawyerFeeEnforce)
            : 0,
        suspension_amount: values.suspensionAmount
          ? values.suspensionAmount
          : dataLoadLawSuit?.lawsuit?.suspension_amount
          ? dataLoadLawSuit?.lawsuit?.suspension_amount
          : 0,
        judgement_lack: values.judgement_lack ? values.judgement_lack : 0,
        interest_rate_of_lack: values.interestRateLack
          ? values.interestRateLack
          : 0,
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
        total_amount:
          values?.paymentAmount &&
          typeof values.paymentAmount === "string" &&
          values.paymentAmount.includes(",")
            ? parseInt(values.paymentAmount.replace(/,/g, ""))
            : parseInt(values.paymentAmount)
            ? parseInt(values.paymentAmount)
            : 0,
        installment_amount:
          values?.paymentPerMonthAmount &&
          typeof values.paymentPerMonthAmount === "string" &&
          values.paymentPerMonthAmount.includes(",")
            ? parseInt(values.paymentPerMonthAmount.replace(/,/g, ""))
            : parseInt(values.paymentPerMonthAmount)
            ? parseInt(values.paymentPerMonthAmount)
            : 0,
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
  };

  const onChangPaymentAmount = (value) => {
    console.log(value);
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

  const onChangPaymentPerMonthAmount = (value) => {
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
        {dataDefualt.LOAN_TYPE_ID === 1 ? (
          <Button
            style={{ color: "blue" }}
            onClick={() => {
              setTabsKey("2");
            }}
          >
            ถัดไป
          </Button>
        ) : (
          <Button style={{ color: "green" }} htmlType="submit">
            บันทึก
          </Button>
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
    if (checkLenght) {
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

  const onChangeCourt = (date, dateString) => {
    console.log(date, dateString);
  };

  const onChangSuspensionAmount = (value) => {
    console.log(value);
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
            costUnless1: 0,
            interest: null,
            costPermonth1: 0,
            costMonth1: null,
            trackingFeeEnforce: 0,
            lawyerFeeEnforce: 0,
            costUnless2: null,
            costPermonth2: 0,
            costMonth2: null,
            judgement2: 0,
            suspensionAmount: dataLoadLawSuit?.lawsuit?.suspension_amount
              ? dataLoadLawSuit?.lawsuit?.suspension_amount
              : 0,
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
                  // placeholder="กรุณากรอกจัดทำเอกสารไม่มีใส่ 0"
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
                  // placeholder="กรุณากรอกจัดทำเอกสารไม่มีใส่ 0"
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
                  // placeholder="กรุณากรอกจัดทำเอกสารไม่มีใส่ 0"
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
                  placeholder="กรอกจำนวนเดือน"
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
                  onChange={(value) => onChangecostPermonth2(value)}
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
            <DatePicker
              showTime={{
                format: "HH:mm",
              }}
              format="YYYY-MM-DD HH:mm"
              onChange={onChangeDate}
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
    ...(dataDefualt.LOAN_TYPE_ID === 1
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
export default UpdateStatus;
