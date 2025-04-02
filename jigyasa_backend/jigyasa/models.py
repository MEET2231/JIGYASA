from django.db import models
from django.contrib.auth.models import User
# from jigyasa_survey.models import Survey, Question

class Organization(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

# Extend the User model
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.organization.name if self.organization else 'No Organization'}"

class Survey(models.Model):
    survey_name = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.survey_name

class Question(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()
    question_type = models.CharField(max_length=50, choices=[
        ('text', 'Text'),
        ('multiple_choice', 'Multiple Choice'),
        ('rating', 'Rating'),
        ('matrix', 'Matrix'),
        ('file_upload', 'File Upload')
    ])
    required = models.BooleanField(default=False)
    options = models.JSONField(default=list, blank=True)  # Store multiple-choice options
    min_rating = models.IntegerField(null=True, blank=True)
    max_rating = models.IntegerField(null=True, blank=True)
    scale_labels = models.JSONField(default=list, blank=True)
    matrix_rows = models.JSONField(default=list, blank=True)
    matrix_columns = models.JSONField(default=list, blank=True)
    file_types = models.JSONField(default=list, blank=True)
    max_file_size = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.question_text

# class Survey(models.Model):
#     survey_name = models.CharField(max_length=255)
#     description = models.TextField()
#     created_by = models.ForeignKey(User, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)

