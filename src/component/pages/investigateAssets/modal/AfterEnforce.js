import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Upload,
  Modal,
  Card,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const AfterEnforce = ({ open, close }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  console.log("PreLawsuitDetail");

  const handleOk = () => {
    setConfirmLoading(true);
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
    console.log(`Inputed ${value}`);
  };

  return (
    <>
      <Modal
        title="สืบทรัพย์หลังฟ้อง"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={"850"}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            ปิด
          </Button>,
          <Button key="ok" onClick={handleOk} style={{ color: "green" }}>
            ยืนยัน
          </Button>,
        ]}
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
          >
            <Form.Item label="">
              <Radio.Group>
                <Radio value="apple"> เจอทรัพย์ </Radio>
                <Radio value="pear"> ไม่เจอทรัพย์ </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="จังหวัด">
              <Input
                style={{
                  width: 250,
                }}
              />
            </Form.Item>
            <Form.Item label="อำเภอ">
              <Input
                style={{
                  width: 250,
                }}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label="ตำบล">
              <Input
                style={{
                  width: 250,
                }}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item label="วันที่สืบทรัพย์">
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload action="/upload.do" listType="picture-card">
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item>
            <Form.Item label="หมายเหตุ">
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </>
  );
};
export default AfterEnforce;
