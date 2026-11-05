from django.urls import path
from .views import create,ProfileView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns=[
    path("create/",create.as_view(),name="register"),
    path("access/", TokenObtainPairView.as_view(),name="access"),
    path("refresh/", TokenRefreshView.as_view(),name="refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
]