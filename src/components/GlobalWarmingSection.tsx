import ScrollRevealItem from "@/components/ScrollRevealItem";

const symptoms = [
  {
    emoji: "🌡️",
    title: "Efek Rumah Kaca",
    description: "Gas rumah kaca (CO₂, CH₄, N₂O) menyerap dan memancarkan kembali radiasi inframerah, meningkatkan suhu permukaan bumi.",
    formula: "ΔF = 5.35 × ln(C/C₀)",
    formulaDesc: "ΔF = perubahan gaya radiatif (W/m²), C = konsentrasi CO₂ saat ini (ppm), C₀ = konsentrasi CO₂ awal (ppm)",
    detail: "Konsentrasi CO₂ telah naik dari 280 ppm (pra-industri) menjadi >420 ppm saat ini.",
  },
  {
    emoji: "🧊",
    title: "Pencairan Es Kutub",
    description: "Kenaikan suhu menyebabkan pencairan es di kutub. Kalor laten diperlukan untuk mengubah es menjadi air.",
    formula: "Q = m × L",
    formulaDesc: "Q = kalor yang diserap (Joule), m = massa es (kg), L = kalor laten lebur es (334.000 J/kg)",
    detail: "Greenland kehilangan ~280 miliar ton es per tahun — setara mengisi 112 juta kolam renang olimpiade! 🏊",
  },
  {
    emoji: "🌊",
    title: "Kenaikan Permukaan Laut",
    description: "Air mengalami pemuaian termal saat suhu meningkat, ditambah lelehan es menyebabkan volume air laut bertambah.",
    formula: "ΔV = β × V₀ × ΔT",
    formulaDesc: "ΔV = perubahan volume, β = koefisien muai volume air (2,07 × 10⁻⁴ /°C), V₀ = volume awal, ΔT = perubahan suhu",
    detail: "Permukaan laut telah naik ~20 cm sejak 1900 dan terus meningkat 3,6 mm/tahun.",
  },
  {
    emoji: "🌪️",
    title: "Cuaca Ekstrem",
    description: "Peningkatan energi termal di atmosfer menyebabkan badai lebih kuat. Energi kinetik badai proporsional dengan suhu.",
    formula: "Ek = ½ × m × v²",
    formulaDesc: "Ek = energi kinetik (Joule), m = massa udara (kg), v = kecepatan angin (m/s)",
    detail: "Setiap kenaikan 1°C suhu laut dapat meningkatkan kecepatan angin badai hingga 8% ⚠️",
  },
];

const GlobalWarmingSection = () => {
  return (
    <section id="pemanasan-global" className="py-20 bg-gradient-section-cool">
      <div className="container max-w-5xl mx-auto px-4">
        <ScrollRevealItem className="text-center mb-14">
          <span className="text-5xl mb-4 block animate-pulse-warm">🔥</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Gejala Pemanasan Global
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dampak fisika dari peningkatan suhu global terhadap lingkungan dan kehidupan di Bumi 🌏
          </p>
        </ScrollRevealItem>

        <div className="space-y-8">
          {symptoms.map((item, idx) => (
            <ScrollRevealItem key={idx} delay={idx * 0.1}>
              <div className="bg-card rounded-xl border shadow-md p-6 md:p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <span className="text-5xl shrink-0">{item.emoji}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{item.description}</p>

                    <div className="formula-box mb-3">
                      <div className="text-center text-xl font-semibold">{item.formula}</div>
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-4">
                      {item.formulaDesc}
                    </p>

                    <div className="p-4 bg-warming/10 rounded-lg border border-warming/20">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold text-warming">📊 Data:</span> {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollRevealItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalWarmingSection;
