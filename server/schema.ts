import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
  real,
  index,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const RoleEnum = pgEnum("roles", ["user", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  role: RoleEnum("roles").default("user"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const emailTokens = pgTable(
  "email_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({
      columns: [vt.id, vt.token],
    }),
  })
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({
      columns: [vt.id, vt.token],
    }),
  })
);

export const twoFactorTokens = pgTable(
  "two_factor_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({
      columns: [vt.id, vt.token],
    }),
  })
);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const productVariants = pgTable("productVariants", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updated: timestamp("updated").defaultNow(),
  productId: serial("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
});

export const variantImages = pgTable("variantImages", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  size: real("size").notNull(),
  name: text("name").notNull(),
  order: real("order").notNull(),
  variantId: serial("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});

export const variantTags = pgTable("variantTags", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantId: serial("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});

export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: "productVariants" }),
  reviews: many(reviews, { relationName: "reviewProduct" }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ many, one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
      relationName: "productVariants",
    }),
    variantImages: many(variantImages, { relationName: "variantImages" }),
    variantTags: many(variantTags, { relationName: "variantTags" }),
  })
);

export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantImages.variantId],
    references: [productVariants.id],
    relationName: "variantImages",
  }),
}));

export const variantTagsRelations = relations(variantTags, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantTags.variantId],
    references: [productVariants.id],
    relationName: "variantTags",
  }),
}));

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    rating: real("rating").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: serial("productId")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    comment: text("comment").notNull(),
    created: timestamp("created").defaultNow(),
  },
  (table) => {
    return {
      productIdx: index("productIdx").on(table.productId),
      userIdx: index("userIdx").on(table.userId),
    };
  }
);

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
    relationName: "reviewUser",
  }),
  products: one(products, {
    fields: [reviews.productId],
    references: [products.id],
    relationName: "reviewProduct",
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  reviews: many(reviews, { relationName: "reviewUser" }),
  orders: many(orders, { relationName: "orderUser" }),
}));

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    total: real("total").notNull(),
    status: text("status"),
    transactionId: text("transactionId").notNull(),
    created: timestamp("created").defaultNow(),
  },
  (table) => {
    return {
      userIdxOrders: index("userIdxOrders").on(table.userId),
      transactionIdx: index("transactionIdx").on(table.transactionId),
    };
  }
);

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
    relationName: "orderUser",
  }),
  orderProduct: many(orderProduct, { relationName: "orderProduct" }),
  shippingAddress: one(shippingAddresses, {
    fields: [orders.id],
    references: [shippingAddresses.orderId],
    relationName: "shippingAddressOrder",
  }),
}));

export const orderProduct = pgTable("orderProduct", {
  id: serial("id").primaryKey(),
  orderId: integer("orderId")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),
  productId: integer("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  productVariantId: integer("productVariantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
});

export const orderProductRelations = relations(orderProduct, ({ one }) => ({
  order: one(orders, {
    fields: [orderProduct.orderId],
    references: [orders.id],
    relationName: "orderProduct",
  }),
  product: one(products, {
    fields: [orderProduct.productId],
    references: [products.id],
    relationName: "products",
  }),
  variant: one(productVariants, {
    fields: [orderProduct.productVariantId],
    references: [productVariants.id],
    relationName: "productVariants",
  }),
}));

export const shippingAddresses = pgTable("shippingAddresses", {
  id: serial("id").primaryKey(),
  orderId: integer("orderId")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),
  name: text("name").notNull(),
  address1: text("address1").notNull(),
  address2: text("address2"),
  email: text("email"),
  phone: text("phone").notNull(),
  pincode: text("pincode").notNull(),
});

export const shippingAddressRelations = relations(
  shippingAddresses,
  ({ one }) => ({
    order: one(orders, {
      fields: [shippingAddresses.orderId],
      references: [orders.id],
      relationName: "shippingAddressOrder",
    }),
  })
);
