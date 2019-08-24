from django.shortcuts import render, redirect, get_object_or_404, Http404
from django.http import JsonResponse, HttpResponse
from .models import Library, PdfFile, Ref
from user.models import User
from .forms import LibEditForm, DeleteForm, UploadPdfForm
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
        form = DeleteForm(request.POST)
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
                # rename
                pdf.name = hash + '.pdf'
                # create & save pdf_saved
                pdf_saved = PdfFile(hash=pdf_hash, pdf_file=pdf, init_json=json.dumps(init_info_dict))
                pdf_saved.save()

            # create new Reference instance
            new_ref = Ref(library=library_to_add, info_json=pdf_saved.init_json,
                          comment='', pdf=pdf_saved)
            # save
            new_ref.save()
    return redirect('/')


# get the references of the library, using ajax
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


# edit the info of the reference
def edit_ref(request):
    if request.method == 'POST' and request.user.is_authenticated:
        lib = get_object_or_404(Library, pk=request.POST['lib_id'])
        ref = get_object_or_404(Ref, pk=request.POST['ref_id'])

        # check permission
        if lib.user.username != request.user.username or ref.library.id != lib.id:
            raise Http404("用户权限错误！")

        edited_info = {}
        data = request.POST
        edited_info['type'] = data['type']
        edited_info['author'] = data['author']
        edited_info['title'] = data['title']
        edited_info['journal_or_booktitle'] = data['journal_or_booktitle']
        edited_info['year'] = data['year']

        ref.info_json = json.dumps(edited_info)
        ref.comment = data['comment']

        ref.save()

    return redirect('/')


# get pdf file of the reference
def get_file(request, ref_id):
    if request.user.is_authenticated:
        ref = get_object_or_404(Ref, pk=ref_id)
        if ref.library.user.username != request.user.username:
            raise Http404("用户权限错误！")

        pdf_file_path = ref.pdf.pdf_file.path
        with open(pdf_file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/pdf')
            response['Content-Disposition'] = 'inline; filename="' + ref.pdf.pdf_file.name + '"'
            return response

    return redirect('/')


# delete ref
def delete_ref(request):
    if request.method == "POST" and request.user.is_authenticated:
        form = DeleteForm(request.POST)
        if form.is_valid():
            delete_id = form.cleaned_data['delete_id']
            ref_to_delete = get_object_or_404(Ref, pk=delete_id)

            if ref_to_delete.library.user.username != request.user.username:
                raise Http404("用户权限错误！")

            ref_to_delete.delete()

    return redirect('/')
