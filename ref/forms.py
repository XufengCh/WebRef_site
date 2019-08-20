from django import forms


class LibEditForm(forms.Form):
    editname = forms.CharField(max_length=100)


class DeleteLibForm(forms.Form):
    delete_id = forms.IntegerField(required=True, min_value=1)


class UploadPdfForm(forms.Form):
    library_id = forms.IntegerField(required=True, min_value=1)
    pdf = forms.FileField(label="请上传PDF文件", required=True)

    def clean_pdf(self):
        file = self.cleaned_data["pdf"]
        ext = file.name.split('.')[-1].lower()
        if ext not in ["pdf"]:
            raise forms.ValidationError("Only pdf files are allowed. ")
        return file
