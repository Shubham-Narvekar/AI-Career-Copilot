require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('Testing Gemini API...');
  console.log('API Key present:', !!apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  console.log('API Key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'N/A');
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    console.log('✅ Gemini client initialized successfully');
    
    // Test with a simple prompt
    const result = await model.generateContent('Hello, can you respond with "API is working"?');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API Response:', text);
    console.log('🎉 Gemini API is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing Gemini API:', error.message);
    
    if (error.message.includes('403')) {
      console.error('🔑 This usually means the API key is invalid or expired');
      console.error('💡 Please get a new API key from: https://makersuite.google.com/app/apikey');
    } else if (error.message.includes('401')) {
      console.error('🔑 API key is invalid');
    } else if (error.message.includes('quota')) {
      console.error('📊 API quota exceeded');
    }
  }
}

testGeminiAPI(); 