import React, { useState } from "react";
import { DatePicker, ConfigProvider } from "antd";
import th_TH from "antd/locale/th_TH";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";

dayjs.locale("th");
dayjs.extend(buddhistEra);

const ThaiDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date, dateString) => {
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD"); // ✅ แปลงเป็น ค.ศ.
      console.log("📅 ค่าที่เลือก:", formattedDate);
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate(null);
    }
  };

  return (
    <ConfigProvider locale={th_TH}>
      <DatePicker
        value={selectedDate ? dayjs(selectedDate) : null}
        onChange={handleDateChange}
        format="DD/MM/BBBB" // ✅ แสดงผลเป็น พ.ศ.
        placeholder="เลือกวันที่"
      />
    </ConfigProvider>
  );
};

export default ThaiDatePicker;
