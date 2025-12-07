from django.shortcuts import render, redirect
from django.utils.timezone import now
from django.conf import settings
from django.contrib import messages
from . import models
from .models import User

WORDS = [
    "APPLE",
    "GRACE",
    "CRANE",
    "PLANT",
    "ABOUT",
    "RIVER",
    "SMILE",
    "BREAD",
    "MOUSE",
    "BRICK",
    "AMONG",
    "TULIP",
]


def wordle_view(request):
    user_id = request.session.get("user_id")
    if not user_id:
        return redirect("login")

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        request.session.flush()
        return redirect("login")

    idx = now().date().toordinal() % len(WORDS)
    server_word = WORDS[idx]

    return render(
        request,
        "wordle.html",
        {
            "server_word": server_word,
            "user": user,
        },
    )


def register(request):
    if request.session.get("user_id"):
        return redirect("game")

    if request.method == "POST":
        errors = User.objects.user_validation(request.POST)
        if errors:
            for value in errors.values():
                messages.error(request, value)
            return render(request, "register.html", {"errors": errors})

        user = User.objects.create_user(request.POST)
        request.session["user_id"] = user.id
        messages.success(request, "Registration successful!")
        return redirect("game")

    return render(request, "register.html", {"errors": {}})


def login_view(request):
    if request.session.get("user_id"):
        return redirect("game")

    if request.method == "POST":
        result = User.objects.validate_login(request.POST)

        if "user" not in result:
            for value in result.values():
                messages.error(request, value)
            return render(request, "login.html", {"errors": result})

        user = result["user"]
        request.session["user_id"] = user.id
        messages.success(request, f"Welcome back, {user.first_name}!")
        return redirect("game")

    return render(request, "login.html", {"errors": {}})


def logout_view(request):
    request.session.flush()
    messages.success(request, "Logged out successfully")
    return redirect("login")
