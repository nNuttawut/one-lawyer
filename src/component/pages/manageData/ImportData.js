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
  Popconfirm,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useEffect } from "react";
import DetailModal from "../detail/DetailModal";
import MotionHoc from "../../../utils/MotionHoc";
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
import {
  GET_LOAN_FROM_SERVER_IBM,
  POST_LOAN_IN_LAWYERS_DB,
  HEADERS_EXPORT,
  baseUrl,
} from "../../API/apiUrls";

const Main = () => {
  const [isModal, setIsModal] = useState(false);
  const [queryContno, setQueryContno] = useState();
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [data, setData] = useState(null);
  const [failedData, setFailedData] = useState([]);
  const [isModalFailed, setIsModalFailed] = useState(false);
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const companyId = localStorage.getItem("COMPANY_ID");
  const [tableLength, setTableLength] = useState(0);
  // call redux action
  const dispatch = useDispatch();

  const onQuery = () => {
    if (queryContno) {
      queryData(queryContno.trim());
      console.log("queryContno--->", queryContno);
    }
  };

  useEffect(() => {
    if (!data) {
      console.log("no data");
    } else {
      queryMultiData();
    }
  }, [data]);

  const queryData = async () => {
    setLoading(true);
    // const tk = JSON.parse(token);
    let companyUse;
    console.log("queryData ImportData");
    if (companyId === "1" || companyId === "2") {
      companyUse = "1";
    } else {
      companyUse = "2";
    }
    try {
      await axios
        .get(baseUrl + GET_LOAN_FROM_SERVER_IBM, {
          params: { contractNo: queryContno, company: companyUse },
          HEADERS_EXPORT,
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

  const queryMultiData = async () => {
    setLoading(true);
    let failed = 0;
    let companyUse;
    console.log("queryData ImportData");
    if (companyId === "1" || companyId === "2") {
      companyUse = "1";
    } else {
      companyUse = "2";
    }
    console.log("queryMultiData ImportData");
    try {
      if (!data || data.length === 0) {
        message.error("ไม่มีข้อมูลสำหรับการค้นหา");
        setLoading(false);
        return;
      }

      const promises = data.map(async (item) => {
        const contno = item.CONTNO;

        if (!contno) {
          message.warning("พบค่า CONTNO ที่ไม่ถูกต้อง");
          return null;
        }

        return axios
          .get(baseUrl + GET_LOAN_FROM_SERVER_IBM, {
            params: { contractNo: contno, company: companyUse },
            HEADERS_EXPORT,
          })
          .then((resQuery) => {
            if (resQuery.status === 200) {
              return resQuery.data;
            } else {
              console.log(`ไม่มีเลขที่สัญญาที่ค้นหา`);
              failed += 1;
              setFailedData((prevFailedData) => [...prevFailedData, contno]);
              return null;
            }
          })
          .catch((err) => {
            console.error(err);
            failed += 1;
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
      setTableLength(filteredResults.length);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
      if (data.length !== failed) {
        message.error(`เลขที่สัญญาที่ค้นหาไม่เจอโปรดเข้าไปดูที่ เครื่องหมาย ⓧ`);
      }
    }
  };

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

  // redux
  // const storeData = () => {
  //   dispatch(updateData(arrayTable));
  //   console.log("in store data");
  // };

  const insertData = async () => {
    setLoading(true);
    let duplicate = 0;
    let success = 0;
    console.log("post data");
    try {
      if (!arrayTable || arrayTable.length === 0) {
        message.error("ไม่มีเลขสัญญา");
        setLoading(false);
        return;
      }

      const promises = arrayTable.map(async (item) => {
        const arrayData = item;

        if (!arrayData) {
          message.warning("พบค่า CONTNO ที่ไม่ถูกต้อง");
          return null;
        }
        await axios
          .post(baseUrl + POST_LOAN_IN_LAWYERS_DB, arrayData, {
            HEADERS_EXPORT,
          })
          .then((resQuery) => {
            if (resQuery.status === 201) {
              success += 1;
              console.log(resQuery.data);
              return resQuery.data;
            } else {
              if (resQuery.data === "Duplicate Contract No.") {
                console.log(`มีเลขสัญญาอยู่ในระบบแล้ว`);
                duplicate += 1;
                return null;
              }
              console.log(`นำเข้าข้อมูลสำเร็จไม่สำเร็จ `);
              return null;
            }
          })
          .catch((err) => {
            console.error(err);
            message.error(`นำเข้าข้อมูลไม่สำเร็จ`);
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
      if (success > 0) {
        message.success(`นำเข้าข้อมูลสำเร็จ`);
        setArrayTable([]);
      }
      if (duplicate > 0) {
        message.error(`มีเลขสัญญาอยู่ในระบบแล้ว`);
        setArrayTable([]);
      }
    }
  };

  const uploadProps = {
    customRequest: ({ file, onSuccess, fileList }) => {
      setTimeout(() => {
        message.warning(`ไม่สามารถ import สัญญาได้เกิน 50 สัญญาต่อครั้ง`);
      }, 1000);
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
      {ROLE_ID === "1" || ROLE_ID === "2" ? (
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
                    description="ต้องการดูเลขสัญญาที่ค้นหาไม่เจอใช่หรือไม่ ?"
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
                        import Excel
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
                    footer={() => (
                      <p>จำนวนสัญญาที่ค้นหาทั้งหมด {tableLength}</p>
                    )}
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
      ) : (
        <Card>
          {" "}
          <b>ไม่มีสิทธ์เข้าถึงข้อมูล</b>
        </Card>
      )}
    </>
  );
};

const ImportData = MotionHoc(Main);
export default ImportData;
