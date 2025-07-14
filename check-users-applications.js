const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkUsersAndApplications = async () => {
  try {
    console.log('🔍 CHECKING KOOLIE PORTAL USERS & APPLICATIONS');
    console.log('================================================\n');

    // Get all users
    const allUsers = await User.find({}).select('name email role createdAt profile');
    
    console.log('👥 REGISTERED USERS:');
    console.log('===================');
    
    const jobSeekers = allUsers.filter(user => user.role === 'jobseeker');
    const employers = allUsers.filter(user => user.role === 'employer');
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total Users: ${allUsers.length}`);
    console.log(`   Job Seekers: ${jobSeekers.length}`);
    console.log(`   Employers: ${employers.length}\n`);

    console.log('👤 JOB SEEKERS:');
    console.log('===============');
    jobSeekers.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Experience: ${user.profile?.experience || 'Not specified'}`);
      console.log(`   Location: ${user.profile?.location || 'Not specified'}`);
      console.log(`   Skills: ${user.profile?.skills?.join(', ') || 'None listed'}`);
      console.log(`   Registered: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    console.log('🏢 EMPLOYERS:');
    console.log('=============');
    employers.forEach((user, index) => {
      console.log(`${index + 1}. Company: ${user.profile?.company || user.name}`);
      console.log(`   Contact Email: ${user.email}`);
      console.log(`   Industry: ${user.profile?.industry || 'Not specified'}`);
      console.log(`   Company Size: ${user.profile?.companySize || 'Not specified'}`);
      console.log(`   Location: ${user.profile?.location || 'Not specified'}`);
      console.log(`   Registered: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // Get all jobs with applicants
    const jobsWithApplicants = await Job.find({})
      .populate('applicants.user', 'name email profile')
      .populate('employer', 'name profile.company');

    console.log('📋 JOB APPLICATIONS STATUS:');
    console.log('===========================');

    let totalApplications = 0;
    
    jobsWithApplicants.forEach((job, index) => {
      const applicantCount = job.applicants?.length || 0;
      totalApplications += applicantCount;
      
      console.log(`\n${index + 1}. JOB: ${job.title}`);
      console.log(`   Company: ${job.company}`);
      console.log(`   Posted by: ${job.employer?.name || 'Unknown'}`);
      console.log(`   Applications: ${applicantCount}`);
      console.log(`   Status: ${job.isActive ? '🟢 Active' : '🔴 Inactive'}`);
      console.log(`   Views: ${job.views || 0}`);
      
      if (applicantCount > 0) {
        console.log(`   📝 APPLICANTS:`);
        job.applicants.forEach((application, appIndex) => {
          console.log(`      ${appIndex + 1}. ${application.user?.name || 'Unknown'}`);
          console.log(`         Email: ${application.user?.email || 'Unknown'}`);
          console.log(`         Applied: ${application.appliedAt.toLocaleDateString()}`);
          console.log(`         Status: ${application.status}`);
          console.log(`         Experience: ${application.user?.profile?.experience || 'Not specified'}`);
        });
      } else {
        console.log(`   📝 No applications yet`);
      }
    });

    console.log(`\n📊 APPLICATION SUMMARY:`);
    console.log(`   Total Jobs Posted: ${jobsWithApplicants.length}`);
    console.log(`   Total Applications: ${totalApplications}`);
    console.log(`   Jobs with Applications: ${jobsWithApplicants.filter(job => job.applicants?.length > 0).length}`);
    console.log(`   Jobs without Applications: ${jobsWithApplicants.filter(job => !job.applicants?.length).length}`);

    // Check for any active sessions (this would require session storage, but we can show recent activity)
    console.log(`\n🔐 RECENT ACTIVITY:`);
    console.log(`   Most Recent User Registration: ${allUsers.sort((a, b) => b.createdAt - a.createdAt)[0]?.name || 'None'}`);
    console.log(`   Most Recent Job Post: ${jobsWithApplicants.sort((a, b) => b.createdAt - a.createdAt)[0]?.title || 'None'}`);
    
    if (totalApplications > 0) {
      const mostRecentApplication = jobsWithApplicants
        .flatMap(job => job.applicants.map(app => ({...app, jobTitle: job.title})))
        .sort((a, b) => b.appliedAt - a.appliedAt)[0];
      
      console.log(`   Most Recent Application: ${mostRecentApplication?.user?.name || 'Unknown'} applied for ${mostRecentApplication?.jobTitle || 'Unknown'}`);
    } else {
      console.log(`   Most Recent Application: None yet`);
    }

    console.log('\n🌐 ACCESS PORTAL: http://localhost:3000');
    console.log('🔍 VIEW JOBS: http://localhost:3000/jobs');
    console.log('👤 LOGIN PAGE: http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Error checking users and applications:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkUsersAndApplications();
