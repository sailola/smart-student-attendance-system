import React, { useEffect, useState } from 'react';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ rollNumber: '', name: '', department: '', semester: 1 });

  const loadStudents = () => {
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => setStudents(data));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ rollNumber: '', name: '', department: '', semester: 1 });
      loadStudents();
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/students/${id}`, { method: 'DELETE' });
    loadStudents();
  };

  return (
    <div>
      <div className="card">
        <h2>Add New Student</h2>
        <form onSubmit={handleAdd}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label>Roll Number</label>
              <input 
                type="text" 
                value={form.rollNumber} 
                onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input 
                type="text" 
                value={form.department} 
                onChange={(e) => setForm({ ...form, department: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Semester</label>
              <input 
                type="number" 
                value={form.semester} 
                onChange={(e) => setForm({ ...form, semester: e.target.value })} 
                required 
              />
            </div>
          </div>
          <button type="submit" className="btn">Add Student Record</button>
        </form>
      </div>

      <div className="card">
        <h2>Student Directory</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Name</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.rollNumber}</td>
                <td>{student.name}</td>
                <td>{student.department}</td>
                <td>{student.semester}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(student._id)} 
                    style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}