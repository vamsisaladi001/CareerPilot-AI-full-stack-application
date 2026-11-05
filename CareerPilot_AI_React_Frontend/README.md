# CareerPilot AI — React Frontend Preview

## Included
- Responsive login screen (demo only; accepts any non-empty email/password)
- Dashboard with profile menu and sidebar navigation
- PDF resume upload UI (PDF only, maximum 10 MB)
- Target role selector and job-description text area
- Sample career-fit response with strengths, gaps, and next steps
- Interview-coach chat UI with placeholder responses
- Profile and placeholder roadmap/settings screens

## Run locally
Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually http://localhost:5173.

## Important
This is a UI prototype only. Login is not connected to Django; the PDF is not uploaded to a server; analysis and chatbot responses are sample UI responses. Next we can connect Django REST Framework, JWT authentication, Gemini, RAG, LangGraph, and PostgreSQL. Avoid uploading sensitive resumes until secure backend upload/authentication is implemented.
