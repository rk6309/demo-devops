import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { 
  Briefcase, Users, Eye, Calendar, TrendingUp, 
  MapPin, Clock, DollarSign, Plus 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'employer') {
        const jobsResponse = await axios.get('/api/users/jobs');
        setRecentJobs(jobsResponse.data.slice(0, 5));
        
        // Calculate stats for employer
        const totalJobs = jobsResponse.data.length;
        const activeJobs = jobsResponse.data.filter(job => job.isActive).length;
        const totalApplications = jobsResponse.data.reduce((sum, job) => sum + job.applicants.length, 0);
        const totalViews = jobsResponse.data.reduce((sum, job) => sum + job.views, 0);
        
        setStats({
          totalJobs,
          activeJobs,
          totalApplications,
          totalViews
        });
      } else {
        const applicationsResponse = await axios.get('/api/users/applications');
        setRecentApplications(applicationsResponse.data.slice(0, 5));
        
        // Calculate stats for job seeker
        const totalApplications = applicationsResponse.data.length;
        const pendingApplications = applicationsResponse.data.filter(app => app.status === 'applied').length;
        const shortlistedApplications = applicationsResponse.data.filter(app => app.status === 'shortlisted').length;
        
        setStats({
          totalApplications,
          pendingApplications,
          shortlistedApplications
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'applied': 'badge-blue',
      'reviewed': 'badge-yellow',
      'shortlisted': 'badge-green',
      'rejected': 'badge-red',
      'hired': 'badge-green'
    };
    return colors[status] || 'badge-gray';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'employer' 
              ? 'Manage your job postings and applications' 
              : 'Track your job applications and discover new opportunities'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user?.role === 'employer' ? (
            <>
              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalJobs || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeJobs || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalApplications || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100">
                    <Eye className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalViews || 0}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalApplications || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.shortlistedApplications || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Profile Views</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs/Applications */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.role === 'employer' ? 'Recent Job Postings' : 'Recent Applications'}
              </h2>
              <Link
                to={user?.role === 'employer' ? '/post-job' : '/jobs'}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                {user?.role === 'employer' ? 'Post Job' : 'Find Jobs'}
              </Link>
            </div>

            <div className="space-y-4">
              {user?.role === 'employer' ? (
                recentJobs.length > 0 ? (
                  recentJobs.map((job) => (
                    <div key={job._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="text-lg font-medium text-gray-900 hover:text-blue-600"
                          >
                            {job.title}
                          </Link>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{job.location}</span>
                            <span className="mx-2">•</span>
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                            <span>{job.applicants.length} applications</span>
                            <span>{job.views} views</span>
                          </div>
                        </div>
                        <span className={`badge ${job.isActive ? 'badge-green' : 'badge-gray'}`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No job postings yet</p>
                    <Link to="/post-job" className="btn-primary mt-4">
                      Post Your First Job
                    </Link>
                  </div>
                )
              ) : (
                recentApplications.length > 0 ? (
                  recentApplications.map((application, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            to={`/jobs/${application.job._id}`}
                            className="text-lg font-medium text-gray-900 hover:text-blue-600"
                          >
                            {application.job.title}
                          </Link>
                          <p className="text-gray-600">{application.job.company}</p>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{application.job.location}</span>
                            <span className="mx-2">•</span>
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span className={`badge ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No applications yet</p>
                    <Link to="/jobs" className="btn-primary mt-4">
                      Browse Jobs
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <Link
                to="/profile"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Update Profile</h3>
                  <p className="text-sm text-gray-600">
                    Keep your profile information up to date
                  </p>
                </div>
              </Link>

              {user?.role === 'jobseeker' ? (
                <>
                  <Link
                    to="/jobs"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Browse Jobs</h3>
                      <p className="text-sm text-gray-600">
                        Discover new job opportunities
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/applications"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Eye className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">View Applications</h3>
                      <p className="text-sm text-gray-600">
                        Track your job application status
                      </p>
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/post-job"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Plus className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Post New Job</h3>
                      <p className="text-sm text-gray-600">
                        Create a new job posting
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/applications"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Manage Applications</h3>
                      <p className="text-sm text-gray-600">
                        Review and manage job applications
                      </p>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
