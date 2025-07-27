import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import LandingPage from './pages/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SkillsAssessment from './components/skills/SkillsAssessment';
import Dashboard from './components/dashboard/Dashboard';
import LearningPath from './components/learning/LearningPath';
import ResumeBuilder from './components/resume/ResumeBuilder';
import JobRecommendations from './components/jobs/JobRecommendations';
import PrivateRoute from './components/common/PrivateRoute';
import GeminiTest from './components/skills/GeminiTest';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/skills-assessment" element={<SkillsAssessment />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/learning-path" element={<LearningPath />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/job-recommendations" element={<JobRecommendations />} />
              <Route path="/gemini-test" element={<GeminiTest />} />
            </Route>
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
