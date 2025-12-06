# myapp/views.py
from django.shortcuts import render
from django.utils.timezone import now
from django.conf import settings
from django.contrib import messages
from . import models

WORDS = ["APPLE","GRACE","CRANE","PLANT","ABOUT","RIVER","SMILE","BREAD","MOUSE","BRICK","AMONG","TULIP"]

def wordle_view(request):
    idx = (now().date().toordinal()) % len(WORDS)
    server_word = WORDS[idx]
    return render(request, "wordle.html", {"server_word": server_word})
