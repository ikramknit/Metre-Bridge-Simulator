import React from 'react';
import type { ResistanceCombinationObservation } from '../types';

interface ResistanceCombinationTableProps {
  observations: ResistanceCombinationObservation[];
}

const ResistanceCombinationTable: React.FC<ResistanceCombinationTableProps> = ({ observations }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-sky-400 mb-3">Observation Table</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-sky-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">S.No.</th>
              <th scope="col" className="px-4 py-3">Mode</th>
              <th scope="col" className="px-4 py-3">Known R (Ω)</th>
              <th scope="col" className="px-4 py-3">l (cm)</th>
              <th scope="col" className="px-4 py-3">S_exp (Ω)</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((obs) => (
              <tr key={obs.serial} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium">{obs.serial}</td>
                <td className={`px-4 py-3 font-semibold ${obs.mode === 'Series' ? 'text-indigo-300' : 'text-purple-300'}`}>{obs.mode}</td>
                <td className="px-4 py-3">{obs.R_known.toFixed(1)}</td>
                <td className="px-4 py-3">{obs.l.toFixed(1)}</td>
                <td className="px-4 py-3 font-bold text-green-400">{obs.S_experimental.toFixed(2)}</td>
              </tr>
            ))}
            {observations.length === 0 && (
                <tr className="border-b border-gray-700 h-10">
                    <td colSpan={5} className="px-4 py-3 text-center text-gray-500">Record observations to see them here.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResistanceCombinationTable;
