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

  if(synth.speaking) return;

  // On some browsers voices load async; don’t speak until they exist
  const voices = synth.getVoices();
  if (!voices || voices.length === 0) {
    // try again after voices load
    synth.onvoiceschanged = () => speak(text);
    return;
  }

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 1.05;
  synth.speak(u);

  lastText = text;
  lastTime = now;
};

let ws: WebSocket | null = null;

const getWebSocket = (): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
        if (ws && ws.readyState == WebSocket.OPEN) {
            resolve(ws);
            return;
        }
        ws = new WebSocket("wss://abc123.ngrok.io/ws");
        ws.onopen = () => resolve(ws!);
        ws.onerror = (e) => reject(e);
    })
}

let isRunning = false;

export const captureAndDetect = async (
    videoRef: React.RefObject<HTMLVideoElement | null>,
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    setLastDescription: (desc: string) => void
) => {
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if(!video || !canvas) return;

    isRunning = true;

    const loop = async () => {
        if (!isRunning) return;
        console.log("loop running");

        const ctx = canvas!.getContext("2d");
        ctx?.drawImage( video , 0,0, canvas!.width, canvas!.height);
        const base64 = canvas!.toDataURL("image/jpeg").split(",")[1];

        try {
            const socket = await getWebSocket();

            socket.onmessage = (e) => {
                console.log(e.data);
                const data = JSON.parse(e.data);
                if (!data.alerts || data.alerts.length === 0) {
                    loop();
                    return;
                }
                const description = data.alerts.join(",");
                speak(description);
                setLastDescription(description);
                loop();
            };

            socket.send(JSON.stringify({frame: base64 }))
    } catch (err) {
        console.log("Could not connect to server.");
    }
    };
    loop();
};

export const startCamera = async (
    videoRef: React.RefObject<HTMLVideoElement | null>,
    setCameraOpen: (open: boolean) => void
) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        setCameraOpen(true);
        speak("Camera started");
    } catch (err) {
        speak("Could not access camera. Please allow camera permissions.");
    }
};

export const closeCamera = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  setCameraOpen: (open: boolean) => void
) => {
  const video = videoRef.current;
  if (!video) return;

  const src = video.srcObject;
  if (src instanceof MediaStream) {
    src.getTracks().forEach((track) => track.stop());
  }

  video.srcObject = null;
  setCameraOpen(false);
  speak("Camera stopped.");
};