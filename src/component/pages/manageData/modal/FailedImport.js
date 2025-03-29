import React, { useState, useEffect } from "react";
import { Button, Modal, List, Row, Col } from "antd";

const FailedImport = ({ open, close, dataFailed, dataMiss, dataDuplicate }) => {
  const [failedList, setFailedList] = useState([]);
  const [missList, setMissList] = useState([]);
  const [duplicateList, setDuplicateList] = useState([]);

  useEffect(() => {
    setFailedList(dataFailed);
    setMissList(dataMiss);
    setDuplicateList(dataDuplicate);
    console.log("dataFailed1111", dataFailed);
    console.log("dataMiss1111", dataMiss);
    console.log("dataDuplicate1111", dataDuplicate);
  });

  const handleCancel = () => {
    close(false);
  };

  return (
    <>
      <Modal
        title="นำเข้าไม่สำเร็จ"
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
          <Col span={8} style={{ padding: "5px" }}>
            <List
              size="small"
              header={
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "orange",
                  }}
                >
                  ⚠️ เลขสัญญาที่ค้นหาไม่เจอ
                </div>
              }
              bordered
              dataSource={missList}
              renderItem={(item) => (
                <List.Item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "orange",
                    width: "100%",
                  }}
                >
                  {item}
                </List.Item>
              )}
            />
          </Col>

          <Col span={8} style={{ padding: "5px" }}>
            <List
              size="small"
              header={
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  ❌ เลขสัญญาที่นำเข้าไม่สำเร็จ
                </div>
              }
              bordered
              dataSource={failedList}
              renderItem={(item) => (
                <List.Item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "red",
                    width: "100%",
                  }}
                >
                  {item}
                </List.Item>
              )}
            />
          </Col>

          <Col span={8} style={{ padding: "5px" }}>
            <List
              size="small"
              header={
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "blue",
                  }}
                >
                  🔄 เลขสัญญาที่ซ้ำในระบบ
                </div>
              }
              bordered
              dataSource={duplicateList}
              renderItem={(item) => (
                <List.Item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "blue",
                    width: "100%",
                  }}
                >
                  {item}
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default FailedImport;
