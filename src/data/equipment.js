// equipment.js – Equipment module skeleton
// Responsibility: manage equipped items, stat aggregation.

const EquipmentModule = (() => {
  const state = (window.gameState && window.gameState.equipment) || (window.gameState.equipment = {
    helmet: null, armor: null, gloves: null, boots: null, weapon: null, offhand: null, accessory1: null, accessory2: null,
  });

  function init() { /* compute derived stats if needed */ }
  function equip(slot, item) { if (!(slot in state)) return false; state[slot] = item; return true; }
  function unequip(slot) { if (!(slot in state)) return null; const it = state[slot]; state[slot] = null; return it; }
  function get(slot) { return state[slot] || null; }
  function all() { return { ...state }; }
  function serialize() { return all(); }
  function load(data) { if (!data) return; Object.keys(state).forEach(k => { state[k] = data[k] || null; }); }
  function reset() { Object.keys(state).forEach(k => state[k] = null); }

  return { id: 'equipment', state, init, equip, unequip, get, all, serialize, load, reset };
})();

export default EquipmentModule;
if (typeof window !== 'undefined') { window.gameModules = window.gameModules || {}; window.gameModules.equipment = EquipmentModule; }
