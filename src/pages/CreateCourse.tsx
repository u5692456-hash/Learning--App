import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Youtube, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { generateCourseFromYoutube, generateCourseFromPdf } from '../utils/courseGenerator';

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'youtube' | 'pdf'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateYoutubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const validatePdfFile = (file: File): boolean => {
    return file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024; // 10MB limit
  };

  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!validateYoutubeUrl(youtubeUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsGenerating(true);

    try {
      // Add a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const course = generateCourseFromYoutube(youtubeUrl);
      setSuccess('Course generated successfully!');
      
      // Navigate to the generated course after a short delay
      setTimeout(() => {
        navigate(`/course/${course.id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate course from YouTube video');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePdfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    if (!validatePdfFile(pdfFile)) {
      setError('Please select a valid PDF file (max 10MB)');
      return;
    }

    setIsGenerating(true);

    try {
      // Add a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const course = generateCourseFromPdf(pdfFile);
      setSuccess('Course generated successfully!');
      
      // Navigate to the generated course after a short delay
      setTimeout(() => {
        navigate(`/course/${course.id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate course from PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
            <p className="text-gray-600">
              Generate an interactive course from YouTube videos or PDF documents
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-8 border-b">
            <button
              onClick={() => setActiveTab('youtube')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'youtube'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Youtube className="w-5 h-5 inline-block mr-2" />
              YouTube Video
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'pdf'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="w-5 h-5 inline-block mr-2" />
              PDF Document
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-700">{success}</span>
            </div>
          )}

          {/* YouTube Tab */}
          {activeTab === 'youtube' && (
            <form onSubmit={handleYoutubeSubmit} className="space-y-6">
              <div>
                <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  id="youtube-url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isGenerating}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter a YouTube video URL to generate a course with quizzes and flashcards
                </p>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !youtubeUrl.trim()}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Course...
                  </>
                ) : (
                  <>
                    <Youtube className="w-5 h-5 mr-2" />
                    Generate Course from YouTube
                  </>
                )}
              </button>
            </form>
          )}

          {/* PDF Tab */}
          {activeTab === 'pdf' && (
            <form onSubmit={handlePdfSubmit} className="space-y-6">
              <div>
                <label htmlFor="pdf-file" className="block text-sm font-medium text-gray-700 mb-2">
                  PDF Document
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    id="pdf-file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isGenerating}
                  />
                  <label
                    htmlFor="pdf-file"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Click to upload PDF
                  </label>
                  <p className="text-gray-500 text-sm mt-2">
                    Maximum file size: 10MB
                  </p>
                  {pdfFile && (
                    <p className="text-green-600 text-sm mt-2">
                      Selected: {pdfFile.name}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !pdfFile}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Course...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Generate Course from PDF
                  </>
                )}
              </button>
            </form>
          )}

          {/* Features */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll get:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900">Interactive Lessons</h4>
                <p className="text-sm text-gray-600">Structured content with key concepts</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900">Practice Quizzes</h4>
                <p className="text-sm text-gray-600">Test your understanding</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900">Flashcards</h4>
                <p className="text-sm text-gray-600">Memorize key terms and concepts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;