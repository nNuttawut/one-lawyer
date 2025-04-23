import React, { useRef, useState, useEffect } from "react";
import { Button, Select, Form, Col, Row } from "antd";
import { useReactToPrint } from "react-to-print";
import PrintPDF from "./PrintPDF";
import LoadLawyers from "../../../../../hook/LoadLawyers";

const InputPDF = ({ dataCus, arrData, dateQuery }) => {
  const [form] = Form.useForm(); //กำหนด form ก่อนใช้งาน
  console.log("3333//", dataCus[0].CONTNO);
  //  console.log("3333///", arrData);
  const [triggerPDF, setTriggerPDF] = useState(false);
  const [nameLawyerA1, setnameLawyerA1] = useState(false);
  const conponentPDF = useRef();
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [lawyersOption, setLawyersOption] = useState();
  const userCompany = localStorage.getItem("COMPANY_ID");

  useEffect(() => {
  
      setLoadingData(true);
    
    }, [setLoadingData]);

    useEffect(() => {
 
        if (lawyersList) {
          setOptionLawyer();
        }
      }, [lawyersList]);
  

    const setOptionLawyer = () => {
      let companySelect = null;
  
      if (userCompany === "3") {
        console.log('if');
        companySelect = lawyersList.filter(
          (item) => item.COMPANY_ID === 3 && item.ROLE_ID === 3
        );
      } else {
        console.log('else');
        
        companySelect = lawyersList.filter(
          (item) =>
            (item.COMPANY_ID === 1 || item.COMPANY_ID === 2) && item.ROLE_ID === 3
        );
      }

      console.log('lawyersList',lawyersList);
      
      const options = companySelect.map((item) => ({
        value: item.id,
        label: item.NNAME,
        fNmae: item.FNAME,
        lName: item.LNAME,
        telp: item.telp
      }));
  
      // options.unshift({
      //   value: "all", // ค่าที่แทน "ทั้งหมด"
      //   label: "ทั้งหมด", // ข้อความที่แสดงใน dropdown
      // });
  
      setLawyersOption(options);
    };

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    //documentTitle: `รายงานบอกเลิก(ที่ดิน) ออกมือ ${dataCus[0].CONTNO} `,
    documentTitle: `ReportCancelLoan${dataCus[0].CONTNO} `,
  });

  // const onChangeDateA = (date, dateString) => {
  //   console.log(date, dateString);
  // };

  const onFinish = (values) => {
    //console.log("Success:", values);
    const selectedLawyer = lawyersOption.find(
      (item) => item.value === values.selectNameLawyer

    );
    //console.log('lawyersOption',lawyersOption);
    //console.log('selectedLawyer',selectedLawyer);
      setnameLawyerA1(selectedLawyer);
      setTriggerPDF(true); // Trigger PDF generation
  };

  console.log('setnameLawyerA1',nameLawyerA1);
  
  //นับจำนวนเช็คค่าว่างคนค้ำประกัน
  const resultCusName = dataCus.map((cus, index) => {
    if (cus.cusType === 0) {
      return `${cus.NAME} (ผู้กู้/ผู้จำนอง) `;
    } else{
      return `${cus.NAME} (คนค้ำประกัน ${index-1}) `;
    }
  });
//.map(item => item.trim()): ตัดช่องว่างซ้าย-ขวา
//new Set(...): เก็บค่าไม่ซ้ำ
//[...new Set(...)]: แปลง Set กลับมาเป็น array

console.log('resultCusName',resultCusName);

  const uniqueCusName = [...new Set(resultCusName?.map(item => item?.trim()))];

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
          <Col span={23} style={{ marginLeft: "5px" }}>
            <Form.Item
              label="เลือกทนาย"
              name="selectNameLawyer"
              rules={[{ required: true, message: "เลือกทนาย!" }]}
            >
              <Select
                showSearch
                placeholder="กรอก หรือเลือกเพื่อค้นหา"
                optionFilterProp="label"
                options={lawyersOption}
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
        {arrData ? <PrintPDF dataCus={dataCus} arrData={arrData} nameLawyerA1 = {nameLawyerA1} uniqueCusName = {uniqueCusName} dateQuery = {dateQuery} /> : null}
      </div>
    </>
  );
};

export default InputPDF;
