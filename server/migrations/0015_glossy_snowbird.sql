ALTER TABLE "review" RENAME TO "reviews";--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "review_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "review_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "productId" SET DATA TYPE serial;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
