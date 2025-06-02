import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Upload, BarChart, Award } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Upload className="h-10 w-10 text-accent-600" />,
      title: 'Upload Study Material',
      description: 'Upload your PDF files and study materials to generate customized quizzes.',
    },
    {
      icon: <BookOpen className="h-10 w-10 text-accent-600" />,
      title: 'Smart Question Generation',
      description: 'Our system generates relevant MCQs from your uploaded content, focusing on key concepts.',
    },
    {
      icon: <BarChart className="h-10 w-10 text-accent-600" />,
      title: 'Track Progress',
      description: 'Monitor your performance with detailed analytics and identify areas for improvement.',
    },
    {
      icon: <Award className="h-10 w-10 text-accent-600" />,
      title: 'Learn Efficiently',
      description: 'Review explanations for each question to deepen your understanding of the material.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Ace Your UPSC Preparation with Smart Learning
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Upload your study material, generate custom quizzes, and track your progress - all in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="btn btn-primary px-8 py-3 text-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn btn-primary px-8 py-3 text-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline border-white text-white hover:bg-white hover:bg-opacity-10 px-8 py-3 text-lg"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Features Designed for UPSC Aspirants
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Supercharge Your UPSC Preparation?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of aspirants who have transformed their study routine with our platform.
          </p>
          {user ? (
            <Link
              to="/upload"
              className="btn bg-white text-accent-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Upload Your First Document
            </Link>
          ) : (
            <Link
              to="/register"
              className="btn bg-white text-accent-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Create Free Account
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} UPSC Prep Master. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;