

import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'primereact/chart';
import leftArrorw from './left.png';
import rightArrorw from './right.png';


const DonutChart = () => {
  const scrollRef = useRef(null);

  const total = 100;
  const present = 75;
  const late = 5;
  const onLeave = 6;

  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    const absent = total - present - onLeave;

    const data = {
      labels: ['Present', 'Absent', 'On Leave', 'Late'],
      datasets: [
        {
          data: [present - late, absent, onLeave, late],
          backgroundColor: ['green', 'red', 'orange', 'yellow'],
          hoverBackgroundColor: ['green', 'red', 'orange', 'yellow'],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      animation: {
        duration: 1000,
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              const sum = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / sum) * 100).toFixed(1) + '%';
              return `${context.label}: ${percentage}`;
            },
          },
        },
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            padding: 15,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [present, total, late, onLeave]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-[775px] bg-white mt-[10px]">
        <div className='border-b-[#F0F0F0] border-b-3'>
            <h2 className='ml-[5px]'>Department wise Attendance</h2>
        </div>
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full"
        onClick={() => scroll('left')}
      >
        <img src={leftArrorw} height={15} width={15}/>
      </button>

      {/* Scrollable Chart Container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto px-5 py-6 "
      >
       <div className="flex gap-4 h-[240px] ">
             <div className="w-[225px] h-[225px] flex-shrink-0">
                 <h3 className='text-center text-[24px]'>Dept 1</h3>
                 <Chart
                 type="doughnut"
                 data={chartData}
                 options={chartOptions}
                 style={{ width: '100%', height: '100%' }}
                 /> 
             </div>
             <div className="w-[225px] h-[225px] flex-shrink-0">
                 <h3 className='text-center text-[24px]'>Dept 2</h3>
                 <Chart
                 type="doughnut"
                 data={chartData}
                 options={chartOptions}
                 style={{ width: '100%', height: '100%' }}
                 /> 
             </div>
             <div className="w-[225px] h-[225px] flex-shrink-0">
                 <h3 className='text-center text-[24px]'>Dept 3</h3>
                 <Chart
                 type="doughnut"
                 data={chartData}
                 options={chartOptions}
                 style={{ width: '100%', height: '100%' }}
                 /> 
             </div>
             <div className="w-[225px] h-[225px] flex-shrink-0">
                 <h3 className='text-center text-[24px]'>Dept 4</h3>
                 <Chart
                 type="doughnut"
                 data={chartData}
                 options={chartOptions}
                 style={{ width: '100%', height: '100%' }}
                 /> 
             </div>
         </div>
      </div>

      {/* Right Arrow */}
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full"
        onClick={() => scroll('right')}
      >
        <img src={rightArrorw} height={15} width={15}/>
      </button>
    </div>
  );
};

export default DonutChart;

