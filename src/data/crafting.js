// crafting.js – Crafting module skeleton
// Responsibility: manage crafting queue, recipes, progress.

const CraftingModule = (() => {
  const state = (window.gameState && window.gameState.crafting) || (window.gameState.crafting = {
    queue: [],
    active: null,
    lastTick: 0,
  });

  function init() { /* preload recipe indexes if needed */ }

  function addToQueue(recipeId, count = 1) {
    state.queue.push({ recipeId, count, progress: 0 });
    if (!state.active) state.active = state.queue.shift();
  }

  function tick(now = performance.now()) {
    if (!state.active) return;
    const delta = now - state.lastTick;
    if (delta < 250) return; // quarter-second granularity
    state.lastTick = now;
    state.active.progress += delta;
    if (state.active.progress >= getCraftTime(state.active.recipeId)) {
      completeActive();
    }
  }

  function getCraftTime(recipeId) { return 3000; /* placeholder 3s each */ }

  function completeActive() {
    // TODO: produce items, consume mats
    state.active.count -= 1;
    if (state.active.count <= 0) state.active = null; else state.active.progress = 0;
    if (!state.active && state.queue.length) state.active = state.queue.shift();
  }

  function serialize() { return { queue: state.queue, active: state.active }; }
  function load(data) { if (!data) return; state.queue = data.queue || []; state.active = data.active || null; }
  function reset() { state.queue = []; state.active = null; }

  return { id: 'crafting', state, init, addToQueue, tick, serialize, load, reset };
})();

export default CraftingModule;
if (typeof window !== 'undefined') { window.gameModules = window.gameModules || {}; window.gameModules.crafting = CraftingModule; }
