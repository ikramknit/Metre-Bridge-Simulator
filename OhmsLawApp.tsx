
import React, { useState, useEffect } from 'react';
import { OhmsLawObservation } from './types';
import OhmsLawVisualization from './components/OhmsLawVisualization';
import OhmsLawControls from './components/OhmsLawControls';
import OhmsLawTable from './components/OhmsLawTable';
import OhmsLawCalculations from './components/OhmsLawCalculations';
import { 
    OHMS_LAW_WIRE_RESISTANCE_ACTUAL, 
    OHMS_LAW_WIRE_LENGTH_ACTUAL,
    BATTERY_EMF, 
    BATTERY_INTERNAL_RESISTANCE, 
    RHEOSTAT_MAX_RESISTANCE,
    AMMETER_RESISTANCE
} from './constants';

export default function OhmsLawApp(): React.ReactElement {
    const [isCircuitOn, setIsCircuitOn] = useState(false);
    const [rheostatValue, setRheostatValue] = useState(50); // As a percentage
    const [voltmeterReading, setVoltmeterReading] = useState(0);
    const [ammeterReading, setAmmeterReading] = useState(0);
    const [observations, setObservations] = useState<OhmsLawObservation[]>([]);
    const [resistance, setResistance] = useState<number | null>(null);
    const [resistancePerCm, setResistancePerCm] = useState<number | null>(null);

    useEffect(() => {
        if (isCircuitOn) {
            const rheostatResistance = (rheostatValue / 100) * RHEOSTAT_MAX_RESISTANCE;
            const totalResistance = BATTERY_INTERNAL_RESISTANCE + rheostatResistance + OHMS_LAW_WIRE_RESISTANCE_ACTUAL + AMMETER_RESISTANCE;
            
            const current = BATTERY_EMF / totalResistance;
            const potentialDifference = current * OHMS_LAW_WIRE_RESISTANCE_ACTUAL;

            // Add a small random noise to simulate real-world fluctuations
            const noisyCurrent = current * (1 + (Math.random() - 0.5) * 0.02);
            const noisyVoltage = potentialDifference * (1 + (Math.random() - 0.5) * 0.02);

            setAmmeterReading(noisyCurrent);
            setVoltmeterReading(noisyVoltage);
        } else {
            setAmmeterReading(0);
            setVoltmeterReading(0);
        }
    }, [isCircuitOn, rheostatValue]);

    const handleRecordObservation = () => {
        if (isCircuitOn && observations.length < 6) {
            // Check for duplicate readings to encourage varying the rheostat
            const isDuplicate = observations.some(obs => Math.abs(obs.I - ammeterReading) < 0.01);
            if (isDuplicate) {
                // Maybe show a small warning in a real app
                console.warn("Try to take readings at different rheostat positions.");
                return;
            }
            const newObservation: OhmsLawObservation = {
                serial: observations.length + 1,
                V: voltmeterReading,
                I: ammeterReading
            };
            setObservations([...observations, newObservation]);
        }
    };

    const handleCalculate = () => {
        if (observations.length > 1) {
            // Calculate slope using linear regression (least squares method)
            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
            const n = observations.length;
            observations.forEach(obs => {
                sumX += obs.I;
                sumY += obs.V;
                sumXY += obs.I * obs.V;
                sumX2 += obs.I * obs.I;
            });

            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            setResistance(slope);
            setResistancePerCm(slope / OHMS_LAW_WIRE_LENGTH_ACTUAL);
        }
    };

    const handleReset = () => {
        setIsCircuitOn(false);
        setRheostatValue(50);
        setObservations([]);
        setResistance(null);
        setResistancePerCm(null);
    };

    return (
        <>
         <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-800 p-2 sm:p-4 rounded-2xl shadow-2xl border border-gray-700">
                <OhmsLawVisualization
                    isCircuitOn={isCircuitOn}
                    setIsCircuitOn={setIsCircuitOn}
                    rheostatValue={rheostatValue}
                    setRheostatValue={setRheostatValue}
                    ammeterReading={ammeterReading}
                    voltmeterReading={voltmeterReading}
                />
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-4 border border-gray-700">
                <OhmsLawControls
                    isCircuitOn={isCircuitOn}
                    onRecord={handleRecordObservation}
                    onCalculate={handleCalculate}
                    onReset={handleReset}
                    canRecord={observations.length < 6}
                    observationCount={observations.length}
                />
            </div>
         </div>
         <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
                <OhmsLawTable observations={observations} />
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
                <OhmsLawCalculations 
                    observations={observations} 
                    resistance={resistance}
                    resistancePerCm={resistancePerCm}
                />
            </div>
        </div>
        </>
    );
}