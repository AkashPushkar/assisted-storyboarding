from django.shortcuts import render
from django.http import HttpResponse


from django.views.decorators.csrf import csrf_exempt

from wsgiref.util import FileWrapper

from django.core.files.storage import FileSystemStorage


import pdb 
import os
import json
import random

import zipfile
from io import BytesIO

import base64
from django.core.files.base import ContentFile

import cv2
import numpy as np

import datetime

from utils import OpenShapes
from utils import pointCloud
from utils import sceneImage

# Create your views here.
def index(request):
        
        with open('utils/dataset/coco/panopticapi/panoptic_coco_categories_color.json') as file:
                data = json.load(file)

        context = {'categories': data}
        return render(request, 'storyboard/home.html', context)


def zip_Files(folderpath, n=-1):

        temp = BytesIO()
        # temp = tempfile.TemporaryFile()
        archive = zipfile.ZipFile(temp , 'w')

        if n == 'all':
            for f in sorted(os.listdir(folderpath), key= lambda x: int(x[:-4])):
                archive.write(os.path.join(folderpath, f), f)

        elif n == 'random':
            files =  random.sample(os.listdir(folderpath), 10)
            for f in files:
                archive.write(os.path.join(folderpath, f), f)
        else:
            for f in sorted(os.listdir(folderpath), key= lambda x: int(x[:-4]))[:n]:
                archive.write(os.path.join(folderpath, f))
        archive.close()
        
        return temp.getvalue()



@csrf_exempt
def fetchImages(request):

        # pdb.set_trace()
        cat = request.POST.get('categoryName')
        folderpath = os.path.join('storyboard/static/storyboard/images', cat, 'average')
        zipped_file = zip_Files(folderpath, n ='all')

        response = HttpResponse(zipped_file, content_type='application/zip')
        response['Content-Disposition'] = 'attachment'

        return response

@csrf_exempt
def fetchExemplarImages(request):


        cat = request.POST.get('clusterName')
        # pdb.set_trace()
        cat = cat.split("_")
        folderpath = os.path.join('storyboard/static/storyboard/images', cat[0],cat[2], cat[1])
        if cat[2] == 'edge':
            n = 'random'
        elif cat[2] == 'exemplar':
            n = 4 
        zipped_file = zip_Files(folderpath, n)

        response = HttpResponse(zipped_file, content_type='application/zip')
        response['Content-Disposition'] = 'attachment'

        return response



@csrf_exempt
def fetchSceneImages(request):

        keys = request.POST.keys()

        file = "./utils/dataset/coco/panopticapi/panoptic_coco_categories.json"
        with open(file, 'r') as file:
                data = json.load(file)
        
        rgb = {}
        for d in data:
                rgb[tuple([d['color'][2],d['color'][1],d['color'][0]])] = d['id']
        

        path = os.path.join('./media', datetime.datetime.now().strftime('%Y%m%d%H%M%S%f'))
        os.makedirs(os.path.join(path, 'semanticLabels'))
        os.mkdir(os.path.join(path, 'resultImages'))
        for key in keys:

                image = request.POST[key]
                imgformat, imgstr = image.split(';base64,') 
                ext = imgformat.split('/')[-1] 

                # data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext) 
                nparr = np.fromstring(base64.b64decode(imgstr), np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                # fs.save(data.name, data)
                
                
                #outlier removal (based on comparison with category colors)
                for i in range(np.shape(img)[0]):
                        for j in range(np.shape(img)[1]):
                                if not tuple(img[i,j,:]) in rgb.keys() :
                                        img[i,j,:] = [0,0,0]
                
                # adding padding at top
                img = np.uint8(np.concatenate((np.zeros((4, np.shape(img)[1], 3)), img), axis=0))
        
                # floodfill with blue color
                cv2.floodFill(img, None, (0,0), (255,0,0))
                
                
                for i in range(1, np.shape(img)[0]):
                        for j in range(1, np.shape(img)[1]):
                                if np.sum(img[i, j, :]) == 0:
                                        if np.sum(img[i, j-1, :]) != 0:
                                                if tuple(img[i,j-1,:]) in rgb.keys():
                                                        color = (int(img[i, j-1, 0]), int(img[i, j-1, 1]), int(img[i, j-1, 2]))
                                                        cv2.floodFill(img, None, (j,i), color)
                                        
                                                        
                
                cv2.floodFill(img, None, (0,0), (0,0,0))
                
                # removing padding 
                img = img[4:,:,:]

                cv2.imwrite(os.path.join(path, 'semanticLabels', '{}.png'.format(key)),img)
        
        OpenShapes.main(os.path.join(path, 'semanticLabels'), os.path.join(path, 'resultImages'))
        

        sceneImage.main(path)
                
        pointCloud.main(path)   

        folderpath = os.path.join(path, 'resultSceneImages')
        zipped_file = zip_Files(folderpath)

        response = HttpResponse(zipped_file, content_type='application/zip')
        response['Content-Disposition'] = 'attachment'
        
        return response
