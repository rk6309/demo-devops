import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { 
  Briefcase, Calendar, MapPin, Eye, Users, 
  Clock, CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (user?.role === 'jobseeker') {
        const response = await axios.get('/api/users/applications');
        setApplications(response.data);
      } else if (user?.role === 'employer') {
        const response = await axios.get('/api/users/jobs');
        setJobs(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      'applied': <Clock className="h-4 w-4 text-blue-600" />,
      'reviewed': <Eye className="h-4 w-4 text-yellow-600" />,
      'shortlisted': <CheckCircle className="h-4 w-4 text-green-600" />,
      'rejected': <XCircle className="h-4 w-4 text-red-600" />,
      'hired': <CheckCircle className="h-4 w-4 text-green-600" />
    };
    return icons[status] || <AlertCircle className="h-4 w-4 text-gray-600" />;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'jobseeker' ? 'My Applications' : 'Job Management'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'jobseeker' 
              ? 'Track the status of your job applications'
              : 'Manage your job postings and applications'
            }
          </p>
        </div>

        {user?.role === 'employer' && (
          <div className="mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'jobs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Posted Jobs
              </button>
            </nav>
          </div>
        )}

        {/* Job Seeker Applications */}
        {user?.role === 'jobseeker' && (
          <div className="space-y-6">
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start applying to jobs to see your applications here
                </p>
                <Link to="/jobs" className="btn-primary">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              applications.map((application, index) => (
                <div key={index} className="card">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <Link
                          to={`/jobs/${application.job._id}`}
                          className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {application.job.title}
                        </Link>
                        <div className="flex items-center ml-4">
                          {getStatusIcon(application.status)}
                          <span className={`badge ${getStatusColor(application.status)} ml-2`}>
                            {application.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <span className="font-medium">{application.job.company}</span>
                        <span className="mx-2">•</span>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{application.job.location}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span className="capitalize">
                            {application.job.jobType.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Status last updated: {new Date(application.appliedAt).toLocaleDateString()}
                        </div>
                        <Link
                          to={`/jobs/${application.job._id}`}
                          className="btn-outline"
                        >
                          View Job
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Employer Job Management */}
        {user?.role === 'employer' && (
          <>
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No jobs posted yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Post your first job to start receiving applications
                    </p>
                    <Link to="/post-job" className="btn-primary">
                      Post a Job
                    </Link>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div key={job._id} className="card">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <Link
                              to={`/jobs/${job._id}`}
                              className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {job.title}
                            </Link>
                            <span className={`badge ${job.isActive ? 'badge-green' : 'badge-gray'}`}>
                              {job.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{job.location}</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">
                              {job.jobType.replace('-', ' ')}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{job.applicants?.length || 0} applicants</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{job.views} views</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Last updated: {new Date(job.updatedAt).toLocaleDateString()}
                            </div>
                            <div className="flex space-x-2">
                              <Link
                                to={`/jobs/${job._id}`}
                                className="btn-outline"
                              >
                                View Job
                              </Link>
                              {job.applicants?.length > 0 && (
                                <Link
                                  to={`/jobs/${job._id}/applications`}
                                  className="btn-primary"
                                >
                                  View Applications ({job.applicants.length})
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-6">
                {jobs.filter(job => job.applicants?.length > 0).length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No applications received yet
                    </h3>
                    <p className="text-gray-600">
                      Applications will appear here once candidates start applying to your jobs
                    </p>
                  </div>
                ) : (
                  jobs
                    .filter(job => job.applicants?.length > 0)
                    .map((job) => (
                      <div key={job._id} className="card">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          <span className="badge badge-blue">
                            {job.applicants.length} applications
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-4">
                          Recent applications for this position
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Latest application: {
                              job.applicants.length > 0 
                                ? new Date(Math.max(...job.applicants.map(app => new Date(app.appliedAt)))).toLocaleDateString()
                                : 'N/A'
                            }
                          </div>
                          <Link
                            to={`/jobs/${job._id}/applications`}
                            className="btn-primary"
                          >
                            Review Applications
                          </Link>
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Applications;
