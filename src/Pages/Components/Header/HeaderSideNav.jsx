import { Link } from 'react-router-dom';
import userIamge from './user.png';
import dashboardImage from './dashboard.png';
import reportImage from './report.png';
import employeeImage from './employee.png';
import requestImage from './request.png';
import settinsImage from './settings.png';

function HeaderSideNav(props) {
    return (
        <div className="min-h-screen flex flex-col"> 
           
            <header className="flex items-center justify-between bg-[#4F6C93] w-full h-16 text-white border-b-4 border-b-[#111763] px-4 md:px-6"> 
                <div className='flex items-center text-xl md:text-2xl lg:text-3xl font-semibold'> 
                    <p>Presense360</p>
                </div>

                <div className='flex items-center text-base md:text-lg lg:text-xl h-full'> 
                    <button className='flex items-center cursor-pointer hover:bg-[#111763] h-full px-3 py-2 rounded'> 
                        <span className="mr-2">Username</span> 
                        <img src={userIamge} className="w-6 h-6 md:w-8 md:h-8 object-contain" alt="User" /> 
                    </button>
                </div>
            </header>

           
            <div className='flex flex-1 w-full'> 
                
                <div className="bg-[#4F6C93] w-48 md:w-64 lg:w-72 flex-shrink-0"> 
                    <ul className='w-full'>
                        
                        <li className='flex cursor-pointer border-b-2 border-b-[#111763] w-full h-14 items-center text-white hover:bg-[#111763]'> 
                            <Link to="/" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'> 
                                <img src={dashboardImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Dashboard" /> 
                                Dashboard
                            </Link>
                        </li>

                       
                        <li className='flex cursor-pointer border-b-2 border-b-[#111763] w-full h-14 items-center text-white hover:bg-[#111763]'>
                            <Link to="/" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'>
                                <img src={reportImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Reports" />
                                Attendance Reports
                            </Link>
                        </li>

                        
                        <li className='flex cursor-pointer border-b-2 border-b-[#111763] w-full h-14 items-center text-white hover:bg-[#111763]'>
                            <Link to="/employees" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'>
                                <img src={employeeImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Employees" />
                                Employees
                            </Link>
                        </li>

                        
                        <li className='flex cursor-pointer border-b-2 border-b-[#111763] w-full h-14 items-center text-white hover:bg-[#111763]'>
                            <Link to="/" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'>
                                <img src={requestImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Requests" />
                                Leave Requests
                            </Link>
                        </li>

                       
                        <li className='flex cursor-pointer border-b-2 border-b-[#111763] w-full h-14 items-center text-white hover:bg-[#111763]'>
                            <Link to="/" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'>
                                <img src={settinsImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Settings" />
                                Settings
                            </Link>
                        </li>
                    </ul>
                </div>

                
                <div className="bg-[#F0F0F0] flex-1 overflow-auto"> 
                    {props.children}
                </div>
            </div>
        </div>
    );
}
export default HeaderSideNav;