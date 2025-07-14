const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all applications for employer
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can view applications' });
    }

    const jobs = await Job.find({ employer: req.user.userId })
      .populate('applicants.user', 'name email profile')
      .select('title company location applicants createdAt');

    // Flatten applications with job info
    const applications = [];
    jobs.forEach(job => {
      job.applicants.forEach(app => {
        applications.push({
          _id: app._id,
          job: {
            _id: job._id,
            title: job.title,
            company: job.company,
            location: job.location
          },
          applicant: app.user,
          appliedAt: app.appliedAt,
          status: app.status,
          coverLetter: app.coverLetter
        });
      });
    });

    // Sort by most recent first
    applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    res.json({
      applications,
      total: applications.length
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (employer only)
router.put('/:jobId/:applicantId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can update application status' });
    }

    const { status } = req.body;
    const { jobId, applicantId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applicantIndex = job.applicants.findIndex(
      app => app.user.toString() === applicantId
    );

    if (applicantIndex === -1) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    job.applicants[applicantIndex].status = status;
    await job.save();

    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get application details
router.get('/:jobId/:applicantId', auth, async (req, res) => {
  try {
    const { jobId, applicantId } = req.params;

    const job = await Job.findById(jobId)
      .populate('employer', 'name profile.company');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check authorization
    if (req.user.role === 'employer' && job.employer._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'jobseeker' && req.user.userId !== applicantId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applicant = await User.findById(applicantId).select('-password');
    const application = job.applicants.find(
      app => app.user.toString() === applicantId
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      job: {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        employer: job.employer
      },
      applicant,
      application
    });
  } catch (error) {
    console.error('Get application details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
