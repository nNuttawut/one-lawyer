export const interest = {
  ONE: [0.01, "1%"],
  ONE_POINT_FIVE: [0.015, "1.5%"],
  TWO: [0.02, "2%"],
  TWO_POINT_FIVE: [0.025, "2.5%"],
  THREE: [0.03, "3%"],
  THREE_POINT_FIVE: [0.035, "3.5%"],
  FOUR: [0.04, "4%"],
  FOUR_POINT_FIVE: [0.045, "4.5%"],
  FIVE: [0.05, "5%"],
  FIVE_POINT_FIVE: [0.055, "5.5%"],
  SIX: [0.06, "6%"],
  SIX_POINT_FIVE: [0.065, "6.5%"],
  SEVEN: [0.07, "7%"],
  SEVEN_POINT_FIVE: [0.075, "7.5%"],
  EIGHT: [0.08, "8%"],
  EIGHT_POINT_FIVE: [0.085, "8.5%"],
  NINE: [0.09, "9%"],
  NINE_POINT_FIVE: [0.095, "9.5%"],
  TEN: [0.1, "10%"],
  TEN_POINT_FIVE: [0.105, "10.5%"],
  ELEVEN: [0.11, "11%"],
  ELEVEN_POINT_FIVE: [0.115, "11.5%"],
  TWELVE: [0.12, "12%"],
  TWELVE_POINT_FIVE: [0.125, "12.5%"],
  THIRTEEN: [0.13, "13%"],
  THIRTEEN_POINT_FIVE: [0.135, "13.5%"],
  FOURTEEN: [0.14, "14%"],
  FOURTEEN_POINT_FIVE: [0.145, "14.5%"],
  FIFTEEN: [0.15, "15%"],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const optionsInterest = [...getSelectOptions(interest)];
