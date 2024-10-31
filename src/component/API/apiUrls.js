//------dev-------
//ดีงข้อมูลจาก server ibm
const GET_LOAN_FROM_SERVER_IBM = "/lawyer/dev/server/loans";

//ดึงสัญญาทั้งหมดที่อยู่ใน server lawyers db
const GET_ALL_LOAN = "/lawyer/dev/api/loans";

///ดึงสัญญาตาม contno ที่อยู่ใน server lawyers
const GET_LOAN_BY_CONTNO = "/lawyer/dev/api/loans/";

//ดึงจำนวนงานที่ users รับงาน
const GET_JOB_COUNT = "/lawyer/dev/api/loans/notics/count";

//ดึงจำนานงานที่กำลังดำเนินการ
const GET_JOB_IN_PROGRESS = "/lawyer/dev/api/jobs";

//ดึงจำนานงานที่กำลังดำเนินการตามสถานะ
const GET_JOB_IN_PROGRESS_BY_STATUS = "/lawyer/dev/api/jobs/";

//นำข้อมูลเข้า db lawyers
const POST_LOAN_IN_LAWYERS_DB = "/lawyer/dev/api/loans";

//เปลี่ยนสถานะสัญญา
const POST_STATUS = "/lawyer/dev/api/loans/status";

//อัพเดทสถานะสัญญา
const PUT_STATUS = "/lawyer/dev/api/loans/status";

//ดึงข้อมูลแบบคำฟ้อง
const GET_LAWSUIT_DETAIL = `/lawyer/dev/api/lawsuits/`;
const GET_LAWSUIT_LIST = `/lawyer/dev/api/lawsuits`;
//อัพเดทข้อมูลคำฟ้อง
const PUT_LAWSUIT_DETAIL = `/lawyer/dev/api/lawsuits`;
const GET_LAWSUIT_DETAIL_BY_ID = `/lawyer/dev/api/lawsuits/detail/`;

//ดึงข้อมูลสืบทรัพย์
const GET_INVESTIGATE_BY_ID = `/lawyer/dev/api/investigate-properties/`;
//สร้างข้อมูลสืบทรัพย์
const POST_INVESTIGATE = `/lawyer/dev/api/investigate-properties`;
//อัพเดทข้อมูลสืบทรัพย์
const PUT_INVESTIGATE = `/lawyer/dev/api/investigate-properties`;
//ข้อมูลทั้งหมดของ id
const GET_WORK_LOG_DETAIL_BY_ID = `/lawyer/dev/api/worklogs/`;

//คำพิพากษา
const POST_JUDGE = `/lawyer/dev/api/judgements`;
const PUT_JUDGE = `/lawyer/dev/api/judgements`;
const GET_JUDGE_BY_ID = `/lawyer/dev/api/judgements/`;

//ข้อมูลจำเลย
const POST_JUDGE_DEFENDANTS = `/lawyer/dev/api/judgement-defendants`;
const PUT_JUDGE_DEFENDANTS = `/lawyer/dev/api/judgement-defendants`;
const GET_JUDGE_DEFENDANTS_BY_ID = `/lawyer/dev/api/judgement-defendants/`;

//ข้อมูลจทำยอม
const POST_AGREEMENTS = `/lawyer/dev/api/agreements/`;
const PUT_AGREEMENTS = `/lawyer/dev/api/agreements`;
const GET_AGREEMENTS_BY_ID = `/lawyer/dev/api/agreements/`;

//ดึง users ในระบบ
const GET_LAWYERS_LIST = "/lawyer/dev/api/users";
const GET_COMPANIES_LIST = "/lawyer/dev/api/companies";
const GET_ROLE_LIST = "/lawyer/dev/api/roles";
const GET_USERS_LIST = "/lawyer/dev/api/users";
const GET_BY_ID = "/lawyer/dev/api/users/";

//post
const LOG_IN = `/lawyer/dev/api/login`;
const REGISTER = `/lawyer/dev/api/register`;
const POST_USER = `/lawyer/dev/api/users`;

//all details
const GET_DETAILS = `/lawyer/dev/api/all-details?contractNo=`;

//delete status
const DELETE_STATUS_BY_WORKLOG = `/lawyer/dev/api/worklogs/`;

const baseUrl = "https://shark-app-j9jc9.ondigitalocean.app";
const HEADERS_EXPORT = {
  "Content-Type": "application/json",
};

//get GeoThailand ของเอื้อ
const GET_PROVICE = `https://eua-i67f6gaaqa-as.a.run.app/Api/provinces`;
const GET_DISTRICT = `https://eua-i67f6gaaqa-as.a.run.app/Api/districted/`;
const GET_SUB_DISTRICT = `https://eua-i67f6gaaqa-as.a.run.app/Api/subdistricted/`;
const GET_ZIPCODE = `https://eua-i67f6gaaqa-as.a.run.app/Api/zipcodes/`;

//get GeoThailand ที่ดิน
const GET_PROVICE_LAND = `https://onemoney.ngrok.app/GetProvince`;
const POST_DISTRICT_LAND = `https://onemoney.ngrok.app/GetAmphur`;
const POST_CALCULATE_LAND = `https://onemoney.ngrok.app/AllData`;

export {
  GET_LOAN_FROM_SERVER_IBM,
  GET_ALL_LOAN,
  GET_LOAN_BY_CONTNO,
  GET_LAWYERS_LIST,
  GET_JOB_COUNT,
  GET_JOB_IN_PROGRESS,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  POST_LOAN_IN_LAWYERS_DB,
  POST_STATUS,
  PUT_STATUS,
  HEADERS_EXPORT,
  baseUrl,
  GET_LAWSUIT_DETAIL,
  PUT_LAWSUIT_DETAIL,
  GET_INVESTIGATE_BY_ID,
  POST_INVESTIGATE,
  PUT_INVESTIGATE,
  LOG_IN,
  REGISTER,
  GET_WORK_LOG_DETAIL_BY_ID,
  POST_JUDGE,
  PUT_JUDGE,
  GET_JUDGE_BY_ID,
  POST_JUDGE_DEFENDANTS,
  PUT_JUDGE_DEFENDANTS,
  GET_JUDGE_DEFENDANTS_BY_ID,
  GET_COMPANIES_LIST,
  POST_AGREEMENTS,
  PUT_AGREEMENTS,
  GET_AGREEMENTS_BY_ID,
  GET_LAWSUIT_DETAIL_BY_ID,
  GET_LAWSUIT_LIST,
  GET_ROLE_LIST,
  GET_USERS_LIST,
  GET_BY_ID,
  POST_USER,
  GET_PROVICE,
  GET_DISTRICT,
  GET_SUB_DISTRICT,
  GET_ZIPCODE,
  DELETE_STATUS_BY_WORKLOG,
  GET_DETAILS,
  GET_PROVICE_LAND,
  POST_DISTRICT_LAND,
  POST_CALCULATE_LAND,
};

//----production-----
// //ดีงข้อมูลจาก server ibm
// const GET_LOAN_FROM_SERVER_IBM = "/lawyer/dev/server/loans"; // อย่าลืมแก้เป็น production

// //ดึงสัญญาทั้งหมดที่อยู่ใน server lawyers db
// const GET_ALL_LOAN = "/lawyer/api/loans";

// ///ดึงสัญญาตาม contno ที่อยู่ใน server lawyers
// const GET_LOAN_BY_CONTNO = "/lawyer/api/loans/";

// //ดึงจำนวนงานที่ users รับงาน
// const GET_JOB_COUNT = "/lawyer/api/loans/notics/count";

// //ดึงจำนานงานที่กำลังดำเนินการ
// const GET_JOB_IN_PROGRESS = "/lawyer/api/jobs";

// //ดึงจำนานงานที่กำลังดำเนินการตามสถานะ
// const GET_JOB_IN_PROGRESS_BY_STATUS = "/lawyer/api/jobs/";

// //นำข้อมูลเข้า db lawyers
// const POST_LOAN_IN_LAWYERS_DB = "/lawyer/api/loans";

// //เปลี่ยนสถานะสัญญา
// const POST_STATUS = "/lawyer/api/loans/status";

// //อัพเดทสถานะสัญญา
// const PUT_STATUS = "/lawyer/api/loans/status";

// //ดึงข้อมูลแบบคำฟ้อง
// const GET_LAWSUIT_DETAIL = `/lawyer/api/lawsuits/`;
// const GET_LAWSUIT_LIST = `/lawyer/api/lawsuits`;
// //อัพเดทข้อมูลคำฟ้อง
// const PUT_LAWSUIT_DETAIL = `/lawyer/api/lawsuits`;
// const GET_LAWSUIT_DETAIL_BY_ID = `/lawyer/api/lawsuits/detail/`;

// //ดึงข้อมูลสืบทรัพย์
// const GET_INVESTIGATE_BY_ID = `/lawyer/api/investigate-properties/`;
// //สร้างข้อมูลสืบทรัพย์
// const POST_INVESTIGATE = `/lawyer/api/investigate-properties`;
// //อัพเดทข้อมูลสืบทรัพย์
// const PUT_INVESTIGATE = `/lawyer/api/investigate-properties`;
// //ข้อมูลทั้งหมดของ id
// const GET_WORK_LOG_DETAIL_BY_ID = `/lawyer/api/worklogs/`;

// //คำพิพากษา
// const POST_JUDGE = `/lawyer/api/judgements`;
// const PUT_JUDGE = `/lawyer/api/judgements`;
// const GET_JUDGE_BY_ID = `/lawyer/api/judgements/`;

// //ข้อมูลจำเลย
// const POST_JUDGE_DEFENDANTS = `/lawyer/api/judgement-defendants`;
// const PUT_JUDGE_DEFENDANTS = `/lawyer/api/judgement-defendants`;
// const GET_JUDGE_DEFENDANTS_BY_ID = `/lawyer/api/judgement-defendants/`;

// //ข้อมูลจทำยอม
// const POST_AGREEMENTS = `/lawyer/api/agreements/`;
// const PUT_AGREEMENTS = `/lawyer/api/agreements`;
// const GET_AGREEMENTS_BY_ID = `/lawyer/api/agreements/`;

// //ดึง users ในระบบ
// const GET_LAWYERS_LIST = "/lawyer/api/users";
// const GET_COMPANIES_LIST = "/lawyer/api/companies";
// const GET_ROLE_LIST = "/lawyer/api/roles";
// const GET_USERS_LIST = "/lawyer/api/users";
// const GET_BY_ID = "/lawyer/api/users/";

// //post
// const LOG_IN = `/lawyer/api/login`;
// const REGISTER = `/lawyer/api/register`;
// const POST_USER = `/lawyer/api/users`;

// //all details
// const GET_DETAILS = `/lawyer/api/all-details?contractNo=`;

// //delete status
// const DELETE_STATUS_BY_WORKLOG = `/lawyer/api/worklogs/`;

// const baseUrl = "https://shark-app-j9jc9.ondigitalocean.app";
// const HEADERS_EXPORT = {
//   "Content-Type": "application/json",
// };

// //get GeoThailand
// const GET_PROVICE = `https://eua-i67f6gaaqa-as.a.run.app/Api/provinces`;
// const GET_DISTRICT = `https://eua-i67f6gaaqa-as.a.run.app/Api/districted/`;
// const GET_SUB_DISTRICT = `https://eua-i67f6gaaqa-as.a.run.app/Api/subdistricted/`;
// const GET_ZIPCODE = `https://eua-i67f6gaaqa-as.a.run.app/Api/zipcodes/`;

// // get GeoThailand ที่ดิน
// const GET_PROVICE_LAND = `https://onemoney.ngrok.app/GetProvince`;
// const POST_DISTRICT_LAND = `https://onemoney.ngrok.app/GetAmphur`;
// const POST_CALCULATE_LAND = `https://eua-i67f6gaaqa-as.a.run.app/Api/zipcodes/`;

// export {
//   GET_LOAN_FROM_SERVER_IBM,
//   GET_ALL_LOAN,
//   GET_LOAN_BY_CONTNO,
//   GET_LAWYERS_LIST,
//   GET_JOB_COUNT,
//   GET_JOB_IN_PROGRESS,
//   GET_JOB_IN_PROGRESS_BY_STATUS,
//   POST_LOAN_IN_LAWYERS_DB,
//   POST_STATUS,
//   PUT_STATUS,
//   HEADERS_EXPORT,
//   baseUrl,
//   GET_LAWSUIT_DETAIL,
//   PUT_LAWSUIT_DETAIL,
//   GET_INVESTIGATE_BY_ID,
//   POST_INVESTIGATE,
//   PUT_INVESTIGATE,
//   LOG_IN,
//   REGISTER,
//   GET_WORK_LOG_DETAIL_BY_ID,
//   POST_JUDGE,
//   PUT_JUDGE,
//   GET_JUDGE_BY_ID,
//   POST_JUDGE_DEFENDANTS,
//   PUT_JUDGE_DEFENDANTS,
//   GET_JUDGE_DEFENDANTS_BY_ID,
//   GET_COMPANIES_LIST,
//   POST_AGREEMENTS,
//   PUT_AGREEMENTS,
//   GET_AGREEMENTS_BY_ID,
//   GET_LAWSUIT_DETAIL_BY_ID,
//   GET_LAWSUIT_LIST,
//   GET_ROLE_LIST,
//   GET_USERS_LIST,
//   GET_BY_ID,
//   POST_USER,
//   GET_PROVICE,
//   GET_DISTRICT,
//   GET_SUB_DISTRICT,
//   GET_ZIPCODE,
//   DELETE_STATUS_BY_WORKLOG,
//   GET_DETAILS,
//   GET_PROVICE_LAND,
//   POST_DISTRICT_LAND,
//   POST_CALCULATE_LAND,
// };
