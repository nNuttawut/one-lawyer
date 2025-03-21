import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Modal,
  message,
  Spin,
  Radio,
  InputNumber,
  Card,
  Steps,
  Divider,
} from "antd";
import {
  baseUrl,
  GET_LOAN_BY_CONTNO,
  GET_WORK_LOG_DETAIL_BY_ID,
  HEADERS_EXPORT,
  POST_AGREEMENTS,
  POST_STATUS,
  PUT_STATUS,
  GET_DETAILS,
} from "../../../API/apiUrls";
import axios from "axios";

import { optionsMonth } from "../../../../utils/constant/MonthSelect";
import {
  ENFORCEMENT,
  PARAM_PUBLIC,
  PAYMENT,
  STATUS_PROCESS_PROGRESS,
  STATUS_PROCESS_SUCCESSFUL,
} from "../../../../utils/constant/StatusConstant";
import TokenCheck from "../../../../hook/TokenCheck";
import Dragger from "antd/es/upload/Dragger";
import LoadLawyers from "../../../../hook/LoadLawyers";
import {
  LoadingOutlined,
  AuditOutlined,
  InboxOutlined,
} from "@ant-design/icons";

const UpdateStatus = ({ open, close, dataDefualt, funcUpdateStatus }) => {
  const COMPANY = parseInt(localStorage.getItem("COMPANY_ID"));
  const [lawyersList, setLoadingData] = LoadLawyers();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const [datadetail, setDatadetail] = useState(null);
  const [assistantOption, setAssistantOption] = useState();
  const { TextArea } = Input;
  const [fileList, setFileList] = useState([]);
  const [preData, setPreData] = useState();
  const [defaultRadio, setDefaultRadio] = useState("agreement");

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      setLoadingData(true);
      console.log("loadData", dataDefualt);
    }
  }, [isModal]);

  useEffect(() => {
    if (lawyersList) {
      setOptionAssistant();
    }
  }, [lawyersList]);

  const handleOk = () => {
    console.log("ดำเนินการบันทึก");
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const setOptionAssistant = () => {
    console.log("lawyersList", lawyersList);
    let companySelectAssistant = null;
    if (COMPANY === 1 || COMPANY === 2) {
      companySelectAssistant = lawyersList.filter(
        (item) =>
          (item.COMPANY_ID === 1 || item.COMPANY_ID === 2) &&
          (item.ROLE_ID === 2 || item.ROLE_ID === 3 || item.ROLE_ID === 4)
      );
    } else {
      companySelectAssistant = lawyersList.filter(
        (item) =>
          item.COMPANY_ID === 3 &&
          (item.ROLE_ID === 2 || item.ROLE_ID === 3 || item.ROLE_ID === 4)
      );
    }
    const optionsAssistant = companySelectAssistant.map((item) => ({
      value: item.id,
      label: item.NNAME,
    }));
    setAssistantOption(optionsAssistant);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [worklogs, loanRes, detail] = await Promise.all([
        axios.get(
          `${baseUrl}${GET_WORK_LOG_DETAIL_BY_ID}${dataDefualt.WORK_LOG_ID}`,
          {
            headers: HEADERS_EXPORT,
          }
        ),
        axios.get(`${baseUrl}${GET_LOAN_BY_CONTNO}${dataDefualt.CONTNO}`, {
          headers: HEADERS_EXPORT,
        }),
        axios.get(`${baseUrl}${GET_DETAILS}${dataDefualt.CONTNO}`, {
          headers: HEADERS_EXPORT,
        }),
      ]);

      if (worklogs.status === 200) {
        setDataLoadLawSuit(worklogs.data);

        console.log("worklogs.data", worklogs.data);
      } else {
        message.error("ไม่พบข้อมูลคดี");
      }
      if (loanRes.status === 200) {
        console.log("loanRes", loanRes.data);
        setDataLoadLoan(loanRes.data);

        console.log("loanRes.data", loanRes.data);
      } else {
        message.error("ไม่พบข้อมูลเงิน");
      }
      if (detail.status === 200) {
        console.log("detail", loanRes.data);
        setDatadetail(loanRes.data);

        console.log("detail-->", detail.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendStatus = async (status, agreement, putStatus) => {
    setLoading(true);
    try {
      console.log("status", status);
      await axios
        .post(baseUrl + POST_STATUS, status, { headers: HEADERS_EXPORT })
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
      if (agreement) {
        await axios
          .post(baseUrl + POST_AGREEMENTS, agreement, {
            headers: HEADERS_EXPORT,
          })
          .then(async (res) => {
            if (res.status === 201) {
              console.log("resQuery", res.data);
              handleUploadAllImage();
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
      }
      await axios
        .put(baseUrl + PUT_STATUS, putStatus, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            funcUpdateStatus({
              ...dataDefualt,
              MAIN_STATUS_ID: putStatus.MAIN_STATUS_ID,
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

  const handleUploadAllImage = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);

    axios
      .post(
        baseUrl +
          `/files/lawyer/settlement_agreement/${PARAM_PUBLIC}/${dataDefualt.CONTNO}`,
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

  const onFinish = (values) => {
    console.log(values);
    if (defaultRadio === "enforce") {
      const statusData = {
        USER_ID: dataDefualt.LAWYER_ID,
        LOAN_ID: dataDefualt.id,
        LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
        LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
        MEMO: values.memo,
        DATE: preData,
        MAIN_STATUS_ID: ENFORCEMENT,
        PROCESS_ID: STATUS_PROCESS_PROGRESS,
      };
      const putStatus = {
        id: dataDefualt.WORK_LOG_ID,
        MEMO: dataDefualt.memo,
        DATE: dataDefualt.DATE,
        USER_ID: dataDefualt.LAWYER_ID,
        LOAN_ID: dataDefualt.id,
        PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
      };
      console.log("putStatus", statusData);
      console.log("putStatus", putStatus);
      sendStatus(statusData, null, putStatus);
    } else {
      if (values?.file?.fileList?.length > 0 && defaultRadio === "agreement") {
        const statusData = {
          USER_ID: dataDefualt.LAWYER_ID,
          LOAN_ID: dataDefualt.id,
          LOAN_TYPE_ID: dataDefualt.LOAN_TYPE_ID,
          LAW_TYPE_ID: dataDefualt.LAW_TYPE_ID,
          MEMO: values.memo,
          DATE: preData,
          MAIN_STATUS_ID: PAYMENT,
          PROCESS_ID: STATUS_PROCESS_PROGRESS,
        };
        const agreement = {
          LAWSUIT_ID: dataLoadLawSuit.lawsuit.id,
          total_amount: values.paymentAmount,
          installment_amount: values.paymentMonthAmount,
          installment_count: values.installmentCount,
          document_filepath: null,
          mark: values.memo,
          due_date: preData,
          already_paid: null,
          payment_status: null,
          payment_status_date: null,
          negotiator_id: dataDefualt.LAWYER_ID,
          NEW_CONTNO: dataDefualt.CONTNO,
        };
        const putStatus = {
          id: dataDefualt.WORK_LOG_ID,
          MEMO: dataDefualt.memo,
          DATE: dataDefualt.DATE,
          USER_ID: dataDefualt.LAWYER_ID,
          LOAN_ID: dataDefualt.id,
          PROCESS_ID: STATUS_PROCESS_SUCCESSFUL,
        };
        console.log("putStatus", statusData);
        console.log("judgementData", agreement);
        console.log("putStatus", putStatus);

        sendStatus(statusData, agreement, putStatus);
      } else {
        message.error("กรุณาอัปโหลดไฟล์");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const onChangeSelectnegotiator = (value) => {
    console.log(`selected ${value}`);
  };

  const onChangPaymentAmount = (value) => {
    console.log(value);
  };

  const onChangPaymentMonthAmount = (value) => {
    console.log(value);
  };

  const onChangeDateAgreement = (date, dateString) => {
    console.log(date, dateString);
    setPreData(dateString);
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

  const onChange = (e) => {
    setDefaultRadio(e.target.value);
    console.log(e.target.value);
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

  const formDataPayment = () => {
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
        >
          <Form.Item
            label="ยินยอมชำระเงินจำนวน"
            name="paymentAmount"
            rules={[
              {
                required: true,
                message: "กรุณาใส่เงินต้นที่ทำยอม",
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
              placeholder="กรุณาใส่ค่าติดตาม !"
              style={{ width: "100%", color: "black" }}
              onChange={(value) => onChangPaymentAmount(value)}
            />
          </Form.Item>

          <Form.Item
            label="งวดละไม่น้อยกว่า"
            name="paymentMonthAmount"
            rules={[
              {
                required: true,
                message: "กรุณาใส่เงินที่ต้องชำระรายเดือน",
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
              placeholder="กรุณาใส่ค่าติดตาม !"
              style={{ width: "100%", color: "black" }}
              onChange={(value) => onChangPaymentMonthAmount(value)}
            />
          </Form.Item>
          <Form.Item
            label="วันนัดชำระครั้งแรก"
            name="paymentDate"
            rules={[
              {
                required: true,
                message: "โปรดเลือกวันที่นัดชำระ",
              },
            ]}
          >
            <DatePicker
              onChange={onChangeDateAgreement}
              placeholder="กรุณาเลือกวันที่"
              size="large"
              style={{ width: "auto" }}
            />
          </Form.Item>

          <Form.Item
            label="จำนวนกี่เดือน"
            name="installmentCount"
            rules={[
              {
                required: true,
                message: "กรุณาใส่จำนวนงวด",
              },
            ]}
          >
            <Select
              size="large"
              style={{ width: "auto" }}
              type="number"
              name="costMonth3"
              popupMatchSelectWidth={false}
              options={optionsMonth}
              placeholder="เลือกจำนวนเดือน"
            />
          </Form.Item>
          <Form.Item
            label="เลือกผู้เจรจา"
            name="negotiator"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกผู้เจรจา !",
              },
            ]}
          >
            <Select
              popupMatchSelectWidth={false}
              placeholder="เลือกผู้เจรจา"
              optionFilterProp="value"
              onChange={(value) => onChangeSelectnegotiator(value)}
              options={assistantOption}
              size="large"
              style={{ width: "auto" }}
            />
          </Form.Item>

          <Form.Item
            label="ไฟล์คำพิพากษา"
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
          {buttonCustom()}
        </Form>
      </Card>
    );
  };

  const FormDisabled = () => {
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
        >
          <Card style={{ marginBottom: "30px" }}>
            <Divider style={{ marginBottom: "30px" }}>ส่งบังคับคดี</Divider>
            <Steps
              responsive={true}
              items={[
                {
                  title: "เจรจา",
                  status: "finish",
                },
                {
                  title: "ดำเนินการ",
                  status: "process",
                  // description: `เกินกำหนด: ${countDate} วัน`,
                  icon: <LoadingOutlined />,
                },
                {
                  title: "บังคับคดี",
                  status: "finish",
                  icon: <AuditOutlined />,
                },
              ]}
            />
          </Card>
          {buttonCustom()}
        </Form>
      </>
    );
  };

  return (
    <>
      <Modal
        title="อัพเดทสถานะ"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Radio.Group
            onChange={onChange}
            defaultValue="agreement"
            value={defaultRadio}
            style={{ margin: "10px" }}
          >
            <Radio value="agreement">ทำยอม</Radio>
            <Radio value="enforce">ส่งบังคับคดี</Radio>
          </Radio.Group>
          {defaultRadio === "enforce" ? (
            <Card>{FormDisabled()}</Card>
          ) : (
            <>{formDataPayment()}</>
          )}
        </Spin>
      </Modal>
    </>
  );
};
export default UpdateStatus;
