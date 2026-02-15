import { useState, useMemo } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import ScrollRevealItem from "@/components/ScrollRevealItem";
import { Slider } from "@/components/ui/slider";

const PRE_INDUSTRIAL_CO2 = 280;

function getTemperatureChange(co2: number): number {
  // ΔF = 5.35 × ln(C/C₀), climate sensitivity ~3°C per doubling
  if (co2 <= 0) return -15;
  const deltaF = 5.35 * Math.log(co2 / PRE_INDUSTRIAL_CO2);
  const climateSensitivity = 3.0;
  const deltaFDoubling = 5.35 * Math.log(2);
  return (deltaF / deltaFDoubling) * climateSensitivity;
}

function getCondition(co2: number): { emoji: string; label: string; description: string; color: string } {
  if (co2 <= 280) return {
    emoji: "🌿",
    label: "Pra-Industri",
    description: "Kondisi ideal sebelum revolusi industri. Ekosistem seimbang, es kutub stabil.",
    color: "hsl(var(--success))",
  };
  if (co2 <= 350) return {
    emoji: "🌤️",
    label: "Aman",
    description: "Perubahan suhu minimal. Sebagian besar ekosistem masih dapat beradaptasi.",
    color: "hsl(var(--energy-wind))",
  };
  if (co2 <= 450) return {
    emoji: "⚠️",
    label: "Peringatan",
    description: "Suhu mulai naik signifikan. Es kutub mencair lebih cepat, cuaca ekstrem meningkat.",
    color: "hsl(var(--secondary))",
  };
  if (co2 <= 600) return {
    emoji: "🔥",
    label: "Berbahaya",
    description: "Kenaikan suhu tinggi. Permukaan laut naik, kekeringan dan banjir meningkat drastis.",
    color: "hsl(var(--warming))",
  };
  if (co2 <= 800) return {
    emoji: "🌋",
    label: "Kritis",
    description: "Bumi sangat panas. Banyak spesies punah, sebagian besar es kutub hilang.",
    color: "hsl(var(--destructive))",
  };
  return {
    emoji: "💀",
    label: "Katastrofik",
    description: "Kondisi tidak dapat dikembalikan. Bumi hampir tidak layak huni bagi banyak makhluk hidup.",
    color: "hsl(var(--destructive))",
  };
}

function getSeaLevelRise(tempChange: number): number {
  // Rough estimate: ~0.2m per °C for thermal expansion + ice melt long-term
  return Math.max(0, tempChange * 0.2);
}

const CO2SimulationSection = () => {
  const [co2, setCo2] = useState(420);
  const heading = useScrollReveal();

  const tempChange = useMemo(() => getTemperatureChange(co2), [co2]);
  const condition = useMemo(() => getCondition(co2), [co2]);
  const seaLevel = useMemo(() => getSeaLevelRise(tempChange), [tempChange]);

  const baseTemp = 14;
  const currentTemp = baseTemp + tempChange;

  // Bar width for visual indicator (0-100%)
  const barPercent = Math.min(100, Math.max(0, ((co2 - 150) / (1000 - 150)) * 100));

  return (
    <section id="simulasi-co2" className="py-20 bg-gradient-section-cool">
      <div className="container max-w-4xl mx-auto px-4">
        <div ref={heading.ref} className={`text-center mb-14 scroll-reveal ${heading.isVisible ? "visible" : ""}`}>
          <span className="text-5xl mb-4 block">🎛️</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Simulasi Kontrol CO₂
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Geser slider untuk melihat bagaimana konsentrasi CO₂ memengaruhi suhu dan kondisi Bumi 🌍
          </p>
        </div>

        <ScrollRevealItem variant="scale" delay={0.1}>
          <div className="bg-card rounded-xl border shadow-lg overflow-hidden">
            {/* Slider Area */}
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-muted-foreground">Konsentrasi CO₂</label>
                <span className="font-mono font-bold text-lg" style={{ color: condition.color }}>
                  {co2} ppm
                </span>
              </div>
              <Slider
                value={[co2]}
                onValueChange={(v) => setCo2(v[0])}
                min={150}
                max={1000}
                step={5}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>150 ppm</span>
                <span className="opacity-60">280 (pra-industri)</span>
                <span className="opacity-60">420 (saat ini)</span>
                <span>1000 ppm</span>
              </div>

              {/* Visual CO2 bar */}
              <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${barPercent}%`,
                    background: `linear-gradient(90deg, hsl(var(--success)), hsl(var(--secondary)), hsl(var(--warming)), hsl(var(--destructive)))`,
                  }}
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-3 gap-0 border-t">
              {/* Temperature */}
              <div className="p-6 border-b md:border-b-0 md:border-r text-center">
                <span className="text-3xl mb-2 block">🌡️</span>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Suhu Rata-rata</p>
                <p className="text-2xl font-mono font-bold text-foreground">
                  {currentTemp.toFixed(1)}°C
                </p>
                <p className="text-sm mt-1" style={{ color: condition.color }}>
                  {tempChange >= 0 ? "+" : ""}{tempChange.toFixed(2)}°C
                </p>
              </div>

              {/* Condition */}
              <div className="p-6 border-b md:border-b-0 md:border-r text-center">
                <span className="text-3xl mb-2 block">{condition.emoji}</span>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Kondisi</p>
                <p className="text-2xl font-bold" style={{ color: condition.color }}>
                  {condition.label}
                </p>
              </div>

              {/* Sea Level */}
              <div className="p-6 text-center">
                <span className="text-3xl mb-2 block">🌊</span>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Kenaikan Muka Laut</p>
                <p className="text-2xl font-mono font-bold text-foreground">
                  +{seaLevel.toFixed(2)} m
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 border-t" style={{ backgroundColor: `${condition.color}10` }}>
              <p className="text-foreground text-center leading-relaxed">
                <span className="font-semibold">{condition.emoji} {condition.label}:</span>{" "}
                {condition.description}
              </p>
            </div>

            {/* Formula Reference */}
            <div className="px-6 pb-6">
              <div className="formula-box text-sm">
                <p className="opacity-70 text-xs mb-2">Rumus yang digunakan:</p>
                <p>ΔF = 5,35 × ln(C/C₀) → ΔT = (ΔF / ΔF₂ₓ) × λ</p>
                <p className="text-xs opacity-50 mt-1">C₀ = 280 ppm, λ = 3°C (sensitivitas iklim per penggandaan CO₂)</p>
              </div>
            </div>
          </div>
        </ScrollRevealItem>
      </div>
    </section>
  );
};

export default CO2SimulationSection;
