import csv
import os
from django.http import JsonResponse
from django.conf import settings
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Survey, Response as SurveyResponse
from .serializers import SurveySerializer, ResponseSerializer

class SurveyViewSet(viewsets.ModelViewSet):
    """Handles CRUD operations for surveys."""
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer

class ResponseViewSet(viewsets.ModelViewSet):
    """Handles survey responses and stores them in CSV."""
    queryset = SurveyResponse.objects.all()
    serializer_class = ResponseSerializer

    def perform_create(self, serializer):
        response = serializer.save()
        survey = response.survey

        # Ensure directory exists
        csv_dir = os.path.join(settings.MEDIA_ROOT, 'csv_storage')
        os.makedirs(csv_dir, exist_ok=True)

        csv_filename = f'survey_{survey.id}.csv'
        csv_filepath = os.path.join(csv_dir, csv_filename)

        # Check if CSV file exists, write header if not
        file_exists = os.path.isfile(csv_filepath)
        with open(csv_filepath, mode='a', newline='') as file:
            writer = csv.writer(file)

            if not file_exists:
                writer.writerow(["id"] + list(response.answers.keys()))  # Write header row

            writer.writerow([response.id] + list(response.answers.values()))  # Write response row

        # Save CSV file reference in Survey model
        survey.csv_file = csv_filename
        survey.save()

        return JsonResponse({'message': 'Response recorded and CSV updated'}, status=201)

@api_view(['GET'])
def get_survey_stats(request):
    """Returns survey analytics: total responses, completion rate, etc."""
    total_responses = SurveyResponse.objects.count()
    active_surveys = Survey.objects.count()

    avg_response_time = "4m 32s"  # Placeholder; implement actual time calculation logic

    surveys = Survey.objects.all()
    survey_list = [
        {
            "name": survey.title,
            "responses": survey.responses.count(),
            "completionRate": 87,  # Placeholder; implement actual calculation
            "avgTime": avg_response_time
        }
        for survey in surveys
    ]

    data = {
        "total_responses": total_responses,
        "completion_rate": 87,  # Placeholder
        "avg_response_time": avg_response_time,
        "active_surveys": active_surveys,
        "surveys": survey_list,
    }

    return Response(data)
