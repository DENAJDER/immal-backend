from rest_framework import serializers
from .models import ForumQuestion, ForumAnswer

class ForumAnswerSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = ForumAnswer
        fields = ['id', 'user', 'body', 'created_at']

    def get_user(self, obj):
        return obj.user.username if obj.user else "Anonymous"



class ForumQuestionSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    answers = ForumAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = ForumQuestion
        fields = ['id', 'title', 'body', 'category', 'created_at', 'user', 'answers']

    def get_user(self, obj):
        return obj.user.username if obj.user else "Anonymous"

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        else:
            validated_data['user'] = None
        return super().create(validated_data)
