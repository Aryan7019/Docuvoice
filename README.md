# 🏥 DocuVoice - AI Medical Voice Assistant Platform

<div align="center">

![DocuVoice Banner](https://img.shields.io/badge/DocuVoice-AI%20Medical%20Assistant-blue?style=for-the-badge)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

**An intelligent AI-powered medical consultation platform with real-time voice interaction, automated report generation, and multi-specialist support.**

[Live Demo](https://docuvoice.vercel.app/)

</div>

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

---


## 🙏 Acknowledgments

- [VAPI](https://vapi.ai/) for voice AI technology
- [Google Gemini](https://ai.google.dev/) for AI model
- [Clerk](https://clerk.com/) for authentication
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [Vercel](https://vercel.com/) for hosting platform
- [Radix UI](https://www.radix-ui.com/) for accessible components

---


**Made with ❤️ and ☕ by Aryan Mittal**

⭐ Star this repo if you find it helpful!

</div>
