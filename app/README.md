<div align="center">
  <h1>⚡ Devora AI</h1>
  <p><strong>A Minimalist, High-Performance AI Chat Interface powered by Google Gemini API</strong></p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini API" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

## 📖 Overview

**Devora AI** is a sleek, modern, and highly responsive web-based AI assistant. Built with the latest **Next.js App Router** and styled with **Tailwind CSS**, it offers a brutalist-inspired, clean user interface designed for maximum readability and speed. 

Under the hood, it harnesses the power of the **Google Gemini AI model** to provide intelligent, context-aware conversations, code explanations, and debugging assistance.

## ✨ Key Features

- 🧠 **Google Gemini Powered**: Deep integration with `@google/genai` SDK for blazing-fast AI responses.
- 💻 **Developer-Ready Formatting**: Full support for Markdown and syntax highlighting (via `remark-gfm` and `rehype-highlight`) to render code blocks beautifully.
- 📱 **Fully Responsive**: Carefully crafted mobile-first design that looks great on any screen size.
- 🎨 **Minimalist Aesthetic**: High-contrast, clean brutalist UI that eliminates distractions and focuses on the chat content.
- ⚡ **Optimized Performance**: Leverages Next.js server-side streaming for real-time word-by-word response rendering.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Engine**: [Google Gemini API](https://aistudio.google.com/)
- **Markdown Rendering**: `react-markdown`, `remark-gfm`, `rehype-highlight`

## 🚀 Getting Started

Follow these steps to set up and run the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18.x or later)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/G-than12/devora-ai.git
cd devora-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env` or `.env.local` file in the root directory and add your Google Gemini API key:

```env
# Get your API key from: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Set this if running locally
APP_URL=http://localhost:3000
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## 📂 Project Structure

```text
devora-ai/
├── app/
│   ├── api/chat/       # Gemini API streaming routes
│   ├── chat/           # Chat UI layouts and pages
│   ├── globals.css     # Global styles & Tailwind configuration
│   ├── layout.tsx      # Root application layout
│   └── page.tsx        # Landing/Home page
├── lib/
│   └── prompt.ts       # AI System prompt engineering
├── public/             # Static assets
├── .env.example        # Example environment variables
└── package.json        # Project dependencies
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](https://github.com/G-than12/devora-ai/issues).

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <b>Built with ☕ by <a href="https://github.com/G-than12">Gathan Hilabi</a></b>
</div>
