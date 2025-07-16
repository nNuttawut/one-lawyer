import { Input, message } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState, useEffect } from "react";

dayjs.extend(customParseFormat);

const DateInput = ({ value, onChange, ...props }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (value) {
      const date = dayjs(value, "YYYY-MM-DD");
      const buddhistYear = date.year() + 543;
      setInputValue(date.format("DD/MM/") + buddhistYear);
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleChange = (e) => {
    let val = e.target.value.replace(/[^0-9/]/g, "");
    setInputValue(val);
    console.log("val", val);

    const [d, m, y] = val?.split(/[-/]/);
    const day = d?.padStart(2, "0");
    const month = m?.padStart(2, "0");

    if (parseInt(d) > 31) {
      message.error("กรุณากรอกวันที่ใหม่ 1-31 เช่น 09");
      setInputValue("");
      return;
    }
    if (parseInt(m) > 12) {
      message.error("กรุณากรอกเดือนใหม่ 1-12 เช่น 02");
      setInputValue("");
      return;
    }

    console.log("year", y);
    if (y?.length > 4) {
      message.error("กรุณากรอกปี พ.ศ. ให้ถูกต้อง");
      setInputValue("");
      return;
    }
    // else if (y?.length === 4) {
    //   if (parseInt(y) < 2500) {
    //     message.error("กรุณากรอกปี พ.ศ. ให้ถูกต้อง");
    //     setInputValue("");
    //     return;
    //   }
    // }

    if (day && month && y && y.length === 4) {
      let gregorianYear;
      if (parseInt(y) < 2500) {
        gregorianYear = parseInt(y, 10);
      } else {
        gregorianYear = parseInt(y, 10) - 543;
      }

      const dateStr = `${day}/${month}/${gregorianYear}`;
      const parsed = dayjs(dateStr, "DD/MM/YYYY", true);
      console.log("dateStr", dateStr);

      if (parsed.isValid()) {
        if (typeof onChange === "function") {
          onChange(parsed.format("YYYY-MM-DD")); // ส่งแบบ ค.ศ. ออก
        }
      }
    }
  };

  return (
    <Input
      {...props}
      value={inputValue}
      onChange={handleChange}
      placeholder="วว/ดด/ปปปป"
      size="large" // หรือ "small", "middle"
    />
  );
};

export default DateInput;
