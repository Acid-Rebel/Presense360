import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Employees from './Pages/employees.jsx';
import HeaderSideNav from './Pages/Components/Header/HeaderSideNav.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <HeaderSideNav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </HeaderSideNav>
    </Router>
  </StrictMode>
);
