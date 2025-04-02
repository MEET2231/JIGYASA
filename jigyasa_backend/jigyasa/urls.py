from django.urls import path
from . import views

urlpatterns = [
    path('create-survey/', views.SurveyCreateView.as_view(), name='create-survey'),
    path('auth/signup/', views.signup, name='signup'),
    path('auth/login/', views.login, name='login'),
    path('user/', views.get_user, name='get_user'),
    path('organizations/', views.get_organizations, name='get_organizations'),
]
