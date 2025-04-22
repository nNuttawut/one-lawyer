import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Card,
  Steps,
  message,
  Spin,
  DatePicker,
  Row,
  Col,
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
  ENFORCEMENT,
  INVESTIGATE,
  NEGOTIATE,
  PARAM_PUBLIC,
  STATUS_PROCESS_PROGRESS,
  STATUS_PROCESS_SUCCESSFUL,
} from "../../../../utils/constant/StatusConstant";

import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import Dragger from "antd/es/upload/Dragger";

const UpdateCaseIsFinal = ({ open, close, dataDefualt, funcUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [countDate, setCountDate] = useState();
  const [fileList, setFileList] = useState([]);

  const [dataLoadJudgement, setDataJudgement] = useState();
  const [dateEnforceCase, setDateEnforceCase] = useState();

  useEffect(() => {
    if (dataDefualt.DATE) {
      loadData();
      const recordDate = dayjs(dataDefualt.DATE).startOf("day");
      const toDay = dayjs().startOf("day");
      const toDate = dayjs(recordDate).add(15, "days");
      const daysDifference = toDay.diff(toDate, "days");
      // const daySub = daysDifference + 15;
      console.log("toDate", toDate);
      setCountDate(daysDifference);
      console.log(dataDefualt);
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

  const sendStatus = async (dataJudgement, putStatus) => {
    setLoading(true);
    try {
      await axios
        .put(baseUrl + PUT_JUDGE, dataJudgement, { headers: HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);

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
        });

      await axios
        .put(baseUrl + PUT_STATUS, putStatus, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            funcUpdateStatus({
              ...dataDefualt,
              PROCESS_ID: putStatus.PROCESS_ID,
            });
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
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
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
          `/files/lawyer/enforcement/${PARAM_PUBLIC}/final-case_${dataDefualt.contno}`,
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
  const onChangeInput = (e) => {
    const value = e.target.value;
    console.log(value);
    setMemoText(value);
  };

  const handleOk = () => {
    if (fileList.length > 0) {
      const putJudgement = {
        ...dataLoadJudgement,
        final_case_date: dateEnforceCase,
        final_case_filepath: null,
      };

      const putStatus = {
        id: dataDefualt.WORK_LOG_ID,
        MEMO: dataDefualt.memo,
        DATE: dataDefualt.DATE,
        USER_ID: dataDefualt.LAWYER_ID,
        LOAN_ID: dataDefualt.id,
        PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
      };

      console.log("putStatus", putStatus);
      console.log("putJudgement", putJudgement);
      sendStatus(putJudgement, putStatus);
    } else {
      message.error("กรุณาอัพโหลดไฟล์");
    }
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
      const isLt5M = file.size / 1024 / 1024 < 5.1;

      if (!isLt5M) {
        message.error(`❌ ไฟล์ "${file.name}" มีขนาดเกิน 5 MB`);
        return false;
      }

      setFileList((prev) => [...prev, file]); // อัปเดตรายการไฟล์

      return false; // ป้องกันการอัปโหลดไฟล์อัตโนมัติ
    },

    fileList,
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setDateEnforceCase(dateString);
  };

  const FormDisabled = () => {
    return (
      <>
        <Card style={{ marginTop: "10px" }}>
          <Steps
            responsive={true}
            items={[
              {
                title: "ออกหมายตั้ง",
                status: "finish",
              },
              {
                title: "เวลาดำเนินการเหลือ",
                status: "process",
                description: `เกินกำหนด: ${countDate} วัน`,
                icon: <LoadingOutlined />,
              },
              {
                title: "คดีถึงที่สุด",
                status: "finish",
                icon: <AuditOutlined />,
              },
            ]}
          />
        </Card>
      </>
    );
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
          <Button key="ok" onClick={handleOk} style={{ color: "green" }}>
            บันทึก
          </Button>,
        ]}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>{FormDisabled()}</Card>
          <Card>
            <DatePicker
              style={{ marginBottom: "10px", width: "auto" }}
              placeholder="เลือกวันที่"
              size="large"
              onChange={onChange}
            />

            <Dragger {...props} label="ไฟลหมายตั้ง">
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "blue" }} />
              </p>
              <p className="ant-upload-text">กรุณาคลิกหรือลากเพื่อเลือกไฟล์</p>
              <p className="ant-upload-hint">
                รองรับการอัปโหลดแบบเดี่ยวหรือแบบกลุ่ม ขนาดไม่เกิน 5 MB/ไฟล์
              </p>
            </Dragger>
          </Card>
          <div style={{ marginTop: "10px" }}>
            <TextArea
              rows={5}
              placeholder="หมายเหตุ"
              value={memoText}
              onChange={onChangeInput}
            />
          </div>
        </Spin>
      </Modal>
    </>
  );
};
export default UpdateCaseIsFinal;
