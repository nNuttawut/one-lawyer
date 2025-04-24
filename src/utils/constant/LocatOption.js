export const locat = {
  MIT: [1, "MIT"],
  UD: [2, "UD"],
  LEX: [3, "LEX"],
  S4: [4, "S4"],
  S5: [5, "S5"],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const optionsLocat = [...getSelectOptions(locat)];
