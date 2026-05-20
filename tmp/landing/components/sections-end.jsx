// sections-end.jsx — onboarding, social proof, FAQ, CTA, footer

// ─── 9. Onboarding timeline ───────────────────────────────────────────
function Onboarding() {
  const steps = [
    {
      day: 'Día 1',
      label: 'Kickoff',
      h: 'Mapeamos tu operación actual',
      points: [
        'Sesión de 90 minutos',
        'Identificamos cuellos de botella y flujos críticos',
        'Particularidades de tu negocio',
      ],
      you: 'Estar 90 min en una llamada',
    },
    {
      day: 'Días 2–4',
      label: 'Configuración',
      h: 'Cargamos flota, bases, precios y extras',
      points: [
        'Configuramos contratos y plantillas',
        'Entrenamos al agente de IA con tu información real',
        'Sin downtime en tu operación actual',
      ],
      you: 'Mandarnos fotos y revisar precios',
    },
    {
      day: 'Días 5–6',
      label: 'Web e integraciones',
      h: 'Conectamos web, OTAs y pagos',
      points: [
        'Motor de reservas integrado a tu web',
        'Viator · Click&Boat · Civitatis · Stripe',
        'Migración de datos históricos',
      ],
      you: 'Darnos acceso a tus cuentas',
    },
    {
      day: 'Día 7',
      label: 'Go-live',
      h: 'Capacitación y activación',
      points: [
        'Sesión con tu equipo',
        'Sistema en producción',
        'Primera reserva real a través de Solnow',
      ],
      you: 'Avisar al equipo que hoy es el día',
    },
  ];

  const qa = [
    {
      q: '¿Qué pasa con mi web actual?',
      a: 'Tres opciones: la conservamos y le integramos el motor de reservas, la rediseñamos si necesita refresh, o partimos de cero. Lo decidimos en el kickoff.',
    },
    {
      q: '¿Y mis datos históricos?',
      a: 'Migramos clientes, reservas históricas y configuración desde Excel, Google Calendar u otro software. Sin pérdida de datos.',
    },
    {
      q: '¿Qué pasa si en plena temporada algo se rompe?',
      a: 'Soporte directo con el equipo, no ticket genérico. En temporada alta estamos disponibles fuera de horario. Es parte del modelo de partner.',
    },
  ];

  return (
    <section id="implementacion" className="section" style={{ paddingBlock: 120 }}>
      <div className="container">
        <SectionHead
          eyebrow="09 · Implementación"
          title={<>En 7 días tu operación digital corre sobre Solnow</>}
          lede="Nosotros hacemos el 95% del trabajo de implementación. Vos seguís operando."
        />

        {/* Horizontal timeline */}
        <div style={{ position: 'relative', marginBottom: 56 }}>
          {/* connector line */}
          <div aria-hidden style={{
            position: 'absolute', top: 30, left: '6%', right: '6%', height: 1,
            background: 'linear-gradient(90deg, transparent, var(--line) 8%, var(--line) 92%, transparent)',
          }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {steps.map((s, i) => (
              <div key={i} className="reveal" style={{
                '--reveal-delay': `${i * 100}ms`,
                display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 60 }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'var(--bg)',
                    border: '1px solid ' + (i < 4 ? 'var(--accent-dim)' : 'var(--line)'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 0 6px var(--bg), 0 0 0 7px var(--line-soft)',
                    flexShrink: 0,
                  }}>
                    <span className="mono" style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 500 }}>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.day}</div>
                    <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.012em' }}>{s.label}</div>
                  </div>
                </div>
                <div className="card" style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h3 className="h-3" style={{ fontSize: 17, lineHeight: 1.25 }}>{s.h}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    {s.points.map((p, j) => (
                      <li key={j} style={{
                        fontSize: 13.5, color: 'var(--muted)', display: 'grid',
                        gridTemplateColumns: '14px 1fr', gap: 8,
                      }}>
                        <span style={{ color: 'var(--accent-dim)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>—</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{
                    marginTop: 8, padding: '10px 12px',
                    borderRadius: 8, background: 'oklch(1 0 0 / 0.02)',
                    border: '1px dashed var(--line)',
                    fontSize: 12, color: 'var(--fg-2)',
                  }}>
                    <span className="mono" style={{ color: 'var(--muted)', letterSpacing: '0.06em', fontSize: 10 }}>TU TRABAJO ·</span><br />
                    {s.you}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical questions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 64 }}>
          {qa.map((it, i) => (
            <div key={i} className="reveal" style={{
              '--reveal-delay': `${i * 80}ms`,
              padding: 24, borderRadius: 14,
              border: '1px solid var(--line-soft)',
              background: 'oklch(1 0 0 / 0.015)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em' }}>OBJ.{String(i+1).padStart(2,'0')}</span>
              </div>
              <h3 className="h-3" style={{ fontSize: 17, marginBottom: 10 }}>{it.q}</h3>
              <p style={{ margin: 0, fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.55 }}>{it.a}</p>
            </div>
          ))}
        </div>

        <div className="reveal" style={{
          marginTop: 40, padding: '20px 24px',
          borderRadius: 12, border: '1px solid var(--accent-dim)',
          background: 'linear-gradient(90deg, var(--accent-bg), transparent)',
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <span className="serif" style={{ fontSize: 19, flex: 1, color: 'var(--fg)' }}>
            ¿Querés ver cómo sería tu implementación específica? Te montamos una demo con tu flota real.
          </span>
          <a className="btn btn-primary" href="#cta" style={{ padding: '11px 18px' }}>
            Pedir demo
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── 10. Social proof ─────────────────────────────────────────────────
function SocialProof() {
  const testimonials = [
    {
      quote: 'Pasamos de 8 a 22 reservas/día sin contratar a nadie. La IA cierra el 70% de las consultas de WhatsApp antes de que abramos.',
      who: 'Marc Aznar',
      role: 'CEO · MarinaJets',
      kpi: '+175%',
      kpiLabel: 'reservas/día',
    },
    {
      quote: 'Por primera vez en cinco años veo la operación de las tres bases en una sola pantalla. Y lo veo desde el móvil.',
      who: 'Helena Costa',
      role: 'Operations · BaleariJet',
      kpi: '3 → 1',
      kpiLabel: 'paneles → 1',
    },
    {
      quote: 'Quité tres herramientas, dos hojas de cálculo y una persona en backoffice. Solnow paga su % solo con eso.',
      who: 'Daniel Ríos',
      role: 'Fundador · CostaSports',
      kpi: '−40%',
      kpiLabel: 'coste admin.',
    },
  ];

  const logos = ['MarinaJets', 'BaleariJet', 'CostaSports', 'AquaRent', 'NauticBoost', 'JetMallorca', 'Marbella Riders', 'IbizaSplash'];

  return (
    <section className="section" style={{ paddingBlock: 120 }}>
      <div className="container">
        <SectionHead
          eyebrow="10 · Prueba social"
          title={<>Operadores que ya operan con Solnow</>}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 56 }}>
          {testimonials.map((t, i) => (
            <div key={i} className="reveal card" style={{
              '--reveal-delay': `${i * 90}ms`,
              padding: 28, display: 'flex', flexDirection: 'column', gap: 18,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{
                  fontSize: 38, fontWeight: 500, color: 'var(--accent)',
                  letterSpacing: '-0.03em', lineHeight: 1,
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                }}>{t.kpi}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>{t.kpiLabel}</span>
              </div>
              <p style={{ margin: 0, fontSize: 15.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>
                <span className="serif" style={{ color: 'var(--accent)', fontSize: 24, lineHeight: 0, marginRight: 4 }}>“</span>
                {t.quote}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'oklch(0.30 0.04 240)', border: '1px solid var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600, color: 'var(--fg-2)',
                }}>{t.who.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t.who}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logo wall — marquee */}
        <div className="reveal" style={{
          padding: '24px 0',
          borderBlock: '1px solid var(--line-soft)',
          background: 'oklch(1 0 0 / 0.012)',
        }}>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted-2)', letterSpacing: '0.12em', textAlign: 'center', marginBottom: 16 }}>
            OPERADORES CON SOLNOW EN PRODUCCIÓN
          </div>
          <div className="marquee">
            <div className="marquee-track">
              {[...logos, ...logos].map((l, i) => (
                <span key={i} style={{
                  fontSize: 18, fontWeight: 600, color: 'var(--muted)',
                  letterSpacing: '-0.014em', opacity: 0.7,
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-dim)' }} />
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Seals row */}
        <div className="reveal" style={{
          display: 'flex', justifyContent: 'space-between', gap: 24,
          marginTop: 40, flexWrap: 'wrap',
        }}>
          {[
            ['LANZADERA', 'Empresa acelerada'],
            ['VIATOR',    'Partner OTAs'],
            ['CLICK&BOAT','Integración nativa'],
            ['CIVITATIS', 'Integración nativa'],
            ['STRIPE',    'Verified partner'],
          ].map(([n, s]) => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)', letterSpacing: '-0.012em' }}>{n}</span>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted-2)', letterSpacing: '0.06em' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 11. FAQ ───────────────────────────────────────────────────────────
function FAQ() {
  const faqs = [
    {
      q: '¿Cuánto cuesta Solnow?',
      a: 'Cobramos % sobre las reservas que generamos a través de nuestra plataforma + coste por conversación de IA. No hay cuota fija ni setup fee. Modelo alineado: si no facturás, no cobramos.',
    },
    {
      q: '¿Cómo funciona el modelo de comisión?',
      a: 'Aplicamos una comisión sobre el GMV de las reservas procesadas por Solnow (motor + WhatsApp IA + OTAs). El detalle exacto se acuerda según tu volumen y mix de canales en el kickoff.',
    },
    {
      q: '¿Funciona si no tengo internet estable en la base?',
      a: 'Sí. La app de embarque funciona offline-first: registra escaneos QR, firma y check-in sin conexión y sincroniza cuando vuelve la señal. Crítico para muelles y zonas con cobertura intermitente.',
    },
    {
      q: '¿Qué pasa con mis datos si dejo Solnow?',
      a: 'Tus datos son tuyos. Te entregamos un export completo (clientes, reservas, contratos, facturas) en CSV + JSON, sin trabas ni periodos de retención.',
    },
    {
      q: '¿Manejan contratos para menores?',
      a: 'Sí. Plantillas específicas con campos para tutor legal, firma del padre/madre, validación de documentación. Conforme a normativa española y compatible con regulaciones de capitanía.',
    },
    {
      q: '¿Se integra con Viator / Click&Boat / Civitatis?',
      a: 'Integraciones nativas con las tres. Inventario sincronizado en tiempo real, sin overbookings entre canales. Stripe para pagos. Otras OTAs bajo demanda.',
    },
    {
      q: '¿Puedo configurar precios distintos por temporada?',
      a: 'Sí. Precios por temporada, día de semana, hora del día, duración y modelo de moto. Reglas combinables y revisables sin tocar código.',
    },
    {
      q: '¿Cómo se factura: por reserva o mensual?',
      a: 'Factura mensual con detalle por reserva, comisión y conversaciones de IA. Liquidación automática vía Stripe Connect a tu cuenta el mes siguiente.',
    },
  ];

  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section" style={{ paddingBlock: 120 }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <SectionHead
          eyebrow="11 · FAQ"
          title={<>Preguntas frecuentes</>}
        />
        <div style={{ borderTop: '1px solid var(--line-soft)' }}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderBottom: '1px solid var(--line-soft)' }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    width: '100%', textAlign: 'left',
                    display: 'grid', gridTemplateColumns: '36px 1fr 32px', gap: 20,
                    alignItems: 'center', padding: '22px 4px',
                    transition: 'color .15s',
                  }}
                >
                  <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)', letterSpacing: '0.08em' }}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.014em', color: isOpen ? 'var(--accent)' : 'var(--fg)' }}>{f.q}</span>
                  <span style={{
                    justifySelf: 'end',
                    width: 28, height: 28, borderRadius: '50%',
                    border: '1px solid ' + (isOpen ? 'var(--accent-dim)' : 'var(--line)'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isOpen ? 'var(--accent)' : 'var(--muted)',
                    transition: 'transform .25s ease',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    fontSize: 16,
                  }}>+</span>
                </button>
                <div style={{
                  display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr',
                  transition: 'grid-template-rows .35s cubic-bezier(.2,.7,.2,1)',
                }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      padding: '0 56px 22px',
                      maxWidth: '64ch',
                      color: 'var(--muted)', fontSize: 15, lineHeight: 1.55,
                    }}>{f.a}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 12. Final CTA ────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section id="cta" style={{
      position: 'relative',
      paddingBlock: 140,
      overflow: 'hidden',
      borderTop: '1px solid var(--line-soft)',
      background:
        'radial-gradient(900px 600px at 80% 50%, oklch(0.40 0.13 200 / 0.28), transparent 65%),' +
        'radial-gradient(700px 500px at 0% 50%, oklch(0.30 0.10 240 / 0.20), transparent 65%),' +
        'linear-gradient(180deg, var(--bg), oklch(0.11 0.018 240))',
    }}>
      <div aria-hidden className="dotgrid" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'center' }}>
          <div className="reveal">
            <span className="eyebrow">12 · Demo</span>
            <h2 className="h-display" style={{ margin: '16px 0 24px', fontSize: 'clamp(38px, 5.4vw, 72px)' }}>
              ¿Te suena alguno de <em className="serif" style={{ color: 'var(--accent)' }}>estos problemas?</em>
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Tu operación tocó techo y sumar reservas significa sumar caos.',
                'Perdiste el control de lo que pasa en cada base cuando no estás físicamente.',
                'Cada finde de pico es una carrera contra el reloj y un riesgo legal.',
              ].map((t, i) => (
                <li key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 14, alignItems: 'start', fontSize: 17, color: 'var(--fg-2)' }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 6,
                    border: '1px solid var(--accent-dim)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent)', fontSize: 13,
                    transform: 'translateY(2px)',
                  }}>↳</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <a className="btn btn-primary" href="#" style={{ fontSize: 16, padding: '15px 22px' }}>
                Pedir demo personalizada con tu flota real
                <svg width="16" height="16" viewBox="0 0 14 14"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
            <p className="mono" style={{ marginTop: 18, fontSize: 12, color: 'var(--muted)', letterSpacing: '0.04em' }}>
              Te montamos la demo con tus motos, tus bases y tu volumen real · 30 minutos · sin compromiso
            </p>
          </div>

          {/* Mini calendar booking widget */}
          <div className="reveal" style={{ '--reveal-delay': '120ms' }}>
            <DemoCalendar />
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoCalendar() {
  const [picked, setPicked] = useState(15);
  const [time, setTime] = useState('11:00');
  const days = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const times = ['09:30', '11:00', '14:00', '16:30'];

  return (
    <div className="card" style={{
      padding: 26, borderRadius: 18,
      background: 'linear-gradient(180deg, oklch(0.20 0.024 240), oklch(0.16 0.022 240))',
      border: '1px solid var(--line)',
      boxShadow: '0 30px 80px -30px oklch(0 0 0 / 0.7)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em' }}>AGENDAR DEMO</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span className="live-dot" /><span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>disponible esta semana</span>
        </div>
      </div>
      <h3 className="h-3" style={{ fontSize: 21, marginBottom: 18, letterSpacing: '-0.016em' }}>30 minutos con un partner. Tu flota, tu volumen.</h3>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>MAY · 2026</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={{ width: 22, height: 22, borderRadius: 6, border: '1px solid var(--line)', color: 'var(--muted)' }}>‹</button>
          <button style={{ width: 22, height: 22, borderRadius: 6, border: '1px solid var(--line)', color: 'var(--muted)' }}>›</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginBottom: 18 }}>
        {days.map((d) => (
          <button key={d} onClick={() => setPicked(d)} style={{
            padding: '10px 0', borderRadius: 8,
            background: picked === d ? 'var(--accent)' : 'oklch(1 0 0 / 0.02)',
            border: '1px solid ' + (picked === d ? 'var(--accent)' : 'var(--line-soft)'),
            color: picked === d ? 'oklch(0.12 0.02 240)' : 'var(--fg-2)',
            fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em',
            cursor: 'default',
          }}>{d}</button>
        ))}
      </div>

      <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', marginBottom: 8 }}>HORA · CET</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 20 }}>
        {times.map((t) => (
          <button key={t} onClick={() => setTime(t)} style={{
            padding: '10px 0', borderRadius: 8,
            background: time === t ? 'oklch(1 0 0 / 0.06)' : 'oklch(1 0 0 / 0.02)',
            border: '1px solid ' + (time === t ? 'var(--accent-dim)' : 'var(--line-soft)'),
            color: time === t ? 'var(--accent)' : 'var(--fg-2)',
            fontSize: 13, letterSpacing: '-0.01em', fontFamily: 'var(--font-mono)',
            cursor: 'default',
          }}>{t}</button>
        ))}
      </div>

      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 18px', fontSize: 15 }}>
        Confirmar · 15 may · {time}
      </button>
    </div>
  );
}

// ─── 13. Footer ───────────────────────────────────────────────────────
function Footer() {
  const cols = [
    {
      h: 'Producto',
      items: [
        ['Agente IA WhatsApp', '#'],
        ['Motor de reservas', '#'],
        ['Operación tiempo real', '#'],
        ['Contratos digitales', '#'],
        ['Libro de registros', '#'],
      ],
    },
    {
      h: 'Recursos',
      items: [
        ['Casos de éxito', '#'],
        ['Blog', '#'],
        ['Integraciones', '#'],
        ['Cambios de versión', '#'],
        ['Estado del sistema', '#'],
      ],
    },
    {
      h: 'Empresa',
      items: [
        ['Sobre Solnow', '#'],
        ['Modelo de partner', '#'],
        ['Carreras', '#'],
        ['Contacto', '#'],
      ],
    },
    {
      h: 'Legal',
      items: [
        ['Privacidad', '#'],
        ['Términos', '#'],
        ['GDPR', '#'],
        ['Cookies', '#'],
      ],
    },
  ];
  return (
    <footer style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 80, paddingBottom: 36, background: 'oklch(0.11 0.018 240)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 40, marginBottom: 56 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 16 }}>
              <img src="assets/solnow-wordmark-white.png" alt="Solnow" style={{ height: 26, width: 'auto', display: 'block' }} />
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: '36ch', margin: 0 }}>
              El sistema operativo para empresas de motos de agua con alto volumen. Hecho en Valencia, operado en el Mediterráneo.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
              <select className="mono" style={{
                background: 'oklch(1 0 0 / 0.02)', border: '1px solid var(--line)',
                color: 'var(--fg-2)', padding: '7px 10px', borderRadius: 6,
                fontSize: 12, letterSpacing: '0.04em',
              }} defaultValue="es">
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇬🇧 English</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--muted-2)', marginBottom: 14 }}>{c.h.toUpperCase()}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.items.map(([l, h]) => (
                  <li key={l}><a href={h} style={{ fontSize: 13.5, color: 'var(--fg-2)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--fg-2)'}
                  >{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 28, borderTop: '1px solid var(--line-soft)', flexWrap: 'wrap', gap: 16 }}>
          <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted-2)', letterSpacing: '0.04em' }}>
            © 2026 Solnow S.L. · CIF B-12345678 · Valencia, ES
          </div>
          <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted-2)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="live-dot" />
            Todos los sistemas operativos
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Onboarding, SocialProof, FAQ, FinalCTA, Footer });
