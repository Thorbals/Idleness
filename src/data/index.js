// index.js – Aggregator & lifecycle utilities for data modules
// Imports kept light; each module self-registers to window.gameModules.

import AreasModule from './areas.js';
import CombatModule from './combat.js';
import CraftingModule from './crafting.js';
import FactionsModule from './factions.js';
import InventoryModule from './inventory.js';
import NotificationsModule from './notifications.js';
import EquipmentModule from './equipment.js';
import GatheringModule from './gathering.js';
import ProductionModule from './production.js';
import ShopsModule from './shops.js';

const modules = [
  AreasModule,
  CombatModule,
  CraftingModule,
  FactionsModule,
  InventoryModule,
  NotificationsModule,
  EquipmentModule,
  GatheringModule,
  ProductionModule,
  ShopsModule,
];

function initAllModules() { modules.forEach(m => { try { m.init?.(); } catch (e) { console.warn(`Module init failed: ${m.id}`, e); } }); }
function tickAllModules(now = performance.now()) { modules.forEach(m => { try { m.tick?.(now); } catch (e) { /* ignore */ } }); }

// Simple global ticker hook (opt-in; can be replaced by game loop later)
if (typeof window !== 'undefined') {
  window.gameModules = window.gameModules || {};
  window.gameModules._list = modules;
  window.gameModules.initAllModules = initAllModules;
  window.gameModules.tickAllModules = tickAllModules;
  (function schedule() { tickAllModules(); window.requestAnimationFrame(schedule); })();
}

export default { modules, initAllModules, tickAllModules };
