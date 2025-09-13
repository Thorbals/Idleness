// shops.js – Shops module skeleton
// Responsibility: shop inventories, purchase / refresh logic.

const ShopsModule = (() => {
  const state = (window.gameState && window.gameState.shops) || (window.gameState.shops = {
    inventories: {}, // shopId -> [{itemId, price, qty}]
    lastRefresh: 0,
    refreshIntervalMs: 60_000,
  });

  function init() { refreshAll(); }
  function refreshAll() { state.lastRefresh = Date.now(); /* TODO populate from list data */ }
  function maybeRefresh() { if (Date.now() - state.lastRefresh > state.refreshIntervalMs) refreshAll(); }
  function buy(shopId, itemId, qty = 1) { /* TODO: integrate with inventory & cost */ return false; }
  function serialize() { return { inventories: state.inventories, lastRefresh: state.lastRefresh }; }
  function load(data) { if (!data) return; state.inventories = data.inventories || {}; state.lastRefresh = data.lastRefresh || 0; }
  function reset() { state.inventories = {}; }

  return { id: 'shops', state, init, refreshAll, maybeRefresh, buy, serialize, load, reset };
})();

export default ShopsModule;
if (typeof window !== 'undefined') { window.gameModules = window.gameModules || {}; window.gameModules.shops = ShopsModule; }
