export const listLawType = {
  CIVIL: [1, "แพ่ง"],
  CRIMINAL: [2, "อาญา"],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const optionsLaw = [...getSelectOptions(listLawType)];

export const CIVIL = 1;
export const CRIMINAL = 2;
