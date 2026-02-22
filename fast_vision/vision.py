import cv2
import numpy as np
from ultralytics import YOLO
import asyncio
import time

#initalize model
model = YOLO("yolov8n.pt")  # lightweight model

INTERVAL = 3 #3 seconds between every announcement
last_announcement_time = 0
frame_counter = {}

#zone mapping (left, right or center)
def get_horizontal_zone(center_x, frame_width):
    ratio = center_x / frame_width
    if ratio < 0.33:
        return "left"
    elif ratio < 0.66:
        return "center"
    else:
        return "right"

def get_depth_zone(box_area, frame_area):
    ratio = box_area / frame_area
    if ratio > 0.15:
        return "close"
    elif ratio > .05:
        return "medium distance"
    else:
        return "far"

async def analyze_frame(frame_bytes: bytes) -> list[str]:
    global last_announcement_time, frame_counter

    # convert bytes to image
    np_array = np.frombuffer(frame_bytes, dtype=np.uint8)
    frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    #get frame dimensions
    frame_height, frame_width = frame.shape[:2]
    frame_area = frame_height * frame_width
    
    # run YOLO
    results = model(frame, conf=0.7, verbose=False)

    labels = [model.names[int(box.cls[0])]for r in results for box in r.boxes]
    
    #update object validity based on frame life
    for obj in list(frame_counter.keys()):
        if obj not in labels:
            frame_counter[obj] = 0
    for obj in labels:
        frame_counter[obj] = frame_counter.get(obj,0) + 1
    
    confirmed = []

    for result in results:
        for box in result.boxes:
            obj = model.names[int(box.cls[0])]
            
            #if obj appears in 4 frames confirm it
            if frame_counter.get(obj,0) >= 2:
                x1,y1,x2,y2 = box.xyxy[0]
                center_x = (x1 + x2) / 2
                box_area = (x2 -x1) * (y2 -y1)
                direction = get_horizontal_zone(center_x, frame_width)
                distance = get_depth_zone(box_area, frame_area)
                confirmed.append(f"{obj} detected {distance} at {direction}")
            
    now = time.time()
    if confirmed and (now - last_announcement_time >= INTERVAL):
        last_announcement_time = now
        print(confirmed)
        return confirmed
    return []