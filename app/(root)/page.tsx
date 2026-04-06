import ProductList from "@/components/shared/product/product-list";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/products.actions";
import ProductCarousel from "@/components/shared/product/product-carousel";
import { Decimal } from "@prisma/client/runtime/library";
import ViewAllProductsButton from "@/components/view-all-products-button";
import IconBoxes from "@/components/icon-boxes";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  const formattedFeaturedProducts = featuredProducts.map((product) => ({
    ...product,
    price: product.price as unknown as Decimal,
    rating: product.rating as unknown as Decimal,
  }));

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={formattedFeaturedProducts} />
      )}
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
      <ViewAllProductsButton />
      <IconBoxes />
    </>
  );
};

export default Homepage;
