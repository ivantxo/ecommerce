"use client";

import { useEffect, useState } from "react";
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

interface ProductClientProps {
  slug: string;
  userId?: string | null;
  product: Product;
}

const ProductClient = ({ slug, userId, product }: ProductClientProps) => {
  const [loading, setLoading] = useState(true);
  const [selectedColour, setSelectedColour] = useState("");
  const [cart, setCart] = useState<Cart | undefined>(undefined);

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("1. Client received slug from props:", slug);

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

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice
                  value={Number(product.price)}
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
                    <ProductPrice value={Number(product.price)} />
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
                        qty: 1,
                        image: product.images![0],
                        colour: selectedColour,
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
