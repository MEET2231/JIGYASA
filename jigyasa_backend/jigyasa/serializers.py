from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Organization, UserProfile, Survey, Question

# Question Serializer
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'
        extra_kwargs = {"survey": {"required": False}}  # Avoid requiring survey initially

# Organization Serializer
class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'code']

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    organization_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'first_name', 'last_name', 'organization_id')
        extra_kwargs = {
            'username': {'required': False},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            # Generate a suggested username
            base_username = value.split('@')[0]  # Get part before @
            counter = 1
            suggested_username = base_username
            
            while User.objects.filter(username=suggested_username).exists():
                suggested_username = f"{base_username}{counter}"
                counter += 1
            
            raise serializers.ValidationError({
                'error': 'User with this email already exists',
                'suggested_username': suggested_username
            })
        return value

    def create(self, validated_data):
        # Extract organization_id if present
        organization_id = validated_data.pop('organization_id', None)
        
        # Set username to email if not provided
        if 'username' not in validated_data:
            validated_data['username'] = validated_data['email']
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Create user profile with organization if provided
        if organization_id:
            try:
                organization = Organization.objects.get(id=organization_id)
                UserProfile.objects.create(user=user, organization=organization)
            except Organization.DoesNotExist:
                pass
        
        return user

# Survey Serializer
class SurveySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, required=False)
    created_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

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
