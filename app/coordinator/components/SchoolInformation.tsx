"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Building2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { SchoolData } from "@/types/school";

const schoolSchema = z.object({
  name: z
    .string()
    .min(2, "School name must be at least 2 characters")
    .max(200, "School name must be less than 200 characters"),
  type: z
    .string()
    .min(1, "Please select a school type")
    .refine((val) => ["primary", "secondary", "tertiary"].includes(val), {
      message: "Please select a valid school type",
    }),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters"),
  address2: z
    .string()
    .max(200, "Address line 2 must be less than 200 characters")
    .optional(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
    .transform((val) => val.replace(/\s/g, "")),
  email: z.string().email("Invalid email address").toLowerCase(),
  websiteUrl: z
    .string()
    .url("Invalid website URL")
    .or(z.literal(""))
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  socialMedia: z.object({
    facebook: z
      .string()
      .url("Invalid Facebook URL")
      .or(z.literal(""))
      .optional(),
    instagram: z
      .string()
      .url("Invalid Instagram URL")
      .or(z.literal(""))
      .optional(),
    twitter: z
      .string()
      .url("Invalid Twitter/X URL")
      .or(z.literal(""))
      .optional(),
  }),
});

type SchoolFormData = z.infer<typeof schoolSchema>;

interface SchoolInformationProps {
  schoolData: SchoolData;
}

export default function SchoolInformation({
  schoolData,
}: SchoolInformationProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: schoolData.name || "",
      type: schoolData.type || "primary",
      address: schoolData.address || "",
      address2: schoolData.address2 || "",
      phoneNumber: schoolData.phoneNumber || "",
      email: schoolData.email || "",
      websiteUrl: schoolData.websiteUrl || "",
      socialMedia: {
        facebook: schoolData.socialMedia?.facebook || "",
        instagram: schoolData.socialMedia?.instagram || "",
        twitter: schoolData.socialMedia?.twitter || "",
      },
    },
    mode: "onChange",
  });

  const {
    formState: { errors, isDirty, isValid },
  } = form;

  const handleSubmit = async (data: SchoolFormData) => {
    startTransition(async () => {
      try {
        // const result = await updateSchoolInfo(data)

        console.log(data);

        // if (result.success) {
        toast({
          title: "Success",
          description:
            "School information update request submitted successfully",
        });
        form.reset(data); // Reset dirty state
        // } else {
        //   throw new Error(result.error || "Failed to submit update request")
        // }
      } catch (error) {
        console.error("Failed to update school information:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to submit update request",
          variant: "destructive",
        });
      }
    });
  };

  const handleReset = () => {
    form.reset({
      name: schoolData.name || "",
      type: schoolData.type || "primary",
      address: schoolData.address || "",
      address2: schoolData.address2 || "",
      phoneNumber: schoolData.phoneNumber || "",
      email: schoolData.email || "",
      websiteUrl: schoolData.websiteUrl || "",
      socialMedia: {
        facebook: schoolData.socialMedia?.facebook || "",
        instagram: schoolData.socialMedia?.instagram || "",
        twitter: schoolData.socialMedia?.twitter || "",
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-500/10 rounded-lg">
          <Building2 className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">School Information</h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage your institution's details and contact information
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <div className="border-t border-slate-700 pt-4">
            <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
              Basic Information
            </p>

            {/* School Name */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="schoolName" className="text-white font-medium">
                School Name *
              </Label>
              <Input
                id="schoolName"
                {...form.register("name")}
                placeholder="Enter school name"
                disabled={isPending}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p
                  className="text-sm text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* School Type */}
            <div className="space-y-2">
              <Label htmlFor="schoolType" className="text-white font-medium">
                School Type *
              </Label>
              <Select
                value={form.watch("type")}
                onValueChange={(value) =>
                  form.setValue("type", value, { shouldValidate: true })
                }
                disabled={isPending}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select school type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectItem value="primary">Primary School</SelectItem>
                  <SelectItem value="secondary">Secondary School</SelectItem>
                  <SelectItem value="tertiary">Tertiary Institution</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p
                  className="text-sm text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <div className="border-t border-slate-700 pt-4">
            <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
              Address
            </p>

            {/* Address Line 1 */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="fullAddress" className="text-white font-medium">
                Address Line 1 *
              </Label>
              <Input
                id="fullAddress"
                {...form.register("address")}
                placeholder="Street address"
                disabled={isPending}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                aria-invalid={errors.address ? "true" : "false"}
              />
              {errors.address && (
                <p
                  className="text-sm text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2">
              <Label htmlFor="fullAddress2" className="text-white font-medium">
                Address Line 2
              </Label>
              <Input
                id="fullAddress2"
                {...form.register("address2")}
                placeholder="Apartment, suite, etc. (optional)"
                disabled={isPending}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                aria-invalid={errors.address2 ? "true" : "false"}
              />
              {errors.address2 && (
                <p
                  className="text-sm text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.address2.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <div className="border-t border-slate-700 pt-4">
            <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
              Contact Information
            </p>

            {/* Phone */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="schoolPhone" className="text-white font-medium">
                Phone Number *
              </Label>
              <Input
                id="schoolPhone"
                {...form.register("phoneNumber")}
                type="tel"
                placeholder="+1 (555) 000-0000"
                disabled={isPending}
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

            {/* Email */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="schoolEmail" className="text-white font-medium">
                School Email *
              </Label>
              <Input
                id="schoolEmail"
                {...form.register("email")}
                type="email"
                placeholder="info@school.com"
                disabled={isPending}
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

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="text-white font-medium">
                Website
              </Label>
              <Input
                id="website"
                {...form.register("websiteUrl")}
                type="url"
                placeholder="https://www.example.com"
                disabled={isPending}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                aria-invalid={errors.websiteUrl ? "true" : "false"}
              />
              {errors.websiteUrl && (
                <p
                  className="text-sm text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.websiteUrl.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="space-y-4">
          <div className="border-t border-slate-700 pt-4">
            <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
              Social Media
            </p>

            {/* Facebook */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="socialMediaFacebook"
                className="text-white font-medium"
              >
                Facebook
              </Label>
              <Input
                id="socialMediaFacebook"
                {...form.register("socialMedia.facebook")}
                type="url"
                placeholder="https://facebook.com/school"
                disabled={isPending}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                aria-invalid={errors.socialMedia?.facebook ? "true" : "false"}
              />
              {errors.socialMedia?.facebook && (
                <p
                  className="text-sm text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.socialMedia.facebook.message}
                </p>
              )}
            </div>

            {/* Instagram */}
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="socialMediaInstagram"
                className="text-white font-medium"
              >
                Instagram
              </Label>
              <Input
                id="socialMediaInstagram"
                {...form.register("socialMedia.instagram")}
                type="url"
                placeholder="https://instagram.com/school"
                disabled={isPending}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                aria-invalid={errors.socialMedia?.instagram ? "true" : "false"}
              />
              {errors.socialMedia?.instagram && (
                <p
                  className="text-sm text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.socialMedia.instagram.message}
                </p>
              )}
            </div>

            {/* Twitter/X */}
            <div className="space-y-2">
              <Label
                htmlFor="socialMediaTwitter"
                className="text-white font-medium"
              >
                X (Twitter)
              </Label>
              <Input
                id="socialMediaTwitter"
                {...form.register("socialMedia.twitter")}
                type="url"
                placeholder="https://x.com/school"
                disabled={isPending}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                aria-invalid={errors.socialMedia?.twitter ? "true" : "false"}
              />
              {errors.socialMedia?.twitter && (
                <p
                  className="text-sm text-red-400 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.socialMedia.twitter.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-slate-700">
          <Button
            type="submit"
            disabled={isPending || !isDirty || !isValid}
            className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Request Edit
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
