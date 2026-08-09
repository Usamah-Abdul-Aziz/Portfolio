import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import CommandPalette from "@/components/CommandPalette";
import ContactModal from "@/components/ContactModal";
import { FilterProvider } from "@/components/FilterContext";

export default function Home() {
  return (
    <FilterProvider>
      <Nav />
      <CommandPalette />
      <ContactModal />
      <main className="flex-1">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
      </main>
      <Contact />
    </FilterProvider>
  );
}
