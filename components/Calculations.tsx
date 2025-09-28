
import React from 'react';

interface CalculationsProps {
  meanS: number | null;
  resistivity: number | null;
}

const ResultDisplay: React.FC<{ label: string, value: string | null, unit: string }> = ({ label, value, unit }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg">
        <p className="text-sm text-gray-400">{label}</p>
        {value ? (
            <p className="text-2xl font-bold text-green-400">
                {value} <span className="text-lg text-gray-300">{unit}</span>
            </p>
        ) : (
            <p className="text-2xl font-bold text-gray-600">-</p>
        )}
    </div>
);

const Calculations: React.FC<CalculationsProps> = ({ meanS, resistivity }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-cyan-400">Calculations & Results</h2>
      
      <div className="bg-gray-900/50 p-4 rounded-lg">
        <h3 className="text-md font-semibold text-gray-200 mb-2">Formulas Used:</h3>
        <p className="text-sm font-mono text-gray-400">1. Unknown Resistance, <code className="text-cyan-400">S = R * ((100 - l) / l)</code></p>
        <p className="text-sm font-mono text-gray-400 mt-1">2. Specific Resistance, <code className="text-cyan-400">ρ = (S * π * d²) / (4 * L)</code></p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultDisplay 
          label="Mean Unknown Resistance (S)"
          value={meanS ? meanS.toFixed(3) : null}
          unit="Ω"
        />
        <ResultDisplay 
          label="Specific Resistance (ρ)"
          value={resistivity ? resistivity.toExponential(3) : null}
          unit="Ωm"
        />
      </div>
    </div>
  );
};

export default Calculations;
