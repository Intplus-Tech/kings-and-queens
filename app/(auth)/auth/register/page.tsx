"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, Upload, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { combinedRegistrationSchema, type CombinedRegistrationForm } from "@/lib/validations"
import Image from "next/image"
import { registerAction } from "@/lib/actions/auth/register.action"
import { Separator } from "@/components/ui/separator"

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [formData, setFormData] = useState<CombinedRegistrationForm | null>(null)

  // Modal confirmation state
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [agreesToRules, setAgreesToRules] = useState(false)

  const router = useRouter()
  const totalSteps = 2

  const form = useForm<CombinedRegistrationForm>({
    resolver: zodResolver(combinedRegistrationSchema),
    mode: "onChange",
    defaultValues: {
      schoolName: "",
      schoolType: "",
      fullAddress: "",
      addressLine2: "",
      phone: "",
      schoolEmail: "",
      website: "",
      facebook: "",
      instagram: "",
      twitter: "",
      coordinatorName: "",
      coordinatorEmail: "",
      coordinatorPhone: "",
      whatsappNumber: "",
      position: "",
      password: "",
    },
  })

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        setError("Please upload only JPG or PNG files")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      setLogoFile(file)
      form.setValue("logo", file as any)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    form.setValue("logo", undefined)
  }

  const handleFormSubmit = (data: CombinedRegistrationForm) => {
    // Store form data and show confirmation modal
    setFormData(data)
    setShowConfirmModal(true)
  }

  const handleConfirmSubmission = async () => {
    if (!formData || !isAuthorized || !agreesToRules) {
      setError("Please confirm both checkboxes to proceed")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)
    setShowConfirmModal(false)

    try {
      // Create FormData to handle file upload
      const formDataToSubmit = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "logo" && logoFile) {
          formDataToSubmit.append(key, logoFile)
        } else if (value !== undefined && value !== null) {
          formDataToSubmit.append(key, value.toString())
        }
      })

      const result = await registerAction(formDataToSubmit)

      if (result.success) {
        setSuccess(result.message || "Registration successful!")
        // Redirect to email verification after a short delay
        setTimeout(() => {
          router.push(result.redirectTo || "/auth/email-verification")
        }, 2000)
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Registration error:", err)
    } finally {
      setIsSubmitting(false)
      // Reset modal state
      setIsAuthorized(false)
      setAgreesToRules(false)
    }
  }

  const handleCancelConfirmation = () => {
    setShowConfirmModal(false)
    setIsAuthorized(false)
    setAgreesToRules(false)
    setFormData(null)
  }

  const nextStep = async () => {
    const step1Fields: (keyof CombinedRegistrationForm)[] = [
      "schoolName",
      "schoolType",
      "fullAddress",
      "phone",
      "schoolEmail",
    ]

    if (currentStep === 1) {
      const isValid = await form.trigger(step1Fields)
      const formValues = form.getValues()
      const hasRequiredValues = step1Fields.every((field) => {
        const value = formValues[field]
        return value && value.toString().trim() !== ""
      })

      if (isValid && hasRequiredValues && currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
        setError(null)
      }
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg-image.png"
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
                    currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  1
                </div>
                <div className={cn("w-8 h-0.5 transition-colors", currentStep >= 2 ? "bg-primary" : "bg-muted")} />
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
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
          {/* Success/Error Messages */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success} Redirecting to email verification...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <X className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
              {/* Step 1: School Information */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">School Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter the name of the School" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="schoolType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">School Type*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your school type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Primary">Primary School</SelectItem>
                              <SelectItem value="Secondary">Secondary School</SelectItem>
                              <SelectItem value="Tertiary">Tertiary Institution</SelectItem>
                              <SelectItem value="Private">Private School</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fullAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Full Address*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Address Line 2</FormLabel>
                          <FormControl>
                            <Input placeholder="Additional address information" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Phone*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter contact number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Website</FormLabel>
                          <FormControl>
                            <Input placeholder="www.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="schoolEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">School Email*</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo</FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                              {logoPreview ? (
                                <div className="relative">
                                  <img
                                    src={logoPreview || "/placeholder.svg"}
                                    alt="Logo preview"
                                    className="mx-auto h-20 w-20 object-cover rounded-lg mb-2"
                                  />
                                  <p className="text-sm text-muted-foreground mb-2">{logoFile?.name}</p>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={removeLogo}
                                    className="mx-auto bg-transparent"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                  <p className="text-muted-foreground text-sm mb-2">Upload logo (JPG, PNG only)</p>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById("logo-upload")?.click()}
                                  >
                                    Choose File
                                  </Button>
                                </>
                              )}
                              <input
                                id="logo-upload"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                className="hidden"
                                onChange={handleLogoUpload}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormLabel>Social Media</FormLabel>
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="facebook"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Facebook URL" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="instagram"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Instagram URL" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Twitter URL" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
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
                    <FormField
                      control={form.control}
                      name="coordinatorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Full Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter coordinator's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coordinatorEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Email*</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coordinatorPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Phone*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter contact number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="whatsappNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">WhatsApp Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter WhatsApp contact" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Position*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Position/Role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Teacher">Teacher</SelectItem>
                              <SelectItem value="Principal">Principal</SelectItem>
                              <SelectItem value="Chess Coach">Chess Coach</SelectItem>
                              <SelectItem value="Sports Coordinator">Sports Coordinator</SelectItem>
                              <SelectItem value="Game Master">Game Master</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Password Setup*</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a Password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1 || isSubmitting}
                  className="w-full sm:w-auto bg-transparent"
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
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="text-2xl">♔</div>
              <div>
                <div className="text-sm text-slate-400">Welcome to</div>
                <DialogTitle className="text-xl font-bold">Kings & Queens</DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2 border-y-[0.2px] py-2 border-gray-200 max-w-sm mx-auto">Almost Done! Confirm Your Agreement</h3>
              <p className="text-xs mb-1 mt-4">
                You are an authorized representative of {formData?.schoolName || "your school"}
              </p>
              <p className="text-xs">You've reviewed and accept our:</p>
            </div>

            <div className="flex justify-center gap-4 text-sm">
              <button className="text-muted-foreground italic underline-offset-4 hover:text-blue-300 underline">Terms of Service</button>
              <button className="text-muted-foreground italic underline-offset-4 hover:text-blue-300 underline">Fair Play Policy</button>
              <button className="text-muted-foreground italic underline-offset-4 hover:text-blue-300 underline">Privacy Policy</button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="authorized"
                  checked={isAuthorized}
                  onCheckedChange={checked => setIsAuthorized(checked === true)}
                  className="mt-1"
                />
                <label htmlFor="authorized" className="text-sm leading-relaxed cursor-pointer">
                  I confirm I'm authorized to register this school on behalf of the administration.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="rules"
                  checked={agreesToRules}
                  onCheckedChange={checked => setAgreesToRules(checked === true)}
                  className="mt-1"
                />
                <label htmlFor="rules" className="text-sm leading-relaxed cursor-pointer">
                  I agree to the tournament rules, including fair play and anti-cheating measures.
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelConfirmation}
                className="flex-1 bg-transparent border-slate-600 text-white hover:bg-slate-800"
                disabled={isSubmitting}
              >
                Close
              </Button>
              <Button
                onClick={handleConfirmSubmission}
                disabled={!isAuthorized || !agreesToRules || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Creating Account..." : "Confirm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
