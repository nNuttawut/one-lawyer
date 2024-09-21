import React, { useEffect, useState } from "react";
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
  Checkbox,
  Space,
} from "antd";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  PUT_LAWSUIT_DETAIL,
  PUT_STATUS,
} from "../../../API/apiUrls";
import axios from "axios";
import moment from "moment";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import CeckGovermentOfficer from "../../../../hook/CeckGovermentOfficer";

const InvestigateAssetsDetail = ({
  open,
  close,
  dataDefualt,
  funcUpdateStatus,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const [isModal, setIsModal] = useState(false);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState(null);
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const { TextArea } = Input;

  const [currencyFormatNoPoint] = CurrencyFormat();
  const status = dataDefualt.MAIN_STATUS_ID;
  console.log(status);
  const [dataType, setDataType] = useState(null);
  const [value2, setValue2] = useState(null);
  const [checkLenght, setCheckLenght] = useState([]);

  const [setupGovernmentOfficerList, governmentOfficers, setHandleData] =
    CeckGovermentOfficer();

  const optionsInvestigate = [
    { label: "ไม่เจอทรัพย์", value: 0 },
    { label: "เจอทรัพย์", value: 1 },
  ];

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      console.log("loadData", dataDefualt);
      if (status <= 2) {
        setDataType("ก่อนฟ้อง");
      } else {
        setDataType("หลังฟ้อง");
      }
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
      } else {
        message.error("ไม่พบข้อมูลคดี");
      }

      if (loanRes.status === 200) {
        console.log("loanRes", loanRes.data);
        setDataLoadLoan(loanRes.data);
        setupGovernmentOfficerList(loanRes.data);
        listGovermentList(loanRes.data);
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

  const listGovermentList = (data) => {
    if (data) {
      if (data?.GUARANTORS) {
        const listLength = data?.GUARANTORS?.filter((item) => item);
        console.log("listLength", listLength.length);
        setCheckLenght(listLength.length);
      }
    }
  };

  const sendStatus = async (status, data) => {
    setLoading(true);
    try {
      console.log("status", status);
      await axios
        .put(baseUrl + PUT_STATUS, status, { HEADERS_EXPORT })
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
      console.log("data", data);
      await axios
        .put(baseUrl + PUT_LAWSUIT_DETAIL, data, { HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
            message.success("อัพเดทข้อมูลสำเร็จ");
            funcUpdateStatus({
              ...dataDefualt,
              DATE: status.DATE,
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

    // sendStatus(putStatus, putData);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputInvestigateDate = (value) => {
    console.log(value);
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const onChangeInputDeed = (value) => {
    console.log(value);
  };

  function isNotNumber(value) {
    const regex = /^\d+$/; // กำหนดให้ตรงกับตัวเลขทั้งหมด
    if (!regex.test(value)) {
      message.error("กรุณากรอกข้อมูลเป็นตัวเลขเท่านั้น");
    }
  }

  const onChangeGovermentOfficer = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };

  const handleCheckBoxGroupGoverment = () => {
    if (checkLenght) {
      return (
        <>
          <Checkbox.Group onChange={onChangeGovermentOfficer}>
            <Space direction="vertical" style={{ marginTop: "5px" }}>
              <Checkbox value={governmentOfficers?.id}>
                {governmentOfficers
                  ? `${governmentOfficers?.SNAM} ${governmentOfficers?.NAME1} ${governmentOfficers?.NAME2}`
                  : "-"}
              </Checkbox>
              {checkLenght > 0 ? (
                <Checkbox value={governmentOfficers?.guarantors[0]?.id}>
                  {governmentOfficers?.guarantors?.length > 0
                    ? `${governmentOfficers?.guarantors[0]?.SNAM} ${governmentOfficers?.guarantors[0]?.NAME1} ${governmentOfficers?.guarantors[0]?.NAME2}`
                    : "ไม่มีจำเลยที่ 2"}
                </Checkbox>
              ) : null}
              {checkLenght > 1 ? (
                <Checkbox value={governmentOfficers?.guarantors[1]?.id}>
                  {governmentOfficers?.guarantors?.length > 1
                    ? `${governmentOfficers?.guarantors[1]?.SNAM} ${governmentOfficers?.guarantors[1]?.NAME1} ${governmentOfficers?.guarantors[1]?.NAME2}`
                    : "ไม่มีจำเลยที่ 3"}
                </Checkbox>
              ) : null}
              {checkLenght > 2 ? (
                <Checkbox value={governmentOfficers?.guarantors[2]?.id}>
                  {governmentOfficers?.guarantors?.length > 2
                    ? `${governmentOfficers?.guarantors[2]?.SNAM} ${governmentOfficers?.guarantors[2]?.NAME1} ${governmentOfficers?.guarantors[2]?.NAME2}`
                    : "ไม่มีจำเลยที่ 4"}
                </Checkbox>
              ) : null}
            </Space>
            <Space direction="vertical" style={{ marginTop: "5px" }}>
              {checkLenght > 3 ? (
                <Checkbox value={governmentOfficers?.guarantors[3]?.id}>
                  {governmentOfficers?.guarantors?.length > 3
                    ? `${governmentOfficers?.guarantors[3]?.SNAM} ${governmentOfficers?.guarantors[3]?.NAME1} ${governmentOfficers?.guarantors[3]?.NAME2}`
                    : "ไม่มีจำเลยที่ 5"}
                </Checkbox>
              ) : null}
              {checkLenght > 4 ? (
                <Checkbox
                  value={governmentOfficers?.guarantors[4]?.id}
                  disabled="false"
                >
                  {governmentOfficers?.guarantors?.length > 4
                    ? `${governmentOfficers?.guarantors[4]?.SNAM} ${governmentOfficers?.guarantors[4]?.NAME1} ${governmentOfficers?.guarantors[4]?.NAME2}`
                    : "ไม่มีจำเลยที่ 6"}
                </Checkbox>
              ) : null}
              {checkLenght > 5 ? (
                <Checkbox value={governmentOfficers?.guarantors[5]?.id}>
                  {governmentOfficers?.guarantors?.length > 5
                    ? `${governmentOfficers?.guarantors[5]?.SNAM} ${governmentOfficers?.guarantors[5]?.NAME1} ${governmentOfficers?.guarantors[5]?.NAME2}`
                    : "ไม่มีจำเลยที่ 7"}
                </Checkbox>
              ) : null}
              {checkLenght > 6 ? (
                <Checkbox value={governmentOfficers?.guarantors[6]?.id}>
                  {governmentOfficers?.guarantors?.length > 6
                    ? `${governmentOfficers?.guarantors[6]?.SNAM} ${governmentOfficers?.guarantors[6]?.NAME1} ${governmentOfficers?.guarantors[6]?.NAME2}`
                    : "ไม่มีจำเลยที่ 8"}
                </Checkbox>
              ) : null}
            </Space>
          </Checkbox.Group>
        </>
      );
    } else {
      return null;
    }
  };

  const onChangeInvestiGateResult = ({ target: { value } }) => {
    console.log("radio2 checked", value);
    setValue2(value);
  };

  const formDataSetBefore = () => {
    return (
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
          memo: "",
          suspensionAmount: 0,
        }}
      >
        <Form.Item
          label="วันที่สืบทรัพย์"
          name="investigateAssetsDate"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกวันที่สืบทรัพย์",
            },
          ]}
        >
          <DatePicker onChange={onChangeInputInvestigateDate} />
        </Form.Item>
        <Form.Item label="จำเลยที่เป็นข้าราชการ" name="governmentOfficer">
          {handleCheckBoxGroupGoverment()}
        </Form.Item>
        <Form.Item
          label="ผลการสืบทรัพย์"
          name="investigateAssetsResult"
          rules={[
            {
              required: true,
              message: "กรุณาเลือกผลการสืบทรัพย์",
            },
          ]}
        >
          <Radio.Group
            label="ผลการสืบทรัพย์"
            name="investigateAssetsResult"
            options={optionsInvestigate}
            onChange={onChangeInvestiGateResult}
            value={value2}
          />
        </Form.Item>

        <Form.Item
          label="เลขโฉนด"
          name="deed"
          rules={[
            {
              required: true,
              message: "กรุณาพิมพ์เลขโฉนด !",
            },
          ]}
        >
          <Input onChange={(e) => onChangeInputDeed(e.target.value)} />
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
    );
  };

  return (
    <>
      <Modal
        title={`สืบทรัพย์ลูกหนี้ ${dataType}`}
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>{formDataSetBefore()}</Card>
        </Spin>
      </Modal>
    </>
  );
};
export default InvestigateAssetsDetail;
