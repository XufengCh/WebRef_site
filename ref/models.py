from django.db import models
from user.models import User


# Create your models here.
class Library(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    library_name = models.CharField(max_length=30, default="未命名")

    def __str__(self):
        return self.user.username + self.library_name


class PdfFile(models.Model):
    hash = models.CharField(max_length=40)
    pdf_file = models.FileField(upload_to="uploads/%Y/%m/%d")
    # init info
    init_info = models.FileField(upload_to="uploads/%Y/%m/%d")


class Ref(models.Model):
    library = models.ForeignKey(to=Library, on_delete=models.CASCADE)
    info = models.FileField(upload_to="ref_info/%Y/%m/%d")
    comment = models.TextField(max_length=500)
    pdf = models.ForeignKey(to=PdfFile, on_delete=models.CASCADE)
