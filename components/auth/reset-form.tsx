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
import { ResetSchema } from "@/types/reset-schema";
import { reset } from "@/server/actions/password-reset";
import { LoaderCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const ResetForm = () => {
  const form = useForm({
    resolver: zodResolver(ResetSchema),
    defaultValues: { email: "" },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useAction(reset, {
    onSuccess(data) {
      if (data.data?.error) setError(data.data.error);
      if (data.data?.success) setSuccess(data.data.success);
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    execute(values);
  };

  return (
    <div className="max-w-xl mx-auto">
      <AuthCard
        cardTitle="Forgot Password"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
        showSocials
      >
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex justify-center flex-col">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="johndoe@example.com"
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
                <FormSuccess message={success} />
                <FormError message={error} />
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
                  "Reset password"
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
