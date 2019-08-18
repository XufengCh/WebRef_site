from django.contrib import admin
from .models import Library, PdfFile, Ref

# Register your models here.
admin.site.register(Library)
admin.site.register(PdfFile)
admin.site.register(Ref)
