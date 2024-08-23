import React, { useState } from "react";
import { Button, Modal, Card } from "antd";
import jsPDF from "jspdf";
import "../../../../assets/font/AngsanaNew-normal";
import "../../../../assets/font/AngsanaNew-Bold-bold";
import "../../../../assets/font/AngsanaNew-Italic-italic";
import "../../../../assets/font/AngsanaNew-Bold Italic-bolditalic";
import CreateDocument from "./CreateDocument";
import garuda from "../../../../assets/images/garuda_emblem.jpg";

const FormPdf = ({ open, close }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);

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
      const imageWidth = 75; // Adjust width to fit your needs
      const imageHeight = 75; // Adjust height to fit your needs
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
      pdf.text("คำฟ้องคดีผู้บริโภค", marginL + 20, pdfPositionY + 10);
      pdfPositionY += pdfConfig.typo.small;

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
export default FormPdf;
