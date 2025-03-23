from rest_framework import serializers
from .models import User, Survey, Question

# Question Serializer
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'
        extra_kwargs = {"survey": {"required": False}}  # Avoid requiring survey initially

# Survey Serializer
class SurveySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, required=False)
    created_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  # Fix here

    class Meta:
        model = Survey
        fields = '__all__'

    def create(self, validated_data):
        questions_data = validated_data.pop("questions", [])

        # Create the survey directly
        survey = Survey.objects.create(**validated_data)

        # Create related questions if provided
        if questions_data:
            question_objects = [
                Question(survey=survey, **question_data) for question_data in questions_data
            ]
            Question.objects.bulk_create(question_objects)

        return survey

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
