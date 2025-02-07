import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Card, message, InputNumber } from "antd";
import {
  baseUrl,
  HEADERS_EXPORT,
  PUT_LAWSUIT_DETAIL,
} from "../../../API/apiUrls";
import axios from "axios";
import dayjs from "dayjs";

const EditAdvancePaymentDetail = ({ open, close, dataDefault, handleEdit }) => {
  const [loading, setLoading] = useState();
  const [isModal, setIsModal] = useState(false);
  const [dataLoadLawSuit, setDataLoadLawSuit] = useState();

  const [form] = Form.useForm();

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      form.setFieldsValue({
        feeCourt: dataDefault?.fee,
        stampDuty: dataDefault?.stamp_cost,
        docShipingCost: dataDefault?.delivery_of_summons,
        documentCost: dataDefault?.document_cost,
      });
      setLoading(false);
    }
  }, [isModal]);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
    setIsModal(false);
  };

  const sendStatus = async (data) => {
    setLoading(true);

    try {
      console.log(data);
      await axios
        .put(baseUrl + PUT_LAWSUIT_DETAIL, data, { headers: HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res.data);
            handleEdit({
              ...dataDefault,
              fee: data?.fee,
              stamp_cost: data?.stamp_cost,
              attorney_fees: data?.attorney_fees,
              document_cost: data?.document_cost,
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
    console.log(values);

    const putData = {
      ...dataDefault,
      fee:
        values?.feeCourt &&
        typeof values.feeCourt === "string" &&
        values.feeCourt.includes(",")
          ? parseFloat(values.feeCourt.replace(/,/g, ""))
          : parseFloat(values.feeCourt)
          ? parseFloat(values.feeCourt)
          : 0,
      stamp_cost:
        values?.stampDuty &&
        typeof values.stampDuty === "string" &&
        values.stampDuty.includes(",")
          ? parseInt(values.stampDuty.replace(/,/g, ""))
          : parseInt(values.stampDuty)
          ? parseInt(values.stampDuty)
          : 0,
      delivery_of_summons:
        values?.docShipingCost &&
        typeof values.docShipingCost === "string" &&
        values.docShipingCost.includes(",")
          ? parseInt(values.docShipingCost.replace(/,/g, ""))
          : parseInt(values.docShipingCost)
          ? parseInt(values.docShipingCost)
          : 0,
      document_cost:
        values?.documentCost &&
        typeof values.documentCost === "string" &&
        values.documentCost.includes(",")
          ? parseInt(values.documentCost.replace(/,/g, ""))
          : parseInt(values.documentCost)
          ? parseInt(values.documentCost)
          : 0,
    };

    console.log("putData", putData);
    sendStatus(putData);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const feeCourtCost = (value) => {
    console.log(value);
  };

  const stampDutyCost = (value) => {
    console.log(value);
  };

  const docShipingCost = (value) => {
    console.log(value);
  };

  const documentCost = (value) => {
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
              {`${dataDefault?.CONTNO}/${dataDefault?.customer_title}${dataDefault?.customer_name} ${dataDefault?.customer_lastname}`}
            </p>
          </Form.Item>
          <Form.Item
            label="ค่าธรรมเนียมศาล"
            name="feeCourt"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ค่าธรรมเนียมศาล !",
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
              placeholder="กรุณาใส่ค่าธรรมเนียมศาล"
              style={{ width: "100%", color: "black" }}
              onChange={(value) => feeCourtCost(value)}
            />
          </Form.Item>

          <Form.Item
            label="ค่าอากรสแตมป์"
            name="stampDuty"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ค่าค่าอากรสแตมป์ !",
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
              placeholder="กรุณากรอกค่าอากรสแตมป์"
              style={{ width: "100%", color: "black" }}
              onChange={(value) => stampDutyCost(value)}
            />
          </Form.Item>
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
              suffix="บาท"
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
              suffix="บาท"
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
        title="แก้ไขข้อมูล"
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
export default EditAdvancePaymentDetail;
