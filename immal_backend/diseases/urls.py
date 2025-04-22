# urls.py

from django.urls import path
from .views import search_disease

urlpatterns = [
    path('search/', search_disease, name='search_disease'),  # Map the search endpoint
]
