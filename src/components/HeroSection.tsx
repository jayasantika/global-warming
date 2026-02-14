import heroImage from "@/assets/hero-energy.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const HeroSection = () => {
  const title = useScrollReveal();
  const buttons = useScrollReveal();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt="Sumber energi terbarukan dan pemanasan global"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="text-6xl mb-6 animate-float">🌍⚡</div>
        <div ref={title.ref} className={`scroll-reveal ${title.isVisible ? "visible" : ""}`}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-6 leading-tight">
            Sumber Energi &{" "}
            <span className="text-gradient-energy">Pemanasan Global</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 font-body max-w-2xl mx-auto mb-8 leading-relaxed">
            Pelajari fisika di balik sumber energi dan dampak pemanasan global terhadap planet kita 🔬🌡️
          </p>
        </div>
        <div ref={buttons.ref} className={`scroll-reveal-scale ${buttons.isVisible ? "visible" : ""} flex flex-wrap gap-4 justify-center`} style={{ transitionDelay: "0.2s" }}>
          <a href="#sumber-energi" className="px-8 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg">
            ☀️ Sumber Energi
          </a>
          <a href="#pemanasan-global" className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg">
            🌡️ Pemanasan Global
          </a>
          <a href="#kuis" className="px-8 py-3 border-2 border-primary-foreground/40 text-primary-foreground font-semibold rounded-lg hover:bg-primary-foreground/10 transition-colors">
            📝 Kuis Interaktif
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
