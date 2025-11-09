import { ImageResponse } from "next/og"

// Image metadata for Apple devices
export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

// Apple icon generation - creates a medical feeding bag icon
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        borderRadius: "20px",
      }}
    >
      {/* Medical feeding bag SVG - scaled for Apple icon */}
      <svg width="140" height="140" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Feeding bag body */}
        <rect x="120" y="80" width="160" height="200" rx="20" fill="#5DADE2" stroke="#2E86AB" strokeWidth="3" />

        {/* Bag cap/top */}
        <rect x="140" y="60" width="120" height="30" rx="15" fill="#F4D03F" stroke="#D4AC0D" strokeWidth="2" />

        {/* Hanging hook */}
        <circle cx="200" cy="45" r="8" fill="#85929E" />
        <rect x="196" y="30" width="8" height="20" fill="#85929E" />

        {/* Feeding tube */}
        <path
          d="M200 280 Q220 300 240 320 Q260 340 280 360"
          stroke="#2E86AB"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Tube connector */}
        <rect x="275" y="355" width="15" height="8" rx="4" fill="#85929E" />

        {/* Volume markings */}
        <line x1="130" y1="120" x2="150" y2="120" stroke="#2E86AB" strokeWidth="2" />
        <line x1="130" y1="140" x2="150" y2="140" stroke="#2E86AB" strokeWidth="2" />
        <line x1="130" y1="160" x2="150" y2="160" stroke="#2E86AB" strokeWidth="2" />
        <line x1="130" y1="180" x2="150" y2="180" stroke="#2E86AB" strokeWidth="2" />

        {/* Liquid inside bag */}
        <rect x="130" y="200" width="140" height="70" rx="10" fill="#AED6F1" opacity="0.7" />
      </svg>
    </div>,
    {
      ...size,
    },
  )
}
