# Implementation Plan: Stat Changes and Special Moves (Rest, Amnesia, Swords Dance)

This plan outlines the implementation of stat boosting moves and special status moves.

## 1. Model Updates (`src/domain/models.ts`)
*   **StatStages**: Define a new type `StatStages` to track multipliers for attack, defense, spAttack, spDefense, and speed (ranging from -6 to +6).
*   **MonsterInstance**: Add `statStages: StatStages`.
*   **Move**: Add `statChanges?: Partial<StatStages>` and `target?: 'SELF' | 'OPPONENT'`.
*   **Move**: Add `isRest?: boolean` to identify the special logic for "Rest".

## 2. Battle Logic Updates (`src/domain/battle_logic.ts`)
*   **Stat Multipliers**: Implement `getStatMultiplier(stage: number): number` (standard 2/2, 3/2, 4/2... for positive and 2/3, 2/4... for negative).
*   **Modified Stats**: Update `calculateDamage` to use stats modified by `statStages`.
*   **Speed modification**: Update `getModifiedSpeed` to account for `statStages.speed`.
*   **Stat Application**: Implement `applyStatChanges(attacker, defender, move)`:
    *   Apply changes to the correct target.
    *   Cap stages at -6 and +6.
    *   Return messages like "Attack rose sharply!".
*   **Rest Implementation**: Implement `applyRest(monster)`:
    *   Set HP to max.
    *   Cure any existing status.
    *   Set status to `SLEEP` and `statusTurns` to 2.

## 3. Service Updates (`src/application/battle_service.ts`)
*   **Move Execution**:
    *   Handle `statChanges`.
    *   Handle special `Rest` logic.
    *   Update messages for stat increases/decreases.

## 4. Verification Steps
1.  **Unit Tests**: Add tests for `getStatMultiplier`, `applyStatChanges`, and `applyRest`.
2.  **Build**: Run `npm run build`.

## 5. Commit & Push
*   Commit all changes in a single commit.
