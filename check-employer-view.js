const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkEmployerView() {
  try {
    console.log('🔍 CHECKING EMPLOYER VIEW FOR APPLICATIONS');
    console.log('==========================================\n');
    
    // Find the employer account
    const employer = await User.findOne({ email: 'hr@techsolutions.com' });
    console.log('🏢 EMPLOYER ACCOUNT:');
    console.log('Name:', employer.name);
    console.log('Email:', employer.email);
    console.log('ID:', employer._id);
    console.log('');
    
    // Find jobs posted by this employer
    const employerJobs = await Job.find({ employer: employer._id })
      .populate('applicants.user', 'name email profile');
    
    console.log('📋 JOBS POSTED BY THIS EMPLOYER:');
    console.log('=================================');
    
    employerJobs.forEach((job, index) => {
      console.log(`${index + 1}. JOB: ${job.title}`);
      console.log(`   Company: ${job.company}`);
      console.log(`   Applications: ${job.applicants.length}`);
      console.log(`   Views: ${job.views}`);
      console.log(`   Status: ${job.isActive ? 'Active' : 'Inactive'}`);
      
      if (job.applicants.length > 0) {
        console.log('   👤 APPLICANTS:');
        job.applicants.forEach((app, appIndex) => {
          console.log(`      ${appIndex + 1}. ${app.user.name} (${app.user.email})`);
          console.log(`         Applied: ${app.appliedAt.toLocaleDateString()}`);
          console.log(`         Status: ${app.status}`);
        });
      } else {
        console.log('   📝 No applications yet');
      }
      console.log('');
    });
    
    console.log('🔐 HOW TO VIEW AS EMPLOYER:');
    console.log('===========================');
    console.log('1. Go to: http://localhost:3000/login');
    console.log('2. Login with:');
    console.log('   Email: hr@techsolutions.com');
    console.log('   Password: password123');
    console.log('3. After login, go to:');
    console.log('   - Dashboard: http://localhost:3000/dashboard');
    console.log('   - Applications: http://localhost:3000/applications');
    console.log('');
    
    // Check if there are applications to view
    const totalApplications = employerJobs.reduce((sum, job) => sum + job.applicants.length, 0);
    
    if (totalApplications > 0) {
      console.log('✅ APPLICATIONS AVAILABLE TO VIEW:');
      console.log(`   Total applications: ${totalApplications}`);
      console.log('   You should see these in the employer dashboard');
    } else {
      console.log('❌ NO APPLICATIONS TO VIEW:');
      console.log('   This employer has no applications yet');
    }
    
    console.log('');
    console.log('🛠️ TROUBLESHOOTING:');
    console.log('===================');
    console.log('If you can\'t see applications after logging in:');
    console.log('1. Make sure you\'re logged in as hr@techsolutions.com');
    console.log('2. Check the Applications page');
    console.log('3. Look in the Dashboard for recent applications');
    console.log('4. Verify the frontend is showing the correct user role');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkEmployerView();
