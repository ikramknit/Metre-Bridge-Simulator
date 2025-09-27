import React from 'react';

interface ControlPanelProps {
  isCircuitOn: boolean;
  setIsCircuitOn: (isOn: boolean) => void;
  knownResistance: number;
  setKnownResistance: (r: number) => void;
  wireLength: number;
  setWireLength: (l: number) => void;
  wireDiameter: number;
  setWireDiameter: (d: number) => void;
  onRecord: () => void;
  onCalculate: () => void;
  onReset: () => void;
  isBalanced: boolean;
  canRecord: boolean;
}

const LabelledInput: React.FC<{ label: string; unit: string; value: number; onChange: (val: number) => void, min: number, max: number, step: number }> = 
({ label, unit, value, onChange, min, max, step }) => {
  const decimals = step.toString().split('.')[1]?.length || 0;
  const formattedValue = value.toFixed(decimals);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-cyan-400 font-mono w-24 text-center">{formattedValue} {unit}</span>
      </div>
    </div>
  );
};


const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const { isCircuitOn, setIsCircuitOn, knownResistance, setKnownResistance, wireLength, setWireLength, wireDiameter, setWireDiameter, onRecord, onCalculate, onReset, isBalanced, canRecord } = props;

  return (
    <div className="flex flex-col h-full gap-4">
      <h2 className="text-xl font-bold text-cyan-400 text-center">Controls</h2>
      
      <div className="flex items-center justify-center gap-4 p-3 bg-gray-900/50 rounded-lg">
        <span className={`font-bold ${isCircuitOn ? 'text-gray-500' : 'text-green-400'}`}>OFF</span>
        <button
          onClick={() => setIsCircuitOn(!isCircuitOn)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${isCircuitOn ? 'bg-green-500' : 'bg-gray-600'}`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${isCircuitOn ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
        <span className={`font-bold ${!isCircuitOn ? 'text-gray-500' : 'text-green-400'}`}>ON</span>
      </div>
      
      <div className="p-4 bg-gray-900/50 rounded-lg flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-200">Experiment Setup</h3>
        <LabelledInput
          label="Known Resistance (R)"
          unit="Ω"
          value={knownResistance}
          onChange={setKnownResistance}
          min={1}
          max={10}
          step={0.5}
        />
         <LabelledInput
          label="Unknown Wire Length (L)"
          unit="m"
          value={wireLength}
          onChange={setWireLength}
          min={0.5}
          max={2}
          step={0.1}
        />
         <LabelledInput
          label="Unknown Wire Diameter (d)"
          unit="mm"
          value={wireDiameter}
          onChange={setWireDiameter}
          min={0.1}
          max={1.0}
          step={0.01}
        />
      </div>

      <div className="mt-auto flex flex-col gap-3">
         <button 
           onClick={onRecord}
           disabled={!isBalanced || !canRecord}
           className={`w-full py-2 px-4 font-bold rounded-md transition-all duration-200
             ${isBalanced && canRecord ? 'bg-cyan-500 hover:bg-cyan-600 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
             ${isBalanced && !isCircuitOn ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : ''}
           `}
         >
           {canRecord ? `Record Observation ${isBalanced ? '(Ready)' : ''}` : 'Table Full'}
         </button>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onCalculate} className="w-full py-2 px-4 font-bold rounded-md bg-green-600 hover:bg-green-700 transition-colors">Calculate</button>
          <button onClick={onReset} className="w-full py-2 px-4 font-bold rounded-md bg-red-600 hover:bg-red-700 transition-colors">Reset</button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;