import HeroSection from "@/components/HeroSection";
import EnergySourcesSection from "@/components/EnergySourcesSection";
import GlobalWarmingSection from "@/components/GlobalWarmingSection";
import CO2SimulationSection from "@/components/CO2SimulationSection";
import ExampleProblemsSection from "@/components/ExampleProblemsSection";
import QuizSection from "@/components/QuizSection";
import { useState } from "react";
import { Users, ChevronDown, ChevronUp } from "lucide-react";

const teamMembers = [
  "Akbar Aditya",
  "Aurel Ramadhani",
  "Wisnu Wirya Dharma",
  "Fadil Aulia Fajrin",
  "Safa Permata Hati",
];

const Index = () => {
  const [showTeam, setShowTeam] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-display font-bold text-lg text-foreground">
            🌍 Fisika Energi
          </span>
          <div className="hidden md:flex gap-6 text-sm font-semibold">
            <a href="#sumber-energi" className="text-muted-foreground hover:text-primary transition-colors">
              ⚡ Sumber Energi
            </a>
            <a href="#pemanasan-global" className="text-muted-foreground hover:text-primary transition-colors">
              🌡️ Pemanasan Global
            </a>
            <a href="#simulasi-co2" className="text-muted-foreground hover:text-primary transition-colors">
              🎛️ Simulasi CO₂
            </a>
            <a href="#contoh-soal" className="text-muted-foreground hover:text-primary transition-colors">
              📐 Contoh Soal
            </a>
            <a href="#kuis" className="text-muted-foreground hover:text-primary transition-colors">
              📝 Kuis
            </a>
          </div>
        </div>
      </nav>

      {/* Team Members Overlay */}
      <div className="fixed top-16 left-4 z-40">
        <button
          onClick={() => setShowTeam(!showTeam)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/90 backdrop-blur-sm border shadow-md text-sm font-semibold text-foreground hover:bg-card transition-colors"
        >
          <Users size={16} className="text-primary" />
          Anggota Kelompok
          {showTeam ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showTeam && (
          <div className="mt-2 p-4 rounded-xl bg-card/95 backdrop-blur-sm border shadow-lg">
            <ul className="space-y-1.5">
              {teamMembers.map((name, i) => (
                <li key={i} className="text-sm text-foreground flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <HeroSection />
      <EnergySourcesSection />
      <GlobalWarmingSection />
      <CO2SimulationSection />
      <ExampleProblemsSection />
      <QuizSection />

      {/* Footer */}
      <footer className="py-10 bg-foreground text-primary-foreground text-center">
        <p className="text-sm opacity-70">
          🌍 Materi Interaktif Fisika — Sumber Energi & Pemanasan Global © 2026
        </p>
        <p className="text-xs opacity-50 mt-2">
          Dibuat untuk pembelajaran fisika yang menyenangkan 🔬✨
        </p>
      </footer>
    </div>
  );
};

export default Index;
