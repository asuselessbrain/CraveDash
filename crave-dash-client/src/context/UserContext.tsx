import { getCurrentUser } from "@/services/auth";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

interface IUser {
    email: string;
    role: UserRole;
    exp: number;
    iat: number;
}

interface IUserProviderValue {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    isLoading: boolean;
    setIsLoading?: Dispatch<SetStateAction<boolean>>;
    refreshUser: () => Promise<void>;
}

export const UserContext = createContext<IUserProviderValue | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchUser = async () => {
        setIsLoading(true);
        try {
            const data = await getCurrentUser();
            setUser(data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider
            value={{ user, setUser, isLoading, setIsLoading, refreshUser: fetchUser }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
};