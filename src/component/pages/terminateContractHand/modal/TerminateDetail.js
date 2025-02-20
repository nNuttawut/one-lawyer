import { Button, Form, Modal, Card, Spin, message } from "antd";
import { useState } from "react";
import TokenCheck from "../../../../hook/TokenCheck";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";

const TerminateDetail = ({ open, close, dataDefault }) => {
  const [convertDateThai] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

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
                {`${dataDefault?.parcel_list[0].overdue_installment_count} งวด`}
              </Form.Item>
              <Form.Item label="ยอดเงินค้าง" name="overdue">
                {`${currencyFormatPoint(
                  dataDefault?.parcel_list[0].overdue_installment_amount
                )} บาท`}
              </Form.Item>
              <Form.Item label="ค่าติดตาม" name="follow">
                {`${currencyFormatComma(
                  dataDefault?.parcel_list[0].dept_collection_fees
                )} บาท`}
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
                  <Form.Item label="หมายเลข EMS" name="ems">
                    {parcel.parcel_no}
                  </Form.Item>
                  <Form.Item label="การตอบกลับ" name="radioCus">
                    {parcel.status === 1
                      ? "ใบตอบกลับ"
                      : parcel.status === 2
                      ? "เว็บไปรษณย์"
                      : "ยังไม่ตอบกลับ"}
                  </Form.Item>
                  <Form.Item label="ลิ้งค์เก็บรูปตอบกลับ" name="imageReplyFile">
                    {parcel.url_path}
                  </Form.Item>
                </div>
              ))}

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

                {/* <Button style={{ color: "green" }} htmlType="submit">
                  บันทึก
                </Button> */}
              </div>
            </Form>
          </Card>
        </Spin>
      </Modal>
    </>
  );
};
export default TerminateDetail;
