
const API_BASE_URL = "http://127.0.0.1:8000/api";

async function handleResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage =
      data.error ||
      data.message ||
      data.detail ||
      Object.values(data).flat().join(" ") ||
      fallbackMessage;

    throw new Error(errorMessage);
  }

  return data;
}

// REGISTER
export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response, "Registration failed");
}

// LOGIN
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/access/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response, "Login failed");
}

// UPLOAD RESUME
export async function uploadDocument(file, title, documentType) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("title", title);
  formData.append("document_type", documentType);

  const response = await fetch(`${API_BASE_URL}/documents/upload/`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(response, "Document upload failed");
}

// ASK RESUME QUESTIONS
export async function askDocumentQuestion(documentId, question) {
  const response = await fetch(`${API_BASE_URL}/documents/ask/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      document_id: documentId,
      question,
    }),
  });

  return handleResponse(response, "Unable to get an AI response");
}

// SAVE JOB DESCRIPTION
export async function saveJobDescription(title, description) {
  const response = await fetch(
    `${API_BASE_URL}/documents/job-description/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    }
  );

  return handleResponse(response, "Job description save failed");
}

// ANALYZE SKILL GAP
export async function analyzeSkillGap(resumeId, jobDescriptionId) {
  const response = await fetch(`${API_BASE_URL}/documents/analyze/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume_id: resumeId,
      job_description_id: jobDescriptionId,
    }),
  });

  return handleResponse(response, "Skill gap analysis failed");
}
