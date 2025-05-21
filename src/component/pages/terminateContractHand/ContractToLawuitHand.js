import {
  Col,
  Row,
  Table,
  Card,
  Button,
  message,
  Spin,
  Select,
  Checkbox,
  Popconfirm,
  Space,
  DatePicker,
  Tag,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useEffect } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import LoadLawyers from "../../../hook/LoadLawyers";
import { optionsLaw } from "../../../utils/constant/LawTypeConstant";
import {
  optionsLone,
  MORTGAGE,
  HIRE_PURCASE,
} from "../../../utils/constant/LoanTypeConstant";
import {
  INDICT,
  STATUS_PROCESS_PROGRESS,
} from "../../../utils/constant/StatusConstant";
import {
  POST_STATUS,
  HEADERS_EXPORT,
  baseUrl,
  GET_CANCEL,
  POST_LOAN_IN_LAWYERS_DB,
  GET_LOAN_FROM_SERVER_IBM,
  GET_LOAN_BY_CONTNO,
  PUT_CANCEL,
} from "../../API/apiUrls";
import MotionHoc from "../../../utils/MotionHoc";
import DateCustom from "../../../hook/DateCustom";
import { Link } from "react-router-dom";
import TerminateDetail from "./modal/TerminateDetail";
import dayjs from "dayjs";

const Main = () => {
  //set hook
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [lawyersOption, setLawyersOption] = useState();
  const [isModal, setIsModal] = useState(false);
  const [dataRecord, setDataRecord] = useState();
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const [dataSend, setDataSend] = useState([]);
  const [dataToTable, setDataToTable] = useState([]);
  let [dataFunc, setDataFunc] = useState(0);
  const [tableLength, setTableLength] = useState(0);
  const roleId = localStorage.getItem("ROLE_ID");
  const companyId = localStorage.getItem("COMPANY_ID");
  const [loanData, setLoanData] = useState(null);
  const defaultValue = [1];

  //call redux action
  // const dispatch = useDispatch();

  useEffect(() => {
    loadData();
    setLoadingData(true);
  }, [setLoadingData]);

  useEffect(() => {
    if (lawyersList) {
      setOption();
    }
  }, [lawyersList]);

  const setOption = () => {
    let companySelect = null;

    if (companyId === "1" || companyId === "2") {
      companySelect = lawyersList.filter(
        (item) =>
          (item.COMPANY_ID === 1 || item.COMPANY_ID === 2) &&
          item.ROLE_ID === 3 &&
          item.ACTIVE_STATUS === 1
      );
    } else {
      companySelect = lawyersList.filter(
        (item) =>
          item.COMPANY_ID === 3 &&
          item.ROLE_ID === 3 &&
          item.ACTIVE_STATUS === 1
      );
    }
    const options = companySelect.map((item) => ({
      value: item.id,
      label: item.NNAME,
    }));
    setLawyersOption(options);
  };

  const loadData = async () => {
    setLoading(true);
    // const tk = JSON.parse(token);
    console.log("loadData AssignLawyers");
    try {
      await axios
        .get(baseUrl + GET_CANCEL, {
          headers: HEADERS_EXPORT,
        })
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            let i = 1;
            const newData = resQuery.data.map((item) => ({
              ...item,
              key: i++,
            }));
            console.log("ไม่มีข้อมูล", newData);

            filterDataLawyer(newData);
          } else {
            setArrayTable([]);
            message.error("ไม่มีข้อมูล");
            console.log("ไม่มีข้อมูล");
            setLoading(false);
          }
        })
        .catch((err) => console.log("ไม่มีข้อมูล", err));
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const filterDataLawyer = (value) => {
    console.log(value);

    function containsNumber(str) {
      return /\d/.test(str); // เช็คว่า str เป็นตัวเลขทั้งหมด
    }

    function isEnglishOnly(str) {
      return /^[A-Za-z]+$/.test(str); // เช็คว่า str เป็นตัวอักษรภาษาอังกฤษทั้งหมด
    }

    const preData = value.filter((item) =>
      item.parcel_list.every(
        (parcel) =>
          parcel.account_type === "cancelHand" &&
          (parcel.status === 1 || parcel.status === 2 || parcel.status === 3)
      )
    );
    console.log("preData--->", preData);

    let filteredData;

    if (companyId === "3") {
      filteredData = preData.filter((item) => {
        const containsEng = item.contract_no.substring(0, 1) === "4";
        // ถ้า 2 เป็นภาษาอังกฤษทั้งหมด
        // if (isEnglishOnly(item.contract_no.substring(0, 2)) || containsEng) {
        //   return item;
        // } else {
        //   return false;
        // }
        if (item.contract_schema === "ksm") {
          return item;
        } else {
          return false;
        }
      });
    } else {
      filteredData = preData.filter((item) => {
        const containsNo = containsNumber(item.contract_no.substring(0, 2)); // ตรวจสอบว่า 2 ตัวแรกมีตัวเลขไหม
        const containsEngFirst = isEnglishOnly(
          item.contract_no.substring(0, 1)
        ); // ตรวจสอบว่า 1 ตัวแรกมีเป็น eng
        const containsEng = item.contract_no.substring(0, 1) === "4";
        // ถ้า 2 ตัวแรกไม่ใช่ตัวเลข และไม่ได้เป็นภาษาอังกฤษทั้งหมด
        // if ((containsNo || containsEngFirst) && !containsEng) {
        //   return item; // เก็บ item นี้ไว้
        // } else {
        //   return false; // ไม่เก็บ item นี้ (กรณีเป็นภาษาอังกฤษทั้งหมด หรือมีตัวเลขใน 2 ตัวแรก)
        // }
        if (item.contract_schema !== "ksm") {
          return item;
        } else {
          return false;
        }
      });
    }
    console.log("filteredData3", filteredData);
    setArrayTable(filteredData);
    setDataArr(filteredData);
    setTableLength(filteredData.length);
  };

  //   const insertDataAll = async () => {
  //     setLoading(true);
  //     let setSucess = 0;
  //     console.log("dataSend all", dataSend);
  //     try {
  //       if (!dataSend || dataSend.length === 0) {
  //         message.error("กรุณาเลือกทนาย");
  //         setSucess = 5555;
  //         setLoading(false);
  //         return;
  //       }

  //       const promises = dataSend.map(async (item) => {
  //         let arrayData = item;
  //         console.log("arrayData", arrayData);

  //         if (arrayData) {
  //           if (arrayData) {
  //             if (arrayData?.LAW_TYPE_ID && arrayData?.LOAN_TYPE_ID) {
  //               arrayData = dataSend;
  //               console.log(
  //                 "arrayData.LAW_TYPE_ID && arrayData.LOAN_TYPE_ID",
  //                 arrayData
  //               );
  //             }
  //             if (!arrayData?.LAW_TYPE_ID) {
  //               arrayData = {
  //                 ...arrayData,
  //                 LAW_TYPE_ID: 1,
  //               };
  //               console.log("!arrayData.LAW_TYPE_ID", arrayData);
  //             }
  //             if (!arrayData?.LOAN_TYPE_ID) {
  //               arrayData = {
  //                 ...arrayData,
  //                 LOAN_TYPE_ID:
  //                   arrayData.contno.substring(0, 1) === "2"
  //                     ? HIRE_PURCASE
  //                     : MORTGAGE,
  //               };
  //               console.log("!arrayData.LOAN_TYPE_ID", arrayData);
  //             }
  //           }
  //         }
  //         console.log("arrayData---->ALL", arrayData);
  //         if (!arrayData.USER_ID) {
  //           message.warning(`พบข้อมูลกรอกไม่ครบ`, arrayData.LOAN_ID);
  //           setTimeout(() => {
  //             reloadPage();
  //           }, 1000);
  //         } else {
  //           await axios
  //             .post(baseUrl + POST_STATUS, arrayData, { headers: HEADERS_EXPORT })
  //             .then((resQuery) => {
  //               if (resQuery.status === 201) {
  //                 console.log("arrayData.LOAN_ID", arrayData.LOAN_ID);
  //                 setSucess += 1;
  //                 setDataToTable((pre) => [...pre, { id: arrayData.LOAN_ID }]);
  //                 return resQuery.data;
  //               } else {
  //                 console.log(`ไม่สามารถมอบหมายงานได้`, arrayData.LOAN_ID);
  //                 message.error(`ไม่สามารถมอบหมายงานได้`);
  //                 return null;
  //               }
  //             })
  //             .catch((err) => {
  //               console.error(err);
  //               message.error(`งานถูกมอบหมายให้ทนายแล้ว`);
  //               setSucess = 999;
  //               return null;
  //             });
  //         }
  //       });
  //       const results = await Promise.all(promises);
  //       console.log("results Promise", results);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       message.error("พบข้อมูลกรอกไม่ครบ");
  //     } finally {
  //       setLoading(false);
  //       if (setSucess === dataSend.length) {
  //         message.success(`มอบหมายงานให้ทนายเสร็จสิ้น ${dataSend.length} สัญญา`);
  //       }

  //       setDataFunc((dataFunc += 1));
  //       setDataSend([]);
  //       console.log("finally---->", dataFunc);
  //       if (setSucess === 999) {
  //         reloadPage();
  //       }
  //     }
  //   };

  const queryLoan = async (record) => {
    setLoading(true);
    // const tk = JSON.parse(token);
    let companyUse;
    console.log("queryData ImportData");
    if (companyId === "1" || companyId === "2") {
      companyUse = "1";
    } else {
      companyUse = "2";
    }
    const data = dataSend.find((item) => item.contno === record.contract_no);
    if (!data || dataSend?.length < 0) {
      message.error("กรุณาเลือกทนาย");
      setLoading(false);
    } else {
      try {
        await axios
          .get(baseUrl + GET_LOAN_FROM_SERVER_IBM, {
            params: { contractNo: record.contract_no, company: companyUse },
            headers: HEADERS_EXPORT,
          })
          .then(async (resQuery) => {
            if (resQuery.status === 200) {
              insertData(resQuery.data, record);
              console.log("resQuery", resQuery.data);
              setLoading(false);
            } else {
              setArrayTable([]);
              message.error("ไม่มีเลขที่สัญญาที่เลือกในระบบ");
              console.log("ไม่มีเลขที่สัญญาที่ค้นหา");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);

            message.error("ไม่มีเลขที่สัญญาที่เลือกในระบบ");
          });
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    }
  };

  const getLoan = async (contno, record) => {
    setLoading(true);
    // const tk = JSON.parse(token);
    try {
      await axios
        .get(baseUrl + GET_LOAN_BY_CONTNO + contno, {
          headers: HEADERS_EXPORT,
        })
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            setLoanData(resQuery.data);
            insertDataOne(resQuery.data, record);
            console.log("resQuery", resQuery.data);
            setLoading(false);
          } else {
            setArrayTable([]);
            message.error("ไม่มีเลขที่สัญญาที่ค้นหา");
            console.log("ไม่มีเลขที่สัญญาที่ค้นหา");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 404) {
            message.error("ไม่มีเลขที่สัญญาที่ค้นหา");
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const insertData = async (data, record) => {
    setLoading(true);
    console.log("post data");
    try {
      if (!dataSend || dataSend.length < 0) {
        message.error("กรุณาเลือกทนาย");
        setLoading(false);
        return;
      } else {
        await axios
          .post(baseUrl + POST_LOAN_IN_LAWYERS_DB, data, {
            headers: HEADERS_EXPORT,
          })
          .then((resQuery) => {
            if (resQuery.status === 201) {
              console.log(resQuery.data);
              getLoan(data.LOAN.CONTNO, record);
              return resQuery.data;
            } else {
              if (resQuery.data === "Duplicate Contract No.") {
                console.log(`มีเลขสัญญาอยู่ในระบบแล้ว`);
                message.error(
                  "มีเลขสัญญาอยู่ในระบบแล้วให้ไปที่เมนูมอบงานให้ทนาย"
                );
                return null;
              }
              console.log(`นำเข้าข้อมูลสำเร็จไม่สำเร็จ `);
              message.success(`นำเข้าข้อมูลสำเร็จ`);
              return null;
            }
          })
          .catch((err) => {
            console.error(err);
            message.error(`นำเข้าข้อมูลไม่สำเร็จ`);
            return null;
          });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const insertDataOne = async (value, record) => {
    setLoading(true);
    const data = dataSend.find((item) => item.contno === value.LOAN.CONTNO);
    let dataApprove = data;
    dataApprove = {
      ...dataApprove,
      LOAN_ID: value.LOAN.id,
    };
    if (dataSend) {
      console.log(data);
      if (!data.LAW_TYPE_ID) {
        dataApprove = {
          ...dataApprove,
          LAW_TYPE_ID: 1,
        };
      }
      if (!data.LOAN_TYPE_ID) {
        dataApprove = {
          ...dataApprove,
          LOAN_TYPE_ID: HIRE_PURCASE,
        };
      }
      if (data?.LAW_TYPE_ID && data?.LOAN_TYPE_ID) {
        dataApprove = data;
      }
    }
    console.log("dataApprove", dataApprove);
    try {
      await axios
        .post(baseUrl + POST_STATUS, dataApprove, { headers: HEADERS_EXPORT })
        .then((resQuery) => {
          if (resQuery.status === 200) {
            message.success(
              `มอบหมายงานให้ทนายเสร็จสิ้น ${dataApprove.contno} สัญญา`
            );

            return resQuery.data;
          }
        })
        .catch((err) => {
          console.error(err);
          message.error(`งานถูกมอบหมายให้ทนายแล้ว`);
          return null;
        });

      const promises = record.parcel_list.map(async (item) => {
        let arrayData = item;
        arrayData = {
          ...arrayData,
          status_process: 1,
        };
        console.log("arrayData", arrayData);
        if (!arrayData) {
          message.warning("พบค่า CONTNO ที่ไม่ถูกต้อง");
          return null;
        }
        await axios
          .put(baseUrl + PUT_CANCEL, arrayData, {
            headers: HEADERS_EXPORT,
          })
          .then((resQuery) => {
            if (resQuery.status === 200) {
              console.log(resQuery.data);
              handleChangeStatus({
                ...arrayData,
              });
              return resQuery.data;
            }
          })
          .catch((err) => {
            console.error(err);
            return null;
          });
      });

      const response = await Promise.all(promises);
      console.log("results", response);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("กรุณาเลือกทนาย");
      setLoading(false);
    } finally {
      console.log("dataSend 1 ---->", dataSend);
      setLoading(false);
      setDataSend(null);
      console.log("dataSend 2 ---->", dataSend);
      console.log(dataApprove);
    }
  };

  const onChangeSelect = (value, contno, id) => {
    console.log(`selected ${value} contno ${contno} id ${id}`);
    onApporvedData(value, contno, id);
  };

  const onApporvedData = (userId, contno, id, lawType, loanType) => {
    console.log(
      `selected ${userId} contno ${contno} id ${id} lawType ${lawType} loanType ${loanType}`
    );

    if (!userId) {
      let setUser = dataSend
        .filter((item) => item.LOAN_ID === id)
        .map((item) => Number(item.USER_ID));
      userId = setUser[0];
    }

    if (!lawType) {
      let setLawType = dataSend
        .filter((item) => item.LOAN_ID === id)
        .map((item) => Number(item.LAW_TYPE_ID));
      lawType = setLawType[0];
    }

    if (!loanType) {
      let setLaonType = dataSend
        .filter((item) => item.LOAN_ID === id)
        .map((item) => Number(item.LOAN_TYPE_ID));
      loanType = setLaonType[0];
      console.log("setLaonType", setLaonType[0]);
      console.log("loanType", loanType);
    }

    setDataSend((prevFailedData) => {
      // สร้างอาร์เรย์ใหม่โดยไม่รวม item LOAN_ID เหมือนกัน
      const updatedData = prevFailedData.filter((item) => item.LOAN_ID !== id);
      // เพิ่มข้อมูลใหม่เข้า array
      const newItem = {
        MAIN_STATUS_ID: INDICT,
        USER_ID: userId,
        LOAN_ID: null,
        LOAN_TYPE_ID: loanType,
        LAW_TYPE_ID: lawType,
        MEMO: null,
        DATE: dayjs().format("YYYY-MM-DD"),
        PROCESS_ID: STATUS_PROCESS_PROGRESS,
        contno: contno,
        COMPANY_ID: companyId === "3" ? 3 : 2,
      };

      // Return อัพเดท array
      return [...updatedData, newItem];
    });
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter(
      (item) =>
        item.contract_no.includes(value) ||
        item.parcel_list[0].register_no.includes(value)
    );
    setArrayTable(result);
  };

  const onSearchByDate = (startDate) => {
    console.log(startDate);
    if (startDate) {
      const selectSearch = dataArr.filter((item) =>
        item.parcel_list.every((parcel) =>
          parcel.datetime.includes(dayjs(startDate).format("YYYY-MM-DD"))
        )
      );
      console.log(dayjs(startDate).format("YYYY-MM-DD"));

      console.log(selectSearch);
      setArrayTable(selectSearch);
      setTableLength(selectSearch.length);
    } else {
      setArrayTable(dataArr);
      setTableLength(dataArr.length);
    }
  };

  const onChange = (loanId, selectedValue) => {
    console.log("Loan ID:", loanId);
    console.log("Selected Value:", selectedValue);

    onApporvedData(null, null, loanId, null, selectedValue);
  };

  //   const confirmInsert = () => {
  //     console.log("confirmInsert", dataSend);

  //     insertDataAll();
  //   };

  const cancelInsert = () => {
    message.error("ยกเลิกการมอบงาน");
  };

  useEffect(() => {
    if (loanData) {
      //  insertDataOne(id);
    }
  }, [loanData]);

  const confirmInsertOne = (record) => {
    queryLoan(record);
    console.log(record);

    console.log("confirmInsertOne", dataSend, record.contract_no);
  };

  const cancel = (e) => {
    console.log(e);
    message.error("ยกเลิกการมอบงาน");
  };

  const handleCheckboxChange = (loanId, value) => {
    console.log("Selected values:", loanId, value);
    let setValue = 0;
    if (value.length > 1) {
      setValue = 3;
    } else {
      setValue = value[0];
    }
    onApporvedData(null, null, loanId, setValue, null);
  };

  //ไว้เปลี่ยน สถานะและ set table แบบ ค่าเดียว
  const handleChangeStatus = (data) => {
    console.log("handleChangeStatus--->", handleChangeStatus);

    const result = dataArr.map((item) => {
      if (item.contract_no === data.contract_no) {
        return { ...data };
      } else {
        return { ...item };
      }
    });
    console.log("result--->", result);

    const dataChangeSatatus = result.filter((item) =>
      item.parcel_list.every(
        (parcel) =>
          (parcel.status === 1 || parcel.status === 2) && !parcel.status_process
      )
    );

    setDataSend(dataChangeSatatus);
    setDataArr(result);

    setArrayTable(dataChangeSatatus);
    setTableLength(dataChangeSatatus.length);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (dataFunc) {
      console.log("dataFunc In", dataFunc);
      handleChangeStatusAll();
    } else {
      console.log("dataFunc out", dataFunc);
    }
  }, [dataFunc]);

  //ไว้เปลี่ยน สถานะและ set table แบบ หลายค่า
  const handleChangeStatusAll = () => {
    console.log(dataToTable);
    const idsToFilterOut = dataToTable.map((item) => item.id);
    const newData = dataArr.filter((item) => !idsToFilterOut.includes(item.id));

    setArrayTable(newData);
    setTableLength(newData.length);
    console.log("newData", newData);
  };

  const renderResponseDate = (record) => {
    const allSuccessful = record?.parcel_list?.every(
      (res) => res.date_response
    );

    console.log(allSuccessful);

    if (!allSuccessful) {
      return "-";
    } else {
      let latestDate = record.parcel_list
        .map((item) => item.date_response) // ดึงค่า date_response
        .filter((date) => date !== null) // กรองค่า null ออก
        .sort((a, b) => new Date(b) - new Date(a)); // เรียงลำดับวันที่จากใหม่ -> เก่า

      const today = dayjs().startOf("day");
      const recordDate = dayjs(latestDate[0]).startOf("day");
      const remainingDays = today.diff(dayjs(recordDate), "day");
      let color;
      if (remainingDays > 30) {
        color = "green";
      } else {
        color = "red";
      }

      return (
        <Tag color={color}>
          {latestDate.length > 0 ? convertDateThai(latestDate[0]) : "-"}
          <br />
          เกินมา {remainingDays} วัน
        </Tag>
      ); // แสดงวันที่ล่าสุด
    }
  };

  // random ทนาย
  // const getJobsLawyers = () => {
  //   if (loadLawyerJobs !== "No records") {
  //     const dataJobs = loadLawyerJobs.map((item) => ({
  //       USER_ID: item.USER_ID,
  //       USER_JOBS: item.USER_JOBS,
  //     }));

  //     const data = arrayTable.map((item) => ({
  //       LOAN_ID: item.LOAN.id,
  //     }));

  //     console.log("ssssss", data);
  //     console.log(dataJobs);
  //     return dataJobs;
  //   }
  // };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "10%",
      render: (text, object, key) => key + 1,
      sorter: {
        compare: (a, b) => a.key - b.key,
        multiple: 5,
      },
    },
    {
      title: "วันที่ออกหนังสือ",
      align: "center",
      render: (text, record) => (
        <>
          {record.parcel_list[0]?.datetime
            ? convertDateThaiShort(record.parcel_list[0]?.datetime)
            : null}
        </>
      ),
    },
    {
      title: "วันที่ตอบกลับ",
      align: "center",
      render: (text, record) => (
        <>
          {renderResponseDate(record)}
          {/* {record.parcel_list[0]?.date_response
            ? convertDateThaiShort(record.parcel_list[0]?.date_response)
            : null} */}
        </>
      ),
    },
    {
      title: "เลขที่สัญญา",
      dataIndex: "CONTNO",
      key: "CONTNO",
      align: "center",
      render: (text, record) => (
        <Link
          onClick={() => {
            setIsModal(true);
            setDataRecord(record);
          }}
        >
          {record.contract_no ? record.contract_no : null}
        </Link>
      ),
    },
    {
      title: "รายละเอียดรถ",
      dataIndex: "CUSTOMER",
      key: "CUSTOMER",
      align: "center",
      render: (text, record) => (
        <>
          {record?.parcel_list[0]?.brand ? record?.parcel_list[0]?.brand : null}
          <br />
          {record?.parcel_list[0]?.register_no
            ? record?.parcel_list[0]?.register_no
            : null}{" "}
        </>
      ),
    },
    {
      title: "ความ",
      align: "center",
      render: (text, record) => (
        <Checkbox.Group
          options={optionsLaw}
          defaultValue={defaultValue}
          onChange={(value) => {
            handleCheckboxChange(record.id, value);
          }}
        />
      ),
    },
    {
      title: "สัญญา",
      align: "center",
      render: (text, record) => (
        <Select
          // onChange={(e) => {
          //   onChange(record.id, e.target.value);
          // }}
          defaultValue={
            record.contract_no.substring(0, 1) === "2" ? HIRE_PURCASE : MORTGAGE
          }
          popupMatchSelectWidth={false}
          style={{
            width: "auto", // ทำให้ Select ขยายตามเนื้อหา
            // maxWidth: 200, // จำกัดความกว้างสูงสุด
          }}
          placeholder="เลือกประเภทสัญญา"
          optionFilterProp="value"
          onChange={(value) => onChange(value, record.CONTNO, record.id)}
          options={optionsLone}
        />
      ),
    },
    {
      title: "เลือกทนายรับงาน",
      align: "center",
      render: (text, record) => (
        <>
          <Select
            placeholder="เลือกทนายรับงาน"
            optionFilterProp="value"
            onChange={(value) =>
              onChangeSelect(value, record.contract_no, record.id)
            }
            options={lawyersOption}
            style={{ width: "100%" }}
          />
        </>
      ),
    },
    {
      title: "การจัดการ",
      align: "center",
      render: (record) => (
        <>
          <Popconfirm
            title="มอบงานให้ทนาย"
            description="คุณต้องการมอบงานให้ทนายตามข้อมูลนี้ใช่หรือไม่ ?"
            onConfirm={() => confirmInsertOne(record)}
            onCancel={cancel}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
          >
            <Button style={{ fontSize: "16px", color: "green" }}>
              <PlusCircleOutlined />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Col span={"12"} style={{ textAlign: "start" }}>
              {/* <Popconfirm
                    title="มอบงานให้ทนาย"
                    description="คุณต้องการนมอบหมายงานให้ทนายตามข้อมูลในตารางหรือไม่ ?"
                    onConfirm={confirmInsert}
                    onCancel={cancelInsert}
                    okText="ยืนยัน"
                    cancelText="ยกเลิก"
                  >
                    <Button>
                      <PlusCircleOutlined
                        style={{ color: "green", fontSize: "20px" }}
                      />
                    </Button>
                  </Popconfirm> */}
            </Col>
            <Col span={"12"} style={{ textAlign: "end" }}>
              <Space direction="vertical" size={12}>
                <DatePicker
                  size="large"
                  style={{ marginRight: "10px" }}
                  onChange={onSearchByDate}
                />
              </Space>
              <Search
                placeholder="ค้นหาสัญญา"
                enterButton
                onChange={search}
                style={{
                  width: 200,
                }}
                size="large"
              />
            </Col>
            <Col span={"24"}>
              <Table
                style={{ marginTop: "10px" }}
                size="small"
                columns={columns}
                dataSource={arrayTable}
                scroll={{ x: 850 }}
                footer={() => <p>จำนวนสัญญาทั้งหมด {tableLength}</p>}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? (
        <TerminateDetail
          open={isModal}
          close={setIsModal}
          dataDefault={dataRecord}
        />
      ) : null}
    </>
  );
};

const ContractToLawuitHand = MotionHoc(Main);
export default ContractToLawuitHand;
