import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from Analytics.csv_processor import process_csv 
from Analytics.graph_generator import generate_graph 

@csrf_exempt
def upload_csv(request):
    """Handles CSV upload and returns column attributes."""
    if request.method == 'POST' and request.FILES.get('file'):
        file = request.FILES['file']
        file_path = default_storage.save(f"uploads/{file.name}", file)
        attributes = process_csv(file_path)
        return JsonResponse({"columns": attributes})
    return JsonResponse({"error": "No file uploaded"}, status=400)

@csrf_exempt
def create_graph(request):
    """Handles graph generation from user input."""
    if request.method == 'POST':
        data = request.POST
        file_path = data.get("file_path")
        x_col = data.get("x_col")
        y_col = data.get("y_col")
        graph_type = data.get("graph_type", "bar")

        if not all([file_path, x_col, y_col]):
            return JsonResponse({"error": "Missing parameters"}, status=400)

        image_path = generate_graph(file_path, x_col, y_col, graph_type)
        return JsonResponse({"graph": image_path})
    
    return JsonResponse({"error": "Invalid request"}, status=400)
