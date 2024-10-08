import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Card, message } from "antd";
import { LoadingOutlined, AuditOutlined } from "@ant-design/icons";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  POST_STATUS,
  PUT_LAWSUIT_DETAIL,
} from "../../../API/apiUrls";
import axios from "axios";
import { AWAITING_JUDMENT } from "../../../../utils/constant/StatusConstant";

const UpdateStatusBlackNumber = ({
  open,
  close,
  dataDefualt,
  funcUpdateStatus,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [loading, setLoading] = useState();
  const [isModal, setIsModal] = useState(false);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [dataStore, setDataStore] = useState();
  const [dataForm, setDataForm] = useState({});

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      console.log("loadData", dataDefualt);
    }
  }, [isModal]);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [lawsuitRes, loanRes] = await Promise.all([
        axios.get(`${baseUrl}${GET_LAWSUIT_DETAIL}${dataDefualt.id}`, {
          HEADERS_EXPORT,
        }),
        axios.get(`${baseUrl}${GET_LOAN_BY_CONTNO}${dataDefualt.CONTNO}`, {
          HEADERS_EXPORT,
        }),
      ]);

      if (lawsuitRes.status === 200) {
        console.log("lawsuitRes", lawsuitRes.data);
        setDataLoadLawSuit(lawsuitRes.data);
        setDataStore(lawsuitRes.data);
      } else {
        message.error("ไม่พบข้อมูลคดี");
      }

      if (loanRes.status === 200) {
        console.log("loanRes", loanRes.data);
        setDataLoadLoan(loanRes.data);
      } else {
        message.error("ไม่พบข้อมูล");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendStatus = async (data, status) => {
    setLoading(true);
    try {
      console.log(data);
      await axios
        .put(baseUrl + PUT_LAWSUIT_DETAIL, data, { HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status > 400) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
        });

      console.log(status);
      await axios
        .post(baseUrl + POST_STATUS, status, { HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 201) {
            console.log("resQuery", res.data);
            message.success(`อัพเดทข้อมูลสำเร็จ ${dataDefualt.CONTNO}`);
            funcUpdateStatus({
              ...dataDefualt,
              MAIN_STATUS_ID: status.MAIN_STATUS_ID,
            });
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status > 400) {
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

  const onChangeDateOfPlaint = (date, dateString) => {
    console.log(dateString);
    setDataForm({ ...dataForm, dateOfPlaint: dateString });
  };

  console.log("setDataLoadLawSuit", dataLoadLawSuit);

  const onChangeConsiderationDate = (date, dateString) => {
    console.log(date, dateString);
    setDataForm({ ...dataForm, considerationDate: dateString });
  };

  const onChangeInputBlackNumber = (value) => {
    console.log(value);
  };

  const onFinish = (values) => {
    console.log(values);

    const putData = {
      ...dataLoadLawSuit,
      black_case_number: values.blackNumber,
      date_of_plaint: dataForm.dateOfPlaint,
      consideration_date: dataForm.considerationDate,
    };
    const postStatus = {
      MAIN_STATUS_ID: AWAITING_JUDMENT,
      LOAN_ID: dataDefualt.id,
      USER_ID: dataDefualt.LAWYER_ID,
      LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
      LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
      MEMO: values.memo,
      DATE: dataForm.considerationDate,
    };

    console.log(postStatus);
    console.log(putData);
    sendStatus(putData, postStatus);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const FormDisabledDemo = () => {
    return (
      <>
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
            memo: null,
            suspensionAmount: 0,
          }}
        >
          <Form.Item
            label="หมายเลขคดีดำ"
            name="blackNumber"
            rules={[
              {
                required: true,
                message: "กรุณากรอกหมายเลขคดีดำ !",
              },
            ]}
          >
            <Input onChange={(e) => onChangeInputBlackNumber(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="วันประทับฟ้อง"
            name="dateOfPlaint"
            rules={[
              {
                required: true,
                message: "โปรดเลือกวันที่",
              },
            ]}
          >
            <DatePicker onChange={onChangeDateOfPlaint} />
          </Form.Item>
          <Form.Item
            label="วันนัดพิจารณาคดี"
            name="considerationDate"
            rules={[
              {
                required: true,
                message: "โปรดเลือกวันที่",
              },
            ]}
          >
            <DatePicker onChange={onChangeConsiderationDate} />
          </Form.Item>
          <Form.Item label="หมายเหตุ" name="memo">
            <TextArea
              rows={5}
              onChange={(e) => onChangeInputMemo(e.target.value)}
            />
          </Form.Item>
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
        </Form>
      </>
    );
  };

  return (
    <>
      <Modal
        title="เปลี่ยนสถานะ"
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Card>
          <FormDisabledDemo />
        </Card>
      </Modal>
    </>
  );
};
export default UpdateStatusBlackNumber;
