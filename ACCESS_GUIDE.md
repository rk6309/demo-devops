# 🎉 Koolie - Access Guide

## ✅ Your Koolie Job Portal is LIVE and Ready!

### 🌐 Access URLs:
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Demo Status Page**: file:///home/kiran/job-portal/demo.html

---

## 🚀 Current Status:
- ✅ **Backend Server**: Running on port 5000
- ✅ **Frontend Server**: Running on port 3000  
- ✅ **MongoDB Database**: Active and connected
- ✅ **All APIs**: Working and tested

---

## 🎯 How to Use Your Koolie Portal:

### 1. **Access the Application**
Open your web browser and go to: **http://localhost:3000**

### 2. **Create Your First Account**

#### For Job Seekers (Freshers & Experienced):
1. Click "Sign Up" 
2. Select "Job Seeker"
3. Fill in your details
4. Complete your profile with:
   - Skills and experience level
   - Education details
   - Work experience (if any)
   - Projects and portfolio
   - Upload your resume

#### For Employers:
1. Click "Sign Up"
2. Select "Employer" 
3. Fill in company details
4. Complete company profile
5. Start posting jobs

### 3. **Key Features to Explore**

#### Job Seekers Can:
- 🔍 **Search Jobs**: Use advanced filters (location, type, experience level)
- 📝 **Apply for Jobs**: One-click applications with your profile
- 📊 **Track Applications**: Monitor application status in real-time
- 👤 **Build Profile**: Showcase skills, education, and projects
- 📄 **Upload Resume**: PDF resume upload and management

#### Employers Can:
- 📋 **Post Jobs**: Create detailed job postings with requirements
- 👥 **Review Applications**: Browse and manage candidate applications  
- 🔍 **Search Candidates**: Find job seekers by skills and experience
- 📈 **Manage Hiring**: Update application status (applied → shortlisted → hired)
- 🏢 **Company Profile**: Build attractive company profiles

---

## 🛠️ Management Commands:

### Check Status:
```bash
# Check if services are running
curl http://localhost:3000  # Frontend
curl http://localhost:5000/api/jobs  # Backend API

# View logs
tail -f /home/kiran/job-portal/backend.log
tail -f /home/kiran/job-portal/client/frontend.log
```

### Restart Services:
```bash
# Restart Backend
cd /home/kiran/job-portal
pkill -f "node server.js"
nohup npm start > backend.log 2>&1 &

# Restart Frontend  
cd /home/kiran/job-portal/client
pkill -f "react-scripts"
nohup npm start > frontend.log 2>&1 &
```

### Stop Services:
```bash
# Stop all services
pkill -f "node server.js"
pkill -f "react-scripts"
sudo systemctl stop mongod
```

---

## 🎨 Customization Options:

### 1. **Branding & Colors**
- Edit `/client/src/index.css` for global styles
- Modify `/client/tailwind.config.js` for color themes
- Update company name in `/client/src/components/Layout/Navbar.js`

### 2. **Add Features**
- All code is modular and well-documented
- Add new pages in `/client/src/pages/`
- Add new API endpoints in `/routes/`

### 3. **Database Configuration**
- Update MongoDB URI in `.env` file
- Add new data models in `/models/` directory

---

## 🚀 Deployment Ready:

### For Production:
1. **Build Frontend**: `cd client && npm run build`
2. **Environment Variables**: Update `.env` with production settings
3. **Database**: Use MongoDB Atlas or production MongoDB
4. **Hosting**: Deploy to Heroku, Vercel, DigitalOcean, or AWS

---

## 📞 Support & Documentation:

- **Full Documentation**: Check `README.md`
- **Quick Start**: See `QUICKSTART.md`  
- **API Documentation**: All endpoints documented in route files
- **Code Comments**: Every component and function is documented

---

## 🎯 Next Steps:

1. **Explore the Application**: Visit http://localhost:3000
2. **Create Test Accounts**: Try both job seeker and employer roles
3. **Post Sample Jobs**: Test the complete workflow
4. **Customize**: Update branding and add your features
5. **Deploy**: Launch your job portal to the world!

---

**🎉 Congratulations! Your complete job portal is now live and ready to connect talent with opportunities!**

**Access it now at: http://localhost:3000**
