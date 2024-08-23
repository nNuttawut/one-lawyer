import React, { useState } from "react";
import { Button, Modal, Card } from "antd";
import jsPDF from "jspdf";
import "../../../../assets/font/AngsanaNew-normal";
import "../../../../assets/font/AngsanaNew-Bold-bold";
import "../../../../assets/font/AngsanaNew-Italic-italic";
import "../../../../assets/font/AngsanaNew-Bold Italic-bolditalic";
import CreateDocument from "./CreateDocument";
import garuda from "../../../../assets/images/garuda_emblem.jpg";
import arabicToThai from "../../../../hook/arabicToThai";
import moment from "moment";
require("moment/locale/th");

const DocumentEnforce = ({ open, close }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [textData, setTaxtData] = useState({
    number: "ผบE๓๗๐๖ /๒๕๖๗",
    place: "จังหวัดกาญจนบุรี",
    date1: 29,
    date2: "พฤษภาคม",
    date3: 2567,
    type: "แพ่ง",
    by: "นายยุทธศาลตร์ พิพิลา",
    with: [
      "นางสาวกมลทิพย์  ดอนเจดีย์",
      "นายอานนท์ โพธิ์เงิน",
      "นางสาวกนกวรรณ ดอนเจดีย์",
    ],
    subject: "ผิดสัญญาเช่าซื้อ, สัญญาค้ำประกัน, เรียกค่าเสียหาย",
    amountTotal: 226584,
    amountSub: "๒๕",
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
    region: "-",
    nationality: "ไทย",
    career: ["ค้าขาย"],
    age: ["45", "43", "46"],
    cardId: "-",
    address: [
      "1/24",
      "-",
      "มิตรภาพ",
      "-",
      "-",
      "ในเมือง",
      "เมืองขอนแก่น",
      "ขอนแก่น",
    ],
    phone: "062-328675",
    contact: "1/24 ถนนมิตรภาพ ตำยบในเมือง อำเภอเมืองขอนแก่น จังหวัดขอนแก่น ",
    fax: "-",
    email: "-",
    dateApproved: "",
    carNumer: "",
    plateLicense: "",
    amountBuy: 177024,
    payment: 3688,
    paymentTerm: 48,
  });

  // const currencyFormat = (amount) => {
  //   return Number(amount)
  //     .toFixed(2)
  //     .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  // };

  // const dateNow = () => {
  //   const date = moment().add(543, "year").format("LLL");
  //   return date;
  // };

  // const convertToThaiNumerals = (num) => {
  //   const arabicToThai = {
  //     0: "๐",
  //     1: "๑",
  //     2: "๒",
  //     3: "๓",
  //     4: "๔",
  //     5: "๕",
  //     6: "๖",
  //     7: "๗",
  //     8: "๘",
  //     9: "๙",
  //   };
  //   return num.replace(/[0-9]/g, (match) => arabicToThai[match]);
  // };

  // const convertToThaiFont = (text) => {
  //   const arabicToThai = {
  //     A: "เอ",
  //     B: "บี",
  //     C: "ซี",
  //     D: "ดี",
  //     E: "อี",
  //     F: "เอฟ",
  //     G: "จี",
  //     H: "แฮช",
  //     I: "ไอ",
  //     J: "เจ",
  //     K: "เค",
  //     L: "แอล",
  //     M: "เอ็ม",
  //     N: "เอ็น",
  //     O: "โอ",
  //     P: "พี",
  //     Q: "คิว",
  //     R: "อาร์",
  //     S: "เอส",
  //     T: "ที",
  //     U: "ยู",
  //     V: "วี",
  //     W: "ดับบิว",
  //     X: "เอ็กซ์",
  //     Y: "วาย",
  //     Z: "แซต",
  //   };
  //   return text.replace(/[A-Z]/g, (match) => arabicToThai[match]);
  // };

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
          small: 14,
        },
        margin: {
          t: 20,
          b: 20,
          l: 20,
          r: 20,
          c: 180,
        },
      };

      let pdfPositionY = 0;
      let pdfPositionYCenter = 0;
      const marginL = pdfConfig.margin.l;
      const marginC = pdfConfig.margin.c;
      const imageUrl = garuda; // Replace with your image URL or base64
      const imageWidth = 80; // Adjust width to fit your needs
      const imageHeight = 80; // Adjust height to fit your needs
      const textX = marginL;
      const textY = pdfPositionY;
      const underlineY = textY + 5; // Position for the underline
      pdf.setLineWidth(0.3);
      const textWidthNumber = pdf.getTextWidth(textData.number);
      const textWidthPlace = pdf.getTextWidth(textData.place);
      // const textWidthDate1 = pdf.getTextWidth(textData.date1);
      // const textWidthDate2 = pdf.getTextWidth(textData.date2);
      // const textWidthDate3 = pdf.getTextWidth(textData.date3);

      pdfPositionYCenter += 20;
      pdf.addImage(
        imageUrl,
        "PNG",
        marginC,
        pdfPositionYCenter,
        imageWidth,
        imageHeight
      );
      pdfPositionYCenter += imageHeight + 10; // Add a margin below the image

      pdfPositionY += 50;
      pdf.setFont("AngsanaNew", "normal"); // Set font family
      pdf.setFontSize(pdfConfig.typo.small); // Set font size
      pdf.setTextColor("black"); // Set font color with hex color code
      pdf.text("(แบบ ผบ.๑)", marginL + 20, pdfPositionY); // Add text to pdf
      pdf.text("คำฟ้องคดีผู้บริโภค", marginL + 20, pdfPositionY + 15);
      pdfPositionY += pdfConfig.typo.small;
      pdf.text("คดีหมายเลขดำที่ ", marginC + 80, pdfPositionY + 15);
      pdf.text(textData.number, marginC + 130, pdfPositionY + 15);
      pdf.line(
        305,
        pdfPositionY + 17,
        306 + textWidthNumber,
        pdfPositionY + 17
      );
      pdf.text(`ศาล ${textData.place}`, marginC + 50, pdfPositionY + 55);
      // pdf.text(textNumber, marginC + 135, pdfPositionY + 15);
      pdf.line(marginC + 62, pdfPositionY + 55, 305 + 100, pdfPositionY + 55);
      // pdf.text(`วันที่ ${textData.date1}`, marginC + 80, pdfPositionY + 25);
      // pdf.text(textDate1, marginC + 135, pdfPositionY + 15);
      // pdf.line(305, pdfPositionY + 17, 305 + textWidthDate1, pdfPositionY + 17);
      // pdf.text(`เดือน ${textDate2}`, marginC + 80, pdfPositionY + 25);
      // pdf.text(textDate2, marginC + 135, pdfPositionY + 15);
      // pdf.line(305, pdfPositionY + 17, 305 + textWidthDate2, pdfPositionY + 17);
      // pdf.text(`พุทธศักราช ${textDate3}`, marginC + 80, pdfPositionY + 25);
      // pdf.text(textDate3, marginC + 135, pdfPositionY + 15);
      // pdf.line(305, pdfPositionY + 17, 305 + textWidthDate3, pdfPositionY + 17);

      // New page
      pdf.addPage();
      pdfPositionY = 0;
      pdf.setFont("AngsanaNew", "normal");
      pdf.setFontSize(pdfConfig.typo.header);
      pdf.setTextColor("#025955");
      pdfPositionY += 40;
      pdf.text(
        "ทดสอบการสร้าง pdf โดย jsPdf",
        pdfWidth / 2,
        pdfPositionY,
        null,
        null,
        "center"
      );

      // Add footer with date and page number
      setTimeout(() => {
        pdf.setFont("AngsanaNew", "normal");
        pdf.setFontSize(pdfConfig.typo.small);
        pdf.setTextColor("#000");
        const textDate = new Date().toString();

        const pages = pdf.internal.getNumberOfPages();

        for (let j = 1; j < pages + 1; j++) {
          pdf.setPage(j);
          pdf.text(
            `วันเวลา : ${textDate}`,
            marginL,
            pdfHeight - 15,
            null,
            null,
            "left"
          );
          pdf.text(
            `หน้า ${j} จาก ${pages}`,
            pdfWidth - marginL,
            pdfHeight - 15,
            null,
            null,
            "right"
          );
        }

        // Download PDF file
        pdf.save(Date.now() + ".pdf");
      }, 0);
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
        width={"50%"}
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
          <Button key="cancel" onClick={createPdf} style={{ color: "green" }}>
            พิมพ์
          </Button>,
        ]}
      >
        <Card></Card>
      </Modal>
      {isModalCreate ? (
        <CreateDocument open={isModalCreate} close={setIsModalCreate} />
      ) : null}
    </>
  );
};
export default DocumentEnforce;
