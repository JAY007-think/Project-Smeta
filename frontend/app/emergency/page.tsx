import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MultiStepEmergencyForm } from "@/components/emergency/multi-step-form";

export const metadata = {
  title: "Emergency Intake | Smart Triage AI",
  description: "Secure, AI-powered emergency symptoms assessment",
};

export default function EmergencyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-left">
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-foreground">
                Emergency <span className="text-primary italic">Intake</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Follow the steps below. Our AI will prioritize your case based on clinical severity.
              </p>
            </div>
            
            <MultiStepEmergencyForm />
            
            <div className="mt-12 flex items-center justify-center gap-6 text-muted-foreground grayscale opacity-60">
               {/* Trust symbols */}
               <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                 <div className="h-6 w-6 rounded bg-muted-foreground/20 flex items-center justify-center text-[10px]">GDPR</div>
                 <span>Compliant</span>
               </div>
               <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                 <div className="h-6 w-6 rounded bg-muted-foreground/20 flex items-center justify-center text-[10px]">AES</div>
                 <span>256-bit</span>
               </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
