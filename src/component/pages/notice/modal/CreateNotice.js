import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Card, Select } from "antd";

const CreateNotice = ({ open, close }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  console.log("CreateDocument");

  const handleOk = () => {};

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  const { TextArea } = Input;

  return (
    <>
      <Modal
        title="สร้างโนติส"
        open={open}
        onOk={handleOk}
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
              span: 10,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            style={{
              maxWidth: 600,
            }}
          >
            <Form.Item label="วันที่ออกจดหมาย">
              <Select
                showSearch
                style={{
                  width: 200,
                }}
                placeholder="เลือกบริษัท"
                optionFilterProp="value"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={[
                  {
                    value: "1",
                    label: "วันมันนี่",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="วันที่ออกจดหมาย">
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
export default CreateNotice;
