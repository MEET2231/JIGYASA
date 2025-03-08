import React, { useState } from 'react';
import { PlusCircle, Trash2, GripVertical, Save, Send, Upload } from 'lucide-react';
import type { Question } from '../../types/survey';

const SurveyBuilder: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type,
      title: '',
      required: false,
      options: type === 'choice' || type === 'multiChoice' ? [''] : undefined,
      minRating: type === 'rating' ? 1 : undefined,
      maxRating: type === 'rating' ? 5 : undefined,
      scaleLabels: type === 'scale' ? { start: 'Poor', end: 'Excellent' } : undefined,
      matrixRows: type === 'matrix' ? ['Row 1'] : undefined,
      matrixColumns: type === 'matrix' ? ['Column 1'] : undefined,
      fileTypes: type === 'file' ? ['.pdf', '.doc', '.docx'] : undefined,
      maxFileSize: type === 'file' ? 5 : undefined, // 5MB default
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const renderQuestionOptions = (question: Question) => {
    switch (question.type) {
      case 'choice':
      case 'multiChoice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <input
                  type={question.type === 'choice' ? 'radio' : 'checkbox'}
                  disabled
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(question.options || [])];
                    newOptions[optionIndex] = e.target.value;
                    updateQuestion(question.id, { options: newOptions });
                  }}
                  placeholder={`Option ${optionIndex + 1}`}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  onClick={() => {
                    const newOptions = question.options?.filter((_, i) => i !== optionIndex);
                    updateQuestion(question.id, { options: newOptions });
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newOptions = [...(question.options || []), ''];
                updateQuestion(question.id, { options: newOptions });
              }}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Option
            </button>
          </div>
        );

      case 'rating':
        return (
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={question.minRating}
              onChange={(e) => updateQuestion(question.id, { minRating: parseInt(e.target.value) })}
              placeholder="Min"
              className="block w-20 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <span>to</span>
            <input
              type="number"
              value={question.maxRating}
              onChange={(e) => updateQuestion(question.id, { maxRating: parseInt(e.target.value) })}
              placeholder="Max"
              className="block w-20 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={question.scaleLabels?.start}
                onChange={(e) => updateQuestion(question.id, { 
                  scaleLabels: { 
                    ...question.scaleLabels!, 
                    start: e.target.value 
                  } 
                })}
                placeholder="Start label"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <span>to</span>
              <input
                type="text"
                value={question.scaleLabels?.end}
                onChange={(e) => updateQuestion(question.id, { 
                  scaleLabels: { 
                    ...question.scaleLabels!, 
                    end: e.target.value 
                  } 
                })}
                placeholder="End label"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="text-center">
                  <div className="w-8 h-8 border rounded-full flex items-center justify-center mb-1">
                    {num}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'matrix':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rows</label>
              {question.matrixRows?.map((row, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={row}
                    onChange={(e) => {
                      const newRows = [...(question.matrixRows || [])];
                      newRows[index] = e.target.value;
                      updateQuestion(question.id, { matrixRows: newRows });
                    }}
                    placeholder={`Row ${index + 1}`}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                    onClick={() => {
                      const newRows = question.matrixRows?.filter((_, i) => i !== index);
                      updateQuestion(question.id, { matrixRows: newRows });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newRows = [...(question.matrixRows || []), `Row ${(question.matrixRows?.length || 0) + 1}`];
                  updateQuestion(question.id, { matrixRows: newRows });
                }}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Row
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
              {question.matrixColumns?.map((col, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={col}
                    onChange={(e) => {
                      const newCols = [...(question.matrixColumns || [])];
                      newCols[index] = e.target.value;
                      updateQuestion(question.id, { matrixColumns: newCols });
                    }}
                    placeholder={`Column ${index + 1}`}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                    onClick={() => {
                      const newCols = question.matrixColumns?.filter((_, i) => i !== index);
                      updateQuestion(question.id, { matrixColumns: newCols });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newCols = [...(question.matrixColumns || []), `Column ${(question.matrixColumns?.length || 0) + 1}`];
                  updateQuestion(question.id, { matrixColumns: newCols });
                }}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Column
              </button>
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allowed File Types</label>
              <input
                type="text"
                value={question.fileTypes?.join(', ')}
                onChange={(e) => {
                  const types = e.target.value.split(',').map(t => t.trim());
                  updateQuestion(question.id, { fileTypes: types });
                }}
                placeholder=".pdf, .doc, .docx"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
              <input
                type="number"
                value={question.maxFileSize}
                onChange={(e) => updateQuestion(question.id, { maxFileSize: parseInt(e.target.value) })}
                placeholder="5"
                className="block w-32 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-500">Preview of file upload area</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Survey Title"
                className="block w-full text-3xl font-bold border-0 border-b border-transparent bg-white focus:border-indigo-600 focus:ring-0"
              />
            </div>
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Survey Description"
                rows={3}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="relative bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-8 cursor-move flex items-center justify-center border-r border-gray-200">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="ml-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={question.title}
                        onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                        placeholder={`Question ${index + 1}`}
                        className="block w-full border-0 border-b border-transparent bg-transparent focus:border-indigo-600 focus:ring-0"
                      />
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {renderQuestionOptions(question)}

                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={question.required}
                          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">Required</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                onClick={() => addQuestion('text')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Short Text
              </button>
              <button
                onClick={() => addQuestion('paragraph')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Paragraph
              </button>
              <button
                onClick={() => addQuestion('email')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Email
              </button>
              <button
                onClick={() => addQuestion('phone')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Phone
              </button>
              <button
                onClick={() => addQuestion('date')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Date
              </button>
              <button
                onClick={() => addQuestion('time')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Time
              </button>
              <button
                onClick={() => addQuestion('choice')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Choice
              </button>
              <button
                onClick={() => addQuestion('multiChoice')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Multi Choice
              </button>
              <button
                onClick={() => addQuestion('rating')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Rating
              </button>
              <button
                onClick={() => addQuestion('scale')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Scale
              </button>
              <button
                onClick={() => addQuestion('matrix')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Matrix
              </button>
              <button
                onClick={() => addQuestion('file')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                File Upload
              </button>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyBuilder;