"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Toast, ToastAction } from "@radix-ui/react-toast";
import { addItemToCart } from "@/lib/actions/cart.actions";

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res?.success) {
      toast({
        variant: "destructive",
        description: res?.message,
      });
      return;
    }

    // Handle success add to cart
    toast({
      description: res.message,
      action: (
        <ToastAction
          className="bg-slate-300"
          altText="Go to cart"
          onClick={() => router.push("/cart")}
        >
          Go to cart
        </ToastAction>
      ),
    });
  };

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      + Add to Cart
    </Button>
  );
};

export default AddToCart;
