import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Award } from 'lucide-react';
import { Assessment } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface HistoryItemProps {
  assessment: Assessment;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ assessment }) => {
  const navigate = useNavigate();
  const { title, date, score, totalQuestions } = assessment;
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const handleReview = () => {
    // Store the assessment to review in session storage
    sessionStorage.setItem('reviewAssessment', JSON.stringify(assessment));
    navigate('/results');
  };
  
  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          
          <div className="flex items-center text-gray-600 mb-3">
            <Calendar size={16} className="mr-1" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          
          <div className="flex items-center">
            <Award size={18} className={`mr-2 ${
              percentage >= 80 ? 'text-green-500' : 
              percentage >= 60 ? 'text-blue-500' : 
              percentage >= 40 ? 'text-yellow-500' : 
              'text-red-500'
            }`} />
            <span className="font-medium">
              Score: {score}/{totalQuestions} ({percentage}%)
            </span>
          </div>
        </div>
        
        <Button 
          variant="outline"
          size="sm"
          className="mt-4 sm:mt-0"
          onClick={handleReview}
        >
          Review
        </Button>
      </div>
    </Card>
  );
};

export default HistoryItem;