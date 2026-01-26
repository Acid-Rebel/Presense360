import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'https://presense360-server.onrender.com/api';

/**
 * Helper to get the admin token from cookies
 */
const getAuthToken = () => {
    const name = "admin_token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
};

/**
 * Helper to decode the JWT payload on the client side
 */
const decodeJWT = (token) => {
    try {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
};

/**
 * Helper to generate headers with Authorization
 */
const getHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

// --- API Functions ---

const fetchEmployees = async () => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
        headers: getHeaders(),
    });
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error('Access denied: Insufficient privileges or expired session.');
        }
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data; 
};

const fetchLocations = async () => {
    const response = await fetch(`${API_BASE_URL}/locations`, {
        headers: getHeaders(),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data; 
};

const fetchDepartments = async () => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
        headers: getHeaders(),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
};

const addEmployee = async (employeeData) => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            ID: employeeData.id,
            Name: employeeData.name,
            mobile: employeeData.phone,
            Dept: employeeData.department,
            LOCID: employeeData.location
        }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add employee');
    }
    return response.json();
};

const updateEmployee = async (employeeData) => {
  const response = await fetch(`${API_BASE_URL}/employees/${employeeData.id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      Name: employeeData.name,
      mobile: employeeData.phone,
      Dept: employeeData.department,
      LOCID: employeeData.location
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update employee');
  }
  return response.json();
};

const deleteEmployee = async (id) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete employee');
    }
    return response.json();
};

const updateFaceStatus = async ({ id, status }) => {
    const response = await fetch(`${API_BASE_URL}/employees/face/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status: status }),
    });
    if (!response.ok) {
        throw new Error('Failed to update face status');
    }
    return response.json();
};

// --- Exported Hooks ---

export const useAdmin = () => {
    const token = getAuthToken();
    const decoded = decodeJWT(token);
    const role = decoded?.role || 'VIEW_ONLY';
    
    return {
        role,
        // isAuthorized check: Only SUPER_ADMIN and EMPLOYEE_ADMIN can edit/add
        isAuthorized: role === 'SUPER_ADMIN' || role === 'EMPLOYEE_ADMIN',
        username: decoded?.admin_id || 'Admin'
    };
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

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};