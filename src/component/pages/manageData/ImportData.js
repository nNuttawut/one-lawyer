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
import FailedImport from "./modal/FailedImport";
import {
  GET_LOAN_FROM_SERVER_IBM,
  POST_LOAN_IN_LAWYERS_DB,
  HEADERS_EXPORT,
  baseUrl,
  POST_LOAN_DB2,
} from "../../API/apiUrls";

const Main = () => {
  const [isModal, setIsModal] = useState(false);
  const [queryContno, setQueryContno] = useState();
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [data, setData] = useState(null);
  const [failedData, setFailedData] = useState([]);
  const [missedData, setMissedData] = useState([]);
  const [isModalFailed, setIsModalFailed] = useState(false);
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const companyId = localStorage.getItem("COMPANY_ID");
  const [tableLength, setTableLength] = useState(0);

  const onQuery = () => {
    if (queryContno) {
      queryData(queryContno);
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
          headers: HEADERS_EXPORT,
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
    let missed = 0;
    console.log("queryData ImportData--->", data);

    if (!data || data.length === 0) {
      message.error("ไม่มีข้อมูลสำหรับการค้นหา");
      setLoading(false);
      return;
    }

    try {
      await axios
        .post(POST_LOAN_DB2, data)
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            setArrayTable(resQuery.data);
            setTableLength(resQuery.data.length);
            console.log("resQuery", resQuery.data);
            setLoading(false);
          } else if (resQuery.data === "Contract No. Not Found") {
            console.log(`มีเลขสัญญาอยู่ในระบบแล้ว`);
            missed += 1;
            return null;
          } else {
            console.log(`มีเลขสัญญาอยู่ในระบบแล้ว`);
            missed += 1;
            return null;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);

      let filteredData = [];

      const columnName = "เลขสัญญา"; // ชื่อคอลัมน์ใน Excel
      sheetData.forEach((row) => {
        if (row[columnName] !== undefined) {
          const trimmedValue =
            typeof row[columnName] === "string"
              ? row[columnName].trim()
              : row[columnName];
          filteredData.push(trimmedValue);
        }
      });

      // แปลง Array ให้เป็น String ในฟอร์แมต "'value1','value2','value3'"
      const formattedData = filteredData.map((val) => `'${val}'`).join(",");

      setData({ CONTNO: formattedData }); // เก็บค่าเป็น Object ที่มี key "CONTNO"
    };

    reader.readAsArrayBuffer(file);
    return false;
  };

  const insertData = async () => {
    setLoading(true);
    let duplicate = 0;
    let success = 0;
    let failed = 0;
    const batchSize = 10; // ส่งข้อมูลเป็นชุดละ 10 รายการ

    if (!arrayTable || arrayTable.length === 0) {
      message.error("ไม่มีเลขสัญญา");
      setLoading(false);
      return;
    }

    try {
      for (let i = 0; i < arrayTable.length; i += batchSize) {
        const batch = arrayTable.slice(i, i + batchSize); // แบ่งข้อมูลเป็นชุดๆ
        console.log("Processing batch:", batch);
        const batchPromises = batch.map(async (item) => {
          try {
            const resQuery = await axios.post(
              baseUrl + POST_LOAN_IN_LAWYERS_DB,
              item,
              { headers: HEADERS_EXPORT }
            );

            if (resQuery.status === 201) {
              success += 1;
              return resQuery.data;
            } else if (resQuery.data === "Duplicate Contract No.") {
              console.log(`มีเลขสัญญาอยู่ในระบบแล้ว`);
              duplicate += 1;
              return null;
            } else {
              console.log(`นำเข้าข้อมูลไม่สำเร็จ`);
              failed += 1;
              return null;
            }
          } catch (err) {
            console.error("Error:", err);
            failed += 1;
            return null;
          }
        });

        await Promise.all(batchPromises);

        // หน่วงเวลา 1 วินาทีเพื่อไม่ให้เซิร์ฟเวอร์โหลดหนักเกินไป
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      console.log(
        `✅ สำเร็จ: ${success}, ❌ ซ้ำ: ${duplicate}, ⚠️ ล้มเหลว: ${failed}`
      );
    } catch (error) {
      console.error("Error inserting data:", error);
      message.error("เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
    } finally {
      setLoading(false);

      if (success > 0) {
        message.success(`นำเข้าข้อมูลสำเร็จ ${success} รายการ`);
      }
      if (duplicate > 0) {
        message.warning(`มีเลขสัญญาซ้ำ ${duplicate} รายการ`);
      }
      if (failed > 0) {
        message.error(`นำเข้าข้อมูลไม่สำเร็จ ${failed} รายการ`);
      }

      // ล้างข้อมูลเมื่อเสร็จสิ้น
      setArrayTable([]);
    }
  };

  const uploadProps = {
    customRequest: ({ file, onSuccess, fileList }) => {
      setTimeout(() => {
        message.warning(`ไม่ควร import สัญญาได้เกิน 100 สัญญาต่อครั้ง`);
      }, 1000);
      handleFileUpload(file);
      if (file.status !== "uploading") {
        console.log(file, fileList);
      } else {
        onSuccess(); // Call onSuccess when the file is handled
      }
    },
    showUploadList: arrayTable?.length > 0 ? false : true,
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
    if (!data) {
      return message.error("ไม่มีข้อมูล");
    }

    // แปลง CONTNO เป็น array
    let contnoList = data?.CONTNO?.split(",").map((c) =>
      c.trim().replace(/'/g, "")
    );
    console.log("contnoList", contnoList);

    // ดึงค่า CONTNO ทั้งหมดจาก arrayTable
    let existingContnos = arrayTable?.map((item) => item?.LOAN?.CONTNO);

    // หาค่าที่ไม่มีใน existingContnos
    let missingContnos = contnoList.filter(
      (item) => !existingContnos.includes(item)
    );

    if (missingContnos.length > 0) {
      setFailedData(missingContnos);
      console.log("missingContnos", missingContnos);
      setIsModalFailed(true);
      // message.error(`ไม่พบสัญญา: ${missingContnos.join(", ")}`);
    } else {
      message.success("พบสัญญาครบทุกตัว");
    }
  };

  const cancelModal = () => {
    message.error("ยกเลิกดูข้อมูลที่ค้นหาไม่เจอ");
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
                    นำเข้า Excel
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
                footer={() => <p>จำนวนสัญญาที่ค้นหาทั้งหมด {tableLength}</p>}
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
          dataMiss={missedData}
        />
      ) : null}
    </>
  );
};

const ImportData = MotionHoc(Main);
export default ImportData;
