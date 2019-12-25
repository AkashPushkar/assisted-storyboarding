import numpy as np
import cv2
import os
import pdb

def main(path):
	dataPath = os.path.join(path, 'resultImages')
	dirLayers = os.listdir(dataPath)
	numImages = len(os.listdir(os.path.join(dataPath, dirLayers[0])))
	
	os.mkdir(os.path.join(path, 'resultSceneImages'))	
	for imageNum in range(numImages):
		#points = np.ones((1,3))
		#colors = np.ones((1,3))
		
		sceneImg = cv2.imread(os.path.join(dataPath, dirLayers[0], str(imageNum)+'.png'))
		for layerNum in range(1, len(dirLayers)):
			#print(imageNum, layerNum)
			img = cv2.imread(os.path.join(dataPath, dirLayers[layerNum], str(imageNum)+'.png'))

				

			img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
			_, mask = cv2.threshold(img_gray, 2, 255,cv2.THRESH_BINARY_INV)
			sceneImg_masked = cv2.bitwise_and(sceneImg, sceneImg, mask=mask)

			mask_inv = cv2.bitwise_not(mask)
			img_masked = cv2.bitwise_and(img, img, mask=mask_inv)

			sceneImg = cv2.add(sceneImg_masked, img_masked)
			
		
		cv2.imwrite(os.path.join(path, 'resultSceneImages', '{}.png'.format(imageNum)),sceneImg)
