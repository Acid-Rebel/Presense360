import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = ' https://presense360-server.onrender.com/api';

/**
 * --- LOCATION GEOFENCING API ---
 */

// Fetch all geofences
const fetchLocations = async () => {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) throw new Error('Failed to fetch locations.');
    const data = await response.json();
    
    // Transform backend schema (id, coordinates) to UI format (id, points)
    return (data.data || []).map(loc => ({
        id: loc.id,
        points: typeof loc.coordinates === 'string' ? JSON.parse(loc.coordinates) : loc.coordinates
    }));
};

// Save (Upsert) a geofence
const saveLocation = async ({ id, coordinates }) => {
    const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, coordinates }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save location.');
    }
    return response.json();
};

// Delete a geofence
const deleteLocation = async (id) => {
    const response = await fetch(`${API_BASE_URL}/locations/${encodeURIComponent(id)}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete location.');
    }
    return response.json();
};

/**
 * --- SHIFT SETTINGS API ---
 */

// Fetch timing caps
const fetchShiftSettings = async () => {
    const response = await fetch(`${API_BASE_URL}/settings/shift`);
    if (!response.ok) throw new Error('Failed to fetch shift settings.');
    const data = await response.json();
    return data.data || { entryCap: '09:00', exitCap: '18:00' };
};

// Update timing caps
const updateShiftSettings = async (settings) => {
    const response = await fetch(`${API_BASE_URL}/settings/shift`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to update shift settings.');
    return response.json();
};

/**
 * --- EXPORTED HOOKS ---
 */

export const useLocations = () => {
    return useQuery({
        queryKey: ['locations'],
        queryFn: fetchLocations,
    });
};

export const useSaveLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
};

export const useDeleteLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
};

export const useShiftSettings = () => {
    return useQuery({
        queryKey: ['shiftSettings'],
        queryFn: fetchShiftSettings,
    });
};

export const useUpdateShiftSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateShiftSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shiftSettings'] });
        },
    });
};