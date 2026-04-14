// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config = {
  nodeEnv: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
  port: process.env.PORT,
  saltRounds: process.env.SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    email_expires_in: process.env.EMAIL_EXPIRES_IN
  }
};

// src/app.ts
import express10 from "express";
import cors from "cors";

// src/modules/auth/auth.route.ts
import express from "express";

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model cart {\n  id        String   @id @default(cuid())\n  userEmail String\n  mealId    String\n  quantity  Int      @default(1)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user User @relation(fields: [userEmail], references: [email])\n  meal Meal @relation(fields: [mealId], references: [id])\n}\n\nmodel Category {\n  id        String         @id @default(uuid())\n  name      String\n  cuisineId String\n  cuisine   Cuisine        @relation(fields: [cuisineId], references: [id], onDelete: Cascade)\n  meals     Meal[]\n  image     String?\n  status    CategoryStatus @default(ACTIVE)\n  createdAt DateTime       @default(now())\n  updatedAt DateTime       @updatedAt\n\n  @@map("categories")\n}\n\nenum CategoryStatus {\n  ACTIVE\n  INACTIVE\n}\n\n// Order model - Main order info thakbe\nmodel Order {\n  id        String @id @default(uuid())\n  userEmail String\n  user      User   @relation(fields: [userEmail], references: [email])\n\n  // Items relation\n  items OrderItem[]\n\n  // Delivery Address relation\n  deliveryAddress DeliveryAddress?\n\n  // Pricing Details\n  subtotal    Float\n  deliveryFee Float @default(0)\n  total       Float\n\n  // Payment info\n  paymentMethod PaymentMethod @default(CASH_ON_DELIVERY)\n  paymentStatus PaymentStatus @default(PENDING)\n  orderStatus   OrderStatus   @default(PENDING)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\n// OrderItem model - Multiple items handle korar jonno\nmodel OrderItem {\n  id      String @id @default(uuid())\n  orderId String\n  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  mealId String\n  meal   Meal   @relation(fields: [mealId], references: [id])\n\n  quantity Int   @default(1)\n  // Order er somoy price koto chilo seta store kora bhalo (future-e price change holeo record thakbe)\n  price    Float\n\n  createdAt DateTime @default(now())\n}\n\n// DeliveryAddress model - Separated for cleaner data\nmodel DeliveryAddress {\n  id      String @id @default(uuid())\n  orderId String @unique // One-to-one with Order\n  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  fullName             String\n  phoneNumber          String\n  city                 String\n  area                 String\n  streetAddress        String\n  deliveryInstructions String?\n}\n\n// Enums for Type Safety\nenum PaymentMethod {\n  CASH_ON_DELIVERY\n  ONLINE_PAYMENT\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n}\n\nenum OrderStatus {\n  PENDING\n  CONFIRMED\n  PREPARING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel Cuisine {\n  id        String        @id @default(uuid())\n  name      String\n  image     String?\n  status    CuisineStatus @default(ACTIVE)\n  createdAt DateTime      @default(now())\n  updatedAt DateTime      @updatedAt\n\n  categories Category[]\n\n  @@map("cuisines")\n}\n\nenum CuisineStatus {\n  ACTIVE\n  INACTIVE\n}\n\nmodel Customer {\n  id           String         @id @default(uuid())\n  email        String         @unique\n  user         User           @relation(fields: [email], references: [email], onDelete: Cascade)\n  fullName     String\n  phone        String?\n  profileImage String?\n  address      String?\n  city         String?\n  state        String?\n  zipCode      String?\n  status       CustomerStatus @default(ACTIVE)\n  createdAt    DateTime       @default(now())\n  updatedAt    DateTime       @updatedAt\n\n  @@map("customers")\n}\n\nenum CustomerStatus {\n  ACTIVE\n  SUSPENDED\n}\n\nmodel Meal {\n  id                 String                 @id @default(uuid())\n  name               String\n  description        String\n  categoryId         String\n  category           Category               @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  price              Decimal                @db.Decimal(10, 2)\n  image              String?\n  images             String[]\n  availabilityStatus MealAvailabilityStatus @default(AVAILABLE)\n  preparationTime    Int?\n  servingSize        Int?\n  mealType           MealType\n  dietaryTag         DietaryTag\n  spiceLevel         SpiceLevel\n  ingredients        String[]\n  discount           Decimal?               @db.Decimal(10, 2)\n  stockQuantity      Int                    @default(0)\n  isPopular          Boolean                @default(false)\n  isFeatured         Boolean                @default(false)\n  videoUrl           String?\n  createdAt          DateTime               @default(now())\n  updatedAt          DateTime               @updatedAt\n  carts              cart[]\n  orderItems         OrderItem[]\n  providerEmail      String\n  provider           User                   @relation(fields: [providerEmail], references: [email])\n\n  @@index([categoryId])\n  @@map("meals")\n}\n\nenum MealAvailabilityStatus {\n  AVAILABLE\n  UNAVAILABLE\n}\n\nenum MealType {\n  BREAKFAST\n  LUNCH\n  DINNER\n}\n\nenum DietaryTag {\n  VEG\n  NON_VEG\n  VEGAN\n}\n\nenum SpiceLevel {\n  MILD\n  MEDIUM\n  HOT\n  EXTRA_HOT\n}\n\nmodel User {\n  id        String     @id @default(uuid())\n  email     String     @unique\n  password  String\n  role      Role       @default(CUSTOMER)\n  status    UserStatus @default(ACTIVE)\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n\n  customer Customer?\n  carts    cart[]\n  meals    Meal[]\n  orders   Order[]\n\n  @@map("users")\n}\n\nenum Role {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  SUSPENDED\n  PENDING\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userEmail","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserTocart"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealTocart"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"cuisineId","kind":"scalar","type":"String"},{"name":"cuisine","kind":"object","type":"Cuisine","relationName":"CategoryToCuisine"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"},{"name":"image","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"CategoryStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"categories"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userEmail","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"deliveryAddress","kind":"object","type":"DeliveryAddress","relationName":"DeliveryAddressToOrder"},{"name":"subtotal","kind":"scalar","type":"Float"},{"name":"deliveryFee","kind":"scalar","type":"Float"},{"name":"total","kind":"scalar","type":"Float"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"orderStatus","kind":"enum","type":"OrderStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"DeliveryAddress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"DeliveryAddressToOrder"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"area","kind":"scalar","type":"String"},{"name":"streetAddress","kind":"scalar","type":"String"},{"name":"deliveryInstructions","kind":"scalar","type":"String"}],"dbName":null},"Cuisine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"CuisineStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"categories","kind":"object","type":"Category","relationName":"CategoryToCuisine"}],"dbName":"cuisines"},"Customer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CustomerToUser"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"profileImage","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"state","kind":"scalar","type":"String"},{"name":"zipCode","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"CustomerStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"customers"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"image","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"availabilityStatus","kind":"enum","type":"MealAvailabilityStatus"},{"name":"preparationTime","kind":"scalar","type":"Int"},{"name":"servingSize","kind":"scalar","type":"Int"},{"name":"mealType","kind":"enum","type":"MealType"},{"name":"dietaryTag","kind":"enum","type":"DietaryTag"},{"name":"spiceLevel","kind":"enum","type":"SpiceLevel"},{"name":"ingredients","kind":"scalar","type":"String"},{"name":"discount","kind":"scalar","type":"Decimal"},{"name":"stockQuantity","kind":"scalar","type":"Int"},{"name":"isPopular","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"carts","kind":"object","type":"cart","relationName":"MealTocart"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"providerEmail","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"User","relationName":"MealToUser"}],"dbName":"meals"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"Customer","relationName":"CustomerToUser"},{"name":"carts","kind":"object","type":"cart","relationName":"UserTocart"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"}],"dbName":"users"}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","user","customer","orderBy","cursor","carts","categories","_count","cuisine","meals","category","items","order","deliveryAddress","meal","orderItems","provider","orders","cart.findUnique","cart.findUniqueOrThrow","cart.findFirst","cart.findFirstOrThrow","cart.findMany","data","cart.createOne","cart.createMany","cart.createManyAndReturn","cart.updateOne","cart.updateMany","cart.updateManyAndReturn","create","update","cart.upsertOne","cart.deleteOne","cart.deleteMany","having","_avg","_sum","_min","_max","cart.groupBy","cart.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","DeliveryAddress.findUnique","DeliveryAddress.findUniqueOrThrow","DeliveryAddress.findFirst","DeliveryAddress.findFirstOrThrow","DeliveryAddress.findMany","DeliveryAddress.createOne","DeliveryAddress.createMany","DeliveryAddress.createManyAndReturn","DeliveryAddress.updateOne","DeliveryAddress.updateMany","DeliveryAddress.updateManyAndReturn","DeliveryAddress.upsertOne","DeliveryAddress.deleteOne","DeliveryAddress.deleteMany","DeliveryAddress.groupBy","DeliveryAddress.aggregate","Cuisine.findUnique","Cuisine.findUniqueOrThrow","Cuisine.findFirst","Cuisine.findFirstOrThrow","Cuisine.findMany","Cuisine.createOne","Cuisine.createMany","Cuisine.createManyAndReturn","Cuisine.updateOne","Cuisine.updateMany","Cuisine.updateManyAndReturn","Cuisine.upsertOne","Cuisine.deleteOne","Cuisine.deleteMany","Cuisine.groupBy","Cuisine.aggregate","Customer.findUnique","Customer.findUniqueOrThrow","Customer.findFirst","Customer.findFirstOrThrow","Customer.findMany","Customer.createOne","Customer.createMany","Customer.createManyAndReturn","Customer.updateOne","Customer.updateMany","Customer.updateManyAndReturn","Customer.upsertOne","Customer.deleteOne","Customer.deleteMany","Customer.groupBy","Customer.aggregate","Meal.findUnique","Meal.findUniqueOrThrow","Meal.findFirst","Meal.findFirstOrThrow","Meal.findMany","Meal.createOne","Meal.createMany","Meal.createManyAndReturn","Meal.updateOne","Meal.updateMany","Meal.updateManyAndReturn","Meal.upsertOne","Meal.deleteOne","Meal.deleteMany","Meal.groupBy","Meal.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","email","password","Role","role","UserStatus","status","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","name","description","categoryId","price","image","images","MealAvailabilityStatus","availabilityStatus","preparationTime","servingSize","MealType","mealType","DietaryTag","dietaryTag","SpiceLevel","spiceLevel","ingredients","discount","stockQuantity","isPopular","isFeatured","videoUrl","providerEmail","has","hasEvery","hasSome","fullName","phone","profileImage","address","city","state","zipCode","CustomerStatus","CuisineStatus","orderId","phoneNumber","area","streetAddress","deliveryInstructions","mealId","quantity","userEmail","subtotal","deliveryFee","total","PaymentMethod","paymentMethod","PaymentStatus","paymentStatus","OrderStatus","orderStatus","cuisineId","CategoryStatus","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "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_QIAIfABCAD9AgAh8QEIAP0CACHzAQAA_gLzASL1AQAA_wL1ASL3AQAAgAP3ASICAAAAIAAgFwAAWgAgCq0BAQDrAgAhtAFAAO4CACG1AUAA7gIAIe4BAQDrAgAh7wEIAP0CACHwAQgA_QIAIfEBCAD9AgAh8wEAAP4C8wEi9QEAAP8C9QEi9wEAAIAD9wEiAgAAAB4AIBcAAFwAIAIAAAAeACAXAABcACADAAAAIAAgHgAAVQAgHwAAWgAgAQAAACAAIAEAAAAeACAFBwAApAQAICQAAKUEACAlAACoBAAgJgAApwQAICcAAKYEACANqgEAAMECADCrAQAAYwAQrAEAAMECADCtAQEA9QEAIbQBQAD4AQAhtQFAAPgBACHuAQEA9QEAIe8BCAC_AgAh8AEIAL8CACHxAQgAvwIAIfMBAADCAvMBIvUBAADDAvUBIvcBAADEAvcBIgMAAAAeACADAABiADAjAABjACADAAAAHgAgAwAAHwAwBAAAIAAgAQAAABYAIAEAAAAWACADAAAAFAAgAwAAFQAwBAAAFgAgAwAAABQAIAMAABUAMAQAABYAIAMAAAAUACADAAAVADAEAAAWACAIDAAAvgMAIA4AAJgDACCtAQEAAAABtAFAAAAAAccBCAAAAAHnAQEAAAAB7AEBAAAAAe0BAgAAAAEBFwAAawAgBq0BAQAAAAG0AUAAAAABxwEIAAAAAecBAQAAAAHsAQEAAAAB7QECAAAAAQEXAABtADABFwAAbQAwCAwAALwDACAOAACWAwAgrQEBAOsCACG0AUAA7gIAIccBCAD9AgAh5wEBAOsCACHsAQEA6wIAIe0BAgCUAwAhAgAAABYAIBcAAHAAIAatAQEA6wIAIbQBQADuAgAhxwEIAP0CACHnAQEA6wIAIewBAQDrAgAh7QECAJQDACECAAAAFAAgFwAAcgAgAgAAABQAIBcAAHIAIAMAAAAWACAeAABrACAfAABwACABAAAAFgAgAQAAABQAIAUHAACfBAAgJAAAoAQAICUAAKMEACAmAACiBAAgJwAAoQQAIAmqAQAAvgIAMKsBAAB5ABCsAQAAvgIAMK0BAQD1AQAhtAFAAPgBACHHAQgAvwIAIecBAQD1AQAh7AEBAPUBACHtAQIAlQIAIQMAAAAUACADAAB4ADAjAAB5ACADAAAAFAAgAwAAFQAwBAAAFgAgDAwAAL0CACCqAQAAvAIAMKsBAAAZABCsAQAAvAIAMK0BAQAAAAHeAQEAgwIAIeIBAQCDAgAh5wEBAAAAAegBAQCDAgAh6QEBAIMCACHqAQEAgwIAIesBAQCxAgAhAQAAAHwAIAEAAAB8ACACDAAAngQAIOsBAADsAwAgAwAAABkAIAMAAH8AMAQAAHwAIAMAAAAZACADAAB_ADAEAAB8ACADAAAAGQAgAwAAfwAwBAAAfAAgCQwAAJ0EACCtAQEAAAAB3gEBAAAAAeIBAQAAAAHnAQEAAAAB6AEBAAAAAekBAQAAAAHqAQEAAAAB6wEBAAAAAQEXAACDAQAgCK0BAQAAAAHeAQEAAAAB4gEBAAAAAecBAQAAAAHoAQEAAAAB6QEBAAAAAeoBAQAAAAHrAQEAAAABARcAAIUBADABFwAAhQEAMAkMAACcBAAgrQEBAOsCACHeAQEA6wIAIeIBAQDrAgAh5wEBAOsCACHoAQEA6wIAIekBAQDrAgAh6gEBAOsCACHrAQEAiQMAIQIAAAB8ACAXAACIAQAgCK0BAQDrAgAh3gEBAOsCACHiAQEA6wIAIecBAQDrAgAh6AEBAOsCACHpAQEA6wIAIeoBAQDrAgAh6wEBAIkDACECAAAAGQAgFwAAigEAIAIAAAAZACAXAACKAQAgAwAAAHwAIB4AAIMBACAfAACIAQAgAQAAAHwAIAEAAAAZACAEBwAAmQQAICYAAJsEACAnAACaBAAg6wEAAOwDACALqgEAALsCADCrAQAAkQEAEKwBAAC7AgAwrQEBAPUBACHeAQEA9QEAIeIBAQD1AQAh5wEBAPUBACHoAQEA9QEAIekBAQD1AQAh6gEBAPUBACHrAQEAjQIAIQMAAAAZACADAACQAQAwIwAAkQEAIAMAAAAZACADAAB_ADAEAAB8ACAKBgAAugIAIKoBAAC4AgAwqwEAAJcBABCsAQAAuAIAMK0BAQAAAAGzAQAAuQLnASK0AUAAhgIAIbUBQACGAgAhxAEBAIMCACHIAQEAsQIAIQEAAACUAQAgAQAAAJQBACAKBgAAugIAIKoBAAC4AgAwqwEAAJcBABCsAQAAuAIAMK0BAQCDAgAhswEAALkC5wEitAFAAIYCACG1AUAAhgIAIcQBAQCDAgAhyAEBALECACECBgAAmAQAIMgBAADsAwAgAwAAAJcBACADAACYAQAwBAAAlAEAIAMAAACXAQAgAwAAmAEAMAQAAJQBACADAAAAlwEAIAMAAJgBADAEAACUAQAgBwYAAJcEACCtAQEAAAABswEAAADnAQK0AUAAAAABtQFAAAAAAcQBAQAAAAHIAQEAAAABARcAAJwBACAGrQEBAAAAAbMBAAAA5wECtAFAAAAAAbUBQAAAAAHEAQEAAAAByAEBAAAAAQEXAACeAQAwARcAAJ4BADAHBgAA_gMAIK0BAQDrAgAhswEAAP0D5wEitAFAAO4CACG1AUAA7gIAIcQBAQDrAgAhyAEBAIkDACECAAAAlAEAIBcAAKEBACAGrQEBAOsCACGzAQAA_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-AQEAAAABvwEBAAAAAcABAQAAAAEHBwAA-gEAICYAAP8BACAnAAD_AQAgtgEAAACxAQK3AQAAALEBCLgBAAAAsQEIvQEAAP4BsQEiBwcAAPoBACAmAAD9AQAgJwAA_QEAILYBAAAAswECtwEAAACzAQi4AQAAALMBCL0BAAD8AbMBIgsHAAD6AQAgJgAA-wEAICcAAPsBACC2AUAAAAABtwFAAAAABLgBQAAAAAS5AUAAAAABugFAAAAAAbsBQAAAAAG8AUAAAAABvQFAAPkBACELBwAA-gEAICYAAPsBACAnAAD7AQAgtgFAAAAAAbcBQAAAAAS4AUAAAAAEuQFAAAAAAboBQAAAAAG7AUAAAAABvAFAAAAAAb0BQAD5AQAhCLYBAgAAAAG3AQIAAAAEuAECAAAABLkBAgAAAAG6AQIAAAABuwECAAAAAbwBAgAAAAG9AQIA-gEAIQi2AUAAAAABtwFAAAAABLgBQAAAAAS5AUAAAAABugFAAAAAAbsBQAAAAAG8AUAAAAABvQFAAPsBACEHBwAA-gEAICYAAP0BACAnAAD9AQAgtgEAAACzAQK3AQAAALMBCLgBAAAAswEIvQEAAPwBswEiBLYBAAAAswECtwEAAACzAQi4AQAAALMBCL0BAAD9AbMBIgcHAAD6AQAgJgAA_wEAICcAAP8BACC2AQAAALEBArcBAAAAsQEIuAEAAACxAQi9AQAA_gGxASIEtgEAAACxAQK3AQAAALEBCLgBAAAAsQEIvQEAAP8BsQEiDgcAAPoBACAmAACBAgAgJwAAgQIAILYBAQAAAAG3AQEAAAAEuAEBAAAABLkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQAAAAG9AQEAgAIAIb4BAQAAAAG_AQEAAAABwAEBAAAAAQu2AQEAAAABtwEBAAAABLgBAQAAAAS5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvQEBAIECACG-AQEAAAABvwEBAAAAAcABAQAAAAEOAgAAhwIAIAUAAIgCACAJAACJAgAgEQAAigIAIKoBAACCAgAwqwEAAN4BABCsAQAAggIAMK0BAQCDAgAhrgEBAIMCACGvAQEAgwIAIbEBAACEArEBIrMBAACFArMBIrQBQACGAgAhtQFAAIYCACELtgEBAAAAAbcBAQAAAAS4AQEAAAAEuQEBAAAAAboBAQAAAAG7AQEAAAABvAEBAAAAAb0BAQCBAgAhvgEBAAAAAb8BAQAAAAHAAQEAAAABBLYBAAAAsQECtwEAAACxAQi4AQAAALEBCL0BAAD_AbEBIgS2AQAAALMBArcBAAAAswEIuAEAAACzAQi9AQAA_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_AQEAAAABwAEBAAAAAQu2AQEAAAABtwEBAAAABbgBAQAAAAW5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvQEBAKkCACG-AQEAAAABvwEBAAAAAcABAQAAAAENBwAA-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_AgAh8wEAAMIC8wEi9QEAAMMC9QEi9wEAAMQC9wEiBwcAAPoBACAmAADKAgAgJwAAygIAILYBAAAA8wECtwEAAADzAQi4AQAAAPMBCL0BAADJAvMBIgcHAAD6AQAgJgAAyAIAICcAAMgCACC2AQAAAPUBArcBAAAA9QEIuAEAAAD1AQi9AQAAxwL1ASIHBwAA-gEAICYAAMYCACAnAADGAgAgtgEAAAD3AQK3AQAAAPcBCLgBAAAA9wEIvQEAAMUC9wEiBwcAAPoBACAmAADGAgAgJwAAxgIAILYBAAAA9wECtwEAAAD3AQi4AQAAAPcBCL0BAADFAvcBIgS2AQAAAPcBArcBAAAA9wEIuAEAAAD3AQi9AQAAxgL3ASIHBwAA-gEAICYAAMgCACAnAADIAgAgtgEAAAD1AQK3AQAAAPUBCLgBAAAA9QEIvQEAAMcC9QEiBLYBAAAA9QECtwEAAAD1AQi4AQAAAPUBCL0BAADIAvUBIgcHAAD6AQAgJgAAygIAICcAAMoCACC2AQAAAPMBArcBAAAA8wEIuAEAAADzAQi9AQAAyQLzASIEtgEAAADzAQK3AQAAAPMBCLgBAAAA8wEIvQEAAMoC8wEiCqoBAADLAgAwqwEAAE0AEKwBAADLAgAwrQEBAPUBACGzAQAAzAL6ASK0AUAA-AEAIbUBQAD4AQAhxAEBAPUBACHIAQEAjQIAIfgBAQD1AQAhBwcAAPoBACAmAADOAgAgJwAAzgIAILYBAAAA-gECtwEAAAD6AQi4AQAAAPoBCL0BAADNAvoBIgcHAAD6AQAgJgAAzgIAICcAAM4CACC2AQAAAPoBArcBAAAA-gEIuAEAAAD6AQi9AQAAzQL6ASIEtgEAAAD6AQK3AQAAAPoBCLgBAAAA-gEIvQEAAM4C-gEiCaoBAADPAgAwqwEAADcAEKwBAADPAgAwrQEBAPUBACG0AUAA-AEAIbUBQAD4AQAh7AEBAPUBACHtAQIAlQIAIe4BAQD1AQAhEAEAALMCACALAADVAgAgDQAA1gIAIKoBAADQAgAwqwEAAB4AEKwBAADQAgAwrQEBAIMCACG0AUAAhgIAIbUBQACGAgAh7gEBAIMCACHvAQgA0QIAIfABCADRAgAh8QEIANECACHzAQAA0gLzASL1AQAA0wL1ASL3AQAA1AL3ASIItgEIAAAAAbcBCAAAAAS4AQgAAAAEuQEIAAAAAboBCAAAAAG7AQgAAAABvAEIAAAAAb0BCACaAgAhBLYBAAAA8wECtwEAAADzAQi4AQAAAPMBCL0BAADKAvMBIgS2AQAAAPUBArcBAAAA9QEIuAEAAAD1AQi9AQAAyAL1ASIEtgEAAAD3AQK3AQAAAPcBCLgBAAAA9wEIvQEAAMYC9wEiA8EBAAAUACDCAQAAFAAgwwEAABQAIA4MAAC9AgAgqgEAALwCADCrAQAAGQAQrAEAALwCADCtAQEAgwIAId4BAQCDAgAh4gEBAIMCACHnAQEAgwIAIegBAQCDAgAh6QEBAIMCACHqAQEAgwIAIesBAQCxAgAh-gEAABkAIPsBAAAZACALDAAAvQIAIA4AANkCACCqAQAA1wIAMKsBAAAUABCsAQAA1wIAMK0BAQCDAgAhtAFAAIYCACHHAQgA0QIAIecBAQCDAgAh7AEBAIMCACHtAQIA2AIAIQi2AQIAAAABtwECAAAABLgBAgAAAAS5AQIAAAABugECAAAAAbsBAgAAAAG8AQIAAAABvQECAPoBACEfBQAAiAIAIAoAAOYCACAPAADVAgAgEAAAswIAIKoBAADdAgAwqwEAAAgAEKwBAADdAgAwrQEBAIMCACG0AUAAhgIAIbUBQACGAgAhxAEBAIMCACHFAQEAgwIAIcYBAQCDAgAhxwEQAN4CACHIAQEAsQIAIckBAACOAgAgywEAAN8CywEizAECAOACACHNAQIA4AIAIc8BAADhAs8BItEBAADiAtEBItMBAADjAtMBItQBAACOAgAg1QEQAOQCACHWAQIA2AIAIdcBIADlAgAh2AEgAOUCACHZAQEAsQIAIdoBAQCDAgAh-gEAAAgAIPsBAAAIACAMCAAA3AIAIAkAAIkCACCqAQAA2gIAMKsBAAAMABCsAQAA2gIAMK0BAQCDAgAhswEAANsC-gEitAFAAIYCACG1AUAAhgIAIcQBAQCDAgAhyAEBALECACH4AQEAgwIAIQS2AQAAAPoBArcBAAAA-gEIuAEAAAD6AQi9AQAAzgL6ASIMBgAAugIAIKoBAAC4AgAwqwEAAJcBABCsAQAAuAIAMK0BAQCDAgAhswEAALkC5wEitAFAAIYCACG1AUAAhgIAIcQBAQCDAgAhyAEBALECACH6AQAAlwEAIPsBAACXAQAgHQUAAIgCACAKAADmAgAgDwAA1QIAIBAAALMCACCqAQAA3QIAMKsBAAAIABCsAQAA3QIAMK0BAQCDAgAhtAFAAIYCACG1AUAAhgIAIcQBAQCDAgAhxQEBAIMCACHGAQEAgwIAIccBEADeAgAhyAEBALECACHJAQAAjgIAIMsBAADfAssBIswBAgDgAgAhzQECAOACACHPAQAA4QLPASLRAQAA4gLRASLTAQAA4wLTASLUAQAAjgIAINUBEADkAgAh1gECANgCACHXASAA5QIAIdgBIADlAgAh2QEBALECACHaAQEAgwIAIQi2ARAAAAABtwEQAAAABLgBEAAAAAS5ARAAAAABugEQAAAAAbsBEAAAAAG8ARAAAAABvQEQAKsCACEEtgEAAADLAQK3AQAAAMsBCLgBAAAAywEIvQEAAKcCywEiCLYBAgAAAAG3AQIAAAAFuAECAAAABbkBAgAAAAG6AQIAAAABuwECAAAAAbwBAgAAAAG9AQIAnAIAIQS2AQAAAM8BArcBAAAAzwEIuAEAAADPAQi9AQAAowLPASIEtgEAAADRAQK3AQAAANEBCLgBAAAA0QEIvQEAAKEC0QEiBLYBAAAA0wECtwEAAADTAQi4AQAAANMBCL0BAACfAtMBIgi2ARAAAAABtwEQAAAABbgBEAAAAAW5ARAAAAABugEQAAAAAbsBEAAAAAG8ARAAAAABvQEQAJ0CACECtgEgAAAAAb0BIACYAgAhDggAANwCACAJAACJAgAgqgEAANoCADCrAQAADAAQrAEAANoCADCtAQEAgwIAIbMBAADbAvoBIrQBQACGAgAhtQFAAIYCACHEAQEAgwIAIcgBAQCxAgAh-AEBAIMCACH6AQAADAAg-wEAAAwAIAsBAACzAgAgDgAA2QIAIKoBAADnAgAwqwEAAAUAEKwBAADnAgAwrQEBAIMCACG0AUAAhgIAIbUBQACGAgAh7AEBAIMCACHtAQIA2AIAIe4BAQCDAgAhAAAAAf8BAQAAAAEB_wEAAACxAQIB_wEAAACzAQIB_wFAAAAAAQceAADeAwAgHwAA4QMAIPwBAADfAwAg_QEAAOADACCAAgAAAwAggQIAAAMAIIICAACtAQAgCx4AANMDADAfAADXAwAw_AEAANQDADD9AQAA1QMAMP4BAADWAwAg_wEAAMMDADCAAgAAwwMAMIECAADDAwAwggIAAMMDADCDAgAA2AMAMIQCAADGAwAwCx4AAJwDADAfAAChAwAw_AEAAJ0DADD9AQAAngMAMP4BAACfAwAg_wEAAKADADCAAgAAoAMAMIECAACgAwAwggIAAKADADCDAgAAogMAMIQCAACjAwAwCx4AAPMCADAfAAD4AgAw_AEAAPQCADD9AQAA9QIAMP4BAAD2AgAg_wEAAPcCADCAAgAA9wIAMIECAAD3AgAwggIAAPcCADCDAgAA-QIAMIQCAAD6AgAwCwsAAJoDACANAACbAwAgrQEBAAAAAbQBQAAAAAG1AUAAAAAB7wEIAAAAAfABCAAAAAHxAQgAAAAB8wEAAADzAQL1AQAAAPUBAvcBAAAA9wECAgAAACAAIB4AAJkDACADAAAAIAAgHgAAmQMAIB8AAIEDACABFwAA8wQAMBABAACzAgAgCwAA1QIAIA0AANYCACCqAQAA0AIAMKsBAAAeABCsAQAA0AIAMK0BAQAAAAG0AUAAhgIAIbUBQACGAgAh7gEBAIMCACHvAQgA0QIAIfABCADRAgAh8QEIANECACHzAQAA0gLzASL1AQAA0wL1ASL3AQAA1AL3ASICAAAAIAAgFwAAgQMAIAIAAAD7AgAgFwAA_AIAIA2qAQAA-gIAMKsBAAD7AgAQrAEAAPoCADCtAQEAgwIAIbQBQACGAgAhtQFAAIYCACHuAQEAgwIAIe8BCADRAgAh8AEIANECACHxAQgA0QIAIfMBAADSAvMBIvUBAADTAvUBIvcBAADUAvcBIg2qAQAA-gIAMKsBAAD7AgAQrAEAAPoCADCtAQEAgwIAIbQBQACGAgAhtQFAAIYCACHuAQEAgwIAIe8BCADRAgAh8AEIANECACHxAQgA0QIAIfMBAADSAvMBIvUBAADTAvUBIvcBAADUAvcBIgmtAQEA6wIAIbQBQADuAgAhtQFAAO4CACHvAQgA_QIAIfABCAD9AgAh8QEIAP0CACHzAQAA_gLzASL1AQAA_wL1ASL3AQAAgAP3ASIF_wEIAAAAAYUCCAAAAAGGAggAAAABhwIIAAAAAYgCCAAAAAEB_wEAAADzAQIB_wEAAAD1AQIB_wEAAAD3AQILCwAAggMAIA0AAIMDACCtAQEA6wIAIbQBQADuAgAhtQFAAO4CACHvAQgA_QIAIfABCAD9AgAh8QEIAP0CACHzAQAA_gLzASL1AQAA_wL1ASL3AQAAgAP3ASILHgAAigMAMB8AAI8DADD8AQAAiwMAMP0BAACMAwAw_gEAAI0DACD_AQAAjgMAMIACAACOAwAwgQIAAI4DADCCAgAAjgMAMIMCAACQAwAwhAIAAJEDADAHHgAAhAMAIB8AAIcDACD8AQAAhQMAIP0BAACGAwAggAIAABkAIIECAAAZACCCAgAAfAAgB60BAQAAAAHeAQEAAAAB4gEBAAAAAegBAQAAAAHpAQEAAAAB6gEBAAAAAesBAQAAAAECAAAAfAAgHgAAhAMAIAMAAAAZACAeAACEAwAgHwAAiAMAIAkAAAAZACAXAACIAwAgrQEBAOsCACHeAQEA6wIAIeIBAQDrAgAh6AEBAOsCACHpAQEA6wIAIeoBAQDrAgAh6wEBAIkDACEHrQEBAOsCACHeAQEA6wIAIeIBAQDrAgAh6AEBAOsCACHpAQEA6wIAIeoBAQDrAgAh6wEBAIkDACEB_wEBAAAAAQYOAACYAwAgrQEBAAAAAbQBQAAAAAHHAQgAAAAB7AEBAAAAAe0BAgAAAAECAAAAFgAgHgAAlwMAIAMAAAAWACAeAACXAwAgHwAAlQMAIAEXAADyBAAwCwwAAL0CACAOAADZAgAgqgEAANcCADCrAQAAFAAQrAEAANcCADCtAQEAAAABtAFAAIYCACHHAQgA0QIAIecBAQCDAgAh7AEBAIMCACHtAQIA2AIAIQIAAAAWACAXAACVAwAgAgAAAJIDACAXAACTAwAgCaoBAACRAwAwqwEAAJIDABCsAQAAkQMAMK0BAQCDAgAhtAFAAIYCACHHAQgA0QIAIecBAQCDAgAh7AEBAIMCACHtAQIA2AIAIQmqAQAAkQMAMKsBAACSAwAQrAEAAJEDADCtAQEAgwIAIbQBQACGAgAhxwEIANECACHnAQEAgwIAIewBAQCDAgAh7QECANgCACEFrQEBAOsCACG0AUAA7gIAIccBCAD9AgAh7AEBAOsCACHtAQIAlAMAIQX_AQIAAAABhQICAAAAAYYCAgAAAAGHAgIAAAABiAICAAAAAQYOAACWAwAgrQEBAOsCACG0AUAA7gIAIccBCAD9AgAh7AEBAOsCACHtAQIAlAMAIQUeAADtBAAgHwAA8AQAIPwBAADuBAAg_QEAAO8EACCCAgAACgAgBg4AAJgDACCtAQEAAAABtAFAAAAAAccBCAAAAAHsAQEAAAAB7QECAAAAAQMeAADtBAAg_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_QEAAOkEACCCAgAADgAgCx4AAL8DADAfAADEAwAw_AEAAMADADD9AQAAwQMAMP4BAADCAwAg_wEAAMMDADCAAgAAwwMAMIECAADDAwAwggIAAMMDADCDAgAAxQMAMIQCAADGAwAwCx4AALQDADAfAAC4AwAw_AEAALUDADD9AQAAtgMAMP4BAAC3AwAg_wEAAI4DADCAAgAAjgMAMIECAACOAwAwggIAAI4DADCDAgAAuQMAMIQCAACRAwAwBgwAAL4DACCtAQEAAAABtAFAAAAAAccBCAAAAAHnAQEAAAAB7QECAAAAAQIAAAAWACAeAAC9AwAgAwAAABYAIB4AAL0DACAfAAC7AwAgARcAAOgEADACAAAAFgAgFwAAuwMAIAIAAACSAwAgFwAAugMAIAWtAQEA6wIAIbQBQADuAgAhxwEIAP0CACHnAQEA6wIAIe0BAgCUAwAhBgwAALwDACCtAQEA6wIAIbQBQADuAgAhxwEIAP0CACHnAQEA6wIAIe0BAgCUAwAhBR4AAOMEACAfAADmBAAg_AEAAOQEACD9AQAA5QQAIIICAAAgACAGDAAAvgMAIK0BAQAAAAG0AUAAAAABxwEIAAAAAecBAQAAAAHtAQIAAAABAx4AAOMEACD8AQAA5AQAIIICAAAgACAGAQAAzAMAIK0BAQAAAAG0AUAAAAABtQFAAAAAAe0BAgAAAAHuAQEAAAABAgAAAAEAIB4AAMsDACADAAAAAQAgHgAAywMAIB8AAMkDACABFwAA4gQAMAsBAACzAgAgDgAA2QIAIKoBAADnAgAwqwEAAAUAEKwBAADnAgAwrQEBAAAAAbQBQACGAgAhtQFAAIYCACHsAQEAgwIAIe0BAgDYAgAh7gEBAIMCACECAAAAAQAgFwAAyQMAIAIAAADHAwAgFwAAyAMAIAmqAQAAxgMAMKsBAADHAwAQrAEAAMYDADCtAQEAgwIAIbQBQACGAgAhtQFAAIYCACHsAQEAgwIAIe0BAgDYAgAh7gEBAIMCACEJqgEAAMYDADCrAQAAxwMAEKwBAADGAwAwrQEBAIMCACG0AUAAhgIAIbUBQACGAgAh7AEBAIMCACHtAQIA2AIAIe4BAQCDAgAhBa0BAQDrAgAhtAFAAO4CACG1AUAA7gIAIe0BAgCUAwAh7gEBAOsCACEGAQAAygMAIK0BAQDrAgAhtAFAAO4CACG1AUAA7gIAIe0BAgCUAwAh7gEBAOsCACEFHgAA3QQAIB8AAOAEACD8AQAA3gQAIP0BAADfBAAgggIAANsBACAGAQAAzAMAIK0BAQAAAAG0AUAAAAABtQFAAAAAAe0BAgAAAAHuAQEAAAABAx4AAN0EACD8AQAA3gQAIIICAADbAQAgGAUAANEDACAKAADQAwAgDwAA0gMAIK0BAQAAAAG0AUAAAAABtQFAAAAAAcQBAQAAAAHFAQEAAAABxgEBAAAAAccBEAAAAAHIAQEAAAAByQEAAM4DACDLAQAAAMsBAswBAgAAAAHNAQIAAAABzwEAAADPAQLRAQAAANEBAtMBAAAA0wEC1AEAAM8DACDVARAAAAAB1gECAAAAAdcBIAAAAAHYASAAAAAB2QEBAAAAAQH_AQEAAAAEAf8BAQAAAAQDHgAA2wQAIPwBAADcBAAgggIAAA4AIAQeAAC_AwAw_AEAAMADADD-AQAAwgMAIIICAADDAwAwBB4AALQDADD8AQAAtQMAMP4BAAC3AwAgggIAAI4DADAGDgAA3QMAIK0BAQAAAAG0AUAAAAABtQFAAAAAAewBAQAAAAHtAQIAAAABAgAAAAEAIB4AANwDACADAAAAAQAgHgAA3AMAIB8AANoDACABFwAA2gQAMAIAAAABACAXAADaAwAgAgAAAMcDACAXAADZAwAgBa0BAQDrAgAhtAFAAO4CACG1AUAA7gIAIewBAQDrAgAh7QECAJQDACEGDgAA2wMAIK0BAQDrAgAhtAFAAO4CACG1AUAA7gIAIewBAQDrAgAh7QECAJQDACEFHgAA1QQAIB8AANgEACD8AQAA1gQAIP0BAADXBAAgggIAAAoAIAYOAADdAwAgrQEBAAAAAbQBQAAAAAG1AUAAAAAB7AEBAAAAAe0BAgAAAAEDHgAA1QQAIPwBAADWBAAgggIAAAoAIAutAQEAAAABswEAAADmAQK0AUAAAAABtQFAAAAAAd4BAQAAAAHfAQEAAAAB4AEBAAAAAeEBAQAAAAHiAQEAAAAB4wEBAAAAAeQBAQAAAAECAAAArQEAIB4AAN4DACADAAAAAwAgHgAA3gMAIB8AAOIDACANAAAAAwAgFwAA4gMAIK0BAQDrAgAhswEAAOMD5gEitAFAAO4CACG1AUAA7gIAId4BAQDrAgAh3wEBAIkDACHgAQEAiQMAIeEBAQCJAwAh4gEBAIkDACHjAQEAiQMAIeQBAQCJAwAhC60BAQDrAgAhswEAAOMD5gEitAFAAO4CACG1AUAA7gIAId4BAQDrAgAh3wEBAIkDACHgAQEAiQMAIeEBAQCJAwAh4gEBAIkDACHjAQEAiQMAIeQBAQCJAwAhAf8BAAAA5gECAx4AAN4DACD8AQAA3wMAIIICAACtAQAgBB4AANMDADD8AQAA1AMAMP4BAADWAwAgggIAAMMDADAEHgAAnAMAMPwBAACdAwAw_gEAAJ8DACCCAgAAoAMAMAQeAADzAgAw_AEAAPQCADD-AQAA9gIAIIICAAD3AgAwBwEAAPkDACDfAQAA7AMAIOABAADsAwAg4QEAAOwDACDiAQAA7AMAIOMBAADsAwAg5AEAAOwDACAAAAAAAAAAAAAFHgAA0AQAIB8AANMEACD8AQAA0QQAIP0BAADSBAAgggIAANsBACADHgAA0AQAIPwBAADRBAAgggIAANsBACAAAAAFHgAAywQAIB8AAM4EACD8AQAAzAQAIP0BAADNBAAgggIAANsBACADHgAAywQAIPwBAADMBAAgggIAANsBACAEAgAA6AMAIAUAAOkDACAJAADqAwAgEQAA6wMAIAAAAAH_AQAAAOcBAgseAAD_AwAwHwAAhAQAMPwBAACABAAw_QEAAIEEADD-AQAAggQAIP8BAACDBAAwgAIAAIMEADCBAgAAgwQAMIICAACDBAAwgwIAAIUEADCEAgAAhgQAMAcJAACWBAAgrQEBAAAAAbMBAAAA-gECtAFAAAAAAbUBQAAAAAHEAQEAAAAByAEBAAAAAQIAAAAOACAeAACVBAAgAwAAAA4AIB4AAJUEACAfAACKBAAgARcAAMoEADAMCAAA3AIAIAkAAIkCACCqAQAA2gIAMKsBAAAMABCsAQAA2gIAMK0BAQAAAAGzAQAA2wL6ASK0AUAAhgIAIbUBQACGAgAhxAEBAIMCACHIAQEAsQIAIfgBAQCDAgAhAgAAAA4AIBcAAIoEACACAAAAhwQAIBcAAIgEACAKqgEAAIYEADCrAQAAhwQAEKwBAACGBAAwrQEBAIMCACGzAQAA2wL6ASK0AUAAhgIAIbUBQACGAgAhxAEBAIMCACHIAQEAsQIAIfgBAQCDAgAhCqoBAACGBAAwqwEAAIcEABCsAQAAhgQAMK0BAQCDAgAhswEAANsC-gEitAFAAIYCACG1AUAAhgIAIcQBAQCDAgAhyAEBALECACH4AQEAgwIAIQatAQEA6wIAIbMBAACJBPoBIrQBQADuAgAhtQFAAO4CACHEAQEA6wIAIcgBAQCJAwAhAf8BAAAA-gECBwkAAIsEACCtAQEA6wIAIbMBAACJBPoBIrQBQADuAgAhtQFAAO4CACHEAQEA6wIAIcgBAQCJAwAhCx4AAIwEADAfAACQBAAw_AEAAI0EADD9AQAAjgQAMP4BAACPBAAg_wEAAKADADCAAgAAoAMAMIECAACgAwAwggIAAKADADCDAgAAkQQAMIQCAACjAwAwGAUAANEDACAPAADSAwAgEAAA8wMAIK0BAQAAAAG0AUAAAAABtQFAAAAAAcQBAQAAAAHFAQEAAAABxwEQAAAAAcgBAQAAAAHJAQAAzgMAIMsBAAAAywECzAECAAAAAc0BAgAAAAHPAQAAAM8BAtEBAAAA0QEC0wEAAADTAQLUAQAAzwMAINUBEAAAAAHWAQIAAAAB1wEgAAAAAdgBIAAAAAHZAQEAAAAB2gEBAAAAAQIAAAAKACAeAACUBAAgAwAAAAoAIB4AAJQEACAfAACTBAAgARcAAMkEADACAAAACgAgFwAAkwQAIAIAAACkAwAgFwAAkgQAIBWtAQEA6wIAIbQBQADuAgAhtQFAAO4CACHEAQEA6wIAIcUBAQDrAgAhxwEQAKYDACHIAQEAiQMAIckBAACnAwAgywEAAKgDywEizAECAKkDACHNAQIAqQMAIc8BAACqA88BItEBAACrA9EBItMBAACsA9MBItQBAACtAwAg1QEQAK4DACHWAQIAlAMAIdcBIACvAwAh2AEgAK8DACHZAQEAiQMAIdoBAQDrAgAhGAUAALIDACAPAACzAwAgEAAA8gMAIK0BAQDrAgAhtAFAAO4CACG1AUAA7gIAIcQBAQDrAgAhxQEBAOsCACHHARAApgMAIcgBAQCJAwAhyQEAAKcDACDLAQAAqAPLASLMAQIAqQMAIc0BAgCpAwAhzwEAAKoDzwEi0QEAAKsD0QEi0wEAAKwD0wEi1AEAAK0DACDVARAArgMAIdYBAgCUAwAh1wEgAK8DACHYASAArwMAIdkBAQCJAwAh2gEBAOsCACEYBQAA0QMAIA8AANIDACAQAADzAwAgrQEBAAAAAbQBQAAAAAG1AUAAAAABxAEBAAAAAcUBAQAAAAHHARAAAAAByAEBAAAAAckBAADOAwAgywEAAADLAQLMAQIAAAABzQECAAAAAc8BAAAAzwEC0QEAAADRAQLTAQAAANMBAtQBAADPAwAg1QEQAAAAAdYBAgAAAAHXASAAAAAB2AEgAAAAAdkBAQAAAAHaAQEAAAABBwkAAJYEACCtAQEAAAABswEAAAD6AQK0AUAAAAABtQFAAAAAAcQBAQAAAAHIAQEAAAABBB4AAIwEADD8AQAAjQQAMP4BAACPBAAgggIAAKADADAEHgAA_wMAMPwBAACABAAw_gEAAIIEACCCAgAAgwQAMAAAAAAFHgAAxAQAIB8AAMcEACD8AQAAxQQAIP0BAADGBAAgggIAACAAIAMeAADEBAAg_AEAAMUEACCCAgAAIAAgAwEAAPkDACALAAC1BAAgDQAAtgQAIAAAAAAAAAAAAAAFHgAAvwQAIB8AAMIEACD8AQAAwAQAIP0BAADBBAAgggIAANsBACADHgAAvwQAIPwBAADABAAgggIAANsBACAAAAAFHgAAugQAIB8AAL0EACD8AQAAuwQAIP0BAAC8BAAgggIAAJQBACADHgAAugQAIPwBAAC7BAAgggIAAJQBACAAAAAAAAACDAAAngQAIOsBAADsAwAgCQUAAOkDACAKAAC5BAAgDwAAtQQAIBAAAPkDACDIAQAA7AMAIMwBAADsAwAgzQEAAOwDACDVAQAA7AMAINkBAADsAwAgAgYAAJgEACDIAQAA7AMAIAMIAAC4BAAgCQAA6gMAIMgBAADsAwAgBq0BAQAAAAGzAQAAAOcBArQBQAAAAAG1AUAAAAABxAEBAAAAAcgBAQAAAAECAAAAlAEAIB4AALoEACADAAAAlwEAIB4AALoEACAfAAC-BAAgCAAAAJcBACAXAAC-BAAgrQEBAOsCACGzAQAA_QPnASK0AUAA7gIAIbUBQADuAgAhxAEBAOsCACHIAQEAiQMAIQatAQEA6wIAIbMBAAD9A-cBIrQBQADuAgAhtQFAAO4CACHEAQEA6wIAIcgBAQCJAwAhCgIAAOQDACAFAADlAwAgCQAA5gMAIK0BAQAAAAGuAQEAAAABrwEBAAAAAbEBAAAAsQECswEAAACzAQK0AUAAAAABtQFAAAAAAQIAAADbAQAgHgAAvwQAIAMAAADeAQAgHgAAvwQAIB8AAMMEACAMAAAA3gEAIAIAAO8CACAFAADwAgAgCQAA8QIAIBcAAMMEACCtAQEA6wIAIa4BAQDrAgAhrwEBAOsCACGxAQAA7AKxASKzAQAA7QKzASK0AUAA7gIAIbUBQADuAgAhCgIAAO8CACAFAADwAgAgCQAA8QIAIK0BAQDrAgAhrgEBAOsCACGvAQEA6wIAIbEBAADsArEBIrMBAADtArMBIrQBQADuAgAhtQFAAO4CACEMAQAAqgQAIAsAAJoDACCtAQEAAAABtAFAAAAAAbUBQAAAAAHuAQEAAAAB7wEIAAAAAfABCAAAAAHxAQgAAAAB8wEAAADzAQL1AQAAAPUBAvcBAAAA9wECAgAAACAAIB4AAMQEACADAAAAHgAgHgAAxAQAIB8AAMgEACAOAAAAHgAgAQAAqQQAIAsAAIIDACAXAADIBAAgrQEBAOsCACG0AUAA7gIAIbUBQADuAgAh7gEBAOsCACHvAQgA_QIAIfABCAD9AgAh8QEIAP0CACHzAQAA_gLzASL1AQAA_wL1ASL3AQAAgAP3ASIMAQAAqQQAIAsAAIIDACCtAQEA6wIAIbQBQADuAgAhtQFAAO4CACHuAQEA6wIAIe8BCAD9AgAh8AEIAP0CACHxAQgA_QIAIfMBAAD-AvMBIvUBAAD_AvUBIvcBAACAA_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_QIAIfABCAD9AgAh8QEIAP0CACHzAQAA_gLzASL1AQAA_wL1ASL3AQAAgAP3ASIMAQAAqQQAIA0AAIMDACCtAQEA6wIAIbQBQADuAgAhtQFAAO4CACHuAQEA6wIAIe8BCAD9AgAh8AEIAP0CACHxAQgA_QIAIfMBAAD-AvMBIvUBAAD_AvUBIvcBAACAA_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-VAo_VgpAWA9BWSBCWwpDXQ9EXiFFXwpGYApHYQ9IZCJJZShKZglLZwlMaAlNaQlOaglPbAlQbg9RbylScQlTcw9UdCpVdQlWdglXdw9YeitZezFafQtbfgtcgAELXYEBC16CAQtfhAELYIYBD2GHATJiiQELY4sBD2SMATNljQELZo4BC2ePAQ9okgE0aZMBOGqVAQZrlgEGbJkBBm2aAQZumwEGb50BBnCfAQ9xoAE5cqIBBnOkAQ90pQE6daYBBnanAQZ3qAEPeKsBO3msAT96rgEDe68BA3yxAQN9sgEDfrMBA3-1AQOAAbcBD4EBuAFAggG6AQODAbwBD4QBvQFBhQG-AQOGAb8BA4cBwAEPiAHDAUKJAcQBRooBxQEEiwHGAQSMAccBBI0ByAEEjgHJAQSPAcsBBJABzQEPkQHOAUeSAdABBJMB0gEPlAHTAUiVAdQBBJYB1QEElwHWAQ-YAdkBSZkB2gFPmgHcAQKbAd0BApwB4AECnQHhAQKeAeIBAp8B5AECoAHmAQ-hAecBUKIB6QECowHrAQ-kAewBUaUB7QECpgHuAQKnAe8BD6gB8gFSqQHzAVY"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var PaymentMethod = {
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
  ONLINE_PAYMENT: "ONLINE_PAYMENT"
};
var OrderStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};
var MealAvailabilityStatus = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE"
};
var Role = {
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  PENDING: "PENDING"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/errors/appError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var appError_default = AppError;

// src/modules/auth/auth.service.ts
import jwt from "jsonwebtoken";

// src/utils/emailSender.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: config.email.host,
  port: parseInt(config.email.port),
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});
var sendEmail = async (to, subject, text, html) => {
  const info = await transporter.sendMail({
    from: `"Food Hub" <${config.email.user}>`,
    to,
    subject,
    text,
    html
  });
  console.log("Message sent:", info.messageId);
};

// src/utils/EmailTempletes/ForgetPassword.ts
var resetPasswordHtml = (url) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #fff7ed; font-family: Arial, sans-serif; color: #1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%); padding: 32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #fed7aa; box-shadow: 0 18px 45px rgba(194, 65, 12, 0.12);">
            <tr>
              <td style="padding: 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #ea580c 0%, #f97316 58%, #fb923c 100%);">
                  <tr>
                    <td style="padding: 28px 24px 24px; text-align: center;">
                      <p style="margin: 0 0 10px; font-size: 12px; line-height: 18px; letter-spacing: 0.18em; text-transform: uppercase; color: #ffedd5;">CraveDash Security</p>
                      <h1 style="margin: 0; font-size: 28px; line-height: 34px; color: #ffffff;">Reset your password</h1>
                      <p style="margin: 12px 0 0; font-size: 14px; line-height: 22px; color: #ffedd5;">Secure access to your account with a fresh password.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #fff7ed; border: 1px solid #fdba74; border-radius: 18px;">
                  <tr>
                    <td style="padding: 18px 20px; text-align: center;">
                      <p style="margin: 0; font-size: 14px; line-height: 22px; color: #9a3412; font-weight: 600;">This reset link stays active for 15 minutes.</p>
                    </td>
                  </tr>
                </table>
                <p style="margin: 0 0 12px; font-size: 15px; line-height: 24px; color: #1e293b;">Hi,</p>
                <p style="margin: 0 0 22px; font-size: 15px; line-height: 24px; color: #475569;">
                  We received a request to reset your password. Click the button below to set a new password.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
                  <tr>
                    <td align="center" style="border-radius: 999px; background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); box-shadow: 0 10px 24px rgba(234, 88, 12, 0.24);">
                      <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; letter-spacing: 0.02em;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 0 0 8px; font-size: 14px; line-height: 22px; color: #475569;">
                  If you did not request a password reset, you can safely ignore this email.
                </p>
                <p style="margin: 0 0 10px; font-size: 14px; line-height: 22px; color: #475569;">
                  If the button does not work, copy and paste this URL into your browser:
                </p>
                <p style="margin: 0 0 24px; padding: 14px 16px; font-size: 13px; line-height: 21px; word-break: break-all; background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 14px;">
                  <a href="${url}" target="_blank" style="color: #c2410c; text-decoration: underline;">${url}</a>
                </p>
                <p style="margin: 0; font-size: 13px; line-height: 21px; color: #64748b;">
                  For security reasons, this link can only be used once and expires automatically.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 18px 24px; background-color: #fff7ed; border-top: 1px solid #fed7aa; text-align: center;">
                <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9a3412;">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} CraveDash. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

// src/modules/auth/auth.service.ts
var loginUser = async (payload) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email
    }
  });
  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    isUserExist.password
  );
  if (!isPasswordMatch) {
    throw new appError_default(401, "Invalid credentials");
  }
  const token = jwt.sign(
    { email: isUserExist.email, role: isUserExist.role },
    String(config.jwt.secret),
    { expiresIn: config.jwt.expiresIn }
  );
  return {
    token,
    user: isUserExist
  };
};
var forgetPassword = async (payload) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email
    }
  });
  if (!isUserExist) {
    throw new appError_default(404, "User not found");
  }
  if (isUserExist.updatedAt.getTime() + 15 * 60 * 1e3 > Date.now()) {
    throw new appError_default(429, "Password reset already requested. Please try again later.");
  }
  const token = jwt.sign(
    { email: isUserExist.email, role: isUserExist.role },
    String(config.jwt.secret),
    { expiresIn: config.email.email_expires_in }
  );
  const url = `${config.clientUrl}/reset-password?token=${token}`;
  await sendEmail(
    isUserExist.email,
    "Password Reset Request",
    `You requested a password reset. Click the link to reset your password: ${url}`,
    resetPasswordHtml(url)
  );
};
var resetPassword = async (payload) => {
  const decoded = jwt.verify(payload.token, config.jwt.secret);
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: decoded.email
    }
  });
  if (!isUserExist) {
    throw new appError_default(404, "User not found");
  }
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.saltRounds)
  );
  await prisma.user.update({
    where: {
      email: decoded.email
    },
    data: {
      password: hashedPassword
    }
  });
};
var AuthService = {
  loginUser,
  forgetPassword,
  resetPassword
};

// src/modules/auth/auth.controller.ts
var cookieOptions = {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: config.nodeEnv === "production" ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1e3,
  path: "/"
};
var login = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { token, ...userData } = result;
  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      token,
      userData
    }
  });
});
var forgetPassword2 = catchAsync(async (req, res) => {
  await AuthService.forgetPassword(req.body);
  res.status(200).json({
    success: true,
    message: "Password reset link sent to your email if the email is registered with us"
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  await AuthService.resetPassword(req.body);
  res.status(200).json({
    success: true,
    message: "Password reset successfully"
  });
});
var AuthController = {
  login,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2
};

// src/modules/auth/auth.route.ts
var router = express.Router();
router.post("/login", AuthController.login);
router.patch("/forgot-password", AuthController.forgetPassword);
router.patch("/reset-password", AuthController.resetPassword);
var AuthRoutes = router;

// src/modules/dashboard/dashboard.route.ts
import express2 from "express";

// src/utils/jwtVerifier.ts
import jwt2 from "jsonwebtoken";
var jwtVerifier = ({ token, secretKey }) => {
  const decoded = jwt2.verify(token, secretKey);
  return decoded;
};

// src/middleware/auth.ts
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new appError_default(401, "Invalid signature");
      }
      const bearerToken = token.split(" ")[1];
      let decoded;
      try {
        decoded = jwtVerifier({
          token: bearerToken,
          secretKey: config.jwt.secret
        });
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          throw new appError_default(401, "Access token expired");
        }
        if (err.name === "JsonWebTokenError") {
          throw new appError_default(401, "Invalid token");
        }
        throw new appError_default(401, "Unauthorized");
      }
      const user = await prisma.user.findUnique({
        where: {
          email: decoded.email
          //   status: Status.active,
        }
      });
      if (!user) {
        throw new appError_default(404, "User not found");
      }
      if (roles.length && !roles.includes(user.role)) {
        throw new appError_default(403, "You are not authorized to access this route");
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth;

// src/modules/dashboard/dashboard.service.ts
var orderStatusMeta = {
  PENDING: {
    label: "Pending",
    tone: "warning"
  },
  CONFIRMED: {
    label: "Confirmed",
    tone: "info"
  },
  PREPARING: {
    label: "Preparing",
    tone: "warning"
  },
  SHIPPED: {
    label: "On the way",
    tone: "info"
  },
  DELIVERED: {
    label: "Delivered",
    tone: "success"
  },
  CANCELLED: {
    label: "Cancelled",
    tone: "danger"
  }
};
var activeOrderStatuses = [
  "CONFIRMED",
  "PREPARING",
  "SHIPPED"
];
var formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
};
var formatDate = (value) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(value);
};
var formatChartDay = (value) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short"
  }).format(value);
};
var toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
var getCustomerDashboard = async (userEmail) => {
  const startOfToday = /* @__PURE__ */ new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const [customer, totalOrders, activeDeliveries, todayOrders, cartItems, recentOrders] = await Promise.all([
    prisma.customer.findUnique({
      where: { email: userEmail },
      select: {
        email: true,
        fullName: true,
        phone: true,
        address: true,
        city: true,
        profileImage: true,
        status: true
      }
    }),
    prisma.order.count({
      where: { userEmail }
    }),
    prisma.order.count({
      where: {
        userEmail,
        orderStatus: {
          in: activeOrderStatuses
        }
      }
    }),
    prisma.order.count({
      where: {
        userEmail,
        createdAt: {
          gte: startOfToday
        }
      }
    }),
    prisma.cart.findMany({
      where: {
        userEmail
      },
      select: {
        quantity: true
      }
    }),
    prisma.order.findMany({
      where: {
        userEmail
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 3,
      include: {
        items: {
          include: {
            meal: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        deliveryAddress: true
      }
    })
  ]);
  const savedMeals = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const rewardPoints = totalOrders * 20;
  const todayActivityCount = todayOrders + activeDeliveries;
  const overviewCards = [
    {
      key: "totalOrders",
      label: "Total Orders",
      value: totalOrders,
      formattedValue: String(totalOrders),
      description: "Across all time"
    },
    {
      key: "activeDeliveries",
      label: "Active Deliveries",
      value: activeDeliveries,
      formattedValue: String(activeDeliveries),
      description: "On the way right now"
    },
    {
      key: "savedMeals",
      label: "Saved Meals",
      value: savedMeals,
      formattedValue: String(savedMeals),
      description: "Quick reorders"
    },
    {
      key: "rewardPoints",
      label: "Reward Points",
      value: rewardPoints,
      formattedValue: String(rewardPoints),
      description: "Ready to redeem"
    }
  ];
  const mappedRecentOrders = recentOrders.map((order) => {
    const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
    const mealNames = order.items.map((item) => item.meal.name);
    const status = order.orderStatus;
    const statusInfo = orderStatusMeta[status] ?? {
      label: order.orderStatus,
      tone: "neutral"
    };
    return {
      id: order.id,
      orderNumber: `ORD-${order.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`,
      createdAt: order.createdAt,
      dateLabel: formatDate(order.createdAt),
      itemCount,
      itemCountLabel: `${itemCount} item${itemCount === 1 ? "" : "s"}`,
      itemsPreview: mealNames.slice(0, 3).join(", "),
      mealNames,
      total: order.total,
      formattedTotal: formatCurrency(order.total),
      orderStatus: order.orderStatus,
      statusLabel: statusInfo.label,
      statusTone: statusInfo.tone,
      paymentStatus: order.paymentStatus,
      deliveryAddress: order.deliveryAddress
    };
  });
  return {
    customer: customer ?? {
      email: userEmail,
      fullName: "Customer",
      phone: null,
      address: null,
      city: null,
      profileImage: null,
      status: "ACTIVE"
    },
    greeting: {
      title: `Welcome back, ${customer?.fullName ?? "Customer"}`,
      subtitle: "Track your orders, update your profile, and keep your food journey organized from one place."
    },
    sidebar: {
      label: "Today",
      activeCount: todayActivityCount,
      description: "Current customer activities"
    },
    overviewCards,
    recentOrders: mappedRecentOrders,
    quickActions: [
      {
        label: "Manage profile",
        href: "/profile",
        icon: "user"
      },
      {
        label: "Track orders",
        href: "/orders",
        icon: "truck"
      },
      {
        label: "Browse meals",
        href: "/meals",
        icon: "heart"
      },
      {
        label: "Open cart",
        href: "/cart",
        icon: "cart"
      }
    ],
    accountTip: {
      label: "Account Tip",
      title: "Keep your profile updated",
      description: "Your saved address and phone number help speed up every delivery."
    }
  };
};
var getProviderDashboard = async (providerEmail) => {
  const startOfToday = /* @__PURE__ */ new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const [provider, totalOrders, todayOrders, activeMeals, orderData, recentOrders] = await Promise.all([
    // Get provider info
    prisma.user.findUnique({
      where: { email: providerEmail },
      select: {
        email: true,
        role: true,
        createdAt: true
      }
    }),
    // Count total orders where provider's meals are included
    prisma.order.count({
      where: {
        items: {
          some: {
            meal: {
              providerEmail
            }
          }
        }
      }
    }),
    // Count today's orders
    prisma.order.count({
      where: {
        items: {
          some: {
            meal: {
              providerEmail
            }
          }
        },
        createdAt: {
          gte: startOfToday
        }
      }
    }),
    // Count active meals
    prisma.meal.count({
      where: {
        providerEmail,
        availabilityStatus: "AVAILABLE"
      }
    }),
    // Get revenue data from order items
    prisma.orderItem.findMany({
      where: {
        meal: {
          providerEmail
        }
      },
      select: {
        price: true,
        quantity: true
      }
    }),
    // Get recent orders with provider's items
    prisma.order.findMany({
      where: {
        items: {
          some: {
            meal: {
              providerEmail
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 5,
      include: {
        user: {
          select: {
            email: true,
            customer: {
              select: {
                fullName: true
              }
            }
          }
        },
        items: {
          where: {
            meal: {
              providerEmail
            }
          },
          include: {
            meal: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })
  ]);
  const totalRevenue = orderData.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity;
  }, 0);
  const performanceScore = 4.8;
  const overviewCards = [
    {
      key: "totalOrders",
      label: "Total Orders",
      value: totalOrders,
      formattedValue: String(totalOrders),
      description: "All time orders"
    },
    {
      key: "todayOrders",
      label: "Today's Orders",
      value: todayOrders,
      formattedValue: String(todayOrders),
      description: "Incoming today"
    },
    {
      key: "totalRevenue",
      label: "Total Revenue",
      value: totalRevenue,
      formattedValue: formatCurrency(totalRevenue),
      description: "From all orders"
    },
    {
      key: "activeMeals",
      label: "Active Meals",
      value: activeMeals,
      formattedValue: String(activeMeals),
      description: "Available now"
    }
  ];
  const mappedRecentOrders = recentOrders.map((order) => {
    const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
    const mealNames = order.items.map((item) => item.meal.name);
    const status = order.orderStatus;
    const statusInfo = orderStatusMeta[status] ?? {
      label: order.orderStatus,
      tone: "neutral"
    };
    return {
      id: order.id,
      orderNumber: `PO-${order.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`,
      customerEmail: order.user.email,
      customerName: order.user.customer?.fullName ?? "Customer",
      itemCount,
      mealNames,
      total: order.total,
      formattedTotal: formatCurrency(order.total),
      orderStatus: order.orderStatus,
      statusLabel: statusInfo.label,
      statusTone: statusInfo.tone
    };
  });
  return {
    provider: provider ?? {
      email: providerEmail,
      role: "PROVIDER",
      createdAt: /* @__PURE__ */ new Date()
    },
    greeting: {
      title: "Business Overview",
      subtitle: "Monitor performance, review recent activity, and jump straight into operational tasks."
    },
    sidebar: {
      label: "Today",
      performanceScore,
      scoreDescription: "Provider performance score"
    },
    overviewCards,
    recentOrders: mappedRecentOrders,
    quickActions: [
      {
        label: "Manage Menu",
        href: "/meals",
        icon: "menu"
      },
      {
        label: "Review Orders",
        href: "/orders",
        icon: "orders"
      },
      {
        label: "Add New Meal",
        href: "/meals/create",
        icon: "plus"
      }
    ]
  };
};
var getAdminDashboard = async () => {
  const today = /* @__PURE__ */ new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 6);
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    return day;
  });
  const [totalUsers, totalProviders, totalCustomers, totalOrders, totalRevenue, suspendedUsers, pendingOrders, unavailableMeals, recentOrders, weeklyRevenue, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        role: Role.PROVIDER
      }
    }),
    prisma.user.count({
      where: {
        role: Role.CUSTOMER
      }
    }),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        total: true
      }
    }),
    prisma.user.count({
      where: {
        status: UserStatus.SUSPENDED
      }
    }),
    prisma.order.count({
      where: {
        orderStatus: OrderStatus.PENDING
      }
    }),
    prisma.meal.count({
      where: {
        availabilityStatus: MealAvailabilityStatus.UNAVAILABLE
      }
    }),
    prisma.order.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 4,
      include: {
        user: {
          select: {
            email: true,
            customer: {
              select: {
                fullName: true
              }
            }
          }
        },
        items: {
          include: {
            meal: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }),
    prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfWeek
        }
      },
      select: {
        createdAt: true,
        total: true
      }
    }),
    prisma.user.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 4,
      select: {
        email: true,
        role: true,
        createdAt: true,
        customer: {
          select: {
            fullName: true
          }
        }
      }
    })
  ]);
  const weeklyOrdersData = weekDays.map((day) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const ordersForDay = weeklyRevenue.filter(
      (order) => order.createdAt >= dayStart && order.createdAt < dayEnd
    ).length;
    const revenueForDay = weeklyRevenue.filter((order) => order.createdAt >= dayStart && order.createdAt < dayEnd).reduce((acc, order) => acc + toNumber(order.total), 0);
    return {
      label: formatChartDay(day),
      orders: ordersForDay,
      revenue: revenueForDay,
      formattedRevenue: formatCurrency(revenueForDay)
    };
  });
  const mappedRecentOrders = recentOrders.map((order) => {
    const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
    const customerName = order.user.customer?.fullName ?? order.user.email;
    const status = order.orderStatus;
    const statusInfo = orderStatusMeta[status] ?? {
      label: order.orderStatus,
      tone: "neutral"
    };
    return {
      id: order.id,
      orderNumber: `AO-${order.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`,
      customerName,
      customerEmail: order.user.email,
      itemCount,
      total: toNumber(order.total),
      formattedTotal: formatCurrency(toNumber(order.total)),
      orderStatus: order.orderStatus,
      statusLabel: statusInfo.label,
      statusTone: statusInfo.tone,
      createdAt: order.createdAt,
      dateLabel: formatDate(order.createdAt)
    };
  });
  const recentActivity = recentUsers.map((user) => ({
    label: user.customer?.fullName ?? user.email,
    description: `${user.role} \u2022 ${formatDate(user.createdAt)}`,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }));
  const totalRevenueValue = toNumber(totalRevenue._sum.total);
  const systemIsHealthy = suspendedUsers === 0 && pendingOrders < 20 && unavailableMeals < 10;
  return {
    greeting: {
      title: "Platform Overview",
      subtitle: "Monitor the marketplace, track performance, and review live activity across users, orders, and providers."
    },
    sidebar: {
      label: "System Status",
      status: systemIsHealthy ? "Healthy" : "Needs Attention",
      description: systemIsHealthy ? "All services operational" : "Some areas need review"
    },
    overviewCards: [
      {
        key: "totalUsers",
        label: "Total Users",
        value: totalUsers,
        formattedValue: String(totalUsers),
        description: "All registered accounts"
      },
      {
        key: "totalOrders",
        label: "Total Orders",
        value: totalOrders,
        formattedValue: String(totalOrders),
        description: "All marketplace orders"
      },
      {
        key: "totalProviders",
        label: "Total Providers",
        value: totalProviders,
        formattedValue: String(totalProviders),
        description: "Active service providers"
      },
      {
        key: "totalRevenue",
        label: "Total Revenue",
        value: totalRevenueValue,
        formattedValue: formatCurrency(totalRevenueValue),
        description: "Gross platform revenue"
      }
    ],
    metrics: {
      totalCustomers,
      suspendedUsers,
      pendingOrders,
      unavailableMeals
    },
    charts: {
      weeklyOrders: weeklyOrdersData.map((day) => ({
        label: day.label,
        value: day.orders
      })),
      weeklyRevenue: weeklyOrdersData.map((day) => ({
        label: day.label,
        value: day.revenue,
        formattedValue: day.formattedRevenue
      }))
    },
    recentActivity: mappedRecentOrders,
    recentUsers: recentActivity,
    quickActions: [
      {
        label: "Manage Users",
        href: "/users",
        icon: "users"
      },
      {
        label: "Manage Orders",
        href: "/orders",
        icon: "orders"
      },
      {
        label: "Manage Categories",
        href: "/categories",
        icon: "categories"
      }
    ]
  };
};
var DashboardService = {
  getCustomerDashboard,
  getProviderDashboard,
  getAdminDashboard
};

// src/modules/dashboard/dashboard.controller.ts
var getCustomerDashboard2 = catchAsync(async (req, res) => {
  const result = await DashboardService.getCustomerDashboard(req.user.email);
  res.status(200).json({
    success: true,
    message: "Customer dashboard data retrieved successfully",
    data: result
  });
});
var getProviderDashboard2 = catchAsync(async (req, res) => {
  const result = await DashboardService.getProviderDashboard(req.user.email);
  res.status(200).json({
    success: true,
    message: "Provider dashboard data retrieved successfully",
    data: result
  });
});
var getAdminDashboard2 = catchAsync(async (req, res) => {
  const result = await DashboardService.getAdminDashboard();
  res.status(200).json({
    success: true,
    message: "Admin dashboard data retrieved successfully",
    data: result
  });
});
var DashboardController = {
  getCustomerDashboard: getCustomerDashboard2,
  getProviderDashboard: getProviderDashboard2,
  getAdminDashboard: getAdminDashboard2
};

// src/modules/dashboard/dashboard.route.ts
var router2 = express2.Router();
router2.get("/customer", auth_default(Role.CUSTOMER), DashboardController.getCustomerDashboard);
router2.get("/provider", auth_default(Role.PROVIDER, Role.CUSTOMER, Role.ADMIN), DashboardController.getProviderDashboard);
router2.get("/admin", auth_default(Role.ADMIN, Role.CUSTOMER), DashboardController.getAdminDashboard);
var DashboardRoutes = router2;

// src/modules/cart/cart.route.ts
import express3 from "express";

// src/modules/cart/cart.service.ts
import { Decimal as Decimal2 } from "@prisma/client/runtime/client";
var addToCart = async (payload, userEmail) => {
  const meal = await prisma.cart.findFirst({
    where: {
      mealId: payload.mealId,
      userEmail
    }
  });
  if (!meal) {
    const data = {
      userEmail,
      mealId: payload.mealId,
      quantity: payload.quantity ?? 1
    };
    const result = await prisma.cart.create({
      data
    });
    return result;
  } else {
    const result = await prisma.cart.update({
      where: {
        id: meal.id
      },
      data: {
        quantity: meal.quantity + (payload.quantity ?? 1)
      }
    });
    return result;
  }
};
var clearCart = async (email) => {
  const result = await prisma.cart.deleteMany({
    where: {
      userEmail: email
    }
  });
  return result;
};
var removeFromCart = async (cartId, mealId, email) => {
  const isUserCart = await prisma.cart.findFirst({
    where: {
      id: cartId,
      userEmail: email
    }
  });
  if (!isUserCart) {
    throw new appError_default(401, "Unauthorized");
  }
  const result = await prisma.cart.deleteMany({
    where: {
      id: cartId,
      mealId,
      userEmail: email
    }
  });
  return result;
};
var getCartItems = async (userEmail) => {
  const result = await prisma.cart.findMany({
    where: {
      userEmail
    },
    include: {
      meal: {
        select: {
          name: true,
          price: true,
          image: true
        }
      }
    }
  });
  result.forEach((cartItem) => {
    if (cartItem.meal) {
      cartItem.meal.price = cartItem.meal.price.mul(cartItem.quantity);
    }
  });
  const subTotal = result.reduce((acc, item) => {
    if (item.meal) {
      return acc.add(item.meal.price.mul(item.quantity));
    }
    return acc;
  }, new Decimal2(0));
  const deliveryCharge = 120;
  const total = subTotal.add(deliveryCharge);
  return {
    items: result,
    meta: {
      subTotal,
      deliveryCharge,
      total
    }
  };
};
var increaseCartItemQuantity = async (cartId) => {
  const result = await prisma.cart.update({
    where: {
      id: cartId
    },
    data: {
      quantity: {
        increment: 1
      }
    }
  });
  return result;
};
var decreaseCartItemQuantity = async (cartId) => {
  const result = await prisma.cart.update({
    where: {
      id: cartId
    },
    data: {
      quantity: {
        decrement: 1
      }
    }
  });
  return result;
};
var CartService = {
  addToCart,
  clearCart,
  removeFromCart,
  getCartItems,
  increaseCartItemQuantity,
  decreaseCartItemQuantity
};

// src/modules/cart/cart.controller.ts
var addToCart2 = catchAsync(async (req, res) => {
  const userId = req.user.email;
  const result = await CartService.addToCart(req.body, userId);
  res.status(201).json({
    success: true,
    message: "Item added to cart successfully",
    data: result
  });
});
var getCartItems2 = catchAsync(async (req, res) => {
  const userId = req.user.email;
  const result = await CartService.getCartItems(userId);
  res.status(200).json({
    success: true,
    message: "Cart items retrieved successfully",
    data: result
  });
});
var clearCart2 = catchAsync(async (req, res) => {
  const email = req.user.email;
  const result = await CartService.clearCart(email);
  res.status(200).json({
    success: true,
    message: "Cart item removed successfully",
    data: result
  });
});
var removeFromCart2 = catchAsync(async (req, res) => {
  const cartId = req.params.cartId;
  const mealId = req.params.mealId;
  const email = req.user.email;
  const result = await CartService.removeFromCart(cartId, mealId, email);
  res.status(200).json({
    success: true,
    message: "Cart item removed successfully",
    data: result
  });
});
var increaseCartItemQuantity2 = catchAsync(async (req, res) => {
  const cartId = req.params.cartId;
  const result = await CartService.increaseCartItemQuantity(cartId);
  res.status(200).json({
    success: true,
    message: "Cart item quantity increased successfully",
    data: result
  });
});
var decreaseCartItemQuantity2 = catchAsync(async (req, res) => {
  const cartId = req.params.cartId;
  const result = await CartService.decreaseCartItemQuantity(cartId);
  res.status(200).json({
    success: true,
    message: "Cart item quantity decreased successfully",
    data: result
  });
});
var CartController = {
  addToCart: addToCart2,
  getCartItems: getCartItems2,
  clearCart: clearCart2,
  removeFromCart: removeFromCart2,
  increaseCartItemQuantity: increaseCartItemQuantity2,
  decreaseCartItemQuantity: decreaseCartItemQuantity2
};

// src/modules/cart/cart.route.ts
var router3 = express3.Router();
router3.post("/", auth_default(Role.CUSTOMER, Role.ADMIN, Role.PROVIDER), CartController.addToCart);
router3.get("/", auth_default(Role.CUSTOMER, Role.ADMIN, Role.PROVIDER), CartController.getCartItems);
router3.delete("/", auth_default(Role.CUSTOMER, Role.ADMIN, Role.PROVIDER), CartController.clearCart);
router3.delete("/:cartId/:mealId", auth_default(Role.CUSTOMER, Role.ADMIN, Role.PROVIDER), CartController.removeFromCart);
router3.patch("/:cartId/increase", auth_default(Role.CUSTOMER, Role.ADMIN, Role.PROVIDER), CartController.increaseCartItemQuantity);
router3.patch("/:cartId/decrease", auth_default(Role.CUSTOMER, Role.ADMIN, Role.PROVIDER), CartController.decreaseCartItemQuantity);
var CartRoutes = router3;

// src/modules/cuisine/cuisine.route.ts
import express4 from "express";

// src/utils/pagination.ts
var pagination = (skip = 0, take, sortBy, sortOrder) => {
  const currentPage = Number(skip) ? Number(skip) + 1 : 1;
  const takeValue = Number(take) || 10;
  const skipValue = Number(skip) * takeValue || 0;
  const sortByField = sortBy || "createdAt";
  const sortOrderValue = sortOrder || "desc";
  return {
    currentPage,
    skipValue,
    takeValue,
    sortByField,
    sortOrderValue
  };
};

// src/utils/searching.ts
var searching = (inputFilter, searchFields, searchTerm) => {
  const orConditions = searchFields.map((field) => {
    if (field.includes(".")) {
      const parts = field.split(".");
      let currentStructure = {
        contains: String(searchTerm),
        mode: "insensitive"
      };
      for (let i = parts.length - 1; i >= 0; i--) {
        const key = parts[i];
        currentStructure = { [key]: currentStructure };
      }
      return currentStructure;
    }
    return {
      [field]: { contains: String(searchTerm), mode: "insensitive" }
    };
  });
  return [...inputFilter, { OR: orConditions }];
};

// src/utils/filtering.ts
var filtering = (inputFilter, filterData) => {
  const filterConditions = [];
  Object.keys(filterData).forEach((key) => {
    let value = filterData[key];
    if (!value) return;
    if (typeof value === "string" && value.includes(",")) {
      value = value.split(",").map((v) => v.trim());
    }
    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    }
    const isArray = Array.isArray(value);
    const filterCondition = isArray ? { in: value } : { equals: value };
    if (key.includes(".")) {
      const parts = key.split(".");
      let nestedFilter = filterCondition;
      for (let i = parts.length - 1; i >= 0; i--) {
        const partKey = parts[i];
        if (partKey === "some" || partKey === "every" || partKey === "none") {
          nestedFilter = { [partKey]: nestedFilter };
        } else {
          nestedFilter = { [partKey]: nestedFilter };
        }
      }
      filterConditions.push(nestedFilter);
    } else {
      filterConditions.push({ [key]: filterCondition });
    }
  });
  if (filterConditions.length > 0) {
    if (inputFilter.length > 0) {
      inputFilter.push({ AND: filterConditions });
    } else {
      filterConditions.forEach((condition) => {
        inputFilter.push(condition);
      });
    }
  }
  return inputFilter;
};

// src/modules/cuisine/cuisine.service.ts
var attachCuisineCounts = async (cuisines) => {
  if (!cuisines.length) {
    return cuisines.map((cuisine) => ({
      ...cuisine,
      categoriesCount: 0,
      categories: 0,
      mealsCount: 0,
      meals: 0
    }));
  }
  const cuisineIds = cuisines.map((cuisine) => cuisine.id);
  const categories = await prisma.category.findMany({
    where: {
      cuisineId: {
        in: cuisineIds
      }
    },
    select: {
      cuisineId: true,
      _count: {
        select: {
          meals: true
        }
      }
    }
  });
  const mealCountByCuisine = /* @__PURE__ */ new Map();
  categories.forEach((category) => {
    const current = mealCountByCuisine.get(category.cuisineId) ?? 0;
    mealCountByCuisine.set(category.cuisineId, current + category._count.meals);
  });
  return cuisines.map((cuisine) => {
    const categoriesCount = cuisine._count?.categories ?? 0;
    const mealsCount = mealCountByCuisine.get(cuisine.id) ?? 0;
    return {
      ...cuisine,
      categoriesCount,
      categories: categoriesCount,
      mealsCount,
      meals: mealsCount
    };
  });
};
var createCuisine = async (payload) => {
  const result = await prisma.cuisine.create({
    data: payload
  });
  return result;
};
var getCuisines = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, status } = query;
  const allowedSortFields = [
    "id",
    "name",
    "image",
    "status",
    "createdAt",
    "updatedAt"
  ];
  const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
  const safeSortBy = allowedSortFields.includes(requestedSortField) ? requestedSortField : "createdAt";
  let inputFilter = [];
  if (searchTerm) {
    inputFilter = searching(inputFilter, ["name"], String(searchTerm));
  }
  const filterData = {};
  if (status) filterData.status = status;
  if (Object.keys(filterData).length > 0) {
    inputFilter = filtering(inputFilter, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(Number(skip), Number(take), safeSortBy, sortOrder === "asc" ? "asc" : "desc");
  const whereCondition = inputFilter.length > 0 ? { AND: inputFilter } : {};
  const result = await prisma.cuisine.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    include: {
      _count: {
        select: {
          categories: true
        }
      }
    },
    orderBy: {
      [sortByField]: sortOrderValue
    }
  });
  const mappedResult = await attachCuisineCounts(result);
  const total = await prisma.cuisine.count({
    where: whereCondition
  });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: mappedResult
  };
};
var getAllCuisinesForCategory = async () => {
  const result = await prisma.cuisine.findMany({
    include: {
      _count: {
        select: {
          categories: true
        }
      }
    }
  });
  return await attachCuisineCounts(result);
};
var getAllCuisinesForFiltering = async () => {
  const result = await prisma.cuisine.findMany({
    include: {
      _count: {
        select: {
          categories: true
        }
      }
    }
  });
  return await attachCuisineCounts(result);
};
var CuisineService = {
  createCuisine,
  getCuisines,
  getAllCuisinesForCategory,
  getAllCuisinesForFiltering
};

// src/modules/cuisine/cuisine.controller.ts
var createCuisine2 = catchAsync(async (req, res) => {
  const result = await CuisineService.createCuisine(req.body);
  res.status(201).json({
    success: true,
    message: "Cuisine created successfully",
    data: result
  });
});
var getCuisines2 = catchAsync(async (req, res) => {
  const result = await CuisineService.getCuisines(req.query);
  res.status(200).json({
    success: true,
    message: "Cuisines retrieved successfully",
    data: result
  });
});
var getAllCuisinesForFiltering2 = catchAsync(async (req, res) => {
  const result = await CuisineService.getAllCuisinesForFiltering();
  res.status(200).json({
    success: true,
    message: "Cuisines for filtering retrieved successfully",
    data: result
  });
});
var CuisineController = {
  createCuisine: createCuisine2,
  getCuisines: getCuisines2,
  getAllCuisinesForFiltering: getAllCuisinesForFiltering2
};

// src/modules/cuisine/cuisine.route.ts
var router4 = express4.Router();
router4.post("/", CuisineController.createCuisine);
router4.get("/", CuisineController.getCuisines);
router4.get("/filtering", CuisineController.getAllCuisinesForFiltering);
var CuisineRoutes = router4;

// src/modules/meal/meal.route.ts
import express5 from "express";

// src/modules/meal/meal.service.ts
var mealInclude = {
  category: {
    include: {
      cuisine: true
    }
  }
};
var createMeal = async (payload, email) => {
  const result = await prisma.meal.create({
    data: {
      ...payload,
      providerEmail: email
    },
    include: mealInclude
  });
  return result;
};
var getProvidersMeals = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, availabilityStatus, mealType, dietaryTag, spiceLevel, categoryId, cuisineId } = query;
  const allowedSortFields = [
    "id",
    "name",
    "price",
    "availabilityStatus",
    "preparationTime",
    "servingSize",
    "mealType",
    "dietaryTag",
    "spiceLevel",
    "stockQuantity",
    "createdAt",
    "updatedAt"
  ];
  const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
  const safeSortBy = allowedSortFields.includes(
    requestedSortField
  ) ? requestedSortField : "createdAt";
  let inputFilter = [];
  if (searchTerm) {
    inputFilter = searching(inputFilter, ["name", "description", "category.name", "category.cuisine.name"], String(searchTerm));
  }
  const filterData = {};
  if (availabilityStatus) filterData.availabilityStatus = availabilityStatus;
  if (mealType) filterData.mealType = mealType;
  if (dietaryTag) filterData.dietaryTag = dietaryTag;
  if (spiceLevel) filterData.spiceLevel = spiceLevel;
  if (categoryId) filterData.categoryId = categoryId;
  if (cuisineId) filterData["category.cuisine.id"] = cuisineId;
  if (Object.keys(filterData).length > 0) {
    inputFilter = filtering(inputFilter, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(Number(skip), Number(take), safeSortBy, sortOrder === "asc" ? "asc" : "desc");
  const whereCondition = inputFilter.length > 0 ? { AND: inputFilter } : {};
  const result = await prisma.meal.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    orderBy: {
      [sortByField]: sortOrderValue
    },
    include: mealInclude
  });
  const total = await prisma.meal.count({
    where: whereCondition
  });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: result
  };
};
var getMeals = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, availabilityStatus, mealType, dietaryTag, spiceLevel, categoryId, cuisineId, providerEmail } = query;
  const allowedSortFields = [
    "id",
    "name",
    "price",
    "availabilityStatus",
    "preparationTime",
    "servingSize",
    "mealType",
    "dietaryTag",
    "spiceLevel",
    "stockQuantity",
    "createdAt",
    "updatedAt"
  ];
  const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
  const safeSortBy = allowedSortFields.includes(
    requestedSortField
  ) ? requestedSortField : "createdAt";
  let inputFilter = [];
  if (searchTerm) {
    inputFilter = searching(inputFilter, ["name", "description", "category.name", "category.cuisine.name"], String(searchTerm));
  }
  const filterData = {};
  if (availabilityStatus) filterData.availabilityStatus = availabilityStatus;
  if (mealType) filterData.mealType = mealType;
  if (dietaryTag) filterData.dietaryTag = dietaryTag;
  if (spiceLevel) filterData.spiceLevel = spiceLevel;
  if (categoryId) filterData.categoryId = categoryId;
  if (cuisineId) filterData["category.cuisine.id"] = cuisineId;
  if (providerEmail) filterData.providerEmail = providerEmail;
  if (Object.keys(filterData).length > 0) {
    inputFilter = filtering(inputFilter, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(Number(skip), Number(take), safeSortBy, sortOrder === "asc" ? "asc" : "desc");
  const whereCondition = inputFilter.length > 0 ? { AND: inputFilter } : {};
  const result = await prisma.meal.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    orderBy: {
      [sortByField]: sortOrderValue
    },
    include: mealInclude
  });
  const total = await prisma.meal.count({
    where: whereCondition
  });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: result
  };
};
var getMealById = async (id) => {
  const result = await prisma.meal.findUniqueOrThrow({
    where: { id },
    include: mealInclude
  });
  return result;
};
var updateMeal = async (id, payload) => {
  const result = await prisma.meal.update({
    where: { id },
    data: payload,
    include: mealInclude
  });
  return result;
};
var deleteMeal = async (id) => {
  const result = await prisma.meal.delete({
    where: { id },
    include: mealInclude
  });
  return result;
};
var MealService = {
  createMeal,
  getProvidersMeals,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal
};

// src/modules/meal/meal.controller.ts
var createMeal2 = catchAsync(async (req, res) => {
  const email = req.user?.email;
  const result = await MealService.createMeal(req.body, email);
  res.status(201).json({
    success: true,
    message: "Meal created successfully",
    data: result
  });
});
var getProvidersMeals2 = catchAsync(async (req, res) => {
  const result = await MealService.getProvidersMeals(req.query);
  res.status(200).json({
    success: true,
    message: "Meals retrieved successfully",
    data: result
  });
});
var getMeals2 = catchAsync(async (req, res) => {
  const result = await MealService.getMeals(req.query);
  res.status(200).json({
    success: true,
    message: "Meals retrieved successfully",
    data: result
  });
});
var getMealById2 = catchAsync(async (req, res) => {
  const mealId = req.params.id;
  const result = await MealService.getMealById(mealId);
  res.status(200).json({
    success: true,
    message: "Meal retrieved successfully",
    data: result
  });
});
var updateMeal2 = catchAsync(async (req, res) => {
  const mealId = req.params.id;
  const result = await MealService.updateMeal(mealId, req.body);
  res.status(200).json({
    success: true,
    message: "Meal updated successfully",
    data: result
  });
});
var deleteMeal2 = catchAsync(async (req, res) => {
  const mealId = req.params.id;
  const result = await MealService.deleteMeal(mealId);
  res.status(200).json({
    success: true,
    message: "Meal deleted successfully",
    data: result
  });
});
var MealController = {
  createMeal: createMeal2,
  getProvidersMeals: getProvidersMeals2,
  getMealById: getMealById2,
  updateMeal: updateMeal2,
  deleteMeal: deleteMeal2,
  getMeals: getMeals2
};

// src/modules/meal/meal.route.ts
var router5 = express5.Router();
router5.post("/", auth_default(Role.PROVIDER, Role.CUSTOMER), MealController.createMeal);
router5.get("/", MealController.getMeals);
router5.get("/provider", auth_default(Role.PROVIDER, Role.CUSTOMER), MealController.getProvidersMeals);
router5.get("/:id", MealController.getMealById);
router5.patch("/:id", auth_default(Role.PROVIDER), MealController.updateMeal);
router5.delete("/:id", auth_default(Role.PROVIDER), MealController.deleteMeal);
var MealRoutes = router5;

// src/modules/order/order.route.ts
import express6 from "express";

// src/modules/order/order.service.ts
var createOrder = async (payload, userEmail) => {
  const deliveryAddressPayload = payload.deliveryAddress ?? {};
  const fullName = payload.fullName ?? deliveryAddressPayload.fullName;
  const phoneNumber = payload.phoneNumber ?? deliveryAddressPayload.phoneNumber;
  const city = payload.city ?? deliveryAddressPayload.city;
  const area = payload.area ?? deliveryAddressPayload.area;
  const streetAddress = payload.streetAddress ?? deliveryAddressPayload.streetAddress;
  const deliveryInstructions = payload.deliveryInstructions ?? deliveryAddressPayload.deliveryInstructions;
  if (!fullName || !phoneNumber || !city || !area || !streetAddress) {
    throw new appError_default(400, "Delivery address is incomplete");
  }
  const cartItems = await prisma.cart.findMany({
    where: { userEmail },
    include: {
      meal: {
        select: {
          id: true,
          name: true,
          price: true
        }
      }
    }
  });
  if (!cartItems.length) {
    throw new appError_default(400, "Cart is empty");
  }
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + Number(item.meal.price) * item.quantity;
  }, 0);
  const deliveryFee = 120;
  const total = subtotal + deliveryFee;
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userEmail,
        subtotal,
        deliveryFee,
        total,
        paymentMethod: payload.paymentMethod ?? PaymentMethod.CASH_ON_DELIVERY,
        items: {
          create: cartItems.map((item) => ({
            mealId: item.mealId,
            quantity: item.quantity,
            price: Number(item.meal.price)
          }))
        },
        deliveryAddress: {
          create: {
            fullName,
            phoneNumber,
            city,
            area,
            streetAddress,
            deliveryInstructions: deliveryInstructions ?? null
          }
        }
      },
      include: {
        items: {
          include: {
            meal: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true
              }
            }
          }
        },
        deliveryAddress: true
      }
    });
    await tx.cart.deleteMany({
      where: { userEmail }
    });
    return createdOrder;
  });
  return order;
};
var getMyOrders = async (userEmail, query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, orderStatus, status, paymentStatus, paymentMethod } = query;
  const allowedSortFields = [
    "id",
    "userEmail",
    "subtotal",
    "deliveryFee",
    "total",
    "paymentMethod",
    "paymentStatus",
    "orderStatus",
    "createdAt",
    "updatedAt"
  ];
  const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
  const safeSortBy = allowedSortFields.includes(
    requestedSortField
  ) ? requestedSortField : "createdAt";
  let inputFilter = [
    {
      userEmail
    }
  ];
  if (searchTerm) {
    inputFilter = searching(
      inputFilter,
      ["id", "deliveryAddress.fullName", "deliveryAddress.phoneNumber", "deliveryAddress.city", "deliveryAddress.area"],
      String(searchTerm)
    );
  }
  const filterData = {};
  if (orderStatus || status) filterData.orderStatus = orderStatus ?? status;
  if (paymentStatus) filterData.paymentStatus = paymentStatus;
  if (paymentMethod) filterData.paymentMethod = paymentMethod;
  if (Object.keys(filterData).length > 0) {
    inputFilter = filtering(inputFilter, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(
    Number(skip),
    Number(take),
    safeSortBy,
    sortOrder === "asc" ? "asc" : "desc"
  );
  const whereCondition = inputFilter.length > 0 ? { AND: inputFilter } : {};
  const orders = await prisma.order.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    include: {
      items: {
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              providerEmail: true
            }
          }
        }
      },
      deliveryAddress: true
    },
    orderBy: {
      [sortByField]: sortOrderValue
    }
  });
  const total = await prisma.order.count({
    where: whereCondition
  });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: orders
  };
};
var getProvidersOrders = async (providerEmail, query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, orderStatus, status, paymentStatus, paymentMethod } = query;
  const allowedSortFields = [
    "id",
    "userEmail",
    "subtotal",
    "deliveryFee",
    "total",
    "paymentMethod",
    "paymentStatus",
    "orderStatus",
    "createdAt",
    "updatedAt"
  ];
  const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
  const safeSortBy = allowedSortFields.includes(
    requestedSortField
  ) ? requestedSortField : "createdAt";
  let inputFilter = [
    {
      items: {
        some: {
          meal: {
            providerEmail
          }
        }
      }
    }
  ];
  if (searchTerm) {
    inputFilter = searching(
      inputFilter,
      ["id", "deliveryAddress.fullName", "deliveryAddress.phoneNumber", "deliveryAddress.city", "deliveryAddress.area", "userEmail"],
      String(searchTerm)
    );
  }
  const filterData = {};
  if (orderStatus || status) filterData.orderStatus = orderStatus ?? status;
  if (paymentStatus) filterData.paymentStatus = paymentStatus;
  if (paymentMethod) filterData.paymentMethod = paymentMethod;
  if (Object.keys(filterData).length > 0) {
    inputFilter = filtering(inputFilter, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(
    Number(skip),
    Number(take),
    safeSortBy,
    sortOrder === "asc" ? "asc" : "desc"
  );
  const whereCondition = inputFilter.length > 0 ? { AND: inputFilter } : {};
  const orders = await prisma.order.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    include: {
      items: {
        where: {
          meal: {
            providerEmail
          }
        },
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              providerEmail: true
            }
          }
        }
      },
      deliveryAddress: true
    },
    orderBy: {
      [sortByField]: sortOrderValue
    }
  });
  const total = await prisma.order.count({
    where: whereCondition
  });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: orders
  };
};
var getAdminOrders = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, orderStatus, status, paymentStatus, paymentMethod, userEmail, providerEmail } = query;
  const allowedSortFields = [
    "id",
    "userEmail",
    "subtotal",
    "deliveryFee",
    "total",
    "paymentMethod",
    "paymentStatus",
    "orderStatus",
    "createdAt",
    "updatedAt"
  ];
  const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
  const safeSortBy = allowedSortFields.includes(
    requestedSortField
  ) ? requestedSortField : "createdAt";
  let inputFilter = [];
  if (searchTerm) {
    inputFilter = searching(
      inputFilter,
      ["id", "userEmail", "deliveryAddress.fullName", "deliveryAddress.phoneNumber", "deliveryAddress.city", "deliveryAddress.area"],
      String(searchTerm)
    );
  }
  const filterData = {};
  if (orderStatus || status) filterData.orderStatus = orderStatus ?? status;
  if (paymentStatus) filterData.paymentStatus = paymentStatus;
  if (paymentMethod) filterData.paymentMethod = paymentMethod;
  if (userEmail) filterData.userEmail = userEmail;
  if (providerEmail) {
    filterData["items.some.meal.providerEmail"] = providerEmail;
  }
  if (Object.keys(filterData).length > 0) {
    inputFilter = filtering(inputFilter, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(
    Number(skip),
    Number(take),
    safeSortBy,
    sortOrder === "asc" ? "asc" : "desc"
  );
  const whereCondition = inputFilter.length > 0 ? { AND: inputFilter } : {};
  const orders = await prisma.order.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    include: {
      user: {
        select: {
          email: true,
          role: true,
          customer: {
            select: {
              fullName: true
            }
          }
        }
      },
      items: {
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              providerEmail: true
            }
          }
        }
      },
      deliveryAddress: true
    },
    orderBy: {
      [sortByField]: sortOrderValue
    }
  });
  const total = await prisma.order.count({
    where: whereCondition
  });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: orders
  };
};
var getOrderById = async (orderId, userEmail, role) => {
  const commonInclude = {
    items: {
      include: {
        meal: {
          select: {
            id: true,
            name: true,
            image: true,
            price: true,
            providerEmail: true
          }
        }
      }
    },
    deliveryAddress: true
  };
  if (role === Role.ADMIN) {
    const order2 = await prisma.order.findUnique({
      where: { id: orderId },
      include: commonInclude
    });
    if (!order2) {
      throw new appError_default(404, "Order not found");
    }
    return order2;
  }
  if (role === Role.CUSTOMER) {
    const order2 = await prisma.order.findFirst({
      where: {
        id: orderId,
        userEmail
      },
      include: commonInclude
    });
    if (!order2) {
      throw new appError_default(404, "Order not found");
    }
    return order2;
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      items: {
        some: {
          meal: {
            providerEmail: userEmail
          }
        }
      }
    },
    include: {
      items: {
        where: {
          meal: {
            providerEmail: userEmail
          }
        },
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              providerEmail: true
            }
          }
        }
      },
      deliveryAddress: true
    }
  });
  if (!order) {
    throw new appError_default(404, "Order not found");
  }
  return order;
};
var providerAllowedStatuses = [
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
];
var orderStatusTransitions = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: []
};
var updateProviderOrderStatus = async (orderId, payload, userEmail, role) => {
  const requestedStatus = payload.orderStatus;
  if (!providerAllowedStatuses.includes(requestedStatus)) {
    throw new appError_default(400, "Invalid order status for provider update");
  }
  const order = role === Role.ADMIN ? await prisma.order.findUnique({
    where: { id: orderId }
  }) : await prisma.order.findFirst({
    where: {
      id: orderId,
      items: {
        some: {
          meal: {
            providerEmail: userEmail
          }
        }
      }
    }
  });
  if (!order) {
    throw new appError_default(404, "Order not found");
  }
  const currentStatus = order.orderStatus;
  const allowedNextStatuses = orderStatusTransitions[currentStatus] ?? [];
  if (!allowedNextStatuses.includes(requestedStatus)) {
    throw new appError_default(400, `Order status cannot be updated from ${currentStatus} to ${requestedStatus}`);
  }
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      orderStatus: requestedStatus
    },
    include: {
      items: {
        include: {
          meal: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              providerEmail: true
            }
          }
        }
      },
      deliveryAddress: true
    }
  });
  return updatedOrder;
};
var OrderService = {
  createOrder,
  getMyOrders,
  getProvidersOrders,
  getAdminOrders,
  getOrderById,
  updateProviderOrderStatus
};

// src/modules/order/order.controller.ts
var createOrder2 = catchAsync(async (req, res) => {
  const result = await OrderService.createOrder(req.body, req.user.email);
  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: result
  });
});
var getMyOrders2 = catchAsync(async (req, res) => {
  const result = await OrderService.getMyOrders(req.user.email, req.query);
  res.status(200).json({
    success: true,
    message: "My orders retrieved successfully",
    data: result
  });
});
var getProvidersOrders2 = catchAsync(async (req, res) => {
  const result = await OrderService.getProvidersOrders(req.user.email, req.query);
  res.status(200).json({
    success: true,
    message: "Provider orders retrieved successfully",
    data: result
  });
});
var getAdminOrders2 = catchAsync(async (req, res) => {
  const result = await OrderService.getAdminOrders(req.query);
  res.status(200).json({
    success: true,
    message: "Admin orders retrieved successfully",
    data: result
  });
});
var getOrderById2 = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const result = await OrderService.getOrderById(orderId, req.user.email, req.user.role);
  res.status(200).json({
    success: true,
    message: "Order retrieved successfully",
    data: result
  });
});
var getAdminOrderById = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const result = await OrderService.getOrderById(orderId, req.user.email, Role.ADMIN);
  res.status(200).json({
    success: true,
    message: "Admin order retrieved successfully",
    data: result
  });
});
var updateProviderOrderStatus2 = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const result = await OrderService.updateProviderOrderStatus(
    orderId,
    req.body,
    req.user.email,
    req.user.role
  );
  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: result
  });
});
var OrderController = {
  createOrder: createOrder2,
  getMyOrders: getMyOrders2,
  getProvidersOrders: getProvidersOrders2,
  getAdminOrders: getAdminOrders2,
  getAdminOrderById,
  getOrderById: getOrderById2,
  updateProviderOrderStatus: updateProviderOrderStatus2
};

// src/modules/order/order.route.ts
var router6 = express6.Router();
router6.post("/", auth_default(Role.CUSTOMER, Role.ADMIN), OrderController.createOrder);
router6.get("/my", auth_default(Role.CUSTOMER, Role.ADMIN), OrderController.getMyOrders);
router6.get("/provider", auth_default(Role.PROVIDER, Role.CUSTOMER, Role.ADMIN), OrderController.getProvidersOrders);
router6.get("/admin", auth_default(Role.ADMIN, Role.CUSTOMER), OrderController.getAdminOrders);
router6.get("/admin/:id", auth_default(Role.ADMIN, Role.CUSTOMER), OrderController.getAdminOrderById);
router6.get("/:id", auth_default(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), OrderController.getOrderById);
router6.patch("/:id/status", auth_default(Role.PROVIDER, Role.CUSTOMER, Role.ADMIN), OrderController.updateProviderOrderStatus);
var OrderRoutes = router6;

// src/modules/user/user.route.ts
import express7 from "express";

// src/modules/user/user.service.ts
import bcrypt2 from "bcrypt";
import jwt3 from "jsonwebtoken";
var createCustomer = async (data) => {
  const role = data.role ?? Role.CUSTOMER;
  if (role === Role.ADMIN) {
    throw new appError_default(403, "Admin account cannot be created from public registration");
  }
  const hashedPassword = await bcrypt2.hash(
    data.password,
    Number(config.saltRounds)
  );
  data.password = hashedPassword;
  const useData = {
    email: data.email,
    password: data.password,
    role
  };
  const customerData = {
    email: data.email,
    fullName: data.fullName,
    phone: data.phoneNumber ?? null
  };
  await prisma.user.create({ data: useData });
  const customer = role === Role.CUSTOMER ? await prisma.customer.create({
    data: customerData
  }) : null;
  const token = jwt3.sign(
    { email: customerData.email, role: useData.role },
    String(config.jwt.secret),
    { expiresIn: config.jwt.expiresIn }
  );
  return {
    ...customer ?? { email: data.email, fullName: data.fullName },
    role: useData.role,
    token
  };
};
var getAdminUsers = async (query) => {
  const { searchTerm, role, status, skip, take, sortBy, sortOrder } = query;
  const allowedSortFields = [
    "id",
    "email",
    "role",
    "status",
    "createdAt",
    "updatedAt"
  ];
  const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
  const safeSortBy = allowedSortFields.includes(
    requestedSortField
  ) ? requestedSortField : "createdAt";
  let inputFilter = [];
  const filterData = {};
  if (role) filterData.role = role;
  if (status) filterData.status = status;
  if (Object.keys(filterData).length > 0) {
    inputFilter = filtering(inputFilter, filterData);
  }
  if (typeof searchTerm === "string" && searchTerm.trim().length > 0) {
    inputFilter.push({
      OR: [
        { email: { contains: searchTerm, mode: "insensitive" } },
        { customer: { fullName: { contains: searchTerm, mode: "insensitive" } } },
        { customer: { phone: { contains: searchTerm, mode: "insensitive" } } }
      ]
    });
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(
    Number(skip),
    Number(take),
    safeSortBy,
    sortOrder === "asc" ? "asc" : "desc"
  );
  const whereCondition = inputFilter.length > 0 ? { AND: inputFilter } : {};
  const users = await prisma.user.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      customer: {
        select: {
          fullName: true,
          phone: true,
          city: true,
          profileImage: true,
          status: true
        }
      },
      _count: {
        select: {
          orders: true,
          meals: true,
          carts: true
        }
      }
    },
    orderBy: {
      [sortByField]: sortOrderValue
    }
  });
  const formattedUsers = users.map((user) => ({
    ...user,
    fullName: user.customer?.fullName ?? null
  }));
  const total = await prisma.user.count({
    where: whereCondition
  });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: formattedUsers
  };
};
var getAdminUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      customer: true,
      _count: {
        select: {
          orders: true,
          meals: true,
          carts: true
        }
      }
    }
  });
  if (!user) {
    throw new appError_default(404, "User not found");
  }
  return {
    ...user,
    fullName: user.customer?.fullName ?? null
  };
};
var createUserByAdmin = async (payload) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email
    },
    select: { id: true }
  });
  if (existingUser) {
    throw new appError_default(409, "User already exists with this email");
  }
  const hashedPassword = await bcrypt2.hash(payload.password, Number(config.saltRounds));
  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: payload.role
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    });
    if (payload.role === Role.CUSTOMER) {
      await tx.customer.create({
        data: {
          email: payload.email,
          fullName: payload.fullName?.trim() || "Customer",
          phone: payload.phone ?? null
        }
      });
    }
    return createdUser;
  });
  return user;
};
var updateUserByAdmin = async (userId, payload, adminEmail) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new appError_default(404, "User not found");
  }
  if (user.email === adminEmail && payload.role && payload.role !== Role.ADMIN) {
    throw new appError_default(400, "Admin cannot change own role");
  }
  const updateData = {};
  if (payload.role) {
    updateData.role = payload.role;
  }
  if (payload.status) {
    updateData.status = payload.status;
  }
  if (!Object.keys(updateData).length) {
    throw new appError_default(400, "Nothing to update");
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      customer: {
        select: {
          fullName: true,
          phone: true
        }
      }
    }
  });
  return {
    ...updatedUser,
    fullName: updatedUser.customer?.fullName ?? null
  };
};
var blockUserByAdmin = async (userId, adminEmail) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true
    }
  });
  if (!user) {
    throw new appError_default(404, "User not found");
  }
  if (user.email === adminEmail) {
    throw new appError_default(400, "Admin cannot block own account");
  }
  if (user.status === UserStatus.SUSPENDED) {
    throw new appError_default(400, "User is already blocked");
  }
  const blockedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      status: UserStatus.SUSPENDED
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      customer: {
        select: {
          fullName: true
        }
      }
    }
  });
  return {
    ...blockedUser,
    fullName: blockedUser.customer?.fullName ?? null
  };
};
var UserService = {
  createCustomer,
  getAdminUsers,
  getAdminUserById,
  createUserByAdmin,
  updateUserByAdmin,
  blockUserByAdmin
};

// src/modules/user/user.controller.ts
var createCustomer2 = catchAsync(async (req, res) => {
  const result = await UserService.createCustomer(req.body);
  const { token, ...userData } = result;
  res.cookie("token", token, cookieOptions);
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      token,
      userData
    }
  });
});
var getAdminUsers2 = catchAsync(async (req, res) => {
  const result = await UserService.getAdminUsers(req.query);
  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: result
  });
});
var getAdminUserById2 = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await UserService.getAdminUserById(userId);
  res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: result
  });
});
var createUserByAdmin2 = catchAsync(async (req, res) => {
  const result = await UserService.createUserByAdmin(req.body);
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: result
  });
});
var updateUserByAdmin2 = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await UserService.updateUserByAdmin(userId, req.body, req.user.email);
  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: result
  });
});
var blockUserByAdmin2 = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await UserService.blockUserByAdmin(userId, req.user.email);
  res.status(200).json({
    success: true,
    message: "User blocked successfully",
    data: result
  });
});
var UserController = {
  createCustomer: createCustomer2,
  getAdminUsers: getAdminUsers2,
  getAdminUserById: getAdminUserById2,
  createUserByAdmin: createUserByAdmin2,
  updateUserByAdmin: updateUserByAdmin2,
  blockUserByAdmin: blockUserByAdmin2
};

// src/middleware/validateRequest.ts
var validateRequest = (schema) => {
  return catchAsync(async (req, res, next) => {
    await schema.safeParseAsync(req.body);
    next();
  });
};

// src/modules/user/customerValidationSchema.ts
import z from "zod";
var customerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long").max(100, "Full name must be less than 100 characters long").regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  email: z.email("Invalid email address").max(255, "Email must be less than 255 characters long").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email must be a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long").max(255, "Password must be less than 255 characters long").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits long").max(15, "Phone number must be less than 15 digits long").regex(
    /^\+?[1-9]\d{1,14}$/,
    "Phone number must be a valid international phone number"
  ).optional(),
  address: z.string().max(255, "Address must be less than 255 characters long").optional(),
  city: z.string().max(100, "City must be less than 100 characters long").optional(),
  state: z.string().max(100, "State must be less than 100 characters long").optional(),
  zipCode: z.string().max(20, "Zip code must be less than 20 characters long").optional(),
  profileImage: z.url("Profile picture must be a valid URL").optional(),
  role: z.enum(["CUSTOMER", "PROVIDER"]).optional()
});

// src/modules/user/user.route.ts
var router7 = express7.Router();
router7.post("/customers", validateRequest(customerSchema), UserController.createCustomer);
router7.get("/admin/users", auth_default(Role.ADMIN, Role.CUSTOMER), UserController.getAdminUsers);
router7.get("/admin/users/:id", auth_default(Role.ADMIN, Role.CUSTOMER), UserController.getAdminUserById);
router7.post("/admin/users", auth_default(Role.ADMIN, Role.CUSTOMER), UserController.createUserByAdmin);
router7.patch("/admin/users/:id", auth_default(Role.ADMIN, Role.CUSTOMER), UserController.updateUserByAdmin);
router7.patch("/admin/users/:id/block", auth_default(Role.ADMIN, Role.CUSTOMER), UserController.blockUserByAdmin);
var UserRoutes = router7;

// src/utils/routes/routes.ts
import express9 from "express";

// src/modules/category/category.route.ts
import express8 from "express";

// src/modules/category/category.service.ts
var createCategory = async (payload) => {
  const result = await prisma.category.create({
    data: payload
  });
  return result;
};
var getCategories = async (query) => {
  const { searchTerm, skip, take, sortBy, sortOrder, status, cuisineId } = query;
  const allowedSortFields = [
    "id",
    "name",
    "image",
    "status",
    "createdAt",
    "updatedAt"
  ];
  const requestedSortField = typeof sortBy === "string" ? sortBy.trim() : "";
  const safeSortBy = allowedSortFields.includes(requestedSortField) ? requestedSortField : "createdAt";
  let inputFilter = [];
  if (searchTerm) {
    inputFilter = searching(inputFilter, ["name", "cuisine.name"], String(searchTerm));
  }
  const filterData = {};
  if (status) filterData.status = status;
  if (cuisineId) filterData.cuisineId = cuisineId;
  if (Object.keys(filterData).length > 0) {
    inputFilter = filtering(inputFilter, filterData);
  }
  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(Number(skip), Number(take), safeSortBy, sortOrder === "asc" ? "asc" : "desc");
  const whereCondition = inputFilter.length > 0 ? { AND: inputFilter } : {};
  const result = await prisma.category.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    include: {
      _count: {
        select: {
          meals: true
        }
      }
    },
    orderBy: {
      [sortByField]: sortOrderValue
    }
  });
  const mappedResult = result.map((category) => ({
    ...category,
    mealsCount: category._count.meals,
    meals: category._count.meals
  }));
  const total = await prisma.category.count({
    where: whereCondition
  });
  const totalPages = Math.ceil(total / takeValue);
  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages
    },
    data: mappedResult
  };
};
var getAllCategoriesForSlider = async () => {
  const result = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          meals: true
        }
      }
    }
  });
  return result.map((category) => ({
    ...category,
    mealsCount: category._count.meals,
    meals: category._count.meals
  }));
};
var CategoryService = {
  createCategory,
  getCategories,
  getAllCategoriesForSlider
};

// src/modules/category/category.controller.ts
var createCategory2 = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(req.body);
  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: result
  });
});
var getCategories2 = catchAsync(async (req, res) => {
  const result = await CategoryService.getCategories(req.query);
  res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    data: result
  });
});
var getAllCategoriesForSlider2 = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategoriesForSlider();
  res.status(200).json({
    success: true,
    message: "Categories for slider retrieved successfully",
    data: result
  });
});
var CategoryController = {
  createCategory: createCategory2,
  getCategories: getCategories2,
  getAllCategoriesForSlider: getAllCategoriesForSlider2
};

// src/modules/category/category.route.ts
var router8 = express8.Router();
router8.post("/", CategoryController.createCategory);
router8.get("/", CategoryController.getCategories);
router8.get("/slider", CategoryController.getAllCategoriesForSlider);
var CategoryRoutes = router8;

// src/utils/routes/routes.ts
var router9 = express9.Router();
var routes = [
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/dashboard",
    route: DashboardRoutes
  },
  {
    path: "/cuisine",
    route: CuisineRoutes
  },
  {
    path: "/category",
    route: CategoryRoutes
  },
  {
    path: "/meal",
    route: MealRoutes
  },
  {
    path: "/cart",
    route: CartRoutes
  },
  {
    path: "/order",
    route: OrderRoutes
  }
];
routes.forEach((route) => router9.use(route.path, route.route));
var routes_default = router9;

// src/app.ts
import cookieParser from "cookie-parser";

// src/errors/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: "An error occurred while processing your request",
    errorMessage: err.message || "Internal Server Error",
    error: err
  });
};

// src/app.ts
var app = express10();
app.use(express10.json());
app.use(express10.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://cravedash.vercel.app", "https://crave-dash-client.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(cookieParser());
app.use("/api/v1", routes_default);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to CraveDash API",
    developedBy: "Arfan Ahmed"
  });
});
app.use(globalErrorHandler);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});
var app_default = app;

export {
  config,
  app_default
};
