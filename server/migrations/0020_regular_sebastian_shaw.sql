CREATE TABLE IF NOT EXISTS "shipping_addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"orderId" integer NOT NULL,
	"name" text NOT NULL,
	"address1" text NOT NULL,
	"address2" text,
	"email" text,
	"phone" text NOT NULL,
	"pincode" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipping_addresses" ADD CONSTRAINT "shipping_addresses_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orderIdx" ON "shipping_addresses" USING btree ("orderId");--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "recipientUrl";