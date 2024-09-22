ALTER TABLE "two_factor_tokens" DROP CONSTRAINT "two_factor_tokens_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "two_factor_tokens" DROP COLUMN IF EXISTS "userId";