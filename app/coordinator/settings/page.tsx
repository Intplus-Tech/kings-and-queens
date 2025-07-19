"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { CoordinatorHeader } from "@/components/layout/coordinator-header";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("school-information");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);

  const tabs = [
    { id: "school-information", label: "School Information" },
    { id: "coordinator-information", label: "Coordinator's Information" },
    { id: "update-password", label: "Update Password" },
  ];

  return (
    <div className='min-h-screen text-white'>
      <CoordinatorHeader userRole='Settings' />

      <div className='flex mt-4'>
        {/* Sidebar */}
        <div className='w-64 min-h-screen p-1'>
          <nav className='space-y-2'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-yellow-400 text-transparent bg-clip-text font-medium"
                    : "text-gray-300 hover:text-white hover:bg-[#3C3C3E]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className='flex-1 p-1'>
          {/* School Information Tab */}
          {activeTab === "school-information" && (
            <div className='max-w-2xl'>
              <h2 className='text-2xl font-bold mb-6'>School Information</h2>
              <div className='space-y-6'>
                <div>
                  <Label
                    htmlFor='schoolName'
                    className='text-sm text-white mb-2 block'
                  >
                    School Name
                  </Label>
                  <div className='flex justify-center mb-3 items-center gap-3'>
                    <Input
                      id='schoolName'
                      placeholder='Enter school name'
                      className='bg-[#2C2C2E] text-white border-gray-600'
                    />
                    <img
                      src='/lock.svg'
                      alt=''
                      className='w-4 h-4 object-cover'
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor='schoolType'
                    className='text-sm text-white mb-2 block'
                  >
                    School Type
                  </Label>
                  <div className='flex justify-center mb-3 items-center gap-3'>
                    <Select>
                      <SelectTrigger className='bg-[#2C2C2E] text-white border-gray-600'>
                        <SelectValue placeholder='Select school type' />
                      </SelectTrigger>
                      <SelectContent className='bg-[#2C2C2E] text-white border-gray-600'>
                        <SelectItem value='primary'>Primary School</SelectItem>
                        <SelectItem value='secondary'>
                          Secondary School
                        </SelectItem>
                        <SelectItem value='tertiary'>
                          Tertiary Institution
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <img
                      src='/lock.svg'
                      alt=''
                      className='w-4 h-4 object-cover'
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor='fullAddress'
                    className='text-sm text-white mb-2 block'
                  >
                    Full Address
                  </Label>
                  <div className='flex justify-center mb-3 items-center gap-3'>
                    <Input
                      id='fullAddress'
                      placeholder='Line 1'
                      className='bg-[#2C2C2E] text-white border-gray-600'
                    />
                    <img
                      src='/lock.svg'
                      alt=''
                      className='w-4 h-4 object-cover'
                    />
                  </div>
                  <div className='flex justify-center gap-3 items-center'>
                    <Input
                      id='fullAddress'
                      placeholder='Line 2'
                      className='bg-[#2C2C2E] text-white border-gray-600'
                    />
                    <img
                      src='/lock.svg'
                      alt=''
                      className='w-4 h-4 object-cover text-white'
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor='schoolPhone'
                    className='text-sm text-white mb-2 block'
                  >
                    Phone
                  </Label>
                  <div className='flex justify-center mb-3 items-center gap-3'>
                    <Input
                      id='schoolPhone'
                      placeholder='Enter phone number'
                      className='bg-[#2C2C2E] text-white border-gray-600'
                    />
                    <img
                      src='/lock.svg'
                      alt=''
                      className='w-4 h-4 object-cover'
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor='schoolEmail'
                    className='text-sm text-white mb-2 block'
                  >
                    School Email
                  </Label>
                  <div className='flex justify-center mb-3 items-center gap-3'>
                    <Input
                      id='schoolEmail'
                      type='email'
                      placeholder='Enter school email'
                      className='bg-[#2C2C2E] text-white border-gray-600'
                    />
                    <img
                      src='/lock.svg'
                      alt=''
                      className='w-4 h-4 object-cover'
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor='website'
                    className='text-sm text-white mb-2 block'
                  >
                    Website
                  </Label>
                  <div className='flex justify-center mb-3 items-center gap-3'>
                    <Input
                      id='website'
                      placeholder='WWW.'
                      className='bg-[#2C2C2E] text-white border-gray-600'
                    />
                    <img
                      src='/lock.svg'
                      alt=''
                      className='w-4 h-4 object-cover'
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor='socialMedia'
                    className='text-sm text-white mb-2 block'
                  >
                    Social Media
                  </Label>
                  <div className='flex justify-center mb-3 items-center gap-3'>
                    <Input
                      id='socialMedia'
                      placeholder='Facebook'
                      className='bg-[#2C2C2E] text-white border-gray-600'
                    />
                    <img
                      src='/lock.svg'
                      alt=''
                      className='w-4 h-4 object-cover'
                    />
                  </div>
                  <div className='flex justify-center mb-3 items-center gap-3'>
                    <Input
                      id='socialMedia'
                      placeholder='Instagram'
                      className='bg-[#2C2C2E] text-white border-gray-600'
                    />
                    <img
                      src='/lock.svg'
                      alt=''
                      className='w-4 h-4 object-cover'
                    />
                  </div>
                  <div className='flex justify-center mb-3 items-center gap-3'>
                    <Input
                      id='socialMedia'
                      placeholder='X'
                      className='bg-[#2C2C2E] text-white border-gray-600'
                    />
                    <img
                      src='/lock.svg'
                      alt=''
                      className='w-4 h-4 object-cover'
                    />
                  </div>
                </div>

                <Button className='bg-yellow-400 text-black md:relative md:right-[270px] hover:bg-yellow-500 w-[250px] mt-8'>
                  Request Edit
                </Button>
              </div>
            </div>
          )}

          {/* Coordinator's Information Tab */}
          {activeTab === "coordinator-information" && (
            <div className='max-w-2xl'>
              <h2 className='text-2xl font-bold mb-6'>
                Coordinator's Information
              </h2>
              <div className='space-y-6'>
                <div>
                  <Label
                    htmlFor='fullName'
                    className='text-sm text-white mb-2 block'
                  >
                    Full Name
                  </Label>
                  <Input
                    id='fullName'
                    placeholder='Enter your full name'
                    className='bg-[#2C2C2E] text-white border-gray-600'
                  />
                </div>

                <div>
                  <Label
                    htmlFor='email'
                    className='text-sm text-white mb-2 block'
                  >
                    Email
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='Enter your email'
                    className='bg-[#2C2C2E] text-white border-gray-600'
                  />
                </div>

                <div>
                  <Label
                    htmlFor='phone'
                    className='text-sm text-white mb-2 block'
                  >
                    Phone
                  </Label>
                  <Input
                    id='phone'
                    placeholder='Enter your phone number'
                    className='bg-[#2C2C2E] text-white border-gray-600'
                  />
                </div>

                <div>
                  <Label
                    htmlFor='whatsapp'
                    className='text-sm text-white mb-2 block'
                  >
                    WhatsApp Number
                  </Label>
                  <Input
                    id='whatsapp'
                    placeholder='Enter WhatsApp number'
                    className='bg-[#2C2C2E] text-white border-gray-600'
                  />
                </div>

                <div>
                  <Label
                    htmlFor='position'
                    className='text-sm text-white mb-2 block'
                  >
                    Position
                  </Label>
                  <Select>
                    <SelectTrigger className='bg-[#2C2C2E] text-white border-gray-600'>
                      <SelectValue placeholder='Select your position' />
                    </SelectTrigger>
                    <SelectContent className='bg-[#2C2C2E] text-white border-gray-600'>
                      <SelectItem value='principal'>Principal</SelectItem>
                      <SelectItem value='vice-principal'>
                        Vice Principal
                      </SelectItem>
                      <SelectItem value='teacher'>Teacher</SelectItem>
                      <SelectItem value='coordinator'>Coordinator</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className='bg-yellow-400 text-black hover:bg-yellow-500 w-[263px] mt-8'>
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Update Password Tab */}
          {activeTab === "update-password" && (
            <div className='max-w-2xl'>
              <h2 className='text-2xl font-bold mb-6'>Update Password</h2>
              <div className='space-y-6'>
                <div>
                  <Label
                    htmlFor='oldPassword'
                    className='text-sm text-white mb-2 block'
                  >
                    Old Password
                  </Label>
                  <div className='relative'>
                    <Input
                      id='oldPassword'
                      type={!showOldPassword ? "text" : "password"}
                      placeholder='Enter old password'
                      className='bg-[#2C2C2E] text-white border-gray-600 pr-10'
                    />
                    <button
                      type='button'
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'
                    >
                      {showOldPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor='newPassword'
                    className='text-sm text-white mb-2 block'
                  >
                    New Password
                  </Label>
                  <div className='relative'>
                    <Input
                      id='newPassword'
                      type={!showNewPassword ? "text" : "password"}
                      placeholder='Enter new password'
                      className='bg-[#2C2C2E] text-white border-gray-600 pr-10'
                    />
                    <button
                      type='button'
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'
                    >
                      {showNewPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor='reEnterPassword'
                    className='text-sm text-white mb-2 block'
                  >
                    Re-Enter Password
                  </Label>
                  <div className='relative'>
                    <Input
                      id='reEnterPassword'
                      type={!showReEnterPassword ? "text" : "password"}
                      placeholder='Re-enter your new password'
                      className='bg-[#2C2C2E] text-white border-gray-600 pr-10'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowReEnterPassword(!showReEnterPassword)
                      }
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'
                    >
                      {showReEnterPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </div>

                <Button className='bg-yellow-400 text-black hover:bg-yellow-500 w-[180px] mt-8'>
                  Update Password
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
