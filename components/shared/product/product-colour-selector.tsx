"use client";

import { useState } from "react";

interface ProductColourSelectorProps {
  colours: string[];
  initialSelectedColour?: string;
  onColourChange?: (colour: string) => void;
}

const ProductColourSelector = ({
  colours,
  initialSelectedColour,
  onColourChange,
}: ProductColourSelectorProps) => {
  const [selectedColour, setSelectedColour] = useState<string>(
    initialSelectedColour || colours[0] || "",
  );

  const handleColourSelect = (colour: string) => {
    setSelectedColour(colour);
    onColourChange?.(colour); // Call the callback with the new colour
  };

  if (!colours || colours.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>Colours</div>
      <div className="grid grid-cols-9 gap-3">
        {colours.map((col, index) => {
          const isSelected = selectedColour === col;

          return (
            <button
              key={col || index}
              type="button"
              className={`flex items-center justify-center rounded-lg border p-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isSelected
                  ? "border-blue-500 shadow-sm"
                  : "border-gray-300 hover:border-gray-500"
              }`}
              onClick={() => handleColourSelect(col)}
              aria-pressed={isSelected}
              title={col}
            >
              <span
                className={`block w-4 h-4 rounded-full border ${
                  isSelected ? "border-blue-700" : "border-gray-400"
                }`}
                style={{ backgroundColor: col }}
              />
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <div className="font-medium">Selected Colour</div>
        <div
          className="w-4 h-4 rounded-full border border-gray-400"
          style={{ backgroundColor: selectedColour }}
        />
        <span className="text-sm text-muted-foreground">{selectedColour}</span>
      </div>
    </div>
  );
};

export default ProductColourSelector;
