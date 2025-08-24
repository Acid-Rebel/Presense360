import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:3001/api';

// Function to fetch all employees
const fetchEmployees = async () => {
    const response = await fetch(`${API_BASE_URL}/employees`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data; 
};

// Function to fetch all available locations
const fetchLocations = async () => {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data; 
};

// Function to fetch all available departments
const fetchDepartments = async () => {
    const response = await fetch(`${API_BASE_URL}/departments`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
};

// Function to add a new employee
const addEmployee = async (employeeData) => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ID: employeeData.id,
            Name: employeeData.name,
            mobile: employeeData.phone,
            Dept: employeeData.department,
            LOCID: employeeData.location
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to add employee');
    }
    return response.json();
};

// Function to delete an employee
const deleteEmployee = async (id) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete employee');
    }
    return response.json();
};

// Function to update the face registration status
const updateFaceStatus = async ({ id, status }) => {
    const response = await fetch(`${API_BASE_URL}/employees/face/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status }),
    });
    if (!response.ok) {
        throw new Error('Failed to update face status');
    }
    return response.json();
};

export const useEmployees = () => {
    return useQuery({
        queryKey: ['employees'],
        queryFn: fetchEmployees,
    });
};

export const useLocations = () => {
    return useQuery({
        queryKey: ['locations'],
        queryFn: fetchLocations,
    });
};

export const useDepartments = () => {
    return useQuery({
        queryKey: ['departments'],
        queryFn: fetchDepartments,
    });
};

export const useAddEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
};

export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
};

export const useUpdateFaceStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateFaceStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
};