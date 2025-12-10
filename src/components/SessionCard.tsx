import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Session {
  _id: string;
  title: string;
  description: string;
  jobRole: string;
  difficulty: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

interface SessionCardProps {
  session: Session;
  onEdit: (session: Session) => void;
  onDelete: (sessionId: string) => void;
  onStart: (session: Session) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onEdit, onDelete, onStart }) => {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{session.title}</h3>
          <p className="text-slate-600 text-sm mb-3">{session.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
              {session.jobRole}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${difficultyColors[session.difficulty as keyof typeof difficultyColors] || 'bg-slate-100 text-slate-800'}`}>
              {session.difficulty}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{session.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(session.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 ml-4">
          <button
            onClick={() => onEdit(session)}
            className="text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
            aria-label="Edit session"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(session._id)}
            className="text-xs text-slate-500 hover:text-red-600 transition-colors font-medium"
            aria-label="Delete session"
          >
            Delete
          </button>
        </div>
      </div>

      <button
        onClick={() => onStart(session)}
        className="w-full bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition-colors font-medium"
      >
        Start Practice Session
      </button>
    </div>
  );
};

export default SessionCard;