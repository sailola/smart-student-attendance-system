const router = require('express').Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.all(`SELECT id as _id, code, name, facultyName FROM subjects`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { code, name, facultyName } = req.body;
  db.run(
    `INSERT INTO subjects (code, name, facultyName) VALUES (?, ?, ?)`,
    [code, name, facultyName],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ _id: this.lastID, code, name, facultyName });
    }
  );
});

module.exports = router;