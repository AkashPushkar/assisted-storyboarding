from django.shortcuts import render
from django.http import HttpResponse


from django.views.decorators.csrf import csrf_exempt

from wsgiref.util import FileWrapper

import pdb 
import os

import zipfile
from io import BytesIO

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
	cat = request.POST.get('categoryName');
	# filename = '/home/akash/GoogleDrive/My Data/RA - Robotics Institute CMU/assisted_storyboarding/storyboard/static/storyboard/images/car/download (2).png' # Replace by your files here.  

	# x = io.imread(filename)
	# pdb.set_trace()
	zipped_file = zip_Files(cat)

	response = HttpResponse(zipped_file, content_type='application/zip')
	response['Content-Disposition'] = 'attachment'

	# response = HttpResponse(x, content_type="image/png")
	# response['Content-Disposition'] = 'attachment'


	return response
