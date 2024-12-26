import React, { useState, useRef, useEffect } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

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
} from "../../../../utils/constant/StatusConstant";
import WorkInProgress from "../../../../hook/WorkInProgress";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);
const PieChartComponent = () => {
  const chartRef = useRef(null);
  const [dataPie, setDataPie] = useState({
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

  useEffect(() => {
    setLoadingDataWork(true);
  }, []);

  useEffect(() => {
    if (dataLoad) {
      filterData();
    }
  }, [dataLoad]);

  const filterData = () => {
    if (Array.isArray(dataLoad)) {
      const newDataPie = { ...dataPie };

      newDataPie.assign = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === null
      ).length;
      newDataPie.notice = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === NOTICE
      ).length;
      newDataPie.indict = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === INDICT
      ).length;
      newDataPie.awaitingJudgement = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === AWAITING_JUDMENT
      ).length;
      newDataPie.judgement = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === JUDGEMENT
      ).length;
      newDataPie.payment = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === PAYMENT
      ).length;
      newDataPie.caseInFinal = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === CASE_IS_FINAL
      ).length;
      newDataPie.investigate = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === INVESTIGATE
      ).length;
      newDataPie.enforcement = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === ENFORCEMENT
      ).length;
      newDataPie.negotiate = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === NEGOTIATE
      ).length;
      newDataPie.sellAssets = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === SELL_ASSETS
      ).length;
      newDataPie.finish = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === FINISH
      ).length;
      newDataPie.badDebtor = dataLoad.filter(
        (item) => item.MAIN_STATUS_ID === BAD_DEBTOR
      ).length;
      setDataPie(newDataPie);
    } else {
      console.error("data is not an array or is undefined");
    }
  };

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "0.5%",
        left: "center",
      },
      series: [
        {
          name: "กราฟบอกจำนวนเคส",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: dataPie.assign, name: "เตรียมมอบงานให้ทนาย" },
            { value: dataPie.notice, name: "ส่งจดหมายเตือน" },
            { value: dataPie.indict, name: "ส่งคำฟ้อง" },
            { value: dataPie.awaitingJudgement, name: "รอพิพากษา" },
            { value: dataPie.judgement, name: "พิพากษา" },
            { value: dataPie.payment, name: "ทำยอม" },
            { value: dataPie.caseInFinal, name: "คดีถึงที่สุด" },
            { value: dataPie.investigate, name: "สืบทรัพย์" },
            { value: dataPie.enforcement, name: "บังคับคดี" },
            { value: dataPie.negotiate, name: "เจรจาทรัพย์" },
            { value: dataPie.sellAssets, name: "ขายทรัพย์" },
            { value: dataPie.finish, name: "คดีสิ้นสุด" },
            { value: dataPie.badDebtor, name: "ลูกหนี้สูญ" },
          ],
        },
      ],
    };

    myChart.setOption(option);

    // Cleanup on component unmount
    return () => {
      myChart.dispose();
    };
  }, [dataPie]);

  return <div ref={chartRef} style={{ height: 400, width: "100%" }} />;
};

export default PieChartComponent;
