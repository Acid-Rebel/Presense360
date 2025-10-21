import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Base URL is synchronized with useEmployees.js
const API_BASE_URL = 'https://presense360-server.onrender.com/api'; 

// --- FETCH FUNCTIONS ---

/**
 * Function to fetch ALL attendance records for the Admin Report Dashboard.
 */
const fetchAttendanceRecords = async () => {
    // NOTE: This endpoint retrieves all records for the admin portal.
    const response = await fetch(`${API_BASE_URL}/attendance/report`); 
    
    if (!response.ok) {
        // Attempt to read the error message from the body if the response failed
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch attendance data.');
    }
    
    const data = await response.json();

    // --- CLIENT-SIDE PROCESSING ---
    // The backend returns final status strings and duration_hours.
    // We map the raw response (data.data) to ensure numeric fields are correctly parsed.
    const processedRecords = (data.data || []).map(record => ({
        // Map raw database fields to clear frontend keys:
        id: record.id,
        name: record.employee_name, // Employee name added via join in backend
        date: record.currdate,       // Date of the record
        checkin: record.checkin,
        checkout: record.checkout,
        locId: record.locid,
        status: record.final_status, // Inferred status string (e.g., 'Late', 'On Leave')
        exception: record.exception_reason, // Reason for exception, if any
        dept: record.dept_label,

        // Ensure numeric fields are correctly typed:
        duration: parseFloat(record.duration_hours) || 0,
        // The backend status 'type' is usually what was previously called 'faceStatus'
        // If the backend doesn't return faceStatus directly, you might need to infer it.
        // Assuming 'faceStatus' (0, 1, 2) is a separate field needed for a badge, 
        // but since it's not in the report query, we'll use a placeholder structure
        // that matches the original frontend logic, assuming the backend can supply it
        // or we use a separate fetch. For now, we assume it's part of the record structure.
        faceStatus: record.face_status ? parseInt(record.face_status, 10) : 2, // Placeholder default to Registered (2)
    }));
    // --- END CLIENT-SIDE PROCESSING ---
    
    return processedRecords; 
};

// --- REACT QUERY HOOKS (Exports) ---

/**
 * Fetches data required for the Attendance Report (General and Employee Views).
 */
export const useAttendanceRecords = () => {
    return useQuery({
        queryKey: ['attendanceRecords'],
        queryFn: fetchAttendanceRecords,
        // Keep staleTime high since reports don't need real-time updates
        staleTime: 5 * 60 * 1000, 
    });
};