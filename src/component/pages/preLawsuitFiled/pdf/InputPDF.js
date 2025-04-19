import React, { useRef, useState, useEffect } from "react";
import { Button, Select, Form, Input, Col, Row } from "antd";
import { useReactToPrint } from "react-to-print";
import dataBorrower from "./data/DataBorrower";
import PrintPage from "./PrintPage4";
import { optionsLone } from "../../../../utils/constant/LoanTypeConstant";
import { optionsCompanyList } from "../../../../utils/constant/CompanySelect";
import axios from "axios";
import { baseUrl, HEADERS_EXPORT, GET_LAWSUIT_DETAIL_BY_ID } from "../../../API/apiUrls";

const InputPDF = ({ record }) => {
  const [form] = Form.useForm(); //กำหนด form ก่อนใช้งาน
  //console.log("3333//", aaaa);
  const [triggerPDF, setTriggerPDF] = useState(false);
  const conponentPDF = useRef();
  const [dataInputA, setDataInputA] = useState(false);
  //รับข้อมูลส่งฟ้อง
  const [dataLawsuit, setDataLawsuit] = useState(false);


  //const dataInputCompany = optionsCompanyList[record.COMPANY_ID-1];
  const dataInputCompany = record && record.COMPANY_ID ? optionsCompanyList[record.COMPANY_ID - 1] : null;
  //const dataInputLoan = optionsLone[record.LOAN_TYPE_ID-1];
  const dataInputLoan = record && record.LOAN_TYPE_ID ? optionsLone[record.LOAN_TYPE_ID - 1] : null;
  const dataInputLoanID = record?.LOAN_TYPE_ID ;
  //console.log("dataInputLoan",dataInputLoan);

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "คำส่งฟ้อง",
  });

  const onFinish = (values) => {
    setTriggerPDF(true); // Trigger PDF generation
    //console.log("Success:", values);
    const dataValues = {
      ...values,
      dataInputLoanID: dataInputLoanID, // หรือชื่อ key ที่คุณต้องการ
    };

    setDataInputA(dataValues);
  };


  //ดึงข้อมูล
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(baseUrl + GET_LAWSUIT_DETAIL_BY_ID + record.LAWSUIT_ID, {
          headers: HEADERS_EXPORT,
        });
        const dataB = res.data;
        //console.log("res2468", dataB);
        setDataLawsuit(dataB);
      } catch (err) {
        console.log(err.message);
      }
    };
    if(record){
      fetchData();
    }
  },[record]);

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
        initialValues={{
          inputLoan: dataInputLoan.label,
          inputCompany: dataInputCompany.label,
          remember: true,
        }}
      >
        <Row>
          <Col span={12}>
            <Form.Item label="บริษัท" name="inputCompany">
              <Input disabled={true} />
            </Form.Item>
          </Col>
          <Col span={11} style={{ marginLeft: "5px" }}>
            <Form.Item label="ประเภทสัญญา" name="inputLoan">
              <Input disabled={true} />
            </Form.Item>
          </Col>
          <Col span={23} style={{ marginLeft: "5px" }}>
            <Form.Item
              label="เลือกประเภทผู้กู้"
              name="selectBorrower"
              rules={[{ required: true, message: "เลือกประเภทผู้กู้!" }]}
            >
              <Select
                showSearch
                placeholder="กรอก หรือเลือกเพื่อค้นหา"
                optionFilterProp="label"
                options={dataBorrower}
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
        {record ? <PrintPage record={record} dataInputA={dataInputA} dataLawsuit={dataLawsuit} /> : null}
      </div>
    </>
  );
};

export default InputPDF;
