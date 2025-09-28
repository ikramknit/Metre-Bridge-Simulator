
import React from 'react';

interface GraphProps {
    data: { x: number; y: number }[];
    xLabel: string;
    yLabel: string;
    title: string;
}

const Graph: React.FC<GraphProps> = ({ data, xLabel, yLabel, title }) => {
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 500;
    const height = 300;
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const maxX = Math.max(1, ...data.map(d => d.x)) * 1.1;
    const maxY = Math.max(1, ...data.map(d => d.y)) * 1.1;

    const xScale = (x: number) => (x / maxX) * innerWidth;
    const yScale = (y: number) => innerHeight - (y / maxY) * innerHeight;
    
    const linePath = data
        .map(d => `${xScale(d.x)},${yScale(d.y)}`)
        .join(' L ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-gray-300">
            <g transform={`translate(${padding.left}, ${padding.top})`}>
                {/* Axes */}
                <line x1="0" y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="currentColor" strokeWidth="1" />
                <line x1="0" y1="0" x2="0" y2={innerHeight} stroke="currentColor" strokeWidth="1" />

                {/* Y-Axis Ticks and Labels */}
                {[...Array(5)].map((_, i) => {
                    const y = (i / 4) * maxY;
                    return (
                        <g key={`y-tick-${i}`}>
                            <line x1="-5" y1={yScale(y)} x2={innerWidth} y2={yScale(y)} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3" />
                            <text x="-8" y={yScale(y) + 3} textAnchor="end" fontSize="10" fill="currentColor">{y.toFixed(1)}</text>
                        </g>
                    );
                })}

                {/* X-Axis Ticks and Labels */}
                {[...Array(5)].map((_, i) => {
                    const x = (i / 4) * maxX;
                    return (
                        <g key={`x-tick-${i}`}>
                            <line x1={xScale(x)} y1={innerHeight + 5} x2={xScale(x)} y2="0" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3" />
                            <text x={xScale(x)} y={innerHeight + 15} textAnchor="middle" fontSize="10" fill="currentColor">{x.toFixed(1)}</text>
                        </g>
                    );
                })}

                {/* Data Line */}
                {data.length > 1 && <path d={`M ${linePath}`} stroke="#4ade80" strokeWidth="2" fill="none" />}

                {/* Data Points */}
                {data.map((d, i) => (
                    <circle key={`point-${i}`} cx={xScale(d.x)} cy={yScale(d.y)} r="3" fill="#4ade80" />
                ))}

                {/* Labels */}
                <text x={innerWidth / 2} y={innerHeight + 35} textAnchor="middle" fontSize="12" fill="currentColor" fontWeight="bold">{xLabel}</text>
                <text transform={`translate(-35, ${innerHeight / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="currentColor" fontWeight="bold">{yLabel}</text>
                <text x={innerWidth / 2} y="-5" textAnchor="middle" fontSize="14" fill="#67e8f9" fontWeight="bold">{title}</text>
            </g>
        </svg>
    );
};

export default Graph;
