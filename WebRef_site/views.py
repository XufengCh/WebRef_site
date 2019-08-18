from django.shortcuts import render, redirect
from django.http import HttpRequest
from ref.models import Library


def index(request):
    if request.user.is_authenticated:
        pass
    return render(request, 'index.html')
