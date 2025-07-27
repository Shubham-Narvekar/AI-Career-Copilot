import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { generateAssessmentQuestions } from '../../store/skillsSlice';

const GeminiTest: React.FC = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const testGemini = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const questions = await dispatch(generateAssessmentQuestions({
                skill: 'JavaScript',
                category: 'Programming',
                count: 3,
                difficulty: 'intermediate'
            }) as any);
            
            setResult(questions);
        } catch (err: any) {
            setError(err.message || 'Failed to test Gemini');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gemini API Test</h2>
                
                <button
                    onClick={testGemini}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
                >
                    {isLoading ? 'Testing...' : 'Test Gemini API'}
                </button>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <h3 className="text-red-800 font-semibold">Error</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="text-green-800 font-semibold mb-4">Success! Generated Questions:</h3>
                        <pre className="text-sm text-green-700 whitespace-pre-wrap">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeminiTest; 