import jwt, { JwtPayload, Secret } from "jsonwebtoken";
export const jwtVerifier = ({ token, secretKey }: { token: string, secretKey: Secret }) => {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return decoded;
}