from django.urls import path
from jigyasa.views import SurveyCreateView
from .views import SurveyCreateView  # Ensure this is correct

urlpatterns = [
    path('create-survey/', SurveyCreateView.as_view(), name='create-survey'),
]
