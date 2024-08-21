import React, { useState } from "react";
import { Card, Col, DatePicker, Flex, Progress, Row, Space } from "antd";
import BarChartComponent from "./components/BarChartComponent";
import PieChartComponent from "./components/PieChartComponent";

export default function Main() {
  const [debtor, setDebtor] = useState(100);
  const [preLawsuitFiled, setPreLawsuitFiled] = useState(3);
  const [investigateAssets, setInvestigateAssets] = useState(5);
  const [sendToEnforcement, setSendToEnforcement] = useState(10);
  const [negotiate, setNegotiate] = useState(15);
  const [saleAnnouncement, setSaleAnnouncement] = useState(20);
  const [debtPayment, setDebPayment] = useState(30);
  const { RangePicker } = DatePicker;

  return (
    <>
      <Col span={"24"} style={{ textAlign: "end" }}>
        <Space direction="vertical" size={12}>
          <RangePicker size="large" style={{ marginRight: "10px" }} />
        </Space>
      </Col>
      <Row>
        <Col span={24}>
          <Card style={{ margin: "5px" }}>
            <PieChartComponent />
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ margin: "5px" }}>
            <Flex gap="small" vertical>
              <b>ลูกหนี้มีปัญหา {debtor} เคส</b>
              <Progress percent={30} />
              <b>เตรียมส่งฟ้อง {preLawsuitFiled} เคส</b>
              <Progress percent={50} />
              <b>สืบทรัพย์ลูกหนี้ {investigateAssets} เคส</b>
              <Progress percent={70} />
              <b>ส่งบังคับคดี {sendToEnforcement} เคส</b>
              <Progress percent={100} />
              <b>เจรจาหนี้ {negotiate} เคส</b>
              <Progress percent={50} />
              <b>ประกาศขายทรัพย์ {saleAnnouncement} เคส</b>
              <Progress percent={50} />
              <b>ชำระหนี้/ประนอมหนี้ {debtPayment} เคส</b>
              <Progress percent={50} />
            </Flex>
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ margin: "5px" }}>
            <Flex align="center" wrap gap={20}>
              <Progress
                type="circle"
                percent={75}
                format={(percent) => `${percent} Days`}
              />
              <Progress type="circle" percent={100} format={() => "Done"} />
              <Progress
                type="circle"
                percent={75}
                format={(percent) => `${percent} Days`}
              />
              <Progress type="circle" percent={100} format={() => "Done"} />
            </Flex>

            <BarChartComponent />
          </Card>
        </Col>
      </Row>
    </>
  );
}
