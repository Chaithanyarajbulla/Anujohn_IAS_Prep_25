import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, BarChart2, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import HistoryItem from '../components/history/HistoryItem';
import { useQuiz } from '../hooks/useQuiz';

const History: React.FC = () => {
  const navigate = useNavigate();
  const { getHistory } = useQuiz();
  const history = getHistory();

  // Generate monthly statistics
  const generateMonthlyStats = () => {
    if (history.length === 0) return [];
    
    const monthlyStats: Record<string, { count: number; score: number; totalQuestions: number }> = {};
    
    history.forEach(assessment => {
      const date = new Date(assessment.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!monthlyStats[monthYear]) {
        monthlyStats[monthYear] = { count: 0, score: 0, totalQuestions: 0 };
      }
      
      monthlyStats[monthYear].count += 1;
      monthlyStats[monthYear].score += assessment.score;
      monthlyStats[monthYear].totalQuestions += assessment.totalQuestions;
    });
    
    return Object.entries(monthlyStats).map(([month, stats]) => ({
      month,
      count: stats.count,
      averageScore: Math.round((stats.score / stats.totalQuestions) * 100),
    }));
  };

  const monthlyStats = generateMonthlyStats();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1>Assessment History</h1>
          <p className="text-gray-600">
            Review your past assessments and track your progress
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            variant="primary" 
            onClick={() => navigate('/upload')}
          >
            Start New Assessment
          </Button>
        </div>
      </div>

      {/* Monthly Statistics */}
      {monthlyStats.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Monthly Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthlyStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <h3 className="font-medium text-lg mb-1">{stat.month}</h3>
                <p className="text-gray-600 mb-2">{stat.count} Assessments</p>
                <div 
                  className={`text-lg font-semibold ${
                    stat.averageScore >= 75 ? 'text-green-600' : 
                    stat.averageScore >= 50 ? 'text-blue-600' : 
                    stat.averageScore >= 25 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}
                >
                  {stat.averageScore}% Average
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Assessment List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Assessment History</h2>
        
        {history.length > 0 ? (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search assessments..."
                className="form-input"
              />
            </div>
            
            <div>
              {history.map(assessment => (
                <HistoryItem key={assessment.id} assessment={assessment} />
              ))}
            </div>
          </>
        ) : (
          <Card className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No History Found</h3>
            <p className="text-gray-600 mb-6">
              You haven't completed any assessments yet.
            </p>
            <Button 
              variant="primary"
              onClick={() => navigate('/upload')}
            >
              Start Your First Assessment
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default History;