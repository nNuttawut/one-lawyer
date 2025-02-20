export const month = {
  NONE: [0, "ไม่เลือก"],
  ONE: [1, "1 เดือน"],

  TWO: [2, "2 เดือน"],

  THREE: [3, "3 เดือน"],

  FOUR: [4, "4 เดือน"],

  FIVE: [5, "5 เดือน"],

  SIX: [6, "6 เดือน"],

  SEVEN: [7, "7 เดือน"],

  EIGHTT: [8, "8 เดือน"],

  NINE: [9, "9 เดือน"],

  TEN: [10, "10 เดือน"],

  ELEVEN: [11, "11 เดือน"],

  TWELVE: [12, "12 เดือน"],

  THIRTEEN: [13, "13 เดือน"],

  FOURTEEN: [14, "14เดือน"],

  FIFTEEN: [15, "15 เดือน"],

  SIXTEEN: [16, "16 เดือน"],

  SEVENTEEN: [17, "17 เดือน"],

  EIGHTTTEEN: [18, "18 เดือน"],

  NINETEEN: [19, "19 เดือน"],

  TWENTY: [20, "20 เดือน"],

  TWENTYONE: [21, "21 เดือน"],

  TWENTYTWO: [22, "22 เดือน"],

  TWENTYTHREE: [23, "23 เดือน"],

  TWENTYFOURE: [24, "24 เดือน"],

  TWENTYFIVE: [25, "25 เดือน"],

  TWENTYSIX: [26, "26 เดือน"],

  TWENTYSEVEN: [27, "27 เดือน"],

  TWENTYEIGHT: [28, "28 เดือน"],

  TWENTYNINE: [29, "29 เดือน"],

  THIRTY: [30, "30 เดือน"],

  THIRTYONE: [31, "31 เดือน"],

  THIRTYTWO: [32, "32 เดือน"],

  THIRTYTHREE: [33, "33 เดือน"],

  THIRTYFOURE: [34, "34 เดือน"],

  THIRTYFIVE: [35, "35 เดือน"],

  THIRTYSIX: [36, "36 เดือน"],

  THIRTYSEVEN: [37, "37 เดือน"],

  THIRTYEIGHT: [38, "38 เดือน"],

  THIRTYNINE: [39, "39 เดือน"],

  FOURTY: [40, "40 เดือน"],

  FOURTYONE: [41, "41 เดือน"],

  FOURTYTWO: [42, "42 เดือน"],

  FOURTYTHREE: [43, "43 เดือน"],

  FOURTYFOUR: [44, "44 เดือน"],

  FOURTYFIVE: [45, "45 เดือน"],

  FOURTYSIX: [46, "46 เดือน"],

  FOURTYSEVEN: [47, "47 เดือน"],

  FOURTYEIGHT: [48, "48 เดือน"],

  FOURTYNICE: [49, "49 เดือน"],

  FIVTY: [50, "50 เดือน"],

  FIVTYONE: [51, "51 เดือน"],

  FIVTYTWO: [52, "52 เดือน"],

  FIVTYTHREE: [53, "53 เดือน"],

  FIVTYFOURE: [54, "54 เดือน"],

  FIVTYFIVE: [55, "55 เดือน"],

  FIVTYSIX: [56, "56 เดือน"],

  FIVTYSEVEN: [57, "57 เดือน"],

  FIVTYEIGHT: [58, "58 เดือน"],

  FIVTYNINE: [59, "59 เดือน"],

  SIXTY: [60, "60 เดือน"],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const optionsMonth = [...getSelectOptions(month)];
