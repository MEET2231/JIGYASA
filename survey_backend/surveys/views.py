import csv
import os
from django.http import JsonResponse
from django.conf import settings
from rest_framework import viewsets
from .models import Survey, Response
from .serializers import SurveySerializer, ResponseSerializer

class SurveyViewSet(viewsets.ModelViewSet):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer

class ResponseViewSet(viewsets.ModelViewSet):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer

    def perform_create(self, serializer):
        response = serializer.save()
        survey = response.survey

        # Generate CSV File
        csv_filename = f'csv_storage/survey_{survey.id}.csv'
        csv_filepath = os.path.join(settings.MEDIA_ROOT, csv_filename)

        with open(csv_filepath, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(response.answers.values())

        # Save CSV file reference in Survey model
        survey.csv_file = csv_filename
        survey.save()
        return JsonResponse({'message': 'Response recorded and CSV updated'}, status=201)
