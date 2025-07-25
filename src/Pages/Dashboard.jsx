import {useState,useEffect,useMemo} from 'react';
import HeaderSideNav from "./Components/Header/HeaderSideNav.jsx"
import ProgressCircle from "./Components/ProgressCircle/ProgressCircle.jsx"
import DonutChart from './Components/DonutChart/DonutChart.jsx';
import PresentBar from './Components/PresentBar/PresentBar.jsx';
import AbsentBar from './Components/AbsentBar/AbsentBar.jsx';

function Dashboard() {
    
  /*API Call*/
    const total=100;
    const present=75;
    const late=5;
    const onLeave=6;

  const [currDate,setDate]=useState(new Date());
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);

   useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function getDayFormat(day)
  {
    if(day === 0) return 'Sunday';
    if(day === 1) return 'Monday';
    if(day === 2) return 'Tuesday';
    if(day === 3) return 'Wednesday';
    if(day === 4) return 'Thursday';
    if(day === 5) return 'Friday';
    if(day === 6) return 'Saturday';
  }

  return (
    <>
      
       <div className='flex flex-col md:flex-row p-4 lg:p-6 w-full h-full'>
        <div className='flex flex-col w-full md:w-2/3 lg:w-3/4 xl:w-2/3 md:pr-4'>
            <h1 className='mt-4 text-xl md:text-2xl lg:text-3xl font-semibold'>
                Theekimootiyl Insurance Corporation
            </h1>
            <h1 className='text-lg md:text-xl lg:text-2xl text-gray-700'>
                {getDayFormat(currDate.getDay())}, {currDate.getDate()}/{(currDate.getMonth() + 1)}/{currDate.getFullYear()}
            </h1>

            <div className='flex justify-center md:justify-start w-full mt-4'>
                <ProgressCircle data={{ 'present': present, 'total': total, 'late': late }} />
            </div>

            
            <div className='mt-6'>
                <DonutChart />
            </div>

           
            <div className='flex flex-col sm:flex-row justify-between mt-6 mb-2 gap-4 h-100'>
                <AbsentBar type={'Absent'} />
                <AbsentBar type={'Onleave'} />
            </div>
        </div>

       
        <div className='flex-1 w-full mt-8 md:mt-25 md:ml-4 mb-2 h-229'>
          <PresentBar/>
        </div>
    </div>
    </>
  )
}

export default Dashboard
