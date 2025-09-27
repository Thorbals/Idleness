# Monolith.js Migration Plan

This document captures a phased roadmap for decomposing `src/legacy/monolith.js` into the modern modules under `src/data`. Each step is ordered from least intrusive to most, so we can ship incremental refactors with confidence. After completing a step and validating behaviour, delete the migrated code from `monolith.js` to keep the legacy file shrinking over time.

## Snapshot of Remaining Responsibilities

| Block | Approx. Lines | Purpose | Suggested Destination |
| --- | --- | --- | --- |
| DOM ready helpers (`onReady`, mojibake fix, tab activation, save/load buttons) | 30-120 | DOM bootstrap and accessibility tweaks | `src/data/interface.js` (utility section) |
| Combat math helpers (`critPctToRating`, `scaleEnemyForLevel`, damage/interval calculators) | 223-740 | Numeric combat calculations used everywhere | `src/data/combat.js` (pure helpers export) |
| Data bootstrap (`loadGameData`, `applyDungeonRevamp`, `ensureAllItemIcons`, loading screen toggles) | 390-520 | Populate `gameData` and apply revamps | `src/data/gamedata.js` |
| Equipment management (`getEquipmentSlot`, `equipItem`, `unequipItem`, `updatePlayerStats`, tooltips) | 510-940 | Equip/unequip flow and tooltip rendering | Logic → `src/data/equipment.js`, tooltip/UI → `src/data/interface.js` |
| Game lifecycle (`initGame`, `setupEventListeners`, `startGameLoop`, `updateGame`) | 1000-1360 | Entry point wiring, timers, key listeners | `main.js` (bootstrap) & `src/data/interface.js` (event bindings) |
| Rarity & gathering helpers (`calculateRarityChance`, `rollForRarityDrops`, `completeAction`) | 1360-1600 | Loot tables, crafting/gathering completion | `src/data/gathering.js` (shared helpers) |
| Combat runtime (`updateCombat`, `performPlayerAttack`, `performEnemyAttack`, autoheal, escape) | 1640-1950 | Active combat loop | `src/data/combat.js` |
| Progression utilities (`addXP`, `calculateLevel`, XP thresholds, unlock checks) | 1970-2080 | Skill XP and unlock gating | `src/data/gamedata.js` |
| Passive systems (`updatePassiveSystems`, farming/animal timers, harvest functions) | 2090-2200 | Periodic skill systems | `src/data/production.js` or `src/data/homebase.js` |
| Bank & inventory (`addToBank`, `removeFromBank`, `renderBank`, ghost item, move slots) | 2238-3600 | Storage logic & UI | Logic → `src/data/inventory.js`, render/UI → `src/data/interface.js` |
| Skill UI (`updateUI`, `updateSkillInfo`, `showSkillPage`, tabs) | 2317-3700 | HUD updates and navigation | `src/data/interface.js` |
| Persistence (`saveGame`, `loadGame`, `resetGame`) | 3708-3930 | Local storage operations | `src/data/gamedata.js` (new persistence section) |
| Gathering/crafting UI (`showSkillGatheringPage`, `selectRecipe`, `startCrafting`, `cancelCrafting`) | 3980-4700 | Skill panels and crafting loop | `src/data/gathering.js` & `src/data/crafting.js` |
| Farming UI (`showFarmingInterface`, seeds, progress bars) | 4730-5000 | Farming management | `src/data/homebase.js` |
| Shops (`initializeShop`, `showShopTab`, `showGeneralShopItems`, purchase logic) | 5010-5600 | Shop rendering and purchases | `src/data/shops.js` |
| Animal care (`purchaseAnimal`, `showAnimalCareInterface`, `placeAnimal`) | 5920-6260 | Pens/animal timers | `src/data/homebase.js` |
| Home base grid & placement system | 6290-7876 | Base builder grid and visuals | `src/data/homebase.js` (already consolidating) |

## Migration Order (Least → Most Intrusive)

| Step | Focus | Target Module(s) | Why It’s Low Risk | Verification |
| --- | --- | --- | --- | --- |
| 1 | Remove duplicate combat math helpers (`critPctToRating`, `scaleEnemyForLevel`, damage helpers) | `combat.js` already exports equivalents | Functions already exist in `combat.js`; drop legacy duplicates and rewire references | Run combat smoke test (start fight) |
| 2 | DOM ready + button/tab wiring | `interface.js` | Pure DOM wiring; no gameplay effect | Click save/load/reset buttons, tab navigation |
| 3 | Loading screen + data bootstrap (`loadGameData`, `ensureAllItemIcons`) | `gamedata.js` | Straight data prep with minimal side-effects | Reload page, confirm data loads, console free of errors |
| 4 | Notification & tooltip utilities (`showNotification`, `createItemTooltip`, etc.) | `interface.js` | Mostly UI-only, already partially ported | Trigger notifications, hover equipment/bank items |
| 5 | Inventory logic (`addToBank`, `removeFromBank`, `moveItemToSlot`, ghost) | `inventory.js` | Highly unitised, existing module stub matches behaviour | Add/remove items, drag slots |
| 6 | Equipment lifecycle (`equipItem`, `unequipItem`, `updatePlayerStats`) | `equipment.js` + `gamedata.js` for stat aggregation | Depends on inventory helpers (Step 5) already migrated | Equip/unequip items, verify stats update |
| 7 | UI refreshers (`updateUI`, `updateSkillInfo`, page switching) | `interface.js` | Requires inventory/equipment moved first | Change tabs, watch HUD update |
| 8 | Persistence operations (`saveGame`, `loadGame`, `resetGame`) | `gamedata.js` | Leans on UI + inventory to be modular | Save, reload, reset sequences |
| 9 | Gathering completion + rarity helpers (`completeAction`, `rollForRarityDrops`) | `gathering.js` | Uses inventory + notifications now modular | Run one gathering action, verify drops |
|10 | Combat runtime (`updateCombat`, attack loops, autoheal) | `combat.js` | Depends on equipment stats (Step 6) | Fight enemy, autoheal toggle |
|11 | Area & enemy rendering (`renderAreas`, `renderEnemies`, `startCombat`, dungeons) | `interface.js` + `combat.js` | Interacts with combat/gathering; move after their helpers | Enter area, start fight, finish dungeon |
|12 | Crafting UI + loops (`showSkillCraftingPage`, `startCrafting`) | `crafting.js` | Relies on inventory & notifications | Craft queued recipe, ensure queues continue |
|13 | Farming & animal care (`showFarmingInterface`, `harvestPlot`, `plantSeed`, pets) | `homebase.js` | Larger surface but self-contained | Plant/harvest crop, manage animals |
|14 | Shops UI (`initializeShop`, `showShopTab`, purchases) | `shops.js` | Touches inventory and notifications; migrate once core systems are modular | Buy item, ensure bank updates |
|15 | Home base grid engine (entire inline script #4) | `homebase.js` | Most complex portion with custom DOM state; migrate last | Place/remove building, verify walls/fog |

## Safety Checklist Per Step

1. **Copy first, then switch references** — import functions from target module and ensure callers use them before deleting legacy definitions.
2. **Keep globals in sync** — if legacy code expects `window.fn`, re-export from the module until all callsites are ESM-aware.
3. **Regression tests** — at minimum run through the verification checklist above. Add lightweight Jest-style unit tests if a module can be exercised without DOM.
4. **Git hygiene** — delete the legacy block in a separate commit *after* passing tests. Avoid touching unrelated sections to keep diffs reviewable.
5. **Telemetry** — sprinkle `console.assert` or debug logs temporarily when moving complex logic (especially combat or placement systems), then remove once validated.

## Next Actions

- ✅ Step 1 complete: combat helper duplicates removed in favour of `src/data/combat.js` exports.
- ✅ Step 2 complete: DOM ready hooks, button wiring, and tab setup now live in `src/data/interface.js`.
- Start Step 3 by migrating `loadGameData`, loading screen toggles, and related helpers into `src/data/gamedata.js`.
- Log progress in CHANGELOG or project notes so future work picks up at the next step.
- Once the final step is complete, `monolith.js` should shrink to a thin shim that can be deleted entirely.
