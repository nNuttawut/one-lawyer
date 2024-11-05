import React, { useEffect, useState } from "react";
import { Button, Modal, Card } from "antd";
import jsPDF from "jspdf";
import "../../../../assets/font/THSarabunNew-normal";
import "../../../../assets/font/THSarabunNew-bold";
import CreateDocument from "./CreateNotice";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import { Input } from "antd";
import dayjs from "dayjs";

const DocumentNotice = ({ open, close, contno }) => {
  const [
    convertDateThai,
    convertDateThaiYear,
    convertDateThaiMonth,
    convertDateThaiDate,
  ] = DateCustom();
  const [currencyFormat] = CurrencyFormat();

  const [isModalCreate, setIsModalCreate] = useState(false);
  const [textData, setTaxtData] = useState({
    numberBlack: "ผบE๓๗๐๖ /๒๕๖๗",
    numberRed: "xxxxx /๒๕๖๗",
    place: "จังหวัดกาญจนบุรี",
    date: "2024-05-29",
    type: "แพ่ง",
    lawyerBy: "นายยุทธศาลตร์ พิพิลา",
    licenseCode: "๒๗๗๐/๒๕๔๓",
    lawyerPhon: "๐๘๐ - ๔๗๗๖๓๔๖",
    gua: [
      "นางสาวกมลทิพย์  ดอนเจดีย์",
      "นางสาวกมลทิพย์  ดอนเจดีย์",
      "นางสาวกมลทิพย์  ดอนเจดีย์",
    ],
    subject: "ผิดสัญญาเช่าซื้อ, สัญญาค้ำประกัน, เรียกค่าเสียหาย",
    regionOne: "-",
    nationalityOne: "ไทย",
    careerOne: "ค้าขาย",
    ageOne: "-",
    cardIdOne: "-",
    addressOne: [
      "1/24",
      "-",
      "มิตรภาพ",
      "-",
      "-",
      "ในเมือง",
      "เมืองขอนแก่น",
      "ขอนแก่น",
    ],
    phoneOne: "062-328675",
    contactOne: "1/24 ถนนมิตรภาพ ตำยบในเมือง อำเภอเมืองขอนแก่น จังหวัดขอนแก่น ",
    faxOne: "-",
    emailOne: "-",
    regionGua: "-",
    nationalityGua: "ไทย",
    careerGua: ["ค้าขาย"],
    ageGua: ["45", "43", "46"],
    cardIdGua: "-",
    addressGua: [
      "1/24",
      "-",
      "มิตรภาพ",
      "-",
      "-",
      "ในเมือง",
      "เมืองขอนแก่น",
      "ขอนแก่น",
    ],
    phoneGua: "062-328675",
    contactGua: "1/24 ถนนมิตรภาพ ตำยบในเมือง อำเภอเมืองขอนแก่น จังหวัดขอนแก่น ",
    fax: "-",
    email: "-",
    dateApproved: "",
    carNumber: "3ZZ-4966358",
    carBrand: "toyota",
    carLive: "กาจนบุรี",
    plateLicense: "กจ-8497",
    amountTotal: 26584,
    amountSub: 25,
    amountBuy: 177024,
    paymentTotal: 24322,
    paymentDAMT: 3688,
    paymentTerm: 48,
    followPay: 5000,
    lostBenefits: 3000,
    lostBenefitsTotal: 0,
    lostBenefitsMonth: 0,
    nopay: 5,
    sDate: "2024-04-13",
    lostPayDate: "2023-11-5",
    principl: 226584,
    lostNoPay: 47,
    enforceDate: "2024-5-29",
    dueDate: "2022-05-05",
  });
  const { TextArea } = Input;

  const [dataText, setDataText] = useState({
    company: "ฝ่ายกฎหมาย บริษัท วัน มันนี่ จำกัด",
    address:
      "1/24 ถนน มิตรภาพ ตำบล ในเมือง อำเภอ เมืองขอนแก่น จังหวัดขอนแก่น 41250 โทร ",
    telephon: "097-0933735",
    dateCreate: "6/5/2567",
    case: "บอกเลิกสัญญาให้ชำระหนี้/บอกเลิกสัญญา",
    toCustomer: "นางพัชราพร มณีเลิส",
    toGuarantor: ["นายจิราธิวัฒน์}] ใจตรง"],
    type: "รถไถ",
    brand: "ฟอร์ด",
    engineNumber: "SE917217",
    licensePlate: "ตค 4406",
    provicePlate: "อำนาจเจริญ",
    companyByOld: "",
    companyByNew: "",
    sDate: "25/3/2564",
    buyPrice: 205800,
    uPay: 3430,
    tNoPay: 60,
    LPAYDDate: "5/5/2564",
    NCSHPRC: 38612,
  });

  useEffect(() => {
    calLostBenefits();
    console.log(calLostBenefits());
  }, []);

  const calLostBenefits = () => {
    console.log(textData.enforceDate);
    console.log(textData.dueDate);
    let date1 = dayjs(textData.enforceDate);
    let date2 = dayjs(textData.dueDate);
    const differenceDays = date1.diff(date2, "month");
    console.log(differenceDays);
    setTaxtData({
      ...textData,
      lostBenefitsMonth: differenceDays,
      lostBenefitsTotal: differenceDays * textData.lostBenefits,
    });
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
      pdf.text(` ${dataText.company}`, marginC, pdfPositionY + 10);
      pdfPositionY += 20; // เว้นบรรทัด

      pdf.setFont("THSarabunNew", "normal");
      pdf.text(
        ` ${dataText.address}   ${dataText.telephon}`,
        marginL + 50,
        pdfPositionY + 10
      );
      pdfPositionY += 20; // เว้นบรรทัด

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

      pdf.save(`notice ${contno}.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  return (
    <>
      <Modal
        title="notice"
        open={open}
        onOk={""}
        onCancel={handleCancel}
        width={719}
        footer={[
          <Button
            key="cancel"
            style={{ color: "yellow" }}
            onClick={() => {
              setIsModalCreate(true);
            }}
          >
            แก้ไข
          </Button>,
          <Button key="ok" onClick={createPdf} style={{ color: "green" }}>
            พิมพ์
          </Button>,
        ]}
      ></Modal>
      {isModalCreate ? (
        <CreateDocument open={isModalCreate} close={setIsModalCreate} />
      ) : null}
    </>
  );
};
export default DocumentNotice;
