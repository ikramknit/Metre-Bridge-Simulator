
import React from 'react';
import { OhmsLawObservation } from '../types';

interface OhmsLawTableProps {
  observations: OhmsLawObservation[];
}

const OhmsLawTable: React.FC<OhmsLawTableProps> = ({ observations }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-sky-400 mb-3">Observation Table</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-sky-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">S.No.</th>
              <th scope="col" className="px-4 py-3">Voltmeter Reading (V)</th>
              <th scope="col" className="px-4 py-3">Ammeter Reading (A)</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((obs) => (
              <tr key={obs.serial} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium">{obs.serial}</td>
                <td className="px-4 py-3 font-mono">{obs.V.toFixed(3)}</td>
                <td className="px-4 py-3 font-mono">{obs.I.toFixed(3)}</td>
              </tr>
            ))}
            {observations.length < 6 && [...Array(6 - observations.length)].map((_, index) => (
                <tr key={`placeholder-${index}`} className="border-b border-gray-700 h-10">
                    <td className="px-4 py-3 text-gray-500">{observations.length + index + 1}</td>
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

export default OhmsLawTable;
