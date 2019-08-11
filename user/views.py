from django.shortcuts import render, redirect
from django.http import HttpRequest
from .models import User

# Create your views here.
def register(request):
    request.encoding = 'utf-8'
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['username']
        nickname = request.POST['nickname']
        password = request.POST['password1']

        try:
            user_to_register = User.objects.create_user(username=username, email=email, password=password)
        except IntegrityError:
            username_is_valid = False
            return render(request, 'user/register.html', context={'username_is_valid': username_is_valid})
        # username is valid
        user_to_register.nickname = nickname
        user_to_register.save()
        return

    return render(request, 'user/register.html')
