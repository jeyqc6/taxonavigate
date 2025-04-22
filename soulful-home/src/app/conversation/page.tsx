'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const questions = [
  "If anything were possible, what would your dream home look like?",
  "What's your favorite moment at home?",
  "How would you describe the soul of your home?",
  "What do you hope your friends feel when they visit your home?",
  "How would you feel if someone said your home is too trendy?"
];

export default function Conversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          currentQuestion: questions[currentQuestionIndex]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Move to next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        // Add next question as assistant message
        const nextQuestionMessage: Message = {
          role: 'assistant',
          content: questions[currentQuestionIndex + 1]
        };
        setMessages(prev => [...prev, nextQuestionMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // Add first question when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      const firstQuestion: Message = {
        role: 'assistant',
        content: questions[0]
      };
      setMessages([firstQuestion]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                Let's Talk About Your Dream Home
              </h2>
              <p className="text-gray-600 mt-2">
                Share your thoughts and preferences with our AI consultant
              </p>
            </div>
            
            <div className="h-[60vh] overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 text-gray-900 p-4 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {currentQuestionIndex < questions.length && (
              <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300"
                  >
                    <PaperAirplaneIcon className="h-6 w-6" />
                  </motion.button>
                </div>
              </form>
            )}

            {/* Completion Message */}
            {currentQuestionIndex >= questions.length && (
              <div className="p-6 border-t border-gray-200">
                <div className="text-center text-gray-700 mb-4">
                  <p className="text-lg font-medium">You have completed all questions!</p>
                  <p className="text-sm mt-1">Click below to get your personalized home design report.</p>
                </div>
              </div>
            )}

            {/* Report Button - Always visible */}
            <div className="p-4 border-t border-gray-200">
              <Link href="/results">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async (e) => {
                    e.preventDefault(); // Prevent immediate navigation
                    try {
                      const response = await fetch('/api/generate-report', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          messages,
                          selections: {} // Add any selections if needed
                        }),
                      });

                      if (!response.ok) {
                        throw new Error('Failed to generate report');
                      }

                      // Only navigate after successful report generation
                      window.location.href = '/results';
                    } catch (error) {
                      console.error('Error generating report:', error);
                      alert('Failed to generate report. Please try again.');
                    }
                  }}
                  className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Your Soulful Home Report
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 