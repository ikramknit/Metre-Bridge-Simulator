
import React, { useState } from 'react';
import MetreBridgeApp from './MetreBridgeApp';
import OhmsLawApp from './OhmsLawApp';

const practicals = {
  'metre-bridge': {
    name: 'Metre Bridge',
    component: MetreBridgeApp,
    description: 'To find the resistance of a given wire and determine its specific resistance (resistivity).'
  },
  'ohms-law': {
    name: "Ohm's Law",
    component: OhmsLawApp,
    description: 'To determine resistance per cm of a given wire by plotting a graph of potential difference versus current.'
  }
};

type PracticalKey = keyof typeof practicals;

export default function App(): React.ReactElement {
  const [activePractical, setActivePractical] = useState<PracticalKey>('metre-bridge');
  
  const ActivePracticalComponent = practicals[activePractical].component;
  const activePracticalDescription = practicals[activePractical].description;

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center p-4 selection:bg-sky-500 selection:text-white">
      <header className="w-full max-w-7xl text-center mb-4">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <h1 className="text-4xl font-bold text-sky-400">Virtual Physics Lab</h1>
            <select 
                value={activePractical} 
                onChange={(e) => setActivePractical(e.target.value as PracticalKey)}
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-2.5"
            >
                {Object.entries(practicals).map(([key, value]) => (
                    <option key={key} value={key}>{value.name}</option>
                ))}
            </select>
        </div>
        <p className="text-gray-400 mt-2">{activePracticalDescription}</p>
      </header>
      
      <ActivePracticalComponent />
    </div>
  );
}