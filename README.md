# Club 40 Website (Coop Alliance) 🤝

A full-stack web application built for the **Coop Alliance (সহযোগ জোট - ৪০টি ক্লাব)**. It helps manage clubs, events, volunteers, and provides a platform for members to interact.

## 🚀 Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (Mongoose)

## 📁 Folder Structure
- `/src` - Next.js frontend application (Pages, Components, Contexts).
- `/server` - Express.js backend application and API routes.

## ⚙️ How to Run Locally

### 1. Start the Backend Server
```bash
cd server
npm install
npm start
```
*The backend server will run on http://localhost:5000*

### 2. Start the Next.js Frontend
Open a new terminal window at the root folder:
```bash
npm install
npm run dev
```
*The frontend will run on http://localhost:3000*

## 🌍 Deployment
- **Frontend**: Designed to be deployed easily on [Vercel](https://vercel.com/) or GitHub Pages (via GitHub Actions).
- **Backend**: Can be deployed on Render, Railway, or Heroku.

## 📝 Features
- Multi-language support (Bangla & English).
- Dark/Light mode theme toggle.
- Secure authentication system (JWT).
- Admin dashboard to manage clubs and members.
- Public club directory and member profiles.
