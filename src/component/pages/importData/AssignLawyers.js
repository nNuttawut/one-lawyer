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
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useEffect } from "react";
import DetailModal from "../detailStatus/DetailModal";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateData } from "../../../redux/action/DataImport";
import LoadLawyers from "../../../hook/LoadLawyers";

const AssignLawyers = () => {
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [dataArr, setDataArr] = useState(null);
  const [failedData, setFailedData] = useState();
  const [lawyersOption, setLawyersOption] = useState();
  const [lawyersList, setLoadingData] = LoadLawyers();

  const plainOptions = ["แพ่ง", "อาญา"];
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
    const options = lawyersList.map((item) => ({
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
            setArrayTable(resQuery.data);
            setDataArr(resQuery.data);
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

      //   await axios
      //     .get(urlLawyerList, {
      //       headers: headers,
      //     })
      //     .then(async (res) => {
      //       if (res.status === 200) {
      //         let dataList = res.data.map((item) => item.NNAME);
      //         setLawyersList(res.data);
      //         console.log("res", res.data);
      //         console.log("list-->", dataList);
      //         setLoading(false);
      //       } else {
      //         setLawyersList([]);
      //         message.error("ไม่มีข้อมูล");
      //         console.log("res", res.data);
      //         setLoading(false);
      //       }
      //     })
      //     .catch((err) => console.log("ไม่มีข้อมูล", err));
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const storeData = () => {
    dispatch(updateData(arrayTable));
    console.log("in store data");
  };

  const insertData = async (data) => {
    setLoading(true);
    try {
      if (!data || data.length === 0) {
        message.error("ไม่มีเลขสัญญาที่นำเข้าระบบได้");
        setLoading(false);
        return;
      }
      console.log("data--->", data);
      const promises = data.map(async (item) => {
        const arrayData = item;
        console.log("contno-->", arrayData);

        if (!arrayData) {
          message.warning("พบค่า CONTNO ที่ไม่ถูกต้อง");
          return null;
        }

        const urlInsert =
          "https://shark-app-j9jc9.ondigitalocean.app/lawyer/dev/api/loans";
        const headers = {
          "Content-Type": "application/json",
        };

        const response = await axios
          .post(urlInsert, arrayData, { headers })
          .then((resQuery) => {
            if (resQuery.data) {
              return resQuery.data;
            } else {
              console.log(`ไม่มีเลขที่สัญญา ${arrayData} ที่ค้นหา`);
              message.error(`ไม่มีเลขที่สัญญา ${arrayData} ที่ค้นหา`);
              return null;
            }
          })
          .catch((err) => {
            console.error(err);
            message.error(`ไม่มีเลขที่สัญญา ${arrayData} ที่ค้นหา`);
            setFailedData({ ...failedData, setFailedData: arrayData });
            return null;
          });
      });

      const results = await Promise.all(promises);
      console.log("results", results);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = dataArr.filter((item) => item.LOAN.CONTNO.includes(value));
    setArrayTable(result);
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
      dataIndex: "",
      key: "",
      align: "center",
      render: (text, record) => (
        <Checkbox.Group
          options={plainOptions}
          defaultValue={"แพ่ง"}
          onChange={onChange}
        />
      ),
    },

    {
      title: "เลือกทนายรับงาน",
      align: "center",
      render: (text, record) => (
        <>
          <Select
            showSearch
            placeholder="เลือกทนายรับงาน"
            optionFilterProp="label"
            onChange={onChange}
            onSearch={onSearch}
            options={lawyersOption}
          />
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
              <Button>
                <PlusCircleOutlined
                  style={{ color: "green", fontSize: "20px" }}
                  onClick={() => {
                    // storeData(record);
                    // insertData(arrayTable);
                  }}
                />
              </Button>
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
