import "../fonts.css"

export default function Logo() {
  return (
    <svg width="220" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1edf90", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#11c55e", stopOpacity: 1 }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <style>
        {`
          .logo-text { font-weight: 700; }
          .main-text { font-size: 22px; fill: #059669; }
          .sub-text { font-size: 20px; fill: #047857; letter-spacing: 1px; }
          .question-mark { font-size: 35px; fill: white; filter: url(#glow); }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .pulse {
            animation: pulse 3s infinite;
            transform-origin: center;
            transform-box: fill-box;
          }
        `}
      </style>

      <rect
        x="10"
        y="23"
        width="60"
        height="60"
        rx="22"
        fill="url(#bgGradient)"
        className="pulse"
      />

      <text
        x="40"
        y="67"
        textAnchor="middle"
        className="logo-text question-mark"
      >
        ?
      </text>

      <text x="101" y="49" className="logo-text sub-text">
        Ask Me
      </text>
      <text x="82" y="75" className="logo-text main-text">
        ANYTHING
      </text>
    </svg>
  )
}
