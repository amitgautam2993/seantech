const mongoose = require('mongoose');

const yourSchema = new mongoose.Schema({
  // Define your schema fields here
  // For example:
  subject: String,
  content: String,
  recipientEmail: String,
  sendDate: Number
});



module.exports = mongoose.model('reminderContent', yourSchema);
