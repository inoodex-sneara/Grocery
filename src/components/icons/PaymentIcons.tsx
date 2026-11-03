import React from "react";

/**
 * Official bKash Origami Bird Vector Icon
 */
export function BkashIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="198 0 200 185"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="bKash"
    >
      <path d="m273.403 86.71 11.259 50.61 73.672-37.301z" fill="#D12053" />
      <path d="m294.335 11.099-20.916 75.627 84.915 13.293z" fill="#E2136E" />
      <path d="m204.374 0 87.815 10.49-20.756 75.211z" fill="#D12053" />
      <path d="m203.654 14.799h9.801l27.435 35.09z" fill="#9E1638" />
      <path d="m360.689 99.538-25.545-35.331 41.304-7.415z" fill="#D12053" />
      <path d="m356.413 109.917 2.594-7.896-64.432 32.736z" fill="#E2136E" />
      <path d="m271.609 88.712 13.437 60.459-39.927 32.464z" fill="#9E1638" />
      <path d="m372.412 74.778 23.447-.384-16.944-17.266z" fill="#E2136E" />
    </svg>
  );
}

/**
 * bKash Brand Badge with Origami Bird on Pink Background
 */
export function BkashBadge({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-[#E2136E] p-2 shadow-2xs ${className}`}
    >
      <BkashIcon className="h-full w-full object-contain filter drop-shadow-xs" />
    </div>
  );
}

/**
 * Nagad Flame Ribbon Vector Icon
 */
export function NagadIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Nagad"
    >
      <circle cx="50" cy="50" r="48" fill="#FFF7ED" />
      {/* Nagad circular flame dynamic ribbon */}
      <path
        d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15ZM48 72C35.85 72 26 62.15 26 50C26 37.85 35.85 28 48 28C54.2 28 59.8 30.6 63.8 34.8L54.6 44C52.9 42.8 50.6 42 48 42C43.6 42 40 45.6 40 50C40 54.4 43.6 58 48 58C52.4 58 56 54.4 56 50H48V42H68V50C68 62.15 58.15 72 48 72Z"
        fill="url(#nagad-grad)"
      />
      <defs>
        <linearGradient
          id="nagad-grad"
          x1="15"
          y1="15"
          x2="85"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F7941D" />
          <stop offset="1" stopColor="#ED1C24" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Cash on Delivery Vector Icon
 */
export function CodIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Cash on Delivery"
    >
      <circle cx="50" cy="50" r="48" fill="#ECFDF5" />
      {/* Cash Note */}
      <rect
        x="22"
        y="30"
        width="56"
        height="34"
        rx="5"
        fill="#10B981"
        stroke="#059669"
        strokeWidth="2.5"
      />
      {/* Inner Frame */}
      <rect
        x="26"
        y="34"
        width="48"
        height="26"
        rx="3"
        fill="none"
        stroke="#A7F3D0"
        strokeWidth="1.5"
      />
      {/* Center Taka/Value Circle */}
      <circle cx="50" cy="47" r="7" fill="#047857" />
      <text
        x="50"
        y="51"
        fontSize="10"
        fontWeight="bold"
        fill="#FFFFFF"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        ৳
      </text>
      {/* Overlapping Coins */}
      <circle
        cx="34"
        cy="65"
        r="11"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="2"
      />
      <circle
        cx="48"
        cy="68"
        r="11"
        fill="#F59E0B"
        stroke="#B45309"
        strokeWidth="2"
      />
      <text
        x="48"
        y="72"
        fontSize="11"
        fontWeight="bold"
        fill="#78350F"
        textAnchor="middle"
      >
        ৳
      </text>
    </svg>
  );
}

/**
 * Credit & Debit Card Duo Vector Icon
 */
export function CardIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Cards"
    >
      <circle cx="50" cy="50" r="48" fill="#EEF2FF" />
      {/* Card Base */}
      <rect
        x="18"
        y="28"
        width="64"
        height="44"
        rx="6"
        fill="#312E81"
        stroke="#4338CA"
        strokeWidth="2"
      />
      {/* Magnetic stripe or gradient */}
      <rect x="18" y="38" width="64" height="8" fill="#1E1B4B" />
      {/* Chip */}
      <rect
        x="26"
        y="52"
        width="11"
        height="9"
        rx="2"
        fill="#FBBF24"
        stroke="#D97706"
        strokeWidth="1"
      />
      {/* Interlocking Circles (Mastercard style) */}
      <circle cx="63" cy="56" r="6" fill="#EF4444" fillOpacity="0.9" />
      <circle cx="70" cy="56" r="6" fill="#F59E0B" fillOpacity="0.85" />
    </svg>
  );
}

/**
 * Upay Vector Icon
 */
export function UpayIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Upay"
    >
      <circle cx="50" cy="50" r="48" fill="#F0FDFA" />
      {/* Upay Blue/Teal 'u' loop */}
      <path
        d="M32 30V54C32 63.94 40.06 72 50 72C59.94 72 68 63.94 68 54V30H57V54C57 57.87 53.87 61 50 61C46.13 61 43 57.87 43 54V30H32Z"
        fill="url(#upay-grad)"
      />
      <circle cx="50" cy="22" r="5" fill="#0D9488" />
      <defs>
        <linearGradient
          id="upay-grad"
          x1="32"
          y1="30"
          x2="68"
          y2="72"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0284C7" />
          <stop offset="1" stopColor="#0D9488" />
        </linearGradient>
      </defs>
    </svg>
  );
}

