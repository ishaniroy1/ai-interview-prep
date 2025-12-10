import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle, Clock, Brain } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';

interface Question {
  id: number;
  question: string;
  type: string;
}

interface SimulatorProps {
  user: any;
  onLogout: () => void;
}

const Simulator: React.FC<SimulatorProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!session) {
      navigate('/dashboard');
      return;
    }
    setTimeRemaining(session.duration * 60);
  }, [user, session, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobRole: session.jobRole,
          difficulty: session.difficulty,
          count: 5
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(''));
        setFeedbacks(new Array(data.questions.length).fill(''));
        setIsSessionStarted(true);
        setIsTimerRunning(true);
        toast.success('Interview session started!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to generate questions');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateFeedback = async () => {
    const currentAnswer = (answers[currentQuestionIndex] || '').trim();
    if (!currentAnswer) {
      toast.error('Please provide an answer before getting feedback.');
      return;
    }

    setIsGeneratingFeedback(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/generate-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: questions[currentQuestionIndex].question,
          answer: currentAnswer,
          jobRole: session.jobRole
        })
      });

      if (response.ok) {
        const data = await response.json();
        setFeedbacks((prev) => {
          const copy = [...prev];
          copy[currentQuestionIndex] = data.feedback;
          return copy;
        });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to generate feedback');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      handleCompleteSession();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1);
    }
  };

  const handleCompleteSession = () => {
    setIsTimerRunning(false);
    setIsSessionCompleted(true);
    toast.success('Interview session completed!');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!user || !session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{session.title}</h1>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                    {session.jobRole}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                    {session.difficulty}
                  </span>
                </div>
              </div>
              
              {isSessionStarted && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Clock className="w-5 h-5" />
                    <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
                  </div>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="flex items-center space-x-1 px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span className="text-sm">{isTimerRunning ? 'Pause' : 'Resume'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isSessionStarted && !isSessionCompleted ? (
          <div className="bg-white border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Ready to Start?</h2>
            <p className="text-slate-600 mb-6">
              We'll generate personalized interview questions based on your session settings. 
              The timer will start once questions are generated.
            </p>
            <button
              onClick={generateQuestions}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : <Play className="w-5 h-5" />}
              <span>{isLoading ? 'Generating Questions...' : 'Start Interview'}</span>
            </button>
          </div>
        ) : isSessionCompleted ? (
          <div className="bg-white border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Session Completed!</h2>
            <p className="text-slate-600 mb-6">
              Great job completing your interview practice session. Review your performance and keep practicing to improve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setIsSessionCompleted(false);
                  setIsSessionStarted(false);
                  setCurrentQuestionIndex(0);
                  setAnswers([]);
                  setFeedbacks([]);
                  setTimeRemaining(session.duration * 60);
                }}
                className="flex items-center space-x-2 px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start New Session</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h2>
                <div className="w-full max-w-xs bg-slate-200 h-2 ml-4">
                  <div
                    className="bg-blue-600 h-2 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {questions[currentQuestionIndex] && (
                <div className="mb-6">
                  <p className="text-slate-900 text-lg leading-relaxed">
                    {questions[currentQuestionIndex].question}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 bg-slate-100 text-slate-600 text-sm">
                    {questions[currentQuestionIndex].type}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="answer" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Answer
                  </label>
                  <textarea
                    id="answer"
                    value={answers[currentQuestionIndex] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAnswers((prev) => {
                        const copy = [...prev];
                        copy[currentQuestionIndex] = val;
                        return copy;
                      });
                    }}
                    rows={6}
                    className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your answer here..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {currentQuestionIndex > 0 && (
                    <button
                      onClick={handlePrevQuestion}
                      className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium"
                    >
                      Back
                    </button>
                  )}

                  <button
                    onClick={generateFeedback}
                    disabled={isGeneratingFeedback || !(answers[currentQuestionIndex] || '').trim()}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingFeedback ? <LoadingSpinner size="sm" /> : <Brain className="w-4 h-4" />}
                    <span>{isGeneratingFeedback ? 'Generating...' : 'Get AI Feedback'}</span>
                  </button>
                  
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Session'}
                  </button>
                </div>
              </div>
            </div>

            {feedbacks[currentQuestionIndex] && (
              <div className="bg-white border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">AI Feedback</h3>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{feedbacks[currentQuestionIndex]}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  );
};

export default Simulator;
