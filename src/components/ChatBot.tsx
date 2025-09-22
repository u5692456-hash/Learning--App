import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ courseContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: courseContext?.title 
        ? `Hello! I'm your 24/7 AI tutor for "${courseContext.title}". I can help explain concepts, create practice questions, provide study tips, and answer any questions you have. What would you like to explore?`
        : 'Hello! I\'m your 24/7 AI learning assistant. I can help you understand concepts, create study materials, and guide your learning. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationHistory = useRef<string[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced response generation system
  const generateDynamicResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();
    const words = input.split(' ');
    const keyTerms = extractKeyTerms(input);
    const intent = detectIntent(input);
    const conversationContext = conversationHistory.current.slice(-3);
    
    // Add current message to history
    conversationHistory.current.push(input);
    if (conversationHistory.current.length > 10) {
      conversationHistory.current.shift();
    }

    return generateContextualResponse(input, keyTerms, intent, conversationContext, words.length);
  };

  const extractKeyTerms = (input: string): string[] => {
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'how', 'what', 'when', 'where', 'why', 'can', 'could', 'would', 'should', 'i', 'you', 'me', 'my', 'your'];
    const words = input.toLowerCase().split(/\W+/).filter(word => 
      word.length > 2 && !stopWords.includes(word)
    );
    return [...new Set(words)];
  };

  const detectIntent = (input: string): string => {
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'who'];
    const helpWords = ['help', 'assist', 'support', 'guide'];
    const explainWords = ['explain', 'describe', 'tell', 'show'];
    const quizWords = ['quiz', 'test', 'question', 'practice'];
    const studyWords = ['study', 'learn', 'understand', 'master'];

    if (questionWords.some(word => input.includes(word))) return 'question';
    if (helpWords.some(word => input.includes(word))) return 'help';
    if (explainWords.some(word => input.includes(word))) return 'explain';
    if (quizWords.some(word => input.includes(word))) return 'quiz';
    if (studyWords.some(word => input.includes(word))) return 'study';
    
    return 'general';
  };

  const generateContextualResponse = (
    input: string, 
    keyTerms: string[], 
    intent: string, 
    context: string[], 
    wordCount: number
  ): string => {
    const responses = {
      question: [
        `Great question about ${keyTerms.length > 0 ? keyTerms.join(' and ') : 'this topic'}! Let me break this down for you:`,
        `That's an interesting question regarding ${keyTerms.slice(0, 2).join(' and ')}. Here's what you need to know:`,
        `I'd be happy to explain ${keyTerms.length > 0 ? keyTerms[0] : 'this concept'} to you. Let's explore this step by step:`
      ],
      help: [
        `I'm here to help you with ${keyTerms.length > 0 ? keyTerms.join(', ') : 'your studies'}! Here are some ways I can assist:`,
        `Absolutely! I can provide guidance on ${keyTerms.slice(0, 2).join(' and ')}. Let me suggest some approaches:`,
        `I'd love to help you understand ${keyTerms.length > 0 ? keyTerms[0] : 'this better'}. Here's how we can tackle this:`
      ],
      explain: [
        `Let me explain ${keyTerms.length > 0 ? keyTerms.join(' and ') : 'this concept'} in detail:`,
        `I'll walk you through ${keyTerms.slice(0, 2).join(' and ')} step by step:`,
        `Here's a comprehensive explanation of ${keyTerms.length > 0 ? keyTerms[0] : 'this topic'}:`
      ],
      quiz: [
        `Great idea! Let's test your knowledge of ${keyTerms.length > 0 ? keyTerms.join(' and ') : 'this subject'}:`,
        `I'd be happy to quiz you on ${keyTerms.slice(0, 2).join(' and ')}! Here's a question:`,
        `Perfect! Let's practice with some questions about ${keyTerms.length > 0 ? keyTerms[0] : 'this topic'}:`
      ],
      study: [
        `Excellent! Here are some effective study strategies for ${keyTerms.length > 0 ? keyTerms.join(' and ') : 'this subject'}:`,
        `I can definitely help you master ${keyTerms.slice(0, 2).join(' and ')}. Here's my recommended approach:`,
        `Great choice to focus on ${keyTerms.length > 0 ? keyTerms[0] : 'learning'}! Let me suggest some study methods:`
      ],
      general: [
        `Thanks for sharing that about ${keyTerms.length > 0 ? keyTerms.join(' and ') : 'this topic'}. Here's my take:`,
        `Interesting point regarding ${keyTerms.slice(0, 2).join(' and ')}. Let me add some insights:`,
        `I see you're interested in ${keyTerms.length > 0 ? keyTerms[0] : 'this subject'}. Here's what I think:`
      ]
    };

    const baseResponses = responses[intent as keyof typeof responses] || responses.general;
    const selectedResponse = baseResponses[Math.floor(Math.random() * baseResponses.length)];

    // Generate specific content based on key terms and context
    const specificContent = generateSpecificContent(keyTerms, intent, context, wordCount);
    
    return `${selectedResponse}\n\n${specificContent}`;
  };

  const generateSpecificContent = (keyTerms: string[], intent: string, context: string[], wordCount: number): string => {
    const subjects = {
      'machine learning': 'Machine learning involves algorithms that improve through experience. Key concepts include supervised learning, unsupervised learning, and neural networks.',
      'react': 'React is a JavaScript library for building user interfaces. It uses components, state management, and virtual DOM for efficient rendering.',
      'python': 'Python is a versatile programming language known for its readability and extensive libraries. Great for data science, web development, and automation.',
      'javascript': 'JavaScript is the language of the web, enabling interactive websites and modern web applications. It supports both functional and object-oriented programming.',
      'database': 'Databases store and organize data efficiently. SQL databases use structured tables, while NoSQL databases offer flexible document storage.',
      'algorithm': 'Algorithms are step-by-step procedures for solving problems. They vary in efficiency and are fundamental to computer science.',
      'css': 'CSS styles web pages, controlling layout, colors, fonts, and responsive design. Modern CSS includes flexbox, grid, and animations.',
      'html': 'HTML structures web content using elements and tags. It forms the foundation of all web pages and applications.'
    };

    // Find relevant subject content
    const relevantSubject = keyTerms.find(term => subjects[term as keyof typeof subjects]);
    if (relevantSubject) {
      return subjects[relevantSubject as keyof typeof subjects];
    }

    // Generate content based on intent and context
    if (intent === 'quiz') {
      const questions = [
        `What is the main purpose of ${keyTerms[0] || 'this concept'}?`,
        `How would you implement ${keyTerms[0] || 'this'} in a real project?`,
        `What are the key benefits of using ${keyTerms[0] || 'this approach'}?`
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    }

    if (intent === 'study') {
      const tips = [
        '1. Break down complex topics into smaller chunks\n2. Practice with real examples\n3. Teach the concept to someone else\n4. Create visual diagrams or mind maps',
        '1. Start with the fundamentals\n2. Build projects to apply your knowledge\n3. Join study groups or online communities\n4. Review and revise regularly',
        '1. Set specific learning goals\n2. Use active recall techniques\n3. Connect new concepts to what you already know\n4. Take regular breaks to avoid burnout'
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    // Default contextual response
    const contextualResponses = [
      `This is a fascinating area of study. The key is to understand the underlying principles and how they apply in practice.`,
      `There are several approaches to this topic. I'd recommend starting with the basics and gradually building up your understanding.`,
      `This concept connects to many other areas of learning. Understanding these connections will deepen your knowledge.`,
      `Practice is essential for mastering this topic. Try working through examples and applying what you learn.`
    ];

    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateDynamicResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:from-emerald-600 hover:to-blue-700 transition-all z-40 group"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          24/7 AI Tutor
        </div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-800">24/7 AI Tutor</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && (
                    <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                  )}
                  {message.sender === 'user' && (
                    <User className="w-4 h-4 mt-1 flex-shrink-0" />
                  )}
                  <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <div className="text-sm">Typing...</div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your studies..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default ChatBot;