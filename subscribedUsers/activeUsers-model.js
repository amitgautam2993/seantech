const mongoose = require('mongoose');

const activeUsersSchema = new mongoose.Schema({
  fname: {type:String, required: true},
  lname: {type:String, required: true},
  email: { type: String, unique: true , required: true},
    subscriptionDate: Date, // Will be set automatically on user creation
  subscriptionDay: Number // Will be extracted from subscriptionDate
});

// Define a pre-save middleware to set subscriptionDate and subscriptionDay
activeUsersSchema.pre('save', function (next) {
  if (!this.subscriptionDate) {
    // Set subscriptionDate to the current date if it's not provided
    this.subscriptionDate = new Date();
  }

  if(this.subscriptionDate.getDate() > 28) {
    this.subscriptionDay = 1
  } else
  this.subscriptionDay = this.subscriptionDate.getDate();

  next();
});

module.exports = mongoose.model('activeUsers', activeUsersSchema);
