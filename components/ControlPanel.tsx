
import React from 'react';

interface ControlPanelProps {
  isCircuitOn: boolean;
  knownResistance: number;
  wireLength: number;
  wireDiameter: number;
  onRecord: () => void;
  onCalculate: () => void;
  onReset: () => void;
  isBalanced: boolean;
  canRecord: boolean;
  observationCount: number;
}

const StatusDisplay: React.FC<{ label: string; value: string; unit: string; colorClass?: string }> = ({ label, value, unit, colorClass = 'text-sky-400' }) => (
  <div className="flex justify-between items-baseline bg-gray-900/50 p-2 rounded-md">
    <span className="text-sm font-medium text-gray-300">{label}</span>
    <span className={`font-mono font-bold text-lg ${colorClass}`}>
      {value} <span className="text-sm text-gray-400">{unit}</span>
    </span>
  </div>
);

const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const { isCircuitOn, knownResistance, wireLength, wireDiameter, onRecord, onCalculate, onReset, isBalanced, canRecord, observationCount } = props;

  return (
    <div className="flex flex-col h-full gap-4">
      <h2 className="text-xl font-bold text-sky-400 text-center">Controls & Readouts</h2>
      
      <div className="p-3 bg-gray-900/50 rounded-lg flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-200 text-center border-b border-gray-700 pb-2 mb-2">Experiment Parameters</h3>
        <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded-md">
           <span className="text-sm font-medium text-gray-300">Circuit Status</span>
           <div className="flex items-center gap-2">
                <span className={`font-bold text-lg ${isCircuitOn ? 'text-green-400' : 'text-red-500'}`}>{isCircuitOn ? 'ON' : 'OFF'}</span>
                <div className={`w-3 h-3 rounded-full ${isCircuitOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
           </div>
        </div>
        <StatusDisplay label="Known Resistance (R)" value={knownResistance.toFixed(1)} unit="Ω" />
        <StatusDisplay label="Wire Length (L)" value={wireLength.toFixed(1)} unit="m" />
        <StatusDisplay label="Wire Diameter (d)" value={wireDiameter.toFixed(2)} unit="mm" />
      </div>

      <div className="mt-auto flex flex-col gap-3">
         <button 
           onClick={onRecord}
           disabled={!isBalanced || !canRecord}
           className={`w-full py-2 px-4 font-bold rounded-md transition-all duration-200 text-white
             ${isBalanced && canRecord ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
             ${isBalanced && !isCircuitOn ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : ''}
           `}
         >
           {canRecord ? `Record Observation (${observationCount}/5)` : 'Table Full'}
           {isBalanced && canRecord && <span className="ml-2 text-green-300">(Ready)</span>}
         </button>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onCalculate} className="w-full py-2 px-4 font-bold rounded-md bg-green-600 hover:bg-green-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed" disabled={observationCount === 0}>Calculate</button>
          <button onClick={onReset} className="w-full py-2 px-4 font-bold rounded-md bg-red-600 hover:bg-red-700 transition-colors">Reset</button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
