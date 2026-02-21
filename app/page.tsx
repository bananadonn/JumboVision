"use client";

import React, { useRef, useState, useEffect } from "react";
import { speak, captureAndDetect, startCamera } from "./utils";

const elements = [
    {id: "title", text: "JumboVision. An AI assistant for the visually impaired." },
    {id: "skipToCamera", text: "Skip to camera button"},
    {id: "howto", text: "How to use. Click the Start Camera button, then press Space at any time to scan the scene and hear what is around you." },
    {id: "whatwedo", text: "What We Do. JumboVision uses your camera and AI to describe the world around you in real time." },
    {id: "startcamera", text: "Start Camera button. Press Enter to activate. Press space to scan your surroundings", isButton: true }
    
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
                    speak("Starting camera.");
                    startCamera(videoRef, setCameraOpen);
                }
            }
            if (e.code === "Space" && cameraOpen) {
                e.preventDefault();
                setIsDetecting(true);
                captureAndDetect(videoRef, canvasRef, setLastDescription).then(() => setIsDetecting(false));
            }
        };
        
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        }, [started, focusedIndex, cameraOpen]);

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

                {/* SKIP TO START CAMERA BUTTON */}
                <button className={`relative h-16 rounded-xl px-5 py-2.5 transition-all duration-300 hover:bg-[#5E2B6B] ${focusedIndex === 1 ? "ring-2 ring-[#D4A843] ring-offset-2 ring-offset-[#100a1b] bg-[#5E2B6B]" : ""}`}>
                    <span className="relative">Skip to Start Camera</span>
                </button>

                {/* HOW TO BUTTON */}
                <button className={`relative h-16 rounded-xl px-5 py-2.5 transition-all duration-300 hover:bg-[#5E2B6B] ${focusedIndex === 2 ? "ring-2 ring-[#D4A843] ring-offset-2 ring-offset-[#100a1b] bg-[#5E2B6B]" : ""}`}>
                    <span className="relative">How To</span>
                </button>

                {/* WHAT WE DO BUTTON */}
                <button className={`relative h-16 rounded-xl px-5 py-2.5 transition-all duration-300 hover:bg-[#5E2B6B] ${focusedIndex === 3 ? "ring-2 ring-[#D4A843] ring-offset-2 ring-offset-[#100a1b] bg-[#5E2B6B]" : ""}`}>                    
                    <span className="relative">What We Do</span>
                </button>
            </div>

            {/* START RECORDING SECTION */}
            <div className="font-bold gap-4 mt-15 px-40 text-4xl flex flex-col items-center justify-center">
                <button
                className={`relative h-16 rounded-xl px-5 py-2.5 transition-all duration-300 hover:bg-[#75437D] ${focusedIndex === 4 ? "ring-2 ring-[#D4A843] ring-offset-2 ring-offset-[#100a1b] bg-[#5E2B6B]" : ""}`}
                onClick={async () => {
                    speak("Welcome to JumboVision. Press the Start Camera button to begin.");
                    await startCamera(videoRef, setCameraOpen);
                    }}>
                Start Camera
                </button>

                {/* SCAN/SPEAK SECTION */}
                {/* <button className={`relative h-16 overflow-hidden rounded-xl px-5 py-2.5 transition-all duration-300 hover:bg-[#75437D] hover:ring-2 hover:ring-[#f3c454] hover:ring-offset-2 hover:ring-offset-[#161616] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:ring-0`}
                    onClick={async () => {
                        setIsDetecting(true);
                        await captureAndDetect(videoRef, canvasRef, setLastDescription);
                        setIsDetecting(false);
                    }}
                    disabled={!cameraOpen || isDetecting}>
                    {isDetecting ? "Scanning..." : "Scan + Speak"}
                </button> */}

                {/* CAMERA VIDEO */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-[360px] rounded-lg bg-black"
                />

                <canvas ref={canvasRef} width={640} height={480} className="hidden" />

                {/* <p className="text-yellow-200 text-center max-w-[360px]">
                    {lastDescription ? `Last: ${lastDescription}` : "No scan yet."}
                </p> */}
                
            </div>
        </div>        
    )
}
