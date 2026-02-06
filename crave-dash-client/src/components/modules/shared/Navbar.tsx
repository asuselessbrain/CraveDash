"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "./theme-toggle";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavLinks = ({ onClick }: { onClick?: () => void }) => (
  <>
    <Link
      href="/"
      onClick={onClick}
      className="block text-gray-600 dark:text-gray-300
        hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
    >
      Home
    </Link>

    <Link
      href="/themes"
      onClick={onClick}
      className="block text-gray-600 dark:text-gray-300
        hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
    >
      Themes
    </Link>

    <Link
      href="/developers"
      onClick={onClick}
      className="block text-gray-600 dark:text-gray-300
        hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
    >
      Developers
    </Link>

    <Link
      href="/pricing"
      onClick={onClick}
      className="block text-gray-600 dark:text-gray-300
        hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
    >
      Pricing
    </Link>

    <Link
      href="/blog"
      onClick={onClick}
      className="block text-gray-600 dark:text-gray-300
        hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
    >
      Blog
    </Link>

    <Link
      href="/about"
      onClick={onClick}
      className="block text-gray-600 dark:text-gray-300
        hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
    >
      About Us
    </Link>
  </>
);

const Navbar = () => {
  const [percent, setPercent] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);

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

  return (
    <div className="flex flex-col">
      {/* Scroll Progress Bar */}
      <div
        className="fixed inset-x-0 top-0 z-50 h-0.5 bg-blue-500 dark:bg-blue-400"
        style={{ width: `${percent}%` }}
      />

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40 px-6 py-4 backdrop-blur-md
        bg-white/80 dark:bg-gray-900/80
        shadow-md dark:shadow-black/40">
        <nav
          className="flex w-full items-center justify-between max-w-7xl mx-auto"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="https://stackoverflow.design/assets/img/logos/so/logo-stackoverflow.svg"
              alt="Logo"
              width={120}
              height={40}
              priority
              className="h-10 w-auto object-contain dark:brightness-90"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLinks />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <ModeToggle />

            {/* Desktop Login */}
            <Link
              href="/sign-in"
              className="hidden lg:block font-semibold"
            >
              <Button>SignIn</Button>
            </Link>

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
          px-6 py-6 space-y-4
          transform transition-all duration-300 ease-in-out
          ${
            openMenu
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }
        `}
      >
        <NavLinks onClick={() => setOpenMenu(false)} />

        <Link
          href="/sign-in"
          className="block font-semibold"
          onClick={() => setOpenMenu(false)}
        >
          <Button>SignIn</Button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
