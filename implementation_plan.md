# Implementation Plan: Rename 'Pokemon' to 'Monster'

This plan outlines the changes required to replace all occurrences of the term "Pokemon" (and its Japanese equivalent "ポケモン") with "Monster" (and "モンスター") in order to align the game terminology with the requested name.

## 1. Target Files and Changes

### A. Code & UI Elements
*   **[src/main.ts](file:///home/root11/ドキュメント/MyPrograms/palbato/src/main.ts)**
    *   Change comment: `// Pokemon-like stat calculation` -> `// Monster-like stat calculation`
    *   Change UI text: `じぶんの ポケモンを えらんで！` -> `じぶんの モンスターを えらんで！`
    *   Change UI text: `あいての ポケモンを えらんで！` -> `あいての モンスターを えらんで！`
    *   Change UI label: `{ label: 'ポケモン', action: 'MON' }` -> `{ label: 'モンスター', action: 'MON' }`

*   **[src/domain/battle_logic.ts](file:///home/root11/ドキュメント/MyPrograms/palbato/src/domain/battle_logic.ts)**
    *   Change comment: `// Simplified Pokemon damage formula` -> `// Simplified Monster damage formula`

*   **[public/index.html](file:///home/root11/ドキュメント/MyPrograms/palbato/public/index.html)**
    *   Change title tag: `<title>Palbato - Pokemon Style Battle</title>` -> `<title>Palbato - Monster Style Battle</title>`

*   **[package.json](file:///home/root11/ドキュメント/MyPrograms/palbato/package.json)**
    *   Change description: `"Pokemon FireRed style turn-based battle game"` -> `"Monster FireRed style turn-based battle game"`

*   **[request.md](file:///home/root11/ドキュメント/MyPrograms/palbato/request.md)**
    *   Change references of "ポケモン" to "モンスター" to maintain consistency.

## 2. Verification Steps

1.  **Test**: Run unit tests with `npm run test` to verify no functionality is broken.
2.  **Build**: Run `npm run build` to compile the TypeScript changes into `public/assets/main.js`.
3.  **Visual Check**: Re-run the build artifact and verify the game starts and compiles cleanly.

## 3. Commit & Push
*   Once changes are verified, we will request user permission to commit and push all modifications to the repository in a single commit, per the project guidelines in [GEMINI.md](file:///home/root11/ドキュメント/MyPrograms/palbato/GEMINI.md).
