# Implementation Plan: Status Ailments (Sleep, Poison, Paralysis)

This plan outlines the implementation of status ailments (Sleep, Poison, Paralysis) in the battle system.

## 1. Model Updates (`src/domain/models.ts`)
*   **MonsterInstance**: Add `statusTurns?: number` to track the duration of effects like Sleep.
*   **Move**: Add `statusEffect?: StatusEffect` and `statusChance?: number` (0.0 to 1.0) to define what status an attack can inflict.

## 2. Battle Logic Updates (`src/domain/battle_logic.ts`)
*   **Speed Modification**: Implement `getModifiedSpeed(monster)` to reduce speed by 50% when paralyzed.
*   **Movement Check**: Implement `canMove(monster)` to handle:
    *   **Sleep**: Skip turn if `statusTurns > 0`. Wake up when `statusTurns` reaches 0.
    *   **Paralysis**: 25% chance to skip turn.
*   **Status Application**: Implement `applyStatus(attacker, defender, move)` to handle the logic of inflicting status effects, considering:
    *   Probability (`statusChance`).
    *   Existing status (cannot overlap).
    *   Type immunities (e.g., Poison types cannot be poisoned).
*   **End of Turn Processing**: Implement `processEndOfTurn(monster)` to handle:
    *   **Poison**: Take 1/8 of max HP as damage.
    *   **Sleep**: Decrement `statusTurns`.

## 3. Service Updates (`src/application/battle_service.ts`)
*   **Turn Order**: Use `getModifiedSpeed` to determine which monster moves first.
*   **Move Execution**: 
    *   Call `canMove` before processing a move.
    *   Call `applyStatus` after damage calculation.
*   **Turn End**: Add an end-of-turn phase to process poison damage and status recovery.

## 4. Verification Steps
1.  **Unit Tests**: Add tests in `src/domain/battle_logic.test.ts` for all new logic functions.
2.  **Manual Verification**: Run `npm run build` and verify the game behavior in the browser (if possible, though the focus is on logic).
3.  **Build**: Ensure `npm run build` completes successfully.

## 5. Commit & Push
*   Once verified, commit all changes including `src/` and `public/assets/main.js`.
