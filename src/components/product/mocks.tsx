'use client';
import { type ReactElement } from 'react';
import { AppFrame, PhoneStage } from './appMock';
import { TpvScreen } from './tpvMock';
import { OpsBoardScreen, OpsCheckInPhones } from './opsMock';
import { StatsScreen } from './statsMock';
import { ContractPhones } from './contractsMock';
import { EnginePhones } from './engineMock';
import { PartnersScreen } from './partnersMock';
import { WhatsAppMock } from './whatsappMock';
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
