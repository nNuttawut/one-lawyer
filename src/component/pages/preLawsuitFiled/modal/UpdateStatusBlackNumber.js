import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Card,
  message,
  InputNumber,
} from "antd";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_LOAN,
  HEADERS_EXPORT,
  POST_STATUS,
  PUT_LAWSUIT_DETAIL,
} from "../../../API/apiUrls";
import axios from "axios";
import {
  AWAITING_JUDMENT,
  STATUS_PROCESS_PROGRESS,
} from "../../../../utils/constant/StatusConstant";
import CurrencyFormat from "../../../../hook/CurrencyFormat";

const UpdateStatusBlackNumber = ({
  open,
  close,
  dataDefault,
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
  const [currencyFormatNoPoint, currencyFormatComma, currencyFormatPoint] =
    CurrencyFormat();

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      console.log("loadData", dataDefault);
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
      const [lawsuitRes] = await Promise.all([
        axios.get(`${baseUrl}${GET_LAWSUIT_DETAIL_BY_LOAN}${dataDefault.id}`, {
          headers: HEADERS_EXPORT,
        }),
      ]);

      if (lawsuitRes.status === 200) {
        console.log("lawsuitRes", lawsuitRes.data);
        setDataLoadLawSuit(lawsuitRes.data);
        setDataStore(lawsuitRes.data);
      } else {
        message.error("ไม่พบข้อมูลคดี");
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
        .put(baseUrl + PUT_LAWSUIT_DETAIL, data, { headers: HEADERS_EXPORT })
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
        .post(baseUrl + POST_STATUS, status, { headers: HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
            message.success(`อัพเดทข้อมูลสำเร็จ ${dataDefault.CONTNO}`);
            funcUpdateStatus({
              ...dataDefault,
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

  const onChangeConsiderationDate = (date, dateString) => {
    console.log(date, dateString);

    setDataForm({ ...dataForm, considerationDate: dateString });
  };

  const onChangeInputBlackNumber = (value) => {
    console.log(value);
  };

  const onChangeReplyFile = (value) => {
    console.log(value);
  };

  const onFinish = (values) => {
    console.log(values);

    const putData = {
      ...dataLoadLawSuit,
      black_case_number: values.blackNumber,
      consideration_date: dataForm.considerationDate,
      attorney_fees:
        dataLoadLawSuit?.LOAN_TYPE_ID === 1
          ? 3500
          : dataLoadLawSuit?.LOAN_TYPE_ID === 2
          ? 2500
          : 0,
      file_path: values.imageReplyFile,
    };
    const postStatus = {
      MAIN_STATUS_ID: AWAITING_JUDMENT,
      LOAN_ID: dataDefault.id,
      USER_ID: dataDefault.LAWYER_ID,
      LOAN_TYPE_ID: dataDefault.LOAN_TYPE_ID,
      LAW_TYPE_ID: dataDefault.LAW_TYPE_ID,
      MEMO: values.memo,
      DATE: dataForm.considerationDate,
      PROCESS_ID: STATUS_PROCESS_PROGRESS,
    };

    console.log("postStatus", postStatus);
    console.log("putData", putData);
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
          }}
        >
          <Form.Item label="เลขสัญญา/เจ้าของสัญญา" name="ownerSign">
            <p>
              {`${dataDefault?.CONTNO}/${dataDefault?.CUSTOMER_TNAME}
            ${dataDefault?.CUSTOMER_FNAME} ${dataDefault?.CUSTOMER_LNAME}`}
            </p>
          </Form.Item>
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
            label="วันนัดพิจารณาคดี"
            name="considerationDate"
            rules={[
              {
                required: true,
                message: "โปรดเลือกวันที่",
              },
            ]}
          >
            <DatePicker
              showTime={{
                format: "HH:mm",
              }}
              format="YYYY-MM-DD HH:mm"
              onChange={onChangeConsiderationDate}
            />
          </Form.Item>

          <Form.Item
            label="ลิ้งเก็บรูปส่วนฟ้อง"
            name="imageUrlFile"
            rules={[
              {
                required: true,
                message: "กรุณากรอกลิ้งเก็บรูปส่วนฟ้อง !",
              },
            ]}
          >
            <Input
              placeholder="กรุณากรอกลิ้งเก็บรูปส่วนฟ้อง"
              name="imageReplyFile"
              style={{ width: "100%" }}
              onChange={(e) => onChangeReplyFile(e.target.value)}
            />
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
