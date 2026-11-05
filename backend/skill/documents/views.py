
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import DocumentSerializer
from .indexer import index_document
from .models import Document
from .models import Document, JobDescription
from .serializers import DocumentSerializer, JobDescriptionSerializer

from rag.chain import ask_question, analyze_skill_gap
from .models import Document, JobDescription
from rag.chain import ask_question, analyze_skill_gap


class DocumentUploadView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):

        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return Response(
                {"error": "Please upload a PDF file."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not uploaded_file.name.lower().endswith(".pdf"):
            return Response(
                {"error": "Only PDF files are allowed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        document_type = request.data.get("document_type", "")

        document_type = (
            str(document_type)
            .strip()
            .lower()
            .replace(" ", "_")
        )

        allowed_types = [
            "resume",
            "job_description",
            "career_resource"
        ]

        if document_type not in allowed_types:
            return Response(
                {
                    "error": "Invalid document type.",
                    "received_value": repr(document_type),
                    "allowed_values": allowed_types
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer_data = request.data.copy()
        serializer_data["document_type"] = document_type

        serializer = DocumentSerializer(data=serializer_data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        document = serializer.save()

        try:
            indexing_result = index_document(document.id)

            if not indexing_result["success"]:
                document.delete()

                return Response(
                    {
                        "message": "Document indexing failed.",
                        "error": indexing_result["error"]
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return Response(
                {
                    "message": "Document uploaded and indexed successfully!",
                    "document": DocumentSerializer(document).data,
                    "indexing": indexing_result
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            document.delete()

            return Response(
                {
                    "error": "Document indexing failed.",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DocumentAskView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        question = request.data.get("question")
        document_id = request.data.get("document_id")

        if not question or not str(question).strip():
            return Response(
                {"error": "Question is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not document_id:
            return Response(
                {"error": "Document ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            document = Document.objects.get(id=document_id)

        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            answer = ask_question(
                question=question.strip(),
                document_id=document.id
            )

            return Response(
                {
                    "document_id": document.id,
                    "document_title": document.title,
                    "document_type": document.document_type,
                    "question": question,
                    "answer": answer
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {
                    "error": "Unable to process your question.",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SkillGapAnalysisView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        resume_id = request.data.get("resume_id")
        job_description_id = request.data.get("job_description_id")

        if not resume_id or not job_description_id:
            return Response(
                {
                    "error": "Both resume_id and job_description_id are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate resume in Document table
        try:
            resume = Document.objects.get(id=resume_id)
        except Document.DoesNotExist:
            return Response(
                {"error": "Resume not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if resume.document_type != "resume":
            return Response(
                {"error": "The selected document is not a resume."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate JD in JobDescription table
        try:
            job_description = JobDescription.objects.get(
                id=job_description_id
            )
        except JobDescription.DoesNotExist:
            return Response(
                {"error": "Job description not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Generate skill gap analysis
        try:
            analysis = analyze_skill_gap(
                resume_id=resume.id,
                job_description_id=job_description.id
            )

            return Response(
                {
                    "message": "Skill gap analysis completed successfully!",
                    "resume_id": resume.id,
                    "job_description_id": job_description.id,
                    "analysis": analysis
                },
                status=status.HTTP_200_OK
            )

        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            return Response(
                {
                    "error": "Skill gap analysis failed.",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class JobDescriptionCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = JobDescriptionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        job_description = serializer.save()

        return Response(
            {
                "message": "Job description saved successfully!",
                "job_description": JobDescriptionSerializer(
                    job_description
                ).data
            },
            status=status.HTTP_201_CREATED
        )
