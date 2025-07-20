import {useState,useEffect,useMemo} from 'react';
import HeaderSideNav from "./Components/Header/HeaderSideNav.jsx"
import ProgressCircle from "./Components/ProgressCircle/ProgressCircle.jsx"
import DoughnutChart from './Components/DonutChart/DoughnutChart.jsx';
function Dashboard() {
    
  /*API Call*/
    const total=100;
    const present=75;
    const late=5;
    const onLeave=6;
  // const [total,setTotal]=useState(100);
  // const [present,setPresent]=useState(75);
  // const [late,setLate]=useState(5);
  // const [data,setData]=useState({'total':100,'present':75,'late':50});

  const [currDate,setDate]=useState(new Date());
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

   useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    const absent = total - present - onLeave; 

    const data = {
      labels: ['Present', 'Absent','On Leave','Late'],
      datasets: [
        {
          data: [present-late, absent, onLeave ,late,],
          backgroundColor: ['green', 'red', 'orange','yellow'],
          hoverBackgroundColor: ['green', 'red', 'orange','yellow'],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500,
      },
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [present, total, late, onLeave]);

  function getDayFormat(day)
  {
    if(day === 0) return 'Sunday';
    if(day === 1) return 'Monday';
    if(day === 2) return 'Tuesday';
    if(day === 3) return 'Wednesday';
    if(day === 4) return 'Thursday';
    if(day === 5) return 'Friday';
    if(day === 6) return 'Aatuday';
  }

  return (
    <>
      <HeaderSideNav>
        <div className='ml-[15px]'>
          <h1 className='mt-[30px] text-[32px]'>Theekimootiyl Insurance Copporation </h1>
          <h1 className='text-[24px]'>{getDayFormat(currDate.getDay())}, {currDate.getDate()}/{currDate.getMonth()}/{currDate.getFullYear()}</h1>
          <div className='flex justify-between w-[775px]'>
            <ProgressCircle data={{'present':present,'total':total, 'late':late}}/>
          </div>
          <DoughnutChart data={chartData} options={chartOptions} />
        </div>
      </HeaderSideNav>
      
    </>
  )
}

export default Dashboard
