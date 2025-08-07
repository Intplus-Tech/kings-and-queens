import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronDown, Instagram, Linkedin, Facebook, Menu } from "lucide-react"

export default function HomePage() {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/register", label: "Register (School/Player)" },
    { href: "/rules", label: "Tournament Rules" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/live-games", label: "Live Games!", highlight: true },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="px-4 sm:px-6 py-4">
          <div className="max-w-6xl mx-auto">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-full px-8 py-3">
                <div className="flex items-center space-x-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`transition-colors text-sm font-medium ${item.highlight ? "text-primary hover:text-primary/50" : "text-white hover:text-primary"
                        }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex items-center justify-between">
              <div className="text-xl font-bold">Naija Chess</div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-gray-900 border-gray-700 text-white">
                  <div className="flex flex-col space-y-6 mt-8">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`text-lg font-medium transition-colors ${item.highlight ? "text-orange-400 hover:text-orange-300" : "text-white hover:text-orange-400"
                          }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-gray-300 mb-6 sm:mb-8 font-medium">Naija Chess Competition</p>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 sm:mb-12 lg:mb-16 leading-tight">
              Kings & Queens
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {/* Register Button */}
              <Button
                size="lg"
                variant={'ghost'}
                className="text-primary text-xl font-semibold hover:text-primary"
                asChild
              >
                <Link href={'/auth/register'}>
                  Register NOW!
                </Link>
              </Button>

              {/* Sign In Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="lg"
                    variant={'ghost'}
                    className="text-primary text-xl font-semibold hover:text-primary"
                  >
                    Sign in
                    <ChevronDown className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-600 text-white w-56">
                  <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer py-3">
                    <Link href={'/auth/player-signin'}>As A Player</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer py-3">
                    <Link href={'/auth/sign-in'}>As A Coordinator</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 sm:px-6 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Footer - Stacked */}
            <div className="flex flex-col space-y-4 sm:hidden">
              {/* Footer Links */}
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
                <Link href="/policies" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Policies
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms & Condition
                </Link>
              </div>

              {/* Social Media */}
              <div className="flex items-center justify-center gap-1">
                <span className="text-gray-400 text-sm mr-3">Follow us:</span>
                <div className="flex items-center gap-2">
                  <Link
                    href="#"
                    className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center hover:bg-pink-700 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-white" />
                  </Link>
                  <Link
                    href="#"
                    className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-white" />
                  </Link>
                  <Link
                    href="#"
                    className="w-8 h-8 bg-red-600 rounded flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <span className="text-white text-xs font-bold">P</span>
                  </Link>
                  <Link
                    href="#"
                    className="w-8 h-8 bg-red-500 rounded flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <span className="text-white text-xs font-bold">X</span>
                  </Link>
                  <Link
                    href="#"
                    className="w-8 h-8 bg-blue-800 rounded flex items-center justify-center hover:bg-blue-900 transition-colors"
                  >
                    <Facebook className="w-4 h-4 text-white" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop Footer - Side by side */}
            <div className="hidden sm:flex flex-col sm:flex-row justify-between items-center">
              {/* Footer Links */}
              <div className="flex flex-wrap items-center gap-6 mb-4 sm:mb-0">
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
                <Link href="/policies" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Policies
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms & Condition
                </Link>
              </div>

              {/* Social Media */}
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-sm mr-3">Follow us:</span>
                <div className="flex items-center gap-2">
                  <Link
                    href="#"
                    className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center hover:bg-pink-700 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-white" />
                  </Link>
                  <Link
                    href="#"
                    className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-white" />
                  </Link>
                  <Link
                    href="#"
                    className="w-8 h-8 bg-red-600 rounded flex items-center justify-center hover:bg-red-700 transition-colors"
                  >
                    <span className="text-white text-xs font-bold">P</span>
                  </Link>
                  <Link
                    href="#"
                    className="w-8 h-8 bg-red-500 rounded flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <span className="text-white text-xs font-bold">X</span>
                  </Link>
                  <Link
                    href="#"
                    className="w-8 h-8 bg-blue-800 rounded flex items-center justify-center hover:bg-blue-900 transition-colors"
                  >
                    <Facebook className="w-4 h-4 text-white" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
