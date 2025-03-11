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
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";

import CurrencyFormat from "../../../../hook/CurrencyFormat";
import { optionsInterest } from "../../../../utils/constant/ Interest";
import CheckGovermentOfficer from "../../../../hook/CeckGovermentOfficer";
import { optionsMonth } from "../../../../utils/constant/MonthSelect";
import dayjs from "dayjs";
import LoadLawyers from "../../../../hook/LoadLawyers";
import {
  PAYMENT,
  STATUS_PROCESS_PROGRESS,
} from "../../../../utils/constant/StatusConstant";
import Dragger from "antd/es/upload/Dragger";

const CreateJudgement = ({ open, close, dataDefualt, responseData }) => {
  const [setupGovernmentOfficerList, governmentOfficers] =
    CheckGovermentOfficer();
  const name = localStorage.getItem("FNAME");
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
  const [defaultRadio, setDefaultRadio] = useState("normal");
  const [currencyFormatComma] = CurrencyFormat();
  const [arrow, setArrow] = useState("Show");
  const [tabsKey, setTabsKey] = useState("1");
  const [checkboxTab1, setCheckBoxTab1] = useState({});
  const [checkboxTab2, setCheckBoxTab2] = useState({});
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      setLoadingData(true);
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

  const handleOk = () => {};

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

  const sendStatus = async (defendants, judgement, status, agreement) => {
    setLoading(true);

    try {
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

        await axios
          .post(baseUrl + POST_STATUS, status, { headers: HEADERS_EXPORT })
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
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
      window.location.reload();
    }
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    let defendants = [];
    let statusData;
    let judgementData;
    let agreement;

    if (values?.file?.fileList?.length < 1 || fileList.length < 1) {
      message.error("กรุณาใส่ไฟล์เพื่อบันทึก");
    } else {
      console.log("defendants", defendants);
      if (defaultRadio === "normal") {
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

        if (dataDefualt.LOAN_TYPE_ID !== 2) {
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
              : 0,
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
              : 0,
          suspension_amount: values.suspensionAmount
            ? values.suspensionAmount
            : 0,
          judgement_lack: values.judgement_lack ? values.judgement_lack : 0,
          interest_rate_of_lack: values.interestRateLack
            ? values.interestRateLack
            : 0,
        };

        // statusData = {
        //   id: responseData.WORK_LOG_ID,
        //   USER_ID: dataDefualt.USER_ID,
        //   LOAN_ID: dataDefualt.LOAN_ID,
        //   MEMO: values.memo,
        //   DATE: dayjs(values.enforceCaseDate).format("YYYY-MM-DD"),
        //   MAIN_STATUS_ID: dataDefualt.MAIN_STATUS_ID,
        //   PROCESS_ID: dataDefualt.PROCESS_ID,
        // };
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
          document_filepath: null,
          mark: values.memo,
          due_date: preData.dateAgreement,
          already_paid: null,
          payment_status: null,
          payment_status_date: null,
          negotiator_id: values.negotiator,
          NEW_CONTNO: values.newContno ? values.newContno : null,
        };
      }
      console.log("defendants", defendants);
      console.log("judgementData", judgementData);
      console.log("statusData", statusData);
      console.log("agreement", agreement);

      sendStatus(defendants, judgementData, statusData, agreement);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChange = (e) => {
    setDefaultRadio(e.target.value);
    console.log(e.target.value);
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
        {/* <Button
          onClick={handleCancel}
          style={{ color: "red", marginRight: "20px" }}
        >
          ปิด
        </Button> */}

        <Button style={{ color: "green" }} htmlType="submit">
          บันทึก
        </Button>
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

        {dataDefualt.LOAN_TYPE_ID !== 2 ? (
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

  // const handleCheckBoxGroupGoverment = () => {
  //   if (checkLenght) {
  //     return (
  //       <>
  //         <Checkbox.Group onChange={onChangeGovermentOfficer}>
  //           <Space direction="vertical" style={{ marginTop: "5px" }}>
  //             {tabsKey === "1" ? (
  //               <Checkbox value={governmentOfficers}>
  //                 {governmentOfficers
  //                   ? `จำเลยที่ 1 ${governmentOfficers?.SNAM} ${governmentOfficers?.NAME1} ${governmentOfficers?.NAME2}`
  //                   : "-"}
  //               </Checkbox>
  //             ) : null}
  //             {checkLenght > 0 ? (
  //               <Checkbox value={governmentOfficers?.guarantors[0]}>
  //                 {governmentOfficers?.guarantors?.length > 0
  //                   ? `จำเลยที่ 2 ${governmentOfficers?.guarantors[0]?.SNAM} ${governmentOfficers?.guarantors[0]?.NAME1} ${governmentOfficers?.guarantors[0]?.NAME2}`
  //                   : "ไม่มีจำเลยที่ 2"}
  //               </Checkbox>
  //             ) : null}
  //             {checkLenght > 1 ? (
  //               <Checkbox value={governmentOfficers?.guarantors[1]}>
  //                 {governmentOfficers?.guarantors?.length > 1
  //                   ? `จำเลยที่ 3 ${governmentOfficers?.guarantors[1]?.SNAM} ${governmentOfficers?.guarantors[1]?.NAME1} ${governmentOfficers?.guarantors[1]?.NAME2}`
  //                   : "ไม่มีจำเลยที่ 3"}
  //               </Checkbox>
  //             ) : null}
  //             {checkLenght > 2 ? (
  //               <Checkbox value={governmentOfficers?.guarantors[2]}>
  //                 {governmentOfficers?.guarantors?.length > 2
  //                   ? `จำเลยที่ 4 ${governmentOfficers?.guarantors[2]?.SNAM} ${governmentOfficers?.guarantors[2]?.NAME1} ${governmentOfficers?.guarantors[2]?.NAME2}`
  //                   : "ไม่มีจำเลยที่ 4"}
  //               </Checkbox>
  //             ) : null}
  //           </Space>
  //           <Space direction="vertical" style={{ marginTop: "5px" }}>
  //             {checkLenght > 3 ? (
  //               <Checkbox value={governmentOfficers?.guarantors[3]}>
  //                 {governmentOfficers?.guarantors?.length > 3
  //                   ? `จำเลยที่ 5 ${governmentOfficers?.guarantors[3]?.SNAM} ${governmentOfficers?.guarantors[3]?.NAME1} ${governmentOfficers?.guarantors[3]?.NAME2}`
  //                   : "ไม่มีจำเลยที่ 5"}
  //               </Checkbox>
  //             ) : null}
  //             {checkLenght > 4 ? (
  //               <Checkbox
  //                 value={governmentOfficers?.guarantors[4]}
  //                 disabled="false"
  //               >
  //                 {governmentOfficers?.guarantors?.length > 4
  //                   ? `จำเลยที่ 6 ${governmentOfficers?.guarantors[4]?.SNAM} ${governmentOfficers?.guarantors[4]?.NAME1} ${governmentOfficers?.guarantors[4]?.NAME2}`
  //                   : "ไม่มีจำเลยที่ 6"}
  //               </Checkbox>
  //             ) : null}
  //             {checkLenght > 5 ? (
  //               <Checkbox value={governmentOfficers?.guarantors[5]}>
  //                 {governmentOfficers?.guarantors?.length > 5
  //                   ? `จำเลยที่ 7 ${governmentOfficers?.guarantors[5]?.SNAM} ${governmentOfficers?.guarantors[5]?.NAME1} ${governmentOfficers?.guarantors[5]?.NAME2}`
  //                   : "ไม่มีจำเลยที่ 7"}
  //               </Checkbox>
  //             ) : null}
  //             {checkLenght > 6 ? (
  //               <Checkbox value={governmentOfficers?.guarantors[6]}>
  //                 {governmentOfficers?.guarantors?.length > 6
  //                   ? `จำเลยที่ 8 ${governmentOfficers?.guarantors[6]?.SNAM} ${governmentOfficers?.guarantors[6]?.NAME1} ${governmentOfficers?.guarantors[6]?.NAME2}`
  //                   : "ไม่มีจำเลยที่ 8"}
  //               </Checkbox>
  //             ) : null}
  //           </Space>
  //         </Checkbox.Group>
  //       </>
  //     );
  //   } else {
  //     return null;
  //   }
  // };

  const handleCheckBoxGroupGoverment = () => {
    if (!checkLenght) return null;

    const defendants = [
      {
        value: governmentOfficers,
        label: governmentOfficers
          ? `จำเลยที่ 1 ${governmentOfficers?.SNAM} ${governmentOfficers?.NAME1} ${governmentOfficers?.NAME2}`
          : "-",
        show: tabsKey === "1",
      },
      ...(governmentOfficers?.guarantors || []).map((guarantor, index) => ({
        value: guarantor,
        label: `จำเลยที่ ${index + 2} ${guarantor?.SNAM} ${guarantor?.NAME1} ${
          guarantor?.NAME2
        }`,
        show: index < checkLenght,
      })),
    ];

    return (
      <Checkbox.Group onChange={onChangeGovermentOfficer}>
        <Space direction="vertical" style={{ marginTop: "5px" }}>
          {defendants
            .filter((defendant) => defendant.show)
            .map((defendant, idx) => (
              <Checkbox key={idx} value={defendant.value}>
                {defendant.label}
              </Checkbox>
            ))}
        </Space>
      </Checkbox.Group>
    );
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const handleUploadAllImage = () => {
    let maintType;
    if (defaultRadio === "normal") {
      maintType = "enforcement";
    } else {
      maintType = "settlement_agreement";
    }
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);

    axios
      .post(
        baseUrl +
          `/files/lawyer/${maintType}/${name}/${dataDefualt.contract_no}`,
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
            suspensionAmount: 0,
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
            <DatePicker onChange={onChangeCourt} />
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
              // placeholder="กรุณากรอกจัดทำเอกสารไม่มีใส่ 0"
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
          {/* <Form.Item
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
          </Form.Item> */}
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
          <Form.Item label="ค่าขาดประโยชน์เดือนละ" name="costPermonth2">
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
                name="costUnless2"
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

  const onChangeTabs = (key) => {
    console.log(key);
    setTabsKey(key);
  };

  const onChangeNewContno = (value) => {
    console.log(value);
  };

  const onChangPaymentAmount = (value) => {
    console.log(value);
  };

  const onChangPaymentPerMonthAmount = (value) => {
    console.log(value);
  };

  const onChangeDateAgreement = (date, dateString) => {
    console.log(date, dateString);
    setPreData({ ...preData, dateAgreement: dateString });
  };

  const onChangeSelectInvestigatorAsset = (value) => {
    console.log(`selected ${value}`);
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
            <InputNumber
              suffix="บาท"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              size="large"
              placeholder="กรุณาใส่ค่าติดตาม !"
              style={{ width: "100%", color: "black" }}
              onChange={(value) => onChangPaymentAmount(value)}
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
            <InputNumber
              suffix="บาท"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              size="large"
              placeholder="กรุณาใส่ค่าติดตาม !"
              style={{ width: "100%", color: "black" }}
              onChange={(value) => onChangPaymentPerMonthAmount(value)}
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

          {/* <Form.Item
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
          </Form.Item> */}
          <Form.Item
            label="ไฟล์ทำยอม"
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
          <Form.Item
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
              placeholder="เลือกผู้เจรจา"
              optionFilterProp="value"
              onChange={(value) => onChangeSelectInvestigatorAsset(value)}
              options={assistantOption}
              style={{ width: "100%" }}
            />
          </Form.Item>
          {buttonCustom()}
        </Form>
      </Card>
    );
  };

  const items = [
    {
      key: "1",
      label: "คำพิพากษาจำเลยที่ ๑",
      children: formJudge1(),
    },
    ...(dataDefualt.LOAN_TYPE_ID !== 2
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
        title={`ข้อมูลพิพากษา ${dataLoadLawSuit?.lawsuit?.CONTNO}/${dataLoadLawSuit?.lawsuit?.customer_title}${dataLoadLawSuit?.lawsuit?.customer_name} ${dataLoadLawSuit?.lawsuit?.customer_lastname}`}
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
            <Radio value="payment">ทำยอม</Radio>
          </Radio.Group>
          {defaultRadio === "payment" ? (
            formDataPayment()
          ) : (
            <Tabs activeKey={tabsKey} onChange={onChangeTabs} centered>
              {items.map((item) => (
                <Tabs.TabPane tab={item.label} key={item.key}>
                  {item.children}
                </Tabs.TabPane>
              ))}
            </Tabs>
          )}
        </Spin>
      </Modal>
    </>
  );
};
export default CreateJudgement;
