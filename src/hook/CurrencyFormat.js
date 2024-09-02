import React from "react";

const CurrencyFormat = () => {
  const currencyFormat = (amount) => {
    return Number(amount)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return [currencyFormat];
};

export default CurrencyFormat;
