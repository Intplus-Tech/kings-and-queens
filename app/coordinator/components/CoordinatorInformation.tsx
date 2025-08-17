"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, User } from "lucide-react"
import { toast } from "@/hooks/use-toast"
// import { updateUser } from "@/lib/actions/user/user.action"
import type { UserData } from "@/types/user"

// Enhanced validation schema with better rules
const coordinatorSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Full name can only contain letters, spaces, hyphens, and apostrophes"),
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
})

type CoordinatorFormData = z.infer<typeof coordinatorSchema>

interface CoordinatorInformationProps {
  userData: UserData
  isReadOnly?: boolean
}

export default function CoordinatorInformation({ userData, isReadOnly = false }: CoordinatorInformationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CoordinatorFormData>({
    resolver: zodResolver(coordinatorSchema),
    defaultValues: {
      fullName: "Joh snow",
      email: userData?.email || "",
      phoneNumber: userData?.coordinatorId?.phoneNumber || "",
      whatsAppNumber: userData?.coordinatorId?.whatsAppNumber || "",
      position: userData?.coordinatorId?.position || "",
    },
    mode: "onChange", // Validate on change for better UX
  })

  const {
    formState: { errors, isDirty, isValid },
  } = form

  const handleSubmit = async (data: CoordinatorFormData) => {
    setIsSubmitting(true)
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

      console.log("Submitting coordinator information:", data)

      // if (result.success) {
      toast({
        title: "Success",
        description: "Coordinator information updated successfully",
      })
      // Reset form dirty state after successful submission
      form.reset(data)
      // } else {
      //   throw new Error(result.error || "Failed to update coordinator information")
      // }
    } catch (error) {
      console.error("Failed to update coordinator information:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update coordinator information",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form reset
  const handleReset = () => {
    form.reset({
      fullName: "John Snow",
      email: userData?.email || "",
      phoneNumber: userData?.coordinatorId?.phoneNumber || "",
      whatsAppNumber: userData?.coordinatorId?.whatsAppNumber || "",
      position: userData?.coordinatorId?.position || "",
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Coordinator Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              {...form.register("fullName")}
              placeholder="Enter your full name"
              disabled={isReadOnly || isSubmitting}
              aria-invalid={errors.fullName ? "true" : "false"}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive" role="alert">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              {...form.register("email")}
              type="email"
              placeholder="Enter your email address"
              disabled={isReadOnly || isSubmitting}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                {...form.register("phoneNumber")}
                type="tel"
                placeholder="Enter your phone number"
                disabled={isReadOnly || isSubmitting}
                aria-invalid={errors.phoneNumber ? "true" : "false"}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsAppNumber">WhatsApp Number *</Label>
              <Input
                id="whatsAppNumber"
                {...form.register("whatsAppNumber")}
                type="tel"
                placeholder="Enter your WhatsApp number"
                disabled={isReadOnly || isSubmitting}
                aria-invalid={errors.whatsAppNumber ? "true" : "false"}
              />
              {errors.whatsAppNumber && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.whatsAppNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position">Position/Title *</Label>
            <Input
              id="position"
              {...form.register("position")}
              placeholder="Enter your position or job title"
              disabled={isReadOnly || isSubmitting}
              aria-invalid={errors.position ? "true" : "false"}
            />
            {errors.position && (
              <p className="text-sm text-destructive" role="alert">
                {errors.position.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {!isReadOnly && (
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting || !isDirty || !isValid} className="w-full md:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
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
                  className="w-full md:w-auto bg-transparent"
                >
                  Reset
                </Button>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
