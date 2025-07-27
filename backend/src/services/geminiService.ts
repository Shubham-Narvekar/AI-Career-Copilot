import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface GeneratedQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async generateAssessmentQuestions(
    skill: string,
    category: string,
    count: number = 5,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<GeneratedQuestion[]> {
    try {
      const prompt = `
You are an expert assessment creator. Generate ${count} unique, skill-specific multiple-choice questions for the skill "${skill}" in the category "${category}" at ${difficulty} difficulty level.

Context:
- The questions should be relevant to the real-world use of "${skill}" in "${category}".
- Avoid generic or repeated questions. Each question must be different and directly related to the skill.
- If the skill has subtopics or common tools, include them in the questions.

Requirements:
- Each question should test practical knowledge and understanding
- Provide 4 options (A, B, C, D) for each question
- Include the correct answer
- Add a brief explanation for the correct answer
- Questions should be relevant to real-world scenarios
- Difficulty should match the specified level

Format the response as a JSON array with this structure:
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

      console.log('[Gemini] Sending prompt:', prompt);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('[Gemini] Raw response (first 500 chars):', text.slice(0, 500));
      // Clean the response and parse JSON
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const questions = JSON.parse(cleanedText);
      return questions;
    } catch (error) {
      console.error('Error generating questions with Gemini:', error);
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

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const recommendations = JSON.parse(cleanedText);
      
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

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const learningPath = JSON.parse(cleanedText);
      
      return learningPath;
    } catch (error) {
      console.error('Error generating learning path with Gemini:', error);
      throw new Error('Failed to generate learning path');
    }
  }
}

export default new GeminiService(); 