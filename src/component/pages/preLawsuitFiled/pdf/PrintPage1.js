//1
import React from "react";
import { Row, Col } from "antd";
//import moment from "moment";
import "./css/mainPage.css";
//import moment from "moment";
//import THBText from "thai-baht-text";
import pic1 from './pic/pic1.jpg'
function PrintPage1({ record, dataInputA }) {
  console.log("PrintPage1", dataInputA, record);

  return (
    <div>
      <div className="divA4Cut">

            <Row>
            <Col span={11} className="colLeft">(แบบ ผบ.๑) <br/>คำฟ้องคดีผู้บริโภค</Col>
            <Col span={13} className="colCenter"><img src={pic1} alt="" style={{height: '80px',display: 'flex', justifyContent: 'center'}}/></Col>
            
            <Col span={20} className="colRight">คดีหมายเลขดำที่ </Col>
            <Col span={4} className="colRight">คดีหมายเลขดำที่ </Col>
            
            
              <Col span={24} className="colLeft">{record.CONTNO}</Col>

            </Row>
      
      </div>
    </div>
  );
}
export default PrintPage1;
