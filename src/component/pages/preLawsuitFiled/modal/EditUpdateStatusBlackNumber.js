import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Card,
  message,
  Tooltip,
  InputNumber,
} from "antd";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_LOAN,
  HEADERS_EXPORT,
  PUT_LAWSUIT_DETAIL,
  PUT_STATUS,
} from "../../../API/apiUrls";
import axios from "axios";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const EditUpdateStatusBlackNumber = ({
  open,
  close,
  dataDefault,
  funcUpdateStatus,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [loading, setLoading] = useState();
  const [isModal, setIsModal] = useState(false);
  const [arrow, setArrow] = useState("Show");
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState();
  const [dataLoadLoan, setDataLoadLoan] = useState();
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [dataStore, setDataStore] = useState();
  const [dataForm, setDataForm] = useState({});
  const [dateDefault, setDateDefault] = useState();
  dayjs.extend(utc);
  dayjs.extend(timezone);

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      loadData();
      console.log("loadData", dataDefault);
    }
  }, [isModal]);

  useEffect(() => {
    setLoading(true);
    if (dataLoadLawSuit) {
      form.setFieldsValue({
        blackNumber: dataLoadLawSuit?.black_case_number,
        docShipingCost: dataLoadLawSuit?.attorney_fees,
        imageReplyFile: dataLoadLawSuit?.file_path,
        documentCost: dataLoadLawSuit?.document_cost,
      });
      setDateDefault(
        dayjs(dataLoadLawSuit?.consideration_date).format("YYYY-MM-DD HH:mm")
      );
      setLoading(false);
    }
  }, [dataLoadLawSuit]);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

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
  }, [arrow]);
  const loadData = async () => {
    setLoading(true);
    try {
      const [lawsuitRes] = await Promise.all([
        axios.get(`${baseUrl}${GET_LAWSUIT_DETAIL_BY_LOAN}${dataDefault.id}`, {
          headers: HEADERS_EXPORT,
        }),
      ]);

      if (lawsuitRes.status === 200) {
        console.log("lawsuitRes", lawsuitRes.data);
        setDataLoadLawSuit(lawsuitRes.data);
        setDataStore(lawsuitRes.data);
      } else {
        message.error("ไม่พบข้อมูลคดี");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendStatus = async (data, status) => {
    setLoading(true);
    try {
      console.log(data);
      await axios
        .put(baseUrl + PUT_LAWSUIT_DETAIL, data, { headers: HEADERS_EXPORT })
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

      console.log(status);
      await axios
        .put(baseUrl + PUT_STATUS, status, { headers: HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
            message.success(`อัพเดทข้อมูลสำเร็จ ${dataDefault.CONTNO}`);
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
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const onChangeConsiderationDate = (date, dateString) => {
    console.log(date, dateString);

    setDataForm({ ...dataForm, considerationDate: dateString });
  };

  const onChangeInputBlackNumber = (value) => {
    console.log(value);
  };

  const docShipingCost = (value) => {
    console.log(value);
  };

  const onChangeReplyFile = (value) => {
    console.log(value);
  };

  const onFinish = (values) => {
    console.log(values);

    const putData = {
      ...dataLoadLawSuit,
      black_case_number: values.blackNumber,
      consideration_date: values.considerationDate
        ? dayjs(values.considerationDate).format("YYYY-MM-DD HH:mm")
        : dateDefault,
      delivery_of_summons:
        values?.docShipingCost &&
        typeof values.docShipingCost === "string" &&
        values.docShipingCost.includes(",")
          ? parseInt(values.docShipingCost.replace(/,/g, ""))
          : parseInt(values.docShipingCost)
          ? parseInt(values.docShipingCost)
          : 0,
      file_path: values.imageReplyFile,
      document_cost:
        values?.documentCost &&
        typeof values.documentCost === "string" &&
        values.documentCost.includes(",")
          ? parseInt(values.documentCost.replace(/,/g, ""))
          : parseInt(values.documentCost)
          ? parseInt(values.documentCost)
          : 0,
    };
    const putStatus = {
      WORK_LOG_ID: dataDefault.WORK_LOG_ID,
      USER_ID: dataDefault.LAWYER_ID,
      LOAN_ID: dataDefault.id,
      MEMO: values.memo,
      DATE: values.considerationDate
        ? dayjs(values.considerationDate).format("YYYY-MM-DD HH:mm")
        : dateDefault,
      PROCESS_ID: dataDefault.PROCESS_ID,
    };

    console.log("postStatus", putStatus);
    console.log("putData", putData);
    sendStatus(putData, putStatus);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const documentCost = (value) => {
    console.log(value);
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const FormDisabledDemo = () => {
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
          initialValues={{
            memo: null,
            considerationDate: dataLoadLawSuit?.consideration_date,
          }}
        >
          <Form.Item label="เลขสัญญา/เจ้าของสัญญา" name="ownerSign">
            <p>
              {`${dataDefault?.CONTNO}/${dataDefault?.CUSTOMER_TNAME}
            ${dataDefault?.CUSTOMER_FNAME} ${dataDefault?.CUSTOMER_LNAME}`}
            </p>
          </Form.Item>
          <Form.Item
            label="หมายเลขคดีดำ"
            name="blackNumber"
            rules={[
              {
                required: true,
                message: "กรุณากรอกหมายเลขคดีดำ !",
              },
            ]}
          >
            <Input onChange={(e) => onChangeInputBlackNumber(e.target.value)} />
          </Form.Item>

          <Form.Item label="วันนัดพิจารณาคดี" name="considerationDate">
            {dayjs(dateDefault).utc().format("YYYY/MM/DD HH:mm") + " น."}
          </Form.Item>
          <Tooltip
            placement="bottom"
            title="ถ้าไม่ต้องการเปลี่ยนวันที่ไม่ต้องเลือก !"
            arrow={mergedArrow}
          >
            <Form.Item
              label="ต้องการเปลี่ยนเป็นวันที่"
              name="considerationDate"
            >
              <DatePicker
                showTime={{
                  format: "HH:mm",
                }}
                format="YYYY-MM-DD HH:mm"
                onChange={onChangeConsiderationDate}
              />
            </Form.Item>
          </Tooltip>
          <Form.Item
            label="ค่าส่งหมาย"
            name="docShipingCost"
            rules={[
              {
                required: true,
                message: "กรุณากรอกค่าส่งหมาย !",
              },
            ]}
          >
            <InputNumber
              addonAfter="บาท"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              size="large"
              placeholder="กรุณากรอกค่าส่งหมาย"
              style={{ width: "100%", color: "black" }}
              onChange={(value) => docShipingCost(value)}
            />
          </Form.Item>
          <Form.Item
            label="ค่าจัดทำเอกสาร"
            name="documentCost"
            rules={[
              {
                required: true,
                message: "กรุณากรอกค่าจัดทำเอกสาร !",
              },
            ]}
          >
            <InputNumber
              addonAfter="บาท"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              size="large"
              placeholder="กรุณากรอกจัดทำเอกสาร"
              style={{ width: "100%", color: "black" }}
              onChange={(value) => documentCost(value)}
            />
          </Form.Item>
          <Form.Item
            label="ลิ้งเก็บรูปส่วนฟ้อง"
            name="imageReplyFile"
            rules={[
              {
                required: true,
                message: "กรุณากรอกลิ้งเก็บรูปส่วนฟ้อง !",
              },
            ]}
          >
            <Input
              placeholder="กรุณากรอกลิ้งเก็บรูปส่วนฟ้อง"
              name="imageReplyFile"
              onChange={(e) => onChangeReplyFile(e.target.value)}
            />
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
      </>
    );
  };

  return (
    <>
      <Modal
        title="แก้ไขข้อมูลเปลี่ยนสถานะ"
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={null}
      >
        <Card>
          <FormDisabledDemo />
        </Card>
      </Modal>
    </>
  );
};
export default EditUpdateStatusBlackNumber;
