import {
  app_default,
  config,
  prisma
} from "./chunk-HLIOPEWS.js";

// src/utils/seedAdmin.ts
import bcrypt from "bcrypt";
var seedAdmin = async () => {
  try {
    const adminEmail = config.seedAdmin.email || "";
    const adminPassword = config.seedAdmin.password || "";
    const hashedPassword = await bcrypt.hash(adminPassword, Number(config.saltRounds));
    if (!adminEmail || !adminPassword) {
      console.warn("Admin email or password not provided. Skipping admin seeding.");
      return;
    }
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: adminEmail
      }
    });
    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: "ADMIN"
        }
      });
      await prisma.customer.create({
        data: {
          fullName: "Admin User",
          user: {
            connect: {
              email: adminEmail
            }
          }
        }
      });
      console.log("admin created successfully");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

// src/server.ts
app_default.listen(config.port, async () => {
  await seedAdmin();
  console.log(`Server is running on port ${config.port}`);
});
