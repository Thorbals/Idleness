// main.js — ESM bootstrap (data-first)
console.log("[BOOT] main.js loaded");

// First import data lists
import * as items from './src/lists/items_list.js';
import { UPGRADES_DATA } from './src/lists/items_list.js';
import { ITEMS_DATA } from './src/lists/items_list.js';
import * as equipment from './src/lists/equipment_list.js';
import { EQUIPMENT_DATA } from './src/lists/equipment_list.js';
import * as factions from './src/lists/factions_list.js';
import { FACTION_CONFIG, ENEMIES_DATA, NAME_TO_FACTION_ID } from './src/lists/factions_list.js';
import * as areas from './src/lists/areas_list.js';
import { AREAS_DATA } from './src/lists/areas_list.js';
import * as gathering_skills from './src/lists/gathering_list.js';
import * as crafting_skills from './src/lists/crafting_list.js';
import * as shops from './src/lists/shops_list.js';
import * as combat_skills from './src/lists/combat_list.js';
import { COMBAT_SKILLS_DATA } from './src/lists/combat_list.js';
import * as production_skills from './src/lists/production_list.js';
import { PRODUCTION_SKILLS_DATA } from './src/lists/production_list.js';

// Then import core UI and game modules
import './src/data/ui.js'; // Import UI functions first
import './src/data/game.js'; // Import game module for showPage function
import './src/data/notifications.js'; // Import notifications for showNotification function
import './src/data/inventory.js'; // Import inventory management

// Then import feature modules
import './src/data/survivors.js';
import './src/data/areas.js';
import './src/data/combat.js';
import './src/data/crafting.js';
import './src/data/equipment.js';
import './src/data/factions.js';
import './src/data/gathering.js';
import './src/data/shops.js';
import './src/data/production.js'; // Import production module for farming functions
// Expose legacy globals expected by the modular game system
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

// Expose skills data objects needed by homebase.js
Object.defineProperty(window, 'COMBAT_SKILLS_DATA', { value: COMBAT_SKILLS_DATA, writable: false });
Object.defineProperty(window, 'PRODUCTION_SKILLS_DATA', { value: PRODUCTION_SKILLS_DATA, writable: false });
Object.defineProperty(window, 'NAME_TO_FACTION_ID', { value: NAME_TO_FACTION_ID, writable: false });

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
  // Add skills object needed by areas.js and other modules
  skills: {
    gathering_skills: gathering_skills.default,
    crafting_skills: crafting_skills.default,
    combat_skills: combat_skills.default,
    production_skills: production_skills.default
  },
  // Add enemies reference needed by combat module
  enemies: ENEMIES_DATA,
  // Add empty bank object if needed
  bank: {}
};

async function importGameModules() {
  console.log("[BOOT] importing game modules");
  try {
    // First ensure combat.js is fully loaded to make renderEnemies available
    const combatModule = await import('./src/data/combat.js');
    console.log('[BOOT] combat module loaded');

    // Then UI module for core UI functions
    const uiModule = await import('./src/data/ui.js');
    console.log('[BOOT] UI module loaded');

    // Load the game module for showPage and other core functions
    const gameModule = await import('./src/data/game.js');
    console.log('[BOOT] game module loaded');

    // Load Home Base (data/logic) as a single file
    await import('./src/data/homebase.js');
    console.log('[BOOT] homebase module loaded');

    // Initialize game modules
    gameModule.default?.initAllModules?.();
    console.log('[BOOT] structured data modules initialized');

    // Inject faction CSS after everything is loaded
    if (typeof window.injectFactionCSS === 'function') {
      window.injectFactionCSS();
      console.log('[BOOT] Faction CSS injected');
    }

    // Initialize the game properly by calling the initGame function from equipment.js
    if (typeof window.initGame === 'function') {
      window.initGame();
      console.log('[BOOT] Game initialization completed');
    } else {
      console.error('[BOOT] initGame function not found!');
    }
  } catch (err) {
    console.error("[BOOT] Failed to import game modules", err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', importGameModules);
} else {
  importGameModules();
}