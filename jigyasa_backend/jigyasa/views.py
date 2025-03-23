from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import SurveySerializer
from rest_framework import generics
from .models import Survey
from .serializers import SurveySerializer
from django.shortcuts import render
# from jigyasa_survey.models import Survey, Question  # Replace with your actual app name
from rest_framework.response import Response
from rest_framework import status

class SurveyCreateView(generics.CreateAPIView):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# def create_survey(request):
#     print("Received Data:", request.data)  # Debugging
#     serializer = SurveySerializer(data=request.data)

#     if serializer.is_valid():
#         serializer.save()
#         return Response({"message": "Survey created successfully!", "data": serializer.data}, status=201)
#     else:
#         print("Errors:", serializer.errors)  # Debugging
#         return Response(serializer.errors, status=400)
