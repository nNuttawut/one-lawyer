import { Button, Form, Input, Modal, Card, message, Spin, Radio } from "antd";
import {
  baseUrl,
  GET_LOAN_BY_CONTNO,
  HEADERS_EXPORT,
  HEADERS_EXPORT_BEN,
  POST_MEMO,
  PUT_INVESTIGATE_LOG,
} from "../../../API/apiUrls";
import axios from "axios";
import dayjs from "dayjs";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import React, { useEffect, useMemo, useState } from "react";

const InvestigateAssetsSearch = ({
  open,
  close,
  dataDefualt,
  funcUpdateStatus,
}) => {
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const userId = parseInt(localStorage.getItem("USER_ID"));
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState();
  const [dataLoadLoan, setDataLoadLoan] = useState(null);
  const [arrow, setArrow] = useState("Show");
  const [radioStatus, setRadioStatus] = useState();
  const [memo, setMemo] = useState(null);

  const optionsInvestigate = [
    { label: "ไม่เจอทรัพย์", value: 6 },
    { label: "เจอทรัพย์", value: 7 },
  ];

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      console.log("loadData", dataDefualt);
    }
  }, [isModal]);

  useEffect(() => {
    if (memo) {
      form.setFieldsValue({
        memo: memo,
      });
    }
  }, [memo]);

  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, []);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await axios
        .get(baseUrl + GET_LOAN_BY_CONTNO + dataDefualt.CONTNO, {
          headers: HEADERS_EXPORT,
        })
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            setDataLoadLoan(resQuery.data);
            console.log("loanRes", resQuery.data);
          } else {
            message.error("ไม่พบข้อมูล");
          }
        })
        .catch((err) => console.log("ไม่มีข้อมูล", err));
      await axios
        .post(
          POST_MEMO,
          {
            CONTNO: dataDefualt.CONTNO,
          },
          {
            headers: HEADERS_EXPORT_BEN,
          }
        )
        .then(async (resQuery) => {
          if (resQuery.status === 200) {
            console.log("memo", resQuery.data.MEMO1);
            setMemo(resQuery.data.MEMO1);
          } else {
            message.error("ไม่พบข้อมูล");
          }
        })
        .catch((err) => console.log("ไม่มีข้อมูล", err));
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendStatus = async (putDataInvestigate) => {
    setLoading(true);
    try {
      await axios
        .put(baseUrl + PUT_INVESTIGATE_LOG, putDataInvestigate, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res);
            funcUpdateStatus({
              ...dataDefualt,
              investigation_status: putDataInvestigate.investigation_status,
            });
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้1");
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

    const putDataInvestigate = {
      id: dataDefualt.investigation_log_id,
      investigation_status: radioStatus,
      investigation_date: dataDefualt.investigation_date,
      investigator_id: dataDefualt.investigator_id,
      mark: values.memo,
      property_list: [],
    };

    console.log("postDataInvestigate--->", putDataInvestigate);
    sendStatus(putDataInvestigate);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const onChangeInvestiGateResult = ({ target: { value } }) => {
    setRadioStatus(value);
    console.log(value);
  };

  const formDataSet = () => {
    return (
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 16,
        }}
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          memo: null,
          suspensionAmount: 0,
          investigateAssetsDate: dayjs(),
        }}
      >
        <Form.Item label="เลขสัญญา/เจ้าของสัญญา" name="ownerSign">
          <p>
            {`${dataDefualt?.CONTNO}/${dataDefualt?.CUSTOMER_TNAME}
            ${dataDefualt?.CUSTOMER_FNAME} ${dataDefualt?.CUSTOMER_LNAME}`}
          </p>
        </Form.Item>
        <Form.Item label="คนค้ำ" name="guarantor">
          {dataLoadLoan?.GUARANTORS?.length > 0 ? (
            dataLoadLoan.GUARANTORS.map((g, index) => (
              <p key={index}>{`${g.SNAM} ${g.NAME1} ${g.NAME2}`}</p>
            ))
          ) : (
            <p>- ไม่มีผู้ค้ำ -</p>
          )}
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
            value={radioStatus}
          />
        </Form.Item>

        <Form.Item label="หมายเหตุ" name="memo">
          <TextArea
            rows={10}
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
        title={`สืบทรัพย์ลูกหนี้`}
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>{formDataSet()}</Card>
        </Spin>
      </Modal>
    </>
  );
};
export default InvestigateAssetsSearch;
