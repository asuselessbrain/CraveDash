"use client"
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { signOutUser } from "@/services/auth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Logout() {
    const user = useUser();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOutUser();
            user.setUser(null);

            toast.success("Successfully signed out.");

            router.push("/sign-in");
        } catch {
            toast.error("Failed to sign out.");
        }
    };
    return (
        <Button
            onClick={handleSignOut}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all duration-200 hover:bg-red-600 hover:shadow-red-600/30 active:scale-[0.98] dark:bg-red-600 dark:hover:bg-red-700"
        >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Logout</span>
        </Button>
    )
}
