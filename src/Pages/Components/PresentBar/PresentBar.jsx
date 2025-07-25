import profilePic from './pfp.png';
import faceScanPic from './face.png';

function PresentBar() {
    const dummyEmployees = [
        { id: 1, name: 'Rincy', time: '09:00AM', status: 'Moments Ago' },
        { id: 2, name: 'John Doe', time: '09:05AM', status: '5 mins Ago' },
        { id: 3, name: 'Jane Smith', time: '09:10AM', status: '10 mins Ago' },
        { id: 4, name: 'Alice Brown', time: '09:15AM', status: '15 mins Ago' },
        { id: 5, name: 'Bob White', time: '09:20AM', status: '20 mins Ago' },
        { id: 6, name: 'Charlie Green', time: '09:25AM', status: '25 mins Ago' },
        { id: 7, name: 'Diana Black', time: '09:30AM', status: '30 mins Ago' },
        { id: 8, name: 'Eve Blue', time: '09:35AM', status: '35 mins Ago' },
        { id: 9, name: 'Frank Yellow', time: '09:40AM', status: '40 mins Ago' },
        { id: 10, name: 'Grace Orange', time: '09:45AM', status: '45 mins Ago' },
        { id: 11, name: 'Rincy Sharma', time: '09:00AM', status: 'Moments Ago' }, 
        { id: 12, name: 'John Smith', time: '09:05AM', status: '5 mins Ago' },
        { id: 13, name: 'Jane Doe', time: '09:10AM', status: '10 mins Ago' },
        { id: 14, name: 'Alice Walker', time: '09:15AM', status: '15 mins Ago' },
        { id: 15, name: 'Bob Harris', time: '09:20AM', status: '20 mins Ago' },
        { id: 16, name: 'Charlie Miller', time: '09:25AM', status: '25 mins Ago' },
        { id: 17, name: 'Diana Clark', time: '09:30AM', status: '30 mins Ago' },
        { id: 18, name: 'Eve White', time: '09:35AM', status: '35 mins Ago' },
        { id: 19, name: 'Frank King', time: '09:40AM', status: '40 mins Ago' },
        { id: 20, name: 'Grace Scott', time: '09:45AM', status: '45 mins Ago' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
            <div className='border-b-2 border-gray-200 py-3 px-4'>
                <h1 className='text-lg md:text-xl font-semibold text-gray-800'>Present</h1>
            </div>

            <div className="overflow-y-auto flex-grow rounded-b-lg ">
                <ol>
                    {dummyEmployees.map(employee => (
                        <li key={employee.id} className='border-b border-gray-200 last:border-b-0'>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-2 py-2 sm:px-4 sm:py-3">
                                <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                                    <img src={profilePic} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover" alt="Profile" />
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm sm:text-base leading-tight">{employee.name}</p>
                                        <div className="flex items-center text-xs text-gray-600 mt-1">
                                            <img src={faceScanPic} className="h-3 w-3 mr-1 sm:h-4 sm:w-4" alt="Face Scan" />
                                            <p className="whitespace-nowrap">{employee.time}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className='text-xs text-gray-500 mt-3 md:mt-0 md:ml-auto md:mr-2 lg:mr-4 text-right w-full md:w-auto'>
                                    {employee.status}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default PresentBar;