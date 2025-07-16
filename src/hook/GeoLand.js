import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  GET_PROVICE_DB,
  POST_DISTRICT_DB,
  POST_SUB_DISTRICT_DB,
  HEADERS_LOGIN,
  baseUrl,
} from "../component/API/apiUrls";

const GeoLand = () => {
  const [loadingDataProvice, setLoadingDataProvice] = useState(false);
  const [dataProvice, setDataProvice] = useState();
  const [dataDistrict, setDataDistrict] = useState();
  const [dataSearch, setDataSearch] = useState(null);
  const [dataSubDistrict, setDataSubDistrict] = useState();
  const [dataSearchSubDistrict, setDataSearchSubDistrict] = useState(null);

  useEffect(() => {
    console.log("loadingDataProvice", loadingDataProvice);

    if (loadingDataProvice) {
      console.log("loadingDataProvice 2", loadingDataProvice);

      loadDataProvice();
    }
  }, [loadingDataProvice]);

  const loadDataProvice = async () => {
    console.log("loadDataProvice ");
    try {
      await axios
        .get(baseUrl + GET_PROVICE_DB, {
          HEADERS_LOGIN,
        })
        .then(async (res) => {
          console.log("resres", res.data);

          if (res.status === 200) {
            setDataProvice(res.data);
            console.log("res--->", res.data);
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

  useEffect(() => {
    console.log(
      "dataSearchSubDistrict---->",
      dataSearchSubDistrict,
      dataSearch
    );
    if (dataSearchSubDistrict) {
      console.log("true---->");
      loadDataSubDistrict();
    } else {
      console.log("District is falsy or empty");
    }
  }, [dataSearchSubDistrict]);

  const loadDataDistrict = async () => {
    try {
      await axios;
      await axios
        .get(baseUrl + POST_DISTRICT_DB, {
          params: {
            prov_code: dataSearch,
          },
          headers: HEADERS_LOGIN,
        })
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

  const loadDataSubDistrict = async () => {
    try {
      await axios;
      await axios
        .get(baseUrl + POST_SUB_DISTRICT_DB, {
          params: {
            prov_code: dataSearch,
            dist_code: dataSearchSubDistrict,
          },
          headers: HEADERS_LOGIN,
        })
        .then(async (res) => {
          console.log("loadDataSubDistrict", res);

          if (res.status === 200) {
            setDataSubDistrict(res.data);
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

  return [
    setLoadingDataProvice,
    dataProvice,
    dataDistrict,
    setDataSearch,
    dataSubDistrict,
    setDataSearchSubDistrict,
  ];
};

export default GeoLand;
