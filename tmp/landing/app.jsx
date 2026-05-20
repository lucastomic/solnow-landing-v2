// app.jsx — main composition

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "brand",
  "density": "regular",
  "heroVariant": "a",
  "showLogos": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();

  useEffect(() => {
    document.documentElement.dataset.palette = t.palette;
    document.documentElement.dataset.density = t.density;
  }, [t.palette, t.density]);

  // Re-run reveal observer when content possibly changes
  useEffect(() => { /* no-op, sections are static */ }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero variant={t.heroVariant} />
        <PainBar />
        <Nuclear />
        <ProductAreas />
        <Pillars />
        <ForWhom />
        <Comparison />
        <Partner />
        <Pricing />
        <Onboarding />
        <SocialProof />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette" />
        <TweakColor
          label="Accent"
          value={t.palette}
          options={[
            { value: 'brand',  color: '#2272a8' },
            { value: 'aqua',   color: '#5fd9e0' },
            { value: 'lime',   color: '#bef264' },
            { value: 'amber',  color: '#f5b942' },
            { value: 'violet', color: '#b88cff' },
          ].map(o => o.color)}
          onChange={() => {}}
        />
        <TweakSelect
          label="Tono"
          value={t.palette}
          options={['brand', 'aqua', 'lime', 'amber', 'violet']}
          onChange={(v) => setTweak('palette', v)}
        />

        <TweakSection label="Layout" />
        <TweakRadio
          label="Densidad"
          value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)}
        />

        <TweakSection label="Hero" />
        <TweakRadio
          label="Copy"
          value={t.heroVariant}
          options={['a', 'b']}
          onChange={(v) => setTweak('heroVariant', v)}
        />
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
