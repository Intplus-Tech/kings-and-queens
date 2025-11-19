"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  XCircle,
  Lock,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

async function updatePassword(data: PasswordFormData) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true };
}

export default function UpdatePassword() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const {
    formState: { errors, isDirty, isValid },
    watch,
  } = form;
  const newPassword = watch("newPassword");

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword || "");
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  const handleSubmit = async (data: PasswordFormData) => {
    startTransition(async () => {
      try {
        const result = await updatePassword(data);

        if (result.success) {
          toast({
            title: "Success",
            description: "Password updated successfully",
          });
          form.reset();
        } else {
          throw new Error("Failed to update password");
        }
      } catch (error) {
        console.error("Failed to update password:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to update password",
          variant: "destructive",
        });
      }
    });
  };

  const handleReset = () => {
    form.reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-500/10 rounded-lg">
          <Lock className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Update Password</h2>
          <p className="text-slate-400 text-sm mt-1">
            Secure your account with a strong password
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Current Password */}
        <div>
          <Label
            htmlFor="oldPassword"
            className="text-white font-medium block mb-2"
          >
            Current Password *
          </Label>
          <div className="relative">
            <Input
              id="oldPassword"
              {...form.register("oldPassword")}
              type={showOldPassword ? "text" : "password"}
              placeholder="Enter your current password"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 pr-10"
              disabled={isPending}
              aria-invalid={errors.oldPassword ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              disabled={isPending}
              aria-label="Toggle password visibility"
            >
              {showOldPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.oldPassword && (
            <p
              className="text-sm text-red-400 flex items-center gap-1 mt-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        {/* New Password Section */}
        <div className="space-y-4 pt-4 border-t border-slate-700">
          <Label htmlFor="newPassword" className="text-white font-medium block">
            New Password *
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              {...form.register("newPassword")}
              type={showNewPassword ? "text" : "password"}
              placeholder="Create a strong new password"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 pr-10"
              disabled={isPending}
              aria-invalid={errors.newPassword ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              disabled={isPending}
              aria-label="Toggle password visibility"
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p
              className="text-sm text-red-400 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.newPassword.message}
            </p>
          )}

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="mt-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Password Strength
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      strengthColors[passwordStrength - 1]
                        ? strengthColors[passwordStrength - 1].replace(
                            "bg-",
                            "text-"
                          )
                        : "text-red-500"
                    }`}
                  >
                    {strengthLabels[passwordStrength - 1] || "Very Weak"}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        level <= passwordStrength
                          ? strengthColors[passwordStrength - 1]
                          : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600 space-y-2">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  Requirements
                </p>
                <div className="space-y-1 text-xs">
                  <div
                    className={`flex items-center gap-2 ${
                      newPassword.length >= 8
                        ? "text-emerald-400"
                        : "text-slate-400"
                    }`}
                  >
                    {newPassword.length >= 8 ? (
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                    At least 8 characters
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      /[a-z]/.test(newPassword)
                        ? "text-emerald-400"
                        : "text-slate-400"
                    }`}
                  >
                    {/[a-z]/.test(newPassword) ? (
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                    One lowercase letter (a-z)
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      /[A-Z]/.test(newPassword)
                        ? "text-emerald-400"
                        : "text-slate-400"
                    }`}
                  >
                    {/[A-Z]/.test(newPassword) ? (
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                    One uppercase letter (A-Z)
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      /\d/.test(newPassword)
                        ? "text-emerald-400"
                        : "text-slate-400"
                    }`}
                  >
                    {/\d/.test(newPassword) ? (
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                    One number (0-9)
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      /@\$!%\*?&/.test(newPassword)
                        ? "text-emerald-400"
                        : "text-slate-400"
                    }`}
                  >
                    {/@\$!%\*?&/.test(newPassword) ? (
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                    One special character (@$!%*?&)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Label
            htmlFor="confirmPassword"
            className="text-white font-medium block mb-2"
          >
            Confirm New Password *
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              {...form.register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 pr-10"
              disabled={isPending}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              disabled={isPending}
              aria-label="Toggle password visibility"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              className="text-sm text-red-400 flex items-center gap-1 mt-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-slate-700">
          <Button
            type="submit"
            disabled={isPending || !isDirty || !isValid}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Update Password
              </>
            )}
          </Button>

          {isDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isPending}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Reset
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
