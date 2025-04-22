from rest_framework.routers import DefaultRouter
from .views import ForumQuestionViewSet

router = DefaultRouter()
router.register(r'questions', ForumQuestionViewSet, basename='questions')

urlpatterns = router.urls
