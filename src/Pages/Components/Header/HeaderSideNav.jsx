import { Link } from 'react-router-dom'; 
import userIamge from './user.png';
import dashboardImage from './dashboard.png';
import reportImage from './report.png';
import employeeImage from './employee.png';
import requestImage from './request.png';
import settinsImage from './settings.png';
function HeaderSideNav(props)
{
    return(
        <div className="min-h-screen">
            <header className="flex items-center justify-between bg-[#4F6C93] w-screen h-[4rem] text-white border-b-[0.25rem] border-b-[#111763]">
                    <div className='flex ml-[1.25rem] items-center text-[2rem]'>
                        <p>Presense360</p>
                    </div>

                    <div className='flex mr-[1.25rem] items-center text-[1.7rem] h-full'>
                        <button className='flex items-center cursor-pointer hover:bg-[#111763] h-full'>Username<img src={userIamge} height={25} width={30}/></button>
                    </div>
            </header>

            <div className='flex  h-[calc(100vh-4rem)]'>
                <div className="flex bg-[#4F6C93]  w-[16rem]">
                    <ul className='w-full'>
                       <li className='flex  cursor-pointer border-b-[0.15rem] border-b-[#111763] w-full h-[3.5rem]  items-center  text-[1rem] text-white hover:bg-[#111763]'>
                            <Link to="/" className='ml-[0.4rem] flex items-center'> 
                                <img src={dashboardImage} height={27} width={27} className='mr-[0.4rem]'/>
                                Dashboard
                            </Link>
                        </li>

                        <li className='flex  cursor-pointer border-b-[0.15rem] border-b-[#111763] w-full h-[3.5rem]  items-center  text-[1rem] text-white hover:bg-[#111763]'>
                            <Link to="/" className='ml-[0.4rem] flex items-center'>
                                <img src={reportImage} height={27} width={27} className='mr-[0.4rem]'/>Attendance Reports
                            </Link>
                        </li>
                        <li className='flex  cursor-pointer border-b-[0.15rem] border-b-[#111763] w-full h-[3.5rem]  items-center  text-[1rem] text-white hover:bg-[#111763]'>
                            <Link to="/employees" className='ml-[0.4rem] flex items-center'>
                                <img src={employeeImage}height={27} width={27} className='mr-[0.4rem]'/>Employees
                            </Link>
                            </li>
                        <li className='flex  cursor-pointer border-b-[0.15rem] border-b-[#111763] w-full h-[3.5rem]  items-center  text-[1rem] text-white hover:bg-[#111763]'>
                             <Link to="/" className='ml-[0.4rem] flex items-center'>
                                <img src={requestImage}height={27} width={27} className='mr-[0.4rem]'/>Leave Requests
                            </Link>
                        </li>
                        <li className='flex  cursor-pointer border-b-[0.15rem] border-b-[#111763] w-full h-[3.5rem]  items-center  text-[1rem] text-white hover:bg-[#111763]'>
                            <Link to="/" className='ml-[0.4rem] flex items-center'>
                                <img src={settinsImage}height={27} width={27} className='mr-[0.4rem]'/>Settings
                            </Link>
                        </li>
                            
                    </ul>
                </div>
            
                <div className="bg-[#F0F0F0] flex-1 w-[calc(100vw-calc(100vh-4rem))]">
                    {props.children}
                </div>
            </div>
        </div>
    );

    
}
export default HeaderSideNav;