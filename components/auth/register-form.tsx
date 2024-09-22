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
import { RegisterSchema } from "@/types/register-schema";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { emailRegister } from "@/server/actions/email-register";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { LoaderCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useAction(emailRegister, {
    onSuccess(data) {
      if (data.data?.error) setError(data.data.error);
      if (data.data?.success) setSuccess(data.data.success);
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    execute(values);
  };

  return (
    <div className="max-w-xl mx-auto">
      <AuthCard
        cardTitle="Register a new account"
        backButtonHref="/auth/login"
        backButtonLabel="Already have an account?"
        showSocials
      >
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex justify-center flex-col">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="John Doe"
                          disabled={status === "executing"}
                          type="text"
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormSuccess message={success} />
                <FormError message={error} />
                <Button
                  size={"sm"}
                  variant={"link"}
                  className="min-w-fit mx-auto"
                  asChild
                >
                  <Link href="/auth/reset">Forgot your password?</Link>
                </Button>
              </div>
              <Button
                type="submit"
                disabled={status === "executing"}
                className={cn(
                  "w-full my-2",
                  status === "executing"
                    ? "animate-pulse cursor-not-allowed"
                    : ""
                )}
              >
                {status === "executing" ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
        </div>
        <Separator />
      </AuthCard>
    </div>
  );
};
