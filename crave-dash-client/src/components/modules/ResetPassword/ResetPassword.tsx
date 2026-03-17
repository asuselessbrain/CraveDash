"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { resetPasswordValidationSchema } from "./ResetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ShieldCheck, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/services/auth";

export default function ResetPassword({
    token,
    className,
    ...props
}: React.ComponentProps<"div"> & { token: string }) {
    const form = useForm({
        resolver: zodResolver(resetPasswordValidationSchema),
    });

    const { formState: { isSubmitting } } = form;
    const router = useRouter();

    const handleResetPassword = async (data: FieldValues) => {
        
        const resetPasswordData = {
            token,
            newPassword: data.password
        }

        const res = await resetPassword(resetPasswordData)

        if (res.success) {
            toast.success(res.message || "Password reset successfully!")
            router.push("/sign-in");
        }
        else {
            toast.error(res.errorMessage || "Failed to reset password. Please try again.")
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {/* Logo */}
            <div className="flex justify-center mb-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                        <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-bold text-foreground">FoodHub</span>
                </Link>
            </div>

            <Card className="border-0 shadow-lg">
                <CardHeader className="text-center">
                    <div className="mb-3 flex justify-center">
                        <div className="rounded-lg bg-primary/10 p-3 text-primary">
                            <LockKeyhole className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                    <CardDescription>
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-4">
                        {/* Row 1: Password and Confirm Password */}
                        <div className="grid grid-cols-1 gap-4">
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="password">New Password</FieldLabel>
                                        <Input
                                            {...field}
                                            id="password"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            type="password"
                                            placeholder="••••••••"
                                            value={field.value || ""}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                                        <Input
                                            {...field}
                                            id="confirmPassword"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            type="password"
                                            placeholder="••••••••"
                                            value={field.value || ""}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Resetting Password..." : "Reset Password"}
                        </Button>

                        <FieldDescription className="text-center">
                            Remember your password? <Link href="/sign-in" className="text-primary hover:underline">Sign In</Link>
                        </FieldDescription>
                    </form>
                </CardContent>
            </Card>

            <p className="mt-8 text-center text-xs text-muted-foreground">
                By resetting your password, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
            </p>
        </div>
    );
}
