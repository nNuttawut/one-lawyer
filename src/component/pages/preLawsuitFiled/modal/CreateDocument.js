import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Modal,
  Card,
  Radio,
} from "antd";

const CreateDocument = ({ open, close }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

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

  return (
    <>
      <Modal
        title="สร้างคำร้อง"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={"50%"}
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
                <Radio value="apple"> คดีดำ </Radio>
                <Radio value="pear"> คดีแดง </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="คดีหมายเลขที่">
              <Input />
            </Form.Item>
            <Form.Item label="ความ">
              <Select
                style={{
                  width: 250,
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "แพ่ง",
                  },
                  {
                    value: "lucy",
                    label: "อาญา",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="เรื่อง">
              <Input />
            </Form.Item>
            <Form.Item label="ค่าติดตาม">
              <InputNumber />
            </Form.Item>
            <Form.Item label="ค่าขาดประโยชน์">
              <InputNumber />
            </Form.Item>
            <Form.Item label="จำนวนทุนทรัพย์">
              <InputNumber />
            </Form.Item>

            <Form.Item label="วันที่">
              <DatePicker />
            </Form.Item>
            <Form.Item label="หมายเหตุ">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item label="ศาล ณ จังหวัด">
              <Button>เลือกสถานที่</Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </>
  );
};
export default CreateDocument;
