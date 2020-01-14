import numpy as np
import cv2
import os
import pdb

def main(path):
	dataPath = os.path.join(path, 'resultImages')
	dirLayers = sorted(os.listdir(dataPath))
	numImages = len(os.listdir(os.path.join(dataPath, dirLayers[0])))
	
	os.mkdir(os.path.join(path, 'resultSceneImages'))	
	

	for imageNum in range(numImages):
		
		sceneImg = cv2.imread(os.path.join(dataPath, dirLayers[0], str(imageNum)+'.png'))
		for layerNum in range(1, len(dirLayers)):
			#print(imageNum, layerNum)
			img = cv2.imread(os.path.join(dataPath, dirLayers[layerNum], str(imageNum)+'.png'))
			
			mask = cv2.imread(os.path.join(path, 'semanticLabels', '{}.png'.format(layerNum)))
			points = np.add(np.add(mask[:,:,0], mask[:,:,1]) , mask[:,:,2])!=0
			sceneImg[points,:]=img[points,:]
			
					
		sceneImg = cv2.blur(sceneImg, (3,3))
		cv2.imwrite(os.path.join(path, 'resultSceneImages', '{}.png'.format(imageNum)),sceneImg)
