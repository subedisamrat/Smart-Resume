# RESUMAI - AI-Powered Resume Analyzer

An intelligent resume analysis platform that provides actionable feedback to help you optimize your resume and improve your job applications.

## Features

- **AI Resume Analysis** - Upload your resume and receive detailed insights and recommendations
- **PDF Support** - Analyze resumes in PDF format with automatic text extraction
- **Secure Storage** - Manage multiple resumes securely with user authentication
- **Real-time Feedback** - Instant analysis results with actionable suggestions
- **Modern Interface** - Clean, responsive UI built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React 19, React Router 7, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **State Management**: Zustand
- **PDF Processing**: PDF.js
- **Backend**: Node.js with React Router
- **Authentication**: Puter.com

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm start
```

## Docker Deployment

```bash
docker build -t resumai .
docker run -p 3000:3000 resumai
```

## Project Structure

- `app/` - Application source code
  - `routes/` - Page routes
  - `components/` - React components
  - `lib/` - Utilities and services
- `public/` - Static assets

## License

MIT
