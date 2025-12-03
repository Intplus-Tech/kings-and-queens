"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addPlayerAction } from "@/lib/actions/players/add-player.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the Zod schema for form validation
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  alias: z
    .string()
    .min(2, {
      message: "Alias must be at least 2 characters.",
    })
    .regex(/^[a-z0-9]+$/, {
      message:
        "Alias must be lowercase letters or numbers only (no spaces or special characters).",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  dob: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Please enter a valid date of birth.",
  }),
  playerClass: z.string().min(1, {
    message: "Class is required.",
  }),
  phone: z.string().regex(/^(?:\+234|0)(?:70|80|81|90|91)\d{8}$/, {
    message:
      "Please enter a valid Nigerian phone number (e.g., +2348012345678 or 08012345678).",
  }),
});

const classOptions = [
  { value: "jss1", label: "JSS 1" },
  { value: "jss2", label: "JSS 2" },
  { value: "jss3", label: "JSS 3" },
  { value: "ss1", label: "SSS 1" },
  { value: "ss2", label: "SSS 2" },
  { value: "ss3", label: "SSS 3" },
];

export default function AddPlayerModal() {
  const [open, setOpen] = useState(false);
  const currentPlayers = 2;
  const maxPlayers = 5;
  const remainingSlots = Math.max(maxPlayers - currentPlayers, 0);
  const progressPercentage = Math.min((currentPlayers / maxPlayers) * 100, 100);

  const sanitizeAlias = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      alias: "",
      dob: "",
      playerClass: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addPlayerAction(values);
    if (result.success) {
      setOpen(false);
      form.reset(); // Reset form after successful submission
    } else {
      form.setError("root", {
        type: "manual",
        message: result.error || "Failed to add player",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="text-black">
          + Add Player
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] max-h-[90vh] rounded-xl border bg-[#1C1C1E] p-6 sm:p-8 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Add Player to Team
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          {/* <div className="rounded-2xl border border-gray-700/50 bg-black/30 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <img
                src="/chess-pieces-2.png"
                alt="Chess pieces illustration"
                className="w-24 h-32 object-contain bg-transparent hidden sm:block"
              />
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <p className="text-lg sm:text-xl font-semibold text-white">
                  Build Your Team
                </p>
                <p className="text-sm text-gray-300">
                  {remainingSlots > 0
                    ? `Add up to ${remainingSlots} more ${
                        remainingSlots === 1 ? "player" : "players"
                      } (max ${maxPlayers}).`
                    : "You have reached the maximum roster size."}
                </p>
              </div>
              <div className="flex w-full justify-center sm:justify-end">
                <div className="flex items-center gap-2 rounded-full border border-gray-700/70 bg-black/40 px-4 py-2 text-sm text-gray-200">
                  <span className="text-xs uppercase tracking-wide text-gray-400">
                    Players
                  </span>
                  <span className="text-base font-semibold text-white">
                    {currentPlayers} / {maxPlayers}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <div className="h-2 w-full rounded-full bg-gray-700/60">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  {remainingSlots > 0
                    ? `${remainingSlots} slot${
                        remainingSlots === 1 ? "" : "s"
                      } remaining`
                    : "Roster is currently full"}
                </span>
                <span>Progress · {Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </div> */}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6 rounded-2xl border border-gray-700/50 bg-black/30 p-4 sm:p-6 shadow-lg shadow-black/30">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    Player Details
                  </p>
                  <p className="text-xs text-gray-400">
                    Capture the player identity and academic information.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter legal name"
                            className="bg-[#2C2C2E] text-white border-gray-600 focus:ring-2 focus:ring-yellow-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white">
                          Alias
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter game name"
                            className="bg-[#2C2C2E] text-white border-gray-600 focus:ring-2 focus:ring-yellow-400"
                            {...field}
                            onChange={(event) =>
                              field.onChange(sanitizeAlias(event.target.value))
                            }
                          />
                        </FormControl>
                        <p className="text-xs text-gray-400">
                          Lowercase letters and numbers only.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white">
                          Date of Birth
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-[#2C2C2E] text-white border-gray-600 focus:ring-2 focus:ring-yellow-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="playerClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-white">
                          Class
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-600 bg-[#2C2C2E] text-white focus:ring-2 focus:ring-yellow-400">
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-gray-700 bg-[#1f1f21] text-white">
                            {classOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6 rounded-2xl border border-gray-700/50 bg-black/30 p-4 sm:p-6 shadow-lg shadow-black/30">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    Contact Details
                  </p>
                  <p className="text-xs text-gray-400">
                    We will use this information to send tournament updates.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-sm text-white">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            className="bg-[#2C2C2E] text-white border-gray-600 focus:ring-2 focus:ring-yellow-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="text-sm text-white">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter phone number"
                            className="bg-[#2C2C2E] text-white border-gray-600 focus:ring-2 focus:ring-yellow-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {form.formState.errors.root && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.root.message}
                </p>
              )}
              <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black w-full sm:w-auto"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Adding..." : "Add Player"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
