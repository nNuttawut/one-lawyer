import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";

dayjs.locale("th"); // ใช้ภาษาไทย
dayjs.extend(buddhistEra); // ใช้ปี พ.ศ.

const SubDateThai = () => {
  const formattedDateYMD = (date) => dayjs(date).format("D MMMM BBBB");
  const formattedDateY = (date) => dayjs(date).format("BBBB");
  const formattedDateM = (date) => dayjs(date).format("MMMM");
  const formattedDateD = (date) => dayjs(date).format("D");

  return {
    formattedDateYMD,
    formattedDateY,
    formattedDateM,
    formattedDateD,
  };
};

export default SubDateThai;
