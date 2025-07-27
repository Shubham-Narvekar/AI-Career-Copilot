import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const LandingPage: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        setIsVisible(true);

        // Auto-rotate features
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 4);
        }, 3000);

        // Mouse move effect
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            clearInterval(interval);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const features = [
        {
            title: "AI-Powered Career Guidance",
            description: "Get personalized career recommendations based on your skills and interests",
            icon: "🎯",
            color: "from-blue-500 to-purple-600"
        },
        {
            title: "Skills Assessment",
            description: "Evaluate your current skills and identify areas for improvement",
            icon: "📊",
            color: "from-green-500 to-teal-600"
        },
        {
            title: "Learning Paths",
            description: "Follow AI-generated learning roadmaps tailored to your goals",
            icon: "🚀",
            color: "from-orange-500 to-red-600"
        },
        {
            title: "Resume Builder",
            description: "Create professional resumes with AI-powered suggestions",
            icon: "📝",
            color: "from-purple-500 to-pink-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`
                }}
            />

            {/* Navigation */}
            <nav className="relative z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center animate-glow">
                            <span className="text-white font-bold text-lg">CP</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Career Planner</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <Link
                                to="/dashboard"
                                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 animate-pulse-slow"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-gray-900 transition duration-200 hover:scale-105"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 animate-pulse-slow"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <h1 className={`text-5xl md:text-7xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}>
                            Your AI Career
                            <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent animate-glow">
                                Copilot
                            </span>
                        </h1>
                        <p className={`text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}>
                            Intelligent career planning for students and professionals.
                            Get personalized guidance, skill assessments, and learning paths powered by AI.
                        </p>
                        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}>
                            <Link
                                to="/skills-assessment"
                                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition duration-200 animate-float"
                            >
                                Start Skills Assessment
                            </Link>
                            <Link
                                to="/register"
                                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-primary-600 hover:text-primary-600 transition duration-200 hover:scale-105"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Enhanced Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-float"></div>
                <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse-slow"></div>
                <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-20 animate-bounce-slow"></div>
                <div className="absolute top-60 left-1/4 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-40 right-1/3 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
                            Why Choose Career Planner?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
                            Our AI-powered platform helps you make informed career decisions with personalized insights and guidance.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`relative p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group ${activeFeature === index ? 'ring-2 ring-primary-500 animate-glow' : ''
                                    }`}
                                onClick={() => setActiveFeature(index)}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="text-2xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                                    {feature.description}
                                </p>
                                {activeFeature === index && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10 rounded-xl animate-pulse"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-primary-50 to-secondary-50 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="animate-fade-in transform hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl font-bold text-primary-600 mb-2 animate-float">10K+</div>
                            <div className="text-gray-600">Active Users</div>
                        </div>
                        <div className="animate-fade-in transform hover:scale-105 transition-transform duration-300" style={{ animationDelay: '200ms' }}>
                            <div className="text-4xl font-bold text-secondary-600 mb-2 animate-float" style={{ animationDelay: '1s' }}>95%</div>
                            <div className="text-gray-600">Success Rate</div>
                        </div>
                        <div className="animate-fade-in transform hover:scale-105 transition-transform duration-300" style={{ animationDelay: '400ms' }}>
                            <div className="text-4xl font-bold text-primary-600 mb-2 animate-float" style={{ animationDelay: '2s' }}>500+</div>
                            <div className="text-gray-600">Career Paths</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fade-in">
                        Ready to Transform Your Career?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                        Join thousands of professionals who have already discovered their perfect career path with AI guidance.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-10 py-4 rounded-lg text-xl font-semibold hover:shadow-xl transform hover:scale-105 transition duration-200 animate-float"
                    >
                        Get Started Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center animate-glow">
                                    <span className="text-white font-bold text-lg">CP</span>
                                </div>
                                <span className="text-xl font-bold">Career Planner</span>
                            </div>
                            <p className="text-gray-400">
                                Your intelligent career planning companion powered by AI.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Product</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition duration-200 hover:scale-105 inline-block">Features</a></li>
                                <li><a href="#" className="hover:text-white transition duration-200 hover:scale-105 inline-block">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition duration-200 hover:scale-105 inline-block">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition duration-200 hover:scale-105 inline-block">About</a></li>
                                <li><a href="#" className="hover:text-white transition duration-200 hover:scale-105 inline-block">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition duration-200 hover:scale-105 inline-block">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition duration-200 hover:scale-105 inline-block">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition duration-200 hover:scale-105 inline-block">Contact</a></li>
                                <li><a href="#" className="hover:text-white transition duration-200 hover:scale-105 inline-block">Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Career Planner. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage; 