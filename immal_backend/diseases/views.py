from django.http import JsonResponse
from .models import Disease

def search_disease(request):
    query = request.GET.get('query', '').strip()  # Strip spaces from input
    if not query:
        return JsonResponse({"error": "Please provide a search term."}, status=400)

    # Perform case-insensitive search for diseases by name
    results = Disease.objects.filter(name__icontains=query)

    if not results.exists():
        return JsonResponse({"error": "No diseases found matching your query."}, status=404)

    # Prepare the response data
    data = [
        {
            "name": disease.name,
            "description": disease.description,
            "symptoms": disease.symptoms,
            "treatments": disease.treatments,
            "image": request.build_absolute_uri(disease.image.url) if disease.image else None,
        }
        for disease in results
    ]

    return JsonResponse({"diseases": data}, safe=False)
