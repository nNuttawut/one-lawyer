import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const LoadLawyers = () => {
  const [lawyersList, setLawyersList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (loadingData) {
      loadData();
    }
  }, [loadingData]);

  const loadData = async () => {
    const urlLawyerList = `https://shark-app-j9jc9.ondigitalocean.app/lawyer/dev/api/users/lawyers`;
    const headers = {};
    try {
      await axios
        .get(urlLawyerList, {
          headers: headers,
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
  };

  return [lawyersList, setLoadingData];
};

export default LoadLawyers;
