import React, { useState } from "react";
import {
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
  Modal,
  Card,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GoogleMapReact from "google-map-react";

const PreLawsuitDetail = ({ open, close }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [componentDisabled, setComponentDisabled] = useState(true);
  const [modalText, setModalText] = useState("Content of the modal");
  const showModal = () => {};

  console.log("PreLawsuitDetail");

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
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <>
      <Modal
        title="สืบทรัพย์"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={"50%"}
      >
        <Card>
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
            <Form.Item label="">
              <Radio.Group>
                <Radio value="apple"> เจอทรัพย์ </Radio>
                <Radio value="pear"> ไม่เจอทรัพย์ </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="สถานที่">
              <Input />
            </Form.Item>
            <Form.Item label="รายละเอียด">
              <Input />
            </Form.Item>
            <Form.Item label="รายการ">
              <Select
                style={{
                  width: 250,
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "ค่าเนียมศาล",
                  },
                  {
                    value: "lucy",
                    label: "ค่าส่งหมายเรียกและสำเนาคำฟ้อง",
                  },
                  {
                    value: "Yiminghe",
                    label: "ค่าฟ้องศาล",
                  },
                  {
                    value: "jack",
                    label: "ค่าธรรมเนียมชั้นบังคับคดี",
                  },
                  {
                    value: "lucy",
                    label: "ค่่าธรรมเนียมถอนหารบังคับคดี",
                  },
                  {
                    value: "Yiminghe",
                    label: "ค่าส่งหมายบังคับคดี",
                  },
                  {
                    value: "jack",
                    label: "ค่าตรวจสอบหลักทรัพย์",
                  },
                  {
                    value: "lucy",
                    label: "ค่าคัดโฉนด",
                  },
                  {
                    value: "Yiminghe",
                    label: "ค่าประกาศขายทอดตลาด",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="วันที่">
              <DatePicker />
            </Form.Item>

            <Form.Item label="หมายเหตุ">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload action="/upload.do" listType="picture-card">
                <button
                  style={{
                    border: 0,
                    background: "none",
                  }}
                  type="button"
                >
                  <PlusOutlined />
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </button>
              </Upload>
            </Form.Item>
            <Form.Item label="ปักหมุด">
              <Button>เลือกสถานที่</Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </>
  );
};
export default PreLawsuitDetail;
