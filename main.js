// main.js — ESM bootstrap (data-first)
console.log("[BOOT] main.js loaded");

import * as items from './src/lists/items_list.js';
import * as equipment from './src/lists/equipment_list.js';
import * as factions from './src/lists/factions_list.js';
import * as areas from './src/lists/areas_list.js';
import * as gathering_skills from './src/lists/gathering_list.js';
import * as crafting_skills from './src/lists/crafting_list.js';
import * as shops from './src/lists/shops_list.js';
import * as combat_skills from './src/lists/combat_list.js';
import * as production_skills from './src/lists/production_list.js';
import './src/data/survivors.js'; // ensure survivors system loads

// Expose legacy globals expected by monolith.js
for (const mod of [items, equipment, factions, areas, gathering_skills, crafting_skills, shops, combat_skills, production_skills]) {
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
    // Load structured data modules (new architecture)
    const dataIndex = await import('./src/data/index.js');
    dataIndex.default?.initAllModules?.();
    console.log('[BOOT] structured data modules initialized');
  } catch (err) {
    console.error("[BOOT] Failed to import monolith.js", err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', importMonolith);
} else {
  importMonolith();
}