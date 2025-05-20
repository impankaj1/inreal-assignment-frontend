# InReal Job Portal

A full-stack job portal application built with Next.js, TypeScript, and MongoDB. This application allows users to browse jobs, apply for positions, and manage their applications, while employers can post and manage job listings.

## Live Demo

Check out the live application: [InReal Job Portal](https://inreal-assignment-frontend.vercel.app/)

> Note: The frontend is deployed on Vercel and the backend is deployed on Railway.

## Setup Instructions

### Frontend Setup

1. Clone the frontend repository:

```bash
git clone https://github.com/your-username/inreal-assignment-frontend.git
cd inreal-assignment-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment file and configure it:

```bash
cp .env.example .env
```

Configure the following variables in your `.env` file:

- `NEXT_PUBLIC_BACKEND_URL`: Your backend API URL

### Backend Setup

1. Clone the backend repository:

```bash
git clone https://github.com/impankaj1/inreal-assignment-backend.git
cd inreal-assignment-backend
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment file and configure it:

```bash
cp .env.example .env
```

Configure the following variables in your `.env` file:

- `JWT_SECRET`: Secret key for JWT token generation
- `REFRESH_SECRET`: Secret key for refresh token generation
- `OPENAI_KEY`: Your OpenAI API key
- `PORT`: Backend server port (default: 5000)
- `MONGO_URI`: MongoDB connection string

4. (Optional) Seed the database with initial data:

```bash
npx ts-node src/seed.ts
```

## API Documentation

### Authentication Endpoints

- `POST /auth/signup`: Register a new user
- `POST /auth/login`: Login user
- `POST /auth/logout`: Logout user
- `GET /auth/refresh`: Refresh access token

### Job Endpoints

- `GET /jobs`: Get all jobs
- `POST /jobs`: Create a new job (Admin only)
- `GET /jobs/:id`: Get job by ID
- `PUT /jobs/:id`: Update job (Admin only)
- `DELETE /jobs/:id`: Delete job (Admin only)

### User Endpoints

- `GET /users/:id`: Get user profile
- `PUT /users/:id`: Update user profile

## Code Architecture Overview

### Frontend Architecture

- **Pages**: Next.js pages for different routes
- **Components**: Reusable UI components
- **Store**: Zustand for state management
- **API**: Axios instance for API calls
- **Types**: TypeScript interfaces and types
- **Utils**: Helper functions and constants

### Backend Architecture

- **Controllers**: Request handlers
- **Models**: MongoDB schemas
- **Routes**: API route definitions
- **Middleware**: Authentication and validation
- **Services**: Business logic
- **Utils**: Helper functions

## AI Integration

The application uses OpenAI's API for:

- Job description analysis
- Skill matching
- Resume parsing
- Job recommendations

### Prompt Design

The AI prompts are designed to:

1. Extract key information from job descriptions
2. Match user skills with job requirements
3. Generate personalized job recommendations
4. Analyze and parse resume content

## Trade-offs and Assumptions

### Trade-offs

1. **State Management**: Using Zustand instead of Redux for simpler state management
2. **API Calls**: Direct API calls instead of using a service layer for simplicity
3. **Authentication**: JWT-based auth with refresh tokens for security vs simplicity

### Assumptions

1. Users have basic internet connectivity
2. MongoDB is the primary database
3. OpenAI API is available and accessible
4. Users have modern browsers with JavaScript enabled

## Features

- User authentication and authorization
- Job posting and management
- Job search and filtering
- User profile management
- Application tracking
- AI-powered job matching
- Responsive design

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Zustand
- **Backend**: Node.js, Express, TypeScript, MongoDB
- **AI**: OpenAI API
- **Authentication**: JWT
- **Styling**: Tailwind CSS, Shadcn UI

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
