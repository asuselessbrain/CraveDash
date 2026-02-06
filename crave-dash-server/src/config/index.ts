import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), ".env")})

export const config ={
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    saltRounds: process.env.SALT_ROUNDS,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    }
}