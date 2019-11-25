from django.urls import path

from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('fetchImages/', views.fetchImages, name='fetch-Images')
]