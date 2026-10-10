import React, { useEffect, useState } from 'react';

export default function Reports() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/subjects')
      .then(res => res.json())
      .then(data => setSubjects(data));
  }, []);

  const fetchReport = async () => {
    let url = 'http://localhost:5000/api/attendance/report';
    if (selectedSubject) url += `?subject=${selectedSubject}`;
    const res = await fetch(url);
    const data = await res.json();
    setReportData(data);
  };

  return (
    <div className="card">
      <h2>Attendance Reports</h2>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label>Filter by Subject</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">All Subjects</option>
            {subjects.map(sub => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>
        </div>
        <button className="btn" onClick={fetchReport}>Generate Report</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Roll Number</th>
            <th>Student Name</th>
            <th>Subject</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.student?.rollNumber}</td>
              <td>{record.student?.name}</td>
              <td>{record.subject?.name}</td>
              <td>
                <span className={record.status === 'Present' ? 'badge-present' : 'badge-absent'}>
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
          {reportData.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', color: '#64748b' }}>No records found. Generate a report above.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}