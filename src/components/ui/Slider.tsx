'use client';

import { InputHTMLAttributes } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  displayValue?: string;
}

export default function Slider({
  label,
  value,
  min,
  max,
  onChange,
  displayValue,
  className = '',
  ...props
}: SliderProps) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-dark/70">{label}</label>
          <span className="text-sm font-semibold text-teal">
            {displayValue ?? value}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`
          w-full h-2 rounded-full appearance-none cursor-pointer
          bg-sandy-gold/20
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-teal
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-teal
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:cursor-pointer
          ${className}
        `}
        {...props}
      />
      <div className="flex justify-between text-xs text-dark/40">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
