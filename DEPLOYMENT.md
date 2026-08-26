# Backend Cloud Hosting & Deployment Guide

This guide explains how to deploy the **RTI Copilot Backend (FastAPI)** to cloud hosting platforms in under 5 minutes.

---

## Option 1: Deploy on Render (Recommended — Free & Easy)

1. **Sign Up / Log In**: Go to [render.com](https://render.com) and connect your GitHub account.
2. **Create New Web Service**:
   - Click **New +** → **Web Service**.
   - Select your repository: `Paras543/RTIReimagine`.
3. **Configure Service**:
   - **Name**: `rti-copilot-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
4. **Add Environment Variables**:
   In the **Environment** section, add the following variables:
   | Key | Value | Notes |
   |---|---|---|
   | `LLM_API_KEY` | `gsk_...` | Your Groq, Gemini, or OpenAI API key |
   | `LLM_BASE_URL` | `https://api.groq.com/openai/v1` | Or Gemini/OpenAI base URL |
   | `LLM_MODEL` | `llama-3.3-70b-versatile` | Or `gemini-2.0-flash` / `gpt-4o-mini` |
   | `CORS_ORIGINS` | `http://localhost:3000,https://*.vercel.app,*` | Allowed frontend origins |
   | `CLERK_SECRET_KEY` | `sk_test_...` | From Clerk Dashboard (optional) |
5. **Deploy**:
   - Click **Create Web Service**.
   - Render will build and deploy your service. Once live, you will get a public URL like: `https://rti-copilot-backend.onrender.com`.

---

## Option 2: Deploy on Railway

1. Go to [railway.app](https://railway.app).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select `Paras543/RTIReimagine`.
4. In the settings:
   - Set **Root Directory** to `/backend`.
5. In the **Variables** tab, set:
   - `LLM_API_KEY` = your API key
   - `LLM_BASE_URL` = `https://api.groq.com/openai/v1`
   - `LLM_MODEL` = `llama-3.3-70b-versatile`
   - `CORS_ORIGINS` = `*`
6. Click **Generate Domain** under Settings → Networking to get your public API URL.

---

## Option 3: Deploy with Docker (Any VPS / Fly.io / AWS)

Build and run using the included `Dockerfile`:

```bash
cd backend

# Build Docker image
docker build -t rti-copilot-backend .

# Run container locally or on a server
docker run -d -p 8000:8000 \
  -e LLM_API_KEY="your_api_key_here" \
  -e LLM_BASE_URL="https://api.groq.com/openai/v1" \
  -e LLM_MODEL="llama-3.3-70b-versatile" \
  -e CORS_ORIGINS="*" \
  --name rti-backend rti-copilot-backend
```

---

## Linking Frontend to the Hosted Backend

Once your backend is deployed:

1. **For Local Frontend**:
   Update `frontend/.env.local`:
   ```env
   BACKEND_URL=https://rti-copilot-backend.onrender.com
   ```

2. **For Vercel Production Frontend**:
   In your Vercel project settings:
   - Go to **Settings** → **Environment Variables**.
   - Set `BACKEND_URL` to your hosted backend URL (`https://your-backend-service.onrender.com`).
   - Redeploy the frontend.
