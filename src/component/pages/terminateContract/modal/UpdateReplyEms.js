import {
  Button,
  Form,
  Input,
  Modal,
  Card,
  Select,
  Spin,
  message,
  Radio,
} from "antd";
import {
  NOTICE,
  STATUS_PROCESS_SUCCESSFUL,
  STATUS_PROCESS_UNSUCCESSFUL,
} from "../../../../utils/constant/StatusConstant";
import axios from "axios";
import { baseUrl, HEADERS_EXPORT, PUT_CANCEL } from "../../../API/apiUrls";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import TokenCheck from "../../../../hook/TokenCheck";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";

const UpdateReplyEms = ({ open, close, dataDefault, funcUpdateStatus }) => {
  const [convertDateThai] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [loading, setLoading] = useState(false);
  const [preData, setPreData] = useState(null);
  const { TextArea } = Input;
  const [defaultRadio, setDefaultRadio] = useState(null);

  const sendStatus = async (data) => {
    setLoading(true);
    try {
      await axios
        .put(baseUrl + PUT_CANCEL, data, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            message.success("อัพเดทข้อมูลสำเร็จ");
            // funcUpdateStatus({
            //   data,
            // });
            setLoading(false);
          } else {
            message.error("ไม่สามารถส่งข้อมูลได้");
            console.log("ไม่สามารถส่งข้อมูลได้");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 404) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  const onChangeSelect = (value) => {
    console.log(`selected ${value} `);
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setPreData({ ...preData, dateNotice: dateString });
  };

  const onChangeInputParcel = (value) => {
    console.log(value);
  };

  const onChangeInput = (value) => {
    console.log(value);
  };

  const onChangeReplyFile = (value) => {
    console.log(value);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    const putData = {
      ...dataDefault,
      remark: values.imageReplyFile,
      status: values.radioCus,
    };

    console.log("putData", putData);

    sendStatus(putData);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const renderType = (record) => {
    const options = [
      { value: 116, label: "จดหมายส่งผู้คนค้ำ(116)" },
      { value: 119, label: "บอกเลิกสัญญา(119)" },
      { value: 129, label: "ค่าบอกเลิกสัญญา(No ems)(129)" },
      { value: "vsfhp", label: "สัญญา 2" },
      { value: "psfhp", label: "สัญญา 3" },
      { value: "rpsl", label: "สัญญา 3(ใหม่)" },
      { value: "sfhp", label: "สัญญา 8" },
    ];

    if (!record) {
      return null;
    }
    const matchedOption = options.find((opt) => opt.value === record);
    return matchedOption ? matchedOption.label : "-"; // ถ้าไม่เจอ ให้แสดง "-"
  };

  return (
    <>
      <Modal
        title="ตอบกลับบอกเลิกสัญญา"
        open={open}
        onCancel={handleCancel}
        width={650}
        footer={null}
      >
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Card>
            <Form
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 24,
              }}
              layout="horizontal"
              style={{
                maxWidth: 600,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={{
                imageReplyFile: dataDefault.remark,
                radioCus: dataDefault.status,
              }}
            >
              <Form.Item label="เลขสัญญา">{dataDefault?.contract_no}</Form.Item>
              <Form.Item label="ประเภทสัญญา">
                {renderType(dataDefault?.contract_schema)}
              </Form.Item>
              <Form.Item label="ประเภทจ่าย">
                {renderType(dataDefault?.pay_type)}
              </Form.Item>
              <Form.Item label="ประเภทบัญชี">
                {dataDefault?.account_type}
              </Form.Item>

              <Form.Item label="วันที่ออกหนังสือ" name="datetime">
                {convertDateThai(dataDefault?.datetime)}
              </Form.Item>
              <Form.Item label="ผู้ทำสัญญา" name="cusId">
                {`${dataDefault?.customer_fullname} ${
                  dataDefault?.customer_type_id === 0
                    ? "(ผู้เช่าซื้อ)"
                    : `(ผู้ค้ำที่ ${dataDefault?.customer_type_id})`
                }`}
              </Form.Item>
              <Form.Item label="รายละเอียดรถ" name="carDetail">
                {`${dataDefault?.brand} ${dataDefault?.register_no}`}
              </Form.Item>
              <Form.Item label="ค้างงวด" name="overdue">
                {`${dataDefault?.overdue_installment_count} งวด`}
              </Form.Item>
              <Form.Item label="ยอดเงินค้าง" name="overdue">
                {`${currencyFormatPoint(
                  dataDefault?.overdue_installment_amount
                )} บาท`}
              </Form.Item>
              <Form.Item label="ค่าติดตาม" name="follow">
                {`${currencyFormatComma(
                  dataDefault?.dept_collection_fees
                )} บาท`}
              </Form.Item>
              <Form.Item label="หมายเลข EMS" name="ems">
                {dataDefault.parcel_no}
              </Form.Item>
              <Form.Item
                label="การตอบกลับ"
                name="radioCus"
                rules={[
                  {
                    required: true,
                    message: "โปรดเลือกข้อมูล",
                  },
                ]}
              >
                <Radio.Group onChange={onChange} defaultValue={defaultRadio}>
                  <Radio value={1}>จากใบตอบกลับ</Radio>
                  <Radio value={2}>จากเว็บไปษณีย์</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="ลิ้งค์เก็บรูปตอบกลับ"
                name="imageReplyFile"
                rules={[
                  ({ getFieldValue }) => ({
                    required: getFieldValue("radioCus") !== 3,
                    message: "กรุณาใส่ url ของรูปจากไฟล์กลาง !",
                  }),
                ]}
              >
                <Input
                  placeholder="กรุณาใส่ลิ้งค์แชร์จาก NAS"
                  name="imageReplyFile"
                  onChange={(e) => onChangeReplyFile(e.target.value)}
                />
              </Form.Item>
              {/* <Form.Item label="หมายเหตุ" name="memo">
                <TextArea
                  rows={5}
                  onChange={(e) => onChangeInput(e.target.value)}
                 
                />
              </Form.Item> */}
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
          </Card>
        </Spin>
      </Modal>
    </>
  );
};
export default UpdateReplyEms;
