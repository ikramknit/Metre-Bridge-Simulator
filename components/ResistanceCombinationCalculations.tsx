import React from 'react';

interface ResistanceCombinationCalculationsProps {
  results: { series: number | null, parallel: number | null };
  r1: number;
  r2: number;
}

const ResultCard: React.FC<{
    title: string;
    theoretical: number;
    experimental: number | null;
}> = ({ title, theoretical, experimental }) => {
    const error = experimental !== null ? Math.abs((experimental - theoretical) / theoretical) * 100 : null;

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg flex flex-col gap-3">
            <h3 className="text-lg font-bold text-sky-400">{title}</h3>
            <div className="flex justify-between">
                <span className="text-gray-400">Theoretical Value:</span>
                <span className="font-mono font-bold">{theoretical.toFixed(2)} Ω</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Experimental Value:</span>
                <span className={`font-mono font-bold ${experimental !== null ? 'text-green-400' : 'text-gray-600'}`}>
                    {experimental !== null ? experimental.toFixed(2) : '-'} Ω
                </span>
            </div>
             <div className="flex justify-between items-center mt-2 border-t border-gray-700 pt-3">
                <span className="text-gray-400">Percentage Error:</span>
                <span className={`font-mono font-bold text-lg ${error !== null && error < 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {error !== null ? `${error.toFixed(2)}%` : '-'}
                </span>
            </div>
        </div>
    );
};

const ResistanceCombinationCalculations: React.FC<ResistanceCombinationCalculationsProps> = ({ results, r1, r2 }) => {
  const theoreticalSeries = r1 + r2;
  const theoreticalParallel = (r1 * r2) / (r1 + r2);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-sky-400">Calculations & Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard 
            title="Series Combination"
            theoretical={theoreticalSeries}
            experimental={results.series}
        />
         <ResultCard 
            title="Parallel Combination"
            theoretical={theoreticalParallel}
            experimental={results.parallel}
        />
      </div>
    </div>
  );
};

export default ResistanceCombinationCalculations;
