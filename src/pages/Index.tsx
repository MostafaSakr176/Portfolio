import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ScrollToTop";
import CommandPalette from "@/components/CommandPalette";
import CursorSpotlight from "@/components/fx/CursorSpotlight";
import Marquee from "@/components/fx/Marquee";

const Index = () => {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <CursorSpotlight />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <main>
        <Hero onOpenPalette={() => setPaletteOpen(true)} />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
