"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { UserData } from "@/types/user";

// Enhanced validation schema with better rules
const coordinatorSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Full name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .refine((email) => email.length <= 254, "Email address is too long"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
    .transform((val) => val.replace(/\s/g, "")), // Remove spaces
  whatsAppNumber: z
    .string()
    .min(10, "WhatsApp number must be at least 10 digits")
    .regex(/^\+?[\d\s-()]+$/, "Invalid WhatsApp number format")
    .transform((val) => val.replace(/\s/g, "")), // Remove spaces
  position: z
    .string()
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position must be less than 100 characters"),
});

type CoordinatorFormData = z.infer<typeof coordinatorSchema>;

interface CoordinatorInformationProps {
  userData: UserData;
  isReadOnly?: boolean;
}

export default function CoordinatorInformation({
  userData,
  isReadOnly = false,
}: CoordinatorInformationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CoordinatorFormData>({
    resolver: zodResolver(coordinatorSchema),
    defaultValues: {
      fullName: userData?.name || "",
      email: userData?.email || "",
      phoneNumber: userData?.coordinatorId?.phoneNumber || "",
      whatsAppNumber: userData?.coordinatorId?.whatsAppNumber || "",
      position: userData?.coordinatorId?.position || "",
    },
    mode: "onChange",
  });

  const {
    formState: { errors, isDirty, isValid },
  } = form;

  const handleSubmit = async (data: CoordinatorFormData) => {
    setIsSubmitting(true);
    try {
      // const result = await updateUser({
      //   fullName: data.fullName,
      //   email: data.email,
      //   coordinatorId: {
      //     phoneNumber: data.phoneNumber,
      //     whatsAppNumber: data.whatsAppNumber,
      //     position: data.position,
      //   },
      // })

      console.log("Submitting coordinator information:", data);

      // if (result.success) {
      toast({
        title: "Success",
        description: "Coordinator information updated successfully",
      });
      // Reset form dirty state after successful submission
      form.reset(data);
      // } else {
      //   throw new Error(result.error || "Failed to update coordinator information")
      // }
    } catch (error) {
      console.error("Failed to update coordinator information:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update coordinator information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset({
      fullName: userData?.name || "",
      email: userData?.email || "",
      phoneNumber: userData?.coordinatorId?.phoneNumber || "",
      whatsAppNumber: userData?.coordinatorId?.whatsAppNumber || "",
      position: userData?.coordinatorId?.position || "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <User className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            Coordinator Information
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Update your personal and contact details
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white font-medium">
            Full Name *
          </Label>
          <Input
            id="fullName"
            {...form.register("fullName")}
            placeholder="Enter your full name"
            disabled={isReadOnly || isSubmitting}
            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            aria-invalid={errors.fullName ? "true" : "false"}
          />
          {errors.fullName && (
            <p
              className="text-sm text-red-400 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white font-medium">
            Email Address *
          </Label>
          <Input
            id="email"
            {...form.register("email")}
            type="email"
            placeholder="Enter your email address"
            disabled={isReadOnly || isSubmitting}
            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p
              className="text-sm text-red-400 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4 pt-4">
          <div className="border-t border-slate-700 pt-4">
            <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
              Contact Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phoneNumber"
                  {...form.register("phoneNumber")}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  disabled={isReadOnly || isSubmitting}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  aria-invalid={errors.phoneNumber ? "true" : "false"}
                />
                {errors.phoneNumber && (
                  <p
                    className="text-sm text-red-400 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="whatsAppNumber"
                  className="text-white font-medium"
                >
                  WhatsApp Number *
                </Label>
                <Input
                  id="whatsAppNumber"
                  {...form.register("whatsAppNumber")}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  disabled={isReadOnly || isSubmitting}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  aria-invalid={errors.whatsAppNumber ? "true" : "false"}
                />
                {errors.whatsAppNumber && (
                  <p
                    className="text-sm text-red-400 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.whatsAppNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Position */}
        <div className="space-y-2 pt-4">
          <Label htmlFor="position" className="text-white font-medium">
            Position/Title *
          </Label>
          <Input
            id="position"
            {...form.register("position")}
            placeholder="e.g., Academic Coordinator"
            disabled={isReadOnly || isSubmitting}
            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            aria-invalid={errors.position ? "true" : "false"}
          />
          {errors.position && (
            <p
              className="text-sm text-red-400 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.position.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {!isReadOnly && (
          <div className="flex gap-4 pt-6 border-t border-slate-700">
            <Button
              type="submit"
              disabled={!isDirty || !isValid || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
            {isDirty && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Reset
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
