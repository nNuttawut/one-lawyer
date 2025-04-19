// import React, { useState, useEffect } from "react";
import React, { useState } from "react";
import { Modal, Button } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import InputPDF from "./InputPDF";

function MainPDF({record}) {
  //console.log("2222//",record);
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
        name="document"
        style={{ boxShadow: "0 4px 3px", marginLeft: "10px" }}
        onClick={showModal}
      >
        <FilePdfOutlined
          style={{ color: "red", fontSize: "16px", marginLeft: "4px" }}
        />
      </Button>
      <Modal
        title="รายงานคำส่งฟ้อง"
        open={open}
        onCancel={handleCancel}
        width={1100}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            ปิด
          </Button>,
        ]}
      >
        <InputPDF record={record}/>
      </Modal>
    </>
  );
}

export default MainPDF;
