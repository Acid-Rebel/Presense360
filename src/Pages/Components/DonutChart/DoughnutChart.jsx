import React, { useEffect, useRef } from 'react';
import { Chart } from 'primereact/chart';

const DoughnutChart = ({ data, options, style }) => {
  const chartRef = useRef(null);

  const defaultData = {
    labels: ['A', 'B', 'C'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 0,
      },
    ],
  };

  const defaultOptions = {
    plugins: {
      legend: {
        labels: { color: '#495057' },
      },
      tooltip: {
        enabled: true,
      },
    },
    cutout: '75%',
    responsive: true,
    animation: {
      duration: 500,
    },
  };

  // Update chart data without remounting
  useEffect(() => {
    const chart = chartRef.current?.chart;
    if (chart && data) {
      chart.data.datasets = data.datasets;
      chart.data.labels = data.labels;
      chart.options = options || defaultOptions;
      chart.update();
    }
  }, [data, options]);

  return (
    
  
    <Chart
      ref={chartRef}
      type="doughnut"
      data={data || defaultData}
      options={options || defaultOptions}
      style={{ width: '100%', height: '100%' }}
    />
  
);

};

export default DoughnutChart;
