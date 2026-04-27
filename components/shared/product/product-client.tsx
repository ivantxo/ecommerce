"use client";

import { useEffect, useState, useMemo } from "react";
import { Product } from "@/types";
import { Loader } from "lucide-react";
import { getMyCart } from "@/lib/actions/cart.actions";
import ProductImages from "./product-iamges";
import Rating from "./rating";
import ProductColourSelector from "./product-colour-selector";
import ProductPrice from "./product-price";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddToCart from "./add-to-cart";
import ReviewList from "@/app/(root)/product/[slug]/review-list";
import { Cart } from "@/types";
import SizeQuantitySelector from "./product-size-selector";
import { useToast } from "@/hooks/use-toast";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

interface ProductClientProps {
  slug: string;
  userId?: string | null;
  product: Product;
}

const ProductClient = ({ slug, userId, product }: ProductClientProps) => {
  const [loading, setLoading] = useState(true);
  const [selectedColour, setSelectedColour] = useState("");
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [selectedQtys, setSelectedQtys] = useState<Record<string, number>>({});
  const [customerImage, setCustomerImage] = useState<string | null>(null);
  const { toast } = useToast();

  // Calculate total quantity for the Add to Cart button
  const totalQty = Object.values(selectedQtys).reduce(
    (acc, curr) => acc + curr,
    0,
  );

  // 1. Calculate total items across all sizes
  const totalItems = useMemo(() => {
    return Object.values(selectedQtys).reduce((acc, qty) => acc + qty, 0);
  }, [selectedQtys]);

  // 2. Calculate the dynamic total price
  // We use useMemo so this only recalculates when totalItems or price changes
  const dynamicPrice = useMemo(() => {
    const unitPrice = Number(product.price);
    return (unitPrice * totalItems).toFixed(2);
  }, [product.price, totalItems]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const cartData = await getMyCart();

        setCart(cartData);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) return <Loader className="animate-spin h-4 w-4" />;

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Images column */}
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          {/* Details column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>

              <h1 className="h3-bold">{product.name}</h1>

              <Rating value={Number(product.rating)} />

              <p>{product.numReviews} reviews</p>

              <ProductColourSelector
                colours={product.colours}
                initialSelectedColour={
                  product.colours ? product.colours[0] : undefined
                }
                onColourChange={setSelectedColour}
              />

              {product.sizes && product.sizes.length > 0 && (
                <SizeQuantitySelector
                  availableSizes={product.sizes}
                  onQtyChange={setSelectedQtys}
                />
              )}

              {/* Customer Image Upload - Only for authenticated users */}
              {userId && (
                <div>
                  <label className="text-sm font-semibold">
                    Upload your own design (optional)
                  </label>
                  <Card className="mt-2">
                    <CardContent className="space-y-2 mt-2 min-h-32 flex flex-col items-center justify-center">
                      {customerImage ? (
                        <div className="relative">
                          <Image
                            src={customerImage}
                            alt="Customer upload"
                            className="w-32 h-32 object-cover object-center rounded-sm"
                            width={150}
                            height={150}
                          />
                          <button
                            onClick={() => setCustomerImage(null)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            setCustomerImage(res[0].url);
                            toast({
                              description: "Image uploaded successfully",
                            });
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: "destructive",
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice
                  value={Number(dynamicPrice)}
                  className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          {/* Action column */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(dynamicPrice)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out Of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id.toString(),
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: totalQty,
                        image: product.images![0],
                        colour: selectedColour,
                        sizes: selectedQtys,
                        customerImage: customerImage,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="h2-bold">Customer Reviews</h2>
        <ReviewList
          userId={userId || ""}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </>
  );
};

export default ProductClient;
