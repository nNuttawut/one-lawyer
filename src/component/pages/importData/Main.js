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
  Select,
  Popconfirm,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useEffect } from "react";
import DetailModal from "../detailStatus/DetailModal";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
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
  const [failedData, setFailedData] = useState([]);
  const [isModalFailed, setIsModalFailed] = useState(false);

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
    try {
      await axios
        .get(urlQueryData, {
          headers: headers,
        })
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            setArrayTable([resQuery.data]);
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
            if (resQuery.status === 200) {
              return resQuery.data;
            } else {
              console.log(`ไม่มีเลขที่สัญญาที่ค้นหา`);
              message.error(`ไม่มีเลขที่สัญญาที่ค้นหา ${contno}`);
              setFailedData((prevFailedData) => [...prevFailedData, contno]);
              return null;
            }
          })
          .catch((err) => {
            console.error(err);
            message.error(`ไม่มีเลขที่สัญญาที่ค้นหา ${contno}`);
            setFailedData((prevFailedData) => [...prevFailedData, contno]);
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

  const insertData = async () => {
    setLoading(true);
    try {
      if (!arrayTable || arrayTable.length === 0) {
        message.error("ไม่มีเลขสัญญา");
        setLoading(false);
        return;
      }
      console.log("data--->", arrayTable);
      const promises = arrayTable.map(async (item) => {
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
            if (resQuery.data !== "Duplicate Contract No.") {
              message.success(`นำเข้าข้อมูลสำเร็จ`);
              console.log(resQuery.data);
              return resQuery.data;
            } else {
              if (resQuery.data === "Duplicate Contract No.") {
                console.log(`ข้อมูลซ้ำกัน`);
                message.error(`ข้อมูลซ้ำกัน ${arrayData.LOAN.CONTNO}`);
                return null;
              }
              console.log(`ไม่มีเลขที่สัญญา ${arrayData.LOAN.CONTNO}`);
              message.error(`ไม่มีเลขที่สัญญา ${arrayData.LOAN.CONTNO}`);
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

      const response = await Promise.all(promises);
      console.log("results", response);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
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

  const confirm = (e) => {
    console.log("eeeee", e);
    let deleteItem = arrayTable.filter((item) => {
      if (item.LOAN.CONTNO !== e.LOAN.CONTNO) {
        return { item };
      }
    });

    setArrayTable(deleteItem);
    console.log("deleteItem", deleteItem);

    message.success(`ลบสัญญาเรียบร้อย ${e.LOAN.CONTNO}`);
  };
  const cancel = (e) => {
    console.log(e);
    message.error("ยกเลิกการลบสัญญา");
  };

  const confirmInsert = () => {
    insertData(arrayTable);
  };
  const cancelInsert = () => {
    message.error("ยกเลิกการนำเข้าข้อมูล");
  };

  const confirmModal = () => {
    setIsModalFailed(true);
  };
  const cancelModal = () => {
    message.error("ไม่ดูข้อมูลที่ค้นหาไม่เจอ");
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
      title: "การจัดการ",
      align: "center",
      render: (text, record) => (
        <>
          <Popconfirm
            title="ลบสัญญา"
            description="คุณต้องการลบสัญญานี้ใช่หรือไม่ ?"
            onConfirm={() => {
              confirm(record);
            }}
            onCancel={cancel}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
          >
            <Button style={{ fontSize: "16px", color: "red" }}>
              <DeleteOutlined />
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
                title="นำเข้าข้อมูล"
                description="คุณต้องการนำเข้าข้อมูลทั้งหมดใช่หรือไม่"
                onConfirm={confirmInsert}
                onCancel={cancelInsert}
                okText="ยืนยัน"
                cancelText="ยกเลิก"
              >
                <Button style={{ marginRight: "10px" }}>
                  <PlusCircleOutlined
                    style={{ color: "green", fontSize: "16px" }}
                    onClick={() => {
                      // storeData(record);
                    }}
                  />
                </Button>
              </Popconfirm>
              <Popconfirm
                title="เลขสัญญาที่ค้นหาไม่เจอ"
                description="ต้องการดูเลขสัญญาที่ค้นหาไม่เจอใช่หรือไม่"
                onConfirm={confirmModal}
                onCancel={cancelModal}
                okText="ตกลง"
                cancelText="ยกเลิก"
              >
                <Button style={{ color: "red" }}>
                  <CloseCircleOutlined style={{ fontSize: "16px" }} />
                </Button>
              </Popconfirm>
            </Col>
            <Col span={"12"} style={{ textAlign: "end" }}>
              <Space direction="vertical" size={12}>
                <Upload {...uploadProps}>
                  <Button
                    style={{ color: "green", marginRight: "5px" }}
                    icon={<ImportOutlined />}
                  >
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
          close={setIsModalFailed}
          data={failedData}
        />
      ) : null}
    </>
  );
};

export default Main;
