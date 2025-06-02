import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useQuiz } from '../hooks/useQuiz';

const UploadFile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { generateQuestions, isLoading } = useQuiz();
  
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      
      // Check file type
      if (!['application/pdf', 'text/plain'].includes(selectedFile.type)) {
        setError('Only PDF and text files are supported');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      
      // Set default title from filename
      if (!title) {
        setTitle(selectedFile.name.split('.')[0]);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check file size (limit to 10MB)
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      
      // Check file type
      if (!['application/pdf', 'text/plain'].includes(droppedFile.type)) {
        setError('Only PDF and text files are supported');
        return;
      }
      
      setFile(droppedFile);
      setError(null);
      
      // Set default title from filename
      if (!title) {
        setTitle(droppedFile.name.split('.')[0]);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    if (!title) {
      setError('Please enter a title for the quiz');
      return;
    }
    
    try {
      // For this demo, we'll just read the file as text
      // In a real app, you'd use a proper PDF parser or send to backend
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          // Generate questions from the file content
          generateQuestions(e.target.result, title);
          
          // Navigate to the quiz page
          navigate('/quiz');
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read file');
      };
      
      if (file.type === 'application/pdf') {
        // For demo purposes, we'll just use a placeholder text for PDFs
        // since we can't actually parse PDFs in the browser without a library
        const placeholderText = 
          "This is a placeholder text for PDF content. In a real implementation, " +
          "you would use a PDF parsing library like pdf.js to extract the text content. " +
          "The PDF would be analyzed to generate relevant UPSC exam questions covering " +
          "topics like Indian history, geography, polity, economy, and current affairs. " +
          "The Constitution of India, passed by the Constituent Assembly on 26 November 1949, " +
          "came into effect on 26 January 1950. The document lays down the framework defining " +
          "fundamental political principles, establishes the structure, procedures, powers and " +
          "duties of government institutions, and sets out fundamental rights, directive principles, " +
          "and the duties of citizens.";
          
        generateQuestions(placeholderText, title);
        navigate('/quiz');
      } else {
        // Read as text for text files
        reader.readAsText(file);
      }
    } catch (err) {
      setError('Failed to process file');
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1>Upload Study Material</h1>
      <p className="text-gray-600 mb-6">
        Upload your PDF or text file to generate quiz questions
      </p>
      
      <Card>
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
          } transition-colors cursor-pointer`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.txt"
          />
          
          {file ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-1">{file.name}</h3>
              <p className="text-gray-500 mb-4">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                Change File
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Drag and drop file here
              </h3>
              <p className="text-gray-500 mb-4">
                or click to browse files
              </p>
              <p className="text-sm text-gray-400">
                Supports PDF and text files (max 10MB)
              </p>
            </div>
          )}
        </div>
        
        {error && (
          <div className="flex items-start mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="mt-6">
          <label 
            htmlFor="quiz-title" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Quiz Title
          </label>
          <input
            type="text"
            id="quiz-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your quiz"
            className="form-input mb-4"
          />
          
          <Button
            variant="primary"
            fullWidth
            icon={<FileText size={18} />}
            onClick={handleUpload}
            isLoading={isLoading}
            disabled={!file || isLoading}
          >
            Generate Quiz
          </Button>
        </div>
      </Card>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Tips for Better Results</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <ul className="list-disc pl-5 space-y-2 text-blue-900">
            <li>Use clear, high-quality PDFs with selectable text</li>
            <li>Upload materials focused on specific UPSC topics for more relevant questions</li>
            <li>Study materials with headings and structured content work best</li>
            <li>For best results, upload content between 5-50 pages</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;