import { AppFrame } from './appMock';
import { RecoveryChatScreen } from './recoveryMock';

/**
 * Miniaturas de las tarjetas destacadas del índice de producto.
 *
 * Son versiones estáticas de los mockups de `mocks.tsx`, escritas al ancho que
 * ocupa la tarjeta destacada. Al no tener estado ni temporizadores, no
 * arrastran `mocks.tsx` —que es cliente y pesado— al bundle de la home.
 */

/** 5.4 Modo persigue — el mensaje automático que recupera la reserva. */
export function ChaseThumb() {
  return (
    <AppFrame>
      <RecoveryChatScreen />
    </AppFrame>
  );
}
