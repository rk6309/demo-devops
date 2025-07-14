const axios = require('axios');

async function testEmployerLogin() {
  try {
    console.log('🔐 Testing Employer Login and Applications View');
    console.log('===============================================\n');

    // Step 1: Login as employer
    console.log('1. Logging in as employer...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'hr@techsolutions.com',
      password: 'password123'
    });

    if (loginResponse.data.token) {
      console.log('✅ Login successful!');
      console.log('Token received:', loginResponse.data.token.substring(0, 20) + '...');
      
      const token = loginResponse.data.token;
      
      // Step 2: Get applications
      console.log('\n2. Fetching applications...');
      const applicationsResponse = await axios.get('http://localhost:5000/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Applications API working!');
      console.log('Total applications:', applicationsResponse.data.total);
      
      if (applicationsResponse.data.applications.length > 0) {
        console.log('\n📋 APPLICATIONS FOUND:');
        applicationsResponse.data.applications.forEach((app, index) => {
          console.log(`${index + 1}. Job: ${app.job.title}`);
          console.log(`   Applicant: ${app.applicant.name} (${app.applicant.email})`);
          console.log(`   Applied: ${new Date(app.appliedAt).toLocaleDateString()}`);
          console.log(`   Status: ${app.status}`);
          console.log('');
        });
        
        console.log('✅ SOLUTION: The employer should now be able to see applications!');
        console.log('\n🌐 TO VIEW IN BROWSER:');
        console.log('1. Go to: http://localhost:3000/login');
        console.log('2. Login with: hr@techsolutions.com / password123');
        console.log('3. Go to Applications or Dashboard page');
        
      } else {
        console.log('❌ No applications found for this employer');
      }
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testEmployerLogin();
