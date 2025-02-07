import {
  Button,
  Form,
  Modal,
  Card,
  Spin,
  message,
  InputNumber,
  Input,
} from "antd";

import { useEffect, useState } from "react";
import TokenCheck from "../../../../hook/TokenCheck";
import axios from "axios";
import { baseUrl, HEADERS_EXPORT, PUT_EXPENSES } from "../../../API/apiUrls";

const ClearAdvanePayment = ({ open, close, dataDefault, funcUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [dataRender, setDataRender] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [btnOn, setBtnOn] = useState(false);
  const { TextArea } = Input;
  const [form] = Form.useForm();

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  useEffect(() => {
    if (dataDefault) {
      renderDataDetail(dataDefault);
      console.log(dataDefault);
      form.setFieldsValue({
        imageReplyFile: dataDefault.file_path,
        memo: dataDefault.withdraw_mark,
      });
    }
  }, [form]);

  const renderDataDetail = (record) => {
    console.log("recordxxxx", record);

    // เก็บข้อมูลในรูปแบบ Object
    const groupedData = {};

    dataDefault.expenseList.forEach((item) => {
      if (!groupedData[item.CONTNO]) {
        groupedData[item.CONTNO] = {
          CONTNO: item.CONTNO,
          created_date: item.created_date,
          withdraw_process_id: item.withdraw_process_id,
          expenses: [], // เก็บรายการค่าใช้จ่ายที่เกี่ยวข้อง
        };
      }

      // เพิ่มรายการค่าใช้จ่ายใน expenses array
      groupedData[item.CONTNO].expenses.push({
        ...item,
      });
    });

    // แปลง Object เป็น Array เพื่อใช้กับ `map`
    const groupedArray = Object.values(groupedData).map((group) => {
      return {
        ...group,
        expenses: group.expenses.sort(
          (a, b) => a.expense_type_id - b.expense_type_id
        ),
      };
    });

    console.log("groupedArray", groupedArray);

    // ตั้งค่า state สำหรับ render
    setDataRender(groupedArray);
  };

  const onChangeInputMemo = (value) => {
    console.log(value);
  };

  const onChangeReplyFile = (value) => {
    console.log(value);
  };

  const sendData = async (data) => {
    console.log();

    if (data.length > 0) {
      funcUpdateStatus(data);

      setLoading(true);

      try {
        // สร้างคำสั่ง Promise สำหรับ `setPreExpense`
        const promisesExpense = data.map((item) =>
          axios.put(`${baseUrl}${PUT_EXPENSES}`, item, {
            headers: HEADERS_EXPORT,
          })
        );

        // รวม Promise ทั้งหมด
        const allPromises = [...promisesExpense];

        // รอให้ทุกคำสั่งสำเร็จ
        const results = await Promise.all(allPromises);

        // จัดการผลลัพธ์
        const allSuccessful = results.every(
          (res) => res.status === 200 || res.status === 201
        );

        if (allSuccessful) {
          console.log("อัพเดทข้อมูลสำเร็จทั้งหมด");
          message.success("อัพเดทข้อมูลสำเร็จทั้งหมด");
        } else {
          console.error("มีข้อมูลบางรายการที่อัพเดทไม่สำเร็จ");
          message.error("มีข้อมูลบางรายการที่อัพเดทไม่สำเร็จ");
        }
        // หากสำเร็จทั้งหมดให้ปรับสถานะ
        funcUpdateStatus(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
      } finally {
        setLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  };

  const onFinish = (values) => {
    console.log(values);
    let dataset = [];
    let setdataSend = [];
    dataset = dataDefault.expenseList.map((item) => {
      // หาค่าที่ตรงกับ item.id
      let matchedValue = values[item.id];
      if (values[item.id]) {
        return {
          ...item,
          pay: matchedValue || 0, // ถ้าไม่มีค่าให้กำหนดเป็น 0
          withdraw_mark: values.memo || null,
          file_path: values.imageReplyFile,
          pay_type_id: 4,
        };
      }
    });
    const checkData = dataset.filter((item) => item); // กรองค่า null, undefined, false ออก
    setdataSend.push(...checkData);

    // sendData(setdataSend);
    console.log("dataSend", setdataSend);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครับ");
  };

  const checkItem = (value) => {
    console.log(value);

    if (value === 0 || value) {
      setBtnOn(true);
    } else {
      setBtnOn(false);
    }
  };

  const handleInputChange = (value, contno, description) => {
    console.log(value, contno, description);
    checkItem(value);
    // อัปเดตค่าลงใน state
    setInputValues((prev) => ({
      ...prev,
      [contno]: {
        ...prev[contno],
        [description]: value,
      },
    }));
  };

  if (dataRender) {
    return (
      <>
        <Modal
          title="เคลียร์เงินทดลองจ่าย"
          open={open}
          onCancel={handleCancel}
          width={650}
          footer={null}
        >
          <Spin spinning={loading} size="large" tip=" Loading... ">
            <Card>
              <Form
                labelCol={{
                  span: 10,
                }}
                wrapperCol={{
                  span: 24,
                }}
                layout="horizontal"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{
                  maxWidth: 600,
                }}
                form={form}
              >
                {dataRender?.map((data, index) => {
                  // ✅ คำนวณผลรวมของค่าใช้จ่ายแต่ละสัญญา
                  const total = data.expenses?.reduce(
                    (sum, item) => sum + (item.pay || 0),
                    0
                  );

                  return (
                    <div
                      key={index}
                      style={{
                        marginBottom: "20px",
                        border: "1px solid #ccc",
                        padding: "10px",
                        background:
                          index % 2 === 0
                            ? "linear-gradient(135deg, #f5f7fa 0%, #FFEBB7 100%)"
                            : "linear-gradient(135deg, #f5f7fa 0%,  #c3cfe2 100%)",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Form.Item label="สัญญา">{`${data.CONTNO}`}</Form.Item>

                      {data.expenses?.map((item, expenseIndex) => (
                        <div key={expenseIndex} style={{ paddingLeft: "20px" }}>
                          <Form.Item
                            label={item.expense_description}
                            name={item.id}
                          >
                            <InputNumber
                              suffix="บาท"
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              parser={(value) =>
                                value.replace(/\$\s?|(,*)/g, "")
                              }
                              size="large"
                              placeholder="ไม่มีให้เติม 0"
                              defaultValue={item.pay}
                              style={{ width: "80%", color: "black" }}
                              onChange={(value) =>
                                handleInputChange(
                                  value,
                                  data.CONTNO,
                                  item.expense_name
                                )
                              }
                            />
                          </Form.Item>
                        </div>
                      ))}
                      <Form.Item label="รวม">
                        <InputNumber
                          suffix="บาท"
                          value={total} // ใช้ค่าที่คำนวณได้
                          style={{
                            width: "80%",
                            color: "black",
                            fontWeight: "bold",
                          }}
                          disabled // ไม่ให้แก้ไข
                        />
                      </Form.Item>
                    </div>
                  );
                })}
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
                    style={{ width: "92%" }}
                    onChange={(e) => onChangeReplyFile(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="หมายเหตุ"
                  name="memo"
                  style={{ width: "95%" }}
                >
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
                  {btnOn ? (
                    <Button style={{ color: "green" }} htmlType="submit">
                      บันทึก
                    </Button>
                  ) : null}
                </div>
              </Form>
            </Card>
          </Spin>
        </Modal>
      </>
    );
  }
};
export default ClearAdvanePayment;
