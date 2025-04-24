'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type Question = {
  id: string;
  question: string;
  options: {
    id: string;
    image: string;
    description: string;
    tags: {
      style: string[];
      personality: string[];
      emotional: string[];
    };
  }[];
};

const questions: Question[] = [
  {
    id: 'Q1',
    question: 'Which living room feels most relaxing to you?',
    options: [
      {
        id: 'A',
        image: '/question_images/Q1-A.jpg',
        description: '',
        tags: {
          style: ['warm wood', 'white walls', 'soft lighting'],
          personality: ['gentle minimalist', 'introspective'],
          emotional: ['warm', 'naturalist']
        }
      },
      {
        id: 'B',
        image: '/question_images/Q1-B.jpg',
        description: '',
        tags: {
          style: ['colorful mix', 'book wall', 'textiles'],
          personality: ['bohemian sentimentalist', 'creative'],
          emotional: ['eclectic', 'memory collector']
        }
      },
      {
        id: 'C',
        image: '/question_images/Q1-C.jpg',
        description: '',
        tags: {
          style: ['minimalist', 'black and white', 'glass walls'],
          personality: ['modern futurist', 'control-oriented'],
          emotional: ['tech-savvy', 'minimalist']
        }
      }
    ]
  },
  {
    id: 'Q2',
    question: 'Which lighting makes you feel at home?',
    options: [
      {
        id: 'A',
        image: '/question_images/Q2-A.jpg',
        description: '',
        tags: {
          style: ['warm sunset lighting'],
          personality: ['nostalgic', 'grounded'],
          emotional: ['soft memory', 'comforting']
        }
      },
      {
        id: 'B',
        image: '/question_images/Q2-B.jpg',
        description: '',
        tags: {
          style: ['chandelier', 'reflective glass'],
          personality: ['performative', 'glamorous'],
          emotional: ['dramatic', 'showy']
        }
      },
      {
        id: 'C',
        image: '/question_images/Q2-C.jpg',
        description: '',
        tags: {
          style: ['neon lights'],
          personality: ['edgy', 'expressive'],
          emotional: ['nightlife coded', 'bold']
        }
      }
    ]
  },
  {
    id: 'Q3',
    question: 'Which kitchen makes you want to cook?',
    options: [
      {
        id: 'A',
        image: '/question_images/Q3-A.jpg',
        description: '',
        tags: {
          style: ['kitchen island', 'wooden texture'],
          personality: ['communal', 'earthy'],
          emotional: ['warm', 'inviting']
        }
      },
      {
        id: 'B',
        image: '/question_images/Q3-B.jpg',
        description: '',
        tags: {
          style: ['white open kitchen', 'curated display'],
          personality: ['curated', 'modern domestic'],
          emotional: ['aesthetic', 'trendy']
        }
      },
      {
        id: 'C',
        image: '/question_images/Q3-C.jpg',
        description: '',
        tags: {
          style: ['high-tech integrated kitchen'],
          personality: ['task-oriented', 'efficient'],
          emotional: ['gadget-loving', 'practical']
        }
      }
    ]
  },
  {
    id: 'Q4',
    question: 'Which bedroom would help you dream better?',
    options: [
      {
        id: 'A',
        image: '/question_images/Q4-A.jpg',
        description: '',
        tags: {
          style: ['low bed', 'sheer curtains', 'natural light'],
          personality: ['soothing', 'nurtured'],
          emotional: ['childlike', 'secure']
        }
      },
      {
        id: 'B',
        image: '/question_images/Q4-B.jpg',
        description: '',
        tags: {
          style: ['loft style', 'projector'],
          personality: ['visual immersive', 'contrasting'],
          emotional: ['dramatic', 'expressive']
        }
      },
      {
        id: 'C',
        image: '/question_images/Q4-C.jpg',
        description: '',
        tags: {
          style: ['hotel-style', 'black and gray'],
          personality: ['rational', 'controlled'],
          emotional: ['minimalist', 'detached']
        }
      }
    ]
  }
];

export default function VisualSelection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleOptionSelect = async (questionId: string, optionId: string) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: optionId }));
    
    // Send selection to backend
    const selectedOption = questions[currentQuestionIndex].options.find(opt => opt.id === optionId);
    if (selectedOption) {
      try {
        const response = await fetch('/api/visual-selection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionId,
            optionId,
            tags: selectedOption.tags
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save selection');
        }
      } catch (error) {
        console.error('Error saving selection:', error);
      }
    }

    // If it's the last question, navigate to conversation page
    if (currentQuestionIndex === questions.length - 1) {
      window.location.href = '/conversation';
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentQuestion.question}
                </h2>
                <p className="text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentQuestion.options.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                    onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={option.image}
                        alt={option.id}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {currentQuestionIndex === questions.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-8"
                >
                  <Link href="/conversation">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Continue to Conversation
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 