// main.js — ESM bootstrap (data-first)
console.log("[BOOT] main.js loaded");

import * as items from './src/data/items.js';
import * as equipment from './src/data/equipment.js';
import * as factions from './src/data/factions.js';
import * as areas from './src/data/areas.js';
import * as gathering_skills from './src/data/gathering.js';
import * as crafting_skills from './src/data/crafting.js';
import * as shops from './src/data/shops.js';
import * as combat_skills from './src/data/combat.js';
import * as production_skills from './src/data/production.js';
import * as inventory from './src/data/inventory.js';
import * as ui from './src/data/ui.js';
import * as utils from './src/data/utils.js';

// Expose legacy globals expected by monolith.js
for (const mod of [items, equipment, factions, areas, gathering_skills, crafting_skills, shops, combat_skills, production_skills, inventory, ui, utils]) {
  for (const [k, v] of Object.entries(mod)) {
    if (k === "default") continue;
    if (!(k in window)) {
      // Define as var-like global to match legacy usage
      Object.defineProperty(window, k, { value: v, writable: false, configurable: true });
    }
  }
}

// Expose module objects directly for legacy code
window.gathering_skills = gathering_skills.default;
window.crafting_skills = crafting_skills.default;

// Aggregate legacy gameData convenience
window.gameData = {
  items: items.default,
  equipment: equipment.default,
  factions: factions.default,
  areas: areas.default,
  gathering_skills: gathering_skills.default,
  crafting_skills: crafting_skills.default,
  shops: shops.default,
  combat_skills: combat_skills.default,
  production_skills: production_skills.default,
};

async function importMonolith() {
  console.log("[BOOT] importing monolith.js");
  try {
    await import('./src/legacy/monolith.js');
    console.log('[BOOT] monolith imported');
    // Load Home Base (data/logic) as a single file
    await import('./src/data/homebase.js');
    console.log('[BOOT] homebase module loaded');
  } catch (err) {
    console.error("[BOOT] Failed to import monolith.js", err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', importMonolith);
} else {
  importMonolith();
}