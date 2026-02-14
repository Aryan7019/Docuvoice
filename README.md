# 🏥 DocuVoice - AI Medical Voice Assistant Platform

<div align="center">

![DocuVoice Banner](https://img.shields.io/badge/DocuVoice-AI%20Medical%20Assistant-blue?style=for-the-badge)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**An intelligent AI-powered medical consultation platform with real-time voice interaction, automated report generation, and multi-specialist support.**

[Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Key Features Explained](#-key-features-explained)
- [What I Learned](#-what-i-learned)
- [Challenges & Solutions](#-challenges--solutions)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**DocuVoice** is a cutting-edge healthcare platform that bridges the gap between patients and AI-powered medical consultations. Built with Next.js 15 and powered by advanced AI technologies, it provides real-time voice interactions with specialized medical AI agents, automatic medical report generation, and comprehensive consultation history tracking.

### Why DocuVoice?

- **Instant Access**: Connect with AI medical specialists 24/7 without waiting
- **Voice-First**: Natural conversation interface using VAPI voice technology
- **Intelligent Reports**: Automated medical report generation using Google Gemini AI
- **Multi-Specialist**: 10 different medical specialties available
- **Secure & Private**: Built with Clerk authentication and secure data handling

---

## ✨ Features

### 🎙️ Real-Time Voice Consultations
- Live voice interaction with AI medical specialists
- Natural language processing for seamless conversations
- Real-time transcription and message display
- Call duration tracking and session management

### 🤖 10 Specialized AI Doctors
1. **General Physician** - Everyday health concerns
2. **Pediatrician** - Children's health (babies to teens)
3. **Dermatologist** - Skin issues and conditions
4. **Psychologist** - Mental health support
5. **Nutritionist** - Diet and weight management
6. **Cardiologist** - Heart health
7. **ENT Specialist** - Ear, nose, and throat
8. **Orthopedic** - Bone and joint issues
9. **Gynecologist** - Women's health
10. **Dentist** - Oral health

### 📊 Automated Medical Reports
- AI-generated consultation summaries
- Structured medical reports with:
  - Chief complaints
  - Symptoms analysis
  - Severity assessment
  - Medication recommendations
  - Follow-up suggestions
- PDF export functionality
- Consultation history tracking

### 🔐 Authentication & Security
- Secure user authentication with Clerk
- Protected routes and API endpoints
- User profile management
- Session-based access control

### 💳 Subscription Management
- Free tier with General Physician access
- Premium subscription for all specialists
- Subscription status tracking
- Upgrade/downgrade functionality

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark mode support
- Smooth animations with Framer Motion
- Interactive 3D globe visualization
- Beautiful gradient effects and glassmorphism

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Animations**: Framer Motion, Motion
- **Icons**: Lucide React, Tabler Icons
- **3D Graphics**: Cobe (Globe visualization)

### Backend & APIs
- **Runtime**: Node.js
- **API Routes**: Next.js API Routes
- **Voice AI**: VAPI (@vapi-ai/web)
- **AI Model**: Google Gemini 2.5 Flash
- **HTTP Client**: Axios

### Database & ORM
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Schema Management**: Drizzle Kit

### Authentication
- **Auth Provider**: Clerk
- **Features**: Sign-in, Sign-up, User management

### Additional Tools
- **PDF Generation**: jsPDF, html2canvas
- **Date Handling**: Moment.js
- **Unique IDs**: UUID
- **Environment**: dotenv

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (Next.js 15 App Router + React 19 + TypeScript)           │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                   Authentication Layer                       │
│              (Clerk - Middleware Protection)                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                     API Routes Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Session API  │  │ Report API   │  │ Doctor API   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ VAPI Voice   │  │ Gemini AI    │  │ PostgreSQL   │     │
│  │ (PlayHT)     │  │ (Reports)    │  │ (Neon)       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Authentication**: Clerk handles sign-in/sign-up
2. **Session Creation**: User selects a specialist → Creates session in DB
3. **Voice Call**: VAPI establishes WebRTC connection with PlayHT voices
4. **Transcription**: Real-time speech-to-text via Deepgram
5. **AI Response**: OpenAI GPT-4 generates medical responses
6. **Report Generation**: Gemini AI analyzes transcript → Structured report
7. **Data Persistence**: Drizzle ORM saves to PostgreSQL

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (Neon recommended)
- Clerk account for authentication
- VAPI account for voice AI
- Google AI Studio account for Gemini API

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/docuvoice.git
cd docuvoice
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials (see [Environment Variables](#-environment-variables))

4. **Set up the database**
```bash
# Generate database schema
npm run db:generate

# Push schema to database
npm run db:push
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# VAPI Voice AI
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key_here
NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID=your_assistant_id_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
```

### How to Get API Keys

#### 1. Neon Database (PostgreSQL)
- Visit [Neon Console](https://console.neon.tech/)
- Create a new project
- Copy the connection string

#### 2. Clerk Authentication
- Go to [Clerk Dashboard](https://dashboard.clerk.com/)
- Create a new application
- Copy the publishable and secret keys from API Keys section

#### 3. VAPI Voice AI
- Sign up at [VAPI](https://vapi.ai/)
- Create a new account
- Get your API key from Settings → API Keys
- Configure PlayHT voices in your VAPI dashboard

#### 4. Google Gemini AI
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Copy the key

---

## 📁 Project Structure

```
docuvoice/
├── app/
│   ├── (routes)/
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── AddNewSessionDialog.tsx
│   │   │   │   ├── ConsultationHistory.tsx
│   │   │   │   ├── DoctorAgentsList.tsx
│   │   │   │   ├── list.tsx              # AI Doctors configuration
│   │   │   │   └── report-dialog.tsx
│   │   │   ├── medical-agent/
│   │   │   │   └── [sessionId]/
│   │   │   │       └── page.tsx          # Voice consultation page
│   │   │   └── page.tsx
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── _components/
│   │   ├── FeatureBentoGrid.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   └── Navbar.tsx
│   ├── api/
│   │   ├── doctor/
│   │   │   └── route.tsx
│   │   ├── medical-report/
│   │   │   └── route.tsx                 # Report generation API
│   │   └── session-chat/
│   │       └── route.tsx                 # Session management API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── config/
│   ├── db.ts                             # Database connection
│   ├── GeminiModel.ts                    # Gemini AI configuration
│   └── schema.ts                         # Database schema
├── lib/
│   ├── subscription.ts                   # Subscription logic
│   └── utils.ts
├── public/
│   └── doctor[1-10].png                  # Doctor avatars
├── .env
├── .env.example
├── drizzle.config.ts
├── middleware.ts                         # Clerk auth middleware
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎯 Key Features Explained

### 1. Voice Consultation System

The voice consultation uses VAPI's WebRTC technology:

```typescript
// Initialize VAPI
const vapi = new Vapi(apiKey);

// Configure AI agent
const config = {
  transcriber: {
    provider: 'deepgram',
    model: 'nova-2',
    language: 'en-US',
  },
  voice: {
    provider: 'playht',
    voiceId: 's3://voice-cloning-zero-shot/...',
  },
  model: {
    provider: 'openai',
    model: 'gpt-4',
    messages: [{ role: 'system', content: agentPrompt }]
  }
};

// Start call
await vapi.start(config);
```

### 2. AI Report Generation

Uses Google Gemini to analyze transcripts:

```typescript
const completion = await gemini.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: [{ role: 'user', parts: [{ text: transcript }] }],
  config: {
    systemInstruction: medicalReportPrompt,
    responseMimeType: "application/json",
  }
});
```

### 3. Database Schema

```typescript
export const SessionChatTable = pgTable('sessionChat', {
  id: serial('id').primaryKey(),
  sessionId: varchar('sessionId').notNull(),
  userId: varchar('userId').notNull(),
  selectedDoctor: json('selectedDoctor'),
  conversation: json('conversation'),
  report: json('report'),
  consultationDuration: integer('consultationDuration'),
  callStartedAt: varchar('callStartedAt'),
  callEndedAt: varchar('callEndedAt'),
  createdOn: varchar('createdOn').notNull(),
});
```

---

## 📚 What I Learned

### Technical Skills

1. **Next.js 15 App Router**
   - Server and client components
   - API routes and route handlers
   - Middleware for authentication
   - Dynamic routing with params

2. **Real-Time Voice AI Integration**
   - WebRTC connections
   - Speech-to-text transcription
   - Text-to-speech synthesis
   - Managing voice call states

3. **AI Model Integration**
   - Google Gemini API for structured outputs
   - OpenAI GPT-4 for conversational AI
   - Prompt engineering for medical contexts
   - JSON schema validation

4. **Database Management**
   - Drizzle ORM with PostgreSQL
   - Schema design for medical data
   - Efficient queries and updates
   - JSON field handling

5. **Authentication & Authorization**
   - Clerk integration
   - Protected routes
   - User session management
   - Role-based access control

### Soft Skills

- **Problem Solving**: Debugging voice connection issues, handling edge cases
- **User Experience**: Designing intuitive medical consultation flows
- **Project Management**: Breaking down complex features into manageable tasks
- **Documentation**: Writing clear, comprehensive documentation

---

## 🚧 Challenges & Solutions

### Challenge 1: Voice Quality & Latency
**Problem**: Initial voice responses had noticeable delays
**Solution**: 
- Optimized VAPI configuration
- Used Deepgram Nova-2 for faster transcription
- Implemented connection state management

### Challenge 2: PlayHT Voice IDs
**Problem**: Generic voice names weren't working with PlayHT
**Solution**:
- Used actual S3 manifest URLs from VAPI dashboard
- Implemented proper voice ID mapping
- Added debugging logs for voice configuration

### Challenge 3: Report Generation Accuracy
**Problem**: AI-generated reports were inconsistent
**Solution**:
- Refined system prompts with specific medical structure
- Used JSON schema enforcement
- Added validation and error handling

### Challenge 4: Real-Time Transcript Display
**Problem**: Messages were duplicating or not updating properly
**Solution**:
- Implemented message state management with `isComplete` flag
- Used `findLastIndex` to update partial transcripts
- Added proper message deduplication logic

### Challenge 5: Database Schema Design
**Problem**: Storing complex medical data efficiently
**Solution**:
- Used JSON fields for flexible data structures
- Separated session metadata from conversation data
- Indexed frequently queried fields

---

## 🔮 Future Enhancements

### Planned Features

- [ ] **Multi-language Support**: Hindi, Spanish, French consultations
- [ ] **Video Consultations**: Add video call capability
- [ ] **Prescription Management**: Digital prescription generation
- [ ] **Appointment Scheduling**: Book follow-up consultations
- [ ] **Health Records**: Upload and manage medical documents
- [ ] **Symptom Checker**: AI-powered symptom analysis tool
- [ ] **Medication Reminders**: Push notifications for medications
- [ ] **Family Accounts**: Manage multiple family member profiles
- [ ] **Insurance Integration**: Connect with insurance providers
- [ ] **Telemedicine**: Connect with real doctors for serious cases

### Technical Improvements

- [ ] Add comprehensive unit and integration tests
- [ ] Implement caching for faster load times
- [ ] Add analytics and monitoring (Vercel Analytics)
- [ ] Optimize bundle size and performance
- [ ] Add progressive web app (PWA) support
- [ ] Implement offline mode for viewing past reports
- [ ] Add WebSocket for real-time updates
- [ ] Enhance security with rate limiting

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

---

## 🙏 Acknowledgments

- [VAPI](https://vapi.ai/) for voice AI technology
- [Google Gemini](https://ai.google.dev/) for AI model
- [Clerk](https://clerk.com/) for authentication
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [Vercel](https://vercel.com/) for hosting platform
- [Radix UI](https://www.radix-ui.com/) for accessible components

---

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Email: your.email@example.com
- Join our Discord community: [Discord Link]

---

<div align="center">

**Made with ❤️ and ☕ by [Your Name]**

⭐ Star this repo if you find it helpful!

</div>
