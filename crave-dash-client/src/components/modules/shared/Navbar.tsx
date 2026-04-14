"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./theme-toggle";
import { Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { getCartItems } from "@/services/cart";
import { signOutUser } from "@/services/auth";
import { toast } from "sonner";

type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

function getDashboardPath(role?: string) {
  const normalizedRole = (role || "").toUpperCase() as UserRole | "";

  if (normalizedRole === "ADMIN") return "/admin";
  if (normalizedRole === "PROVIDER") return "/provider/dashboard";
  if (normalizedRole === "CUSTOMER") return "/customer";

  return "/sign-in";
}

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/sign-in") return pathname === "/sign-in";

  return pathname === href || pathname.startsWith(`${href}/`);
}

const NavLinks = ({ role, pathname, onClick }: { role?: string; pathname: string; onClick?: () => void }) => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/meals", label: "Meals" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: getDashboardPath(role), label: "Dashboard" },
  ];

  return (
    <>
      {links.map((item) => (
        (() => {
          const active = isActiveRoute(pathname, item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClick}
              className={`block rounded-lg px-2 py-1.5 text-gray-600 transition-colors dark:text-gray-300 ${active
                ? "text-orange-700 dark:text-orange-300"
                : "hover:text-blue-500 dark:hover:text-blue-400"
                }`}
            >
              {item.label}
            </Link>
          );
        })()
      ))}
    </>
  );
};

const Navbar = () => {
  const [percent, setPercent] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const user = useUser();
  const role = user?.user?.role;
  const isAuthenticated = Boolean(user?.user);

  const handleSignOut = async () => {
  try {
    await signOutUser();
    user.setUser(null);
    setCartCount(0);
    setOpenMenu(false);

    toast.success("Successfully signed out.");

    router.push("/");
  } catch {
    toast.error("Failed to sign out.");
  }
};

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      setPercent((scrollTop / docHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadCartCount = async () => {
      if (!isAuthenticated) {
        setCartCount(0);
        return;
      }

      try {
        const cartResponse = await getCartItems();
        const items = cartResponse?.data?.items ?? [];
        const totalItems = items.reduce((sum: number, item: { quantity?: number }) => {
          return sum + Math.max(1, Number(item.quantity) || 1);
        }, 0);

        setCartCount(totalItems);
      } catch {
        setCartCount(0);
      }
    };

    loadCartCount();
  }, [pathname, isAuthenticated]);

  return (
    <div className="flex flex-col">
      {/* Scroll Progress Bar */}
      <div
        className="fixed inset-x-0 top-0 z-50 h-0.5 bg-blue-500 dark:bg-blue-400"
        style={{ width: `${percent}%` }}
      />

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40 px-4 py-4 backdrop-blur-md sm:px-6
        bg-white/80 dark:bg-gray-900/80 shadow-md dark:shadow-black/40">
        <nav
          className="flex w-full items-center justify-between max-w-7xl mx-auto"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/app/cravedash-logo.svg"
              alt="CraveDash Logo"
              width={164}
              height={40}
              priority
              className="h-10 w-auto object-contain dark:brightness-90"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLinks role={role} pathname={pathname} />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Link href="/cart" aria-label="Go to cart" className="relative inline-flex">
              <ShoppingCart className="text-gray-700 transition-colors hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400" />

              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </Link>
            <ModeToggle />

            {/* Desktop Login */}
            {isAuthenticated ? (
              <Button className="hidden lg:inline-flex font-semibold" onClick={handleSignOut}>
                Logout
              </Button>
            ) : (
              <Link href="/sign-in" className="hidden lg:block font-semibold">
                <Button>SignIn</Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="lg:hidden text-gray-700 dark:text-gray-300
              transition-transform duration-300 relative flex items-center justify-center h-6 w-6"
              aria-label="Toggle Menu"
            >
              <span
                className={`block text-2xl transform transition-transform duration-300 absolute h-6 w-6 ${openMenu ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
              >
                <X />
              </span>
              <span
                className={`block text-2xl transform transition-transform duration-300 absolute h-6 w-6 ${openMenu ? "-rotate-90 scale-0" : "rotate-0 scale-100"}`}
              >
                <Menu />
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          lg:hidden fixed top-18 left-0 w-full z-30
          bg-white dark:bg-gray-900 shadow-md
          px-4 py-6 space-y-4 sm:px-6
          transform transition-all duration-300 ease-in-out
          ${openMenu
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
          }
        `}
      >
        <NavLinks role={role} pathname={pathname} onClick={() => setOpenMenu(false)} />

        {isAuthenticated ? (
          <Button className="w-full font-semibold" onClick={handleSignOut}>
            Logout
          </Button>
        ) : (
          <Link
            href="/sign-in"
            className="block font-semibold"
            onClick={() => setOpenMenu(false)}
          >
            <Button>SignIn</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
