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
  Tooltip,
  Modal,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState, useEffect, useMemo } from "react";
import DetailModal from "../detail/DetailModal";
import MotionHoc from "../../../utils/MotionHoc";
import {
  DeleteOutlined,
  CloseCircleOutlined,
  ImportOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import axios from "axios";
import FailedImport from "./modal/FailedImport";
import {
  GET_LOAN_FROM_SERVER_IBM,
  HEADERS_EXPORT,
  baseUrl,
  POST_TERMINATE_BY_CONTRACT,
} from "../../API/apiUrls";
import DateCustom from "../../../hook/DateCustom";
import CurrencyFormat from "../../../hook/CurrencyFormat";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

const Main = () => {
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [isModal, setIsModal] = useState(false);
  const [queryContno, setQueryContno] = useState();
  const [loading, setLoading] = useState(false);
  const [arrayTable, setArrayTable] = useState();
  const [data, setData] = useState(null);
  const [dataStore, setDataStore] = useState(null);
  const [failedData, setFailedData] = useState([]);
  const [isModalFailed, setIsModalFailed] = useState(false);
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const companyId = localStorage.getItem("COMPANY_ID");
  const [tableLength, setTableLength] = useState(0);
  const [arrow, setArrow] = useState("Show");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  // call redux action
  // const dispatch = useDispatch();

  const onQuery = () => {
    if (queryContno) {
      queryData(queryContno);
      console.log("queryContno--->", queryContno);
    }
  };

  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);

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
            filterData(mergeDataWithGuarantors(resQuery.data));
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
            headers: HEADERS_EXPORT,
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
      filterData(mergeDataWithGuarantors(filteredResults));
      // อัปเดตสถานะด้วยผลลัพธ์ที่กรองแล้ว
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

  const mergeDataWithGuarantors = (data) => {
    console.log("mergeDataWithGuarantors", data);

    const mergedData = data.reduce((acc, record) => {
      // ข้อมูลหลักของลูกค้า (แยกตามที่อยู่)
      const mainData = (
        Array.isArray(record.CUSTOMER?.ADDRESS)
          ? record.CUSTOMER.ADDRESS
          : [record.CUSTOMER?.ADDRESS]
      ).map((addr) => ({
        ...record,
        cusType: 0, // ลูกค้าหลัก
        CONTNO: record.LOAN?.CONTNO || "", // ดึง CONTNO
        NAME: `${record.CUSTOMER.SNAM} ${record.CUSTOMER.NAME1 || ""} ${
          record.CUSTOMER.NAME2 || ""
        }`.trim(),
        address: addr, // แยกตามที่อยู่
      }));

      // ข้อมูลผู้ค้ำประกัน (แยกตามที่อยู่)
      const guarantorData = (record.GUARANTORS || []).flatMap((guarantor) =>
        (Array.isArray(guarantor.ADDRESS)
          ? guarantor.ADDRESS
          : [guarantor.ADDRESS]
        ).map((addr) => ({
          ...record,
          cusType: parseInt(guarantor.GARNO), // ระบุเป็นผู้ค้ำประกัน
          CONTNO: record.LOAN?.CONTNO || "",
          NAME: `${guarantor.SNAM} ${guarantor.NAME1 || ""} ${
            guarantor.NAME2 || ""
          }`.trim(),
          address: addr, // แยกตามที่อยู่ของผู้ค้ำ
        }))
      );

      return [...acc, ...mainData, ...guarantorData];
    }, []);

    // เรียงลำดับ CONTNO ก่อน แล้ว GARNO ทีหลัง
    const sortedData = mergedData.sort((a, b) => {
      const contnoComparison = a.CONTNO.localeCompare(b.CONTNO, undefined, {
        numeric: true,
      });
      if (contnoComparison !== 0) return contnoComparison;

      return (a.cusType || 0) - (b.cusType || 0);
    });

    // เพิ่ม key ให้แต่ละ record เริ่มจาก 1
    return sortedData.map((item, index) => ({
      ...item,
      key: index + 1,
    }));
  };

  const filterData = (value) => {
    console.log(value);
    setArrayTable(value);
    setTableLength(value.length);
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result; // อ่านเป็น ArrayBuffer
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      }); // แปลง ArrayBuffer เป็น Uint8Array
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

    reader.readAsArrayBuffer(file); // ใช้ ArrayBuffer แทน BinaryString
    return false; // Prevent automatic upload
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

  const confirmModal = () => {
    setIsModalFailed(true);
  };
  const cancelModal = () => {
    message.error("ไม่ดูข้อมูลที่ค้นหาไม่เจอ");
  };

  const confirm = (e) => {
    console.log("eeeee", e);
    let deleteItem = arrayTable.filter((item) => {
      if (item.key !== e.key) {
        return { item };
      }
    });
    setArrayTable(deleteItem);
    console.log("deleteItem", deleteItem);

    message.success(`ลบสัญญาเรียบร้อย ${e.contract_no}`);
  };

  const cancel = (e) => {
    console.log(e);
    message.error("ยกเลิกการลบสัญญา");
  };

  const createAndDownloadExcel = async () => {
    // สร้าง Workbook
    const workbook = new ExcelJS.Workbook();
    let uniqueGCodes = [];
    // กำหนดประเภท GCODE ที่ต้องการแยก (ไม่ซ้ำกัน)
    if (selectedRows && selectedRows.length > 0) {
      uniqueGCodes = [...new Set(selectedRows.map((data) => data.GCODE))];
      console.log("selectedRows if1", uniqueGCodes);
    } else {
      uniqueGCodes = [...new Set(arrayTable.map((data) => data.GCODE))];
      console.log("arrayTable else1", uniqueGCodes);
    }

    // วนลูปสร้าง Sheet สำหรับแต่ละ GCODE
    uniqueGCodes.forEach((gCode) => {
      const worksheet = workbook.addWorksheet(`ประเภท ${gCode}`); // ใช้ GCODE เป็นชื่อ Sheet

      // กำหนดคอลัมน์ของ Worksheet
      worksheet.columns = [
        { header: "ลำดับ", key: "no", width: 10 },
        { header: "รอบวันออกจดหมายในระบบ", key: "date", width: 20 },
        { header: "เลขที่สัญญา", key: "contno", width: 20 },
        { header: "ชื่อลูกค้า", key: "cusName", width: 30 },
        { header: "ประเภทลูกค้า", key: "cusType", width: 10 },
        { header: "zipcode", key: "zipcode", width: 10 },
        { header: "ยี่ห้อ", key: "type", width: 15 },
        { header: "ทะเบียน", key: "regNo", width: 15 },
        { header: "ems จดหมาย", key: "emsNo", width: 25 },
        { header: "ems ใบตอบกลับ", key: "emsResponeNo", width: 25 },
      ];

      // กรองข้อมูลที่ตรงกับ GCODE
      let filteredData = [];

      if (selectedRows && selectedRows.length > 0) {
        filteredData = selectedRows.filter((data) => data.GCODE === gCode);
        console.log("selectedRows if2", filteredData);
      } else {
        filteredData = arrayTable.filter((data) => data.GCODE === gCode);
        console.log("arrayTable else2", filteredData);
      }

      // เพิ่มข้อมูลในแต่ละแถว
      filteredData.forEach((data, index) => {
        worksheet.addRow([
          index + 1,
          dayjs().format("YYYY-MM-DD"), // วันที่ส่ง
          data.CONTNO,
          data.NAME,
          data.cusType,
          data.address.ZIP,
          data.MORTGAGE.TYPE,
          data.MORTGAGE.REGNO,
        ]);
      });

      // จัดรูปแบบเซลล์ใน Worksheet
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" }; // จัดกึ่งกลางแนวตั้งและแนวนอน
        });
      });
    });

    // สร้างไฟล์และดาวน์โหลด
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // ดาวน์โหลดไฟล์
    saveAs(
      blob,
      `รายงานบอกเลิกสัญญา(มือ) ${dayjs().format("YYYY_MM_DD")}.xlsx`
    );
  };

  const onClickDownload = () => {
    Modal.confirm({
      title: "ต้องการดาวน์ข้อมูล excel ?",
      okText: "ยืนยัน",
      cancelText: "ปิด",
      onOk: () => {
        createAndDownloadExcel();
      },
    });
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
    console.log("Selected Row Keys:", selectedRowKeys); // คีย์ของแถวที่เลือก
    console.log("Selected Rows Data:", selectedRows); // ข้อมูลของแถวที่เลือก
    setSelectedRows(selectedRows); // เก็บข้อมูลแถวที่เลือกใน state;
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys, selectedRows) => {
      onSelectChange(rowKeys, selectedRows);
    },
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
      title: "วันที่นำเข้า",
      align: "center",
      render: (record) => <>{convertDateThaiShort()}</>,
    },
    {
      title: "เลขที่สัญญา",
      align: "center",
      render: (record) => <>{record.CONTNO}</>,
    },
    {
      title: "ชื่อ-นามสกุล",
      align: "center",
      render: (text, record) => <>{record.NAME ? record.NAME : null}</>,
    },
    {
      title: "ประเภทลูกค้า",
      align: "center",
      render: (text, record) => (
        <>
          {record.cusType === 0 ? "ผู้เช่าซื้อ" : `ผู้ค้ำที่ ${record.cusType}`}
        </>
      ),
    },
    {
      title: "รายละเอียดรถ",
      align: "center",
      render: (text, record) => (
        <>
          {record.MORTGAGE.TYPE} <br />
          {record.MORTGAGE.REGNO}
        </>
      ),
    },
    // {
    //   title: "ค้างงวด",
    //   dataIndex: "EXP_PRD",
    //   key: "EXP_PRD",
    //   align: "center",
    //   render: (text, record) => (
    //     <>{record.LOAN.CONTNO ? record.LOAN.CONTNO : null}</>
    //   ),
    // },
    // {
    //   title: "เงินค้าง",
    //   align: "center",
    //   render: (text, record) => (
    //     <>
    //       {record.TOTPRC - record.SMPAY} <br />
    //     </>
    //   ),
    // },
    // {
    //   title: "ค่าทวงถาม",
    //   align: "center",
    //   render: (text, record) => <>{record.LETTER}</>,
    // },

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
            <Col
              span={"24"}
              style={{
                textAlign: "end",
                marginTop: "10px",
              }}
            >
              <Space direction="vertical" size={12}>
                <Tooltip
                  placement="bottom"
                  title="บันทึกข้อมูล excel"
                  arrow={mergedArrow}
                >
                  <PrinterOutlined
                    style={{
                      fontSize: "40px",
                      color: "green",
                      cursor: "pointer",
                    }}
                    key="print"
                    onClick={onClickDownload}
                  />
                </Tooltip>
              </Space>
            </Col>
            <Col span={"24"}>
              <Table
                style={{ marginTop: "10px" }}
                size="small"
                columns={columns}
                dataSource={arrayTable}
                rowSelection={rowSelection}
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
        />
      ) : null}
    </>
  );
};

const CreateTerminateContractHand = MotionHoc(Main);
export default CreateTerminateContractHand;
