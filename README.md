<div align="center">
  <!-- Replace the URL below with your actual logo if you have one -->
  <div style="width: 80px; height: 80px; background-color: #4f46e5; margin: 0 auto 20px;"></div>
  <h1>Devora AI</h1>
  <p><strong>A lightning-fast, distraction-free AI coding assistant tailored for developers.</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Powered by Gemini](https://img.shields.io/badge/Powered_by-Google_Gemini-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
</div>

<hr />

## 🚀 Overview

**Devora AI** is a minimalist, highly responsive AI chatbot designed specifically for software developers, IT students, and tech enthusiasts. Powered by the cutting-edge **Google Gemini API**, it provides instant, accurate solutions for coding, debugging, and understanding complex technical concepts.

Built with a brutalist-inspired, distraction-free user interface, Devora AI eliminates visual noise so you can focus entirely on problem-solving and building great software.

## 📸 Preview

> **Note:** To add your own screenshot, take a screenshot of the app, place it in an `assets` folder, and update the image path below.

<div align="center">
  <img src="https://via.placeholder.com/1200x600/f8fafc/0f172a?text=Devora+AI+-+Dashboard+Screenshot+Placeholder" alt="Devora AI Dashboard Preview" style="border: 2px solid #000; box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);" />
</div>

## ✨ Key Features

- **🧠 Smart Debugging:** Paste your error logs and get instant, context-aware fixes and explanations.
- **📚 Concept Explanation:** Break down complex programming paradigms into easy-to-digest logic.
- **💻 Rich Code Formatting:** Full Markdown rendering with syntax highlighting (GitHub Dark theme) for readable code blocks.
- **⚡ Distraction-Free UI:** A striking, brutalist UI design featuring high-contrast borders and solid shadows for maximum readability.
- **💾 Local Persistence:** Your chat history is saved securely in your browser using Zustand state management.
- **📱 Fully Responsive:** Works flawlessly across desktop monitors and mobile devices without layout breakage.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Markdown & Code:** `react-markdown`, `remark-gfm`, `rehype-highlight`
- **AI Model:** Google Gemini API (`@google/genai`)

---

## 🚦 Getting Started (Local Development)

Follow these instructions to set up Devora AI on your local machine.

### 1. Prerequisites
- **Node.js** (v18.x or higher recommended)
- **NPM** (Node Package Manager)
- A **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/))

### 2. Installation

Extract the project ZIP file and navigate into the project directory using your terminal:

```bash
cd devora-ai
```

Install the required dependencies:

```bash
npm install
```

> ⚠️ **CRITICAL WARNING:**
> If you see a message about "vulnerabilities" after running `npm install`, **DO NOT run `npm audit fix --force`**. Doing so will forcefully upgrade the Next.js compiler to Turbopack and break the application. The vulnerabilities reported are standard for development environments and are safe to ignore for local usage.

### 3. Windows Compatibility Fixes (Optional but Recommended)
Tailwind CSS v4 uses native Rust bindings that sometimes fail to download automatically on Windows OS. If you are on Windows, run this command to prevent `lightningcss` or `oxide` native binding errors:

```bash
npm install lightningcss-win32-x64-msvc @tailwindcss/oxide-win32-x64-msvc --save-dev
```

### 4. Environment Variables
Create a new file named `.env` in the root directory (you can copy `.env.example`). Add your Gemini API Key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 5. Start the Development Server
Run the following command to start the application:

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000). You should see the Devora AI interface ready to use!

---

## 📁 Project Structure

```text
devora-ai/
├── app/
│   ├── api/chat/       # Gemini API backend route
│   ├── chat/           # Chat interface pages and layouts
│   ├── globals.css     # Global Tailwind CSS styles
│   └── layout.tsx      # Root application layout
├── components/         # Reusable UI components (Sidebar, Buttons)
├── store/              # Zustand state management (useChatStore)
├── public/             # Static assets
└── .env.example        # Example environment variables
```

## 📜 License

This project is open-source and free to use. Build something awesome!
