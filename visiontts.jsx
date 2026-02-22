"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function pickDirection(centerX, width) {
  const r = centerX / width; // 0..1
  if (r < 0.33) return "left";
  if (r > 0.66) return "right";
  return "in front";
}

function estimateCloseness(boxArea, frameArea) {
  // crude heuristic: bigger box = closer
  const ratio = boxArea / frameArea;
  if (ratio > 0.25) return "very close";
  if (ratio > 0.10) return "close";
  if (ratio > 0.03) return "ahead";
  return "far";
}

function makeCue(d, frameW, frameH) {
  const [x1, y1, x2, y2] = d.bbox;
  const cx = (x1 + x2) / 2;
  const boxW = Math.max(0, x2 - x1);
  const boxH = Math.max(0, y2 - y1);
  const area = boxW * boxH;

  const dir = pickDirection(cx, frameW);
  const close = estimateCloseness(area, frameW * frameH);

  // Keep it short for accessibility
  return `${d.label} ${dir}${close !== "ahead" ? `, ${close}` : ""}`;
}

export default function VisionTTS({
  // Pass your detections + frame size into this component
  detections = [],
  frameWidth = 640,
  frameHeight = 480,
}) {
  const [ttsReady, setTtsReady] = useState(false);
  const lastSpokenRef = useRef({ text: "", time: 0 });

  useEffect(() => {
    setTtsReady(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const speak = (text, { interrupt = true, minRepeatMs = 1400 } = {}) => {
    if (!ttsReady || !text) return;

    const now = Date.now();
    if (
      lastSpokenRef.current.text === text &&
      now - lastSpokenRef.current.time < minRepeatMs
    ) {
      return;
    }

    if (interrupt) window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 1.05;
    window.speechSynthesis.speak(u);

    lastSpokenRef.current = { text, time: now };
  };

  // Choose the most important object: highest confidence (you can change this)
  const best = useMemo(() => {
    if (!detections.length) return null;
    return [...detections].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0];
  }, [detections]);

  const cue = useMemo(() => {
    if (!best) return "";
    return makeCue(best, frameWidth, frameHeight);
  }, [best, frameWidth, frameHeight]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <button
        onClick={() =>
          speak(cue || "I don’t see anything clearly. Try moving the camera slowly.")
        }
        disabled={!ttsReady}
        style={{ padding: 12, fontSize: 16 }}
      >
        Speak what’s ahead
      </button>

      <div aria-live="polite" style={{ fontSize: 14 }}>
        <strong>Current cue:</strong> {cue || "No confident detections yet."}
      </div>
    </div>
  );
}