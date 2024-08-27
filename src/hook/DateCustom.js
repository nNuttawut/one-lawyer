import React from "react";
import moment from "moment";
require("moment/locale/th");

const DateCustom = () => {
  const convertDateThai = (value) => {
    const date = moment(value).add(543, "year").format("LL");
    console.log(date);
    return date;
  };

  const convertDateThaiYear = (value) => {
    const date = moment(value).add(543, "year").format("YYYY");
    console.log(date);
    return date;
  };

  const convertDateThaiMonth = (value) => {
    const date = moment(value).add(543, "year").format("MMMM");
    console.log(date);
    return date;
  };

  const convertDateThaiDate = (value) => {
    const date = moment(value).add(543, "year").format("D");
    console.log(date);
    return date;
  };
  return [
    convertDateThai,
    convertDateThaiYear,
    convertDateThaiMonth,
    convertDateThaiDate,
  ];
};

export default DateCustom;
