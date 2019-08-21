"""ref APP URL Configration
"""
from django.urls import path
from . import views

app_name = 'ref'
urlpatterns = [
    path('create', views.create, name='create'),
    path('<int:library_id>/libedit', views.libedit, name='libedit'),
    path('delete-lib/', views.delete_lib, name="delete-lib"),
    path('add-ref/', views.add_ref, name="add-ref"),
]
