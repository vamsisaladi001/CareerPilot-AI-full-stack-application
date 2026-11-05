from django.urls import path
from .views import DocumentUploadView
from . views import DocumentAskView
from .views import SkillGapAnalysisView
from . views import JobDescriptionCreateView

urlpatterns = [
    path("upload/", DocumentUploadView.as_view(), name="document-upload"),
    path("ask/", DocumentAskView.as_view(), name="document-ask"),
    path(
        "analyze/",
        SkillGapAnalysisView.as_view(),
        name="skill-gap-analysis"
    ),
    path(
        "job-description/",
        JobDescriptionCreateView.as_view(),
        name="job-description-create"),
]
