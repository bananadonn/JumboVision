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
    videoRef: React.RefObject<HTMLVideoElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    setLastDescription: (desc: string) => void
) => {
    const mockDetections = [
        { label: "person", position: "directly ahead" },
        { label: "chair", position: "to your left" },
        { label: "door", position: "to your right" },
        {label: "water ", position: "behind you" },
        {label: "Cameron", position: "in front of you" },
        {label: "W'sssss", position: "in the chat" },
        {label: "C sharp", position: "for the win" },
        {label: "Daniel", position: "listening to nothing to your right" },
        {label: "Who is winning JumboHack '26", position: "Bet we are!!" },
        {label: "Ram", position: "is the best dev I've ever met!!" },   
    ];

    const description = mockDetections
        .map((d) => `${d.label} ${d.position}`)
        .join(", ");

    speak(description);
    setLastDescription(description);
};

export const startCamera = async (
    videoRef: React.RefObject<HTMLVideoElement>,
    setCameraOpen: (open: boolean) => void
) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        setCameraOpen(true);
        speak("Camera started. Press Space to scan the scene.");
    } catch (err) {
        speak("Could not access camera. Please allow camera permissions.");
    }
};