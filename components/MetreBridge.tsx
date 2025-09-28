
import React from 'react';

interface MetreBridgeProps {
  jockeyPosition: number;
  galvanometerDeflection: number;
  isCircuitOn: boolean;
  wireRef: React.RefObject<HTMLDivElement>;
  onMouseDownOnWire: () => void;
  isBalanced: boolean;
}

const MetreBridge: React.FC<MetreBridgeProps> = ({ jockeyPosition, galvanometerDeflection, isCircuitOn, wireRef, onMouseDownOnWire, isBalanced }) => {
  
  const jockeyX = 60 + (jockeyPosition / 100) * 280;
  const circuitStrokeColor = isCircuitOn ? '#4ade80' : '#4b5563'; // Green when on
  const textFillColor = '#cbd5e1';

  return (
    <div className="relative flex flex-col items-center justify-center h-[450px] p-4 bg-gray-900/80 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm">
      <div className="w-full h-full relative">
        <svg viewBox="0 0 400 250" className="absolute w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Wooden Base */}
            <rect x="10" y="80" width="380" height="130" fill="#a16207" rx="5" />
            <rect x="15" y="85" width="370" height="120" fill="#f59e0b" stroke="#854d0e" strokeWidth="1" rx="3">
              <animate attributeName="fill" values="#f59e0b;#fbbf24;#f59e0b" dur="10s" repeatCount="indefinite" />
            </rect>

            {/* Copper Strips */}
            <defs>
                <linearGradient id="copperGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#f59e0b', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#d97706', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#f59e0b', stopOpacity: 1}} />
                </linearGradient>
            </defs>
            <g stroke="url(#copperGradient)" strokeWidth="12" strokeLinecap="round" fill="none">
                <polyline points="140,100 60,100 60,150" />
                <polyline points="180,100 220,100" />
                <polyline points="260,100 340,100 340,150" />
            </g>

             {/* Terminals */}
            <circle cx="60" cy="100" r="4" fill="#1e293b" /><circle cx="140" cy="100" r="4" fill="#1e293b" />
            <circle cx="180" cy="100" r="4" fill="#1e293b" /><circle cx="220" cy="100" r="4" fill="#1e293b" />
            <circle cx="260" cy="100" r="4" fill="#1e293b" /><circle cx="340" cy="100" r="4" fill="#1e293b" />
            <circle cx="60" cy="150" r="4" fill="#1e293b" /><circle cx="340" cy="150" r="4" fill="#1e293b" />
            <circle cx="200" cy="100" r="4" fill="#1e293b" />

            {/* Main circuit wires */}
            <path d="M 60 50 V 100" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 340 50 V 100" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 60 50 H 145" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 255 50 H 340" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 175 50 H 225" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            
            {/* Battery (Power Supply) */}
            <g transform="translate(150, 30)">
                <rect x="-25" y="0" width="50" height="20" fill="#1e293b" rx="3" stroke="#475569" />
                <rect x="-23" y="2" width="46" height="16" fill="#0f172a" rx="2" />
                <text x="0" y="10" textAnchor="middle" fontSize="5" fill={textFillColor} className="font-mono">POWER</text>
                <circle cx="-18" cy="14" r="1.5" fill={isCircuitOn ? '#4ade80' : '#4b5563'} stroke="#94a3b8" strokeWidth="0.5" />
                <text x="12" y="16" fontSize="8" fill={textFillColor} className="font-bold">E</text>
            </g>
            
            {/* Key (K) */}
            <g transform="translate(240, 30)">
                <rect x="-15" y="12" width="30" height="8" fill="#1e293b" rx="2"/>
                <circle cx="-10" cy="16" r="3" fill="#f59e0b" /><circle cx="10" cy="16" r="3" fill="#f59e0b" />
                <g style={{ transition: 'transform 0.3s ease-in-out', transform: isCircuitOn ? 'translateY(0px)' : 'translateY(-12px)' }}>
                  <rect x="-12" y="0" width="24" height="10" rx="2" fill="#111827"/>
                  <rect x="-10" y="1" width="20" height="8" rx="2" fill="#eab308"/>
                  <rect x="-1" y="-3" width="2" height="6" fill="#1e293b" />
                </g>
                <text x="0" y="32" textAnchor="middle" fontSize="10" fill={textFillColor} className="font-bold">K</text>
            </g>

            {/* Known Resistance Box (R) */}
            <g>
                <path d="M 140 100 V 70 H 180 V 100" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
                <rect x="135" y="50" width="50" height="20" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1"/>
                <text x="160" y="63" textAnchor="middle" fontSize="6" fill={textFillColor} className="font-mono">R. BOX</text>
                <text x="160" y="45" textAnchor="middle" fontSize="10" className="font-bold" fill={textFillColor}>R</text>
            </g>

             {/* Unknown Resistance Coil (S) */}
            <g>
                <path d="M 220 100 V 70 H 260 V 100" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
                <path transform="translate(222, 55)" d="M 0 5 C 5 0, 10 10, 15 5 C 20 0, 25 10, 30 5 C 35 0, 40 10, 45 5" stroke="#9ca3af" strokeWidth="1.5" fill="none"/>
                <text x="240" y="45" textAnchor="middle" fontSize="10" className="font-bold" fill={textFillColor}>S</text>
            </g>

            {/* Metre Wire */}
            <line x1="60" y1="190" x2="340" y2="190" stroke="#e5e7eb" strokeWidth="2.5" className="drop-shadow-sm" />
            <path d="M 60 150 V 190" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 340 150 V 190" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            
            {/* Galvanometer and Connections */}
            <g>
                <path d="M 200 100 V 150" stroke={textFillColor} strokeWidth="1.5" fill="none" />
                <rect x="175" y="150" width="50" height="25" fill="#f1f5f9" rx="3" stroke="#4b5563" strokeWidth="1.5" className={isBalanced ? 'shadow-[0_0_15px_rgba(56,189,248,0.7)]' : ''}/>
                <rect x="180" y="152" width="40" height="15" fill="white" />
                <line x1="200" y1="152" x2="200" y2="167" stroke="#d1d5db" strokeWidth="0.5" />
                <text x="200" y="172" textAnchor="middle" fontSize="10" className="font-bold" fill="#1e293b">G</text>
                <line 
                    x1="200" y1="165" x2="200" y2="154" 
                    stroke="#dc2626" 
                    strokeWidth="1.5" 
                    transform={`rotate(${galvanometerDeflection}, 200, 165)`}
                    className="origin-bottom transition-transform duration-100"
                />
                {isCircuitOn && <path d={`M 200 175 Q ${200 + (jockeyX - 200)/1.5} 185, ${jockeyX} 190`} stroke="#ef4444" strokeWidth="1.5" fill="none" />}
            </g>

            {/* Jockey */}
            <g transform={`translate(${jockeyX}, 190)`} className={`${!isCircuitOn ? 'opacity-50' : ''} ${isBalanced ? 'drop-shadow-[0_0_5px_theme(colors.cyan.400)]' : ''}`}>
                <path d="M 0 0 L -2 -15 L 2 -15 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
                <rect x="-4" y="-25" width="8" height="10" rx="2" fill="#1e293b" />
                <text x="0" y="-30" textAnchor="middle" fontSize="10" fill={textFillColor} className="font-bold">D</text>
            </g>

             {/* Labels for points A, C */}
             <text x="50" y="185" textAnchor="end" fontSize="10" fill="black" className="font-bold">A</text>
             <text x="350" y="185" textAnchor="start" fontSize="10" fill="black" className="font-bold">C</text>

            {/* Dimension lines for l and 100-l */}
            <g className="text-[8px] font-mono" fill={textFillColor}>
                <path d={`M 60 200 V 204 H ${jockeyX}`} stroke={textFillColor} strokeWidth="0.5" fill="none" />
                <path d={`M ${jockeyX} 190 V 204`} stroke={textFillColor} strokeWidth="0.5" fill="none" />
                <text x={60 + (jockeyX-60)/2} y="212" textAnchor="middle">l</text>
                <path d={`M ${jockeyX} 190 V 204 H 340 V 200`} stroke={textFillColor} strokeWidth="0.5" fill="none" />
                <text x={jockeyX + (340-jockeyX)/2} y="212" textAnchor="middle">100 - l</text>
            </g>
        </svg>

        {/* Interaction layer and Scale, positioned absolutely over the SVG */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
             <div 
              ref={wireRef as React.RefObject<HTMLDivElement>} 
              className="absolute h-8 -translate-y-1/2 cursor-pointer pointer-events-auto"
              style={{
                top: '76%', // Corresponds to y=190 in a 250px viewbox
                left: '15%',    // Corresponds to x=60 in a 400px viewbox
                width: '70%',   // Corresponds to width=280 in a 400px viewbox
              }}
              onMouseDown={onMouseDownOnWire}
             ></div>
        </div>
      </div>
      
        {/* Metre Scale */}
        <div className="w-[70%] h-6 bg-amber-200 rounded-sm shadow-inner flex items-center px-1 absolute bottom-[14%] border-t-2 border-amber-300">
            {[...Array(11)].map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-start relative h-full">
                <span className="text-black text-[10px] font-semibold -ml-1">{i * 10}</span>
                <div className="w-px h-3 bg-black absolute bottom-0"></div>
                {[...Array(9)].map((_, j) => (
                    <div key={j} className={`w-px ${j === 4 ? 'h-2' : 'h-1.5'} bg-black absolute bottom-0`} style={{ left: `${(j+1)*10}%`}}></div>
                ))}
            </div>
            ))}
        </div>
    </div>
  );
};

export default MetreBridge;
