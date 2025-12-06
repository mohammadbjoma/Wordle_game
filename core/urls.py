from django.urls import path

from core.views import wordle_view

urlpatterns = [
   path('', wordle_view, name='wordle'),
]
