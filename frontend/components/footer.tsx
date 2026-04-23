import Link from "next/link";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">TriageAI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered emergency triage system for faster, smarter patient prioritization.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/emergency" className="hover:text-foreground transition-colors">Emergency Form</Link></li>
              <li><Link href="/doctor" className="hover:text-foreground transition-colors">Doctor Dashboard</Link></li>
              <li><Link href="/admin" className="hover:text-foreground transition-colors">Admin Panel</Link></li>
              <li><Link href="/history" className="hover:text-foreground transition-colors">History</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Support</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Status</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">HIPAA Compliance</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            2024 TriageAI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for healthcare professionals
          </p>
        </div>
      </div>
    </footer>
  );
}
