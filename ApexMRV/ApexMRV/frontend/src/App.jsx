import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AttendanceMarking from './components/AttendanceMarking';
import Reports from './components/Reports';
import StudentManagement from './components/StudentManagement';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser(null)} />
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'attendance' && <AttendanceMarking />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'students' && <StudentManagement />}
      </main>
    </div>
  );
}