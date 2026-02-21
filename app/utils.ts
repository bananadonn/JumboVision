import React from "react";

export const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
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