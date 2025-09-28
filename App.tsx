
import React, { useState, useEffect, useRef, useCallback } from 'react';
import MetreBridge from './components/MetreBridge';
import ControlPanel from './components/ControlPanel';
import ObservationTable from './components/ObservationTable';
import Calculations from './components/Calculations';
import TutorialOverlay from './components/TutorialOverlay';
import type { Observation } from './types';
import { S_ACTUAL } from './constants';

export default function App(): React.ReactElement {
  const [isCircuitOn, setIsCircuitOn] = useState<boolean>(false);
  const [knownResistance, setKnownResistance] = useState<number>(5);
  const [jockeyPosition, setJockeyPosition] = useState<number>(50);
  const [galvanometerDeflection, setGalvanometerDeflection] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [wireLength, setWireLength] = useState<number>(1); // in meters
  const [wireDiameter, setWireDiameter] = useState<number>(0.5); // in mm

  const [observations, setObservations] = useState<Observation[]>([]);
  const [meanS, setMeanS] = useState<number | null>(null);
  const [resistivity, setResistivity] = useState<number | null>(null);
  
  const [showTutorial, setShowTutorial] = useState<boolean>(false);

  const wireRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenMetreBridgeTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    if (isCircuitOn) {
      // Avoid division by zero or negative if knownResistance is 0
      if (S_ACTUAL + knownResistance <= 0) {
        setGalvanometerDeflection(jockeyPosition > 50 ? 45 : -45);
        return;
      }
      const calculatedBalancingPoint = (100 * knownResistance) / (S_ACTUAL + knownResistance);
      const sensitivity = 0.8;
      let deflection = (jockeyPosition - calculatedBalancingPoint) * sensitivity;
      // Clamp the deflection to a max/min value
      deflection = Math.max(-45, Math.min(45, deflection));
      setGalvanometerDeflection(deflection);
    } else {
      setGalvanometerDeflection(0);
    }
  }, [jockeyPosition, isCircuitOn, knownResistance]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && wireRef.current) {
      const rect = wireRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let position = (x / rect.width) * 100;
      position = Math.max(0, Math.min(100, position)); // Clamp between 0 and 100
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

  const handleRecordObservation = () => {
    const isBalanced = Math.abs(galvanometerDeflection) < 0.5;
    if (isBalanced && observations.length < 5 && knownResistance > 0) {
      const l = jockeyPosition;
      const sValue = knownResistance * ((100-l) / l);
      const newObservation: Observation = {
        serial: observations.length + 1,
        R: knownResistance,
        l: parseFloat(l.toFixed(1)),
        s: parseFloat(sValue.toFixed(2)),
      };
      setObservations([...observations, newObservation]);
    }
  };
  
  const handleCalculate = () => {
    if(observations.length > 0) {
      const sumS = observations.reduce((acc, obs) => acc + obs.s, 0);
      const meanSValue = sumS / observations.length;
      setMeanS(meanSValue);

      const radius = (wireDiameter / 2) * 1e-3; // convert mm to m
      const area = Math.PI * radius * radius;
      const rho = (meanSValue * area) / wireLength;
      setResistivity(rho);
    }
  };

  const handleReset = () => {
    setIsCircuitOn(false);
    setKnownResistance(5);
    setJockeyPosition(50);
    setWireLength(1);
    setWireDiameter(0.5);
    setObservations([]);
    setMeanS(null);
    setResistivity(null);
    setIsDragging(false);
  };

  const handleDismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenMetreBridgeTutorial', 'true');
  };
  
  const isBalanced = Math.abs(galvanometerDeflection) < 0.5 && isCircuitOn;

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center p-4 selection:bg-sky-500 selection:text-white">
      {showTutorial && <TutorialOverlay onDismiss={handleDismissTutorial} />}

      <header className="w-full max-w-7xl text-center mb-4">
        <h1 className="text-4xl font-bold text-sky-400">Metre Bridge Simulator</h1>
        <p className="text-gray-400 mt-1">To find the resistance of a given wire and determine its specific resistance (resistivity).</p>
      </header>
      
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 p-2 sm:p-4 rounded-2xl shadow-2xl border border-gray-700">
           <MetreBridge
             jockeyPosition={jockeyPosition}
             galvanometerDeflection={galvanometerDeflection}
             isCircuitOn={isCircuitOn}
             setIsCircuitOn={setIsCircuitOn}
             wireRef={wireRef}
             onMouseDownOnWire={handleMouseDownOnWire}
             isBalanced={isBalanced}
             knownResistance={knownResistance}
             setKnownResistance={setKnownResistance}
             wireLength={wireLength}
             setWireLength={setWireLength}
             wireDiameter={wireDiameter}
             setWireDiameter={setWireDiameter}
           />
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-4 border border-gray-700">
          <ControlPanel
            isCircuitOn={isCircuitOn}
            knownResistance={knownResistance}
            wireLength={wireLength}
            wireDiameter={wireDiameter}
            onRecord={handleRecordObservation}
            onCalculate={handleCalculate}
            onReset={handleReset}
            isBalanced={isBalanced}
            canRecord={observations.length < 5 && knownResistance > 0}
            observationCount={observations.length}
          />
        </div>
      </div>
      
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
          <ObservationTable observations={observations} />
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
          <Calculations meanS={meanS} resistivity={resistivity} />
        </div>
      </div>
    </div>
  );
}
