from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.timezone import now, timedelta
from .models import EmotionLog
from .serializers import EmotionLogSerializer
from django.db.models import Count
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth

class EmotionLogViewSet(viewsets.ModelViewSet):
    queryset = EmotionLog.objects.all()
    serializer_class = EmotionLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EmotionLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def stats(self, request):
        user = request.user
        logs = EmotionLog.objects.filter(user=user)

        today = now().date()
        this_week = today - timedelta(days=7)
        this_month = today - timedelta(days=30)

        def get_stats(start_date):
            return (
                logs.filter(timestamp__date__gte=start_date)
                .values("emotion")
                .annotate(count=Count("emotion"))
            )

        return Response({
            "today": get_stats(today),
            "this_week": get_stats(this_week),
            "this_month": get_stats(this_month),
        })
