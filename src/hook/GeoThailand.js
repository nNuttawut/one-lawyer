import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  GET_DISTRICT,
  GET_PROVICE,
  GET_SUB_DISTRICT,
  GET_ZIPCODE,
  HEADERS_EXPORT,
} from "../component/API/apiUrls";

const GeoThailand = () => {
  const [loadingDataProvice, setLoadingDataProvice] = useState(false);
  const [loadingDataDistrict, setLoadingDataDistrict] = useState(false);
  const [loadingDataSubDistrict, setLoadingDataSubDistrict] = useState(false);
  const [loadingDataZipcode, setLoadingDataZipcode] = useState(false);
  const [dataProvice, setDataProvice] = useState();
  const [dataDistrict, setDataDistrict] = useState();
  const [dataSubDistrict, setDataSubDistrict] = useState();
  const [dataZipcode, setDataZipcode] = useState();
  const [dataSearch, setDataSearch] = useState({
    provice: null,
    District: null,
    subDistrict: null,
  });
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
        .get(GET_PROVICE, {
          HEADERS_EXPORT,
        })
        .then(async (res) => {
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
    console.log("dataSearch---->", dataSearch.provice);
    if (dataSearch.provice) {
      console.log("true---->");
      loadDataDistrict();
    } else {
      console.log("District is falsy or empty");
    }
  }, [dataSearch.provice]);

  const loadDataDistrict = async () => {
    try {
      await axios
        .get(GET_DISTRICT + dataSearch.provice, {
          HEADERS_EXPORT,
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

  useEffect(() => {
    console.log("dataSearch---->", dataSearch.District);
    if (dataSearch.District) {
      console.log("true---->");
      loadDataSubDistrict();
    } else {
      console.log("subDistrict is falsy or empty");
    }
  }, [dataSearch.District]);

  const loadDataSubDistrict = async () => {
    console.log("loadData LoadLawyers");
    try {
      await axios
        .get(GET_SUB_DISTRICT + dataSearch.District, {
          HEADERS_EXPORT,
        })
        .then(async (res) => {
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

  useEffect(() => {
    console.log("dataSearch---->", dataSearch.subDistrict);
    if (dataSearch.subDistrict) {
      console.log("true---->");
      loadDataZipcode();
    } else {
      console.log("zipcode is falsy or empty");
    }
  }, [dataSearch.subDistrict]);

  const loadDataZipcode = async () => {
    console.log("loadData LoadLawyers");
    try {
      await axios
        .get(GET_ZIPCODE + dataSearch.subDistrict, {
          HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            setDataZipcode(res.data);
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
    setLoadingDataDistrict,
    setLoadingDataSubDistrict,
    setLoadingDataZipcode,
    dataProvice,
    dataDistrict,
    dataSubDistrict,
    dataZipcode,
    setDataSearch,
  ];
};

export default GeoThailand;
