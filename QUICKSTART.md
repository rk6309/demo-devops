# 🚀 Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

## 1. Quick Setup
```bash
# Run the setup script
./setup.sh

# OR manual setup:
npm install
cd client && npm install && cd ..
```

## 2. Configure Environment
Update `.env` file with your settings:
```env
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

## 3. Start the Application

### Option A: Development Mode (Recommended)
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### Option B: Production Mode
```bash
# Build frontend
cd client && npm run build && cd ..

# Start server
npm start
```

## 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 5. Test the Application

### Create Test Accounts
1. **Job Seeker Account**:
   - Go to http://localhost:3000/register
   - Select "Job Seeker"
   - Fill in details and register

2. **Employer Account**:
   - Go to http://localhost:3000/register  
   - Select "Employer"
   - Fill in company details and register

### Demo Features
- **Job Seekers**: Create profile → Browse jobs → Apply → Track applications
- **Employers**: Create company profile → Post jobs → Review applications

## 6. Sample Data (Optional)
The app includes demo login buttons on the login page for quick testing.

## 🆘 Troubleshooting

### Common Issues:
1. **MongoDB Connection Error**: 
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env

2. **Port Already in Use**:
   - Backend: Change PORT in .env
   - Frontend: It will prompt for different port

3. **Dependencies Issues**:
   - Delete node_modules and package-lock.json
   - Run npm install again

### Need Help?
- Check the full README.md for detailed documentation
- Ensure all prerequisites are installed
- Verify environment variables are set correctly

## 🎯 Next Steps
1. Customize the branding and colors
2. Add your company information
3. Configure email settings for notifications
4. Set up file storage (AWS S3 for production)
5. Deploy to your preferred hosting platform

Happy job hunting! 🎉
