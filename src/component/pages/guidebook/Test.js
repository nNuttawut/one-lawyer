import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Input,
  message,
  Modal,
  Space,
  Spin,
  Table,
  Upload,
} from "antd";
import {
  baseUrl,
  GET_ALL_LOAN,
  HEADERS_EXPORT,
  HEADERS_EXPORT_BEN,
  POST_LOAN_DB2,
} from "../../API/apiUrls";
import {
  DownloadOutlined,
  PlayCircleOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";

const FileUpload = () => {
  const userId = localStorage.getItem("USER_ID");
  const [loadLoan, setLoadLoan] = useState();
  const [getPreData, setGetPreData] = useState();
  const [sqlData, setSqlData] = useState();
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState();
  const [importLoad, setImportLoad] = useState(true);

  const loadData = async () => {
    console.log("loadData");
    setLoading(true);

    try {
      const response = await axios.get(baseUrl + GET_ALL_LOAN, {
        headers: HEADERS_EXPORT,
      });
      if (response.data) {
        let i = 1;
        if (response.data) {
          const newData = response.data.map((item) => ({
            ...item,
            key: i++,
          }));
          setLoadLoan(newData);
          console.log("newData", newData);
          setLoading(false);
          message.success("โหลดข้อมูลสำเร็จ");
        }
      }
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "10%",
      render: (text, object, key) => key + 1,
    },
    {
      title: "เลขที่สัญญา",
      dataIndex: "CONTNO",
      key: "CONTNO",
      align: "center",
      render: (text, record) => (
        <>{record?.LOAN?.CONTNO ? record?.LOAN?.CONTNO : null}</>
      ),
    },
  ];

  const queryMultiData = async () => {
    console.log("queryMultiData");
    setLoading(true);

    if (!getPreData || getPreData.length === 0) {
      message.error("ไม่มีข้อมูลสำหรับการค้นหา");
      setLoading(false);
      return;
    }

    let allResult = []; // ✅ รวมผลลัพธ์จากทุกชุด

    try {
      for (const [index, contnoString] of getPreData.entries()) {
        console.log(`🔍 กำลังยิงกลุ่มที่ ${index + 1}/${getPreData.length}`);

        const payload = { CONTNO: contnoString };

        const resQuery = await axios.post(POST_LOAN_DB2, payload, {
          headers: HEADERS_EXPORT_BEN,
        });

        if (resQuery.status === 200) {
          console.log("✅ resQuery", resQuery.data);
          allResult = [...allResult, ...resQuery.data];
        } else {
          console.warn("⚠️ ไม่พบข้อมูลในกลุ่ม", index + 1);
        }
      }

      if (allResult.length > 0) {
        setResultData(allResult); // ✅ สร้าง SQL
        setLoading(false);
        console.log("โหลดข้อมูลสำเร็จ");
        message.success("โหลดข้อมูลสำเร็จ");
      } else {
        console.warn("❌ ไม่พบข้อมูลจากทุกกลุ่มที่ยิง");
      }
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      setLoading(false);
    }
  };

  const getData = () => {
    if (!loadLoan || loadLoan?.length === 0) {
      message.error("โปรดโหลดข้อมูลจาก DB ก่อน");
      setLoading(false);
      return;
    }

    const preData = loadLoan?.map((item) => item.LOAN.CONTNO);

    // ฟังก์ชันแบ่ง array เป็นกลุ่ม ๆ ละ 100
    const chunkArray = (array, size) => {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    };

    const chunks = chunkArray(preData, 100);

    // แปลงแต่ละ chunk เป็น string พร้อม single quote
    const formattedChunks = chunks.map((chunk) =>
      chunk.map((val) => `'${val}'`).join(",")
    );

    setGetPreData(formattedChunks); // เก็บเป็น array ของ string
    console.log("formattedChunks", formattedChunks);
    message.success("แปลงข้อมูลสำเร็จ");
  };

  const genData = () => {
    if (!resultData || loadLoan?.length === 0) {
      message.error("โปรดโหลดข้อมูลจาก DB ก่อน");
      setLoading(false);
      return;
    }

    const batchSize = 100;

    // 🔹 ฟังก์ชันแบ่งข้อมูลเป็นกลุ่ม ๆ
    const chunkArray = (array, size) => {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    };

    const batches = chunkArray(resultData, batchSize);
    const sqlList = []; // 🔸 เก็บ SQL หลายชุด

    batches.forEach((batch, index) => {
      const caseWhen = batch
        .map((item) => `WHEN '${item.LOAN.CONTNO}' THEN '${item.LOAN.LOCAT}'`)
        .join("\n  ");

      const contnoList = batch
        .map((item) => `'${item.LOAN.CONTNO}'`)
        .join(", ");

      const sqlGen = `
  -- กลุ่มที่ ${index + 1}
  UPDATE loan
  SET LOCAT = CASE CONTNO
    ${caseWhen}
  END
  WHERE CONTNO IN (${contnoList});
      `.trim();

      sqlList.push(sqlGen);
    });

    // 🔹 ส่งเป็น array หรือรวม string ก็ได้
    setSqlData(sqlList); // ถ้าต้องการเก็บแบบ array ของ sql
    // setSqlData(sqlList.join("\n\n")); // ถ้าต้องการรวมเป็น string เดียว

    console.log("สร้าง sql สำเร็จ", sqlList);
    message.success("สร้าง sql สำเร็จ");
  };

  const genDataAll = () => {
    if (!resultData || loadLoan?.length === 0) {
      message.error("โปรดโหลดข้อมูลจาก DB ก่อน");
      setLoading(false);
      return;
    }
    const caseWhen = resultData
      .map((item) => `WHEN ${item.LOAN.CONTNO}' THEN '${item.LOAN.LOCAT}`)
      .join("\n  ");

    console.log("caseWhen", caseWhen);

    const contnoList = resultData
      .map((item) => `${item.LOAN.CONTNO}`)
      .join(", ");

    console.log("contnoList", contnoList);

    const sqlGen = `UPDATE loan
    SET LOCAT = CASE CONTNO
      ${caseWhen}
    END
    WHERE CONTNO IN (${contnoList});`;
    console.log("sqlGen", sqlGen);
    setSqlData(sqlGen);
    message.success("สร้าง sql สำเร็จ");
  };

  const exportToFile = (filename = "update.sql") => {
    if (!resultData || loadLoan?.length === 0) {
      message.error("โปรดโหลดข้อมูลจาก DB ก่อน");
      setLoading(false);
      return;
    }
    const blob = new Blob([sqlData], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    message.success("ดาวน์โหลดสำเร็จ");
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const allData = [];

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);

        const filteredData = sheetData.map((row) => ({
          id: row["id"] || null,
          customer_type_id: row["customer_type_id"] || null,
          dept_collection_fees: row["dept_collection_fees"] || null,
        }));

        allData.push(...filteredData);
      });

      // 🔽 สร้าง SQL ทีละบรรทัดตามข้อมูล
      const sqlStatements = allData.map((row) => {
        return `UPDATE ratecoll_lawyer.work_cancel_contract SET customer_type_id=${
          row.customer_type_id ?? "NULL"
        }, dept_collection_fees=${
          row.dept_collection_fees ?? "NULL"
        } WHERE id=${row.id};`;
      });
      console.log("allData", allData);

      const sqlGenExcel = sqlStatements.join("\n");

      console.log("✅ SQL Generated:", sqlGenExcel);
      setSqlData({ sqlGenExcel });
      message.success("สร้าง SQL สำเร็จ");
    };
    console.log("setSqlData", setSqlData);

    reader.readAsArrayBuffer(file);
    return false;
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

  if (userId) {
    return (
      <Spin spinning={loading} size="large" tip=" Loading... ">
        <div style={{ padding: "1rem" }}>
          <Space wrap size="middle">
            <Upload {...uploadProps}>
              <Button
                style={{ color: "green", marginRight: "5px" }}
                icon={<ImportOutlined />}
              >
                นำเข้า Excel
              </Button>
            </Upload>

            <Button type="primary" onClick={() => loadData()}>
              📥 โหลดข้อมูลจาก DB
            </Button>

            <Button type="default" onClick={() => getData()}>
              🔄 แปลงข้อมูล
            </Button>

            <Button type="dashed" onClick={() => queryMultiData()}>
              🚀 ดึง API
            </Button>

            <Button type="default" onClick={() => genDataAll()}>
              🛠️ สร้าง SQL
            </Button>

            <Button type="default" onClick={() => genData()}>
              🛠️ สร้าง SQL แบบกลุ่ม
            </Button>

            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => exportToFile()}
            >
              📄 ดาวน์โหลดไฟล์
            </Button>
          </Space>

          <div style={{ marginTop: "1rem" }}>
            <Table
              size="small"
              columns={columns}
              dataSource={loadLoan}
              scroll={{ x: 850 }}
              footer={() => <p>จำนวนสัญญาทั้งหมด {loadLoan?.length}</p>}
            />
          </div>
        </div>
      </Spin>
    );
  } else {
    return <p>ไม่สามารถดูข้อมูล</p>;
  }
};

export default FileUpload;
