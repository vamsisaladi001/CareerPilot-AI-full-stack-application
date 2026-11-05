
from django.db import models


class Document(models.Model):
    DOCUMENT_TYPES = [
        ("resume", "Resume"),
        ("job_description", "Job Description"),
        ("career_resource", "Career Resource"),
    ]

    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="documents/")
    document_type = models.CharField(
        max_length=30,
        choices=DOCUMENT_TYPES
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class JobDescription(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
