import React, { useRef, useEffect } from "react";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

// Register required components
echarts.use([GridComponent, BarChart, CanvasRenderer]);

const BarChartComponent = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Ensure the DOM element is available
    const chartDom = chartRef.current;
    if (!chartDom) return;

    // Initialize the chart
    const myChart = echarts.init(chartDom);

    // Set the options for the chart
    const option = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar",
        },
      ],
    };

    myChart.setOption(option);

    // Cleanup on component unmount
    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ height: 400, width: "100%" }} // Adjust size as needed
    />
  );
};

export default BarChartComponent;
