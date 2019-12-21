from django.shortcuts import render
from django.http import HttpResponse


from django.views.decorators.csrf import csrf_exempt

from wsgiref.util import FileWrapper

from django.core.files.storage import FileSystemStorage


import pdb 
import os

import zipfile
from io import BytesIO

import base64
from django.core.files.base import ContentFile

import cv2
import numpy as np

import datetime

# Create your views here.
def index(request):
	return render(request, 'storyboard/home.html')


def zip_Files(cat):


	temp = BytesIO()
	# temp = tempfile.TemporaryFile()
	archive = zipfile.ZipFile(temp , 'w')

	foldername = os.path.join('storyboard/static/storyboard/images', cat)
	for root, dir, files in os.walk(foldername):
		# pdb.set_trace()
		if len(files) != 0:
			for file in files:
				archive.write(os.path.join(root, file), file)

	archive.close()
	
	return temp.getvalue()

	# temp.seek(0)
	# wrapper = FileWrapper(temp)




@csrf_exempt
def fetchImages(request):

	# pdb.set_trace()
	cat = request.POST.get('categoryName')
	
	zipped_file = zip_Files(cat)

	response = HttpResponse(zipped_file, content_type='application/zip')
	response['Content-Disposition'] = 'attachment'

	# response = HttpResponse(x, content_type="image/png")
	# response['Content-Disposition'] = 'attachment'


	return response


@csrf_exempt
def fetchSceneImages(request):

	# pdb.set_trace()
	image = request.POST['image']

	fs = FileSystemStorage()
	# fs.save('1', image)	/
	imgformat, imgstr = image.split(';base64,') 
	ext = imgformat.split('/')[-1] 

	# data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext) 
	nparr = np.fromstring(base64.b64decode(imgstr), np.uint8)
	img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

	# fs.save(data.name, data)
	a = cv2.floodFill(img, None, (0,0), (255,255,255))
	for i in range(1, np.shape(img)[0]):
	    for j in range(1, np.shape(img)[1]):
	        if np.sum(img[i, j, :]) == 0:
	            if np.sum(img[i, j-1, :]) != 0:
	                # print(j)
	                x = cv2.floodFill(img, None, (j,i), (int(img[i, j-1, 0]), int(img[i, j-1, 1]), int(img[i, j-1, 2])))
    

	cv2.imwrite('{}.png'.format(datetime.datetime.now().strftime('%Y%M%d%M%S%f')),img)
	_ , img = cv2.imencode('.png', img)
	img = base64.b64encode(img)
	response = HttpResponse(img, content_type="image/png")

	# pdb.set_trace()
	response['Content-Disposition'] = 'attachment'	

	return response