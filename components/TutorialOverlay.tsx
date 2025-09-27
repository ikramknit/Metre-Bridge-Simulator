
import React from 'react';

interface TutorialOverlayProps {
  onDismiss: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 max-w-md w-full text-white transform transition-all animate-slide-up">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Welcome to the Simulator!</h2>
        <p className="text-gray-300 mb-4">Here’s a quick guide to get you started:</p>
        <ol className="list-decimal list-inside space-y-3 text-gray-300">
          <li>
            <span className="font-semibold text-white">Power On:</span> Use the toggle in the <span className="text-cyan-400">Controls</span> panel to turn the circuit on.
          </li>
          <li>
            <span className="font-semibold text-white">Adjust Resistance:</span> Set a <span className="text-cyan-400">Known Resistance (R)</span> with the slider.
          </li>
          <li>
            <span className="font-semibold text-white">Find Null Point:</span> Click and drag the <span className="text-cyan-400">Jockey</span> along the wire until the Galvanometer needle points to zero.
          </li>
          <li>
            <span className="font-semibold text-white">Record Data:</span> Once balanced, click the <span className="text-cyan-400">Record Observation</span> button.
          </li>
          <li>
            <span className="font-semibold text-white">Calculate:</span> After taking a few readings, press <span className="text-cyan-400">Calculate</span> to see the final results.
          </li>
        </ol>
        <button
          onClick={onDismiss}
          className="w-full mt-6 py-2 px-4 font-bold rounded-md bg-cyan-500 hover:bg-cyan-600 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Start Experiment
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default TutorialOverlay;
