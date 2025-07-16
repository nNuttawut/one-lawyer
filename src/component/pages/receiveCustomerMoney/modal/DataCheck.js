import React, { useState, useEffect } from "react";
import { Button, Modal, List, Row, Col, Tag } from "antd";
import {
  MailOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InboxOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import DateCustom from "../../../../hook/DateCustom";
import CurrencyFormat from "../../../../hook/CurrencyFormat";

const DataCheck = ({ open, close, data, status }) => {
  const [dataArr, setDataArr] = useState([]);
  const [convertDateThai, convertDateThaiShort] = DateCustom();
  const [
    currencyFormat,
    currencyFormatComma,
    currencyFormatPoint,
    currencyFormatNoPoint,
  ] = CurrencyFormat();

  useEffect(() => {
    if (data) {
      loadData();
    }
    console.log("dataFailed1111", data);
    console.log("status", status);
  }, []);

  const loadData = () => {
    let selectedArray = data.items;

    setDataArr(selectedArray);
  };

  const handleCancel = () => {
    close(false);
  };

  const tagStyle = {
    fontSize: "16px",
    padding: "10px 16px",
    borderRadius: "10px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "bold",
  };

  return (
    <>
      <Modal
        title="รายละเอียด"
        open={open}
        width={850}
        onCancel={handleCancel}
        footer={[
          <Button style={{ color: "red" }} onClick={handleCancel}>
            ปิด
          </Button>,
        ]}
      >
        <Row>
          <Col span={24} style={{ padding: "5px" }}>
            <List
              size="small"
              header={
                <>
                  <div
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "red",
                      marginBottom: "10px",
                    }}
                  >
                    <Tag color="#3357FF" style={{ ...tagStyle, color: "#fff" }}>
                      <InboxOutlined /> ยอดรวม:{" "}
                      {currencyFormatComma(data.totalAmount)}
                      {" บาท"}
                    </Tag>
                  </div>
                  {/* ✅ หัวตาราง */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      padding: "5px 10px",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    <span>เลขสัญญา</span>
                    <span>สถานะ</span>
                    <span>จำนวนรับ</span>
                    <span>วันที่รับชำระ</span>
                  </div>
                </>
              }
              bordered
              dataSource={dataArr}
              renderItem={(item) => (
                <List.Item
                  style={{ justifyContent: "space-between", color: "black" }}
                >
                  <span>{item.contno}</span>
                  <span>{item.type}</span>
                  <span>{currencyFormatPoint(item.amount)} บาท</span>
                  <span>{convertDateThaiShort(item.DATE)}</span>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default DataCheck;
