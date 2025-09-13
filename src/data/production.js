// production.js – Production module skeleton
// Responsibility: passive production buildings / workshops output over time.

const ProductionModule = (() => {
  const state = (window.gameState && window.gameState.production) || (window.gameState.production = {
    buildings: {}, // id -> {level, progress, rate}
    lastTick: 0,
  });

  function init() { /* seed from gameState.workshops maybe */ }
  function addBuilding(id, { level = 1, rate = 1 } = {}) { if (!state.buildings[id]) state.buildings[id] = { level, progress: 0, rate }; }
  function tick(now = performance.now()) { const delta = now - state.lastTick; if (delta < 1000) return; state.lastTick = now; const seconds = delta / 1000; Object.values(state.buildings).forEach(b => { b.progress += b.rate * seconds; if (b.progress >= 1) { const units = Math.floor(b.progress); b.progress -= units; // TODO: add produced items
      } }); }
  function serialize() { return { buildings: { ...state.buildings } }; }
  function load(data) { if (!data) return; state.buildings = data.buildings || {}; }
  function reset() { state.buildings = {}; }

  return { id: 'production', state, init, addBuilding, tick, serialize, load, reset };
})();

export default ProductionModule;
if (typeof window !== 'undefined') { window.gameModules = window.gameModules || {}; window.gameModules.production = ProductionModule; }
