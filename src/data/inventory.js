// inventory.js (readable stub)
const InventoryModule = { id: "inventory" };
if (typeof window !== "undefined") {
  window.gameModules = window.gameModules || {};
  window.gameModules.inventory = InventoryModule;
}
export default InventoryModule;
// Auto-split from monolith.js
// Source section: data/inventory.js

function getOrCreateHeldGhost() {
  let ghost = document.getElementById("bank-held-ghost");
  if (!ghost) {
    ghost = document.createElement("div");
    ghost.id = "bank-held-ghost";
    document.body.appendChild(ghost);
  }
  return ghost;
}

function hideHeldGhost() {
  const ghost = document.getElementById("bank-held-ghost");
  if (ghost) ghost.classList.remove("visible");
}

function addToBank(itemId, quantity) {
  const isNewItem = !gameState.bank[itemId];
  const currentUniqueItems = Object.keys(gameState.bank).length;

  if (isNewItem && currentUniqueItems >= BANK_CAPACITY_SLOTS) {
    showNotification("Bank is full! Cannot add more unique items.", "error");
    return false;
  }

  if (!gameState.bank[itemId]) {
    gameState.bank[itemId] = 0;
  }
  gameState.bank[itemId] += quantity;

  if (isNewItem) {
    if (!gameState.bankPlacement[itemId]) {
      gameState.bankPlacement[itemId] = { slot: findNextFreeSlot() };
    }
  }

  if (gameData.items[itemId] && gameData.items[itemId].type !== "currency") {
    showNotification(`+${quantity} ${getItemName(itemId)}`, "success");
  }

  renderBank();
  populateBandageDropdown();
  populateFoodDropdown();
  return true;
}

function getTabCapacity(tabId) {
  return BANK_CAPACITY_SLOTS;
}

function removeFromBank(itemId, quantity) {
  if (!gameState.bank[itemId] || gameState.bank[itemId] < quantity) {
    return false;
  }

  gameState.bank[itemId] -= quantity;
  if (gameState.bank[itemId] <= 0) {
    delete gameState.bank[itemId];
    delete gameState.bankPlacement[itemId];
  }

  renderBank();
  populateBandageDropdown();
  populateFoodDropdown();
  return true;
}

function setupBankTabs() {
  const tabsEl = document.getElementById("bank-tabs");
  if (!tabsEl) return;
  tabsEl.innerHTML = "";
  gameState.bankTabs.forEach((tab) => {
    if (tab.id !== "all") {
      const used = getTabUsedSlots(tab.id);
      if (used === 0 && gameState.activeBankTab !== tab.id) return;
    }
    const el = document.createElement("div");
    el.className =
      "bank-tab" + (gameState.activeBankTab === tab.id ? " active" : "");
    const icon = computeTabIcon(tab.id);
    el.textContent = tab.id === "all" ? `All ${icon ? icon : ""}` : `${icon}`;
    el.title =
      tab.id === "all"
        ? `All (${getTabUsedSlots("all")}/${BANK_CAPACITY_SLOTS})`
        : `Tab ${tab.id} (${getTabUsedSlots(tab.id)})`;
    el.dataset.tabId = tab.id;
    el.onclick = () => {
      gameState.activeBankTab = tab.id;
      renderBank();
    };
    el.ondragover = (e) => {
      e.preventDefault();
      el.classList.add("drag-over");
    };
    el.ondragleave = () => el.classList.remove("drag-over");
    el.ondrop = (e) => {
      e.preventDefault();
      el.classList.remove("drag-over");
      const itemId =
        e.dataTransfer.getData("text/plain") || gameState.bankHeldItem;
      if (!itemId) return;
      moveItemToTab(itemId, tab.id);
      if (gameState.bankHeldItem === itemId) {
        gameState.bankHeldItem = null;
        hideHeldGhost();
      }
      gameState.activeBankTab = tab.id;
      renderBank();
    };
    tabsEl.appendChild(el);
  });
  const plus = document.createElement("div");
  plus.className = "bank-tab";
  plus.textContent = "+";
  plus.title = "New Tab";
  plus.dataset.plus = "true";
  plus.onclick = () => {
    const newId = createBankTab();
    gameState.activeBankTab = newId;
    renderBank();
  };
  plus.ondragover = (e) => {
    e.preventDefault();
    plus.classList.add("drag-over");
  };
  plus.ondragleave = () => plus.classList.remove("drag-over");
  plus.ondrop = (e) => {
    e.preventDefault();
    plus.classList.remove("drag-over");
    const itemId =
      e.dataTransfer.getData("text/plain") || gameState.bankHeldItem;
    if (!itemId) return;
    const newId = createBankTab(itemId);
    if (!newId) return;
    moveItemToTab(itemId, newId);
    if (gameState.bankHeldItem === itemId) {
      gameState.bankHeldItem = null;
      hideHeldGhost();
    }
    gameState.activeBankTab = newId;
    renderBank();
  };
  tabsEl.appendChild(plus);
}

function useOpenable(itemId) {
  const item = gameData.items[itemId];
  if (
    !item ||
    !item.openable ||
    !Array.isArray(item.openable.drops) ||
    item.openable.drops.length === 0
  )
    return;
  if (!gameState.bank[itemId] || gameState.bank[itemId] <= 0) return;

  const table = item.openable.drops;
  const rewardId = table[Math.floor(Math.random() * table.length)];
  if (!gameData.items[rewardId]) {
    showNotification("Open failed: invalid reward.");
    return;
  }
  removeFromBank(itemId, 1);
  addToBank(rewardId, 1);
  const name = getItemName(rewardId);
  showNotification(`You opened a ${item.name} and found ${name}!`);
  addToMessageLog(`+1 ${name} from ${item.name}`, "success");
  renderBank();
}

const BANK_CAPACITY_SLOTS = 20;

const STRUCTURE_CAPACITY = { pen: 10, coop: 12, hutch: 8, insect: 30 };
