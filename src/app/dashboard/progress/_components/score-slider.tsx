"use client";

interface ScoreSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

export default function ScoreSlider({
  label,
  description,
  value,
  onChange,
}: ScoreSliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        <span className="text-sm font-bold text-yellow-500">{value}</span>
      </div>
      <p className="mb-2 text-xs text-zinc-500">{description}</p>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer appearance-none rounded-full bg-zinc-800 h-2
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-600
          [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-yellow-600 [&::-moz-range-thumb]:border-0"
      />
    </div>
  );
}
