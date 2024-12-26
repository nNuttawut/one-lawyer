import axios from "axios";
import { useEffect, useState } from "react";
import {
  baseUrl,
  GET_JOB_IN_PROGRESS,
  HEADERS_EXPORT,
} from "../component/API/apiUrls";
import TokenCheck from "./TokenCheck";

const WorkInProgress = () => {
  const [dataLoad, setDataLoad] = useState(false);
  const [loadingDataWork, setLoadingDataWork] = useState(false);

  useEffect(() => {
    if (loadingDataWork) {
      loadData();
    }
  }, [loadingDataWork]);

  const loadData = async (data) => {
    console.log(data);
    try {
      const response = await axios.get(baseUrl + GET_JOB_IN_PROGRESS, {
        headers: HEADERS_EXPORT,
      });
      if (response.data) {
        let i = 1;
        if (response.data) {
          const newData = response.data.map((item) => ({
            ...item,
            key: i++,
          }));
          setDataLoad(newData);
          console.log("newData", newData);
        }
      }
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return [dataLoad, setLoadingDataWork];
};

export default WorkInProgress;
