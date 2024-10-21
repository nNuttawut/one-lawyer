import moment from "moment";
require("moment/locale/th");

const DateCustom = () => {
  const dateNow = () => {
    const date = moment().format();

    return date;
  };

  const convertDateThai = (value) => {
    const date = moment(value).add(543, "year").format("LL");

    return date;
  };

  const convertDateThaiYear = (value) => {
    const date = moment(value).add(543, "year").format("YYYY");

    return date;
  };

  const convertDateThaiMonth = (value) => {
    const date = moment(value).add(543, "year").format("MMMM");

    return date;
  };

  const convertDateThaiDate = (value) => {
    const date = moment(value).add(543, "year").format("D");

    return date;
  };
  return [
    convertDateThai,
    convertDateThaiYear,
    convertDateThaiMonth,
    convertDateThaiDate,
    dateNow,
  ];
};

export default DateCustom;
