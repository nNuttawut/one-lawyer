import React, { useState, useRef, useEffect } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);
const PieChartComponent = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      series: [
        {
          name: "Access From",
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
              fontSize: 40,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: "เตรียมส่งฟ้อง" },
            { value: 735, name: "สืบทรัพย์สำเร็จ" },
            { value: 580, name: "ส่งบังคับคดี" },
            { value: 484, name: "เจรจาหนี้" },
            { value: 300, name: "ประกาศขายทรัพย์" },
            { value: 580, name: "ประนอมหนี้" },
          ],
        },
      ],
    };

    myChart.setOption(option);

    // Cleanup on component unmount
    return () => {
      myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ height: 400, width: "100%" }} />;
};

export default PieChartComponent;
