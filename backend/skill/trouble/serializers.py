from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
User=get_user_model()
class serial(serializers.ModelSerializer):
    password=serializers.CharField(
        write_only=True,
        min_length=6,
        style={"input_type":"password"}
    )
    class Meta:
        model=User
        fields=["email","password"]
    def create(self,validated_data):
        user=User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"]
            
        )
        return user
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email"]