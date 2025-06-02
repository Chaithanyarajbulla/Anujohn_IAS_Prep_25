import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Clock, 
  CheckCircle, 
  BarChart3, 
  Book 
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useQuiz } from '../hooks/useQuiz';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getHistory } = useQuiz();
  
  const history = getHistory();
  const totalQuizzes = history.length;
  const totalQuestions = history.reduce((acc, curr) => acc + curr.totalQuestions, 0);
  const correctAnswers = history.reduce((acc, curr) => acc + curr.score, 0);
  
  const averageScore = totalQuizzes > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;
  
  const recentAssessments = history.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-gray-600">
            Track your progress and start a new assessment
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/upload">
            <Button variant="primary" icon={<Upload size={18} />}>
              Upload New Document
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 mb-1">Total Assessments</p>
              <h3 className="text-3xl font-bold">{totalQuizzes}</h3>
            </div>
            <Book className="h-12 w-12 text-blue-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-accent-600 to-accent-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-accent-100 mb-1">Questions Answered</p>
              <h3 className="text-3xl font-bold">{totalQuestions}</h3>
            </div>
            <CheckCircle className="h-12 w-12 text-accent-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-highlight-500 to-highlight-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-highlight-100 mb-1">Average Score</p>
              <h3 className="text-3xl font-bold">{averageScore}%</h3>
            </div>
            <BarChart3 className="h-12 w-12 text-highlight-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-gray-700 to-gray-800 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-300 mb-1">Last Assessment</p>
              <h3 className="text-lg font-bold">
                {history.length > 0 
                  ? new Date(history[0].date).toLocaleDateString() 
                  : 'None yet'}
              </h3>
            </div>
            <Clock className="h-12 w-12 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Recent Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card title="Recent Assessments">
            {recentAssessments.length > 0 ? (
              <div className="space-y-4">
                {recentAssessments.map((assessment) => (
                  <div 
                    key={assessment.id} 
                    className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{assessment.title}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(assessment.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          assessment.score / assessment.totalQuestions >= 0.7 
                            ? 'text-green-600' 
                            : assessment.score / assessment.totalQuestions >= 0.4 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                        }`}>
                          {assessment.score}/{assessment.totalQuestions} ({Math.round((assessment.score / assessment.totalQuestions) * 100)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't taken any assessments yet</p>
                <Link to="/upload">
                  <Button variant="primary" size="sm">
                    Start Your First Assessment
                  </Button>
                </Link>
              </div>
            )}
            
            {recentAssessments.length > 0 && (
              <div className="mt-4 text-center">
                <Link to="/history">
                  <Button variant="outline" size="sm">
                    View All History
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card title="Quick Links">
            <div className="space-y-3">
              <Link to="/upload" className="block">
                <Button variant="outline" fullWidth icon={<Upload size={18} />}>
                  Upload Document
                </Button>
              </Link>
              
              <Link to="/quiz" className="block">
                <Button variant="outline" fullWidth icon={<Book size={18} />}>
                  Continue Quiz
                </Button>
              </Link>
              
              <Link to="/history" className="block">
                <Button variant="outline" fullWidth icon={<Clock size={18} />}>
                  View History
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;