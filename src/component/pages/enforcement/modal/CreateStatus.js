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

const CreateStatus = ({ open, close, dataDefualt, responseData }) => {
  const [setupGovernmentOfficerList, governmentOfficers] =
    CheckGovermentOfficer();
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

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      //   loadData();
      //   setLoadingData(true);
      console.log("loadData", dataDefualt);
      console.log("lawsuit", responseData.WORK_LOG_ID);
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

  const handleCancel = () => {
    close(false);
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
      const [worklogs, loanRes] = await Promise.all([
        axios.get(
          `${baseUrl}${GET_WORK_LOG_DETAIL_BY_ID}${responseData.WORK_LOG_ID}`,
          {
            headers: HEADERS_EXPORT,
          }
        ),
        axios.get(`${baseUrl}${GET_LOAN_BY_CONTNO}${dataDefualt.contno}`, {
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
      if (radioDecide === "payment" || radioDecide === "agreementFinish") {
        console.log("agreement", agreement);
        await axios
          .put(baseUrl + PUT_STATUS, putStatus, { headers: HEADERS_EXPORT })
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
          PROCESS_ID: STATUS_PROCESS_PROGRESS,
        };
      }

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

      if (radioDecide === "agreement" || radioDecide === "agreementFinish") {
        putStatus = {
          id: responseData.WORK_LOG_ID,
          USER_ID: dataDefualt.LAWYER_ID,
          LOAN_ID: dataDefualt.LOAN_ID,
          MEMO:
            values.memo +
            "คำพิพากษาไม่ผ่านระบบไม่บันทึกหมายตั้งและคดีถึงที่สุด",
          DATE: dataDefualt.DATE,
          PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
          LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
        };

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

      sendStatus(
        judgementData,
        defendants,
        finishStatus,
        agreement,
        statusData,
        putStatus
      );
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
      textStatus = "ทำยอม(ปรับโครงสร้าง)";
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
                  //   onChange={onChangeDateAgreement}
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
          {formDataPayment()}
        </Spin>
      </Modal>
    </>
  );
};
export default CreateStatus;
