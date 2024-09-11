export const listStatus = {
  ASSIGN_LAWYERS: [1, "แจกงานทนาย"],
  NOTICE: [2, "ส่งจดหมายเตือน"],
  COMPLAINT: [3, "ส่งคำฟ้อง"],
  AWAITING_JUDMENT: [4, "รอพิพากษา"],
  ADJUDGE: [5, "คดีถึงที่สุด"],
  CIVIL: [6, "บังคับคดี"],
  CRIMINAL: [7, "สืบทรัพย์"],
  ENFORCEMENT: [8, "เจรจาทรัพย์"],
  PAYMENT: [9, "ทำยอม/ชำระ"],
  SUCCESS: [10, "สำเร็จ"],
  BAD_DEBTOR: [11, "ลูกหนี้สูญ"],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const optionsSatus = [...getSelectOptions(listStatus)];

export const ASSIGN_LAWYERS = 1;
export const NOTICE = 2;
export const COMPLAINT = 3;
export const AWAITING_JUDMENT = 4;
export const ADJUDGE = 5;
export const CIVIL = 6;
export const CRIMINAL = 7;
export const ENFORCEMENT = 8;
export const PAYMENT = 9;
export const SUCCESS = 10;
export const BAD_DEBTOR = 11;
