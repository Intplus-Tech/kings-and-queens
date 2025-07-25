'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { ChevronLeft, ChevronRight, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Form data interface
interface CombinedRegistrationForm {
  schoolName: string
  schoolType: string
  fullAddress: string
  phone: string
  schoolEmail: string
  website?: string
  logo?: FileList
  facebook?: string
  instagram?: string
  twitter?: string
  coordinatorName: string
  coordinatorEmail: string
  coordinatorPhone: string
  whatsappNumber: string
  position?: string
  password: string
}

export default function CombinedRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 2

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CombinedRegistrationForm>({
    mode: "onChange",
  })

  const onSubmit = async (data: CombinedRegistrationForm) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Combined registration:", data)
    // Redirect to email verification
    // window.location.href = "/auth/email-verification"
  }

  const nextStep = async () => {
    const step1Fields = ["schoolName", "schoolType", "fullAddress", "phone", "schoolEmail"] as const

    if (currentStep === 1) {
      // Validate required fields for step 1
      const isValid = await trigger(step1Fields)

      // Check if all required fields have values
      const formValues = watch()
      const hasRequiredValues = step1Fields.every(field => {
        const value = formValues[field]
        return value && value.toString().trim() !== ""
      })

      if (isValid && hasRequiredValues && currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      }
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src='/images/bg-image.png'
          alt="Chess pieces background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0" />
      </div>

      <Card className="relative z-10 w-full max-w-6xl mx-auto bg-muted/20 backdrop-blur-sm border shadow-xl">
        <CardHeader className="pb-6">
          {/* Header with logo and title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">♔</div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Welcome to</h1>
                <h2 className="text-2xl font-bold text-primary">Kings & Queens</h2>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex flex-col items-center sm:items-end gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    currentStep >= 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  1
                </div>
                <div className={cn(
                  "w-8 h-0.5 transition-colors",
                  currentStep >= 2 ? "bg-primary" : "bg-muted"
                )} />
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    currentStep >= 2
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  2
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {currentStep === 1 ? "School Information" : "Coordinator's Information"}
              </h3>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: School Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="schoolName">School Name*</Label>
                    <Input
                      id="schoolName"
                      placeholder="Enter the name of the School"
                      {...register("schoolName", {
                        required: "School name is required"
                      })}
                    />
                    {errors.schoolName && (
                      <p className="text-destructive text-sm">{errors.schoolName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="schoolType">School Type*</Label>
                    <Select onValueChange={(value) => setValue("schoolType", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your school type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary School</SelectItem>
                        <SelectItem value="secondary">Secondary School</SelectItem>
                        <SelectItem value="tertiary">Tertiary Institution</SelectItem>
                        <SelectItem value="private">Private School</SelectItem>
                      </SelectContent>
                    </Select>
                    <input
                      type="hidden"
                      {...register("schoolType", {
                        required: "School type is required"
                      })}
                    />
                    {errors.schoolType && (
                      <p className="text-destructive text-sm">{errors.schoolType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="fullAddress">Full Address*</Label>
                    <Input
                      id="fullAddress"
                      placeholder="Enter full address"
                      {...register("fullAddress", {
                        required: "Full address is required"
                      })}
                    />
                    {errors.fullAddress && (
                      <p className="text-destructive text-sm">{errors.fullAddress.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="phone">Phone*</Label>
                    <Input
                      id="phone"
                      placeholder="Enter contact number"
                      {...register("phone", {
                        required: "Phone number is required"
                      })}
                    />
                    {errors.phone && (
                      <p className="text-destructive text-sm">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="www.example.com"
                      {...register("website")}
                    />
                    {errors.website && (
                      <p className="text-destructive text-sm">{errors.website.message}</p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="schoolEmail">School Email*</Label>
                    <Input
                      id="schoolEmail"
                      type="email"
                      placeholder="Enter email address"
                      {...register("schoolEmail", {
                        required: "School email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                    />
                    {errors.schoolEmail && (
                      <p className="text-destructive text-sm">{errors.schoolEmail.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm">Upload logo (JPG, PNG only)</p>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="hidden"
                        {...register("logo")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Social Media</Label>
                    <div className="space-y-3">
                      <Input
                        placeholder="Facebook URL"
                        {...register("facebook")}
                      />
                      <Input
                        placeholder="Instagram URL"
                        {...register("instagram")}
                      />
                      <Input
                        placeholder="Twitter URL"
                        {...register("twitter")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Coordinator Information */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="coordinatorName">Full Name*</Label>
                    <Input
                      id="coordinatorName"
                      placeholder="Enter coordinator's name"
                      {...register("coordinatorName")}
                    />
                    {errors.coordinatorName && (
                      <p className="text-destructive text-sm">{errors.coordinatorName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="coordinatorEmail">Email*</Label>
                    <Input
                      id="coordinatorEmail"
                      type="email"
                      placeholder="Enter email address"
                      {...register("coordinatorEmail")}
                    />
                    {errors.coordinatorEmail && (
                      <p className="text-destructive text-sm">{errors.coordinatorEmail.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="coordinatorPhone">Phone*</Label>
                    <Input
                      id="coordinatorPhone"
                      placeholder="Enter contact number"
                      {...register("coordinatorPhone")}
                    />
                    {errors.coordinatorPhone && (
                      <p className="text-destructive text-sm">{errors.coordinatorPhone.message}</p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="whatsappNumber">WhatsApp Number*</Label>
                    <Input
                      id="whatsappNumber"
                      placeholder="Enter WhatsApp contact"
                      {...register("whatsappNumber")}
                    />
                    {errors.whatsappNumber && (
                      <p className="text-destructive text-sm">{errors.whatsappNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="position">Position</Label>
                    <Select onValueChange={(value) => setValue("position", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Position/Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="principal">Principal</SelectItem>
                        <SelectItem value="coach">Chess Coach</SelectItem>
                        <SelectItem value="coordinator">Sports Coordinator</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.position && (
                      <p className="text-destructive text-sm">{errors.position.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs" htmlFor="password">Password Setup*</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a Password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-destructive text-sm">{errors.password.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep === totalSteps ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? "Creating Account..." : "Complete Registration"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}