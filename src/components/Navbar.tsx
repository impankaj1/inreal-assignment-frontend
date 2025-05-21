"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  LogIn,
  UserPlus,
  Home,
  Briefcase,
  User,
  Menu,
} from "lucide-react";
import { ModeToggle } from "./ThemeToggle";
import { useUserStore } from "@/lib/store";
import axiosInstance from "@/app/axiosInstance";
import { toast } from "react-toastify";
import { removeAccessToken } from "@/app/axiosInstance";
import { BACKEND_BASE_URL } from "@/helpers/helper";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        `${BACKEND_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      removeAccessToken();
      setIsOpen(false);
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.");
      router.push("/dashboard");
    }
  };

  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
          {user ? (
            <>
              <Link href={`/user/${user._id}`} onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-start gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          <Button variant="ghost" className="w-full justify-start gap-2">
            Appearance : <ModeToggle />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <nav className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link
              href="/"
              className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <Briefcase className="h-6 w-6 inline-block mr-2" />
              JobPortal
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="hidden md:block">
                  <Button variant="ghost" className="gap-2">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard" className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Home className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="hidden md:flex items-center gap-4">
                  <Link href={`/user/${user._id}`}>
                    <Button variant="ghost" className="gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/auth/login">
                  <Button variant="ghost" className="gap-2 hover:bg-primary/10">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="gap-2 bg-primary hover:bg-primary/90 transition-colors">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            <div className="hidden md:block">
              <ModeToggle />
            </div>
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
