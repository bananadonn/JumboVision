"use client";

import React, { useRef, useState, useEffect } from "react";
import { speak, captureAndDetect, startCamera, closeCamera } from "./utils";

const elements = [
  { id: "title", text: "JumboVision", text2: "An AI assistant for the visually impaired." },
  { id: "howto", text: "How to use. Use arrow keys to navigate buttons. Press enter to activate button.", text2:"" },
  { id: "skipToCamera", text: "Skip to camera button.", text2: "" },
  { id: "whatwedo", text: "What We Do.", text2: "JumboVision uses your camera and AI to describe the world around you in real time." },
  { id: "startcamera", text: "Start Camera button.", text2: "", isButton: true },
];

export default function App(){

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [lastDescription, setLastDescription] = useState("");
    const [started, setStarted] = useState(true);
    const [focusedIndex, setFocusedIndex] = useState(0);
    
    useEffect(() => {
        if (!started) return;
        
        const handleKeyDown = (e:KeyboardEvent) => {
            if (e.code === "ArrowRight") {
                setFocusedIndex(prev => {
                    const next = Math.min(prev + 1, elements.length - 1);
                    speak(elements[next].text);
                    return next;
                })
            }
            if (e.code === "ArrowLeft") {
                setFocusedIndex(prev => {
                    const next = Math.max(prev - 1, 0);
                    speak(elements[next].text);
                    return next;
                })
            }
            if (e.code === "Enter") {
                if (elements[focusedIndex].id === "startcamera") {
                    if (cameraOpen)
                        closeCamera(videoRef, setCameraOpen);
                    else {
                    speak("Starting camera.");
                    startCamera(videoRef, setCameraOpen);
                    }
                }
                else if (elements[focusedIndex].id === "skipToCamera") {
                  setFocusedIndex(prev => {
                    const next = focusedIndex + 2;
                    speak(elements[next].text);
                    return next;
                  });
                }
                else {
                    speak(elements[focusedIndex].text2);
                }
            }
        };
        
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        }, [started, focusedIndex, cameraOpen]);


    const navBtnBase ="rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 whitespace-nowrap";
    const navBtnFocus = "ring-2 ring-[#D4A843] ring-offset-2 ring-offset-black bg-[#5E2B6B]";
    const navBtnIdle = "bg-transparent hover:bg-[#5E2B6B]/80";

    //start capture loop to send frames
    useEffect(() => {
        if (!cameraOpen) return;
        captureAndDetect(videoRef, canvasRef, setLastDescription);
    }, [cameraOpen]);

    return(
        <div>
            <div className="font-bold gap-12 text-center text-4xl w-full bg-[#2a1a2e] py-4 px-6 flex items-center justify-center">
                {/* JUMBOVISION BUTTON */}

                <button className={`relative h-16 rounded-xl px-5 py-2.5 transition-all duration-300 hover:bg-[#5E2B6B] ${focusedIndex === 0 ? "ring-2 ring-[#D4A843] ring-offset-2 ring-offset-[#100a1b] bg-[#5E2B6B]" : ""}`}>
                    <div className="flex">
                        <img src="https://i.imgur.com/L29RYeB.png" height={45} width={45}/>
                        <span className="relative">JumboVision</span>
                    </div>
                </button>
          {/* HOW TO */}
            <button
              className={`${navBtnBase} ${focusedIndex === 1 ? navBtnFocus : navBtnIdle}`}
              aria-label="How To"
            >
              How To
            </button>

            {/* SKIP */}
            <button
              className={`${navBtnBase} ${focusedIndex === 2 ? navBtnFocus : navBtnIdle}`}
              aria-label="Skip to Start Camera"
            >
              Skip to Start Camera
            </button>

            {/* WHAT WE DO */}
            <button
              className={`${navBtnBase} ${focusedIndex === 3 ? navBtnFocus : navBtnIdle}`}
              aria-label="What We Do"
            >
              What We Do
            </button>
          </div>
        

      {/* MAIN */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          {/* Start Camera */}
          <button
            className={`w-full max-w-sm rounded-xl px-5 py-4 text-base sm:text-lg font-bold transition-all duration-200 ${
              focusedIndex === 4 ? "ring-2 ring-[#D4A843] ring-offset-2 ring-offset-black bg-[#753285]" : "bg-[#5E2B6B] hover:bg-[#753285]"}`}
            onClick={async () => {
              speak("Welcome to JumboVision. Press the Start Camera button to begin.");
              await startCamera(videoRef, setCameraOpen);
            }}
          >
            Start Camera
          </button>

          {/* Video */}
          <div className="w-full max-w-md sm:max-w-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full scale-x-[-1] aspect-[4/3] rounded-xl bg-white"
            />
            <canvas ref={canvasRef} width={640} height={480} className="hidden" />
          </div>

          {/* Optional last description (if you want it back) */}
          {/* <p className="text-yellow-200 text-center max-w-prose text-sm sm:text-base">
            {lastDescription ? `Last: ${lastDescription}` : "No scan yet."}
          </p> */}
        </div>
      </main>
    </div>
  );
}