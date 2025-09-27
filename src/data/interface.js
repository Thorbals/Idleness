// UI rendering functions

let domFixObserver = null;

function onDocumentReady(fn) {
  if (typeof document === "undefined") return;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
}

function maybeFixMojibake(text) {
  if (!text || typeof text !== "string") return text;
  if (text.indexOf("�") === -1 && text.indexOf("�") === -1) return text;
  try {
    return decodeURIComponent(escape(text));
  } catch (_err) {
    return text;
  }
}

function walkAndFix(node) {
  if (!node || !node.ownerDocument || !node.ownerDocument.createTreeWalker) {
    return;
  }
  const showText = typeof NodeFilter !== "undefined" ? NodeFilter.SHOW_TEXT : 4;
  const walker = node.ownerDocument.createTreeWalker(node, showText, null);
  const updates = [];
  while (walker.nextNode()) {
    const current = walker.currentNode;
    const fixed = maybeFixMojibake(current.nodeValue);
    if (fixed && fixed !== current.nodeValue) {
      updates.push([current, fixed]);
    }
  }
  updates.forEach(([textNode, value]) => {
    textNode.nodeValue = value;
  });
}

function observeAndFix(root) {
  if (!root || typeof MutationObserver !== "function") return;
  if (domFixObserver) domFixObserver.disconnect();
  domFixObserver = new MutationObserver((list) => {
    for (const mutation of list) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 3) {
            const fixed = maybeFixMojibake(node.nodeValue);
            if (fixed !== node.nodeValue) node.nodeValue = fixed;
          } else if (node.nodeType === 1) {
            walkAndFix(node);
          }
        });
      } else if (mutation.type === "characterData") {
        const txt = mutation.target.nodeValue;
        const fixed = maybeFixMojibake(txt);
        if (fixed !== txt) mutation.target.nodeValue = fixed;
      }
    }
  });
  domFixObserver.observe(root, {
    childList: true,
    characterData: true,
    subtree: true,
  });
}

function setupInterfaceButtons() {
  const buttonMap = [
    ["btn-save", "saveGame"],
    ["btn-load", "loadGame"],
    ["btn-reset", "resetGame"],
    ["back-to-areas", "goBackToAreas"],
  ];
  buttonMap.forEach(([btnId, fnName]) => {
    const button = document.getElementById(btnId);
    if (!button || button.dataset.interfaceBound === "1") return;
    button.dataset.interfaceBound = "1";
    button.addEventListener("click", () => {
      const handler =
        typeof window !== "undefined" && window ? window[fnName] : undefined;
      if (typeof handler === "function") {
        handler();
      } else {
        console?.warn?.(
          `Button action '${fnName}' is not available when '${btnId}' was clicked.`
        );
      }
    });
  });
}

function setupTabs() {
  document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
    if (tablist.dataset.interfaceTabsBound === "1") return;
    tablist.dataset.interfaceTabsBound = "1";
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    function activate(tab) {
      tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle("active", isActive);
        t.setAttribute("aria-selected", isActive ? "true" : "false");
        const panelId = t.getAttribute("aria-controls");
        const panel = panelId ? document.getElementById(panelId) : null;
        if (panel) {
          panel.classList.toggle("active", isActive);
          panel.hidden = !isActive;
        }
      });
    }
    tablist.addEventListener("click", (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab && tabs.includes(tab)) activate(tab);
    });
    tablist.addEventListener("keydown", (event) => {
      const currentIndex = tabs.indexOf(document.activeElement);
      if (currentIndex < 0) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        const next = tabs[(currentIndex + 1) % tabs.length];
        next.focus();
        activate(next);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const prev = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
        prev.focus();
        activate(prev);
      }
    });
    tabs.forEach((tab) => {
      const panelId = tab.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      const initiallyActive = tab.classList.contains("active");
      tab.setAttribute("aria-selected", initiallyActive ? "true" : "false");
      if (panel) {
        panel.classList.toggle("active", initiallyActive);
        panel.hidden = !initiallyActive;
      }
    });
  });
}

function initializeInterfaceDom() {
  if (typeof document === "undefined") return;
  onDocumentReady(() => {
    if (!document.body) return;
    walkAndFix(document.body);
    observeAndFix(document.body);
    setupInterfaceButtons();
    setupTabs();
  });
}

let itemTooltip = null;
let equipmentTooltip = null;

function renderBank() {
  if (gameState.bankHeldItem && (!gameState.bank[gameState.bankHeldItem] || gameState.bank[gameState.bankHeldItem] <= 0)) {
    gameState.bankHeldItem = null;
    hideHeldGhost();
  }

  const grid = document.getElementById("bank-grid");
  grid.innerHTML = "";

  const allItemIds = Object.keys(gameState.bank).filter(id => gameState.bank[id] > 0);

  const maxSlots = BANK_CAPACITY_SLOTS;
  const placed = new Array(maxSlots).fill(null);
  allItemIds.forEach(id => {
    const p = gameState.bankPlacement[id] || { slot: 0 };
    let s = Math.max(0, Math.min(maxSlots - 1, p.slot || 0));
    if (!placed[s]) {
      placed[s] = id;
    }
  });
  allItemIds.forEach(id => {
    if (!placed.includes(id)) {
      for (let s = 0; s < maxSlots; s++) {
        if (!placed[s]) {
          placed[s] = id;
          gameState.bankPlacement[id] = { slot: s };
          break;
        }
      }
    }
  });

  for (let i = 0; i < maxSlots; i++) {
    const slot = document.createElement("div");
    slot.className = "bank-slot";
    slot.dataset.slotIndex = String(i);

    slot.ondragover = (e) => e.preventDefault();
    slot.ondrop = (e) => {
      e.preventDefault();
      const itemId = e.dataTransfer.getData("text/plain") || gameState.bankHeldItem;
      if (!itemId) return;
      const result = moveItemToSlot(itemId, i);
      if (result && result.swappedWith) {
        gameState.bankHeldItem = result.swappedWith;
        showHeldGhost(result.swappedWith);
      } else {
        if (gameState.bankHeldItem === itemId) {
          gameState.bankHeldItem = null;
          hideHeldGhost();
        }
      }
      renderBank();
    };

    const itemId = placed[i];
    if (itemId) {
      const item = gameData.items[itemId];
      const quantity = gameState.bank[itemId];
      if (item && quantity > 0) {
        slot.classList.add("has-item");

        if ((item.type === "food" || item.type === "cooked_food") && item.healAmount) {
          slot.style.cursor = "pointer";
          slot.style.borderColor = item.type === "cooked_food" ? "#2ecc71" : "var(--brand)";
          slot.onclick = (evt) => {
            evt.stopPropagation();
            useFood(itemId);
          };
        } else if (item.usable) {
          const canOpen = item.openable && Array.isArray(item.openable.drops) && item.openable.drops.length > 0;
          if (canOpen || itemId === "birds_nest") {
            slot.style.cursor = "pointer";
            slot.style.borderColor = "#1a7f37";
            slot.onclick = (evt) => {
              evt.stopPropagation();
              if (canOpen) useOpenable(itemId);
              else if (itemId === "birds_nest") useBirdNest();
            };
          }
        } else if (["weapon", "helmet", "armor", "gloves", "boots", "offhand", "accessory"].includes(item.type)) {
          slot.style.cursor = "pointer";
          slot.style.borderColor = canEquipItem(itemId) ? "#238636" : "var(--brand)";
          slot.onclick = (evt) => {
            evt.stopPropagation();
            evt.preventDefault();
            hideItemTooltip();
            hideEquipmentTooltip();
            slot.removeAttribute('title'); // Clear native tooltip
            if (canEquipItem(itemId)) {
              equipItem(itemId);
              renderBank();
            }
          };
        }

        slot.innerHTML = `
            <div style="font-size: 20px;">${item.icon || "??"}</div>
            <div class="item-name" style="font-size: 10px; color: #f8f9fa; text-align: center; margin-top: 2px; word-wrap: break-word; line-height: 1.1;">${item.name}</div>
            <div class="item-quantity">${quantity}</div>
          `;

        let tooltipText = `${item.name} (${quantity})`;
        if (item.healAmount) {
          tooltipText += ` - Click to heal ${item.healAmount} HP`;
          slot.title = tooltipText;
        } else if (item.usable) {
          const canOpen = item.openable && Array.isArray(item.openable.drops) && item.openable.drops.length > 0;
          if (canOpen) tooltipText += ` - Click to open`;
          else if (itemId === "birds_nest") tooltipText += ` - Click to open`;
          slot.title = tooltipText;
        } else if (["weapon", "helmet", "armor", "gloves", "boots", "offhand", "accessory"].includes(item.type)) {
          if (canEquipItem(itemId)) {
          } else {
            tooltipText += ` - Requires level ${item.level || 1}`;
            slot.title = tooltipText; // Only show native tooltip for items that can't be equipped
          }
        } else {
          slot.title = tooltipText; // Default case for other items
        }
        slot.dataset.itemId = itemId;
        slot.addEventListener('mouseenter', (e) => {
          if (["weapon", "helmet", "armor", "gloves", "boots", "offhand", "accessory"].includes(item.type)) {
            hideItemTooltip();
            hideEquipmentTooltip();
            showItemTooltip(e, itemId);
          }
        });

        slot.addEventListener('mouseleave', () => {
          if (["weapon", "helmet", "armor", "gloves", "boots", "offhand", "accessory"].includes(item.type)) {
            hideItemTooltip();
          }
        });
        slot.addEventListener('mousedown', () => {
          if (["weapon", "helmet", "armor", "gloves", "boots", "offhand", "accessory"].includes(item.type)) {
            hideItemTooltip();
            hideEquipmentTooltip();
          }
        });

        slot.draggable = true;
        slot.ondragstart = (e) => {
          e.dataTransfer.setData("text/plain", itemId);
        };
        slot.addEventListener('click', (evt) => {
          if (evt.defaultPrevented) return;

          const held = gameState.bankHeldItem;
          if (!held) {
            gameState.bankHeldItem = itemId;
            showHeldGhost(itemId);
          } else {
            const result = moveItemToSlot(held, i);
            if (result && result.swappedWith) {
              gameState.bankHeldItem = result.swappedWith;
              showHeldGhost(result.swappedWith);
            } else {
              gameState.bankHeldItem = null;
              hideHeldGhost();
            }
            if (!gameState.bankRenderScheduled) {
              gameState.bankRenderScheduled = true;
              setTimeout(() => {
                renderBank();
                gameState.bankRenderScheduled = false;
              }, 0);
            }
          }
        });
      }
    }

    grid.appendChild(slot);
  }
}

function useBirdNest() {
  const nonForagingSeeds = [
    "melon_seeds", "cucumber_seeds", "watermelon_seeds", "squash_seeds", "pumpkin_seeds", "zucchini_seeds", "turnip_seeds", "ramps_bulb", "shallot_bulb", "clover_seeds", "sumac_seeds", "basil_seeds", "chives_seeds", "cilantro_seeds", "dill_seeds", "marjoram_seeds", "oregano_seeds", "parsley_seeds", "rosemary_seeds", "sage_seeds", "savory_seeds", "tarragon_seeds", "thyme_seeds", "shiso_seeds"
  ];
  const seedId = nonForagingSeeds[Math.floor(Math.random() * nonForagingSeeds.length)];
  addToBank(seedId, 1);
  showNotification("You found a " + getItemName(seedId) + " in the bird nest!");
  removeFromBank("birds_nest", 1);
  updateUI();
}

function useFood(itemId) {
  const item = gameData.items[itemId];
  if (!item || !item.healAmount || !gameState.bank[itemId]) return;

  if (gameState.player.hp >= gameState.player.maxHp) {
    showNotification("You are already at full health!");
    return;
  }

  removeFromBank(itemId, 1);
  gameState.player.hp = Math.min(
    gameState.player.maxHp,
    gameState.player.hp + item.healAmount
  );
  showNotification(`Healed ${item.healAmount} HP with ${item.name}`);
}

// Tooltip functions

function hideItemTooltip() {
  if (itemTooltip) {
    itemTooltip.remove();
    itemTooltip = null;
  }
}

function hideEquipmentTooltip() {
  if (equipmentTooltip) {
    equipmentTooltip.remove();
    equipmentTooltip = null;
  }
}

function showItemTooltip(event, itemId) {
  hideItemTooltip();

  const item = gameData.items[itemId];
  if (!item) {
    console.warn(`Item not found: ${itemId}`);
    return;
  }

  const tooltip = createItemTooltip(item);
  if (!tooltip) return;

  document.body.appendChild(tooltip);

  const rect = event.target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const showOnLeft = rect.right + 10 + tooltipRect.width > windowWidth;
  if (showOnLeft) {
    tooltip.style.left = `${rect.left - tooltipRect.width - 10}px`;
  } else {
    tooltip.style.left = `${rect.right + 10}px`;
  }
  let topPosition = rect.top + window.scrollY;
  const wouldOverflowBottom = rect.top + tooltipRect.height > windowHeight;

  if (wouldOverflowBottom) {
    topPosition = rect.bottom + window.scrollY - tooltipRect.height;
    topPosition = Math.max(window.scrollY, topPosition);
  }

  tooltip.style.top = `${topPosition}px`;

  setTimeout(() => {
    tooltip.classList.add("show");
  }, 10);

  itemTooltip = tooltip;
}

function createItemTooltip(item) {
  if (!item) {
    console.warn('createItemTooltip called with null item');
    return null;
  }

  const tooltip = document.createElement("div");
  tooltip.className = "equipment-tooltip";

  let content = `<h4>${item.name}</h4>`;
  content += `<div class="item-type">${item.type.charAt(0).toUpperCase() + item.type.slice(1)
    }</div>`;

  if (item.sellPrice) {
    content += `<div class="stat-line"><span>Sell Price:</span><span class="stat-positive">${item.sellPrice} credits</span></div>`;
  }

  if (item.level) {
    content += `<div class="stat-line"><span>Level Required:</span><span>${item.level}</span></div>`;
  }

  if (item.attack) {
    content += `<div class="stat-line"><span>Attack:</span><span class="stat-positive">+${item.attack}</span></div>`;
  }

  if (item.defense) {
    content += `<div class="stat-line"><span>Defense:</span><span class="stat-positive">+${item.defense}</span></div>`;
  }

  if (item.hp) {
    content += `<div class="stat-line"><span>HP:</span><span class="stat-positive">+${item.hp}</span></div>`;
  }
  if (item.accuracy) {
    content += `<div class="stat-line"><span>Accuracy:</span><span class="stat-positive">+${item.accuracy}</span></div>`;
  }
  if (item.critical) {
    content += `<div class="stat-line"><span>Critical:</span><span class="stat-positive">+${item.critical}</span></div>`;
  }
  if (item.criticalPct) {
    content += `<div class="stat-line"><span>Critical Chance:</span><span class="stat-positive">+${item.criticalPct}%</span></div>`;
  }
  if (item.armorPen) {
    content += `<div class="stat-line"><span>Armor Pen:</span><span class="stat-positive">+${item.armorPen}%</span></div>`;
  }
  if (item.attackSpeed) {
    const val = item.attackSpeed; const cls = val >= 0 ? 'stat-positive' : 'stat-negative';
    content += `<div class="stat-line"><span>Attack Speed:</span><span class="${cls}">${val > 0 ? '+' : ''}${val}%</span></div>`;
  }
  if (item.statusResistance) {
    content += `<div class="stat-line"><span>Status Resist:</span><span class="stat-positive">+${item.statusResistance}%</span></div>`;
  }
  if (item.critResistance) {
    content += `<div class="stat-line"><span>Crit Resist:</span><span class="stat-positive">+${item.critResistance}%</span></div>`;
  }
  if (item.armorPenResistance) {
    content += `<div class="stat-line"><span>Armor Pen Resist:</span><span class="stat-positive">+${item.armorPenResistance}%</span></div>`;
  }
  if (item.elementalStatus) {
    content += `<div class="stat-line"><span>Elemental Status:</span><span class="stat-positive">+${item.elementalStatus}%</span></div>`;
  }

  tooltip.innerHTML = content;
  return tooltip;
}

function addToMessageLog(message, type = "info") {
  showNotification(message);

  const className = type === "error" ? "log-error" : type === "success" ? "log-success" : "";
  addGatheringLog(message, className);
}

function addGatheringLog(message, className = "") {
  const log = document.getElementById("activity-log-content");
  if (!log) return;

  const entry = document.createElement("div");
  entry.className = `log-entry ${className}`;
  entry.textContent = message;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;

  while (log.children.length > 50) {
    log.removeChild(log.firstChild);
  }
}

function getBandageIds() {
  const ids = Object.keys(gameData.items || {}).filter(id => /_bandage$/.test(id));
  return ids;
}

function getBandageHealAmount(itemId) {
  const map = {
    jute_bandage: 10,
    improved_jute_bandage: 18,
    cotton_bandage: 20,
    improved_cotton_bandage: 30,
    linen_bandage: 35,
    improved_linen_bandage: 50,
    ramie_bandage: 60,
    improved_ramie_bandage: 80,
    wool_bandage: 90,
    improved_wool_bandage: 120,
    silk_bandage: 140,
    improved_silk_bandage: 180,
  };
  return map[itemId] || 15;
}

function populateBandageDropdown() {
  const sel = document.getElementById('select-bandage');
  if (!sel) return;
  const bandageIds = getBandageIds().filter(id => (gameState.bank[id] || 0) > 0);
  sel.innerHTML = '';
  const any = document.createElement('option'); any.value = ''; any.textContent = bandageIds.length ? 'Auto (best available)' : 'No bandages';
  sel.appendChild(any);
  bandageIds.sort((a, b) => getBandageHealAmount(b) - getBandageHealAmount(a));
  for (const id of bandageIds) {
    const opt = document.createElement('option');
    const it = gameData.items[id];
    const qty = gameState.bank[id] || 0;
    const heal = getBandageHealAmount(id);
    opt.value = id; opt.textContent = heal > 0 ? `${it.name} (+${heal} HP) x${qty}` : `${it.name} x${qty}`;
    sel.appendChild(opt);
  }
  if (gameState.combat.selectedBandageId && bandageIds.includes(gameState.combat.selectedBandageId)) {
    sel.value = gameState.combat.selectedBandageId;
  } else {
    sel.value = '';
  }
  sel.onchange = () => {
    gameState.combat.selectedBandageId = sel.value || null;
  };
}

function populateFoodDropdown() {
  const sel = document.getElementById('select-food');
  if (!sel) return;
  const foods = Object.entries(gameData.items || {}).filter(([id, it]) => (it.type === 'food' || it.type === 'cooked_food') && it.healAmount && (gameState.bank[id] || 0) > 0);
  sel.innerHTML = '';
  const any = document.createElement('option'); any.value = ''; any.textContent = foods.length ? 'Auto (best available)' : 'No food';
  sel.appendChild(any);
  foods.sort((a, b) => (b[1].healAmount || 0) - (a[1].healAmount || 0));
  for (const [id, it] of foods) {
    const qty = gameState.bank[id] || 0;
    const opt = document.createElement('option');
    opt.value = id; opt.textContent = `${it.name} (+${it.healAmount} HP) x${qty}`;
    sel.appendChild(opt);
  }
  if (gameState.combat.selectedFoodId && foods.find(([id]) => id === gameState.combat.selectedFoodId)) {
    sel.value = gameState.combat.selectedFoodId;
  } else {
    sel.value = '';
  }
  sel.onchange = () => {
    gameState.combat.selectedFoodId = sel.value || null;
  };
}

function showNotification(message, type = "info", duration = 3000) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.remove("notification-success", "notification-error", "notification-warning", "notification-info");
  switch (type) {
    case "error":
      notification.classList.add("notification-error");
      break;
    case "success":
      notification.classList.add("notification-success");
      break;
    case "warning":
      notification.classList.add("notification-warning");
      break;
    default:
      notification.classList.add("notification-info");
  }

  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, duration);
}

function hideAllTooltips() {
  hideEquipmentTooltip();
  hideItemTooltip();
}

function showPage(pageId) {
  hideAllTooltips();

  document.querySelectorAll(".page-content").forEach((page) => {
    page.style.display = "none";
  });

  const page = document.getElementById(`${pageId}-page`);
  if (page) {
    page.style.display = "block";

    if (pageId === "shop") {
      initializeShop();
    } else if (pageId === "homebase") {
      initializeHomeBase();
    }
  }

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  if (["areas", "homebase", "bank", "shop"].includes(pageId)) {
    const navItem = document.querySelector(`[data-page="${pageId}"]`);
    if (navItem) {
      navItem.classList.add("active");
    }
  }
}

function goBackToAreas() {
  gameState.currentAction = null;
  currentSkill = null;

  gameState.combat.inCombat = false;
  gameState.combat.currentEnemy = null;

  showPage("areas");

  document
    .querySelectorAll(
      ".resource-card.active, .enemy-item.active, .dungeon-card.active"
    )
    .forEach((item) => {
      item.classList.remove("active");
    });

  document.querySelectorAll(".progress-bar").forEach((bar) => {
    bar.style.display = "none";
  });
}

function showLoadingScreen() {
  document.getElementById("loading-screen").style.display = "flex";
  document.getElementById("areas-page").style.display = "none";
}

function hideLoadingScreen() {
  document.getElementById("loading-screen").style.display = "none";
  showPage("areas");
}

function initializeHomeBase() { }

// Export functions to window for global access
window.renderBank = renderBank;
window.useBirdNest = useBirdNest;
window.useFood = useFood;
window.hideItemTooltip = hideItemTooltip;
window.hideEquipmentTooltip = hideEquipmentTooltip;
window.showItemTooltip = showItemTooltip;
window.addToMessageLog = addToMessageLog;
window.addGatheringLog = addGatheringLog;
window.getBandageIds = getBandageIds;
window.getBandageHealAmount = getBandageHealAmount;
window.populateBandageDropdown = populateBandageDropdown;
window.populateFoodDropdown = populateFoodDropdown;
window.showNotification = showNotification;
window.hideAllTooltips = hideAllTooltips;
window.showPage = showPage;
window.goBackToAreas = goBackToAreas;
window.showLoadingScreen = showLoadingScreen;
window.hideLoadingScreen = hideLoadingScreen;
window.initializeHomeBase = initializeHomeBase;
window.setupTabs = setupTabs;
window.setupInterfaceDom = initializeInterfaceDom;

initializeInterfaceDom();