//สัญญา 2 -เช่าซื้อ-บุคคลธรรมดา 
// แบบข้อมูล 1-0004392
import React from "react";
import { Row, Col } from "antd";
import "./css/mainPage.css";
//import moment from "moment";
//import THBText from "thai-baht-text";
import pic1 from './pic/pic1.jpg';
import pic2 from '../../../../assets/images/bracket.png';
import arabicToThai from "../../../../hook/arabicToThai";
import SubDateThai from "./editData/SubDateThai";

function PrintPage4({ record, dataInputA, dataLawsuit }) {
   console.log("PrintPage4/record", record);
   console.log("PrintPage4/dataInputA", dataInputA);
   console.log("PrintPage4/dataLawsuit", dataLawsuit);

   //แปลงตัวไทย เป็นตัวเลขอารบิก
  const [convertToThaiNumerals] = arabicToThai();
  //สับวันดื่อนปี ปี เดือน วัน ไทย
  const { formattedDateYMD, formattedDateY, formattedDateM, formattedDateD } = SubDateThai();

   let caseType1,caseType2 = null; //ประเภทนิติบุคคล
   const blackCaseNumber = dataLawsuit?.black_case_number     //คดีหมายเลขดำ

  if(dataInputA?.selectBorrower === "บุคคลธรรมดา"){
    caseType1 = "(แบบ ผบ.๑)";
    caseType2 = "คำฟ้องคดีผู้บริโภค";
  }else{
    caseType1 = "๔";
    caseType2 = "คำฟ้อง";
  }
   
  const provincialCourt = dataLawsuit?.provincial_court; //ศาสจังหวัดไหน
  const nameCompany = dataInputA?.inputCompany; //ชื่อบริษัท
  const subject1 = dataLawsuit?.subject; //เรื่องหัวเรื่องฟ้อง
  const nameLawyer = dataLawsuit?.FNAME +" "+ dataLawsuit?.LNAME //ชื่อทนาย
  const dateOfPlaint = dataLawsuit?.date_of_plaint     //วันส่งฟ้อง


  


  

  return (
    <div>
      <div className="divA4Cut">
            <Row>
            {/* <Col span={24} className="colCenter">- 1 -</Col> */}
            <Col span={11} className="colLeft">{caseType1}<br/>{caseType2}</Col>
            <Col span={13} className="colCenter"><img src={pic1} alt="" style={{height: '80px',display: 'flex', justifyContent: 'center'}}/></Col>

            <Col span={18} className="colRight">คดีหมายเลขดำที่ </Col>
            <Col span={6} className="text2">{blackCaseNumber ? convertToThaiNumerals(blackCaseNumber) : '—'}</Col>

            <Col span={11} className="colLeft"></Col>
            <Col span={2} className="colRight">ศาล</Col>
            <Col span={11} className="text2">{provincialCourt}</Col>

            <Col span={8} className="colLeft"></Col>
            <Col span={2} className="colRight">วันที่</Col>
            <Col span={2} className="text2">{dateOfPlaint ? convertToThaiNumerals(formattedDateD(dateOfPlaint)) : '—'}</Col>
            <Col span={2} className="colRight">เดือน</Col>
            <Col span={4} className="text2">{dateOfPlaint ? formattedDateM(dateOfPlaint) : '—'}</Col>
            <Col span={3} className="colRight">พุทธศักราช</Col>
            <Col span={3} className="text2">{dateOfPlaint ? convertToThaiNumerals(formattedDateY(dateOfPlaint)) : '—'}</Col>

            <Col span={15} className="colRight">ความ</Col>
            <Col span={8} className="text2"></Col>

            <Col span={3} className="colRight"></Col>
            <Col span={19} className="text2Left">{nameCompany} โดย{nameLawyer} ผู้รับมอบอำนาจ</Col>
            <Col span={2} className="colRight">ระหว่าง</Col>

            <Col span={2} className="colLeft">โจทก์</Col>
            <Col span={1} className="colRight"><img src={pic2} alt="" style={{height: '80px'}}/></Col>
            <Col span={21} className="text2Left">
             จำเลย</Col>
         
            <Col span={2} className="colLeft">เรื่อง</Col>
            <Col span={20} className="text2Center">{subject1}</Col>
            <Col span={2} className="colRight"></Col>

            <Col span={4} className="colLeft">จำนวนทุนทรัพย์</Col>
            <Col span={9} className="text2Center"></Col>
            <Col span={1} className="colRight">บาท</Col>
            <Col span={8} className="text2Center">-</Col>
            <Col span={2} className="colRight">สตางค์</Col>

            <Col span={2} className="colLeft"></Col>
            <Col span={2} className="colRight">ข้าพเจ้า</Col>
            <Col span={18} className="text2Center">{nameCompany}</Col>
            <Col span={2} className="colRight">โจทก์</Col>

            <Col span={2} className="colLeft">เชื้อชาติ</Col>
            <Col span={4} className="text2Center">-</Col>
            <Col span={2} className="colRight">สัญชาติ</Col>
            <Col span={4} className="text2Center">ไทย</Col>
            <Col span={2} className="colRight">อาชีพ</Col>
            <Col span={4} className="text2Center">ค้าขาย</Col>
            <Col span={2} className="colRight">อายุ</Col>
            <Col span={2} className="text2Center">-</Col>
            <Col span={2} className="colLeft">ปี</Col>


            <Col span={7} className="colLeft">เลขที่บัตรประจำตัวประชาชน</Col>
            <Col span={7} className="text2Center">-</Col>
            <Col span={5} className="colRight">อยู่บ้านเลขที่</Col>
            <Col span={5} className="text2Center"> {convertToThaiNumerals('1/24')} </Col>

            <Col span={2} className="colLeft">หมู่ที่</Col>
            <Col span={2} className="text2Center">-</Col>
            <Col span={2} className="colRight">ถนน</Col>
            <Col span={4} className="text2Center"></Col>
            <Col span={3} className="colRight">ตรอก/ซอย</Col>
            <Col span={3} className="text2Center"></Col>
            <Col span={3} className="colRight">ใกล้เคียง</Col>
            <Col span={3} className="text2Center"></Col>

            <Col span={4} className="colLeft">ตำบล/แขวง</Col>
            <Col span={4} className="text2Center"></Col>
            <Col span={4} className="colRight">อำเภอ/เขต</Col>
            <Col span={4} className="text2Center"></Col>
            <Col span={4} className="colRight">จังหวัด</Col>
            <Col span={4} className="text2Center"></Col>

            <Col span={3} className="colLeft">โทรศัพท์</Col>
            <Col span={4} className="text2Center"></Col>
            <Col span={3} className="colRight">โทรสาร</Col>
            <Col span={4} className="text2Center"></Col>
            <Col span={6} className="colRight">จดหมายอิเล็กทรอนิกส์</Col>
            <Col span={4} className="text2Center"></Col>

            <Col span={4} className="colLeft">สถานที่ติดต่อ</Col>
            <Col span={20} className="text2Center"></Col>

            <Col span={3} className="colLeft">โทรศัพท์</Col>
            <Col span={4} className="text2Center"></Col>
            <Col span={3} className="colRight">โทรสาร</Col>
            <Col span={4} className="text2Center"></Col>
            <Col span={6} className="colRight">จดหมายอิเล็กทรอนิกส์</Col>
            <Col span={4} className="text2Center"></Col>

            <Col span={3} className="colLeft">ขอยื่นพ้อง</Col>
            <Col span={21} className="text2Center"></Col>
            <Col span={22} className="text2Center"></Col>
            <Col span={2} className="colLeft">จำเลย</Col>

            <Col span={2} className="colLeft">เชื้อชาติ</Col>
            <Col span={4} className="text2Center"></Col>
            <Col span={2} className="colRight">สัญชาติ</Col>
            <Col span={4} className="text2Center"></Col>
            <Col span={3} className="colRight">อาชีพ</Col>
            <Col span={3} className="text2Center"></Col>
            <Col span={3} className="colRight">อายุ</Col>
            <Col span={2} className="text2Center"></Col>
            <Col span={1} className="colRight">ปี</Col>

            <Col span={3} className="colLeft">อยู่บ้านเลขที่</Col>
            <Col span={4} className="text2Center"></Col>
            <Col span={2} className="colRight">หมู่ที่</Col>
            <Col span={3} className="text2Center"></Col>
            <Col span={3} className="colRight">ถนน</Col>
            <Col span={3} className="text2Center"></Col>
            <Col span={3} className="colRight">ตรอก/ซอย</Col>
            <Col span={3} className="text2Center"></Col>

            <Col span={3} className="colLeft">ใกล้เคียง</Col>
            <Col span={2} className="text2Center"></Col>
            <Col span={3} className="colRight">ตำบล/แขวง</Col>
            <Col span={6} className="text2Center"></Col>
            <Col span={3} className="colRight">อำเภอ/เขต</Col>
            <Col span={7} className="text2Center"></Col>

            <Col span={2} className="colLeft">จังหวัด</Col>
            <Col span={16} className="text2Center"></Col>
            <Col span={2} className="colRight">โทรศัพท์</Col>
            <Col span={1} className="text2Center">-</Col>
            <Col span={2} className="colRight">โทรสาร</Col>
            <Col span={1} className="text2Center">-</Col>


            <Col span={6} className="colLeft">จดหมายอิเล็กทรอนิกส์</Col>
            <Col span={7} className="text2Center">-</Col>
            <Col span={8} className="colRight">มีข้อความตามที่จะกล่าวต่อไปนี้</Col>
            <Col span={3} className="colRight"></Col>

              {/* <Col span={24} className="colLeft">{record.CONTNO}</Col> */}
            </Row>
      
      </div>
      <div className="divA4Cut2">
            <Row>
            <Col span={24} className="colCenter">- 2 -</Col>
            <br/><br/>
            <Col span={24} className="text2LeftHeight"><span className="span1a2cm">a1</span>ข้อ ๑.
            โจทก์เป็นนิติบุคคลประเภทบริษัทจำกัด มีวัตถุประสงค์ในการ ซื้อขาย เช่าซื้อ ให้เช่า ซื้อรถยนต์</Col>
            <Col span={24} className="text2LeftHeight">ทุกชนิดเดิมโจทก์ใช้ชื่อว่า บริษัท ซีเอแอล ๒๐๐๙ จำกัด ต่อมาเมื่อวันที่ ๒๐ ตุลาคม ๒๕๖๕ ได้จดทะเบียน</Col>            
            <Col span={24} className="text2LeftHeight">เอกสารเปลี่ยนชื่อเป็น บริษัท วัน ลิสซิ่ง จำกัด ปรากฏตามสำเนาหนังสือรับรองและ วัตถุประสงค์ </Col>
            <Col span={24} className="text2LeftHeight">ท้ายคำฟ้องหมายเลข ๑</Col>

            <Col span={24} className="text2LeftHeight"><span className="span2a4cm">a2</span>
            ในการฟ้องและดำเนินคดีนี้ โจทก์มอบอำนาจให้ นายยุทธศาสตร์   พิมพิลา เป็นผู้มีอำนาจ</Col>
            <Col span={24} className="text2LeftHeight">ฟ้องและดำเนินคดี กับจำเลยทั้งสามแทนโจทก์ได้ ปรากฏตามสำเนาหนังสือมอบอำนาจเอกสาร</Col>
            <Col span={24} className="text2LeftHeight">ท้ายคำฟ้องหมายเลข ๒</Col>
            
            <Col span={24} className="text2LeftHeight"><span className="span1a2cm ">a1</span>ข้อ ๒.
            เมื่อวันที่ ๑๑ พฤษภาคม ๒๕๖๒ จำเลยที่ ๑ ได้ทำสัญญาเช่าซื้อรถยนต์ยี่ห้อเชฟโรเลต</Col> 
            <Col span={24} className="text2LeftHeight">จากโจทก์ไป ๑ คัน ในสภาพเรียบร้อย ใช้การได้ดี คันหมายเลขเครื่อง เอ๙อีจี๑๒๒๗๓๑๐๔๒</Col>
            <Col span={24} className="text2LeftHeight">หมายเลขทะเบียน ฒศ-๙๐๔๒ กรุงเทพมหานคร ในราคาเช่าซื้อ ๓๙๔,๙๒๐ บาท โดยจำเลยที่ ๑ </Col>
            <Col span={24} className="text2LeftHeight">สัญญาจะผ่อนชำระค่างวดเป็นรายงวดเดือน ๆ ละ ๕,๔๘๕ บาท ให้แล้วเสร็จภายใน ๗๒ งวด เริ่มงวด</Col>
            <Col span={24} className="text2LeftHeight">แรกในวันที่ ๑๙ มิถุนายน ๒๕๖๒ งวดต่อไปทุกวันที่ ๑๙ ของเดือนถัดไปจนกว่าจะชำระเสร็จ </Col>
            <Col span={24} className="text2LeftHeight">โดยมีเงื่อนไขว่า จำเลยที่ ๑ จะได้กรรมสิทธิ์เมื่อชำระค่างวดครบถ้วน และถือเอากำหนดเวลาการชำระ</Col>
            <Col span={24} className="text2LeftHeight">ค่างวดเป็นสาระสำคัญของสัญญา หากผิดนัดชำระค่างวด ๓ งวดติดต่อกัน และโจทก์ได้มีหนังสือ</Col>
            <Col span={24} className="text2LeftHeight">บอกเลิกสัญญาไปยังจำเลยที่ ๑ แล้ว จำเลยที่ ๑ ไม่ชำระค่างวดที่ค้างทั้งหมดภายใน ๓๐ วัน นับแต่</Col>
            <Col span={24} className="text2LeftHeight">วันที่ได้รับหนังสือบอกกล่าวให้ถือว่าให้ถือว่าสัญญาเลิกกันโดยทันที โดยยินยอมให้โจทก์ริบเงินที่ได้ชำระ</Col>
            <Col span={24} className="text2LeftHeight">แล้วทั้งสิ้น และจำเลยที่ ๑ สัญญาจะคืนรถในสภาพเรียบร้อยใช้การได้ดี หรือให้โจทก์กลับเข้าครอบครองรถ</Col> 
            </Row>
      
      </div>
      <div className="divA4Cut2">
            <Row>
            <Col span={24} className="colCenter">- 3 -</Col>
            <br/><br/>
            <Col span={24} className="text2LeftHeight">หากคืนไม่ได้จะชำระราคาแทน พร้อมดอกเบี้ยในอัตราสำหรับลูกหนี้ชั้นดีรายย่อยของธนาคารกรุงไทย</Col>  
            <Col span={24} className="text2LeftHeight">จำกัด (มหาชน) บวกสิบนับแต่วันผิดนัดเป็นต้นไป จำเลยที่ ๑ ได้รับรถในสภาพเรียบร้อยใช้การได้ดีแล้ว</Col>
            <Col span={24} className="text2LeftHeight">ในวันทำสัญญาปรากฏตามสำเนาสัญญาเช่าซื้อ เอกสารท้ายคำฟ้องหมายเลข ๓</Col>
            

            <Col span={24} className="text2LeftHeight"><span className="span2a4cm">a1</span>
            ในการทำสัญญาเช่าซื้อของจำเลยที่ ๑ จำเลยที่ ๒ และที่ ๓ ได้ยินยอมตนเข้าเป็นผู้ค้ำประกัน</Col>
            <Col span={24} className="text2LeftHeight">โดยยอมรับผิดหากจำเลยที่ ๑ ผิดสัญญาและไม่สามารถชำระหนี้ได้ไม่ว่าด้วยเหตุใด ๆ จำเลยที่ ๒ และที่ ๓</Col>
            <Col span={24} className="text2LeftHeight">จะชำระหนี้แทนจนครบจำนวน ปรากฏตามสำเนาสัญญาค้ำประกันเอกสารท้ายคำฟ้องหมายเลข ๔, ๕</Col>

            <Col span={24} className="text2LeftHeight"><span className="span1a2cm">a1</span>ข้อ ๓.
            เมื่อรับรถยนต์ไปแล้ว จำเลยที่ ๑ ได้ปฏิบัติผิดสัญญา โดยได้ชำระค่างวดให้แก่โจทก์เพียง</Col>
            <Col span={24} className="text2LeftHeight">๓๔ งวดเศษ เป็นเงินจำนวน ๑๘๙,๓๖๐ บาทแล้วได้ผิดนัดชำระค่างวดตั้งแต่งวดที่ ๓๕ ซึ่งถึงกำหนด</Col>
            <Col span={24} className="text2LeftHeight">ชำระในวันที่ ๑๙ เมษายน ๒๕๖๕ ติดต่อกัน ๓ งวดจนถึงปัจจุบัน โดยจำเลยที่ ๑ ยังค้างชำระค่างวด</Col>
            <Col span={24} className="text2LeftHeight">รถยนต์ ทั้งสิ้นเป็นเงินจำนวน ๒๐๕,๕๖๐ บาท ปรากฏตามการ์ดลูกหนี้และการรับชำระ เอกสารท้าย</Col>
            <Col span={24} className="text2LeftHeight">คำฟ้องหมายเลข ๖ </Col>

            <Col span={24} className="text2LeftHeight"><span className="span2a4cm">a1</span>
            การที่จำเลยที่ ๑ ผิดนัดชำระค่างวด ๓ งวดติดต่อกัน ถือว่าจำเลยที่ ๑ เป็นฝ่ายผิดสัญญา</Col> 
            <Col span={24} className="text2LeftHeight">จำเลยที่ ๑ มีหน้าที่ส่งรถยนต์คืนโจทก์ โจทก์ได้มีหนังสือบอกกล่าวให้จำเลยทั้งสามชำระหนี้ค่างวด</Col>
            <Col span={24} className="text2LeftHeight">รถยนต์ที่ค้างชำระภายใน ๓๐ วัน จำเลยทั้งสาม ได้รับหนังสือบอกกล่าวโดยชอบแล้วละเลยไม่ปฏิบัติตาม</Col>
            <Col span={24} className="text2LeftHeight">คำบอกกล่าวสัญญาจึงเลิกกันตามสัญญา โดยโจทก์ได้จัดส่งคำบอกกล่าวเลิกสัญญาไปตามที่อยู่ที่จำเลย</Col>
            <Col span={24} className="text2LeftHeight">ทั้งสามให้ไว้ในขณะทำสัญญาข้อ ๑๙ แล้ว จึงถือว่า สัญญาเลิกกันตามสัญญาปรากฏตามสำเนาหนังสือ</Col>
            <Col span={24} className="text2LeftHeight">บอกกล่าวเลิกสัญญาให้ชำระหนี้ จดหมายส่งคืนผู้ฝากส่งและไปรษณีย์ตอบ รับ เอกสารท้ายคำฟ้อง ๗ - ๙ </Col>
            </Row>
      
      </div>
      <div className="divA4Cut2">
            <Row>
            <Col span={24} className="colCenter">- 4 -</Col>
            <br/><br/>
            <Col span={24} className="text2LeftHeight"><span className="span2a4cm">a1</span>
            นับตั้งแต่จำเลยที่ ๑ ผิดนัดชำระค่างวดตั้งแต่งวดที่ ๓๕ ซึ่งถึงกำหนดชำระในวันที่ </Col> 
            <Col span={24} className="text2LeftHeight">๑๙ เมษายน ๒๕๖๕ โจทก์ได้ให้ เจ้าพนักงานออกติดตามทวงถามให้จำเลยทั้งสามชำระหนี้แล้วหลายหน</Col>
            <Col span={24} className="text2LeftHeight">เสียค่าใช้จ่ายไม่น้อยกว่า ๕,๐๐๐ บาท จำเลยทั้งสามต้องรับผิดต่อโจทก์ด้วย </Col>

            <Col span={24} className="text2LeftHeight"><span className="span2a4cm">a1</span>
            นอกจากนี้จำเลยทั้งสามต้องร่วมกันรับผิดชดใช้ค่าขาดประโยชน์แก่โจทก์กล่าวคือหาก</Col> 
            <Col span={24} className="text2LeftHeight">รถยนต์คันที่เช่าซื้ออยู่ใน ความครอบครองของโจทก์ โจทก์สามารถนำรถยนต์ออกให้บุคคลภายนอกเช่าได้</Col>
            <Col span={24} className="text2LeftHeight">ในอัตราเดือนละไม่น้อยกว่า ๕,๐๐๐ บาท นับแต่งวดที่ผิดนัดคืองวดที่ ๓๕ ซึ่งถึงกำหนดชำระวันที่ </Col>
            <Col span={24} className="text2LeftHeight">๑๙ เมษายน ๒๕๖๕ จนถึงวันฟ้องเป็นเวลา ๓๒ เดือน คิดเป็นเงินจำนวน ๑๖๐,๐๐๐ บาท</Col>
            <Col span={24} className="text2LeftHeight">แต่โจทก์ขอเรียกร้องค่าเสียหายในส่วนนี้ จากจำเลยทั้งสามเป็นเงินจำนวนเพียง ๘๕,๐๐๐ บาท </Col>
            <Col span={24} className="text2LeftHeight">จำเลยทั้งสามต้องรับผิดต่อด้วย</Col>

            <Col span={24} className="text2LeftHeight"><span className="span2a4cm">a1</span>
            ดังนั้น จำเลยทั้งสามมีหนี้ค้างชำระแก่โจทก์โดยการส่งมอบรถยนต์ที่เช่าซื้อคืนแก่โจทก์</Col>  
            <Col span={24} className="text2LeftHeight">ในสภาพเรียบร้อยใช้การได้ดี หากคืนไม่ได้ให้ใช้ราคาแทนเป็นเงินจำนวน ๒๐๕,๕๖๐ บาท</Col>
            <Col span={24} className="text2LeftHeight">พร้อมค่าติดตามทวงถามเป็นเงินจำนวน ๕,๐๐๐ บาท และค่าขาดประโยชน์ เป็นเงินจำนวน ๘๕,๐๐๐ บาท</Col>

            <Col span={24} className="text2LeftHeight">รวมเป็นเงินทั้งสิ้นจำนวน ๒๙๕,๕๖๐ บาท และค่าขาดประโยชน์นับถัดจากวันฟ้องจนกว่าจำเลยทั้งสาม</Col>
            {/* <Col span={24} className="text2LeftHeight"></Col> */}
            <Col span={24} className="text2LeftHeight">จะส่งคืนรถยนต์แก่โจทก์ หรือชำระราคาเสร็จเดือนละ ๕,๐๐๐ บาท พร้อมดอกเบี้ยในอัตราร้อยละ ๑๕ ต่อปี </Col>
            <Col span={24} className="text2LeftHeight">ของต้นเงินจำนวน ๒๙๕,๕๖๐ บาท นับถัดจากวันฟ้องเป็นต้นไปจนกว่าจะชำระหนี้เสร็จแก่โจทก์ </Col>

            <Col span={24} className="text2CenterHeight">โจทก์ไม่มีทางอื่นใดบังคับจำเลยทั้งสามให้ชำระหนี้ได้ จึงขอบารมีศาลเป็นที่พึ่ง  </Col>
            <Col span={24} className="text2CenterHeight">ควรมิควรแล้วแต่จะโปรด </Col>

              {/* <Col span={24} className="colLeft">{record.CONTNO}</Col> */}
            </Row>
      
      </div>
      <div className="divA4Cut2">
            <Row>
            <Col span={24} className="colCenter">- 5 -</Col>
            <br/><br/>
            <Col span={24} className="colLeft">(๕)</Col>
            <Col span={24} className="colLeft">คำขอท้ายคำฟ้องคดีผู้บริโภค</Col>
            <Col span={24} className="colCenter">ขอศาลออกหมายเรียกตัวจำเลยมาพิจารณาพิพากษา และบังคับจำเลยตามคำขอต่อไปนี้</Col>

            <Col span={24} className="text2Left"><span className="span2a4cm">a1</span>๑.
            ให้จำเลยที่ ๑ ส่งมอบรถยนต์ที่เช่าซื้อคืนให้แก่โจทก์ในสภาพเรียบร้อยใช้การได้ดี</Col> 
            <Col span={24} className="text2Left">หากคืนไม่ได้ให้ใช้ราคาแทนเป็นเงินจำนวน ๒๐๕,๕๖๐ บาท </Col>
            
            <Col span={24} className="text2Left"><span className="span2a4cm">a1</span>๒.
            ให้จำเลยที่ ๑ ชำระค่าติดตามทวงถามแก่โจทก์เป็นเงินจำนวน ๕,๐๐๐ บาท ค่าขาด  </Col> 
            <Col span={24} className="text2Left">ประโยชน์นับแต่วันที่ผิดนัดจนถึงวันฟ้องคิดเป็นเงินจำนวน ๘๕,๐๐๐ บาท และค่าขาดประโยชน์อีก </Col>
            <Col span={24} className="text2Left">เดือนละ ๕,๐๐๐ บาท นับถัดจากวันฟ้องจนกว่าจะชำระเสร็จแก่โจทก์ </Col>

            <Col span={24} className="text2Left"><span className="span2a4cm">a1</span>๓.
            ให้จำเลยที่ ๑ ชำระดอกเบี้ยในอัตราร้อยละ ๑๕ ต่อปี จากต้นเงินจำนวน ๒๙๕,๕๖๐ บาท </Col>
            <Col span={24} className="text2Left">นับถัดจากวันฟ้อง จนกว่าจะชำระเสร็จสิ้นแก่โจทก์</Col>

            <Col span={24} className="text2Left"><span className="span2a4cm">a1</span>๔.
            หากจำเลยที่ ๑ ไม่สามารถชำระหนี้ให้แก่โจทก์ได้ไม่ว่ากรณีใด ๆ ขอให้ศาลมีคำพิพากษา</Col> 
            <Col span={24} className="text2Left">ให้จำเลยที่ ๒ และที่ ๓ ชำระหนี้แทนจนครบจำนวน</Col>

            <Col span={24} className="text2Left"><span className="span2a4cm">a1</span>๕.
            ให้จำเลยทั้งสามร่วมกันหรือแทนกัน ชำระค่าฤชาธรรมเนียมและค่าทนายความแทน</Col>
            <Col span={24} className="text2Left">โจทก์ในอัตราอย่างสูง</Col>
            
            <Col span={24} className="colLeft"><span className="span2a4cm">a1</span>
            ข้าพเจ้าได้ยื่นสำเนาคำฟ้องโดยข้อความถูกต้องเป็นอย่างเดียวกัน มาด้วย สาม ฉบับ</Col>
            <Col span={24} className="colLeft">และรอฟังคำสั่งอยู่ ถ้าไม่รอให้ถือว่าทราบแล้ว</Col>

            <Col span={13} className="colRight"></Col>
            <Col span={10} className="text2Left">บริษัท วัน ลิสซิ่ง จำกัด ฯ</Col>
            <Col span={1} className="colRight">โจทก์</Col>

            <Col span={18} className="colRight"></Col>
            <Col span={6} className="text2Left">นายยุทธศาสตร์     พิมพิลา</Col>

            <Col span={6} className="colRight"></Col>
            <Col span={2} className="colRight">ข้าพเจ้า</Col>
            <Col span={10} className="text2Left"></Col>
            <Col span={6} className="colRight">เจ้าพนักงานคดี/ผู้บันทึก</Col>

            <Col span={18} className="colRight"></Col>
            <Col span={6} className="text2Left">-</Col>

            <Col span={4} className="colRight"></Col>
            <Col span={20} className="colRight">ข้าพเจ้านายยุทธศาสตร์ พิมพิลา ทนายความใบอนุญาติที่ ๒๗๗๐/๒๕๔๓ ผู้เรียง/พิมพ์</Col>

            <Col span={18} className="colRight"></Col>
            <Col span={6} className="text2Left">นายยุทธศาสตร์ พิมพิลา</Col>

            <Col span={18} className="colRight"></Col>
            <Col span={6} className="colRight">๐๘๐ - ๔๗๗๖๓๔๖</Col>

              {/* <Col span={24} className="colLeft">{record.CONTNO}</Col> */}

            </Row>
      
      </div>
    </div>
  );
}
export default PrintPage4;
