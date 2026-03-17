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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { signUpValidationSchema } from "./SignUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ChefHat } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpUser } from "@/services/auth";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm({
    resolver: zodResolver(signUpValidationSchema),
  });

  const { formState: { isSubmitting } } = form;

  const router = useRouter()

  const handleSignUp = async (data: FieldValues) => {
      const res = await signUpUser(data)
      if (res.success) {
        router.push("/")
        toast.success(res.message || "Account created successfully!")
      }
      else {
        toast.error(res.errorMessage || "Failed to create account. Please try again.")
      }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>

      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Sign up to get started with FoodHub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
            <FieldGroup>
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                    <Input
                      {...field}
                      id="fullName"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      placeholder="John Doe"
                      value={field.value || ""}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      placeholder="m@example.com"
                      value={field.value || ""}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
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
            </FieldGroup>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
