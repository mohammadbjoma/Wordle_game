from django.urls import path
from . import views
from core.views import wordle_view

urlpatterns = [

    path('', views.login_view, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
        path('game', wordle_view, name='game'),
    # path('dashboard/', views.dashboard, name='dashboard'),
]
