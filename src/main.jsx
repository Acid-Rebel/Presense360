import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './Pages/Dashboard';
import Employees from './Pages/employees.jsx';
import HeaderSideNav from './Pages/Components/Header/HeaderSideNav.jsx';
import './index.css';

const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <Router>
      <HeaderSideNav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </HeaderSideNav>
    </Router>
   </QueryClientProvider>
  </StrictMode>
);
