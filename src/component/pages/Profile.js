import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, message, Switch } from "antd";
import MotionHoc from "../../utils/MotionHoc";

const Main = () => {
  const [form] = Form.useForm();

  // ดึงค่าจาก localStorage
  const USERNAME = localStorage.getItem("USERNAME");
  const FNAME = localStorage.getItem("FNAME");
  const LNAME = localStorage.getItem("LNAME");
  const NNAME = localStorage.getItem("NNAME");
  const LICENCE_NO_LAWYERS = localStorage.getItem("LICENCE_NO_LAWYERS");
  const COMPANY_ID = localStorage.getItem("COMPANY_ID");
  const ROLE_ID = localStorage.getItem("ROLE_ID");
  const ACTIVE_STATUS = localStorage.getItem("ACTIVE_STATUS");
  const [activedStatus, setActivateStatus] = useState(null);

  useEffect(() => {
    // ตั้งค่าฟิลด์ในฟอร์ม
    form.setFieldsValue({
      userName: USERNAME,
      fName: FNAME,
      lName: LNAME,
      nName: NNAME,
      licenseNo: LICENCE_NO_LAWYERS,
      company: COMPANY_ID,
      role: ROLE_ID,
    });
    console.log("load");
  }, [
    form,
    ACTIVE_STATUS,
    USERNAME,
    FNAME,
    LNAME,
    NNAME,
    LICENCE_NO_LAWYERS,
    COMPANY_ID,
    ROLE_ID,
  ]);

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
    setActivateStatus(checked === 1 ? true : false);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  return (
    <Form
      form={form} // ตั้งค่า form ที่นี่
      name="user"
      layout="horizontal"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item label="สถานะ" name="activeStatus">
        <Switch
          defaultValue={ACTIVE_STATUS === "1" ? true : null}
          onChange={onChange}
        />
      </Form.Item>

      <Form.Item label="User Name" name="userName">
        <Input disabled />
      </Form.Item>

      <Form.Item label="ชื่อ" name="fName">
        <Input />
      </Form.Item>

      <Form.Item label="นามสกุล" name="lName">
        <Input />
      </Form.Item>

      <Form.Item label="ชื่อเล่น" name="nName">
        <Input />
      </Form.Item>

      <Form.Item label="ใบอนุญาติทนาย" name="licenseNo">
        <Input />
      </Form.Item>

      <Form.Item label="บริษัทที่สังกัด" name="company">
        <Input />
      </Form.Item>

      <Form.Item label="ตำแหน่ง" name="role">
        <Input />
      </Form.Item>
      <Form.Item label="รหัสใหม่" name="reNewPassword">
        <Input />
      </Form.Item>
      <Form.Item label="รหัสใหม่อีกครั้ง" name="reNewPasswordCheck">
        <Input />
      </Form.Item>

      {/* <div style={{ textAlign: "center" }}>
        <Button style={{ color: "green" }} htmlType="submit">
          บันทึก
        </Button>
      </div> */}
    </Form>
  );
};

const Profile = MotionHoc(Main);
export default Profile;
