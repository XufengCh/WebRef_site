from django.shortcuts import render, redirect
from django.http import HttpRequest
from .forms import RegisterForm

# Create your views here.
def register(request):
    user_is_valid = True

    if request.method == 'POST':
        form = RegisterForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('login/')
        else:
            user_is_valid = False

    return render(request, 'user/register.html', context={'user_is_valid': user_is_valid})
