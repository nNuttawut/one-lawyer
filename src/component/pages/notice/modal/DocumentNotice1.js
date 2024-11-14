import React, { useEffect, useState } from "react";
import { Button, Card, Col, message, Modal, Row } from "antd";
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

const DocumentNotice1 = ({ open, close, dataDefault, funcUpdateStatus }) => {
  const [
    convertDateThai,
    convertDateThaiYear,
    convertDateThaiMonth,
    convertDateThaiDate,
  ] = DateCustom();
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

    console.log(companyValue);
    const company = options.filter((item) => companyValue === item.value);
    setCompaniesOption(company);
  };

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      await axios
        .get(baseUrl + GET_LOAN_BY_CONTNO + dataDefault.CONTNO, {
          HEADERS_EXPORT,
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
          .put(baseUrl + PUT_STATUS, data, { HEADERS_EXPORT })
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
      pdf.text(`เรื่อง   ${dataText.case}`, marginL, pdfPositionY + 10);
      pdfPositionY += 10; // เว้นบรรทัด

      pdf.setFont("THSarabunNew", "normal");
      pdf.text(
        `เรียน   ${loanData.CUSTOMER.SNAM}${loanData.CUSTOMER.NAME1}  ${loanData.CUSTOMER.NAME2}`,
        marginL,
        pdfPositionY + 15
      );
      pdf.text(`ผู้เช่าซื้อ`, marginC + 50, pdfPositionY + 15);
      pdfPositionY += 17; // เว้นบรรทัด

      if (loanData.GUARANTORS.length > 0) {
        pdf.setFont("THSarabunNew", "normal");
        pdf.text(
          `${loanData.GUARANTORS[0].SNAM}${loanData.GUARANTORS[0].NAME1}  ${loanData.GUARANTORS[0].NAME2}`,
          marginL + 24,
          pdfPositionY + 15
        );
        pdf.text(`ผู้ค้ำประกัน`, marginC + 50, pdfPositionY + 15);
        pdfPositionY += 17; // เว้นบรรทัด
      }

      if (loanData.GUARANTORS.length > 1) {
        pdf.setFont("THSarabunNew", "normal");
        pdf.text(
          `${loanData.GUARANTORS[1].SNAM}${loanData.GUARANTORS[1].NAME1}  ${loanData.GUARANTORS[1].NAME2}`,
          marginL + 24,
          pdfPositionY + 15
        );
        pdf.text(`ผู้ค้ำประกัน`, marginC + 50, pdfPositionY + 15);
        pdfPositionY += 17; // เว้นบรรทัด
      }

      if (loanData.GUARANTORS.length > 2) {
        pdf.setFont("THSarabunNew", "normal");
        pdf.text(
          `${loanData.GUARANTORS[2].SNAM}${loanData.GUARANTORS[2].NAME1}  ${loanData.GUARANTORS[2].NAME2}`,
          marginL + 24,
          pdfPositionY + 15
        );
        pdf.text(`ผู้ค้ำประกัน`, marginC + 50, pdfPositionY + 15);
        pdfPositionY += 17; // เว้นบรรทัด
      }

      if (loanData.GUARANTORS.length > 3) {
        pdf.setFont("THSarabunNew", "normal");
        pdf.text(
          `${loanData.GUARANTORS[3].SNAM}${loanData.GUARANTORS[3].NAME1}  ${loanData.GUARANTORS[3].NAME2}`,
          marginL + 24,
          pdfPositionY + 15
        );
        pdf.text(`ผู้ค้ำประกัน`, marginC + 50, pdfPositionY + 15);
        pdfPositionY += 17; // เว้นบรรทัด
      }

      if (loanData.GUARANTORS.length > 4) {
        pdf.setFont("THSarabunNew", "normal");
        pdf.text(
          `${loanData.GUARANTORS[4].SNAM}${loanData.GUARANTORS[4].NAME1}  ${loanData.GUARANTORS[4].NAME2}`,
          marginL + 24,
          pdfPositionY + 15
        );
        pdf.text(`ผู้ค้ำประกัน`, marginC + 50, pdfPositionY + 15);
        pdfPositionY += 17; // เว้นบรรทัด
      }

      if (loanData.GUARANTORS.length > 5) {
        pdf.setFont("THSarabunNew", "normal");
        pdf.text(
          `${loanData.GUARANTORS[5].SNAM}${loanData.GUARANTORS[5].NAME1}  ${loanData.GUARANTORS[5].NAME2}`,
          marginL + 24,
          pdfPositionY + 15
        );
        pdf.text(`ผู้ค้ำประกัน`, marginC + 50, pdfPositionY + 15);
        pdfPositionY += 17; // เว้นบรรทัด
      }

      if (pdf.getTextWidth(loanData?.MORTGAGE?.BAAB) > 40) {
        if (dataDefault?.COMPANY_ID === 4 || dataDefault?.COMPANY_ID === 5) {
          pdf.setFont("THSarabunNew", "normal");
          pdf.text(
            `ตามที่ท่านได้ทำสัญญาเช่าซื้อและทำสัญญาค้ำประกันการเช่าซื้อ${loanData?.MORTGAGE?.BAAB} ยี่ห้อ ${loanData?.MORTGAGE?.TYPE} คันหมาย`,
            marginL + 50,
            pdfPositionY + 30
          );

          pdfPositionY += 17; // เว้นบรรทัด

          pdf.setFont("THSarabunNew", "normal");
          pdf.text(
            `เลขเคร่ื่องยนต์ ${loanData?.MORTGAGE?.STRNO} หมายเลขทะเบียน ${loanData?.MORTGAGE?.REGNO} ${loanData?.MORTGAGE?.DORECV} ไปจาก บริษัท ซี เอ แอล 2009 จำกัด `,
            marginL,
            pdfPositionY + 30
          );

          pdfPositionY += 17; // เว้นบรรทัด

          pdf.text(
            `( ปัจจุบันเปลี่ยนเป็น ${
              companiesOption[0]?.label
            } ) ผู้ให้เช่าซื้อ เมื่อวันที่ ${convertDateThai(
              loanData?.LOAN?.SDATE
            )} ในราคาเช่าซื้อ ${currencyFormat(
              loanData?.LOAN?.NCSHPRC
            )} บาท ตกลง`,
            marginL,
            pdfPositionY + 30
          );
          pdfPositionY += 17; // เว้นบรรทัด

          pdf.text(
            `ผ่อนชำระค่างวด ๆ ละ ${currencyFormat(
              loanData?.LOAN?.SMPAY
            )} บาท ให้แล้วเสร็จภายใน ${
              loanData?.LOAN?.T_NOPAY
            } งวด เริ่มงวดแรกวันที่ ${convertDateThai(
              loanData?.LOAN?.LDATE
            )} งวดต่อไปทุกวันที่`,
            marginL,
            pdfPositionY + 30
          );
          pdfPositionY += 17; // เว้นบรรทัด

          pdf.text(
            ` 5 ของเดือนถัดไป โดยผู้ค้ำประกันยินยอมรับผิด หากผู้เช่าซื้อไม่สามารถชำระหนี้ได้ไม่ว่าด้วยเหตุใด ๆ`,
            marginL,
            pdfPositionY + 30
          );
        } else {
          pdf.setFont("THSarabunNew", "normal");
          pdf.text(
            `ตามที่ท่านได้ทำสัญญาเช่าซื้อและทำสัญญาค้ำประกันการเช่าซื้อ${loanData?.MORTGAGE?.BAAB} ยี่ห้อ ${loanData?.MORTGAGE?.TYPE} คันหมาย`,
            marginL + 50,
            pdfPositionY + 30
          );

          pdfPositionY += 17; // เว้นบรรทัด

          pdf.setFont("THSarabunNew", "normal");
          pdf.text(
            `เลขเคร่ื่องยนต์ ${loanData?.MORTGAGE?.STRNO} หมายเลขทะเบียน ${loanData?.MORTGAGE?.REGNO} ${loanData?.MORTGAGE?.DORECV} ไปจาก${companiesOption[0]?.label} ผู้ให้เช่าซื้อ `,
            marginL,
            pdfPositionY + 30
          );

          pdfPositionY += 17; // เว้นบรรทัด

          pdf.text(
            `เมื่อวันที่ ${convertDateThai(
              loanData?.LOAN?.SDATE
            )} ในราคาเช่าซื้อ ${currencyFormat(
              loanData?.LOAN?.NCSHPRC
            )} บาท ตกลงผ่อนชำระค่างวด ๆ ละ ${currencyFormat(
              loanData?.LOAN?.SMPAY
            )} บาท ให้แล้วเสร็จภายใน `,
            marginL,
            pdfPositionY + 30
          );
          pdfPositionY += 17; // เว้นบรรทัด

          pdf.text(
            `${loanData?.LOAN?.T_NOPAY} งวด เริ่มงวดแรกวันที่ ${convertDateThai(
              loanData?.LOAN?.LDATE
            )} งวดต่อไปทุกวันที่ 5 ของเดือนถัดไป โดยผู้ค้ำประกันยินยอมรับผิดหากผู้เช่าซื้อ`,
            marginL,
            pdfPositionY + 30
          );
          pdfPositionY += 17; // เว้นบรรทัด

          pdf.text(
            `ไม่สามารถชำระหนี้ได้ไม่ว่าด้วยเหตุใด ๆ`,
            marginL,
            pdfPositionY + 30
          );
        }
      } else {
        if (dataDefault?.COMPANY_ID === 4 || dataDefault?.COMPANY_ID === 5) {
          pdf.setFont("THSarabunNew", "normal");
          pdf.text(
            `ตามที่ท่านได้ทำสัญญาเช่าซื้อและทำสัญญาค้ำประกันการเช่าซื้อ ${loanData?.MORTGAGE?.BAAB} ยี่ห้อ ${loanData?.MORTGAGE?.TYPE} คันหมายเลขเครื่อง`,
            marginL + 50,
            pdfPositionY + 30
          );

          pdfPositionY += 17; // เว้นบรรทัด
          pdf.setFont("THSarabunNew", "normal");
          pdf.text(
            `ยนต์ ${loanData?.MORTGAGE?.STRNO} หมายเลขทะเบียน ${loanData?.MORTGAGE?.REGNO} ${loanData?.MORTGAGE?.DORECV} ไปจาก บริษัท ซี เอ แอล 2009 จำกัด ( ปัจจุบันเปลี่ยนเป็น`,
            marginL,
            pdfPositionY + 30
          );
          pdfPositionY += 17; // เว้นบรรทัด

          pdf.text(
            `${
              companiesOption[0]?.label
            })  ผู้ให้เช่าซื้อ เมื่อวันที่ ${convertDateThaiDate(
              loanData?.LOAN?.SDATE
            )} ${convertDateThaiMonth(
              loanData?.LOAN?.SDATE
            )} ${convertDateThaiYear(
              loanData?.LOAN?.SDATE
            )} ในราคาเช่าซื้อ ${currencyFormat(
              loanData?.LOAN?.NCSHPRC
            )} บาท ตกลงผ่อนชำระค่างวด ๆ`,
            marginL,
            pdfPositionY + 30
          );
          pdfPositionY += 17; // เว้นบรรทัด

          pdf.text(
            `ละ ${currencyFormat(
              loanData?.LOAN?.SMPAY
            )} บาท ให้แล้วเสร็จภายใน ${
              loanData?.LOAN?.T_NOPAY
            } งวด เริ่มงวดแรกวันที่ ${convertDateThai(
              loanData?.LOAN?.LDATE
            )} งวดต่อไปทุกวันที่ 5 ของเดือนถัดไป`,
            marginL,
            pdfPositionY + 30
          );

          pdfPositionY += 17; // เว้นบรรทัด

          pdf.text(
            `โดยผู้ค้ำประกันยินยอมรับผิด หากผู้เช่าซื้อไม่สามารถชำระหนี้ได้ไม่ว่าด้วยเหตุใด ๆ`,
            marginL,
            pdfPositionY + 30
          );
        } else {
          pdf.setFont("THSarabunNew", "normal");
          pdf.text(
            `ตามที่ท่านได้ทำสัญญาเช่าซื้อและทำสัญญาค้ำประกันการเช่าซื้อ ${loanData?.MORTGAGE?.BAAB} ยี่ห้อ ${loanData?.MORTGAGE?.TYPE} คันหมายเลขเครื่อง`,
            marginL + 50,
            pdfPositionY + 30
          );

          pdfPositionY += 17; // เว้นบรรทัด
          pdf.setFont("THSarabunNew", "normal");
          pdf.text(
            `ยนต์ ${loanData?.MORTGAGE?.STRNO} หมายเลขทะเบียน ${
              loanData?.MORTGAGE?.REGNO
            } ${loanData?.MORTGAGE?.DORECV} ไปจาก ${
              companiesOption[0]?.label
            } ผู้ให้เช่าซื้อ เมื่อวันที่ ${convertDateThaiDate(
              loanData?.LOAN?.SDATE
            )} ${convertDateThaiMonth(loanData?.LOAN?.SDATE)}`,
            marginL,
            pdfPositionY + 30
          );
          pdfPositionY += 17; // เว้นบรรทัด

          pdf.text(
            `${convertDateThaiYear(
              loanData?.LOAN?.SDATE
            )} ในราคาเช่าซื้อ ${currencyFormat(
              loanData?.LOAN?.NCSHPRC
            )} บาท ตกลงผ่อนชำระค่างวด ๆ ละ ${currencyFormat(
              loanData?.LOAN?.SMPAY
            )} บาท ให้แล้วเสร็จภายใน ${
              loanData?.LOAN?.T_NOPAY
            } งวด เริ่มงวดแรกวัน`,
            marginL,
            pdfPositionY + 30
          );
          pdfPositionY += 17; // เว้นบรรทัด

          pdf.text(
            `ที่ ${convertDateThai(
              loanData?.LOAN?.LDATE
            )}งวดต่อไปทุกวันที่ 5 ของเดือนถัดไป โดยผู้ค้ำประกันยินยอมรับผิด หากผู้เช่าซื้อไม่สามารถชำระหนี้ได้ไม่`,
            marginL,
            pdfPositionY + 30
          );

          pdfPositionY += 17; // เว้นบรรทัด

          pdf.text(`ว่าด้วยเหตุใด ๆ`, marginL, pdfPositionY + 30);
        }
      }

      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(
        `บัดนี้ ปรากฎว่าผู้เช่าซื้อได้ปฏิบัติผิดสัญญา โดยได้ค้างชำระค่างวดหลายงวดติดต่อกัน รวมเป็นเงินจำนวน`,
        marginL + 50,
        pdfPositionY + 30
      );

      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(
        `${currencyFormat(
          (loanData?.LOAN?.EXP_TO - loanData?.LOAN?.EXP_FRM) *
            loanData?.LOAN?.TOT_UPAY
        )} บาท`,
        marginL,
        pdfPositionY + 30
      );
      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(
        `ดังนั้น จึงขอให้ท่านผู้เช่า/ซื้อ/ผู้ค้ำประกัน ร่วมกันหรือแทนกันชำระค่างวดที่ค้าง พร้อมดอกเบี้ยปรับให้แก่`,
        marginL + 50,
        pdfPositionY + 30
      );

      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(
        `ผู้ให้เช่าซื้อ/เจ้าของ ภายใน 30 วัน นับแต่วันที่ท่านได้รับหนังสือฉบับนี้`,
        marginL,
        pdfPositionY + 30
      );

      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(
        `หากพ้นกำหนดตามหนังสือ ผู้เช่าซื้อ/ผู้ซื้อ/ผู้ค้ำประกัน ไม่ชำระหนี้ให้ถือว่าหนังสือฉบับนี้เป็นหนังสือบอก`,
        marginL + 50,
        pdfPositionY + 30
      );

      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(
        `เลิกสัญญาและเป็นหนังสือแจ้งให้ ผู้เช่าซื้อ/ผู้ซื้อ/ผู้ค้ำประกัน ส่งมอบรถคืนในสภาพเรียบร้อยใช้การได้ดี`,
        marginL,
        pdfPositionY + 30
      );

      pdfPositionY += 17; // เว้นบรรทัด
      pdf.text(
        `อนึ่ง เพื่อการตกลงกันโดยสันติวิธี ขอให้ท่านติดต่อข้าพเจ้า ฯ หรือผู้ให้เช่าซื้อโดยด่วน`,
        marginL + 50,
        pdfPositionY + 30
      );

      pdfPositionY += 35; // เว้นบรรทัด
      pdf.text(`ขอแสดงความนับถือ`, marginC + 10, pdfPositionY + 30);

      pdfPositionY += 55; // เว้นบรรทัด
      pdf.text(
        `(${dataDefault.LAWYER_FNAME}  ${dataDefault.LAWYER_LNAME})`,
        marginC,
        pdfPositionY + 30
      );

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
          width={750}
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
                <p>เรื่อง บอกเลิกสัญญาให้ชำระหนี้/บอกเลิกสัญญา</p>
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
                <p>ผู้เช่าซื้อ</p>
              </Col>
            </Row>
            {loanData?.GUARANTORS.length > 0 ? (
              <>
                <Row>
                  <Col
                    style={{
                      textAlign: "start",
                      paddingTop: "5px",
                    }}
                    offset={1}
                    span={"11"}
                  >
                    <p>
                      {loanData?.GUARANTORS[0]?.SNAM}
                      {loanData?.GUARANTORS[0]?.NAME1}{" "}
                      {loanData?.GUARANTORS[0]?.NAME2}
                    </p>
                  </Col>
                  <Col
                    style={{ textAlign: "start", paddingTop: "5px" }}
                    span={"12"}
                  >
                    <p>ผู้ค้ำประกัน</p>
                  </Col>
                </Row>
              </>
            ) : null}
            {loanData?.GUARANTORS.length > 1 ? (
              <>
                <Row>
                  <Col
                    style={{
                      textAlign: "start",
                      paddingTop: "5px",
                    }}
                    offset={1}
                    span={"11"}
                  >
                    <p>
                      {loanData?.GUARANTORS[1]?.SNAM}
                      {loanData?.GUARANTORS[1]?.NAME1}{" "}
                      {loanData?.GUARANTORS[1]?.NAME2}
                    </p>
                  </Col>
                  <Col
                    style={{ textAlign: "start", paddingTop: "5px" }}
                    span={"12"}
                  >
                    <p>ผู้ค้ำประกัน</p>
                  </Col>
                </Row>
              </>
            ) : null}
            {loanData?.GUARANTORS.length > 2 ? (
              <>
                <Row>
                  <Col
                    style={{
                      textAlign: "start",
                      paddingTop: "5px",
                    }}
                    offset={1}
                    span={"11"}
                  >
                    <p>
                      {loanData?.GUARANTORS[2]?.SNAM}
                      {loanData?.GUARANTORS[2]?.NAME1}{" "}
                      {loanData?.GUARANTORS[2]?.NAME2}
                    </p>
                  </Col>
                  <Col
                    style={{ textAlign: "start", paddingTop: "5px" }}
                    span={"12"}
                  >
                    <p>ผู้ค้ำประกัน</p>
                  </Col>
                </Row>
              </>
            ) : null}
            {loanData?.GUARANTORS.length > 3 ? (
              <>
                <Row>
                  <Col
                    style={{
                      textAlign: "start",
                      paddingTop: "5px",
                    }}
                    offset={1}
                    span={"11"}
                  >
                    <p>
                      {loanData?.GUARANTORS[3]?.SNAM}
                      {loanData?.GUARANTORS[3]?.NAME1}{" "}
                      {loanData?.GUARANTORS[3]?.NAME2}
                    </p>
                  </Col>
                  <Col
                    style={{ textAlign: "start", paddingTop: "5px" }}
                    span={"12"}
                  >
                    <p>ผู้ค้ำประกัน</p>
                  </Col>
                </Row>
              </>
            ) : null}
            {loanData?.GUARANTORS.length > 4 ? (
              <>
                <Row>
                  <Col
                    style={{
                      textAlign: "start",
                      paddingTop: "5px",
                    }}
                    offset={1}
                    span={"11"}
                  >
                    <p>
                      {loanData?.GUARANTORS[4]?.SNAM}
                      {loanData?.GUARANTORS[4]?.NAME1}{" "}
                      {loanData?.GUARANTORS[4]?.NAME2}
                    </p>
                  </Col>
                  <Col
                    style={{ textAlign: "start", paddingTop: "5px" }}
                    span={"12"}
                  >
                    <p>ผู้ค้ำประกัน</p>
                  </Col>
                </Row>
              </>
            ) : null}
            {loanData?.GUARANTORS.length > 5 ? (
              <>
                <Row>
                  <Col
                    style={{
                      textAlign: "start",
                      paddingTop: "5px",
                    }}
                    offset={1}
                    span={"11"}
                  >
                    <p>
                      {loanData?.GUARANTORS[5]?.SNAM}
                      {loanData?.GUARANTORS[5]?.NAME1}{" "}
                      {loanData?.GUARANTORS[5]?.NAME2}
                    </p>
                  </Col>
                  <Col
                    style={{ textAlign: "start", paddingTop: "5px" }}
                    span={"12"}
                  >
                    <p>ผู้ค้ำประกัน</p>
                  </Col>
                </Row>
              </>
            ) : null}
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
                    ตามที่ท่านได้ทำสัญญาเช่าซื้อและทำสัญญาค้ำประกันการเช่าซื้อ{" "}
                    {loanData?.MORTGAGE?.BAAB} ยี่ห้อ {loanData?.MORTGAGE?.TYPE}{" "}
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
                    คันหมายเลขเครื่องยนต์ {loanData?.MORTGAGE?.STRNO}{" "}
                    หมายเลขทะเบียน {loanData?.MORTGAGE?.REGNO}{" "}
                    {loanData?.MORTGAGE?.DORECV} ไปจาก{" "}
                    {dataDefault.COMPANY_ID === 4 ||
                    dataDefault.COMPANY_ID === 5
                      ? `บริษัท ซี เอ แอล 2009 จำกัด ไปจาก (ปัจจุบันเปลี่ยนเป็น ${
                          companiesOption[0]?.label
                        }) ผู้ให้เช่าซื้อ เมื่อวันที่ ${convertDateThai(
                          loanData?.LOAN?.SDATE
                        )} ในราคาเช่าซื้อ ${currencyFormat(
                          loanData?.LOAN?.NCSHPRC
                        )} บาท ตกลงผ่อนชำระค่างวด ๆ ละ ${currencyFormat(
                          loanData?.LOAN?.TOT_UPAY
                        )} บาท ให้แล้วเสร็จภายใน ${
                          loanData?.LOAN?.T_NOPAY
                        } งวด เริ่มงวดแรกวันที่ ${convertDateThai(
                          loanData?.LOAN?.SDATE
                        )}งวดต่อไปทุกวันที่ 5 ของเดือนถัดไป โดยผู้ค้ำประกันยินยอมรับผิด หากผู้เช่าซื้อไม่สามารถชำระหนี้ได้ไม่ว่าด้วยเหตุใดๆ`
                      : `${
                          companiesOption[0].label
                        } ผู้ให้เช่าซื้อ เมื่อวันที่ ${convertDateThai(
                          loanData?.LOAN?.SDATE
                        )} ในราคาเช่าซื้อ ${currencyFormat(
                          loanData?.LOAN?.NCSHPRC
                        )} บาท ตกลงผ่อนชำระค่างวด ๆ ละ ${currencyFormat(
                          loanData?.LOAN?.TOT_UPAY
                        )} บาท ให้แล้วเสร็จภายใน ${
                          loanData?.LOAN?.T_NOPAY
                        } งวด เริ่มงวดแรกวันที่ ${convertDateThai(
                          loanData?.LOAN?.SDATE
                        )}งวดต่อไปทุกวันที่ 5 ของเดือนถัดไป โดยผู้ค้ำประกันยินยอมรับผิด หากผู้เช่าซื้อไม่สามารถชำระหนี้ได้ไม่ว่าด้วยเหตุใดๆ`}
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
                    บัดนี้ ปรากฎว่าผู้เช่าซื้อได้ปฏิบัติผิดสัญญา
                    โดยได้ค้างชำระค่างวดหลายงวดติดต่อกัน รวมเป็นเงินจำนวน
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
                    {currencyFormat(
                      (loanData?.LOAN?.EXP_TO - loanData?.LOAN?.EXP_FRM) *
                        loanData?.LOAN?.TOT_UPAY
                    )}{" "}
                    บาท
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
                    ดังนั้น จึงขอให้ท่านผู้เช่าซื้อ/ผู้ซื้อ/ผู้ค้ำประกัน
                    ร่วมกันหรือแทนกันชำระค่างวดที่ค้าง พร้อมดอกเบี้ยปรับให้
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
                    แก่ผู้ให้เช่าซื้อ/เจ้าของ ภายใน 30 วัน
                    นับแต่วันที่ท่านได้รับหนังสือฉบับนี้
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
                    หากพ้นกำหนดตามหนังสือ ผู้เช่าซื้อ/ผู้ซื้อ/ผู้ค้ำประกัน
                    ไม่ชำระหนี้ให้ถือว่าหนังสือฉบับนี้เป็นหนังสือบอกเลิก
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
                    สัญญาและเป็นหนังสือแจ้งให้ ผู้เช่าซื้อ/ผู้ซื้อ/ผู้ค้ำประกัน
                    ส่งมอบรถคืนในสภาพเรียบร้อยใช้การได้ดี
                  </p>
                </Col>
              </Row>
              <Row>
                <Col
                  style={{
                    textAlign: "start",
                    paddingTop: "10px",
                    wordWrap: "break-word",
                  }}
                  offset={3}
                  span={"24"}
                >
                  <p>
                    หากท่านเพิกเฉย ข้าพเจ้า ฯ ในฐานะทนายความผุ้รับผมอบอำนาจ
                    มีความจำเป็นต้องดำเนินคดีตามกฎหมาย
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
                  <p>ต่อไป</p>
                </Col>
              </Row>
              <Row>
                <Col
                  style={{
                    textAlign: "start",
                    paddingTop: "10px",
                    wordWrap: "break-word",
                  }}
                  offset={3}
                  span={"24"}
                >
                  <p>
                    อนึ่ง เพื่อการตกลงกันโดยสันติวิธี ขอให้ท่านติดต่อข้าพเจ้า ฯ
                    หรือผู้ให้เช่าซื้อโดยด่วน
                  </p>
                </Col>
              </Row>
              <Row>
                <Col
                  style={{ textAlign: "center", paddingTop: "20px" }}
                  span={"24"}
                >
                  <p>ขอแสดงความนับถือ</p>
                  <p style={{ textAlign: "center", paddingTop: "70px" }}>
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
export default DocumentNotice1;
