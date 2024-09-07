import {
  Col,
  Row,
  Space,
  Table,
  Card,
  Button,
  message,
  Spin,
  Upload,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useEffect } from "react";
import DetailModal from "../detailStatus/DetailModal";
import {
  ImportOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import moment from "moment";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateData } from "../../../redux/action/DataImport";
import FailedImport from "./modal/FailedImport";

const Main = () => {
  const [isModal, setIsModal] = useState(false);
  const [queryContno, setQueryContno] = useState();
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [data, setData] = useState(null);
  const [failedData, setFailedData] = useState();
  const [isModalFailed, setIsModalFailed] = useState();

  //call redux action
  const dispatch = useDispatch();

  const onQuery = () => {
    if (queryContno) {
      queryData(queryContno);
      console.log("queryContno--->", queryContno);
    }
  };
  const queryData = async () => {
    setLoading(true);
    // const tk = JSON.parse(token);
    const urlQueryData = `https://shark-app-j9jc9.ondigitalocean.app/lawyer/server/loans/${queryContno}`;
    const headers = {};

    await axios
      .get(urlQueryData, {
        headers: headers,
      })
      .then(async (resQuery) => {
        if (resQuery.data) {
          setArrayTable([resQuery.data]);
          console.log("resQuery", resQuery.data);
          setLoading(false);
        } else {
          setArrayTable([]);
          message.error("ไม่มีเลขที่สัญญาที่ค้นหา");
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!data) {
      console.log("no data");
    } else {
      queryMultiData();
    }
  }, [data]);

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);
      let filteredData = [];

      const columnName = "เลขสัญญา";
      sheetData.forEach((row) => {
        if (row[columnName] !== undefined) {
          const trimmedValue =
            typeof row[columnName] === "string"
              ? row[columnName].trim()
              : row[columnName];
          filteredData.push({
            CONTNO: trimmedValue,
          });
        }
      });

      setData(filteredData);
    };

    reader.readAsBinaryString(file);
    return false; // Prevent automatic upload
  };

  const queryMultiData = async () => {
    setLoading(true);

    try {
      if (!data || data.length === 0) {
        message.error("ไม่มีข้อมูลสำหรับการค้นหา");
        setLoading(false);
        return;
      }
      // const data2 = [
      //   { CONTNO: "2-0009600" },
      //   { CONTNO: "2-0007259" },
      //   { CONTNO: "8-0011957" },
      //   // { CONTNO: "2-0010781" },
      // ];

      const promises = data.map(async (item) => {
        const contno = item.CONTNO;
        console.log(contno);

        if (!contno) {
          message.warning("พบค่า CONTNO ที่ไม่ถูกต้อง");
          return null;
        }

        const urlQueryData = `https://shark-app-j9jc9.ondigitalocean.app/lawyer/server/loans/${contno}`;
        const headers = {};

        return axios
          .get(urlQueryData, { headers: headers })
          .then((resQuery) => {
            if (resQuery.data) {
              return resQuery.data;
            } else {
              console.log(`ไม่มีเลขที่สัญญา ${contno} ที่ค้นหา`);
              message.error(`ไม่มีเลขที่สัญญา ${contno} ที่ค้นหา`);
              return null;
            }
          })
          .catch((err) => {
            console.error(err);
            message.error(`ไม่มีเลขที่สัญญา ${contno} ที่ค้นหา`);
            setFailedData({ ...failedData, setFailedData: contno });
            return null;
          });
      });

      const results = await Promise.all(promises);
      console.log("results", results);
      // กรองผลลัพธ์ที่เป็น null ออก
      const filteredResults = results.filter((result) => result !== null);
      console.log("Filtered Results:", filteredResults);

      // อัปเดตสถานะด้วยผลลัพธ์ที่กรองแล้ว
      setArrayTable(filteredResults);
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
    console.log(data);
    try {
      const urlInsert =
        "https://shark-app-j9jc9.ondigitalocean.app/lawyer/dev/api/loans";
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(urlInsert, data, { headers });
      if (response.data) {
        console.log(response);
        message.success("ยืนยันการอนุมัติสำเร็จ");
      }
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      message.error(`บันทึกไม่สำเร็จ: ${error.message}`);
    }
  };

  const uploadProps = {
    customRequest: ({ file, onSuccess, fileList }) => {
      handleFileUpload(file);
      if (file.status !== "uploading") {
        console.log(file, fileList);
      } else {
        onSuccess(); // Call onSuccess when the file is handled
      }
    },
    showUploadList: true, // Hide upload list
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
      title: "วันที่ทำสัญญา",
      dataIndex: "SDATE",
      key: "SDATE",
      align: "center",
      render: (text, record) => (
        <>{record.LOAN.SDATE ? record.LOAN.SDATE : null}</>
      ),
    },

    {
      title: "การจัดการ",
      dataIndex: "tags",
      key: "acction",
      align: "center",
      render: (text, record) => (
        <>
          <Button>
            <PlusCircleOutlined
              style={{ color: "green", fontSize: "20px" }}
              onClick={() => {
                // storeData(record);
                insertData(record);
                console.log("data In", record);
              }}
            />
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Row>
            <Button
              style={{ color: "red" }}
              onClick={() => {
                setIsModalFailed(true);
              }}
            >
              <CloseCircleOutlined style={{ fontSize: "16px" }} />
            </Button>
            <Col span={"24"} style={{ textAlign: "end" }}>
              <Space direction="vertical" size={12}>
                <Upload {...uploadProps} style={{ margin: "10px" }}>
                  <Button style={{ color: "green" }} icon={<ImportOutlined />}>
                    import
                  </Button>
                </Upload>
              </Space>
              <Search
                placeholder="ค้นหาสัญญา"
                onSearch={onQuery}
                enterButton
                onChange={(e) => setQueryContno(e.target.value)}
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
      {isModalFailed ? (
        <FailedImport
          open={isModalFailed}
          close={setFailedData}
          data={failedData}
        />
      ) : null}
    </>
  );
};

export default Main;
