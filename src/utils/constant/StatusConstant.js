export const listStatus = {
  NOTICE: [1, "ส่งจดหมายเตือน"],
  COMPLAINT: [2, "ส่งคำฟ้อง"],
  AWAITING_JUDMENT: [3, "รอพิพากษา"],
  ADJUDGE: [4, "คดีถึงที่สุด"],
  CIVIL: [5, "บังคับคดี"],
  CRIMINAL: [6, "สืบทรัพย์"],
  ENFORCEMENT: [7, "เจรจาทรัพย์"],
  PAYMENT: [8, "ทำยอม/ชำระ"],
  SUCCESS: [9, "สำเร็จ"],
  BAD_DEBTOR: [10, "ลูกหนี้สูญ"],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const optionsSatus = [...getSelectOptions(listStatus)];

export const NOTICE = 1;
export const COMPLAINT = 2;
export const AWAITING_JUDMENT = 3;
export const ADJUDGE = 4;
export const CIVIL = 5;
export const CRIMINAL = 6;
export const ENFORCEMENT = 7;
export const PAYMENT = 8;
export const SUCCESS = 9;
export const BAD_DEBTOR = 10;
