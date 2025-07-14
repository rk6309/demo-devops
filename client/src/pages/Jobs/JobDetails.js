import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  MapPin, Clock, DollarSign, Briefcase, Calendar, 
  Users, Eye, ArrowLeft, ExternalLink 
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`/api/jobs/${id}`);
      setJob(response.data);
      
      // Check if user has already applied
      if (user && response.data.applicants) {
        const applied = response.data.applicants.some(
          applicant => applicant.user === user.id
        );
        setHasApplied(applied);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply for jobs');
      return;
    }

    if (user.role !== 'jobseeker') {
      toast.error('Only job seekers can apply for jobs');
      return;
    }

    setApplying(true);
    try {
      await axios.post(`/api/jobs/${id}/apply`);
      toast.success('Application submitted successfully!');
      setHasApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Salary not disclosed';
    
    const formatAmount = (amount) => {
      if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
      if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
      return amount.toString();
    };

    if (salary.min && salary.max) {
      return `${formatAmount(salary.min)} - ${formatAmount(salary.max)} ${salary.currency || 'USD'}`;
    } else if (salary.min) {
      return `${formatAmount(salary.min)}+ ${salary.currency || 'USD'}`;
    } else if (salary.max) {
      return `Up to ${formatAmount(salary.max)} ${salary.currency || 'USD'}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
          <Link to="/jobs" className="btn-primary">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                
                <div className="flex items-center text-lg text-gray-600 mb-4">
                  <span className="font-semibold">{job.company}</span>
                  {job.employer?.profile?.website && (
                    <a
                      href={job.employer.profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="capitalize">{job.workMode}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>{formatSalary(job.salary)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge badge-blue">
                    {job.experienceLevel.replace('-', ' ')}
                  </span>
                  {job.minExperience !== undefined && job.maxExperience !== undefined && (
                    <span className="badge badge-gray">
                      {job.minExperience}-{job.maxExperience} years
                    </span>
                  )}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{job.views} views</span>
                  <span className="mx-2">•</span>
                  <Users className="h-4 w-4 mr-1" />
                  <span>{job.applicants?.length || 0} applicants</span>
                </div>
              </div>

              {/* Apply Button */}
              <div className="mt-6 lg:mt-0 lg:ml-6">
                {user?.role === 'jobseeker' ? (
                  <button
                    onClick={handleApply}
                    disabled={applying || hasApplied}
                    className={`btn-primary w-full lg:w-auto ${
                      hasApplied ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {applying ? 'Applying...' : hasApplied ? 'Applied' : 'Apply Now'}
                  </button>
                ) : user?.role === 'employer' ? (
                  <div className="text-sm text-gray-600">
                    {job.employer?._id === user.id ? (
                      <Link to={`/jobs/${job._id}/applications`} className="btn-primary">
                        View Applications
                      </Link>
                    ) : (
                      'Employer view'
                    )}
                  </div>
                ) : (
                  <Link to="/login" className="btn-primary">
                    Login to Apply
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Job Description */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Job Description
                  </h2>
                  <div className="prose prose-blue max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>
                </section>

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Requirements
                    </h2>
                    <ul className="space-y-2">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Responsibilities */}
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Responsibilities
                    </h2>
                    <ul className="space-y-2">
                      {job.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Benefits
                    </h2>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Skills Required */}
                {job.skills && job.skills.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Skills Required
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="badge badge-blue">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Company Info */}
                {job.employer && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      About {job.company}
                    </h3>
                    {job.employer.profile?.description && (
                      <p className="text-gray-700 mb-4">
                        {job.employer.profile.description}
                      </p>
                    )}
                    {job.employer.profile?.website && (
                      <a
                        href={job.employer.profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        Visit Website
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    )}
                  </div>
                )}

                {/* Application Deadline */}
                {job.applicationDeadline && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Application Deadline
                    </h3>
                    <p className="text-gray-700">
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
