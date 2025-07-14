# Koolie - Complete Job Portal for Freshers and Experienced Professionals

A comprehensive job portal web application built with the MERN stack (MongoDB, Express.js, React, Node.js) that connects job seekers with employers. The platform caters to both freshers starting their careers and experienced professionals looking for new opportunities.

## 🚀 Features

### For Job Seekers
- **Profile Management**: Create detailed profiles showcasing skills, education, work experience, and projects
- **Job Search & Filtering**: Advanced search with filters for location, job type, experience level, and more
- **Application Tracking**: Track application status and manage applied jobs
- **Skill Showcase**: Highlight technical and soft skills with a comprehensive skills section
- **Resume Upload**: Upload and manage resume files
- **Portfolio Integration**: Link to personal portfolios and projects

### For Employers
- **Company Profiles**: Create detailed company profiles with descriptions and branding
- **Job Posting**: Post jobs with detailed requirements, responsibilities, and benefits
- **Application Management**: Review and manage job applications
- **Candidate Search**: Browse and search through job seeker profiles
- **Application Status Updates**: Update application status (applied, reviewed, shortlisted, rejected, hired)

### General Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Authentication & Authorization**: Secure login/registration with JWT tokens
- **Real-time Updates**: Live application status updates
- **Search & Filters**: Powerful search functionality with multiple filters
- **Dashboard**: Personalized dashboards for both job seekers and employers
- **Modern UI/UX**: Clean, intuitive interface built with Tailwind CSS

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email functionality

### Frontend
- **React** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Toastify** - Notifications

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-portal
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/jobportal
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`

## 🗂️ Project Structure

```
job-portal/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── models/                 # MongoDB models
│   ├── User.js
│   └── Job.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── users.js
│   ├── jobs.js
│   └── applications.js
├── middleware/             # Custom middleware
│   └── auth.js
├── uploads/               # File uploads directory
├── server.js              # Main server file
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload` - Upload files (resume, avatar)
- `GET /api/users/applications` - Get user applications (job seekers)
- `GET /api/users/jobs` - Get posted jobs (employers)
- `GET /api/users/jobseekers` - Browse job seekers (employers)

### Jobs
- `GET /api/jobs` - Get all jobs with filtering
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (employers only)
- `PUT /api/jobs/:id` - Update job (employers only)
- `DELETE /api/jobs/:id` - Delete job (employers only)
- `POST /api/jobs/:id/apply` - Apply for job (job seekers only)
- `GET /api/jobs/:id/applications` - Get job applications (employers only)

### Applications
- `PUT /api/applications/:jobId/:applicantId` - Update application status
- `GET /api/applications/:jobId/:applicantId` - Get application details

## 🎨 UI Components

The application uses a consistent design system with:
- **Color Scheme**: Blue primary with gray neutrals
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Reusable button styles, form inputs, cards, and badges
- **Responsive Design**: Mobile-first approach with breakpoints
- **Icons**: Lucide React icon library for consistent iconography

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Restricted file types and sizes
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Sensitive data stored in environment variables

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set environment variables on your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy the backend code
4. Set up file storage (AWS S3 recommended for production)

### Frontend Deployment (Netlify/Vercel)
1. Build the React application: `npm run build`
2. Deploy the build folder to your hosting platform
3. Configure environment variables for API endpoints

### Database Setup
- **Development**: Local MongoDB instance
- **Production**: MongoDB Atlas (recommended) or self-hosted MongoDB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: [your-email@example.com]

## 🔮 Future Enhancements

- **Real-time Chat**: Direct messaging between employers and job seekers
- **Video Interviews**: Integrated video calling for remote interviews
- **AI-Powered Matching**: Machine learning for job-candidate matching
- **Advanced Analytics**: Detailed analytics for employers
- **Mobile App**: React Native mobile application
- **Payment Integration**: Premium features and job posting fees
- **Social Login**: Google, LinkedIn, GitHub authentication
- **Email Notifications**: Automated email updates for applications
- **Advanced Search**: Elasticsearch integration for better search
- **Multi-language Support**: Internationalization (i18n)

---

Built with ❤️ for connecting talent with opportunities
