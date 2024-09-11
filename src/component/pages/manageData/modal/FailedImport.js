import React, { useState, useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Modal,
  Card,
  List,
} from "antd";

const FailedImport = ({ open, close, data }) => {
  const [dataList, setDataList] = useState();

  useEffect(() => {
    if (!data) {
      console.log("no data");
    } else {
      setDataList(data);
    }
  }, [data]);

  const handleCancel = () => {
    close(false);
  };

  return (
    <>
      <Modal
        title="นำเข้าไม่สำเร็จ"
        open={open}
        width={850}
        onCancel={handleCancel}
        footer={[
          <Button style={{ color: "red" }} onClick={handleCancel}>
            ปิด
          </Button>,
        ]}
      >
        <List
          size="small"
          header={<b>เลขสัญญาที่ไม่มีในระบบ</b>}
          bordered
          dataSource={dataList}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Modal>
    </>
  );
};
export default FailedImport;
