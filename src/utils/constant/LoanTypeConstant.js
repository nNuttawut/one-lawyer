export const listLoneType = {
  HIRE_PURCASE: [1, "ฟ้องเช่าซื้อ"],
  MORTGAGE: [2, "ฟ้องเงินกู้(จดจำนอง)"],
  GENERAL_LOAN: [3, "ฟ้องเงินกู้(กู้ทั่วไป)"],
  CAR_LOAN: [4, "ฟ้องเงินกู้(คู่มือรถ)"],
  DEFFERENCE: [6, "ฟ้องส่วนต่าง"],
  EMBEZZLEMENT: [7, "ฟ้องอาญา(ยักยอกทรัพย์)"],
  FRAUDULENT: [8, "ฟ้องอาญา(ฉ้อโกง)"],
  HIRE_PURCASE_EMBEZZLEMENT: [8, "ฟ้องอาญา(ยักยอกทรัพย์),ฟ้องเช่าซื้อ"],
  MORTGAGE_EMBEZZLEMENT: [9, "ฟ้องอาญา(ยักยอกทรัพย์),ฟ้องเงินกู้"],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const optionsLone = [...getSelectOptions(listLoneType)];

export const HIRE_PURCASE = 1;
export const MORTGAGE = 2;
export const GENERAL_LOAN = 3;
export const CAR_LOAN = 4;
export const LAND_LOAN = 5;
export const DEFFERENCE = 6;
export const EMBEZZLEMENT = 7;
export const HIRE_PURCASE_EMBEZZLEMENT = 8;
export const MORTGAGE_EMBEZZLEMENT = 9;
