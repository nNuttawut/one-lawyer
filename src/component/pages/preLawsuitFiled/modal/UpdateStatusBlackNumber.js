import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Card,
  message,
  Spin,
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
  PARAM_PUBLIC,
  STATUS_PROCESS_PROGRESS,
} from "../../../../utils/constant/StatusConstant";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";

const UpdateStatusBlackNumber = ({
  open,
  close,
  dataDefault,
  funcUpdateStatus,
}) => {
  const [loading, setLoading] = useState();
  const [isModal, setIsModal] = useState(false);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [dataStore, setDataStore] = useState();
  const [dataForm, setDataForm] = useState({});
  const [fileList, setFileList] = useState([]);

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
  console.log(fileList);

  const handleUploadAllImage = () => {
    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);

    axios
      .post(
        baseUrl +
          `/files/lawyer/lawsuit/${PARAM_PUBLIC}/คำฟ้อง${dataDefault.CONTNO}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setFileList([]);
        setLoading(false);
      })
      .catch((err) => {
        Modal.error({
          title: "ผิดพลาด",
          content: err.message,
          centered: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
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

  const onFinish = (values) => {
    console.log(values);
    if (fileList.length < 1) {
      message.error("กรุณาเลือกไฟล์เพื่ออัปโหลด ***ข้อมูลที่ต้องการอัปโหลด");
    } else {
      const putData = {
        ...dataLoadLawSuit,
        black_case_number: values.blackNumber,
        consideration_date: dataForm.considerationDate,
        attorney_fees: null,
        // file_path: values.imageReplyFile,
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
      handleUploadAllImage();
      sendStatus(putData, postStatus);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const props = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList((prev) => [...prev, file]); // อัปเดตรายการไฟล์

      return false; // ป้องกันการอัปโหลดไฟล์อัตโนมัติ
    },

    fileList,
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

          <Form.Item label="ข้อมูลที่ต้องการอัปโหลด" name="imageUrlFile">
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "blue" }} />
              </p>
              <p className="ant-upload-text">กรุณาคลิกหรือลากเพื่อเลือกไฟล์</p>
              <p className="ant-upload-hint">
                รองรับการอัปโหลดแบบเดี่ยวหรือแบบกลุ่ม
              </p>
            </Dragger>
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
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>
            <FormDisabledDemo />
          </Card>
        </Spin>
      </Modal>
    </>
  );
};
export default UpdateStatusBlackNumber;
