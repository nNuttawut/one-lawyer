import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  baseUrl,
  GET_LAND_DETAIL_LIST,
  HEADERS_EXPORT,
} from "../component/API/apiUrls";

const LoadLandDetail = () => {
  const [loadLandDetailList, setLoadLandDetailList] = useState([]);
  const [loadingLandDetailData, setLoadingLandDetailData] = useState(false);

  useEffect(() => {
    if (loadingLandDetailData) {
      loadData();
    }
  }, [loadingLandDetailData]);

  const loadData = async () => {
    console.log("loadData LoadLawyers");
    try {
      await axios
        .get(baseUrl + GET_LAND_DETAIL_LIST, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            setLoadLandDetailList(res.data);
            console.log("LoadLandDetailList", res.data);
          } else {
            setLoadLandDetailList([]);
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

  return [loadLandDetailList, setLoadingLandDetailData];
};

export default LoadLandDetail;
