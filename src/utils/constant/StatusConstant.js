export const listStatus = {
  NOTICE: [1, "ส่งจดหมายเตือน"],
  INDICT: [2, "ส่งคำฟ้อง"],
  AWAITING_JUDMENT: [3, "รอพิพากษา"],
  ADJUDGE: [4, "คดีถึงที่สุด"],
  ENFORCEMENT: [5, "บังคับคดี"],
  INVESTIGATE_ASSET: [6, "สืบทรัพย์"],
  NEGOTIATE: [7, "เจรจาทรัพย์"],
  PAYMENT: [8, "ทำยอม/ชำระ"],
  FINISH: [9, "สิ้นสุด"],
  BAD_DEBTOR: [10, "ลูกหนี้สูญ"],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const optionsSatus = [...getSelectOptions(listStatus)];

export const NOTICE = 1;
export const INDICT = 2;
export const AWAITING_JUDMENT = 3;
export const ADJUDGE = 4;
export const ENFORCEMENT = 5;
export const INVESTIGATE_ASSET = 6;
export const NEGOTIATE = 7;
export const PAYMENT = 8;
export const FINISH = 9;
export const BAD_DEBTOR = 10;
