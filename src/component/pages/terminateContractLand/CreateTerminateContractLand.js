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
  DatePicker,
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
  POST_LOAN_DB2,
  baseUrl,
} from "../../API/apiUrls";
import DateCustom from "../../../hook/DateCustom";
import CurrencyFormat from "../../../hook/CurrencyFormat";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import PrintCancel from "./modal/PrintCancel";

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
  const [isModalPrint, setIsModalPrint] = useState(false);
  const [tableLength, setTableLength] = useState(0);
  const [arrow, setArrow] = useState("Show");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [dataSearch, setDataSearch] = useState(0);
  const [dataCheck, setDataCheck] = useState([]);
  const [dateQuery, setDateQuery] = useState(dayjs());

  const onQuery = () => {
    if (queryContno) {
      queryData();
      console.log("queryContno--->", queryContno);
    }
  };

  const queryData = async () => {
    setLoading(true);
    let value = `'${queryContno}'`;
    try {
      await axios
        .post(POST_LOAN_DB2, { CONTNO: value })
        .then(async (resQuery) => {
          if (resQuery.status === 200 && resQuery.data) {
            setDataCheck(resQuery.data);
            setDataSearch(resQuery.data.length);
            filterData(mergeDataWithGuarantors(resQuery.data));
            console.log("resQueryKKK", resQuery.data);
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
    console.log("data", data);

    if (data) {
      queryMultiData();
    }
  }, [data]);

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
        ADDRESS: addr, // แยกตามที่อยู่
      }));

      const guarantorData = (record.GUARANTORS || []).map((guarantor) => {
        const addressList = Array.isArray(guarantor.ADDRESS)
          ? guarantor.ADDRESS
          : [guarantor.ADDRESS];

        // หา address ที่ตรงกับ ADDRMAIL
        const mainAddress = addressList.find(
          (addr) => addr.ADDRNO === guarantor.ADDRMAIL
        );
        return {
          ...record,
          cusType: parseInt(guarantor.GARNO), // ผู้ค้ำ
          CONTNO: record.LOAN?.CONTNO || "",
          NAME: `${guarantor.SNAM} ${guarantor.NAME1 || ""} ${
            guarantor.NAME2 || ""
          }`.trim(),
          ADDRESS: mainAddress || {}, // แสดงเฉพาะที่อยู่หลัก
        };
      });

      return [...acc, ...mainData, ...guarantorData];
    }, []);

    // const sortedData = mergedData.sort((a, b) => {
    //   return (a.cusType || 0) - (b.cusType || 0); // เรียงเฉพาะ cusType
    // });

    // เพิ่ม key ให้แต่ละ record เริ่มจาก 1
    return mergedData.map((item, index) => ({
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

  const queryMultiData = async () => {
    setLoading(true);
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
            console.log("resQuery", resQuery.data);
            setDataCheck(resQuery.data);
            setDataSearch(resQuery.data.length);
            // let sorting = resQuery.data.sort((a, b) => {
            //   return data.indexOf(a.LOAN.CONTNO) - data.indexOf(b.LOAN.CONTNO);
            // });

            // console.log("sorting", sorting);
            filterData(mergeDataWithGuarantors(resQuery.data));
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
    if (!data) {
      return message.error("ไม่มีข้อมูล");
    }

    // แปลง CONTNO เป็น array
    let contnoList = data?.CONTNO.split(",").map((c) =>
      c.trim().replace(/'/g, "")
    );
    console.log("contnoList", contnoList);
    console.log("dataCheck", dataCheck);

    // ดึงค่า CONTNO ทั้งหมดจาก arrayTable
    let existingContnos = dataCheck.map((item) => item?.LOAN?.CONTNO);

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
      const worksheet = workbook.addWorksheet(`ประเภท`); // ใช้ GCODE เป็นชื่อ Sheet

      // กำหนดคอลัมน์ของ Worksheet
      worksheet.columns = [
        { header: "ลำดับ", key: "no", width: 10 },
        { header: "วันออกจดหมาย", key: "date", width: 15 },
        { header: "ประเภทบัญชี", key: "accType", width: 15 },
        { header: "เลขที่สัญญา", key: "contno", width: 20 },
        { header: "ชื่อลูกค้า", key: "cusName", width: 30 },
        { header: "ประเภทลูกค้า", key: "cusType", width: 10 },
        { header: "ที่อยู่", key: "addr", width: 30 },
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
          "cancelLand",
          data.CONTNO,
          data.NAME,
          data.cusType,
          data.ADDRESS.ADDR1,
          data.ADDRESS.ZIP,
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

  const handleChangeDate = (date) => {
    console.log("date", date);
    setDateQuery(dayjs(date).format("YYYY-MM-DD"));
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
      title: "รายละเอียด",
      align: "center",
      render: (text, record) => (
        <>
          {record.MORTGAGE.COLOR} <br />
          {record.MORTGAGE.STRNO} <br />
          {record.MORTGAGE.BAAB} {record.MORTGAGE.MODEL} {record.MORTGAGE.TYPE}
        </>
      ),
    },

    // {
    //   title: "การจัดการ1",
    //   align: "center",
    //   render: (text, record) => (
    //     <>
    //       <Popconfirm
    //         title="ลบสัญญา"
    //         description="คุณต้องการลบสัญญานี้ใช่หรือไม่ ?"
    //         onConfirm={() => {
    //           confirm(record);
    //         }}
    //         onCancel={cancel}
    //         okText="ยืนยัน"
    //         cancelText="ยกเลิก"
    //       >
    //         <Button style={{ fontSize: "16px", color: "red" }}>
    //           <DeleteOutlined />
    //         </Button>
    //       </Popconfirm>
    //     </>
    //   ),
    // },
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
          
            <Col span={"24"} style={{ textAlign: "end" }}>
              <Space direction="vertical" size={12}>
                <Tooltip
                  placement="bottom"
                  title="วันที่คิดดอกเบี้ยถึง"
                  arrow={mergedArrow}
                >
                  <DatePicker
                    size="large"
                    style={{
                      marginRight: "10px",
                      marginBottom: "10px",
                    }}
                    defaultValue={dateQuery}
                    onChange={handleChangeDate}
                  />
                </Tooltip>
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
                    // onClick={onClickDownload}
                    onClick={() => {
                      if(dateQuery){
                       setIsModalPrint(true)
                      }else{
                        message.error('กรุณาเลือกวันที่คิดดอกเบี้ยถึง !!')
                      }
                    }
                      }
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
                // rowSelection={rowSelection}
                scroll={{ x: 850 }}
                footer={() => (
                  <p>
                    จำนวนสัญญาที่ค้นหาเจอ {dataSearch}
                    <br />
                    จำนวนข้อมูลผู้เช่าซื้อและผู้ค้ำ {tableLength}
                  </p>
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
      {isModalPrint ? (
        <PrintCancel
          open={isModalPrint}
          close={setIsModalPrint}
          data={arrayTable}
          queryContno={queryContno}
          dateQuery={dateQuery}
        />
      ) : null}
    </>
  );
};

const CreateTerminateContractLand = MotionHoc(Main);
export default CreateTerminateContractLand;
