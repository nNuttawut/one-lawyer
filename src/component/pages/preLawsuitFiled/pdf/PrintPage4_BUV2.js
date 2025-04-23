//สัญญา 2 -เช่าซื้อ-บุคคลธรรมดา
import React from "react";
import { Row, Col } from "antd";
//import moment from "moment";
import "./css/mainPage.css";
//import moment from "moment";
//import THBText from "thai-baht-text";
import pic1 from './pic/pic1.jpg';
import pic2 from '../../../../assets/images/bracket.png';
function PrintPage4({ record, dataInputA }) {
  console.log("PrintPage1", dataInputA, record);

  return (
    <div>
      <div className="divA4Cut">
            <Row>
            {/* <Col span={24} className="colCenter">- 1 -</Col> */}
            <Col span={11} className="colLeft">(แบบ ผบ.๑) <br/>คำฟ้องคดีผู้บริโภค</Col>
            <Col span={13} className="colCenter"><img src={pic1} alt="" style={{height: '80px',display: 'flex', justifyContent: 'center'}}/></Col>

            <Col span={20} className="colRight">คดีหมายเลขดำที่ </Col>
            <Col span={4} className="text2">ผบE๙๙๔/๒๕๖๘</Col>

            <Col span={11} className="colLeft"></Col>
            <Col span={2} className="colRight">ศาล</Col>
            <Col span={11} className="text2">แขวงอุดรธานี</Col>

            <Col span={9} className="colLeft"></Col>
            <Col span={2} className="colRight">วันที่</Col>
            <Col span={2} className="text2">๔</Col>
            <Col span={2} className="colRight">เดือน</Col>
            <Col span={4} className="text2">กุมภาพันธ์</Col>
            <Col span={2} className="colRight">พุทธศักราช</Col>
            <Col span={3} className="text2">๒๕๖๘</Col>

            
            <Col span={15} className="colRight">ความ</Col>
            <Col span={8} className="text2">แพ่ง</Col>


            <Col span={3} className="colRight"></Col>
            <Col span={19} className="text3">บริษัท วัน ลิสซิ่ง จำกัด โดยนายยุทธศาสตร์ พิมพิลา ผู้รับมอบอำนาจ</Col>
            <Col span={2} className="colRight">ระหว่าง</Col>


            <Col span={2} className="colLeft">โจทก์</Col>
            <Col span={1} className="colRight"><img src={pic2} alt="" style={{height: '80px'}}/></Col>
            <Col span={19}><span class="spanUnderline">นายสมบัตย์ เทียนกะสิ ที่ ๑, นางสาวนวรัตน์ ษะทิพย์ยูงทอง ที่ ๒,</span><br/>
            <span class="spanUnderline2">จ่าสิบตำรวจตรีหรือนายภัทรพล วิเศษศรี ที่ ๓</span></Col>
            <Col span={2} className="colLeft">จำเลย</Col>
         
            <Col span={2} className="colLeft">เรื่อง</Col>
            <Col span={20} className="text2Left"></Col>
            <Col span={2} className="colRight"></Col>

            <Col span={4} className="colLeft">จำนวนทุนทรัพย์</Col>
            <Col span={9} className="text2Left"></Col>
            <Col span={1} className="colRight">บาท</Col>
            <Col span={8} className="text2Left"></Col>
            <Col span={2} className="colRight">สตางค์</Col>

            <Col span={2} className="colLeft"></Col>
            <Col span={2} className="colRight">ข้าพเจ้า</Col>
            <Col span={18} className="text2Left"></Col>
            <Col span={2} className="colRight">โจทก์</Col>

            <Col span={2} className="colLeft">เชื้อชาติ</Col>
            <Col span={4} className="text2Left"></Col>
            <Col span={2} className="colRight">สัญชาติ</Col>
            <Col span={4} className="text2Left"></Col>
            <Col span={2} className="colRight">อาชีพ</Col>
            <Col span={4} className="text2Left"></Col>
            <Col span={2} className="colRight">อายุ</Col>
            <Col span={2} className="text2Left"></Col>
            <Col span={2} className="colLeft">ปี</Col>


            <Col span={6} className="colLeft">เลขที่บัตรประจำตัวประชาชน</Col>
            <Col span={8} className="text2Left"></Col>
            <Col span={5} className="colRight">อยู่บ้านเลขที่</Col>
            <Col span={5} className="text2Left"></Col>

            <Col span={2} className="colLeft">หมู่ที่</Col>
            <Col span={2} className="text2Left"></Col>
            <Col span={2} className="colRight">ถนน</Col>
            <Col span={4} className="text2Left"></Col>
            <Col span={3} className="colRight">ตรอก/ซอย</Col>
            <Col span={3} className="text2Left"></Col>
            <Col span={3} className="colRight">ใกล้เคียง</Col>
            <Col span={3} className="text2Left"></Col>

            <Col span={4} className="colLeft">ตำบล/แขวง</Col>
            <Col span={4} className="text2Left"></Col>
            <Col span={4} className="colRight">อำเภอ/เขต</Col>
            <Col span={4} className="text2Left"></Col>
            <Col span={4} className="colRight">จังหวัด</Col>
            <Col span={4} className="text2Left"></Col>

            <Col span={3} className="colLeft">โทรศัพท์</Col>
            <Col span={4} className="text2Left"></Col>
            <Col span={3} className="colRight">โทรสาร</Col>
            <Col span={4} className="text2Left"></Col>
            <Col span={6} className="colRight">จดหมายอิเล็กทรอนิกส์</Col>
            <Col span={4} className="text2Left"></Col>

            <Col span={3} className="colLeft">สถานที่ติดต่อ</Col>
            <Col span={21} className="text2Left"></Col>

            <Col span={3} className="colLeft">โทรศัพท์</Col>
            <Col span={4} className="text2Left"></Col>
            <Col span={3} className="colRight">โทรสาร</Col>
            <Col span={4} className="text2Left"></Col>
            <Col span={6} className="colRight">จดหมายอิเล็กทรอนิกส์</Col>
            <Col span={4} className="text2Left"></Col>

            <Col span={3} className="colLeft">ขอยื่นพ้อง</Col>
            <Col span={21} className="text2Left">-</Col>
            <Col span={24} className="text2Left">-</Col>
            <Col span={22} className="text2Left"></Col>
            <Col span={2} className="colLeft">จำเลย</Col>

            <Col span={2} className="colLeft">เชื้อชาติ</Col>
            <Col span={4} className="text2Left"></Col>
            <Col span={2} className="colRight">สัญชาติ</Col>
            <Col span={4} className="text2Left"></Col>
            <Col span={3} className="colRight">อาชีพ</Col>
            <Col span={3} className="text2Left"></Col>
            <Col span={3} className="colRight">อายุ</Col>
            <Col span={2} className="text2Left"></Col>
            <Col span={1} className="colRight">ปี</Col>

            <Col span={3} className="colLeft">อยู่บ้านเลขที่</Col>
            <Col span={4} className="text2Left"></Col>
            <Col span={2} className="colRight">หมู่ที่</Col>
            <Col span={3} className="text2Left"></Col>
            <Col span={3} className="colRight">ถนน</Col>
            <Col span={3} className="text2Left"></Col>
            <Col span={3} className="colRight">ตรอก/ซอย</Col>
            <Col span={3} className="text2Left"></Col>

            <Col span={2} className="colLeft">ใกล้เคียง</Col>
            <Col span={2} className="text2Left"></Col>
            <Col span={3} className="colRight">ตำบล/แขวง</Col>
            <Col span={7} className="text2Left"></Col>
            <Col span={3} className="colRight">อำเภอ/เขต</Col>
            <Col span={7} className="text2Left"></Col>

            <Col span={2} className="colLeft">จังหวัด</Col>
            <Col span={16} className="text2Left"></Col>
            <Col span={2} className="colRight">โทรศัพท์</Col>
            <Col span={1} className="text2Left"></Col>
            <Col span={2} className="colRight">โทรสาร</Col>
            <Col span={1} className="text2Left"></Col>


            <Col span={5} className="colLeft">จดหมายอิเล็กทรอนิกส์</Col>
            <Col span={9} className="text2Left"></Col>
            <Col span={7} className="colRight">มีข้อความตามที่จะกล่าวต่อไปนี้</Col>
            <Col span={3} className="colRight"></Col>

              {/* <Col span={24} className="colLeft">{record.CONTNO}</Col> */}
            </Row>
      
      </div>
      <div className="divA4Cut2">
            <Row>
              <Col span={24} className="colCenter">- 2 -</Col><br/><br/>
              <Col span={24} className="text2LeftLong">
                <span style={{display: 'inline-block', width: '4ch'}}></span>ข้อ ๑.
                โจทก์เป็นนิติบุคคลประเภทบริษัทจำกัด มีวัตถุประสงค์ในการ ซื้อขาย เช่าซื้อ ให้เช่า ซื้อรถยนต์ทุกชนิด
                เดิมโจทก์ใช้ชื่อว่า บริษัท ซีเอแอล ๒๐๐๙ จำกัด ต่อมาเมื่อวันที่ ๒๐ ตุลาคม ๒๕๖๕ ได้จดทะเบียนเปลี่ยนชื่อเป็น           
                บริษัท วัน ลิสซิ่ง จำกัด ปรากฏตามสำเนาหนังสือรับรองและ วัตถุประสงค์ เอกสารท้ายคำฟ้องหมายเลข ๑<br/>

                <span style={{display: 'inline-block', width: '4ch'}}></span>
                ในการฟ้องและดำเนินคดีนี้ โจทก์มอบอำนาจให้ นายยุทธศาสตร์   พิมพิลา เป็นผู้มีอำนาจฟ้องและดำเนินคดี
                กับจำเลยทั้งสามแทนโจทก์ได้ ปรากฏตามสำเนาหนังสือมอบอำนาจเอกสารท้ายคำฟ้องหมายเลข ๒<br/>

                <span style={{display: 'inline-block', width: '4ch'}}></span>
                ข้อ ๒. เมื่อวันที่ ๑๑ พฤษภาคม ๒๕๖๒ จำเลยที่ ๑ ได้ทำสัญญาเช่าซื้อรถยนต์ยี่ห้อเชฟโรเลต จากโจทก์ไป ๑ คัน
                ในสภาพเรียบร้อย ใช้การได้ดี คันหมายเลขเครื่อง เอ๙อีจี๑๒๒๗๓๑๐๔๒ หมายเลขทะเบียน ฒศ-๙๐๔๒ กรุงเทพมหานคร
                ในราคาเช่าซื้อ ๓๙๔,๙๒๐ บาท โดยจำเลยที่ ๑ สัญญาจะผ่อนชำระค่างวดเป็นรายงวดเดือน ๆ ละ ๕,๔๘๕ บาท
                ให้แล้วเสร็จภายใน ๗๒ งวด เริ่ม งวดแรกในวันที่ ๑๙ มิถุนายน ๒๕๖๒ งวดต่อไปทุกวันที่ ๑๙ ของเดือนถัดไป
                จนกว่าจะชำระเสร็จ โดยมีเงื่อนไขว่า จำเลยที่ ๑ จะได้กรรมสิทธิ์เมื่อชำระค่างวดครบถ้วน และถือเอากำหนดเวลาการชำระ
                ค่างวดเป็นสาระสำคัญของสัญญา หากผิดนัดชำระค่างวด ๓ งวดติดต่อกัน และโจทก์ได้มีหนังสือบอกเลิกสัญญา
                ไปยังจำเลยที่ ๑ แล้ว จำเลยที่ ๑ ไม่ชำระค่างวดที่ค้างทั้งหมดภายใน ๓๐ วัน นับแต่วันที่ ได้รับหนังสือบอกกล่าวให้ถือว่า
                ให้ถือว่าสัญญาเลิกกันโดยทันที โดยยินยอมให้โจทก์ริบเงินที่ได้ชำระแล้วทั้งสิ้น และจำเลยที่ ๑ สัญญาจะคืนรถในสภาพ
                เรียบร้อยใช้การได้ดี หรือให้โจทก์กลับเข้าครอบครองรถ หากคืนไม่ได้จะชำระราคาแทน พร้อมดอกเบี้ยในอัตราสำหรับ
                ลูกหนี้ชั้นดีรายย่อยของธนาคารกรุงไทย จำกัด (มหาชน) บวกสิบนับแต่วันผิดนัดเป็นต้นไป จำเลยที่ ๑ ได้รับรถ
                ในสภาพเรียบร้อยใช้การได้ดีแล้วในวันทำสัญญาปรากฏตามสำเนาสัญญาเช่าซื้อ เอกสารท้ายคำฟ้องหมายเลข ๓<br/>

                <span style={{display: 'inline-block', width: '4ch'}}></span>
                ในการทำสัญญาเช่าซื้อของจำเลยที่ ๑ จำเลยที่ ๒ และที่ ๓ ได้ยินยอมตนเข้าเป็นผู้ค้ำประกัน 
                โดยยอมรับผิดหากจำเลยที่ ๑ ผิดสัญญาและไม่สามารถชำระหนี้ได้ไม่ว่าด้วยเหตุใด ๆ จำเลยที่ ๒ และที่ ๓ จะชำระหนี้แทนจนครบจำนวน 
                ปรากฏตามสำเนาสัญญาค้ำประกันเอกสารท้ายคำฟ้องหมายเลข ๔, ๕<br/>

                <span style={{display: 'inline-block', width: '4ch'}}></span>
                ข้อ ๓. เมื่อรับรถยนต์ไปแล้ว จำเลยที่ ๑ ได้ปฏิบัติผิดสัญญา โดยได้ชำระค่างวดให้แก่โจทก์ เพียง ๓๔ งวดเศษ เป็นเงินจำนวน ๑๘๙,๓๖๐ บาท
                แล้วได้ผิดนัดชำระค่างวดตั้งแต่งวดที่ ๓๕ ซึ่งถึงกำหนดชำระในวันที่ ๑๙ เมษายน ๒๕๖๕ ติดต่อกัน ๓ งวดจนถึงปัจจุบัน โดยจำเลยที่ ๑ ยังค้างชำระ
                ค่างวดรถยนต์ทั้งสิ้นเป็นเงินจำนวน ๒๐๕,๕๖๐ บาท ปรากฏตามการ์ดลูกหนี้และการรับชำระ เอกสารท้ายคำฟ้องหมายเลข ๖<br/> 

                <span style={{display: 'inline-block', width: '4ch'}}></span>
                การที่จำเลยที่ ๑ ผิดนัดชำระค่างวด ๓ งวดติดต่อกัน ถือว่าจำเลยที่ ๑ เป็นฝ่ายผิดสัญญา จำเลยที่ ๑ มีหน้าที่ส่งรถยนต์คืนโจทก์ โจทก์ได้
                มีหนังสือบอกกล่าวให้จำเลยทั้งสามชำระหนี้ ค่างวดรถยนต์ที่ค้างชำระภายใน ๓๐ วัน จำเลยทั้งสามได้รับหนังสือบอกกล่าวโดยชอบแล้วละเลยไม่ปฏิบัติตาม
                คำบอกกล่าว สัญญาจึงเลิกกันตามสัญญา โดยโจทก์ได้จัดส่งคำบอกกล่าวเลิกสัญญาไป ตามที่อยู่ที่จำเลยทั้งสามให้ไว้ในขณะทำสัญญาข้อ ๑๙ แล้ว จึงถือว่า
                สัญญาเลิกกันตามสัญญา ปรากฏตามสำเนาหนังสือบอกกล่าวเลิกสัญญาให้ชำระหนี้ จดหมายส่งคืนผู้ฝากส่งและไปรษณีย์ตอบ รับ เอกสารท้ายคำฟ้อง ๗ - ๙<br/>  
              </Col>
            </Row>
      
      </div>
      <div className="divA4Cut2">
            <Row>
              <Col span={24} className="colCenter">- 3 -</Col><br/><br/>
              <Col span={24} className="text2LeftLong">
                <span style={{display: 'inline-block', width: '4ch'}}></span>
                  นับตั้งแต่จำเลยที่ ๑ ผิดนัดชำระค่างวดตั้งแต่งวดที่ ๓๕ ซึ่งถึงกำหนดชำระในวันที่ ๑๙ เมษายน ๒๕๖๕ โจทก์ได้ให้เจ้าพนักงานออกติดตาม
                  ทวงถามให้จำเลยทั้งสามชำระหนี้แล้วหลายหนเสียค่าใช้จ่ายไม่น้อยกว่า ๕,๐๐๐ บาท จำเลยทั้งสามต้องรับผิดต่อโจทก์ด้วย<br/> 

                <span style={{display: 'inline-block', width: '4ch'}}></span>
                นอกจากนี้จำเลยทั้งสามต้องร่วมกันรับผิดชดใช้ค่าขาดประโยชน์แก่โจทก์กล่าวคือหาก รถยนต์คันที่เช่าซื้ออยู่ในความครอบครองของโจทก์ 
                โจทก์สามารถนำรถยนต์ออกให้บุคคลภายนอกเช่าได้ในอัตราเดือนละไม่น้อยกว่า ๕,๐๐๐ บาท นับแต่งวดที่ผิดนัดคืองวดที่ ๓๕ ซึ่งถึงกำหนด
                ชำระวันที่ ๑๙ เมษายน ๒๕๖๕ จนถึงวันฟ้องเป็นเวลา ๓๒ เดือน คิดเป็นเงินจำนวน ๑๖๐,๐๐๐ บาท แต่โจทก์ขอเรียกร้องค่าเสียหายในส่วนนี้ 
                จากจำเลยทั้งสามเป็นเงินจำนวนเพียง ๘๕,๐๐๐ บาท จำเลยทั้งสามต้องรับผิดต่อด้วย<br/> 

                <span style={{display: 'inline-block', width: '4ch'}}></span>
                ดังนั้น จำเลยทั้งสามมีหนี้ค้างชำระแก่โจทก์โดยการส่งมอบรถยนต์ที่เช่าซื้อคืนแก่โจทก์ ในสภาพเรียบร้อยใช้การได้ดี
                หากคืนไม่ได้ให้ใช้ราคาแทนเป็นเงินจำนวน ๒๐๕,๕๖๐ บาท พร้อมค่าติดตามทวงถามเป็นเงินจำนวน ๕,๐๐๐ บาท และค่าขาดประโยชน์
                เป็นเงินจำนวน ๘๕,๐๐๐ บาท รวมเป็นเงินทั้งสิ้นจำนวน ๒๙๕,๕๖๐ บาท และค่าขาดประโยชน์นับถัดจากวันฟ้อง จนกว่าจำเลยทั้งสาม
                จะส่งคืนรถยนต์แก่โจทก์ หรือชำระราคาเสร็จเดือนละ ๕,๐๐๐ บาท พร้อมดอกเบี้ยในอัตราร้อยละ ๑๕ ต่อปี ของต้นเงินจำนวน ๒๙๕,๕๖๐ บาท
                นับถัดจากวันฟ้องเป็นต้นไปจนกว่าจะชำระหนี้เสร็จแก่โจทก์<br/>  
              </Col>
              <Col span={24} className="text2LeftLongCenter">โจทก์ไม่มีทางอื่นใดบังคับจำเลยทั้งสามให้ชำระหนี้ได้ จึงขอบารมีศาลเป็นที่พึ่ง  </Col>
              <Col span={24} className="text2LeftLongCenter">ควรมิควรแล้วแต่จะโปรด </Col>

              {/* <Col span={24} className="colLeft">{record.CONTNO}</Col> */}
            </Row>
      
      </div>
      <div className="divA4Cut2">
            <Row>
            <Col span={24} className="colCenter">- 4 -</Col>
            <br/><br/>
            <Col span={24} className="colLeft">(๕)</Col>
            <Col span={24} className="colLeft">คำขอท้ายคำฟ้องคดีผู้บริโภค</Col>
            <Col span={24} className="colCenter">ขอศาลออกหมายเรียกตัวจำเลยมาพิจารณาพิพากษา และบังคับจำเลยตามคำขอต่อไปนี้</Col>

            <Col span={24} className="text2LeftLong">
              <span style={{display: 'inline-block', width: '4ch'}}></span>๑.
              ให้จำเลยที่ ๑ ส่งมอบรถยนต์ที่เช่าซื้อคืนให้แก่โจทก์ในสภาพเรียบร้อยใช้การได้ดี หากคืน ไม่ได้ให้ใช้ราคาแทนเป็นเงินจำนวน ๒๐๕,๕๖๐ บาท<br/> 

              <span style={{display: 'inline-block', width: '4ch'}}></span>๒.
              ให้จำเลยที่ ๑ ชำระค่าติดตามทวงถามแก่โจทก์เป็นเงินจำนวน ๕,๐๐๐ บาท ค่าขาด ประโยชน์นับแต่วันที่ผิดนัดจนถึงวันฟ้องคิดเป็นเงินจำนวน
              ๘๕,๐๐๐ บาท และค่าขาดประโยชน์อีก เดือนละ ๕,๐๐๐ บาท นับถัดจากวันฟ้องจนกว่าจะชำระเสร็จแก่โจทก์<br/>  

              <span style={{display: 'inline-block', width: '4ch'}}></span>๓.
              ให้จำเลยที่ ๑ ชำระดอกเบี้ยในอัตราร้อยละ ๑๕ ต่อปี จากต้นเงินจำนวน ๒๙๕,๕๖๐ บาท นับถัดจากวันฟ้องจนกว่าจะชำระเสร็จสิ้นแก่โจทก์<br/> 
              
              <span style={{display: 'inline-block', width: '4ch'}}></span>๔.
              หากจำเลยที่ ๑ ไม่สามารถชำระหนี้ให้แก่โจทก์ได้ไม่ว่ากรณีใด ๆ ขอให้ศาลมีคำพิพากษา ให้จำเลยที่ ๒ และที่ ๓ ชำระหนี้แทนจนครบจำนวน<br/>
              
              <span style={{display: 'inline-block', width: '4ch'}}></span>๕.
              ให้จำเลยทั้งสามร่วมกันหรือแทนกัน ชำระค่าฤชาธรรมเนียมและค่าทนายความแทนโจทก์ในอัตราอย่างสูง<br/> 
            </Col>
            <Col span={24} className="colLeft">
              ข้าพเจ้าได้ยื่นสำเนาคำฟ้องโดยข้อความถูกต้องเป็นอย่างเดียวกัน มาด้วย สาม ฉบับ และรอฟังคำสั่งอยู่ ถ้าไม่รอให้ถือว่าทราบแล้ว
            </Col>  
            

            <Col span={18} className="colRight"></Col>
            <Col span={5} className="text2Left">บริษัท วัน ลิสซิ่ง จำกัด ฯ</Col>
            <Col span={1} className="colRight">โจทก์</Col>

            <Col span={18} className="colRight"></Col>
            <Col span={6} className="text2Left">นายยุทธศาสตร์     พิมพิลา</Col>

            <Col span={6} className="colRight"></Col>
            <Col span={2} className="colRight">ข้าพเจ้า</Col>
            <Col span={11} className="text2Left"></Col>
            <Col span={5} className="colRight">เจ้าพนักงานคดี/ผู้บันทึก</Col>

            <Col span={18} className="colRight"></Col>
            <Col span={6} className="text2Left">-</Col>

            <Col span={6} className="colRight"></Col>
            <Col span={18} className="colRight">ข้าพเจ้านายยุทธศาสตร์     พิมพิลา ทนายความ ใบอนุญาติที่ ๒๗๗๐/๒๕๔๓ ผู้เรียง/พิมพ์</Col>

            <Col span={18} className="colRight"></Col>
            <Col span={6} className="text2Left">นายยุทธศาสตร์     พิมพิลา</Col>

            <Col span={20} className="colRight"></Col>
            <Col span={4} className="colRight">๐๘๐ - ๔๗๗๖๓๔๖</Col>

              {/* <Col span={24} className="colLeft">{record.CONTNO}</Col> */}

            </Row>
      
      </div>
    </div>
  );
}
export default PrintPage4;
