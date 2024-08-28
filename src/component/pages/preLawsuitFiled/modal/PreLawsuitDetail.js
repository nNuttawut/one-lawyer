import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Upload,
  Modal,
  Card,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const PreLawsuitDetail = ({ open, close }) => {
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
    console.log(`selected ${value}`);
  };

  return (
    <>
      <Modal
        title="สืบทรัพย์ก่อนฟ้อง"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={850}
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
              <Select
                style={{
                  width: 250,
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "ขอนแก่น",
                  },
                  {
                    value: "lucy",
                    label: "ชัยภูมิ",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="อำเภอ">
              <Select
                style={{
                  width: 250,
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "เมืองขอนแก่น",
                  },
                  {
                    value: "lucy",
                    label: "ชุมแพ",
                  },
                  {
                    value: "Yiminghe",
                    label: "พล",
                  },
                  {
                    value: "jack",
                    label: "ค่าธรรมเนียมชั้นบังคับคดี",
                  },
                  {
                    value: "lucy",
                    label: "ค่าธรรมเนียมถอนหารบังคับคดี",
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
            <Form.Item label="ตำบล">
              <Select
                style={{
                  width: 250,
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "ศิลา",
                  },
                  {
                    value: "lucy",
                    label: "ในเมือง",
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
      </Modal>
    </>
  );
};
export default PreLawsuitDetail;
