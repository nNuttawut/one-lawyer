export const listCommission = {
  STATUS_JUDGEMENT: [1, "พิพากษา"],
  STATUS_JUDGEMENT_AND_AGREEMENT: [2, "พิพากษาตามยอม"],
  STATUS_WITHDRAW_CASE: [3, "ถอนฟ้อง"],
  STATUS_FINAL_CASE: [4, "ปิดบัญชี"],
  STATUS_REFINANCE_CASE: [5, "ปรับโครงสร้าง"],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const optionsCommission = [...getSelectOptions(listCommission)];

export const STATUS_JUDGEMENT = 1;
export const STATUS_JUDGEMENT_AND_AGREEMENT = 2;
export const STATUS_WITHDRAW_CASE = 3;
export const STATUS_FINAL_CASE = 4;
export const STATUS_REFINANCE_CASE = 5;
