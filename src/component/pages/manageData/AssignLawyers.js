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
  Radio,
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
  optionsLone,
  MORTGAGE,
} from "../../../utils/constant/LoanTypeConstant";
import {
  JOB_NULL,
  NOTICE,
  STATUS_PROCESS_PROGRESS,
} from "../../../utils/constant/StatusConstant";
import {
  POST_STATUS,
  HEADERS_EXPORT,
  baseUrl,
  GET_JOB_IN_PROGRESS_BY_STATUS,
} from "../../API/apiUrls";
import MotionHoc from "../../../utils/MotionHoc";

const Main = () => {
  //set hook
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [lawyersOption, setLawyersOption] = useState();
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const [dataSend, setDataSend] = useState([]);
  const [dataToTable, setDataToTable] = useState([]);
  let [dataFunc, setDataFunc] = useState(0);
  const [tableLength, setTableLength] = useState(0);
  const roleId = localStorage.getItem("ROLE_ID");
  const companyId = localStorage.getItem("COMPANY_ID");

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
        .get(baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS + JOB_NULL, {
          HEADERS_EXPORT,
        })
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            let i = 1;
            const newData = resQuery.data.map((item) => ({
              ...item,
              key: i++,
            }));

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
    function containsNumber(str) {
      return /\d/.test(str); // เช็คว่า str เป็นตัวเลขทั้งหมด
    }

    function isEnglishOnly(str) {
      return /^[A-Za-z]+$/.test(str); // เช็คว่า str เป็นตัวอักษรภาษาอังกฤษทั้งหมด
    }

    let filteredData;

    if (companyId === "3") {
      filteredData = value.filter((item) => {
        // ถ้า 2 เป็นภาษาอังกฤษทั้งหมด
        if (isEnglishOnly(item.CONTNO.substring(0, 2))) {
          return item;
        } else {
          return false;
        }
      });

      console.log("filteredData3", filteredData);
      setArrayTable(filteredData);
      setDataArr(filteredData);
      setTableLength(filteredData.length);
    } else {
      filteredData = value.filter((item) => {
        const test = containsNumber(item.CONTNO.substring(0, 2)); // ตรวจสอบว่า 2 ตัวแรกมีตัวเลขไหม
        console.log("test12", test);

        // ถ้า 2 ตัวแรกไม่ใช่ตัวเลข และไม่ได้เป็นภาษาอังกฤษทั้งหมด
        if (test || !isEnglishOnly(item.CONTNO.substring(0, 2))) {
          return item; // เก็บ item นี้ไว้
        } else {
          return false; // ไม่เก็บ item นี้ (กรณีเป็นภาษาอังกฤษทั้งหมด หรือมีตัวเลขใน 2 ตัวแรก)
        }
      });

      console.log("filteredData3", filteredData);
      setArrayTable(filteredData);
      setDataArr(filteredData);
      setTableLength(filteredData.length);
    }
  };

  //set redux
  // const storeData = () => {
  //   dispatch(updateData(arrayTable));
  //   console.log("in store data");
  // };

  const insertDataAll = async () => {
    setLoading(true);
    let setSucess = 0;
    console.log("dataSend all", dataSend);
    try {
      if (!dataSend || dataSend.length === 0) {
        message.error("กรุณาเลือกทนาย");
        setSucess = 5555;
        setLoading(false);
        return;
      }

      const promises = dataSend.map(async (item) => {
        let arrayData = item;
        console.log("arrayData", arrayData);

        if (arrayData) {
          if (arrayData) {
            if (arrayData?.LAW_TYPE_ID && arrayData?.LOAN_TYPE_ID) {
              arrayData = dataSend;
              console.log(
                "arrayData.LAW_TYPE_ID && arrayData.LOAN_TYPE_ID",
                arrayData
              );
            }
            if (!arrayData?.LAW_TYPE_ID) {
              arrayData = {
                ...arrayData,
                LAW_TYPE_ID: 1,
              };
              console.log("!arrayData.LAW_TYPE_ID", arrayData);
            }
            if (!arrayData?.LOAN_TYPE_ID) {
              arrayData = {
                ...arrayData,
                LOAN_TYPE_ID: MORTGAGE,
              };
              console.log("!arrayData.LOAN_TYPE_ID", arrayData);
            }
          }
        }
        console.log("arrayData---->ALL", arrayData);
        if (!arrayData.USER_ID) {
          message.warning(`พบข้อมูลกรอกไม่ครบ`, arrayData.LOAN_ID);
          setTimeout(() => {
            reloadPage();
          }, 1000);
        } else {
          await axios
            .post(baseUrl + POST_STATUS, arrayData, { HEADERS_EXPORT })
            .then((resQuery) => {
              if (resQuery.status === 201) {
                console.log("arrayData.LOAN_ID", arrayData.LOAN_ID);
                setSucess += 1;
                setDataToTable((pre) => [...pre, { id: arrayData.LOAN_ID }]);
                return resQuery.data;
              } else {
                console.log(`ไม่สามารถมอบหมายงานได้`, arrayData.LOAN_ID);
                message.error(`ไม่สามารถมอบหมายงานได้`);
                return null;
              }
            })
            .catch((err) => {
              console.error(err);
              message.error(`งานถูกมอบหมายให้ทนายแล้ว`);
              setSucess = 999;
              return null;
            });
        }
      });
      const results = await Promise.all(promises);
      console.log("results Promise", results);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("พบข้อมูลกรอกไม่ครบ");
    } finally {
      setLoading(false);
      if (setSucess === dataSend.length) {
        message.success(`มอบหมายงานให้ทนายเสร็จสิ้น ${dataSend.length} สัญญา`);
      }

      setDataFunc((dataFunc += 1));
      setDataSend([]);
      console.log("finally---->", dataFunc);
      if (setSucess === 999) {
        reloadPage();
      }
    }
  };

  const insertDataOne = async (id) => {
    setLoading(true);
    const data = dataSend.find((item) => item.LOAN_ID === id);
    let filteredData;
    let setSucess = 0;
    let dataApprove = data;
    if (data) {
      if (data) {
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
            LOAN_TYPE_ID: MORTGAGE,
          };
        }
        if (data?.LAW_TYPE_ID && data?.LOAN_TYPE_ID) {
          dataApprove = data;
        }
      }
      console.log("dataApprove", dataApprove);
      try {
        filteredData = dataArr.find((item) => item.id === id);
        console.log("filteredData-->", filteredData);
        await axios
          .post(baseUrl + POST_STATUS, dataApprove, { HEADERS_EXPORT })
          .then((resQuery) => {
            if (resQuery.status === 201) {
              const dataToUpdate = {
                ...filteredData,
                MAIN_STATUS_ID: 1,
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
        if (data) {
          if (data.USER_ID && setSucess > 0) {
            message.success(
              `มอบหมายงานให้ทนายเสร็จสิ้น ${filteredData.CONTNO} สัญญา`
            );
          }
        }
      }
    } else {
      message.error(`กรุณาเลือกทนาย`);
      setLoading(false);
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
        MAIN_STATUS_ID: NOTICE,
        USER_ID: userId,
        LOAN_ID: id,
        LOAN_TYPE_ID: loanType,
        LAW_TYPE_ID: lawType,
        MEMO: null,
        DATE: null,
        PROCESS_ID: STATUS_PROCESS_PROGRESS,
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
    let result = dataArr.filter((item) => item.CONTNO.includes(value));
    setArrayTable(result);
  };

  const onChange = (loanId, selectedValue) => {
    console.log("Loan ID:", loanId);
    console.log("Selected Value:", selectedValue);

    onApporvedData(null, null, loanId, null, selectedValue);
  };

  const confirmInsert = () => {
    console.log("confirmInsert", dataSend);

    insertDataAll();
  };

  const cancelInsert = () => {
    message.error("ยกเลิกการมอบงาน");
  };

  const confirmInsertOne = (id) => {
    insertDataOne(id);
    console.log("confirmInsertOne", dataSend);
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
    const newData = result.filter((item) => item.MAIN_STATUS_ID === null);
    setArrayTable(newData);
    setTableLength(newData.length);
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
        <Radio.Group
          onChange={(e) => {
            onChange(record.id, e.target.value);
          }}
          defaultValue={MORTGAGE}
          style={{ marginBottom: "10px" }}
        >
          {optionsLone.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
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
              onChangeSelect(value, record.CONTNO, record.id)
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
            onConfirm={() => confirmInsertOne(record.id)}
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
      {roleId === "1" || roleId === "2" ? (
        <>
          <Card>
            <Spin spinning={loading} size="large" tip=" Loading... ">
              <Row>
                <Col span={"12"} style={{ textAlign: "start" }}>
                  <Popconfirm
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
                  </Popconfirm>
                </Col>
                <Col span={"12"} style={{ textAlign: "end" }}>
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

const AssignLawyers = MotionHoc(Main);
export default AssignLawyers;
