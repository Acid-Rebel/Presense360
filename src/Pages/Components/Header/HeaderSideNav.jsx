import { Link, useLocation } from 'react-router-dom';
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
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const isActive = (path) => {
        return location.pathname === path;
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
                        <span className="mr-2">admin</span> 
                        <img src={userIamge} className="w-6 h-6 md:w-8 md:h-8 object-contain" alt="User" /> 
                    </button>
                </div>
            </header>

            <div className='flex flex-1 w-full'> 
                
                {/* Sidebar */}
                <div className={`${isSidebarOpen ? 'w-48 md:w-64 lg:w-72' : 'w-20'} bg-[#F5F8FF] flex-shrink-0 border-r border-blue-100 shadow-[2px_0_4px_-1px_rgba(94,92,219,0.15)] relative z-10 transition-all duration-300`}>
                    <ul className='w-full'>
                        <li className={`flex cursor-pointer w-full h-14 items-center text-black hover:bg-[#DDE7FF] ${isActive('/dashboard') ? 'bg-[#DDE7FF] border-l-4 border-[#5E5CDB]' : ''} group relative`}> 
                            <Link to="/dashboard" className={`flex items-center ${isSidebarOpen ? 'px-4' : 'px-0 justify-center'} py-2 text-sm md:text-base lg:text-lg w-full ${isActive('/dashboard') ? 'font-semibold text-[#5E5CDB]' : ''}`}> 
                                <img src={dashboardImage} className={`w-5 h-5 md:w-6 md:h-6 ${isSidebarOpen ? 'mr-3' : ''} object-contain`} alt="Dashboard" /> 
                                {isSidebarOpen && 'Dashboard'}
                            </Link>
                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                    Dashboard
                                </div>
                            )}
                        </li>

                        <li className={`flex cursor-pointer w-full h-14 items-center text-black hover:bg-[#DDE7FF] ${isActive('/attendance') ? 'bg-[#DDE7FF] border-l-4 border-[#5E5CDB]' : ''} group relative`}>
                            <Link to="/attendance" className={`flex items-center ${isSidebarOpen ? 'px-4' : 'px-0 justify-center'} py-2 text-sm md:text-base lg:text-lg w-full ${isActive('/attendance') ? 'font-semibold text-[#5E5CDB]' : ''}`}>
                                <img src={reportImage} className={`w-5 h-5 md:w-6 md:h-6 ${isSidebarOpen ? 'mr-3' : ''} object-contain`} alt="Reports" />
                                {isSidebarOpen && 'Attendance Reports'}
                            </Link>
                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                    Attendance Reports
                                </div>
                            )}
                        </li>

                        <li className={`flex cursor-pointer w-full h-14 items-center text-black hover:bg-[#DDE7FF] ${isActive('/employees') ? 'bg-[#DDE7FF] border-l-4 border-[#5E5CDB]' : ''} group relative`}>
                            <Link to="/employees" className={`flex items-center ${isSidebarOpen ? 'px-4' : 'px-0 justify-center'} py-2 text-sm md:text-base lg:text-lg w-full ${isActive('/employees') ? 'font-semibold text-[#5E5CDB]' : ''}`}>
                                <img src={employeeImage} className={`w-5 h-5 md:w-6 md:h-6 ${isSidebarOpen ? 'mr-3' : ''} object-contain`} alt="Employees" />
                                {isSidebarOpen && 'Employees'}
                            </Link>
                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                    Employees
                                </div>
                            )}
                        </li>

                        <li className={`flex cursor-pointer w-full h-14 items-center text-black hover:bg-[#DDE7FF] ${isActive('/leave') ? 'bg-[#DDE7FF] border-l-4 border-[#5E5CDB]' : ''} group relative`}>
                            <Link to="/leave" className={`flex items-center ${isSidebarOpen ? 'px-4' : 'px-0 justify-center'} py-2 text-sm md:text-base lg:text-lg w-full ${isActive('/leave') ? 'font-semibold text-[#5E5CDB]' : ''}`}>
                                <img src={requestImage} className={`w-5 h-5 md:w-6 md:h-6 ${isSidebarOpen ? 'mr-3' : ''} object-contain`} alt="Requests" />
                                {isSidebarOpen && 'Leave Requests'}
                            </Link>
                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                    Leave Requests
                                </div>
                            )}
                        </li>

                        <li className={`flex cursor-pointer w-full h-14 items-center text-black hover:bg-[#DDE7FF] ${isActive('/settings') ? 'bg-[#DDE7FF] border-l-4 border-[#5E5CDB]' : ''} group relative`}>
                            <Link to="/settings" className={`flex items-center ${isSidebarOpen ? 'px-4' : 'px-0 justify-center'} py-2 text-sm md:text-base lg:text-lg w-full ${isActive('/settings') ? 'font-semibold text-[#5E5CDB]' : ''}`}>
                                <img src={settinsImage} className={`w-5 h-5 md:w-6 md:h-6 ${isSidebarOpen ? 'mr-3' : ''} object-contain`} alt="Settings" />
                                {isSidebarOpen && 'Settings'}
                            </Link>
                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                    Settings
                                </div>
                            )}
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