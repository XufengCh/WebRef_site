from django.shortcuts import render, redirect, get_object_or_404, Http404
from .models import Library, Ref, PdfFile
from user.models import User
from .forms import LibEditForm, DeleteLibForm, UploadPdfForm

from .pdf_cal import get_pdf_md5_hash


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
    if request.method == "POST" and request.user.is_authenticated:
        form = DeleteLibForm(request.POST)
        if form.is_valid():
            lib_to_delete = get_object_or_404(Library, pk=form.cleaned_data["delete_id"])

            if lib_to_delete.user.username != request.user.username:
                raise Http404("用户权限错误！")

            lib_to_delete.delete()

    return redirect('/')


# add new reference to the library
def add_ref(request):
    if request.method == "POST":
        # get form
        form = UploadPdfForm(request.POST, request.FILES)
        # check user auth and form
        if request.user.is_authenticated and form.is_valid():
            # get pdf file
            pdf = form.cleaned_data["pdf"]

            # calculate HASH (MD5)
            hash = get_pdf_md5_hash(pdf)
            # search the database
            try:
                pdf_saved = PdfFile.objects.get(hash=hash)
            # if pdf file don't exist, save it to the PdfFile database
            except PdfFile.DoesNotExist:

        # get an object from PdfFile

        # get library by library_id

# create new Reference instance

# save
