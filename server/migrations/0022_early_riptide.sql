ALTER TABLE "shipping_addresses" RENAME TO "shippingAddresses";--> statement-breakpoint
ALTER TABLE "shippingAddresses" DROP CONSTRAINT "shipping_addresses_orderId_orders_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "orderIdx";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "transactionId" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shippingAddresses" ADD CONSTRAINT "shippingAddresses_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactionIdx" ON "orders" USING btree ("transactionId");