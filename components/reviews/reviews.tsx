import { db } from "@/server";
import Review from "./review";
import ReviewForm from "./review-form";
import { orderProduct, orders, reviews } from "@/server/schema";
import { desc, eq, and, not, inArray } from "drizzle-orm";
import ReviewChart from "./review-chart";
import { auth } from "@/server/auth";
import { ReviewsWithUser } from "@/lib/infer-types";

export default async function Reviews({ productId }: { productId: number }) {
  const session = await auth();
  let userReview = null;
  let reviewsData: ReviewsWithUser[] = [];
  let canReview = false;

  if (session) {
    userReview = await db.query.reviews.findFirst({
      with: { user: true },
      where: and(
        eq(reviews.productId, productId),
        eq(reviews.userId, session.user.id)
      ),
    });
    const otherReviews = await db.query.reviews.findMany({
      with: { user: true },
      where: and(
        eq(reviews.productId, productId),
        not(eq(reviews.userId, session.user.id))
      ),
      orderBy: [desc(reviews.created)],
    });
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, session.user.id),
      columns: { id: true },
    });
    const orderIds = userOrders.map((order) => order.id);
    const hasOrdered = await db.query.orderProduct.findFirst({
      where: and(
        inArray(orderProduct.orderId, orderIds),
        eq(orderProduct.productId, productId)
      ),
    });

    reviewsData = userReview
      ? [userReview, ...otherReviews]
      : [...otherReviews];
    canReview = hasOrdered ? true : false;
  }

  if (!session) {
    reviewsData = await db.query.reviews.findMany({
      with: { user: true },
      where: eq(reviews.productId, productId),
      orderBy: [desc(reviews.created)],
    });
  }

  return (
    <section className="py-8">
      <div className="flex gap-2 lg:gap-12 justify-stretch lg:flex-row flex-col">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
          <Review
            reviews={reviewsData}
            isUserReview={!!userReview}
            canReview={canReview}
          />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          {canReview && <ReviewForm isUserReview={!!userReview} />}
          <ReviewChart reviews={reviewsData} />
        </div>
      </div>
    </section>
  );
}
