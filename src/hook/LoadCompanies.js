import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  baseUrl,
  GET_COMPANIES_LIST,
  HEADERS_EXPORT,
} from "../component/API/apiUrls";

const LoadCompanies = () => {
  const [companiesList, setCompaniesList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (loadingData) {
      loadData();
    }
  }, [loadingData]);

  const loadData = async () => {
    console.log("loadData LoadLawyers");
    try {
      await axios
        .get(baseUrl + GET_COMPANIES_LIST, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            setCompaniesList(res.data);
            console.log("res", res.data);
          } else {
            setCompaniesList([]);
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

  return [companiesList, setLoadingData];
};

export default LoadCompanies;
