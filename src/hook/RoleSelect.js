import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  baseUrl,
  GET_ROLE_LIST,
  HEADERS_EXPORT,
} from "../component/API/apiUrls";

const RoleSelect = () => {
  const [roleList, setroleList] = useState([]);
  const [loadingDataRole, setLoadingDataRole] = useState(false);

  useEffect(() => {
    if (loadingDataRole) {
      loadData();
    }
  }, [loadingDataRole]);

  const loadData = async () => {
    console.log("loadData Role");

    try {
      await axios
        .get(baseUrl + GET_ROLE_LIST, {
          HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            setroleList(res.data);
            console.log("res Role", res.data);
          } else {
            setroleList([]);
            message.error("ไม่มีข้อมูล");
            console.log("res Role", res.data);
          }
        })
        .catch((err) => console.log("ไม่มีข้อมูล", err));
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  return [roleList, setLoadingDataRole];
};

export default RoleSelect;
