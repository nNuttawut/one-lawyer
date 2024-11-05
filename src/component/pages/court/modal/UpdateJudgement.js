import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Card,
  Steps,
  message,
  Spin,
  Input,
  DatePicker,
} from "antd";
import { AuditOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  baseUrl,
  POST_STATUS,
  HEADERS_EXPORT,
  GET_JUDGE_BY_ID,
  PUT_JUDGE,
} from "../../../API/apiUrls";
import {
  CASE_IS_FINAL,
  STATUS_PROCESS_SUCCESSFUL,
} from "../../../../utils/constant/StatusConstant";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

const UpdateJudgement = ({ open, close, dataDefualt, funcUpdateStatus }) => {
  const [status, setStatus] = useState({
    process: "process",
    enforce: "wait",
    prePay: "wait",
  });
  const [loading, setLoading] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [countDate, setCountDate] = useState();
  const [urlFileSave, setUrlFileSave] = useState();
  const [dataLoadJudgement, setDataJudgement] = useState();
  const [dateEnforceCase, setDateEnforceCase] = useState();

  useEffect(() => {
    if (dataDefualt.DATE) {
      loadData();
      const recordDate = dayjs(dataDefualt.DATE);
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
          HEADERS_EXPORT,
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

  const sendStatus = async (statusData, dataJudgement) => {
    if (status.enforce === "finish") {
      setLoading(true);
      try {
        await axios
          .post(baseUrl + POST_STATUS, statusData, { HEADERS_EXPORT })
          .then(async (res) => {
            if (res.status === 201) {
              console.log("resQuery", res.data);
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
          .put(baseUrl + PUT_JUDGE, dataJudgement, { HEADERS_EXPORT })
          .then(async (res) => {
            if (res.status === 200) {
              console.log("resQuery", res.data);
              funcUpdateStatus({
                ...dataDefualt,
                MAIN_STATUS_ID: statusData.MAIN_STATUS_ID,
                DATE: dayjs().format("YYYY-MM-DD"),
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
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
      } finally {
        setLoading(false);
        handleCancel();
      }
    } else {
      message.error("โปรดเปลี่ยนสถานะข้อมูลและกดบันทึกอีกครั้ง");
    }
  };

  const handleStatusChange = (current) => {
    console.log(current);
    if (current === 2) {
      setStatus({
        process: "finish",
        enforce: "finish",
      });
    } else {
      setStatus({
        process: "process",
        enforce: "wait",
      });
    }
  };

  const onChangeInput = (e) => {
    const value = e.target.value;
    console.log(value);
    setMemoText(value);
  };

  const handleOk = () => {
    if (status.enforce === "finish") {
      if (urlFileSave) {
        const postData = {
          MAIN_STATUS_ID: CASE_IS_FINAL,
          LOAN_ID: dataDefualt.id,
          USER_ID: dataDefualt.LAWYER_ID,
          LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
          LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
          MEMO: memoText,
          DATE: dateEnforceCase,
          PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
        };
        const putJudgement = {
          ...dataLoadJudgement,
          enforce_case_date: dateEnforceCase,
          enforce_case_filepath: urlFileSave,
        };
        console.log("postData", postData);
        console.log("putJudgement", putJudgement);
        sendStatus(postData, putJudgement);
      } else {
        message.error("กรุณาใส่ URL FILE");
      }
    } else {
      message.error("กรุณาเปลี่ยนสถานะ");
    }
  };

  const onChangeJudgementFile = (value) => {
    console.log(value);
    setUrlFileSave(value);
  };
  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setDateEnforceCase(dateString);
  };
  const formData = () => {
    return (
      <>
        <Card style={{ marginTop: "10px" }}>
          <Steps
            responsive={true}
            onChange={handleStatusChange}
            items={[
              {
                title: "พิพากษา",
                status: "finish",
              },
              {
                title: "เวลาดำเนินการเหลือ",
                status: status.process,
                description: `เกินกำหนด: ${countDate} วัน`,
                icon: <LoadingOutlined />,
              },
              {
                title: "ออกหมายตั้ง",
                status: status.enforce,
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
        title="เปลี่ยนสถานะ"
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
          <Card>
            <formData />
            <p style={{ marginTop: "10px" }}>ใส่ url ที่แชร์ลิ้ง</p>
            <Input
              style={{ marginTop: "5px" }}
              placeholder="ใส่ url file ในนี้"
              onChange={(e) => onChangeJudgementFile(e.target.value)}
            />
            <p style={{ marginTop: "10px" }}>เลือกวันที่ออกหมายตั้ง</p>
            <DatePicker
              style={{ marginTop: "5px" }}
              placeholder="โปรดเลือกวัน"
              size="large"
              onChange={onChange}
            />
          </Card>
          <div style={{ marginTop: "5px" }}>
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
export default UpdateJudgement;
