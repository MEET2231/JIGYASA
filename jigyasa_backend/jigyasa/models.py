from django.db import models
# from jigyasa_survey.models import Survey, Question

class User(models.Model):  # If it's a fully custom model
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)

class Survey(models.Model):
    survey_name = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

# class Survey(models.Model):
#     survey_name = models.CharField(max_length=255)
#     description = models.TextField()
#     created_by = models.ForeignKey(User, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)

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

