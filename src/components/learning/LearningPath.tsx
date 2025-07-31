import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchLearningPaths } from '../../store/learningPathSlice';
import { generatePersonalizedLearningPath } from '../../store/skillsSlice';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

const LearningPath: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { paths, isLoading, error } = useSelector((state: RootState) => state.learningPath);
    const { isLoading: isGenerating } = useSelector((state: RootState) => state.skills);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showGenerator, setShowGenerator] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<string>('');
    const [currentLevel, setCurrentLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
    const [generatedPath, setGeneratedPath] = useState<any>(null);

    const skills = [
        'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'C#',
        'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'Flutter',
        'Data Analysis', 'Machine Learning', 'Deep Learning', 'Data Visualization',
        'SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API',
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'DevOps',
        'UI/UX Design', 'Graphic Design', 'Product Management', 'Agile', 'Scrum'
    ];

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

    const handleGenerateLearningPath = async () => {
        if (!selectedSkill) {
            alert('Please select a skill');
            return;
        }

        try {
            const response = await dispatch(generatePersonalizedLearningPath({
                skill: selectedSkill,
                currentLevel
            }) as any);
            
            if (response.payload) {
                setGeneratedPath(response.payload);
                setShowGenerator(false);
            }
        } catch (error) {
            console.error('Failed to generate learning path:', error);
        }
    };

    const handleBackToGenerator = () => {
        setShowGenerator(true);
        setGeneratedPath(null);
    };

    const handleSavePath = () => {
        // TODO: Implement saving the generated path to user's learning paths
        alert('Feature coming soon: Save learning path to your profile');
    };

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

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className={`text-4xl font-bold text-gray-900 mb-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Your Learning Path</h1>
                    <p className={`text-xl text-gray-600 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Personalized roadmap to achieve your career goals</p>
                </div>

                {/* Generate New Path Button */}
                <div className="mb-8 text-center">
                    <button
                        onClick={() => setShowGenerator(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        🚀 Generate New Learning Path
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
                        {error}
                    </div>
                )}

                {/* Learning Path Generator */}
                {showGenerator && (
                    <div className="mb-8 bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Generate Your Learning Path
                        </h2>
                        <p className="text-gray-600 mb-8 text-center">
                            Get a personalized learning roadmap for any skill you want to master
                        </p>

                        <div className="space-y-6">
                            {/* Skill Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    What skill do you want to learn?
                                </label>
                                <select
                                    value={selectedSkill}
                                    onChange={(e) => setSelectedSkill(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select a skill...</option>
                                    {skills.map((skill) => (
                                        <option key={skill} value={skill}>{skill}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Current Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    What's your current level?
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { value: 'beginner', label: 'Beginner', description: 'New to this skill' },
                                        { value: 'intermediate', label: 'Intermediate', description: 'Some experience' },
                                        { value: 'advanced', label: 'Advanced', description: 'Experienced practitioner' }
                                    ].map((level) => (
                                        <button
                                            key={level.value}
                                            onClick={() => setCurrentLevel(level.value as any)}
                                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                                                currentLevel === level.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <h3 className="font-semibold text-gray-900">{level.label}</h3>
                                            <p className="text-sm text-gray-600">{level.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <div className="pt-4 flex gap-4">
                                <button
                                    onClick={handleGenerateLearningPath}
                                    disabled={!selectedSkill || isGenerating}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isGenerating ? 'Generating...' : '🚀 Generate Learning Path'}
                                </button>
                                <button
                                    onClick={() => setShowGenerator(false)}
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Generated Learning Path */}
                {generatedPath && (
                    <div className="mb-8 bg-white rounded-lg shadow-lg p-8">
                        <div className="mb-6">
                            <button
                                onClick={handleBackToGenerator}
                                className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Generate Another Path
                            </button>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{generatedPath.title}</h2>
                            <p className="text-gray-600">{generatedPath.description}</p>
                        </div>

                        {/* Learning Steps */}
                        <div className="space-y-6">
                            {generatedPath.steps?.map((step: any, index: number) => (
                                <div key={index} className="p-6 rounded-xl border-2 border-gray-100 bg-gray-50 shadow-md">
                                    <div className="flex items-start mb-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                                            <p className="text-gray-600 mb-4">{step.description}</p>
                                            
                                            {/* Resources */}
                                            {step.resources && step.resources.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="font-semibold text-gray-900 mb-2">Resources:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {step.resources.map((resource: string, resIndex: number) => (
                                                            <span
                                                                key={resIndex}
                                                                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                                                            >
                                                                {resource}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Estimated Time */}
                                            {step.estimatedTime && (
                                                <div className="text-sm text-gray-500">
                                                    ⏱️ Estimated time: {step.estimatedTime}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Save Button */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleSavePath}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-200"
                            >
                                💾 Save to My Learning Paths
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && <LoadingSpinner message="Loading learning paths..." />}

                {/* No Learning Paths */}
                {!isLoading && !error && paths.length === 0 && !showGenerator && !generatedPath && (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">🚀</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No Learning Path Yet</h4>
                        <p className="text-gray-600 mb-4">Generate your first personalized learning path to get started!</p>
                        <button
                            onClick={() => setShowGenerator(true)}
                            className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            Generate Learning Path
                        </button>
                    </div>
                )}

                {/* Existing Learning Paths */}
                {!isLoading && !error && paths.length > 0 && !showGenerator && !generatedPath && (
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