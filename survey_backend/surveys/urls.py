from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SurveyViewSet, ResponseViewSet, get_survey_stats

router = DefaultRouter()
router.register(r'surveys', SurveyViewSet)
router.register(r'responses', ResponseViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("api/get-survey-stats", get_survey_stats, name="get_survey_stats"),
]
