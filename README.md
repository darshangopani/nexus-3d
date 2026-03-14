<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  
  # 🚀 Nexus-3D v3.0 (Open Source)
**The Ultimate AI-Powered Academic Intelligence & Collaboration Platform**

[Explore Platform](http://localhost:5173) • [Report Bug](https://github.com/darshangopani/nexus-3d/issues) • [Request Feature](https://github.com/darshangopani/nexus-3d/issues)
</div>

---

## 🌟 Overview
Nexus-3D is a next-generation education platform designed to streamline academic research, document analysis, and test preparation. **As of v3.0, the platform is fully open-source and free for all students.**

### ⚡ Mega Enhancements (v3.0.0)
- **🗂️ AI Flashcard Lab**: Automatic spaced repetition (Leitner System) deck generation.
- **🖥️ Live Code Sandbox**: Execute Python, JS, C++, and Java directly within mock tests (Piston API).
- **🎙️ Voice-to-Logic**: Hands-free search with dictation and integrated AI Text-to-Speech (TTS).
- **📊 Visual Concept Mapper**: Dynamic mind-maps and flowcharts powered by Mermaid.js.
- **🤝 Collaborative Study Pods**: Real-time room-based study sharing via Supabase Realtime.
- **📥 AI Citation Pro**: One-click APA/BibTeX citation generator for academic resources.
- **🛰️ Nexus Scout Extension v2**: Sidebar-injected intelligence for academic websites.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Motion (Framer)
- **Backend/DB**: Supabase (PostgreSQL, Auth, RLS)
- **AI Engine**: Google Gemini API (Flash 2.5)
- **Documentation**: Adobe PDF Services API, React Markdown
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase Project
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/darshangopani/nexus-3d.git
   cd nexus-3d
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY="your_gemini_key"
   VITE_SUPABASE_URL="your_supabase_url"
   VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
   VITE_ADSTERRA_KEY="your_adsterra_key"
   VITE_ADOBE_CLIENT_ID="your_adobe_id"
   VITE_ADOBE_CLIENT_SECRET="your_adobe_secret"
   ```

4. **Database Initialization**
   Apply the schema found in `supabase_schema.sql` to your Supabase SQL Editor to initialize tables and RLS policies.

5. **Run Locally**
   ```bash
   npm run dev
   ```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Built with ❤️ by the Nexus-3D Team
</div>
