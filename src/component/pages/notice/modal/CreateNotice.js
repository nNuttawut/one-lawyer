import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Card,
  Cascader,
  Radio,
} from "antd";

const CreateNotice = ({ open, close }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [defaultStatus, setDefaultStatus] = useState();

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

  const onChange = (e) => {
    setDefaultStatus(e.target.value);
    console.log(defaultStatus);
  };

  return (
    <>
      <Modal
        title="สร้างโนติส"
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
            <Radio.Group
              onChange={onChange}
              value={defaultStatus}
              style={{ marginBottom: "10px" }}
            >
              <Radio value="hirePurchase">เช่าซื้อ</Radio>
              <Radio value="mortgage">จำนอง</Radio>
            </Radio.Group>
            <Form.Item label="ค่าติดตาม">
              <InputNumber />
            </Form.Item>

            <Form.Item label="จำนวนที่ต้องชำระ">
              <InputNumber />
            </Form.Item>

            <Form.Item label="วันที่ออกจดหมาย">
              <DatePicker />
            </Form.Item>
            <Form.Item label="ที่อยู่">
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

            <Form.Item label="หมายเหตุ">
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </>
  );
};
export default CreateNotice;
