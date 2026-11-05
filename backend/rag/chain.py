
import json

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

from rag.store import get_vector_store
from documents.models import JobDescription


def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-3.5-flash-lite",
        timeout=60,
        max_retries=1
    )


def get_rag_chain():
    llm = get_llm()

    prompt = ChatPromptTemplate.from_template("""
    You are CareerPilot AI, an intelligent AI career advisor.

    You help users understand their resumes, identify skills,
    discover skill gaps, and plan their career development.

    Rules:
    1. When asked about existing skills, answer using ONLY the resume context.
    2. Never claim that a skill is present unless the context supports it.
    3. When recommending skills, use the resume to understand
       the user's current knowledge and your general career knowledge.
    4. Clearly distinguish existing skills from recommended skills.
    5. Explain why each recommended skill is useful.
    6. Never invent qualifications, experience, projects, or achievements.

    Response style:
    - Use clear headings.
    - Use bullet points.
    - Be practical and career-focused.

    Resume Context:
    {context}

    User Question:
    {question}

    Answer:
    """)

    return llm, prompt


def extract_text(response):
    content = response.content

    if isinstance(content, str):
        return content

    if isinstance(content, list):
        return "\n".join(
            block["text"]
            for block in content
            if isinstance(block, dict)
            and block.get("type") == "text"
        )

    return str(content)


def retrieve_document_context(document_id):
    vector_store = get_vector_store()

    results = vector_store.get(
        where={
            "document_id": str(document_id)
        },
        include=["documents", "metadatas"]
    )

    documents = results.get("documents") or []

    if not documents:
        return ""

    return "\n\n".join(documents)


def ask_question(question, document_id=None):
    vector_store = get_vector_store()

    search_kwargs = {"k": 6}

    if document_id is not None:
        search_kwargs["filter"] = {
            "document_id": str(document_id)
        }

    retriever = vector_store.as_retriever(
        search_kwargs=search_kwargs
    )

    documents = retriever.invoke(question)

    if not documents:
        return (
            "I couldn't find relevant information in your uploaded "
            "document. Please upload and index it again."
        )

    context = "\n\n".join(
        document.page_content for document in documents
    )

    llm, prompt = get_rag_chain()

    messages = prompt.format_messages(
        context=context,
        question=question
    )

    response = llm.invoke(messages)

    return extract_text(response)


def analyze_skill_gap(resume_id, job_description_id):

    # 1. Retrieve complete resume from ChromaDB
    resume_context = retrieve_document_context(resume_id)

    if not resume_context:
        raise ValueError(
            "No indexed resume found for the provided resume ID."
        )

    # 2. Retrieve job description from PostgreSQL
    try:
        job_description = JobDescription.objects.get(
            id=job_description_id
        )
    except JobDescription.DoesNotExist:
        raise ValueError(
            "Job description not found in the database."
        )

    job_context = job_description.description.strip()

    if not job_context:
        raise ValueError(
            "The job description is empty."
        )

    # 3. Initialize Gemini
    llm = get_llm()

    # 4. Skill gap analysis prompt
    prompt = ChatPromptTemplate.from_template("""
    You are CareerPilot AI, an expert technical recruiter
    and AI-powered career advisor.

    Compare the candidate's resume against the job description.

    CANDIDATE RESUME:
    {resume_context}

    JOB DESCRIPTION:
    {job_context}

    IMPORTANT RULES:

    1. Extract technical skills and qualifications from both documents.
    2. Identify skills clearly demonstrated in the resume.
    3. Identify skills required by the job but not demonstrated
       in the resume.
    4. Identify partially matched skills where the resume
       shows related but insufficient evidence.
    5. Every matched skill must have evidence from the resume.
    6. Do not invent candidate experience or qualifications.
    7. Calculate the match percentage based on required
       skills explicitly identified in the job description.
    8. Explain the reasoning behind the match percentage.
    9. Recommend learning priorities based on missing skills.
    10. Do not award a 100% match merely because the documents
        contain similar text.
    11. If requirements are insufficient, explain that a
        reliable score cannot be calculated.

    Return valid JSON using this structure:

    {{
        "overall_match_percentage": 0,
        "match_summary": "Short explanation of the result",
        "matched_skills": [
            {{
                "skill": "Python",
                "evidence": "Evidence from resume"
            }}
        ],
        "partially_matched_skills": [
            {{
                "skill": "Docker",
                "evidence": "Related experience found in resume",
                "improvement_needed": "What is missing"
            }}
        ],
        "missing_skills": [
            {{
                "skill": "AWS",
                "importance": "High",
                "reason": "Why this skill matters"
            }}
        ],
        "learning_recommendations": [
            {{
                "skill": "AWS",
                "priority": "High",
                "reason": "Why to learn it",
                "suggestion": "Practical learning activity"
            }}
        ],
        "final_recommendation": "Overall career advice"
    }}

    Return valid JSON only.
    Do not include Markdown code fences.
    """)

    # 5. Generate analysis
    messages = prompt.format_messages(
        resume_context=resume_context,
        job_context=job_context
    )

    response = llm.invoke(messages)

    answer = extract_text(response).strip()

    # 6. Remove Markdown fences if Gemini returns them
    if answer.startswith("```"):
        answer = answer.split("\n", 1)[1]
        answer = answer.rsplit("```", 1)[0].strip()

    # 7. Convert JSON string into Python dictionary
    try:
        analysis = json.loads(answer)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Gemini returned invalid JSON: {str(e)}"
        )

    # 8. Validate match percentage
    percentage = analysis.get("overall_match_percentage")

    if (
        not isinstance(percentage, (int, float))
        or isinstance(percentage, bool)
        or not 0 <= percentage <= 100
    ):
        raise ValueError(
            "Gemini returned an invalid match percentage."
        )

    return analysis
