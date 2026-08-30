# Deployment Guide

This project is split into:
- Backend: Node.js + Express + MongoDB
- Frontend: Vite + React

We will deploy:
- Backend on Render
- Frontend on Vercel

---

## 1) Prepare the repository for Git

From the project root:

```bash
git init
git branch -M main
git add .
git commit -m "Initial project setup"
```

If you already have a remote repository:

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

## 2) Backend deployment on Render

### Create the Render service
1. Go to https://render.com
2. Click New + > Web Service
3. Connect your GitHub repository
4. Select the project repo
5. Set the service settings:
   - Name: your-project-backend
   - Root Directory: `server`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

### Environment variables in Render
Add these under Environment:

```env
PORT=10000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Important notes
- Your Render backend URL will look like:
  `https://your-backend-name.onrender.com`
- The frontend will call this URL from the browser using `VITE_API_URL`

---

## 3) Frontend deployment on Vercel

### Import project into Vercel
1. Go to https://vercel.com
2. Click Add New Project
3. Import your GitHub repo
4. Set the project root to the repo root
5. Framework: Vite
6. Build Command: `npm install && npm run build` from root or use project settings if necessary

### Vercel environment variables
Add this environment variable:

```env
VITE_API_URL=https://your-backend-name.onrender.com
```

### Vercel build settings
If Vercel does not auto-detect correctly, use:
- Install Command: `npm install`
- Build Command: `npm run build:client`
- Output Directory: `client/dist`

---

## 4) Frontend API base URL setup
The frontend is already set to use:

```js
import.meta.env.VITE_API_URL || '/api'
```

This means:
- Local development: it uses the Vite dev proxy
- Production: it uses the value from Vercel environment variables

So in production, set `VITE_API_URL` to the Render backend URL.

---

## 5) MongoDB setup
Use MongoDB Atlas for production. Create a cluster and get the connection string.

Example:

```env
MONGO_URI=mongodb+srv://yourUser:yourPassword@cluster0.xxxxx.mongodb.net/college-complaint-db?retryWrites=true&w=majority
```

If you are using local MongoDB for testing, keep:

```env
MONGO_URI=mongodb://127.0.0.1:27017/college-complaint-db
```

---

## 6) Final push to GitHub

After your project is ready, run:

```bash
git add .
git commit -m "Prepare project for deployment"
git push origin main
```

Then connect the repos to Render and Vercel and deploy.

---

## 7) After deployment checklist

- Backend renders successfully
- Health route works:
  `https://your-backend-name.onrender.com/api/health`
- Frontend loads without API errors
- Login/Register works
- Complaint creation works with backend URL
- MongoDB connection is active

---

## 8) Useful commands

### Local backend
```bash
cd server
npm install
npm start
```

### Local frontend
```bash
cd client
npm install
npm run dev
```

### Root project
```bash
npm install
npm run dev:server
npm run dev:client
```

---

If you want, I can also help you with the exact Render and Vercel settings based on your GitHub repo name and backend domain.
