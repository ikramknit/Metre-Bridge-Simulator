
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface OhmsLawVisualizationProps {
    isCircuitOn: boolean;
    setIsCircuitOn: (isOn: boolean) => void;
    rheostatValue: number;
    setRheostatValue: (value: number) => void;
    ammeterReading: number;
    voltmeterReading: number;
}

const Meter: React.FC<{ label: string; reading: number; maxReading: number; unit: string; x: number; y: number; isBalanced?: boolean }> = ({ label, reading, maxReading, unit, x, y }) => {
    const deflection = (reading / maxReading) * 90; // Max 90 degrees deflection
    const clampedDeflection = Math.max(-90, Math.min(90, deflection));

    return (
        <g transform={`translate(${x}, ${y})`}>
            <rect x="-25" y="-12.5" width="50" height="25" fill="#f1f5f9" rx="3" stroke="#4b5563" strokeWidth="1.5" />
            <rect x="-20" y="-10.5" width="40" height="15" fill="white" />
            <g stroke="#4b5563" strokeWidth="0.5">
                <path d="M -7.1 -5 A 10 10 0 0 1 7.1 -5" fill="none" stroke="#9ca3af" />
                <line x1="0" y1="-8" x2="0" y2="-10" strokeWidth="0.7" />
                <line x1="0" y1="-8" x2="0" y2="-9" transform="rotate(-45, 0, 2.5)" />
                <line x1="0" y1="-8" x2="0" y2="-9" transform="rotate(45, 0, 2.5)" />
                <line x1="0" y1="-8" x2="0" y2="-9.5" transform="rotate(-90, 0, 2.5)" />
                <line x1="0" y1="-8" x2="0" y2="-9.5" transform="rotate(90, 0, 2.5)" />
            </g>
            <line x1="0" y1="2.5" x2="0" y2="-8" stroke="#dc2626" strokeWidth="1.5" transform={`rotate(${clampedDeflection}, 0, 2.5)`} className="origin-bottom transition-transform duration-200 ease-in-out" />
            <text x="0" y="10" textAnchor="middle" fontSize="6" fill="#1e293b" className="font-sans font-semibold">{reading.toFixed(2)} {unit}</text>
            <text x="0" y="-16" textAnchor="middle" fontSize="10" fill="#1e293b" className="font-bold">{label}</text>
        </g>
    );
};


const OhmsLawVisualization: React.FC<OhmsLawVisualizationProps> = (props) => {
    const { isCircuitOn, setIsCircuitOn, rheostatValue, setRheostatValue, ammeterReading, voltmeterReading } = props;
    const circuitStrokeColor = isCircuitOn ? '#3b82f6' : '#4b5563';
    const textFillColor = '#cbd5e1';
    
    const sliderRef = useRef<SVGRectElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging && sliderRef.current) {
            const svg = sliderRef.current.ownerSVGElement;
            if (svg) {
                const pt = svg.createSVGPoint();
                pt.x = e.clientX;
                const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
                let position = ((svgP.x - 130) / 140) * 100;
                position = Math.max(0, Math.min(100, position));
                setRheostatValue(position);
            }
        }
    }, [isDragging, setRheostatValue]);

    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const sliderX = 130 + (rheostatValue / 100) * 140;

    return (
        <div className="relative flex flex-col items-center justify-center h-[450px] p-4 bg-gray-900/80 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-repeat">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/50 to-gray-900/80"></div>
            <style>{`
                @keyframes march { to { stroke-dashoffset: 20; } }
                .current-flow { stroke-dasharray: 10 10; animation: march 1s linear infinite; }
            `}</style>
            <div className="w-full h-full relative">
                 <svg viewBox="0 0 400 250" className="absolute w-full h-full" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <marker id="arrow-ohms" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
                        </marker>
                    </defs>

                    {/* Wires */}
                    <path d="M 60 50 V 180 H 100" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
                    <path d="M 140 180 H 340 V 50 H 250" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
                    <path d="M 208 50 H 230" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
                    <path d="M 60 50 H 154" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
                    <path d="M 200 120 V 155" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />
                    <path d="M 240 120 V 155" stroke={circuitStrokeColor} strokeWidth="1.5" fill="none" />


                    {/* DC Power Supply */}
                    <g className="cursor-pointer" onClick={() => setIsCircuitOn(!isCircuitOn)}>
                         {/* Reusing Metre Bridge definitions, assuming they are available or define them here */}
                        <rect x="140" y="20" width="85" height="40" rx="4" fill="url(#power-supply-body)" stroke="#4b5569" strokeWidth="1"/>
                        <rect x="142" y="22" width="81" height="36" rx="2" fill="url(#power-supply-face)" />
                        <text x="182.5" y="17" textAnchor="middle" fontSize="6" fill="#374151" className="font-sans font-bold tracking-wider">DC SUPPLY</text>
                        <rect x="170" y="28" width="30" height="15" rx="2" fill="#1e293b" stroke="#111827" strokeWidth="1" />
                        <rect x="171" y="29" width="28" height="13" rx="1" fill="#374151" opacity="0.3" />
                        <text x="185" y="39" textAnchor="middle" fontSize="9" fill="#4ade80" className="font-mono font-bold tracking-wider" style={{textShadow: '0 0 5px #4ade80'}}>6.0V</text>
                        <g transform="translate(154, 36)">
                            <circle cx="0" cy="0" r="7" fill="#1f2937" /><circle cx="0" cy="0" r="6" fill={isCircuitOn ? '#dc2626' : '#b91c1c'} className="transition-colors duration-200" filter="url(#inner-shadow)" style={{transform: isCircuitOn ? 'scale(0.95)' : 'scale(1)', transition: 'transform 0.1s ease'}}/>
                            <text x="0" y="16" textAnchor="middle" fontSize="6" fill={textFillColor} className="font-mono font-bold">ON/OFF</text>
                        </g>
                        <g transform="translate(154, 50)"><circle cx="0" cy="0" r="6" fill="#1f2937" /><circle cx="0" cy="0" r="5" fill="#374151"/><rect x="-2.5" y="-1" width="5" height="2" fill="#9ca3af"/></g>
                        <g transform="translate(208, 50)"><circle cx="0" cy="0" r="6" fill="#7f1d1d" /><circle cx="0" cy="0" r="5" fill="#b91c1c"/><rect x="-2.5" y="-1" width="5" height="2" fill="#fecaca"/><rect x="-1" y="-2.5" width="2" height="5" fill="#fecaca"/></g>
                    </g>
                     {/* Plug Key */}
                    <g transform="translate(240, 30)">
                        <rect x="-15" y="12" width="30" height="8" fill="#1e293b" rx="2"/><circle cx="-10" cy="16" r="3" fill="#b87333" /><circle cx="10" cy="16" r="3" fill="#b87333" />
                        <g style={{ transition: 'transform 0.3s ease-in-out', transform: isCircuitOn ? 'translateY(0px)' : 'translateY(-12px)' }}>
                          <rect x="-12" y="0" width="24" height="10" rx="2" fill="#111827"/><rect x="-10" y="1" width="20" height="8" rx="2" fill="#b87333"/><rect x="-1" y="-3" width="2" height="6" fill="#1e293b" />
                        </g>
                        <text x="0" y="32" textAnchor="middle" fontSize="10" fill={textFillColor} className="font-bold">K</text>
                    </g>

                    {/* Ammeter */}
                    <Meter label="A" reading={ammeterReading} maxReading={3} unit="A" x="120" y="180" />

                    {/* Voltmeter */}
                    <Meter label="V" reading={voltmeterReading} maxReading={5} unit="V" x="220" y="100" />

                    {/* Resistance Wire */}
                     <g transform="translate(180, 155)">
                         <path d="M 0 5 C 5 0, 10 10, 15 5 C 20 0, 25 10, 30 5 C 35 0, 40 10, 45 5 C 50 0, 55 10, 60 5" stroke="#9ca3af" strokeWidth="1.5" fill="none"/>
                         <text x="30" y="25" textAnchor="middle" fontSize="10" className="font-bold" fill={textFillColor}>R</text>
                     </g>

                    {/* Rheostat */}
                    <g>
                        <rect x="130" y="180" width="140" height="10" rx="5" fill="#d1d5db" />
                        <line x1="130" y1="185" x2="270" y2="185" stroke="#4b5569" strokeWidth="1" />
                        <path d="M 130 185 H ${sliderX}" stroke={circuitStrokeColor} strokeWidth="1.5" />
                        <path d="M 130 190 V 200 H 340" stroke={circuitStrokeColor} strokeWidth="1.5" />
                        <path d="M ${sliderX} 185 V 170 H 140" stroke={circuitStrokeColor} strokeWidth="1.5" />
                        <rect
                            ref={sliderRef}
                            x={sliderX - 5} y="165" width="10" height="25" rx="2" fill="#1e293b" stroke="#4b5569"
                            className="cursor-pointer"
                            onMouseDown={() => { if(isCircuitOn) setIsDragging(true); }}
                        />
                        <text x="200" y="210" textAnchor="middle" fontSize="10" className="font-bold" fill={textFillColor}>Rh</text>
                    </g>
                    
                     {/* Current Flow Animation */}
                    <g stroke="#60a5fa" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-ohms)" className={isCircuitOn ? 'current-flow' : 'hidden'}>
                        <path d="M 208 50 H 230" />
                        <path d="M 250 50 H 340 V 180 H 130" />
                        <path d="M 130 200 H 130" />
                        <path d="M ${sliderX} 170 H 140 V 180" />
                        <path d="M 100 180 H 60 V 50 H 154" />
                    </g>
                 </svg>
            </div>
        </div>
    );
};

export default OhmsLawVisualization;
