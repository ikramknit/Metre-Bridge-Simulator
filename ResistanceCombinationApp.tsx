import React, { useState, useEffect, useRef, useCallback } from 'react';
import ResistanceCombinationVisualization from './components/ResistanceCombinationVisualization';
import ResistanceCombinationControls from './components/ResistanceCombinationControls';
import ResistanceCombinationTable from './components/ResistanceCombinationTable';
import ResistanceCombinationCalculations from './components/ResistanceCombinationCalculations';
import type { ResistanceCombinationObservation } from './types';
import { R1_ACTUAL, R2_ACTUAL } from './constants';

export default function ResistanceCombinationApp(): React.ReactElement {
  const [isCircuitOn, setIsCircuitOn] = useState<boolean>(false);
  const [knownResistance, setKnownResistance] = useState<number>(10);
  const [jockeyPosition, setJockeyPosition] = useState<number>(50);
  const [galvanometerDeflection, setGalvanometerDeflection] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const [combinationMode, setCombinationMode] = useState<'Series' | 'Parallel'>('Series');
  const [r1, setR1] = useState<number>(R1_ACTUAL);
  const [r2, setR2] = useState<number>(R2_ACTUAL);

  const [observations, setObservations] = useState<ResistanceCombinationObservation[]>([]);
  const [results, setResults] = useState<{ series: number | null, parallel: number | null }>({ series: null, parallel: null });

  const wireRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCircuitOn) {
      const sActual = combinationMode === 'Series'
        ? r1 + r2
        : (r1 * r2) / (r1 + r2);

      if (sActual + knownResistance <= 0) {
        setGalvanometerDeflection(jockeyPosition > 50 ? 45 : -45);
        return;
      }
      const calculatedBalancingPoint = (100 * knownResistance) / (sActual + knownResistance);
      const sensitivity = 0.8;
      let deflection = (jockeyPosition - calculatedBalancingPoint) * sensitivity;
      deflection = Math.max(-45, Math.min(45, deflection));
      setGalvanometerDeflection(deflection);
    } else {
      setGalvanometerDeflection(0);
    }
  }, [jockeyPosition, isCircuitOn, knownResistance, combinationMode, r1, r2]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && wireRef.current) {
      const rect = wireRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let position = (x / rect.width) * 100;
      position = Math.max(0, Math.min(100, position)); 
      setJockeyPosition(position);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleMouseDownOnWire = () => {
    if(isCircuitOn) {
      setIsDragging(true);
    }
  };
  
  const isBalanced = Math.abs(galvanometerDeflection) < 0.5 && isCircuitOn;

  const handleRecordObservation = () => {
    if (isBalanced && knownResistance > 0) {
      const l = jockeyPosition;
      const sValue = knownResistance * ((100-l) / l);
      const newObservation: ResistanceCombinationObservation = {
        serial: observations.length + 1,
        mode: combinationMode,
        R_known: knownResistance,
        l: parseFloat(l.toFixed(1)),
        S_experimental: parseFloat(sValue.toFixed(2)),
      };
      setObservations([...observations, newObservation]);
    }
  };
  
  const handleCalculate = () => {
    const seriesObs = observations.filter(o => o.mode === 'Series');
    const parallelObs = observations.filter(o => o.mode === 'Parallel');
    
    const meanSeries = seriesObs.length > 0
      ? seriesObs.reduce((acc, obs) => acc + obs.S_experimental, 0) / seriesObs.length
      : null;
      
    const meanParallel = parallelObs.length > 0
      ? parallelObs.reduce((acc, obs) => acc + obs.S_experimental, 0) / parallelObs.length
      : null;

    setResults({ series: meanSeries, parallel: meanParallel });
  };

  const handleReset = () => {
    setIsCircuitOn(false);
    setKnownResistance(10);
    setJockeyPosition(50);
    setCombinationMode('Series');
    setR1(R1_ACTUAL);
    setR2(R2_ACTUAL);
    setObservations([]);
    setResults({ series: null, parallel: null });
    setIsDragging(false);
  };

  return (
    <>
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 p-2 sm:p-4 rounded-2xl shadow-2xl border border-gray-700">
           <ResistanceCombinationVisualization
             jockeyPosition={jockeyPosition}
             galvanometerDeflection={galvanometerDeflection}
             isCircuitOn={isCircuitOn}
             setIsCircuitOn={setIsCircuitOn}
             wireRef={wireRef}
             onMouseDownOnWire={handleMouseDownOnWire}
             isBalanced={isBalanced}
             knownResistance={knownResistance}
             setKnownResistance={setKnownResistance}
             combinationMode={combinationMode}
             setCombinationMode={setCombinationMode}
             r1={r1}
             setR1={setR1}
             r2={r2}
             setR2={setR2}
           />
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-4 border border-gray-700">
          <ResistanceCombinationControls
            isCircuitOn={isCircuitOn}
            knownResistance={knownResistance}
            onRecord={handleRecordObservation}
            onCalculate={handleCalculate}
            onReset={handleReset}
            isBalanced={isBalanced}
            canRecord={knownResistance > 0}
            observationCount={observations.length}
            mode={combinationMode}
            r1={r1}
            r2={r2}
          />
        </div>
      </div>
      
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
          <ResistanceCombinationTable observations={observations} />
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
          <ResistanceCombinationCalculations results={results} r1={r1} r2={r2} />
        </div>
      </div>
    </>
  );
}