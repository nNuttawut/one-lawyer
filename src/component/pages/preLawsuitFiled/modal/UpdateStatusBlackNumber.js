import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Card,
  Cascader,
  Checkbox,
  Select,
  TreeSelect,
  Radio,
  Steps,
  Space,
} from "antd";
import {
  SmileOutlined,
  FormOutlined,
  BellOutlined,
  AuditOutlined,
  SearchOutlined,
  NotificationOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";

const UpdateStatusBlackNumber = ({ open, close }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [defaultStatus, setDefaultStatus] = useState("enforce");
  const [status, setStatus] = useState({
    Notice: "finish",
    preEnforcement: "wait",
  });

  console.log("CreateDocument");

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

  const { TextArea } = Input;

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleStatusChange = (current) => {
    const newStatus = { ...status };
    if (current) {
      newStatus.Notice = newStatus.Notice === "wait" ? "finish" : "wait";
      newStatus.investigateAssets =
        newStatus.investigateAssets === "wait" ? "finish" : "wait";
      newStatus.sendToEnforcement =
        newStatus.sendToEnforcement === "wait" ? "finish" : "wait";
      newStatus.enforcement =
        newStatus.enforcement === "wait" ? "finish" : "wait";
    }
  };
  const onChange = (e) => {
    setDefaultStatus(e.target.value);
    console.log(defaultStatus);
  };
  console.log(defaultStatus);
  const FormDisabledDemo = () => {
    return (
      <>
        <Space direction="vertical" size="middle">
          <Space.Compact>
            <b>
              หมายเลขคีดำ <Input label="หมายเลขคีดำ" width={200} />
            </b>
          </Space.Compact>
        </Space>

        <Card style={{ marginTop: "10px" }}>
          <Steps
            responsive={true}
            percent={50}
            items={[
              {
                title: "เตรียมส่งฟ้อง",
                status: status.Notice,
                icon: <BellOutlined />,
              },
              {
                title: "ชั้นศาล",
                status: status.preEnforcement,
                icon: <SearchOutlined />,
              },
            ]}
          />
        </Card>
      </>
    );
  };

  return (
    <>
      <Modal
        title="เปลี่ยนสถานะ"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={850}
        footer={[
          <Button key="cancel" onClick={handleCancel} style={{ color: "red" }}>
            ปิด
          </Button>,
          <Button key="cancel" onClick={handleOk} style={{ color: "green" }}>
            บันทึก
          </Button>,
        ]}
      >
        <Card>
          <FormDisabledDemo />
        </Card>
      </Modal>
    </>
  );
};
export default UpdateStatusBlackNumber;
