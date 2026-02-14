import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import ScrollRevealItem from "@/components/ScrollRevealItem";

const problems = [
  {
    emoji: "☀️",
    topic: "Energi Surya",
    question: "Sebuah panel surya memiliki luas 2 m² dengan efisiensi 20%. Jika intensitas radiasi matahari 800 W/m², berapa energi yang dihasilkan dalam 5 jam?",
    steps: [
      "Diketahui: A = 2 m², η = 0,20, P = 800 W/m², t = 5 jam = 18.000 s",
      "Rumus: E = P × A × t × η",
      "E = 800 × 2 × 18.000 × 0,20",
      "E = 5.760.000 J = 5.760 kJ = 5,76 MJ",
    ],
    answer: "Energi yang dihasilkan panel surya adalah 5,76 MJ (megajoule) ⚡",
  },
  {
    emoji: "💨",
    topic: "Energi Angin",
    question: "Sebuah turbin angin memiliki diameter sapuan 10 m. Jika kecepatan angin 12 m/s dan massa jenis udara 1,225 kg/m³, berapa daya yang tersedia?",
    steps: [
      "Diketahui: d = 10 m → r = 5 m, v = 12 m/s, ρ = 1,225 kg/m³",
      "A = π × r² = 3,14 × 25 = 78,5 m²",
      "Rumus: P = ½ × ρ × A × v³",
      "P = 0,5 × 1,225 × 78,5 × 12³",
      "P = 0,5 × 1,225 × 78,5 × 1.728",
      "P = 83.074 W ≈ 83,1 kW",
    ],
    answer: "Daya yang tersedia dari angin adalah ~83,1 kW 💨",
  },
  {
    emoji: "🧊",
    topic: "Pencairan Es",
    question: "Berapa kalor yang dibutuhkan untuk mencairkan 500 kg es di kutub? (Kalor laten lebur es = 334.000 J/kg)",
    steps: [
      "Diketahui: m = 500 kg, L = 334.000 J/kg",
      "Rumus: Q = m × L",
      "Q = 500 × 334.000",
      "Q = 167.000.000 J = 167 MJ",
    ],
    answer: "Kalor yang dibutuhkan adalah 167 MJ (megajoule) 🌡️",
  },
  {
    emoji: "💧",
    topic: "Energi Air (PLTA)",
    question: "Sebuah PLTA memiliki debit air 30 m³/s dan ketinggian bendungan 40 m. Jika efisiensi turbin 85% dan massa jenis air 1.000 kg/m³, berapa daya listrik yang dihasilkan?",
    steps: [
      "Diketahui: Q = 30 m³/s, h = 40 m, η = 0,85, ρ = 1.000 kg/m³, g = 9,8 m/s²",
      "Massa air per detik: ṁ = ρ × Q = 1.000 × 30 = 30.000 kg/s",
      "Rumus: P = η × ṁ × g × h",
      "P = 0,85 × 30.000 × 9,8 × 40",
      "P = 9.996.000 W ≈ 10 MW",
    ],
    answer: "Daya listrik yang dihasilkan PLTA adalah ~10 MW (megawatt) 💧",
  },
  {
    emoji: "🌋",
    topic: "Energi Panas Bumi",
    question: "Sebuah sumur geotermal mengalirkan 20 kg/s air panas dari kedalaman 2 km. Jika suhu air naik dari 30°C menjadi 120°C (kalor jenis air = 4.200 J/kg·°C), berapa daya termalnya?",
    steps: [
      "Diketahui: ṁ = 20 kg/s, ΔT = 120 - 30 = 90°C, c = 4.200 J/kg·°C",
      "Rumus: P = ṁ × c × ΔT",
      "P = 20 × 4.200 × 90",
      "P = 7.560.000 W = 7,56 MW",
    ],
    answer: "Daya termal sumur geotermal adalah 7,56 MW 🌋",
  },
  {
    emoji: "🌊",
    topic: "Pemuaian Air Laut",
    question: "Volume air laut di suatu wilayah adalah 5 × 10⁸ m³. Jika suhu naik 1,5°C dan koefisien muai volume air β = 2,07 × 10⁻⁴ /°C, berapa perubahan volume air?",
    steps: [
      "Diketahui: V₀ = 5 × 10⁸ m³, ΔT = 1,5°C, β = 2,07 × 10⁻⁴ /°C",
      "Rumus: ΔV = β × V₀ × ΔT",
      "ΔV = 2,07 × 10⁻⁴ × 5 × 10⁸ × 1,5",
      "ΔV = 155.250 m³ ≈ 1,55 × 10⁵ m³",
    ],
    answer: "Perubahan volume air laut adalah ~155.250 m³ (~62 kolam renang olimpiade) 🌊",
  },
  {
    emoji: "🔬",
    topic: "Gaya Radiatif CO₂",
    question: "Konsentrasi CO₂ naik dari 280 ppm (pra-industri) menjadi 420 ppm saat ini. Berapa perubahan gaya radiatif menggunakan rumus ΔF = 5,35 × ln(C/C₀)?",
    steps: [
      "Diketahui: C = 420 ppm, C₀ = 280 ppm",
      "Rumus: ΔF = 5,35 × ln(C/C₀)",
      "ΔF = 5,35 × ln(420/280)",
      "ΔF = 5,35 × ln(1,5)",
      "ΔF = 5,35 × 0,405 = 2,17 W/m²",
    ],
    answer: "Perubahan gaya radiatif akibat kenaikan CO₂ adalah ~2,17 W/m² 🔬",
  },
  {
    emoji: "🌪️",
    topic: "Energi Kinetik Badai",
    question: "Sebuah badai tropis memiliki massa udara 1 × 10⁸ kg dan kecepatan angin 50 m/s. Berapa energi kinetiknya?",
    steps: [
      "Diketahui: m = 1 × 10⁸ kg, v = 50 m/s",
      "Rumus: Ek = ½ × m × v²",
      "Ek = 0,5 × 1 × 10⁸ × 50²",
      "Ek = 0,5 × 1 × 10⁸ × 2.500",
      "Ek = 1,25 × 10¹¹ J = 125 GJ",
    ],
    answer: "Energi kinetik badai adalah 125 GJ (gigajoule) 🌪️",
  },
  {
    emoji: "☀️",
    topic: "Farm Surya",
    question: "Sebuah farm surya memiliki 500 panel, masing-masing 2 m² dengan efisiensi 22%. Jika intensitas radiasi 950 W/m² selama 6 jam, berapa energi total dalam kWh?",
    steps: [
      "Diketahui: n = 500, A = 2 m², η = 0,22, P = 950 W/m², t = 6 jam",
      "Luas total: A_total = 500 × 2 = 1.000 m²",
      "Daya output: P_out = 950 × 1.000 × 0,22 = 209.000 W = 209 kW",
      "Energi: E = P × t = 209 × 6 = 1.254 kWh",
    ],
    answer: "Energi total farm surya adalah 1.254 kWh ☀️",
  },
  {
    emoji: "🧊",
    topic: "Es ke Uap",
    question: "Berapa total kalor yang dibutuhkan untuk mengubah 2 kg es pada -10°C menjadi uap air pada 100°C? (c_es = 2.100 J/kg·°C, L_lebur = 334.000 J/kg, c_air = 4.200 J/kg·°C, L_uap = 2.260.000 J/kg)",
    steps: [
      "Tahap 1: Es -10°C → Es 0°C: Q₁ = m×c_es×ΔT = 2×2.100×10 = 42.000 J",
      "Tahap 2: Es 0°C → Air 0°C: Q₂ = m×L_lebur = 2×334.000 = 668.000 J",
      "Tahap 3: Air 0°C → Air 100°C: Q₃ = m×c_air×ΔT = 2×4.200×100 = 840.000 J",
      "Tahap 4: Air 100°C → Uap 100°C: Q₄ = m×L_uap = 2×2.260.000 = 4.520.000 J",
      "Q_total = Q₁ + Q₂ + Q₃ + Q₄ = 42.000 + 668.000 + 840.000 + 4.520.000 = 6.070.000 J",
    ],
    answer: "Total kalor yang dibutuhkan adalah 6,07 MJ (megajoule) 🧊→💨",
  },
];

const ExampleProblemsSection = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const heading = useScrollReveal();

  const toggleReveal = (idx: number) => {
    setRevealed((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <section id="contoh-soal" className="py-20 bg-gradient-section-warm">
      <div className="container max-w-4xl mx-auto px-4">
        <div ref={heading.ref} className={`text-center mb-14 scroll-reveal ${heading.isVisible ? "visible" : ""}`}>
          <span className="text-5xl mb-4 block">📐</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Contoh Soal & Pembahasan
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            10 latihan soal fisika tentang sumber energi dan pemanasan global 📝
          </p>
        </div>

        <div className="space-y-8">
          {problems.map((prob, idx) => (
            <ScrollRevealItem key={idx} variant="scale" delay={idx * 0.08}>
              <div className="bg-card rounded-xl border shadow-md overflow-hidden">
                <div className="bg-primary/10 px-6 py-3 border-b flex items-center gap-2">
                  <span className="text-2xl">{prob.emoji}</span>
                  <span className="font-semibold text-primary text-sm uppercase tracking-wider">
                    Soal {idx + 1} — {prob.topic}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-foreground text-lg mb-6 leading-relaxed">
                    {prob.question}
                  </p>

                  <button
                    onClick={() => toggleReveal(idx)}
                    className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity mb-4"
                  >
                    {revealed[idx] ? "Sembunyikan Jawaban 🙈" : "Lihat Pembahasan 👀"}
                  </button>

                  {revealed[idx] && (
                    <div className="animate-in fade-in slide-in-from-top-3 duration-300">
                      <div className="formula-box mb-4">
                        <p className="text-sm mb-2 opacity-70">Langkah penyelesaian:</p>
                        {prob.steps.map((step, sIdx) => (
                          <p key={sIdx} className="text-base mb-1">
                            {sIdx + 1}. {step}
                          </p>
                        ))}
                      </div>
                      <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                        <p className="font-semibold text-success">✅ {prob.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollRevealItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExampleProblemsSection;
