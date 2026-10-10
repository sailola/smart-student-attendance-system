const router = require('express').Router();
const db = require('../database');

router.post('/mark', (req, res) => {
  const { records } = req.body; // Array of { student, subject, date, status }
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    const stmt = db.prepare(`INSERT INTO attendance (student_id, subject_id, date, status) VALUES (?, ?, ?, ?)`);
    
    for (let record of records) {
      stmt.run(record.student, record.subject, record.date, record.status);
    }
    stmt.finalize();
    
    db.run('COMMIT', (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Attendance recorded successfully' });
    });
  });
});

router.get('/report', (req, res) => {
  const { subject, date } = req.query;
  let query = `
    SELECT 
      a.date, a.status,
      s.id as student_id, s.rollNumber, s.name as student_name, s.department, s.semester,
      sub.id as subject_id, sub.code as subject_code, sub.name as subject_name
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    JOIN subjects sub ON a.subject_id = sub.id
    WHERE 1=1
  `;
  const params = [];

  if (subject) {
    query += ` AND a.subject_id = ?`;
    params.push(subject);
  }
  if (date) {
    query += ` AND a.date = ?`;
    params.push(date);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Format response to match MongoDB populate structure expected by frontend
    const formatted = rows.map(r => ({
      date: r.date,
      status: r.status,
      student: {
        _id: r.student_id,
        rollNumber: r.rollNumber,
        name: r.student_name,
        department: r.department,
        semester: r.semester
      },
      subject: {
        _id: r.subject_id,
        code: r.subject_code,
        name: r.subject_name
      }
    }));

    res.json(formatted);
  });
});

module.exports = router;