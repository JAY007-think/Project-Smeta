# Smart Multimodal Emergency Triage AI

![Project Banner](https://via.placeholder.com/1200x300?text=Smart+Emergency+Triage+AI)

## 🏆 HackNexus 2.O
This project was developed during **HackNexus 2.O**, organized by **Arya College of Engineering, Jaipur**.

### 👥 Team AlgoArmy
- **Jay Soni** (Leader / Full-Stack Engineer / DevOps) - [GitHub: JAY007-think](https://github.com/JAY007-think)
- **Karan Suthar** (Backend / AI Integration)
- **Krishna Jangid** (Frontend / UI/UX)
- **Jasmeet Kaur** (Research / Presentation)

---

## 📖 Project Overview
Smart Multimodal Emergency Triage AI is a production-grade web application designed to assist medical professionals and first responders in prioritizing emergency cases using advanced AI analysis. It leverages a modern tech stack to provide reliable, scalable, and secure triage recommendations.

### ✨ Key Features
- **AI-Powered Triage**: Uses Google Gemini API for intelligent multimodal analysis of patient data and images.
- **Real-Time Alerts**: Instant notifications for critical emergencies.
- **Secure Authentication**: JWT-based secure access for medical staff.
- **Patient History Management**: Comprehensive tracking of patient records and triage outcomes.
- **Responsive UI/UX**: Modern, intuitive dashboard built with Next.js and Tailwind CSS.
- **Scalable Architecture**: Dockerized microservices ready for cloud deployment.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS & Shadcn/UI
- **State Management**: React Hooks & Context
- **Animation**: Framer Motion

### Backend
- **Runtime**: Node.js & Express
- **AI Integration**: Google Generative AI (Gemini)
- **Database**: Supabase (PostgreSQL)
- **Security**: JWT Authentication, Rate Limiting, CORS, Bcrypt

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Version Control**: Git & GitHub

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- Supabase Account
- Google Gemini API Key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/JAY007-think/Project-Smeta
   cd Smeta
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your credentials
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env.local
   # Update .env.local
   npm run dev
   ```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_secure_jwt_secret
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📚 API Documentation
For detailed API documentation, please refer to the [API.md](./docs/API.md) guide in the `docs` directory.
Key endpoints include:
- `POST /api/analyze` - Analyze patient data
- `GET /api/patients` - Retrieve patient list
- `POST /api/alerts` - Create a new alert
- `GET /api/history` - Get triage history

---

## 📦 Deployment Steps

### Deploying with Docker Compose (VPS / Server)
1. Ensure Docker is installed on your server.
2. Clone the repo and navigate to the root directory.
3. Create `.env` files for both frontend and backend.
4. Run:
   ```bash
   docker-compose up -d --build
   ```

### Managed Hosting
- **Frontend**: Deploy to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/) by connecting the GitHub repository.
- **Backend**: Deploy to [Render](https://render.com/) or [Railway](https://railway.app/) using the `Dockerfile` in the `backend` folder.
- **Database**: Use Supabase's managed PostgreSQL.

---

## 🔮 Future Improvements (Startup Level)
- **WebSockets / Socket.io**: For truly real-time updates and live chat between dispatchers and responders.
- **Mobile Application**: React Native or Flutter app for paramedics in the field.
- **HIPAA Compliance**: Enhance data security, encryption at rest, and audit logging to meet medical standards.
- **Advanced Analytics**: Dashboard with predictive insights on emergency trends.
- **EHR Integration**: Connect with standard hospital Electronic Health Record systems via HL7/FHIR.

---

*Built with ❤️ by AlgoArmy at HackNexus 2.O*
