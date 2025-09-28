import React, { useState, useEffect } from 'react';

interface ResistanceCombinationVisualizationProps {
  jockeyPosition: number;
  galvanometerDeflection: number;
  isCircuitOn: boolean;
  setIsCircuitOn: (isOn: boolean) => void;
  wireRef: React.RefObject<HTMLDivElement>;
  onMouseDownOnWire: () => void;
  isBalanced: boolean;
  knownResistance: number;
  setKnownResistance: (r: number) => void;
  combinationMode: 'Series' | 'Parallel';
  setCombinationMode: (mode: 'Series' | 'Parallel') => void;
  r1: number;
  setR1: (r: number) => void;
  r2: number;
  setR2: (r: number) => void;
}

const PLUG_VALUES = [5, 2, 2, 1];

const ResistancePlug: React.FC<{ value: number; x: number; y: number; isOut: boolean; onClick: () => void, isCircuitOn: boolean }> = ({ value, x, y, isOut, onClick, isCircuitOn }) => (
    <g onClick={onClick} className={`cursor-pointer ${!isCircuitOn ? 'opacity-50 pointer-events-none' : ''} group`}>
        <circle cx={x} cy={y} r="5" fill="#422006" stroke="#6b21a8" strokeWidth="0.5" />
        <circle cx={x} cy={y} r="4" fill="#1e293b" />
        <g style={{ transition: 'transform 0.2s ease-in-out' }} transform={isOut ? `translate(12, -8) rotate(15)` : 'translate(0,0)'}>
            <circle cx={x} cy={y} r="4.5" fill="#b87333" stroke="#8c5a2b" strokeWidth="0.5" className="group-hover:stroke-sky-400" />
            <rect x={x - 2} y={y - 10} width="4" height="6" rx="1" fill="#1e293b" />
        </g>
        <text x={x} y={y - 15} textAnchor="middle" fontSize="6" fill="#e2e8f0" className="font-mono">{value}Ω</text>
    </g>
);

const RValuePopup: React.FC<{
  r1: number; setR1: (l: number) => void;
  r2: number; setR2: (d: number) => void;
  onClose: () => void;
}> = ({ r1, setR1, r2, setR2, onClose }) => (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800/80 backdrop-blur-sm border border-sky-500 rounded-lg p-4 w-64 shadow-2xl z-20">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sky-400">Set Resistance Values</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
      </div>
      <div className="space-y-3">
        <div>
            <label className="text-sm">Resistance R1: <span className="font-mono text-sky-300">{r1.toFixed(1)} Ω</span></label>
            <input type="range" min={1} max={10} step={0.5} value={r1} onChange={(e) => setR1(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </div>
        <div>
            <label className="text-sm">Resistance R2: <span className="font-mono text-sky-300">{r2.toFixed(1)} Ω</span></label>
            <input type="range" min={1} max={10} step={0.5} value={r2} onChange={(e) => setR2(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>
    </div>
);

const ResistanceCombinationVisualization: React.FC<ResistanceCombinationVisualizationProps> = (props) => {
  const { jockeyPosition, galvanometerDeflection, isCircuitOn, setIsCircuitOn, wireRef, onMouseDownOnWire, isBalanced, knownResistance, setKnownResistance, combinationMode, setCombinationMode, r1, setR1, r2, setR2 } = props;
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [plugsOut, setPlugsOut] = useState<boolean[]>(() => {
    let r = knownResistance;
    return PLUG_VALUES.map(val => {
        if (r >= val) { r -= val; return true; }
        return false;
    });
  });

  useEffect(() => {
    const newResistance = plugsOut.reduce((acc, isOut, i) => acc + (isOut ? PLUG_VALUES[i] : 0), 0);
    if (newResistance !== knownResistance) {
        setKnownResistance(newResistance);
    }
  }, [plugsOut, knownResistance, setKnownResistance]);
  
  const handlePlugClick = (index: number) => {
    const newPlugsOut = [...plugsOut];
    newPlugsOut[index] = !newPlugsOut[index];
    setPlugsOut(newPlugsOut);
  };

  const jockeyX = 60 + (jockeyPosition / 100) * 280;
  const circuitStrokeColor = isCircuitOn ? '#3b82f6' : '#4b5563';
  const textFillColor = '#cbd5e1';
  const sValue = combinationMode === 'Series' ? r1 + r2 : (r1 * r2) / (r1 + r2);
  const animationDuration = 0.5 + (knownResistance + sValue) * 0.05;

  return (
    <div className="relative flex flex-col items-center justify-center h-[450px] p-4 bg-gray-900/80 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-repeat">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/50 to-gray-900/80"></div>
      
      {isSettingsOpen && <RValuePopup r1={r1} setR1={setR1} r2={r2} setR2={setR2} onClose={() => setIsSettingsOpen(false)} />}
      
      <style>{`
        @keyframes march { to { stroke-dashoffset: 20; } }
        .current-flow { stroke-dasharray: 10 10; animation: march ${animationDuration}s linear infinite; }
        .current-flow-galvo { stroke-dasharray: 5 5; animation: march 1s linear infinite; }
      `}</style>
      <div className="w-full h-full relative">
        <svg viewBox="0 0 400 250" className="absolute w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Base and Metre Wire setup (reused from MetreBridge) */}
            <defs>
              <marker id="arrow-combo" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
              </marker>
               <linearGradient id="copper-gradient-combo" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#b87333'}} /> <stop offset="50%" style={{stopColor: '#d98c4a'}} /> <stop offset="100%" style={{stopColor: '#b87333'}} />
              </linearGradient>
            </defs>
            <rect x="10" y="80" width="380" height="130" fill="#4f382b" rx="5" />
            <rect x="15" y="85" width="370" height="120" fill="#6b4f3f" stroke="#422006" strokeWidth="1" rx="3" />
            <g stroke="url(#copper-gradient-combo)" strokeWidth="12" strokeLinecap="round" fill="none">
                <polyline points="140,100 60,100 60,150" />
                <polyline points="180,100 220,100" />
                <polyline points="260,100 340,100 340,150" />
            </g>
            <g fill="#1e293b"><circle cx="60" cy="100" r="4" /><circle cx="140" cy="100" r="4" /><circle cx="180" cy="100" r="4" /><circle cx="220" cy="100" r="4" /><circle cx="260" cy="100" r="4" /><circle cx="340" cy="100" r="4" /><circle cx="60" cy="150" r="4" /><circle cx="340" cy="150" r="4" /><circle cx="200" cy="100" r="4" /></g>
            <rect x="55" y="180" width="290" height="20" fill="#f3e9d2" stroke="#4f382b" strokeWidth="1" />
            {[...Array(101)].map((_, i) => {
                const isTens = i % 10 === 0, isFives = i % 5 === 0;
                const x = 60 + (i/100) * 280, h = isTens ? 8 : (isFives ? 5 : 3);
                return (<g key={`mark-${i}`}><line x1={x} y1={200} x2={x} y2={200 - h} stroke="#1e293b" strokeWidth={isTens ? 0.7 : 0.5} />{isTens && <text x={x} y={188} textAnchor="middle" fontSize="6" fill="#1e293b" className="font-sans font-bold">{i}</text>}</g>)
            })}
            <line x1="60" y1="190" x2="340" y2="190" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Power supply, key etc reused */}
            <path d="M 60 50 V 100" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" /><path d="M 340 50 V 100" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" /><path d="M 60 50 H 154" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" /><path d="M 250 50 H 340" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" /><path d="M 208 50 H 230" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <g className="cursor-pointer" onClick={() => setIsCircuitOn(!isCircuitOn)}>
                <rect x="140" y="20" width="85" height="40" rx="4" fill="#d1d5db" stroke="#4b5569" strokeWidth="1"/><rect x="142" y="22" width="81" height="36" rx="2" fill="#e5e7eb" />
                <text x="182.5" y="17" textAnchor="middle" fontSize="6" fill="#374151" className="font-sans font-bold tracking-wider">DC SUPPLY</text>
                <rect x="170" y="28" width="30" height="15" rx="2" fill="#1e293b" stroke="#111827" strokeWidth="1" /><text x="185" y="39" textAnchor="middle" fontSize="9" fill="#4ade80" className="font-mono font-bold tracking-wider" style={{textShadow: '0 0 5px #4ade80'}}>9.0V</text>
                <g transform="translate(154, 36)"><circle cx="0" cy="0" r="7" fill="#1f2937" /><circle cx="0" cy="0" r="6" fill={isCircuitOn ? '#dc2626' : '#b91c1c'} style={{transform: isCircuitOn ? 'scale(0.95)' : 'scale(1)', transition: 'transform 0.1s ease'}}/><text x="0" y="16" textAnchor="middle" fontSize="6" fill={textFillColor} className="font-mono font-bold">ON/OFF</text></g>
                <g transform="translate(154, 50)"><circle cx="0" cy="0" r="6" fill="#1f2937" /><circle cx="0" cy="0" r="5" fill="#374151"/><rect x="-2.5" y="-1" width="5" height="2" fill="#9ca3af"/></g>
                <g transform="translate(208, 50)"><circle cx="0" cy="0" r="6" fill="#7f1d1d" /><circle cx="0" cy="0" r="5" fill="#b91c1c"/><rect x="-2.5" y="-1" width="5" height="2" fill="#fecaca"/><rect x="-1" y="-2.5" width="2" height="5" fill="#fecaca"/></g>
            </g>
            <g transform="translate(240, 30)">
                <rect x="-15" y="12" width="30" height="8" fill="#1e293b" rx="2"/><circle cx="-10" cy="16" r="3" fill="#b87333" /><circle cx="10" cy="16" r="3" fill="#b87333" />
                <g style={{ transition: 'transform 0.3s ease-in-out', transform: isCircuitOn ? 'translateY(0px)' : 'translateY(-12px)' }}><rect x="-12" y="0" width="24" height="10" rx="2" fill="#111827"/><rect x="-10" y="1" width="20" height="8" rx="2" fill="#b87333"/><rect x="-1" y="-3" width="2" height="6" fill="#1e293b" /></g>
                <text x="0" y="32" textAnchor="middle" fontSize="10" fill={textFillColor} className="font-bold">K</text>
            </g>

            {/* Right Gap: Known Resistance R */}
            <g>
              <path d="M 220 100 V 70 H 260 V 100" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
              <rect x="200" y="45" width="80" height="30" rx="3" fill="#4f382b" stroke="#422006" strokeWidth="1"/>
              <rect x="202" y="47" width="76" height="26" rx="2" fill="#6b4f3f"/>
              <ResistancePlug value={PLUG_VALUES[0]} x={212.5} y={60} isOut={plugsOut[0]} onClick={() => handlePlugClick(0)} isCircuitOn={isCircuitOn} />
              <ResistancePlug value={PLUG_VALUES[1]} x={227.5} y={60} isOut={plugsOut[1]} onClick={() => handlePlugClick(1)} isCircuitOn={isCircuitOn} />
              <ResistancePlug value={PLUG_VALUES[2]} x={242.5} y={60} isOut={plugsOut[2]} onClick={() => handlePlugClick(2)} isCircuitOn={isCircuitOn} />
              <ResistancePlug value={PLUG_VALUES[3]} x={257.5} y={60} isOut={plugsOut[3]} onClick={() => handlePlugClick(3)} isCircuitOn={isCircuitOn} />
              <text x="240" y="40" textAnchor="middle" fontSize="8" className="font-bold" fill={textFillColor}>R = {knownResistance} Ω</text>
            </g>
            
            {/* Left Gap: Combination of R1 and R2 */}
            <g>
                {/* Wires to the block */}
                <path d="M 140 100 V 60 H 100 V 35" stroke={circuitStrokeColor} strokeWidth="1.5" />
                <path d="M 60 100 V 35 H 100" stroke={circuitStrokeColor} strokeWidth="1.5" />
                
                {/* Resistors */}
                <g transform="translate(60, 45)">
                     <path d="M 0 5 C 2.5 0, 5 10, 7.5 5 C 10 0, 12.5 10, 15 5" stroke="#9ca3af" strokeWidth="1.5" fill="none"/>
                     <text x="7.5" y="20" textAnchor="middle" fontSize="8" className="font-bold" fill={textFillColor}>R1</text>
                </g>
                <g transform="translate(125, 45)">
                     <path d="M 0 5 C 2.5 0, 5 10, 7.5 5 C 10 0, 12.5 10, 15 5" stroke="#9ca3af" strokeWidth="1.5" fill="none"/>
                     <text x="7.5" y="20" textAnchor="middle" fontSize="8" className="font-bold" fill={textFillColor}>R2</text>
                </g>

                {/* Mode Switch and dynamic wiring */}
                <g className="cursor-pointer" onClick={() => setCombinationMode(combinationMode === 'Series' ? 'Parallel' : 'Series')}>
                    <rect x="85" y="60" width="30" height="15" rx="2" fill="#111827" />
                    <rect x={combinationMode === 'Series' ? 86 : 99} y="61" width="15" height="13" rx="1" fill="#4f46e5" className="transition-all" />
                    <text x="92.5" y="69.5" fontSize="5" fill="white" className="font-bold select-none" textAnchor="middle">SER</text>
                    <text x="106.5" y="69.5" fontSize="5" fill="white" className="font-bold select-none" textAnchor="middle">PAR</text>
                </g>

                {combinationMode === 'Series' ? (
                    <>
                        <path d="M 100 35 H 75 V 50" stroke={circuitStrokeColor} strokeWidth="1.5" />
                        <path d="M 100 60 V 50 H 125 V 50" stroke={circuitStrokeColor} strokeWidth="1.5" />
                    </>
                ) : (
                    <>
                        <path d="M 100 35 H 75 M 100 35 H 125" stroke={circuitStrokeColor} strokeWidth="1.5" />
                        <path d="M 100 60 H 75 M 100 60 H 125" stroke={circuitStrokeColor} strokeWidth="1.5" />
                    </>
                )}
                
                <g onClick={() => setIsSettingsOpen(true)} className="cursor-pointer group">
                    <circle cx="110" cy="25" r="6" fill="#1e293b" className="opacity-50 group-hover:opacity-100" />
                    <path d="M108,23 l4,4 m0,-4 l-4,4" stroke="white" strokeWidth="1.5" className="group-hover:stroke-sky-400" />
                </g>
            </g>

            {/* Galvanometer, Jockey, and bottom connections */}
            <path d="M 60 150 V 190" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" /><path d="M 340 150 V 190" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
            <g>
                <path d="M 200 100 V 150" stroke={textFillColor} strokeWidth="1.5" fill="none" />
                <rect x="175" y="150" width="50" height="25" fill="#f1f5f9" rx="3" stroke="#4b5563" strokeWidth="1.5" className={`transition-shadow duration-300 ${isBalanced ? 'shadow-[0_0_15px_rgba(74,222,128,0.8)]' : ''}`}/>
                <rect x="180" y="152" width="40" height="15" fill="white" />
                <g><g stroke="#4b5563" strokeWidth="0.5"><path d="M 192.9 158 A 10 10 0 0 1 207.1 158" fill="none" stroke="#9ca3af" /><line x1="200" y1="155" x2="200" y2="153" strokeWidth="0.7" /><line x1="200" y1="155" x2="200" y2="154" transform="rotate(-22.5, 200, 165)" /><line x1="200" y1="155" x2="200" y2="154" transform="rotate(22.5, 200, 165)" /><line x1="200" y1="155" x2="200" y2="153.5" transform="rotate(-45, 200, 165)" /><line x1="200" y1="155" x2="200" y2="153.5" transform="rotate(45, 200, 165)" /><text x="200" y="151.5" textAnchor="middle" dominantBaseline="hanging" fontSize="3" fill="#1e293b" className="font-sans font-semibold">0</text></g><line x1="200" y1="165" x2="200" y2="154" stroke={isBalanced ? '#4ade80' : '#dc2626'} strokeWidth="1.5" transform={`rotate(${galvanometerDeflection}, 200, 165)`} className={`origin-bottom transition-all duration-75 ease-out ${isBalanced ? 'drop-shadow-[0_0_4px_#4ade80]' : ''}`} /></g>
                <path d={`M 200 175 Q ${200 + (jockeyX - 200)/1.5} 185, ${jockeyX} 190`} stroke="#475569" strokeWidth="1.5" fill="none" />
                 {isCircuitOn && Math.abs(galvanometerDeflection) > 0.1 && (<g stroke="#60a5fa" strokeWidth="1.5" fill="none" className="current-flow-galvo" markerEnd={galvanometerDeflection < 0 ? "url(#arrow-combo)" : undefined} markerStart={galvanometerDeflection > 0 ? "url(#arrow-combo)" : undefined}><path d={`M 200 175 Q ${200 + (jockeyX - 200) / 1.5} 185, ${jockeyX} 190`} /></g>)}
            </g>
            <g transform={`translate(${jockeyX}, 190)`} className={`${!isCircuitOn ? 'opacity-50' : ''} ${isBalanced ? 'drop-shadow-[0_0_5px_theme(colors.sky.400)]' : ''}`}><path d="M 0 0 L -2 -15 L 2 -15 Z" fill="#d1d5db" stroke="#9ca3af" strokeWidth="0.5" /><rect x="-4" y="-25" width="8" height="10" rx="2" fill="#1e293b" /><text x="0" y="-30" textAnchor="middle" fontSize="10" fill={textFillColor} className="font-bold">D</text></g>
            
            {/* Current Flow Animations */}
             <g stroke="#60a5fa" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-combo)" className={isCircuitOn ? 'current-flow' : 'hidden'}>
                {/* Common Path */}
                <path d="M 208 50 H 230" /> <path d="M 250 50 H 340 V 100" />
                <path d="M 260 100 H 220 V 70 H 260" />
                <path d="M 60 100 V 50 H 154" />
                <path d="M 340 100 V 150 V 190 H 200" />
                <path d="M 200 190 H 60 V 150 V 100" />
                {/* Dynamic Path */}
                {combinationMode === 'Series' ? (
                  <>
                    <path d="M 140 100 V 60 H 100 V 50 H 125 V 50" />
                    <path d="M 75 50 V 60 H 60" />
                  </>
                ) : (
                  <>
                    <path d="M 140 100 V 60 H 125" />
                    <path d="M 140 100 V 60 H 100 H 75" />
                    <path d="M 75 35 V 50" />
                    <path d="M 125 35 V 50" />
                    <path d="M 75 35 H 60" />
                  </>
                )}
            </g>
        </svg>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
             <div ref={wireRef as React.RefObject<HTMLDivElement>} className="absolute h-8 -translate-y-1/2 cursor-pointer pointer-events-auto" style={{ top: '76%', left: '15%', width: '70%', }} onMouseDown={onMouseDownOnWire}></div>
        </div>
      </div>
    </div>
  );
};

export default ResistanceCombinationVisualization;
