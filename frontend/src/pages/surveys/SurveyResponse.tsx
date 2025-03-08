import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Question, Survey } from '../../types/survey';
import { Send } from 'lucide-react';

const SurveyResponse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Mock survey data
  const survey: Survey = {
    id: id || '',
    title: 'Customer Satisfaction Survey',
    description: 'Help us improve our services by providing your valuable feedback.',
    questions: [
      {
        id: '1',
        type: 'text',
        title: 'What do you like most about our service?',
        required: true,
      },
      {
        id: '2',
        type: 'rating',
        title: 'How would you rate our customer support?',
        required: true,
        minRating: 1,
        maxRating: 5,
      },
      {
        id: '3',
        type: 'choice',
        title: 'How did you hear about us?',
        required: false,
        options: ['Social Media', 'Friend', 'Advertisement', 'Other'],
      },
      {
        id: '4',
        type: 'multiChoice',
        title: 'Which features do you use regularly?',
        required: true,
        options: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublished: true,
    responseCount: 0,
    status: 'active',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted answers:', answers);
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <textarea
            required={question.required}
            value={answers[question.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={3}
          />
        );

      case 'rating':
        return (
          <div className="mt-2">
            <div className="flex space-x-4">
              {Array.from(
                { length: (question.maxRating || 5) - (question.minRating || 1) + 1 },
                (_, i) => i + (question.minRating || 1)
              ).map((rating) => (
                <label key={rating} className="flex flex-col items-center">
                  <input
                    type="radio"
                    name={question.id}
                    value={rating}
                    required={question.required}
                    checked={answers[question.id] === rating}
                    onChange={(e) =>
                      setAnswers({ ...answers, [question.id]: Number(e.target.value) })
                    }
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="mt-1 text-sm text-gray-500">{rating}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'choice':
        return (
          <div className="mt-2 space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  required={question.required}
                  checked={answers[question.id] === option}
                  onChange={(e) =>
                    setAnswers({ ...answers, [question.id]: e.target.value })
                  }
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multiChoice':
        return (
          <div className="mt-2 space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={
                    (answers[question.id] || []).includes(option)
                  }
                  onChange={(e) => {
                    const currentAnswers = answers[question.id] || [];
                    const newAnswers = e.target.checked
                      ? [...currentAnswers, option]
                      : currentAnswers.filter((a: string) => a !== option);
                    setAnswers({ ...answers, [question.id]: newAnswers });
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
          <p className="mt-2 text-gray-600">{survey.description}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {survey.questions.map((question) => (
              <div key={question.id}>
                <label className="block text-sm font-medium text-gray-700">
                  {question.title}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {renderQuestion(question)}
              </div>
            ))}

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Response
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SurveyResponse;