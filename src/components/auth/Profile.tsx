import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toast } from 'react-toastify';
import { api } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { updateUser } from '../../store/authSlice';
import { AppDispatch } from '../../store';

const Profile: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        currentPosition: user?.currentPosition || '',
        experience: user?.experience || '',
        education: user?.education || '',
        location: user?.location || '',
        bio: user?.bio || '',
        linkedin: user?.linkedin || '',
        github: user?.github || '',
        website: user?.website || ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileCompletion, setProfileCompletion] = useState(0);

    useEffect(() => {
        calculateProfileCompletion();
    }, [formData]);

    const calculateProfileCompletion = () => {
        const fields = [
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.currentPosition,
            formData.experience,
            formData.education,
            formData.location,
            formData.bio
        ];
        
        const filledFields = fields.filter(field => field && field.trim() !== '').length;
        const completion = Math.round((filledFields / fields.length) * 100);
        setProfileCompletion(completion);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updatedUser = {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                currentPosition: formData.currentPosition,
                experience: formData.experience,
                education: formData.education,
                location: formData.location,
                bio: formData.bio,
                linkedin: formData.linkedin,
                github: formData.github,
                website: formData.website
            };
            
            const response = await api.put('/api/auth/profile', updatedUser);
            
            // Update Redux state with new user data
            dispatch(updateUser({
                ...user,
                ...updatedUser,
                firstName: formData.firstName,
                lastName: formData.lastName
            }));
            
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            currentPosition: user?.currentPosition || '',
            experience: user?.experience || '',
            education: user?.education || '',
            location: user?.location || '',
            bio: user?.bio || '',
            linkedin: user?.linkedin || '',
            github: user?.github || '',
            website: user?.website || ''
        });
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-secondary-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                            <p className="text-gray-600 mt-2">Manage your personal information and career details</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600">{profileCompletion}%</div>
                            <div className="text-sm text-gray-600">Profile Complete</div>
                        </div>
                    </div>
                </div>

                {/* Profile Completion Bar */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                        <span className="text-sm font-medium text-gray-700">{profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${profileCompletion}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Complete your profile to get better job recommendations and learning paths
                    </p>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleCancel}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="City, Country"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            {/* Career Information */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Career Information</h3>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Position</label>
                                <input
                                    type="text"
                                    name="currentPosition"
                                    value={formData.currentPosition}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="e.g., Frontend Developer"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                                <select
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                >
                                    <option value="">Select experience</option>
                                    <option value="0-1">0-1 years</option>
                                    <option value="1-3">1-3 years</option>
                                    <option value="3-5">3-5 years</option>
                                    <option value="5-10">5-10 years</option>
                                    <option value="10+">10+ years</option>
                                </select>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                                <input
                                    type="text"
                                    name="education"
                                    value={formData.education}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="e.g., Bachelor's in Computer Science"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    rows={4}
                                    placeholder="Tell us about yourself, your career goals, and what you're passionate about..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                                />
                            </div>

                            {/* Social Links */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                                <input
                                    type="url"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="https://github.com/yourusername"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Personal Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="https://yourwebsite.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        to="/skills-assessment"
                        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        <div className="text-2xl mb-2">📊</div>
                        <h3 className="font-semibold mb-2">Take Skills Assessment</h3>
                        <p className="text-sm opacity-90">Evaluate your current skills and get personalized recommendations</p>
                    </Link>
                    
                    <Link
                        to="/learning-path"
                        className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        <div className="text-2xl mb-2">🚀</div>
                        <h3 className="font-semibold mb-2">View Learning Path</h3>
                        <p className="text-sm opacity-90">Follow your personalized learning journey</p>
                    </Link>
                    
                    <Link
                        to="/job-recommendations"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        <div className="text-2xl mb-2">💼</div>
                        <h3 className="font-semibold mb-2">Job Recommendations</h3>
                        <p className="text-sm opacity-90">Discover job opportunities that match your profile</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile; 