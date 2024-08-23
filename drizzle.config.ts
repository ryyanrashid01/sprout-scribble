import * as dotenv from 'dotenv';

dotenv.config({
    path: '.env.local',
})

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './server/schema.ts',
  out: './server/migrations',
  dialect: 'postgresql', 
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});