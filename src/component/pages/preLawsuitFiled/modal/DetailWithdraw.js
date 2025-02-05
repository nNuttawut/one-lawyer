import { Button, Form, Modal, Card, Spin, message, Divider } from "antd";

import { useEffect, useState } from "react";
import TokenCheck from "../../../../hook/TokenCheck";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";
import { ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Timeline } from "antd";

const DetailWithdraw = ({ open, close, dataDefault }) => {
  const [convertDateThai] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();
  const [loading, setLoading] = useState(false);
  const [dataRender, setDataRender] = useState([]);
  const [icons, setIcons] = useState({});

  const handleCancel = () => {
    console.log("Clicked cancel button");
    close(false);
  };

  useEffect(() => {
    if (dataDefault) {
      renderDataDetail(dataDefault);
      console.log(dataDefault);
      setDataIcons();
    }
  }, []);

  const setDataIcons = () => {
    setIcons({
      withdraw_datetime: dataDefault.withdraw_datetime
        ? () => <CheckCircleOutlined />
        : () => <ClockCircleOutlined />,
      pay_datetime: dataDefault.pay_datetime
        ? () => <CheckCircleOutlined />
        : () => <ClockCircleOutlined />,
      pay_type_id: dataDefault.pay_type_id
        ? () => <CheckCircleOutlined />
        : () => <ClockCircleOutlined />,
    });
  };

  console.log(icons);

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
        description: item.expense_description,
        amount: item.withdraw,
        expense_type_id: item.expense_type_id,
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

  if (dataRender) {
    return (
      <>
        <Modal
          title="ข้อมูลขอเบิกเงินทดลอง"
          open={open}
          onCancel={handleCancel}
          width={650}
          footer={null}
        >
          <Spin spinning={loading} size="large" tip=" Loading... ">
            <Card>
              <Timeline
                mode="alternate"
                items={[
                  {
                    dot: (
                      <CheckCircleOutlined
                        style={{
                          fontSize: "16px",
                        }}
                      />
                    ),
                    color:
                      dataDefault.withdraw_process_id === 4
                        ? "blue"
                        : dataDefault.withdraw_process_id === 3
                        ? "green"
                        : "red",

                    children: (
                      <div>
                        ขอเบิกเงินทดลอง <br />
                        {convertDateThai(dataDefault.created_date)}
                      </div>
                    ),
                  },
                  {
                    dot: (
                      <span
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        {icons.withdraw_datetime && icons.withdraw_datetime()}
                      </span>
                    ),
                    color:
                      dataDefault.withdraw_process_id === 4
                        ? "blue"
                        : dataDefault.withdraw_process_id === 3
                        ? "green"
                        : "red",

                    children: (
                      <div>
                        อนุมัติเบิกเงินทดลอง <br />
                        {dataDefault.withdraw_datetime
                          ? convertDateThai(dataDefault.withdraw_datetime)
                          : null}
                      </div>
                    ),
                  },
                  {
                    dot: (
                      <span
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        {icons.pay_datetime && icons.pay_datetime()}
                      </span>
                    ),
                    color: dataDefault.pay_type_id ? "green" : "blue",
                    children: (
                      <div>
                        เคลียร์เงินทดลอง <br />
                        {dataDefault.pay_datetime
                          ? convertDateThai(dataDefault.pay_datetime)
                          : null}
                      </div>
                    ),
                  },
                  {
                    dot: (
                      <span
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        {icons.pay_type_id && icons.pay_type_id()}
                      </span>
                    ),
                    color: dataDefault.pay_type_id ? "green" : "blue",

                    children: "สำเร็จ",
                  },
                ]}
              />
              <Form
                labelCol={{
                  span: 12,
                }}
                wrapperCol={{
                  span: 24,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 600,
                }}
              >
                {dataRender?.map((data, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "20px",
                      border: "1px solid #ccc",
                      padding: "10px",
                    }}
                  >
                    {/* แสดงข้อมูลของสัญญา */}
                    <Form.Item label="สัญญา">{data.CONTNO}</Form.Item>
                    {/* วนลูปข้อมูลใน expenses */}
                    {data.expenses?.map((item, expenseIndex) => (
                      <div key={expenseIndex} style={{ paddingLeft: "20px" }}>
                        <Form.Item label={item.description}>
                          {`${currencyFormatPoint(item.amount)} บาท`}
                        </Form.Item>
                      </div>
                    ))}
                  </div>
                ))}
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
  }
};
export default DetailWithdraw;
