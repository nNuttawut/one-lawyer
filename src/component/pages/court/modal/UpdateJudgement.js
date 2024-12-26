import React, { memo, useEffect, useState } from "react";
import {
  Button,
  Modal,
  Card,
  Steps,
  message,
  Spin,
  Input,
  DatePicker,
  Form,
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
import CurrencyFormat from "../../../../hook/CurrencyFormat";

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
  const [form] = Form.useForm();
  const [currencyFormatNoPoint, currencyFormatComma, currencyFormatPoint] =
    CurrencyFormat();
  const [totalFeeCal, setTotalFeeCal] = useState(null);

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

  const sendStatus = async (statusData, dataJudgement) => {
    if (status.enforce === "finish") {
      setLoading(true);
      try {
        await axios
          .post(baseUrl + POST_STATUS, statusData, { headers: HEADERS_EXPORT })
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

  const onChangeJudgementFile = (value) => {
    console.log(value);
    setUrlFileSave(value);
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
    if (status.enforce === "finish") {
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
        fee: totalFeeCal,
      };
      console.log("postData", postData);
      console.log("putJudgement", putJudgement);
      sendStatus(postData, putJudgement);
    } else {
      message.error("กรุณาเปลี่ยนสถานะ");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };
  function isNotNumber(value) {
    const regex = /^\d+$/; // กำหนดให้ตรงกับตัวเลขทั้งหมด
    if (!regex.test(value)) {
      message.error("กรุณากรอกข้อมูลเป็นตัวเลขเท่านั้น");
    }
  }

  const onChangeTotalFee = (value) => {
    let total;
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        otherFee: formattedValue,
      });
      total =
        dataLoadJudgement?.fee +
        dataLoadJudgement?.attorney_fees +
        parseInt(formattedValue.replace(/,/g, ""));
      setTotalFeeCal(total);
    } else {
      form.setFieldsValue({
        otherFee: inputValue,
      });
      total =
        dataLoadJudgement?.fee +
        dataLoadJudgement?.attorney_fees +
        parseInt(inputValue);
      setTotalFeeCal(total);
    }
  };

  const formData = () => {
    return (
      <>
        <Card style={{ marginTop: "10px", marginBottom: "20px" }}>
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
              <Form.Item label="ค่าธรรมเนียมศาล" name="courtFee">
                <p>
                  {dataLoadJudgement?.fee
                    ? currencyFormatPoint(dataLoadJudgement?.fee)
                    : "-"}{" "}
                  บาท
                </p>
              </Form.Item>
              <Form.Item label="ค่าทนายความ" name="lawyerFeeEnforce">
                <p>
                  {dataLoadJudgement?.attorney_fees
                    ? currencyFormatNoPoint(dataLoadJudgement?.attorney_fees)
                    : "-"}{" "}
                  บาท
                </p>
              </Form.Item>
              <Form.Item
                label="ค่าฤชาอื่น ๆ"
                name="otherFee"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ค่าติดตาม !",
                  },
                ]}
              >
                <Input
                  autoComplete="off"
                  name="otherFee"
                  onChange={(e) => onChangeTotalFee(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="ค่าฤชาทั้งหมด" name="totalFee">
                <p>
                  {totalFeeCal ? currencyFormatNoPoint(totalFeeCal) : "-"} บาท
                </p>
              </Form.Item>
              <Form.Item
                label="ลิ้งที่แชร์ไฟ"
                name="urlPath"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่คำพิพากษา !",
                  },
                ]}
              >
                <Input
                  placeholder="ใส่ url file ในนี้"
                  onChange={(e) => onChangeJudgementFile(e.target.value)}
                />
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
