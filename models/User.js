const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['jobseeker', 'employer'],
    required: true
  },
  profile: {
    // Common fields
    phone: String,
    location: String,
    avatar: String,
    
    // Job seeker specific fields
    experience: {
      type: String,
      enum: ['fresher', '0-1', '1-3', '3-5', '5-10', '10+']
    },
    skills: [String],
    education: [{
      degree: String,
      institution: String,
      year: Number,
      percentage: Number
    }],
    workExperience: [{
      company: String,
      position: String,
      duration: String,
      description: String
    }],
    projects: [{
      title: String,
      description: String,
      technologies: [String],
      link: String
    }],
    resume: String,
    portfolio: String,
    
    // Employer specific fields
    company: String,
    companySize: String,
    industry: String,
    website: String,
    description: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
