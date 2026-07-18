import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Spotlight } from "@/components/Spotlight";
import { CaseStudy } from "@/components/CaseStudy";
import { Pricing } from "@/components/Pricing";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Spotlight />
        <CaseStudy />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
