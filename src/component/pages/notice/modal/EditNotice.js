import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Card,
  Select,
  Spin,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { NOTICE } from "../../../../utils/constant/StatusConstant";
import axios from "axios";
import {
  baseUrl,
  GET_LAWSUIT_DETAIL_BY_ID,
  HEADERS_EXPORT,
  PUT_LAWSUIT_DETAIL,
  PUT_STATUS,
} from "../../../API/apiUrls";
import moment from "moment";
import LoadCompanies from "../../../../hook/LoadCompanies";

const CreateNotice = ({ open, close, dataDefualt, funcUpdateStatus }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [preData, setPreData] = useState();
  const { TextArea } = Input;
  const [companiesList, setLoadingData] = LoadCompanies();
  const [companiesOption, setCompaniesOption] = useState(null);
  const [lawsuitData, setLawsuitData] = useState(null);

  useEffect(() => {
    loadData();
    setLoadingData(true);
  }, [setLoadingData]);

  useEffect(() => {
    setOption();
    setDataDefualt();
  }, [companiesList]);

  const setDataDefualt = () => {
    form.setFieldsValue({
      company: dataDefualt.COMPANY_ID,
      dateNotice: moment(dataDefualt.DATE),
    });
  };

  const setOption = () => {
    const options = companiesList.map((item) => ({
      value: item.id,
      label: item.company_name,
      address: item.address,
    }));
    setCompaniesOption(options);
  };

  const loadData = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.get(
        baseUrl + GET_LAWSUIT_DETAIL_BY_ID + dataDefualt.LAWSUIT_ID,
        {
          HEADERS_EXPORT,
        }
      );
      if (response.data) {
        setLawsuitData(response.data);
        console.log(response.data);

        setLoading(false);
      } else {
      }
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      message.error(`ไม่พบข้อมูล: ${error.message}`);
    }
  };
  console.log("lawsuitData", lawsuitData);

  const sendStatus = async (data, lawsuit) => {
    console.log("data-->", data, lawsuit);
    if (data) {
      setLoading(true);
      try {
        await axios
          .put(baseUrl + PUT_STATUS, data, { HEADERS_EXPORT })
          .then(async (res) => {
            if (res.status === 200) {
              console.log("resQuery", res.data);
            } else {
              message.error("ไม่สามารถส่งข้อมูลได้");
              console.log("ไม่สามารถส่งข้อมูลได้");
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.status === 404) {
              message.error("ไม่สามารถส่งข้อมูลได้");
            }
          });

        await axios
          .put(baseUrl + PUT_LAWSUIT_DETAIL, lawsuit, { HEADERS_EXPORT })
          .then(async (res) => {
            if (res.status === 200) {
              message.success("อัพเดทข้อมูลสำเร็จ");
              funcUpdateStatus({
                ...dataDefualt,
                COMPANY_ID: lawsuit.COMPANY_ID,
                DATE: data.DATE,
              });
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
      }
    } else {
      message.error("โปรดตรวจสอบข้อมูลและกดบันทึกอีกครั้ง");
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

  const onChangeInput = (value) => {
    console.log(value);
  };
  console.log("dataDefualt", dataDefualt);

  const onFinish = (values) => {
    console.log("Success:", values);
    const putData = {
      WORK_LOG_ID: dataDefualt.WORK_LOG_ID,
      USER_ID: dataDefualt.LAWYER_ID,
      LOAN_ID: dataDefualt.id,
      MEMO: values.memo,
      DATE: moment(preData.dateNotice).format("YYYY-MM-DD"),
    };
    const putLawsuit = {
      ...lawsuitData,
      COMPANY_ID: parseInt(values.company),
    };
    console.log("putDataData", putData);
    console.log("putLawsuit", putLawsuit);
    sendStatus(putData, putLawsuit);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  console.log("dataDefualt.DATE", dataDefualt.DATE);

  return (
    <>
      <Modal
        title="แก้ไขโนติส"
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
              form={form} // ตั้งค่า form ที่นี่
              name="editNotice"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={{ memo: null }}
            >
              <Form.Item
                label="บริษัทที่ออกหนังสือ"
                name="company"
                rules={[
                  {
                    required: true,
                    message: "โปรดเลือกข้อมูล",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: 250,
                  }}
                  placeholder="เลือกบริษัท"
                  optionFilterProp="value"
                  options={companiesOption}
                  onChange={(value) => onChangeSelect(value)}
                />
              </Form.Item>

              <Form.Item
                label="วันที่ออกหนังสือ"
                name="dateNotice"
                rules={[
                  {
                    required: true,
                    message: "โปรดเลือกข้อมูล",
                  },
                ]}
              >
                <DatePicker
                  format={"YYYY-MM-DD"}
                  defaultValue={
                    dataDefualt.DATE ? moment(dataDefualt.DATE) : moment()
                  }
                  onChange={onChange}
                />
              </Form.Item>

              <Form.Item label="หมายเหตุ" name="memo">
                <TextArea
                  rows={5}
                  onChange={(e) => onChangeInput(e.target.value)}
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
          </Card>
        </Spin>
      </Modal>
    </>
  );
};
export default CreateNotice;
