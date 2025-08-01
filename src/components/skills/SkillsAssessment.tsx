import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { fetchSkillsCategories } from '../../store/skillsSlice';
import AIAssessment from './AIAssessment';

const SkillsAssessment: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const dispatch = useDispatch<AppDispatch>();
    const { error } = useSelector((state: RootState) => state.skills);

    useEffect(() => {
        setIsVisible(true);
        dispatch(fetchSkillsCategories());

        // Mouse move effect
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [dispatch]);

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
            <div className="absolute top-60 left-1/4 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-40 right-1/3 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="max-w-4xl mx-auto mb-6">
                    <Link
                        to="/dashboard"
                        className={`inline-flex items-center text-gray-600 hover:text-gray-900 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>

                {/* Header */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="text-center">
                        <h1 className={`text-4xl font-bold text-gray-900 mb-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            AI-Powered Skills Assessment
                        </h1>
                        <p className={`text-xl text-gray-600 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            Get personalized assessment questions generated by AI to evaluate your skills
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto">
                    <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <AIAssessment />
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="max-w-4xl mx-auto mt-8">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
                            {error}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillsAssessment; 