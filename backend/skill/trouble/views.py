from django.shortcuts import render
from .serializers import serial
from rest_framework import generics
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import ProfileSerializer

# Create your views here.
class create(CreateAPIView):
    serializer_class=serial
    permission_classes=[AllowAny]


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response({
            "message": "Authentication successful!",
            "profile": serializer.data
        })