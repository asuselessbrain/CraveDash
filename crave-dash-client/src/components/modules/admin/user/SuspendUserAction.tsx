"use client";
import { Button } from "@/components/ui/button";
import { blockUserByAdmin } from "@/services/user";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SuspendUserAction({ id, status }: { id: string; status: "Active" | "Suspended" }) {
    const router = useRouter();

    const toggleBlockAction = async () => {
        if (status !== "Active") return;

        const res = await blockUserByAdmin(id);

        if (res.success) {
            toast.success(res.message || "User status updated successfully");
        } else {
            toast.error(res.errorMessage || "Failed to update user status");
        }
    }

    if (status !== "Active") {
        return (
            <Button variant="outline" size="sm" className="rounded-xl" disabled>
                <ShieldCheck className="h-4 w-4" /> Suspended
            </Button>
        );
    }

    return (
        <Button onClick={toggleBlockAction} variant="outline" size="sm" className="rounded-xl" type="submit">
            <ShieldCheck className="h-4 w-4" /> Suspend
        </Button>
    )
}
