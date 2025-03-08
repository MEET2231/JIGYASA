import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Users, Calendar, PlusCircle, Search, Filter } from 'lucide-react';

const SurveyList: React.FC = () => {
  const surveys = [
    {
      id: '1',
      title: 'Customer Satisfaction Q1 2024',
      status: 'active',
      responses: 245,
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      title: 'Employee Engagement Survey',
      status: 'draft',
      responses: 0,
      createdAt: '2024-02-15',
    },
    {
      id: '3',
      title: 'Product Feedback',
      status: 'closed',
      responses: 532,
      createdAt: '2024-01-20',
    },
  ];

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Surveys</h1>
        <Link
          to="/surveys/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Survey
        </Link>
      </div>

      <div className="mt-6">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search surveys..."
              />
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {surveys.map((survey) => (
              <li key={survey.id}>
                <Link
                  to={`/surveys/${survey.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ClipboardList className="h-5 w-5 text-gray-400" />
                        <p className="ml-2 text-sm font-medium text-indigo-600">
                          {survey.title}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            survey.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : survey.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {survey.responses} responses
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>Created on {survey.createdAt}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SurveyList;