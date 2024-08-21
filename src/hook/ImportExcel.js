import { Button, Upload } from "antd";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { UploadOutlined } from "@ant-design/icons";

function ImportExcel() {
  const [data, setData] = useState(null);

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);

      setData(sheetData);
    };

    reader.readAsBinaryString(file);
    return false; // Prevent automatic upload
  };

  const props = {
    onChange({ file, fileList }) {
      if (file.status !== "uploading") {
        console.log(file, fileList);
      }
    },
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

  return (
    <>
      <div>
        <Upload {...uploadProps} style={{ margin: "10px" }}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
        {data && (
          <div>
            <h2>Imported Data:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </>
  );
}

export default ImportExcel;
