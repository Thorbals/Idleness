// combat.js – Combat module skeleton
// Responsibility: orchestrate combat loop, enemy generation, damage resolution.

const CombatModule = (() => {
  const state = (window.gameState && window.gameState.combat) || (window.gameState.combat = {
    inCombat: false,
    currentEnemy: null,
    enemyHp: 0,
    enemyMaxHp: 0,
    log: [],
    lastAttackTime: 0,
  });

  function init() { /* hook timers if needed */ }

  function start(enemy) {
    if (!enemy) return false;
    state.inCombat = true;
    state.currentEnemy = enemy;
    state.enemyHp = enemy.hp;
    state.enemyMaxHp = enemy.hp;
    pushLog(`Encountered ${enemy.name} (Lv ${enemy.level})`);
    return true;
  }

  function end(victory) {
    if (!state.inCombat) return;
    pushLog(victory ? 'Victory!' : 'Defeated...');
    state.inCombat = false;
    state.currentEnemy = null;
  }

  function pushLog(msg) { state.log.push({ t: Date.now(), msg }); if (state.log.length > 100) state.log.shift(); }

  function tick(now = performance.now()) {
    if (!state.inCombat || !state.currentEnemy) return;
    if (now - state.lastAttackTime < 1000) return; // 1s pace baseline
    state.lastAttackTime = now;
    // Placeholder damage model using existing helpers when available
    const dmg = Math.max(1, Math.floor((window.gameState?.player?.attack || 5) / 2));
    state.enemyHp = Math.max(0, state.enemyHp - dmg);
    pushLog(`You hit ${state.currentEnemy.name} for ${dmg}`);
    if (state.enemyHp <= 0) end(true);
  }

  function serialize() { return { inCombat: state.inCombat, currentEnemy: state.currentEnemy, enemyHp: state.enemyHp, enemyMaxHp: state.enemyMaxHp, log: state.log.slice(-25) }; }
  function load(data) { if (!data) return; Object.assign(state, data); }
  function reset() { end(false); state.log = []; }

  return { id: 'combat', state, init, start, end, tick, serialize, load, reset };
})();

export default CombatModule;
if (typeof window !== 'undefined') { window.gameModules = window.gameModules || {}; window.gameModules.combat = CombatModule; }
