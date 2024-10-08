export const month = {
  ONE: [1, 1],

  TWO: [2, 2],

  THREE: [3, 3],

  FOUR: [4, 4],

  FIVE: [5, 5],

  SIX: [6, 6],

  SEVEN: [7, 7],

  EIGHTT: [8, 8],

  NINE: [9, 9],

  TEN: [10, 10],

  ELEVEN: [11, 11],

  TWELVE: [12, 12],

  THIRTEEN: [13, 13],

  FOURTEEN: [14, 14],

  FIFTEEN: [15, 15],

  SIXTEEN: [16, 16],

  SEVENTEEN: [17, 17],

  EIGHTTTEEN: [18, 18],

  NINETEEN: [19, 19],

  TWENTY: [20, 20],

  TWENTYONE: [21, 21],

  TWENTYTWO: [22, 22],

  TWENTYTHREE: [23, 23],

  TWENTYFOURE: [24, 24],

  TWENTYFIVE: [25, 25],

  TWENTYSIX: [26, 26],

  TWENTYSEVEN: [27, 27],

  TWENTYEIGHT: [28, 28],

  TWENTYNINE: [29, 29],

  THIRTY: [30, 30],

  THIRTYONE: [31, 31],

  THIRTYTWO: [32, 32],

  THIRTYTHREE: [33, 33],

  THIRTYFOURE: [34, 34],

  THIRTYFIVE: [35, 35],

  THIRTYSIX: [36, 36],

  THIRTYSEVEN: [37, 37],

  THIRTYEIGHT: [38, 38],

  THIRTYNINE: [39, 39],

  FOURTY: [40, 40],

  FOURTYONE: [41, 41],

  FOURTYTWO: [42, 42],

  FOURTYTHREE: [43, 43],

  FOURTYFOUR: [44, 44],

  FOURTYFIVE: [45, 45],

  FOURTYSIX: [46, 46],

  FOURTYSEVEN: [47, 47],

  FOURTYEIGHT: [48, 48],

  FOURTYNICE: [49, 49],

  FIVTY: [50, 50],

  FIVTYONE: [51, 51],

  FIVTYTWO: [52, 52],

  FIVTYTHREE: [53, 53],

  FIVTYFOURE: [54, 54],

  FIVTYFIVE: [55, 55],

  FIVTYSIX: [56, 56],

  FIVTYSEVEN: [57, 57],

  FIVTYEIGHT: [58, 58],

  FIVTYNINE: [59, 59],

  SIXTY: [60, 60],
};

export const getSelectOptions = (list) =>
  Object.entries(list).map(([key, [value, label]]) => ({
    value,
    label,
  }));

export const optionsMonth = [...getSelectOptions(month)];
