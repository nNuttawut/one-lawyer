import React, { memo, useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Modal,
  Card,
  message,
  Spin,
  Radio,
  Tabs,
  Tooltip,
  Checkbox,
  Space,
} from "antd";
import {
  baseUrl,
  GET_LOAN_BY_CONTNO,
  GET_WORK_LOG_DETAIL_BY_ID,
  HEADERS_EXPORT,
  POST_AGREEMENTS,
  POST_STATUS,
} from "../../../API/apiUrls";
import axios from "axios";

import CurrencyFormat from "../../../../hook/CurrencyFormat";
import { optionsInterest } from "../../../../utils/constant/ Interest";
import CheckGovermentOfficer from "../../../../hook/CeckGovermentOfficer";
import { optionsMonth } from "../../../../utils/constant/MonthSelect";
import {
  PAYMENT,
  STATUS_PROCESS_PROGRESS,
} from "../../../../utils/constant/StatusConstant";
import TokenCheck from "../../../../hook/TokenCheck";

const UpdateStatus = ({ open, close, dataDefualt, funcUpdateStatus }) => {
  const [setupGovernmentOfficerList, governmentOfficers] =
    CheckGovermentOfficer();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const { TextArea } = Input;
  const [dataStore, setDataStore] = useState();
  const [checkLenght, setCheckLenght] = useState([]);
  const [dataForm, setDataForm] = useState({});
  const [preData, setPreData] = useState();
  const [defaultRadio, setDefaultRadio] = useState("normal");
  const [currencyFormatComma] = CurrencyFormat();
  const [arrow, setArrow] = useState("Show");
  const [tabsKey, setTabsKey] = useState("1");
  const [checkboxTab1, setCheckBoxTab1] = useState({});
  const [checkboxTab2, setCheckBoxTab2] = useState({});

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();

      console.log("loadData", dataDefualt);
    }
  }, [isModal]);

  const handleOk = () => {};

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [worklogs, loanRes] = await Promise.all([
        axios.get(
          `${baseUrl}${GET_WORK_LOG_DETAIL_BY_ID}${dataDefualt.WORK_LOG_ID}`,
          {
            headers: HEADERS_EXPORT,
          }
        ),
        axios.get(`${baseUrl}${GET_LOAN_BY_CONTNO}${dataDefualt.CONTNO}`, {
          headers: HEADERS_EXPORT,
        }),
      ]);

      if (worklogs.status === 200) {
        setDataLoadLawSuit(worklogs.data);
        setDataStore(worklogs.data);
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
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendStatus = async (status, agreement) => {
    setLoading(true);

    try {
      console.log("status", status);
      await axios
        .post(baseUrl + POST_STATUS, status, { headers: HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 201) {
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
        .post(baseUrl + POST_AGREEMENTS, agreement, { headers: HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 201) {
            console.log("resQuery", res.data);
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

  const onFinish = (values) => {
    console.log("Success:", values);
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
      total_amount: parseInt(values.paymentAmount.replace(/,/g, "")),
      installment_amount: parseInt(values.paymentMonthAmount.replace(/,/g, "")),
      installment_count: values.installmentCount,
      document_filepath: values.paymentFile,
      mark: values.memo,
      due_date: preData,
      already_paid: null,
      payment_status: null,
      payment_status_date: null,
      negotiator_id: dataDefualt.LAWYER_ID,
      NEW_CONTNO: values.newContno ? values.newContno : null,
    };

    console.log("putStatus", statusData);
    console.log("judgementData", agreement);
    sendStatus(statusData, agreement);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const onChangPaymentAmount = (value) => {
    console.log(value);
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        judgement1: formattedValue,
      });
    } else {
      form.setFieldsValue({
        judgement2: inputValue.includes(",")
          ? inputValue.replace(",", "")
          : inputValue,
      });
    }
  };

  const onChangPaymentMonthAmount = (value) => {
    console.log(value);
    console.log(value);
    let inputValue = value;
    isNotNumber(inputValue.replace(/,/g, ""));
    if (inputValue.length >= 4) {
      var rawValue = inputValue.replace(/,/g, ""); // Remove existing commas
      let intValue = parseInt(rawValue);
      let formattedValue =
        intValue >= 1000 ? currencyFormatComma(intValue) : rawValue;
      form.setFieldsValue({
        costUnless1: formattedValue,
      });
    } else {
      form.setFieldsValue({
        costUnless1: inputValue.includes(",")
          ? inputValue.replace(",", "")
          : inputValue,
      });
    }
  };

  const onChangePaymentFile = (value) => {
    console.log(value);
  };

  function isNotNumber(value) {
    const regex = /^\d+$/; // กำหนดให้ตรงกับตัวเลขทั้งหมด
    if (!regex.test(value)) {
      message.error("กรุณากรอกข้อมูลเป็นตัวเลขเท่านั้น");
    }
  }

  const onChangeNewContno = (value) => {
    console.log(value);
  };

  const onChangeDate = (date, dateString) => {
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
          initialValues={{ memo: null }}
        >
          <Form.Item
            label="เลขสัญญาใหม่"
            name="newContno"
            // rules={[
            //   {
            //     required: true,
            //     message: "กรุณาใส่สัญญาใหม่ !",
            //   },
            // ]}
          >
            <Input
              name="newContno"
              onChange={(e) => onChangeNewContno(e.target.value)}
            />
          </Form.Item>
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
            <Input
              name="paymentAmount"
              onChange={(e) => onChangPaymentAmount(e.target.value)}
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
            <Input
              name="paymentMonthAmount"
              onChange={(e) => onChangPaymentMonthAmount(e.target.value)}
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
              type="number"
              name="installmentCount"
              options={optionsMonth}
            />
          </Form.Item>

          <Form.Item
            label="ไฟล์ทำยอม"
            name="paymentFile"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ url ของคำพิพากษาจากไฟล์กลาง !",
              },
            ]}
          >
            <Input
              name="paymentFile"
              onChange={(e) => onChangePaymentFile(e.target.value)}
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
            <DatePicker onChange={onChangeDate} />
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
          <>{formDataPayment()}</>
        </Spin>
      </Modal>
    </>
  );
};
export default UpdateStatus;
