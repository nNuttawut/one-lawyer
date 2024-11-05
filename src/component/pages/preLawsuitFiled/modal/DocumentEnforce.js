import React, { useEffect, useState } from "react";
import { Button, Modal, Card } from "antd";
import jsPDF from "jspdf";
import "../../../../assets/font/THSarabunNew-normal";
import CreateDocument from "./CreateDocument";
import garuda from "../../../../assets/images/garuda_emblem.jpg";
import bracket from "../../../../assets/images/bracket.png";
import arabicToThai from "../../../../hook/arabicToThai";
import ConvertToThaiFont from "../../../../hook/ConvertToThaiFont";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import dayjs from "dayjs";

const DocumentEnforce = ({ open, close }) => {
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
    interestRate: 15,
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

      let customerLength;

      if (textData.gua.length.length > 4) {
        customerLength = "ห้า";
      } else if (textData.gua.length > 3) {
        customerLength = "สี่";
      } else if (textData.gua.length > 2) {
        customerLength = "สาม";
      } else if (textData.gua.length > 1) {
        customerLength = "สอง";
      } else {
        customerLength = "หนึ่ง";
      }

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
      pdf.text("(แบบ ผบ.๑)", marginL + 42, pdfPositionY); // Add text to pdf
      pdf.text("คำฟ้องคดีผู้บริโภค", marginL + 42, pdfPositionY + 20);
      pdfPositionY += pdfConfig.typo.small;

      //เลขคดี
      pdf.text(
        `คดีหมายเลขดำที่  ${textData.numberBlack}`,
        marginC + 80,
        pdfPositionY + 20
      );
      pdf.line(313, pdfPositionY + 21, 313 + 84, pdfPositionY + 21);

      pdfPositionY += 20; // เว้นบรรทัด
      pdf.text(
        `คดีหมายเลขแดงที่     ${textData.numberRed}`,
        marginC + 80,
        pdfPositionY + 20
      );
      pdf.line(317, pdfPositionY + 20, 317 + 80, pdfPositionY + 20);
      pdfPositionY += 20;
      //ศาล
      pdf.text(`ศาล      ${textData.place}`, marginC + 40, pdfPositionY + 20);
      pdf.line(marginC + 52, pdfPositionY + 21, 305 + 40, pdfPositionY + 21);
      pdfPositionY += 20; // เว้นบรรทัด

      //วัน เดือน ปี
      pdf.text(
        `วันที่      ${convertToThaiNumerals(
          convertDateThaiDate(textData.date)
        )}`,
        marginC + 10,
        pdfPositionY + 20
      );
      pdf.line(
        marginC + 25,
        pdfPositionY + 21,
        marginC + 60,
        pdfPositionY + 21
      );
      pdf.text(
        `เดือน  ${convertToThaiNumerals(convertDateThaiMonth(textData.date))}`,
        marginC + 60,
        pdfPositionY + 20
      );
      pdf.line(
        marginC + 76,
        pdfPositionY + 21,
        marginC + 120,
        pdfPositionY + 21
      );
      pdf.text(
        `พุทธศักราช  ${convertToThaiNumerals(
          convertDateThaiYear(textData.date)
        )}`,
        marginC + 120,
        pdfPositionY + 20
      );
      pdf.line(marginC + 157, pdfPositionY + 21, 300 + 80, pdfPositionY + 21);

      //ความ
      pdfPositionY += 20;
      pdf.text(`ความ      ${textData.type}`, marginC + 40, pdfPositionY + 20);
      pdf.line(marginC + 57, pdfPositionY + 21, 300, pdfPositionY + 21);

      //โจทก์
      pdfPositionY += 20;
      pdf.text(
        ` บริษัท วัน ลิสซ่ิง จำกัด   โดย${textData.lawyerBy}  ผู้รับมอบอำนาจ                         โจทก์`,
        marginL + 77,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 76,
        pdfPositionY + 21,
        marginL + 360,
        pdfPositionY + 21
      );

      //จำเลย
      if (textData.gua.length > 4) {
        pdfPositionY += 20;
        pdf.text(
          `${textData.gua[0]}  ที่ ๑, ${textData.gua[1]}  ที่ ๒,`,
          marginL + 77,
          pdfPositionY + 20
        );
        pdfPositionY += 20;
        pdf.text(
          ` ${textData.gua[2]}  ที่ ๓, ${textData.gua[3]} ที่ ๔,  ${textData.gua[4]} ที่ ๕`,
          marginL + 77,
          pdfPositionY + 20
        );
        pdf.text("จำเลย", marginC + 200, pdfPositionY + 20);
        pdf.line(
          marginL + 76,
          pdfPositionY + 21,
          marginL + 360,
          pdfPositionY + 21
        );
      } else if (textData.gua.length > 3) {
        pdfPositionY += 20;
        pdf.text(
          `${textData.gua[0]}  ที่ ๑, ${textData.gua[1]}  ที่ ๒,`,
          marginL + 77,
          pdfPositionY + 20
        );
        pdfPositionY += 20;
        pdf.text(
          ` ${textData.gua[2]}  ที่ ๓, ${textData.gua[3]} ที่ ๔,`,
          marginL + 77,
          pdfPositionY + 20
        );
        pdf.text("จำเลย", marginC + 200, pdfPositionY + 20);
        pdf.line(
          marginL + 76,
          pdfPositionY + 21,
          marginL + 360,
          pdfPositionY + 21
        );
      } else if (textData.gua.length > 2) {
        pdfPositionY += 20;
        pdf.text(
          `${textData.gua[0]}  ที่ ๑, ${textData.gua[1]}  ที่ ๒,`,
          marginL + 77,
          pdfPositionY + 20
        );
        pdfPositionY += 20;
        pdf.text(` ${textData.gua[2]}  ที่ ๓`, marginL + 77, pdfPositionY + 20);
        pdf.text("จำเลย", marginC + 200, pdfPositionY + 20);
        pdf.line(
          marginL + 76,
          pdfPositionY + 21,
          marginL + 360,
          pdfPositionY + 21
        );
      } else if (textData.gua.length > 1) {
        pdfPositionY += 40;
        pdf.text(
          `${textData.gua[0]}  ที่ ๑, ${textData.gua[1]}  ที่ ๒,`,
          marginL + 77,
          pdfPositionY + 20
        );
        pdf.text("จำเลย", marginC + 200, pdfPositionY + 20);
        pdf.line(
          marginL + 76,
          pdfPositionY + 21,
          marginL + 360,
          pdfPositionY + 21
        );
      } else {
        pdfPositionY += 40;
        pdf.text(`${textData.gua[0]}  ที่ ๑`, marginL + 77, pdfPositionY + 20);
        pdf.text("จำเลย", marginC + 200, pdfPositionY + 20);
        pdf.line(
          marginL + 76,
          pdfPositionY + 21,
          marginL + 360,
          pdfPositionY + 21
        );
      }

      //bracket
      const width = 10; // Adjust width to fit your needs
      const height = 45; // Adjust height to fit your needs
      const imageBracket = bracket; // Replace with your image URL or base64
      pdf.addImage(imageBracket, "PNG", marginL + 67, 190, width, height);
      pdf.text("ระหว่าง", marginL + 42, pdfPositionY + 5);
      pdfPositionY += 20;

      pdf.text(
        `เรื่อง         ${textData.subject}   `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 58,
        pdfPositionY + 21,
        marginL + 380,
        pdfPositionY + 21
      );
      pdfPositionY += 20;

      pdf.text(`จำนวนทุนทรัพย์`, marginL + 42, pdfPositionY + 20);
      pdf.text(
        ` ${convertToThaiNumerals(currencyFormat(textData.amountTotal))} `,
        marginC,
        pdfPositionY + 20
      );
      if (textData.amountSub) {
        pdf.text(
          `${convertToThaiNumerals(currencyFormat(textData.amountSub))}`,
          marginC + 140,
          pdfPositionY + 20
        );
      } else {
        pdf.text(`-`, marginC + 140, pdfPositionY + 20);
      }

      pdf.text("บาท", marginC + 80, pdfPositionY + 20);
      pdf.text("สตางค์", marginC + 200, pdfPositionY + 20);
      pdf.line(
        marginL + 93,
        pdfPositionY + 21,
        marginL + 360,
        pdfPositionY + 21
      );
      pdfPositionY += 20;
      pdf.text(
        `ข้าพเจ้า       บริษัท วัน ลิสซิ่ง จำกัด`,
        marginL + 50,
        pdfPositionY + 20
      );
      pdf.text("โจทก์", marginC + 200, pdfPositionY + 20);
      pdf.line(
        marginL + 73,
        pdfPositionY + 21,
        marginL + 360,
        pdfPositionY + 21
      );
      pdfPositionY += 20;

      pdf.text(
        `เชื้อชาติ          -       สัญชาติ             ไทย        `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.text(
        `อาชีพ            ค้าขาย        อายุ       -               ปี`,
        marginC + 40,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 67,
        pdfPositionY + 21,
        marginL + 364,
        pdfPositionY + 21
      );
      pdfPositionY += 20;

      pdf.text(
        `เลชบัตรประจำตัวประชาชน                    -                           `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.text(
        `อยู่บ้านเลขที่          ๑/๒๔               `,
        marginC + 100,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 130,
        pdfPositionY + 21,
        marginL + 364,
        pdfPositionY + 21
      );
      pdfPositionY += 20;

      pdf.text(
        `หมู่ที่     -              ถนน          มิตรภาพ    `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.text(
        `ตรอก          -          ใกล้เขียง        -      `,
        marginC + 70,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 57,
        pdfPositionY + 21,
        marginL + 364,
        pdfPositionY + 21
      );
      pdfPositionY += 20;

      pdf.text(
        `ตำบล/แขวง       ในเมือง            อำเภอ/เขต          เมืองขอนแก่น    `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.text(`จังหวัด          ขอนแก่น`, marginC + 115, pdfPositionY + 20);
      pdf.line(
        marginL + 82,
        pdfPositionY + 21,
        marginL + 364,
        pdfPositionY + 21
      );
      pdfPositionY += 20;

      pdf.text(
        `โทรศัพท์  ${convertToThaiFont(
          textData.phoneOne
        )}           โทรสาร         -  `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.text(
        `จดหมายอิเล็กทรอนิกส์          -`,
        marginC + 70,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 69,
        pdfPositionY + 21,
        marginL + 364,
        pdfPositionY + 21
      );
      pdfPositionY += 20;

      if (textData.gua.length > 4) {
        pdf.text(
          `ขอยื่นฟ้อง          ${textData.gua[0]}  ที่ ๑,       ${textData.gua[1]}  ที่ ๒`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 74,
          pdfPositionY + 21,
          marginL + 364,
          pdfPositionY + 21
        );
        pdfPositionY += 20;

        pdf.text(
          `   ${textData.gua[2]}  ที่ ๓,   ${textData.gua[3]}  ที่ ๔,  ${textData.gua[4]}  ที่ ๕`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 21,
          marginL + 364,
          pdfPositionY + 21
        );
      } else if (textData.gua.length > 3) {
        pdf.text(
          `ขอยื่นฟ้อง          ${textData.gua[0]}  ที่ ๑,       ${textData.gua[1]}  ที่ ๒`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 74,
          pdfPositionY + 21,
          marginL + 364,
          pdfPositionY + 21
        );
        pdfPositionY += 20;

        pdf.text(
          `          ${textData.gua[2]}  ที่ ๓,   ${textData.gua[3]}  ที่ ๔`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 21,
          marginL + 364,
          pdfPositionY + 21
        );
      } else if (textData.gua.length > 2) {
        pdf.text(
          `ขอยื่นฟ้อง          ${textData.gua[0]}  ที่ ๑,       ${textData.gua[1]}  ที่ ๒`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 74,
          pdfPositionY + 21,
          marginL + 364,
          pdfPositionY + 21
        );
        pdfPositionY += 20;

        pdf.text(
          `          ${textData.gua[2]}  ที่ ๓`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 21,
          marginL + 364,
          pdfPositionY + 21
        );
      } else if (textData.gua.length > 1) {
        pdf.text(
          `ขอยื่นฟ้อง          ${textData.gua[0]}  ที่ ๑,       ${textData.gua[1]}  ที่ ๒`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 74,
          pdfPositionY + 21,
          marginL + 364,
          pdfPositionY + 21
        );
        pdfPositionY += 20;
        pdf.line(
          marginL + 42,
          pdfPositionY + 21,
          marginL + 364,
          pdfPositionY + 21
        );
      } else {
        pdf.text(
          `ขอยื่นฟ้อง          ${textData.gua[0]}  ที่ ๑`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 74,
          pdfPositionY + 21,
          marginL + 364,
          pdfPositionY + 21
        );
        pdfPositionY += 20;
        pdf.line(
          marginL + 42,
          pdfPositionY + 21,
          marginL + 364,
          pdfPositionY + 21
        );
      }

      pdfPositionY += 20;
      pdf.text(
        `เชื้อชาติ          -       สัญชาติ             ไทย        `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.text(
        `อาชีพ            ค้าขาย        อายุ       -            ปี`,
        marginC + 50,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 68,
        pdfPositionY + 21,
        marginL + 364,
        pdfPositionY + 21
      );
      pdfPositionY += 20;

      pdf.text(
        `อยู่บ้านเลขที่          ๑/๒๔              หมู่ที่     -              ถนน          มิตรภาพ          `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 82,
        pdfPositionY + 21,
        marginL + 364,
        pdfPositionY + 21
      );
      pdfPositionY += 20;

      pdf.text(
        `ตรอก    -     ใกล้เขียง        -      ตำบล/แขวง       ในเมือง            อำเภอ/เขต         เมืองขอนแก่น    `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 62,
        pdfPositionY + 21,
        marginL + 364,
        pdfPositionY + 21
      );
      pdfPositionY += 20;
      pdf.text(
        `จังหวัด        ขอนแก่น                         โทรศัพท์     -                               โทรสาร         -  `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 63,
        pdfPositionY + 21,
        marginL + 364,
        pdfPositionY + 21
      );

      pdfPositionY += 20;
      pdf.text(
        `จดหมายอิเล็กทรอนิกส์                           -                            มีข้อความตามที่จะกล่าวต่อไปนี้`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 113,
        pdfPositionY + 21,
        marginL + 259,
        pdfPositionY + 21
      );

      // page 2
      pdf.addPage();
      pdfPositionY = 58; // เว้นบรรทัด
      pdf.setFont("THSarabunNew", "normal"); // Set font family
      pdf.setFontSize(pdfConfig.typo.small); // Set font size
      pdf.setTextColor("black"); // Set font color with hex color code
      pdf.text("- 2 -", marginC + 40, pdfPositionY); // Add text to pdf
      pdfPositionY += 10;
      pdf.text(`   ข้อที่ ๑.`, marginL + 42, pdfPositionY + 23);
      pdf.text(
        `        โจทก์เป็นนิติบุคคลประเภทบริษัทจำกัด  มีวัตถุประส่งค์ในการ  ซื้อขาย  เช่าซื้อ  ให้เช่าซื้อรถยนต์ทุก`,
        marginL + 54,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 74,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `ชนิดเดิมโจทก์ใช้ชื่อว่า บริษัท ซีเอแอล ๒๐๐๙  จำกัด  ต่อมาเมื่อวันที่ ๒๐ ตุลาคม ๒๕๖๕ ได้จดทะเบียนเปลี่ยน`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `ชื่อเป็นบรฺษัท วัน ลิสซิ่ง จำกัด  ปรากฏตามสำเนาหนังสือรับรองและวัตถุประสงค์เอกสารท้ายคำฟ้องหมายเลข ๑`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `                     ในการฟ้องและดำเนินคดีนี้  โจทก์มอบอำนาจให้นาย  ${textData.lawyerBy}   เป็นผู้มีอำนาจ`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `ฟ้องและดำเนินคดีกับจำเลยทั้ง${customerLength}แทนโจทก์ได้ ปรากฎตามสำเนาหนังสือมอบอำนอาจเอกสารหมายเลข ๒`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `     ข้อ ๒.  เมื่อวันที่  ${convertToThaiNumerals(
          convertDateThai(textData.sDate)
        )}  จำเลยที่ ๑ ได้ทำสัญญาเช่าซื้อรถยนต์ยี่ห้อ ${
          textData.carBrand
        } จากโจทก์ไป ๑ `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `คัน ในสภาพเรียบร้อยใช้การได้ดี  คันหมายเลขตัวถัง ${convertToThaiFont(
          convertToThaiNumerals(textData.carNumber)
        )}  หมายเลขทะเบียน  ${convertToThaiNumerals(textData.plateLicense)}`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `กาญจนบุรี ในราคาเช่าซื้อ  ${convertToThaiNumerals(
          currencyFormat(textData.amountBuy)
        )}  บาท โดยจำเลยที่ ๑ สัญญาจะผ่อนชำระค่าเป็นรายงวดเดือน ๆ ละ`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `${convertToThaiNumerals(
          currencyFormat(textData.paymentDAMT)
        )} ให้แล้วเสร็จภายใน ${convertToThaiNumerals(
          currencyFormat(textData.paymentTerm)
        )} งวด เริ่มงวดแรกในวันที่ ${convertToThaiNumerals(
          convertDateThai(textData.sDate)
        )} งวดต่อไปทุกวันที่ ๕ ของเดือนถัด`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `ไปจนกว่าจะชำระเสร็จ โดยมีเงื่อนไขว่าจำเลยที่  ๑  จะได้กรรมสิทธิ์เมื่อชำระค่างวดครบถ้วน และถือเอากำหนด`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `เวลาการชำระค่างวดเป็นสาระสำคัญของสัญญา  หากผิดนัดชำระค่างวด  ๓  งวดติดต่อกัน และโจทก์ได้มีหนังสือ`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `บอกเลิกสัญญาไปยังจำเลยที่ ๑ แล้ว จำเลยที่ ๑ ไม่ชำระค่างวดที่ค้างทั้งหมดภายใน ๓๐ วัน นับแต่วันที่ได้รับหนัง`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `สือบอกกล่าวให้ถือว่าสัญญาเลิกกันโดยทันที  โดยยินยอมให้โจทก์ริบเงินที่ได้ชำระแล้วทั้งสิ้นและจำเลยที่ ๑ `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `สัญญาจะคือรถในสภาพเรียบร้อยใช้การได้ดี หรือให้โจทก์กลับเข้าครอบครองรถ  หากคืนไม่ได้จะชำระราคาแทน`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `พร้อมดอกเบี้ยในอัตราสำหรับลูกหนี้ชั้นดีรายย่อยของธนาคารกรุงไทย  จำกัด(มหาชน)  บวกสิบ  นับแต่วันผิดนัด`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `เป็นต้นไปจำเลยที่  ๑  ได้รับรับในสภาพเรียบร้อยใช้การได้ดีแล้วในวันทำสัญญา  ปรากฎตามสำเนาสัญญาเช่าซื้อ `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(`เอกสารท้ายคำฟ้องหมายเลข ๓`, marginL + 42, pdfPositionY + 20);
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      if (textData.gua.length > 4) {
        pdf.text(
          `                    ในการทำสัญญาเช่าซื้อของจำเลยที่ ๑ จำเลยที่ ๒ จำเลยที่ ๓ จำเลยที่ ๔ และที่ ๕  ได้ยินยอม`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );

        pdfPositionY += 25;
        pdf.text(
          `ตนเข้าเป็นผู้ค้ำประกันโดยยอมรับผิดหากจำเลยที่ ๑ ผิดสัญญาและไม่สามารถชำระหนี้ได้ไม่ว่าด้วยเหตุใด ๆ `,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );

        pdfPositionY += 25;
        pdf.text(
          `จำเลยที่ ๒ จำเลยที่ ๓ จำเลยที่ ๔ และที่ ๕ จะชำระหนี้แทนจนครบจำนวน ปรากฎตามสำเนาสัญาญาค้ำประกัน`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );

        pdfPositionY += 25;
        pdf.text(
          `เอกสารท้ายคำฟ้องหมายเลข ๔,๕`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );
      } else if (textData.gua.length > 3) {
        pdf.text(
          `                    ในการทำสัญญาเช่าซื้อของจำเลยที่ ๑ จำเลยที่ ๒ จำเลยที่ ๓ และที่ ๔  ได้ยินยอมตนเข้าเป็นผู้`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );

        pdfPositionY += 25;
        pdf.text(
          `ค้ำประกันโดยยอมรับผิดหากจำเลยที่ ๑ ผิดสัญญาและไม่สามารถชำระหนี้ได้ไม่ว่าด้วยเหตุใด ๆ จำเลยที่ ๒ จำเลย `,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );

        pdfPositionY += 25;
        pdf.text(
          `ที่ ๓ และที่ ๔ จำชำระหนี้แทนจนครบจำนวน ปรากฎตามสำเนาสัญาญาค้ำประกันเอกสารท้ายคำฟ้องหมายเลข ๔,๕`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );
      } else if (textData.gua.length > 2) {
        pdf.text(
          `                    ในการทำสัญญาเช่าซื้อของจำเลยที่ ๑ จำเลยที่ ๒ และที่ ๓  ได้ยินยอมตนเข้าเป็นผู้ค้ำประกัน`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );

        pdfPositionY += 25;
        pdf.text(
          `โดยยอมรับผิดหากจำเลยที่ ๑ ผิดสัญญาและไม่สามารถชำระหนี้ได้ไม่ว่าด้วยเหตุใด ๆ จำเลยที่ ๒ และที่ ๓ จะ`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );

        pdfPositionY += 25;
        pdf.text(
          `ชำระหนี้แทนจนครบจำนวน ปรากฎตามสำเนาสัญาญาค้ำประกันเอกสารท้ายคำฟ้องหมายเลข ๔,๕`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );
      } else if (textData.gua.length > 1) {
        pdf.text(
          `                    ในการทำสัญญาเช่าซื้อของจำเลยที่ ๑ และที่ ๒  ได้ยินยอมตนเข้าเป็นผู้ค้ำประกันโดยยอมรับผิด`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );

        pdfPositionY += 25;
        pdf.text(
          `หากจำเลยที่ ๑ ผิดสัญญาและไม่สามารถชำระหนี้ได้ไม่ว่าด้วยเหตุใด ๆ จำเลยที่ ๒ จะชำระหนี้แทนจนครบจำนวน`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );

        pdfPositionY += 25;
        pdf.text(
          `ปรากฎตามสำเนาสัญาญาค้ำประกันเอกสารท้ายคำฟ้องหมายเลข ๔,๕`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );
      } else {
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );

        pdfPositionY += 25;

        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );

        pdfPositionY += 25;
        pdf.line(pdfPositionY + 23, marginL + 384, pdfPositionY + 23);
      }

      // page 3
      pdf.addPage();
      pdfPositionY = 58; // เว้นบรรทัด
      pdf.setFont("THSarabunNew", "normal"); // Set font family
      pdf.setFontSize(pdfConfig.typo.small); // Set font size
      pdf.setTextColor("black"); // Set font color with hex color code
      pdf.text("- 3 -", marginC + 40, pdfPositionY); // Add text to pdf
      pdfPositionY += 10;
      pdf.text(
        `         ข้อ ๓.  เมื่อรับรถยนต์ไปแล้ว จำเลยที่ ๑ ได้ปฎิบัติผิดสัญญา โดยได้ชะระค่างวดให้แก่โจทก์เพียง ${convertToThaiNumerals(
          currencyFormat(textData.nopay)
        )} งวด`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `เป็นเงินจำนวน ${convertToThaiNumerals(
          currencyFormat(textData.paymentTotal)
        )} บาท แล้วได้ผิดนัดชำระค่างวดตั้งแต่งวดที่  ๕  ซึ่งถึงกำหนดชำระในวันที่ ${convertToThaiNumerals(
          convertDateThaiDate(textData.lostPayDate)
        )} ${convertToThaiNumerals(
          convertDateThaiMonth(textData.lostPayDate)
        )}`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `${convertToThaiNumerals(
          convertDateThaiYear(textData.lostPayDate)
        )} ติดต่อกัน ${convertToThaiNumerals(
          currencyFormat(textData.lostNoPay)
        )} งวดจนถึงปัจจุบัน โดยจำเลยที่ ๑ ยังค้างชำระค่างวดรถยนต์ทั้งสิ้นเป็นเงินจำนวน ${convertToThaiNumerals(
          currencyFormat(textData.amountBuy)
        )}`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `บาท ปรากฎในการ์ดลูกหนี้และการรับชำระ เอกสารท้ายคำฟ้องหมายเลข ๖`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `                     การที่จำเลยที่ ๑ ผิดนัดชำระค่างวด ๓ งวดติดต่อกัน ถือว่าจำเลยที่ ๑ เป็นฝ่ายผิดสัญญา จำเลย`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `ที่ ๑ มีหน้าที่ส่งรถยนต์คืนโจทย์ก็ได้มีหนังสือบอกกล่าวให้จำเลยทั้ง${customerLength}ชำระหนี้ค่างวดรถยนต์ที่ค้างชำระภายใน`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `๓๐ วัน จำเลยทั้ง${customerLength}ได้รับหนังสือบอกกล่าวโดยชอบแล้วละเลยไม่ปฏิบัติตามคำบอกกล่าว สัญญาจึงเลิกกันตาม`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `สัญญาโดย โจทก์ได้จัดส่งคำบอกกล่าวเลิกสัญญาไปตามที่จำเลยทั้ง${customerLength}ให้ไว้ในขณะทำสัญญาข้อ ๑๙ แล้ว จึงถือว่า`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `สัญญาเลิกกันตามสัญญาปรากฎตามสำเนาหนังสือบอกกล่าวเลิกสัญญาให้ชำระหนี้  หลักฐานการส่งสิ่งของทาง`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `ไปรษณีย์และไปรษณีย์ตอบรับ เอกสารท้ายคำฟ้องหมายเลข ๗ - ๑๐`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `                     นับตั้งแต่จำเลขที่ ๑ ผิดนัดชำระค่าง่วดตั้งแต่งวดที่ ๕ ซึ่งถึงกำหนดชำระในวันที่ ${convertToThaiNumerals(
          convertDateThaiDate(textData.dueDate)
        )} ${convertToThaiNumerals(convertDateThaiMonth(textData.dueDate))}`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `${convertToThaiNumerals(
          convertDateThaiYear(textData.dueDate)
        )} โจทก์ได้ให้เจ้าพนักงานออกติดตามทวงถามให้จำเลยทั้ง${customerLength}ชำระหนี้แล้วหลายหนเสียค่าใช้จ่ายไม่น้อยกว่า`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `${convertToThaiNumerals(
          currencyFormat(textData.lostBenefits)
        )} บาท จำเลยทั้งสามต้องรับผิดต่อโจทก์ด้วย`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `                     นอกจากนี้จำเลยทั้ง${customerLength}ต้องร่วมกันรับผิดชดใช้ค่าขาดประโยชน์แก่โจทย์กล่าวคือหากรถยนต์คัน`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `ที่เช่าซื้ออยู่ในครอบครองของโจทก์ โจทก์สามารถนำรถยนต์ออกให้บุคคลภายนอกเช่าได้ในอัตราเดือนละไม่น้อย`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `กว่า ๓,๐๐๐ บาท นับแต่งวดที่ผิดนัดคืองวดที่ ${convertToThaiNumerals(
          currencyFormat(textData.nopay)
        )} ซึ่งถึงกำหนดชำระ ${convertToThaiNumerals(
          convertDateThai(textData.dueDate)
        )} จนถึงวันฟ้องเป็นเวลา `,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `${convertToThaiNumerals(
          currencyFormat(textData.lostBenefitsMonth)
        )} เดือน คิดเป็นเงินจำนวน ${convertToThaiNumerals(
          currencyFormat(textData.lostBenefitsTotal)
        )} บาท จำเลยทั้งสามต้องรับผิดต่อด้วย`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `                     ดังนั้น จำเลยทั้งสามมีหนี้ค้างชำระแก่โจทก์โดยการส่งมอบรถยนต์ที่เช่าซื้อคืนแก่โจทก์ในสภาพ`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `เรียบร้อยใช้การได้ดี หากคืนไม่ได้ให้ใช้ราคาแทนเป็นเงินจำนวน ${convertToThaiNumerals(
          currencyFormat(textData.paymentTotal)
        )} บาท พร้อมค่าติดตามทวงถามเป็นเงิน`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `จำนวน ${convertToThaiNumerals(
          currencyFormat(textData.followPay)
        )} บาท และค่าขาดประโยชน์เป็นจำนวนเงิน ${convertToThaiNumerals(
          currencyFormat(textData.amountTotal)
        )} บาท รวมเป็นเงินทั้งสินจำนวน ${convertToThaiNumerals(
          currencyFormat(textData.amountTotal)
        )}`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `บาท และค่าขาดประโยชน์นับถัดจากวันฟ้อง จนกว่าจำเลยทั้งสามจะส่งคืนรถยนต์แก่โจทก์ หรือชำระราคาเสร็จ`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      // page 4
      pdf.addPage();
      pdfPositionY = 58; // เว้นบรรทัด
      pdf.setFont("THSarabunNew", "normal"); // Set font family
      pdf.setFontSize(pdfConfig.typo.small); // Set font size
      pdf.setTextColor("black"); // Set font color with hex color code
      pdf.text("- 4 -", marginC + 40, pdfPositionY); // Add text to pdf
      pdfPositionY += 10;
      pdf.text(
        `เดือนละ ${convertToThaiNumerals(
          currencyFormat(textData.lostBenefits)
        )} บาท พร้อมดอกเบี้ยในอัตราร้อยละ ${convertToThaiNumerals(
          currencyFormat(textData.interestRate)
        )} ต่อปี ของต้นเงินจำนวน ${convertToThaiNumerals(
          currencyFormat(textData.amountTotal)
        )} บาท นับถัดจาก`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `วันฟ้องเป็นต้นไปจนกว่าจะชำระหนี้เสร็จแก่โจทก์`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `                      โจทก์ไม่มีทางอื่นใดบังคับจำเลยทั้ง${customerLength}ให้ชำระหนี้ได้จ จึงขอบารมีศาลเป็นที่พึ่ง`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 25;
      pdf.text(
        `                                                   ควรมิควรแล้วแต่จะโปรด`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      // page 5
      pdf.addPage();
      pdfPositionY = 58; // เว้นบรรทัด
      pdf.setFont("THSarabunNew", "normal"); // Set font family
      pdf.setFontSize(pdfConfig.typo.small); // Set font size
      pdf.setTextColor("black"); // Set font color with hex color code
      pdf.text("- 5 -", marginC + 40, pdfPositionY); // Add text to pdf
      pdfPositionY += 10;

      pdf.text(`(๕)`, marginL + 42, pdfPositionY + 20);

      pdfPositionY += 20;
      pdf.text(`คำขอท้ายคำฟ้องคดีผู้บริโภค`, marginL + 42, pdfPositionY + 20);

      pdfPositionY += 20;
      pdf.text(
        `ขอศาลออกหมายเรียกตัวจำเลยมาพิจารณาพิพากษา และบังคับจำเลยตามคำขอต่อไปนี้`,
        marginL + 45,
        pdfPositionY + 20
      );

      pdfPositionY += 20;
      pdf.text(`๑.`, marginL + 45, pdfPositionY + 23);
      pdf.text(
        `ให้จำเลยที่ ๑ ส่งมอบรถยนต์ที่เช่าซื้อคืนให้แก่โจทก์ในสภาพเรียบร้อยใช้การได้ดี หากคืนไม่ได้ให้ใช้ราคาแทน`,
        marginL + 54,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 54,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 20;
      pdf.text(
        `เป็นเงินจำนวน ${convertToThaiNumerals(
          currencyFormat(textData.paymentTotal)
        )} บาท`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 20;
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 20;
      pdf.text(`๒.`, marginL + 45, pdfPositionY + 23);
      pdf.text(
        `ให้จำเลยที่ ๑ ชำระค่าติดตามทวงถามแกโจทก์เป็นเงินตำนวน ${convertToThaiNumerals(
          currencyFormat(textData.followPay)
        )} บาท ค่าขาดประโยชน์นับแต่วัน`,
        marginL + 54,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 54,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 20;
      pdf.text(
        `ที่ผิดนัดจนถึงวันฟ้องคิดเป็นเงินจำนวน ${convertToThaiNumerals(
          currencyFormat(textData.lostBenefitsTotal)
        )} บาท และค่าขาดประโยชน์อีกเดือนละ ${convertToThaiNumerals(
          currencyFormat(textData.lostBenefits)
        )} บาท นับถัด`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 20;
      pdf.text(
        `จากวันฟ้องจนกว่าจะชำระเสร็จแก่โจทก์`,
        marginL + 42,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 20;
      pdf.text(`๓.`, marginL + 45, pdfPositionY + 23);
      pdf.text(
        `ให้จำเลยที่ ๑ ชำระดอกเบี้ยในอัตราร้อยละ ๑๕ ต่อปี จากต้นเงินจำนวน ${convertToThaiNumerals(
          currencyFormat(textData.amountTotal)
        )} บาท นับจากวันฟ้องจน`,
        marginL + 54,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 54,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 20;
      pdf.text(`กว่าจะชำระเสร็จสิ้นแก่โจทก์`, marginL + 42, pdfPositionY + 20);
      pdf.line(
        marginL + 42,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 20;
      pdf.text(`๔.`, marginL + 45, pdfPositionY + 23);
      pdf.text(
        ` หากจำเลยที่ ๑ ไม่สามารถชำระหนี้ให้แก่โจทก์ได้ไม่ว่ากรณีใด ๆ ข้อให้ศาลมีคำพิพากษาให้จำเลย`,
        marginL + 54,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 54,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );
      if (textData.gua.length > 4) {
        pdfPositionY += 20;
        pdf.text(
          `จำเลยที่ ๒ จำเลยที่ ๓ จำเลยที่ ๔ และที่ ๕ ชำระหนี้แทนจนครบจำนวน`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );
      } else if (textData.gua.length > 3) {
        pdfPositionY += 20;
        pdf.text(
          `จำเลยที่ ๒ จำเลยที่ ๓ และที่ ๔  ชำระหนี้แทนจนครบจำนวน`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );
      } else if (textData.gua.length > 2) {
        pdfPositionY += 20;
        pdf.text(
          `จำเลยที่ ๒ และที่ ๓ ชำระหนี้แทนจนครบจำนวน`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );
      } else if (textData.gua.length > 1) {
        pdfPositionY += 20;
        pdf.text(
          `จำเลยที่ ๒ ชำระหนี้แทนจนครบจำนวน`,
          marginL + 42,
          pdfPositionY + 20
        );
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );
      } else {
        pdfPositionY += 20;
        pdf.text(`ชำระหนี้จนครบจำนวน`, marginL + 42, pdfPositionY + 20);
        pdf.line(
          marginL + 42,
          pdfPositionY + 23,
          marginL + 384,
          pdfPositionY + 23
        );
      }

      pdfPositionY += 20;
      pdf.text(`๕.`, marginL + 45, pdfPositionY + 23);
      pdf.text(
        `ให้จำเลยทั้ง${customerLength}ร่วมกันหรือแทนกัน ชำระค่าฤชาธรรมเนียมและค่่าทนายความแทนโจทก์ให้อัตราอย่างสูง`,
        marginL + 54,
        pdfPositionY + 20
      );
      pdf.line(
        marginL + 54,
        pdfPositionY + 23,
        marginL + 384,
        pdfPositionY + 23
      );

      pdfPositionY += 20;
      pdf.text(
        `ข้าพเจ้าได้ยื่นสำเนาคำฟ้องโดยข้อความถูกต้องเป็นอย่างเดียวกันมาด้วย              ฉบับและรอฟังคำสั่งอยู่`,
        marginL + 45,
        pdfPositionY + 20
      );
      pdf.text(`${customerLength}`, marginC + 117, pdfPositionY + 18);
      pdf.line(marginC + 106, pdfPositionY + 20, 290 + 30, pdfPositionY + 20);

      pdfPositionY += 20;
      pdf.text(`ถ้าไม่ให้ถือว่าทราบแล้ว`, marginL + 45, pdfPositionY + 20);

      pdfPositionY += 20;
      pdf.text(`บริษัท วัน ลิสซิ่ง จำกัด ฯ`, marginC + 80, pdfPositionY + 18);
      pdf.text(`โจทก์`, marginC + 190, pdfPositionY + 20);
      pdf.line(
        marginL + 120,
        pdfPositionY + 20,
        marginL + 349,
        pdfPositionY + 20
      );

      pdfPositionY += 20;
      pdf.text(`${textData.lawyerBy}`, marginC + 80, pdfPositionY + 18);
      pdf.line(
        marginC + 50,
        pdfPositionY + 20,
        marginL + 370,
        pdfPositionY + 20
      );

      pdfPositionY += 20;
      pdf.text(`ข้าพเจ้า`, marginL + 95, pdfPositionY + 20);
      pdf.text(`เจ้าพนักงานคดี/ผุ้บันทึก`, marginC + 140, pdfPositionY + 20);
      pdf.line(
        marginL + 120,
        pdfPositionY + 20,
        marginL + 299,
        pdfPositionY + 20
      );
      pdfPositionY += 20;
      pdf.line(
        marginC + 50,
        pdfPositionY + 20,
        marginL + 370,
        pdfPositionY + 20
      );

      pdfPositionY += 20;
      pdf.text(
        `ข้าพเจ้า${textData.lawyerBy} ทนายความ ใบอนุญาตที่ ${textData.licenseCode} ผู้เรียง/พิมพ์`,
        marginL + 110,
        pdfPositionY + 20
      );

      pdfPositionY += 20;
      pdf.text(`${textData.lawyerBy}`, marginC + 80, pdfPositionY + 18);
      pdf.line(
        marginC + 50,
        pdfPositionY + 20,
        marginL + 370,
        pdfPositionY + 20
      );

      pdfPositionY += 20;
      pdf.text(`${textData.lawyerPhon}`, marginC + 140, pdfPositionY + 18);

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
        width={850}
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
      ></Modal>
      {isModalCreate ? (
        <CreateDocument open={isModalCreate} close={setIsModalCreate} />
      ) : null}
    </>
  );
};
export default DocumentEnforce;
