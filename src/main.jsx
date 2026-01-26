import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './Pages/Dashboard.jsx';
import Employees from './Pages/employees.jsx';
import AttendanceReport from './Pages/AttendanceReport.jsx';
import HeaderSideNav from './Pages/Components/Header/HeaderSideNav.jsx';
import LeaveDashboard from './Pages/LeaveRequest.jsx'
import SettingsPage from './Pages/Settings.jsx'
import AdminLogin from './Pages/Login.jsx';
import './index.css';

const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <QueryClientProvider client={queryClient}>
    <HashRouter>
      <Routes>
        {/* Public Route: Login is outside HeaderSideNav */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes: These will be wrapped by the Sidebar/Header */}
        <Route
          path="/*"
          element={
            <HeaderSideNav>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/attendance" element={<AttendanceReport />} />
                <Route path="/leave" element={<LeaveDashboard />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </HeaderSideNav>
          }
        />
      </Routes>
    </HashRouter>
  </QueryClientProvider>
</StrictMode>
);
