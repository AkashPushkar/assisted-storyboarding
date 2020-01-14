import open3d as o3d
import numpy as np
import cv2
import os
import pdb

def main(path):
	depthBwLayers = 100
	dataPath = os.path.join(path, 'resultImages')
	dirLayers = sorted(os.listdir(dataPath))
	numImages = len(os.listdir(os.path.join(dataPath, dirLayers[0])))
	os.mkdir(os.path.join(path, 'pointClouds'))	
	for imageNum in range(numImages):
		points = np.ones((1,3))
		colors = np.ones((1,3))
	
		for layerNum, category in zip(range(len(dirLayers)), ['h', 'v']):
		#for layerNum in range(len(dirLayers)):
			img = cv2.imread(os.path.join(dataPath, dirLayers[layerNum], str(imageNum)+'.png'))
			xy = np.where((img[:,:,0]!=0) & (img[:,:,0]!=0) & (img[:,:,0]!=0))
			diff = 500-max(xy[0])
			#pdb.set_trace()
                        
			if category == 'h':
				points = np.concatenate((points, np.concatenate(( 500*np.ones((len(xy[0]),1)), np.reshape(xy[1],(-1,1)), np.reshape(xy[0],(-1,1))), axis=1)), axis=0)

				colors = np.concatenate((colors, img[xy]/255), axis=0)
			if category == 'v':
				points = np.concatenate((points, np.concatenate((np.reshape(xy[0]+diff,(-1,1)), np.reshape(xy[1],(-1,1)), depthBwLayers * layerNum * np.ones((len(xy[0]),1))), axis=1)), axis=0)
				colors = np.concatenate((colors, img[xy]/255), axis=0)

#			points = np.concatenate((points, np.concatenate((np.reshape(xy[0],(-1,1)), np.reshape(xy[1],(-1,1)), depthBwLayers * layerNum  * np.ones((len(xy[0]),1))), axis=1)), axis=0)
		
#			colors = np.concatenate((colors, img[xy]), axis=0)
		
		
		pcl = o3d.geometry.PointCloud()
		
		pcl.points = o3d.utility.Vector3dVector(points)
		pcl.colors = o3d.utility.Vector3dVector(colors)
		
		#o3d.visualization.draw_geometries([pcl])
		o3d.io.write_point_cloud(os.path.join(path, 'pointClouds', '{}.pcd'.format(imageNum)), pcl, write_ascii=True)

		break
