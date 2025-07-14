import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Award, Plus, X, Upload, Save 
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [profile, setProfile] = useState({
    phone: '',
    location: '',
    experience: '',
    skills: [],
    education: [],
    workExperience: [],
    projects: [],
    portfolio: '',
    // Employer fields
    company: '',
    companySize: '',
    industry: '',
    website: '',
    description: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    year: '',
    percentage: ''
  });
  const [newWorkExp, setNewWorkExp] = useState({
    company: '',
    position: '',
    duration: '',
    description: ''
  });
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: [],
    link: ''
  });

  useEffect(() => {
    if (user?.profile) {
      setProfile({
        phone: user.profile.phone || '',
        location: user.profile.location || '',
        experience: user.profile.experience || '',
        skills: user.profile.skills || [],
        education: user.profile.education || [],
        workExperience: user.profile.workExperience || [],
        projects: user.profile.projects || [],
        portfolio: user.profile.portfolio || '',
        company: user.profile.company || '',
        companySize: user.profile.companySize || '',
        industry: user.profile.industry || '',
        website: user.profile.website || '',
        description: user.profile.description || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put('/api/users/profile', profile);
      updateUser(response.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setProfile({
        ...profile,
        education: [...profile.education, { ...newEducation, year: parseInt(newEducation.year) }]
      });
      setNewEducation({ degree: '', institution: '', year: '', percentage: '' });
    }
  };

  const removeEducation = (index) => {
    setProfile({
      ...profile,
      education: profile.education.filter((_, i) => i !== index)
    });
  };

  const addWorkExperience = () => {
    if (newWorkExp.company && newWorkExp.position) {
      setProfile({
        ...profile,
        workExperience: [...profile.workExperience, newWorkExp]
      });
      setNewWorkExp({ company: '', position: '', duration: '', description: '' });
    }
  };

  const removeWorkExperience = (index) => {
    setProfile({
      ...profile,
      workExperience: profile.workExperience.filter((_, i) => i !== index)
    });
  };

  const addProject = () => {
    if (newProject.title && newProject.description) {
      setProfile({
        ...profile,
        projects: [...profile.projects, newProject]
      });
      setNewProject({ title: '', description: '', technologies: [], link: '' });
    }
  };

  const removeProject = (index) => {
    setProfile({
      ...profile,
      projects: profile.projects.filter((_, i) => i !== index)
    });
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    ...(user?.role === 'jobseeker' ? [
      { id: 'skills', label: 'Skills', icon: Award },
      { id: 'education', label: 'Education', icon: GraduationCap },
      { id: 'experience', label: 'Experience', icon: Briefcase },
      { id: 'projects', label: 'Projects', icon: Plus }
    ] : []),
    ...(user?.role === 'employer' ? [
      { id: 'company', label: 'Company Info', icon: Briefcase }
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-blue-100">{user?.email}</p>
                <p className="text-blue-100 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="input-field pl-10"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="input-field pl-10"
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>

                  {user?.role === 'jobseeker' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Experience Level
                        </label>
                        <select
                          value={profile.experience}
                          onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                          className="input-field"
                        >
                          <option value="">Select experience level</option>
                          <option value="fresher">Fresher</option>
                          <option value="0-1">0-1 years</option>
                          <option value="1-3">1-3 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5-10">5-10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Portfolio URL
                        </label>
                        <input
                          type="url"
                          value={profile.portfolio}
                          onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                          className="input-field"
                          placeholder="https://your-portfolio.com"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && user?.role === 'jobseeker' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="input-field flex-1"
                    placeholder="Add a skill"
                  />
                  <button onClick={addSkill} className="btn-primary">
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && user?.role === 'jobseeker' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                
                {profile.education.map((edu, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">
                          {edu.year} {edu.percentage && `• ${edu.percentage}%`}
                        </p>
                      </div>
                      <button
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Add Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                      className="input-field"
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      value={newEducation.institution}
                      onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                      className="input-field"
                      placeholder="Institution"
                    />
                    <input
                      type="number"
                      value={newEducation.year}
                      onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                      className="input-field"
                      placeholder="Year"
                    />
                    <input
                      type="number"
                      value={newEducation.percentage}
                      onChange={(e) => setNewEducation({ ...newEducation, percentage: e.target.value })}
                      className="input-field"
                      placeholder="Percentage/CGPA"
                    />
                  </div>
                  <button onClick={addEducation} className="btn-primary mt-4">
                    Add Education
                  </button>
                </div>
              </div>
            )}

            {/* Company Info Tab */}
            {activeTab === 'company' && user?.role === 'employer' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="input-field"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size
                    </label>
                    <select
                      value={profile.companySize}
                      onChange={(e) => setProfile({ ...profile, companySize: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select company size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={profile.industry}
                      onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                      className="input-field"
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="input-field"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                  </label>
                  <textarea
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    rows={4}
                    className="input-field"
                    placeholder="Describe your company..."
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
