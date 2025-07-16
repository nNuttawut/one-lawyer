import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  baseUrl,
  GET_JOB_COUNT,
  GET_LAWYERS_LIST,
  HEADERS_EXPORT,
} from "../component/API/apiUrls";

const LoadLawyers = () => {
  const [lawyersList, setLawyersList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadLawyerJobs, setLoadLawyerJobs] = useState([]);
  const [lawyerJobs, setLawyerJobs] = useState([]);

  useEffect(() => {
    if (loadingData) {
      loadData();
    }
  }, [loadingData]);

  const loadData = async () => {
    console.log("loadData LoadLawyers");

    try {
      await axios
        .get(baseUrl + GET_LAWYERS_LIST, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            setLawyersList(res.data);
            console.log("res", res.data);
          } else {
            setLawyersList([]);
            message.error("ไม่มีข้อมูล");
            console.log("res", res.data);
          }
        })
        .catch((err) => console.log("ไม่มีข้อมูล", err));
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }

    try {
      await axios

        // .get("http://localhost:8080/lawyer/api/loans/notics/count", {
        .get(baseUrl + GET_JOB_COUNT, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            setLoadLawyerJobs(res.data);
            console.log("data in", res.data);
          } else {
            message.error("ไม่มีข้อมูล");
            console.log("ไม่มีข้อมูล");
          }
        })
        .catch((err) => console.log("ไม่มีข้อมูล", err));
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  return [lawyersList, setLoadingData, loadLawyerJobs];
};

export default LoadLawyers;
