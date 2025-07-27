import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../store/authSlice';
import { AppDispatch } from '../../store';

const Dashboard: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeTab, setActiveTab] = useState('overview');

    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { categories, allSkills, assessmentResults } = useSelector((state: RootState) => state.skills);
    const { paths: learningPaths } = useSelector((state: RootState) => state.learningPath);
    const { resumes } = useSelector((state: RootState) => state.resume);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        setIsVisible(true);

        // Mouse move effect
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-secondary-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your dashboard</h2>
                    <Link
                        to="/login"
                        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', name: 'Overview', icon: '📊' },
        { id: 'skills', name: 'Skills', icon: '💻' },
        { id: 'learning', name: 'Learning Path', icon: '🚀' },
        { id: 'resume', name: 'Resume Builder', icon: '📝', link: '/resume-builder' },
        { id: 'goals', name: 'Goals', icon: '🎯' },
    ];

    // Get latest activity from Redux
    const latestAssessment = assessmentResults?.completedAt || null;
    const latestResume = resumes.length > 0 ? resumes[0].updatedAt : null;
    const latestLearningPath = learningPaths.length > 0 ? learningPaths[0].updatedAt : null;

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
                                <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center animate-glow">
                                    <span className="text-white font-bold text-lg">CP</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Career Planner</h1>
                                    <p className="text-sm text-gray-600">Welcome back, {user.firstName}!</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/skills-assessment"
                                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    Take Assessment
                                </Link>
                                <Link
                                    to="/learning-path"
                                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    View Learning Path
                                </Link>
                                <Link
                                    to="/job-recommendations"
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    Job Recommendations
                                </Link>
                                <button
                                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                    onClick={async () => {
                                        await dispatch(logoutUser());
                                        localStorage.removeItem('token');
                                        navigate('/login');
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Welcome Section */}
                    <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        Welcome back, {user.firstName}! 👋
                                    </h2>
                                    <p className="text-gray-600">
                                        Ready to continue your career journey? Let's see your progress and next steps.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary-600">75%</div>
                                    <div className="text-sm text-gray-600">Profile Complete</div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600 mb-1">{allSkills.length}</div>
                                    <div className="text-sm text-gray-600">Available Skills</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600 mb-1">{learningPaths.length}</div>
                                    <div className="text-sm text-gray-600">Learning Paths</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600 mb-1">{categories.length}</div>
                                    <div className="text-sm text-gray-600">Skill Categories</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600 mb-1">{resumes.length}</div>
                                    <div className="text-sm text-gray-600">Resumes Created</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className={`mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
                            <div className="flex space-x-1">
                                {tabs.map((tab) =>
                                    tab.link ? (
                                        <Link
                                            key={tab.id}
                                            to={tab.link}
                                            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="mr-2">{tab.icon}</span>
                                            {tab.name}
                                        </Link>
                                    ) : (
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
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        {activeTab === 'overview' && (
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Recent Activity */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                                    <div className="space-y-4">
                                        {latestAssessment && (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <span className="text-green-600 text-sm">✓</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Completed Skills Assessment</p>
                                                    <p className="text-xs text-gray-500">{new Date(latestAssessment).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        )}
                                        {latestResume && (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 text-sm">📄</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Updated Resume</p>
                                                    <p className="text-xs text-gray-500">{new Date(latestResume).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        )}
                                        {latestLearningPath && (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <span className="text-purple-600 text-sm">🚀</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Learning Path Updated</p>
                                                    <p className="text-xs text-gray-500">{new Date(latestLearningPath).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        )}
                                        {!latestAssessment && !latestResume && !latestLearningPath && (
                                            <div className="text-gray-600">No recent activity yet.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Next Steps */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
                                            <h4 className="font-semibold text-gray-900 mb-2">Complete Your Profile</h4>
                                            <p className="text-sm text-gray-600 mb-3">Add your current position and experience to get better recommendations.</p>
                                            <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                                                Update Profile →
                                            </button>
                                        </div>
                                        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                                            <h4 className="font-semibold text-gray-900 mb-2">Start Learning Path</h4>
                                            <p className="text-sm text-gray-600 mb-3">Based on your assessment, we recommend starting with JavaScript fundamentals.</p>
                                            <Link
                                                to="/learning-path"
                                                className="text-green-600 text-sm font-medium hover:text-green-700 underline"
                                            >
                                                View Learning Path →
                                            </Link>
                                        </div>
                                        <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                                            <h4 className="font-semibold text-gray-900 mb-2">Set Career Goals</h4>
                                            <p className="text-sm text-gray-600 mb-3">Define your career objectives and track your progress.</p>
                                            <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                                                Set Goals →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'skills' && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Available Skills</h3>
                                {categories.length > 0 ? (
                                    <div className="space-y-6">
                                        {categories.map((category) => (
                                            <div key={category.id} className="border border-gray-200 rounded-lg p-6">
                                                <div className="flex items-center mb-4">
                                                    <span className="text-2xl mr-3">{category.icon}</span>
                                                    <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
                                                    <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                                        {category.skills.length} skills
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-4">{category.description}</p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {category.skills.slice(0, 6).map((skill) => (
                                                        <div key={skill.id} className="p-3 bg-gray-50 rounded-lg">
                                                            <h5 className="font-medium text-gray-900 text-sm">{skill.name}</h5>
                                                            {skill.description && (
                                                                <p className="text-xs text-gray-600 mt-1">{skill.description}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                {category.skills.length > 6 && (
                                                    <p className="text-sm text-gray-500 mt-3">
                                                        +{category.skills.length - 6} more skills available
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                        <div className="text-center pt-4">
                                            <Link
                                                to="/skills-assessment"
                                                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                            >
                                                Take Skills Assessment
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-4xl mb-4">💻</div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Skills Loading...</h4>
                                        <p className="text-gray-600">Please wait while we load the available skills.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'learning' && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Learning Paths</h3>
                                <div className="space-y-6">
                                    {learningPaths.length > 0 ? (
                                        learningPaths.map((path) => (
                                            <div key={path.id} className="p-6 border border-gray-200 rounded-lg">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-semibold text-gray-900">{path.title}</h4>
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                                                        {path.progress ? `${path.progress}%` : 'In Progress'}
                                                    </span>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                        <span>Progress</span>
                                                        <span>{path.progress ? `${path.progress}%` : '0%'}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${path.progress || 0}%` }}></div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 mb-4">{path.description}</p>
                                                <button className="text-primary-600 font-medium hover:text-primary-700">
                                                    Continue Learning →
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-600">No learning paths found. Start one from the Learning Path page.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'resume' && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Resume Builder</h3>
                                    <Link
                                        to="/resume-builder"
                                        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                    >
                                        Create Resume
                                    </Link>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Resumes</h4>
                                    {resumes.length > 0 ? (
                                        resumes.map((resume) => (
                                            <div key={resume.id} className="p-4 border border-gray-200 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900">{resume.title}</h5>
                                                        <p className="text-sm text-gray-600">Last updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{resume.sections && resume.sections.length > 0 ? 'Complete' : 'Draft'}</span>
                                                        <Link to="/resume-builder" className="text-primary-600 text-sm font-medium hover:text-primary-700">
                                                            Edit
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-600">No resumes found. Create one from the Resume Builder page.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'goals' && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Career Goals</h3>
                                    <button className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                        + Add Goal
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900">Land Frontend Developer Role</h4>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Q4 2024</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">Secure a frontend developer position at a tech company.</p>
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-500">Progress: 40%</div>
                                            <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                                                Update Progress
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900">Complete React Certification</h4>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Q1 2025</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">Earn React certification to validate skills and boost resume.</p>
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-500">Progress: 25%</div>
                                            <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                                                Update Progress
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard; 