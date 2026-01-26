import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Clock, Trash2, Plus, Save, Settings as SettingsIcon, Navigation,
  CheckCircle2, AlertCircle, Map as MapIcon, X, Layers, Loader2, Maximize,
  ChevronDown, Building2, ShieldAlert
} from 'lucide-react';
import { 
  useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider 
} from '@tanstack/react-query';

/**
 * --- AUTH HELPERS ---
 */
const getAuthToken = () => {
    const name = "admin_token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return null;
};

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
        return null;
    }
};

const useAdmin = () => {
    const token = getAuthToken();
    const decoded = decodeJWT(token);
    const role = decoded?.role || 'VIEW_ONLY';
    return {
        role,
        isSuperAdmin: role === 'SUPER_ADMIN',
        username: decoded?.admin_id || 'Admin'
    };
};

/**
 * --- API LAYER ---
 */
const BASE_URL = 'https://presense360-server.onrender.com/api'; 

const getHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const getLocations = async () => {
    const response = await fetch(`${BASE_URL}/settings/locations`, { headers: getHeaders() });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data; 
};

export const getDepartments = async () => {
    const response = await fetch(`${BASE_URL}/departments`, { headers: getHeaders() });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data; 
};

export const saveLocation = async (locationData) => {
    const response = await fetch(`${BASE_URL}/settings/locations`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(locationData)
    });
    if (!response.ok) throw new Error('Failed to save location');
    return response.json();
};

export const deleteLocation = async (id) => {
    const response = await fetch(`${BASE_URL}/settings/locations/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete location');
    return response.json();
};

const fetchShiftSettings = async (deptId) => {
    const response = await fetch(`${BASE_URL}/settings/shift/${deptId}`, { headers: getHeaders() });
    if (!response.ok) return { entryCap: '09:00', exitCap: '18:00' };
    const result = await response.json();
    return result.data || { entryCap: '09:00', exitCap: '18:00' };
};

const updateShiftSettings = async ({ deptId, entryCap, exitCap }) => {
    const response = await fetch(`${BASE_URL}/settings/shift`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ deptId, entryCap, exitCap }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update shift settings.');
    }
    return response.json();
};

/**
 * --- HOOKS ---
 */
const useSettingsHooks = (selectedDeptId) => {
    const queryClient = useQueryClient();
    const locationsQuery = useQuery({ queryKey: ['locations'], queryFn: getLocations });
    const shiftSettingsQuery = useQuery({ 
        queryKey: ['shiftSettings', selectedDeptId], 
        queryFn: () => fetchShiftSettings(selectedDeptId),
        enabled: !!selectedDeptId
    });
    const departmentsQuery = useQuery({ queryKey: ['departments'], queryFn: getDepartments });

    const saveLocationMutation = useMutation({
        mutationFn: saveLocation,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
    });

    const deleteLocationMutation = useMutation({
        mutationFn: deleteLocation,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
    });

    const updateShiftMutation = useMutation({
        mutationFn: updateShiftSettings,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shiftSettings', selectedDeptId] }),
    });

    return {
        locations: locationsQuery.data || [],
        shiftData: shiftSettingsQuery.data,
        isShiftLoading: shiftSettingsQuery.isLoading,
        departments: departmentsQuery.data || [],
        saveLocationMutation,
        deleteLocationMutation,
        updateShiftMutation
    };
};

const SettingsPage = () => {
  const { role, isSuperAdmin } = useAdmin();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedDept, setSelectedDept] = useState('all');
  
  const { 
    locations, shiftData, isShiftLoading, departments,
    saveLocationMutation, deleteLocationMutation, updateShiftMutation
  } = useSettingsHooks(selectedDept);
  
  const [shiftForm, setShiftForm] = useState({ entryCap: '09:00', exitCap: '18:00' });
  const [currentPoints, setCurrentPoints] = useState([]);
  const [newLocationName, setNewLocationName] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const drawingLayerRef = useRef(null);
  const savedLayersRef = useRef([]);

  useEffect(() => {
    if (shiftData) {
      setShiftForm({
        entryCap: shiftData.entryCap || '09:00',
        exitCap: shiftData.exitCap || '18:00'
      });
    }
  }, [shiftData]);

  useEffect(() => {
    if (window.L) { setMapLoaded(true); return; }
    const leafletCss = document.createElement('link');
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCss);
    const leafletJs = document.createElement('script');
    leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJs.async = true;
    leafletJs.onload = () => setMapLoaded(true);
    document.head.appendChild(leafletJs);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || !window.L) return;
    const L = window.L;
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([10.9025, 76.8962], 17);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(mapInstanceRef.current);
      
      // ONLY ALLOW CLICKS IF SUPER ADMIN
      mapInstanceRef.current.on('click', (e) => {
        if (isSuperAdmin) {
            setCurrentPoints(prev => [...prev, [e.latlng.lat, e.latlng.lng]]);
        }
      });
    }
    savedLayersRef.current.forEach(layer => layer.remove());
    savedLayersRef.current = [];
    locations.forEach(loc => {
      const polyCoords = loc.coordinates || loc.points;
      if (!polyCoords || !Array.isArray(polyCoords) || polyCoords.length < 3) return;
      const poly = L.polygon(polyCoords, { color: '#6366f1', fillOpacity: 0.2, weight: 2 }).addTo(mapInstanceRef.current);
      poly.bindPopup(`<b>${loc.id}</b>`);
      savedLayersRef.current.push(poly);
    });
    if (drawingLayerRef.current) drawingLayerRef.current.remove();
    if (currentPoints.length > 0) {
      const layerGroup = L.layerGroup().addTo(mapInstanceRef.current);
      currentPoints.forEach(p => L.circleMarker(p, { radius: 4, color: '#f59e0b' }).addTo(layerGroup));
      if (currentPoints.length >= 3) L.polygon(currentPoints, { color: '#f59e0b', dashArray: '5, 5', fillOpacity: 0.1 }).addTo(layerGroup);
      else if (currentPoints.length === 2) L.polyline(currentPoints, { color: '#f59e0b', dashArray: '5, 5' }).addTo(layerGroup);
      drawingLayerRef.current = layerGroup;
    }
  }, [mapLoaded, locations, currentPoints, isSuperAdmin]);

  const showStatus = (msg, type = "success") => {
    setStatusMessage({ msg, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleUpdateShift = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    try {
      await updateShiftMutation.mutateAsync({ deptId: selectedDept, ...shiftForm });
      showStatus("Shift updated successfully");
    } catch (err) {
      showStatus(err.message, "error");
    }
  };

  const focusOnLocation = (loc) => {
    const coords = loc.coordinates || loc.points;
    if (!mapInstanceRef.current || !window.L || !coords?.length) return;
    mapInstanceRef.current.fitBounds(window.L.latLngBounds(coords), { padding: [50, 50], animate: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <nav className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-indigo-600">Settings</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="text-sm font-semibold text-slate-500 mt-0.5">Configure geofencing boundaries and shift protocols</p>
          </div>
          
          {/* ROLE INDICATOR */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm ${
            isSuperAdmin ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-amber-50 border-amber-100 text-amber-700'
          }`}>
            {isSuperAdmin ? <ShieldAlert size={14} /> : <Clock size={14} />}
            <span className="text-[10px] font-black uppercase tracking-tighter">
              {isSuperAdmin ? 'Super Admin Mode' : 'Read-Only Access'}
            </span>
          </div>
        </div>

        {statusMessage && (
          <div className={`fixed top-6 right-6 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border z-[2000] animate-in fade-in slide-in-from-top-2 ${
            statusMessage.type === 'success' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-red-600 text-white border-red-500'
          }`}>
            <span className="text-xs font-bold uppercase">{statusMessage.msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" />
                <h2 className="font-bold text-xs uppercase tracking-tight">Shift Configuration</h2>
              </div>
              <form onSubmit={handleUpdateShift} className="p-5 space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <Building2 size={12} /> Target Department
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 bg-slate-50 appearance-none focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer text-sm"
                    >
                      <option value="all">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept.ID || dept.id} value={dept.ID || dept.id}>{dept.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 relative">
                  {(isShiftLoading) && (
                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-sm rounded-lg">
                      <Loader2 size={16} className="animate-spin text-indigo-500" />
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Entry Start</label>
                    <input 
                      type="time" 
                      value={shiftForm.entryCap} 
                      onChange={(e) => setShiftForm({...shiftForm, entryCap: e.target.value})} 
                      disabled={!isSuperAdmin}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold text-slate-700 bg-slate-50 text-sm disabled:opacity-50" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Exit End</label>
                    <input 
                      type="time" 
                      value={shiftForm.exitCap} 
                      onChange={(e) => setShiftForm({...shiftForm, exitCap: e.target.value})} 
                      disabled={!isSuperAdmin}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold text-slate-700 bg-slate-50 text-sm disabled:opacity-50" 
                    />
                  </div>
                </div>
                
                {/* HIDE BUTTON IF NOT SUPER ADMIN */}
                {isSuperAdmin && (
                    <button 
                      type="submit" 
                      disabled={updateShiftMutation.isPending} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black text-[10px] uppercase py-3 rounded-xl shadow-md active:scale-95 flex items-center justify-center gap-2 transition-all"
                    >
                      {updateShiftMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
                      Update Shift
                    </button>
                )}
              </form>
            </section>

            {currentPoints.length > 0 && isSuperAdmin && (
              <section className="bg-slate-900 rounded-2xl p-4 text-white shadow-xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-3 text-[10px] font-black uppercase text-indigo-400">
                  <span>Vertex Queue</span>
                  <button onClick={() => setCurrentPoints([])}><X size={14}/></button>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {currentPoints.map((p, i) => (
                    <div key={i} className="flex justify-between bg-slate-800 p-2 rounded text-[10px] font-mono">
                      <span className="text-slate-500">#{i+1}</span>
                      <span>{p[0].toFixed(4)}, {p[1].toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-8 space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2 font-bold text-xs uppercase"><MapIcon size={16} className="text-indigo-600" /> Boundary Designer</div>
                
                {/* HIDE INPUTS IF NOT SUPER ADMIN */}
                {isSuperAdmin && (
                    <div className="flex gap-2">
                        <input type="text" placeholder="Location Name" value={newLocationName} onChange={(e) => setNewLocationName(e.target.value)} className="px-3 py-2 text-xs rounded-lg border border-slate-200 w-32 md:w-48 font-bold shadow-inner" />
                        <button 
                            onClick={async (e) => {
                            e.preventDefault();
                            if (!newLocationName || currentPoints.length < 3) return showStatus("Name + 3 points required", "error");
                            let final = [...currentPoints];
                            if (final[0][0] !== final[final.length-1][0]) final.push(final[0]);
                            try { await saveLocationMutation.mutateAsync({ id: newLocationName, coordinates: final }); setNewLocationName(''); setCurrentPoints([]); showStatus("Geofence saved"); }
                            catch (err) { showStatus(err.message, "error"); }
                            }} 
                            disabled={currentPoints.length < 3 || saveLocationMutation.isPending} 
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white text-[10px] font-black uppercase px-4 py-2 rounded-lg transition-all"
                        >
                            {saveLocationMutation.isPending ? 'Saving...' : 'Save Zone'}
                        </button>
                    </div>
                )}
              </div>
              <div className="h-[450px] w-full relative">
                <div ref={mapContainerRef} className="h-full w-full" />
                {!mapLoaded && <div className="absolute inset-0 bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>}
                {!isSuperAdmin && mapLoaded && (
                    <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                        <AlertCircle size={12} /> Interactive drawing disabled for your role
                    </div>
                )}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-xs uppercase text-slate-500">Active Registry</h3>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{locations.length} Zones</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50">
                    {locations.map((loc) => (
                      <tr key={loc.id} className="hover:bg-slate-50/50 group transition-all">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-all"><MapPin size={14} /></div>
                          <span className="font-bold text-sm text-slate-700 uppercase">{loc.id}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded">{(loc.coordinates || loc.points || []).length} Points</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => focusOnLocation(loc)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Maximize size={16}/></button>
                            
                            {/* HIDE DELETE BUTTON IF NOT SUPER ADMIN */}
                            {isSuperAdmin && (
                                <button onClick={() => { if(window.confirm('Delete geofence?')) deleteLocationMutation.mutate(loc.id) }} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; } .leaflet-container { z-index: 1 !important; cursor: ${isSuperAdmin ? 'crosshair' : 'grab'} !important; border-radius: 0 0 1rem 1rem; }`}</style>
    </div>
  );
};

const queryClient = new QueryClient();
const App = () => (<QueryClientProvider client={queryClient}><SettingsPage /></QueryClientProvider>);
export default App;