// การเงิน
// const PAYMENT = "https://api-payment-539174983798.asia-southeast1.run.app"; // เทส
const PAYMENT = "https://api-payment-1024031113167.asia-southeast1.run.app"; // จริง
// const PAYMENT = "http://localhost:8070";

export const InsertPayamtCcb = `${PAYMENT}/api-payment/insert-payamt-ccb`;  // บันทึกยอดปิด
export const loadPayamtCcb = `${PAYMENT}/api-payment/load-payamt-ccb`;  // ข้อมูลสัญญา
export const FindPAYTYP = `${PAYMENT}/api-payment/find-pay`; // ค้นหาจาก ปชช. ทะเบียน
export const insertMemo1 = `${PAYMENT}/api-payment/insert-memo1`; // เพิ่ม memo1 ใน armast
