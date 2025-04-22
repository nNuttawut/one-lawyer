import React, { useRef, useState, useEffect } from "react";
import { Button, Select, Form, Col, Row, DatePicker } from "antd";
import { useReactToPrint } from "react-to-print";
import dataNameLawyer from "./DataNameLawyer";
import PrintPDF from "./PrintPDF";

const InputPDF = ({ dataCus, arrData }) => {
  const [form] = Form.useForm(); //กำหนด form ก่อนใช้งาน
  //console.log("3333//", dataCus[0].CONTNO);
  //  console.log("3333///", arrData);
  const [triggerPDF, setTriggerPDF] = useState(false);
  const [nameLawyerA1, setnameLawyerA1] = useState(false);
  const conponentPDF = useRef();

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: `รายงานบอกเลิก(ที่ดิน) ออกมือ ${dataCus[0].CONTNO} `,
  });

  const onChangeDateA = (date, dateString) => {
    console.log(date, dateString);
  };

  const onFinish = (values) => {
    setTriggerPDF(true); // Trigger PDF generation
    console.log("Success:", values);
    const selectedLawyer = dataNameLawyer.find(
      (item) => item.value === values.selectNameLawyer
    );

    if (selectedLawyer) {
      const telp = selectedLawyer.telp; // เอา telp มาใช้
      const dataValues = {
        ...values,
        telp: telp, // หรือชื่อ key ที่คุณต้องการ
      };
      setnameLawyerA1(dataValues);
    }
  };
  //นับจำนวนเช็คค่าว่างคนค้ำประกัน
  const resultCusName = dataCus.map((cus) => {
    if (cus.cusType === 0) {
      return `${cus.NAME} (ผู้กู้/ผู้จำนอง) `;
    } else if (cus.cusType === 1) {
      return `${cus.NAME} (คนค้ำประกัน 1) `;
    } else if (cus.cusType === 2) {
      return `${cus.NAME} (คนค้ำประกัน 2) `;
    } else if (cus.cusType === 3) {
      return `${cus.NAME} (คนค้ำประกัน 3) `;
    } else if (cus.cusType === 4) {
      return `${cus.NAME} (คนค้ำประกัน 4) `;
    } else if (cus.cusType === 5) {
      return `${cus.NAME} (คนค้ำประกัน 5) `;
    } else {
      return 'อื่น ๆ';
    }
  });
//.map(item => item.trim()): ตัดช่องว่างซ้าย-ขวา
//new Set(...): เก็บค่าไม่ซ้ำ
//[...new Set(...)]: แปลง Set กลับมาเป็น array
  const uniqueCusName = [...new Set(resultCusName.map(item => item.trim()))];

  useEffect(() => {
    if (triggerPDF) {
      generatePDF();
      setTriggerPDF(false);
    }
  }, [triggerPDF, generatePDF]);

  return (
    <>
      <Form
        name="basic"
        style={{ maxWidth: 1000 }}
        onFinish={onFinish}
        autoComplete="off"
        form={form}
      >
        <Row>
        <Col span={11} style={{ marginLeft: "5px" }}>
            <Form.Item
              label="เลือกวันที่พิมพ์"
              name="selectdate"
              rules={[{ required: true, message: "เลือกวันที่พิมพ์!" }]}
            >
              <DatePicker onChange={onChangeDateA}/>
            </Form.Item>
          </Col>
          <Col span={12} style={{ marginLeft: "5px" }}>
            <Form.Item
              label="เลือกทนาย"
              name="selectNameLawyer"
              rules={[{ required: true, message: "เลือกทนาย!" }]}
            >
              <Select
                showSearch
                placeholder="กรอก หรือเลือกเพื่อค้นหา"
                optionFilterProp="label"
                options={dataNameLawyer}
                style={{ height: "40px" }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <center>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ background: "red", fontSize: "14px" }}
                >
                  พิมพ์รายงาน
                </Button>
              </center>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="print-only" ref={conponentPDF}>
        {arrData ? <PrintPDF dataCus={dataCus} arrData={arrData} nameLawyerA1 = {nameLawyerA1} uniqueCusName = {uniqueCusName} /> : null}
      </div>
    </>
  );
};

export default InputPDF;
