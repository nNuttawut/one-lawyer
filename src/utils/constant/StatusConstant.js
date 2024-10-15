export const listStatus = {
  NOTICE: [1, "ส่งจดหมายเตือน"],
  INDICT: [2, "ส่งคำฟ้อง"],
  AWAITING_JUDMENT: [3, "รอพิพากษา"],
  JUDGEMENT: [4, "พิพากษา"],
  PAYMENT: [5, "ทำยอม"],
  CASE_IS_FINAL: [6, "คดีถึงที่สุด"],
  INVIGATE: [7, "สืบทรัพย์หลังฟ้อง"],
  ENFORCEMENT: [8, "บังคับคดี"],
  NEGOTIATE: [9, "เจรจาทรัพย์"],
  SELL_ASSETS: [10, "ขายทรัพย์"],
  FINISH: [11, "สิ้นสุด"],
  BAD_DEBTOR: [12, "ลูกหนี้สูญ"],
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
export const JUDGEMENT = 4;
export const PAYMENT = 5;
export const CASE_IS_FINAL = 6;
export const INVIGATE = 7;
export const ENFORCEMENT = 8;
export const NEGOTIATE = 9;
export const SELL_ASSETS = 10;
export const FINISH = 11;
export const BAD_DEBTOR = 12;
