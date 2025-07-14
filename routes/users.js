const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('application/')) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed for resume'));
      }
    } else if (file.fieldname === 'avatar') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for avatar'));
      }
    } else {
      cb(null, true);
    }
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { profile: { ...updates } } },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload files (resume, avatar)
router.post('/upload', auth, upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'avatar', maxCount: 1 }
]), async (req, res) => {
  try {
    const updates = {};

    if (req.files.resume) {
      updates['profile.resume'] = req.files.resume[0].filename;
    }

    if (req.files.avatar) {
      updates['profile.avatar'] = req.files.avatar[0].filename;
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Files uploaded successfully',
      user
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's job applications (job seekers)
router.get('/applications', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'Only job seekers can view applications' });
    }

    const jobs = await Job.find({
      'applicants.user': req.user.userId
    }).populate('employer', 'name profile.company');

    const applications = jobs.map(job => {
      const application = job.applicants.find(
        app => app.user.toString() === req.user.userId
      );
      
      return {
        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType,
          employer: job.employer
        },
        appliedAt: application.appliedAt,
        status: application.status
      };
    });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employer's posted jobs
router.get('/jobs', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can view posted jobs' });
    }

    const jobs = await Job.find({ employer: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Get employer jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get job seekers (for employers to browse)
router.get('/jobseekers', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can browse job seekers' });
    }

    const {
      page = 1,
      limit = 10,
      skills,
      experience,
      location
    } = req.query;

    const filter = { role: 'jobseeker' };

    if (skills) {
      filter['profile.skills'] = { $in: skills.split(',') };
    }

    if (experience) {
      filter['profile.experience'] = experience;
    }

    if (location) {
      filter['profile.location'] = { $regex: location, $options: 'i' };
    }

    const jobseekers = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      jobseekers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get jobseekers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
