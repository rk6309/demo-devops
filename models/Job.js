const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  workMode: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['fresher', 'entry-level', 'mid-level', 'senior-level', 'executive'],
    required: true
  },
  minExperience: {
    type: Number,
    default: 0
  },
  maxExperience: {
    type: Number,
    default: 0
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  responsibilities: [String],
  skills: [String],
  benefits: [String],
  applicationDeadline: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['applied', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'applied'
    }
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
jobSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
  skills: 'text'
});

module.exports = mongoose.model('Job', jobSchema);
