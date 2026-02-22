"""
Real-time YOLO + Webcam (Laptop)

What it does:
- Opens your webcam
- Runs YOLO on each frame
- Draws boxes + labels
- (Optional) Speaks detected objects every few seconds (Windows/macOS)

Install (in your venv):
  pip install ultralytics opencv-python pyttsx3

Run:
  python yolo_live.py
Quit:
  Press 'q'
"""

import time
from collections import Counter

import cv2
from ultralytics import YOLO

# -------- OPTIONAL: Text-to-Speech --------
USE_TTS = True
SPEAK_EVERY_SECONDS = 2.0  # speak at most once every N seconds
CONF_THRESHOLD = 0.35      # only announce detections above this confidence

try:
    import pyttsx3
except ImportError:
    pyttsx3 = None
    USE_TTS = False


def init_tts():
    if not USE_TTS or pyttsx3 is None:
        return None
    engine = pyttsx3.init()
    engine.setProperty("rate", 180)  # speech speed
    return engine


def speak(engine, text: str):
    if engine is None:
        return
    # Avoid stacking speech: stop current, then speak new
    engine.stop()
    engine.say(text)
    engine.runAndWait()


def unique_objects_from_results(results, conf_threshold: float):
    """
    Extract unique detected class names from a single Ultralytics Results object.
    """
    if results.boxes is None or results.boxes.cls is None:
        return []

    cls_list = results.boxes.cls.tolist()
    conf_list = results.boxes.conf.tolist() if results.boxes.conf is not None else [1.0] * len(cls_list)

    names = []
    for cls_id, conf in zip(cls_list, conf_list):
        if conf >= conf_threshold:
            names.append(results.names[int(cls_id)])
    return names


def main():
    # Use a small model for real-time speed. Swap to your custom model path if needed.
    # e.g., model = YOLO("runs/detect/train/weights/best.pt")
    model = YOLO("yolov8n.pt")

    cap = cv2.VideoCapture(0)  # 0 = default webcam
    if not cap.isOpened():
        raise RuntimeError("Could not open webcam. Try changing VideoCapture(0) to (1) or check permissions.")

    # Reduce latency (may not work on all webcams/drivers)
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

    tts_engine = init_tts()
    last_spoken_time = 0.0
    last_announced_set = set()

    # Optional: run detection every N frames to speed up
    DETECT_EVERY_N_FRAMES = 1
    frame_idx = 0

    print("Running YOLO live. Press 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_idx += 1

        # Run detection on schedule
        results = None
        if frame_idx % DETECT_EVERY_N_FRAMES == 0:
            # verbose=False keeps console clean
            results = model(frame, verbose=False)[0]
            annotated = results.plot()
        else:
            annotated = frame

        # Overlay: show detected objects on the frame
        if results is not None:
            names = unique_objects_from_results(results, CONF_THRESHOLD)
            counts = Counter(names)

            # Make a short label for display
            label = ", ".join([f"{k}({v})" for k, v in counts.most_common(6)])  # limit clutter
            cv2.putText(
                annotated,
                label,
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (255, 255, 255),
                2,
                cv2.LINE_AA,
            )

            # Optional TTS: only speak every few seconds AND only if detections changed
            now = time.time()
            current_set = set(counts.keys())

            if USE_TTS and (now - last_spoken_time) >= SPEAK_EVERY_SECONDS:
                if current_set and current_set != last_announced_set:
                    # Speak only the top few objects
                    top_objects = [k for k, _ in counts.most_common(4)]
                    speak_text = "I see " + ", ".join(top_objects)
                    speak(tts_engine, speak_text)
                    last_spoken_time = now
                    last_announced_set = current_set

        cv2.imshow("YOLO Live", annotated)

        # Quit
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()