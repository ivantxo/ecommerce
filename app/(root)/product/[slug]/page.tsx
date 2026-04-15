import ProductClient from "@/components/shared/product/product-client";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/actions/products.actions";

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  // Convert to a plain JSON object to satisfy the "Plain Object" rule
  const plainProduct = JSON.parse(JSON.stringify(product));

  if (!product) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  return <ProductClient slug={slug} userId={userId} product={plainProduct} />;
};

export default ProductDetailsPage;
