
import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Locate backend/skill/.env
ENV_PATH = (
    Path(__file__).resolve().parents[1]
    / "skill"
    / ".env"
)

load_dotenv(ENV_PATH)

def get_embedding_model():
    api_key = os.getenv("GOOGLE_API_KEY")

    if not api_key:
        raise ValueError(
            f"GOOGLE_API_KEY not found. Checked: {ENV_PATH}"
        )

    return GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001",
        google_api_key=api_key,
    )
