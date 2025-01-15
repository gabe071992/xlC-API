import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").unique().notNull(),
  email: text("email").unique().notNull(),
  name: text("name"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  address: text("address").unique().notNull(),
  userId: text("user_id").notNull(),
  balance: text("balance").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stakes = pgTable("stakes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  poolId: integer("pool_id").notNull(),
  amount: text("amount").notNull(),
  rewards: text("rewards").default("0"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  unstakeDate: timestamp("unstake_date"),
});

export const stakingPools = pgTable("staking_pools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  apy: text("apy").notNull(),
  minStake: text("min_stake").notNull(),
  lockupPeriod: integer("lockup_period").notNull(),
  active: boolean("active").default(true),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertWalletSchema = createInsertSchema(wallets);
export const selectWalletSchema = createSelectSchema(wallets);
export const insertStakeSchema = createInsertSchema(stakes);
export const selectStakeSchema = createSelectSchema(stakes);
export const insertStakingPoolSchema = createInsertSchema(stakingPools);
export const selectStakingPoolSchema = createSelectSchema(stakingPools);
