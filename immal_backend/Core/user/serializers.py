from Core.user.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'diseases', 'birthdate', 'country', 'is_active', 'created', 'updated']
        read_only_fields = ['is_active', 'created', 'updated']
