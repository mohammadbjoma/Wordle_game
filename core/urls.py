from django.urls import path
from . import views
from core.views import wordle_view

urlpatterns = [
    path("", views.login_view, name="home"),
    path("register/", views.register, name="register"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("game", wordle_view, name="game"),
    path("create_room/", views.create_room, name="create_room"),
    path("join_room/", views.join_room, name="join_room"),
    path("single_play/", views.single_play, name="single_play"),
]
