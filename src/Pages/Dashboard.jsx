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
    // <>
      
    //     <div className='flex'>
    //       <div className='flex flex-col w-[48.5rem] ml-[1rem] '>
    //         <h1 className='mt-[1.5rem] text-[32px]'>Theekimootiyl Insurance Copporation </h1>
    //         <h1 className='text-[24px]'>{getDayFormat(currDate.getDay())}, {currDate.getDate()}/{currDate.getMonth()}/{currDate.getFullYear()}</h1>
    //         <div className='flex justify-between w-full h-full'>
    //           <ProgressCircle data={{'present':present,'total':total, 'late':late}}/>
    //         </div>
    //         <div>
    //           <DonutChart/>
    //         </div>
    //         <div className=' flex justify-between h-[20rem] mt-[0.5rem] mb-[2.5rem]'>
    //           <AbsentBar type={'Absent'}/>
    //           <AbsentBar type={'Onleave'}/>
    //         </div>
    //       </div>
    //       <div className=' flex-1  w-[775px] ml-[15px] mr-[15px] mb-[15px] mt-[115px]'>
    //         <PresentBar/>
    //       </div>
    //   </div> 
    // </>
    <>
      
       <div className='flex flex-col md:flex-row p-4 lg:p-6 w-full h-full'>
        {/* Left Column (Charts and Absences) */}
        {/* w-full by default (extra small & small screens) */}
        {/* md:w-2/3: On medium screens, this column takes 2/3 width */}
        {/* lg:w-3/4: On large screens, it takes 3/4 width (as you wanted) */}
        {/* xl:w-2/3: On extra-large screens, it takes 2/3 width */}
        {/* md:pr-4: Add right padding when in row layout from medium screens upwards */}
        <div className='flex flex-col w-full md:w-2/3 lg:w-3/4 xl:w-2/3 md:pr-4'>
            <h1 className='mt-4 text-xl md:text-2xl lg:text-3xl font-semibold'>
                Theekimootiyl Insurance Corporation
            </h1>
            <h1 className='text-lg md:text-xl lg:text-2xl text-gray-700'>
                {getDayFormat(currDate.getDay())}, {currDate.getDate()}/{(currDate.getMonth() + 1)}/{currDate.getFullYear()}
            </h1>

            {/* Progress Circle Container (No changes needed here from previous responsive update) */}
            <div className='flex justify-center md:justify-start w-full mt-4'>
                <ProgressCircle data={{ 'present': present, 'total': total, 'late': late }} />
            </div>

            {/* Donut Chart Container (No changes needed here) */}
            <div className='mt-6'>
                <DonutChart />
            </div>

            {/* Absent/On Leave Bars Container (No changes needed here) */}
            {/* <div className='flex flex-col sm:flex-row justify-between mt-6 mb-8 gap-4'>
                <AbsentBar type={'Absent'} />
                <AbsentBar type={'Onleave'} />
            </div> */}
        </div>

        {/* Right Column (Present Bar) - Assumed sibling div from previous context */}
        {/* flex-1: Takes remaining width when parent is flex-row */}
        {/* w-full: Takes full width when parent is flex-col (on small screens) */}
        {/* mt-8: Top margin when stacked (on small screens) */}
        {/* md:mt-0: Removes top margin when in row layout (from medium screens upwards) */}
        {/* md:ml-4: Adds left margin when in row layout (from medium screens upwards) */}
        {/* <div className='flex-1 w-full mt-8 md:mt-0 md:ml-4'>
            <PresentBar />
        </div> */}
    </div>
    </>
  )
}

export default Dashboard
