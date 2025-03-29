import React from "react";
import { DatePicker, ConfigProvider } from "antd";
import th_TH from "antd/locale/th_TH";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";

dayjs.locale("th");
dayjs.extend(buddhistEra);

const ThaiDatePicker = ({ value, onChange }) => {
  return (
    <ConfigProvider locale={th_TH}>
      <DatePicker
        value={value ? dayjs(value, "YYYY-MM-DD") : null} // ✅ แปลงค่า value เป็น dayjs
        onChange={(date, dateString) => {
          console.log("📅 ค่าที่เลือก:", dateString);
          onChange(date ? date.format("YYYY-MM-DD") : null); // ✅ ส่งค่าออกเป็น YYYY-MM-DD
        }}
        format="DD/MM/BBBB" // ✅ ใช้ พ.ศ.
        placeholder="เลือกวันที่"
      />
    </ConfigProvider>
  );
};

export default ThaiDatePicker;
