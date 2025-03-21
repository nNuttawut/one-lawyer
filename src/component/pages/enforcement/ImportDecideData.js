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
  HIRE_PURCASE,
} from "../../../utils/constant/LoanTypeConstant";
import {
  ENFORCEMENT,
  JOB_NULL,
  STATUS_PROCESS_PROGRESS,
} from "../../../utils/constant/StatusConstant";
import {
  POST_STATUS,
  HEADERS_EXPORT,
  baseUrl,
  GET_JOB_IN_PROGRESS_BY_STATUS,
} from "../../API/apiUrls";
import MotionHoc from "../../../utils/MotionHoc";
import dayjs from "dayjs";
import CreateJudgement from "./modal/CreateJudgement";
import LoadCompanies from "../../../hook/LoadCompanies";

const Main = () => {
  //set hook
  const [companiesListCompany, setLoadingDataCompany] = LoadCompanies();
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const [dataSend, setDataSend] = useState([]);
  const [dataToTable, setDataToTable] = useState([]);
  let [dataFunc, setDataFunc] = useState(0);
  const [tableLength, setTableLength] = useState(0);
  const roleId = localStorage.getItem("ROLE_ID");
  const COMPANY_ID = localStorage.getItem("COMPANY_ID");
  const USER_ID_LOCAL = localStorage.getItem("USER_ID");
  const [isModalJudgement, setIsModalJudgement] = useState(false);
  const [dataRecord, setDataRecord] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const defaultValue = [1];
  const [companiesOption, setCompaniesOption] = useState(null);
  const [lawyersOption, setLawyersOption] = useState();

  //call redux action
  // const dispatch = useDispatch();

  useEffect(() => {
    loadData();
    setLoadingDataCompany(true);
    setLoadingData(true);
  }, [setLoadingData]);

  useEffect(() => {
    if (dataRecord) {
      console.log("dataRecord", dataRecord);
      setIsModalJudgement(true);
    }
  }, [dataRecord]);

  useEffect(() => {
    if (companiesListCompany) {
      setOptionCompany();
    }
  }, [companiesListCompany]);

  const setOptionCompany = () => {
    const options = companiesListCompany.map((item) => ({
      value: item.id,
      label: item.company_name,
      address: item.address,
    }));

    console.log("options", options);
    setCompaniesOption(options);
  };

  useEffect(() => {
    if (lawyersList) {
      setOption();
    }
  }, [lawyersList]);

  const setOption = () => {
    let companySelect = null;

    if (COMPANY_ID === "1" || COMPANY_ID === "2") {
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
          headers: HEADERS_EXPORT,
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

    if (COMPANY_ID === "3") {
      filteredData = value.filter((item) => {
        // ถ้า 2 เป็นภาษาอังกฤษทั้งหมด
        if (
          isEnglishOnly(item.CONTNO.substring(0, 2)) ||
          item.CONTNO.substring(0, 1) === "4"
        ) {
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
                LOAN_TYPE_ID:
                  arrayData.contno.substring(0, 1) === "2"
                    ? HIRE_PURCASE
                    : MORTGAGE,
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
            .post(baseUrl + POST_STATUS, arrayData, { headers: HEADERS_EXPORT })
            .then((resQuery) => {
              if (resQuery.status === 200) {
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
    // setLoading(true);
    const data = dataSend.find((item) => item.LOAN_ID === id);
    let filteredData;
    let setSucess = 0;
    let dataApprove = data;
    if (data.COMPANY_ID && data.LOAN_TYPE_ID && data.USER_ID) {
      if (data) {
        console.log(data);
        if (!data.LAW_TYPE_ID) {
          dataApprove = {
            ...dataApprove,
            LAW_TYPE_ID: 1,
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
          .post(baseUrl + POST_STATUS, dataApprove, { headers: HEADERS_EXPORT })
          .then((resQuery) => {
            if (resQuery.status === 200) {
              // const dataToUpdate = {
              //   ...filteredData,
              //   MAIN_STATUS_ID: 8,
              // };
              // setSucess += 1;
              // handleChangeStatus(dataToUpdate);
              console.log("setDataRecord(dataApprove);");
              setResponseData(resQuery.data);
              setDataRecord(dataApprove);
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
      }
    } else {
      message.error(`กรุณาตรวจสอบข้อมูล`);
      setLoading(false);
    }
  };

  const onApporvedData = (contno, loanType, companies, lawyer, id, lawType) => {
    console.log(
      `contno ${contno} loanType ${loanType} companies ${companies} lawyer ${lawyer} lawType ${lawType}`
    );

    const loanItem = dataSend.find((item) => item.LOAN_ID === id);

    if (!loanType) {
      loanType = loanItem ? Number(loanItem.LOAN_TYPE_ID) : null;
      console.log("loanType", loanType);
    }

    if (!lawType) {
      lawType = loanItem ? Number(loanItem.LAW_TYPE_ID) : null;
      console.log("lawType", lawType);
    }

    if (!lawyer) {
      lawyer = loanItem ? Number(loanItem.LAWYER_ID) : null;
      console.log("lawyer", lawyer);
    }

    if (!companies) {
      companies = loanItem ? Number(loanItem.COMPANY_ID) : null;
      console.log("companies", companies);
    }

    setDataSend((prevFailedData) => {
      const updatedData = prevFailedData.filter((item) => item.LOAN_ID !== id);

      const newItem = {
        MAIN_STATUS_ID: ENFORCEMENT,
        USER_ID: lawyer,
        LOAN_ID: id,
        LOAN_TYPE_ID: loanType,
        LAW_TYPE_ID: lawType,
        MEMO: "อัพเดทผ่านงานส่วนบังคับคดี",
        DATE: dayjs().format("YYYY-MM-DD"),
        PROCESS_ID: STATUS_PROCESS_PROGRESS,
        COMPANY_ID: companies,
        contno: contno,
      };

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

  const onChangeLoan = (value, contno, id) => {
    console.log(`selected ${value} contno ${contno} id ${id}`);
    console.log("Selected Value:", value);

    onApporvedData(contno, value, null, null, id);
  };

  const onChangeCompany = (value, contno, id) => {
    console.log(`selected ${value} contno ${contno} id ${id}`);
    console.log("Selected Value:", value);

    onApporvedData(contno, null, value, null, id);
  };

  const onChangeSelect = (value, contno, id) => {
    console.log(`selected ${value} contno ${contno} id ${id}`);
    onApporvedData(contno, null, null, value, id);
  };

  const handleCheckboxChange = (value, contno, id) => {
    console.log("Selected values:", id, value);
    let setValue = 0;
    if (value.length > 1) {
      setValue = 3;
    } else {
      setValue = value[0];
    }
    onApporvedData(contno, null, null, null, id, setValue);
  };

  const confirmInsert = () => {
    console.log("confirmInsert", dataSend);
    insertDataAll();
  };

  const cancelInsert = () => {
    message.error("ยกเลิกการนำเข้าข้อมูล");
  };

  const confirmInsertOne = (id) => {
    insertDataOne(id);
    console.log("confirmInsertOne", dataSend);
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
            handleCheckboxChange(value, record.CONTNO, record.id);
          }}
        />
      ),
    },
    {
      title: "สัญญา",
      align: "center",
      render: (text, record) => (
        <Select
          popupMatchSelectWidth={false}
          style={{
            width: "auto",
          }}
          placeholder="เลือกประเภทสัญญา"
          optionFilterProp="value"
          onChange={(value) => onChangeLoan(value, record.CONTNO, record.id)}
          options={optionsLone}
        />
      ),
    },
    {
      title: "บริษัทที่ทำฟ้อง",
      align: "center",
      render: (text, record) => (
        <Select
          placeholder="เลือกบริษัท"
          optionFilterProp="value"
          options={companiesOption}
          onChange={(value) => onChangeCompany(value, record.CONTNO, record.id)}
          popupMatchSelectWidth={false}
          style={{
            width: "auto", // ทำให้ Select ขยายตามเนื้อหา
            // maxWidth: 200, // จำกัดความกว้างสูงสุด
          }}
          size="large"
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
            title="นำข้อมูลเข้า"
            description="คุณต้องการนำข้อมูลพิพากษาเข้าใช่หรือไม่ ?"
            onConfirm={() => {
              confirmInsertOne(record.id);
              console.log("record--->", record);
            }}
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
      {isModalJudgement ? (
        <CreateJudgement
          open={isModalJudgement}
          close={setIsModalJudgement}
          dataDefualt={dataRecord}
          responseData={responseData}
        />
      ) : null}
    </>
  );
};

const ImportDecideData = MotionHoc(Main);
export default ImportDecideData;
