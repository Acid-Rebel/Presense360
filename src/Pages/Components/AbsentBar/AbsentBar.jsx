import profilePic from './pfp.png';

function AbsentBar(props) {
    const dummyAbsentEmployees = [
        { id: 1, name: 'Alice', type: 'Absent' },
        { id: 2, name: 'Bob', type: 'Absent' },
        { id: 3, name: 'Charlie', type: 'Onleave' },
        { id: 4, name: 'David', type: 'Absent' },
        { id: 5, name: 'Eve', type: 'Onleave' },
        { id: 6, name: 'Frank', type: 'Absent' },
        { id: 7, name: 'Grace', type: 'Onleave' },
        { id: 8, name: 'Harry', type: 'Absent' },
        { id: 9, name: 'Ivy', type: 'Onleave' },
        { id: 10, name: 'Jack', type: 'Absent' },
        { id: 11, name: 'Karen', type: 'Onleave' },
        { id: 12, name: 'Liam', type: 'Absent' },
        { id: 13, name: 'Mia', type: 'Onleave' },
        { id: 14, name: 'Noah', type: 'Absent' },
        { id: 15, name: 'Olivia', type: 'Onleave' },
        { id: 16, name: 'Peter', type: 'Absent' },
        { id: 17, name: 'Quinn', type: 'Onleave' },
        { id: 18, name: 'Rachel', type: 'Absent' },
        { id: 19, name: 'Sam', type: 'Onleave' },
        { id: 20, name: 'Tina', type: 'Absent' },
        { id: 21, name: 'Uma', type: 'Onleave' },
        { id: 22, name: 'Victor', type: 'Absent' },
        { id: 23, name: 'Wendy', type: 'Onleave' },
        { id: 24, name: 'Xavier', type: 'Absent' },
        { id: 25, name: 'Yara', type: 'Onleave' },
    ].filter(emp => emp.type === props.type); 

    return (
        <div className='w-full sm:w-[calc(50%-0.5rem)] bg-white rounded-lg shadow-md flex flex-col'>
            <div className='border-b-2 border-gray-200 py-3 px-4'>
                <h1 className='text-lg md:text-xl font-semibold text-gray-800'>{props.type}</h1>
            </div>

            <div className="overflow-y-auto flex-grow rounded-b-lg">
                <ol>
                    {dummyAbsentEmployees.map(employee => (
                        <li key={employee.id} className='border-b border-gray-200 last:border-b-0'>
                            <div className="flex items-center px-4 py-3">
                                <img src={profilePic} className="h-12 w-12 rounded-full object-cover flex-shrink-0" alt="Profile" />
                                <div className='ml-3'>
                                    <p className="font-medium text-gray-900 text-sm md:text-base">{employee.name}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                    {dummyAbsentEmployees.length === 0 && (
                        <li className="py-4 px-4 text-center text-gray-500 text-sm">
                            No {props.type} employees today.
                        </li>
                    )}
                </ol>
            </div>
        </div>
    );
}

export default AbsentBar;