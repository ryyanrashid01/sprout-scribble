import AddCart from "@/components/cart/add-cart";
import ProductImages from "@/components/products/product-images";
import ProductType from "@/components/products/product-type";
import VariantPick from "@/components/products/variant-pick";
import Reviews from "@/components/reviews/reviews";
import Stars from "@/components/reviews/stars";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/format-price";
import { getReviewAverage } from "@/lib/review-average";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60 * 60;

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  if (data) {
    const slugId = data.map((variant) => ({
      slug: variant.id.toString(),
    }));

    return slugId;
  }

  return [];
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          reviews: true,
          productVariants: {
            with: {
              variantImages: true,
              variantTags: true,
            },
          },
        },
      },
    },
  });

  if (variant) {
    const reviewAvg = getReviewAverage(
      variant.product.reviews.map((r) => r.rating)
    );

    return (
      <main>
        <section className="flex flex-col lg:flex-row md:gap-4 lg:gap-12">
          <div className="flex-1">
            <ProductImages variants={variant.product.productVariants} />
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <div>
              <h2 className="font-bold text-2xl">{variant?.product.title}</h2>
              <div>
                <ProductType variants={variant.product.productVariants} />
                {
                  <Stars
                    rating={reviewAvg}
                    totalReviews={variant.product.reviews.length}
                  />
                }
              </div>
            </div>
            <Separator />
            <p className="text-2xl font-medium">
              {formatPrice(variant.product.price)}
            </p>
            <div className="prose prose-slate prose-sm dark:prose-invert prose-p:py-0 prose-p:my-0">
              <div
                dangerouslySetInnerHTML={{
                  __html: variant.product.description,
                }}
              ></div>
            </div>
            <p className="text-secondary-foreground font-bold">
              Available Colors
            </p>
            <div className="flex gap-4">
              {variant.product.productVariants.map((prodVariant, index) => (
                <VariantPick
                  key={prodVariant.id}
                  productId={prodVariant.productId}
                  color={prodVariant.color}
                  id={prodVariant.id}
                  image={prodVariant.variantImages[0].url}
                  price={variant.product.price}
                  productType={prodVariant.productType}
                  title={variant.product.title}
                  isFirst={index === 0}
                />
              ))}
            </div>
            <AddCart />
          </div>
        </section>
        <Reviews productId={variant.productId} />
      </main>
    );
  }
}
