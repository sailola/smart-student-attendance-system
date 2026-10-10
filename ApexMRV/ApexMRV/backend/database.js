const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    createTables();
  }
});

function createTables() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'faculty'
    )`, () => {
      seedUsers();
    });

    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rollNumber TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      department TEXT NOT NULL,
      semester INTEGER NOT NULL
    )`, () => {
      seedStudents();
    });

    db.run(`CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      facultyName TEXT NOT NULL
    )`, () => {
      seedSubjects();
    });

    db.run(`CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      subject_id INTEGER,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(subject_id) REFERENCES subjects(id)
    )`);
  });
}

function seedUsers() {
  db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
    if (!err && row.count === 0) {
      const hashedPassword = bcrypt.hashSync('12345', 10);
      db.run(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        ['Sai Teja', 'person@mrv.edu', hashedPassword, 'faculty'],
        (err) => {
          if (!err) console.log('Seeded temporary user: person@mrv.edu / 12345');
        }
      );
    }
  });
}

function seedStudents() {
  db.get(`SELECT COUNT(*) as count FROM students`, (err, row) => {
    if (!err && row.count === 0) {
      const defaultStudents = [
        ['CS101', 'Alice Smith', 'Computer Science', 3],
        ['CS102', 'Bob Jones', 'Computer Science', 3],
        ['CS103', 'Charlie Brown', 'Computer Science', 3]
      ];
      const stmt = db.prepare(`INSERT INTO students (rollNumber, name, department, semester) VALUES (?, ?, ?, ?)`);
      defaultStudents.forEach(s => stmt.run(s));
      stmt.finalize(() => console.log('Seeded temporary students.'));
    }
  });
}

function seedSubjects() {
  db.get(`SELECT COUNT(*) as count FROM subjects`, (err, row) => {
    if (!err && row.count === 0) {
      const defaultSubjects = [
        ['CSE201', 'Data Structures and Algorithms', 'Dr. Alan Turing'],
        ['CSE202', 'Database Management Systems', 'Prof. Ada Lovelace']
      ];
      const stmt = db.prepare(`INSERT INTO subjects (code, name, facultyName) VALUES (?, ?, ?)`);
      defaultSubjects.forEach(sub => stmt.run(sub));
      stmt.finalize(() => console.log('Seeded temporary subjects.'));
    }
  });
}

module.exports = db;