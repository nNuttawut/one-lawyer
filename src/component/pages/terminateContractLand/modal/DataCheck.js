import React, { useState, useEffect } from "react";
import { Button, Modal, List, Row, Col, Tag } from "antd";
import {
  MailOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import DateCustom from "../../../../hook/DateCustom";

const DataCheck = ({ open, close, data, status }) => {
  const [dataArr, setDataArr] = useState([]);
  const [convertDateThai, convertDateThaiShort] = DateCustom();

  useEffect(() => {
    if (data) {
      loadData();
    }
    console.log("dataFailed1111", data);
    console.log("status", status);
  }, []);

  const loadData = () => {
    const dataFilter = data.filter((item) =>
      status !== "all" ? item.status === status : true
    );
    setDataArr(dataFilter);
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
                    {status === "all" ? (
                      <Tag
                        color="#3357FF"
                        style={{ ...tagStyle, color: "#fff" }}
                      >
                        <InboxOutlined /> ทั้งหมด: {dataArr.length}
                      </Tag>
                    ) : status === 1 ? (
                      <Tag
                        color="#4DFF88"
                        style={{ ...tagStyle, color: "#000" }}
                      >
                        <CheckCircleOutlined /> ใบตอบกลับ: {dataArr.length}
                      </Tag>
                    ) : status === 2 ? (
                      <Tag
                        color="#FFFF99"
                        style={{ ...tagStyle, color: "#000" }}
                      >
                        <MailOutlined /> เว็บไปรษณีย์: {dataArr.length}
                      </Tag>
                    ) : status === 3 ? (
                      <Tag
                        color="#FFD699"
                        style={{ ...tagStyle, color: "#000" }}
                      >
                        <WarningOutlined /> ตีกลับ: {dataArr.length}
                      </Tag>
                    ) : (
                      <Tag color="#FF4D4F" style={{ ...tagStyle }}>
                        <WarningOutlined /> ยังไม่ตอบกลับ: {dataArr.length}
                      </Tag>
                    )}
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
                    <span>ชื่อลูกค้า</span>
                    <span>ข้อมูล</span>
                    <span>วันที่นำเข้า</span>
                  </div>
                </>
              }
              bordered
              dataSource={dataArr}
              renderItem={(item) => (
                <List.Item
                  style={{ justifyContent: "space-between", color: "black" }}
                >
                  <span>{item.contract_no}</span>
                  <span>{item.customer_fullname}</span>
                  <span>
                    {item.brand} {item.register_no}
                  </span>
                  <span>{convertDateThaiShort(item.created_date)}</span>
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
