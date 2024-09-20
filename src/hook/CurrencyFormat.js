const CurrencyFormat = () => {
  const currencyFormat = (amount) => {
    if (amount) {
      return Number(amount)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return 0;
    }
  };

  const currencyFormatPoint = (amount) => {
    if (amount) {
      return Number(amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    } else {
      return 0;
    }
  };

  const currencyFormatNoPoint = (amount) => {
    if (amount) {
      return Number(amount)
        .toFixed(0)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    } else {
      return 0;
    }
  };

  const currencyFormatComma = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return [
    currencyFormat,
    currencyFormatComma,
    currencyFormatNoPoint,
    currencyFormatNoPoint,
  ];
};

export default CurrencyFormat;
