import asyncio
import json
from django.contrib.auth import get_user_model
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async

import cv2
import base64
import numpy as np
import pdb

# from skimage.feature import match_template
# import skimage.io as io


class Consumer(AsyncConsumer):
        async def websocket_connect(self, event):
                print("connected", event)
                await self.send({
                    "type":"websocket.accept"
                })

                #await asyncio.sleep(5)

                await self.send({
                    "type":"websocket.send",
                    "text":"hello"
                })

        async def websocket_receive(self, event):
                # pdb.set_trace()
                image = event['text']
                imgformat, imgstr = image.split(';base64,') 
                ext = imgformat.split('/')[-1] 
                nparr = np.fromstring(base64.b64decode(imgstr), np.uint8)
                img = cv2.cvtColor(cv2.imdecode(nparr, cv2.IMREAD_COLOR), cv2.COLOR_BGR2GRAY)
                nonzero = np.where(img!=0)
                template = img[min(nonzero[1]):max(nonzero[1]), min(nonzero[0]):max(nonzero[0])]
                # print(np.shape(template))

                # hog = cv2.HOGDescriptor()
                # h = hog.compute(template)
                # print(h)


        async def websocket_disconnect(self, event):
                print("disconnected", event)
