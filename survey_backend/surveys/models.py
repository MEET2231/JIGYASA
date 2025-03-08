from django.db import models

class Survey(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    csv_file = models.FileField(upload_to='csv_storage/', blank=True, null=True)

class Question(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name="questions")
    text = models.CharField(max_length=500)
    type = models.CharField(max_length=50)  # text, choice, rating, etc.
    options = models.JSONField(blank=True, null=True)  # For multiple choice

class Response(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name="responses")
    answers = models.JSONField()
    submitted_at = models.DateTimeField(auto_now_add=True)
