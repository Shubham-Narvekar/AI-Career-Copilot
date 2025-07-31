import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables');
} else {
  console.log(`[GeminiService] API Key loaded: ${apiKey.substring(0, 10)}... (length: ${apiKey.length})`);
}

const genAI = new GoogleGenerativeAI(apiKey);

export interface GeneratedQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  async generateAssessmentQuestions(
    skill: string,
    category: string,
    count: number = 5,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<GeneratedQuestion[]> {
    try {
      // Debug logging
      console.log(`[GeminiService] Starting question generation with API key: ${apiKey ? 'Present' : 'Missing'}`);
      if (apiKey) {
        console.log(`[GeminiService] API Key length: ${apiKey.length}, starts with: ${apiKey.substring(0, 10)}...`);
      }
      
      const prompt = `
Generate ${count} multiple-choice assessment questions for the skill "${skill}" in the category "${category}" at ${difficulty} difficulty level.

Requirements:
- Each question should test practical knowledge and understanding
- Provide 4 options (A, B, C, D) for each question
- Include the correct answer
- Add a brief explanation for the correct answer
- Questions should be relevant to real-world scenarios
- Difficulty should match the specified level

Format the response as a JSON array:
[
  {
    "questionText": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Brief explanation of why this is correct",
    "difficulty": "${difficulty}"
  }
]

Only return the JSON array, no additional text.
`;

      console.log(`[Gemini] Generating ${count} questions for: ${skill} (${category}) at ${difficulty} level`);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('[Gemini] Raw response (first 200 chars):', text.slice(0, 200));
      
      // Clean the response and parse JSON
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const questions = JSON.parse(cleanedText);
      
      console.log(`[Gemini] Successfully generated ${questions.length} questions`);
      return questions;
    } catch (error) {
      console.error('Error generating questions with Gemini:', error);
      console.error('Error details:', {
        message: (error as any).message,
        status: (error as any).status,
        statusText: (error as any).statusText,
        errorDetails: (error as any).errorDetails
      });
      throw new Error('Failed to generate assessment questions');
    }
  }

  async generateSkillRecommendations(
    assessmentResults: { skill: string; score: number }[]
  ): Promise<string[]> {
    try {
      const prompt = `
Based on these assessment results, provide 3-5 specific skill recommendations for improvement:

${assessmentResults.map(result => `- ${result.skill}: ${result.score}%`).join('\n')}

Focus on:
- Skills with lower scores that need improvement
- Related skills that would complement existing strengths
- Practical, actionable recommendations

Return as a JSON array of skill names:
["Skill 1", "Skill 2", "Skill 3"]

Only return the JSON array, no additional text.
`;

      console.log('[Gemini] Generating skill recommendations...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const recommendations = JSON.parse(cleanedText);
      
      console.log(`[Gemini] Generated ${recommendations.length} recommendations`);
      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations with Gemini:', error);
      throw new Error('Failed to generate skill recommendations');
    }
  }

  async generateLearningPath(
    skill: string,
    currentLevel: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<{
    title: string;
    description: string;
    steps: Array<{
      title: string;
      description: string;
      resources: string[];
      estimatedTime: string;
    }>;
  }> {
    try {
      const prompt = `
Generate a personalized learning path for "${skill}" at ${currentLevel} level.

Requirements:
- Create a structured learning path with 5-8 steps
- Each step should include title, description, resources, and estimated time
- Resources should be practical (courses, books, practice exercises, etc.)
- Progression should be logical and build upon previous steps
- Include both theoretical and practical components

Format as JSON:
{
  "title": "Learning Path Title",
  "description": "Brief overview of the learning path",
  "steps": [
    {
      "title": "Step Title",
      "description": "What will be learned in this step",
      "resources": ["Resource 1", "Resource 2"],
      "estimatedTime": "2-3 hours"
    }
  ]
}

Only return the JSON object, no additional text.
`;

      console.log(`[Gemini] Generating learning path for: ${skill} at ${currentLevel} level`);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const learningPath = JSON.parse(cleanedText);
      
      console.log(`[Gemini] Generated learning path with ${learningPath.steps?.length || 0} steps`);
      return learningPath;
    } catch (error) {
      console.error('Error generating learning path with Gemini:', error);
      throw new Error('Failed to generate learning path');
    }
  }
}

export default new GeminiService(); 