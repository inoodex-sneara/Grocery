import React from "react";

interface CustomBagIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  strokeWidth?: number | string;
}

/**
 * Custom Shopping Bag Icon matching the exact tote/handbag design:
 * - Arch handle on top with connection notches
 * - Trapezoid tote bag body with smooth rounded bottom
 * - Horizontal crease / accent line across the front
 */
export function CustomBagIcon({
  className = "w-5 h-5",
  strokeWidth = 2.2,
  ...props
}: CustomBagIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Top Handle Loop with tabs extending inside the rim */}
      <path d="M9 10V5.5a3 3 0 0 1 6 0V10" />

      {/* Bag Body (Trapezoid silhouette with rounded bottom) */}
      <path d="M4.8 8.5h14.4l-1.3 10.3a2.4 2.4 0 0 1-2.4 2.2H8.5a2.4 2.4 0 0 1-2.4-2.2L4.8 8.5Z" />

      {/* Horizontal Crease / Accent Line */}
      <path d="M7.5 15.5h9" />
    </svg>
  );
}

export default CustomBagIcon;

