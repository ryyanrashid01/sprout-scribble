CREATE TABLE IF NOT EXISTS "review" (
	"id" serial PRIMARY KEY NOT NULL,
	"rating" real NOT NULL,
	"userId" text NOT NULL,
	"productId" serial NOT NULL,
	"comment" text NOT NULL,
	"created" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review" ADD CONSTRAINT "review_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review" ADD CONSTRAINT "review_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "productIdx" ON "review" USING btree ("productId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userIdx" ON "review" USING btree ("userId");