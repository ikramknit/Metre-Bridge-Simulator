
import React from 'react';

interface MetreBridgeProps {
  jockeyPosition: number;
  galvanometerDeflection: number;
  isCircuitOn: boolean;
  wireRef: React.RefObject<HTMLDivElement>;
  onMouseDownOnWire: () => void;
  isBalanced: boolean;
}

const ResistorSymbol: React.FC<{ x: number; y: number; width: number; height: number }> = ({ x, y, width, height }) => {
    const segment = width / 7;
    const path = `M ${x} ${y} l ${segment/2} 0 l ${segment} ${height/2} l ${segment} -${height} l ${segment} ${height} l ${segment} -${height} l ${segment} ${height} l ${segment/2} 0`;
    return <path d={path} stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
};


const MetreBridge: React.FC<MetreBridgeProps> = ({ jockeyPosition, galvanometerDeflection, isCircuitOn, wireRef, onMouseDownOnWire, isBalanced }) => {
  
  // Adjusted coordinate system for a 280-pixel wide wire starting at x=60
  const jockeyX = 60 + (jockeyPosition / 100) * 280;
  const circuitStrokeColor = isCircuitOn ? '#f87171' : '#4b5563';
  const textFillColor = '#cbd5e1';

  return (
    <div className="relative flex flex-col items-center justify-center h-[400px] p-4 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="w-full h-full relative">
        <svg viewBox="0 0 400 220" className="absolute w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Main Wires */}
            <path d="M 60 20 H 90" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 110 20 H 290" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 310 20 H 340" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 60 20 V 50" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 340 20 V 50" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            
            {/* Battery (E) */}
            <g transform="translate(100, 20)">
                <line x1="0" y1="-8" x2="0" y2="8" stroke={textFillColor} strokeWidth="1.5" />
                <line x1="-10" y1="0" x2="10" y2="0" stroke={textFillColor} strokeWidth="1.5" />
                <line x1="-5" y1="-8" x2="5" y2="-8" stroke={textFillColor} strokeWidth="1.5" />
                <text x="15" y="5" fontSize="10" fill={textFillColor} className="font-bold">E</text>
            </g>

            {/* Key (K) */}
            <g transform="translate(300, 20)">
                <circle cx="-10" cy="0" r="3" fill="none" stroke={textFillColor} strokeWidth="1.5" />
                <circle cx="10" cy="0" r="3" fill="none" stroke={textFillColor} strokeWidth="1.5" />
                 { isCircuitOn && <line x1="-7" y1="0" x2="7" y2="0" stroke={circuitStrokeColor} strokeWidth="2" />}
                <text x="0" y="-8" fontSize="10" fill={textFillColor} className="font-bold">K</text>
            </g>

            {/* Copper Strips */}
            <g stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" fill="none">
                <polyline points="140,60 60,60 60,110" />
                <polyline points="180,60 220,60" />
                <polyline points="260,60 340,60 340,110" />
            </g>

            {/* Connecting wires for components */}
            <path d="M 60 50 V 60" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 340 50 V 60" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 60 110 V 150" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 340 110 V 150" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />

            {/* Known Resistance R */}
            <g>
                <path d="M 140 60 H 145" stroke={textFillColor} strokeWidth="1" fill="none" />
                <ResistorSymbol x={145} y={60} width={30} height={10} />
                <path d="M 175 60 H 180" stroke={textFillColor} strokeWidth="1" fill="none" />
                <text x="160" y="45" textAnchor="middle" fontSize="8" fill={textFillColor}>Known</text>
                <text x="160" y="36" textAnchor="middle" fontSize="8" fill={textFillColor}>resistance</text>
                <text x="160" y="25" textAnchor="middle" fontSize="10" className="font-bold" fill={textFillColor}>R</text>
            </g>

             {/* Unknown Resistance S */}
            <g>
                <path d="M 220 60 H 225" stroke={textFillColor} strokeWidth="1" fill="none" />
                <ResistorSymbol x={225} y={60} width={30} height={10} />
                <path d="M 255 60 H 260" stroke={textFillColor} strokeWidth="1" fill="none" />
                <text x="240" y="45" textAnchor="middle" fontSize="8" fill={textFillColor}>Unknown</text>
                <text x="240" y="36" textAnchor="middle" fontSize="8" fill={textFillColor}>resistance</text>
            </g>

            {/* Metre Wire */}
            <line x1="60" y1="150" x2="340" y2="150" stroke="#9ca3af" strokeWidth="1.5" />
            
            {/* Galvanometer and Connections */}
            <g>
                <path d="M 200 60 V 165" stroke={textFillColor} strokeWidth="1" fill="none" />
                <circle cx="200" cy="180" r="12" fill="#e5e7eb" stroke="#4b5563" strokeWidth="1.5" className={isBalanced ? 'shadow-[0_0_15px_rgba(56,189,248,0.7)]' : ''}/>
                <text x="200" y="184" textAnchor="middle" fontSize="10" className="font-bold" fill="black">G</text>
                {/* Galvanometer Needle */}
                <line 
                    x1="200" y1="180" x2="200" y2="170" 
                    stroke="#dc2626" 
                    strokeWidth="1.5" 
                    transform={`rotate(${galvanometerDeflection}, 200, 180)`}
                    className="origin-center transition-transform duration-100"
                />
                {/* Dynamic wire to Jockey */}
                {isCircuitOn && <path d={`M 200 192 Q ${200 + (jockeyX - 200)/1.5} 175, ${jockeyX} 152`} stroke="#ef4444" strokeWidth="1" fill="none" />}
            </g>

            {/* Jockey */}
            <g transform={`translate(${jockeyX}, 150)`} className={`${!isCircuitOn ? 'opacity-50' : ''} ${isBalanced ? 'drop-shadow-[0_0_5px_theme(colors.cyan.400)]' : ''}`}>
                <path d="M 0 0 L -4 8 L 4 8 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
                <text x="0" y="25" textAnchor="middle" fontSize="10" fill={textFillColor} className="font-bold">D</text>
            </g>

             {/* Labels for points A, B, C */}
             <text x="50" y="140" textAnchor="end" fontSize="10" fill={textFillColor} className="font-bold">A</text>
             <text x="200" y="80" textAnchor="middle" fontSize="10" fill={textFillColor} className="font-bold">B</text>
             <text x="350" y="140" textAnchor="start" fontSize="10" fill={textFillColor} className="font-bold">C</text>

            {/* Dimension lines for l and 100-l */}
            <g className="text-[8px] font-mono" fill={textFillColor}>
                {/* Line for 'l' */}
                <path d={`M 60 158 V 162 H ${jockeyX}`} stroke={textFillColor} strokeWidth="0.5" fill="none" />
                <path d={`M ${jockeyX} 152 V 162`} stroke={textFillColor} strokeWidth="0.5" fill="none" />
                <text x={60 + (jockeyX-60)/2} y="170" textAnchor="middle">l</text>
                 {/* Line for '100-l' */}
                <path d={`M ${jockeyX} 152 V 162 H 340 V 158`} stroke={textFillColor} strokeWidth="0.5" fill="none" />
                <text x={jockeyX + (340-jockeyX)/2} y="170" textAnchor="middle">100 - l</text>
            </g>
            
            {/* Current Labels */}
            <g className="font-bold" fontSize="10" fill={circuitStrokeColor}>
                <text x="45" y="40">I</text>
                <path d="M 48 45 L 48 35 L 44 40" fill={circuitStrokeColor} />
                <text x="350" y="40">I</text>
                <path d="M 352 35 L 352 45 L 356 40" fill={circuitStrokeColor} />
                 <text x="160" y="75" textAnchor="middle">I₁</text>
                 <text x="50" y="148">I₂</text>
                 <path d="M 70 148 L 80 148 L 75 144" fill={circuitStrokeColor} />
            </g>
        </svg>

        {/* Interaction layer and Scale, positioned absolutely over the SVG */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {/* Clickable wire area */}
             <div 
              ref={wireRef as React.RefObject<HTMLDivElement>} 
              className="absolute h-8 -translate-y-1/2 cursor-pointer pointer-events-auto"
              style={{
                top: '68.18%', // Corresponds to y=150 in a 220px viewbox
                left: '15%',    // Corresponds to x=60 in a 400px viewbox
                width: '70%',   // Corresponds to width=280 in a 400px viewbox
              }}
              onMouseDown={onMouseDownOnWire}
             ></div>
        </div>
      </div>
        {/* Metre Scale */}
        <div className="w-[70%] h-6 bg-gray-200 rounded-sm shadow-inner flex items-center px-1 absolute bottom-[18%]">
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
