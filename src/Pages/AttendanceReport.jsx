import React, { useState, useMemo } from 'react';
import { ChevronDownIcon, CalendarIcon, UserIcon, ClockIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAttendanceRecords } from './API/useAttendance';
import { useEmployees, useDepartments } from './API/useEmployees';

const ATTENDANCE_STATUS_OPTIONS = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Present/Late', value: 'Present/Late' },
    { label: 'Absent', value: 'Absent' },
    { label: 'On Leave', value: 'On Leave' },
];

// --- Utility Components (StatusBadge and StatCard definitions) ---

const StatusBadge = ({ status, isFace }) => {
  let color = 'bg-gray-200 text-gray-700';
  let label = status;

  if (isFace) {
    if (status === 2) { color = 'bg-blue-100 text-blue-700'; label = 'Verified'; }
    if (status !== 2) { color = 'bg-red-100 text-red-700'; label = 'Failed'; }
  } else {
    switch (status) {
      case 'Present': case 'Verified': case 'Late': color = 'bg-green-100 text-green-700'; label = status; break;
      case 'No Checkout': case 'Present (Clocked In)': color = 'bg-yellow-100 text-yellow-700'; label = 'Missing Checkout'; break;
      case 'Absent': case 'Confirmed Absence': color = 'bg-red-100 text-red-700'; break;
      case 'On Leave (Standard)': case 'On Leave (Medical)': color = 'bg-purple-100 text-purple-700'; label = status.includes('Medical') ? 'Med. Leave' : 'On Leave'; break;
      default: break;
    }
  }

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${color}`}>
      {label}
    </span>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="flex items-center p-4 bg-white rounded-xl shadow-md transition hover:shadow-lg border-l-4" style={{ borderColor: color }}>
    <div className={`p-3 rounded-full mr-4`} style={{ backgroundColor: `${color}1A`, color: color }}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);


// --- Main Component ---

const AttendanceReport = () => {
  const [viewMode, setViewMode] = useState('general');
  const [selectedDateRange, setSelectedDateRange] = useState('Month-to-Date');
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchEmployee, setSearchEmployee] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  
  // Custom Date States
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  // Fetch data using the hooks
  const { 
    data: allAttendanceRecords = [], 
    isLoading: isLoadingAttendance, 
    error: errorAttendance 
  } = useAttendanceRecords();

  const { 
    data: employeeMasterList = [], 
    isLoading: isLoadingEmployees 
  } = useEmployees();
  
  const { 
    data: departmentOptions = [], 
    isLoading: isLoadingDepartments 
  } = useDepartments(); 


  // Determine the list of employees to use for the Employee Summary (Master list for reference)
  const employeeReferenceList = useMemo(() => {
    return employeeMasterList.map(emp => ({
        id: emp.id,
        name: emp.name,
        dept: emp.dept_label, // Use dept_label from the employee master list fetched earlier
    }));
  }, [employeeMasterList]);


  // NOTE: Anchor date for mock filtering is 2025-10-21 (Today)
  const REFERENCE_DATE = new Date('2025-10-21T12:00:00'); 

  // --------------------------------------------------------------------
  // 1. Data Processing and Filtering
  // --------------------------------------------------------------------

  const filteredData = useMemo(() => {
    
    // Safety check: if no records are fetched, return empty array
    if (allAttendanceRecords.length === 0) return [];

    // --- DATE RANGE CALCULATION ---
    let startDate = new Date(REFERENCE_DATE);
    let endDate = new Date(REFERENCE_DATE);
    endDate.setHours(23, 59, 59, 999);

    switch (selectedDateRange) {
        case 'Today':
            break;
        case 'Last-7-Days':
            startDate.setDate(startDate.getDate() - 6); 
            break;
        case 'Month-to-Date':
            startDate.setDate(1); 
            break;
        case 'Last-Month':
            startDate = new Date(REFERENCE_DATE.getFullYear(), REFERENCE_DATE.getMonth() - 1, 1);
            endDate = new Date(REFERENCE_DATE.getFullYear(), REFERENCE_DATE.getMonth(), 0); 
            break;
        case 'Custom':
            if (customStartDate) {
                startDate = new Date(customStartDate);
            }
            if (customEndDate) {
                endDate = new Date(customEndDate);
            }
            break;
        default:
            break;
    }
    
    startDate.setHours(0, 0, 0, 0);

    return allAttendanceRecords.filter(item => { 
      
      // --- DATE FILTER ---
      const itemDateTime = new Date(item.date);
      const itemDateOnly = new Date(itemDateTime.getFullYear(), itemDateTime.getMonth(), itemDateTime.getDate());
      
      if (selectedDateRange !== 'Custom' || (customStartDate && customEndDate)) {
          if (itemDateOnly < startDate || itemDateOnly > endDate) {
            return false;
          }
      }
      // --- END DATE FILTER ---
      
      // 1. Department Filter (Filter by dept_label)
      if (selectedDept !== 'All' && item.dept !== selectedDept) return false;
      
      // 2. Search Filter
      if (searchEmployee) {
        const lowerSearch = searchEmployee.toLowerCase();
        const itemName = item.name || ''; // Default to empty string if name is null/undefined
        const itemId = item.id ? item.id.toString() : ''; // Ensure ID is treated as string

        if (!itemName.toLowerCase().includes(lowerSearch) && !itemId.includes(lowerSearch)) {
          return false;
        }
      }

      // 3. Status Filter
      if (selectedStatusFilter === 'Present/Late') {
          const isPresentOrLate = item.status.includes('Present') || item.status === 'Late' || item.status === 'No Checkout';
          if (!isPresentOrLate) return false;
      } else if (selectedStatusFilter !== 'All') {
          // General status filter (e.g., 'Absent', 'On Leave')
          if (!item.status.includes(selectedStatusFilter)) return false;
      }
      
      return true;
    });
  }, [selectedDept, searchEmployee, selectedStatusFilter, selectedDateRange, customStartDate, customEndDate, allAttendanceRecords]); 

  // --------------------------------------------------------------------
  // 2. Summary Analytics Calculation (General View)
  // --------------------------------------------------------------------

  const generalSummary = useMemo(() => {
    if (filteredData.length === 0) return { lateCheckIns: 0, absentDays: 0, exceptions: 0, avgHours: '0.00', chartData: [], filteredData: [] };

    const uniqueDates = Array.from(new Set(filteredData.map(item => item.date)));
    const totalDaysCounted = uniqueDates.length;
    
    // Group records by employee and date
    const dailyStatuses = {};
    filteredData.forEach(item => {
        if (!dailyStatuses[item.date]) dailyStatuses[item.date] = {};
        dailyStatuses[item.date][item.id] = item.status; 
    });

    let totalLateCheckIns = 0;
    let totalAbsentDays = 0;
    let totalExceptions = 0;
    let totalHours = 0;
    
    Object.values(dailyStatuses).forEach(employeesInDay => {
        Object.values(employeesInDay).forEach(status => {
            if (status === 'Late' || status === 'Present (Clocked In)' || status === 'No Checkout') {
                totalLateCheckIns++;
            } 
            if (status === 'Absent' || status === 'Confirmed Absence') {
                totalAbsentDays++;
            }
        });
    });

    filteredData.forEach(item => {
      totalHours += item.duration;
      // We count an exception if the status isn't 'Present' or 'On Leave'
      if (!item.status.includes('Present') && !item.status.includes('On Leave') && item.status !== 'Public Holiday') {
        totalExceptions++;
      }
    });

    const avgHours = totalDaysCounted > 0 ? (totalHours / totalDaysCounted).toFixed(2) : '0.00';
    
    const chartData = [
      { name: 'On Time', count: filteredData.filter(item => item.status === 'Present').length },
      { name: 'Late', count: totalLateCheckIns },
      { name: 'Absent', count: totalAbsentDays },
      { name: 'On Leave', count: filteredData.filter(item => item.status.includes('On Leave')).length },
      { name: 'Holiday', count: filteredData.filter(item => item.status === 'Public Holiday').length },
    ].filter(item => item.count > 0);

    return {
      lateCheckIns: totalLateCheckIns,
      absentDays: totalAbsentDays,
      exceptions: totalExceptions,
      avgHours,
      chartData,
      filteredData
    };
  }, [filteredData]);

  // --------------------------------------------------------------------
  // 3. Employee Wise Summary Calculation
  // --------------------------------------------------------------------

  const employeeSummary = useMemo(() => {
    const summaryMap = {};
    
    // 1. Initialize map using the master employee list
    employeeReferenceList.forEach(emp => { 
      summaryMap[emp.id] = {
          id: emp.id,
          name: emp.name,
          dept: emp.dept, // Use dept_label from master list
          totalDays: 0,
          presentDays: 0,
          lateCount: 0,
          absentCount: 0,
          totalHours: 0,
          details: []
      };
    });

    // 2. Aggregate data from filtered attendance records
    filteredData.forEach(item => {
        const emp = summaryMap[item.id];
        if (emp) {
            emp.totalDays++;
            emp.totalHours += item.duration;
            emp.details.push(item);

            if (item.status === 'Present' || item.status === 'Late' || item.status === 'Present (Clocked In)') emp.presentDays++;
            if (item.status === 'Late' || item.status === 'Present (Clocked In)') emp.lateCount++;
            if (item.status === 'Absent' || item.status === 'Confirmed Absence') emp.absentCount++;
        }
    });

    // 3. Final calculation and structure
    return Object.values(summaryMap)
        .filter(emp => emp.totalDays > 0) // Only show employees with activity in the period
        .map(emp => ({
            ...emp,
            avgHours: emp.totalDays > 0 ? (emp.totalHours / emp.totalDays).toFixed(2) : '0.00',
            attendancePercentage: emp.totalDays > 0 ? ((emp.presentDays / emp.totalDays) * 100).toFixed(0) : '0',
        }));
  }, [filteredData, employeeReferenceList]);

  const selectedEmployeeDetails = employeeSummary.find(e => e.id === selectedEmployeeId);


  // --- Render Functions ---

  if (isLoadingAttendance || isLoadingEmployees || isLoadingDepartments) return <div className="p-6 text-xl">Loading attendance data...</div>;
  if (errorAttendance) return <div className="p-6 text-xl text-red-500">Error loading attendance records: {errorAttendance.message}</div>;


  const GeneralReportView = () => (
    <>
      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Avg. Daily Hours" value={`${generalSummary.avgHours} hrs`} icon={ClockIcon} color="#3B82F6" />
        <StatCard title="Total Late Check-Ins" value={generalSummary.lateCheckIns} icon={ClockIcon} color="#F59E0B" />
        <StatCard title="Total Absent Days" value={generalSummary.absentDays} icon={CalendarIcon} color="#EF4444" />
        <StatCard title="Total Exceptions" value={generalSummary.exceptions} icon={ChevronDownIcon} color="#8B5CF6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Actionable Exceptions Table */}
        <div className="bg-white p-5 rounded-xl shadow-md lg:col-span-2 border">
          <h2 className="text-xl font-semibold mb-4 text-red-600">
            Actionable Exceptions ({generalSummary.filteredData.filter(item => item.exception_reason).length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left">Employee</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Use exception_reason from backend */}
                {generalSummary.filteredData.filter(item => item.exception_reason).map(item => (
                  <tr key={`${item.id}-${item.date}`} className="border-t">
                    <td className="p-3">{item.employee_name}</td>
                    <td className="p-3">{item.currdate}</td>
                    <td className="p-3">
                      <StatusBadge status={item.final_status} />
                    </td>
                    <td className="p-3 text-yellow-600 font-medium">{item.exception_reason}</td>
                    <td className="p-3 text-center">
                      <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition">
                        Resolve/Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Distribution Chart */}
        {console.log(generalSummary.filteredData)}
        <div className="bg-white p-5 rounded-xl shadow-md border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Attendance Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generalSummary.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis allowDecimals={false} stroke="#6B7280" />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Bar dataKey="count" fill="#4C8CF7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Detailed Log Table */}
      <div className="bg-white p-5 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Detailed Daily Log ({generalSummary.filteredData.length} Records)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Check In</th>
                <th className="p-3 text-left">Check Out</th>
                <th className="p-3 text-left">Duration (h)</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-center">Face Auth</th>
                <th className="p-3 text-left">Final Status</th>
              </tr>
            </thead>
            <tbody>
              {generalSummary.filteredData.map(item => (
                <tr key={`${item.id}-${item.date}-log`} className="border-t hover:bg-gray-50">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.date}</td>
                  <td className="p-3 font-medium text-gray-700">{item.checkin || '-'}</td>
                  <td className="p-3 font-medium text-gray-700">{item.checkout || '-'}</td>
                  <td className="p-3 text-blue-600 font-semibold">
  {/* FIX: Ensure item.duration_hours is treated as a number (coalescing to 0 if null/undefined) */}
  {Number(item.duration_hours || 0).toFixed(2)}
</td>
                  <td className="p-3 flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4 text-gray-500" />
                    {item.locid || '-'}
                  </td>
                  <td className="p-3 text-center">
                    <StatusBadge status={item.faceStatus} isFace={true} />
                  </td>
                  <td className="p-3">
                    <StatusBadge status={item.exception} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const EmployeeWiseView = () => (
    <div className="bg-white p-5 rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Employee Summary
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">Employee (ID)</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Avg. Hrs/Day</th>
              <th className="p-3 text-left">Attendance %</th>
              <th className="p-3 text-left">Late Count</th>
              <th className="p-3 text-left">Absent Days</th>
              <th className="p-3 text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            {employeeSummary.map(emp => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => setSelectedEmployeeId(emp.id)}>
                    {emp.name} ({emp.id})
                </td>
                <td className="p-3">{emp.dept}</td>
                <td className="p-3 font-semibold">{emp.avgHours}</td>
                <td className="p-3">
                    <span className="font-semibold text-green-600">{emp.attendancePercentage}%</span>
                </td>
                <td className="p-3 text-yellow-600">{emp.lateCount}</td>
                <td className="p-3 text-red-600">{emp.absentCount}</td>
                <td className="p-3 text-center">
                    <button 
                        onClick={() => setSelectedEmployeeId(emp.id)}
                        className="text-xs bg-gray-200 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-300 transition"
                    >
                        View Log
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const EmployeeDetailModal = ({ employee, filteredData, onClose }) => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800">
            Attendance Log: {employee.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-blue-50 p-4 rounded-xl mb-4 flex justify-around text-center">
            <div className="text-sm">
                <p className="font-semibold text-blue-700">{employee.attendancePercentage}%</p>
                <p className="text-gray-500">Attendance Rate</p>
            </div>
            <div className="text-sm">
                <p className="font-semibold text-blue-700">{employee.lateCount}</p>
                <p className="text-gray-500">Late Arrivals</p>
            </div>
            <div className="text-sm">
                <p className="font-semibold text-blue-700">{employee.avgHours}h</p>
                <p className="text-gray-500">Avg. Daily Hours</p>
            </div>
        </div>

        {/* Detailed Log Table */}
        <h3 className="text-lg font-semibold mb-3">Daily Entries</h3>
        <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Check In</th>
                        <th className="p-3 text-left">Check Out</th>
                        <th className="p-3 text-left">Duration (h)</th>
                        <th className="p-3 text-left">Status/Exception</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(item => (
                        <tr key={item.currdate} className="border-t hover:bg-gray-50">
                            <td className="p-3">{item.date}</td>
                            <td className="p-3">{item.checkin || '-'}</td>
                            <td className="p-3">{item.checkout || '-'}</td>
                            <td className="p-3">{item.duration || '-'}</td>
                            
                            <td className="p-3">
                                {item.exception ? (
                                    <span className="text-red-500 font-medium">{item.exception}</span>
                                ) : (
                                    <StatusBadge status={item.status} />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Presense360 Attendance Reports
      </h1>

      {/* View Toggle */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setViewMode('general')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            viewMode === 'general' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border hover:bg-gray-100'
          }`}
        >
          General Report (Weekly/Monthly)
        </button>
        <button
          onClick={() => setViewMode('employee')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            viewMode === 'employee' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border hover:bg-gray-100'
          }`}
        >
          Employee Wise Report
        </button>
      </div>

      {/* Filtering and Controls Section (Applies to both views) */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-wrap items-center gap-4 border">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="border p-2 rounded-lg text-sm"
          >
            <option value="Today">Today</option>
            <option value="Last-7-Days">Last 7 Days</option>
            <option value="Month-to-Date">Month-to-Date</option>
            <option value="Last-Month">Last Month</option>
            <option value="Custom">Custom Range...</option>
          </select>
        </div>
        
        {/* Custom Date Pickers (Shown conditionally) */}
        {selectedDateRange === 'Custom' && (
            <>
                <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="border p-2 rounded-lg text-sm min-w-[150px]"
                    placeholder="Start Date"
                />
                <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="border p-2 rounded-lg text-sm min-w-[150px]"
                    placeholder="End Date"
                />
            </>
        )}
        
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-gray-500" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="border p-2 rounded-lg text-sm"
          >
            <option value="All">All Departments</option>
            {departmentOptions.map(dept => (
              <option key={dept.id} value={dept.label}>{dept.label}</option>
            ))}
          </select>
        </div>
        
        {/* NEW STATUS FILTER DROPDOWN */}
        {viewMode === 'general' && (
            <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-gray-500" />
                <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="border p-2 rounded-lg text-sm"
                >
                    {ATTENDANCE_STATUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        )}
        
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search Employee Name or ID"
            value={searchEmployee}
            onChange={(e) => setSearchEmployee(e.target.value)}
            className="border p-2 rounded-lg text-sm w-full"
          />
        </div>
      </div>

      {/* Conditional Content Rendering */}
      {viewMode === 'general' ? <GeneralReportView /> : <EmployeeWiseView />}

      {/* Employee Details Modal */}
      {selectedEmployeeId && selectedEmployeeDetails && (
          <EmployeeDetailModal 
            employee={selectedEmployeeDetails} 
            filteredData={selectedEmployeeDetails.details}
            onClose={() => setSelectedEmployeeId(null)}
          />
      )}
    </div>
  );
};

export default AttendanceReport;