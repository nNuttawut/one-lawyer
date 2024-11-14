import React, { useEffect, useState } from "react";
import { Button, Modal, Card, Radio, Steps, message, Spin } from "antd";
import {
  AuditOutlined,
  LoadingOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { baseUrl, POST_STATUS, HEADERS_EXPORT } from "../../../API/apiUrls";
import { INDICT, NEGOTIATE } from "../../../../utils/constant/StatusConstant";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

const UpdateStatusNotice = ({ open, close, dataDefault, funcUpdateStatus }) => {
  const [defaultRadio, setDefaultRadio] = useState("enforce");
  const [status, setStatus] = useState({
    process: "process",
    preEnforce: "wait",
    prePay: "wait",
  });
  const [loading, setLoading] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [countDate, setCountDate] = useState();

  useEffect(() => {
    if (dataDefault.DATE) {
      const recordDate = dayjs(dataDefault.DATE);
      const toDay = dayjs().startOf("day");
      const toDate = dayjs(recordDate).add(30, "days");
      const daysDifference = toDay.diff(toDate, "days");
      console.log("toDate", toDate);
      console.log("daysDifference", daysDifference);
      setCountDate(daysDifference);
    }
  }, []);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  const sendStatus = async (data) => {
    if (
      (status.preEnforce === "finish" && defaultRadio === "enforce") ||
      (status.prePay === "finish" && defaultRadio === "pay")
    ) {
      setLoading(true);
      try {
        await axios
          .post(baseUrl + POST_STATUS, data, { HEADERS_EXPORT })
          .then(async (res) => {
            if (res.status === 201) {
              console.log("resQuery", res.data);
              funcUpdateStatus({
                ...dataDefault,
                MAIN_STATUS_ID: data.MAIN_STATUS_ID,
                DATE: dayjs().format("YYYY-MM-DD"),
              });
              message.success(`อัพเดทข้อมูลสำเร็จ ${dataDefault.CONTNO}`);
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
    if (current === 2 && defaultRadio === "enforce") {
      setStatus({
        process: "finish",
        preEnforce: "finish",
        prePay: "wait",
      });
    } else if (current === 2 && defaultRadio === "pay") {
      setStatus({
        process: "finish",
        preEnforce: "wait",
        prePay: "finish",
      });
    } else {
      setStatus({
        process: "process",
        preEnforce: "wait",
        prePay: "wait",
      });
    }
  };

  const onChangeInput = (e) => {
    const value = e.target.value;
    console.log(value);
    setMemoText(value);
  };

  const handleOk = () => {
    let statusSelect = null;
    if (defaultRadio === "enforce") {
      statusSelect = INDICT;
    } else {
      statusSelect = NEGOTIATE;
    }
    console.log("statusSelect", statusSelect);
    const postData = {
      MAIN_STATUS_ID: statusSelect,
      LOAN_ID: dataDefault.id,
      USER_ID: dataDefault.LAWYER_ID,
      LOAN_TYPE_ID: dataDefault.LOAN_TYPE_ID,
      LAW_TYPE_ID: dataDefault.LAW_TYPE_ID,
      MEMO: memoText,
      DATE: statusSelect === INDICT ? null : dayjs().format("YYYY-MM-DD"),
    };
    console.log(postData);
    sendStatus(postData);
  };

  const onChange = (e) => {
    setDefaultRadio(e.target.value);
    if (e) {
      setStatus({
        process: "process",
        preEnforce: "wait",
        prePay: "wait",
      });
    }
  };

  const FormDisabled = () => {
    return (
      <>
        <Radio.Group
          onChange={onChange}
          defaultValue="enforce"
          value={defaultRadio}
        >
          <Radio value="enforce">เตรียมฟ้อง</Radio>
          <Radio value="pay">เจรจาหนี้</Radio>
        </Radio.Group>
        {defaultRadio === "pay" ? (
          <Card style={{ marginTop: "10px" }}>
            <Steps
              responsive={true}
              onChange={handleStatusChange}
              items={[
                {
                  title: "ส่งโนติส",
                  status: "finish",
                },
                {
                  title: "เวลาดำเนินการเหลือ",
                  status: status.process,
                  description: `เกินกำหนด: ${countDate} วัน`,
                  icon: <LoadingOutlined />,
                },
                {
                  title: "กลับมาจ่ายปกติ",
                  status: status.prePay,
                  icon: <DollarOutlined />,
                },
              ]}
            />
          </Card>
        ) : (
          <Card style={{ marginTop: "10px" }}>
            <Steps
              responsive={true}
              onChange={handleStatusChange}
              items={[
                {
                  title: "ส่งโนติส",
                  status: "finish",
                },
                {
                  title: "เวลาดำเนินการเหลือ",
                  status: status.process,
                  description: `เกินกำหนด: ${countDate} วัน`,
                  icon: <LoadingOutlined />,
                },
                {
                  title: "เตรียมส่งฟ้อง",
                  status: status.preEnforce,
                  icon: <AuditOutlined />,
                },
              ]}
            />
          </Card>
        )}
      </>
    );
  };

  return (
    <>
      <Modal
        title="เปลี่ยนสถานะ"
        open={open}
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
            <FormDisabled />
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
export default UpdateStatusNotice;
