import { config } from "../config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export const seedAdmin = async () => {
    try {
        const adminEmail = config.seedAdmin.email || ""
        const adminPassword = config.seedAdmin.password || ""

        const hashedPassword = await bcrypt.hash(adminPassword, Number(config.saltRounds));

        if (!adminEmail || !adminPassword) {
            console.warn("Admin email or password not provided. Skipping admin seeding.");
            return;
        }

        const existingAdmin = await prisma.user.findUnique({
            where: {
                email: adminEmail,
            },
        });

        console.log(existingAdmin)

        if (!existingAdmin) {
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    role: "ADMIN",
                },
            })

            await prisma.customer.create({
                data: {
                    fullName: "Admin User",
                    user: {
                        connect: {
                            email: adminEmail,
                        },
                    },
                },
            })

            console.log("admin created successfully")
        }
    }
    catch (error) {
        console.error("Error seeding admin user:", error);
    }
}