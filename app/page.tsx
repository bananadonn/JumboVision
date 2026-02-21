import React from "react";
export default function App(){

    // const videoRef = useRef<HTMLVideoElement>(null);
    // const [cameraOpen, setCameraOpen] = useState(false);

    return(
        <div>
            <div className="font-bold text-center text-4xl w-full bg-[#2a1a2e] py-4 px-6 flex items-center">
                <img src="https://i.imgur.com/L29RYeB.png" height={45} width={45}/>
                <h1>JumboVision</h1>
            </div>
            <div className="font-bold mt-40 px-40 text-4xl flex flex-row justify-between">
                <div className="flex flex-col items-center">
                    <h2>What We Do?</h2>
                    <h3 className="text-lg max-w-[300px] text-center">To Be inserted info about what the website does</h3>
                </div>
                <div className="flex flex-col items-center">
                    <h3>Start Recording</h3>
                    <h4 className="text-lg max-w-[220px] text-center">Click Button below to start recording</h4>
                </div>
            </div>
            
        </div>
        
  )
}
