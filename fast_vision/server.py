# server.py
import cv2
import numpy as np
import base64

import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("connection to frontend")

    try:
        while True:
            #receive text from frontend
            data = await websocket.receive_text()
            message = json.loads(data)

            #decode base64 into image
            frame_bytes = base64.b64decode(message["frame"])
            np_array = np.frombugger(frame_bytes, dtype=np.uint8)
            frame = cv2.imdecode(np_array,cv2.IMREAD_COLOR)

            #test response
            await websocket.send_text(json.dumps({
                "alerts": ["websocket functional"]
            }))
    except WebSocketDisconnect:
        print("frontend disconnected")
        