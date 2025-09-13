// factions.js – Factions module skeleton
// Responsibility: track faction reputation / standing and unlocks.

const FactionsModule = (() => {
  const state = (window.gameState && window.gameState.factions) || (window.gameState.factions = {
    rep: {}, // factionId -> reputation number
    discovered: new Set(),
  });

  function init() {
    if (window.gameData?.factions) {
      Object.keys(window.gameData.factions).forEach(id => { if (!(id in state.rep)) state.rep[id] = 0; });
    }
  }

  function addRep(factionId, amount) { state.rep[factionId] = (state.rep[factionId] || 0) + amount; state.discovered.add(factionId); }
  function getRep(factionId) { return state.rep[factionId] || 0; }
  function tier(factionId) { const r = getRep(factionId); if (r > 1000) return 'ally'; if (r > 250) return 'friendly'; if (r >= 0) return 'neutral'; if (r > -250) return 'unfriendly'; return 'hostile'; }

  function serialize() { return { rep: { ...state.rep }, discovered: [...state.discovered] }; }
  function load(data) { if (!data) return; state.rep = data.rep || {}; state.discovered = new Set(data.discovered || []); }
  function reset() { state.rep = {}; state.discovered.clear(); }

  return { id: 'factions', state, init, addRep, getRep, tier, serialize, load, reset };
})();

export default FactionsModule;
if (typeof window !== 'undefined') { window.gameModules = window.gameModules || {}; window.gameModules.factions = FactionsModule; }
