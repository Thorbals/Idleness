// Inventory management functions

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

  if (
    gameData.items[itemId] &&
    gameData.items[itemId].type !== "currency"
  ) {
    showNotification(`+${quantity} ${getItemName(itemId)}`, "success");
  }

  renderBank();
  populateBandageDropdown();
  populateFoodDropdown();
  return true;
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

function moveItemToSlot(itemId, slotIndex) {
  if (!gameState.bank[itemId]) return { swappedWith: null };

  if (slotIndex >= BANK_CAPACITY_SLOTS) {
    showNotification("Slot outside bank capacity.");
    return { swappedWith: null };
  }

  const current = gameState.bankPlacement[itemId] || { slot: findNextFreeSlot() };
  const prevSlot = typeof current.slot === 'number' ? current.slot : null;
  const conflictEntry = Object.entries(gameState.bankPlacement).find(([id, p]) => id !== itemId && p.slot === slotIndex && (gameState.bank[id] || 0) > 0);

  if (conflictEntry) {
    const [otherId, other] = conflictEntry;
    current.slot = slotIndex;
    gameState.bankPlacement[itemId] = current;
    const fallback = findNextFreeSlot();
    const destinationSlot = (prevSlot !== null && prevSlot !== slotIndex) ? prevSlot : fallback;
    other.slot = destinationSlot;
    gameState.bankPlacement[otherId] = other;
    return { swappedWith: otherId };
  } else {
    gameState.bankPlacement[itemId] = { slot: slotIndex };
    return { swappedWith: null };
  }
}

function findNextFreeSlot() {
  const taken = new Set(
    Object.entries(gameState.bankPlacement)
      .filter(([id, p]) => gameState.bank[id] > 0)
      .map(([_, p]) => p.slot)
  );
  for (let i = 0; i < BANK_CAPACITY_SLOTS; i++) {
    if (!taken.has(i)) return i;
  }
  return 0;
}

function showHeldGhost(itemId) {
  const ghost = getOrCreateHeldGhost();
  const item = gameData.items[itemId];
  const icon = item?.icon || "??";
  const qty = gameState.bank[itemId] || 0;
  ghost.innerHTML = `<span style="font-size:16px; margin-right:6px;">${icon}</span><span>${item?.name || itemId} (${qty})</span>`;
  ghost.style.display = "block";
}

function hideHeldGhost() {
  const ghost = document.getElementById("bank-held-ghost");
  if (ghost) ghost.style.display = "none";
}

function getOrCreateHeldGhost() {
  let ghost = document.getElementById("bank-held-ghost");
  if (!ghost) {
    ghost = document.createElement("div");
    ghost.id = "bank-held-ghost";
    ghost.style.cssText = "position:absolute; pointer-events:none; z-index:9999; display:none; background:#111111; border:1px solid rgba(255,255,255,0.1); border-radius:4px; padding:4px 6px; color:#f8f9fa; font-size:12px; box-shadow:0 2px 6px rgba(0,0,0,0.3);";
    document.body.appendChild(ghost);
  }
  return ghost;
}

function useOpenable(itemId) {
  const item = gameData.items[itemId];
  if (!item || !item.openable || !Array.isArray(item.openable.drops) || item.openable.drops.length === 0) return;
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

// Export functions to window for global access
window.addToBank = addToBank;
window.removeFromBank = removeFromBank;
window.moveItemToSlot = moveItemToSlot;
window.findNextFreeSlot = findNextFreeSlot;
window.showHeldGhost = showHeldGhost;
window.hideHeldGhost = hideHeldGhost;
window.getOrCreateHeldGhost = getOrCreateHeldGhost;
window.useOpenable = useOpenable;