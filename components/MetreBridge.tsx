
import React, { useState, useEffect } from 'react';

interface MetreBridgeProps {
  jockeyPosition: number;
  galvanometerDeflection: number;
  isCircuitOn: boolean;
  setIsCircuitOn: (isOn: boolean) => void;
  wireRef: React.RefObject<HTMLDivElement>;
  onMouseDownOnWire: () => void;
  isBalanced: boolean;
  knownResistance: number;
  setKnownResistance: (r: number) => void;
  wireLength: number;
  setWireLength: (l: number) => void;
  wireDiameter: number;
  setWireDiameter: (d: number) => void;
}

const PLUG_VALUES = [5, 2, 2, 1];

const ResistancePlug: React.FC<{ value: number; x: number; y: number; isOut: boolean; onClick: () => void, isCircuitOn: boolean }> = ({ value, x, y, isOut, onClick, isCircuitOn }) => (
  <g onClick={onClick} className={`cursor-pointer ${!isCircuitOn ? 'opacity-50 pointer-events-none' : ''} group`}>
    <circle cx={x} cy={y} r="5" fill="#a16207" stroke="#6b21a8" strokeWidth="0.5" />
    <circle cx={x} cy={y} r="4" fill="#1e293b" />
    <g style={{ transition: 'transform 0.2s ease-in-out' }} transform={isOut ? `translate(12, -8) rotate(15)` : 'translate(0,0)'}>
        <circle cx={x} cy={y} r="4.5" fill="#f59e0b" stroke="#854d0e" strokeWidth="0.5" className="group-hover:stroke-cyan-400" />
        <rect x={x - 2} y={y - 10} width="4" height="6" rx="1" fill="#1e293b" />
    </g>
    <text x={x} y={y - 15} textAnchor="middle" fontSize="6" fill="#fde047" className="font-mono">{value}Ω</text>
  </g>
);

const WireSettingsPopup: React.FC<{
  wireLength: number;
  setWireLength: (l: number) => void;
  wireDiameter: number;
  setWireDiameter: (d: number) => void;
  onClose: () => void;
}> = ({ wireLength, setWireLength, wireDiameter, setWireDiameter, onClose }) => (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800/80 backdrop-blur-sm border border-cyan-500 rounded-lg p-4 w-64 shadow-2xl z-20">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-cyan-400">Unknown Wire Settings</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
      </div>
      <div className="space-y-3">
        <div>
            <label className="text-sm">Length (L): <span className="font-mono text-cyan-300">{wireLength.toFixed(1)} m</span></label>
            <input type="range" min={0.5} max={2} step={0.1} value={wireLength} onChange={e => setWireLength(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
            <label className="text-sm">Diameter (d): <span className="font-mono text-cyan-300">{wireDiameter.toFixed(2)} mm</span></label>
            <input type="range" min={0.1} max={1.0} step={0.01} value={wireDiameter} onChange={e => setWireDiameter(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>
    </div>
);


const MetreBridge: React.FC<MetreBridgeProps> = (props) => {
  const { jockeyPosition, galvanometerDeflection, isCircuitOn, setIsCircuitOn, wireRef, onMouseDownOnWire, isBalanced, knownResistance, setKnownResistance, wireLength, setWireLength, wireDiameter, setWireDiameter } = props;
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [plugsOut, setPlugsOut] = useState<boolean[]>(() => {
    const initialPlugs: boolean[] = [false, false, false, false];
    let r = knownResistance;
    if (r >= 5) { initialPlugs[0] = true; r -= 5; }
    if (r >= 2) { initialPlugs[1] = true; r -= 2; }
    if (r >= 2) { initialPlugs[2] = true; r -= 2; }
    if (r >= 1) { initialPlugs[3] = true; r -= 1; }
    return initialPlugs;
  });

  useEffect(() => {
    const newPlugs: boolean[] = [false, false, false, false];
    let r = knownResistance;
    if (r >= 5) { newPlugs[0] = true; r -= 5; }
    if (r >= 2) { newPlugs[1] = true; r -= 2; }
    if (r >= 2) { newPlugs[2] = true; r -= 2; }
    if (r >= 1) { newPlugs[3] = true; }
    if (JSON.stringify(newPlugs) !== JSON.stringify(plugsOut)) {
        setPlugsOut(newPlugs);
    }
  }, [knownResistance]);
  

  const handlePlugClick = (index: number) => {
    const newPlugsOut = [...plugsOut];
    newPlugsOut[index] = !newPlugsOut[index];
    setPlugsOut(newPlugsOut);
    
    const newResistance = newPlugsOut.reduce((acc, isOut, i) => {
      return acc + (isOut ? PLUG_VALUES[i] : 0);
    }, 0);
    
    setKnownResistance(newResistance);
  };

  const jockeyX = 60 + (jockeyPosition / 100) * 280;
  const circuitStrokeColor = isCircuitOn ? '#4ade80' : '#4b5563';
  const textFillColor = '#cbd5e1';

  return (
    <div className="relative flex flex-col items-center justify-center h-[450px] p-4 bg-gray-900/80 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-repeat">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/50 to-gray-900/80"></div>
      
      {isSettingsOpen && <WireSettingsPopup wireLength={wireLength} setWireLength={setWireLength} wireDiameter={wireDiameter} setWireDiameter={setWireDiameter} onClose={() => setIsSettingsOpen(false)} />}
      
      <style>{`
        @keyframes march {
          to {
            stroke-dashoffset: 20;
          }
        }
        .current-flow {
          stroke-dasharray: 10 10;
          animation: march 1.5s linear infinite;
        }
      `}</style>
      <div className="w-full h-full relative">
        <svg viewBox="0 0 400 250" className="absolute w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fde047" />
              </marker>
            </defs>
            <rect x="10" y="80" width="380" height="130" fill="#a16207" rx="5" />
            <rect x="15" y="85" width="370" height="120" fill="#f59e0b" stroke="#854d0e" strokeWidth="1" rx="3" />
            <g stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" fill="none">
                <polyline points="140,100 60,100 60,150" />
                <polyline points="180,100 220,100" />
                <polyline points="260,100 340,100 340,150" />
            </g>
            <circle cx="60" cy="100" r="4" fill="#1e293b" /><circle cx="140" cy="100" r="4" fill="#1e293b" />
            <circle cx="180" cy="100" r="4" fill="#1e293b" /><circle cx="220" cy="100" r="4" fill="#1e293b" />
            <circle cx="260" cy="100" r="4" fill="#1e293b" /><circle cx="340" cy="100" r="4" fill="#1e293b" />
            <circle cx="60" cy="150" r="4" fill="#1e293b" /><circle cx="340" cy="150" r="4" fill="#1e293b" />
            <circle cx="200" cy="100" r="4" fill="#1e293b" />
            <path d="M 60 50 V 100" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 340 50 V 100" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 60 50 H 145" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 255 50 H 340" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 175 50 H 225" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            
            <g transform="translate(170, 20)" className="cursor-pointer" onClick={() => setIsCircuitOn(!isCircuitOn)}>
                <rect x="-25" y="0" width="60" height="30" fill="#111827" rx="4" stroke="#475569" strokeWidth="1.5"/>
                <rect x="-23" y="2" width="56" height="26" fill="#1e293b" rx="2" />
                <rect x="15" y="5" width="15" height="10" rx="2" fill={isCircuitOn ? '#22c55e' : '#ef4444'} className="transition-colors duration-300" stroke={isCircuitOn ? '#166534' : '#7f1d1d'} strokeWidth="1" />
                <circle cx="22.5" cy="22" r="2.5" fill={isCircuitOn ? '#4ade80' : '#4b5563'} stroke="#94a3b8" strokeWidth="0.5" />
                <text x="-5" y="15" textAnchor="middle" fontSize="8" fill={textFillColor} className="font-mono font-bold">POWER</text>
            </g>
            
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

            <g>
              <path d="M 140 100 V 70 H 180 V 100" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
              <rect x="120" y="45" width="80" height="30" rx="3" fill="#854d0e" stroke="#422006" strokeWidth="1"/>
              <rect x="122" y="47" width="76" height="26" rx="2" fill="#a16207"/>
              <rect x="125" y="55" width="10" height="10" fill="#f59e0b"/><rect x="140" y="55" width="10" height="10" fill="#f59e0b"/><rect x="155" y="55" width="10" height="10" fill="#f59e0b"/><rect x="170" y="55" width="10" height="10" fill="#f59e0b"/><rect x="185" y="55" width="10" height="10" fill="#f59e0b"/>
              <ResistancePlug value={PLUG_VALUES[0]} x={132.5} y={60} isOut={plugsOut[0]} onClick={() => handlePlugClick(0)} isCircuitOn={isCircuitOn} />
              <ResistancePlug value={PLUG_VALUES[1]} x={147.5} y={60} isOut={plugsOut[1]} onClick={() => handlePlugClick(1)} isCircuitOn={isCircuitOn} />
              <ResistancePlug value={PLUG_VALUES[2]} x={162.5} y={60} isOut={plugsOut[2]} onClick={() => handlePlugClick(2)} isCircuitOn={isCircuitOn} />
              <ResistancePlug value={PLUG_VALUES[3]} x={177.5} y={60} isOut={plugsOut[3]} onClick={() => handlePlugClick(3)} isCircuitOn={isCircuitOn} />
              <text x="160" y="40" textAnchor="middle" fontSize="8" className="font-bold" fill={textFillColor}>R = {knownResistance} Ω</text>
            </g>

            <g>
                <path d="M 220 100 V 70 H 260 V 100" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
                <path transform="translate(222, 55)" d="M 0 5 C 5 0, 10 10, 15 5 C 20 0, 25 10, 30 5 C 35 0, 40 10, 45 5" stroke="#9ca3af" strokeWidth="1.5" fill="none"/>
                <text x="240" y="45" textAnchor="middle" fontSize="10" className="font-bold" fill={textFillColor}>S</text>
                <g onClick={() => setIsSettingsOpen(true)} className="cursor-pointer">
                    <circle cx="265" cy="60" r="6" fill="#1e293b" className="opacity-50 hover:opacity-100" />
                    <path d="M263,58 l4,4 m0,-4 l-4,4" stroke="white" strokeWidth="1.5" />
                </g>
            </g>

            <line x1="60" y1="190" x2="340" y2="190" stroke="#e5e7eb" strokeWidth="2.5" className="drop-shadow-sm" />
            <path d="M 60 150 V 190" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <path d="M 340 150 V 190" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />

            <g stroke="#fde047" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" className={isCircuitOn ? 'current-flow' : 'hidden'}>
                <path d="M 195 50 H 225" /><path d="M 255 50 H 340 V 100" />
                <path d="M 140 100 H 60" /><path d="M 220 100 H 180" /><path d="M 260 100 H 220" />
                <path d="M 60 100 V 50 H 145" />
                <path d="M 340 100 V 150 V 190 H 60 V 150 V 100" />
            </g>
            
            <g>
                <path d="M 200 100 V 150" stroke={textFillColor} strokeWidth="1.5" fill="none" />
                <rect x="175" y="150" width="50" height="25" fill="#f1f5f9" rx="3" stroke="#4b5563" strokeWidth="1.5" className={isBalanced ? 'shadow-[0_0_15px_rgba(56,189,248,0.7)]' : ''}/>
                <rect x="180" y="152" width="40" height="15" fill="white" />
                <line x1="200" y1="152" x2="200" y2="167" stroke="#d1d5db" strokeWidth="0.5" />
                <text x="200" y="172" textAnchor="middle" fontSize="10" className="font-bold" fill="#1e293b">G</text>
                <line x1="200" y1="165" x2="200" y2="154" stroke="#dc2626" strokeWidth="1.5" transform={`rotate(${galvanometerDeflection}, 200, 165)`} className="origin-bottom transition-transform duration-100" />
                {isCircuitOn && <path d={`M 200 175 Q ${200 + (jockeyX - 200)/1.5} 185, ${jockeyX} 190`} stroke="#ef4444" strokeWidth="1.5" fill="none" />}
            </g>

            <g transform={`translate(${jockeyX}, 190)`} className={`${!isCircuitOn ? 'opacity-50' : ''} ${isBalanced ? 'drop-shadow-[0_0_5px_theme(colors.cyan.400)]' : ''}`}>
                <path d="M 0 0 L -2 -15 L 2 -15 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
                <rect x="-4" y="-25" width="8" height="10" rx="2" fill="#1e293b" />
                <text x="0" y="-30" textAnchor="middle" fontSize="10" fill={textFillColor} className="font-bold">D</text>
            </g>

             <text x="50" y="185" textAnchor="end" fontSize="10" fill="black" className="font-bold">A</text>
             <text x="350" y="185" textAnchor="start" fontSize="10" fill="black" className="font-bold">C</text>
            <g className="text-[8px] font-mono" fill={textFillColor}>
                <path d={`M 60 200 V 204 H ${jockeyX}`} stroke={textFillColor} strokeWidth="0.5" fill="none" />
                <path d={`M ${jockeyX} 190 V 204`} stroke={textFillColor} strokeWidth="0.5" fill="none" />
                <text x={60 + (jockeyX-60)/2} y="212" textAnchor="middle">l</text>
                <path d={`M ${jockeyX} 190 V 204 H 340 V 200`} stroke={textFillColor} strokeWidth="0.5" fill="none" />
                <text x={jockeyX + (340-jockeyX)/2} y="212" textAnchor="middle">100 - l</text>
            </g>
        </svg>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
             <div 
              ref={wireRef as React.RefObject<HTMLDivElement>} 
              className="absolute h-8 -translate-y-1/2 cursor-pointer pointer-events-auto"
              style={{ top: '76%', left: '15%', width: '70%', }}
              onMouseDown={onMouseDownOnWire}
             ></div>
        </div>
      </div>
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
