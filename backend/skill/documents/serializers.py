
from rest_framework import serializers
from .models import Document, JobDescription


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "file",
            "document_type",
            "uploaded_at"
        ]
        read_only_fields = ["id", "uploaded_at"]


class JobDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobDescription
        fields = [
            "id",
            "title",
            "description",
            "created_at"
        ]
        read_only_fields = ["id", "created_at"]

        extra_kwargs = {
            "title": {"required": True},
            "description": {"required": True}
        }
