import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Upload, BarChart, Award, Brain, Target, Clock, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Brain className="h-10 w-10 text-accent-600" />,
      title: 'AI-Powered Analysis',
      description: 'Our advanced AI analyzes your study material to generate UPSC-focused questions.',
    },
    {
      icon: <Target className="h-10 w-10 text-accent-600" />,
      title: 'Exam-Oriented',
      description: 'Questions are tailored to match UPSC examination patterns and requirements.',
    },
    {
      icon: <Clock className="h-10 w-10 text-accent-600" />,
      title: 'Time Management',
      description: 'Practice with timed assessments to improve your exam readiness.',
    },
    {
      icon: <Users className="h-10 w-10 text-accent-600" />,
      title: 'Community Learning',
      description: 'Join a community of aspirants preparing for UPSC examinations.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Academy Anujohn
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Transform your UPSC preparation with AI-powered learning and personalized assessments
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="btn bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Your Journey
                </Link>
                <Link
                  to="/login"
                  className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg rounded-full transition-all duration-300"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-900 bg-opacity-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Features Designed for UPSC Success
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-emerald-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Excel in UPSC?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Join thousands of successful aspirants who have transformed their preparation journey
          </p>
          {user ? (
            <Link
              to="/upload"
              className="btn bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Upload Your Study Material
            </Link>
          ) : (
            <Link
              to="/register"
              className="btn bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Begin Your Preparation
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Academy Anujohn. All rights reserved.</p>
          <p className="mt-2">Created by chaithanyarajbulla@2004</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;