export const companyList = {
  ONE_LEASING: [
    1,
    "บริษัท วัน ลิสซิ่ง จำกัด",
    "1/24 ถนน มิตรภาพ ตำบล ในเมือง อำเภอ เมืองขอนแก่น จังหวัดขอนแก่น 41250",
  ],
  ONE_MONEY: [
    2,
    "บริษัท วัน มันนี่ จำกัด",
    "1/24 ถนน มิตรภาพ ตำบล ในเมือง อำเภอ เมืองขอนแก่น จังหวัดขอนแก่น 41250",
  ],
  KSM: [
    3,
    "บริษัท เคเอสเอ็ม บิลเลี่ยนแนร์",
    "279 ม.12 ต.เมืองเก่า อ.เมือง จ.ขอนแก่น 40000",
  ],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label, address]]) => ({
    value,
    label,
    address,
  }));

export const optionsCompanyList = [...getSelectOptions(companyList)];

export const ONE_LEASING = 1;
export const ONE_MONEY = 2;
export const KSM = 3;
