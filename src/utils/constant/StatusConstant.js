export const listStatus = {
  NOTICE: [1, "ส่งจดหมายเตือน"],
  INDICT: [2, "ส่งคำฟ้อง"],
  AWAITING_JUDMENT: [3, "รอพิพากษา"],
  JUDGEMENT: [4, "พิพากษา"],
  PAYMENT: [5, "ทำยอม"],
  CASE_IS_FINAL: [6, "คดีถึงที่สุด"],
  INVESTIGATE: [7, "สืบทรัพย์หลังฟ้อง"],
  ENFORCEMENT: [8, "บังคับคดี"],
  NEGOTIATE: [9, "เจรจาทรัพย์"],
  SELL_ASSETS: [10, "ขายทรัพย์"],
  FINISH: [11, "ปิดบัญชี"],
  TIMEOUT: [12, "หมดอายุความ"],
  WITHDRAW_CASE: [13, "ถอนฟ้อง"],
  BAD_DEBTOR: [14, "ลูกหนี้สูญ"],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const optionsSatus = [...getSelectOptions(listStatus)];

export const JOB_NULL = 0;
export const NOTICE = 1;
export const INDICT = 2;
export const AWAITING_JUDMENT = 3;
export const JUDGEMENT = 4;
export const PAYMENT = 5;
export const CASE_IS_FINAL = 6;
export const INVESTIGATE = 7;
export const ENFORCEMENT = 8;
export const NEGOTIATE = 9;
export const SELL_ASSETS = 10;
export const FINISH = 11;
export const TIMEOUT = 12;
export const WITHDRAW_CASE = 13;
export const BAD_DEBTOR = 14;

export const STATUS_PROCESS_PROGRESS = 1;
export const STATUS_PROCESS_UNSUCCESSFUL = 2;
export const STATUS_PROCESS_SUCCESSFUL = 3;
export const STATUS_PROCESS_PROCESS = 4;

export const PARAM_PUBLIC = "public";
