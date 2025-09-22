import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, BookOpen, Brain, GraduationCap } from 'lucide-react';
import { getCourseById, GeneratedCourse } from '../utils/courseGenerator';
import VideoPlayer from '../components/VideoPlayer';
import QuizModal from '../components/QuizModal';
import FlashcardDeck from '../components/FlashcardDeck';
import ChatBot from '../components/ChatBot';

export default function CourseView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<GeneratedCourse | null>(null);
  const [activeTab, setActiveTab] = useState('video');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const courseData = getCourseById(id);
      if (courseData) {
        setCourse(courseData);
        // Set default active tab based on course type
        if (courseData.type === 'pdf') {
          setActiveTab('notes');
        }
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'quiz', label: 'Quiz', icon: Brain },
    { id: 'flashcards', label: 'Flashcards', icon: GraduationCap },
  ];

  // Filter tabs based on course type
  const availableTabs = course?.type === 'pdf' 
    ? tabs.filter(tab => tab.id !== 'video')
    : tabs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">{course.lessons} lessons • {course.duration}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200">
                {availableTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'video' && course?.type === 'youtube' && course.videoUrl && (
                  <div className="space-y-4">
                    <VideoPlayer videoUrl={course.videoUrl} />
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Video Notes</h4>
                      <p className="text-gray-600 text-sm">
                        Watch the video above and refer to the notes tab for detailed explanations of key concepts.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="prose max-w-none">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {course?.type === 'pdf' ? 'PDF Content Analysis' : 'Video Lecture Notes'}
                      </h3>
                      <p className="text-gray-600">
                        {course?.type === 'pdf' 
                          ? 'Key concepts and insights extracted from your PDF document'
                          : 'Comprehensive notes generated from the video content'
                        }
                      </p>
                    </div>
                    
                    {course?.notes && course.notes.length > 0 ? (
                      <div className="space-y-8">
                        {course.notes.map((note, index) => (
                          <div key={note.id} className="border-l-4 border-blue-500 pl-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold text-gray-900">{note.title}</h4>
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {note.duration}
                              </span>
                            </div>
                            <div 
                              className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ 
                                __html: note.content.replace(/\n/g, '<br>').replace(/## (.*)/g, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>').replace(/### (.*)/g, '<h4 class="text-base font-medium text-gray-800 mt-4 mb-2">$1</h4>') 
                              }}
                            />
                            {index < course.notes.length - 1 && (
                              <hr className="my-8 border-gray-200" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <BookOpen className="w-16 h-16 mx-auto" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-600 mb-2">No notes available</h4>
                        <p className="text-gray-500">
                          The content analysis is still processing. Please check back in a moment.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-8 mb-8">
                      <Brain className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Test Your Knowledge</h3>
                      <p className="text-gray-600 mb-6">
                        Challenge yourself with {course?.quizzes?.[0]?.questions?.length || 0} questions based on the 
                        {course?.type === 'pdf' ? ' PDF content' : ' video content'}
                      </p>
                      {course?.quizzes?.[0]?.questions?.length > 0 ? (
                        <button
                          onClick={() => setIsQuizOpen(true)}
                          className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          Start Quiz ({course.quizzes[0].questions.length} questions)
                        </button>
                      ) : (
                        <div className="text-gray-500">
                          <p>Quiz questions are being generated...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'flashcards' && (
                  <>
                    {course?.flashcards && course.flashcards.length > 0 ? (
                      <FlashcardDeck flashcards={course.flashcards} />
                    ) : (
                      <div className="text-center py-12">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8">
                          <div className="text-gray-400 mb-4">
                            <BookOpen className="w-16 h-16 mx-auto" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-600 mb-2">Flashcards Coming Soon</h4>
                          <p className="text-gray-500">
                            AI is generating smart flashcards from your {course?.type === 'pdf' ? 'PDF' : 'video'} content.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="relative mb-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    course.type === 'pdf' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {course.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Course Overview</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium capitalize">{course.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lessons:</span>
                  <span className="font-medium">{course.lessons}</span>
                </div>
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span className="font-medium">{course?.quizzes?.[0]?.questions?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Flashcards:</span>
                  <span className="font-medium">{course.flashcards.length}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Created on {new Date(course.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {isQuizOpen && course?.quizzes?.[0] && course.quizzes[0].questions.length > 0 && (
        <QuizModal
          isOpen={isQuizOpen}
          quiz={course.quizzes[0]}
          onClose={() => setIsQuizOpen(false)}
          onComplete={() => setIsQuizOpen(false)}
        />
      )}

      {/* AI Tutor Chatbot */}
      <ChatBot 
        courseContext={{
          title: course?.title || 'Course',
          currentLesson: availableTabs.find(tab => tab.id === activeTab)?.label,
          progress: 75
        }}
      />
    </div>
  );
}