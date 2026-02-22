# server.py
import cv2
import numpy as np
import base64
from vision import analyze_frame

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

            #test response
            alerts = await analyze_frame(frame_bytes)
            await websocket.send_text(json.dumps({"alerts": alerts}))

    except WebSocketDisconnect:
        print("frontend disconnected")
        