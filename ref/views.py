from django.shortcuts import render, redirect, get_object_or_404
from .models import Library
from user.models import User
from .forms import LibEditForm


# Create your views here.

# create new library
def create(request):
    request.encoding = 'utf-8'
    user_to_create = request.user
    new_library_name = request.POST['libname']
    if request.method == 'POST' and user_to_create.is_authenticated:
        user_object = User.objects.get(username=user_to_create.username)
        new_lib = Library(user=user_object, library_name=new_library_name)
        new_lib.save()
        return redirect('/')
    return redirect('/')


# edit library name
def libedit(request, library_id):
    lib = get_object_or_404(Library, pk=library_id)
    if request.method == "POST" and request.user.is_authenticated:
        form = LibEditForm(request.POST)
        if form.is_valid():
            lib.library_name = form.cleaned_data['editname']
            lib.save()
        return redirect('/')
    return redirect('/')


# delete library
def delete_lib(request):

    redirect('/')
