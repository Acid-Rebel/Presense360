import userIamge from './user.png';
import dashboardImage from './dashboard.png';
import reportImage from './report.png';
import employeeImage from './employee.png';
import requestImage from './request.png';
import settinsImage from './settings.png';
import './headersidenav.css';
function HeaderSideNav(props)
{
    return(
        <div className="overflow-hidden">
            <header className="flex items-center justify-between bg-[#4F6C93] w-screen h-[66px] text-white border-b-4 border-b-[#111763]">
                    <div className='flex ml-5 items-center text-3xl'>
                        <p>Presense360</p>
                    </div>

                    <div className='flex mr-5 items-center text-2xl h-full'>
                        <button className='flex items-center cursor-pointer hover:bg-[#111763] h-full'>Username<img src={userIamge} height={25} width={30}/></button>
                    </div>
            </header>

            <div className='flex '>
                <div className="flex bg-[#4F6C93]  w-[16%]">
                    <ul className='navBar'>
                        <li><img src={dashboardImage} height={27} width={27}/>Dashboard</li>
                        <li><img src={reportImage} height={27} width={27}/>Attendance Reports</li>
                        <li><img src={employeeImage}height={27} width={27}/>Employees</li>
                        <li><img src={requestImage}height={27} width={27}/>Leave Requests</li>
                        <li><img src={settinsImage}height={27} width={27}/>Settings</li>
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