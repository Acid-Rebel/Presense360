import { Link } from 'react-router-dom';
import userIamge from './user.png';
import dashboardImage from './dashboard.png';
import reportImage from './report.png';
import employeeImage from './employee.png';
import requestImage from './request.png';
import settinsImage from './settings.png';

function HeaderSideNav(props) {
    return (
        <div className="min-h-screen flex flex-col"> {/* Use flex-col to stack header and content */}
            {/* Header */}
            <header className="flex items-center justify-between bg-[#4F6C93] w-full h-16 text-white border-b-4 border-b-[#111763] px-4 md:px-6"> {/* h-16 (64px), border-b-4 (16px), px-4 (1rem) for padding, md:px-6 for larger screens */}
                <div className='flex items-center text-xl md:text-2xl lg:text-3xl font-semibold'> {/* text-xl (1.25rem), md:text-2xl (1.5rem), lg:text-3xl (1.875rem) */}
                    <p>Presense360</p>
                </div>

                <div className='flex items-center text-base md:text-lg lg:text-xl h-full'> {/* text-base (1rem), md:text-lg (1.125rem), lg:text-xl (1.25rem) */}
                    <button className='flex items-center cursor-pointer hover:bg-[#111763] h-full px-3 py-2 rounded'> {/* px-3, py-2 for padding, rounded for button */}
                        <span className="mr-2">Username</span> {/* Use span for text and mr-2 for margin-right */}
                        <img src={userIamge} className="w-6 h-6 md:w-8 md:h-8 object-contain" alt="User" /> {/* w-6 (1.5rem), h-6 (1.5rem), md:w-8, md:h-8 for larger images */}
                    </button>
                </div>
            </header>

            {/* Main Content Area (Sidebar + Children Content) */}
            <div className='flex flex-1 w-full'> {/* flex-1 to take remaining height, w-full for full width */}
                {/* Side Navigation */}
                <div className="bg-[#4F6C93] w-48 md:w-64 lg:w-72 flex-shrink-0"> {/* w-48 (12rem), md:w-64 (16rem), lg:w-72 (18rem) - responsive sidebar width */}
                    <ul className='w-full'>
                        {/* Dashboard Link */}
                        <li className='flex cursor-pointer border-b-2 border-b-[#111763] w-full h-14 items-center text-white hover:bg-[#111763]'> {/* h-14 (3.5rem) */}
                            <Link to="/" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'> {/* px-4, py-2 for padding, text-sm, md:text-base, lg:text-lg for responsive font size */}
                                <img src={dashboardImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Dashboard" /> {/* w-5, h-5, mr-3 for spacing */}
                                Dashboard
                            </Link>
                        </li>

                        {/* Attendance Reports Link */}
                        <li className='flex cursor-pointer border-b-2 border-b-[#111763] w-full h-14 items-center text-white hover:bg-[#111763]'>
                            <Link to="/" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'>
                                <img src={reportImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Reports" />
                                Attendance Reports
                            </Link>
                        </li>

                        {/* Employees Link */}
                        <li className='flex cursor-pointer border-b-2 border-b-[#111763] w-full h-14 items-center text-white hover:bg-[#111763]'>
                            <Link to="/employees" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'>
                                <img src={employeeImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Employees" />
                                Employees
                            </Link>
                        </li>

                        {/* Leave Requests Link */}
                        <li className='flex cursor-pointer border-b-2 border-b-[#111763] w-full h-14 items-center text-white hover:bg-[#111763]'>
                            <Link to="/" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'>
                                <img src={requestImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Requests" />
                                Leave Requests
                            </Link>
                        </li>

                        {/* Settings Link */}
                        <li className='flex cursor-pointer border-b-2 border-b-[#111763] w-full h-14 items-center text-white hover:bg-[#111763]'>
                            <Link to="/" className='flex items-center px-4 py-2 text-sm md:text-base lg:text-lg w-full'>
                                <img src={settinsImage} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' alt="Settings" />
                                Settings
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Main Content Area */}
                <div className="bg-[#F0F0F0] flex-1 overflow-auto"> {/* flex-1 to take remaining width, overflow-auto for scrollable content */}
                    {props.children}
                </div>
            </div>
        </div>
    );
}
export default HeaderSideNav;