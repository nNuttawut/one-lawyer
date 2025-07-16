import {
  Col,
  Row,
  Table,
  Card,
  Button,
  message,
  Spin,
  Select,
  Popconfirm,
  notification,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useEffect } from "react";
import DetailModal from "../detail/DetailModal";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import LoadLawyers from "../../../hook/LoadLawyers";
import {
  HEADERS_EXPORT,
  baseUrl,
  PUT_STATUS,
  GET_JOB_IN_PROGRESS_BY_STATUS,
  PUT_LAWSUIT_DETAIL,
  GET_LAWSUIT_LIST,
  POST_STATUS,
} from "../../API/apiUrls";
import MotionHoc from "../../../utils/MotionHoc";
import { Link } from "react-router-dom";
import {
  INDICT,
  NOTICE,
  optionsSatus,
  STATUS_PROCESS_PROGRESS,
} from "../../../utils/constant/StatusConstant";
import dayjs from "dayjs";
import DateCustom from "../../../hook/DateCustom";
import { optionsLocat } from "../../../utils/constant/LocatOption";

const Main = () => {
  //set hook
  const userCompany = localStorage.getItem("COMPANY_ID");
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [lawyersList, setLoadingData, loadLawyerJobs] = LoadLawyers();
  const [lawyersOption, setLawyersOption] = useState();
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const [dataSend, setDataSend] = useState([]);
  const [dataToTable, setDataToTable] = useState([]);
  const [dataFunc, setDataFunc] = useState(null);
  const [tableLength, setTableLength] = useState(0);
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const companyId = localStorage.getItem("COMPANY_ID");
  const [dataRecord, setDataRecord] = useState();

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
    // console.log("lawyersList", lawyersList);

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
    // baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + INDICT
    //  "http://localhost:8080/lawyer/dev/api/jobs/" + INDICT,
    try {
      await axios
        .get(baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + INDICT, {
          headers: HEADERS_EXPORT,
        })
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            let i = 0;
            const newData = resQuery.data
              .filter((item) => item.LAWYER_ID)
              .map((item) => ({
                ...item,
                key: i++,
              }));

            console.log(newData);
            filterData(newData);
            console.log("resQuery", resQuery.data);
            setLoading(false);
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

  const filterData = (data) => {
    if (data) {
      let filteredData;
      console.log("data", data);

      if (userCompany === "3") {
        filteredData = data.filter((item) => {
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
        filteredData = data.filter((item) => {
          const branch = item.LOCAT;
          if (!branch) return false; // ไม่มี branch ไม่ผ่านเงื่อนไข

          return optionsLocat.some((opt) => branch.includes(opt.label));
        });
      }

      const newData = filteredData.filter(
        (item) =>
          !item.black_case_number &&
          item.PROCESS_ID === 1 &&
          item.MAIN_STATUS_ID === item.STATUS_ID
      );
      console.log("filteredData", filteredData);

      const sortedData = newData.sort((a, b) => {
        // ถ้า a ไม่มี investigation_date ให้เอาไว้ล่าง
        if (!a.DATE && b.DATE) return 1;
        // ถ้า b ไม่มี investigation_date ให้เอาไว้ล่าง
        if (a.DATE && !b.DATE) return -1;
        // ถ้าทั้งคู่มี investigation_date ให้เปรียบเทียบปกติ (ล่าสุดก่อน)
        if (a.DATE && b.DATE) {
          return new Date(b.DATE) - new Date(a.DATE);
        }
        return 0; // ถ้าทั้งคู่เป็น null
      });

      setArrayTable(sortedData);
      setDataArr(newData);
      setTableLength(sortedData?.length);
      console.log("newData", sortedData);
      console.log("Length of filtered data:", sortedData?.length);
    } else {
      console.error("data is not an array or is undefined");
      setTableLength(0);
    }
  };

  const insertDataStatusIndect = async (id, lawsuitId) => {
    setLoading(true);
    const data = dataSend.find((item) => item.LOAN_ID === id);
    // const lawsuit = lawsuitSend.find((item) => item.id === lawsuitId);
    let filteredData;
    let setSucess = 0;
    let dataApprove = data;
    console.log("dataApprove", dataApprove);
    try {
      filteredData = dataArr.find((item) => item.id === id);
      await axios
        .put(baseUrl + PUT_STATUS, dataApprove, { headers: HEADERS_EXPORT })
        .then((resQuery) => {
          if (resQuery.status === 200) {
            const dataToUpdate = {
              ...filteredData,
              LAWYER_ID: dataApprove.USER_ID,
              // LAW_TYPE_ID: dataApprove.LAW_TYPE_ID,
            };
            setSucess += 1;
            handleChangeStatus(dataToUpdate);
            return resQuery.data;
          }
        })
        .catch((err) => {
          console.error(err);
          message.error(`งานถูกมอบหมายให้ทนายแล้ว`);
          return null;
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("กรุณาเลือกทนาย");
      setLoading(false);
    } finally {
      setLoading(false);
      console.log(dataApprove, setSucess);
      message.success(
        `มอบหมายงานให้ทนายเสร็จสิ้น ${filteredData.CONTNO} สัญญา`
      );
      // window.location.reload();
    }
  };

  const onChangeSelect = (value, record, id) => {
    console.log(`selected ${value} lawsuitId ${record} id ${id}`);
    onApporvedData(value, record, id);
  };

  const onApporvedData = (userId, record, id) => {
    const ownData = arrayTable?.filter((item) => item.id === id);
    console.log("ownData", ownData);
    if (record?.MAIN_STATUS_ID === 2) {
      setDataSend((prevFailedData) => {
        // สร้างอาร์เรย์ใหม่โดยไม่รวม item LOAN_ID เหมือนกัน
        const updatedData = prevFailedData?.filter(
          (item) => item.LOAN_ID !== id
        );
        // เพิ่มข้อมูลใหม่เข้า array
        console.log("updatedData1", updatedData);
        //เปลี่ยน body และ put lawsuit ด้วย
        const newItem = {
          id: record?.WORK_LOG_ID,
          USER_ID: userId,
          LOAN_ID: id,
          LOAN_TYPE_ID: record?.LOAN_TYPE_ID,
          LAW_TYPE_ID: record?.LAW_TYPE_ID,
          PROCESS_ID: STATUS_PROCESS_PROGRESS,
          MEMO: "เปลี่ยนทนายทำคำฟ้อง",
          DATE: record.DATE,
        };

        // Return อัพเดท array
        return [...updatedData, newItem];
      });
    }
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter((item) => item.CONTNO.includes(value));
    setArrayTable(result);
  };

  const confirmInsertOne = (id, lawsuitId, record) => {
    const status = optionsSatus.find(
      (item) => item.value === record.MAIN_STATUS_ID
    );
    console.log(status);

    console.log("id,sss", record);
    if (record.MAIN_STATUS_ID === 2) {
      insertDataStatusIndect(id, lawsuitId);
    } else {
      notification.error({
        message: "ไม่สามารถทำรายการได้!",
        description: `สถานะสัญญาปัจจุบัน "${status.label}" หากมีข้อส่งสัยโปรดติดต่อ IT`,
        duration: 10,
      });
    }
  };

  const cancel = (e) => {
    console.log(e);
    message.error("ยกเลิกการมอบงาน");
  };

  //ไว้เปลี่ยน สถานะและ set table แบบ ค่าเดียว
  const handleChangeStatus = (data) => {
    const result = dataArr.map((item) => {
      if (item.id === data.id) {
        return { ...data };
      } else {
        return { ...item };
      }
    });
    const dataChangeSatatus = dataSend.filter(
      (item) => item.LOAN_ID !== data.id
    );

    setDataSend([]);
    setDataArr(result);
    console.log("dataChangeSatatus--->", dataChangeSatatus);
    console.log("result--->", result);

    const newData = result.filter((item) => item.MAIN_STATUS_ID === null);
    setArrayTable(result);
    console.log("newData--->", newData);
  };

  console.log("dataSend---->", dataSend);

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
    console.log("newData", newData);
  };

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
      title: "เลขที่สัญญา",
      dataIndex: "CONTNO",
      key: "CONTNO",
      align: "center",
      render: (text, record) => (
        <Link
          onClick={() => {
            setIsModal(true);
            console.log("record", record);

            setDataRecord(record);
          }}
        >
          {record.CONTNO ? record.CONTNO : null}
        </Link>
      ),
      // sorter: (a, b) => {
      //   // เปรียบเทียบวันที่ระหว่าง a.DATE และ b.DATE
      //   return dayjs(a.updated_date).isBefore(dayjs(b.updated_date)) ? -1 : 1;
      // },
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "CUSTOMER",
      key: "CUSTOMER",
      align: "center",
      render: (text, record) => (
        <>
          {record.CUSTOMER_TNAME ? record.CUSTOMER_TNAME : null}{" "}
          {record.CUSTOMER_FNAME ? record.CUSTOMER_FNAME : null}{" "}
          {record.CUSTOMER_LNAME ? record.CUSTOMER_LNAME : null}
        </>
      ),
    },
    {
      title: "วันที่มอบงาน",
      align: "center",
      render: (text, record) => <>{convertDateThaiShort(record.DATE)} </>,
      sorter: (a, b) => {
        // กรณีถ้า a.investigation_date เป็น null ให้ขึ้นก่อน
        if (a.DATE === null) return -1;
        if (b.DATE === null) return 1;

        // เปรียบเทียบวันที่ระหว่าง a.DATE และ b.DATE
        const dateA = dayjs(a.DATE);
        const dateB = dayjs(b.DATE);

        if (dateA.isBefore(dateB)) return -1;
        if (dateA.isAfter(dateB)) return 1;
        return 0; // ถ้าเท่ากัน
      },
      // defaultSortOrder: "descend", // กำหนดการเรียงลำดับเริ่มต้น
      sortDirections: ["ascend", "descend"], // เพิ่มการรองรับการสลับลำดับ
    },
    {
      title: "ทนายเดิม",
      align: "center",
      render: (text, record) => <>{record.LAWYER_NNAME} </>,
    },
    {
      title: "เลือกทนายรับงาน",
      align: "center",
      render: (text, record) => (
        <>
          <Select
            placeholder="เลือกทนายรับงาน"
            showSearch
            optionFilterProp="label"
            onChange={(value) => onChangeSelect(value, record, record.id)}
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
            onConfirm={() =>
              confirmInsertOne(record.id, record.LAWSUIT_ID, record)
            }
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

  if ((companyId === "3" && ROLE_ID === "3") || ROLE_ID === "4") {
    return <Card>ไม่มีสิทธ์เข้าถึงข้อมูล</Card>;
  } else {
    return (
      <>
        <Card>
          <Spin spinning={loading} size="large" tip=" Loading... ">
            <Row>
              <Col span={"24"} style={{ textAlign: "end" }}>
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
          <DetailModal open={isModal} close={setIsModal} dataRec={dataRecord} />
        ) : null}
      </>
    );
  }
};

const LawyersJob = MotionHoc(Main);
export default LawyersJob;
