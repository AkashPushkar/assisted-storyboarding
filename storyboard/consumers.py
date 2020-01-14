import asyncio
import json
from django.contrib.auth import get_user_model
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async

import pdb

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
                pdb.set_trace()
                print("receive", event)

        async def websocket_disconnect(self, event):
                print("disconnected", event)
