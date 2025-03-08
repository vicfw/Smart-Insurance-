"use client";

import { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/lib/i18n";
import { useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            {t("common.appName")}
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/apply" className="text-sm font-medium hover:underline">
              {t("navigation.newApplication")}
            </Link>
            <Link
              href="/applications"
              className="text-sm font-medium hover:underline"
            >
              {t("navigation.myApplications")}
            </Link>
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <ModeToggle />
            </div>
          </nav>
        </div>

        {/* Mobile navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-40 py-4" : "max-h-0 py-0"
          )}
        >
          <nav className="flex flex-col space-y-4">
            <Link
              href="/apply"
              className="text-sm font-medium hover:underline"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navigation.newApplication")}
            </Link>
            <Link
              href="/applications"
              className="text-sm font-medium hover:underline"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navigation.myApplications")}
            </Link>
            <div className="flex space-x-2">
              <LanguageSwitcher />
              <ModeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
