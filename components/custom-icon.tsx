"use client"

interface CustomIconProps {
  className?: string
  size?: number
}

export function CustomIcon({ className = "", size = 24 }: CustomIconProps) {
  // Make the icon 20% larger than the container for better visibility
  const iconSize = Math.round(size * 1.2)

  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <img
        src="/apple-touch-icon.png"
        alt="Tube Feed Tracker"
        width={iconSize}
        height={iconSize}
        className="w-full h-full object-contain"
        style={{ width: iconSize, height: iconSize }}
      />
    </div>
  )
}
