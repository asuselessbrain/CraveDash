// src/app.ts
import express4 from "express";
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
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Customer {\n  id           String         @id @default(uuid())\n  email        String         @unique\n  user         User           @relation(fields: [email], references: [email], onDelete: Cascade)\n  fullName     String\n  phone        String?\n  profileImage String?\n  address      String?\n  city         String?\n  state        String?\n  zipCode      String?\n  status       CustomerStatus @default(ACTIVE)\n  createdAt    DateTime       @default(now())\n  updatedAt    DateTime       @updatedAt\n\n  @@map("customers")\n}\n\nenum CustomerStatus {\n  ACTIVE\n  SUSPENDED\n}\n\nmodel User {\n  id        String     @id @default(uuid())\n  email     String     @unique\n  password  String\n  role      Role       @default(CUSTOMER)\n  status    UserStatus @default(ACTIVE)\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n\n  customer Customer?\n\n  @@map("users")\n}\n\nenum Role {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  SUSPENDED\n  PENDING\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Customer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CustomerToUser"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"profileImage","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"state","kind":"scalar","type":"String"},{"name":"zipCode","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"CustomerStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"customers"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"Customer","relationName":"CustomerToUser"}],"dbName":"users"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
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
var Role = {
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
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

// src/config/index.ts
import dotenv from "dotenv";
import path2 from "path";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var config2 = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  saltRounds: process.env.SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  }
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
    String(config2.jwt.secret),
    { expiresIn: config2.jwt.expiresIn }
  );
  return {
    token,
    user: isUserExist
  };
};
var AuthService = {
  loginUser
};

// src/modules/auth/auth.controller.ts
var cookieOptions = {
  httpOnly: true,
  secure: config2.nodeEnv === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1e3
  // 30 days
};
var login = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { token, ...userData } = result;
  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: userData
  });
});
var AuthController = {
  login
};

// src/modules/auth/auth.route.ts
var router = express.Router();
router.post("/login", AuthController.login);
var AuthRoutes = router;

// src/modules/user/user.route.ts
import express2 from "express";

// src/modules/user/user.service.ts
import bcrypt2 from "bcrypt";
var createCustomer = async (data) => {
  const hashedPassword = await bcrypt2.hash(
    data.password,
    Number(config2.saltRounds)
  );
  data.password = hashedPassword;
  const useData = {
    email: data.email,
    password: data.password,
    role: Role.CUSTOMER
  };
  const customerData = {
    email: data.email,
    fullName: data.fullName,
    phone: data.phoneNumber ?? null
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: useData
    });
    const customer = await transactionClient.customer.create({
      data: customerData
    });
    return customer;
  });
  return result;
};
var UserService = {
  createCustomer
};

// src/modules/user/user.controller.ts
var createCustomer2 = catchAsync(async (req, res) => {
  const result = await UserService.createCustomer(req.body);
  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    data: result
  });
});
var UserController = {
  createCustomer: createCustomer2
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
  profileImage: z.url("Profile picture must be a valid URL").optional()
});

// src/modules/user/user.route.ts
var router2 = express2.Router();
router2.post("/customers", validateRequest(customerSchema), UserController.createCustomer);
var UserRoutes = router2;

// src/utils/routes/routes.ts
import express3 from "express";
var router3 = express3.Router();
var routes = [
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/auth",
    route: AuthRoutes
  }
];
routes.forEach((route) => router3.use(route.path, route.route));
var routes_default = router3;

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
var app = express4();
app.use(express4.json());
app.use(express4.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
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

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
