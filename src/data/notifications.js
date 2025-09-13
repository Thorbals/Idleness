// notifications.js – Notifications module skeleton
// Responsibility: central queue for in-game notifications (decouples from direct DOM calls).

const NotificationsModule = (() => {
  const state = (window.gameState && window.gameState.notifications) || (window.gameState.notifications = {
    queue: [],
    history: [],
  });

  function init() { /* attach to UI bridge if present */ }
  function push(message, { level = 'info', ttl = 4000 } = {}) { const entry = { id: crypto.randomUUID?.() || Date.now()+Math.random(), t: Date.now(), message, level, ttl }; state.queue.push(entry); state.history.push(entry); maybeShow(entry); return entry.id; }
  function maybeShow(entry) { if (typeof window.showNotification === 'function') window.showNotification(entry.message, entry.level); }
  function tick() { const now = Date.now(); state.queue = state.queue.filter(e => now - e.t < e.ttl); }
  function serialize() { return { history: state.history.slice(-200) }; }
  function load(data) { if (!data) return; state.history = data.history || []; }
  function reset() { state.queue = []; state.history = []; }

  return { id: 'notifications', state, init, push, tick, serialize, load, reset };
})();

export default NotificationsModule;
if (typeof window !== 'undefined') { window.gameModules = window.gameModules || {}; window.gameModules.notifications = NotificationsModule; }
