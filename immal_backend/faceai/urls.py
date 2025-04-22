from rest_framework.routers import DefaultRouter
from .views import EmotionLogViewSet

router = DefaultRouter()
router.register(r'log', EmotionLogViewSet, basename='emotion-log')

urlpatterns = router.urls
