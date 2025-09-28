
import React from 'react';
import type { Observation } from '../types';

interface ObservationTableProps {
  observations: Observation[];
}

const ObservationTable: React.FC<ObservationTableProps> = ({ observations }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-sky-400 mb-3">Observation Table</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-sky-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">S.No.</th>
              <th scope="col" className="px-4 py-3">Known R (Ω)</th>
              <th scope="col" className="px-4 py-3">Balancing l (cm)</th>
              <th scope="col" className="px-4 py-3">100 - l (cm)</th>
              <th scope="col" className="px-4 py-3">S = R(100-l)/l (Ω)</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((obs) => (
              <tr key={obs.serial} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium">{obs.serial}</td>
                <td className="px-4 py-3">{obs.R.toFixed(1)}</td>
                <td className="px-4 py-3">{obs.l.toFixed(1)}</td>
                <td className="px-4 py-3">{(100 - obs.l).toFixed(1)}</td>
                <td className="px-4 py-3 font-bold text-green-400">{obs.s.toFixed(2)}</td>
              </tr>
            ))}
            {observations.length < 5 && [...Array(5 - observations.length)].map((_, index) => (
                <tr key={`placeholder-${index}`} className="border-b border-gray-700 h-10">
                    <td className="px-4 py-3 text-gray-500">{observations.length + index + 1}</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ObservationTable;
