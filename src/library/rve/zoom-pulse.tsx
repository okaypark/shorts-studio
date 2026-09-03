"use client";
// [shorts-studio] Next.js 전용 코드를 Remotion에 맞게 고쳤습니다: next/image -> remotion Img, <style jsx> -> <style>
import React from "react";
import { Img } from "remotion";
interface ZoomPulseProps {
  imageUrl?: string;
  duration?: number;
  minScale?: number;
  maxScale?: number;
}

export const ZoomPulse: React.FC<ZoomPulseProps> = ({
  imageUrl = "https://images.pexels.com/photos/1726310/pexels-photo-1726310.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  duration = 4,
  minScale = 1,
  maxScale = 1.1,
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        overflow: "hidden",
      }}
    >
      <Img
        src={imageUrl}
        alt="Zoom Pulse"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          animation: `zoomPulse ${duration}s ease-in-out infinite`,
        }}
      />
      <style>{`
        @keyframes zoomPulse {
          0%,
          100% {
            transform: scale(${minScale});
          }
          50% {
            transform: scale(${maxScale});
          }
        }
      `}</style>
    </div>
  );
};

export default ZoomPulse;
