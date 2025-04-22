from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import ForumQuestion, ForumAnswer
from .serializers import ForumQuestionSerializer, ForumAnswerSerializer


class ForumQuestionViewSet(viewsets.ModelViewSet):
    queryset = ForumQuestion.objects.all().order_by('-created_at')
    serializer_class = ForumQuestionSerializer

    def get_permissions(self):
    # Only restrict editing/deleting
     if self.action in ['update', 'partial_update', 'destroy']:
        return [IsAuthenticated()]
     return [AllowAny()]


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


    @action(detail=True, methods=['post'], url_path='answer', permission_classes=[AllowAny])
    def answer(self, request, pk=None):
        question = self.get_object()
        user = request.user if request.user.is_authenticated else None
        serializer = ForumAnswerSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=user, question=question)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
