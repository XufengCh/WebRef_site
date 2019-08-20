from django import forms


class LibEditForm(forms.Form):
    editname = forms.CharField(max_length=100)


class DeleteLibForm(forms.Form):
    delete_id = forms.IntegerField(required=True, min_value=1)
