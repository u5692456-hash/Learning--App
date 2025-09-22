import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Target, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface CourseSummaryProps {
  course: {
    title: string;
    description: string;
    duration: string;
    lessons: number;
    notes: Array<{
      title: string;
      content: string;
    }>;
  };
}

const CourseSummary: React.FC<CourseSummaryProps> = ({ course }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract key points from course content
  const generateSummary = () => {
    const keyPoints = [
      'Master the fundamental concepts and core principles',
      'Apply theoretical knowledge through practical examples',
      'Develop problem-solving skills and critical thinking',
      'Build confidence through structured learning progression',
      'Connect new concepts to real-world applications'
    ];

    return keyPoints;
  };

  const keyPoints = generateSummary();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Focused Course Summary</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/60 rounded-lg p-3">
            <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-gray-900">{course.duration}</div>
            <div className="text-xs text-gray-600">Duration</div>
          </div>
          <div className="bg-white/60 rounded-lg p-3">
            <BookOpen className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-gray-900">{course.lessons}</div>
            <div className="text-xs text-gray-600">Lessons</div>
          </div>
          <div className="bg-white/60 rounded-lg p-3">
            <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-gray-900">{keyPoints.length}</div>
            <div className="text-xs text-gray-600">Key Points</div>
          </div>
        </div>

        <div className="bg-white/60 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Most Important Learning Points:</h4>
          <div className="space-y-2">
            {keyPoints.slice(0, isExpanded ? keyPoints.length : 3).map((point, index) => (
              <div key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{point}</span>
              </div>
            ))}
          </div>
          
          {keyPoints.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium mt-3 transition-colors"
            >
              <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
              <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Learning Objective</h4>
          <p className="text-sm text-gray-700">
            By completing this course, you'll gain a comprehensive understanding of the subject matter 
            and be able to apply these concepts confidently in practical situations.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseSummary;