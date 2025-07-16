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
  Tag,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useEffect } from "react";
import DetailModal from "../detail/DetailModal";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import LoadLawyers from "../../../hook/LoadLawyers";
import {
  optionsSatus,
  STATUS_PROCESS_SUCCESSFUL,
} from "../../../utils/constant/StatusConstant";
import {
  POST_STATUS,
  HEADERS_EXPORT,
  baseUrl,
  GET_JOB_IN_PROGRESS_BY_STATUS,
} from "../../API/apiUrls";
import MotionHoc from "../../../utils/MotionHoc";
import { optionsLocat } from "../../../utils/constant/LocatOption";
import dayjs from "dayjs";

const Main = () => {
  const USER_ID = localStorage.getItem("USER_ID");
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [lawyersOption, setLawyersOption] = useState();
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState();
  const [dataSend, setDataSend] = useState([]);
  const [tableLength, setTableLength] = useState(0);
  const companyId = localStorage.getItem("COMPANY_ID");
  const [selectStatus, setSelectStatus] = useState();
  const [dataChange, setDataChange] = useState();

  useEffect(() => {
    loadData();
    setLoadingData(true);
    setOptionStatus();
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

  const setOptionStatus = () => {
    const status = optionsSatus.filter(
      (item) => item.value > 10 && item.value < 15
    );
    console.log("status", status);

    setSelectStatus(status);
  };

  const loadData = async () => {
    setLoading(true);
    // const tk = JSON.parse(token);
    console.log("loadData AssignLawyers");
    try {
      await axios
        .get(baseUrl + GET_JOB_IN_PROGRESS_BY_STATUS, {
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
    let filteredData;

    if (companyId === "3") {
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

    console.log("filteredData3", filteredData);
    setArrayTable(filteredData);
    setDataArr(filteredData);
    setTableLength(filteredData.length);
  };

  const insertDataOne = async (id, record) => {
    setLoading(true);
    try {
      await axios
        .post(baseUrl + POST_STATUS, dataChange, { headers: HEADERS_EXPORT })
        .then((resQuery) => {
          if (resQuery.status === 200) {
            const dataToUpdate = {
              ...record,
              MAIN_STATUS_ID: dataChange.MAIN_STATUS_ID,
              LAWYER_ID: dataChange.USER_ID,
            };
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

  const onChange = (value, record, loanId) => {
    setDataChange(null);
    console.log("Loan ID:", loanId, record);
    console.log("Selected Value:", value);
    const newItem = {
      MAIN_STATUS_ID: value,
      USER_ID: parseInt(USER_ID),
      LOAN_ID: record.id,
      LOAN_TYPE_ID: record.LOAN_TYPE_ID || null,
      LAW_TYPE_ID: record.LAW_TYPE_ID || null,
      MEMO: "เปลี่ยนสถานะ",
      DATE: dayjs().format("YYYY-MM-DD"),
      PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
    };
    setDataChange(newItem);
    console.log(newItem);
  };

  const confirmInsertOne = (id, record) => {
    console.log(id, dataChange);
    if (dataChange?.LOAN_ID === id) {
      insertDataOne(id, record);
      console.log("confirmInsertOne", dataSend);
    } else {
      message.error("กรุณาเลือกสถานะก่อน");
    }
  };

  const handleChangeStatus = (data) => {
    console.log(data);

    const result = dataArr.map((item) => {
      if (item.id === data.id) {
        console.log("data", data);

        return { ...data };
      } else {
        console.log("item", item);

        return { ...item };
      }
    });

    setDataArr(result);
    console.log("result--->", result);
    setArrayTable(result);
  };

  const cancel = (e) => {
    console.log(e);
    message.error("ยกเลิกการมอบงาน");
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
      title: "ผู้รับผิดชอบ",
      align: "center",
      render: (text, record) => <>{record.LAWYER_NNAME || "-"} </>,
    },
    {
      title: "สถานะเดิม",
      align: "center",
      render: (text, record) => (
        <Tag color="blue">
          {optionsSatus.find((item) => item.value === record.MAIN_STATUS_ID)
            ?.label || "-"}
        </Tag>
      ),
    },
    {
      title: "สถานะ",
      align: "center",
      render: (text, record) => (
        <Select
          popupMatchSelectWidth={false}
          style={{
            width: "auto",
          }}
          placeholder="เลือกสถานะ"
          showSearch
          optionFilterProp="label"
          onChange={(value) => onChange(value, record, record.id)}
          options={selectStatus}
        />
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
            onConfirm={() => confirmInsertOne(record.id, record)}
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
    </>
  );
};

const ChangeStatusContract = MotionHoc(Main);
export default ChangeStatusContract;
