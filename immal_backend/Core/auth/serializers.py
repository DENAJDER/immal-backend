from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.core.exceptions import ObjectDoesNotExist
from Core.user.serializers import UserSerializer
from Core.user.models import User
from django.contrib.auth import authenticate

class LoginSerializer(TokenObtainPairSerializer):
    username_field = 'username'  # Force usage of username

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials or user not found.")

        refresh = self.get_token(user)

        data = {
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, user)

        return data



class RegisterSerializer(UserSerializer):
    password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(write_only=True, required=True)
    birthdate = serializers.DateField(required=True)
    country = serializers.CharField(required=True)
    diseases = serializers.ListField(
        child=serializers.CharField(), required=True
    )

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "password",
            "birthdate", "country", "diseases",
            "is_active", "created", "updated"
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
