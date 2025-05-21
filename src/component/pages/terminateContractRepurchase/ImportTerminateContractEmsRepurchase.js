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
import MotionHoc from "../../../utils/MotionHoc";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import axios from "axios";
import FailedImport from "./modal/FailedImport";
import { HEADERS_EXPORT, POST_CANCEL, baseUrl } from "../../API/apiUrls";
import DateCustom from "../../../hook/DateCustom";
import CurrencyFormat from "../../../hook/CurrencyFormat";

const Main = () => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [importLoad, setImportLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [data, setData] = useState([]);
  const [failedData, setFailedData] = useState([]);
  const [isModalFailed, setIsModalFailed] = useState(false);
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const companyId = localStorage.getItem("COMPANY_ID");
  const [tableLength, setTableLength] = useState(0);

  useEffect(() => {
    if (!data) {
      console.log("no data");
    } else {
      // queryMultiData();
    }
  }, [data]);

  const search = (event) => {
    console.log("query--->", event.target.value);
    onSearch(event.target.value);
  };

  const onSearch = (value) => {
    let result = data.filter(
      (item) => item.contno && item.contno.includes(value)
    );
    if (value) {
      setArrayTable(result);
      setTableLength(result.length);
    } else {
      setArrayTable(data);
      setTableLength(data.length);
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result; // อ่านไฟล์เป็น ArrayBuffer
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      }); // อ่านไฟล์ Excel
      const allData = []; // ตัวแปรเก็บข้อมูลรวมจากทุกชีต

      // วนลูปผ่านทุกชีตในไฟล์
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);
        // ดึงข้อมูลเฉพาะคอลัมน์ตาม header ที่ต้องการ
        const filteredData = sheetData.map((row) => ({
          contract_schema: row["สัญญา"] || "", // เลขที่สัญญา
          datetime: row["วันออกจดหมาย"] || "",
          contract_no: row["เลขที่สัญญา"] || "", // เลขที่สัญญา
          account_type: row["ประเภทบัญชี"] || "", // เลขที่สัญญา
          customer_fullname: row["ชื่อลูกค้า"] || "", // ชื่อลูกค้า
          customer_type_id: row["ประเภทลูกค้า"],
          zipcode: row["zipcode"],
          brand: row["ยี่ห้อ"] || "", // ยี่ห้อ
          register_no: row["ทะเบียน"] || "", // ทะเบียน
          parcel_no: row["ems จดหมาย"] || "", // ค่าทวงถาม
          parcel_no_response: row["ems ใบตอบกลับ"] || "", // ค่าทวงถาม
        }));

        // รวมข้อมูลจากชีตนี้เข้าไปใน allData
        allData.push(...filteredData);
      });

      let i = 1;
      if (allData) {
        const newData = allData.map((item) => ({
          ...item,
          key: i++,
        }));
        // แสดงข้อมูลรวม
        console.log(newData);
        setArrayTable(newData);
        setTableLength(newData.length);
        setData(newData); // หรืออัพเดท state ใน React
        setImportLoad(false);
      }
    };

    reader.readAsArrayBuffer(file); // อ่านไฟล์เป็น ArrayBuffer
    return false; // ป้องกันการอัพโหลดอัตโนมัติ
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
    showUploadList: importLoad,
  };

  const confirm = (e) => {
    console.log("eeeee", e);
    let deleteItem = arrayTable.filter((item) => {
      if (item.key !== e.key) {
        return { item };
      }
    });
    setData(deleteItem);
    setArrayTable(deleteItem);
    console.log("deleteItem", deleteItem);

    message.success(`ลบสัญญาเรียบร้อย ${e.contract_no}`);
  };

  const cancel = (e) => {
    console.log(e);
    message.error("ยกเลิกการลบสัญญา");
  };

  const insertData = async () => {
    setLoading(true);
    let duplicate = 0;
    let success = 0;
    const batchSize = 10; // จำนวนคำขอในแต่ละชุด
    let failedRecords = [];

    console.log("🚀 Start posting data...");

    if (!arrayTable || arrayTable.length === 0) {
      message.error("ไม่มีข้อมูล !!");
      setLoading(false);
      return;
    }

    try {
      for (let i = 0; i < arrayTable.length; i += batchSize) {
        const batch = arrayTable.slice(i, i + batchSize); // แบ่งเป็นชุดละ batchSize

        console.log(`🔄 Processing batch ${i / batchSize + 1}`);

        const batchPromises = batch.map(async (item) => {
          if (!item) {
            message.warning("พบค่า CONTNO ที่ไม่ถูกต้อง");
            return null;
          }

          try {
            const resQuery = await axios.post(baseUrl + POST_CANCEL, item, {
              headers: HEADERS_EXPORT,
            });

            if (resQuery.status === 201) {
              success += 1;
              console.log("✅ Inserted:", resQuery.data);
              return resQuery.data;
            } else {
              if (resQuery.data === "Duplicate Contract No.") {
                console.log(`⚠️ Duplicate Contract: ${item.CONTNO}`);
                duplicate += 1;
                return null;
              }
              console.log("❌ Insert failed");
              return null;
            }
          } catch (err) {
            console.error("⚠️ Error:", err);
            message.error("นำเข้าข้อมูลไม่สำเร็จ");
            failedRecords.push(item);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);

        // หน่วงเวลา 1 วินาทีเพื่อลดโหลดของเซิร์ฟเวอร์
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("🚨 Error in batch processing:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);

      if (success > 0) {
        message.success(`นำเข้าข้อมูลสำเร็จ: ${success} รายการ`);
      }
      if (duplicate > 0) {
        message.error(`⚠️ มีเลขสัญญาซ้ำ: ${duplicate} รายการ`);
      }
      if (failedRecords.length > 0) {
        setFailedData(failedRecords);
        message.error(
          ` มีข้อผิดพลาดในบางรายการ (${failedRecords.length} รายการ)`
        );
      }

      // ล้างข้อมูลหลังจากอัปโหลดเสร็จ
      setArrayTable([]);
      setTableLength([]);
      setImportLoad(false);
    }
  };

  const confirmInsert = () => {
    setImportLoad(true);
    const checkData = arrayTable.every((item) => item.parcel_no);
    console.log("checkData", checkData);
    if (checkData) {
      insertData(arrayTable);
    } else {
      message.error("ข้อมูล ems ไม่ครบทั้งหมด");
    }
  };

  const cancelInsert = () => {
    message.error("ยกเลิกการนำเข้าข้อมูล");
  };

  const columns = [
    {
      title: "ลำดับ",
      key: "index", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
      align: "center",
      render: (text, record, index) => (
        <>{index + 1}</> // ใช้ index ที่ถูกส่งมาจาก Table เพื่อเพิ่มลำดับแถว
      ),
    },

    {
      title: "วันที่ออกจดหมาย",
      align: "center",
      render: (text, record) => (
        <>{record.datetime ? convertDateThaiShort(record.datetime) : null}</>
      ),
    },
    {
      title: "ประเภทบัญชี",
      dataIndex: "account_type",
      key: "account_type",
      align: "center",
      render: (text, record) => (
        <>{record.account_type ? record.account_type : null}</>
      ),
    },
    {
      title: "เลขที่สัญญา",
      dataIndex: "contract_no",
      key: "contract_no",
      align: "center",
      render: (text, record) => (
        <>{record.contract_no ? record.contract_no : null}</>
      ),
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "customer_fullname",
      key: "customer_fullname",
      align: "center",
      render: (text, record) => (
        <>{record.customer_fullname ? record.customer_fullname : null} </>
      ),
    },
    {
      title: "ประเภทลูกค้า",
      align: "center",
      render: (text, record) => (
        <>
          {record.customer_type_id === 0
            ? "ผู้เช่าซื้อ"
            : `ผู้ค้ำที่ ${record.customer_type_id}`}
        </>
      ),
    },
    {
      title: "ยี่ห้อ",
      dataIndex: "brand",
      key: "brand", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
      align: "center",
    },
    {
      title: "ทะเบียน",
      dataIndex: "register_no",
      key: "register_no", // ใช้ key แทน dataIndex เพราะเราไม่ต้องการใช้ข้อมูลจาก data
      align: "center",
    },
    {
      title: "ems จดหมาย",
      dataIndex: "parcel_no",
      key: "parcel_no",
      align: "center",
    },
    {
      title: "ems ใบตอบกลับ",
      dataIndex: "parcel_no_response",
      key: "parcel_no_response",
      align: "center",
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
              {/* <Popconfirm
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
                  </Popconfirm> */}
            </Col>
            <Col span={"12"} style={{ textAlign: "end" }}>
              <Space direction="vertical" size={12}>
                <Upload {...uploadProps}>
                  <Button
                    style={{ color: "green", marginRight: "5px" }}
                    icon={<ImportOutlined />}
                  >
                    นำเข้า Excel EMS
                  </Button>
                </Upload>
              </Space>
              <Search
                placeholder="ค้นหาสัญญา"
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
                footer={() => <p>จำนวนสัญญาที่ค้นหาทั้งหมด {tableLength}</p>}
              />
            </Col>
          </Row>
        </Spin>
      </Card>

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

const ImportTerminateContractEmsRepurchase = MotionHoc(Main);
export default ImportTerminateContractEmsRepurchase;
