import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import SessionCard from '../components/SessionCard';
import SessionForm from '../components/SessionForm';
import LoadingSpinner from '../components/LoadingSpinner';

interface Session {
  _id: string;
  title: string;
  description: string;
  jobRole: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  createdAt: string;
  updatedAt: string;
}

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSessions();
  }, [user, navigate]);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchTerm, difficultyFilter]);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        toast.error('Failed to fetch sessions');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = sessions;

    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.jobRole.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(session => session.difficulty === difficultyFilter);
    }

    setFilteredSessions(filtered);
  };

  const handleCreateSession = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const newSession = await response.json();
        setSessions([newSession, ...sessions]);
        setIsFormOpen(false);
        toast.success('Session created successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create session');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const handleUpdateSession = async (data: any) => {
    if (!editingSession) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sessions/${editingSession._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const updatedSession = await response.json();
        setSessions(sessions.map(s => s._id === updatedSession._id ? updatedSession : s));
        setEditingSession(null);
        setIsFormOpen(false);
        toast.success('Session updated successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update session');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSessions(sessions.filter(s => s._id !== sessionId));
        toast.success('Session deleted successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete session');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const handleStartSession = (session: Session) => {
    navigate('/simulator', { state: { session } });
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setIsFormOpen(true);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-slate-600">
            Manage your interview practice sessions and track your progress.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingSession(null);
              setIsFormOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors font-medium"
          >
            New Session
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {sessions.length === 0 ? 'No sessions yet' : 'No sessions match your filters'}
            </h3>
            <p className="text-slate-600 mb-6">
              {sessions.length === 0 
                ? 'Create your first interview practice session to get started.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {sessions.length === 0 && (
              <button
                onClick={() => {
                  setEditingSession(null);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Session</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                onEdit={handleEditSession}
                onDelete={handleDeleteSession}
                onStart={handleStartSession}
              />
            ))}
          </div>
        )}

        <SessionForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingSession(null);
          }}
          onSubmit={editingSession ? handleUpdateSession : handleCreateSession}
          initialData={editingSession || undefined}
        />
      </main>

    </div>
  );
};

export default Dashboard;