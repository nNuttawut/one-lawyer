import { Button, Form, Input, message, Spin } from "antd";
import MotionHoc from "../../utils/MotionHoc";
import { useState } from "react";
import axios from "axios";
import { baseUrl, REGISTER, HEADERS_EXPORT } from "../API/apiUrls";

const Main = () => {
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("USERNAME");
  const id = localStorage.getItem("ID");

  const sendData = async (changeData) => {
    setLoading(true);
    try {
      await axios
        .post(baseUrl + REGISTER, changeData, {
          HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res);
            message.success("อัพเดทรหัสผ่านเรียบร้อย");
          }
        })
        .catch((err) => {
          console.log(err);

          message.error("ไม่สามารถเปลี่ยนรหัสผ่่านได้");
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    if (values.reNewPassword === values.reNewPasswordCheck) {
      let postData = {
        user_id: id,
        username: username,
        password: values.reNewPassword,
      };
      sendData(postData);
    } else {
      message.error("รหัสผ่านไม่ตรงกัน");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  return (
    <>
      <Spin spinning={loading} size="large" tip=" Loading... ">
        <Form
          name="user"
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="รหัสใหม่"
            name="reNewPassword"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="รหัสใหม่อีกครั้ง"
            name="reNewPasswordCheck"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Button style={{ color: "green" }} htmlType="submit">
              บันทึก
            </Button>
          </div>
        </Form>
      </Spin>
    </>
  );
};

const ChangePassword = MotionHoc(Main);
export default ChangePassword;
