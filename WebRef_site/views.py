from django.shortcuts import render, redirect
from django.http import HttpRequest
from ref.models import Library
from user.models import User


def index(request):
    if request.user.is_authenticated:
        user = User.objects.get(username=request.user.username)
        libraries = user.library_set.all()
        dict = {"libraries": libraries}
        return render(request, 'index.html', context=dict)
    return render(request, 'index.html')
