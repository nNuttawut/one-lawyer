import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  message,
  Modal,
  Row,
  Steps,
  Tabs,
} from "antd";
import {
  FormOutlined,
  AuditOutlined,
  SearchOutlined,
  NotificationOutlined,
  SolutionOutlined,
  FileDoneOutlined,
  AlertOutlined,
  CreditCardOutlined,
  SoundOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {
  baseUrl,
  GET_DETAILS,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
} from "../../API/apiUrls";
import DateCustom from "../../../hook/DateCustom";
import CurrencyFormat from "../../../hook/CurrencyFormat";
import dayjs from "dayjs";

const DetailModal = ({ open, close, dataRec }) => {
  const [form] = Form.useForm();
  const [convertDateThai] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [loading, setLoading] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [tabsKey, setTabsKey] = useState("1");
  const [status, setStatus] = useState({
    notice: "wait",
    lawsuit: "wait",
    judgement: "wait",
    enforceCase: "wait",
    finalCase: "wait",
    investigate: "wait",
    enforcement: "wait",
    negotiate: "wait",
    sellAssets: "wait",
    payment: "wait",
  });
  const [dataDetail, setDataDetail] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [dataLawsuit, setDataLawsuit] = useState({
    nopay: 0,
    lossBenefit: 0,
  });
  const [judgeNumber1, setJudgeNumber1] = useState(null);
  const [judgeNumber2, setJudgeNumber2] = useState(null);
  const [dataProvice, setDataProvice] = useState(null);
  const [dataDistrict, setDataDistrict] = useState();
  const [dataSubDistrict, setDataSubDistrict] = useState();

  const handleStatusChange = (current) => {
    const newStatus = { ...status };
    if (current) {
      newStatus.Notice = newStatus.Notice === "wait" ? "finish" : "wait";
      newStatus.investigateAssets =
        newStatus.investigateAssets === "wait" ? "finish" : "wait";
      newStatus.sendToEnforcement =
        newStatus.sendToEnforcement === "wait" ? "finish" : "wait";
      newStatus.enforcement =
        newStatus.enforcement === "wait" ? "finish" : "wait";
    }

    setStatus(newStatus);
  };

  useEffect(() => {
    if (dataRec) {
      loadData();
      console.log("dataRecord", dataRec);
    }
  }, []);

  useEffect(() => {
    if (dataDetail && loanData) {
      let dateCurrent = dayjs(dataDetail?.lawsuit?.date_of_plaint);
      let lastPayDate = dayjs(loanData?.LOAN?.LPAYD);

      const differenceMonth = dateCurrent.diff(lastPayDate, "month");
      const lossBenefitValue = loanData?.LOAN?.TOT_UPAY
        ? differenceMonth * loanData?.LOAN?.TOT_UPAY
        : 0;
      setDataLawsuit((prev) => ({
        ...prev,
        nopay: differenceMonth,
        lossBenefit: lossBenefitValue,
      }));

      if (dataDetail?.judge?.defendants) {
        const judgeNu1 = dataDetail?.judge?.defendants.filter(
          (item) => item?.judge_number === 1
        );

        setJudgeNumber1(judgeNu1);

        const judgeNu2 = dataDetail?.judge?.defendants.filter(
          (item) => item?.judge_number === 2
        );

        setJudgeNumber2(judgeNu2);
      }
    }
  }, [dataDetail, loanData]);

  const loadData = async () => {
    setLoading(true);

    try {
      await axios
        .get(baseUrl + GET_DETAILS + dataRec.CONTNO, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("res detail", res.data);
            setDataDetail(res.data);
          } else {
            message.error("ไม่มีข้อมูล");
            console.log("res Role", res.data);
          }
        })
        .catch((err) => console.log("ไม่มีข้อมูล", err));

      await axios
        .get(baseUrl + GET_LOAN_BY_CONTNO + dataRec.CONTNO, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("res loan", res.data);
            setLoanData(res.data);
          } else {
            message.error("ไม่มีข้อมูล");
            console.log("res Role", res.data);
          }
        })
        .catch((err) => console.log("ไม่มีข้อมูล", err));
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  const onChangeTabs = (key) => {
    console.log(key);
    setTabsKey(key);
  };

  const formStatusProgress = () => {
    return (
      <>
        <Divider>สถานะการทำงาน</Divider>
        <Card
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Steps
            responsive={true}
            direction="vertical"
            // percent={50}
            current={Object.values(status).indexOf("finish")}
            onChange={handleStatusChange}
            status="error"
            items={[
              {
                title: "ส่ง notice",
                status: dataDetail?.STATUS1 === "1" ? "finish" : "wait",
                icon: <AlertOutlined />,
              },
              {
                title: "ส่งคำฟ้อง",
                status: dataDetail?.STATUS2 === "1" ? "finish" : "wait",
                icon: <FormOutlined />,
              },
              {
                title: "พิพากษา",
                status: dataDetail?.STATUS3 === "1" ? "finish" : "wait",
                icon: <SolutionOutlined />,
              },
              {
                title: "คดีหมายตั้ง",
                status: dataDetail?.STATUS4 === "1" ? "finish" : "wait",
                icon: <AuditOutlined />,
              },

              {
                title: "คดีถึงที่สุด",
                status: dataDetail?.STATUS6 === "1" ? "finish" : "wait",
                icon: <FileDoneOutlined />,
              },
              {
                title: "สืบทรัพย์",
                status: dataDetail?.STATUS7 === "1" ? "finish" : "wait",
                icon: <SearchOutlined />,
              },

              {
                title: "บังคับคดี",
                status: dataDetail?.STATUS8 === "1" ? "finish" : "wait",
                icon: <ThunderboltOutlined />,
              },
              {
                title: "เจรจาหนี้",
                status: dataDetail?.STATUS9 === "1" ? "finish" : "wait",
                icon: <SoundOutlined />,
              },
              {
                title: "ประกาศขายทรัพย์",
                status: dataDetail?.STATUS10 === "1" ? "finish" : "wait",
                icon: <NotificationOutlined />,
              },

              {
                title: "ทำยอม",
                status: dataDetail?.STATUS5 === "1" ? "finish" : "wait",
                icon: <CreditCardOutlined />,
              },
            ]}
          />
        </Card>
      </>
    );
  };

  const formDetail = () => {
    if (loanData) {
      return (
        <div style={{ textAlign: "center" }}>
          <Divider>รายละเอียดสัญญา</Divider>
          <Row>
            <Col span={12}>
              <b>สัญญาเลขที่ : </b> {loanData?.LOAN?.CONTNO} <br />
              <b>จำนวนงวด :</b> {loanData?.LOAN?.T_NOPAY} งวด
              <br />
              <b>ยอดกู้ไม่รวมดอก :</b>{" "}
              {loanData?.LOAN?.NCSHPRC
                ? currencyFormatComma(loanData?.LOAN?.NCSHPRC)
                : null}{" "}
              บาท
              <br />
              <b>จ่ายล่าสุดวันที่ :</b> {convertDateThai(loanData?.LOAN?.LPAYD)}{" "}
              <br />
              <b>ยอดที่จ่ายมาแล้ว :</b>{" "}
              {loanData?.LOAN?.SMPAY
                ? currencyFormatComma(loanData?.LOAN?.SMPAY)
                : null}{" "}
              บาท
              <br />
            </Col>
            <Col span={12}>
              <b>วันที่ทำสัญญา : </b> {convertDateThai(loanData?.LOAN?.SDATE)}{" "}
              <br />
              <b>ค่างวด : </b>{" "}
              {loanData?.LOAN?.TOT_UPAY
                ? currencyFormatComma(loanData?.LOAN?.TOT_UPAY)
                : null}{" "}
              บาท
              <br />
              <b>ยอดกู้รวมดอก : </b>{" "}
              {loanData?.LOAN?.TOTPRC
                ? currencyFormatComma(loanData?.LOAN?.TOTPRC)
                : null}{" "}
              บาท
              <br />
              <b>จำนวนที่จ่ายล่าสุด :</b>{" "}
              {loanData?.LOAN?.LPAYA
                ? currencyFormatComma(loanData?.LOAN?.LPAYA)
                : null}{" "}
              บาท
              <br />
              <b>จำนวนงวดที่ค้าง :</b> {loanData?.LOAN?.EXP_FRM} ถึง{" "}
              {loanData?.LOAN?.EXP_TO}
              <br />
            </Col>
          </Row>
          <Divider>รายละเอียดรถ</Divider>
          <Row>
            <Col span={12}>
              <b>ยี่ห้อ : </b> {loanData?.MORTGAGE?.TYPE} <br />
              <b>ชนิดรถ :</b> {loanData?.MORTGAGE?.BAAB}
              <br />
              <b>ทะเบียน :</b> {loanData?.MORTGAGE?.REGNO}
              <br />
              <b>เลขเครื่อง :</b> {loanData?.MORTGAGE?.ENGNO} <br />
              <b>ปีที่จดทะเบียน :</b> {loanData?.MORTGAGE?.MANUYR}
              <br />
            </Col>
            <Col span={12}>
              <b>รุ่น : </b> {loanData?.MORTGAGE?.MODEL} <br />
              <b>สี : </b> {loanData?.MORTGAGE?.COLOR}
              <br />
              <b>จังหวัด : </b> {loanData?.MORTGAGE?.DORECV}
              <br />
              <b>เลขตัวถัง :</b> {loanData?.MORTGAGE?.STRNO}
              <br />
            </Col>
          </Row>
          <Divider>รายละเอียดผู้กู้</Divider>
          <Row>
            <Col span={12}>
              <b>ชื่อ : </b> {loanData?.CUSTOMER?.SNAM}
              {loanData?.CUSTOMER?.NAME1} {loanData?.CUSTOMER?.NAME2}
              <br />
              <b>ที่อยู่ : </b> {loanData?.CUSTOMER?.ADDRESS[0]?.ADDR1}
              <br />
              <b>ซอย : </b>{" "}
              {loanData?.CUSTOMER?.ADDRESS[0]?.SOI
                ? loanData?.CUSTOMER?.ADDRESS[0]?.SOI
                : "-"}
              <br />
              <b>อำเภอ : </b>
              {loanData?.CUSTOMER?.ADDRESS[0]?.AUMPDES} <br />
              <b>รหัสไปษณีย์ : </b> {loanData?.CUSTOMER?.ADDRESS[0]?.ZIP}
              <br />
              {loanData?.CUSTOMER?.ADDRESS.length > 1 ? (
                <>
                  <b>ที่อยู่ : </b> {loanData?.CUSTOMER?.ADDRESS[1]?.ADDR1}
                  <br />
                  <b>ซอย :</b>{" "}
                  {loanData?.CUSTOMER?.ADDRESS[1]?.SOI
                    ? loanData?.CUSTOMER?.ADDRESS[1]?.SOI
                    : "-"}
                  <br />
                  <b>อำเภอ : </b>
                  {loanData?.CUSTOMER?.ADDRESS[1]?.AUMPDES} <br />
                  <b>รหัสไปษณีย์ :</b> {loanData?.CUSTOMER?.ADDRESS[1]?.ZIP}
                  <br />
                </>
              ) : null}
            </Col>
            <Col span={12}>
              <b>อาชีพ : </b> {loanData?.CUSTOMER?.OFFIC} <br />
              <b>หมู่บ้าน : </b>{" "}
              {loanData?.CUSTOMER?.ADDRESS[0]?.MOOBAN
                ? loanData?.CUSTOMER?.ADDRESS[0]?.MOOBAN
                : "-"}
              <br />
              <b>ตำบล : </b> {loanData?.CUSTOMER?.ADDRESS[0]?.TUMB}
              <br />
              <b>จังหวัด :</b> {loanData?.CUSTOMER?.ADDRESS[0]?.PROVDES}
              <br />
              <b>เบอร์โทร :</b>{" "}
              {loanData?.CUSTOMER?.ADDRESS[0]?.TELP
                ? loanData?.CUSTOMER?.ADDRESS[0]?.TELP
                : "-"}{" "}
              <br />
              {loanData?.CUSTOMER?.ADDRESS.length > 1 ? (
                <>
                  <b>หมู่บ้าน : </b>{" "}
                  {loanData?.CUSTOMER?.ADDRESS[1]?.MOOBAN
                    ? loanData?.CUSTOMER?.ADDRESS[1]?.MOOBAN
                    : "-"}
                  <br />
                  <b>ตำบล : </b> {loanData?.CUSTOMER?.ADDRESS[1]?.TUMB}
                  <br />
                  <b>จังหวัด : </b> {loanData?.CUSTOMER?.ADDRESS[1]?.PROVDES}
                  <br />
                </>
              ) : null}
            </Col>
          </Row>
          {loanData?.GUARANTORS?.length > 0 ? (
            <>
              <Divider>รายละเอียดคนค้ำที่ 1 </Divider>
              <Row>
                <Col span={12}>
                  <b>ชื่อ : </b> {loanData?.GUARANTORS[0]?.SNAM}
                  {loanData?.GUARANTORS[0]?.NAME1}{" "}
                  {loanData?.GUARANTORS[0]?.NAME2} <br />
                  <b>ที่อยู่ :</b> {loanData?.GUARANTORS[0]?.ADDRESS[0]?.ADDR1}
                  <br />
                  <b>ซอย :</b>{" "}
                  {loanData?.GUARANTORS[0]?.ADDRESS[0]?.SOI
                    ? loanData?.GUARANTORS[0]?.ADDRESS[0]?.SOI
                    : "-"}
                  <br />
                  <b>อำเภอ :</b> {loanData?.GUARANTORS[0]?.ADDRESS[0]?.AUMPDES}{" "}
                  <br />
                  <b>รหัสไปษณีย์ :</b>{" "}
                  {loanData?.GUARANTORS[0]?.ADDRESS[0]?.ZIP}
                  <br />
                </Col>
                <Col span={12}>
                  <b>อาชีพ : </b> {loanData?.GUARANTORS[0]?.OFFIC} <br />
                  <b>หมู่บ้าน : </b>{" "}
                  {loanData?.GUARANTORS[0]?.ADDRESS[0]?.MOOBAN
                    ? loanData?.GUARANTORS[0]?.ADDRESS[0]?.MOOBAN
                    : "-"}
                  <br />
                  <b>ตำบล : </b> {loanData?.GUARANTORS[0]?.ADDRESS[0]?.TUMB}
                  <br />
                  <b>จังหวัด :</b>{" "}
                  {loanData?.GUARANTORS[0]?.ADDRESS[0]?.PROVDES}
                  <br />
                  <b>เบอร์โทร :</b>
                  {loanData?.GUARANTORS[0]?.ADDRESS[0]?.TELP}
                </Col>
              </Row>
              {loanData?.GUARANTORS?.length > 1 ? (
                <>
                  <Divider>รายละเอียดคนค้ำที่ 2 </Divider>
                  <Row>
                    <Col span={12}>
                      <b>ชื่อ : </b> {loanData?.GUARANTORS[1]?.SNAM}
                      {loanData?.GUARANTORS[1]?.NAME1}{" "}
                      {loanData?.GUARANTORS[1]?.NAME2} <br />
                      <b>ที่อยู่ :</b>{" "}
                      {loanData?.GUARANTORS[1]?.ADDRESS[0]?.ADDR1}
                      <br />
                      <b>ซอย :</b>{" "}
                      {loanData?.GUARANTORS[1]?.ADDRESS[0]?.SOI
                        ? loanData?.GUARANTORS[1]?.ADDRESS[0]?.SOI
                        : "-"}
                      <br />
                      <b>อำเภอ :</b>{" "}
                      {loanData?.GUARANTORS[1]?.ADDRESS[0]?.AUMPDES} <br />
                      <b>รหัสไปษณีย์ :</b>{" "}
                      {loanData?.GUARANTORS[1]?.ADDRESS[0]?.ZIP}
                      <br />
                    </Col>
                    <Col span={12}>
                      <b>อาชีพ : </b> {loanData?.GUARANTORS[1]?.OFFIC} <br />
                      <b>หมู่บ้าน : </b>{" "}
                      {loanData?.GUARANTORS[1]?.ADDRESS[0]?.MOOBAN
                        ? loanData?.GUARANTORS[1]?.ADDRESS[0]?.MOOBAN
                        : "-"}
                      <br />
                      <b>ตำบล : </b> {loanData?.GUARANTORS[1]?.ADDRESS[0]?.TUMB}
                      <br />
                      <b>จังหวัด :</b>{" "}
                      {loanData?.GUARANTORS[1]?.ADDRESS[0]?.PROVDES}
                      <br />
                      <b>เบอร์โทร :</b>
                      {loanData?.GUARANTORS[1]?.ADDRESS[0]?.TELP}
                    </Col>
                  </Row>
                </>
              ) : null}
              {loanData?.GUARANTORS?.length > 2 ? (
                <>
                  <Divider>รายละเอียดคนค้ำที่ 3 </Divider>
                  <Row>
                    <Col span={12}>
                      <b>ชื่อ : </b> {loanData?.GUARANTORS[1]?.SNAM}
                      {loanData?.GUARANTORS[2]?.NAME1}{" "}
                      {loanData?.GUARANTORS[2]?.NAME2} <br />
                      <b>ที่อยู่ :</b>{" "}
                      {loanData?.GUARANTORS[2]?.ADDRESS[0]?.ADDR1}
                      <br />
                      <b>ซอย :</b>{" "}
                      {loanData?.GUARANTORS[2]?.ADDRESS[0]?.SOI
                        ? loanData?.GUARANTORS[2]?.ADDRESS[0]?.SOI
                        : "-"}
                      <br />
                      <b>อำเภอ :</b>{" "}
                      {loanData?.GUARANTORS[2]?.ADDRESS[0]?.AUMPDES} <br />
                      <b>รหัสไปษณีย์ :</b>{" "}
                      {loanData?.GUARANTORS[2]?.ADDRESS[0]?.ZIP}
                      <br />
                    </Col>
                    <Col span={12}>
                      <b>อาชีพ : </b> {loanData?.GUARANTORS[2]?.OFFIC} <br />
                      <b>หมู่บ้าน : </b>{" "}
                      {loanData?.GUARANTORS[2]?.ADDRESS[0]?.MOOBAN
                        ? loanData?.GUARANTORS[2]?.ADDRESS[0]?.MOOBAN
                        : "-"}
                      <br />
                      <b>ตำบล : </b> {loanData?.GUARANTORS[2]?.ADDRESS[0]?.TUMB}
                      <br />
                      <b>จังหวัด :</b>{" "}
                      {loanData?.GUARANTORS[2]?.ADDRESS[0]?.PROVDES}
                      <br />
                      <b>เบอร์โทร :</b>
                      {loanData?.GUARANTORS[2]?.ADDRESS[0]?.TELP}
                    </Col>
                  </Row>
                </>
              ) : null}
              {loanData?.GUARANTORS?.length > 3 ? (
                <>
                  <Divider>รายละเอียดคนค้ำที่ 4 </Divider>
                  <Row>
                    <Col span={12}>
                      <b>ชื่อ : </b> {loanData?.GUARANTORS[1]?.SNAM}
                      {loanData?.GUARANTORS[3]?.NAME1}{" "}
                      {loanData?.GUARANTORS[3]?.NAME2} <br />
                      <b>ที่อยู่ :</b>{" "}
                      {loanData?.GUARANTORS[3]?.ADDRESS[0]?.ADDR1}
                      <br />
                      <b>ซอย :</b>{" "}
                      {loanData?.GUARANTORS[3]?.ADDRESS[0]?.SOI
                        ? loanData?.GUARANTORS[3]?.ADDRESS[0]?.SOI
                        : "-"}
                      <br />
                      <b>อำเภอ :</b>{" "}
                      {loanData?.GUARANTORS[3]?.ADDRESS[0]?.AUMPDES} <br />
                      <b>รหัสไปษณีย์ :</b>{" "}
                      {loanData?.GUARANTORS[3]?.ADDRESS[0]?.ZIP}
                      <br />
                    </Col>
                    <Col span={12}>
                      <b>อาชีพ : </b> {loanData?.GUARANTORS[3]?.OFFIC} <br />
                      <b>หมู่บ้าน : </b>{" "}
                      {loanData?.GUARANTORS[3]?.ADDRESS[0]?.MOOBAN
                        ? loanData?.GUARANTORS[3]?.ADDRESS[0]?.MOOBAN
                        : "-"}
                      <br />
                      <b>ตำบล : </b> {loanData?.GUARANTORS[3]?.ADDRESS[0]?.TUMB}
                      <br />
                      <b>จังหวัด :</b>{" "}
                      {loanData?.GUARANTORS[3]?.ADDRESS[0]?.PROVDES}
                      <br />
                      <b>เบอร์โทร :</b>
                      {loanData?.GUARANTORS[3]?.ADDRESS[0]?.TELP}
                    </Col>
                  </Row>
                </>
              ) : null}
              {loanData?.GUARANTORS?.length > 4 ? (
                <>
                  <Divider>รายละเอียดคนค้ำที่ 5 </Divider>
                  <Row>
                    <Col span={12}>
                      <b>ชื่อ : </b> {loanData?.GUARANTORS[1]?.SNAM}
                      {loanData?.GUARANTORS[4]?.NAME1}{" "}
                      {loanData?.GUARANTORS[4]?.NAME2} <br />
                      <b>ที่อยู่ :</b>{" "}
                      {loanData?.GUARANTORS[4]?.ADDRESS[0]?.ADDR1}
                      <br />
                      <b>ซอย :</b>{" "}
                      {loanData?.GUARANTORS[4]?.ADDRESS[0]?.SOI
                        ? loanData?.GUARANTORS[4]?.ADDRESS[0]?.SOI
                        : "-"}
                      <br />
                      <b>อำเภอ :</b>{" "}
                      {loanData?.GUARANTORS[4]?.ADDRESS[0]?.AUMPDES} <br />
                      <b>รหัสไปษณีย์ :</b>{" "}
                      {loanData?.GUARANTORS[4]?.ADDRESS[0]?.ZIP}
                      <br />
                    </Col>
                    <Col span={12}>
                      <b>อาชีพ : </b> {loanData?.GUARANTORS[4]?.OFFIC} <br />
                      <b>หมู่บ้าน : </b>{" "}
                      {loanData?.GUARANTORS[4]?.ADDRESS[0]?.MOOBAN
                        ? loanData?.GUARANTORS[4]?.ADDRESS[0]?.MOOBAN
                        : "-"}
                      <br />
                      <b>ตำบล : </b> {loanData?.GUARANTORS[4]?.ADDRESS[0]?.TUMB}
                      <br />
                      <b>จังหวัด :</b>{" "}
                      {loanData?.GUARANTORS[4]?.ADDRESS[0]?.PROVDES}
                      <br />
                      <b>เบอร์โทร :</b>
                      {loanData?.GUARANTORS[4]?.ADDRESS[0]?.TELP}
                    </Col>
                  </Row>
                </>
              ) : null}
              {loanData?.GUARANTORS?.length > 5 ? (
                <>
                  <Divider>รายละเอียดคนค้ำที่ 6 </Divider>
                  <Row>
                    <Col span={12}>
                      <b>ชื่อ : </b> {loanData?.GUARANTORS[1]?.SNAM}
                      {loanData?.GUARANTORS[5]?.NAME1}{" "}
                      {loanData?.GUARANTORS[5]?.NAME2} <br />
                      <b>ที่อยู่ :</b>{" "}
                      {loanData?.GUARANTORS[5]?.ADDRESS[0]?.ADDR1}
                      <br />
                      <b>ซอย :</b>{" "}
                      {loanData?.GUARANTORS[5]?.ADDRESS[0]?.SOI
                        ? loanData?.GUARANTORS[5]?.ADDRESS[0]?.SOI
                        : "-"}
                      <br />
                      <b>อำเภอ :</b>{" "}
                      {loanData?.GUARANTORS[5]?.ADDRESS[0]?.AUMPDES} <br />
                      <b>รหัสไปษณีย์ :</b>{" "}
                      {loanData?.GUARANTORS[5]?.ADDRESS[0]?.ZIP}
                      <br />
                    </Col>
                    <Col span={12}>
                      <b>อาชีพ : </b> {loanData?.GUARANTORS[5]?.OFFIC} <br />
                      <b>หมู่บ้าน : </b>{" "}
                      {loanData?.GUARANTORS[5]?.ADDRESS[0]?.MOOBAN
                        ? loanData?.GUARANTORS[5]?.ADDRESS[0]?.MOOBAN
                        : "-"}
                      <br />
                      <b>ตำบล : </b> {loanData?.GUARANTORS[5]?.ADDRESS[0]?.TUMB}
                      <br />
                      <b>จังหวัด :</b>{" "}
                      {loanData?.GUARANTORS[5]?.ADDRESS[0]?.PROVDES}
                      <br />
                      <b>เบอร์โทร :</b>
                      {loanData?.GUARANTORS[5]?.ADDRESS[0]?.TELP}
                    </Col>
                  </Row>
                </>
              ) : null}
            </>
          ) : null}
        </div>
      );
    }
  };

  const sortedParcels = dataDetail?.parcel?.sort((a, b) => a.GARNO - b.GARNO);

  const formNotice = () => {
    return (
      <>
        {dataDetail?.parcel?.length > 0 ? (
          <Card>
            <Form
              labelCol={{
                span: 11,
              }}
              wrapperCol={{
                span: 13,
              }}
              form={form}
              layout="horizontal"
            >
              <Divider>รายละเอียดบอกเลิกสัญญา</Divider>
              <Form.Item label="วันที่ส่ง" name="sendDate">
                {dataDetail?.parcel[0]?.created_date
                  ? dayjs(dataDetail?.parcel[0]?.created_date).format(
                      "D MMMM YYYY"
                    )
                  : null}
              </Form.Item>
              <Form.Item label="บริษัทที่ออก" name="companySend">
                {dataDetail?.lawsuit?.COMPANY_ID === 1
                  ? "บริษัท วัน ลิสซิ่ง จำกัด"
                  : dataDetail?.lawsuit?.COMPANY_ID === 2
                  ? "บริษัท วัน มันนี่ จำกัด"
                  : "บริษัท เค.เอส.เอ็ม.บิลเลี่ยนแนร์ จำกัด"}
              </Form.Item>
              {sortedParcels?.map((parcel, index) => (
                <div key={index}>
                  <Form.Item
                    label={parcel?.GARNO === 0 ? "ผู้ทำสัญญา" : "คนค้ำ"}
                    name={`customer_${index}`}
                  >
                    {parcel
                      ? `${parcel?.SNAM}${parcel?.NAME1} ${parcel?.NAME2}`
                      : "null"}
                  </Form.Item>

                  <Form.Item label="หมายเลข EMS" name={`parcelNo_${index}`}>
                    {parcel ? parcel?.parcel_no : null}
                  </Form.Item>

                  <Form.Item label="การตอบกลับ" name={`replyType_${index}`}>
                    {parcel?.parcel_typ_id === 1
                      ? "ใบตอบกลับ"
                      : parcel?.parcel_typ_id === 2
                      ? "เว็บไปรษณีย์"
                      : "ยังไม่มีข้อมูล"}
                  </Form.Item>
                </div>
              ))}
              <Form.Item label="ลิ้งเก็บรูปภาพ" name="urlFileNotice">
                {dataDetail?.parcel[0]?.url_path ? (
                  <a
                    href={dataDetail?.parcel[0]?.url_path || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    คลิกเพื่อดูรูปภาพ
                  </a>
                ) : (
                  <span>ไม่มีลิงก์รูปภาพ</span>
                )}
              </Form.Item>
              <Form.Item label="หมายเหตุ" name="urlFileNotice">
                {dataDetail?.parcel[0]?.mark}
              </Form.Item>
            </Form>
          </Card>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </>
    );
  };

  const formLawsuit = () => {
    return (
      <>
        {dataDetail?.STATUS2 ? (
          <Form
            labelCol={{
              span: 11,
            }}
            wrapperCol={{
              span: 13,
            }}
            form={form}
            layout="horizontal"
          >
            <Divider>คำฟ้อง</Divider>
            <Form.Item label="วันที่ส่งฟ้อง" name="dateCourt">
              <p>{convertDateThai(dataDetail?.lawsuit?.date_of_plaint)}</p>
            </Form.Item>
            <Form.Item label="ศาล" name="court">
              <p>{dataDetail?.lawsuit?.provincial_court}</p>
            </Form.Item>
            <Form.Item label="ความ">
              <p>
                {dataDetail?.lawsuit?.LAW_TYPE_ID === 1
                  ? "แพ่ง"
                  : dataDetail?.lawsuit?.LAW_TYPE_ID === 2
                  ? "อาญา"
                  : "แพ่ง,อาญา"}
              </p>
            </Form.Item>
            <Form.Item label="เรื่อง" name="subject">
              <p>{dataDetail?.lawsuit?.subject}</p>
            </Form.Item>
            <Form.Item label="ค่าติดตาม" name="trackingFee">
              {" "}
              <p>
                {dataDetail?.lawsuit?.tracking_fee
                  ? currencyFormatNoPoint(dataDetail?.lawsuit?.tracking_fee)
                  : null}{" "}
                บาท
              </p>
            </Form.Item>
            <Form.Item label="เบี้ยตั้งพัก" name="suspensionAmount">
              {" "}
              <p>
                {dataDetail?.lawsuit?.suspension_amount
                  ? currencyFormatNoPoint(
                      dataDetail?.lawsuit?.suspension_amount
                    )
                  : "-"}{" "}
                บาท
              </p>
            </Form.Item>
            <Form.Item label="ผิดนัดชำระจำนวน" name="noPay">
              <p>{dataLawsuit.nopay} งวด</p>
            </Form.Item>
            <Form.Item label="ค่าขาดประโยชน์" name="lossBenefit">
              <p>
                {dataLawsuit?.lossBenefit
                  ? currencyFormatNoPoint(dataLawsuit?.lossBenefit)
                  : null}{" "}
                บาท
              </p>
            </Form.Item>
            <Form.Item label="จำนวนทุนทรัพย์" name="intigationFounds">
              <p>
                {dataDetail?.lawsuit?.litigation_funds
                  ? currencyFormatNoPoint(dataDetail?.lawsuit?.litigation_funds)
                  : null}{" "}
                บาท
              </p>
            </Form.Item>
            <Form.Item label="ค่าฤชา" name="fee">
              <p>
                {dataDetail?.lawsuit?.fee
                  ? currencyFormatPoint(dataDetail?.lawsuit?.fee)
                  : null}{" "}
                บาท
              </p>
            </Form.Item>
            <Form.Item label="หมายเหตุ" name="memo">
              {" "}
              <p>
                {dataDetail?.lawsuit?.mark ? dataDetail?.lawsuit?.mark : "-"}{" "}
              </p>
            </Form.Item>
          </Form>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </>
    );
  };

  const formJudgement = () => {
    return (
      <>
        {dataDetail?.STATUS4 ? (
          <Card>
            <Form
              labelCol={{
                span: 11,
              }}
              wrapperCol={{
                span: 13,
              }}
              form={form}
              layout="horizontal"
            >
              <Divider>คำพิพากษาจำเลยที่ 1 </Divider>
              <Form.Item label="เลขคดีแดง" name="redNumber">
                {dataDetail?.judge?.red_case_number}
              </Form.Item>
              <Form.Item label="คำพิพากษา" name="judgement1">
                {" "}
                {dataDetail?.judge?.judgement
                  ? currencyFormatNoPoint(dataDetail?.judge?.judgement)
                  : null}{" "}
                บาท
              </Form.Item>
              <Form.Item label="ค่าขาดประโยชน์" name="costUnless1">
                {dataDetail?.judge?.defendants[0]?.cost_of_uselessness
                  ? currencyFormatNoPoint(
                      dataDetail?.judge?.defendants[0]?.cost_of_uselessness
                    )
                  : null}{" "}
                บาท
              </Form.Item>
              <Form.Item label="ดอกเบี้ยคำพิพากษา" name="interestRate">
                {(dataDetail?.judge?.interest_rate * 100).toFixed(1)}%
              </Form.Item>

              <Form.Item label="ค่าขาดประโยชน์เดือนละ" name="costPermonth1">
                {dataDetail?.judge?.defendants[0]?.cost_of_useleseness_per_month
                  ? currencyFormatNoPoint(
                      dataDetail?.judge?.defendants[0]
                        ?.cost_of_useleseness_per_month
                    )
                  : null}{" "}
                บาท
              </Form.Item>
              <Form.Item label="จำนวนกี่เดือน" name="costMonth1">
                {" "}
                {
                  dataDetail?.judge?.defendants[0]?.cost_of_useleseness_month
                }{" "}
                เดือน
              </Form.Item>
              <Form.Item label="ค่าติดตาม" name="trackingFeeEnforce">
                {dataDetail?.judge?.tracking_fee
                  ? currencyFormatNoPoint(dataDetail?.judge?.tracking_fee)
                  : null}{" "}
                บาท
              </Form.Item>
              <Form.Item label="ค่าทนายความ" name="lawyerFeeEnforce">
                {dataDetail?.judge?.attorney_fees
                  ? currencyFormatNoPoint(dataDetail?.judge?.attorney_fees)
                  : null}{" "}
                บาท
              </Form.Item>
              <Form.Item label="ไฟล์คำพิพากษา" name="judgementFile">
                {dataDetail?.judge?.judgement_filepath ? (
                  <a
                    href={dataDetail?.judge?.judgement_filepath || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    คลิกเพื่อดูข้อมูล
                  </a>
                ) : (
                  <span>ไม่มีลิงก์ข้อมูล</span>
                )}
              </Form.Item>
              {judgeNumber1 ? (
                <Form.Item
                  label="จำเลยที่ร่วมคำพิพากษานี้"
                  name="governmentOfficer1"
                >
                  {judgeNumber1?.length === 1
                    ? `${judgeNumber1[0]?.SNAM}${judgeNumber1[0]?.NAME1} ${judgeNumber1[0]?.NAME2}`
                    : judgeNumber1?.length === 2
                    ? `${judgeNumber1[0]?.SNAM}${judgeNumber1[0]?.NAME1} ${judgeNumber1[0]?.NAME2}, ${judgeNumber1[1]?.SNAM}${judgeNumber1[1]?.NAME1} ${judgeNumber1[1]?.NAME2}`
                    : judgeNumber1?.length === 3
                    ? `${judgeNumber1[0]?.SNAM}${judgeNumber1[0]?.NAME1} ${judgeNumber1[0]?.NAME2}, ${judgeNumber1[1]?.SNAM}${judgeNumber1[1]?.NAME1} ${judgeNumber1[1]?.NAME2}, ${judgeNumber1[2]?.SNAM}${judgeNumber1[2]?.NAME1} ${judgeNumber1[2]?.NAME2}`
                    : null}
                </Form.Item>
              ) : null}
              {judgeNumber2 ? (
                <>
                  <Divider>คำพิพากษาจำเลยถัดไป </Divider>
                  <Form.Item label="ค่าขาดประโยชน์" name="costUnless2">
                    {" "}
                    {judgeNumber2[0]?.cost_of_uselessness
                      ? currencyFormatNoPoint(
                          judgeNumber2[0]?.cost_of_uselessness
                        )
                      : null}{" "}
                    บาท
                  </Form.Item>
                  <Form.Item label="ค่าขาดประโยชน์เดือนละ" name="costPermonth2">
                    {judgeNumber2[0]?.cost_of_useleseness_per_month
                      ? currencyFormatNoPoint(
                          judgeNumber2[0]?.cost_of_useleseness_per_month
                        )
                      : null}{" "}
                    บาท
                  </Form.Item>
                  <Form.Item label="จำนวนกี่เดือน" name="costMonth2">
                    {judgeNumber2[0]?.cost_of_useleseness_month} เดือน
                  </Form.Item>
                  <Form.Item
                    label="จำเลยที่ร่วมคำพิพากษานี้"
                    name="governmentOfficer2"
                  >
                    {judgeNumber2?.length === 1
                      ? `${judgeNumber2[0]?.SNAM}${judgeNumber2[0]?.NAME1} ${judgeNumber2[0]?.NAME2}`
                      : judgeNumber2?.length === 2
                      ? `${judgeNumber2[0]?.SNAM}${judgeNumber2[0]?.NAME1} ${judgeNumber2[0]?.NAME2}, ${judgeNumber2[1]?.SNAM}${judgeNumber2[1]?.NAME1} ${judgeNumber2[1]?.NAME2}`
                      : judgeNumber2?.length === 3
                      ? `${judgeNumber2[0]?.SNAM}${judgeNumber2[0]?.NAME1} ${judgeNumber2[0]?.NAME2}, ${judgeNumber2[1]?.SNAM}${judgeNumber2[1]?.NAME1} ${judgeNumber2[1]?.NAME2}, ${judgeNumber2[2]?.SNAM}${judgeNumber2[2]?.NAME1} ${judgeNumber2[2]?.NAME2}`
                      : judgeNumber2?.length === 4
                      ? `${judgeNumber2[0]?.SNAM}${judgeNumber2[0]?.NAME1} ${judgeNumber2[0]?.NAME2}, ${judgeNumber2[1]?.SNAM}${judgeNumber2[1]?.NAME1} ${judgeNumber2[1]?.NAME2}, ${judgeNumber2[2]?.SNAM}${judgeNumber2[2]?.NAME1} ${judgeNumber2[2]?.NAME2}, ${judgeNumber2[3]?.SNAM}${judgeNumber2[3]?.NAME1} ${judgeNumber2[3]?.NAME2}`
                      : judgeNumber2?.length === 5
                      ? `${judgeNumber2[0]?.SNAM}${judgeNumber2[0]?.NAME1} ${judgeNumber2[0]?.NAME2}, ${judgeNumber2[1]?.SNAM}${judgeNumber2[1]?.NAME1} ${judgeNumber2[1]?.NAME2}, ${judgeNumber2[2]?.SNAM}${judgeNumber2[2]?.NAME1} ${judgeNumber2[2]?.NAME2}, ${judgeNumber2[3]?.SNAM}${judgeNumber2[3]?.NAME1} ${judgeNumber2[3]?.NAME2}, ${judgeNumber2[4]?.SNAM}${judgeNumber2[4]?.NAME1} ${judgeNumber2[4]?.NAME2}`
                      : judgeNumber2?.length === 6
                      ? `${judgeNumber2[0]?.SNAM}${judgeNumber2[0]?.NAME1} ${judgeNumber2[0]?.NAME2}, ${judgeNumber2[1]?.SNAM}${judgeNumber2[1]?.NAME1} ${judgeNumber2[1]?.NAME2}, ${judgeNumber2[2]?.SNAM}${judgeNumber2[2]?.NAME1} ${judgeNumber2[2]?.NAME2}, ${judgeNumber2[3]?.SNAM}${judgeNumber2[3]?.NAME1} ${judgeNumber2[3]?.NAME2}, ${judgeNumber2[4]?.SNAM}${judgeNumber2[4]?.NAME1} ${judgeNumber2[4]?.NAME2}, ${judgeNumber2[5]?.SNAM}${judgeNumber2[5]?.NAME1} ${judgeNumber2[5]?.NAME2}`
                      : null}
                  </Form.Item>
                  <Form.Item label="หมายเหตุ" name="memo"></Form.Item>
                </>
              ) : null}
            </Form>
          </Card>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </>
    );
  };

  const formDataAssets = () => {
    return (
      <>
        {dataDetail?.investigateProperty?.length > 0 ? (
          <Form
            labelCol={{
              span: 11,
            }}
            wrapperCol={{
              span: 13,
            }}
            form={form}
            layout="horizontal"
          >
            <Divider>สืบทรัพย์หลังฟ้อง</Divider>
            <Form.Item label="วันที่สืบทรัพย์" name="investigateAssetsDate">
              {convertDateThai(dataDetail?.investigateProperty[0]?.create_date)}
            </Form.Item>

            <Form.Item label="จำเลยที่เป็นข้าราชการ" name="governmentOfficer">
              {" "}
              {dataDetail?.lawsuit?.government_officer_number} คน
            </Form.Item>

            <Form.Item label="ผลการสืบทรัพย์" name="investigateAssetsResult">
              {dataDetail?.investigateProperty[0]?.property_type_id === 1
                ? "เจอทรัพย์"
                : "ไม่เจอทรัพย์"}
            </Form.Item>

            <Form.Item label="ชื่อเจ้าของทรัพย์" name="possessorAsset">
              {dataDetail?.investigateProperty[0]?.possessor}
            </Form.Item>

            <Form.Item label="เลขโฉนด" name="deed">
              {" "}
              {dataDetail?.investigateProperty[0]?.deed_number}
            </Form.Item>
            <Form.Item label="ประเภททรัพย์" name="assetPropotyType">
              {" "}
              {dataDetail?.investigateProperty[0]
                ?.investigate_property_type_id === 1
                ? "ฉโนดที่ดิด"
                : "น.ส.3ก."}
            </Form.Item>

            <Form.Item label="ราคาประเมิน" name="estimatedPrice">
              {dataDetail?.investigateProperty[0]?.estimated_price
                ? currencyFormatNoPoint(
                    dataDetail?.investigateProperty[0]?.estimated_price
                  )
                : null}{" "}
              บาท
            </Form.Item>

            <Form.Item label="จังหวัด" name="assetProvince">
              {dataProvice ? dataProvice[0]?.provinceName : "-"}
            </Form.Item>
            <Form.Item label="อำเภอ" name="assetDistrict">
              {dataDistrict ? dataDistrict[0]?.districtName : "-"}
            </Form.Item>

            <Form.Item label="ตำบล" name="assetSubDistrict">
              {" "}
              {dataSubDistrict ? dataSubDistrict[0]?.subdistrictName : "-"}
            </Form.Item>
            <Form.Item label="รหัสไปษณีย์" name="assetZipCode">
              {dataDetail?.investigateProperty[0]?.zipcode}
            </Form.Item>
            <Form.Item label="ผู้ถือกรรมสิทธิ์" name="ownerAsset">
              {" "}
              {dataDetail?.investigateProperty[0]?.owner
                ? dataDetail?.investigateProperty[0]?.owner
                : "-"}
            </Form.Item>
            <Form.Item label="ผู้รับจำนอง/ไม่มีภาระ" name="mortgagee">
              {" "}
              {dataDetail?.investigateProperty[0]?.mortgagee
                ? dataDetail?.investigateProperty[0]?.mortgagee
                : "-"}
            </Form.Item>
            <Form.Item label="ติดอายัด" name="sequestrateStatus">
              {" "}
              {dataDetail?.investigateProperty[0]?.sequestrate_status === 1
                ? "ติดอายัด"
                : "ไม่ติดอายัด"}
            </Form.Item>
            <Form.Item label="เจ้าหนี้บุริมสิทธ์" name="preferenceCreditor">
              {dataDetail?.investigateProperty[0]?.preference_creditor
                ? dataDetail?.investigateProperty[0]?.preference_creditor
                : "-"}
            </Form.Item>
            <Form.Item label="ยอดหนี้จำนอง" name="mortgageBalance">
              {dataDetail?.investigateProperty[0]?.mortgage_balance
                ? currencyFormatNoPoint(
                    dataDetail?.investigateProperty[0]?.mortgage_balance
                  )
                : null}{" "}
              บาท
            </Form.Item>
            <Form.Item label="พอเฉลี่ยหนี้" name="averageStatus">
              {dataDetail?.investigateProperty[0]?.average_status === 1
                ? "พอเฉลี่ยทรัพย์"
                : "ไม่พอเฉลี่ยทรัพย์"}
            </Form.Item>

            <Form.Item label="เลือกผู้สืบทรัพย์" name="investigatorAsset">
              {dataDetail?.investigateProperty[0]?.investigator_user_nickname}
            </Form.Item>

            <Form.Item label="หมายเหตุ" name="memo">
              -
            </Form.Item>
          </Form>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </>
    );
  };

  const formDataPayment = () => {
    return (
      <>
        {dataDetail?.STATUS5 ? (
          <Card>
            <Form
              labelCol={{
                span: 11,
              }}
              wrapperCol={{
                span: 13,
              }}
              form={form}
              layout="horizontal"
            >
              <Divider>รายละเอียดทำยอม</Divider>
              <Form.Item label="เลขสัญญาใหม่" name="newContno">
                {dataDetail?.agreement?.NEW_CONTNO
                  ? dataDetail?.agreement?.NEW_CONTNO
                  : "ยังไม่ได้ใส่เลขสัญญาใหม่"}
              </Form.Item>
              <Form.Item label="ยินยอมชำระเงินจำนวน" name="paymentAmount">
                {dataDetail?.agreement?.total_amount
                  ? currencyFormatNoPoint(dataDetail?.agreement?.total_amount)
                  : "-"}{" "}
                บาท
              </Form.Item>
              <Form.Item label="งวดละไม่น้อยกว่า" name="paymentPerMonthAmount">
                {dataDetail?.agreement?.installment_amount
                  ? currencyFormatNoPoint(
                      dataDetail?.agreement?.installment_amount
                    )
                  : "-"}{" "}
                บาท
              </Form.Item>
              <Form.Item label="จำนวนกี่เดือน" name="costMonth3">
                {dataDetail?.agreement?.installment_count
                  ? dataDetail?.agreement?.installment_count
                  : "-"}{" "}
                เดือน
              </Form.Item>

              <Form.Item label="ไฟล์ทำยอม" name="paymentFile">
                {dataDetail?.agreement?.document_filepath
                  ? dataDetail?.agreement?.document_filepath
                  : "-"}
              </Form.Item>
              <Form.Item label="วันนัดชำระครั้งแรก" name="dateAgreement">
                {dataDetail?.agreement?.due_date
                  ? convertDateThai(dataDetail?.agreement?.due_date)
                  : "-"}{" "}
              </Form.Item>
              <Form.Item label="หมายเหตุ" name="memo">
                {dataDetail?.agreement?.mark
                  ? dataDetail?.agreement?.mark
                  : "-"}{" "}
              </Form.Item>
            </Form>
          </Card>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </>
    );
  };

  const items = [
    ...(dataDetail?.STATUS1 === "1"
      ? [{ key: "1", label: "สถานะการทำงาน", children: formStatusProgress() }]
      : []),
    ...(dataDetail?.STATUS2 === "1"
      ? [{ key: "2", label: "ข้อมูลสัญญา", children: formDetail() }]
      : []),
    ...(dataDetail?.STATUS3 === "1"
      ? [{ key: "3", label: "ข้อมูล Notice/บอกเลิก", children: formNotice() }]
      : []),
    ...(dataDetail?.STATUS4 === "1"
      ? [{ key: "4", label: "ส่วนฟ้อง", children: formLawsuit() }]
      : []),
    ...(dataDetail?.STATUS5 === "1"
      ? [{ key: "5", label: "คำพิพากษา", children: formJudgement() }]
      : []),
    ...(dataDetail?.STATUS6 === "1"
      ? [{ key: "6", label: "คดีถึงที่สุด", children: formDataAssets() }]
      : []),
    ...(dataDetail?.STATUS7 === "1"
      ? [{ key: "7", label: "สืบทรัพย์หลังฟ้อง", children: formDataPayment() }]
      : []),
    // ...(dataDetail?.STATUS3 === "1"
    //   ? [{ key: "8", label: "บังคับคดี", children: null }]
    //   : []),
    // ...(dataDetail?.STATUS4 === "1"
    //   ? [{ key: "9", label: "เจรจาทำยอม", children: null }]
    //   : []),
    // ...(dataDetail?.STATUS5 === "1"
    //   ? [{ key: "10", label: "ขายทรัพย์", children: null() }]
    //   : []),
    // ...(dataDetail?.STATUS11 === "1"
    //   ? [{ key: "11", label: "สิ้นสุด", children: null }]
    //   : []),
    // ...(dataDetail?.STATUS12 === "1"
    //   ? [{ key: "12", label: "ลูกหนี้สูญ", children: null }]
    //   : []),
  ];

  return (
    <>
      <Modal
        title="รายละเอียดข้อมูล"
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={"80%"}
        footer={[
          <Button key="cancel" onClick={handleCancel} style={{ color: "red" }}>
            ปิด
          </Button>,
        ]}
      >
        <Tabs activeKey={tabsKey} onChange={onChangeTabs}>
          {items.map((item) => (
            <Tabs.TabPane tab={item.label} key={item.key}>
              {item.children}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Modal>
    </>
  );
};
export default DetailModal;
