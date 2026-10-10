import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, subjects: 0, records: 0 });

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/students').then(res => res.json()),
      fetch('http://localhost:5000/api/subjects').then(res => res.json())
    ]).then(([studentsData, subjectsData]) => {
      setStats({
        students: studentsData.length,
        subjects: subjectsData.length,
        records: 1240 // mock total recorded instances
      });
    }).catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Campus Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3>Total Enrolled Students</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>{stats.students}</p>
        </div>
        <div className="card">
          <h3>Active Subjects</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>{stats.subjects}</p>
        </div>
        <div className="card">
          <h3>Total Attendance Logs</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>{stats.records}</p>
        </div>
      </div>
      <div className="card">
        <h3>System Highlights</h3>
        <ul style={{ lineHeight: '1.8', color: '#334155' }}>
          <li>Real-time automated attendance tracking across departments.</li>
          <li>Instant report generation and filtering by date and subject.</li>
          <li>Role-based access security for faculty members and administrators.</li>
          <li>Clean and responsive academic interface designed for quick operations.</li>
        </ul>
      </div>
    </div>
  );
}