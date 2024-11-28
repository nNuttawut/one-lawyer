import React, { useEffect, useState } from "react";
import { Card, Col, DatePicker, Flex, Progress, Row, Space } from "antd";
import BarChartComponent from "./components/BarChartComponent";
import PieChartComponent from "./components/PieChartComponent";
import MotionHoc from "../../../utils/MotionHoc";
import WorkInProgress from "../../../hook/WorkInProgress";
import {
  AWAITING_JUDMENT,
  BAD_DEBTOR,
  CASE_IS_FINAL,
  ENFORCEMENT,
  FINISH,
  INDICT,
  INVESTIGATE,
  JUDGEMENT,
  NEGOTIATE,
  NOTICE,
  PAYMENT,
  SELL_ASSETS,
} from "../../../utils/constant/StatusConstant";

const Main = () => {
  const [dataCount, setDataCount] = useState({
    assign: 0,
    notice: 0,
    indict: 0,
    awaitingJudgement: 0,
    judgement: 0,
    payment: 0,
    caseInFinal: 0,
    investigate: 0,
    enforcement: 0,
    negotiate: 0,
    sellAssets: 0,
    finish: 0,
    badDebtor: 0,
  });
  const [dataPercent, setDataPercent] = useState({
    assign: 0,
    notice: 0,
    indict: 0,
    awaitingJudgement: 0,
    judgement: 0,
    payment: 0,
    caseInFinal: 0,
    investigate: 0,
    enforcement: 0,
    negotiate: 0,
    sellAssets: 0,
    finish: 0,
    badDebtor: 0,
  });
  const [dataLoad, setLoadingDataWork] = WorkInProgress();
  const [dataLength, setDataLength] = useState(0);
  const { RangePicker } = DatePicker;

  useEffect(() => {
    setLoadingDataWork(true);
  }, []);

  useEffect(() => {
    if (dataLoad) {
      filterData();
      setDataLength(dataLoad.length);
    }
  }, [dataLoad]);

  const filterData = () => {
    if (Array.isArray(dataLoad)) {
      const newDataCount = { ...dataCount };
      const newDataPercent = { ...dataPercent };

      newDataCount.assign = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === null
      ).length;
      newDataCount.notice = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === NOTICE
      ).length;
      newDataCount.indict = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === INDICT
      ).length;
      newDataCount.awaitingJudgement = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === AWAITING_JUDMENT
      ).length;
      newDataCount.judgement = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === JUDGEMENT
      ).length;
      newDataCount.payment = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === PAYMENT
      ).length;
      newDataCount.caseInFinal = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === CASE_IS_FINAL
      ).length;
      newDataCount.investigate = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === INVESTIGATE
      ).length;
      newDataCount.enforcement = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === ENFORCEMENT
      ).length;
      newDataCount.negotiate = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === NEGOTIATE
      ).length;
      newDataCount.sellAssets = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === SELL_ASSETS
      ).length;
      newDataCount.finish = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === FINISH
      ).length;
      newDataCount.badDebtor = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === BAD_DEBTOR
      ).length;
      setDataCount(newDataCount);

      newDataPercent.assign = (newDataCount.assign / dataLoad.length) * 100;
      newDataPercent.notice = (newDataCount.notice / dataLoad.length) * 100;
      newDataPercent.indict = (newDataCount.indict / dataLoad.length) * 100;
      newDataPercent.awaitingJudgement =
        (newDataCount.awaitingJudgement / dataLoad.length) * 100;
      newDataPercent.judgement =
        (newDataCount.judgement / dataLoad.length) * 100;
      newDataPercent.payment = (newDataCount.payment / dataLoad.length) * 100;
      newDataPercent.caseInFinal =
        (newDataCount.caseInFinal / dataLoad.length) * 100;
      newDataPercent.investigate =
        (newDataCount.investigate / dataLoad.length) * 100;
      newDataPercent.enforcement =
        (newDataCount.enforcement / dataLoad.length) * 100;
      newDataPercent.negotiate =
        (newDataCount.negotiate / dataLoad.length) * 100;
      newDataPercent.sellAssets =
        (newDataCount.sellAssets / dataLoad.length) * 100;
      newDataPercent.finish = (newDataCount.finish / dataLoad.length) * 100;
      newDataPercent.badDebtor =
        (newDataCount.badDebtor / dataLoad.length) * 100;
      setDataPercent(newDataPercent);
    } else {
      console.error("data is not an array or is undefined");
    }
  };

  return (
    <>
      {/* <Col span={"24"} style={{ textAlign: "end" }}>
        <Space direction="vertical" size={12}>
          <RangePicker size="large" style={{ marginRight: "10px" }} />
        </Space>
      </Col> */}
      <Row>
        <Col span={24}>
          <Card style={{ margin: "5px" }}>
            <PieChartComponent />
          </Card>
        </Col>
        <Col span={24}>
          <Card style={{ margin: "5px", textAlign: "center" }}>
            <Flex gap="small" vertical>
              <b style={{ fontSize: "140%", marginBottom: "2%" }}>
                เปอร์เซ็นต์ความคืบหน้างาน
              </b>
              <b>
                เตรียมมอบงานให้ทนาย {dataCount.assign}/{dataLength} เคส
              </b>
              <Progress
                percent={
                  !dataPercent.assign ? 0 : dataPercent.assign.toFixed(2)
                }
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={["70%", 30]}
              />
              <b style={{ marginTop: "1%" }}>
                ส่งจดหมายเตือน {dataCount.notice}/{dataLength} เคส
              </b>
              <Progress
                percent={
                  !dataPercent.notice ? 0 : dataPercent.notice.toFixed(2)
                }
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={["70%", 30]}
              />
              <b style={{ marginTop: "1%" }}>
                ส่งคำฟ้อง {dataCount.indict}/{dataLength} เคส
              </b>
              <Progress
                percent={
                  !dataPercent.indict ? 0 : dataPercent.indict.toFixed(2)
                }
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={["70%", 30]}
              />
              <b style={{ marginTop: "1%" }}>
                รอพิพากษา {dataCount.awaitingJudgement}/{dataLength} เคส
              </b>
              <Progress
                percent={
                  !dataPercent.awaitingJudgement
                    ? 0
                    : dataPercent.awaitingJudgement.toFixed(2)
                }
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={["70%", 30]}
              />
              <b style={{ marginTop: "1%" }}>
                พิพากษา {dataCount.judgement}/{dataLength} เคส
              </b>
              <Progress
                percent={
                  !dataPercent.judgement ? 0 : dataPercent.judgement.toFixed(2)
                }
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={["70%", 30]}
              />
              <b style={{ marginTop: "1%" }}>
                ทำยอม {dataCount.payment}/{dataLength} เคส
              </b>
              <Progress
                percent={
                  !dataPercent.payment ? 0 : dataPercent.payment.toFixed(2)
                }
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={["70%", 30]}
              />
              <b style={{ marginTop: "1%" }}>
                คดีถึงที่สุด {dataCount.caseInFinal}/{dataLength} เคส
              </b>
              <Progress
                percent={
                  !dataPercent.caseInFinal
                    ? 0
                    : dataPercent.caseInFinal.toFixed(2)
                }
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={["70%", 30]}
              />
              <b style={{ marginTop: "1%" }}>
                สืบทรัพย์หลังฟ้อง {dataCount.investigate}/{dataLength} เคส
              </b>
              <Progress
                percent={
                  !dataPercent.investigate
                    ? 0
                    : dataPercent.investigate.toFixed(2)
                }
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={["70%", 30]}
              />
              <b style={{ marginTop: "1%" }}>
                บังคับคดี {dataCount.judgement}/{dataLength} เคส
              </b>
              <Progress
                percent={
                  !dataPercent.judgement ? 0 : dataPercent.judgement.toFixed(2)
                }
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={["70%", 30]}
              />
              <b style={{ marginTop: "1%" }}>
                เจรจาทรัพย์ {dataCount.negotiate}/{dataLength} เคส
              </b>
              <Progress
                percent={
                  !dataPercent.negotiate ? 0 : dataPercent.negotiate.toFixed(2)
                }
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={["70%", 30]}
              />
              <b style={{ marginTop: "1%" }}>
                ขายทรัพย์ {dataCount.sellAssets}/{dataLength} เคส
              </b>
              <Progress
                percent={
                  !dataPercent.sellAssets
                    ? 0
                    : dataPercent.sellAssets.toFixed(2)
                }
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={["70%", 30]}
              />
              <b style={{ marginTop: "1%" }}>
                คดีสิ้นสุด {dataCount.finish}/{dataLength} เคส
              </b>
              <Progress
                percent={
                  !dataPercent.finish ? 0 : dataPercent.finish.toFixed(2)
                }
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={["70%", 30]}
              />
            </Flex>
          </Card>
        </Col>
        {/* <Col span={12}> */}
        {/* <Card style={{ margin: "5px" }}>
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
          </Card> */}
        {/* </Col> */}
      </Row>
    </>
  );
};
const Dashboard = MotionHoc(Main);

export default Dashboard;
