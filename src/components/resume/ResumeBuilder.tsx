import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchResumes, setCurrentResume } from '../../store/resumeSlice';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

const ResumeBuilder: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { resumes, currentResume, templates, isLoading, error } = useSelector((state: RootState) => state.resume);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeTab, setActiveTab] = useState('templates');

    useEffect(() => {
        setIsVisible(true);
        if (user) {
            dispatch(fetchResumes(user.id));
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

    const handleTemplateSelect = (template: any) => {
        if (resumes.length > 0) {
            const updatedResume = { ...resumes[0], template };
            dispatch(setCurrentResume(updatedResume));
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-blue-50 to-secondary-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access the resume builder</h2>
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
                                    <h1 className="text-xl font-bold text-gray-900">Resume Builder</h1>
                                    <p className="text-sm text-gray-600">Create your professional resume</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/dashboard"
                                    className="text-gray-600 hover:text-gray-900 transition duration-200 hover:scale-105"
                                >
                                    ← Back to Dashboard
                                </Link>
                                <button className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Welcome Section */}
                    <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Build Your Professional Resume</h2>
                                <p className="text-gray-600 mb-6">Choose a template and customize your resume with our easy-to-use builder</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className={`mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
                            <div className="flex space-x-1">
                                {[
                                    { id: 'templates', name: 'Templates', icon: '🎨' },
                                    { id: 'editor', name: 'Editor', icon: '✏️' },
                                    { id: 'preview', name: 'Preview', icon: '👁️' },
                                ].map((tab) => (
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
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        {activeTab === 'templates' && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose a Template</h3>
                                {isLoading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                                        <p className="mt-4 text-gray-600">Loading templates...</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {templates.map((template) => (
                                            <div
                                                key={template.id}
                                                onClick={() => handleTemplateSelect(template)}
                                                className="p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-500 hover:shadow-lg transition-all duration-300 group"
                                            >
                                                <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                                                    <div className="text-4xl">📄</div>
                                                </div>
                                                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                                                    {template.name}
                                                </h4>
                                                <p className="text-gray-600 text-sm">{template.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'editor' && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Your Resume</h3>
                                {error && (
                                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
                                        {error}
                                    </div>
                                )}
                                {isLoading && <LoadingSpinner message="Loading resume..." />}
                                {currentResume ? (
                                    <div className="space-y-6">
                                        {currentResume.sections.map((section) => (
                                            <div key={section.id} className="p-6 border border-gray-200 rounded-lg">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h4>
                                                <div className="space-y-4">
                                                    {section.type === 'header' && (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <input
                                                                type="text"
                                                                placeholder="Full Name"
                                                                className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                                                                defaultValue={section.content.fullName}
                                                            />
                                                            <input
                                                                type="email"
                                                                placeholder="Email"
                                                                className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                                                                defaultValue={section.content.email}
                                                            />
                                                            <input
                                                                type="tel"
                                                                placeholder="Phone"
                                                                className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                                                                defaultValue={section.content.phone}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Location"
                                                                className="p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                                                                defaultValue={section.content.location}
                                                            />
                                                        </div>
                                                    )}
                                                    {section.type === 'summary' && (
                                                        <textarea
                                                            placeholder="Write your professional summary..."
                                                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 h-32 resize-none"
                                                            defaultValue={section.content.content}
                                                        />
                                                    )}
                                                    {section.type === 'skills' && (
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="JavaScript, React, Node.js..."
                                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                                                                    defaultValue={section.content.technical.join(', ')}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Communication, Leadership..."
                                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                                                                    defaultValue={section.content.soft.join(', ')}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">📝</div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No Resume Selected</h4>
                                        <p className="text-gray-600 mb-4">Choose a template first to start editing your resume.</p>
                                        <button
                                            onClick={() => setActiveTab('templates')}
                                            className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                        >
                                            Choose Template
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'preview' && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Resume Preview</h3>
                                {currentResume ? (
                                    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg max-w-4xl mx-auto">
                                        <div className="text-center mb-6">
                                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentResume.sections[0].content.fullName}</h1>
                                            <p className="text-gray-600">{currentResume.sections[0].content.email} • {currentResume.sections[0].content.phone}</p>
                                            <p className="text-gray-600">{currentResume.sections[0].content.location}</p>
                                        </div>
                                        <div className="space-y-6">
                                            {currentResume.sections.slice(1).map((section) => (
                                                <div key={section.id}>
                                                    <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">{section.title}</h2>
                                                    {section.type === 'summary' && (
                                                        <p className="text-gray-700">{section.content.content}</p>
                                                    )}
                                                    {section.type === 'experience' && (
                                                        <div className="space-y-4">
                                                            {section.content.map((exp: any) => (
                                                                <div key={exp.id} className="mb-4">
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                                                        <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate || 'Present'}</span>
                                                                    </div>
                                                                    <p className="text-gray-600 mb-2">{exp.company}, {exp.location}</p>
                                                                    <p className="text-gray-700 mb-2">{exp.description}</p>
                                                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                                        {exp.achievements.map((achievement: string, index: number) => (
                                                                            <li key={index}>{achievement}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {section.type === 'skills' && (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 mb-2">Technical Skills</h4>
                                                                <p className="text-gray-700">{section.content.technical.join(', ')}</p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 mb-2">Soft Skills</h4>
                                                                <p className="text-gray-700">{section.content.soft.join(', ')}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">👁️</div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No Resume to Preview</h4>
                                        <p className="text-gray-600 mb-4">Create and edit your resume first to see the preview.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder; 