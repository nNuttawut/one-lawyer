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

const UpdateStatusNotice = ({ open, close }) => {
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
        <Radio.Group
          onChange={onChange}
          defaultValue="enforce"
          value={defaultStatus}
        >
          <Radio value="enforce">เตรียมฟ้อง</Radio>
          <Radio value="pay">ทำยอม/ชำระหนี้</Radio>
        </Radio.Group>
        {defaultStatus === "pay" ? (
          <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            style={{
              maxWidth: 600,
            }}
          >
            <Form.Item label="Checkbox" name="disabled" valuePropName="checked">
              <Checkbox>Checkbox</Checkbox>
            </Form.Item>
            <Form.Item label="Radio">
              <Radio.Group>
                <Radio value="apple"> Apple </Radio>
                <Radio value="pear"> Pear </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Input">
              <Input />
            </Form.Item>
            <Form.Item label="Select">
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="TreeSelect">
              <TreeSelect
                treeData={[
                  {
                    title: "Light",
                    value: "light",
                    children: [
                      {
                        title: "Bamboo",
                        value: "bamboo",
                      },
                    ],
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="Cascader">
              <Cascader
                options={[
                  {
                    value: "zhejiang",
                    label: "Zhejiang",
                    children: [
                      {
                        value: "hangzhou",
                        label: "Hangzhou",
                      },
                    ],
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="DatePicker">
              <DatePicker />
            </Form.Item>

            <Form.Item label="InputNumber">
              <InputNumber />
            </Form.Item>
            <Form.Item label="TextArea">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Button">
              <Button>Button</Button>
            </Form.Item>
          </Form>
        ) : (
          <Card style={{ marginTop: "10px" }}>
            <Steps
              responsive={true}
              percent={50}
              items={[
                {
                  title: "ส่งโนติส",
                  status: status.Notice,
                  icon: <BellOutlined />,
                },
                {
                  title: "เตรียมส่งฟ้อง",
                  status: status.preEnforcement,
                  icon: <SearchOutlined />,
                },
              ]}
            />
          </Card>
        )}
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
export default UpdateStatusNotice;
