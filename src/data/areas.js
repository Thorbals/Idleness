// areas.js – Areas module skeleton
// Responsibility: manage area definitions, current area selection, progression, unlocking logic.

const AreasModule = (() => {
  const state = (window.gameState && window.gameState.areas) || (window.gameState.areas = {
    current: null,
    unlocked: new Set(),
    visited: new Set(),
  });

  function init({ autoUnlockFirst = true } = {}) {
    if (!window.gameData || !Array.isArray(window.gameData.areas)) return;
    if (autoUnlockFirst && window.gameData.areas.length && state.unlocked.size === 0) {
      state.unlocked.add(window.gameData.areas[0].id);
    }
  }

  function select(areaId) {
    if (!state.unlocked.has(areaId)) return false;
    state.current = areaId;
    state.visited.add(areaId);
    return true;
  }

  function unlock(areaId) { state.unlocked.add(areaId); }
  function isUnlocked(areaId) { return state.unlocked.has(areaId); }

  function serialize() {
    return { current: state.current, unlocked: [...state.unlocked], visited: [...state.visited] };
  }
  function load(data) {
    if (!data) return;
    state.current = data.current || null;
    state.unlocked = new Set(data.unlocked || []);
    state.visited = new Set(data.visited || []);
  }
  function reset() { state.current = null; state.unlocked.clear(); state.visited.clear(); }

  return { id: 'areas', state, init, select, unlock, isUnlocked, serialize, load, reset };
})();

export default AreasModule;
if (typeof window !== 'undefined') { window.gameModules = window.gameModules || {}; window.gameModules.areas = AreasModule; }
