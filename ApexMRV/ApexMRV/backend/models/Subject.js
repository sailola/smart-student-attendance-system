const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  facultyName: { type: String, required: true }
});

module.exports = mongoose.model('Subject', subjectSchema);