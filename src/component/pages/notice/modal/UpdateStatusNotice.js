import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Card,
  Cascader,
  Checkbox,
  Select,
  TreeSelect,
  Radio,
  Steps,
  message,
} from "antd";
import {
  BellOutlined,
  SearchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { baseUrl, POST_STATUS, HEADERS_EXPORT } from "../../../API/apiUrls";

const UpdateStatusNotice = ({ open, close, data }) => {
  const [defaultStatus, setDefaultStatus] = useState("enforce");
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);
  const { TextArea } = Input;
  const { dataFormat, setDataFormat } = useState();

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const sendStatus = async () => {
    if (status === 2) {
      setLoading(true);
      try {
        await axios
          .post(baseUrl + POST_STATUS, data, { HEADERS_EXPORT })
          .then(async (res) => {
            if (res.status === 200) {
              console.log("resQuery", res.data);
              message.success("อัพเดทข้อมูลสำเร็จ");
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

  const handleStatusChange = (current) => {
    console.log(current);
    setStatus(current);
    if (current === 2) {
    }
  };

  const onChange = (e) => {
    setDefaultStatus(e.target.value);
    console.log(defaultStatus);
  };

  const FormDisabledDemo = () => {
    return (
      <>
        <Radio.Group
          onChange={onChange}
          defaultValue="enforce"
          value={defaultStatus}
        >
          <Radio value="enforce">เตรียมฟ้อง</Radio>
          <Radio value="pay">ทำยอม/ชำระหนี้</Radio>
        </Radio.Group>
        {defaultStatus === "pay" ? (
          <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            style={{
              maxWidth: 600,
            }}
          >
            <Form.Item label="Checkbox" name="disabled" valuePropName="checked">
              <Checkbox>Checkbox</Checkbox>
            </Form.Item>
            <Form.Item label="Radio">
              <Radio.Group>
                <Radio value="apple"> Apple </Radio>
                <Radio value="pear"> Pear </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Input">
              <Input />
            </Form.Item>
            <Form.Item label="Select">
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="TreeSelect">
              <TreeSelect
                treeData={[
                  {
                    title: "Light",
                    value: "light",
                    children: [
                      {
                        title: "Bamboo",
                        value: "bamboo",
                      },
                    ],
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="Cascader">
              <Cascader
                options={[
                  {
                    value: "zhejiang",
                    label: "Zhejiang",
                    children: [
                      {
                        value: "hangzhou",
                        label: "Hangzhou",
                      },
                    ],
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label="DatePicker">
              <DatePicker />
            </Form.Item>

            <Form.Item label="InputNumber">
              <InputNumber />
            </Form.Item>
            <Form.Item label="TextArea">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Button">
              <Button>Button</Button>
            </Form.Item>
          </Form>
        ) : (
          <Card style={{ marginTop: "10px" }}>
            <Steps
              responsive={true}
              onChange={handleStatusChange}
              items={[
                {
                  title: "ส่งโนติส",
                  status: "finish",
                  icon: <BellOutlined />,
                },
                {
                  title: "เวลาดำเนินการเหลือ",
                  status: "process",
                  subTitle: "8 วัน",
                  icon: <LoadingOutlined />,
                },
                {
                  title: "เตรียมส่งฟ้อง",
                  status: "wait",
                  icon: <SearchOutlined />,
                },
              ]}
            />
          </Card>
        )}
      </>
    );
  };

  return (
    <>
      <Modal
        title="เปลี่ยนสถานะ"
        open={open}
        onCancel={handleCancel}
        width={850}
        footer={[
          <Button key="cancel" onClick={handleCancel} style={{ color: "red" }}>
            ปิด
          </Button>,
          <Button key="ok" onClick={sendStatus()} style={{ color: "green" }}>
            บันทึก
          </Button>,
        ]}
      >
        <Card>
          <FormDisabledDemo />
        </Card>
      </Modal>
    </>
  );
};
export default UpdateStatusNotice;
