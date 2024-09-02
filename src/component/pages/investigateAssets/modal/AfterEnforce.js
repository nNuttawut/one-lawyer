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
  Cascader,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const AfterEnforce = ({ open, close }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState();

  console.log("PreLawsuitDetail");

  const handleOk = () => {
    setConfirmLoading(true);
  };
  const handleCancel = () => {
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

  const onChange = (e) => {
    setDefaultStatus(e.target.value);
    console.log(defaultStatus);
  };

  return (
    <>
      <Modal
        title="งานสืบทรัพย์"
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
        <Radio.Group
          onChange={onChange}
          value={defaultStatus}
          style={{ marginBottom: "10px" }}
          label="โปรดเลือกสถานะการสืบทรัพย์"
        >
          <Radio value="before"> ก่อนฟ้อง </Radio>
          <Radio value="after"> หลังฟ้อง </Radio>
        </Radio.Group>
        {defaultStatus === "before" ? (
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
              <Form.Item label="สถานที่">
                <Cascader
                  options={[
                    {
                      value: "จังหวัด",
                      label: "จังหวัด",
                      children: [
                        {
                          value: "อำเภอ",
                          label: "อำเภอ",
                        },
                      ],
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item label="วันที่สืบทรัพย์">
                <DatePicker />
              </Form.Item>

              <Form.Item label="หมายเหตุ">
                <TextArea rows={4} />
              </Form.Item>
            </Form>
          </Card>
        ) : defaultStatus === "after" ? (
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
                  <button
                    style={{ border: 0, background: "none" }}
                    type="button"
                  >
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
        ) : null}
      </Modal>
    </>
  );
};
export default AfterEnforce;
