'use client';
import { useState, useEffect, useRef, useMemo, type ReactElement } from 'react';
import { AppFrame, PhoneStage } from './appMock';
import { TpvScreen } from './tpvMock';
import { OpsBoardScreen, OpsCheckInPhones } from './opsMock';
import { StatsScreen } from './statsMock';
import { ContractPhones } from './contractsMock';
import { EnginePhones } from './engineMock';
import { PartnersScreen } from './partnersMock';
import { RecoveryScreen } from './recoveryMock';
import type { ProductKey } from '@/content/products';
import { hasSecondaryMock, type SecondaryKey } from './secondaryMocks';

/**
 * Mockups interactivos de cada área de producto.
 *
 * Vivían dentro de la sección de producto de la home; ahora que cada área
 * tiene su propia landing, viven aquí y se seleccionan por `areaKey`. Son
 * puramente ilustrativos: el texto indexable de cada página está en el
 * contenido i18n, no en estos mocks.
 */

/**
 * Mapa exhaustivo área → mockup. Al ser un `Record<ProductKey, …>`, añadir un
 * área sin mockup rompe la compilación en lugar de enseñar el gráfico de otra.
 */
const MOCKS: Record<ProductKey, () => ReactElement> = {
  tpv: () => <TpvSale />,
  contratos: () => <ContractsMock />,
  whatsapp: () => <WhatsAppMock />,
  persigue: () => <RecoveryMock />,
  colaboradores: () => <PartnersMock />,
  operacion: () => <OpsBoardMock />,
  motor: () => <EngineMock />,
  datos: () => <StatsMock />,
};

/**
 * Segunda pantalla de las áreas que tienen dos momentos distintos. En vez de
 * esconderla tras una pestaña, se enseña más abajo en la landing, junto a los
 * bullets. El `Record` va contra `SecondaryKey`, así que añadir un área a la
 * lista sin darle pantalla rompe la compilación.
 */
const SECONDARY: Record<SecondaryKey, () => ReactElement> = {
  tpv: () => <TpvHandover />,
  operacion: () => <OpsCheckInMock />,
};

export function AreaMock({ areaKey }: { areaKey: ProductKey }) {
  return MOCKS[areaKey]();
}

export function AreaMockSecondary({ areaKey }: { areaKey: ProductKey }) {
  return hasSecondaryMock(areaKey) ? SECONDARY[areaKey]() : null;
}

/* ── 5.1 TPV de mostrador ───────────────────────────────────────────────── */

function TpvSale() {
  return (
    <div style={{ position: 'relative' }}>
      <AppFrame>
        <TpvScreen step="sale" />
      </AppFrame>
      <SpeedBadge label="venta cargada en 6s" />
    </div>
  );
}

function TpvHandover() {
  return (
    <AppFrame>
      <TpvScreen step="handover" />
    </AppFrame>
  );
}

/** Píldora flotante que remata los mockups de flujo. */
function SpeedBadge({ label }: { label: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: -18,
        right: 18,
        background: 'var(--accent)',
        color: 'var(--accent-fg)',
        padding: '8px 14px',
        borderRadius: 999,
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '0.02em',
        boxShadow: '0 12px 28px -10px var(--accent)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
      }}
    >
      <span className="live-dot" style={{ background: '#fff' }} />
      {label}
    </div>
  );
}

/* ── 5.2 Venta online: agente IA en WhatsApp ────────────────────────────── */

function WhatsAppMock() {
  const script = useMemo(
    () => [
      { from: 'them', t: 'Hi! Looking to rent 2 jet skis tomorrow afternoon in Denia. Any availability?' },
      {
        from: 'us',
        t: '¡Hola! 👋 Sí, te confirmo: mañana 14 de mayo tenemos 2 Yamaha VX disponibles a las 16:00 (1h). 130€ c/u. ¿Necesitan licencia o sin licencia?',
      },
      { from: 'them', t: 'No license. Is fuel included?' },
      {
        from: 'us',
        t: 'Sin licencia perfecto, va con instructor en base. Combustible incluido para 1h. Te paso link de pago y firmas contrato en línea 👇',
      },
      { from: 'us', t: '🔗 solnow.app/pay/3F8K2  ·  260€  ·  Yamaha VX ×2  ·  16:00–17:00', kind: 'card' },
      { from: 'them', t: 'Paid ✅' },
      {
        from: 'us',
        t: 'Reserva confirmada 🛥️ Te esperamos a las 15:45 en Marina Denia, muelle 4. Lleva DNI/pasaporte. ¡Hasta mañana!',
        kind: 'final',
      },
    ],
    []
  );

  const [n, setN] = useState(1);
  const [typing, setTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (n >= script.length) {
      const r = setTimeout(() => setN(1), 6000);
      return () => clearTimeout(r);
    }
    const next = script[n];
    const showTyping = setTimeout(() => setTyping(true), 0);
    const advance = setTimeout(
      () => {
        setTyping(false);
        setN((v) => v + 1);
      },
      next.from === 'us' ? 1800 : 1200
    );
    return () => {
      clearTimeout(showTyping);
      clearTimeout(advance);
    };
  }, [n, script]);

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [n, typing]);

  return (
    <div
      className="r-fluid"
      style={{
        borderRadius: 28,
        background: '#062a3e',
        border: '1px solid #062a3e',
        boxShadow: '0 40px 100px -30px rgba(8,57,84,0.45), 0 0 0 8px rgba(8,57,84,0.06)',
        padding: 10,
        maxWidth: 380,
        marginInline: 'auto',
      }}
    >
      <div style={{ borderRadius: 22, overflow: 'hidden', background: '#0a3f5d', height: 600, display: 'flex', flexDirection: 'column' }}>
        <div
          className="mono"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px 6px',
            fontSize: 11,
            color: '#ffffff',
            opacity: 0.85,
          }}
        >
          <span>9:41</span>
          <span style={{ display: 'inline-flex', gap: 4 }}>●●●● 5G ◐</span>
        </div>
        <div
          style={{
            padding: '8px 14px',
            background: '#0e527a',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span aria-hidden style={{ color: '#c4d6e3', fontSize: 18 }}>‹</span>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4A90C0, #106695)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              color: '#ffffff',
            }}
          >
            S
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: '#ffffff' }}>MarinaJets · Reservas</div>
            <div style={{ fontSize: 11, color: '#7fe0b3', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="live-dot" style={{ width: 5, height: 5 }} />
              agente IA · responde en &lt; 30s
            </div>
          </div>
          <span style={{ color: '#c4d6e3' }}>⋮</span>
        </div>
        <div
          ref={scrollerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 12px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            background: 'linear-gradient(180deg, #08344e, #062a3e)',
          }}
        >
          {script.slice(0, n).map((m, i) => (
            <Bubble key={i} from={m.from} t={m.t} kind={m.kind} />
          ))}
          {typing && n < script.length && script[n].from === 'us' && <TypingBubble />}
        </div>
        <div
          style={{
            padding: '10px 12px',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            background: '#0e527a',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ flex: 1, padding: '8px 12px', background: '#105477', borderRadius: 999, fontSize: 12, color: '#8aa9bf' }}>Mensaje</div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#4A90C0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            ›
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ from, t, kind }: { from: string; t: string; kind?: string }) {
  const us = from === 'us';
  if (kind === 'card') {
    return (
      <div style={{ alignSelf: 'flex-end', maxWidth: '86%' }}>
        <div
          style={{
            padding: 10,
            borderRadius: 14,
            borderBottomRightRadius: 4,
            background: '#105477',
            border: '1px solid #4A90C0',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div className="mono" style={{ fontSize: 10, color: '#7ec3e8', letterSpacing: '0.06em' }}>PAGO · STRIPE</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>260€ · Yamaha VX ×2</div>
          <div className="mono" style={{ fontSize: 11, color: '#8aa9bf' }}>16:00–17:00 · 14 may</div>
          <div
            style={{
              padding: '6px 10px',
              background: '#4A90C0',
              color: '#ffffff',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              textAlign: 'center',
              marginTop: 2,
            }}
          >
            Pagar →
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        alignSelf: us ? 'flex-end' : 'flex-start',
        maxWidth: '78%',
        padding: '8px 12px',
        borderRadius: 14,
        borderBottomRightRadius: us ? 4 : 14,
        borderBottomLeftRadius: us ? 14 : 4,
        background: us ? '#106695' : '#0e527a',
        color: '#ffffff',
        fontSize: 13.5,
        lineHeight: 1.42,
        boxShadow: '0 1px 0 rgba(0,0,0,0.2)',
      }}
    >
      {t}
      {kind === 'final' && (
        <div className="mono" style={{ marginTop: 6, fontSize: 10, color: '#7ec3e8', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <span>✓✓</span> 9:42
        </div>
      )}
    </div>
  );
}

function TypingBubble() {
  return (
    <div
      style={{
        alignSelf: 'flex-end',
        padding: '8px 14px',
        borderRadius: 14,
        borderBottomRightRadius: 4,
        background: '#106695',
        display: 'inline-flex',
        gap: 4,
        alignItems: 'center',
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#cfe7f5',
            animation: `pulse-dot 1.2s ${i * 0.15}s infinite`,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}

/* ── 5.2 Contratos: la firma en el móvil del cliente ────────────────────── */

function ContractsMock() {
  return (
    <div style={{ position: 'relative' }}>
      <PhoneStage>
        <ContractPhones />
      </PhoneStage>
      <SpeedBadge label="firmado en 14s" />
    </div>
  );
}

/* ── 5.4 Modo persigue ──────────────────────────────────────────────────── */

function RecoveryMock() {
  return (
    <div style={{ position: 'relative' }}>
      <AppFrame>
        <RecoveryScreen />
      </AppFrame>
      <SpeedBadge label="+11 reservas recuperadas" />
    </div>
  );
}

/* ── 5.5 Portal de colaboradores ────────────────────────────────────────── */

function PartnersMock() {
  return (
    <AppFrame>
      <PartnersScreen />
    </AppFrame>
  );
}

/* ── 5.7 Motor de reservas: disponibilidad → pago → contrato ────────────── */

function EngineMock() {
  return (
    <PhoneStage>
      <EnginePhones />
    </PhoneStage>
  );
}

/* ── 5.6 Operación en tiempo real ───────────────────────────────────────── */

function OpsBoardMock() {
  return (
    <div style={{ position: 'relative' }}>
      <AppFrame>
        <OpsBoardScreen />
      </AppFrame>
      <SpeedBadge label="14 unidades, en vivo" />
    </div>
  );
}

function OpsCheckInMock() {
  return (
    <PhoneStage>
      <OpsCheckInPhones />
    </PhoneStage>
  );
}

/* ── 5.8 Datos unificados ───────────────────────────────────────────────── */

function StatsMock() {
  return (
    <AppFrame>
      <StatsScreen />
    </AppFrame>
  );
}
