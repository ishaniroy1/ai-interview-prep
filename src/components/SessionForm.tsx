import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const ROLE_OPTIONS = [
  "Frontend Developer", "Backend Developer", "Full-Stack Developer", "UX/UI Designer", "Product Manager",
  "Data Scientist", "Data Engineer", "DevOps Engineer", "Quality Assurance (QA) Engineer", "Mobile App Developer"
];

const ROLE_DESCRIPTIONS: Record<string, string> = {
  'Frontend Developer': 'Focuses on building user-facing web interfaces using HTML, CSS, and JavaScript frameworks. Expect questions on React, component design, state management, and performance optimization.',
  'Backend Developer': 'Responsible for server-side logic, APIs, databases, and system design. Expect questions on Node.js, databases, authentication, and RESTful API design.',
  'Full-Stack Developer': 'Handles both frontend and backend tasks including APIs and UI. Expect a mix of frontend and backend questions covering end-to-end system design.',
  'UX/UI Designer': 'Focuses on user experience and interface design. Expect questions on design principles, user research, wireframing, and prototyping.',
  'Product Manager': 'Leads product strategy, roadmap, and cross-functional collaboration. Expect questions on prioritization, metrics, stakeholder communication, and product design.',
  'Data Scientist': 'Works with data analysis, modeling, and machine learning. Expect questions on statistics, ML models, Python, and data storytelling.',
  'Data Engineer': 'Builds data pipelines and infrastructure. Expect questions on ETL, data modeling, SQL, and distributed systems.',
  'DevOps Engineer': 'Focuses on CI/CD, infrastructure, and reliability. Expect questions on cloud, containers, orchestration, and monitoring.',
  'Quality Assurance (QA) Engineer': 'Ensures software quality through testing strategies and automation. Expect questions on test design, automation tools, and debugging.',
  'Mobile App Developer': 'Builds mobile applications for iOS/Android. Expect questions on native or cross-platform frameworks, app lifecycle, and performance.'
};

const sessionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  jobRole: z.enum(ROLE_OPTIONS as [string, ...string[]]),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.number().min(5, 'Duration must be at least 5 minutes').max(120, 'Duration must be less than 120 minutes')
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface SessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SessionFormData) => void;
  initialData?: Partial<SessionFormData>;
  isLoading?: boolean;
}

const SessionForm: React.FC<SessionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      jobRole: (initialData?.jobRole as any) || ROLE_OPTIONS[0],
      difficulty: initialData?.difficulty || 'beginner',
      duration: initialData?.duration || 30
    }
  });

  // set initial auto-generated description based on default/initial jobRole
  React.useEffect(() => {
    const initialRole = (initialData?.jobRole as any) || ROLE_OPTIONS[0];
    const desc = ROLE_DESCRIPTIONS[initialRole] || '';
    setValue('description', desc);
  }, [initialData, setValue]);

  const handleFormSubmit = (data: SessionFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {initialData ? 'Edit Session' : 'Create New Session'}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close form"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
              Session Title *
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Frontend Developer Interview"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          

          <div>
            <label htmlFor="jobRole" className="block text-sm font-medium text-slate-700 mb-1">
              Job Role *
            </label>
            <select
              {...register('jobRole')}
              id="jobRole"
              className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                const selected = e.target.value as SessionFormData['jobRole'];
                const desc = ROLE_DESCRIPTIONS[selected] || '';
                setValue('description', desc);
              }}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.jobRole && (
              <p className="text-red-600 text-sm mt-1">{errors.jobRole.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              Description (auto-generated)
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              readOnly
              className="w-full px-3 py-2 border border-slate-300 bg-slate-50 focus:outline-none"
              placeholder="Description will be generated based on selected role"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 mb-1">
              Difficulty Level *
            </label>
            <select
              {...register('difficulty')}
              id="difficulty"
              className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.difficulty && (
              <p className="text-red-600 text-sm mt-1">{errors.difficulty.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1">
              Duration (minutes) *
            </label>
            <input
              {...register('duration', { valueAsNumber: true })}
              type="number"
              id="duration"
              min="5"
              max="120"
              className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.duration && (
              <p className="text-red-600 text-sm mt-1">{errors.duration.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : initialData ? 'Update Session' : 'Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionForm;
