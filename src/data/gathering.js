// gathering.js – Gathering module skeleton
// Responsibility: active resource gathering tasks / automation.

const GatheringModule = (() => {
  const state = (window.gameState && window.gameState.gathering) || (window.gameState.gathering = {
    activeSkill: null,
    activeNode: null,
    progressMs: 0,
    targetMs: 0,
    lastTick: 0,
  });

  function init() { /* maybe pre-index nodes */ }
  function start(skill, node, durationMs = 3000) { state.activeSkill = skill; state.activeNode = node; state.progressMs = 0; state.targetMs = durationMs; }
  function cancel() { state.activeSkill = state.activeNode = null; state.progressMs = 0; }
  function tick(now = performance.now()) { if (!state.activeSkill) return; const delta = now - state.lastTick; if (delta < 200) return; state.lastTick = now; state.progressMs += delta; if (state.progressMs >= state.targetMs) complete(); }
  function complete() { // TODO: add gathered resources
    cancel();
  }
  function serialize() { return { activeSkill: state.activeSkill, activeNode: state.activeNode, progressMs: state.progressMs, targetMs: state.targetMs }; }
  function load(data) { if (!data) return; Object.assign(state, data); }
  function reset() { cancel(); }

  return { id: 'gathering', state, init, start, cancel, tick, serialize, load, reset };
})();

export default GatheringModule;
if (typeof window !== 'undefined') { window.gameModules = window.gameModules || {}; window.gameModules.gathering = GatheringModule; }
