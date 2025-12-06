# myapp/views.py
from django.shortcuts import render,redirect
from django.utils.timezone import now
from django.conf import settings
from django.contrib import messages
from . import models

WORDS = ["APPLE","GRACE","CRANE","PLANT","ABOUT","RIVER","SMILE","BREAD","MOUSE","BRICK","AMONG","TULIP"]

def wordle_view(request):
    # خيار: اختر كلمة يومية ثابتة بحسب تاريخ (مثال: index من أيام منذ epoch)
    idx = (now().date().toordinal()) % len(WORDS)
    server_word = WORDS[idx]  # كلمة اليوم (تُمرر للقالب)
    return render(request, "wordle.html", {"server_word": server_word})
def register(request):
   
    if request.method == 'POST':
        errors = {} 
        errors = models.User.objects.user_validation(request.POST)

        if errors:
            for key, value in errors.items():
                messages.error(request, value)
            return render(request, 'register.html',{'errors': errors})

        
     
        user = models.create_user(request.POST)
        request.session['user_id'] = user.user_id
        messages.success(request, 'Registration successful!')
        return redirect('dashboard')
    
    return render(request, 'register.html')

def login_view(request):
    if request.method == 'POST':
        result = models.User.objects.validate_login(request.POST)

    
        if "user" not in result:
            for error in result.values():
                messages.error(request, error)
            return render(request, 'login.html')

      
        user = result["user"]
        request.session['user_id'] = user.user_id
        messages.success(request, f"Welcome back, {user.first_name}!")
        return redirect('dashboard')

    return render(request, 'login.html')


def logout_view(request):
    request.session.flush()
    messages.success(request, 'Logged out successfully')
    return redirect('login')