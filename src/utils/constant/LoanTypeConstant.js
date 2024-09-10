export const listLoneType = {
  HIRE_PURCASE: [1, "เช่าซื้อ"],
  MORTGAGE: [2, "จำนอง"],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const optionsLone = [...getSelectOptions(listLoneType)];

export const HIRE_PURCASE = 1;
export const MORTGAGE = 2;
