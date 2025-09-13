// inventory.js – Inventory module skeleton
// Responsibility: manage player items, add/remove, capacity logic.

const InventoryModule = (() => {
  const state = (window.gameState && window.gameState.inventory) || (window.gameState.inventory = {
    items: {}, // itemId -> quantity
    capacity: 100,
  });

  function init() { /* could reconcile with bank */ }
  function add(itemId, qty = 1) { state.items[itemId] = (state.items[itemId] || 0) + qty; return state.items[itemId]; }
  function remove(itemId, qty = 1) { const have = state.items[itemId] || 0; const take = Math.min(have, qty); if (take <= 0) return 0; const left = have - take; if (left <= 0) delete state.items[itemId]; else state.items[itemId] = left; return take; }
  function count(itemId) { return state.items[itemId] || 0; }
  function has(itemId, qty = 1) { return count(itemId) >= qty; }
  function serialize() { return { items: { ...state.items }, capacity: state.capacity }; }
  function load(data) { if (!data) return; state.items = data.items || {}; state.capacity = data.capacity || 100; }
  function reset() { state.items = {}; }

  return { id: 'inventory', state, init, add, remove, count, has, serialize, load, reset };
})();

export default InventoryModule;
if (typeof window !== 'undefined') { window.gameModules = window.gameModules || {}; window.gameModules.inventory = InventoryModule; }
