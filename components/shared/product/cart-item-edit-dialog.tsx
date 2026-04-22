"use client";

import { useState } from "react";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateItemInCart } from "@/lib/actions/cart.actions";
import { CartItem, Product } from "@/types";
import { Loader } from "lucide-react";
import ProductColourSelector from "./product-colour-selector";
import SizeQuantitySelector from "./product-size-selector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CartItemEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItem: CartItem;
  product: Product;
}

const CartItemEditDialog = ({
  open,
  onOpenChange,
  cartItem,
  product,
}: CartItemEditDialogProps) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Initialize state with current cart item values
  const [selectedColour, setSelectedColour] = useState(cartItem.colour);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>(
    cartItem.sizes,
  );

  // Calculate total quantity from sizes
  const totalQty = Object.values(selectedSizes).reduce(
    (acc, qty) => acc + qty,
    0,
  );

  const handleSave = () => {
    // Validate that at least one size has quantity
    if (totalQty === 0) {
      toast({
        variant: "destructive",
        description: "Please select at least one quantity",
      });
      return;
    }

    startTransition(async () => {
      const res = await updateItemInCart(
        cartItem.productId,
        totalQty,
        selectedColour,
        selectedSizes,
      );

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Item: {product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Colour Selector */}
          {product.colours && product.colours.length > 0 && (
            <div>
              <ProductColourSelector
                colours={product.colours}
                initialSelectedColour={selectedColour}
                onColourChange={setSelectedColour}
              />
            </div>
          )}

          {/* Size Quantity Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <SizeQuantitySelector
                availableSizes={product.sizes}
                onQtyChange={setSelectedSizes}
                selectedSizes={selectedSizes}
              />
            </div>
          )}

          {/* Total Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Quantity:</span>
              <span className="text-lg font-bold">{totalQty}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending || totalQty === 0}
            onClick={handleSave}
          >
            {isPending ? (
              <Loader className="animate-spin h-4 w-4" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CartItemEditDialog;
