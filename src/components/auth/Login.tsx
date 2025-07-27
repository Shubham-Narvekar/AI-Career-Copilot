import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { loginUser, clearError } from '../../store/authSlice';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError());
        await dispatch(loginUser(formData));
    };

    // Redirect to dashboard after successful login
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

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

            <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className={`max-w-md w-full space-y-8 animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center animate-glow mb-4">
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className={`text-3xl font-bold text-gray-900 mb-2 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            Welcome Back
                        </h2>
                        <p className={`text-gray-600 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            Sign in to your Career Planner account
                        </p>
                    </div>

                    <div className={`bg-white/80 backdrop-blur-sm py-8 px-6 shadow-2xl rounded-2xl border border-white/20 animate-slide-up transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className={`appearance-none relative block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:z-10 sm:text-sm transition-all duration-300 ${focusedField === 'email'
                                            ? 'border-primary-500 focus:ring-primary-500 focus:border-primary-500 shadow-lg'
                                            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                                            }`}
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                    {focusedField === 'email' && (
                                        <div className="absolute inset-0 border-2 border-primary-500 rounded-lg animate-pulse-slow pointer-events-none"></div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className={`appearance-none relative block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:z-10 sm:text-sm transition-all duration-300 ${focusedField === 'password'
                                            ? 'border-primary-500 focus:ring-primary-500 focus:border-primary-500 shadow-lg'
                                            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                                            }`}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                    {focusedField === 'password' && (
                                        <div className="absolute inset-0 border-2 border-primary-500 rounded-lg animate-pulse-slow pointer-events-none"></div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    <button
                                        type="button"
                                        className="font-medium text-primary-600 hover:text-primary-500 transition duration-200 hover:scale-105"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl transform hover:scale-105 animate-float"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </div>
                                    ) : (
                                        <span className="flex items-center">
                                            Sign In
                                            <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <a href="/register" className="font-medium text-primary-600 hover:text-primary-500 transition duration-200 hover:scale-105 inline-block">
                                        Sign up
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Back to Home Link */}
                    <div className="text-center">
                        <a
                            href="/"
                            className="text-sm text-gray-500 hover:text-gray-700 transition duration-200 hover:scale-105 inline-flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 