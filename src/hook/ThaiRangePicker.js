import React, { useState } from "react";
import { DatePicker, ConfigProvider } from "antd";
import th_TH from "antd/locale/th_TH";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";

dayjs.locale("th");
dayjs.extend(buddhistEra);

const { RangePicker } = DatePicker;

const ThaiRangePicker = () => {
  const [selectedDates, setSelectedDates] = useState(null);

  const handleDateChange = (dates, dateStrings) => {
    if (dates) {
      const formattedDates = [
        dates[0].format("YYYY-MM-DD"), // ✅ แปลงเป็น ค.ศ.
        dates[1].format("YYYY-MM-DD"),
      ];
      console.log("📅 ค่าที่เลือก:", formattedDates);
      setSelectedDates(formattedDates);
    } else {
      setSelectedDates(null);
    }
  };

  return (
    <ConfigProvider locale={th_TH}>
      <RangePicker
        value={
          selectedDates
            ? [dayjs(selectedDates[0]), dayjs(selectedDates[1])]
            : null
        }
        onChange={handleDateChange}
        format="DD/MM/BBBB" // ✅ ใช้ พ.ศ. ในการแสดงผล
        placeholder={["วันที่เริ่ม", "วันที่สิ้นสุด"]}
      />
    </ConfigProvider>
  );
};

export default ThaiRangePicker;
