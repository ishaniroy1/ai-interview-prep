# AI Interview Prep Platform

## Project Overview

AI Interview Prep is a web-based interview prep platform that helps job seekers prepare tech interviews in multiple roles. We integrated OpenAI's API to generate realistic interview questions and provide AI feedback on a user's responses. Users can create personalized interview sessions and practice with questions tailored to their target job role and difficulty level. No matter your role or skill level, this platform provides a simulated interview experience.


## Target Audience
Primarily college-aged students with little to no interview experience. However, this tool is accessible to all job seekers as it can be tailored for different roles and skill levels.


## Features

- **Role-specific options**: Select from 10+ tech roles
    - Frontend Developer, Backend Developer, Full-Stack Developer, UX/UI Designer, Product Manager, Data Scientist, Data Engineer, DevOps Engineer, QA Engineer, and Mobile App Developer
- **AI integration**: Uses OpenAI API to generate realistic interview questions based on role, difficulty level, and session duration
- Get detailed feedback on your answers with suggestions for improvement
- **Accessible for all skill levels**: Practice with beginner, intermediate, or Advanced difficulty questions to match your skill level
- **Flexibility**: Skip questions, submit answers, and get immediate feedback within a single session
- **User authentication**: Secure JWT-based authentication system with user registration and login
- **Dashboard**: View, filter, and manage interview practice sessions on your Dashboard


## Tech Stack

**Frontend**: React, TypeScript, Vite, Tailwind CSS

**Backend**: Node.js, Express.js, MongoDB, OpenAI API


## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or Atlas)
- OpenAI API key

### Clone the Repository
```bash
git clone https://github.com/ishaniroy1/ai-interview-prep.git
cd ai-interview-prep
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-interview-prep
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=sk-your-openai-api-key
PORT=5000
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. In the root directory, install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

5. To build for production:
```bash
npm run build
```


## Deployment

Used Render to deploy the backend and Netlify to deploy the frontend.

Frontend URL: https://web-dev-interview-prep.netlify.app/

Backend URL: https://ai-interview-prep-backend-iu4j.onrender.com


## Screenshots

### 1. Login & Registration
![Login Page](https://raw.githubusercontent.com/ishaniroy1/ai-interview-prep/master/screenshots/login.png)

Users can securely create an account or log in with email and password. JWT authentication ensures secure session management.

### 2. Dashboard
![Dashboard](https://raw.githubusercontent.com/ishaniroy1/ai-interview-prep/master/screenshots/dashboard.png)

View all your practice interview sessions, filter by difficulty level, and manage your sessions with edit and delete options.

### 3. Interview Session
![Interview Simulator](https://raw.githubusercontent.com/ishaniroy1/ai-interview-prep/master/screenshots/session.png)

Answer AI-generated interview questions in real-time, skip questions if needed, and receive AI-powered feedback on your responses.


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


## How to Use

1. **Sign Up**: Create an account with email and password
2. **Create Session**: Click "New Session" on the Dashboard
   - Enter a session title
   - Select your target job role (description auto-generates)
   - Choose difficulty level (Beginner, Intermediate, Advanced)
   - Set session duration in minutes
3. **Start Interview**: Click on a session to begin the interview simulator
4. **Answer Questions**: Read the AI-generated question and type your response
5. **Get Feedback**: Submit your answer to receive AI-powered feedback with suggestions
6. **Track Progress**: View all completed sessions on your Dashboard with performance history


## Future Enhancements

- Real-time code editor for technical coding interviews
- Audio interview recording and playback
- Performance analytics dashboard with improvement tracking
- Subscription tiers with question limits