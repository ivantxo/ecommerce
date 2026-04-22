"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SizeQuantitySelectorProps {
  availableSizes: string[]; // This comes from product.sizes (e.g., ["S", "M"])
  onQtyChange: (quantities: Record<string, number>) => void;
  selectedSizes?: Record<string, number>; // Optional prop to pre-populate quantities
}

const SizeQuantitySelector = ({
  availableSizes,
  onQtyChange,
  selectedSizes,
}: SizeQuantitySelectorProps) => {
  // Initialize state with 0 for all available sizes
  const [quantities, setQuantities] = useState<Record<string, number>>(
    selectedSizes || {},
  );

  const handleInputChange = (size: string, value: string) => {
    const numValue = parseInt(value);
    const validatedValue = isNaN(numValue) || numValue < 0 ? 0 : numValue;

    const newQuantities = {
      ...quantities,
      [size]: validatedValue,
    };

    setQuantities(newQuantities);
    onQtyChange(newQuantities);
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Select Quantities</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {availableSizes.map((size) => (
          <div
            key={size}
            className="flex items-center space-x-2 border p-0.5 rounded-lg"
          >
            <span className="font-bold w-8">{size}</span>
            <Input
              type="number"
              min="0"
              placeholder="0"
              className="w-20"
              value={quantities[size] || ""}
              onChange={(e) => handleInputChange(size, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SizeQuantitySelector;
