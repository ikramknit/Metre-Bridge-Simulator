
import React from 'react';

interface MetreBridgeProps {
  jockeyPosition: number;
  galvanometerDeflection: number;
  isCircuitOn: boolean;
  wireRef: React.RefObject<HTMLDivElement>;
  onMouseDownOnWire: () => void;
  isBalanced: boolean;
}

const Terminal: React.FC = () => (
  <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-yellow-700 shadow-md"></div>
);

const Galvanometer: React.FC<{ deflection: number; isBalanced: boolean }> = ({ deflection, isBalanced }) => {
  return (
    <div className={`relative w-28 h-20 bg-gray-200 rounded-lg shadow-inner border-2 flex flex-col items-center justify-end p-1 transition-all duration-300 ${isBalanced ? 'shadow-[0_0_15px_rgba(56,189,248,0.7)] border-cyan-400' : 'border-gray-400'}`}>
      <div className="text-black text-xs font-bold">G</div>
      <div className="w-full h-1 bg-gray-300 absolute top-1/2 -translate-y-1/2 flex justify-center">
        <div className="w-px h-2 bg-black"></div>
      </div>
      <div
        className="absolute bottom-2 left-1/2 w-px h-10 bg-red-600 origin-bottom transition-transform duration-100"
        style={{ transform: `translateX(-50%) rotate(${deflection}deg)` }}
      ></div>
      <div className="absolute -bottom-4 flex gap-2">
         <div className="w-3 h-3 bg-black rounded-full border-2 border-gray-500"></div>
         <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-gray-500"></div>
      </div>
    </div>
  );
};

const ResistanceBox: React.FC = () => (
    <div className="w-36 h-20 bg-yellow-800 rounded-lg p-2 flex flex-col items-center shadow-lg border-2 border-yellow-900">
        <span className="text-white font-bold text-sm">RESISTANCE BOX</span>
        <div className="flex gap-2 mt-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-6 bg-yellow-600 rounded-sm border-b-4 border-yellow-900"></div>
            ))}
        </div>
        <div className="absolute -bottom-4 flex gap-12">
            <div className="w-3 h-3 bg-black rounded-full border-2 border-gray-500"></div>
            <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-gray-500"></div>
        </div>
    </div>
);


const MetreBridge: React.FC<MetreBridgeProps> = ({ jockeyPosition, galvanometerDeflection, isCircuitOn, wireRef, onMouseDownOnWire, isBalanced }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-[350px] p-4 bg-gradient-to-br from-yellow-900 to-yellow-950 rounded-lg shadow-lg">
      
      {/* Battery and Key */}
      <div className="absolute top-2 left-4 flex flex-col items-center gap-2">
         <div className="flex items-center">
            <div className="w-2 h-8 bg-yellow-500 rounded-sm"></div>
            <div className="w-1 h-5 bg-gray-400 rounded-sm"></div>
            <span className="text-xl font-bold text-yellow-300 ml-1">+</span>
         </div>
         <div className="w-1 h-16" style={{ background: `linear-gradient(to bottom, ${isCircuitOn ? '#4ade80' : '#f87171'} 50%, #4b5563 50%)`, backgroundSize: '100% 10px' }}></div>
         <div className="flex items-center">
            <div className="w-2 h-8 bg-yellow-500 rounded-sm"></div>
            <span className="text-3xl font-bold text-yellow-300 ml-1">-</span>
         </div>
         <div className="mt-4 w-10 h-6 bg-gray-700 rounded flex items-center justify-center text-sm font-mono">KEY</div>
      </div>

      {/* Components on top */}
      <div className="absolute top-8 flex items-center justify-around w-[70%]">
          <div className="relative"><ResistanceBox /></div>
          <div className="relative"><Galvanometer deflection={galvanometerDeflection} isBalanced={isBalanced} /></div>
          <div className="relative">
            <div className="w-36 h-20 bg-gray-700 rounded-lg p-2 flex flex-col items-center justify-center shadow-lg border-2 border-gray-600">
               <span className="text-white font-bold text-sm">UNKNOWN</span>
               <span className="text-white font-bold text-sm">RESISTANCE (S)</span>
            </div>
             <div className="absolute -bottom-4 flex gap-12">
                <div className="w-3 h-3 bg-black rounded-full border-2 border-gray-500"></div>
                <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-gray-500"></div>
            </div>
          </div>
      </div>

      {/* Copper Strips */}
      <div className="absolute top-1/2 -translate-y-[18px] w-[90%] h-12 flex justify-between">
        <div className="w-[30%] h-full bg-yellow-600 flex justify-around items-center rounded-l-md border-2 border-yellow-800"><Terminal /><Terminal /></div>
        <div className="w-[10%] h-full bg-yellow-600 flex justify-around items-center border-y-2 border-yellow-800"><Terminal /></div>
        <div className="w-[30%] h-full bg-yellow-600 flex justify-around items-center rounded-r-md border-2 border-yellow-800"><Terminal /><Terminal /></div>
      </div>
      
      {/* Metre Scale */}
      <div className="w-[90%] h-8 bg-gray-200 rounded-md shadow-inner flex items-center px-2 relative mt-24">
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
      <div ref={wireRef} className="absolute w-[86%] h-1 bg-gray-400 top-[calc(50%+48px)] rounded-full cursor-pointer" onMouseDown={onMouseDownOnWire}>
        
        {/* Jockey */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${jockeyPosition}%` }}>
           <div className="relative w-4 h-12 flex flex-col items-center">
             <div className="w-1 h-8 bg-green-500" style={{ display: isCircuitOn ? 'block' : 'none' }}></div>
             <div className={`w-4 h-4 bg-gray-800 rounded-full border-2 -mt-1 transition-all duration-300 ${isBalanced ? 'border-cyan-400 shadow-[0_0_10px_theme(colors.cyan.400)]' : 'border-gray-500'}`}></div>
             <div className="absolute -bottom-1 text-cyan-400 text-xs font-mono">{jockeyPosition.toFixed(1)}</div>
           </div>
        </div>

      </div>

    </div>
  );
};

export default MetreBridge;