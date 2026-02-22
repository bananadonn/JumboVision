import React from "react";

let lastText = "";
let lastTime = 0;

export const speak = (text: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const now = Date.now();

  // prevent spam / rapid repeats
  if (text === lastText && now - lastTime < 1200) return;
  if (now - lastTime < 300) return;

  const synth = window.speechSynthesis;

  // On some browsers voices load async; don’t speak until they exist
  const voices = synth.getVoices();
  if (!voices || voices.length === 0) {
    // try again after voices load
    synth.onvoiceschanged = () => speak(text);
    return;
  }

  synth.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 1.05;
  synth.speak(u);

  lastText = text;
  lastTime = now;
};

export const captureAndDetect = async (
        videoRef: React.RefObject<HTMLVideoElement | null>,
        canvasRef: React.RefObject<HTMLCanvasElement | null>,
        setLastDescription: (desc: string) => void
        ) => {
        // optional safety checks
        if (!videoRef.current) {
            speak("Camera is not ready yet.");
            return;
        }
        if (!canvasRef.current) {
            speak("Canvas is not ready yet.");
            return;
        }

        const mockDetections = [
            { label: "person", position: "directly ahead" },
            { label: "chair", position: "to your left" },
            { label: "door", position: "to your right" },
            { label: "water", position: "behind you" },
        ];

        const description = mockDetections.map(d => `${d.label} ${d.position}`).join(", ");
        speak(description);
        setLastDescription(description);
};

export const startCamera = async (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  setCameraOpen: (open: boolean) => void
) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

    setCameraOpen(true);
    speak("Back camera started. Press Space to scan the scene.");
  } catch (err) {
    speak("Camera access denied. Please allow camera permissions.");
    console.error(err);
  }
};