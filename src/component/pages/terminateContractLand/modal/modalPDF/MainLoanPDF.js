// import React, { useState, useEffect } from "react";
import React, { useState } from "react";
import { Modal, Button } from "antd";
//import { FilePdfOutlined } from "@ant-design/icons";
import InputPDF from "./InputPDF";

function MainLoanPDF({dataCus, arrData, dateQuery}) {
  // console.log("2222//",dataCus);
  // console.log("2222///",arrData);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    //console.log("Clicked cancel button");
    setOpen(false);
  };

  
  return (
    <>
      <Button
        //ปุ่มกด PDF พิมพ์รายงาน
        type="primary"
        name="document"
        style={{ boxShadow: "0 4px 3px", marginLeft: "10px" }}
        onClick={showModal}
      >
        พิมพ์รายงานบอกเลิก (ที่ดิน) ออกมือ 
        {/* <FilePdfOutlined
          style={{ color: "red", fontSize: "16px", marginLeft: "4px" }}
        /> */}
      </Button>
      <Modal
        title="รายงานบอกเลิก (ที่ดิน) ออกมือ"
        open={open}
        onCancel={handleCancel}
        width={1100}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            ปิด
          </Button>,
        ]}
      >
        <InputPDF dataCus = {dataCus ? dataCus : null} arrData = {arrData ? arrData : null} dateQuery = {dateQuery ? dateQuery : null}/>
      </Modal>
    </>
  );
}

export default MainLoanPDF;
