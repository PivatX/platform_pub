interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "w-8 h-8", showText = false }: LogoProps) {
  return (
    <div className="flex items-center">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Outer rotating frame */}
        <path
          d="M50 10 L70 25 L70 50 L50 65 L30 50 L30 25 Z"
          className="fill-primary"
          opacity="0.2"
        />
        
        {/* Middle rotating element */}
        <path
          d="M50 20 L65 32 L65 50 L50 62 L35 50 L35 32 Z"
          className="fill-primary"
          opacity="0.5"
        />
        
        {/* Inner core - the pivot point */}
        <circle
          cx="50"
          cy="50"
          r="15"
          className="fill-primary"
        />
        
        {/* Center dot - the exact pivot */}
        <circle
          cx="50"
          cy="50"
          r="5"
          className="fill-primary-foreground"
        />
        
        {/* Dynamic accent line suggesting rotation */}
        <path
          d="M50 35 L50 15"
          className="stroke-primary-foreground"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      
      {showText && (
        <span className="text-xl font-semibold tracking-tight -ml-1">Pivat</span>
      )}
    </div>
  );
}
