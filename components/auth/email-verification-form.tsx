"use client";

import { newVerification } from "@/server/actions/tokens";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AuthCard } from "./auth-card";
import { LoaderCircle } from "lucide-react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export const EmailVerificationForm = () => {
  const token = useSearchParams().get("token");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const verificationAttempted = useRef(false);

  const handleVerification = useCallback(() => {
    if (verificationAttempted.current) return;

    verificationAttempted.current = true;

    if (!token) {
      setError("Invalid verification token");
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data.error) {
          setError(data.error);
        }
        if (data.success) {
          setSuccess(data.success);
        }
      })
      .catch((err) => {
        console.error("Error during verification:", err);
        setError("An unexpected error occurred");
        setSuccess("");
      });
  }, []);

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <AuthCard
        backButtonLabel="Back to login"
        cardTitle="Verifying email"
        backButtonHref="/auth/login"
      >
        <div className="flex items-center flex-col w-full justify-center gap-3">
          {!success && !error && (
            <div className="flex flex-col items-center gap-4">
              <LoaderCircle className="animate-spin" size={32} />
              <p className="mb-0">Verifying email</p>
            </div>
          )}
          <FormSuccess message={success} />
          <FormError message={error} />
        </div>
      </AuthCard>
    </div>
  );
};
