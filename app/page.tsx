"use client";

import React, { useRef, useState, useEffect } from "react";
import { speak, captureAndDetect, startCamera } from "./utils";

const elements = [
    {id: "title", text: "JumboVision. An AI assistant for the visually impaired." },
    {id: "whatwedo", text: "What We Do. JumboVision uses your camera and AI to describe the world around you in real time." },
    {id: "howto", text: "How to use. Click the Start Camera button, then press Space at any time to scan the scene and hear what is around you." },
    {id: "startcamera", text: "Start Camera button. Press Enter to activate.", isButton: true },
    {id: "skipToCamera", text: "Skip to camera button"}
];

export default function App(){

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [lastDescription, setLastDescription] = useState("");
    

    return(
        <div>
            <div className="font-bold gap-12 text-center text-4xl w-full bg-[#2a1a2e] py-4 px-6 flex items-center justify-center">
                {/* JUMBOVISION BUTTON */}
                <button className="relative h-16 overflow-hidden rounded-xl px-5 py-2.5 transition-all duration-300 hover:bg-[#5E2B6B] hover:ring-2 hover:[#f3c454] hover:ring-offset-2">
                    <div className="flex">
                        <img src="https://i.imgur.com/L29RYeB.png" height={45} width={45}/>
                        <span className="relative">JumboVision</span>
                    </div>
                </button>

                {/* SKIP TO START CAMERA BUTTON */}
                <button className="relative h-16 overflow-hidden rounded-xl px-5 py-2.5 transition-all duration-300 hover:bg-[#5E2B6B] hover:ring-2 hover:[#f3c454] hover:ring-offset-2">
                    <span className="relative">Skip to Start Camera</span>
                </button>

                {/* HOW TO BUTTON */}
                <button className="relative h-16 overflow-hidden rounded-xl px-5 py-2.5 transition-all duration-300 hover:bg-[#5E2B6B] hover:ring-2 hover:[#f3c454] hover:ring-offset-2">
                    <span className="relative">How To</span>
                </button>

                {/* WHAT WE DO BUTTON */}
                 <button className="relative h-16 overflow-hidden rounded-xl px-5 py-2.5 transition-all duration-300 hover:bg-[#5E2B6B] hover:ring-2 hover:[#f3c454] hover:ring-offset-2">
                    <span className="relative">What We Do</span>
                </button>
            </div>

            {/* START RECORDING SECTION */}
            <div className="font-bold gap-4 mt-15 px-40 text-4xl flex flex-col items-center justify-center">
                    <button
                    className="relative h-16 overflow-hidden rounded-xl px-5 py-2.5 transition-all duration-300 hover:bg-[#75437D] hover:ring-2 hover:[#f3c454] hover:ring-offset-2"
                    onClick={async () => {
                        speak("Welcome to JumboVision. Press the Start Camera button to begin.");
                        await startCamera(videoRef, setCameraOpen);
                        }}>
            Start Camera
        </button>

        {/* SCAN/SPEAK SECTION */}
        <button
        className="px-6 py-3 rounded bg-yellow-300 text-black font-bold disabled:opacity-50"
        onClick={async () => {
            setIsDetecting(true);
            await captureAndDetect(videoRef, canvasRef, setLastDescription);
        setIsDetecting(false);
            }}
  disabled={!cameraOpen || isDetecting}
>
  {isDetecting ? "Scanning..." : "Scan + Speak"}
    </button>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-[360px] rounded-lg bg-black"
            />

            <canvas ref={canvasRef} width={640} height={480} className="hidden" />

            <p className="text-yellow-200 text-center max-w-[360px]">
                {lastDescription ? `Last: ${lastDescription}` : "No scan yet."}
            </p>
        </div>
    </div>        
  )
}
