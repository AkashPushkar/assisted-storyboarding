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
		
		sceneImg = cv2.imread(os.path.join(dataPath, dirLayers[0], str(imageNum)+'.png'))
		for layerNum in range(1, len(dirLayers)):
			print(imageNum, layerNum)
			img = cv2.imread(os.path.join(dataPath, dirLayers[layerNum], str(imageNum)+'.png'))
			
			mask = cv2.imread(os.path.join(path, 'semanticLabels', '{}.png'.format(layerNum)))
			points = np.add(np.add(mask[:,:,0], mask[:,:,1]) , mask[:,:,2])==0
			sceneImg[points,:]=img[points,:]
			
			
#			mask_img = cv2.imread(os.path.join(path, 'semanticLabels', '{}.png'.format(layerNum)))
#			mask_img_gray = cv2.cvtColor(mask_img, cv2.COLOR_BGR2GRAY)
#			_, mask = cv2.threshold(mask_img_gray, 2, 255,cv2.THRESH_BINARY)
#			sceneImg_masked = cv2.bitwise_and(sceneImg, sceneImg, mask=mask)
#
#			mask_inv = cv2.bitwise_not(mask)
#			img_masked = cv2.bitwise_and(img, img, mask=mask_inv)
#
#			sceneImg = cv2.add(sceneImg_masked, img_masked)
#			
#			w= np.shape(img)[0]
#			h= np.shape(img)[1]
#			
#			for i in range(w):
#				for j in range(h):
#					if img[w,h,:] != 0:
#						sceneImg[w,h,:] = img[w,h,:]			
					
		sceneImg = cv2.blur(sceneImg, (3,3))
		cv2.imwrite(os.path.join(path, 'resultSceneImages', '{}.png'.format(imageNum)),sceneImg)
