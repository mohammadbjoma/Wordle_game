# myapp/views.py
from django.shortcuts import render
from django.utils.timezone import now
from django.conf import settings

WORDS = ["APPLE","GRACE","CRANE","PLANT","ABOUT","RIVER","SMILE","BREAD","MOUSE","BRICK","AMONG","TULIP"]

def wordle_view(request):
    # خيار: اختر كلمة يومية ثابتة بحسب تاريخ (مثال: index من أيام منذ epoch)
    idx = (now().date().toordinal()) % len(WORDS)
    server_word = WORDS[idx]  # كلمة اليوم (تُمرر للقالب)
    return render(request, "wordle.html", {"server_word": server_word})
