import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  RotateCcw,
  Lightbulb,
  BookOpen,
  Brain
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'quiz' | 'explanation';
}

interface ChatBotProps {
  courseContext?: {
    title: string;
    currentLesson?: string;
    progress?: number;
  };
}

const ChatBot: React.FC<ChatBotProps> = ({ courseContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: courseContext 
        ? `Hi! I'm your AI tutor for "${courseContext.title}". I'm here to help you understand the concepts, answer questions, and guide your learning. What would you like to know?`
        : "Hi! I'm your MindSphere AI learning assistant. I can help you understand concepts, create study materials, answer questions, and guide your learning journey. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Keep track of conversation context
    const conversationLength = messages.length;
    const isFollowUp = conversationLength > 2;
    
    // Context-aware responses
    if (courseContext) {
      if (lowerMessage.includes('explain') || lowerMessage.includes('what is')) {
        const explanationResponses = [
          `Let me explain that concept from "${courseContext.title}" in detail. ${getSpecificExplanation(userMessage)}`,
          `That's an excellent question about "${courseContext.title}". Here's how I'd break it down: ${getSpecificExplanation(userMessage)}`,
          `I can help clarify that concept. In the context of "${courseContext.title}", ${getSpecificExplanation(userMessage)}`,
          `Great question! This is a key concept in "${courseContext.title}". ${getSpecificExplanation(userMessage)}`
        ];
        return explanationResponses[Math.floor(Math.random() * explanationResponses.length)];
      }
      
      if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
        return generateQuizResponse(userMessage, courseContext.title);
      }
      
      if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
        return generateHelpResponse(userMessage, courseContext);
      }
    }

    // General learning responses
    if (lowerMessage.includes('study tips') || lowerMessage.includes('how to learn')) {
      return generateStudyTipsResponse(userMessage, isFollowUp);
    }
    
    if (lowerMessage.includes('flashcard') || lowerMessage.includes('memorize')) {
      return generateFlashcardResponse(userMessage, isFollowUp);
    }
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('discouraged')) {
      return generateMotivationResponse(userMessage, isFollowUp);
    }

    // Generate contextual response based on user input
    return generateContextualResponse(userMessage, conversationLength);
  };

  const getSpecificExplanation = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('machine learning') || message.includes('ml')) {
      return "Machine learning is a method where computers learn patterns from data to make predictions or decisions. Think of it like teaching a computer to recognize patterns the same way humans do, but using mathematical algorithms and large datasets.";
    }
    
    if (message.includes('react') || message.includes('component')) {
      return "React components are like building blocks for web applications. Each component is a reusable piece of code that manages its own state and renders part of the user interface. Think of them like LEGO blocks that you can combine to build complex structures.";
    }
    
    if (message.includes('python') || message.includes('programming')) {
      return "Python is a programming language known for its simple, readable syntax. It's like writing instructions in plain English that a computer can understand. Python is popular because it's beginner-friendly yet powerful enough for complex applications.";
    }
    
    if (message.includes('database') || message.includes('sql')) {
      return "Databases are organized collections of information, like a digital filing cabinet. SQL is the language we use to ask questions about that data - like asking 'show me all customers who bought something last month.'";
    }
    
    if (message.includes('javascript') || message.includes('js')) {
      return "JavaScript is the programming language that makes websites interactive. While HTML creates the structure and CSS makes it look good, JavaScript adds behavior - like responding to clicks, validating forms, or updating content dynamically.";
    }
    
    // Extract key terms from user message for personalized response
    const keyTerms = extractKeyTerms(userMessage);
    if (keyTerms.length > 0) {
      return `The concept of ${keyTerms[0]} is important because it helps you understand how different parts work together. Let me break down the key aspects you should focus on.`;
    }
    
    return "This is a fundamental concept that builds the foundation for more advanced topics. Let me explain it step by step so you can understand how it connects to what you're learning.";
  };

  const generateQuizResponse = (userMessage: string, courseTitle: string): string => {
    const quizResponses = [
      `Perfect! Let me create some practice questions for "${courseTitle}". I'll focus on the key concepts we've been discussing. Would you prefer multiple choice, true/false, or open-ended questions?`,
      `Testing your knowledge is a great way to reinforce learning! For "${courseTitle}", I can generate questions that target your specific areas of interest. What topics would you like me to focus on?`,
      `Excellent idea! Practice questions help identify knowledge gaps. Based on "${courseTitle}", I'll create questions that challenge your understanding. Should I start with basic concepts or jump to more advanced topics?`,
      `I love that you're taking an active approach to learning! For "${courseTitle}", I can create personalized quiz questions. What specific areas do you want to test yourself on?`
    ];
    
    return quizResponses[Math.floor(Math.random() * quizResponses.length)];
  };

  const generateHelpResponse = (userMessage: string, courseContext: any): string => {
    const helpResponses = [
      `I understand you're facing some challenges with "${courseContext.title}". Let's tackle this together! Can you tell me which specific concept or section is giving you trouble?`,
      `Don't worry, getting stuck is part of the learning process! In "${courseContext.title}", there are often multiple ways to approach difficult concepts. What particular area would you like me to help clarify?`,
      `I'm here to support your learning journey with "${courseContext.title}". Sometimes a different explanation or example can make everything click. What specific part is confusing you?`,
      `Let's work through this challenge in "${courseContext.title}" step by step. Breaking down complex topics into smaller pieces often helps. Which aspect should we start with?`
    ];
    
    return helpResponses[Math.floor(Math.random() * helpResponses.length)];
  };

  const generateStudyTipsResponse = (userMessage: string, isFollowUp: boolean): string => {
    if (isFollowUp) {
      const followUpTips = [
        "Since you're looking for more study strategies, here's another effective technique: the Feynman Technique. Try explaining concepts in simple terms as if teaching a child. This reveals gaps in your understanding.",
        "Another powerful method is interleaving - mixing different topics during study sessions rather than focusing on one subject for hours. This improves long-term retention and problem-solving skills.",
        "Consider using the 'testing effect' - actively recalling information from memory rather than just re-reading notes. This strengthens neural pathways and improves retention significantly.",
        "Try the 'elaborative interrogation' technique: constantly ask yourself 'why' and 'how' questions about the material. This creates deeper connections and better understanding."
      ];
      return followUpTips[Math.floor(Math.random() * followUpTips.length)];
    }
    
    const studyTips = [
      "Here are some evidence-based study strategies: 1) Active recall - test yourself frequently, 2) Spaced repetition - review material at increasing intervals, 3) Pomodoro Technique - study in focused 25-minute blocks. Which technique interests you most?",
      "Effective studying involves multiple strategies: 1) Create mind maps to visualize connections, 2) Use the 'teach-back' method - explain concepts aloud, 3) Practice retrieval - close your notes and write what you remember. What's your current study approach?",
      "Research shows these methods boost learning: 1) Distributed practice - spread study sessions over time, 2) Dual coding - combine visual and verbal information, 3) Self-explanation - describe your reasoning process. Which would you like to try first?"
    ];
    
    return studyTips[Math.floor(Math.random() * studyTips.length)];
  };

  const generateFlashcardResponse = (userMessage: string, isFollowUp: boolean): string => {
    if (isFollowUp) {
      const advancedFlashcardTips = [
        "For advanced flashcard techniques, try 'image occlusion' - cover parts of diagrams or images to test visual memory. This works great for anatomy, geography, or technical diagrams.",
        "Use 'cloze deletion' flashcards where you remove key words from sentences. This helps with context and understanding relationships between concepts.",
        "Create 'reverse cards' - if your card asks 'What is X?', also make one asking 'What concept does this definition describe?' This strengthens bidirectional recall.",
        "Try 'connection cards' that ask how two concepts relate to each other. This builds understanding of relationships rather than just isolated facts."
      ];
      return advancedFlashcardTips[Math.floor(Math.random() * advancedFlashcardTips.length)];
    }
    
    const flashcardTips = [
      "Flashcards are powerful when used correctly! Key principles: 1) Keep them simple and focused, 2) Use your own words, 3) Include context or examples, 4) Review regularly with spaced repetition. What topics do you want to create flashcards for?",
      "Great choice for memorization! Effective flashcards should: 1) Test one concept at a time, 2) Use active recall rather than recognition, 3) Include visual elements when possible, 4) Connect to prior knowledge. What subject are you studying?",
      "Flashcards work best with these strategies: 1) Create them as you learn, not just before exams, 2) Use the 'generation effect' - make your own rather than using pre-made ones, 3) Review difficult cards more frequently. What would you like help creating?"
    ];
    
    return flashcardTips[Math.floor(Math.random() * flashcardTips.length)];
  };

  const generateMotivationResponse = (userMessage: string, isFollowUp: boolean): string => {
    const motivationResponses = [
      "I understand learning can feel overwhelming sometimes. Remember, every expert was once a beginner who felt exactly like you do now. The key is persistence and celebrating small wins. What specific challenge can we tackle together?",
      "It's completely normal to feel discouraged during learning - it means you're pushing your boundaries! Growth happens outside your comfort zone. Let's break down what's challenging you into smaller, manageable steps.",
      "Learning is like building muscle - it requires consistent effort and sometimes feels uncomfortable. But each struggle makes you stronger. What specific area would you like to focus on to build your confidence?",
      "Remember, confusion is often the first step toward understanding. Your brain is working hard to form new connections. Let's identify what's causing the confusion and address it systematically."
    ];
    
    return motivationResponses[Math.floor(Math.random() * motivationResponses.length)];
  };

  const generateContextualResponse = (userMessage: string, conversationLength: number): string => {
    const keyTerms = extractKeyTerms(userMessage);
    const messageLength = userMessage.split(' ').length;
    
    // For longer, detailed questions
    if (messageLength > 10) {
      return `I can see you've put thought into this question. ${keyTerms.length > 0 ? `Regarding ${keyTerms[0]}, ` : ''}let me provide a comprehensive answer that addresses your specific concerns. ${generateDetailedResponse(userMessage)}`;
    }
    
    // For short questions
    if (messageLength <= 3) {
      return `I'd love to help you with ${keyTerms[0] || 'that topic'}! Could you provide a bit more context about what specifically you'd like to know? This will help me give you the most relevant and useful information.`;
    }
    
    // For follow-up questions in longer conversations
    if (conversationLength > 4) {
      return `Building on our previous discussion, ${generateFollowUpResponse(userMessage, keyTerms)}`;
    }
    
    // Default contextual responses
    const contextualResponses = [
      `That's an insightful question about ${keyTerms[0] || 'this topic'}! Let me help you understand this concept better. ${generateDetailedResponse(userMessage)}`,
      `I can help you with ${keyTerms[0] || 'that'}! This is actually a really important concept to master. ${generateDetailedResponse(userMessage)}`,
      `Great question! ${keyTerms[0] || 'This topic'} is fundamental to understanding the bigger picture. ${generateDetailedResponse(userMessage)}`,
      `I'm excited to help you explore ${keyTerms[0] || 'this concept'}! Let me break it down in a way that makes sense. ${generateDetailedResponse(userMessage)}`
    ];
    
    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  };

  const extractKeyTerms = (message: string): string[] => {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'what', 'how', 'why', 'when', 'where', 'who', 'which', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
    
    return message.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 3); // Take up to 3 key terms
  };

  const generateDetailedResponse = (userMessage: string): string => {
    const keyTerms = extractKeyTerms(userMessage);
    
    if (keyTerms.some(term => ['algorithm', 'code', 'programming', 'function'].includes(term))) {
      return "Programming concepts can seem abstract at first, but they're really just step-by-step instructions for solving problems. Think of an algorithm like a recipe - it tells you exactly what steps to follow to get the desired result.";
    }
    
    if (keyTerms.some(term => ['data', 'analysis', 'statistics', 'research'].includes(term))) {
      return "Data analysis is like being a detective - you're looking for patterns and clues in information to answer questions or solve problems. The key is knowing what questions to ask and which tools to use.";
    }
    
    if (keyTerms.some(term => ['design', 'user', 'interface', 'experience'].includes(term))) {
      return "Good design is about understanding people and creating solutions that feel natural and intuitive. It's not just about making things look pretty - it's about making them work well for real users.";
    }
    
    return "This concept connects to many other ideas you'll encounter. Understanding the fundamentals here will make more advanced topics much easier to grasp later on.";
  };

  const generateFollowUpResponse = (userMessage: string, keyTerms: string[]): string => {
    const followUpResponses = [
      `let me dive deeper into ${keyTerms[0] || 'this aspect'}. This builds nicely on what we've been discussing.`,
      `I can see you're really thinking about ${keyTerms[0] || 'these concepts'}. That's exactly the kind of critical thinking that leads to mastery.`,
      `your question about ${keyTerms[0] || 'this topic'} shows you're making connections. Let me help you explore this further.`,
      `this is a natural next step in understanding ${keyTerms[0] || 'the material'}. You're asking exactly the right questions.`
    ];
    
    return followUpResponses[Math.floor(Math.random() * followUpResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: courseContext 
        ? `Hi! I'm your AI tutor for "${courseContext.title}". I'm here to help you understand the concepts, answer questions, and guide your learning. What would you like to know?`
        : "Hi! I'm your MindSphere AI learning assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }]);
  };

  const quickActions = [
    { label: 'Explain this concept', icon: <Lightbulb className="w-4 h-4" /> },
    { label: 'Create a quiz', icon: <Brain className="w-4 h-4" /> },
    { label: 'Study tips', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'I need help', icon: <MessageCircle className="w-4 h-4" /> }
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:from-emerald-600 hover:to-blue-700 transition-all transform hover:scale-110 z-50"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl z-50 ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
            } transition-all duration-300`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Tutor</h3>
                  {courseContext && !isMinimized && (
                    <p className="text-xs text-gray-300">{courseContext.title}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={clearChat}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                            : 'bg-gradient-to-r from-emerald-400 to-blue-500'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        <div className={`rounded-2xl p-3 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-white/10 text-white border border-white/20'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white/10 rounded-2xl p-3 border border-white/20">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2">
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setInputMessage(action.label);
                            setTimeout(() => handleSendMessage(), 100);
                          }}
                          className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm"
                        >
                          {action.icon}
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/20">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your learning..."
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      disabled={isTyping}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-3 rounded-lg hover:from-emerald-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;