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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [dataList, setDataList] = useState();

  useEffect(() => {
    if (!data) {
      console.log("no data");
    } else {
      //   setDataList(data);
    }
  }, [data]);

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  return (
    <>
      <Modal
        title="นำเข้าไม่สำเร็จ"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={850}
      >
        <Card>
          <List
            size="small"
            header={<div>เลขสัญญาที่ไม่มีในระบบ</div>}
            bordered
            dataSource={dataList}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Card>
      </Modal>
    </>
  );
};
export default FailedImport;
