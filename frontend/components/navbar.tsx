"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Activity, Stethoscope } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/emergency", label: "Emergency Form" },
  { href: "/doctor", label: "Doctor Dashboard" },
  { href: "/admin", label: "Admin Dashboard" },
  { href: "/history", label: "History" },
];

import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">TriageAI</span>
        </Link>
        
        {/* ... desktop nav links ... */}

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === link.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ModeToggle />
          <Button variant="outline" size="sm" asChild className="glass border-border/50">
            <Link href="/doctor">
              <Stethoscope className="mr-2 h-4 w-4" />
              Doctor Login
            </Link>
          </Button>
          <Button size="sm" asChild className="shadow-lg shadow-primary/20">
            <Link href="/emergency">Start Emergency</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="right" className="w-[280px]">
            <div className="flex flex-col gap-4 pt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    pathname === link.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/doctor" onClick={() => setOpen(false)}>
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Doctor Login
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/emergency" onClick={() => setOpen(false)}>
                    Start Emergency
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
