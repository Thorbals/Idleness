// main.js — ESM bootstrap (data-first)
console.log("[BOOT] main.js loaded");

import * as items from './src/data/items.js';
import * as equipment from './src/data/equipment.js';
import * as factions from './src/data/factions.js';
import * as areas from './src/data/areas.js';
import * as nodes from './src/data/nodes.js';
import * as recipes from './src/data/recipes.js';
import * as shops from './src/data/shops.js';

// Expose legacy globals expected by monolith.js
for (const mod of [items, equipment, factions, areas, nodes, recipes, shops]) {
  for (const [k, v] of Object.entries(mod)) {
    if (k === "default") continue;
    if (!(k in window)) {
      // Define as var-like global to match legacy usage
      Object.defineProperty(window, k, { value: v, writable: false, configurable: true });
    }
  }
}

// Aggregate legacy gameData convenience
window.gameData = {
  items: items.default,
  equipment: equipment.default,
  factions: factions.default,
  areas: areas.default,
  nodes: nodes.default,
  recipes: recipes.default,
  shops: shops.default,
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