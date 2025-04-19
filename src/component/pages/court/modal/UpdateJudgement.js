import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Card,
  Steps,
  message,
  Spin,
  DatePicker,
  Form,
  InputNumber,
} from "antd";
import {
  AuditOutlined,
  LoadingOutlined,
  InboxOutlined,
} from "@ant-design/icons";

import axios from "axios";
import {
  baseUrl,
  POST_STATUS,
  HEADERS_EXPORT,
  GET_JUDGE_BY_ID,
  PUT_JUDGE,
  PUT_STATUS,
} from "../../../API/apiUrls";
import {
  CASE_IS_FINAL,
  ENFORCEMENT,
  PARAM_PUBLIC,
  STATUS_PROCESS_PROCESS,
  STATUS_PROCESS_SUCCESSFUL,
} from "../../../../utils/constant/StatusConstant";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import Dragger from "antd/es/upload/Dragger";

const UpdateJudgement = ({ open, close, dataDefualt, funcUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [countDate, setCountDate] = useState();
  const [dataLoadJudgement, setDataJudgement] = useState();
  const [dateEnforceCase, setDateEnforceCase] = useState();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  console.log(dataDefualt);

  useEffect(() => {
    if (dataDefualt.DATE) {
      loadData();
      const recordDate = dayjs(dataDefualt.DATE).startOf("day");
      const toDay = dayjs().startOf("day");
      const toDate = dayjs(recordDate).add(45, "days");
      const daysDifference = toDay.diff(toDate, "days");
      const daySub = daysDifference + 45;
      console.log("toDate", toDate);
      setCountDate(daysDifference);
    }
  }, []);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        baseUrl + GET_JUDGE_BY_ID + dataDefualt.LAWSUIT_ID,
        {
          headers: HEADERS_EXPORT,
        }
      );
      if ((response.status = 200)) {
        setDataJudgement(response.data);
        console.log("response.data", response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendStatus = async (
    statusData,
    dataJudgement,
    putStatus,
    postEnforce
  ) => {
    setLoading(true);
    try {
      await axios
        .put(baseUrl + PUT_STATUS, putStatus, {
          headers: HEADERS_EXPORT,
        })
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

      await axios
        .post(baseUrl + POST_STATUS, postEnforce, { headers: HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
            setLoading(false);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
        });

      await axios
        .post(baseUrl + POST_STATUS, statusData, { headers: HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
            setLoading(false);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
        });

      await axios
        .put(baseUrl + PUT_JUDGE, dataJudgement, { headers: HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
            funcUpdateStatus({
              ...dataDefualt,
              MAIN_STATUS_ID: statusData.MAIN_STATUS_ID,
              DATE: dayjs().format("YYYY-MM-DD"),
            });
            handleUploadAllImage();
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

          console.log("ไม่มีข้อมูล", err); // ถ้ามีข้อผิดพลาดอื่น ๆ ให้แสดงข้อความนี้
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
    }
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setDateEnforceCase(dateString);
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
    setMemoText(value);
  };

  const onFinish = (values) => {
    console.log("Success:", values);

    if (values.file.fileList.length > 0) {
      const putStatus = {
        id: dataDefualt.WORK_LOG_ID,
        MEMO: values.memo,
        DATE: dataDefualt.DATE,
        USER_ID: dataDefualt.LAWYER_ID,
        LOAN_ID: dataDefualt.id,
        PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
      };
      const postData = {
        MAIN_STATUS_ID: CASE_IS_FINAL,
        LOAN_ID: dataDefualt.id,
        USER_ID: dataDefualt.LAWYER_ID,
        LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
        LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
        MEMO: memoText,
        DATE: dateEnforceCase,
        PROCESS_ID: STATUS_PROCESS_PROCESS,
      };
      const postEnforce = {
        MAIN_STATUS_ID: ENFORCEMENT,
        LOAN_ID: dataDefualt.id,
        USER_ID: dataDefualt.LAWYER_ID,
        LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
        LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
        MEMO: memoText,
        DATE: dateEnforceCase,
        PROCESS_ID: STATUS_PROCESS_PROCESS,
      };
      const putJudgement = {
        ...dataLoadJudgement,
        enforce_case_date: dateEnforceCase,
        copying_fee: values.docFee,
        // fee: values.otherFee,
      };
      console.log("postData", postData);
      console.log("putJudgement", putJudgement);
      console.log("postEnforce", postEnforce);
      console.log("putStatus", putStatus);

      sendStatus(postData, putJudgement, putStatus, postEnforce);
    } else {
      message.error("กรุณาอัพโหลดไฟล์ !");
    }
  };

  const handleUploadAllImage = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);

    await axios
      .post(
        baseUrl +
          `/files/lawyer/enforcement/${PARAM_PUBLIC}/enforce-case_${dataDefualt.contno}`,
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

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeTotalFee = (value) => {
    console.log(value);
  };

  const onChangeDocFee = (value) => {
    console.log(value);
  };

  const formData = () => {
    return (
      <>
        <Card style={{ marginTop: "10px", marginBottom: "20px" }}>
          <Steps
            responsive={true}
            items={[
              {
                title: "พิพากษา",
                status: "finish",
              },
              {
                title: "เวลาดำเนินการเหลือ",
                status: "process",
                description: `เกินกำหนด: ${countDate} วัน`,
                icon: <LoadingOutlined />,
              },
              {
                title: "ออกหมายตั้ง",
                status: "finish",
                icon: <AuditOutlined />,
              },
            ]}
          />
        </Card>
      </>
    );
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

  return (
    <>
      <Modal
        title={`อัพเดทสถานะ ${dataDefualt?.CONTNO}/${dataDefualt?.CUSTOMER_TNAME}
        ${dataDefualt?.CUSTOMER_FNAME} ${dataDefualt?.CUSTOMER_LNAME}`}
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={[
          <Button key="cancel" onClick={handleCancel} style={{ color: "red" }}>
            ปิด
          </Button>,
          <Button
            key="ok"
            // onClick={handleOk}
            onClick={() => form.submit()}
            style={{ color: "green" }}
            htmlType="submit"
          >
            บันทึก
          </Button>,
        ]}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>
            {formData()}
            <Form
              labelCol={{
                span: 8,
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
              <Form.Item
                label="วันที่ออกหมายตั้ง"
                name="dateEnforce"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่คำพิพากษา !",
                  },
                ]}
              >
                <DatePicker
                  placeholder="โปรดเลือกวัน"
                  size="large"
                  onChange={onChange}
                />
              </Form.Item>
              {/* <Form.Item
                label="ค่าออกหมายตั้ง"
                name="otherFee"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ค่าติดตาม !",
                  },
                ]}
              >
                <InputNumber
                  suffix="บาท"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="large"
                  placeholder="ไม่มีไม่ต้องกรอก"
                  style={{ width: "100%", color: "black" }}
                  onChange={(value) => onChangeTotalFee(value)}
                />
              </Form.Item> */}
              <Form.Item label="ค่าคัดเอกสาร" name="docFee">
                <InputNumber
                  suffix="บาท"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="large"
                  placeholder="ไม่มีไม่ต้องกรอก"
                  style={{ width: "100%", color: "black" }}
                  onChange={(value) => onChangeDocFee(value)}
                />
              </Form.Item>

              <Form.Item
                label="ไฟลหมายตั้ง"
                name="file"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ url ของคำพิพากษาจากไฟล์กลาง !",
                  },
                ]}
              >
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ color: "blue" }} />
                  </p>
                  <p className="ant-upload-text">
                    กรุณาคลิกหรือลากเพื่อเลือกไฟล์
                  </p>
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
            </Form>
          </Card>
        </Spin>
      </Modal>
    </>
  );
};
export default UpdateJudgement;
