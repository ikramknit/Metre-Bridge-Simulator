
import React from 'react';

interface MetreBridgeProps {
  jockeyPosition: number;
  galvanometerDeflection: number;
  isCircuitOn: boolean;
  wireRef: React.RefObject<HTMLDivElement>;
  onMouseDownOnWire: () => void;
  isBalanced: boolean;
}

const Terminal: React.FC<{ color?: 'red' | 'black' }> = ({ color = 'black' }) => (
  <div className={`w-4 h-4 rounded-full border-2 shadow-md ${color === 'red' ? 'bg-red-600 border-red-800' : 'bg-gray-800 border-gray-900'}`}>
      <div className="w-full h-full rounded-full bg-black/20"></div>
  </div>
);

const Galvanometer: React.FC<{ deflection: number; isBalanced: boolean }> = ({ deflection, isBalanced }) => {
  return (
    <div className={`relative w-28 h-20 bg-gray-200 rounded-lg shadow-inner border-2 flex flex-col items-center justify-end p-1 transition-all duration-300 z-10 ${isBalanced ? 'shadow-[0_0_15px_rgba(56,189,248,0.7)] border-cyan-400' : 'border-gray-400'}`}>
      <div className="text-black text-xs font-bold">G</div>
      <div className="w-full h-1 bg-gray-300 absolute top-1/2 -translate-y-1/2 flex justify-center">
        <div className="w-px h-2 bg-black"></div>
      </div>
      <div
        className="absolute bottom-2 left-1/2 w-px h-10 bg-red-600 origin-bottom transition-transform duration-100"
        style={{ transform: `translateX(-50%) rotate(${deflection}deg)` }}
      ></div>
      <div className="absolute -bottom-[18px] flex gap-2">
         <Terminal />
         <Terminal color="red" />
      </div>
    </div>
  );
};

const ResistanceBox: React.FC = () => (
    <div className="relative w-36 h-20 bg-gradient-to-br from-yellow-800 to-amber-900 rounded-lg p-2 flex flex-col items-center shadow-lg border-2 border-yellow-900 z-10">
        <span className="text-white font-bold text-xs tracking-wider">RESISTANCE BOX</span>
        <div className="flex gap-2.5 mt-2.5">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-yellow-600 rounded-full border-2 border-yellow-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                </div>
            ))}
        </div>
         <div className="absolute -bottom-[18px] flex gap-12">
            <Terminal />
            <Terminal />
        </div>
    </div>
);

const PowerSourceAndKey: React.FC<{ isCircuitOn: boolean }> = ({ isCircuitOn }) => (
    <div className="absolute top-2 left-4 flex flex-col items-center gap-2 z-10">
         {/* Power Source */}
         <div className="w-24 h-28 bg-gray-300 rounded-md border-2 border-gray-400 shadow-lg p-2 flex flex-col items-center justify-between">
            <div>
                <div className="w-16 h-3 bg-red-500/50 rounded-full mx-auto"></div>
                <div className="text-black font-bold text-[8px] text-center">BATTERY ELIMINATOR</div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 border-gray-500 flex items-center justify-center ${isCircuitOn ? 'bg-green-500' : 'bg-red-600'}`}>
                 <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
             <div className="flex justify-between w-full px-2">
                 <Terminal color="red" />
                 <Terminal />
             </div>
         </div>
         {/* Key */}
         <div className="mt-4 w-12 h-8 bg-amber-800 rounded flex items-center justify-center text-sm font-mono border-2 border-amber-900 shadow-md">
            <div className="flex gap-2 items-center">
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                 {isCircuitOn && <div className="w-2 h-5 bg-gray-900 rounded-sm"></div>}
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
            </div>
         </div>
    </div>
);


const MetreBridge: React.FC<MetreBridgeProps> = ({ jockeyPosition, galvanometerDeflection, isCircuitOn, wireRef, onMouseDownOnWire, isBalanced }) => {
  
  const jockeyWirePath = `M 50 35 Q ${40 + (jockeyPosition/5)} 70, ${17 + (jockeyPosition * 0.65)} 60`;

  return (
    <div className="relative flex flex-col items-center justify-center h-[350px] p-4 bg-gradient-to-br from-yellow-900 via-amber-900 to-yellow-950 rounded-lg shadow-lg overflow-hidden">
      
      <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full z-0" preserveAspectRatio="none">
        {/* Wires from power source */}
        <path d="M 12 24 L 27 24 L 27 47.5" stroke={isCircuitOn ? '#f87171' : '#4b5563'} strokeWidth="0.8" fill="none" />
        <path d="M 19 24 L 21 34 L 21 39 L 73 39 L 73 47.5" stroke={isCircuitOn ? '#6b7280' : '#4b5563'} strokeWidth="0.8" fill="none" />
        {/* Wires to Resistance Box */}
        <path d="M 29.5 52.5 L 29.5 45 Q 32 40, 35 40 L 37 40" stroke="#6b7280" strokeWidth="0.8" fill="none" />
        <path d="M 43 50 L 43 45 Q 41 40, 39 40 L 37 40" stroke="#6b7280" strokeWidth="0.8" fill="none" />
         {/* Wires to Unknown Resistance */}
        <path d="M 57 50 L 57 45 Q 59 40, 61 40 L 63 40" stroke="#6b7280" strokeWidth="0.8" fill="none" />
        <path d="M 69.5 52.5 L 69.5 45 Q 67 40, 65 40 L 63 40" stroke="#6b7280" strokeWidth="0.8" fill="none" />
        {/* Wire to Galvanometer */}
        <path d="M 49.5 52.5 L 49.5 45 L 48 40 L 48 35" stroke="#6b7280" strokeWidth="0.8" fill="none" />
        
        {/* Dynamic wire to Jockey - visible only when circuit is on */}
        {isCircuitOn && <path d={jockeyWirePath} stroke="#22c55e" strokeWidth="0.8" fill="none" />}
      </svg>
      
      <PowerSourceAndKey isCircuitOn={isCircuitOn} />
      
      {/* Components on top */}
      <div className="absolute top-8 flex items-end justify-around w-[70%] left-[20%]">
          <div className="relative"><ResistanceBox /></div>
          <div className="relative"><Galvanometer deflection={galvanometerDeflection} isBalanced={isBalanced} /></div>
          <div className="relative z-10">
            <div className="w-36 h-20 bg-gray-700 rounded-lg p-2 flex flex-col items-center justify-center shadow-lg border-2 border-gray-600">
               <span className="text-white font-bold text-sm">UNKNOWN</span>
               <span className="text-white font-bold text-sm">RESISTANCE (S)</span>
            </div>
             <div className="absolute -bottom-[18px] flex gap-12">
                <Terminal />
                <Terminal />
            </div>
          </div>
      </div>

      {/* Copper Strips */}
      <div className="absolute top-1/2 -translate-y-[18px] w-[90%] h-12 flex justify-between z-0">
        <div className="w-[30%] h-full bg-gradient-to-b from-yellow-500 to-yellow-600 flex justify-around items-center rounded-l-md border-2 border-yellow-800 shadow-md"><Terminal color="red"/><Terminal /></div>
        <div className="w-[10%] h-full bg-gradient-to-b from-yellow-500 to-yellow-600 flex justify-around items-center border-y-2 border-yellow-800 shadow-md"><Terminal /></div>
        <div className="w-[30%] h-full bg-gradient-to-b from-yellow-500 to-yellow-600 flex justify-around items-center rounded-r-md border-2 border-yellow-800 shadow-md"><Terminal /><Terminal /></div>
      </div>
      
      {/* Metre Scale */}
      <div className="w-[90%] h-8 bg-gray-200 rounded-md shadow-inner flex items-center px-2 relative mt-24 z-10">
        {[...Array(11)].map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-start relative h-full">
            <span className="text-black text-xs font-semibold">{i * 10}</span>
            <div className="w-px h-4 bg-black absolute bottom-0"></div>
             {[...Array(9)].map((_, j) => (
                <div key={j} className={`w-px ${j === 4 ? 'h-2' : 'h-1'} bg-black absolute bottom-0`} style={{ left: `${(j+1)*10}%`}}></div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Metre Wire */}
      <div ref={wireRef} className="absolute w-[86%] h-1 bg-gray-400 top-[calc(50%+48px)] rounded-full cursor-pointer z-20" onMouseDown={onMouseDownOnWire}>
        
        {/* Jockey */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${jockeyPosition}%` }}>
           <div className="relative w-4 h-12 flex flex-col items-center">
             <div className={`absolute -top-6 w-4 h-8 transition-all duration-300 ${isBalanced ? 'shadow-[0_0_10px_theme(colors.cyan.400)]' : ''}`}>
               <div className="w-4 h-4 bg-gray-800 rounded-t-lg border-2 border-b-0 border-gray-500"></div>
               <div className="w-2 h-4 bg-gray-600 mx-auto border-x-2 border-gray-500"></div>
             </div>
             <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-8 border-t-yellow-500 -mt-1"></div>
             <div className="absolute -bottom-1 text-cyan-400 text-xs font-mono">{jockeyPosition.toFixed(1)}</div>
           </div>
        </div>

      </div>

    </div>
  );
};

export default MetreBridge;
