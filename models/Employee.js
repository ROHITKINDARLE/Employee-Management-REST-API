const mongoose = require('mongoose');

const phoneNumberPattern = /^(?:\+[1-9]\d{9,14}|0?[6-9]\d{9})$/;

const employeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    validate: {
      validator: (value) => value.length > 0,
      message: 'Full name cannot be empty'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid'],
    unique: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: (value) => phoneNumberPattern.test(value.replace(/[\s()-]/g, '')),
      message: 'Phone number must be a valid international or Indian number'
    }
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    validate: {
      validator: (value) => value.length > 0,
      message: 'Department cannot be empty'
    }
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true,
    validate: {
      validator: (value) => value.length > 0,
      message: 'Designation cannot be empty'
    }
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0, 'Salary cannot be negative']
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required']
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
