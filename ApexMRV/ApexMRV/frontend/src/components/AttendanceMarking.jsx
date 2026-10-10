import React, { useEffect, useState } from 'react';

export default function AttendanceMarking() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusMap, setStatusMap] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        const initial = {};
        data.forEach(s => initial[s._id] = 'Present');
        setStatusMap(initial);
      });

    fetch('http://localhost:5000/api/subjects')
      .then(res => res.json())
      .then(data => setSubjects(data));
  }, []);

  const handleStatusChange = (studentId, status) => {
    setStatusMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject) {
      setMessage('Please select a subject');
      return;
    }

    const records = students.map(student => ({
      student: student._id,
      subject: selectedSubject,
      date,
      status: statusMap[student._id] || 'Present'
    }));

    try {
      const res = await fetch('http://localhost:5000/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      });
      if (res.ok) {
        setMessage('Attendance marked successfully');
      } else {
        setMessage('Failed to submit attendance');
      }
    } catch (err) {
      setMessage('Network error occurred');
    }
  };

  return (
    <div className="card">
      <h2>Mark Daily Attendance</h2>
      {message && <p style={{ padding: '0.75rem', background: '#f1f5f9', borderRadius: '4px' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Select Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
              <option value="">Choose subject...</option>
              {subjects.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name} ({sub.code})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.rollNumber}</td>
                <td>{student.name}</td>
                <td>{student.department}</td>
                <td>
                  <select 
                    value={statusMap[student._id] || 'Present'} 
                    onChange={(e) => handleStatusChange(student._id, e.target.value)}
                    style={{ padding: '0.35rem 0.5rem', width: 'auto' }}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '1.5rem' }}>
          <button type="submit" className="btn">Save Attendance Records</button>
        </div>
      </form>
    </div>
  );
}