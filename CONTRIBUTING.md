# 🤝 Contributing to Jeepedia

Welcome to *Jeepedia*, an open-source platform that makes **JEE counselling** simple, visual, and actually helpful.  
We’re thrilled that you want to contribute! This guide will help you get started and contribute effectively.

---

## 📑 Table of Contents

- [Getting Started](#-getting-started)
- [Mandatory Fork & Star](#-mandatory-fork--star)
- [How to Contribute](#-how-to-contribute)
- [Coding Guidelines](#-coding-guidelines)
- [Testing](#-testing)
- [Code Review Process](#-code-review-process)
- [Documentation](#-documentation)
- [Reporting Bugs & Requesting Features](#-reporting-bugs--requesting-features)
- [Good First Issues](#-good-first-issues)
- [Code of Conduct](#-code-of-conduct)
- [Need Help?](#-need-help)
- [Recognition](#-recognition)

---

## 🌟 Getting Started

### Prerequisites

Make sure you have the following installed:
- Git
- Node.js v18+ and npm
- A code editor (VS Code recommended)

### Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Node.js + Express
- Database: NeonDB (PostgreSQL)
- Deployment/Hosting: Vercel

---

## ⚠ Mandatory Fork & Star

Before contributing, you *must* complete these steps:

1. *Fork the Repository*  
   - Click the *Fork* button at the top-right corner of the Jeepedia GitHub page.  
   - This creates your *own copy* of the repository under your GitHub account.  

2. *Star the Repository*  
   - Click the *Star* button at the top-right corner of the Jeepedia GitHub page.  
   - Starring the project *supports the project* and shows your interest as a contributor.  

> ✅ You *cannot contribute directly* without forking the repository first.  
> ✅ Always make your changes in your forked repository, not the original.

---

### Development Setup

1. *Clone Your Fork*
    ```bash
    git clone https://github.com/YOUR_USERNAME/frontend.git
    cd frontend
    ```
    

2. *Install Dependencies*
    ```bash
    npm install
    ```
    

3. *Set Up Environment Variables*  
   Create a .env file in the root directory (if applicable) and add any required keys:
    ```
    DATABASE_URL=your_database_url
    NEXT_PUBLIC_API_KEY=your_api_key
    ```
    
   > ⚠ Never commit your API keys or secrets to the repository.

4. *Run Locally*
    ```bash
    npm run dev
    ```

    The app will be available at: http://localhost:3000

---

## 🔄 How to Contribute

1. *Pick an Issue*  
   Browse GitHub issues. Comment on one you want to work on and wait for it to be assigned.

2. *Create a Branch*
    ```bash
    git checkout main
    git pull upstream main
    git checkout -b feature/your-feature-name
    ```
    

3. *Make Changes*  
   Implement your feature or fix the bug. Test it locally.

4. *Commit Changes*  
   Use clear, descriptive commit messages:
    ```bash
    git add .
    git commit -m "feat: add college comparison filter"
    ```
    

5. *Push and Open a Pull Request*
    ```bash
    git push origin feature/your-feature-name
    ```
    
   Open a PR to the main branch of the original Jeepedia repository.

---

## 📝 Coding Guidelines

- Use functional React components with hooks.  
- Prefer Tailwind CSS utility classes over inline styles.  
- Write clean, readable code with proper comments for complex logic.  
- Validate user input on both frontend and backend.

---

## 🧪 Testing

Before submitting a PR, ensure:
- The app builds successfully (npm run build).  
- UI is responsive on desktop and mobile.  
- Feature works as intended without errors.  
- Console has no warnings.

---

## 🔍 Code Review Process

All pull requests are reviewed by a project maintainer. Feedback may include code quality, clarity, and security suggestions. Address comments by pushing new commits to the same branch.

---

## 📖 Documentation

- Update README.md if your changes add or modify features.  
- Include inline comments for complex or non-obvious code.

---

## 💡 Reporting Bugs & Requesting Features

Use GitHub Issues with the appropriate templates for:
- Bug reports  
- Feature requests

---

## 🚀 Good First Issues

We tag beginner-friendly issues with good first issue. These may include:
- Fixing typos in documentation  
- Improving UI styling  
- Adding small utility functions

---

## 📜 Code of Conduct

We enforce a strict Code of Conduct to ensure a safe and inclusive environment. All contributors are expected to be respectful, use inclusive language, and provide constructive feedback.

---

## ❓ Need Help?

Check existing documentation and issues first. If you’re still stuck, open a "question" issue describing your problem clearly.

---

## 🎉 Recognition

We appreciate every contribution! Contributors will receive:
- Leaderboard Recognition: Your name on the project contributors leaderboard  
- Contributors List: Displayed in the Jeepedia repository  

---

🙏 Thank you for contributing to Jeepedia! Your efforts help make JEE counselling simpler, more transparent, and more helpful for thousands of aspirants. Together, we create a brighter, informed future for every student.
