import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  baseUrl,
  GET_SELL_STATUS,
  HEADERS_EXPORT,
} from "../component/API/apiUrls";

const LoadSellStatus = () => {
  const [sellStatusList, setSellStatusList] = useState([]);
  const [loadingSellStatusList, setLoadingSellStatusList] = useState(false);

  useEffect(() => {
    if (loadingSellStatusList) {
      loadData();
    }
  }, [loadingSellStatusList]);

  const loadData = async () => {
    console.log("loadData LoadLawyers");
    try {
      await axios
        .get(baseUrl + GET_SELL_STATUS, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            setSellStatusList(res.data);
            console.log("res", res.data);
          } else {
            setSellStatusList([]);
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

  return [sellStatusList, setLoadingSellStatusList];
};

export default LoadSellStatus;
