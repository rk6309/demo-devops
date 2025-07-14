const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 Starting to seed Koolie job portal with sample data...');

    // Clear existing data
    await Job.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create sample employer users
    const employers = await User.create([
      {
        name: 'Tech Solutions Inc',
        email: 'hr@techsolutions.com',
        password: 'password123',
        role: 'employer',
        profile: {
          company: 'Tech Solutions Inc',
          companySize: '51-200',
          industry: 'Technology',
          website: 'https://techsolutions.com',
          description: 'Leading technology company specializing in web development and digital solutions.',
          location: 'San Francisco, CA'
        }
      },
      {
        name: 'Digital Marketing Pro',
        email: 'careers@digitalmarketing.com',
        password: 'password123',
        role: 'employer',
        profile: {
          company: 'Digital Marketing Pro',
          companySize: '11-50',
          industry: 'Marketing',
          website: 'https://digitalmarketingpro.com',
          description: 'Full-service digital marketing agency helping businesses grow online.',
          location: 'New York, NY'
        }
      },
      {
        name: 'FinTech Innovations',
        email: 'jobs@fintechinnovations.com',
        password: 'password123',
        role: 'employer',
        profile: {
          company: 'FinTech Innovations',
          companySize: '201-500',
          industry: 'Finance',
          website: 'https://fintechinnovations.com',
          description: 'Revolutionary fintech company building the future of digital payments.',
          location: 'Austin, TX'
        }
      }
    ]);

    console.log('✅ Created sample employers');

    // Create sample jobs
    const sampleJobs = [
      {
        title: 'Frontend Developer (React)',
        company: 'Tech Solutions Inc',
        location: 'San Francisco, CA',
        jobType: 'full-time',
        workMode: 'hybrid',
        experienceLevel: 'entry-level',
        minExperience: 1,
        maxExperience: 3,
        salary: {
          min: 70000,
          max: 90000,
          currency: 'USD'
        },
        description: `We are looking for a passionate Frontend Developer to join our growing team. You'll work on exciting projects using modern technologies like React, TypeScript, and Tailwind CSS.

This is a great opportunity for freshers or developers with 1-3 years of experience to grow their skills in a supportive environment.`,
        requirements: [
          'Bachelor\'s degree in Computer Science or related field',
          '1-3 years of experience with React.js',
          'Knowledge of HTML, CSS, and JavaScript',
          'Familiarity with Git version control',
          'Good communication skills'
        ],
        responsibilities: [
          'Develop user-facing features using React.js',
          'Build reusable components and front-end libraries',
          'Collaborate with design and backend teams',
          'Optimize applications for maximum speed and scalability',
          'Participate in code reviews and team meetings'
        ],
        skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git', 'TypeScript', 'Tailwind CSS'],
        benefits: [
          'Competitive salary and equity',
          'Health, dental, and vision insurance',
          'Flexible working hours',
          'Professional development budget',
          'Modern office with free snacks'
        ],
        employer: employers[0]._id,
        isActive: true
      },
      {
        title: 'Full Stack Developer (MERN)',
        company: 'Tech Solutions Inc',
        location: 'San Francisco, CA',
        jobType: 'full-time',
        workMode: 'remote',
        experienceLevel: 'mid-level',
        minExperience: 2,
        maxExperience: 5,
        salary: {
          min: 85000,
          max: 120000,
          currency: 'USD'
        },
        description: `Join our team as a Full Stack Developer working with the MERN stack (MongoDB, Express.js, React, Node.js). You'll build scalable web applications and work on both frontend and backend development.

Perfect for developers looking to work with modern technologies in a fast-paced startup environment.`,
        requirements: [
          '2-5 years of full-stack development experience',
          'Strong proficiency in MERN stack',
          'Experience with RESTful APIs',
          'Knowledge of database design and optimization',
          'Experience with cloud platforms (AWS/GCP)'
        ],
        responsibilities: [
          'Design and develop full-stack web applications',
          'Create and maintain RESTful APIs',
          'Work with databases and optimize queries',
          'Implement authentication and security features',
          'Deploy applications to cloud platforms'
        ],
        skills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JavaScript', 'AWS', 'Docker'],
        benefits: [
          'Remote work flexibility',
          'Stock options',
          'Health insurance',
          'Learning and development budget',
          'Annual company retreats'
        ],
        employer: employers[0]._id,
        isActive: true
      },
      {
        title: 'Digital Marketing Specialist',
        company: 'Digital Marketing Pro',
        location: 'New York, NY',
        jobType: 'full-time',
        workMode: 'onsite',
        experienceLevel: 'entry-level',
        minExperience: 0,
        maxExperience: 2,
        salary: {
          min: 45000,
          max: 65000,
          currency: 'USD'
        },
        description: `We're seeking a creative and analytical Digital Marketing Specialist to join our team. This role is perfect for freshers or those with up to 2 years of experience in digital marketing.

You'll work on diverse campaigns across multiple channels and learn from experienced marketing professionals.`,
        requirements: [
          'Bachelor\'s degree in Marketing, Communications, or related field',
          'Basic understanding of digital marketing concepts',
          'Familiarity with social media platforms',
          'Strong written and verbal communication skills',
          'Analytical mindset with attention to detail'
        ],
        responsibilities: [
          'Create and manage social media campaigns',
          'Develop content for various marketing channels',
          'Analyze campaign performance and provide insights',
          'Assist with SEO and content marketing efforts',
          'Support email marketing campaigns'
        ],
        skills: ['Social Media Marketing', 'Content Creation', 'SEO', 'Google Analytics', 'Email Marketing'],
        benefits: [
          'Competitive salary',
          'Health and dental insurance',
          'Professional development opportunities',
          'Creative work environment',
          'Performance bonuses'
        ],
        employer: employers[1]._id,
        isActive: true
      },
      {
        title: 'Software Engineer Intern',
        company: 'Tech Solutions Inc',
        location: 'San Francisco, CA',
        jobType: 'internship',
        workMode: 'hybrid',
        experienceLevel: 'fresher',
        minExperience: 0,
        maxExperience: 0,
        salary: {
          min: 25,
          max: 35,
          currency: 'USD'
        },
        description: `Exciting internship opportunity for computer science students or recent graduates! Join our engineering team and work on real projects while learning from experienced developers.

This 3-6 month internship program is designed to give you hands-on experience with modern web technologies and agile development practices.`,
        requirements: [
          'Currently pursuing or recently completed CS degree',
          'Basic programming knowledge (any language)',
          'Eagerness to learn and grow',
          'Good problem-solving skills',
          'Team player with positive attitude'
        ],
        responsibilities: [
          'Work on assigned development tasks',
          'Participate in daily standups and team meetings',
          'Learn and apply new technologies',
          'Contribute to code reviews',
          'Document your work and learnings'
        ],
        skills: ['Programming', 'Problem Solving', 'Git', 'Teamwork'],
        benefits: [
          'Mentorship from senior developers',
          'Real project experience',
          'Potential for full-time offer',
          'Learning stipend',
          'Flexible schedule'
        ],
        employer: employers[0]._id,
        isActive: true
      },
      {
        title: 'Junior Data Analyst',
        company: 'FinTech Innovations',
        location: 'Austin, TX',
        jobType: 'full-time',
        workMode: 'hybrid',
        experienceLevel: 'entry-level',
        minExperience: 0,
        maxExperience: 2,
        salary: {
          min: 55000,
          max: 75000,
          currency: 'USD'
        },
        description: `Join our data team as a Junior Data Analyst! Perfect opportunity for freshers or those with limited experience to start their career in data analytics within the exciting fintech industry.

You'll work with large datasets, create insights, and help drive business decisions through data-driven analysis.`,
        requirements: [
          'Bachelor\'s degree in Statistics, Mathematics, or related field',
          'Basic knowledge of SQL and Excel',
          'Understanding of statistical concepts',
          'Strong analytical and problem-solving skills',
          'Attention to detail and accuracy'
        ],
        responsibilities: [
          'Analyze financial data and create reports',
          'Build dashboards and visualizations',
          'Support business teams with data insights',
          'Maintain data quality and integrity',
          'Assist with ad-hoc analysis requests'
        ],
        skills: ['SQL', 'Excel', 'Python', 'Data Visualization', 'Statistics'],
        benefits: [
          'Competitive salary',
          'Stock options',
          'Health insurance',
          'Learning budget for courses',
          'Modern office environment'
        ],
        employer: employers[2]._id,
        isActive: true
      },
      {
        title: 'UI/UX Designer',
        company: 'Digital Marketing Pro',
        location: 'New York, NY',
        jobType: 'full-time',
        workMode: 'hybrid',
        experienceLevel: 'entry-level',
        minExperience: 1,
        maxExperience: 3,
        salary: {
          min: 60000,
          max: 80000,
          currency: 'USD'
        },
        description: `We're looking for a creative UI/UX Designer to join our design team. You'll work on diverse projects for our clients, creating beautiful and functional user experiences.

Great opportunity for designers with 1-3 years of experience to work on varied projects and grow their portfolio.`,
        requirements: [
          'Bachelor\'s degree in Design or related field',
          '1-3 years of UI/UX design experience',
          'Proficiency in Figma, Sketch, or Adobe XD',
          'Understanding of user-centered design principles',
          'Portfolio showcasing design work'
        ],
        responsibilities: [
          'Create wireframes, prototypes, and high-fidelity designs',
          'Conduct user research and usability testing',
          'Collaborate with developers and stakeholders',
          'Maintain design systems and style guides',
          'Present design concepts to clients'
        ],
        skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
        benefits: [
          'Creative work environment',
          'Design tool subscriptions',
          'Conference attendance budget',
          'Flexible working hours',
          'Health insurance'
        ],
        employer: employers[1]._id,
        isActive: true
      }
    ];

    const jobs = await Job.create(sampleJobs);
    console.log(`✅ Created ${jobs.length} sample jobs`);

    // Create some sample job seekers
    const jobSeekers = await User.create([
      {
        name: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        password: 'password123',
        role: 'jobseeker',
        profile: {
          phone: '+1-555-0123',
          location: 'San Francisco, CA',
          experience: '1-3',
          skills: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'],
          education: [{
            degree: 'Bachelor of Computer Science',
            institution: 'University of California',
            year: 2023,
            percentage: 85
          }],
          portfolio: 'https://alexjohnson.dev'
        }
      },
      {
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        password: 'password123',
        role: 'jobseeker',
        profile: {
          phone: '+1-555-0124',
          location: 'New York, NY',
          experience: 'fresher',
          skills: ['Digital Marketing', 'Social Media', 'Content Writing', 'SEO'],
          education: [{
            degree: 'Bachelor of Marketing',
            institution: 'New York University',
            year: 2024,
            percentage: 88
          }]
        }
      }
    ]);

    console.log(`✅ Created ${jobSeekers.length} sample job seekers`);

    console.log('\n🎉 Sample data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${employers.length} Employers created`);
    console.log(`- ${jobs.length} Jobs posted`);
    console.log(`- ${jobSeekers.length} Job seekers registered`);
    console.log('\n🌐 You can now see jobs at: http://localhost:3000/jobs');
    console.log('🔐 Demo login credentials:');
    console.log('   Employer: hr@techsolutions.com / password123');
    console.log('   Job Seeker: alex.johnson@email.com / password123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
