"use client";

import { useId } from "react";

interface ScoreSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  color?: string;
}

export default function ScoreSlider({
  label,
  description,
  value,
  onChange,
  color,
}: ScoreSliderProps) {
  const id = useId();
  const thumbColor = color ?? "#ca8a04";
  const valueColor = color ?? undefined;

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        <span className="text-sm font-bold text-yellow-500" style={valueColor ? { color: valueColor } : undefined}>{value}</span>
      </div>
      <p className="mb-2 text-xs text-zinc-500">{description}</p>
      <style>{`#slider-${CSS.escape(id)}::-webkit-slider-thumb{background:${thumbColor}}#slider-${CSS.escape(id)}::-moz-range-thumb{background:${thumbColor}}`}</style>
      <input
        id={`slider-${id}`}
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer appearance-none rounded-full bg-zinc-800 h-2
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
      />
    </div>
  );
}
