import os
import argparse
import numpy as np


class Options():
    def __init__(self):
        self.parser = argparse.ArgumentParser(
            formatter_class=argparse.ArgumentDefaultsHelpFormatter)
        self.initialized = False

    def initialize(self):
        self.parser.add_argument('--DUMP_DATA_PATH', type=str, default='./utils/cachedir/coco/OpenShapes/',
                                 help='path where generated images will be stored')
        self.parser.add_argument(
            '--IMAGE_PATH', type=str, default='./utils/dataset/coco/images/', help='path for dataset images')
        self.parser.add_argument(
            '--LABEL_PATH', type=str, default='./utils/dataset/coco/annotations/semantic_', help='path for semantic labels')
        self.parser.add_argument(
            '--INST_PATH', type=str, default='./utils/dataset/coco/annotations/panoptic_', help='path for instance labels')
        self.parser.add_argument('--COCO_ANNOTATIONS_PATH', type=str,
                                 default='./utils/dataset/coco/panopticapi/panoptic_coco_categories.json', help='path for annotations')
        self.parser.add_argument('--EXEMPLAR_PATH', type=str, default='./utils/cachedir/coco/init/',
                                 help='path for exemplar data stored on disk')
        self.parser.add_argument(
            '--NUM_LABELS', type=int, default=200, help='# of categories in the dataset')
        self.parser.add_argument(
            '--IGNORE_LABEL', type=int, default=0, help='label that needs to be ignored')
        self.parser.add_argument(
            '--TOP_K_GLBL', type=int, default=250, help='# of shortlisted exemplar matches')
        self.parser.add_argument(
            '--TOP_K', type=int, default=5, help='# of generated outputs')
        self.parser.add_argument(
            '--WIN_SIZE', type=int, default=50, help='window size for processing data')
        self.parser.add_argument(
            '--IS_FROM_CACHE', type=int, default=1, help='are the exemplars resized on disk?')
        self.parser.add_argument('--CACHE_EXEMPLAR_PATH', type=str,
                                 default='./utils/cachedir/coco/exemplars_50x50/train2017/', help='path for resized exemplars')
        self.parser.add_argument(
            '--IS_PARTS', type=int, default=1, help='do you use parts or not?')
        self.parser.add_argument(
            '--PARTS_WIN', type=int, default=256, help='canonical size for parts operation')
        self.parser.add_argument(
            '--PARTS_SIZE', type=int, default=16, help='local part window size')
        self.parser.add_argument(
            '--FIN_SIZE', type=int, default=256, help='size of final image')
        self.parser.add_argument(
            '--INPUT_MAP', type=str, default='./INPUT_MAP.png', help='HxW label map')
        self.parser.add_argument(
            '--INSTANCE_MAP', type=str, default='./INSTANCE_MAP.png', help='HxWx3 instance map')
        self.initialized = True

#        self.DUMP_DATA_PATH='./utils/cachedir/coco/OpenShapes/'
#	
#        self.IMAGE_PATH='./utils/dataset/coco/images/'
#       	
#       	self.LABEL_PATH='./utils/dataset/coco/annotations/semantic_'
#       	
#       	self.INST_PATH='./utils/dataset/coco/annotations/paic_'
#       	
#       	self.COCO_ANNOTATIONS_PATH='./utils/dataset/coco/panopticapi/panoptic_coco_categories.json'
#       	
#       	self.EXEMPLAR_PATH='./utils/cachedir/coco/init/'
#       	
#       	self.NUM_LABELS= 200
#       	
#       	self.IGNORE_LABEL= 0
#       	
#       	self.TOP_K_GLBL= 250
#       	
#       	self.TOP_K= 5
#       	
#       	self.WIN_SIZE= 50
#       	 
#       	self.IS_FROM_CACHE= 1
#       	
#       	self.CACHE_EXEMPLAR_PATH= './utils/cachedir/coco/exemplars_50x50/train2017/'
#       	
#       	self.IS_PARTS= 1
#       	
#       	self.PARTS_WIN= 256
#       	
#       	self.PARTS_SIZE= 16
#       	
#       	self.FIN_SIZE= 256
#       	
#       	self.INPUT_MAP= './INPUT_MAP.png'
#       	
#       	self.INSTANCE_MAP= './INSTANCE_MAP.png'
#       	
#       	self.initialized = True

    def parse(self, raw_args):
        if not self.initialized:
            self.initialize()

        self.opt = self.parser.parse_args(raw_args)
        # generate path directory DUMP_DATA_PATH
        if not os.path.exists(self.opt.DUMP_DATA_PATH):
            os.mkdir(self.opt.DUMP_DATA_PATH)

        self.opt.EXEMPLAR_LABEL_PATH = self.opt.LABEL_PATH + 'train2017/'
        self.opt.EXEMPLAR_INST_PATH = self.opt.INST_PATH + 'train2017/'
        self.opt.EXEMPLAR_IMAGE_PATH = self.opt.IMAGE_PATH + 'train2017/'
        self.opt.EXEMPLAR_INDICATOR_VECTOR = self.opt.EXEMPLAR_PATH + \
            'exemplar_indicator_vector.npy'
        self.opt.EXEMPLAR_IMAGE_LIST = self.opt.EXEMPLAR_PATH + 'exemplar_imagelist.npy'
        self.opt.EXEMPLAR_NC = self.opt.EXEMPLAR_PATH + 'exemplar_categories.npy'
        self.opt.QUERY_LABEL_PATH = self.opt.INPUT_MAP
        self.opt.QUERY_INST_PATH = self.opt.INSTANCE_MAP
        self.opt.SHAPE_THRESH = 0.25
        self.opt.RES_F = 0.1
        self.opt.PAT_WIDTH = 16
        self.opt.PAT_HEIGHT = 16
        self.opt.PAT_NBD = 2
        return self.opt
