import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
    fetchJobRecommendations,
    saveJob,
    applyToJob,
    setFilters,
    clearFilters,
    toggleJobSaved
} from '../../store/jobRolesSlice';
import { JobRole } from '../../types/jobRoles';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import JobAnalytics from './JobAnalytics';

const JobRecommendations: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeTab, setActiveTab] = useState('recommendations');
    const [selectedJob, setSelectedJob] = useState<JobRole | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('matchScore');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [applicationData, setApplicationData] = useState({
        coverLetter: '',
        notes: '',
        expectedSalary: ''
    });

    const dispatch = useDispatch<AppDispatch>();
    const {
        recommendations,
        savedJobs,
        appliedJobs,
        filters,
        isLoading,
        error,
        totalResults,
    } = useSelector((state: RootState) => state.jobRoles);

    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        setIsVisible(true);
        dispatch(fetchJobRecommendations(filters));

        // Mouse move effect
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [dispatch, filters]);

    const handleSaveJob = (jobId: string) => {
        dispatch(saveJob(jobId));
        dispatch(toggleJobSaved(jobId));
    };

    const handleApplyToJob = (jobId: string) => {
        setSelectedJob(recommendations.find(job => job.id === jobId) || null);
        setShowApplicationModal(true);
    };

    const handleSubmitApplication = () => {
        if (selectedJob) {
            dispatch(applyToJob(selectedJob.id));
            setShowApplicationModal(false);
            setSelectedJob(null);
            setApplicationData({ coverLetter: '', notes: '', expectedSalary: '' });
        }
    };

    const handleFilterChange = (filterType: string, value: any) => {
        dispatch(setFilters({ [filterType]: value }));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        setSearchQuery('');
    };

    const formatSalary = (min: number, max: number, currency: string) => {
        return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
    };

    const getMatchScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600 bg-green-100';
        if (score >= 80) return 'text-blue-600 bg-blue-100';
        if (score >= 70) return 'text-yellow-600 bg-yellow-100';
        return 'text-gray-600 bg-gray-100';
    };

    const getMatchScoreIcon = (score: number) => {
        if (score >= 90) return '🎯';
        if (score >= 80) return '⭐';
        if (score >= 70) return '👍';
        return '📋';
    };

    const filteredJobs = recommendations.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    const sortedJobs = [...filteredJobs].sort((a, b) => {
        switch (sortBy) {
            case 'matchScore':
                return b.matchScore - a.matchScore;
            case 'salary':
                return b.salary.max - a.salary.max;
            case 'date':
                return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    const tabs = [
        { id: 'recommendations', name: 'Recommendations', icon: '🎯', count: recommendations.length },
        { id: 'saved', name: 'Saved Jobs', icon: '❤️', count: savedJobs.length },
        { id: 'applied', name: 'Applied', icon: '📝', count: appliedJobs.length },
        { id: 'analytics', name: 'Analytics', icon: '📊', count: 0 },
    ];

    const renderJobCard = (job: JobRole) => (
        <div
            key={job.id}
            className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            onClick={() => setSelectedJob(job)}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <span className="text-lg">{getMatchScoreIcon(job.matchScore)}</span>
                    </div>
                    <p className="text-gray-600 mb-1">{job.company}</p>
                    <p className="text-gray-500 text-sm mb-2">{job.location} • {job.type}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
                        {job.matchScore}% Match
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSaveJob(job.id);
                        }}
                        className={`p-2 rounded-full transition-colors duration-200 ${job.isSaved
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-gray-400 hover:text-red-500'
                            }`}
                    >
                        <svg className="w-5 h-5" fill={job.isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {skill}
                    </span>
                ))}
                {job.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{job.skills.length - 3} more
                    </span>
                )}
            </div>

            <div className="flex justify-between items-center">
                <div className="text-lg font-semibold text-green-600">
                    {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                </div>
                <div className="flex space-x-2">
                    {!job.isApplied ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleApplyToJob(job.id);
                            }}
                            className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            Apply Now
                        </button>
                    ) : (
                        <span className="px-3 py-2 bg-green-100 text-green-700 text-sm rounded-lg font-medium">
                            Applied ✓
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    const renderAdvancedFilters = () => (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                    {showFilters ? 'Hide' : 'Show'} Filters
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search jobs, companies, locations, or skills..."
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {showFilters && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                        <select
                            value={filters.experience[0] || ''}
                            onChange={(e) => handleFilterChange('experience', e.target.value ? [e.target.value] : [])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="">All Levels</option>
                            <option value="entry">Entry Level</option>
                            <option value="mid">Mid Level</option>
                            <option value="senior">Senior Level</option>
                            <option value="lead">Lead Level</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                        <select
                            value={filters.jobType[0] || ''}
                            onChange={(e) => handleFilterChange('jobType', e.target.value ? [e.target.value] : [])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="">All Types</option>
                            <option value="full-time">Full Time</option>
                            <option value="part-time">Part Time</option>
                            <option value="contract">Contract</option>
                            <option value="remote">Remote</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary</label>
                        <input
                            type="number"
                            value={filters.salary.min}
                            onChange={(e) => handleFilterChange('salary', { ...filters.salary, min: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary</label>
                        <input
                            type="number"
                            value={filters.salary.max}
                            onChange={(e) => handleFilterChange('salary', { ...filters.salary, max: parseInt(e.target.value) || 200000 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="200000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                        <select
                            value={filters.industry[0] || ''}
                            onChange={(e) => handleFilterChange('industry', e.target.value ? [e.target.value] : [])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="">All Industries</option>
                            <option value="technology">Technology</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="finance">Finance</option>
                            <option value="education">Education</option>
                            <option value="retail">Retail</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            value={filters.location[0] || ''}
                            onChange={(e) => handleFilterChange('location', e.target.value ? [e.target.value] : [])}
                            placeholder="City, State, or Remote"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="matchScore">Best Match</option>
                            <option value="salary">Highest Salary</option>
                            <option value="date">Newest</option>
                            <option value="title">Job Title</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                List
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handleClearFilters}
                    className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                    Clear All Filters
                </button>
                <span className="text-sm text-gray-500">
                    {filteredJobs.length} of {totalResults} jobs found
                </span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-secondary-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`
                }}
            />

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-float"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-20 animate-bounce-slow"></div>

            <div className="relative z-10">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/dashboard"
                                    className="text-gray-600 hover:text-gray-900 transition duration-200"
                                >
                                    ← Back to Dashboard
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Job Recommendations</h1>
                                    <p className="text-sm text-gray-600">AI-powered job suggestions based on your profile</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => dispatch(fetchJobRecommendations(filters))}
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                                >
                                    {isLoading ? 'Refreshing...' : 'Refresh'}
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Advanced Filters */}
                    {renderAdvancedFilters()}

                    {/* Tabs */}
                    <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
                            <div className="flex space-x-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="mr-2">{tab.icon}</span>
                                        {tab.name}
                                        <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        {activeTab === 'recommendations' && (
                            <div className="grid gap-6">
                                {error && (
                                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
                                        {error}
                                    </div>
                                )}
                                {isLoading && <LoadingSpinner message="Loading job recommendations..." />}
                                {sortedJobs.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">🔍</div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                                        <p className="text-gray-600 mb-4">Try adjusting your filters or check back later for new opportunities.</p>
                                        <button
                                            onClick={handleClearFilters}
                                            className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className={viewMode === 'grid' ? 'grid gap-6' : 'space-y-4'}>
                                        {sortedJobs.map(renderJobCard)}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'saved' && (
                            <div className="grid gap-6">
                                {savedJobs.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">❤️</div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
                                        <p className="text-gray-600">Save interesting jobs to review them later.</p>
                                    </div>
                                ) : (
                                    <div className={viewMode === 'grid' ? 'grid gap-6' : 'space-y-4'}>
                                        {savedJobs.map(renderJobCard)}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'applied' && (
                            <div className="grid gap-6">
                                {appliedJobs.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">📝</div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                                        <p className="text-gray-600">Start applying to jobs to track your applications here.</p>
                                    </div>
                                ) : (
                                    <div className={viewMode === 'grid' ? 'grid gap-6' : 'space-y-4'}>
                                        {appliedJobs.map(renderJobCard)}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <JobAnalytics />
                        )}
                    </div>
                </main>
            </div>

            {/* Job Detail Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                                    <p className="text-gray-600 mb-1">{selectedJob.company}</p>
                                    <p className="text-gray-500">{selectedJob.location} • {selectedJob.type}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-700">{selectedJob.description}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h3>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                                        {selectedJob.requirements.map((req, index) => (
                                            <li key={index}>{req}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Responsibilities</h3>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                                        {selectedJob.responsibilities.map((resp, index) => (
                                            <li key={index}>{resp}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedJob.skills.map((skill, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                                    <div className="text-xl font-semibold text-green-600">
                                        {formatSalary(selectedJob.salary.min, selectedJob.salary.max, selectedJob.salary.currency)}
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => {
                                                handleSaveJob(selectedJob.id);
                                                setSelectedJob(null);
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${selectedJob.isSaved
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {selectedJob.isSaved ? 'Saved' : 'Save Job'}
                                        </button>
                                        {!selectedJob.isApplied ? (
                                            <button
                                                onClick={() => {
                                                    handleApplyToJob(selectedJob.id);
                                                    setSelectedJob(null);
                                                }}
                                                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                            >
                                                Apply Now
                                            </button>
                                        ) : (
                                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                                                Applied ✓
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Application Modal */}
            {showApplicationModal && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply to {selectedJob.title}</h2>
                                    <p className="text-gray-600">{selectedJob.company}</p>
                                </div>
                                <button
                                    onClick={() => setShowApplicationModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                                    <textarea
                                        value={applicationData.coverLetter}
                                        onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                                        rows={6}
                                        placeholder="Write a compelling cover letter explaining why you're the perfect fit for this role..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary</label>
                                    <input
                                        type="text"
                                        value={applicationData.expectedSalary}
                                        onChange={(e) => setApplicationData({ ...applicationData, expectedSalary: e.target.value })}
                                        placeholder="e.g., $80,000 - $100,000"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                                    <textarea
                                        value={applicationData.notes}
                                        onChange={(e) => setApplicationData({ ...applicationData, notes: e.target.value })}
                                        rows={3}
                                        placeholder="Any additional information you'd like to share..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => setShowApplicationModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmitApplication}
                                        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                    >
                                        Submit Application
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobRecommendations; 