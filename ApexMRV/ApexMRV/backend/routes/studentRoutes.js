const router = require('express').Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.all(`SELECT id as _id, rollNumber, name, department, semester FROM students`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { rollNumber, name, department, semester } = req.body;
  db.run(
    `INSERT INTO students (rollNumber, name, department, semester) VALUES (?, ?, ?, ?)`,
    [rollNumber, name, department, semester],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ _id: this.lastID, rollNumber, name, department, semester });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM students WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student deleted successfully' });
  });
});

module.exports = router;