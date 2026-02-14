import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const energySources = [
  {
    emoji: "☀️",
    title: "Energi Surya",
    colorClass: "bg-energy-solar/15 border-energy-solar/30",
    description: "Energi yang berasal dari radiasi matahari. Matahari memancarkan energi melalui reaksi fusi nuklir di intinya.",
    formula: "E = P × A × t × η",
    formulaDesc: "E = energi (Joule), P = intensitas radiasi matahari (W/m²), A = luas permukaan panel (m²), t = waktu (s), η = efisiensi panel",
    fact: "Intensitas radiasi matahari rata-rata di permukaan Bumi: ~1000 W/m²",
  },
  {
    emoji: "💨",
    title: "Energi Angin",
    colorClass: "bg-energy-wind/15 border-energy-wind/30",
    description: "Energi kinetik yang berasal dari pergerakan massa udara akibat perbedaan tekanan atmosfer.",
    formula: "P = ½ × ρ × A × v³",
    formulaDesc: "P = daya (Watt), ρ = massa jenis udara (kg/m³), A = luas sapuan turbin (m²), v = kecepatan angin (m/s)",
    fact: "Massa jenis udara rata-rata: 1.225 kg/m³ pada permukaan laut",
  },
  {
    emoji: "💧",
    title: "Energi Air (Hidro)",
    colorClass: "bg-energy-hydro/15 border-energy-hydro/30",
    description: "Energi potensial gravitasi air yang dikonversi menjadi energi listrik melalui turbin.",
    formula: "Ep = m × g × h",
    formulaDesc: "Ep = energi potensial (Joule), m = massa air (kg), g = percepatan gravitasi (9,8 m/s²), h = ketinggian (m)",
    fact: "PLTA menyumbang ~16% listrik dunia 🌊",
  },
  {
    emoji: "🌋",
    title: "Energi Panas Bumi",
    colorClass: "bg-energy-geo/15 border-energy-geo/30",
    description: "Energi termal yang berasal dari inti bumi akibat peluruhan radioaktif unsur-unsur di dalam bumi.",
    formula: "Q = m × c × ΔT",
    formulaDesc: "Q = kalor (Joule), m = massa (kg), c = kalor jenis (J/kg·°C), ΔT = perubahan suhu (°C)",
    fact: "Suhu inti bumi mencapai ~5.500°C — sepanas permukaan matahari! 🔥",
  },
];

const EnergySourcesSection = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const heading = useScrollReveal();
  const card0 = useScrollReveal();
  const card1 = useScrollReveal();
  const card2 = useScrollReveal();
  const card3 = useScrollReveal();
  const cards = [card0, card1, card2, card3];

  return (
    <section id="sumber-energi" className="py-20 bg-gradient-section-warm">
      <div className="container max-w-5xl mx-auto px-4">
        <div ref={heading.ref} className={`text-center mb-14 scroll-reveal ${heading.isVisible ? "visible" : ""}`}>
          <span className="text-5xl mb-4 block">⚡</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Sumber Energi
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Memahami berbagai sumber energi dari perspektif fisika — dari energi surya hingga panas bumi 🔋
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {energySources.map((source, idx) => (
            <div
              key={idx}
              ref={cards[idx].ref}
              className={`rounded-xl border-2 p-6 transition-all duration-300 cursor-pointer hover:shadow-lg ${source.colorClass} ${expanded === idx ? "shadow-xl scale-[1.02]" : ""} ${idx % 2 === 0 ? "scroll-reveal-left" : "scroll-reveal-right"} ${cards[idx].isVisible ? "visible" : ""}`}
              style={{ transitionDelay: `${idx * 0.1}s` }}
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{source.emoji}</span>
                <h3 className="text-xl font-display font-bold text-foreground">
                  {source.title}
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">{source.description}</p>

              <div className="formula-box mb-3">
                <div className="text-center text-xl font-semibold">{source.formula}</div>
              </div>
              <p className="text-sm text-muted-foreground mb-2 italic">
                {source.formulaDesc}
              </p>

              {expanded === idx && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-sm font-semibold text-primary">💡 Fakta Menarik:</p>
                  <p className="text-sm text-foreground">{source.fact}</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-2 text-right">
                {expanded === idx ? "Klik untuk tutup ▲" : "Klik untuk detail ▼"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnergySourcesSection;
