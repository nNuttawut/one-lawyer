export const listStatus = {
  NOTICE: [1, "ส่งจดหมายเตือน"],
  INDICT: [2, "ส่งคำฟ้อง"],
  AWAITING_JUDMENT: [3, "รอพิพากษา"],
  JUDGEMENT: [4, "พิพากษา"],
  CASE_IS_FINAL: [5, "คดีถึงที่สุด"],
  PAYMENT: [6, "ทำยอม"],
  ENFORCEMENT: [7, "บังคับคดี"],
  NEGOTIATE: [8, "เจรจาทรัพย์"],
  SELL_ASSETS: [9, "ขายทรัพย์"],
  FINISH: [10, "สิ้นสุด"],
  BAD_DEBTOR: [11, "ลูกหนี้สูญ"],
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
export const CASE_IS_FINAL = 5;
export const PAYMENT = 6;
export const ENFORCEMENT = 7;
export const NEGOTIATE = 8;
export const SELL_ASSETS = 9;
export const FINISH = 10;
export const BAD_DEBTOR = 11;
