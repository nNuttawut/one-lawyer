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
import DetailModal from "../detailStatus/DetailModal";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateData } from "../../../redux/action/DataImport";
import LoadLawyers from "../../../hook/LoadLawyers";
import { optionsLaw } from "../../../utils/constant/LawTypeConstant";
import {
  optionsLone,
  HIRE_PURCASE,
} from "../../../utils/constant/LoanTypeConstant";
import { NOTICE } from "../../../utils/constant/StatusConstant";

const AssignLawyers = () => {
  //set hook
  const [lawyersList, setLoadingData, loadLawyerJobs] = LoadLawyers();
  const [lawyersOption, setLawyersOption] = useState();

  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const [dataSend, setDataSend] = useState([]);
  const [dataJobs, setDataJob] = useState();
  const [dataFilter, setDataFilter] = useState();
  const [dataCheck, setDataCheck] = useState();

  const COMPANY = 1;
  const defaultValue = [1];

  //call redux action
  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
    setLoadingData(true);
  }, [setLoadingData]);

  useEffect(() => {
    setOption();
  }, [lawyersList]);

  const setOption = () => {
    let companySelect = null;
    if (COMPANY === 1) {
      companySelect = lawyersList.filter((item) => item.COMPANY_ID === 1);
    }

    const options = companySelect.map((item) => ({
      value: item.id,
      label: item.NNAME,
    }));
    console.log(lawyersList);
    console.log("option", options);
    setLawyersOption(options);
  };

  const loadData = async () => {
    setLoading(true);
    // const tk = JSON.parse(token);
    const urlQueryData = `https://shark-app-j9jc9.ondigitalocean.app/lawyer/dev/api/loans`;
    const headers = {};
    try {
      await axios
        .get(urlQueryData, {
          headers: headers,
        })
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            filterDataNotAssign(resQuery.data);
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
    const newData = value.filter((item) => item.LOAN.MAIN_STATUS_ID === null);
    setArrayTable(newData);
    setDataArr(newData);
  };
  const storeData = () => {
    dispatch(updateData(arrayTable));
    console.log("in store data");
  };

  const insertData = async () => {
    // console.log(getJobsLawyers());
    setLoading(true);
    console.log(dataSend);

    let setSucess = 0;
    try {
      if (!dataSend || dataSend.length === 0) {
        message.error("กรุณากรอกข้อมูลให้ครบถ้วน");
        setSucess = 5555;
        setLoading(false);
        return;
      }
      console.log("data--->", dataSend);
      const promises = dataSend.map(async (item) => {
        const arrayData = item;
        console.log("contno-->", arrayData);

        if (
          !arrayData.MAIN_STATUS_ID ||
          !arrayData.USER_ID ||
          !arrayData.LOAN_ID ||
          !arrayData.LOAN_TYPE_ID ||
          !arrayData.LAW_TYPE_ID
        ) {
          let failData = arrayTable.filter(
            (item) => item.LOAN.id === arrayData.LOAN_ID
          );
          console.log("failData--->", failData.LOAN.CONTNO);
          message.warning(`พบข้อมูลกรอกไม่ครบ ${failData.LOAN.CONTNO}`);
          return null;
        } else {
          const urlInsert =
            "https://shark-app-j9jc9.ondigitalocean.app/lawyer/dev/api/loans/status";
          const headers = {
            "Content-Type": "application/json",
          };

          await axios
            .post(urlInsert, arrayData, { headers })
            .then((resQuery) => {
              if (resQuery.status === 200) {
                setSucess += 1;
                return resQuery.data;
              } else {
                console.log(`ไม่สามารถมอบหมายงานได้`);
                message.error(`ไม่สามารถมอบหมายงานได้`);
                return null;
              }
            })
            .catch((err) => {
              console.error(err);
              message.error(`งานถูกมอบหมายให้ทนายแล้ว`);
              return null;
            });
        }
      });
      const results = await Promise.all(promises);
      console.log("results", results);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("พบข้อมูลกรอกไม่ครบ");
    } finally {
      setLoading(false);
      if (setSucess === dataSend.length && setSucess !== 5555) {
        message.success(`มอบหมายงานให้ทนายเสร็จสิ้น ${dataSend.length} สัญญา`);
      }
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
    if (userId) {
      console.log("trap in");
      lawType = 1;
      loanType = 1;
    }
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
    }

    setDataSend((prevFailedData) => {
      // สร้างอาร์เรย์ใหม่โดยไม่รวม item LOAN_ID เหมือนกัน
      const updatedData = prevFailedData.filter((item) => item.LOAN_ID !== id);

      // เพิ่มข้อมูลใหม่เข้า array
      const newItem = {
        MAIN_STATUS_ID: NOTICE,
        USER_ID: userId,
        LOAN_ID: id,
        LOAN_TYPE_ID: lawType,
        LAW_TYPE_ID: loanType,
        MEMO: null,
      };

      // Return อัพเดท array
      return [...updatedData, newItem];
    });
  };

  console.log("dataSend--->", dataSend);
  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter((item) => item.LOAN.CONTNO.includes(value));
    setArrayTable(result);
  };

  const onChange = (loanId, selectedValue) => {
    console.log("Loan ID:", loanId);
    console.log("Selected Value:", selectedValue);

    onApporvedData(null, null, loanId, null, selectedValue);
  };

  const confirmInsert = () => {
    insertData(arrayTable);
  };
  const cancelInsert = () => {
    message.error("ยกเลิกการมอบงาน");
  };

  const cancel = (e) => {
    console.log(e);
    message.error("ยกเลิกการมอบงาน");
  };

  const getJobsLawyers = () => {
    if (loadLawyerJobs !== "No records") {
      const dataJobs = loadLawyerJobs.map((item) => ({
        USER_ID: item.USER_ID,
        USER_JOBS: item.USER_JOBS,
      }));

      const data = arrayTable.map((item) => ({
        LOAN_ID: item.LOAN.id,
      }));

      console.log("ssssss", data);
      console.log(dataJobs);
      return dataJobs;
    }
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

  const columns = [
    {
      title: "เลขที่สัญญา",
      dataIndex: "CONTNO",
      key: "CONTNO",
      align: "center",
      render: (text, record) => (
        <>{record.LOAN.CONTNO ? record.LOAN.CONTNO : null}</>
      ),
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "CUSTOMER",
      key: "CUSTOMER",
      align: "center",
      render: (text, record) => (
        <>
          {record.CUSTOMER.SNAM ? record.CUSTOMER.SNAM : null}{" "}
          {record.CUSTOMER.NAME1 ? record.CUSTOMER.NAME1 : null}{" "}
          {record.CUSTOMER.NAME2 ? record.CUSTOMER.NAME2 : null}
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
            handleCheckboxChange(record.LOAN.id, value);
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
            onChange(record.LOAN.id, e.target.value);
          }}
          defaultValue={HIRE_PURCASE}
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
            optionFilterProp="label"
            onChange={(value) =>
              onChangeSelect(value, record.LOAN.CONTNO, record.LOAN.id)
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
      render: () => (
        <>
          <Popconfirm
            title="มอบงานให้ทนาย"
            description="คุณต้องการมอบงานให้ทนายตามข้อมูลนี้ใช่หรือไม่ ?"
            onConfirm={insertData}
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
              />
            </Col>
          </Row>
        </Spin>
      </Card>
      {isModal ? <DetailModal open={isModal} close={setIsModal} /> : null}
    </>
  );
};

export default AssignLawyers;
