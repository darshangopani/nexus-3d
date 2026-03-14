<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  
  # 🚀 Nexus-3D v2.0
  **The Ultimate AI-Powered Academic Intelligence Platform**

  [Explore Platform](https://ai.studio/apps/0edd104f-6b41-4031-b3b0-0d04222af5a1) • [Report Bug](https://github.com/darshangopani/nexus-3d/issues) • [Request Feature](https://github.com/darshangopani/nexus-3d/issues)
</div>

---

## 🌟 Overview
Nexus-3D is a next-generation education platform designed to streamline academic research, document analysis, and test preparation through the power of Google Gemini AI and Supabase.

### ⚡ Key Features (v2.0)
- **🧠 Genius Logic Engine**: Multi-mode search (Concept, University, PDF) with simplified, high-quality AI explanations.
- **🛰️ Scout Agent**: Real-time URL analysis. Paste a resource link and get difficulty ratings, source intel, and key topic breakdown instantly.
- **📝 Interactive Mock Tests**: Generate rigorous MCQs and **"Programizer"** coding challenges with automatic grading and "Scout Intel" feedback.
- **🛡️ Supabase Integration**: Robust authentication and real-time history persistence.
- **📱 Progressive UI**: Ultra-premium aesthetics with glassmorphism, animated gradients, and responsive layouts.
- **💸 Monetization Ready**: Fully integrated with Adsterra (Banner, Popunder, Social Bar).

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
