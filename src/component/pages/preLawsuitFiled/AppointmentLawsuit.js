import { Col, Row, Card, message, Spin, Badge, Calendar } from "antd";
import React, { useEffect, useState } from "react";
import MotionHoc from "../../../utils/MotionHoc";
import { baseUrl, GET_LAWSUIT_LIST, HEADERS_EXPORT } from "../../API/apiUrls";
import axios from "axios";
import { optionsLocat } from "../../../utils/constant/LocatOption";
import dayjs from "dayjs";
import AppoointmentData from "./modal/AppoointmentData";

const Main = () => {
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const [dataArr, setDataArr] = useState();
  const companyId = localStorage.getItem("COMPANY_ID");
  const [isModal, setIsModal] = useState(false);
  const [dataModal, setDataModal] = useState([]);
  const [dateSelect, setDateSelect] = useState("");
  const [loading, setLoading] = useState(false);
  const [panelMode, setPanelMode] = useState("month");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(baseUrl + GET_LAWSUIT_LIST, {
        headers: HEADERS_EXPORT,
      });
      if (response.data) {
        let i = 1;
        if (response.data) {
          const newData = response.data.map((item) => ({
            ...item,
            key: i++,
          }));
          filterDataLawyer(newData);
          console.log(newData);
          setLoading(false);
        }
      } else {
        dataArr([]);
      }
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    }
  };

  const filterDataLawyer = (data) => {
    if (Array.isArray(data)) {
      const newData = data.filter(
        (item) =>
          (item.USER_ID === userId || ROLE_ID === "1" || ROLE_ID === "2") &&
          item.consideration_date &&
          item.black_case_number
      );

      let filteredData;

      if (companyId === "3") {
        filteredData = newData.filter((item) => {
          const branch = item.LOCAT;
          // ถ้า branch เป็น null หรือ undefined ให้ return true ไปเลย (หรือ false ก็ได้ ขึ้นกับความต้องการ)
          if (!branch) return true; // หรือ false ก็ได้ ถ้าอยาก "กรองออก"

          // ถ้า branch มีค่า → เช็กตามปกติ
          return (
            !optionsLocat.some((opt) => branch.includes(opt.label)) ||
            item.CONTNO.includes("UD")
          );
        });
      } else {
        filteredData = newData.filter((item) => {
          const branch = item.LOCAT;
          if (!branch) return false; // ไม่มี branch ไม่ผ่านเงื่อนไข

          return optionsLocat.some((opt) => branch.includes(opt.label));
        });
      }

      setDataArr(filteredData);

      console.log("newData", filteredData);
      console.log("Length of filtered data:", filteredData.length);
    } else {
      console.error("data is not an array or is undefined");
    }
  };

  const getListData = (value) => {
    return (
      dataArr?.filter((item) =>
        dayjs(item.consideration_date).isSame(value, "day")
      ) || []
    );
  };

  const getMonthCount = (value) => {
    const targetMonth = value.month(); // 0-11
    const targetYear = value.year();

    const filtered = dataArr?.filter((item) => {
      const date = dayjs(item.consideration_date);
      return date.year() === targetYear && date.month() === targetMonth;
    });

    return filtered?.length || 0;
  };

  const monthCellRender = (value) => {
    const count = getMonthCount(value);

    return count > 0 ? (
      <div style={{ textAlign: "center", paddingTop: 8 }}>
        <Badge count={count} style={{ backgroundColor: "blue" }} />
      </div>
    ) : null;
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  // ใช้ render วันที่ (date cell)
  const dateCellRender = (value) => {
    const listData = getListData(value);
    const count = listData.length;

    return (
      <>
        {count > 0 && (
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <Badge count={count} style={{ backgroundColor: "blue" }} />
          </div>
        )}
        <ul className="events">
          {listData?.map((item, index) => {
            return (
              <li key={index}>
                <Badge
                  status="success"
                  text={
                    <div style={{ whiteSpace: "normal" }}>
                      <div>{item.black_case_number || "ไม่ระบุเลขคดี"}</div>
                      <div>ศาล{item.provincial_court || "ไม่ระบุศาล"}</div>
                      <div>
                        เวลา
                        {dayjs
                          .utc(item.consideration_date)
                          .format("HH:mm")} น.{" "}
                      </div>
                    </div>
                  }
                />
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  const handleDateSelect = (date) => {
    console.log("วันที่ถูกเลือก:", date.format("YYYY-MM-DD"));

    const selectedListDay = dataArr.filter((item) =>
      dayjs(item.consideration_date).isSame(date, "day")
    );

    const selectedListMonth = dataArr.filter((item) =>
      dayjs(item.consideration_date).isSame(date, "month")
    );
    console.log("selectedListDay", selectedListDay);
    console.log("selectedListMonth", selectedListMonth);

    if (selectedListDay.length > 0 && panelMode === "month") {
      setDateSelect(date.format("YYYY-MM-DD"));
      setDataModal(selectedListDay);
      setIsModal(true);
    } else {
      setDateSelect(date.format("YYYY-MM-DD"));
      setDataModal(selectedListMonth);
      setIsModal(true);
    }
  };

  const handlePanelChange = (value, mode) => {
    setPanelMode(mode);
    console.log(mode);
  };

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col span={"24"}>
              <Calendar
                cellRender={cellRender}
                onSelect={handleDateSelect}
                onPanelChange={handlePanelChange}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? (
        <AppoointmentData
          open={isModal}
          close={setIsModal}
          dataRec={dataModal}
          date={dateSelect}
          panel={panelMode}
        />
      ) : null}
    </>
  );
};

const appointmentLawsuit = MotionHoc(Main);
export default appointmentLawsuit;
