'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  ArrowDownTrayIcon,
  ShoppingCartIcon,
  ShareIcon,
  LightBulbIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface ReportData {
  userReports: {
    internal_report: {
      aesthetic_style: string;
      emotional_tone: {
        nostalgic: number;
        anti_trend: number;
        calm: number;
        inspired: number;
      };
      behavioral_habit: string;
      target_ad_copy: {
        trend_orientation: string;
        ad_resistance: string;
        tone: string;
      };
      packaged_for: string;
    };
    persona_copy: string;
    style_tags: {
      aesthetic_style: string;
      material_texture: string;
      lighting_mood: string;
      room_typology: string;
      emotional_imagery: string;
      persona_cues: string;
    };
    home_archetype: string;
  };
  searchResults: {
    inspirations: {
      image_path: string;
      description: string;
      relevance_score: number;
      matching_aspects: string[];
    }[];
    least_matches: {
      image_path: string;
      description: string;
      relevance_score: number;
      matching_aspects: string[];
    }[];
  };
}

export default function Results() {
  const [showDataReport, setShowDataReport] = useState(false);
  const [showDarkReport, setShowDarkReport] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [showInspirations, setShowInspirations] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        // 直接从根路径读取数据
        const response = await fetch('/report_results.json');
        if (!response.ok) {
          throw new Error('Report not found');
        }
        const data = await response.json();
        setReportData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading report:', err);
        setError('No report data available. Please complete the conversation first.');
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleAdClick = () => {
    setShowAdPopup(true);
    setTimeout(() => {
      setShowAdPopup(false);
      setShowDarkReport(true);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your personalized report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-xl text-red-500">{error}</div>
        <button
          onClick={() => window.location.href = '/conversation'}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Start Conversation
        </button>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">No report data available</div>
      </div>
    );
  }

  const { userReports, searchResults } = reportData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Soulful Home Profile
            </h1>
            <p className="text-xl text-gray-600">
              {userReports.persona_copy}
            </p>
          </div>

          {/* Toggle Button */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-1 shadow-lg">
              <button
                onClick={() => setShowInspirations(true)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  showInspirations ? 'bg-indigo-600 text-white' : 'text-gray-600'
                }`}
              >
                Most Matches
              </button>
              <button
                onClick={() => setShowInspirations(false)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  !showInspirations ? 'bg-indigo-600 text-white' : 'text-gray-600'
                }`}
              >
                Least Matches
              </button>
            </div>
          </div>

          {/* Image Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(showInspirations ? searchResults.inspirations : searchResults.least_matches).map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden relative"
              >
                <div className="relative h-64">
                  <Image
                    src={image.image_path}
                    alt={image.description}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-medium">
                      {Math.round(image.relevance_score * 100)}% Match
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 text-sm">
                    {image.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Style Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Design Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aesthetic Style
                </h3>
                <p className="text-gray-600">
                  {userReports.style_tags.aesthetic_style}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Material Preferences
                </h3>
                <p className="text-gray-600">
                  {userReports.style_tags.material_texture}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Lighting Mood
                </h3>
                <p className="text-gray-600">
                  {userReports.style_tags.lighting_mood}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Room Typology
                </h3>
                <p className="text-gray-600">
                  {userReports.style_tags.room_typology}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Emotional Imagery
                </h3>
                <p className="text-gray-600">
                  {userReports.style_tags.emotional_imagery}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Persona Cues
                </h3>
                <p className="text-gray-600">
                  {userReports.style_tags.persona_cues}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Download Report</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdClick}
              className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>View Consumer Analysis</span>
            </motion.button>
          </div>
          <div className="my-16"></div>
        </motion.div>
      </div>

      {/* Fixed Advertisement Banner */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg z-40"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <ShoppingCartIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Personalized Home Offers</h3>
              <p className="text-sm opacity-90">Get exclusive deals based on your preferences</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdClick}
            className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            View Offers
          </motion.button>
        </div>
      </motion.div>

      {/* Ad Popup */}
      <AnimatePresence>
        {showAdPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-8 rounded-2xl shadow-2xl text-center"
            >
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">Special Offer!</h3>
              <p className="text-gray-600 mb-6">Preparing your personalized recommendations...</p>
              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark Report Overlay */}
      <AnimatePresence>
        {showDarkReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            {/* Glitch Effect Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              className="absolute inset-0 bg-red-500 mix-blend-overlay"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ff0000\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                animation: 'glitch 0.3s infinite'
              }}
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ 
                scale: [0.8, 1.1, 1],
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: "easeOut"
                }
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-2xl mx-auto p-8 bg-gray-900 rounded-2xl shadow-2xl relative overflow-hidden z-[60]"
            >
              {/* Crack Effect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 z-[61]"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0 L100 0 L100 100 L0 100 Z\' fill=\'none\' stroke=\'%23ff0000\' stroke-width=\'2\' stroke-dasharray=\'5,5\'/%3E%3C/svg%3E")',
                  opacity: 0.1
                }}
              />

              <div className="border-b border-red-500 pb-4 mb-6">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-red-500"
                >
                  CONSUMER DATA REPORT
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-400 text-sm mt-1"
                >
                  [Internal Data Report · For Brands/Data Providers Only]
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 text-gray-300"
              >
                <div>
                  <span className="text-gray-500">User ID:</span>
                  <p className="font-mono text-red-400">#A-{Math.floor(Math.random() * 100000)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Preference Tags:</span>
                  <p className="text-red-300">{userReports.style_tags.aesthetic_style}, {userReports.style_tags.material_texture}</p>
                </div>
                <div>
                  <span className="text-gray-500">Emotional Tone:</span>
                  <p className="text-red-300">
                    {(userReports.internal_report.emotional_tone.nostalgic)}% Nostalgic,{' '}
                    {(userReports.internal_report.emotional_tone.anti_trend)}% Anti-Trend,{' '}
                    {(userReports.internal_report.emotional_tone.calm )}% Calm,{' '}
                    {(userReports.internal_report.emotional_tone.inspired)}% Inspired
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Target Ad Copy:</span>
                  <p className="text-red-300">{userReports.internal_report.target_ad_copy.tone}, {userReports.internal_report.target_ad_copy.trend_orientation}</p>
                </div>
                <div>
                  <span className="text-gray-500">Packaged for:</span>
                  <p className="text-red-300">{userReports.internal_report.packaged_for}</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 pt-6 border-t border-red-500"
              >
                <p className="text-red-400 text-sm italic">
                  "YOUR DATA HAS BEEN PACKAGED AND SOLD"
                </p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.location.href = '/results';
                }}
                className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors relative z-[65]"
              >
                Close Report
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }
      `}</style>
    </div>
  );
} 