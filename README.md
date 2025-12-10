# AI Interview Prep Platform

## Project Overview

AI Interview Prep is a comprehensive web-based platform that helps job seekers prepare for technical interviews across multiple roles. The platform uses OpenAI's GPT-3.5-turbo model to generate realistic, role-specific interview questions and provide intelligent feedback on user responses. Users can create personalized interview sessions, practice with questions tailored to their target job role and difficulty level, and receive AI-powered feedback to improve their interview performance. Whether you're preparing for a Frontend Developer, Backend Developer, Data Scientist, or Product Manager role, this platform adapts to your needs and provides a simulated interview experience.

---

## Features

- **Role-Specific Interview Sessions**: Create practice sessions for 10+ job roles including Frontend Developer, Backend Developer, Full-Stack Developer, UX/UI Designer, Product Manager, Data Scientist, Data Engineer, DevOps Engineer, QA Engineer, and Mobile App Developer
- **AI-Powered Question Generation**: Uses OpenAI API to generate realistic, contextual interview questions based on job role, difficulty level, and session duration
- **Intelligent Feedback System**: Get detailed AI-generated feedback on your answers with constructive suggestions for improvement
- **Difficulty Levels**: Practice with Beginner, Intermediate, or Advanced difficulty questions to match your skill level
- **Session Management**: Create, edit, update, and delete interview practice sessions with auto-generated descriptions for each role
- **Progress Tracking**: Track your interview sessions with creation timestamps and session metadata
- **User Authentication**: Secure JWT-based authentication system with user registration and login
- **Responsive Design**: Clean, modern UI built with Tailwind CSS and sharp-cornered components for a professional appearance
- **Real-time Question Handling**: Skip questions, submit answers, and get immediate feedback within a single session
- **Session Dashboard**: View all your practice sessions in one place with filtering and search capabilities

---

## Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better code quality
- **Vite** - Fast, next-generation build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **React Router** - Client-side routing for SPA navigation
- **React Hook Form** - Efficient form state management
- **Zod** - TypeScript-first schema validation library
- **Lucide React** - Beautiful, consistent SVG icon library
- **React Toastify** - Toast notifications for user feedback
- **Axios** - HTTP client for API requests
- **date-fns** - Modern date utility library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Lightweight and flexible web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - ODM for MongoDB with schema validation
- **OpenAI SDK** - Integration with OpenAI's GPT-3.5-turbo API
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcrypt** - Secure password hashing
- **dotenv** - Environment variable management

### Database
- **MongoDB** - Cloud-hosted or local MongoDB instance for data persistence

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or Atlas)
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-interview-prep
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
PORT=5000
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. In the root directory, install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user profile (requires auth)

### Sessions
- `GET /api/sessions` - Get all user sessions (requires auth)
- `POST /api/sessions` - Create a new session (requires auth)
- `PUT /api/sessions/:id` - Update a session (requires auth)
- `DELETE /api/sessions/:id` - Delete a session (requires auth)

### AI Features
- `POST /api/ai/generate-questions` - Generate interview questions for a session (requires auth)
- `POST /api/ai/generate-feedback` - Get AI feedback on a user's answer (requires auth)

---

## Architecture

### Frontend Architecture
- **Pages**: Home, Login, Register, Dashboard, Simulator, NotFound
- **Components**: Header, SessionCard, SessionForm, LoadingSpinner
- **State Management**: React hooks (useState, useEffect) and Context API
- **Routing**: React Router v6 with protected routes

### Backend Architecture
- **Routes**: Authentication, Sessions, AI endpoints
- **Models**: User, Session MongoDB schemas
- **Middleware**: JWT authentication, error handling
- **Retry Logic**: Exponential backoff for handling OpenAI rate limits (429 errors)

---

## Deployment

### Deploying to Netlify (Frontend)

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify settings:
   - `VITE_API_URL` - Your backend API URL

### Deploying Backend

The backend can be deployed to services like:
- **Render.com** - Free tier available with MongoDB Atlas
- **Railway.app** - Simple deployment with GitHub integration
- **Heroku** - Popular hosting platform
- **AWS/GCP/Azure** - For production-scale applications

---

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
JWT_SECRET=your_secure_secret_key
OPENAI_API_KEY=sk-your-openai-key
PORT=5000
```

---

## Usage

1. **Sign Up**: Create an account with email and password
2. **Create Session**: Click "New Session" on the Dashboard
3. **Configure Session**: 
   - Enter session title
   - Select job role (auto-generates description)
   - Choose difficulty level
   - Set duration in minutes
4. **Start Interview**: Click the session to begin the interview simulator
5. **Answer Questions**: Read the AI-generated question and type your answer
6. **Get Feedback**: Submit your answer to receive AI-powered feedback
7. **Track Progress**: View all your sessions on the Dashboard

---

## Future Enhancements

- Real-time code editor for coding interview questions
- Video interview recording and playback
- Performance analytics and improvement tracking
- Peer review system for answers
- Integration with LinkedIn for job matching
- Subscription tiers with different question limits
- Mobile app (React Native)

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support

For issues, feature requests, or contributions, please open an issue or pull request on GitHub.

**GitHub Repository**: https://github.com/ishaniroy1/ai-interview-prep
