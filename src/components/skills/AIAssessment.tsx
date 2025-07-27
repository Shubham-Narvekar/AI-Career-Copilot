import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
    generateAssessmentQuestions,
    generateSkillRecommendations,
    generatePersonalizedLearningPath,
    setAnswer,
    setCurrentQuestion,
    clearAssessment
} from '../../store/skillsSlice';
import { AIGeneratedQuestion } from '../../types/skills';
import LoadingSpinner from '../common/LoadingSpinner';

interface Skill {
    id: string;
    name: string;
    description?: string;
    category?: string;
}

const AIAssessment: React.FC = () => {
    const dispatch = useDispatch();
    const { categories, allSkills, skillCategories, currentAssessment, currentQuestionIndex, answers, isLoading, error } = useSelector(
        (state: RootState) => state.skills
    );

    const [selectedSkill, setSelectedSkill] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
    const [questionCount, setQuestionCount] = useState<number>(5);
    const [showSkillSelection, setShowSkillSelection] = useState<boolean>(true);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [assessmentScore, setAssessmentScore] = useState<number>(0);
    const [aiStatus, setAiStatus] = useState<string>(''); // Added for AI status

    // Get skills for selected category
    const skillsInCategory = selectedCategory 
        ? allSkills.filter(skill => skill.category === selectedCategory)
        : [];

    // Handle category selection
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setSelectedSkill(''); // Reset skill selection when category changes
    };

    const handleStartAssessment = async () => {
        if (!selectedSkill || !selectedCategory) {
            alert('Please select both a skill and category');
            return;
        }

        try {
            const response = await dispatch(generateAssessmentQuestions({
                skill: selectedSkill,
                category: selectedCategory,
                count: questionCount,
                difficulty
            }) as any);
            
            // Check if the response has metadata with AI status
            if (response.meta?.arg && response.payload) {
                // Try to get AI status from the response
                const aiStatusFromResponse = response.payload.metadata?.aiStatus || 'UNKNOWN';
                setAiStatus(aiStatusFromResponse);
            }
            
            setShowSkillSelection(false);
        } catch (error) {
            console.error('Failed to start assessment:', error);
        }
    };

    const handleAnswerSelect = (questionId: string, answer: string) => {
        dispatch(setAnswer({ questionId, answer }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < currentAssessment.length - 1) {
            dispatch(setCurrentQuestion(currentQuestionIndex + 1));
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            dispatch(setCurrentQuestion(currentQuestionIndex - 1));
        }
    };

    const handleSubmitAssessment = async () => {
        // Calculate score based on answers
        const totalQuestions = currentAssessment.length;
        const correctAnswers = currentAssessment.filter((question, index) => {
            const questionId = `ai-question-${index}`;
            const userAnswer = answers[questionId];
            // Check if question has correctAnswer property (AI-generated questions)
            return 'correctAnswer' in question ? userAnswer === question.correctAnswer : false;
        }).length;
        
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        setAssessmentScore(score);
        setShowResults(true);

        // Generate recommendations based on results
        const assessmentResults = [{
            skill: selectedSkill,
            score
        }];

        try {
            await dispatch(generateSkillRecommendations(assessmentResults) as any);
            // You can also generate a learning path here
            await dispatch(generatePersonalizedLearningPath({
                skill: selectedSkill,
                currentLevel: difficulty
            }) as any);
        } catch (error) {
            console.error('Failed to generate recommendations:', error);
        }
    };

    const handleRestart = () => {
        dispatch(clearAssessment());
        setShowSkillSelection(true);
        setSelectedSkill('');
        setSelectedCategory('');
        setShowResults(false);
        setAssessmentScore(0);
    };

    if (isLoading) {
        return <LoadingSpinner message="Generating AI-powered questions..." />;
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h3 className="text-red-800 font-semibold">Error</h3>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={handleRestart}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (showSkillSelection) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        AI-Powered Skills Assessment
                    </h2>
                    <p className="text-gray-600 mb-8 text-center">
                        Select a skill and category to generate personalized assessment questions using AI
                    </p>

                    <div className="space-y-8">
                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Step 1: Select a Category
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryChange(category.name)}
                                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                                            selectedCategory === category.name
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center mb-2">
                                            <span className="text-2xl mr-3">{category.icon}</span>
                                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                                        <p className="text-xs text-gray-500">{category.skills.length} skills available</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Skill Selection */}
                        {selectedCategory && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Step 2: Select a Skill from {selectedCategory}
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {skillsInCategory.map((skill) => (
                                        <button
                                            key={skill.id}
                                            onClick={() => setSelectedSkill(skill.name)}
                                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                                                selectedSkill === skill.name
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <h4 className="font-semibold text-gray-900 mb-2">{skill.name}</h4>
                                            {skill.description && (
                                                <p className="text-sm text-gray-600">{skill.description}</p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Assessment Settings */}
                        {selectedSkill && (
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Assessment Settings for {selectedSkill}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Difficulty Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Difficulty Level
                                        </label>
                                        <select
                                            value={difficulty}
                                            onChange={(e) => setDifficulty(e.target.value as any)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>

                                    {/* Question Count */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Number of Questions
                                        </label>
                                        <select
                                            value={questionCount}
                                            onChange={(e) => setQuestionCount(Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value={3}>3 Questions</option>
                                            <option value={5}>5 Questions</option>
                                            <option value={10}>10 Questions</option>
                                            <option value={15}>15 Questions</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={handleStartAssessment}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                                    >
                                        🚀 Generate AI Assessment
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (currentAssessment.length === 0) {
        return <LoadingSpinner message="Loading questions..." />;
    }

    if (showResults) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Results</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Your score for the {selectedSkill} assessment is: <span className="text-green-600 font-semibold">{assessmentScore}%</span>
                    </p>
                    <p className="text-gray-600 mb-8">
                        Based on your score, we can recommend personalized learning paths to help you improve.
                    </p>
                    <button
                        onClick={handleRestart}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Start New Assessment
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = currentAssessment[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentAssessment.length) * 100;

    // Helper function to get question text
    const getQuestionText = (question: any) => {
        return 'questionText' in question ? question.questionText : question.question;
    };

    // Helper function to get question options
    const getQuestionOptions = (question: any) => {
        return question.options || [];
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                {/* AI Status Indicator */}
                {aiStatus && (
                    <div className="mb-4 p-3 rounded-lg border">
                        {aiStatus === 'AI_GENERATED' ? (
                            <div className="flex items-center text-green-700">
                                <span className="mr-2">🤖</span>
                                <span className="text-sm font-medium">AI-Generated Questions</span>
                            </div>
                        ) : aiStatus === 'FALLBACK' ? (
                            <div className="flex items-center text-orange-700">
                                <span className="mr-2">📝</span>
                                <span className="text-sm font-medium">Using Pre-generated Questions (AI not configured)</span>
                            </div>
                        ) : aiStatus === 'FALLBACK_ERROR' ? (
                            <div className="flex items-center text-red-700">
                                <span className="mr-2">⚠️</span>
                                <span className="text-sm font-medium">Using Fallback Questions (AI Error)</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-gray-700">
                                <span className="mr-2">❓</span>
                                <span className="text-sm font-medium">Question Source: Unknown</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Question {currentQuestionIndex + 1} of {currentAssessment.length}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {getQuestionText(currentQuestion)}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                        {getQuestionOptions(currentQuestion).map((option: string, index: number) => {
                            const questionId = `ai-question-${currentQuestionIndex}`;
                            return (
                                <label
                                    key={index}
                                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                                        answers[questionId] === option
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestionIndex}`}
                                        value={option}
                                        checked={answers[questionId] === option}
                                        onChange={() => handleAnswerSelect(questionId, option)}
                                        className="mr-3"
                                    />
                                    <span className="text-gray-700">{option}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    {currentQuestionIndex === currentAssessment.length - 1 ? (
                        <button
                            onClick={handleSubmitAssessment}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Submit Assessment
                        </button>
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Next
                        </button>
                    )}
                </div>

                {/* Restart Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={handleRestart}
                        className="text-gray-500 hover:text-gray-700 underline"
                    >
                        Start New Assessment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAssessment; 