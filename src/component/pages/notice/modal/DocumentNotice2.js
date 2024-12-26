import React, { useEffect, useState } from "react";
import { Button, Card, Col, Image, message, Modal, Row } from "antd";
import jsPDF from "jspdf";
import "../../../../assets/font/THSarabunNew-normal";
import "../../../../assets/font/THSarabunNew-bold";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import { PrinterOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  baseUrl,
  PUT_STATUS,
  HEADERS_EXPORT,
  GET_LOAN_BY_CONTNO,
} from "../../../API/apiUrls";
import { STATUS_PROCESS_PROCESS } from "../../../../utils/constant/StatusConstant";
import LoadCompanies from "../../../../hook/LoadCompanies";
import lawyerJumbo from "../../../../assets/images/license/lawyerJumbo.png";
import lawyerYut from "../../../../assets/images/license/lawyerYut.png";
import lawyerTon from "../../../../assets/images/license/lawyerTon.png";
import TokenCheck from "../../../../hook/TokenCheck";

const DocumentNotice2 = ({ open, close, dataDefault, funcUpdateStatus }) => {
  const [convertDateThai] = DateCustom();
  const [loading, setLoading] = useState(false);
  const [currencyFormat] = CurrencyFormat();
  const [dataText, setDataText] = useState({
    company: "ฝ่ายกฎหมาย บริษัท วัน มันนี่ จำกัด",
    address:
      "1/24 ถนน มิตรภาพ ตำบล ในเมือง อำเภอ เมืองขอนแก่น จังหวัดขอนแก่น 40000 โทร ",
    telephon: "097-0933735",
    dateCreate: dataDefault.DATE,
    case: "บอกเลิกสัญญาให้ชำระหนี้/บอกเลิกสัญญา",
    toCustomer: null,
    toGuarantor: [],
    type: null,
    brand: null,
    engineNumber: null,
    licensePlate: null,
    provicePlate: null,
    companyByOld: null,
    companyByNew: null,
    sDate: null,
    buyPrice: null,
    uPay: null,
    tNoPay: null,
    LPAYDDate: null,
    NCSHPRC: null,
  });
  const [loanData, setLoanData] = useState(null);
  const [companiesList, setLoadingData] = LoadCompanies();
  const [companiesOption, setCompaniesOption] = useState();
  useEffect(() => {
    loadData();
    setLoadingData(true);
    console.log("dataDefault", dataDefault);
  }, [setLoadingData]);

  useEffect(() => {
    setOption();
  }, [companiesList]);

  const setOption = () => {
    const options = companiesList.map((item) => ({
      value: item.id,
      label: item.company_name,
      address: item.address,
      phone: item.phone,
    }));

    let companyValue;
    if (dataDefault.COMPANY_ID === 4) {
      companyValue = 2;
    } else if (dataDefault.COMPANY_ID === 5) {
      companyValue = 1;
    } else {
      companyValue = dataDefault.COMPANY_ID;
    }

    const company = options.filter((item) => companyValue === item.value);
    setCompaniesOption(company);
  };

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      await axios
        .get(baseUrl + GET_LOAN_BY_CONTNO + dataDefault.CONTNO, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            setLoanData(res.data);
            console.log("setLoanData", res.data);
            setLoading(false);
          } else {
            message.error("ไม่สามารถดึงข้อมูลได้");
            console.log("ไม่สามารถดึงข้อมูลได้", res.status);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status >= 300) {
            message.error("ไม่สามารถดึงข้อมูลได้", err.status);
          }
        });
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    }
  };

  const sendStatus = async (data) => {
    console.log("data-->", data);
    if (data) {
      setLoading(true);
      try {
        await axios
          .put(baseUrl + PUT_STATUS, data, { headers: HEADERS_EXPORT })
          .then(async (res) => {
            if (res.status === 200) {
              message.success("อัพเดทข้อมูลสำเร็จ");
              funcUpdateStatus({
                ...dataDefault,
                DATE: data.DATE,
                PROCESS_ID: data.PROCESS_ID,
              });
              console.log("resQuery", res.data);
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.status === 404) {
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
    } else {
      message.error("โปรดตรวจสอบข้อมูลและกดบันทึกอีกครั้ง");
    }
  };

  const handleOk = () => {
    const putStatus = {
      WORK_LOG_ID: dataDefault.WORK_LOG_ID,
      USER_ID: dataDefault.LAWYER_ID,
      LOAN_ID: dataDefault.id,
      MEMO: dataDefault.memo,
      DATE: dataDefault.DATE,
      PROCESS_ID: STATUS_PROCESS_PROCESS,
    };
    sendStatus(putStatus);
  };

  const createPdf = () => {
    try {
      // PDF options
      const pdfOption = {
        orientation: "p",
        format: "a4",
        unit: "px",
        lineHeight: 2,
        putOnlyUsedFonts: true,
      };

      const pdf = new jsPDF(pdfOption);

      const pdfWidth = pdf.internal.pageSize.width;
      const pdfHeight = pdf.internal.pageSize.height;

      // PDF configuration
      const pdfConfig = {
        typo: {
          header: 25,
          large: 20,
          normal: 18,
          small: 16,
        },
        margin: {
          t: 20,
          b: 20,
          l: 21,
          r: 20,
          c: 180,
        },
      };

      let pdfPositionY = 0;
      let pdfPositionYCenter = 0;
      const marginL = pdfConfig.margin.l;
      const marginC = pdfConfig.margin.c;
      const imageWidth = 75; // Adjust width to fit your needs
      const imageHeight = 94; // Adjust height to fit your needs
      const textX = marginL;
      const textY = pdfPositionY;
      const underlineY = textY + 5; // Position for the underline
      pdf.setLineWidth(0.3);

      //กรอบหน้า เส้นแนวนอนบน
      pdf.line(10, 10, 10 + 416, 10);
      //กรอบหน้า เส้นแนวนอนกลาง
      pdf.line(10, 55, 10 + 416, 55);
      //กรอบหน้า เส้นแนวล่าง
      pdf.line(10, 610, 10 + 416, 610);

      //กรอบหน้า เส้นแนวตั้งซ้าย
      const x1 = 10;
      const y1 = 10;
      const l1 = 10 + 600; // Length of the line
      pdf.line(x1, y1, x1, l1);
      //กรอบหน้า เส้นแนวตั้งขวา
      const x2 = 426;
      const y2 = 10;
      const l2 = 10 + 600; // Length of the line
      pdf.line(x2, y2, x2, l2);

      pdf.setFont("THSarabunNew", "bold"); // Set font family
      pdf.setFontSize(pdfConfig.typo.small); // Set font size
      pdf.setTextColor("black"); // Set font color with hex color code
      pdfPositionY += pdfConfig.typo.small;
      pdf.text(
        `ฝ่ายกฎหมาย ${companiesOption[0]?.label} `,
        marginC,
        pdfPositionY + 10
      );
      pdfPositionY += 17; // เว้นบรรทัด

      pdf.setFont("THSarabunNew", "normal");
      pdf.text(
        ` ${companiesOption[0]?.address}   ${companiesOption[0]?.phone}`,
        marginL + 50,
        pdfPositionY + 10
      );
      pdfPositionY += 25; // เว้นบรรทัด

      pdf.setFont("THSarabunNew", "normal");
      pdf.text(
        `วันที่ ${convertDateThai(dataDefault.DATE)}`,
        marginC + 50,
        pdfPositionY + 10
      );
      pdfPositionY += 17; // เว้นบรรทัด

      pdf.setFont("THSarabunNew", "normal");
      pdf.text(
        `เรื่อง   บอกกล่าวทวงถามบังคับจำนอง`,
        marginL,
        pdfPositionY + 10
      );
      pdfPositionY += 10; // เว้นบรรทัด

      pdf.setFont("THSarabunNew", "normal");
      pdf.text(
        `เรียน   ${loanData.CUSTOMER.SNAM}${loanData.CUSTOMER.NAME1}  ${loanData.CUSTOMER.NAME2}`,
        marginL,
        pdfPositionY + 15
      );
      pdf.text(`ผู้กู้ยืม/จำนอง`, marginC + 50, pdfPositionY + 15);
      pdfPositionY += 17; // เว้นบรรทัด

      pdf.setFont("THSarabunNew", "normal");
      pdf.text(
        `เมื่อวันที่ ${convertDateThai(
          loanData?.LOAN?.SDATE
        )} ท่านได้กู้ยืมเงินและทำสัญญาจำนองที่ดินโฉนดที่ดินเลขที่ ${loanData?.MORTGAGE?.STRNO.replace(
          /\D/g,
          ""
        )} เลขที่ดิน `,
        marginL + 50,
        pdfPositionY + 30
      );

      pdfPositionY += 17; // เว้นบรรทัด

      pdf.setFont("THSarabunNew", "normal");
      pdf.text(
        `${loanData?.MORTGAGE?.ENGNO} ตำบล ${loanData?.MORTGAGE?.BAAB} อำเภอ ${loanData?.MORTGAGE?.MODEL} จังหวัด ${loanData?.MORTGAGE?.TYPE} ไว้กับบริษัท ${companiesOption[0]?.label} ผู้รับจำนอง`,
        marginL,
        pdfPositionY + 30
      );

      pdfPositionY += 17; // เว้นบรรทัด

      pdf.text(
        `เพื่อเป็นการประกันการกู้ยืมเงินจำนวน ${currencyFormat(
          loanData?.LOAN?.NCSHPRC
        )} บาท โดยท่านสัญญาจะชำระดอกเบี้ยในอัตราร้อยละ 15 บาทต่อ ปี ของต้นเงิน`,
        marginL,
        pdfPositionY + 30
      );
      pdfPositionY += 17; // เว้นบรรทัด

      pdf.text(
        `จำนองจำนวนดังกล่าว นับแต่วันจำนองรายละเอียดตามสัญญาจำนองที่ได้อ้างถึงแล้วนั้น`,
        marginL,
        pdfPositionY + 30
      );
      pdfPositionY += 17; // เว้นบรรทัด

      pdf.text(
        `บัดนี้ท่านผิดนัดชำระหนี้หลายงวดติดต่อกัน มีหนี้ค้างชำระเป็นเงินต้นจำนวน ${currencyFormat(
          loanData?.LOAN?.NCSHPRC - loanData?.LOAN?.SMPAY
        )} บาท โดยท่านไม่ได้ดำเนิน`,
        marginL + 50,
        pdfPositionY + 30
      );

      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(
        `การชำระหนี้ตามสัญญาทั้งเงินต้นและดอกเบี้ยและมิได้ไถ่ถอนจำนองตามสัญญาด้วย ซึ่งการที่ท่านผิดนัดผิดสัญญานั้นทำให้ผู้รับจำ`,
        marginL,
        pdfPositionY + 30
      );
      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(
        `นองเสียหาย ผู้รับจำนองประสงค์จะทำการบังคับจำนองหนี้รายนี้ จึงได้มอบให้ข้าพเจ้าดดำเนินการบอกกล่าวบังคับจำนองกับท่าน`,
        marginL,
        pdfPositionY + 30
      );

      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(
        `โดยถือเอาหนังสือฉบับนี้เป็นหนังสือบอกกล่าวบังคับจำนอง`,
        marginL,
        pdfPositionY + 30
      );

      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(
        ` ข้าพเจ้าจึงเรียนมาเพื่อขอให้ท่านนำเงินต้น ดอกเบี้ยที่ค้างชำระ ค่าธรรมเนียมและค่าติดตามทวงถาม ไปชำระ ณ`,
        marginL + 50,
        pdfPositionY + 30
      );

      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(
        `ที่ทำการสำนักงาน${companiesOption[0]?.label} ทั้งนี้ถายในกำหนด 60 วัน นับแต่วันที่ท่านได้รับหนังสือฉบับนี้มิฉะนั้นข้าพเจ้าจำเป็นจะ`,
        marginL,
        pdfPositionY + 30
      );

      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(
        `ต้องดำเนินคดี เพื่อบังคับจำนองที่ดินรายนี้ต่อไป`,
        marginL,
        pdfPositionY + 30
      );

      pdfPositionY += 35; // เว้นบรรทัด
      pdf.text(`ขอแสดงความนับถือ`, marginC + 10, pdfPositionY + 30);

      if (dataDefault.LAWYER_ID === 2) {
        //ลายเซ็นต์ ทนาย
        const imageUrl = lawyerYut; // Replace with your image URL or base64
        pdfPositionY += 30;
        pdf.addImage(
          imageUrl,
          "PNG",
          marginC,
          pdfPositionY,
          imageWidth,
          imageHeight
        );

        pdfPositionY += 50; // เว้นบรรทัด
        pdf.text(
          `(${dataDefault.LAWYER_FNAME}  ${dataDefault.LAWYER_LNAME})`,
          marginC,
          pdfPositionY + 30
        );
      } else if (dataDefault.LAWYER_ID === 3) {
        //ลายเซ็นต์ ทนาย
        const imageUrl = lawyerJumbo; // Replace with your image URL or base64
        pdfPositionY += 40;
        pdf.addImage(
          imageUrl,
          "PNG",
          marginC + 10,
          pdfPositionY,
          imageWidth,
          imageHeight
        );

        pdfPositionY += 80; // เว้นบรรทัด
        pdf.text(
          `(${dataDefault.LAWYER_FNAME}  ${dataDefault.LAWYER_LNAME})`,
          marginC - 15,
          pdfPositionY + 30
        );
      } else if (dataDefault.LAWYER_ID === 11) {
        //ลายเซ็นต์ ทนาย
        const imageUrl = lawyerTon; // Replace with your image URL or base64
        pdfPositionY += 40;
        pdf.addImage(
          imageUrl,
          "PNG",
          marginC,
          pdfPositionY,
          imageWidth,
          imageHeight
        );
        pdfPositionY += 50; // เว้นบรรทัด
        pdf.text(
          `(${dataDefault.LAWYER_FNAME}  ${dataDefault.LAWYER_LNAME})`,
          marginC,
          pdfPositionY + 30
        );
      }

      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(`ทนายความผู้รับมอบอำนาจ`, marginC, pdfPositionY + 30);

      pdfPositionY += 25; // เว้นบรรทัด
      pdf.text(`${companiesOption[0]?.phone}`, marginC, pdfPositionY + 30);
      pdfPositionY += 17; // เว้นบรรทัด
      pdf.setFont("THSarabunNew", "bold");
      pdf.text(`หมายเหตุ`, marginL, pdfPositionY + 30);
      pdf.setFont("THSarabunNew", "normal");
      pdf.text(
        `หากท่านได้คืนรถหรือชำระหนี้ก่อนที่ท่านจะได้รับหนังสือฉบับนี้ บริษัท ฯ ขออภัยมา ณ โอกาสนี้ด้วย`,
        marginL + 50,
        pdfPositionY + 30
      );

      // Add footer with date and page number
      setTimeout(() => {
        pdf.setFont("THSarabunNew", "normal");
        pdf.setFontSize(pdfConfig.typo.small);
        pdf.setTextColor("#000");
        // const textDate = new Date().toString();

        const pages = pdf.internal.getNumberOfPages();

        for (let j = 1; j < pages + 1; j++) {
          pdf.setPage(j);
          // pdf.text(
          //   `วันเวลา : ${textDate}`,
          //   marginL,
          //   pdfHeight - 15,
          //   null,
          //   null,
          //   "left"
          // );
          // pdf.text(
          //   `หน้า ${j} จาก ${pages}`,
          //   pdfWidth - marginL,
          //   pdfHeight - 15,
          //   null,
          //   null,
          //   "right"
          // );
        }

        // Download PDF file
      }, 0);

      pdf.save(`notice ${dataDefault.CONTNO}.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  if (companiesOption && loanData) {
    return (
      <>
        <Modal
          title="notice"
          open={open}
          onOk={""}
          onCancel={handleCancel}
          width={760}
          footer={[
            <Button
              key="cancle"
              style={{ color: "red" }}
              onClick={handleCancel}
            >
              ปิด
            </Button>,
            <Button
              key="ok"
              onClick={handleOk}
              style={{ color: "green", textAlign: "center" }}
            >
              ออกโนติส
            </Button>,
          ]}
        >
          <PrinterOutlined
            key="print"
            onClick={createPdf}
            style={{
              color: "green", // สีที่ต้องการ
              textAlign: "right", // ทำให้ข้อความ align ไปทางขวา
              position: "absolute", // ใช้ position absolute เพื่อควบคุมตำแหน่ง
              right: "40px", // ระยะห่างจากขอบขวา
              top: "34px", // ระยะห่างจากขอบบน (สามารถปรับได้)
              fontSize: "20px", // ขนาดไอคอน
            }}
          />

          <Card
            style={{
              marginTop: "15px",
            }}
          >
            <Row>
              <Col
                style={{ textAlign: "center", paddingTop: "5px" }}
                span={"24"}
              >
                <b>{companiesOption[0]?.label}</b>
                <p>
                  {companiesOption[0]?.address} โทร {companiesOption[0]?.phone}
                </p>
              </Col>
              <Col span={"18"} style={{ textAlign: "end", paddingTop: "5px" }}>
                {" "}
                <p>วันที่ {convertDateThai(dataDefault.DATE)}</p>
              </Col>
            </Row>

            <Row>
              <Col
                style={{ textAlign: "start", paddingTop: "5px" }}
                span={"12"}
              >
                <p>เรื่อง บอกกล่าวทวงถามบังคับจำนอง</p>
                <p>
                  เรียน {loanData.CUSTOMER.SNAM}
                  {loanData.CUSTOMER.NAME1} {loanData.CUSTOMER.NAME2}
                </p>
              </Col>
              <Col
                style={{ textAlign: "start", paddingTop: "5px" }}
                span={"12"}
              >
                <br />
                <p>ผู้กู้ยืม/จำนอง</p>
              </Col>
            </Row>
            <>
              <Row>
                <Col
                  style={{
                    textAlign: "start",
                    paddingTop: "20px",
                  }}
                  offset={3}
                  span={"24"}
                >
                  <p>
                    เมื่อวันที่ {convertDateThai(loanData?.LOAN?.SDATE)}{" "}
                    ท่านได้กู้ยืมเงินและทำสัญญาจำนองที่ดินโฉนดที่ดินเลขที่{" "}
                    {loanData?.MORTGAGE?.STRNO.replace(/\D/g, "")} เลขที่ดิน
                  </p>
                </Col>

                <Col
                  style={{
                    textAlign: "start",
                  }}
                  offset={1}
                  span={"24"}
                >
                  <p>
                    {loanData?.MORTGAGE?.ENGNO} ตำบล {loanData?.MORTGAGE?.BAAB}{" "}
                    อำเภอ {loanData?.MORTGAGE?.MODEL} จังหวัด{" "}
                    {loanData?.MORTGAGE?.TYPE} ไว้กับบริษัท{" "}
                    {companiesOption[0]?.label} ผู้รับจำนอง
                    เพื่อเป็นการประกันการกู้ยืมเงินจำนวน{" "}
                    {currencyFormat(loanData?.LOAN?.NCSHPRC)} บาท
                    โดยท่านสัญญาจะชำระดอกเบี้ยในอัตราร้อยละ 15 บาทต่อปี
                    ของต้นเงินจำนองจำนวนดังกล่าว นับแต่วันจำนอง
                    รายละเอียดตามสัญญาจำนองที่ได้อ้างถึงแล้วนั้น
                  </p>
                </Col>
              </Row>
              <Row>
                <Col
                  style={{
                    textAlign: "start",
                    paddingTop: "10px",
                  }}
                  offset={3}
                  span={"24"}
                >
                  <p>
                    บัดนี้ท่านผิดนัดชำระหนี้หลายงวดติดต่อกัน
                    มีหนี้ค้างชำระเป็นเงินต้นจำนวน{" "}
                    {currencyFormat(
                      loanData?.LOAN?.NCSHPRC - loanData?.LOAN?.SMPAY
                    )}{" "}
                    บาท โดยท่านไม่ได้ดำเนิน
                  </p>
                </Col>
                <Col
                  style={{
                    textAlign: "start",
                    paddingTop: "5px",
                  }}
                  offset={1}
                  span={"24"}
                >
                  <p>
                    การชำระหนี้ตามสัญญาทั้งเงินต้นและดอกเบี้ยและมิได้ไถ่ถอนจำนองตามสัญญาด้วย
                    ซึ่งการที่ท่านผิดนัดผิดสัญญานั้นทำให้ผู้รับจำนองเสียหาย
                    ผู้รับจำนองประสงค์จะทำการบังคับจำนองหนี้รายนี้
                    จึงได้มอบให้ข้าพเจ้าดดำเนินการบอกกล่าวบังคับจำนองกับท่าน
                    โดยถือเอาหนังสือฉบับนี้เป็นหนังสือบอกกล่าวบังคับจำนอง
                  </p>
                </Col>
              </Row>
              <Row>
                <Col
                  style={{
                    textAlign: "start",
                    paddingTop: "10px",
                  }}
                  offset={3}
                  span={"24"}
                >
                  <p>
                    ข้าพเจ้าจึงเรียนมาเพื่อขอให้ท่านนำเงินต้น
                    ดอกเบี้ยที่ค้างชำระ ค่าธรรมเนียมและค่าติดตามทวงถาม ไปชำระ ณ
                  </p>
                </Col>
                <Col
                  style={{
                    textAlign: "start",
                    paddingTop: "5px",
                  }}
                  offset={1}
                  span={"24"}
                >
                  <p>
                    ที่ทำการสำนักงาน{companiesOption[0]?.label}{" "}
                    ทั้งนี้ถายในกำหนด 60 วัน
                    นับแต่วันที่ท่านได้รับหนังสือฉบับนี้มิฉะนั้นข้าพเจ้าจำ
                    เป็นจะต้องดำเนินคดี เพื่อบังคับจำนองที่ดินรายนี้ต่อไป
                  </p>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{ textAlign: "center", paddingTop: "20px" }}
                  span={"24"}
                >
                  <p>ขอแสดงความนับถือ</p>
                  <Image
                    src={
                      dataDefault.LAWYER_ID === 2
                        ? lawyerYut
                        : dataDefault.LAWYER_ID === 3
                        ? lawyerJumbo
                        : dataDefault.LAWYER_ID === 11
                        ? lawyerTon
                        : null
                    }
                    width={200} // กำหนดความกว้างของรูป
                    height={150} // กำหนดความสูงของรูป
                    preview={false} // ถ้าไม่ต้องการให้เปิด preview เมื่อคลิกที่ภาพ
                  />
                  <p style={{ textAlign: "center", paddingTop: "20px" }}>
                    ({dataDefault.LAWYER_FNAME} {dataDefault.LAWYER_LNAME})
                  </p>
                  <p>ทนายความผู้รับมอบอำนาจ</p>
                  <p style={{ textAlign: "center", paddingTop: "10px" }}>
                    {companiesOption[0]?.phone}
                  </p>
                  <p style={{ textAlign: "center", paddingTop: "10px" }}>
                    หมายเหตุ {"    "}
                    หากท่านได้คืนรถหรือชำระหนี้ก่อนที่ท่านจะได้รับหนังสือฉบับนี้
                    บริษัท ฯ ขออภัยมา ณ โอกาสนี้ด้วย
                  </p>
                </Col>
              </Row>
            </>
          </Card>
        </Modal>
      </>
    );
  }
};
export default DocumentNotice2;
