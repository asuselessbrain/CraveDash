"use client";

import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/services/auth";
import { toast } from "sonner";

type ForgetPasswordFormValues = {
    email: string;
};

export default function ForgotPassword() {
    const form = useForm<ForgetPasswordFormValues>({
        defaultValues: {
            email: "",
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = form;

    const handleForgotPassword = async (data: FieldValues) => {
        const res = await forgotPassword(data)

        if (res.success) {
            toast.success(res.message || "Reset link sent! Please check your email.")
        }
        else{
            toast.error(res.errorMessage || "Failed to send reset link. Please try again.")
        }
    };

    return (
        <DialogContent className="sm:max-w-sm">
            <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
                <DialogHeader>
                    <DialogTitle>Forgot your password?</DialogTitle>
                    <DialogDescription>
                        Enter your account email and we will send a reset link.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="reset-email">Email</FieldLabel>
                        <Input
                            id="reset-email"
                            type="email"
                            placeholder="m@example.com"
                            aria-invalid={!!errors.email}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Please enter a valid email",
                                },
                            })}
                        />
                        {errors.email && <FieldError errors={[errors.email]} />}
                    </Field>
                </FieldGroup>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send reset link"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
