import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchLearningPaths } from '../../store/learningPathSlice';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

const LearningPath: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { paths, isLoading, error } = useSelector((state: RootState) => state.learningPath);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setIsVisible(true);
        if (user) {
            dispatch(fetchLearningPaths());
        }
        // Mouse move effect
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [dispatch, user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-blue-50 to-secondary-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your learning path</h2>
                    <Link to="/login" className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">Go to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-secondary-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`
                }}
            />
            <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-float"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-20 animate-bounce-slow"></div>

            <div className="relative z-10 max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Back to Dashboard Button */}
                <div className="mb-8">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center text-primary-600 hover:text-primary-800 font-semibold text-base transition duration-200 hover:underline"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
                <div className="mb-10 text-center">
                    <h1 className={`text-4xl font-bold text-gray-900 mb-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Your Learning Path</h1>
                    <p className={`text-xl text-gray-600 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Personalized roadmap to achieve your career goals</p>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
                        {error}
                    </div>
                )}
                {isLoading && <LoadingSpinner message="Loading learning paths..." />}
                {!isLoading && !error && paths.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">🚀</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No Learning Path Yet</h4>
                        <p className="text-gray-600 mb-4">Complete a skills assessment to generate your personalized learning path.</p>
                        <Link to="/skills-assessment" className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">Take Assessment</Link>
                    </div>
                )}
                {!isLoading && !error && paths.length > 0 && (
                    <div className="space-y-10">
                        {paths.map((path) => (
                            <div key={path.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 animate-fade-in">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{path.title}</h2>
                                        <p className="text-gray-600 mb-2">{path.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {path.recommendedFor.map((role) => (
                                                <span key={role} className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">{role}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end mt-4 md:mt-0">
                                        <span className="text-lg font-semibold text-primary-600 mb-1">{path.progress}% Complete</span>
                                        <div className="w-48 bg-gray-200 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${path.progress}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {path.steps.map((step) => (
                                        <div key={step.id} className="p-6 rounded-xl border-2 border-gray-100 bg-white/90 shadow-md flex flex-col md:flex-row md:items-center md:justify-between group hover:shadow-xl transition-all duration-300">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-xl mr-3">{step.status === 'completed' ? '✅' : step.status === 'in-progress' ? '⏳' : '📝'}</span>
                                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">{step.title}</h3>
                                                </div>
                                                <p className="text-gray-600 mb-2">{step.description}</p>
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {step.resources.map((res) => (
                                                        <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-all duration-200">
                                                            {res.title}
                                                        </a>
                                                    ))}
                                                </div>
                                                <div className="text-xs text-gray-500">Estimated time: {step.estimatedTimeHours} hours</div>
                                            </div>
                                            <div className="flex flex-col items-end mt-4 md:mt-0 md:ml-8">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${step.status === 'completed' ? 'bg-green-100 text-green-700' : step.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{step.status.replace('-', ' ')}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningPath; 