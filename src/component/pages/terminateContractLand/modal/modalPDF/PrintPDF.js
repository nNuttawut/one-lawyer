// แบบข้อมูล 1-0003661
// 1-0000790 = 5 คนค้ำ
// 1-0005530 = 2 ที่อยู่
//1-0005594 = 2 ที่อยู่ 2 คนค้ำ 2 ที่อยู่
import React from "react";
import { Row, Col } from "antd";
import "./css/mainPage.css";
import SubDateThai from "./SubDateThai";
import THBText from "thai-baht-text";

function PrintPDF({ dataCus, arrData, nameLawyerA1, uniqueCusName, dateQuery }) {
  console.log("PrintPDF/dataCus", dataCus);
  //console.log("PrintPDF/arrData", arrData);
  //console.log("PrintPDF/nameLawyerA1", nameLawyerA1);
  //console.log("PrintPDF/uniqueCusName", uniqueCusName);
  //console.log("PrintPDF/dateQuery", dateQuery);

  //สับวันดื่อนปี ปี เดือน วัน ไทย
  const { formattedDateYMD } = SubDateThai();
  const dataCusSDate = dataCus[0]?.NAME ? formattedDateYMD(dataCus[0]?.LOAN.SDATE) : ''; 
  const dataSDatePrint = dateQuery? formattedDateYMD(dateQuery) : ''; 
  
  //นับจำนวน  เช็คค่าว่างคนค้ำประกัน
  // const dataCusName0 = dataCus[0]?.NAME ? `${dataCus[0].NAME} (ผู้กู้/ผู้จำนอง) ` : ''; 
  // const dataCusName1 = dataCus[1]?.NAME ? `${dataCus[1].NAME} (คนค้ำประกัน 1) ` : ''; 
  // const dataCusName2 = dataCus[2]?.NAME ? `${dataCus[2].NAME} (คนค้ำประกัน 2) ` : ''; 
  // const dataCusName3 = dataCus[3]?.NAME ? `${dataCus[3].NAME} (คนค้ำประกัน 3) ` : ''; 
  // const dataCusName4 = dataCus[4]?.NAME ? `${dataCus[4].NAME} (คนค้ำประกัน 4) ` : ''; 
  // const dataCusName5 = dataCus[5]?.NAME ? `${dataCus[5].NAME} (คนค้ำประกัน 5) ` : ''; 

  //แปลงตัวเลขอารบิก เป็นตัวไทย
  const convertToThaiNumerals = (text) => {
    const str = String(text); // ✅ แปลงให้เป็น string ชัวร์ๆ
    return str.replace(/[0-9]/g, (digit) => {
      const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
      return thaiDigits[Number(digit)];
    });
  };
  const dataCusCount = dataCus[0]?.NAME ? convertToThaiNumerals(dataCus?.length) : ''; 
  //รวมยอดเงิน
  const sumAAA = arrData?.tonkong + arrData?.dok;
 


  return (
    <div>
      {dataCus && dataCus.length > 0
        ? dataCus.map((dataCus, index) => (
      <div className="divA4Cut" key={index}>
            <Row>
            <Col span={24} className="colCenter" style={{visibility: 'hidden'}}>a1</Col>
            <Col span={2} className="colCenter"></Col>
            <Col span={3} className="colLeft">กรุณาส่ง</Col>
            <Col span={19} className="colLeft">{dataCus?.NAME} {dataCus?.cusType === 0 ? '(ผู้กู้/ผู้จำนอง)' : '(คนค้ำประกัน)'} ({dataCus?.CONTNO}) </Col>
           
            <Col span={5} className="colCenter"></Col>
            <Col span={19} className="colLeft">เลขที่ {dataCus?.ADDRESS.ADDR1}&nbsp;&nbsp; 
            {dataCus?.ADDRESS.PROVDES === 'กรุงเทพมหานคร' ? 'แขวง':'ตำบล'}{dataCus?.ADDRESS.TUMB}</Col>

            <Col span={5} className="colCenter"></Col>
            <Col span={19} className="colLeft">{dataCus?.ADDRESS.PROVDES === 'กรุงเทพมหานคร' ? 'เขต':'อำเภอ'}{dataCus[0]?.ADDRESS.AUMPDES}&nbsp;&nbsp; 
            จังหวัด{dataCus?.ADDRESS.PROVDES}</Col>
            
            <Col span={5} className="colCenter"></Col>
            <Col span={19} className="colLeft">{dataCus?.ADDRESS.ZIP}</Col>

            <Col span={24} className="colCenter" style={{visibility: 'hidden'}}>a1</Col>
            <Col span={24} className="colCenter" style={{visibility: 'hidden'}}>a1</Col>
            <Col span={24} className="colCenter" style={{visibility: 'hidden'}}>a1</Col>
            <Col span={24} className="colCenter" style={{visibility: 'hidden'}}>a1</Col>

            <Col span={2} className="colLeft">เรื่อง</Col>
            <Col span={12} className="colLeft">ให้ชำระหนี้ / ไถ่ถอนจำนอง</Col>
            <Col span={10} className="colLeft">วันที่ {dataSDatePrint}</Col>

            <Col span={2} className="colLeft">เรียน</Col>
            <Col span={11} className="colLeft">{uniqueCusName[0]}</Col>
            <Col span={11} className="colLeft">{uniqueCusName[1]}</Col>

            <Col span={2} className="colLeft"></Col>
            <Col span={11} className="colLeft">{uniqueCusName[2]}</Col>
            <Col span={11} className="colLeft">{uniqueCusName[3]}</Col>
            
            <Col span={2} className="colLeft"></Col>
            <Col span={11} className="colLeft">{uniqueCusName[4]}</Col>
            <Col span={11} className="colLeft">{uniqueCusName[5]}</Col>
            

            <Col span={24} className="colLeft">
            <span style={{display: 'inline-block', width: '4ch'}}></span>ตามที่ท่านได้กู้ยืมเงินและทำสัญญาจำนองที่ดินโฉนดเลขที่ {dataCus?.MORTGAGE.STRNO}&nbsp; 
            เลขที่ดิน {dataCus?.MORTGAGE.MILERT}&nbsp; 
            ตำบล{dataCus?.MORTGAGE.BAAB}&nbsp; 
            อำเภอ{dataCus?.MORTGAGE.MODEL}&nbsp; 
            จังหวัด{dataCus?.MORTGAGE.TYPE}&nbsp; 
            ไปจาก บริษัท วัน มันนี่ จำกัด ผู้ให้กู้จำนวน {dataCus?.LOAN.NCSHPRC != null ? new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2,}).format(dataCus?.LOAN.NCSHPRC): '-'} บาท&nbsp; 
            {THBText(dataCus?.LOAN.NCSHPRC)}&nbsp; 
            ท่านได้รับเงินจำนวนดังกล่าวครบถ้วนแล้ว เมื่อวันที่ {dataCusSDate}&nbsp;
            และให้ถือสัญญาจำนองเป็นหลักฐานใน การกู้เงินด้วยนั้น โดยการกู้เงินดังกล่าวได้มีผู้ค้ำประกันยินยอมรับผิดต่อผู้ให้กู้
            โดยหากผู้กู้ไม่สามารถชำระหนี้ได้ไม่ว่าด้วยเหตุใด ๆ ผู้ค้ำประกันยินยอมชำระหนี้ดังกล่าวแทนจนครบจำนวน<br/> 

            <span style={{display: 'inline-block', width: '4ch'}}></span>บัดนี้ปรากฏว่าท่านทั้งสองได้ผิดนัดผิดสัญญา ไม่ชำระหนี้ดังกล่าวตามที่ได้ตกลงไว้ผู้ให้กู้ได้ติดตาม
            ทวงถามให้ท่านชำระหนี้แล้วหลายครั้งหลายหน แต่ท่านยังคงเพิกเฉย การกระทำดังกล่าวจึงมีความผิดตามกฎหมาย<br/>

            <span style={{display: 'inline-block', width: '4ch'}}></span>โดยหนังสือฉบับนี้ ข้าพเจ้าในฐานะทนายความผู้รับมอบอำนาจจากผู้ให้กู้
              จึงขอบอกกล่าวให้ท่านทั้ง {dataCusCount}&nbsp; 
              นำต้นเงินที่ค้างชำระจำนวน {arrData?.tonkong != null ? new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2,}).format(arrData.tonkong): '-'} บาท
              พร้อมดอกเบี้ยค้างชำระจำนวน {arrData?.tonkong != null ? new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2,}).format(arrData.dok): '-'} บาท
              รวมเป็นเงินทั้งสิ้นจำนวน {sumAAA != null ? new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2,}).format(sumAAA): '-'} บาท
              ไปชำระหนี้และไถ่ถอนจำนอง ให้เสร็จสิ้นภายใน 60 วัน นับตั้งแต่วันที่ท่านได้รับหนังสือฉบับนี้
              หากล่วงกำหนดเวลาดังกล่าว ข้าพเจ้ามีความจำเป็นจะต้องดำเนินคดีกับท่านตามกฎหมายต่อไป<br/>
            </Col>

            <Col span={24} className="colCenter" style={{visibility: 'hidden'}}>a1</Col>
            <Col span={24} className="colLeft"><span style={{display: 'inline-block', width: '4ch'}}></span>อนึ่ง เพื่อการตกลงกันโดยสันติวิธี ขอให้ท่านติดต่อผู้ให้กู้โดยด่วน</Col>
            <Col span={24} className="colCenter" style={{visibility: 'hidden'}}>a1</Col>

            <Col span={6} className="colCenter"></Col>
            <Col span={18} className="colCenter">ขอแสดงความนับถือ</Col>
            <Col span={6} className="colCenter"></Col>
            <Col span={18} className="colCenter" style={{visibility: 'hidden'}}>a1</Col>
            <Col span={6} className="colCenter"></Col>
            <Col span={18} className="colCenter" style={{visibility: 'hidden'}}>a1</Col>
            <Col span={6} className="colCenter"></Col>
            <Col span={18} className="colCenter">({nameLawyerA1?.fNmae} {nameLawyerA1?.lName})</Col>
            <Col span={6} className="colCenter"></Col>
            <Col span={18} className="colCenter">ทนายความผู้รับมอบอำนาจ</Col>
            <Col span={6} className="colCenter"></Col>
            <Col span={18} className="colCenter">{nameLawyerA1?.telp}</Col>
          </Row>
      
      </div>
      ))
      : []}
    </div>
  );
}
export default PrintPDF;
