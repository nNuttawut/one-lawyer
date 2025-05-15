export const expensesPayList = {
  FEE_COURT: [1, "ค่าธรรมเนียมศาล"],
  DELIVERY_OF_SUMMONS: [2, "ค่าส่งจดหมาย"],
  STAMP_COST: [3, "ค่าอากรสแตมป์"],
  DOCUMENT_COST: [4, "ค่าจัดทำเอกสาร"],
  FEE_ENFORCE: [5, "ค่าคันบังคับคดี"],
  COPYING_FEE: [6, "ค่าคัดเอกสาร"],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const optionsSatus = [...getSelectOptions(expensesPayList)];

export const FEE_COURT = 1;
export const DELIVERY_OF_SUMMONS = 2;
export const STAMP_COST = 3;
export const DOCUMENT_COST = 4;
export const FEE_ENFORCE = 5;
export const COPYING_FEE = 6;

export const STATUS_WITHDRAW_PROGRESS = 1;
export const STATUS_WITHDRAW_UNSUCCESSFUL = 2;
export const STATUS_WITHDRAW_SUCCESSFUL = 3;
export const STATUS_WITHDRAW_PROCESS = 4;

export const PAYADVANCE_STATUS_PROCESS = 1; //ตั้งเบิก
export const PAYADVANCE_STATUS_NOT_APPROVED = 2; //ไม่อนุมัติเบิก
export const PAYADVANCE_STATUS_APPROVED = 3; //อนุมัติเบิก
export const PAYADVANCE_STATUS_CANCLE = 4; //เคลียร์เบิก
export const PAYADVANCE_STATUS_CLEAR = 5; //เคลียร์เบิก
export const PAYADVANCE_STATUS_SUCCESS = 6; //สำเร็จ
export const PAYADVANCE_STATUS_UNSUCCESS = 7; //ไม่สำเร็จ
