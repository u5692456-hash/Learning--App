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
    const messageWords = userMessage.split(' ');
    const conversationContext = messages.slice(-3); // Last 3 messages for context
    const timestamp = Date.now();
    
    // Generate truly dynamic responses based on user input
    const keyTerms = extractKeyTerms(userMessage);
    const questionType = detectQuestionType(userMessage);
    const userIntent = detectUserIntent(userMessage);
    
    // Generate response based on user intent and context
    switch (userIntent) {
      case 'explanation':
        return generateExplanationResponse(userMessage, keyTerms, courseContext);
      case 'quiz':
        return generateQuizResponse(userMessage, keyTerms, courseContext);
      case 'help':
        return generateHelpResponse(userMessage, keyTerms, courseContext);
      case 'study_tips':
        return generateStudyTipsResponse(userMessage, keyTerms, conversationContext);
      case 'motivation':
        return generateMotivationResponse(userMessage, keyTerms);
      case 'specific_question':
        return generateSpecificAnswerResponse(userMessage, keyTerms, courseContext);
      default:
        return generateContextualResponse(userMessage, keyTerms, conversationContext, courseContext);
    }
  };

  const detectUserIntent = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('how does')) {
      return 'explanation';
    }
    if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('question')) {
      return 'quiz';
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('stuck') || lowerMessage.includes('confused')) {
      return 'help';
    }
    if (lowerMessage.includes('study') || lowerMessage.includes('learn better') || lowerMessage.includes('tips')) {
      return 'study_tips';
    }
    if (lowerMessage.includes('motivat') || lowerMessage.includes('discourag') || lowerMessage.includes('difficult')) {
      return 'motivation';
    }
    if (message.includes('?') || lowerMessage.startsWith('why') || lowerMessage.startsWith('how')) {
      return 'specific_question';
    }
    return 'general';
  };

  const detectQuestionType = (message: string): string => {
    if (message.includes('?')) return 'question';
    if (message.toLowerCase().startsWith('explain')) return 'explanation_request';
    if (message.toLowerCase().includes('help')) return 'help_request';
    return 'statement';
  };

  const generateExplanationResponse = (userMessage: string, keyTerms: string[], courseContext: any): string => {
    const specificTerm = keyTerms[0] || 'this concept';
    const explanations = [
      `Let me break down ${specificTerm} for you. ${getDetailedExplanation(specificTerm, userMessage, courseContext)}`,
      `${specificTerm} is an important concept. Here's how I'd explain it: ${getDetailedExplanation(specificTerm, userMessage, courseContext)}`,
      `Great question about ${specificTerm}! ${getDetailedExplanation(specificTerm, userMessage, courseContext)}`,
      `I can help clarify ${specificTerm}. ${getDetailedExplanation(specificTerm, userMessage, courseContext)}`
    ];
    
    const randomIndex = Math.floor(Math.random() * explanations.length);
    return explanations[randomIndex];
  };

  const generateQuizResponse = (userMessage: string, keyTerms: string[], courseContext: any): string => {
    const topic = keyTerms[0] || (courseContext ? courseContext.title : 'this topic');
    const quizResponses = [
      `I'll create some practice questions about ${topic}. What type would you prefer - multiple choice, true/false, or short answer?`,
      `Perfect! Let me generate quiz questions focusing on ${topic}. Should I make them beginner, intermediate, or advanced level?`,
      `Great idea to test your knowledge of ${topic}! How many questions would you like me to create?`,
      `Testing yourself on ${topic} is excellent for retention. What specific aspects should the questions cover?`
    ];
    
    return quizResponses[Math.floor(Math.random() * quizResponses.length)];
  };

  const generateHelpResponse = (userMessage: string, keyTerms: string[], courseContext: any): string => {
    const problemArea = keyTerms[0] || 'this topic';
    const helpResponses = [
      `I understand you're having trouble with ${problemArea}. Let's work through this step by step. What specific part is confusing you?`,
      `No worries about struggling with ${problemArea} - that's completely normal! Can you tell me exactly where you're getting stuck?`,
      `Let's tackle ${problemArea} together. Sometimes a different approach or example can make everything click. What have you tried so far?`,
      `I'm here to help you master ${problemArea}. Breaking it down into smaller pieces often helps. Which aspect should we start with?`
    ];
    
    return helpResponses[Math.floor(Math.random() * helpResponses.length)];
  };

  const generateStudyTipsResponse = (userMessage: string, keyTerms: string[], conversationContext: Message[]): string => {
    const subject = keyTerms[0] || 'your studies';
    const previousTopics = conversationContext.map(msg => extractKeyTerms(msg.content)).flat();
    const isFollowUp = previousTopics.some(term => term.includes('study') || term.includes('tip'));
    
    if (isFollowUp) {
      const advancedTips = [
        `For ${subject}, try the "teaching method" - explain concepts out loud as if teaching someone else. This reveals gaps in understanding.`,
        `Another effective technique for ${subject}: use the "connection method" - link new information to things you already know.`,
        `Consider "interleaving" for ${subject} - mix different topics in one study session rather than focusing on just one.`,
        `Try "elaborative interrogation" with ${subject} - constantly ask yourself "why" and "how" questions about the material.`
      ];
      return advancedTips[Math.floor(Math.random() * advancedTips.length)];
    }
    
    const basicTips = [
      `For studying ${subject} effectively: 1) Use active recall - test yourself frequently, 2) Space out your review sessions, 3) Create visual aids like mind maps. Which interests you most?`,
      `Here are proven strategies for ${subject}: 1) Break material into chunks, 2) Use the Pomodoro Technique (25-min focused sessions), 3) Practice retrieval without looking at notes. What's your current approach?`,
      `To master ${subject}: 1) Teach concepts to others (or yourself), 2) Create connections between ideas, 3) Use multiple senses (visual, auditory, kinesthetic). Which method appeals to you?`
    ];
    
    return basicTips[Math.floor(Math.random() * basicTips.length)];
  };

  const generateMotivationResponse = (userMessage: string, keyTerms: string[]): string => {
    const challenge = keyTerms[0] || 'learning';
    const motivationResponses = [
      `I understand ${challenge} feels overwhelming right now. Remember, every expert was once exactly where you are. What specific part can we tackle together to build your confidence?`,
      `Struggling with ${challenge} means you're pushing your boundaries - that's where real growth happens! Let's break this down into manageable steps.`,
      `It's completely normal to find ${challenge} challenging. Your brain is forming new neural pathways, which takes time and effort. What would help you feel more confident?`,
      `Don't let ${challenge} discourage you. Every difficulty you overcome makes you stronger and more capable. What's one small step we can take right now?`
    ];
    
    return motivationResponses[Math.floor(Math.random() * motivationResponses.length)];
  };

  const generateSpecificAnswerResponse = (userMessage: string, keyTerms: string[], courseContext: any): string => {
    const mainTopic = keyTerms[0] || 'that';
    
    // Generate specific answers based on the question content
    if (userMessage.toLowerCase().includes('why')) {
      return `The reason ${mainTopic} works this way is because ${generateReasoningExplanation(mainTopic, userMessage)}. This is fundamental to understanding how everything connects together.`;
    }
    
    if (userMessage.toLowerCase().includes('how')) {
      return `Here's how ${mainTopic} works: ${generateProcessExplanation(mainTopic, userMessage)}. The key is understanding each step in the process.`;
    }
    
    if (userMessage.toLowerCase().includes('when')) {
      return `You would use ${mainTopic} when ${generateUseCaseExplanation(mainTopic, userMessage)}. Timing and context are crucial for effective application.`;
    }
    
    return `Regarding ${mainTopic}, ${generateGeneralExplanation(mainTopic, userMessage, courseContext)}. This connects to several other important concepts you should know about.`;
  };

  const generateContextualResponse = (userMessage: string, keyTerms: string[], conversationContext: Message[], courseContext: any): string => {
    const mainTopic = keyTerms[0] || 'this topic';
    const messageLength = userMessage.split(' ').length;
    const conversationLength = conversationContext.length;
    
    // Vary response based on conversation flow
    if (conversationLength > 2) {
      return `Building on our discussion, ${mainTopic} ${generateFollowUpContent(userMessage, keyTerms, conversationContext)}. This adds another layer to what we've been exploring.`;
    }
    
    if (messageLength > 10) {
      return `I can see you've thought deeply about ${mainTopic}. ${generateDetailedResponse(userMessage, keyTerms, courseContext)} Let me know if you'd like me to elaborate on any part.`;
    }
    
    if (messageLength <= 3) {
      return `I'd love to help you understand ${mainTopic} better! Could you give me a bit more context about what specifically interests you or what you're trying to learn?`;
    }

    return `That's an interesting point about ${mainTopic}. ${generateAdaptiveResponse(userMessage, keyTerms, courseContext)} What aspect would you like to explore further?`;
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

  const generateReasoningExplanation = (topic: string, userMessage: string): string => {
    const reasoningExplanations = [
      `it follows fundamental principles that have been proven effective through research and practical application`,
      `it's designed to solve specific problems efficiently while maintaining reliability and scalability`,
      `it builds upon established theories and adapts them to modern requirements and constraints`,
      `it represents the most effective approach discovered through years of experimentation and refinement`
    ];
    
    return reasoningExplanations[Math.floor(Math.random() * reasoningExplanations.length)];
  };

  const generateProcessExplanation = (topic: string, userMessage: string): string => {
    const processExplanations = [
      `it follows a systematic sequence of steps, each building upon the previous one to achieve the desired outcome`,
      `it involves multiple phases that work together, with each phase having specific inputs, processes, and outputs`,
      `it operates through a series of interconnected components that communicate and coordinate to produce results`,
      `it uses a structured approach where each step is carefully designed to move closer to the final goal`
    ];
    
    return processExplanations[Math.floor(Math.random() * processExplanations.length)];
  };

  const generateUseCaseExplanation = (topic: string, userMessage: string): string => {
    const useCaseExplanations = [
      `you need to solve problems that require this specific approach or methodology`,
      `the situation calls for the particular strengths and capabilities that this offers`,
      `you're working with constraints or requirements that make this the optimal choice`,
      `the context demands the specific benefits and features that this provides`
    ];
    
    return useCaseExplanations[Math.floor(Math.random() * useCaseExplanations.length)];
  };

  const generateGeneralExplanation = (topic: string, userMessage: string, courseContext: any): string => {
    const context = courseContext ? ` within ${courseContext.title}` : '';
    const generalExplanations = [
      `${topic}${context} represents an important concept that serves as a foundation for understanding more complex ideas`,
      `${topic}${context} is a key element that connects to many other concepts and has practical applications`,
      `${topic}${context} plays a crucial role in the overall framework and helps explain how different components interact`,
      `${topic}${context} is essential for building a comprehensive understanding of the subject matter`
    ];
    
    return generalExplanations[Math.floor(Math.random() * generalExplanations.length)];
  };

  const generateFollowUpContent = (userMessage: string, keyTerms: string[], conversationContext: Message[]): string => {
    const previousTopics = conversationContext.map(msg => extractKeyTerms(msg.content)).flat();
    const connections = keyTerms.filter(term => previousTopics.includes(term));
    
    const followUpContent = [
      `connects directly to what we discussed earlier, creating a more complete picture of how these concepts work together`,
      `builds upon the foundation we established, adding new layers of understanding to your knowledge base`,
      `reveals interesting connections to our previous conversation, showing how different ideas relate and influence each other`,
      `extends our earlier discussion in a meaningful way, helping you see the broader implications and applications`
    ];
    
    return followUpContent[Math.floor(Math.random() * followUpContent.length)];
  };

  const generateDetailedResponse = (userMessage: string, keyTerms: string[], courseContext: any): string => {
    const mainTopic = keyTerms[0] || 'this subject';
    const context = courseContext ? ` in your study of ${courseContext.title}` : '';
    
    const detailedResponses = [
      `Your question about ${mainTopic}${context} touches on several important aspects. Let me address each part systematically to give you a comprehensive understanding`,
      `I can see you're thinking deeply about ${mainTopic}${context}. This kind of thorough questioning shows you're developing real expertise`,
      `That's a sophisticated question about ${mainTopic}${context}. It shows you're moving beyond surface-level understanding to grasp the deeper implications`,
      `Your detailed question about ${mainTopic}${context} demonstrates excellent critical thinking. Let me provide an equally thorough response`
    ];
    
    return detailedResponses[Math.floor(Math.random() * detailedResponses.length)];
  };

  const generateAdaptiveResponse = (userMessage: string, keyTerms: string[], courseContext: any): string => {
    const mainTopic = keyTerms[0] || 'this topic';
    const context = courseContext ? ` within ${courseContext.title}` : '';
    
    const adaptiveResponses = [
      `${mainTopic}${context} is fascinating because it demonstrates how theory translates into practical application`,
      `What makes ${mainTopic}${context} particularly interesting is how it connects to so many other concepts in the field`,
      `${mainTopic}${context} is a great example of how fundamental principles can be applied in creative and innovative ways`,
      `The beauty of ${mainTopic}${context} lies in its versatility and the different ways it can be understood and applied`
    ];
    
    return adaptiveResponses[Math.floor(Math.random() * adaptiveResponses.length)];
  };

  const extractKeyTerms = (message: string): string[] => {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'what', 'how', 'why', 'when', 'where', 'who', 'which', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'];
    
    return message.toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .slice(0, 3); // Take up to 3 key terms
  };
    
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