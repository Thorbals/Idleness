// Auto-split from monolith.js
// Source section: data/equipment.js

function critPctToRating(pct) {
  const p = Math.max(0, Math.min(0.95, pct || 0));
  return Math.round((p / (1 - p)) * 200);
}

function onReady(fn) {
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", fn);
  else fn();
}

function nf(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function ensureAllItemIcons() {
  if (!gameData || !gameData.items) return;
  const defaultByType = {
    currency: "⚙️",
    material: "📦",
    weapon: "⚔️",
    helmet: "🪖",
    armor: "🛡️",
    gloves: "🧤",
    boots: "🥾",
    offhand: "🛡️",
    accessory: "🎖️",
    consumable: "🍞",
    special: "✨",
    junk: "📦",
    trophies: "🏆",
  };
  let fixed = 0;
  Object.entries(gameData.items).forEach(([id, item]) => {
    const icon = item && item.icon;
    const malformed = !icon || typeof icon !== "string" || icon.trim() === "";
    const suspicious = /�|�|�|�|�|�/.test(icon || "");
    if (malformed || suspicious) {
      const t = (item && item.type) || "misc";
      item.icon = defaultByType[t] || "??";
      fixed++;
    }
  });
  if (fixed > 0) {
    console.log(`Fixed ${fixed} item icons`);
  }
}

function canEquipItem(itemId) {
  const item = gameData.items[itemId];
  if (
    !item ||
    ![
      "weapon",
      "helmet",
      "armor",
      "gloves",
      "boots",
      "offhand",
      "accessory",
    ].includes(item.type)
  ) {
    return false;
  }

  return gameState.player.combatLevel >= (item.level || 1);
}

function getEquipmentSlot(itemType, subtype) {
  switch (itemType) {
    case "weapon":
      return "weapon";
    case "helmet":
      return "helmet";
    case "armor":
      return "armor";
    case "gloves":
      return "gloves";
    case "boots":
      return "boots";
    case "offhand":
      return "offhand";
    case "accessory":
      if (!gameState.equipment.accessory1) return "accessory1";
      if (!gameState.equipment.accessory2) return "accessory2";
      return null;
    default:
      return null;
  }
}

function equipItem(itemId) {
  const item = gameData.items[itemId];
  if (!canEquipItem(itemId) || !gameState.bank[itemId]) {
    return false;
  }

  const slot = getEquipmentSlot(item.type, item.subtype);
  if (!slot) return false;

  if (gameState.equipment[slot]) {
    unequipItem(slot);
  }

  gameState.equipment[slot] = itemId;
  removeFromBank(itemId, 1);
  updatePlayerStats();
  renderEquipmentSlots();
  showNotification(`Equipped ${item.name}`, "success");
  return true;
}

function unequipItem(slot) {
  const equippedItem = gameState.equipment[slot];
  if (!equippedItem) return false;

  gameState.equipment[slot] = null;
  addToBank(equippedItem, 1);
  updatePlayerStats();
  renderEquipmentSlots();

  showNotification(`Unequipped ${gameData.items[equippedItem].name}`, "info");
  return true;
}

function updatePlayerStats() {
  gameState.player.attack = 10;
  gameState.player.defense = 10;
  gameState.player.maxHp = 100;
  gameState.player.accuracy = 50;
  gameState.player.evasion = 25;
  gameState.player.critical = 0;
  gameState.player.critMultiplier = 1.5;
  gameState.player.armorPen = 0;
  gameState.player.attackSpeed = 0;
  gameState.player.baseSpeedMs = 3000;
  gameState.player.statusResistance = 0;
  gameState.player.critResistance = 0;
  gameState.player.armorPenResistance = 0;
  gameState.player.elementalStatus = 0;
  gameState.player.hpRegenPerSec = 0;
  gameState.player.damageReductionBonusPct = 0;
  gameState.player.blockChancePct = 0;
  gameState.player.reflectOnBlockChancePct = 0;
  gameState.player.reflectOnBlockPct = 0;
  gameState.player.doubleAttackChancePct = 0;
  gameState.player.alwaysHitIfAccHigher = false;
  gameState.player.pierceTargets = 1;
  gameState.player.poisonImmune = false;
  Object.values(gameState.equipment).forEach((itemId) => {
    if (itemId && gameData.items[itemId]) {
      const item = gameData.items[itemId];
      if (item.attack) gameState.player.attack += item.attack;
      if (item.defense) gameState.player.defense += item.defense;
      if (item.hp) gameState.player.maxHp += item.hp;
      if (item.accuracy) gameState.player.accuracy += item.accuracy;
      if (item.evasion) gameState.player.evasion += item.evasion;
      if (item.critical) gameState.player.critical += item.critical;
      if (item.criticalPct)
        gameState.player.critical += Math.round(
          (Math.max(0, Math.min(95, item.criticalPct)) /
            (100 - Math.max(0, Math.min(95, item.criticalPct)))) *
            200
        );
      if (item.critMultiplier)
        gameState.player.critMultiplier = item.critMultiplier;
      if (item.armorPen) gameState.player.armorPen += item.armorPen;
      if (item.attackSpeed) gameState.player.attackSpeed += item.attackSpeed;
      if (item.baseSpeedMs) gameState.player.baseSpeedMs = item.baseSpeedMs;
      if (item.statusResistance)
        gameState.player.statusResistance += item.statusResistance;
      if (item.critResistance)
        gameState.player.critResistance += item.critResistance;
      if (item.armorPenResistance)
        gameState.player.armorPenResistance += item.armorPenResistance;
      if (item.elementalStatus)
        gameState.player.elementalStatus += item.elementalStatus;
    }
  });

  const Lf = gameState.skills.fitness.level || 0;
  const Ld = gameState.skills.defense.level || 0;
  const Lm = gameState.skills.melee.level || 0;
  const Lr = gameState.skills.firearms.level || 0;
  const Le = gameState.skills.explosives.level || 0;

  let fitnessHp = Math.floor(25 * Math.pow(1 + Lf, 0.9));
  let hpRegen = 0.5 * Math.pow(1 + Lf, 0.4);
  let statusResist = 2 * Math.pow(1 + Lf, 0.3);
  let maxHpPctBonus = 0;
  if (Lf >= 25) maxHpPctBonus += 5;
  if (Lf >= 50) hpRegen *= 1.1;
  if (Lf >= 75) statusResist += 15;
  if (Lf >= 99) {
    maxHpPctBonus += 20;
    gameState.player.poisonImmune = true;
  }
  gameState.player.maxHp += fitnessHp;
  gameState.player.hpRegenPerSec += hpRegen;
  gameState.player.statusResistance += Math.round(statusResist);

  const defAdd = Math.floor(3 * Math.pow(1 + Ld, 0.8));
  let drBonus = 1 * Math.pow(1 + Ld, 0.35);
  let blockChance = 1 * Math.pow(1 + Ld, 0.25);
  if (Ld >= 25) drBonus += 3;
  if (Ld >= 50) blockChance += 5;
  if (Ld >= 75) drBonus += 5;
  if (Ld >= 99) {
    blockChance += 10;
    gameState.player.reflectOnBlockChancePct = 50;
    gameState.player.reflectOnBlockPct = 25;
  }
  gameState.player.defense += defAdd;
  gameState.player.damageReductionBonusPct += drBonus;
  gameState.player.blockChancePct += blockChance;

  const meleeAtk = Math.floor(4 * Math.pow(1 + Lm, 0.75));
  const meleeAcc = Math.floor(5 * Math.pow(1 + Lm, 0.6));
  let meleeCritPct = 1 * Math.pow(1 + Lm, 0.4);
  let meleeAS = 2 * Math.pow(1 + Lm, 0.35);
  if (Lm >= 25) meleeCritPct += 5;
  if (Lm >= 50) meleeAS += 10;
  if (Lm >= 75)
    gameState.player.critMultiplier = Math.max(
      gameState.player.critMultiplier,
      1.65
    );
  if (Lm >= 99) {
    meleeAS += 20;
    gameState.player.doubleAttackChancePct = 20;
  }
  gameState.player.attack += meleeAtk;
  gameState.player.accuracy += meleeAcc;
  gameState.player.critical += critPctToRating(
    Math.min(0.95, (meleeCritPct || 0) / 100)
  );
  gameState.player.attackSpeed += Math.round(meleeAS);

  const rangedAtk = Math.floor(3 * Math.pow(1 + Lr, 0.7));
  const rangedAccBase = Math.floor(8 * Math.pow(1 + Lr, 0.65));
  let rangedCritPct = 1 * Math.pow(1 + Lr, 0.4);
  let rangedAS = 2 * Math.pow(1 + Lr, 0.35);
  let accPctBonus = 0;
  if (Lr >= 25) accPctBonus += 10;
  if (Lr >= 50) rangedCritPct += 5;
  if (Lr >= 75) {
    rangedAS += 15;
    gameState.player.pierceTargets = Math.max(
      gameState.player.pierceTargets,
      2
    );
  }
  if (Lr >= 99) {
    accPctBonus += 25;
    gameState.player.alwaysHitIfAccHigher = true;
  }
  gameState.player.attack += rangedAtk;
  gameState.player.accuracy += rangedAccBase;
  if (accPctBonus > 0)
    gameState.player.accuracy = Math.floor(
      gameState.player.accuracy * (1 + accPctBonus / 100)
    );
  gameState.player.critical += critPctToRating(
    Math.min(0.95, (rangedCritPct || 0) / 100)
  );
  gameState.player.attackSpeed += Math.round(rangedAS);

  const expAtk = Math.floor(6 * Math.pow(1 + Le, 0.8));
  let expArmPen = 3 * Math.pow(1 + Le, 0.5);
  let expCritPct = 2 * Math.pow(1 + Le, 0.45);
  let elemStatus = 5 * Math.pow(1 + Le, 0.3);
  if (Le >= 25) expArmPen += 15;
  if (Le >= 50) elemStatus += 10;
  if (Le >= 75) expCritPct += 10;
  if (Le >= 99) elemStatus += 20;
  gameState.player.attack += expAtk;
  gameState.player.armorPen += Math.round(expArmPen);
  gameState.player.critical += critPctToRating(
    Math.min(0.95, (expCritPct || 0) / 100)
  );
  gameState.player.elementalStatus += Math.round(elemStatus);

  if (maxHpPctBonus > 0)
    gameState.player.maxHp = Math.floor(
      gameState.player.maxHp * (1 + maxHpPctBonus / 100)
    );

  if (gameState.player.hp > gameState.player.maxHp) {
    gameState.player.hp = gameState.player.maxHp;
  }
}

function renderEquipmentSlots() {
  Object.keys(gameState.equipment).forEach((slot) => {
    const slotElement = document.getElementById(`${slot}-slot`);
    const equipmentSlot = document.querySelector(`[data-slot="${slot}"]`);

    if (!slotElement || !equipmentSlot) {
      console.warn(`Equipment slot element not found: ${slot}`);
      return;
    }

    const equippedItem = gameState.equipment[slot];

    if (equippedItem && gameData.items[equippedItem]) {
      const item = gameData.items[equippedItem];
      slotElement.innerHTML = `
        <div class="item-icon">${item.icon || "??"}</div>
              <div class="item-name">${item.name}</div>
            `;
      equipmentSlot.classList.add("equipped");
      equipmentSlot.title = item.name;
    } else {
      slotElement.innerHTML = "";
      equipmentSlot.classList.remove("equipped");
      equipmentSlot.title = getSlotName(slot);
    }
  });
  lastRenderedEquipment = { ...gameState.equipment };
}

function getSlotName(slot) {
  const slotNames = {
    helmet: "Helmet",
    armor: "Body Armor",
    gloves: "Gloves",
    boots: "Boots",
    weapon: "Weapon",
    offhand: "Off-hand",
    accessory1: "Accessory 1",
    accessory2: "Accessory 2",
  };
  return slotNames[slot] || slot;
}

function hideEquipmentTooltip() {
  if (equipmentTooltip) {
    equipmentTooltip.remove();
    equipmentTooltip = null;
  }
}

function createEquipmentTooltip(item) {
  if (!item) {
    console.warn("createEquipmentTooltip called with null item");
    return null;
  }

  const tooltip = document.createElement("div");
  tooltip.className = "equipment-tooltip";

  let content = `<h4>${item.name}</h4>`;
  content += `<div class="item-type">${
    item.type.charAt(0).toUpperCase() + item.type.slice(1)
  }</div>`;

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
    const val = item.attackSpeed;
    const cls = val >= 0 ? "stat-positive" : "stat-negative";
    content += `<div class="stat-line"><span>Attack Speed:</span><span class="${cls}">${
      val > 0 ? "+" : ""
    }${val}%</span></div>`;
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

  content += `<div class="unequip-instruction">Click to unequip</div>`;

  tooltip.innerHTML = content;
  return tooltip;
}

function createItemTooltip(item) {
  if (!item) {
    console.warn("createItemTooltip called with null item");
    return null;
  }

  const tooltip = document.createElement("div");
  tooltip.className = "equipment-tooltip";

  let content = `<h4>${item.name}</h4>`;
  content += `<div class="item-type">${
    item.type.charAt(0).toUpperCase() + item.type.slice(1)
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
    const val = item.attackSpeed;
    const cls = val >= 0 ? "stat-positive" : "stat-negative";
    content += `<div class="stat-line"><span>Attack Speed:</span><span class="${cls}">${
      val > 0 ? "+" : ""
    }${val}%</span></div>`;
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

function initGame() {
  console.log("Initializing game...");

  loadGameData().then(() => {
    if (!gameState.dataLoaded) {
      showNotification("Failed to load game data!", "error");
      return;
    }
    injectFactionCSS();

    renderAreas();
    renderBank();
    renderEquipmentSlots();
    updatePlayerStats();
    updateUI();
    setupEventListeners();

    // Set initial page state
    showPage("areas");

    startGameLoop();
    loadGame();

    checkUnlockFarmingPlots(1);
    checkUnlockAnimalStructures(1);
  });
}

function populateBandageDropdown() {
  const sel = document.getElementById("select-bandage");
  if (!sel) return;
  const bandageIds = getBandageIds().filter(
    (id) => (gameState.bank[id] || 0) > 0
  );
  sel.innerHTML = "";
  const any = document.createElement("option");
  any.value = "";
  any.textContent = bandageIds.length ? "Auto (best available)" : "No bandages";
  sel.appendChild(any);
  bandageIds.sort((a, b) => getBandageHealAmount(b) - getBandageHealAmount(a));
  for (const id of bandageIds) {
    const opt = document.createElement("option");
    const it = gameData.items[id];
    const qty = gameState.bank[id] || 0;
    const heal = getBandageHealAmount(id);
    opt.value = id;
    opt.textContent =
      heal > 0 ? `${it.name} (+${heal} HP) x${qty}` : `${it.name} x${qty}`;
    sel.appendChild(opt);
  }
  if (
    gameState.combat.selectedBandageId &&
    bandageIds.includes(gameState.combat.selectedBandageId)
  ) {
    sel.value = gameState.combat.selectedBandageId;
  } else {
    sel.value = "";
  }
  sel.onchange = () => {
    gameState.combat.selectedBandageId = sel.value || null;
  };
}

function populateFoodDropdown() {
  const sel = document.getElementById("select-food");
  if (!sel) return;
  const foods = Object.entries(gameData.items || {}).filter(
    ([id, it]) =>
      (it.type === "food" || it.type === "cooked_food") &&
      it.healAmount &&
      (gameState.bank[id] || 0) > 0
  );
  sel.innerHTML = "";
  const any = document.createElement("option");
  any.value = "";
  any.textContent = foods.length ? "Auto (best available)" : "No food";
  sel.appendChild(any);
  foods.sort((a, b) => (b[1].healAmount || 0) - (a[1].healAmount || 0));
  for (const [id, it] of foods) {
    const qty = gameState.bank[id] || 0;
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = `${it.name} (+${it.healAmount} HP) x${qty}`;
    sel.appendChild(opt);
  }
  if (
    gameState.combat.selectedFoodId &&
    foods.find(([id]) => id === gameState.combat.selectedFoodId)
  ) {
    sel.value = gameState.combat.selectedFoodId;
  } else {
    sel.value = "";
  }
  sel.onchange = () => {
    gameState.combat.selectedFoodId = sel.value || null;
  };
}

function updateCurrentAction() {
  const action = gameState.currentAction;
  if (!action) return;

  action.progress += 100;

  if (action.progress >= action.duration) {
    action.progress = action.duration;
    updateActionProgress();

    completeAction(action);
    gameState.currentAction = null;
    return;
  }

  updateActionProgress();
}

function getItemName(itemId) {
  if (!itemId) return "";
  const map =
    typeof gameData !== "undefined" && gameData.items ? gameData.items : null;
  const named = map && map[itemId] && map[itemId].name;
  if (named) return named;
  return String(itemId)
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getUsedSlots() {
  return Object.keys(gameState.bank).filter(
    (id) => (gameState.bank[id] || 0) > 0
  ).length;
}

function getGlobalFreeSlots() {
  return Math.max(0, BANK_CAPACITY_SLOTS - getUsedSlots());
}

function getTabUsedSlots(tabId) {
  return getUsedSlots();
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

function moveItemToSlot(itemId, slotIndex) {
  if (!gameState.bank[itemId]) return { swappedWith: null };

  if (slotIndex >= BANK_CAPACITY_SLOTS) {
    showNotification("Slot outside bank capacity.");
    return { swappedWith: null };
  }

  const current = gameState.bankPlacement[itemId] || {
    slot: findNextFreeSlot(),
  };
  const prevSlot = typeof current.slot === "number" ? current.slot : null;
  const conflictEntry = Object.entries(gameState.bankPlacement).find(
    ([id, p]) =>
      id !== itemId && p.slot === slotIndex && (gameState.bank[id] || 0) > 0
  );

  if (conflictEntry) {
    const [otherId, other] = conflictEntry;
    current.slot = slotIndex;
    gameState.bankPlacement[itemId] = current;
    const fallback = findNextFreeSlot();
    const destinationSlot =
      prevSlot !== null && prevSlot !== slotIndex ? prevSlot : fallback;
    other.slot = destinationSlot;
    gameState.bankPlacement[otherId] = other;
    return { swappedWith: otherId };
  } else {
    gameState.bankPlacement[itemId] = { slot: slotIndex };
    return { swappedWith: null };
  }
}

function saveGame() {
  const saveData = {
    player: gameState.player,
    skills: gameState.skills,
    bank: gameState.bank,
    bankTabs: gameState.bankTabs,
    bankPlacement: gameState.bankPlacement,
    bankTabSizes: gameState.bankTabSizes,
    activeBankTab: gameState.activeBankTab,
    equipment: gameState.equipment,
    upgrades: gameState.upgrades,
    workshops: gameState.workshops,
    dungeonCompleted: gameState.combat.dungeonCompleted,
    dungeonState: {
      inDungeon: gameState.combat.inDungeon,
      currentDungeon: gameState.combat.currentDungeon,
      dungeonProgress: gameState.combat.dungeonProgress,
      dungeonEnemies: gameState.combat.dungeonEnemies,
    },
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem("postApocalypticIdleSave", JSON.stringify(saveData));
    showNotification("Game saved!", "success");
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
    showNotification("Save failed - localStorage not available", "error");
  }
  gameState.lastSave = Date.now();
}

function loadGame() {
  let saveData = null;

  try {
    const localSave = localStorage.getItem("postApocalypticIdleSave");
    if (localSave) {
      saveData = JSON.parse(localSave);
      console.log("Loaded save from localStorage");
    }
  } catch (e) {
    console.warn("Could not load from localStorage:", e);
  }

  if (saveData) {
    gameState.player = { ...gameState.player, ...saveData.player };
    gameState.skills = { ...gameState.skills, ...saveData.skills };
    gameState.bank = { ...saveData.bank };
    gameState.bankTabs = saveData.bankTabs || gameState.bankTabs;
    gameState.bankPlacement =
      saveData.bankPlacement || gameState.bankPlacement || {};
    gameState.bankTabSizes =
      saveData.bankTabSizes || gameState.bankTabSizes || {};
    gameState.bankTabs.forEach((t) => {
      if (t.id !== "all" && !(t.id in gameState.bankTabSizes)) {
        gameState.bankTabSizes[t.id] = getGlobalFreeSlots();
      }
    });
    gameState.activeBankTab =
      saveData.activeBankTab || gameState.activeBankTab || "all";
    if (!gameState.bankTabs.find((t) => t.id === gameState.activeBankTab)) {
      gameState.activeBankTab = "all";
    }
    gameState.equipment = {
      ...gameState.equipment,
      ...saveData.equipment,
    };
    gameState.upgrades = saveData.upgrades ||
      gameState.upgrades || {
        mining: { purchased: {} },
        forestry: { purchased: {} },
      };
    gameState.workshops = saveData.workshops ||
      gameState.workshops || {
        tailoring: {},
        firstaid: {},
        forging: {},
        gunsmithing: {},
        carpentry: {},
        tinkering: {},
        cooking: {},
        masonry: {},
        chemistry: {},
        electrical: {},
      };
    if (!gameState.upgrades.mining)
      gameState.upgrades.mining = { purchased: {} };
    if (!gameState.upgrades.mining.purchased)
      gameState.upgrades.mining.purchased = {};
    if (!gameState.upgrades.forestry)
      gameState.upgrades.forestry = { purchased: {} };
    if (!gameState.upgrades.forestry.purchased)
      gameState.upgrades.forestry.purchased = {};
    if (!gameState.upgrades.hunting)
      gameState.upgrades.hunting = { purchased: {} };
    if (!gameState.upgrades.hunting.purchased)
      gameState.upgrades.hunting.purchased = {};
    if (!gameState.upgrades.foraging)
      gameState.upgrades.foraging = { purchased: {} };
    if (!gameState.upgrades.foraging.purchased)
      gameState.upgrades.foraging.purchased = {};
    if (!gameState.upgrades.fishing)
      gameState.upgrades.fishing = { purchased: {} };
    if (!gameState.upgrades.fishing.purchased)
      gameState.upgrades.fishing.purchased = {};
    if (!gameState.upgrades.scavenging)
      gameState.upgrades.scavenging = { purchased: {} };
    if (!gameState.upgrades.scavenging.purchased)
      gameState.upgrades.scavenging.purchased = {};
    if (!gameState.upgrades.looting)
      gameState.upgrades.looting = { purchased: {} };
    if (!gameState.upgrades.looting.purchased)
      gameState.upgrades.looting.purchased = {};
    if (!gameState.upgrades.tailoring)
      gameState.upgrades.tailoring = { purchased: {} };
    if (!gameState.upgrades.tailoring.purchased)
      gameState.upgrades.tailoring.purchased = {};
    if (!gameState.upgrades.firstaid)
      gameState.upgrades.firstaid = { purchased: {} };
    if (!gameState.upgrades.firstaid.purchased)
      gameState.upgrades.firstaid.purchased = {};
    if (!gameState.upgrades.forging)
      gameState.upgrades.forging = { purchased: {} };
    if (!gameState.upgrades.forging.purchased)
      gameState.upgrades.forging.purchased = {};
    if (!gameState.upgrades.gunsmithing)
      gameState.upgrades.gunsmithing = { purchased: {} };
    if (!gameState.upgrades.gunsmithing.purchased)
      gameState.upgrades.gunsmithing.purchased = {};
    if (!gameState.upgrades.carpentry)
      gameState.upgrades.carpentry = { purchased: {} };
    if (!gameState.upgrades.carpentry.purchased)
      gameState.upgrades.carpentry.purchased = {};
    if (!gameState.upgrades.tinkering)
      gameState.upgrades.tinkering = { purchased: {} };
    if (!gameState.upgrades.tinkering.purchased)
      gameState.upgrades.tinkering.purchased = {};
    if (!gameState.workshops)
      gameState.workshops = {
        tailoring: {},
        firstaid: {},
        forging: {},
        gunsmithing: {},
        carpentry: {},
        tinkering: {},
        cooking: {},
        masonry: {},
        chemistry: {},
        electrical: {},
      };
    if (!gameState.workshops.tailoring) gameState.workshops.tailoring = {};
    if (!gameState.workshops.firstaid) gameState.workshops.firstaid = {};
    if (!gameState.workshops.forging) gameState.workshops.forging = {};
    if (!gameState.workshops.gunsmithing) gameState.workshops.gunsmithing = {};
    if (!gameState.workshops.carpentry) gameState.workshops.carpentry = {};
    if (!gameState.workshops.tinkering) gameState.workshops.tinkering = {};
    if (!gameState.workshops.cooking) gameState.workshops.cooking = {};
    if (!gameState.workshops.masonry) gameState.workshops.masonry = {};
    if (!gameState.workshops.chemistry) gameState.workshops.chemistry = {};
    if (!gameState.workshops.electrical) gameState.workshops.electrical = {};
    gameState.combat.dungeonCompleted = saveData.dungeonCompleted || [];
    if (saveData.dungeonState) {
      gameState.combat.inDungeon = saveData.dungeonState.inDungeon || false;
      gameState.combat.currentDungeon =
        saveData.dungeonState.currentDungeon || null;
      gameState.combat.dungeonProgress =
        saveData.dungeonState.dungeonProgress || 0;
      gameState.combat.dungeonEnemies =
        saveData.dungeonState.dungeonEnemies || {};
    }

    updateCombatLevel();
    updatePlayerStats();
    Object.keys(gameState.bank).forEach((id) => {
      const existing = gameState.bankPlacement[id];
      const targetTab =
        existing && gameState.bankTabs.find((t) => t.id === existing.tabId)
          ? existing.tabId
          : "all";
      if (!existing || targetTab === "all") {
        gameState.bankPlacement[id] = {
          tabId: targetTab,
          slot: findNextFreeSlot(targetTab),
        };
      } else {
        const cap =
          targetTab === "all" ? BANK_CAPACITY_SLOTS : getTabCapacity(targetTab);
        const desiredSlot = Math.max(0, Math.min(cap - 1, existing.slot || 0));
        const conflict = Object.entries(gameState.bankPlacement).find(
          ([otherId, p]) =>
            otherId !== id &&
            p.tabId === targetTab &&
            p.slot === desiredSlot &&
            (gameState.bank[otherId] || 0) > 0
        );
        const slot = conflict ? findNextFreeSlot(targetTab) : desiredSlot;
        gameState.bankPlacement[id] = { tabId: targetTab, slot };
      }
    });
    renderBank();
    renderEquipmentSlots();
    showNotification("Game loaded!", "success");
  } else {
    console.log("No save found, setting up new game");
    STARTER_EQUIPMENT.forEach((itemId) => {
      if (gameData.items && gameData.items[itemId]) {
        addToBank(itemId, 1);
      }
    });

    showNotification(
      "New game started! Check your bank for starter equipment."
    );
    Object.keys(gameState.bank).forEach((id) => {
      if (!gameState.bankPlacement[id]) {
        const tabId = inferTabForItem(id);
        gameState.bankPlacement[id] = { tabId, slot: findNextFreeSlot(tabId) };
      }
    });
    renderBank();
  }
}

function resetGame() {
  const proceed = confirm(
    "This will erase your current progress and start a fresh game. Continue?"
  );
  if (!proceed) return;

  try {
    localStorage.removeItem("postApocalypticIdleSave");
  } catch (_) {
    /* ignore */
  }
  const fresh = {
    scrap: 0,
    hp: 100,
    maxHp: 100,
    attack: 10,
    defense: 10,
    accuracy: 50,
    evasion: 25,
    critical: 0,
    critMultiplier: 1.5,
    armorPen: 0,
    attackSpeed: 0,
    baseSpeedMs: 3000,
    statusResistance: 0,
    critResistance: 0,
    armorPenResistance: 0,
    elementalStatus: 0,
    hpRegenPerSec: 0,
    damageReductionBonusPct: 0,
    blockChancePct: 0,
    reflectOnBlockChancePct: 0,
    reflectOnBlockPct: 0,
    doubleAttackChancePct: 0,
    alwaysHitIfAccHigher: false,
    pierceTargets: 1,
    poisonImmune: false,
    combatLevel: 1,
  };
  gameState.player = { ...fresh };
  gameState.skills = JSON.parse(
    JSON.stringify({
      fitness: { level: 1, xp: 0 },
      defense: { level: 1, xp: 0 },
      melee: { level: 1, xp: 0 },
      firearms: { level: 1, xp: 0 },
      explosives: { level: 1, xp: 0 },
      woodcutting: { level: 1, xp: 0 },
      mining: { level: 1, xp: 0 },
      fishing: { level: 1, xp: 0 },
      foraging: { level: 1, xp: 0 },
      hunting: { level: 1, xp: 0 },
      looting: { level: 1, xp: 0 },
      scavenging: { level: 1, xp: 0 },
      animalcare: { level: 1, xp: 0 },
      farming: { level: 1, xp: 0 },
      cooking: { level: 1, xp: 0 },
      forging: { level: 1, xp: 0 },
      tailoring: { level: 1, xp: 0 },
      carpentry: { level: 1, xp: 0 },
      firstaid: { level: 1, xp: 0 },
      masonry: { level: 1, xp: 0 },
      chemistry: { level: 1, xp: 0 },
      electrical: { level: 1, xp: 0 },
      gunsmithing: { level: 1, xp: 0 },
      tinkering: { level: 1, xp: 0 },
    })
  );

  gameState.bank = {};
  gameState.bankTabs = [{ id: "all", name: "" }];
  gameState.bankPlacement = {};
  gameState.bankTabSizes = {};
  gameState.activeBankTab = "all";
  gameState.bankHeldItem = null;

  gameState.farming = { plots: [], unlockedPlots: [] };
  gameState.animalCare = {
    structures: [],
    unlockedStructures: [],
    animals: [],
  };

  gameState.equipment = {
    helmet: null,
    armor: null,
    gloves: null,
    boots: null,
    weapon: null,
    offhand: null,
    accessory1: null,
    accessory2: null,
  };
  gameState.currentArea = null;
  gameState.currentAction = null;

  gameState.combat = {
    inCombat: false,
    currentEnemy: null,
    enemyHp: 0,
    enemyMaxHp: 0,
    inDungeon: false,
    currentDungeon: null,
    dungeonProgress: 0,
    dungeonEnemies: [],
    dungeonCompleted: [],
  };

  gameState.lastSave = Date.now();
  if (Array.isArray(STARTER_EQUIPMENT)) {
    STARTER_EQUIPMENT.forEach((itemId) => {
      if (gameData.items && gameData.items[itemId]) {
        addToBank(itemId, 1);
      }
    });
  }

  updateCombatLevel();
  updatePlayerStats();
  renderBank();
  renderEquipmentSlots();
  updateUI();
  saveGame();
  showNotification("Game reset to fresh start");
}

function showEquipmentShopItems(container) {
  container.innerHTML = `
          <div style="text-align: center; color: #8b949e; padding: 40px;">
            Equipment shop coming soon...
          </div>
        `;
}

function removeAnimal(structureIndex) {
  const structureData = ANIMAL_CARE_DATA.structures[structureIndex];
  const structureState = gameState.animalCare.unlockedStructures.find(
    (s) => s.name === structureData.name
  );

  if (structureState && structureState.placedAnimal) {
    const count = structureState.placedAnimal.count || 1;
    gameState.bank[structureState.placedAnimal.id] =
      (gameState.bank[structureState.placedAnimal.id] || 0) + count;
    renderBank();
    showNotification(
      `Removed ${count}x ${structureState.placedAnimal.name} from ${structureData.name}.`,
      "info"
    );
    structureState.placedAnimal = null;
    structureState.lastByproduct = null;
    structureState.lastHarvest = null;

    showSkillPage("animalcare");
  }
}

function isRiver(x, y) {
  return state.rivers.has(riverKey(x, y));
}

function tileAt(x, y) {
  if (x < 0 || y < 0 || x >= state.cols || y >= state.rows) return null;
  return tiles[y * state.cols + x];
}

function fillRiverCol(col, y0, y1) {
  for (let y = Math.max(0, y0); y <= Math.min(state.rows - 1, y1); y++) {
    setRiver(col, y);
  }
}

function parseCoordinates(coordString) {
  if (!coordString) return [];
  return coordString
    .split(/[\s,]+/)
    .filter((s) => s.includes(","))
    .map((coord) => {
      const [x, y] = coord.split(",").map(Number);
      return { x, y };
    });
}

function renderCards() {
  cardsEl.innerHTML = "";
  const list = BUILDINGS.filter((b) => b.cat === activeCat);
  for (const b of list) {
    const card = document.createElement("div");
    card.className = "card";
    const afford = canAfford(b);
    if (state.selection && state.selection.id === b.id)
      card.classList.add("selected");
    card.innerHTML = `
        <h4>${b.name}</h4>
        <div class="row">
          <span class="chip ${afford ? "" : "red"}">🪵 ${b.cost.wood}</span>
          <span class="chip ${afford ? "" : "red"}">🪨 ${b.cost.stone}</span>
          <span class="chip">🛡 ${b.durability} dur</span>
          <span class="chip">📐 ${b.footprint[0]}×${b.footprint[1]}</span>
        </div>
        <div class="slots">
          ${b.slots.F ? `<span class='slot'>🪑 ×${b.slots.F}</span>` : ""}
          ${b.slots.W ? `<span class='slot'>🛠️ ×${b.slots.W}</span>` : ""}
          ${b.slots.S ? `<span class='slot'>📦 ×${b.slots.S}</span>` : ""}
          ${b.slots.D ? `<span class='slot'>🛡️ ×${b.slots.D}</span>` : ""}
        </div>
        <div class="desc">${b.tags.join(" • ")}</div>
        <div class="choose"><button class="btn primary" ${
          state.selection && state.selection.id === b.id ? "disabled" : ""
        }>${
      state.selection && state.selection.id === b.id ? "Selected" : "Select"
    }</button></div>
      `;
    card.querySelector("button").onclick = () => selectBuilding(b);
    cardsEl.appendChild(card);
  }
}

function selectBuilding(b) {
  state.selection = b;
  document.body.classList.add("show-adj");
  pushFav(b);
  hint.textContent = `Placing: ${b.name} — Rotate Q/E · Hold Shift to stamp`;
  updateDeltas();
  renderCards();
  highlightValidTiles();
  updateAffordChip();
}

function highlightValidTiles() {
  clearSelectable();
  if (!state.selection) return;
  const { w, h } = footprintSize();
  for (let y = 0; y <= state.rows - h; y++) {
    for (let x = 0; x <= state.cols - w; x++) {
      if (validatePlacement(x, y, w, h).ok) {
        const t = tileAt(x, y);
        if (t) t.classList.add("selectable");
      }
    }
  }
}

function ensureGhost() {
  removeGhost();
  if (!state.selection) return;
  ghostEl = document.createElement("div");
  ghostEl.className = "ghost-cell";
  ghostMeta = document.createElement("div");
  ghostMeta.className = "ghost-meta";
  ghostEl.appendChild(ghostMeta);
  ghostTip = document.createElement("div");
  ghostTip.className = "tip";
  ghostTip.style.display = "none";
  ghostEl.appendChild(ghostTip);
  mapEl.appendChild(ghostEl);
  updateGhostMeta();
  positionGhost();
}

function footprintSize() {
  const [w, h] = state.selection ? state.selection.footprint : [1, 1];
  return { w, h };
}

function updateGhostMeta() {
  if (!state.selection || !ghostMeta) return;
  const s = state.selection.slots;
  ghostMeta.innerHTML = "";
  if (s.D) ghostMeta.appendChild(chip(`🛡️ +${s.D}`));
  if (s.W) ghostMeta.appendChild(chip(`🛠️ +${s.W}`));
  if (s.S) ghostMeta.appendChild(chip(`📦 +${s.S}`));
  if (s.F) ghostMeta.appendChild(chip(`🪑 +${s.F}`));
  function chip(text) {
    const el = document.createElement("div");
    el.className = "gchip";
    el.textContent = text;
    return el;
  }
}

function showProjectedDeltas(validity) {
  if (!validity.ok || !state.selection) {
    updateDeltas(true);
    return;
  }
  const b = state.selection;
  woodDeltaEl.textContent = "−" + b.cost.wood;
  woodDeltaEl.className = "delta minus";
  stoneDeltaEl.textContent = "−" + b.cost.stone;
  stoneDeltaEl.className = "delta minus";
}

function canAfford(b) {
  return state.wood >= b.cost.wood && state.stone >= b.cost.stone;
}

function undo() {
  const lp = state.lastPlaced;
  if (!lp) return;
  tickResources(lp.b.cost.wood, lp.b.cost.stone);
  lp.cells.forEach((k) => state.occupied.delete(k));
  lp.el.remove();
  state.lastPlaced = null;
  undoBtn.disabled = true;
  toast("Undo placement");
  updateAffordChip();
  highlightValidTiles();
}

function tickResources(dw, ds) {
  state.wood += dw;
  state.stone += ds;
  woodEl.textContent = state.wood;
  stoneEl.textContent = state.stone;
  woodEl.animate(
    [
      { transform: "scale(1.0)" },
      { transform: "scale(1.15)" },
      { transform: "scale(1.0)" },
    ],
    { duration: 240 }
  );
  stoneEl.animate(
    [
      { transform: "scale(1.0)" },
      { transform: "scale(1.15)" },
      { transform: "scale(1.0)" },
    ],
    { duration: 240 }
  );
}

function updateDeltas(clear) {
  if (clear || !state.selection) {
    woodDeltaEl.textContent = "";
    stoneDeltaEl.textContent = "";
    return;
  }
  woodDeltaEl.textContent = "−" + state.selection.cost.wood;
  woodDeltaEl.className = "delta minus";
  stoneDeltaEl.textContent = "−" + state.selection.cost.stone;
  stoneDeltaEl.className = "delta minus";
}

function updateAffordChip() {
  if (!affordChip) return; // afford chip UI removed; no-op
  const b = state.selection;
  if (!b) {
    affordChip.textContent = "";
    affordChip.disabled = true;
    return;
  }
  const w = Math.floor(state.wood / b.cost.wood);
  const s = Math.floor(state.stone / b.cost.stone);
  const count = Math.max(0, Math.min(w, s));
  affordChip.textContent = `${count}× affordable`;
  affordChip.disabled = false;
}

function canAfford(b) {
  return state.wood >= b.cost.wood && state.stone >= b.cost.stone;
}

function undo() {
  const lp = state.lastPlaced;
  if (!lp) return;
  tickResources(lp.b.cost.wood, lp.b.cost.stone);
  lp.cells.forEach((k) => state.occupied.delete(k));
  lp.el.remove();
  state.lastPlaced = null;
  undoBtn.disabled = true;
  toast("Undo placement");
  updateAffordChip();
  highlightValidTiles();
}

function tickResources(dw, ds) {
  state.wood += dw;
  state.stone += ds;
  woodEl.textContent = state.wood;
  stoneEl.textContent = state.stone;
  woodEl.animate(
    [
      { transform: "scale(1.0)" },
      { transform: "scale(1.15)" },
      { transform: "scale(1.0)" },
    ],
    { duration: 240 }
  );
  stoneEl.animate(
    [
      { transform: "scale(1.0)" },
      { transform: "scale(1.15)" },
      { transform: "scale(1.0)" },
    ],
    { duration: 240 }
  );
}

function updateDeltas(clear) {
  if (clear || !state.selection) {
    woodDeltaEl.textContent = "";
    stoneDeltaEl.textContent = "";
    return;
  }
  woodDeltaEl.textContent = "−" + state.selection.cost.wood;
  woodDeltaEl.className = "delta minus";
  stoneDeltaEl.textContent = "−" + state.selection.cost.stone;
  stoneDeltaEl.className = "delta minus";
}

function updateAffordChip() {
  if (!affordChip) return; // afford chip UI removed; no-op
  const b = state.selection;
  if (!b) {
    affordChip.textContent = "";
    affordChip.disabled = true;
    return;
  }
  const w = Math.floor(state.wood / b.cost.wood);
  const s = Math.floor(state.stone / b.cost.stone);
  const count = Math.max(0, Math.min(w, s));
  affordChip.textContent = `${count}× affordable`;
  affordChip.disabled = false;
}

let equipmentTooltip = null;

let lastRenderedEquipment = {};

// Expose functions globally
if (typeof window !== "undefined") {
  window.getItemName = getItemName;
}
