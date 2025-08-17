"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
// import { updateSchoolInfo } from "@/lib/actions/school/schoolManagement.action"
import type { SchoolData } from "@/types/school"

// Enhanced validation schema
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
  address2: z.string().max(200, "Address line 2 must be less than 200 characters").optional(),
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
    facebook: z.string().url("Invalid Facebook URL").or(z.literal("")).optional(),
    instagram: z.string().url("Invalid Instagram URL").or(z.literal("")).optional(),
    twitter: z.string().url("Invalid Twitter/X URL").or(z.literal("")).optional(),
  }),
})

type SchoolFormData = z.infer<typeof schoolSchema>

interface SchoolInformationProps {
  schoolData: SchoolData
}

export default function SchoolInformation({ schoolData }: SchoolInformationProps) {
  const [isPending, startTransition] = useTransition()

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
  })

  const {
    formState: { errors, isDirty, isValid },
  } = form

  const handleSubmit = async (data: SchoolFormData) => {
    startTransition(async () => {
      try {
        // const result = await updateSchoolInfo(data)

        console.log(data)

        // if (result.success) {
        toast({
          title: "Success",
          description: "School information update request submitted successfully",
        })
        form.reset(data) // Reset dirty state
        // } else {
        //   throw new Error(result.error || "Failed to submit update request")
        // }
      } catch (error) {
        console.error("Failed to update school information:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to submit update request",
          variant: "destructive",
        })
      }
    })
  }

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
    })
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">School Information</h2>
        <div className="space-y-6">
          <div>
            <Label htmlFor="schoolName" className="text-sm text-white mb-2 block">
              School Name *
            </Label>
            <div className="flex justify-center mb-3 items-center gap-3">
              <div className="flex-1">
                <Input
                  id="schoolName"
                  {...form.register("name")}
                  placeholder="Enter school name"
                  className="bg-[#2C2C2E] text-white border-gray-600"
                  disabled={isPending}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <img src="/lock.svg" alt="Locked field" className="w-4 h-4 object-cover" />
            </div>
          </div>

          <div>
            <Label htmlFor="schoolType" className="text-sm text-white mb-2 block">
              School Type *
            </Label>
            <div className="flex justify-center mb-3 items-center gap-3">
              <div className="flex-1">
                <Select
                  value={form.watch("type")}
                  onValueChange={(value) => form.setValue("type", value, { shouldValidate: true })}
                  disabled={isPending}
                >
                  <SelectTrigger className="bg-[#2C2C2E] text-white border-gray-600">
                    <SelectValue placeholder="Select school type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2C2C2E] text-white border-gray-600">
                    <SelectItem value="primary">Primary School</SelectItem>
                    <SelectItem value="secondary">Secondary School</SelectItem>
                    <SelectItem value="tertiary">Tertiary Institution</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.type.message}
                  </p>
                )}
              </div>
              <img src="/lock.svg" alt="Locked field" className="w-4 h-4 object-cover" />
            </div>
          </div>

          <div>
            <Label htmlFor="fullAddress" className="text-sm text-white mb-2 block">
              Full Address *
            </Label>
            <div className="flex justify-center mb-3 items-center gap-3">
              <div className="flex-1">
                <Input
                  id="fullAddress"
                  {...form.register("address")}
                  placeholder="Address Line 1"
                  className="bg-[#2C2C2E] text-white border-gray-600"
                  disabled={isPending}
                  aria-invalid={errors.address ? "true" : "false"}
                />
                {errors.address && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <img src="/lock.svg" alt="Locked field" className="w-4 h-4 object-cover" />
            </div>
            <div className="flex justify-center gap-3 items-center">
              <div className="flex-1">
                <Input
                  id="fullAddress2"
                  {...form.register("address2")}
                  placeholder="Address Line 2 (Optional)"
                  className="bg-[#2C2C2E] text-white border-gray-600"
                  disabled={isPending}
                  aria-invalid={errors.address2 ? "true" : "false"}
                />
                {errors.address2 && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.address2.message}
                  </p>
                )}
              </div>
              <img src="/lock.svg" alt="Locked field" className="w-4 h-4 object-cover" />
            </div>
          </div>

          <div>
            <Label htmlFor="schoolPhone" className="text-sm text-white mb-2 block">
              Phone *
            </Label>
            <div className="flex justify-center mb-3 items-center gap-3">
              <div className="flex-1">
                <Input
                  id="schoolPhone"
                  {...form.register("phoneNumber")}
                  type="tel"
                  placeholder="Enter phone number"
                  className="bg-[#2C2C2E] text-white border-gray-600"
                  disabled={isPending}
                  aria-invalid={errors.phoneNumber ? "true" : "false"}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <img src="/lock.svg" alt="Locked field" className="w-4 h-4 object-cover" />
            </div>
          </div>

          <div>
            <Label htmlFor="schoolEmail" className="text-sm text-white mb-2 block">
              School Email *
            </Label>
            <div className="flex justify-center mb-3 items-center gap-3">
              <div className="flex-1">
                <Input
                  id="schoolEmail"
                  {...form.register("email")}
                  type="email"
                  placeholder="Enter school email"
                  className="bg-[#2C2C2E] text-white border-gray-600"
                  disabled={isPending}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <img src="/lock.svg" alt="Locked field" className="w-4 h-4 object-cover" />
            </div>
          </div>

          <div>
            <Label htmlFor="website" className="text-sm text-white mb-2 block">
              Website
            </Label>
            <div className="flex justify-center mb-3 items-center gap-3">
              <div className="flex-1">
                <Input
                  id="website"
                  {...form.register("websiteUrl")}
                  type="url"
                  placeholder="https://www.example.com"
                  className="bg-[#2C2C2E] text-white border-gray-600"
                  disabled={isPending}
                  aria-invalid={errors.websiteUrl ? "true" : "false"}
                />
                {errors.websiteUrl && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.websiteUrl.message}
                  </p>
                )}
              </div>
              <img src="/lock.svg" alt="Locked field" className="w-4 h-4 object-cover" />
            </div>
          </div>

          <div>
            <Label htmlFor="socialMedia" className="text-sm text-white mb-2 block">
              Social Media
            </Label>
            <div className="flex justify-center mb-3 items-center gap-3">
              <div className="flex-1">
                <Input
                  id="socialMediaFacebook"
                  {...form.register("socialMedia.facebook")}
                  type="url"
                  placeholder="Facebook URL"
                  className="bg-[#2C2C2E] text-white border-gray-600"
                  disabled={isPending}
                  aria-invalid={errors.socialMedia?.facebook ? "true" : "false"}
                />
                {errors.socialMedia?.facebook && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.socialMedia.facebook.message}
                  </p>
                )}
              </div>
              <img src="/lock.svg" alt="Locked field" className="w-4 h-4 object-cover" />
            </div>
            <div className="flex justify-center mb-3 items-center gap-3">
              <div className="flex-1">
                <Input
                  id="socialMediaInstagram"
                  {...form.register("socialMedia.instagram")}
                  type="url"
                  placeholder="Instagram URL"
                  className="bg-[#2C2C2E] text-white border-gray-600"
                  disabled={isPending}
                  aria-invalid={errors.socialMedia?.instagram ? "true" : "false"}
                />
                {errors.socialMedia?.instagram && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.socialMedia.instagram.message}
                  </p>
                )}
              </div>
              <img src="/lock.svg" alt="Locked field" className="w-4 h-4 object-cover" />
            </div>
            <div className="flex justify-center mb-3 items-center gap-3">
              <div className="flex-1">
                <Input
                  id="socialMediaTwitter"
                  {...form.register("socialMedia.twitter")}
                  type="url"
                  placeholder="X (Twitter) URL"
                  className="bg-[#2C2C2E] text-white border-gray-600"
                  disabled={isPending}
                  aria-invalid={errors.socialMedia?.twitter ? "true" : "false"}
                />
                {errors.socialMedia?.twitter && (
                  <p className="text-sm text-destructive mt-1" role="alert">
                    {errors.socialMedia.twitter.message}
                  </p>
                )}
              </div>
              <img src="/lock.svg" alt="Locked field" className="w-4 h-4 object-cover" />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isPending || !isDirty || !isValid}
              className="bg-yellow-400 text-black md:relative md:right-[270px] hover:bg-yellow-500 w-[250px] mt-8"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Request Edit"
              )}
            </Button>

            {isDirty && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isPending}
                className="mt-8 bg-transparent"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
