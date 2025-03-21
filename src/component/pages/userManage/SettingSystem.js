import React, { useEffect, useState } from "react";
import { Button, Form, Popconfirm, Select, Spin, Switch } from "antd";
import MotionHoc from "../../../utils/MotionHoc";

const Main = () => {
  const [form] = Form.useForm();
  const suggestionStatus = localStorage.getItem("SUGGESTTION");
  // ดึงค่าจาก localStorage
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(
    suggestionStatus === "true" ? suggestionStatus : null
  );

  const confirm = () => {
    console.log(suggestion);
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("SUGGESTTION", suggestion);
      setLoading(false);
    }, 500);
  };

  return (
    <Spin spinning={loading} size="large" tip=" Loading... ">
      <Form
        form={form} // ตั้งค่า form ที่นี่
        name="user"
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item label="คำแนะนำ" name="suggestionStatus">
          <Switch
            checked={suggestion}
            checkedChildren="เปิด"
            unCheckedChildren="ปิด"
            onChange={() => setSuggestion(!suggestion)}
          />
        </Form.Item>
        <Form.Item label="เปลี่ยนภาษา" name="ROLE_ID">
          <Select
            style={{
              width: 250,
            }}
            disabled
            placeholder="เลือกภาษา"
            optionFilterProp="value"
            options={null}
          />
        </Form.Item>
        <div style={{ textAlign: "center" }}>
          <Popconfirm
            title="บันทึกข้อมูลระบบ"
            description="คุณต้องการบันทึกข้อมูลระบบหรือไม่ ?"
            onConfirm={confirm}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
          >
            <Button style={{ color: "green" }} htmlType="submit">
              บันทึก
            </Button>
          </Popconfirm>
        </div>
      </Form>
    </Spin>
  );
};

const SettingSystem = MotionHoc(Main);
export default SettingSystem;
