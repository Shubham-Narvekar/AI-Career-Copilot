import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const JobAnalytics: React.FC = () => {
    const { appliedJobs, savedJobs, recommendations } = useSelector((state: RootState) => state.jobRoles);
    const { user } = useSelector((state: RootState) => state.auth);

    // Calculate analytics
    const totalApplications = appliedJobs.length;
    const totalSaved = savedJobs.length;
    const averageMatchScore = recommendations.length > 0 
        ? Math.round(recommendations.reduce((sum, job) => sum + job.matchScore, 0) / recommendations.length)
        : 0;
    
    const topIndustries = recommendations.reduce((acc, job) => {
        acc[job.industry] = (acc[job.industry] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topSkills = recommendations.reduce((acc, job) => {
        job.skills.forEach(skill => {
            acc[skill] = (acc[skill] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const salaryRanges = recommendations.reduce((acc, job) => {
        const avgSalary = (job.salary.min + job.salary.max) / 2;
        if (avgSalary < 50000) acc['Under $50k'] = (acc['Under $50k'] || 0) + 1;
        else if (avgSalary < 75000) acc['$50k - $75k'] = (acc['$50k - $75k'] || 0) + 1;
        else if (avgSalary < 100000) acc['$75k - $100k'] = (acc['$75k - $100k'] || 0) + 1;
        else if (avgSalary < 150000) acc['$100k - $150k'] = (acc['$100k - $150k'] || 0) + 1;
        else acc['Over $150k'] = (acc['Over $150k'] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topIndustriesList = Object.entries(topIndustries)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

    const topSkillsList = Object.entries(topSkills)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8);

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Career Analytics</h3>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{totalApplications}</div>
                    <div className="text-sm text-gray-600">Applications</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{totalSaved}</div>
                    <div className="text-sm text-gray-600">Saved Jobs</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{averageMatchScore}%</div>
                    <div className="text-sm text-gray-600">Avg Match Score</div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{recommendations.length}</div>
                    <div className="text-sm text-gray-600">Available Jobs</div>
                </div>
            </div>

            {/* Market Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Industries */}
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Top Industries</h4>
                    <div className="space-y-3">
                        {topIndustriesList.map(([industry, count]) => (
                            <div key={industry} className="flex justify-between items-center">
                                <span className="text-gray-700 capitalize">{industry}</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full" 
                                            style={{ width: `${(count / Math.max(...Object.values(topIndustries))) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-8">{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Skills */}
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Most Demanded Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {topSkillsList.map(([skill, count]) => (
                            <div key={skill} className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                <span>{skill}</span>
                                <span className="text-xs bg-blue-200 px-1 rounded-full">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Salary Distribution */}
            <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Salary Distribution</h4>
                <div className="space-y-3">
                    {Object.entries(salaryRanges).map(([range, count]) => (
                        <div key={range} className="flex justify-between items-center">
                            <span className="text-gray-700">{range}</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-green-500 h-2 rounded-full" 
                                        style={{ width: `${(count / Math.max(...Object.values(salaryRanges))) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">{count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Career Tips */}
            <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-3">💡 Career Tips</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Focus on skills that appear most frequently in job postings</li>
                    <li>• Consider roles in the top industries for better opportunities</li>
                    <li>• Target salary ranges that match your experience level</li>
                    <li>• Apply to jobs with match scores above 80% for better chances</li>
                </ul>
            </div>
        </div>
    );
};

export default JobAnalytics; 