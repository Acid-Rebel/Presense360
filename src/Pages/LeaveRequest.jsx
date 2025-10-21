import React, { useState, useMemo } from 'react';
import { CalendarDaysIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon, ChevronDownIcon, FunnelIcon, TrashIcon, CheckIcon, CalendarIcon } from '@heroicons/react/24/outline';

// Mock Data Source for the HR Dashboard
const MOCK_REQUESTS = [
    { id: 101, empId: 'E1001', name: 'Alice Johnson', type: 'Annual Leave', days: 5, status: 'Pending', requested: '2025-10-15', start: '2025-11-01', end: '2025-11-05', reason: 'Family vacation' },
    { id: 102, empId: 'E1002', name: 'Bob Smith', type: 'Sick Leave', days: 1, status: 'Pending', requested: '2025-10-20', start: '2025-10-21', end: '2025-10-21', reason: 'Flu symptoms' },
    { id: 103, empId: 'E1003', name: 'Charlie Brown', type: 'Personal Leave', days: 3, status: 'Approved', requested: '2025-09-01', start: '2025-12-24', end: '2025-12-26', reason: 'Holiday travel' },
    { id: 104, empId: 'E1004', name: 'Dana Scully', type: 'Annual Leave', days: 10, status: 'Rejected', requested: '2025-08-10', start: '2026-01-15', end: '2026-01-26', reason: 'Staffing conflict' },
    { id: 105, empId: 'E1005', name: 'Eve', type: 'Sick Leave', days: 1, status: 'Pending', requested: '2025-10-21', start: '2025-10-21', end: '2025-10-21', reason: 'Migraine' },
    { id: 106, empId: 'E1001', name: 'Alice Johnson', type: 'Sick Leave', days: 2, status: 'Approved', requested: '2025-07-05', start: '2025-07-10', end: '2025-07-11', reason: 'Fever' },
    { id: 107, empId: 'E1001', name: 'Alice Johnson', type: 'Annual Leave', days: 1, status: 'Approved', requested: '2025-01-01', start: '2025-01-05', end: '2025-01-05', reason: 'Early vacation' },
];

// Mock data for employee balances (Total Available)
const MOCK_TOTAL_BALANCES = {
    'Annual Leave': 20,
    'Sick Leave': 10,
    'Personal Leave': 5,
};

const LEAVE_TYPES = ['All Types', 'Annual Leave', 'Sick Leave', 'Personal Leave', 'Unpaid Leave'];

// --- Utility Components ---

const StatusBadge = ({ status }) => {
    let colorClass;
    let icon;

    switch (status) {
        case 'Approved':
            colorClass = 'bg-green-100 text-green-700';
            icon = CheckCircleIcon;
            break;
        case 'Rejected':
            colorClass = 'bg-red-100 text-red-700';
            icon = XCircleIcon;
            break;
        case 'Pending':
            colorClass = 'bg-yellow-100 text-yellow-700';
            icon = ClockIcon;
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-700';
            icon = ClockIcon;
    }

    const IconComponent = icon;

    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${colorClass}`}>
            <IconComponent className="w-3 h-3 mr-1" />
            {status}
        </span>
    );
};

const StatCard = ({ title, value, color }) => (
    <div className={`flex flex-col p-4 bg-white rounded-xl shadow-md border-l-4`} style={{ borderColor: color }}>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
);

// --- Main Component: HR Leave Dashboard ---

const HRLeaveDashboard = () => {
    const [statusFilter, setStatusFilter] = useState('Pending');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [searchQuery, setSearchQuery] = useState('');
    const [isViewingDetails, setIsViewingDetails] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    
    // New State for General Date Filter
    const [generalDateRange, setGeneralDateRange] = useState('All Time');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    
    // State for History Filter in Modal
    const [historyDateRange, setHistoryDateRange] = useState({ start: '', end: '' });

    // NOTE: Anchor date for mock filtering is 2025-10-21 (Today)
    const REFERENCE_DATE = new Date('2025-10-21T12:00:00'); 

    // --- Date Calculation Utility ---
    const calculateDateRange = (rangeType, start, end) => {
        let startDate = new Date(REFERENCE_DATE);
        let endDate = new Date(REFERENCE_DATE);
        endDate.setHours(23, 59, 59, 999);

        switch (rangeType) {
            case 'Today':
                break;
            case '1-Day-Ago':
                startDate.setDate(startDate.getDate() - 1);
                endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'Last-7-Days':
                startDate.setDate(startDate.getDate() - 6);
                break;
            case 'Month-to-Date':
                startDate.setDate(1);
                break;
            case 'Custom':
                if (start && end) {
                    startDate = new Date(start);
                    endDate = new Date(end);
                    endDate.setHours(23, 59, 59, 999);
                } else {
                    return null; // Return null if custom range is incomplete
                }
                break;
            case 'All Time':
            default:
                return { startDate: new Date(0), endDate }; // Very old start date
        }
        
        startDate.setHours(0, 0, 0, 0);
        return { startDate, endDate };
    };

    // Filtered Request List
    const filteredRequests = useMemo(() => {
        const dateRange = calculateDateRange(generalDateRange, customStartDate, customEndDate);
        
        return MOCK_REQUESTS.filter(req => {
            // 1. Status Filter
            if (statusFilter !== 'All' && req.status !== statusFilter) return false;
            
            // 2. Type Filter
            if (typeFilter !== 'All Types' && req.type !== typeFilter) return false;

            // 3. Search Filter (Name or ID)
            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                if (!req.name.toLowerCase().includes(lowerQuery) && !req.empId.toLowerCase().includes(lowerQuery)) {
                    return false;
                }
            }
            
            // 4. Date Filter (Checks if requested date falls within the range)
            if (dateRange) {
                const requestedDate = new Date(req.requested);
                // Normalize requested date to just the date part for accurate comparison
                const requestedDateOnly = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate());
                
                if (requestedDateOnly < dateRange.startDate || requestedDateOnly > dateRange.endDate) {
                    return false;
                }
            }
            return true;
        });
    }, [statusFilter, typeFilter, searchQuery, generalDateRange, customStartDate, customEndDate]);

    // Summary Calculations
    const summary = useMemo(() => ({
        pending: MOCK_REQUESTS.filter(r => r.status === 'Pending').length,
        approved: MOCK_REQUESTS.filter(r => r.status === 'Approved').length,
        rejected: MOCK_REQUESTS.filter(r => r.status === 'Rejected').length,
    }), []);

    // --- Modal Data Processing ---
    const employeeLeaveUsage = useMemo(() => {
        if (!selectedRequest) return {};
        
        // Calculate total days used/pending per type for the selected employee
        const usage = {};
        MOCK_REQUESTS.filter(r => r.empId === selectedRequest.empId && r.status !== 'Rejected').forEach(r => {
            usage[r.type] = (usage[r.type] || 0) + r.days;
        });
        
        // Generate the final balance list
        return Object.keys(MOCK_TOTAL_BALANCES).map(type => {
            const total = MOCK_TOTAL_BALANCES[type];
            const used = usage[type] || 0;
            const remaining = total - used;
            return { type, total, used, remaining };
        });
    }, [selectedRequest]);
    
    const employeeHistory = useMemo(() => {
        if (!selectedRequest) return [];
        
        // Get all approved/rejected history for the selected employee
        let history = MOCK_REQUESTS.filter(r => 
            r.empId === selectedRequest.empId && r.status !== 'Pending'
        );
        
        // Apply date filter if set
        if (historyDateRange.start && historyDateRange.end) {
            const startDate = new Date(historyDateRange.start);
            const endDate = new Date(historyDateRange.end);
            endDate.setHours(23, 59, 59, 999); // Ensure end date includes the whole day
            
            history = history.filter(item => {
                const itemStartDate = new Date(item.start);
                return itemStartDate >= startDate && itemStartDate <= endDate;
            });
        }
        
        return history.sort((a, b) => new Date(b.requested) - new Date(a.requested));
    }, [selectedRequest, historyDateRange]);
    // --- End Modal Data Processing ---

    const handleAction = (id, newStatus) => {
        // --- Placeholder Mutation Logic ---
        console.log(`Request ID ${id} set to ${newStatus}`);
        alert(`Request ID ${id} set to ${newStatus}`);
        // In a real app, this would trigger a state update and a server call
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setHistoryDateRange({ start: '', end: '' }); // Reset filter when opening
        setIsViewingDetails(true);
    };

    const RequestDetailModal = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Review Leave Request - {selectedRequest.name}</h3>
                    <button onClick={() => setIsViewingDetails(false)} className="text-gray-400 hover:text-gray-700">&times;</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Column 1: Current Request Details */}
                    <div className="lg:col-span-1 space-y-4 pr-4 border-r lg:border-r-0">
                        <h4 className="text-lg font-semibold text-blue-600 mb-2">Current Request Details</h4>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-500 text-sm">Employee / ID</p>
                            <p className="font-semibold">{selectedRequest.name} ({selectedRequest.empId})</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-500 text-sm">Leave Type</p>
                                <p className="font-semibold text-blue-600">{selectedRequest.type}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-500 text-sm">Total Days</p>
                                <p className="text-xl font-extrabold text-red-600">{selectedRequest.days}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-500 text-sm">Period</p>
                            <p className="font-semibold">{selectedRequest.start} <ArrowRightIcon className="w-4 h-4 inline mx-1" /> {selectedRequest.end}</p>
                        </div>
                        
                        <div className="space-y-1">
                             <p className="text-gray-500 text-sm font-medium">Reason Submitted</p>
                             <p className="p-3 border rounded-lg bg-gray-50 text-gray-700 text-sm">{selectedRequest.reason}</p>
                        </div>
                        
                         <div className="mt-4 pt-4 border-t flex justify-end space-x-3">
                            <button
                                onClick={() => handleAction(selectedRequest.id, 'Rejected')}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                <TrashIcon className="w-4 h-4 mr-2" /> Reject
                            </button>
                            <button
                                onClick={() => handleAction(selectedRequest.id, 'Approved')}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                <CheckIcon className="w-4 h-4 mr-2" /> Approve
                            </button>
                        </div>
                    </div>
                    
                    {/* Column 2 & 3: Balances and History */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Leave Balances & History</h4>
                        
                        {/* Leave Balances */}
                        <div className="bg-blue-50 p-4 rounded-xl shadow-inner grid grid-cols-3 gap-4">
                            {employeeLeaveUsage.map(item => (
                                <div key={item.type} className="text-center">
                                    <p className="text-xs text-gray-600">{item.type} (Total: {item.total})</p>
                                    <p className={`text-2xl font-extrabold ${item.remaining < 0 ? 'text-red-600' : 'text-blue-800'}`}>
                                        {item.remaining}
                                    </p>
                                    <p className="text-sm font-medium text-gray-600">Remaining</p>
                                </div>
                            ))}
                        </div>
                        
                        {/* History Filter */}
                        <div className="flex items-center space-x-3">
                            <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Filter History:</span>
                            <input
                                type="date"
                                value={historyDateRange.start}
                                onChange={(e) => setHistoryDateRange(prev => ({ ...prev, start: e.target.value }))}
                                className="border p-1 rounded-lg text-sm"
                            />
                            <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                value={historyDateRange.end}
                                onChange={(e) => setHistoryDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="border p-1 rounded-lg text-sm"
                            />
                        </div>
                        
                        {/* History Table */}
                        <div className="overflow-x-auto border rounded-xl shadow-sm">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 text-left">Period</th>
                                        <th className="p-3 text-left">Type</th>
                                        <th className="p-3 text-center">Days</th>
                                        <th className="p-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeeHistory.map((leave, index) => (
                                        <tr key={index} className="border-t hover:bg-gray-50">
                                            <td className="p-3 text-gray-700 text-xs">{leave.start} - {leave.end}</td>
                                            <td className="p-3 font-medium">{leave.type}</td>
                                            <td className="p-3 text-center font-bold">{leave.days}</td>
                                            <td className="p-3 text-center">
                                                <StatusBadge status={leave.status} />
                                            </td>
                                        </tr>
                                    ))}
                                    {employeeHistory.length === 0 && (
                                        <tr><td colSpan="4" className="p-4 text-center text-gray-500">No history found for the selected period.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-2">
                HR Leave Request Dashboard
            </h1>

            {/* --- Summary Cards --- */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Pending" value={summary.pending} color="#F59E0B" />
                <StatCard title="Total Approved" value={summary.approved} color="#10B981" />
                <StatCard title="Total Rejected" value={summary.rejected} color="#EF4444" />
            </div>

            {/* --- Filters and Controls --- */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-wrap items-center gap-4 border">
                <FunnelIcon className="w-5 h-5 text-gray-500" />
                
                {/* General Date Filter */}
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5 text-gray-500" />
                    <select
                        value={generalDateRange}
                        onChange={(e) => setGeneralDateRange(e.target.value)}
                        className="border p-2 rounded-lg text-sm"
                    >
                        <option value="All Time">All Time</option>
                        <option value="Today">Today</option>
                        <option value="1-Day-Ago">1 Day Ago</option>
                        <option value="Last-7-Days">Last 7 Days</option>
                        <option value="Month-to-Date">Month-to-Date</option>
                        <option value="Custom">Custom Range...</option>
                    </select>
                </div>
                
                {/* Custom Date Pickers (Shown conditionally) */}
                {generalDateRange === 'Custom' && (
                    <>
                        <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="border p-2 rounded-lg text-sm min-w-[150px]"
                            placeholder="Start Date"
                        />
                        <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="border p-2 rounded-lg text-sm min-w-[150px]"
                            placeholder="End Date"
                        />
                    </>
                )}

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2 rounded-lg text-sm"
                >
                    <option value="Pending">Pending Requests</option>
                    <option value="All">All Requests</option>
                    <option value="Approved">Approved Only</option>
                    <option value="Rejected">Rejected Only</option>
                </select>

                {/* Type Filter */}
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border p-2 rounded-lg text-sm"
                >
                    {LEAVE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by Employee Name/ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border p-2 rounded-lg text-sm flex-1 min-w-[200px]"
                />
            </div>

            {/* --- Requests Table --- */}
            <div className="bg-white rounded-xl shadow-lg border">
                <div className="p-4 text-lg font-semibold text-gray-700 border-b">
                    {statusFilter} Requests ({filteredRequests.length})
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="p-3 text-left">Employee</th>
                                <th className="p-3 text-left">Type</th>
                                <th className="p-3 text-left">Period</th>
                                <th className="p-3 text-left">Days</th>
                                <th className="p-3 text-left">Requested On</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(req => (
                                <tr key={req.id} className="border-t hover:bg-gray-50">
                                    {/* FIX: Attach handleViewDetails to the employee name cell */}
                                    <td 
                                        className="p-3 font-medium text-blue-600 cursor-pointer hover:underline"
                                        onClick={() => handleViewDetails(req)}
                                    >
                                        {req.name} ({req.empId})
                                    </td>
                                    <td className="p-3 text-blue-600">{req.type}</td>
                                    <td className="p-3 text-gray-700">
                                        {req.start} to {req.end}
                                    </td>
                                    <td className="p-3 font-bold text-red-600">{req.days}</td>
                                    <td className="p-3 text-gray-500 text-xs">{req.requested}</td>
                                    <td className="p-3 text-center">
                                        <StatusBadge status={req.status} />
                                    </td>
                                    <td className="p-3 text-center space-x-2">
                                        {req.status === 'Pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleAction(req.id, 'Approved')} 
                                                    className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition"
                                                    title="Approve Request"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(req.id, 'Rejected')} 
                                                    className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                    title="Reject Request"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <button 
                                                onClick={() => handleViewDetails(req)}
                                                className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                                            >
                                                View Details
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-10 text-center text-gray-500">No requests found matching the current filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Detail Modal --- */}
            {isViewingDetails && selectedRequest && <RequestDetailModal />}
        </div>
    );
};

export default HRLeaveDashboard;
