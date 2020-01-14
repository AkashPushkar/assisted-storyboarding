from django.urls import path

from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('fetchImages/', views.fetchImages, name='fetch-Images'),
	path('fetchSceneImages/', views.fetchSceneImages, name='fetch-Scene-Images'),
	path('fetchExemplarImages/', views.fetchExemplarImages, name='fetch-Exemplar-Images')
]
