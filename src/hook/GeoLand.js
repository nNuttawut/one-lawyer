import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  GET_PROVICE_LAND,
  POST_DISTRICT_LAND,
  HEADERS_EXPORT,
} from "../component/API/apiUrls";

const GeoLand = () => {
  const [loadingDataProvice, setLoadingDataProvice] = useState(false);
  const [dataProvice, setDataProvice] = useState();
  const [dataDistrict, setDataDistrict] = useState();
  const [dataSearch, setDataSearch] = useState(null);
  console.log("dataSearch", dataSearch);

  useEffect(() => {
    if (loadingDataProvice) {
      loadDataProvice();
    }
  }, [loadingDataProvice]);

  const loadDataProvice = async () => {
    console.log("loadData LoadLawyers");
    try {
      await axios
        .get(GET_PROVICE_LAND, {
          HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            setDataProvice(res.data.result);
            console.log("res--->", res.data.result);
          } else {
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

  useEffect(() => {
    console.log("dataSearch---->", dataSearch);
    if (dataSearch) {
      console.log("true---->");
      loadDataDistrict();
    } else {
      console.log("District is falsy or empty");
    }
  }, [dataSearch]);

  const loadDataDistrict = async () => {
    try {
      await axios
        .post(POST_DISTRICT_LAND, { pvcode: dataSearch, HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            setDataDistrict(res.data);
            console.log("res", res.data);
          } else {
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

  return [setLoadingDataProvice, dataProvice, dataDistrict, setDataSearch];
};

export default GeoLand;
