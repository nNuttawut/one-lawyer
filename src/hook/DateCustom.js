import dayjs from "dayjs";
import "dayjs/locale/th"; // import ภาษาไทย
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.locale("th"); // ตั้งค่าภาษาเป็นไทย

const DateCustom = () => {
  const convertDateThai = (value) => {
    const date = dayjs.utc(value).add(543, "year").format("D MMMM YYYY ");
    return date;
  };

  const convertDateThaiShort = (value) => {
    const date = dayjs.utc(value).add(543, "year").format("D MMM YY");
    return date;
  };

  const convertDateThaiYear = (value) => {
    const date = dayjs.utc(value).add(543, "year").format("YYYY ");

    return date;
  };

  const convertDateThaiMonth = (value) => {
    const date = dayjs.utc(value).add(543, "year").format("MMMM");

    return date;
  };

  const convertDateThaiDate = (value) => {
    const date = dayjs.utc(value).add(543, "year").format("D");

    return date;
  };

  const dateNow = () => {
    const date = dayjs.utc().format();
    return date;
  };

  return [
    convertDateThai,
    convertDateThaiShort,
    convertDateThaiYear,
    convertDateThaiMonth,
    convertDateThaiDate,
    dateNow,
  ];
};

export default DateCustom;
