interface LogoAltProps {
  className?: string;
  showText?: boolean;
}

// Alternative logo design - more angular/tech-forward
export function LogoAlt({ className = "w-8 h-8", showText = false }: LogoAltProps) {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Outer square frame */}
        <rect
          x="15"
          y="15"
          width="70"
          height="70"
          className="stroke-primary"
          strokeWidth="3"
          opacity="0.3"
        />
        
        {/* Rotating square */}
        <rect
          x="30"
          y="30"
          width="40"
          height="40"
          className="fill-primary"
          opacity="0.5"
          transform="rotate(45 50 50)"
        />
        
        {/* Center pivot point */}
        <circle
          cx="50"
          cy="50"
          r="12"
          className="fill-primary"
        />
        
        {/* Arrow indicating rotation/pivot */}
        <path
          d="M50 38 L50 25 M50 25 L45 30 M50 25 L55 30"
          className="stroke-primary-foreground"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      
      {showText && (
        <span className="text-lg font-semibold tracking-tight">Pivat</span>
      )}
    </div>
  );
}
