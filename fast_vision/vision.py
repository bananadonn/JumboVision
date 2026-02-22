import cv2
import numpy as np
from ultralytics import YOLO
import asyncio

model = YOLO("yolov8n.pt")  # lightweight model

async def analyze_frame(frame_bytes: bytes) -> list[str]:
    # convert bytes to image
    np_array = np.frombuffer(frame_bytes, dtype=np.uint8)
    frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    
    # run YOLO
    results = model(frame)
    
    alerts = []
    for result in results:
        for box in result.boxes:
            label = model.names[int(box.cls)]
            alerts.append(label)
    
    return alerts if alerts else ["nothing detected"]