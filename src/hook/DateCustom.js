import dayjs from "dayjs";
import "dayjs/locale/th"; // import ภาษาไทย

dayjs.locale("th"); // ตั้งค่าภาษาเป็นไทย

const DateCustom = () => {
  const dateNow = () => {
    const date = dayjs().format();

    return date;
  };

  const convertDateThai = (value) => {
    const date = dayjs(value).add(543, "year").format("D MMMM YYYY ");
    return date;
  };

  const convertDateThaiYear = (value) => {
    const date = dayjs(value).add(543, "year").format("YYYY ");

    return date;
  };

  const convertDateThaiMonth = (value) => {
    const date = dayjs(value).add(543, "year").format("MMMM");

    return date;
  };

  const convertDateThaiDate = (value) => {
    const date = dayjs(value).add(543, "year").format("D");

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
