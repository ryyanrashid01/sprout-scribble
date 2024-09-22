"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Session } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SettingsSchema } from "@/types/settings-schema";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { userSettings } from "@/server/actions/user-settings";
import { Check, LoaderCircle } from "lucide-react";
import { UploadButton } from "@/lib/upload";
import { cn } from "@/lib/utils";
import Link from "next/link";

type SettingsForm = {
  session: Session;
};

export default function SettingsCard(session: SettingsForm) {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUploaded, setAvatarUploaded] = useState(false);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      oldPassword: undefined,
      newPassword: undefined,
      name: session.session.user?.name || undefined,
      email: session.session.user?.email || undefined,
      image: session.session.user.image || undefined,
      isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || undefined,
    },
  });

  const { execute, status } = useAction(userSettings, {
    onSuccess: (data) => {
      if (data.data?.success) {
        setSuccess(data.data.success);
        setAvatarUploaded(false);
      }
      if (data.data?.error) setError(data.data.error);
    },
    onError: (error) => {
      setError("Something went wrong");
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    execute(values);
  };

  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Update your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormError message={error} />
              <FormSuccess message={success} />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        disabled={status === "executing"}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile picture</FormLabel>
                    <div className="flex items-center gap-3">
                      {!form.getValues("image") && (
                        <div className="font-bold bg-primary/25 h-11 w-11 rounded-full flex justify-center items-center">
                          {session.session.user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {form.getValues("image") && (
                        <div className="w-12 h-12 rounded-full overflow-hidden relative">
                          <Image
                            src={form.getValues("image")!}
                            fill={true}
                            sizes="48px"
                            className="object-cover"
                            alt="User Image"
                          />
                        </div>
                      )}
                      <UploadButton
                        className={cn(
                          "scale-75 ",
                          avatarUploading
                            ? "ut-button:bg-primary/30 ut-button:ring-primary/75 cursor-not-allowed"
                            : "ut-button:bg-primary/75 ut-button:ring-primary",
                          "hover:ut-button:bg-primary/100 ut-button:transition-all ut-button:duration-200 ut-label:hidden ut-allowed-content:hidden dark:ut-button:ring-offset-background"
                        )}
                        endpoint="avatarUploader"
                        onUploadBegin={() => setAvatarUploading(true)}
                        onUploadError={(error) => {
                          form.setError("image", {
                            type: "validate",
                            message: error.message,
                          });
                          setAvatarUploading(false);
                          return;
                        }}
                        onClientUploadComplete={(res) => {
                          form.setValue("image", res[0].url!);
                          setAvatarUploading(false);
                          setAvatarUploaded(true);
                        }}
                        content={{
                          button({ ready, isUploading }) {
                            if (!ready)
                              return <LoaderCircle className="animate-spin" />;
                            if (isUploading)
                              return <LoaderCircle className="animate-spin" />;
                            return <div>Change picture</div>;
                          },
                        }}
                      />
                      {avatarUploaded && (
                        <div className="scale-75">
                          <Check />
                        </div>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        placeholder="User Image"
                        type="hidden"
                        disabled={status === "executing"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {session.session.user.isOAuthOnly && (
                <FormError message="Password can't be set for this account because it was created using Google or GitHub." />
              )}
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-5">
                      <p className="font-bold text-lg">
                        Change account password
                      </p>
                      <FormLabel>Old Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        disabled={
                          status === "executing" ||
                          session?.session.user.isOAuthOnly
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter you old password
                      <Link
                        href={"/auth/reset"}
                        className="flex items-center justify-center text-xs text-primary hover:underline underline-offset-4"
                      >
                        Forgot your password?
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        disabled={
                          status === "executing" ||
                          session?.session.user.isOAuthOnly
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter you new password</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable two factor authentication for your account
                    </FormDescription>
                    <FormControl>
                      <Switch
                        disabled={
                          status === "executing" ||
                          session.session.user.isOAuthOnly === true
                        }
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={status === "executing" || avatarUploading}
                  className="w-1/5 min-w-fit"
                >
                  {status === "executing" ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Update account settings"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
