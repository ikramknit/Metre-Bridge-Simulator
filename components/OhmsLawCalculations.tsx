
import React from 'react';
import { OhmsLawObservation } from '../types';
import Graph from './Graph';
import { OHMS_LAW_WIRE_LENGTH_ACTUAL } from '../constants';

interface OhmsLawCalculationsProps {
    observations: OhmsLawObservation[];
    resistance: number | null;
    resistancePerCm: number | null;
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


const OhmsLawCalculations: React.FC<OhmsLawCalculationsProps> = ({ observations, resistance, resistancePerCm }) => {
    const graphData = observations.map(obs => ({ x: obs.I, y: obs.V }));
    
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-sky-400">Graph & Results</h2>
            <div className="bg-gray-800/50 p-2 rounded-lg aspect-video">
                <Graph
                    data={graphData}
                    xLabel="Current (I)"
                    yLabel="Potential Difference (V)"
                    title="V vs I Graph"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ResultDisplay 
                  label="Resistance from Graph (R)"
                  value={resistance ? resistance.toFixed(3) : null}
                  unit="Ω"
                />
                <ResultDisplay 
                  label="Resistance per cm (R/L)"
                  value={resistancePerCm ? resistancePerCm.toExponential(3) : null}
                  unit={`Ω/cm (L=${OHMS_LAW_WIRE_LENGTH_ACTUAL}cm)`}
                />
            </div>
        </div>
    );
};

export default OhmsLawCalculations;
