import React, { useEffect, useState } from "react";
import { Button, Modal, Card, Radio, message, Spin, Form, Input } from "antd";
import axios from "axios";
import {
  baseUrl,
  HEADERS_EXPORT,
  PUT_PARCELS,
  PUT_STATUS,
} from "../../../API/apiUrls";
import { STATUS_PROCESS_SUCCESSFUL } from "../../../../utils/constant/StatusConstant";
import dayjs from "dayjs";

const UpdateReplyNotice = ({ open, close, dataDefualt, funcUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [defaultRadio, setDefaultRadio] = useState("1");
  const [form] = Form.useForm();

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  const sendStatus = async (data, parcel) => {
    setLoading(true);
    try {
      await axios
        .put(baseUrl + PUT_STATUS, data, { HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
            funcUpdateStatus({
              ...dataDefualt,
              PROCESS_ID: data.PROCESS_ID,
            });
            message.success(`อัพเดทข้อมูลสำเร็จ ${dataDefualt.CONTNO}`);
            setLoading(false);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 400) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
        });

      await axios
        .put(baseUrl + PUT_PARCELS, parcel, { HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 404) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
    }
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    const putData = {
      WORK_LOG_ID: dataDefualt.WORK_LOG_ID,
      USER_ID: dataDefualt.LAWYER_ID,
      LOAN_ID: dataDefualt.id,
      MEMO: dataDefualt.MEMO,
      DATE: dayjs(dataDefualt.DATE).format("YYYY-MM-DD"),
      PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
    };
    const putParcel = {
      id: dataDefualt.PARCEL_ID,
      WORK_LOG_ID: dataDefualt.WORK_LOG_ID,
      parcel_no: dataDefualt.PARCEL_NO,
      parcel_typ_id: values.radio,
      url_path: values.imageReplyFile,
    };

    console.log(putData);
    sendStatus(putData, putParcel);
  };
  console.log("datadddd", dataDefualt);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeReplyFile = (value) => {
    console.log(value);
  };

  const onChange = (e) => {
    console.log(e.target.value);
  };

  const buttonCustom = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={handleCancel}
          style={{ color: "red", marginRight: "20px" }}
        >
          ปิด
        </Button>

        <Button style={{ color: "green" }} htmlType="submit">
          บันทึก
        </Button>
      </div>
    );
  };

  const formUpdate = () => {
    return (
      <Card>
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          form={form}
          layout="horizontal"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            radio: defaultRadio,
          }}
        >
          <Form.Item label="การตอบกลับ" name="radio">
            <Radio.Group onChange={onChange} defaultValue={defaultRadio}>
              <Radio value="1">จากใบตอบกลับ</Radio>
              <Radio value="2">จากเว็บไปษณีย์</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="ลิ้งเก็บรูปตอบกลับ"
            name="imageReplyFile"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ url ของรูปจากไฟล์กลาง !",
              },
            ]}
          >
            <Input
              name="imageReplyFile"
              onChange={(e) => onChangeReplyFile(e.target.value)}
            />
          </Form.Item>
          {buttonCustom()}
        </Form>
      </Card>
    );
  };

  return (
    <>
      <Modal title="เปลี่ยนสถานะ" open={open} width={850} footer={null}>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          {formUpdate()}
        </Spin>
      </Modal>
    </>
  );
};
export default UpdateReplyNotice;
