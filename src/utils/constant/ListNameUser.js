export const listNameOne = {
  YUT: [1, "ทนายยุทธ"],
  JUMBO: [2, "ทนายจัมโบ้"],
  beer: [3, "ผู้ช่วยทนายเบียร์"],
  KLA: [4, "ทนายกล้า"],
  KEANG: [5, "ทนายเกียง"],
  KO: [6, "ผู้ช่วยทนายโก้"],
  GO: [7, "ผู้ช่วยทนายโก้"],
  BELL: [8, "ธุระการสินเชื่อ"],
};

export const listNameKSM = {
  POOM: [9, "ทนายภูมิ"],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const allOptions = [
  ...getSelectOptions(listNameOne),
  ...getSelectOptions(listNameKSM),
];
