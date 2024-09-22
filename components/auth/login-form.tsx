"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthCard } from "./auth-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/types/login-schema";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { emailSignIn } from "@/server/actions/email-signin";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoaderCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const LoginForm = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const { execute, status } = useAction(emailSignIn, {
    onSuccess(data) {
      if (data.data?.error) setError(data.data.error);
      if (data.data?.success) {
        setSuccess(data.data.success);
      }
      if (data.data?.twoFactor) {
        setShowTwoFactor(true);
        setSuccess(data.data.twoFactor);
      }
    },
    onError(data) {
      setError("Something went wrong");
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    execute(values);
  };

  return (
    <div className="max-w-xl mx-auto">
      <AuthCard
        cardTitle={showTwoFactor ? "Two-Factor Code" : "Welcome back!"}
        backButtonHref="/auth/register"
        backButtonLabel="Create a new account!"
        showSocials={!showTwoFactor}
      >
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex justify-center flex-col">
                {showTwoFactor && (
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="max-w-fit mx-auto">
                        <FormLabel>Enter your 2FA Code</FormLabel>
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            disabled={status === "executing"}
                            className=""
                            onInput={(e) => {
                              const otpValue = e.currentTarget.value;

                              if (otpValue.length === 6) {
                                setTimeout(() => {
                                  form.handleSubmit(onSubmit)();
                                }, 100);
                              }
                            }}
                            {...field}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {!showTwoFactor && (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="yourname@company.com"
                              type="email"
                              disabled={status === "executing"}
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="********"
                              type="password"
                              disabled={status === "executing"}
                              autoComplete="current-password"
                            />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <FormSuccess message={success} />
                <FormError message={error} />
                {!showTwoFactor && (
                  <Button
                    size={"sm"}
                    variant={"link"}
                    className="min-w-fit mx-auto"
                    asChild
                  >
                    <Link href="/auth/reset">Forgot your password?</Link>
                  </Button>
                )}
              </div>
              <Button
                type="submit"
                className={cn(
                  "w-full my-2",
                  status === "executing"
                    ? "animate-pulse cursor-not-allowed"
                    : ""
                )}
              >
                {status === "executing" ? (
                  <LoaderCircle className="animate-spin" />
                ) : showTwoFactor ? (
                  "Verify"
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </div>
        {!showTwoFactor && <Separator />}
      </AuthCard>
    </div>
  );
};
