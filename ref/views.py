from django.shortcuts import render, redirect, get_object_or_404, Http404
from django.http import JsonResponse
from .models import Library, PdfFile, Ref
from user.models import User
from .forms import LibEditForm, DeleteLibForm, UploadPdfForm
import json
from .pdf_cal import get_pdf_md5_hash, get_default_info


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
            # get library by library_id
            library_to_add = get_object_or_404(Library, pk=form.cleaned_data['library_id'])
            # check user
            if request.user.username != library_to_add.user.username:
                raise Http404("用户权限错误！")

            # get pdf file
            pdf = form.cleaned_data["pdf"]
            # calculate HASH (MD5)
            pdf_hash = get_pdf_md5_hash(pdf)
            # search the database PdfFile to get foreign key
            try:
                pdf_saved = PdfFile.objects.get(hash=pdf_hash)
            # if pdf file don't exist, save it to the PdfFile database
            except PdfFile.DoesNotExist:
                # get default info
                init_info_dict = get_default_info(pdf)
                # create & save pdf_saved
                pdf_saved = PdfFile(hash=pdf_hash, pdf_file=pdf, init_json=json.dumps(init_info_dict))
                pdf_saved.save()

            # create new Reference instance
            new_ref = Ref(library=library_to_add, info_json=pdf_saved.init_json,
                          comment='', pdf=pdf_saved)
            # save
            new_ref.save()
    return redirect('/')


def get_library(request):
    if request.method == 'GET':
        # get library_id
        libarary_id = request.GET.get('library_id')
        # get refs of the library
        lib = get_object_or_404(Library, pk=libarary_id)
        refs_in_lib = lib.ref_set.all()
        # return JSON string
        # for ref in refs_in_lib:
        # return ref_id, info, comment
        data = []

        for ref in refs_in_lib:
            item = {'ref_id': ref.id, 'info': json.loads(ref.info_json), 'comment': ref.comment}
            data.append(item)

        return JsonResponse(data, safe=False)
    return JsonResponse({"error": "HTTP request error. ", "detail": "Only GET is supported. "})
