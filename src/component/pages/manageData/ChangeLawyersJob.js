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
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useEffect } from "react";
import DetailModal from "../detail/DetailModal";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import LoadLawyers from "../../../hook/LoadLawyers";
import { optionsLaw } from "../../../utils/constant/LawTypeConstant";

import {
  HEADERS_EXPORT,
  GET_JOB_IN_PROGRESS,
  baseUrl,
  PUT_STATUS,
  PUT_LAWSUIT_DETAIL,
  GET_LAWSUIT_DETAIL_BY_ID,
  GET_LAWSUIT_LIST,
} from "../../API/apiUrls";
import MotionHoc from "../../../utils/MotionHoc";

const Main = () => {
  //set hook
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
    try {
      await axios
        .get(baseUrl + GET_JOB_IN_PROGRESS, {
          HEADERS_EXPORT,
        })
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            let i = 1;
            const newData = resQuery.data.map((item) => ({
              ...item,
              key: i++,
            }));
            filterDataNotAssign(newData);
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

  const filterDataNotAssign = (value) => {
    const newData = value.filter((item) => item.MAIN_STATUS_ID !== null);
    setArrayTable(newData);
    setDataArr(newData);
    setTableLength(newData.length);
  };
  console.log(dataArr);

  const insertDataOne = async (id, idLawSuit) => {
    setLoading(true);
    const data = dataSend.find((item) => item.LOAN_ID === id);
    let filteredData;
    let setSucess = 0;
    let dataApprove = data;
    console.log("dataApprove", dataApprove);
    try {
      filteredData = dataArr.find((item) => item.id === id);
      await axios
        .put(baseUrl + PUT_STATUS, dataApprove, { HEADERS_EXPORT })
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
      window.location.reload();
    }
  };

  const onChangeSelect = (value, contno, id) => {
    console.log(`selected ${value} contno ${contno} id ${id}`);
    onApporvedData(value, contno, id);
  };

  const onApporvedData = (userId, contno, id, lawType) => {
    console.log(
      `selected ${userId} contno ${contno} id ${id} lawType ${lawType} `
    );
    console.log(dataSend);

    const ownData = arrayTable.filter((item) => item.id === id);
    console.log("ownData", ownData);

    setDataSend((prevFailedData) => {
      // สร้างอาร์เรย์ใหม่โดยไม่รวม item LOAN_ID เหมือนกัน
      const updatedData = prevFailedData.filter((item) => item.LOAN_ID !== id);
      // เพิ่มข้อมูลใหม่เข้า array
      console.log("updatedData1", updatedData);
      //เปลี่ยน body และ put lawsuit ด้วย
      const newItem = {
        WORK_LOG_ID: ownData[0]?.WORK_LOG_ID,
        USER_ID: userId,
        LOAN_ID: id,
        LOAN_TYPE_ID: ownData[0]?.LOAN_TYPE_ID,
        LAW_TYPE_ID: ownData[0]?.LAW_TYPE_ID,
        MEMO: null,
      };
      // Return อัพเดท array
      return [...updatedData, newItem];
    });
  };
  console.log("datasend", dataSend);

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter((item) => item.CONTNO.includes(value));
    setArrayTable(result);
  };

  const confirmInsertOne = (id) => {
    insertDataOne(id);
  };

  const cancel = (e) => {
    console.log(e);
    message.error("ยกเลิกการมอบงาน");
  };

  // const handleCheckboxChange = (value, lawsuitId, loanId) => {
  //   console.log(
  //     `Selected values:${value} lawsuit:${lawsuitId} loandId${loanId} `
  //   );
  //   let setValue = 0;
  //   if (value.length > 1) {
  //     setValue = 3;
  //   } else {
  //     setValue = value[0];
  //   }
  //   onApporvedData(null, null, loanId, setValue, null);
  // };

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

    setDataSend(dataChangeSatatus);
    setDataArr(result);
    console.log("dataChangeSatatus--->", dataChangeSatatus);
    console.log("result--->", result);

    const newData = result.filter((item) => item.MAIN_STATUS_ID === null);
    setArrayTable(newData);
    console.log("newData--->", newData);
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
    console.log("newData", newData);
  };

  const renderLoan = (recordData) => {
    return recordData.LOAN_TYPE_ID === 1 ? "เช่าซื้อ" : "จำนอง";
  };

  const renderLaw = (recordData) => {
    return recordData.LAW_TYPE_ID === 3
      ? "แพ่ง,อาญา"
      : recordData.LAW_TYPE_ID === 2
      ? "อาญา"
      : recordData.LAW_TYPE_ID === 1
      ? "แพ่ง"
      : null;
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
      render: (text, record) => <>{record.CONTNO ? record.CONTNO : null}</>,
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
      title: "ความเดิม",
      align: "center",
      render: (text, record) => <>{renderLaw(record)}</>,
    },
    {
      title: "สัญญา",
      align: "center",
      render: (text, record) => <>{renderLoan(record)} </>,
    },
    {
      title: "ทนายเดิม",
      align: "center",
      render: (text, record) => <>{record.LAWYER_NNAME} </>,
    },

    // {
    //   title: "ความ",
    //   align: "center",
    //   render: (text, record) => (
    //     <Checkbox.Group
    //       options={optionsLaw}
    //       // defaultValue={}
    //       onChange={(value) => {
    //         handleCheckboxChange(value, record.LAWSUIT_ID, record.id);
    //       }}
    //     />
    //   ),
    // },
    {
      title: "เลือกทนายรับงาน",
      align: "center",
      render: (text, record) => (
        <>
          <Select
            placeholder="เลือกทนายรับงาน"
            optionFilterProp="value"
            onChange={(value) =>
              onChangeSelect(value, record.LAWSUIT_ID, record.id)
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
            onConfirm={() => confirmInsertOne(record.id, record.LAWSUIT_ID)}
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
      {ROLE_ID === "1" || ROLE_ID === "2" ? (
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
          {isModal ? <DetailModal open={isModal} close={setIsModal} /> : null}
        </>
      ) : (
        <Card>
          {" "}
          <b>ไม่มีสิทธ์เข้าถึงข้อมูล</b>
        </Card>
      )}
    </>
  );
};

const ChangeLawyersJob = MotionHoc(Main);
export default ChangeLawyersJob;
