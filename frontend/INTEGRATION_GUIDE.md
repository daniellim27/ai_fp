# Frontend Integration Guide

## ✅ What's Been Done

1. Created `services/codebertService.ts` - New service to call CodeBERT API
2. Updated `Scanner.tsx` - Now imports from `codebertService` instead of `geminiService`
3. Fixed TypeScript types - Proper severity mapping

## 🚀 Run the Frontend

### Step 1: Start Backend (if not running)
```bash
cd d:\ai_codebert_fp\backend
python -m api.main
```
Backend runs on: http://localhost:8080

### Step 2: Start Frontend
```bash
cd d:\ai_codebert_fp\ai_fp_uii
npm install  # if needed
npm run dev
```

Frontend will run on: http://localhost:5173 (or similar)

### Step 3: Test End-to-End

1. Open http://localhost:5173
2. Click "Start Scanning"
3. Enter your GitHub token
4. Select a repository
5. Scan files → See CodeBERT results!

## 🔧 Configuration

The frontend is configured to use `http://localhost:8080/api/v1` by default.

For production, you can set the API URL via environment variable or update the constant in `codebertService.ts`.

## 📝 What Changed

**Before**: Frontend → Gemini API  
**After**: Frontend → CodeBERT FastAPI Backend

The UI remains the same, but now uses your trained models instead of Gemini!

## Next: Deploy Both Services

Once local testing works:
1. Deploy backend to Cloud Run
2. Deploy frontend to Vercel/Netlify
3. Update frontend API URL to production backend
