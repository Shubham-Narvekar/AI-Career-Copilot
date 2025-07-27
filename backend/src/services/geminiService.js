"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
class GeminiService {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
    generateAssessmentQuestions(skill_1, category_1) {
        return __awaiter(this, arguments, void 0, function* (skill, category, count = 5, difficulty = 'intermediate') {
            try {
                const prompt = `
Generate ${count} multiple-choice assessment questions for the skill "${skill}" in the category "${category}" at ${difficulty} difficulty level.

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
                const result = yield this.model.generateContent(prompt);
                const response = yield result.response;
                const text = response.text();
                // Clean the response and parse JSON
                const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
                const questions = JSON.parse(cleanedText);
                return questions;
            }
            catch (error) {
                console.error('Error generating questions with Gemini:', error);
                throw new Error('Failed to generate assessment questions');
            }
        });
    }
    generateSkillRecommendations(assessmentResults) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const result = yield this.model.generateContent(prompt);
                const response = yield result.response;
                const text = response.text();
                const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
                const recommendations = JSON.parse(cleanedText);
                return recommendations;
            }
            catch (error) {
                console.error('Error generating recommendations with Gemini:', error);
                throw new Error('Failed to generate skill recommendations');
            }
        });
    }
    generateLearningPath(skill, currentLevel) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const result = yield this.model.generateContent(prompt);
                const response = yield result.response;
                const text = response.text();
                const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
                const learningPath = JSON.parse(cleanedText);
                return learningPath;
            }
            catch (error) {
                console.error('Error generating learning path with Gemini:', error);
                throw new Error('Failed to generate learning path');
            }
        });
    }
}
exports.GeminiService = GeminiService;
exports.default = new GeminiService();
