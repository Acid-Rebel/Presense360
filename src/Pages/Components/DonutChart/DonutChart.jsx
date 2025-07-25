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
    const absent = total - present - onLeave; // Corrected calculation for absent

    const data = {
      labels: ['Present', 'Absent', 'On Leave', 'Late'],
      datasets: [
        {
          data: [present - late, absent, onLeave, late],
          backgroundColor: ['#22C55E', '#EF4444', '#F97316', '#FACC15'], // Tailwind colors for consistency
          hoverBackgroundColor: ['#22C55E', '#EF4444', '#F97316', '#FACC15'],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false, // Essential for charts to fill their parent div
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
            // You can make legend labels responsive too if needed
            // font: {
            //   size: 12 // Default font size for legend
            // }
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [present, total, late, onLeave]);

  
  const getScrollAmount = () => {
    if (window.innerWidth < 640) return 208; 
    if (window.innerWidth < 768) return 208; 
    return 240; 
  };


  const scroll = (direction) => {
    if (scrollRef.current) {
        const scrollStep = getScrollAmount();
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollStep : scrollStep,
            behavior: 'smooth',
        });
    }
  };

  return (
    <div className="relative w-full bg-white mt-4 rounded-lg shadow-md"> 
        <div className='border-b-2 border-gray-200 py-3 px-4'> 
            <h2 className='text-lg md:text-xl font-semibold text-gray-800'>Department wise Attendance</h2>
        </div>

        
        <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hidden sm:block" 
            onClick={() => scroll('left')}
        >
            <img src={leftArrorw} className="h-4 w-4" alt="Scroll Left"/> 
        </button>
        <div
            ref={scrollRef}
            className="overflow-x-auto px-4 py-6 scrollbar-hide" >
           
            <div className="flex flex-nowrap gap-4 h-60"> 
                <div className="w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0"> 
                    <h3 className='text-center text-base md:text-lg font-medium text-gray-700'>Dept 1</h3> 
                    <Chart
                        type="doughnut"
                        data={chartData}
                        options={chartOptions}
                        style={{ width: '100%', height: '100%' }} 
                    />
                </div>
                <div className="w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0">
                    <h3 className='text-center text-base md:text-lg font-medium text-gray-700'>Dept 2</h3>
                    <Chart
                        type="doughnut"
                        data={chartData}
                        options={chartOptions}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
                <div className="w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0">
                    <h3 className='text-center text-base md:text-lg font-medium text-gray-700'>Dept 3</h3>
                    <Chart
                        type="doughnut"
                        data={chartData}
                        options={chartOptions}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
                <div className="w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0">
                    <h3 className='text-center text-base md:text-lg font-medium text-gray-700'>Dept 4</h3>
                    <Chart
                        type="doughnut"
                        data={chartData}
                        options={chartOptions}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>
        </div>

       
        <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hidden sm:block" 
            onClick={() => scroll('right')}
        >
            <img src={rightArrorw} className="h-4 w-4" alt="Scroll Right"/>
        </button>
    </div>
  );
};

export default DonutChart;