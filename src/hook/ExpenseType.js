import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  baseUrl,
  GET_EXPENSE_TYPE_LIST,
  HEADERS_EXPORT,
} from "../component/API/apiUrls";

const LoadExpenseType = () => {
  const [expenseList, setExpenseList] = useState([]);
  const [loadingExpenseType, setLoadingExpenseType] = useState(false);

  useEffect(() => {
    if (loadingExpenseType) {
      loadData();
    }
  }, [loadingExpenseType]);

  const loadData = async () => {
    console.log("loadData LoadLawyers");
    try {
      await axios
        .get(baseUrl + GET_EXPENSE_TYPE_LIST, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            setExpenseList(res.data);
            console.log("res", res.data);
          } else {
            setExpenseList([]);
            message.error("ไม่มีข้อมูล");
            console.log("res", res.data);
          }
        })
        .catch((err) => console.log("ไม่มีข้อมูล", err));
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  return [expenseList, setLoadingExpenseType];
};

export default LoadExpenseType;
