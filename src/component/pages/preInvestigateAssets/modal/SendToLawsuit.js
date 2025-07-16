import {
  Button,
  Form,
  Input,
  Modal,
  Card,
  message,
  Spin,
  Radio,
  Divider,
  Row,
  Col,
  InputNumber,
} from "antd";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_LOAN,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  HEADERS_EXPORT_BEN,
  POST_LITIGATION_FUNDS,
  POST_LOAN_DB2,
  POST_MEMO,
  POST_PRE_INVESTIGATE_LOG,
  PUT_INVESTIGATE_LOG,
} from "../../../API/apiUrls";
import axios from "axios";
import dayjs from "dayjs";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import React, { useEffect, useMemo, useState } from "react";
import LoadLawyers from "../../../../hook/LoadLawyers";

const SendToLawsuit = ({ open, close, dataDefault, funcUpdateStatus }) => {
  const [lawyersList, setLoadingData, loadLawyerJobs] = LoadLawyers();
  const [lawyersOption, setLawyersOption] = useState();
  const [dataJobsLawyer, setDataJobsLawyer] = useState();
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState();
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const [arrow, setArrow] = useState("Show");
  const [radioStatus, setRadioStatus] = useState();
  const [dataLeasingCase, setDataLeasingCase] = useState();
  const [dataLoadLawsuit, setDataLoadLawSuit] = useState();
  const [dataSend, setDataSend] = useState();

  const options = dataLeasingCase
    ? [
        {
          label: `${currencyFormatComma(dataLeasingCase?.usableCapital)} บาท`,
          value: dataLeasingCase?.usableCapital,
        },
        ...(dataLeasingCase?.litigation_capital !==
          dataLeasingCase?.usableCapital &&
        dataLeasingCase?.usableCapital >= 300000
          ? [
              {
                label: `${currencyFormatComma(
                  dataLeasingCase?.litigation_capital
                )} บาท`,
                value: dataLeasingCase?.litigation_capital,
              },
            ]
          : [
              {
                label: `300,000 บาท`,
                value: 300000,
              },
            ]),
      ]
    : [{ label: "ไม่พบข้อมูล", value: 0 }];

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      console.log("loadData", dataDefault);
    }
  }, [isModal]);

  useEffect(() => {
    if (dataLoadLawsuit?.litigation_funds) {
      form.setFieldsValue({
        intigationFounds: dataLoadLawsuit?.litigation_funds,
        courtFee: dataLoadLawsuit?.fee,
        lostProfitAmount: dataLoadLawsuit?.lack_of_benefits,
      });
    }
  }, [dataLoadLawsuit]);

  useEffect(() => {
    setLoadingData(true);
  }, [setLoadingData]);

  useEffect(() => {
    if (lawyersList && loadLawyerJobs) {
      setOption();
      setDataJobsLawyer(loadLawyerJobs);
    }
  }, [lawyersList, loadLawyerJobs]);

  const setOption = () => {
    let companySelect = null;

    if (userCompany === "1" || userCompany === "2") {
      companySelect = lawyersList.filter(
        (item) =>
          (item.COMPANY_ID === 1 || item.COMPANY_ID === 2) &&
          item.ROLE_ID === 3 &&
          item.ACTIVE_STATUS === 1
      );
    } else {
      companySelect = lawyersList.filter(
        (item) =>
          item.COMPANY_ID === 3 &&
          item.ROLE_ID === 3 &&
          item.ACTIVE_STATUS === 1
      );
    }
    const options = companySelect.map((item) => ({
      value: item.id,
      label: item.NNAME,
    }));
    setLawyersOption(options);
  };

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
  }, []);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const loadData = async () => {
    let contno = `'${dataDefault.CONTNO}'`;
    setLoading(true);
    try {
      const [lawsuitRes, loanRes, leasing] = await Promise.all([
        axios.get(
          `${baseUrl}${GET_LAWSUIT_DETAIL_BY_LOAN}${dataDefault.LOAN_ID}`,
          {
            headers: HEADERS_EXPORT,
          }
        ),
        axios.post(
          POST_LOAN_DB2,
          { CONTNO: contno },
          {
            headers: HEADERS_EXPORT_BEN,
          }
        ),
        axios.post(
          POST_LITIGATION_FUNDS,
          {
            contno: dataDefault.CONTNO,
            type: dataDefault.DATA_TYPE.toUpperCase(),
            todate: dayjs().format("YYYY-MM-DD"),
            asset:
              dataDefault.investigationStatus === 7 ||
              dataDefault.investigationStatus === 1
                ? "1"
                : "1",
          },
          {
            headers: HEADERS_EXPORT_BEN,
          }
        ),
      ]);

      if (lawsuitRes.status === 200) {
        console.log("lawsuitRes", lawsuitRes.data);
        setDataLoadLawSuit(lawsuitRes.data);
      } else {
        message.error("ไม่พบข้อมูลคดี");
      }

      if (loanRes.status === 200) {
        console.log("loanRes", loanRes.data[0]);
        setDataLoadLoan(loanRes.data[0]);
      } else {
        message.error("ไม่พบข้อมูลสัญญาในระบบ");
      }
      if (leasing.status === 200) {
        console.log("leasing", leasing.data[0]);
        setDataLeasingCase(leasing.data[0]);
      } else {
        message.error("ไม่พบข้อมูลสัญญาในระบบ");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendData = async (dataLawsuit, assignedJob) => {
    setLoading(true);
    //  .post(
    // "http://localhost:8080/lawyer/dev/api/pre-investigate-assets",
    try {
      await axios
        .post(
          baseUrl + POST_PRE_INVESTIGATE_LOG,
          {
            status: 2,
            data: [assignedJob],
            dataLawsuit: dataLawsuit,
          },
          {
            headers: HEADERS_EXPORT,
          }
        )
        .then(async (resQuery) => {
          if (resQuery.status === 201) {
            console.log("resQuery", resQuery.data);
            funcUpdateStatus();
          } else {
            console.log(`Contract No. Not Found`);

            return null;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      console.log("โหลดข้อมูลสำเร็จ");
      setLoading(false);
      handleCancel();
    }
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    const dataLawsuit = {
      ...dataLoadLawsuit,
      lack_of_benefits: values.lostProfitAmount,
      fee: values.courtFee,
      litigation_funds: values.intigationFounds,
      pre_litigation_funds: values.intigationFounds,
      mark: values.memo,
    };
    console.log("dataLawsuit", dataLawsuit);

    // 🔁 หา minJobUser ใหม่ทุกครั้ง
    const filtered = dataJobsLawyer.filter(
      (item) => item.COMPANY_ID !== 3 && item.ACTIVE_STATUS === 1
    );

    const minJobUser =
      filtered.length > 0
        ? filtered.reduce((min, item) =>
            item.USER_JOBS < min.USER_JOBS ? item : min
          )
        : null;

    if (!minJobUser) return;

    // ⏺ อัปเดต row
    const assignedJob = { ...dataDefault, USER_ID: minJobUser.USER_ID };

    console.log("assignedRows", assignedJob);

    sendData(dataLawsuit, assignedJob);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const onChangeInvestiGateResult = ({ target: { value } }) => {
    setRadioStatus(value);
    let calFeeCourt;
    if (value <= 300000) {
      calFeeCourt = value * 0.02;
      if (calFeeCourt > 1000) {
        calFeeCourt = 1000;
      }
    } else {
      calFeeCourt = value * 0.02;
    }
    let lostBenefit;

    if (dataLeasingCase.usableCapital === 300000) {
      form.setFieldsValue({
        lostProfitAmount: dataLeasingCase.lost_profit_amount,
      });
    } else {
      lostBenefit = dataLeasingCase.balanc - dataLeasingCase.netpay;
      form.setFieldsValue({
        lostProfitAmount: lostBenefit,
      });
      console.log(lostBenefit);
    }

    form.setFieldsValue({
      intigationFounds: value,
      courtFee: calFeeCourt ? (calFeeCourt + 100).toFixed(1) : 0,
    });
  };

  const onChangeIntigationFounds = (value) => {
    let calFeeCourt;
    if (value <= 300000) {
      calFeeCourt = value * 0.02;
      if (calFeeCourt > 1000) {
        calFeeCourt = 1000;
      }
    } else {
      calFeeCourt = value * 0.02;
    }

    form.setFieldsValue({
      courtFee: value ? (calFeeCourt + 100).toFixed(1) : 0,
    });
  };

  const detailLoan = () => {
    return (
      <>
        <Divider>สถานะ</Divider>
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            border: "1px solid #e8e8e8",
            borderRadius: "8px",
          }}
        >
          <Row gutter={16}>
            {dataDefault.investigationDate ? (
              <>
                <Col span="12">
                  <strong>วันที่สืบทรัพย์:</strong>{" "}
                  {convertDateThai(dataDefault.investigationDate)}
                </Col>
                <Col span="12">
                  <p
                    style={{
                      color:
                        dataDefault.investigationStatus === 7 ||
                        dataDefault.investigationStatus === 1
                          ? "green"
                          : dataDefault.investigationStatus === 5
                          ? "blue"
                          : "red",
                    }}
                  >
                    {dataDefault.investigationStatus === 7 ||
                    dataDefault.investigationStatus === 1
                      ? "เจอทรัพย์"
                      : dataDefault.investigationStatus === 5
                      ? "กำลังสืบทรัพย์"
                      : "ไม่เจอทรัพย์"}
                  </p>
                </Col>
              </>
            ) : (
              <Col span={24} style={{ textAlign: "center" }}>
                <p style={{ color: "red" }}>ยังไม่สืบทรัพย์</p>
              </Col>
            )}
          </Row>
        </div>
        {dataDefault.wcc.length ? (
          <>
            {dataDefault.wcc.map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <strong>ประเภทลูกค้า:</strong>{" "}
                    {item.customerTypeID === 0
                      ? "ผู้เช่าซื้อ"
                      : `คนค้ำที่ ${item.customerTypeID}`}
                  </Col>
                  <Col span={12}>
                    <strong>วันที่ตอบกลับ:</strong>{" "}
                    {item.dateResponse
                      ? convertDateThai(item.dateResponse)
                      : "-"}
                  </Col>
                  <Col span={12}>
                    <strong>ชื่อ:</strong> {item.customerFullname || "-"}
                  </Col>
                  <Col span={12}>
                    <strong>สถานะ:</strong>{" "}
                    <span style={{ color: item.status ? "green" : "red" }}>
                      {item.status === 1
                        ? "ใบตอบกลับ"
                        : item.status === 2
                        ? "เว็บไปษณีย์"
                        : item.status === 3
                        ? "ตีกลับ"
                        : "ยังไม่ตอบ"}
                    </span>
                  </Col>
                </Row>
              </div>
            ))}
          </>
        ) : (
          <Col span={24} style={{ textAlign: "center" }}>
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                border: "1px solid #e8e8e8",
                borderRadius: "8px",
              }}
            >
              <p style={{ color: "red" }}>ไม่มีบอกเลิก</p>
            </div>
          </Col>
        )}
      </>
    );
  };

  const formDataSet = () => {
    return (
      <>
        <Divider>รายละเอียดของสัญญา {dataLoadLoan?.LOAN?.CONTNO}</Divider>
        <Form
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          form={form}
          layout="horizontal"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            lostProfitAmount: dataLeasingCase
              ? dataLeasingCase?.lost_profit_amount
              : 0,
          }}
        >
          <Form.Item label="วันที่ทำสัญญา">
            {dataLoadLoan ? convertDateThai(dataLoadLoan?.LOAN.SDATE) : "-"}
          </Form.Item>
          <Form.Item label="วันชำระงวดแรก">
            {dataLoadLoan ? convertDateThai(dataLoadLoan?.LOAN.FDATE) : "-"}
          </Form.Item>
          <Form.Item label="ยอดกู้">
            {dataLeasingCase
              ? currencyFormatComma(dataLeasingCase?.ncarcst || 0)
              : 0}{" "}
            บาท
          </Form.Item>
          <Form.Item label="ดอกเบี้ยเช่าซื้อ">
            {dataLeasingCase
              ? currencyFormatComma(dataLeasingCase?.netprofit || 0)
              : 0}{" "}
            บาท
          </Form.Item>
          <Form.Item label="ภาษีเช่าซื้อ">
            {dataLeasingCase
              ? currencyFormatComma(dataLeasingCase?.vatprc || 0)
              : 0}{" "}
            บาท
          </Form.Item>
          <Form.Item label="ยอดเช่าซื้อทั้งหมด">
            {dataLeasingCase
              ? currencyFormatComma(dataLeasingCase?.balanc || 0)
              : 0}{" "}
            บาท
          </Form.Item>
          <Form.Item label="งวดทั้งหมด">
            {dataLeasingCase ? dataLeasingCase?.t_nopay || 0 : null} งวด
          </Form.Item>
          <Form.Item label="ค่างวด">
            {dataLeasingCase
              ? currencyFormatComma(dataLeasingCase?.tot_upay || 0)
              : 0}{" "}
            บาท
          </Form.Item>
          <Form.Item label="ชำระมาแล้ว">
            {dataLeasingCase
              ? currencyFormatComma(dataLeasingCase?.netpay || 0)
              : 0}{" "}
            บาท
          </Form.Item>
          <Form.Item label="ค้างงวด">
            {dataLeasingCase ? dataLeasingCase?.hldno || 0 : 0} งวด
          </Form.Item>
          <Form.Item label="ยอดคงเหลือ">
            {dataLeasingCase
              ? currencyFormatComma(
                  dataLeasingCase?.balanc - dataLeasingCase?.netpay || 0
                )
              : 0}{" "}
            บาท
          </Form.Item>
          <Form.Item label="เลือกทุนทรัพย์ที่จะใช้ฟ้อง" name="litigation">
            <Radio.Group
              label="เลือกทุนทรัพย์ที่จะใช้ฟ้อง"
              name="litigation"
              options={options}
              onChange={onChangeInvestiGateResult}
              value={radioStatus}
            />
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
            <InputNumber
              suffix="บาท"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              size="large"
              placeholder="กรุณาใส่จำนวนทุนทรัพย์"
              style={{ width: "80%", color: "black" }}
              onChange={(value) => onChangeIntigationFounds(value)}
            />
          </Form.Item>
          <Form.Item
            label="ค่าขาดประโยชน์"
            name="lostProfitAmount"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ค่าขาดประโยชน์ !",
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
              placeholder="กรุณาใส่ค่าขาดประโยชน์"
              style={{ width: "80%", color: "black" }}
              defaultValue={dataLeasingCase?.lost_profit_amount || 0}
            />
          </Form.Item>
          <Form.Item
            label="ค่าธรรมเนียมศาล"
            name="courtFee"
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
              style={{ width: "80%", color: "black" }}
            />
          </Form.Item>

          <Form.Item label="หมายเหตุ" name="memo">
            <TextArea
              rows={10}
              style={{ width: "80%", color: "black" }}
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
      </>
    );
  };

  return (
    <>
      <Modal
        title={`ส่งทนายฟ้องสัญญา`}
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          {detailLoan()}
          {dataLeasingCase ? formDataSet() : null}
        </Spin>
      </Modal>
    </>
  );
};
export default SendToLawsuit;
