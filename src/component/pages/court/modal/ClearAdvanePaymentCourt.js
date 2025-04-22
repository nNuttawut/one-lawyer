import {
  Button,
  Form,
  Modal,
  Card,
  Spin,
  message,
  InputNumber,
  Input,
  List,
  Image,
} from "antd";

import { useEffect, useState } from "react";
import TokenCheck from "../../../../hook/TokenCheck";
import axios from "axios";
import { baseUrl, HEADERS_EXPORT, PUT_EXPENSES } from "../../../API/apiUrls";
import Dragger from "antd/es/upload/Dragger";
import {
  InboxOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { PARAM_PUBLIC } from "../../../../utils/constant/StatusConstant";

const ClearAdvanePaymentCourt = ({
  open,
  close,
  dataDefault,
  funcUpdateStatus,
}) => {
  const [loading, setLoading] = useState(false);
  const [dataRender, setDataRender] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [btnOn, setBtnOn] = useState(false);
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [totalPay, setTotalPay] = useState({});
  const [fileList, setFileList] = useState([]);
  const [fileTranferMoney, setFileTranferMoney] = useState([]);
  const [fileListLoad, setFileListLoad] = useState([]);
  const [fileTranferMoneyLoad, setFileTranferMoneyLoad] = useState([]);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  useEffect(() => {
    if (dataDefault) {
      renderDataDetail(dataDefault);
      loadImagesProduct();
      loadImagesProductTranferMoney();
      console.log(dataDefault);
      form.setFieldsValue({
        // imageReplyFile: dataDefault.file_path,
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

  const loadImagesProduct = async () => {
    await axios
      .get(
        baseUrl +
          `/files/lawyer/advance-payment/${PARAM_PUBLIC}/receipt_${dataDefault.reference_no}`
      )
      .then((response) => {
        console.log("ImageList", response.data);
        if (response.data.length > 0) {
          setFileListLoad(response.data);
          setLoading(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const loadImagesProductTranferMoney = async () => {
    await axios
      .get(
        baseUrl +
          `/files/lawyer/advance-payment/${PARAM_PUBLIC}/slip_${dataDefault.reference_no}`
      )
      .then((response) => {
        console.log("ImageList", response.data);
        if (response.data.length > 0) {
          setFileTranferMoneyLoad(response.data);
          setLoading(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleUploadAllImage = async () => {
    const formData = new FormData();

    fileList?.forEach((file) => {
      formData.append("files", file);
    });
    setLoading(true);

    await axios
      .post(
        baseUrl +
          `/files/lawyer/advance-payment/${PARAM_PUBLIC}/receipt_${dataDefault.reference_no}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setFileList([]);
        setLoading(false);
      })
      .catch((err) => {
        Modal.error({
          title: "ผิดพลาด",
          content: err.message,
          centered: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUploadAllImageTranferMoney = async () => {
    const formData = new FormData();

    fileTranferMoney.forEach((file) => {
      formData.append("files", file);
    });
    setLoading(true);

    await axios
      .post(
        baseUrl +
          `/files/lawyer/advance-payment/${PARAM_PUBLIC}/slip_${dataDefault.reference_no}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setFileList([]);
        setLoading(false);
      })
      .catch((err) => {
        Modal.error({
          title: "ผิดพลาด",
          content: err.message,
          centered: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
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
          // file_path: values.imageReplyFile,
          pay_type_id: 4,
        };
      }
    });

    const checkData = dataset.filter((item) => item); // กรองค่า null, undefined, false ออก
    setdataSend.push(...checkData);
    if (fileList?.length > 0) {
      console.log("handleUploadAllImage");

      handleUploadAllImage();
      if (setdataSend.length < 1 || fileTranferMoney.length < 1) {
        handleCancel();
      }
    }
    if (fileTranferMoney.length > 0) {
      console.log("handleUploadAllImageTranferMoney");
      handleUploadAllImageTranferMoney();
      if (setdataSend.length < 1 || fileList?.length < 1) {
        handleCancel();
      }
    }
    if (setdataSend.length > 0) {
      sendData(setdataSend);
      console.log("dataSend", setdataSend);
    }
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

  // const handleInputChange = (value, contno, description, LAWSUIT_ID) => {
  //   console.log(value, contno, description, LAWSUIT_ID);
  //   checkItem(value);
  //   // อัปเดตค่าลงใน state
  //   setInputValues((prev) => ({
  //     ...prev,
  //     [contno]: {
  //       ...prev[contno],
  //       [description]: value,
  //       LAWSUIT_ID: LAWSUIT_ID,
  //     },
  //   }));
  // };

  const handleInputChange = (value, contno, description, LAWSUIT_ID) => {
    console.log(value, contno, description, LAWSUIT_ID);
    checkItem(value);

    // ✅ อัปเดตค่าที่ผู้ใช้กรอก
    setInputValues((prev) => {
      const updatedValues = {
        ...prev,
        [contno]: {
          ...prev[contno],
          [description]: value, // อัปเดตค่าใหม่
          LAWSUIT_ID: LAWSUIT_ID,
        },
      };

      // ✅ อัปเดตผลรวมใหม่ของสัญญานี้
      setTotalPay((prevTotal) => {
        const newTotal = dataDefault.expenseList
          .filter((item) => item.CONTNO === contno)
          .reduce(
            (sum, item) =>
              sum +
              (updatedValues[contno]?.[item.expense_name] ?? item.pay ?? 0),
            0
          );

        return {
          ...prevTotal,
          [contno]: newTotal, // อัปเดตค่าผลรวมใหม่
        };
      });

      return updatedValues;
    });
  };

  const props = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList?.indexOf(file);
      const newFileList = fileList?.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isLt5M = file.size / 1024 / 1024 < 5.1;

      if (!isLt5M) {
        message.error(`❌ ไฟล์ "${file.name}" มีขนาดเกิน 5 MB`);
        return false;
      }

      setFileList((prev) => [...prev, file]); // อัปเดตรายการไฟล์

      return false; // ป้องกันการอัปโหลดไฟล์อัตโนมัติ
    },

    fileList,
  };

  const propsMoney = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList?.indexOf(file);
      const newFileList = fileList?.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isLt5M = file.size / 1024 / 1024 < 5.1;

      if (!isLt5M) {
        message.error(`❌ ไฟล์ "${file.name}" มีขนาดเกิน 5 MB`);
        return false;
      }

      // ตรวจสอบประเภทของไฟล์
      const isImage = file.type.startsWith("image/");

      if (!isImage) {
        message.error("สามารถอัปโหลดได้เฉพาะไฟล์รูปภาพเท่านั้น");
        return false;
      } else if (fileList?.length >= 4) {
        message.error("เลือกไฟล์อัปโหลดได้ไม่เกิน 4 ไฟล์");
        return false;
      } else {
        setFileTranferMoney((prev) => [...prev, file]); // อัปเดตรายการไฟล์
      }

      return false; // ป้องกันการอัปโหลดไฟล์อัตโนมัติ
    },

    fileTranferMoney,
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
                                  item.expense_name,
                                  item.LAWSUIT_ID
                                )
                              }
                            />
                          </Form.Item>
                        </div>
                      ))}
                      <Form.Item label="รวม">
                        <InputNumber
                          suffix="บาท"
                          value={totalPay[data.CONTNO] ?? total} // ใช้ค่าใหม่ ถ้าไม่มีใช้ค่าเดิม
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          style={{
                            width: "80%",
                            color: "black",
                            fontWeight: "bold",
                          }}
                          disabled
                        />
                      </Form.Item>
                    </div>
                  );
                })}
                <Form.Item label="อัปโหลดใบเสร็จ" name="imageUrlFile">
                  <Dragger
                    {...props}
                    style={{
                      width: "300px", // กำหนดความกว้าง
                      height: "200px", // กำหนดความสูง
                      margin: "0 auto", // กำหนดให้อยู่ตรงกลาง
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ color: "blue" }} />
                    </p>
                    <p className="ant-upload-text">
                      กรุณาคลิกหรือลากเพื่อเลือกไฟล์
                    </p>
                    <p className="ant-upload-hint">
                      รองรับการอัปโหลดแบบเดี่ยวหรือแบบกลุ่ม
                    </p>
                  </Dragger>
                </Form.Item>
                {fileListLoad?.length > 0 ? (
                  <Form.Item label="ใบเสร็จ" name={"imageFile"}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "16px", // เพิ่มช่องว่างระหว่างแต่ละไฟล์
                        justifyContent: "center", // จัดให้อยู่ตรงกลาง
                      }}
                    >
                      <Image.PreviewGroup>
                        {fileListLoad?.map((image, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "8px", // ระยะห่างระหว่างไอคอนกับลิงก์
                              textAlign: "center",
                            }}
                          >
                            {image.url.includes("pdf") ? (
                              <>
                                <FilePdfOutlined
                                  style={{ fontSize: "40px", color: "red" }}
                                />
                                {image.url ? (
                                  <a
                                    style={{
                                      display: "block",
                                      marginTop: "8px",
                                    }}
                                    href={image.url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    คลิกเพื่อดาวน์โหลด
                                  </a>
                                ) : null}
                              </>
                            ) : image.url.includes(".xlsx") ? (
                              <>
                                <FileExcelOutlined
                                  style={{ fontSize: "40px", color: "green" }}
                                />
                                {image.url ? (
                                  <a
                                    style={{
                                      display: "block",
                                      marginTop: "8px",
                                    }}
                                    href={image.url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    คลิกเพื่อดาวน์โหลด
                                  </a>
                                ) : null}
                              </>
                            ) : image.url.includes(".docx") ? (
                              <>
                                <FileWordOutlined
                                  style={{ fontSize: "40px", color: "blue" }}
                                />
                                {image.url ? (
                                  <a
                                    style={{
                                      display: "block",
                                      marginTop: "8px",
                                    }}
                                    href={image.url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    คลิกเพื่อดาวน์โหลด
                                  </a>
                                ) : null}
                              </>
                            ) : (
                              <Image
                                src={image.url}
                                alt={`Captured ${index}`}
                                width="150px"
                              />
                            )}
                          </div>
                        ))}
                      </Image.PreviewGroup>
                    </div>
                  </Form.Item>
                ) : null}

                <Form.Item label="อัปโหลดสลิปโอนเงิน" name="imageUrlFile">
                  <Dragger
                    {...propsMoney}
                    style={{
                      width: "300px", // กำหนดความกว้าง
                      height: "200px", // กำหนดความสูง
                      margin: "0 auto", // กำหนดให้อยู่ตรงกลาง
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ color: "blue" }} />
                    </p>
                    <p className="ant-upload-text">
                      กรุณาคลิกหรือลากเพื่อเลือกไฟล์
                    </p>
                    <p className="ant-upload-hint">
                      รองรับการอัปโหลดแบบเดี่ยวหรือแบบกลุ่ม
                    </p>
                  </Dragger>
                </Form.Item>
                {fileTranferMoneyLoad.length > 0 ? (
                  <Form.Item label="สลิปโอนเงิน" name={"imageFile"}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "16px", // เพิ่มช่องว่างระหว่างแต่ละไฟล์
                        justifyContent: "center", // จัดให้อยู่ตรงกลาง
                      }}
                    >
                      <Image.PreviewGroup>
                        {fileTranferMoneyLoad?.map((image, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "8px", // ระยะห่างระหว่างไอคอนกับลิงก์
                              textAlign: "center",
                            }}
                          >
                            <Image
                              src={image.url}
                              alt={`Captured ${index}`}
                              width="150px"
                            />
                          </div>
                        ))}
                      </Image.PreviewGroup>
                    </div>
                  </Form.Item>
                ) : null}
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
                  {btnOn ||
                  fileList?.length > 0 ||
                  fileTranferMoney?.length > 0 ? (
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
export default ClearAdvanePaymentCourt;
