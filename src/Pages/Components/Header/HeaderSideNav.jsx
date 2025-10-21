import { Link } from 'react-router-dom';
import { useState } from 'react';
import userIamge from './user.png';
import dashboardImage from './dashboard.png';
import reportImage from './report.png';
import employeeImage from './employee.png';
import requestImage from './request.png';
import settinsImage from './settings.png';
import menuIcon from './menu--v3.png'

function HeaderSideNav(props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen flex flex-col"> 
            <header className="flex items-center justify-between bg-[#5E5CDB] w-full h-20 text-white px-0 md:px-0"> 
                <div className='flex items-center text-xl md:text-2xl lg:text-3xl font-semibold h-full w-48 md:w-64 lg:w-72 flex-shrink-0'> 
                    <button onClick={toggleSidebar} className='flex items-center cursor-pointer bg-[#3048AC] h-full px-3 py-2'>
                        <div className='flex items-center w-6 h-6 md:w-8 md:h-8 bg-[#3048AC] hover:bg-[#5E5CDB] pl-1 rounded-full'>  
                            <img src={menuIcon} className="w-4 h-4 md:w-6 md:h-6 object-contain" alt="Menu" /> 
                        </div>
                    </button>
                    <p className='bg-[#3048AC] flex items-center h-full w-36 md:w-50 lg:w-58 flex-shrink-0'>Presense360</p>
                </div>

                <div className='flex items-center text-base md:text-lg lg:text-xl h-full'> 
                    <button className='flex items-center cursor-pointer hover:bg-[#3048AC] h-full px-3 py-2 rounded'> 
                        <span className="mr-2">Username</span> 
                        <img src={userIamge} className="w-6 h-6 md:w-8 md:h-8 object-contain" alt="User" /> 
                    </button>
                </div>
            </header>

            <div className='flex flex-1 w-full'> 
                
                {/* Sidebar */}
                <div className={`${isSidebarOpen ? 'w-48 md:w-64 lg:w-72' : 'w-0'} bg-[#FFFFFF] flex-shrink-0 border-r border-gray-200 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.15)] relative z-10 overflow-hidden transition-all duration-300`}>
                    <ul className='w-full'>
                        <li className='flex cursor-pointer w-full h-14 items-center text-black hover:bg-[#E7FAFF]'> 
                            <Link to="/dashboard" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'> 
                                <img src={dashboardImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Dashboard" /> 
                                Dashboard
                            </Link>
                        </li>

                        <li className='flex cursor-pointer w-full h-14 items-center text-black hover:bg-[#E7FAFF]'>
                            <Link to="/attendance" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'>
                                <img src={reportImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Reports" />
                                Attendance Reports
                            </Link>
                        </li>

                        <li className='flex cursor-pointer w-full h-14 items-center text-black hover:bg-[#E7FAFF]'>
                            <Link to="/employees" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'>
                                <img src={employeeImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Employees" />
                                Employees
                            </Link>
                        </li>

                        <li className='flex cursor-pointer w-full h-14 items-center text-black hover:bg-[#E7FAFF]'>
                            <Link to="/leave" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'>
                                <img src={requestImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Requests" />
                                Leave Requests
                            </Link>
                        </li>

                        <li className='flex cursor-pointer w-full h-14 items-center text-black hover:bg-[#E7FAFF]'>
                            <Link to="/" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'>
                                <img src={settinsImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Settings" />
                                Settings
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="bg-[#F5F4FA] flex-1 overflow-auto"> 
                    {props.children}
                </div>
            </div>
        </div>
    );
}
export default HeaderSideNav;
