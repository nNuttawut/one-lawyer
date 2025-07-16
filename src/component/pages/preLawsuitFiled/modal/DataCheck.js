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
    let selectedArray = [];

    if (status === "all") {
      selectedArray = data.all;
    } else if (status === 1) {
      selectedArray = data.withBackCase;
    } else if (status === 2) {
      selectedArray = data.withRedCase;
    } else if (status === 3) {
      selectedArray = data.waitLawsuit;
    }

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
                    {status === "all" ? (
                      <Tag
                        color="#3357FF"
                        style={{ ...tagStyle, color: "#fff" }}
                      >
                        <InboxOutlined /> ทั้งหมด: {dataArr.length}
                      </Tag>
                    ) : status === 2 ? (
                      <Tag
                        color="#4DFF88"
                        style={{ ...tagStyle, color: "#000" }}
                      >
                        <CheckCircleOutlined /> พิพากษาแล้ว: {dataArr.length}
                      </Tag>
                    ) : status === 1 ? (
                      <Tag
                        color="#FFD699"
                        style={{ ...tagStyle, color: "#000" }}
                      >
                        <CalendarOutlined /> มีวันนัดศาล: {dataArr.length}
                      </Tag>
                    ) : status === 3 ? (
                      <Tag color="red" style={{ ...tagStyle, color: "#000" }}>
                        <CalendarOutlined /> รอฟ้อง: {dataArr.length}
                      </Tag>
                    ) : null}
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
                  <span>{item.CONTNO}</span>
                  <span>
                    {item.CUSTOMER_TNAME}
                    {item.CUSTOMER_FNAME} {item.CUSTOMER_LNAME || ""}
                  </span>
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
