# 📞 Call Analytics SaaS

A powerful AI-powered call analytics platform built with Next.js 16, Firebase, and NVIDIA AI. Analyze customer service calls with automatic transcription, sentiment analysis, and detailed performance insights.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.6-orange?style=for-the-badge&logo=firebase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Pricing Plans](#-pricing-plans)
- [Deployment](#-deployment)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎙️ **Audio Upload** | Upload call recordings (MP3, WAV, M4A) up to 100MB |
| 📝 **AI Transcription** | Automatic transcription with speaker diarization using ElevenLabs |
| 🎯 **Sentiment Analysis** | Detect customer sentiment (positive/neutral/negative) |
| 📊 **Quality Scoring** | Agent performance metrics and quality scores |
| 📈 **Analytics Dashboard** | Visual charts and trends with Recharts |
| 👥 **Multi-tenant** | Organization-based access with role management |
| 💳 **Payments** | Razorpay integration for subscriptions |
| 🔐 **Authentication** | Secure auth with NextAuth.js and Firebase |

---

## 🏗️ Architecture

### System Overview

```mermaid
graph TB
    subgraph Client["🌐 Client Layer"]
        UI[Next.js Frontend]
        Auth[NextAuth.js]
    end

    subgraph API["⚙️ API Layer"]
        Routes[API Routes]
        Middleware[Auth Middleware]
    end

    subgraph Services["🔧 Services"]
        EL[ElevenLabs<br/>Transcription]
        NV[NVIDIA AI<br/>Analysis]
        RZ[Razorpay<br/>Payments]
    end

    subgraph Storage["💾 Storage Layer"]
        FB[(Firebase<br/>Firestore)]
        FS[(Firebase<br/>Storage)]
        Local[(Local<br/>Fallback)]
    end

    UI --> Auth
    Auth --> Routes
    Routes --> Middleware
    Middleware --> EL
    Middleware --> NV
    Middleware --> RZ
    Middleware --> FB
    Middleware --> FS
    FS -.-> Local
```

### Request Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as API Routes
    participant EL as ElevenLabs
    participant AI as NVIDIA AI
    participant DB as Firestore

    U->>FE: Upload Audio File
    FE->>API: POST /api/upload
    API->>DB: Create Call Record
    API-->>FE: Upload Success

    FE->>API: POST /api/calls/[id]/process
    API->>EL: Transcribe Audio
    EL-->>API: Transcript + Segments
    API->>AI: Analyze Transcript
    AI-->>API: Sentiment + Insights
    API->>DB: Update Call with Analysis
    API-->>FE: Processing Complete
    FE-->>U: Display Results
```

### User Authentication Flow

```mermaid
flowchart LR
    A[User] --> B{Has Account?}
    B -->|No| C[Register]
    B -->|Yes| D[Login]
    C --> E[Create in Firebase Auth]
    E --> F[Create User Doc]
    F --> G[Create Organization]
    D --> H[Verify Credentials]
    H --> I[Generate JWT]
    G --> I
    I --> J[Access Dashboard]
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.7 | React Framework with App Router |
| React | 19.0.0 | UI Library |
| TypeScript | 5.x | Type Safety |
| TailwindCSS | 3.4.1 | Styling |
| Radix UI | Latest | Accessible Components |
| Recharts | 2.15.0 | Data Visualization |
| React Hook Form | 7.68.0 | Form Management |
| Zod | 4.1.13 | Schema Validation |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 16.x | Backend API |
| NextAuth.js | 4.24.13 | Authentication |
| Firebase Admin | 13.6.0 | Server-side Firebase |
| bcryptjs | 3.0.3 | Password Hashing |

### External Services

| Service | Purpose |
|---------|---------|
| Firebase Auth | User Authentication |
| Firebase Firestore | NoSQL Database |
| Firebase Storage | Audio File Storage |
| ElevenLabs | Speech-to-Text Transcription |
| NVIDIA NIM | AI Analysis (Llama 3.1 Nemotron) |
| Razorpay | Payment Processing |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase Project
- ElevenLabs API Key
- NVIDIA NIM API Key
- Razorpay Account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/Yash-Kavaiya/call-analytics.git

# Navigate to project
cd call-analytics/call-analytics

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# AI Services
ELEVENLABS_API_KEY=your-elevenlabs-api-key
NVIDIA_API_KEY=your-nvidia-nim-api-key

# Payments (Razorpay)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_URL` | ✅ | Application URL |
| `NEXTAUTH_SECRET` | ✅ | Secret for JWT signing |
| `NEXT_PUBLIC_FIREBASE_*` | ✅ | Firebase client configuration |
| `FIREBASE_ADMIN_*` | ✅ | Firebase Admin SDK credentials |
| `ELEVENLABS_API_KEY` | ✅ | ElevenLabs transcription API |
| `NVIDIA_API_KEY` | ✅ | NVIDIA NIM for AI analysis |
| `RAZORPAY_KEY_ID` | ⚠️ | Razorpay (for payments) |
| `RAZORPAY_KEY_SECRET` | ⚠️ | Razorpay secret key |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/[...nextauth]` | NextAuth.js handlers |
| `POST` | `/api/auth/forgot-password` | Password reset |

### Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/calls` | List all calls |
| `POST` | `/api/calls` | Create new call record |
| `GET` | `/api/calls/[id]` | Get call details |
| `POST` | `/api/calls/[id]/process` | Process call (transcribe + analyze) |

### Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload audio file |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/summary` | Get analytics summary |
| `GET` | `/api/analytics/trends` | Get trend data |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reports/[id]` | Get call report |
| `GET` | `/api/reports/export` | Export reports |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payments/create-order` | Create Razorpay order |
| `POST` | `/api/payments/verify` | Verify payment |
| `GET` | `/api/payments/subscription` | Get subscription status |

### Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/PUT` | `/api/settings/profile` | User profile |
| `PUT` | `/api/settings/password` | Change password |
| `GET/PUT` | `/api/settings/organization` | Organization settings |

---

## 🗄️ Database Schema

### Firestore Collections

```mermaid
erDiagram
    USERS ||--o{ ORGANIZATIONS : belongs_to
    ORGANIZATIONS ||--o{ CALLS : contains
    ORGANIZATIONS ||--o{ MEMBERS : has

    USERS {
        string id PK
        string email
        string name
        string avatar
        string role
        string organizationId FK
        timestamp createdAt
        timestamp updatedAt
    }

    ORGANIZATIONS {
        string id PK
        string name
        string plan
        string ownerId FK
        number callsThisMonth
        number callsLimit
        string stripeCustomerId
        timestamp createdAt
        timestamp updatedAt
    }

    CALLS {
        string id PK
        string fileName
        number fileSize
        string status
        string audioUrl
        object transcript
        string sentiment
        number sentimentScore
        number qualityScore
        string summary
        array topics
        array keywords
        timestamp createdAt
        timestamp processedAt
    }
```

### Call Status Flow

```mermaid
stateDiagram-v2
    [*] --> uploading: File Upload Started
    uploading --> processing: Upload Complete
    processing --> transcribing: Processing Started
    transcribing --> analyzing: Transcription Done
    analyzing --> completed: Analysis Done
    
    uploading --> failed: Upload Error
    processing --> failed: Process Error
    transcribing --> failed: Transcription Error
    analyzing --> failed: Analysis Error
    
    completed --> [*]
    failed --> [*]
```

---

## 💰 Pricing Plans

| Feature | Starter (Free) | Professional | Enterprise |
|---------|----------------|--------------|------------|
| **Price** | ₹0/month | ₹749/month | ₹16,599/month |
| **Calls/Month** | 10 | 100 | Unlimited |
| **Team Members** | 1 | 5 | Unlimited |
| **Data Retention** | 30 days | 90 days | Unlimited |
| **AI Analysis** | ✅ | ✅ | ✅ |
| **Transcription** | ✅ | ✅ | ✅ |
| **Export Reports** | ❌ | ✅ | ✅ |
| **Priority Support** | ❌ | ✅ | ✅ |
| **Custom Integration** | ❌ | ❌ | ✅ |

---

## 📁 Project Structure

```
call-analytics/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth pages (login, register)
│   │   ├── api/                 # API routes
│   │   │   ├── analytics/       # Analytics endpoints
│   │   │   ├── auth/            # Auth endpoints
│   │   │   ├── calls/           # Call management
│   │   │   ├── payments/        # Razorpay integration
│   │   │   ├── reports/         # Report generation
│   │   │   ├── settings/        # User/org settings
│   │   │   └── upload/          # File uploads
│   │   ├── dashboard/           # Dashboard pages
│   │   │   ├── analytics/       # Analytics view
│   │   │   ├── billing/         # Subscription management
│   │   │   ├── calls/           # Call list & details
│   │   │   ├── files/           # File management
│   │   │   ├── reports/         # Reports view
│   │   │   ├── settings/        # Settings page
│   │   │   └── users/           # User management
│   │   └── components/          # App-specific components
│   ├── components/              # Shared components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── providers/           # Context providers
│   │   └── upload/              # Upload components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility libraries
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── elevenlabs.ts        # Transcription service
│   │   ├── firebase.ts          # Firebase client
│   │   ├── firebase-admin.ts    # Firebase Admin SDK
│   │   ├── gemini.ts            # AI analysis (NVIDIA)
│   │   ├── razorpay.ts          # Payment processing
│   │   └── storage-server.ts    # Server-side storage
│   └── types/                   # TypeScript definitions
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── firebase.json                # Firebase configuration
├── firestore.rules              # Firestore security rules
├── storage.rules                # Storage security rules
└── package.json                 # Dependencies
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup for Production

1. Set all environment variables in your hosting platform
2. Ensure Firebase security rules are deployed
3. Configure CORS for your domain in Firebase
4. Set up Razorpay webhooks for payment notifications

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Yash Kavaiya**

- GitHub: [@Yash-Kavaiya](https://github.com/Yash-Kavaiya)
- Email: yash.kavaiya3@gmail.com

---

<p align="center">
  Made with ❤️ using Next.js and AI
</p>
