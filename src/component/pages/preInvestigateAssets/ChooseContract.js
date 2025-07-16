import {
  Col,
  Row,
  Space,
  Table,
  Card,
  Spin,
  Select,
  DatePicker,
  message,
  Button,
  Tag,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useEffect, useMemo } from "react";
import MotionHoc from "../../../utils/MotionHoc";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  SendOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import {
  baseUrl,
  HEADERS_EXPORT,
  HEADERS_EXPORT_BEN,
  POST_PRE_INVESTIGATE_CHECK,
  POST_PRE_INVESTIGATE_LOG,
} from "../../API/apiUrls";
import DateCustom from "../../../hook/DateCustom";
import CurrencyFormat from "../../../hook/CurrencyFormat";
import { optionsLocat } from "../../../utils/constant/LocatOption";
import LoadLawyers from "../../../hook/LoadLawyers";
import SendToLawsuit from "./modal/SendToLawsuit";

const Main = () => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [loading, setLoading] = useState(false);
  const [arrData, setArrData] = useState([]);
  const [arrayTable, setArrayTable] = useState();
  const [tableLength, setTableLength] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [optionsDataType, setOptionsDataType] = useState();
  const [date, setDate] = useState(dayjs());
  const [typeSelect, setTypeSelect] = useState();
  const [dataType, setDataType] = useState();
  const [selectRangeTime, setSelectRangeTime] = useState();
  const [selectProgressData, setSelectProgessData] = useState([]);
  const [lawyersList, setLoadingData, loadLawyerJobs] = LoadLawyers();
  const [lawyersOption, setLawyersOption] = useState();
  const [dataJobsLawyer, setDataJobsLawyer] = useState();
  const [isModal, setIsModal] = useState(false);
  const [dataRecord, setDataRecord] = useState();
  const [statusModal, setStatusModal] = useState(null);

  const optionsTime = [
    { value: 0, label: "ทั้งหมด" },
    { value: 30, label: "เคยสืบแล้วเมื่อ 1 เดือน" },
    { value: 90, label: "เคยสืบแล้วเมื่อ 3 เดือน" },
    { value: 120, label: "เคยสืบแล้วเมื่อ 4 เดือน" },
    { value: 180, label: "เคยสืบแล้วเมื่อ 6 เดือน" },
  ];

  const optionsType = [
    { value: "vsfhp", label: "เช่าซื้อ" },
    { value: "rpsl", label: "p-loan" },
  ];

  const optionsStatus = [
    { value: 0, label: "ไม่เจอทรัพย์" },
    { value: 1, label: "เจอทรัพย์" },
    { value: 5, label: "กำลังส่งสืบ" },
    { value: 6, label: "ไม่เจอทรัพย์" },
    { value: 7, label: "เจอทรัพย์" },
  ];

  // 1️⃣ เตรียม baseOptions และ exclusions
  const baseOptions = [
    { value: 0, label: "ทั้งหมด" },
    { value: 1, label: "พร้อมฟ้อง" },
    { value: 2, label: "เจอทรัพย์" },
    { value: 3, label: "ไม่เจอทรัพย์" },
    { value: 4, label: "ออกบอกเลิกแล้ว" },
    { value: 5, label: "ไม่มีบอกเลิก" },
    { value: 6, label: "ยังไม่สืบ" },
    { value: 7, label: "กำลังสืบ" },
  ];

  const exclusions = {
    1: [0, 4, 5, 6, 7],
    2: [6, 7],
    4: [5],
    5: [4, 1],
    6: [7, 2, 1],
    7: [6, 2, 1],
  };

  const optionsForLawsuit = useMemo(() => {
    return baseOptions.map((opt) => {
      let disabled = false;

      // กรณีเลือก "ทั้งหมด"
      if (selectProgressData.includes(0) && opt.value !== 0) {
        disabled = true;
      }

      if (
        opt.value === 0 &&
        selectProgressData.length > 0 &&
        !selectProgressData.includes(0)
      ) {
        disabled = true;
      }

      selectProgressData.forEach((sel) => {
        const conflictList = exclusions[sel];
        if (Array.isArray(conflictList) && conflictList.includes(opt.value)) {
          disabled = true;
        }
      });

      return { ...opt, disabled };
    });
  }, [selectProgressData]);

  useEffect(() => {
    let optionsContract = [];

    optionsContract = [
      { value: "120", label: "ยอดน้อยกว่า 20% ขาดติดต่อ 120 วัน " },
      {
        value: "180",
        label: "เกรด D ขึ้นไป ยอดมากกว่า 20% ขาดติดต่อ 180 วัน ",
      },
      { value: "270", label: "เกรด D ขึ้นไป ขาดติดต่อ 270 วัน " },
    ];

    setOptionsDataType(optionsContract);
  }, []);

  // useEffect(() => {
  //   setLoadingData(true);
  // }, [setLoadingData]);

  // useEffect(() => {
  //   if (lawyersList && loadLawyerJobs) {
  //     setOption();
  //     setDataJobsLawyer(loadLawyerJobs);
  //   }
  // }, [lawyersList, loadLawyerJobs]);

  // const setOption = () => {
  //   let companySelect = null;

  //   if (userCompany === "1" || userCompany === "2") {
  //     companySelect = lawyersList.filter(
  //       (item) =>
  //         (item.COMPANY_ID === 1 || item.COMPANY_ID === 2) &&
  //         item.ROLE_ID === 3 &&
  //         item.ACTIVE_STATUS === 1
  //     );
  //   } else {
  //     companySelect = lawyersList.filter(
  //       (item) =>
  //         item.COMPANY_ID === 3 &&
  //         item.ROLE_ID === 3 &&
  //         item.ACTIVE_STATUS === 1
  //     );
  //   }
  //   const options = companySelect.map((item) => ({
  //     value: item.id,
  //     label: item.NNAME,
  //   }));
  //   setLawyersOption(options);
  // };

  const onQueryData = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setSelectRangeTime(null);

    if (typeSelect && date && dataType) {
      loadData();
    } else {
      message.error("กรุณาเลือกข้อมูลให้ครบ");
    }
  };

  const handlefilterData = () => {
    if (selectProgressData === null && !selectRangeTime === null) {
      return message.error("กรุณาเลือกข้อมูลก่อน !");
    }

    let dataSelect;
    console.log("selectProgressData", selectProgressData);
    console.log("selectRangeTime", selectRangeTime);

    if (selectRangeTime > 1) {
      console.log("if > 1");
      dataSelect = arrData.filter((item) => {
        const daysDiff = dayjs().diff(dayjs(item.investigationDate), "day");
        // console.log(
        //   `CONTNO: ${item.CONTNO}, investigationDate: ${item.investigationDate}, daysDiff: ${daysDiff}`
        // );
        return daysDiff > selectRangeTime;
      });
    } else if (selectRangeTime === 1) {
      console.log("if === 1");
      dataSelect = arrData.filter(
        (item) =>
          item.investigationStatus === 6 ||
          !dayjs(item.investigationDate).isValid()
      );
    } else {
      console.log("else");
      dataSelect = arrData;
    }

    if (selectProgressData.includes(1)) {
      dataSelect = dataSelect.filter(
        (item) =>
          (item.investigationStatus !== 5 || !item.investigationDate) &&
          item.wcc.every((w) => w.status) &&
          item.wcc.length > 0
      );
    }

    if (selectProgressData.includes(2)) {
      dataSelect = dataSelect.filter((item) => item.investigationStatus === 7);
    }

    if (selectProgressData.includes(3)) {
      dataSelect = dataSelect.filter((item) => item.investigationStatus === 6);
    }

    if (selectProgressData.includes(4)) {
      dataSelect = dataSelect.filter((item) => item.wcc.length > 0);
    }

    if (selectProgressData.includes(5)) {
      dataSelect = dataSelect.filter((item) => item.wcc.length === 0);
    }
    console.log("dataSelect", dataSelect);

    if (selectProgressData.includes(6)) {
      dataSelect = dataSelect.filter((item) => !item.investigationDate);
    }

    if (selectProgressData.includes(7)) {
      dataSelect = dataSelect.filter((item) => item.investigationStatus === 5);
    }

    if (selectProgressData.includes(2) && selectProgressData.includes(3)) {
      dataSelect = arrData.filter(
        (item) => item.investigationStatus === 7 || item.investigationDate === 6
      );
    }

    if (selectProgressData.includes(3) && selectProgressData.includes(6)) {
      dataSelect = arrData.filter(
        (item) => item.investigationStatus === 6 || !item.investigationDate
      );
    }

    if (selectProgressData.includes(3) && selectProgressData.includes(7)) {
      dataSelect = arrData.filter(
        (item) =>
          item.investigationStatus === 6 || item.investigationStatus === 5
      );
    }

    if (
      selectProgressData.includes(1) &&
      selectProgressData.includes(2) &&
      selectProgressData.includes(3)
    ) {
      dataSelect = arrData.filter(
        (item) =>
          (item.investigationStatus !== 5 || !item.investigationDate) &&
          item.wcc.every((w) => w.status) &&
          item.wcc.length > 0
      );
    }

    console.log(dataSelect);
    let i = 1;
    const newDataUse = dataSelect.map((item) => ({
      ...item,
      key: i++,
    }));

    setArrayTable(newDataUse);
    setTableLength(newDataUse.length);
  };

  const handlefilterLoadData = (newData) => {
    if (selectProgressData === null && !selectRangeTime === null) {
      return message.error("กรุณาเลือกข้อมูลก่อน !");
    }

    let dataSelect;
    console.log("selectProgressData", selectProgressData);
    console.log("selectRangeTime", selectRangeTime);

    if (selectRangeTime > 1) {
      console.log("if > 1");
      dataSelect = newData.filter((item) => {
        const daysDiff = dayjs().diff(dayjs(item.investigationDate), "day");
        // console.log(
        //   `CONTNO: ${item.CONTNO}, investigationDate: ${item.investigationDate}, daysDiff: ${daysDiff}`
        // );
        return daysDiff > selectRangeTime;
      });
    } else if (selectRangeTime === 1) {
      console.log("if === 1");
      dataSelect = newData.filter(
        (item) =>
          item.investigationStatus === 6 ||
          !dayjs(item.investigationDate).isValid()
      );
    } else {
      console.log("else");
      dataSelect = newData;
    }

    if (selectProgressData.includes(1)) {
      dataSelect = dataSelect.filter(
        (item) =>
          (item.investigationStatus !== 5 || !item.investigationDate) &&
          item.wcc.every((w) => w.status) &&
          item.wcc.length > 0
      );
    }

    if (selectProgressData.includes(2)) {
      dataSelect = dataSelect.filter((item) => item.investigationStatus === 7);
    }

    if (selectProgressData.includes(3)) {
      dataSelect = dataSelect.filter((item) => item.investigationStatus === 6);
    }

    if (selectProgressData.includes(4)) {
      dataSelect = dataSelect.filter((item) => item.wcc.length > 0);
    }

    if (selectProgressData.includes(5)) {
      dataSelect = dataSelect.filter((item) => item.wcc.length === 0);
    }
    console.log("dataSelect", dataSelect);

    if (selectProgressData.includes(6)) {
      dataSelect = dataSelect.filter((item) => !item.investigationDate);
    }

    if (selectProgressData.includes(7)) {
      dataSelect = dataSelect.filter((item) => item.investigationStatus === 5);
    }

    if (selectProgressData.includes(2) && selectProgressData.includes(3)) {
      dataSelect = newData.filter(
        (item) => item.investigationStatus === 7 || item.investigationDate === 6
      );
    }

    if (selectProgressData.includes(3) && selectProgressData.includes(6)) {
      dataSelect = newData.filter(
        (item) => item.investigationStatus === 6 || !item.investigationDate
      );
    }

    if (selectProgressData.includes(3) && selectProgressData.includes(7)) {
      dataSelect = newData.filter(
        (item) =>
          item.investigationStatus === 6 || item.investigationStatus === 5
      );
    }

    if (
      selectProgressData.includes(1) &&
      selectProgressData.includes(2) &&
      selectProgressData.includes(3)
    ) {
      dataSelect = newData.filter(
        (item) =>
          (item.investigationStatus !== 5 || !item.investigationDate) &&
          item.wcc.every((w) => w.status) &&
          item.wcc.length > 0
      );
    }

    console.log(dataSelect);

    let i = 1;
    const newDataUse = dataSelect.map((item) => ({
      ...item,
      key: i++,
    }));

    setArrayTable(newDataUse);
    setTableLength(newDataUse.length);
  };

  const handleChange = (date, string) => {
    console.log(date, string);
    setDate(date);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await axios
        .post(
          POST_PRE_INVESTIGATE_CHECK + typeSelect,
          {
            DATA_TYPE: dataType,
            date: dayjs(date).format("YYYY-MM-DD"),
          },
          {
            headers: HEADERS_EXPORT_BEN,
          }
        )
        .then(async (res) => {
          if (res.status === 200) {
            console.log("loadData ben", res.data);
            filterData(res.data);
          } else {
            message.error("ไม่มีข้อมูล");
            console.log("ไม่สามารถดึงข้อมูลได้", res.status);
            setArrayTable([]);
            setArrData([]);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status >= 300) {
            message.error("ไม่สามารถดึงข้อมูลได้", err.status);
          }
        });
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    }
  };

  const filterData = (value) => {
    if (Array.isArray(value)) {
      console.log("value", value);
      let filteredData;
      if (userCompany === "3") {
        filteredData = value.filter((item) => {
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
        filteredData = value.filter((item) => {
          const branch = item.LOCAT;
          if (!branch) return false; // ไม่มี branch ไม่ผ่านเงื่อนไข

          return optionsLocat.some((opt) => branch.includes(opt.label));
        });
      }

      handlefilterLoadData(filteredData);
      setArrData(filteredData);
      // setArrayTable(newData);
      // setTableLength(newData.length);
      setLoading(false);
    }
  };

  const handleChangeType = (value) => {
    console.log(value);
    setTypeSelect(value);
    const setProgress =
      value === "270" ? [1, 2, 3] : value === "180" ? [3, 6] : [6];

    console.log(setProgress);

    setSelectProgessData(setProgress);
  };

  const handleChangeDataType = (value) => {
    console.log(value);
    setDataType(value);
  };

  const search = (event) => {
    console.log("query--->", event);
    if (event) {
      onSearch(event.target.value);
    } else {
      console.log("query--->", event.target.value);
    }
  };

  const onSearch = (value) => {
    if (value) {
      let result = arrData.filter((item) => item.CONTNO.includes(value));
      setArrayTable(result);
      setTableLength(result.length);
    } else {
      setArrayTable(arrData);
      setTableLength(arrData.length);
    }
  };
  console.log("queryData ImportData--->", selectedRows);

  const queryMultiData = async (value) => {
    setLoading(true);

    // "http://localhost:8080/lawyer/dev/api/pre-investigate-assets",
    try {
      await axios
        .post(
          baseUrl + POST_PRE_INVESTIGATE_LOG,
          {
            status: value,
            data: selectedRows,
            dataLawsuit: {},
          },
          {
            headers: HEADERS_EXPORT,
          }
        )
        .then(async (resQuery) => {
          if (resQuery.status === 201) {
            console.log("resQuery", resQuery.data);
          } else {
            console.log(`Contract No. Not Found`);

            return null;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      console.log("โหลดข้อมูลสำเร็จ");
      clearSelectedRows();
      setLoading(false);
      loadData();
      // setLoadingData(true);
    }
  };

  const handleDataQuery = (value) => {
    console.log(value);

    if (selectedRows.length > 0) {
      // updateDataConfirm(value);
      queryMultiData(value);
    } else {
      message.error("โปรดเลือกข้อมูล");
    }
  };

  const handleSelect = (value) => {
    console.log(value);
    setSelectRangeTime(value);
  };

  const handleSelectData = (value) => {
    console.log("handleSelectData", value);
    setSelectProgessData(value);
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  // const updateDataConfirm = (value) => {
  //   let tempJobs = [...dataJobsLawyer]; // clone
  //   const assignedRows = [];

  //   selectedRows.forEach((row) => {
  //     // 🔁 หา minJobUser ใหม่ทุกครั้ง
  //     const filtered = tempJobs.filter(
  //       (item) => item.COMPANY_ID !== 3 && item.ACTIVE_STATUS === 1
  //     );

  //     const minJobUser =
  //       filtered.length > 0
  //         ? filtered.reduce((min, item) =>
  //             item.USER_JOBS < min.USER_JOBS ? item : min
  //           )
  //         : null;

  //     if (!minJobUser) return;

  //     // ⏺ อัปเดต row
  //     const updatedRow = { ...row, USER_ID: minJobUser.USER_ID };
  //     assignedRows.push(updatedRow);

  //     // ⏺ เพิ่ม JOB ใน tempJobs เพื่ออัปเดตในรอบถัดไป
  //     tempJobs = tempJobs.map((job) =>
  //       job.USER_ID === minJobUser.USER_ID
  //         ? { ...job, USER_JOBS: job.USER_JOBS + 1 }
  //         : job
  //     );
  //   });

  //   // ✅ เซตผลลัพธ์ที่อัปเดตแล้ว
  //   setSelectedRows(assignedRows);
  //   setDataJobsLawyer(tempJobs);

  //   console.log("assignedRows", assignedRows);
  //   console.log("updated tempJobs", tempJobs);

  //   queryMultiData(value, assignedRows);
  // };

  const renderCancelContract = (record) => {
    if (!record.MAIN_STATUS_ID && record.wcc.length === 0) {
      return (
        <Tag color={"red"} style={{ textAlign: "center" }}>
          ยังไม่ส่งบอกเลิก
        </Tag>
      );
    }

    const cancelStatus =
      record.wcc.length > 0 && record.wcc.every((item) => item.dateResponse);

    return (
      <div>
        {record.wcc.length > 0 && cancelStatus ? (
          <Tag
            color="green"
            style={{ textAlign: "center", padding: "2px 10px" }}
          >
            ตอบกลับครบแล้ว
          </Tag>
        ) : record.wcc.length > 0 && !cancelStatus ? (
          <Tag
            color="gold"
            style={{ textAlign: "center", padding: "2px 10px" }}
          >
            ตอบกลับบางส่วน
          </Tag>
        ) : record.MAIN_STATUS_ID === 1 && record.PROCESS_ID === 1 ? (
          <Tag
            color="blue"
            style={{ textAlign: "center", padding: "2px 10px" }}
          >
            แจ้งเจ้าหน้าที่ออกบอกเลิก
            <br />
            <span>เมื่อ {convertDateThaiShort(record.date_working_log)}</span>
          </Tag>
        ) : record.MAIN_STATUS_ID === 1 && record.PROCESS_ID === 3 ? (
          <Tag
            color="purple"
            style={{ textAlign: "center", padding: "2px 10px" }}
          >
            เจ้าหน้าที่ดำเนินการ
          </Tag>
        ) : null}
      </div>
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys, selectedRows) => {
      onSelectChange(rowKeys, selectedRows);
    },
  };

  const columns = [
    {
      title: "ลำดับ",
      align: "center",
      dataIndex: "key",
      render: (text, record) => (
        <span style={{ fontWeight: "bold" }}>{record.key}</span>
      ),
    },
    {
      title: "เลขสัญญา",
      align: "center",
      render: (record) => <span style={{ fontSize: 14 }}>{record.CONTNO}</span>,
    },
    {
      title: "จ่ายล่าสุด",
      align: "center",
      render: (text, record) => (
        <div>
          <div
            style={{
              fontWeight: "bold",
              color: "#1890ff",
            }}
          >
            {record.GREATEST_DATE === record.TEMPDATE ? "รับฝาก" : "เข้างวด"}
          </div>
          <div style={{ fontSize: 12, color: "#888" }}>
            {convertDateThaiShort(record.GREATEST_DATE)}
          </div>
        </div>
      ),
    },
    {
      title: "สถานะ",
      align: "center",
      render: (text, record) => (
        <div>
          <div style={{ color: "red" }}>เกรด {record.GRDCOD}</div>
          <div style={{ fontSize: 12, color: "#888" }}>
            ขาดการติดต่อ {record.days} วัน
          </div>
        </div>
      ),
    },
    {
      title: "สถานะสืบทรัพย์",
      align: "center",
      render: (text, record) => (
        <div>
          {record.investigationDate ? (
            <>
              <div
                style={{
                  fontWeight: "bold",
                  color:
                    record.investigationStatus === 7 ||
                    record.investigationStatus === 1
                      ? "green"
                      : record.investigationStatus === 6 ||
                        record.investigationStatus === 0
                      ? "red"
                      : "#1890ff",
                }}
              >
                {optionsStatus.find(
                  (item) => item.value === record.investigationStatus
                )?.label || "-"}
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {convertDateThaiShort(record.investigationDate)}
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {record.investigationStatus > 4 ? "ก่อนฟ้อง" : "หลังฟ้อง"}
              </div>
            </>
          ) : (
            <div
              style={{
                color: "red",
              }}
            >
              ยังไม่เคยสืบ
            </div>
          )}
        </div>
      ),
    },
    {
      title: "สถานะออกบอกเลิก",
      align: "center",
      render: (text, record) => <>{renderCancelContract(record)}</>,
    },
    {
      title: "รายละเอียด",
      dataIndex: "CONTNO",
      key: "CONTNO",
      align: "center",
      render: (text, record) => (
        <div style={{ lineHeight: 1.6 }}>
          <div>
            ยอดจัด <b>{currencyFormatComma(record.BALANC)}</b> บาท
          </div>
          <div>
            ชำระรวม <b>{currencyFormatComma(record.SMPAY)}</b> บาท
          </div>
          <div>
            คงเหลือ{" "}
            <span style={{ color: "#f5222d", fontWeight: "bold" }}>
              {(((record.BALANC - record.SMPAY) / record.BALANC) * 100).toFixed(
                0
              )}
              %
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "การจัดการ",
      align: "center",
      render: (text, record) => (
        <div style={{ lineHeight: 1.6 }}>
          <Button
            type="primary"
            danger={
              (((record.BALANC - record.SMPAY) / record.BALANC) * 100).toFixed(
                0
              ) >= 10
            }
            ghost
            icon={<SendOutlined />} // ไอคอน
            size="small" // ขนาดเล็ก
            onClick={() => {
              if (
                (
                  ((record.BALANC - record.SMPAY) / record.BALANC) *
                  100
                ).toFixed(0) <= 10
              ) {
                setStatusModal(9);
              } else {
                setStatusModal(2);
                setDataRecord(record);
                setIsModal(true);
              }
              // console.log(
              //   (
              //     ((record.BALANC - record.SMPAY) / record.BALANC) *
              //     100
              //   ).toFixed(0)
              // );
            }}
            loading={loading}
            disabled={selectedRowKeys.length > 0}
          >
            {(((record.BALANC - record.SMPAY) / record.BALANC) * 100).toFixed(
              0
            ) <= 10
              ? "ส่งเจรจา"
              : "ส่งฟ้อง"}
          </Button>
        </div>
      ),
    },
  ];

  const clearSelectedRows = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col span={"12"} style={{ textAlign: "start" }}>
              <Select
                style={{
                  width: "auto",
                  marginRight: "5px",
                  marginBottom: "5px",
                }}
                placeholder="เลือกสัญญา"
                onChange={handleChangeDataType}
                popupMatchSelectWidth={false}
                options={optionsType}
                size="large"
              />
              <Select
                style={{
                  width: "auto",
                  marginRight: "5px",
                  marginBottom: "5px",
                }}
                placeholder="ระยะเวลาขาดการติดต่อ"
                onChange={handleChangeType}
                popupMatchSelectWidth={false}
                options={optionsDataType}
                size="large"
              />
            </Col>
            <Col span={"12"} style={{ textAlign: "end", marginTop: "5px" }}>
              <Select
                style={{
                  width: "auto",
                  marginRight: "5px",
                  marginBottom: "5px",
                }}
                placeholder="เลือกระยะเวลา"
                onChange={handleSelect}
                popupMatchSelectWidth={false}
                options={optionsTime}
                value={selectRangeTime}
                size="large"
              />
              <Select
                style={{
                  width: selectProgressData.length > 0 ? "auto" : "180px",
                  marginRight: "5px",
                  marginBottom: "5px",
                }}
                onChange={handleSelectData}
                popupMatchSelectWidth={false}
                options={optionsForLawsuit}
                value={selectProgressData}
                size="large"
                mode="multiple"
                allowClear
                placeholder="เลือกตัวกรองข้อมูล"
              />

              <Button
                type="default"
                icon={<FilterOutlined />}
                size="large"
                style={{
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  fontWeight: "bold",
                  backgroundColor: "#fff7d6", // เหลืองอ่อน
                  color: "#333", // สีตัวหนังสือเข้ม
                  border: "1px solid #ffe58f", // ขอบสีเหลือง
                }}
                onClick={handlefilterData}
              >
                กรองข้อมูล
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={"12"} style={{ textAlign: "start" }}>
              <Space size={16}>
                <DatePicker
                  size="large"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                  onChange={handleChange}
                  value={date}
                />
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  size="large"
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    fontWeight: "bold",
                    background: "linear-gradient(135deg, #667eea, blue)",
                    border: "none",
                  }}
                  onClick={onQueryData}
                >
                  ค้นหา
                </Button>
              </Space>
            </Col>
            <Col span={"12"} style={{ textAlign: "end", marginTop: "5px" }}>
              <Search
                placeholder="ค้นหาสัญญา"
                enterButton
                onChange={search}
                style={{
                  width: 250,
                  borderRadius: "8px",
                }}
                size="large"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Space size={16} style={{ marginTop: "10px" }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />} // ไอคอน
                  size="small" // ขนาดเล็ก
                  onClick={() => handleDataQuery(15)}
                  disabled={
                    selectedRowKeys.length === 0 || selectedRowKeys.length > 100
                  }
                  loading={loading}
                >
                  ส่งสืบทรัพย์
                </Button>

                <Button
                  type="primary"
                  danger
                  icon={<PlusOutlined />}
                  size="small"
                  // onClick={() => handleDataQuery(1)}
                  onClick={() => {
                    console.log("sssssss", typeSelect);
                  }}
                  disabled={
                    typeSelect === "270"
                      ? selectedRowKeys.length === 0 ||
                        selectedRowKeys.length > 100
                      : true
                  }
                  loading={loading}
                >
                  ส่งออกบอกเลิก
                </Button>
              </Space>
            </Col>
          </Row>
          <Row>
            <Col span={"24"}>
              <Table
                style={{ marginTop: "10px" }}
                size="small"
                columns={columns}
                dataSource={arrayTable}
                rowSelection={rowSelection}
                scroll={{ x: 850 }}
                footer={() => <p>จำนวนสัญญาที่ค้นหาทั้งหมด {tableLength} </p>}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? (
        <SendToLawsuit
          open={isModal}
          close={setIsModal}
          dataDefault={dataRecord}
          funcUpdateStatus={onQueryData}
          statusModal={statusModal}
        />
      ) : null}
    </>
  );
};

const ChooseContract = MotionHoc(Main);
export default ChooseContract;
