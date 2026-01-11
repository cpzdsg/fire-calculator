import React from 'react';

export function Slider({ value, onChange, min = 0, max = 10, step = 0.1, label, helperText }) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-neon-green"
          style={{
            background: `linear-gradient(to right, #00ff88 0%, #00ff88 ${percentage}%, #1e293b ${percentage}%, #1e293b 100%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{min}%</span>
          <span className="text-sm font-semibold text-neon-green">{value.toFixed(1)}%</span>
          <span className="text-xs text-gray-500">{max}%</span>
        </div>
      </div>
      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}

