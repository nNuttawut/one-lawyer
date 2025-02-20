export const listLoneType = {
  HIRE_PURCASE: [1, "ฟ้องเช่าซื้อ"],
  MORTGAGE: [2, "ฟ้องจำนอง"],
  GENERAL_LOAN: [3, "ฟ้องเงินกู้(กู้ทั่วไป)"],
  CAR_LOAN: [4, "ฟ้องเงินกู้(คู่มือรถ)"],
  LAND_LOAN: [5, "ฟ้องเงินกู้(จดจำนอง)"],
  DEFFERENCE: [6, "ฟ้องส่วนต่าง"],
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
