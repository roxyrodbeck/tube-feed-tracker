"use client"

interface EnteralBagIconProps {
  className?: string
  size?: number
}

export function EnteralBagIcon({ className = "", size = 24 }: EnteralBagIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Feeding bag body */}
      <path
        d="M8 4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6H18C18.5523 6 19 6.44772 19 7V16C19 17.6569 17.6569 19 16 19H8C6.34315 19 5 17.6569 5 16V7C5 6.44772 5.44772 6 6 6H8V4Z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bag top/cap */}
      <path
        d="M8 4H16V6H8V4Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Feeding tube */}
      <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      {/* Tube connector/clamp */}
      <rect x="11" y="20" width="2" height="1.5" fill="currentColor" rx="0.2" />

      {/* Volume markings on bag */}
      <path d="M7 9H9M7 11H9M7 13H9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />

      {/* Hanging hook */}
      <path d="M12 2V1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="0.5" r="0.5" fill="currentColor" />
    </svg>
  )
}
