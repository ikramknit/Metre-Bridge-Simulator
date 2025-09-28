
import React from 'react';

interface TutorialOverlayProps {
  onDismiss: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 max-w-md w-full text-white transform transition-all animate-slide-up">
        <h2 className="text-2xl font-bold text-sky-400 mb-4">Welcome to the Virtual Lab!</h2>
        <p className="text-gray-300 mb-4">Here’s a quick guide to get you started:</p>
        <ol className="list-decimal list-inside space-y-3 text-gray-300">
          <li>
            <span className="font-semibold text-white">Power On:</span> Click the <span className="text-sky-400">Power Button</span> on the power supply to start the circuit.
          </li>
          <li>
            <span className="font-semibold text-white">Set Known Resistance (R):</span> Click the <span className="text-sky-400">plugs</span> on the resistance box to add or remove resistance.
          </li>
          <li>
            <span className="font-semibold text-white">Configure Unknown Wire (S):</span> Click the <span className="text-sky-400">settings icon (X)</span> next to the coil to set its length and diameter.
          </li>
          <li>
            <span className="font-semibold text-white">Find Null Point:</span> Click and drag the <span className="text-sky-400">Jockey</span> along the wire until the Galvanometer needle points to zero.
          </li>
          <li>
            <span className="font-semibold text-white">Record & Calculate:</span> Once balanced, use the buttons in the <span className="text-sky-400">Controls</span> panel to record your observation and calculate the results.
          </li>
        </ol>
        <button
          onClick={onDismiss}
          className="w-full mt-6 py-2 px-4 font-bold rounded-md bg-sky-500 hover:bg-sky-600 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-gray-800"
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
