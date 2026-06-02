import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ZoneList from './components/ZoneList';
import ZoneSensors from './components/ZoneSensors';
import AddZone from './components/AddZone';
import AddSensor from './components/AddSensor';
import EditSensor from './components/EditSensor';
import Subscriptions from './components/Subscriptions';
import Profile from './components/Profile';
import CreateReport from './components/CreateReport';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const hasToken = document.cookie.includes('access_token_cookie');
    if (!hasToken) {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const navLinkStyle = { 
    color: 'white', 
    textDecoration: 'none', 
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'color 0.2s'
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#f4f7f6', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
        
        {isLoggedIn && (
          <nav style={{ 
            background: '#1a2a3a', 
            padding: '0 30px', 
            height: '65px', 
            display: 'flex', 
            gap: '25px', 
            alignItems: 'center', 
            boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
          }}>
            <b style={{ color: '#3498db', fontSize: '1.3rem', marginRight: '30px', letterSpacing: '1px' }}>
              VENT-CONTROL
            </b>
            
            <Link to="/dashboard" style={navLinkStyle}>Рабочий стол</Link>
            <Link to="/zones" style={navLinkStyle}>Зоны мониторинга</Link>
            <Link to="/subscriptions" style={navLinkStyle}>Оповещения</Link>
            <Link to="/report" style={navLinkStyle}>Создать отчет</Link>
            <Link to="/profile" style={navLinkStyle}>Профиль</Link>

            <button 
              onClick={handleLogout} 
              style={{ 
                marginLeft: 'auto', 
                background: '#e74c3c', 
                color: 'white', 
                border: 'none', 
                padding: '8px 18px', 
                borderRadius: '5px', 
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Выход
            </button>
          </nav>
        )}
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            duration: 5000,
            style: { borderRadius: '10px', background: '#333', color: '#fff' }
          }} 
        />

        <div style={{ 
          maxWidth: '1200px', 
          margin: '40px auto', 
          padding: '0 20px'
        }}>
          <div style={{ 
            background: 'white', 
            padding: '35px', 
            borderRadius: '12px', 
            boxShadow: '0 5px 25px rgba(0,0,0,0.05)',
            minHeight: '60vh'
          }}>
            <Routes>
              <Route path="/login" element={<Login setAuth={setIsLoggedIn} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/zones" element={<ProtectedRoute><ZoneList /></ProtectedRoute>} />
              <Route path="/zones/:zoneId/sensors" element={<ProtectedRoute><ZoneSensors /></ProtectedRoute>} />
              <Route path="/add-zone" element={<ProtectedRoute><AddZone /></ProtectedRoute>} />
              <Route path="/add-sensor" element={<ProtectedRoute><AddSensor /></ProtectedRoute>} />
              <Route path="/sensors/edit/:id" element={<ProtectedRoute><EditSensor /></ProtectedRoute>} />
              <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><CreateReport /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>

        <footer style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '0.85rem' }}>
          Система мониторинга вентиляции
        </footer>
      </div>
    </Router>
  );
}

export default App;