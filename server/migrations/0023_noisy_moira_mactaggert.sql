CREATE INDEX IF NOT EXISTS "userIdxOrders" ON "orders" USING btree ("userId");