import React, { useEffect, useState } from "react";
import { Button, Modal, Card } from "antd";
import jsPDF from "jspdf";
import "../../../../assets/font/THSarabunNew-normal";
import CreateDocument from "./CreateNotice";
import garuda from "../../../../assets/images/garuda_emblem.jpg";
import arabicToThai from "../../../../hook/arabicToThai";
import ConvertToThaiFont from "../../../../hook/ConvertToThaiFont";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import { Input } from "antd";
import dayjs from "dayjs";

const TextEdit = ({ open, close }) => {
  const [convertToThaiNumerals] = arabicToThai();
  const [convertToThaiFont] = ConvertToThaiFont();
  const [
    convertDateThai,
    convertDateThaiYear,
    convertDateThaiMonth,
    convertDateThaiDate,
  ] = DateCustom();
  const [currencyFormat] = CurrencyFormat();

  const [confirmLoading, setConfirmLoading] = useState(false);
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
  const [textToJson, setTextTojson] = useState();
  const [textToString, setTextToString] = useState();
  const { TextArea } = Input;

  const [userInput, setUserInput] = useState("");

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    setTextTojson(JSON.stringify(userInput)); //แปลงส่ง
    setTextToString(JSON.parse(textToJson)); //แปลงใช้
  };

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
      let textNumber =
        "ที่ ๑ มีหน้าที่ส่งรถยนต์คืนโจทย์ก็ได้มีหนังสือบอกกล่าวให้จำเลยทั้งสามชำระหนี้ค่างวดรถยนต์ที่ค้างชำระภายใน";
      const textWidthNumber = pdf.getTextWidth(textNumber);
      console.log("textWidthNumber--->", textWidthNumber); //661.800000000001
      const imageWidth = 75; // Adjust width to fit your needs
      const imageHeight = 94; // Adjust height to fit your needs
      const textX = marginL;
      const textY = pdfPositionY;
      const underlineY = textY + 5; // Position for the underline
      pdf.setLineWidth(0.3);

      //ตราครุฑ
      const imageUrl = garuda; // Replace with your image URL or base64
      pdfPositionYCenter += 35;
      pdf.addImage(
        imageUrl,
        "PNG",
        marginC,
        pdfPositionYCenter,
        imageWidth,
        imageHeight
      );
      pdfPositionYCenter += imageHeight + 10; // Add a margin below the image

      pdfPositionY += 56; // เว้นบรรทัด
      pdf.setFont("THSarabunNew", "normal"); // Set font family
      pdf.setFontSize(pdfConfig.typo.small); // Set font size
      pdf.setTextColor("black"); // Set font color with hex color code
      pdfPositionY += pdfConfig.typo.small;
      pdfPositionY += 50;
      pdf.text(`${userInput}`, marginL + 42, pdfPositionY + 10);

      // page 2
      pdf.addPage();
      pdfPositionY = 58; // เว้นบรรทัด
      pdf.setFont("THSarabunNew", "normal"); // Set font family
      pdf.setFontSize(pdfConfig.typo.small); // Set font size
      pdf.setTextColor("black"); // Set font color with hex color code
      pdf.text("- 2 -", marginC + 40, pdfPositionY); // Add text to pdf
      pdfPositionY += 10;

      // page 3
      pdf.addPage();
      pdfPositionY = 58; // เว้นบรรทัด
      pdf.setFont("THSarabunNew", "normal"); // Set font family
      pdf.setFontSize(pdfConfig.typo.small); // Set font size
      pdf.setTextColor("black"); // Set font color with hex color code
      pdf.text("- 3 -", marginC + 40, pdfPositionY); // Add text to pdf
      pdfPositionY += 10;

      // page 4
      pdf.addPage();
      pdfPositionY = 58; // เว้นบรรทัด
      pdf.setFont("THSarabunNew", "normal"); // Set font family
      pdf.setFontSize(pdfConfig.typo.small); // Set font size
      pdf.setTextColor("black"); // Set font color with hex color code
      pdf.text("- 4 -", marginC + 40, pdfPositionY); // Add text to pdf
      pdfPositionY += 10;

      // page 5
      pdf.addPage();
      pdfPositionY = 58; // เว้นบรรทัด
      pdf.setFont("THSarabunNew", "normal"); // Set font family
      pdf.setFontSize(pdfConfig.typo.small); // Set font size
      pdf.setTextColor("black"); // Set font color with hex color code
      pdf.text("- 5 -", marginC + 40, pdfPositionY); // Add text to pdf
      pdfPositionY += 10;

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

      pdf.save(`คำฟ้องคดีผู้บริโภค.pdf`);
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
        title="คำฟ้องคดีผู้บริโภค"
        open={open}
        onOk={""}
        confirmLoading={confirmLoading}
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
      >
        <TextArea
          rows={21}
          value={userInput}
          onChange={handleInputChange}
          placeholder="กรอกข้อความที่นี่"
          style={{ width: "700.78px" }}
        />
      </Modal>
      {isModalCreate ? (
        <CreateDocument open={isModalCreate} close={setIsModalCreate} />
      ) : null}
    </>
  );
};
export default TextEdit;
