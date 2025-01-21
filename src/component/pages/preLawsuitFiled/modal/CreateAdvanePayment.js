import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Card,
  message,
  Spin,
  List,
} from "antd";
import {
  baseUrl,
  HEADERS_EXPORT,
  POST_INVESTIGATE_LOG,
  PUT_USER_UPDATE,
} from "../../../API/apiUrls";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import DateCustom from "../../../../hook/DateCustom";

const CreateAdvanePayment = ({
  open,
  close,
  dataDefualt,
  funcUpdateStatus,
}) => {
  const [form] = Form.useForm();
  const [convertDateThai] = DateCustom();
  const { TextArea } = Input;
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arrow, setArrow] = useState("Show");
  const [dataPropertyList, setDataPropertyList] = useState([]);

  useEffect(() => {
    setIsModal(open);
    if (isModal) {
      console.log("loadData", dataDefualt);
    }
  }, [isModal]);

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

  const sendStatus = async (postDataInvestigate, governmentOfficerData) => {
    console.log("governmentOfficerData---->", governmentOfficerData);

    setLoading(true);

    try {
      console.log("investigateStatus ", postDataInvestigate);
      await axios
        .post(baseUrl + POST_INVESTIGATE_LOG, postDataInvestigate, {
          headers: HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 201) {
            console.log("resQuery", res);
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

      if (governmentOfficerData.length > 0) {
        console.log("governmentOfficerData", governmentOfficerData);
        const promises = governmentOfficerData.map(async (item) => {
          const arrayData = item;
          console.log("arrayData", arrayData);

          if (!arrayData) {
            message.warning("พบค่าที่ไม่ถูกต้อง");
            return null;
          }
          await axios
            .put(baseUrl + PUT_USER_UPDATE, arrayData, {
              headers: HEADERS_EXPORT,
            })
            .then((resQuery) => {
              if (resQuery.status === 201) {
                console.log(resQuery.data);
                return resQuery.data;
              } else {
                console.log(`แก้ไขข้อมูลสำเร็จ`);
                return null;
              }
            })
            .catch((err) => {
              console.error(err);
              message.error(`แก้ไขข้อมูลไม่สำเร็จ7`);
            });
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
      handleCancel();
    }
  };

  const handleEdit = (item, index) => {
    console.log("item0", item, index);
  };

  const handleDelete = (index) => {
    console.log("delete--->", index);
    setDataPropertyList((prevData) => prevData.filter((_, i) => i !== index));
  };

  const onFinish = (values) => {};

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const onChangeInputInvestigateDate = (date, dateSting) => {
    console.log(date);
    console.log(dateSting);
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const formDataSet = () => {
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
          memo: null,
          suspensionAmount: 0,
          investigateAssetsDate: dayjs(),
        }}
      >
        <Form.Item
          label="วันที่ขอเบิก"
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
        <>
          <Form.Item
            label="สัญญาที่ต้องการเบิก"
            name="contnoWithdraw"
            labelCol={{ span: 6 }} // กำหนดความกว้างของ label
            wrapperCol={{ span: 14 }} // กำหนดความกว้างของ input หรือ content
          >
            <List
              itemLayout="horizontal"
              dataSource={dataPropertyList}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Link
                      key="list-loadmore-edit"
                      onClick={() => handleEdit(item, index)}
                    >
                      แก้ไข
                    </Link>,
                    <Link
                      key="list-loadmore-more"
                      style={{ color: "red" }}
                      onClick={() => handleDelete(index)} // ส่ง index เข้าไปในฟังก์ชัน
                    >
                      ลบ
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Link onClick={() => handleEdit(item, index)}>
                        {item.possessor} <br /> สืบเมื่อ{" "}
                        {convertDateThai(item.investigation_date)}
                      </Link>
                    }
                    description={
                      <>
                        <p>{`เลขโฉนด ${item.deed_number} อำเภอ ${item.district_desc} จังหวัด${item.province_desc}`}</p>
                        <p>{`หมายเหตุ ${item.mark}`}</p>
                      </>
                    }
                  />
                  <div>
                    {" "}
                    {item.investigation_type_id === 1
                      ? "ก่อนฟ้อง"
                      : item.investigation_type_id === 2
                      ? "หลังฟ้อง"
                      : null}
                  </div>
                </List.Item>
              )}
            />
          </Form.Item>
        </>

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
        title={`สร้างรายการเบิกเงินทดรองจ่าย`}
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
export default CreateAdvanePayment;
