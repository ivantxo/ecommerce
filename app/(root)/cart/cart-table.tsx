"use client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTransition, useState } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { getProductById } from "@/lib/actions/products.actions";
import { ArrowRight, Loader, Edit2, Trash2 } from "lucide-react";
import { Cart, Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import CartItemEditDialog from "@/components/shared/product/cart-item-edit-dialog";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItemProduct, setSelectedItemProduct] =
    useState<Product | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );

  const handleEditClick = async (productId: string, itemIndex: number) => {
    try {
      const product = await getProductById(productId);
      if (!product) {
        toast({
          variant: "destructive",
          description: "Product not found",
        });
        return;
      }
      setSelectedItemProduct(product as Product);
      setSelectedItemIndex(itemIndex);
      setEditDialogOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to load product details",
      });
    }
  };

  const handleRemoveClick = async (productId: string) => {
    try {
      startTransition(async () => {
        const result = await removeItemFromCart(productId);
        if (!result.success) {
          toast({
            variant: "destructive",
            description: result.message,
          });
        } else {
          toast({
            description: result.message,
          });
        }
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to remove item from cart",
      });
    }
  };

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item, index) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-start gap-2"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold">{item.name}</span>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div
                              className="w-4 h-4 rounded border border-gray-300"
                              style={{ backgroundColor: item.colour }}
                              title={item.colour}
                            />
                            <span>{item.colour}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Sizes:
                            {Object.entries(item.sizes).map(([size, qty]) => (
                              <span key={size} className="ml-2">
                                {size} × {qty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        disabled={isPending}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(item.productId, index)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        disabled={isPending}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveClick(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(cart.itemsPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="pb-3 text-xl">
                Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):
                <span className="font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                className="w-full"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push("/shipping-address"))
                }
              >
                {isPending ? (
                  <Loader className="animate-spin h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}{" "}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          {selectedItemProduct && selectedItemIndex !== null && (
            <CartItemEditDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              cartItem={cart.items[selectedItemIndex]}
              product={selectedItemProduct}
            />
          )}
        </div>
      )}
    </>
  );
};

export default CartTable;
