from django.urls import path
from . import views
from core.views import wordle_view

urlpatterns = [
    path('', wordle_view, name='wordle'),
    path('', views.login_view, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
]
