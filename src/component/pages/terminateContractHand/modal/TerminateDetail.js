import { Button, Form, Modal, Card, Spin, message, Image } from "antd";
import { useEffect, useState } from "react";
import TokenCheck from "../../../../hook/TokenCheck";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import axios from "axios";
import { baseUrl } from "../../../API/apiUrls";
import { PARAM_PUBLIC } from "../../../../utils/constant/StatusConstant";
import {
  InboxOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

const TerminateDetail = ({ open, close, dataDefault }) => {
  const [convertDateThai] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState([]);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  useEffect(() => {
    loadImagesProduct();

    console.log("loadData", dataDefault);
  }, []);

  const onFinish = (values) => {
    console.log("Success:", values);
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

  const loadImagesProduct = async () => {
    setLoading(true);

    try {
      // ใช้ Promise.all() เพื่อรอทุก request เสร็จ
      const responses = await Promise.all(
        dataDefault.parcel_list.map((parcel) =>
          axios.get(
            `${baseUrl}/files/lawyer/cancel_contract/${PARAM_PUBLIC}/${dataDefault.contract_no}${parcel.parcel_no_response}`
          )
        )
      );

      // รวมค่าทั้งหมดจาก API response
      const allImages = responses.flatMap((res) => res.data);

      console.log("ImageList", allImages);
      setImageList(allImages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="รายละเอียดบอกเลิกสัญญา(มือ)"
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
              style={{
                maxWidth: 600,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item label="เลขสัญญา">{dataDefault?.contract_no}</Form.Item>
              <Form.Item label="ประเภทสัญญา">
                {renderType(dataDefault?.parcel_list[0]?.contract_schema)}
              </Form.Item>
              <Form.Item label="ประเภทจ่าย">
                {renderType(dataDefault?.parcel_list[0].pay_type)}
              </Form.Item>
              <Form.Item label="ประเภทบัญชี">
                {dataDefault?.parcel_list[0].account_type}
              </Form.Item>

              <Form.Item label="วันที่ออกหนังสือ" name="datetime">
                {convertDateThai(dataDefault?.parcel_list[0].datetime)}
              </Form.Item>
              <Form.Item label="รายละเอียดรถ" name="carDetail">
                {`${dataDefault?.parcel_list[0].brand} ${dataDefault?.parcel_list[0].register_no}`}
              </Form.Item>
              <Form.Item label="ค้างงวด" name="overdue">
                {dataDefault?.parcel_list[0].overdue_installment_count
                  ? `${dataDefault?.parcel_list[0].overdue_installment_count} งวด`
                  : "-"}
              </Form.Item>
              <Form.Item label="ยอดเงินค้าง" name="overdue">
                {dataDefault?.parcel_list[0]?.overdue_installment_amount
                  ? `${currencyFormatPoint(
                      dataDefault?.parcel_list[0].overdue_installment_amount
                    )} บาท`
                  : "-"}
              </Form.Item>
              <Form.Item label="ค่าติดตาม" name="follow">
                {dataDefault?.parcel_list[0]?.dept_collection_fees
                  ? `${currencyFormatPoint(
                      dataDefault?.parcel_list[0]?.dept_collection_fees
                    )} บาท`
                  : "-"}
              </Form.Item>

              {dataDefault.parcel_list?.map((parcel, index) => (
                <div key={index}>
                  <Form.Item label="ผู้ทำสัญญา" name="cusId">
                    {`${parcel.customer_fullname} ${
                      parcel.customer_type_id === 0
                        ? "(ผู้เช่าซื้อ)"
                        : `(ผู้ค้ำที่ ${parcel.customer_type_id})`
                    }`}
                  </Form.Item>

                  <Form.Item label="จดหมาย EMS" name="ems">
                    {parcel.parcel_no}
                  </Form.Item>
                  <Form.Item label="ใบตอบกลับ EMS" name="ems">
                    {parcel.parcel_no_response}
                  </Form.Item>
                  <Form.Item label="การตอบกลับ" name="radioCus">
                    {parcel.status === 1
                      ? "ใบตอบกลับ"
                      : parcel.status === 2
                      ? "เว็บไปรษณย์"
                      : parcel.status === 3
                      ? "ตีกลับ"
                      : "ยังไม่ตอบกลับ"}
                  </Form.Item>
                </div>
              ))}

              {imageList.length > 0 ? (
                <Form.Item label="ไฟล์/ภาพที่บันทึก" name={"imageFile"}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px", // เพิ่มช่องว่างระหว่างแต่ละไฟล์
                      justifyContent: "center", // จัดให้อยู่ตรงกลาง
                    }}
                  >
                    <Image.PreviewGroup>
                      {imageList?.map((image, index) => (
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
                                style={{
                                  fontSize: "40px",
                                  color: "green",
                                }}
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
                                style={{
                                  fontSize: "40px",
                                  color: "blue",
                                }}
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
              </div>
            </Form>
          </Card>
        </Spin>
      </Modal>
    </>
  );
};
export default TerminateDetail;
