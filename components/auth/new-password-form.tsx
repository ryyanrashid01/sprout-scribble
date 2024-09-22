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
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { newPassword } from "@/server/actions/new-password";
import { useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { execute, status } = useAction(newPassword, {
    onSuccess(data) {
      if (data.data?.error) setError(data.data.error);
      if (data.data?.success) setSuccess(data.data.success);
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    execute({
      password: values.password,
      confirmPassword: values.confirmPassword,
      token: token,
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      <AuthCard
        cardTitle="Reset Password"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
      >
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {!success && (
                <>
                  <div className="flex justify-center flex-col">
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
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
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
                      "Set password"
                    )}
                  </Button>
                </>
              )}
              <FormSuccess message={success} />
              <FormError message={error} />
            </form>
          </Form>
        </div>
      </AuthCard>
    </div>
  );
};
