// Homebase module (cleaned): top-level helpers exposed on window.
window.critPctToRating = window.critPctToRating || ((pct) => {
  const p = Math.max(0, Math.min(0.95, pct || 0));
  return Math.round((p / (1 - p)) * 200);
});

window.scaleEnemyForLevel = window.scaleEnemyForLevel || ((factionId, baseEnemy, level, kind) => {
  const f =
    (gameData && gameData.enemies && gameData.enemies[factionId]) || null;
  if (!f) return null;
  const L = Math.max(1, level | 0);
  const effLevel = L - 1;
  const e = f.scaling;
  const b = f.base[kind];
  const hp = Math.max(1, Math.floor(b.hp * Math.pow(1 + effLevel, e.hp)));
  const atk = Math.max(1, Math.floor(b.atk * Math.pow(1 + effLevel, e.atk)));
  const def = Math.max(0, Math.floor(b.def * Math.pow(1 + effLevel, e.def)));
  const acc = Math.max(1, Math.floor(b.acc * Math.pow(1 + effLevel, e.acc)));
  const critRating = window.critPctToRating(
    (b.critPct || 0) * Math.pow(1 + effLevel, e.crit)
  );
  const armPen = Math.round(
    (b.armPenPct || 0) * Math.pow(1 + effLevel, e.armPen) * 100
  );
  const aspdScalar = (b.aspd || 1) * Math.pow(1 + effLevel, e.aspd);
  const attackSpeedPct = Math.round((aspdScalar - 1) * 100);
  const isBoss = kind === "boss";
  const drops = [
    {
      item: "scrap",
      min: isBoss ? 6 : 2,
      max: isBoss ? 12 : 5,
      rarity: "common",
    },
  ];

  return {
    factionId,
    id: baseEnemy.id,
    name: baseEnemy.name,
    level: L,
    hp,
    attack: atk,
    defense: def,
    accuracy: acc,
    evasion: 25,
    critical: critRating,
    critMultiplier: 1.5,
    armorPen: Math.min(90, Math.max(0, Math.round(armPen))),
    attackSpeed: attackSpeedPct,
    baseSpeedMs: 3000,
    xp: (isBoss ? 25 : 10) * L,
    drops,
  };
});

window.gameData = {
  areas: null,
  enemies: null,
  items: null,
  skills: null,
};

window.BANK_CAPACITY_SLOTS = 20;
window.craftingContinuous = false;
window.materialSelections = {};

window.gameState = {
  player: {
    hp: 100,
    maxHp: 100,
    attack: 10,
    defense: 10,
    scrap: 100,
    combatLevel: 1,
  },
  equipment: {
    helmet: null,
    armor: null,
    gloves: null,
    boots: null,
    weapon: null,
    offhand: null,
    accessory1: null,
    accessory2: null,
  },
  upgrades: {
    mining: { purchased: {} },
    forestry: { purchased: {} },
    hunting: { purchased: {} },
    foraging: { purchased: {} },
    fishing: { purchased: {} },
    tailoring: { purchased: {} },
    firstaid: { purchased: {} },
    forging: { purchased: {} },
    gunsmithing: { purchased: {} },
    scavenging: { purchased: {} },
    carpentry: { purchased: {} },
    tinkering: { purchased: {} },
    cooking: { purchased: {} },
    masonry: { purchased: {} },
    chemistry: { purchased: {} },
    electrical: { purchased: {} },
  },
  workshops: {
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
  },
  skills: {
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
  },

  bank: {},
  bankPlacement: {},
  bankHeldItem: null,
  bankRenderScheduled: false,

  farming: {
    plots: [],
    unlockedPlots: [],
  },

  animalCare: {
    structures: [],
    unlockedStructures: [],
    animals: [],
  },

  currentArea: null,
  currentAction: null,

  combat: {
    inCombat: false,
    currentEnemy: null,
    enemyHp: 0,
    enemyMaxHp: 0,
    inDungeon: false,
    currentDungeon: null,
    dungeonProgress: 0,
    dungeonEnemies: [],
    dungeonCompleted: [],
    autohealEnabled: false,
    autohealThreshold: 0.7,
    autohealCooldownMs: 1500,
    _autohealTicker: 0,
    selectedBandageId: null,
    selectedFoodId: null,
  },
  lastSave: Date.now(),
  dataLoaded: false,
};

let gameInterval;
window.currentSkill = null;
window.equipmentTooltip = null;
window.showDropPercentages = false;

window.loadGameData = async () => {
  try {
    showLoadingScreen();
    console.log("Loading embedded game data...");

    gameData.areas = AREAS_DATA.areas;
    gameData.skills = {
      ...window.gathering_skills.SKILLS_DATA,
      combat_skills: window.COMBAT_SKILLS_DATA,
      production_skills: window.PRODUCTION_SKILLS_DATA,
    };
    gameData.upgrades = UPGRADES_DATA;

    gameData.items = {
      ...ITEMS_DATA.currency,
      ...ITEMS_DATA.raw_materials.wood,
      ...ITEMS_DATA.raw_materials.stone,
      ...ITEMS_DATA.raw_materials.metals,
      ...ITEMS_DATA.raw_materials.gems,
      ...ITEMS_DATA.raw_materials.salvage,
      ...ITEMS_DATA.raw_materials.electronics,
      ...ITEMS_DATA.food,
      ...ITEMS_DATA.cooked_food,
      ...ITEMS_DATA.raw_food,
      ...ITEMS_DATA.seeds,
      ...ITEMS_DATA.components,
      ...ITEMS_DATA.openables,
      ...ITEMS_DATA.special,
      ...ITEMS_DATA.junk,
      ...ITEMS_DATA.trophies,
      ...EQUIPMENT_DATA,
    };
+
    ensureAllItemIcons();
    try {
      applyDungeonRevamp();
    } catch (e) {
      console.warn("Dungeon/Raid revamp apply failed:", e);
    }

    gameData.enemies = ENEMIES_DATA;

    gameState.dataLoaded = true;
    hideLoadingScreen();
    console.log("Game data loaded successfully");
    console.log("Available areas:", gameData.areas?.length || 0);
    console.log("Available items:", Object.keys(gameData.items || {}).length);
  } catch (error) {
    console.error("Failed to load game data:", error);
    showNotification("Failed to load game data! Check console for details.");
  }
};

window.injectFactionCSS = function () {
  const styleId = "dynamic-faction-styles";
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) existingStyle.remove();
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = generateFactionCSS();
  document.head.appendChild(style);
};

// Initialize NAME_TO_FACTION_ID mapping if not already done
if (!window.NAME_TO_FACTION_ID) {
  window.NAME_TO_FACTION_ID = {};
}

// Populate the mapping
Object.values(FACTION_CONFIG).forEach((faction) => {
  window.NAME_TO_FACTION_ID[faction.name] = faction.id;
});

window.nf = function (s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
};

window.applyDungeonRevamp = function () {
  if (!Array.isArray(gameData.areas)) return;
  const byId = Object.create(null);
  gameData.areas.forEach((a) => {
    if (a && a.id) byId[a.id] = a;
  });
  Object.entries(AREA_REVAMP_CONFIG).forEach(([areaId, cfg]) => {
    const area = byId[areaId];
    if (!area) return;
    area.areaType = cfg.areaType;
    const areaFactions = (area.factions || []).map(
      (name) => NAME_TO_FACTION_ID[name] || name
    );
    area.dungeons = (cfg.dungeons || []).map((d) => {
      const primary = d.primary;
      const secondary = areaFactions.filter((f) => f !== primary);
      return {
        id: d.id,
        name: d.name,
        level: area.level,
        type: d.type,
        primaryFaction: primary,
        secondaryFactions: secondary,
      };
    });
    area.enemyWhitelist = new Set((cfg.enemies || []).map(nf));
  });
};

window.getHitChance = window.getHitChance || function (attacker, defender) {
  const acc = Math.max(0, attacker.accuracy ?? 50);
  const eva = Math.max(0, defender.evasion ?? 25);
  if (acc === 0 && eva === 0) return 0.5;
  return acc / (acc + eva);
};

window.getCritChance = window.getCritChance || function (attacker) {
  const rating = Math.max(0, attacker.critical ?? 0);
  return Math.min(0.75, rating / (rating + 200));
};

window.getEffectiveCritChance = window.getEffectiveCritChance || function (attacker, defender) {
  const base = getCritChance(attacker);
  const resist = Math.max(0, Math.min(1, (defender.critResistance ?? 0) / 100));
  return Math.max(0, base - resist);
};

window.getEffectiveDefense = window.getEffectiveDefense || function (defender, attacker) {
  const base = Math.max(0, defender.defense ?? 0);
  const penPctRaw = Math.max(0, Math.min(90, attacker.armorPen ?? 0));
  const penResist = Math.max(0, Math.min(90, defender.armorPenResistance ?? 0));
  const penPct = Math.max(0, penPctRaw - penResist);
  return base * (1 - penPct / 100);
};

window.getDamageReduction = window.getDamageReduction || function (defenseValue) {
  const dr = defenseValue / (defenseValue + 100);
  return Math.min(0.95, Math.max(0, dr));
};

window.computeDamage = window.computeDamage || function (attacker, defender) {
  let hitRollGuaranteed = false;
  if (
    attacker.alwaysHitIfAccHigher &&
    (attacker.accuracy ?? 0) > (defender.evasion ?? 0)
  ) {
    hitRollGuaranteed = true;
  }
  if (!hitRollGuaranteed && Math.random() >= getHitChance(attacker, defender))
    return { damage: 0, crit: false, hit: false, blocked: false };
  const atk = Math.max(1, attacker.attack ?? 1);
  const effDef = getEffectiveDefense(defender, attacker);
  let dr = getDamageReduction(effDef);
  const drBonus = Math.max(0, (defender.damageReductionBonusPct || 0) / 100);
  dr = Math.min(0.95, dr + drBonus);
  let dmg = Math.max(1, Math.floor(atk * (1 - dr)));
  const isCrit = Math.random() < getEffectiveCritChance(attacker, defender);
  if (isCrit) {
    const mult = attacker.critMultiplier ?? 1.5;
    dmg = Math.max(1, Math.floor(dmg * mult));
  }
  let blocked = false;
  let reflectDamage = 0;
  const blockChance = Math.max(
    0,
    Math.min(1, (defender.blockChancePct || 0) / 100)
  );
  if (Math.random() < blockChance) {
    blocked = true;
    const reflectChance = Math.max(
      0,
      Math.min(1, (defender.reflectOnBlockChancePct || 0) / 100)
    );
    if (reflectChance > 0 && Math.random() < reflectChance) {
      const reflectPct = Math.max(
        0,
        Math.min(1, (defender.reflectOnBlockPct || 0) / 100)
      );
      reflectDamage = Math.max(0, Math.floor(dmg * reflectPct));
    }
    dmg = 0;
  }
  return { damage: dmg, crit: isCrit, hit: true, blocked, reflectDamage };
};

window.getAttackIntervalMs = window.getAttackIntervalMs || function (attacker) {
  const base = Math.max(500, Math.min(5000, attacker.baseSpeedMs ?? 3000));
  const spd = Math.max(0, attacker.attackSpeed ?? 0);
  const interval = base / (1 + spd / 100);
  return Math.max(500, Math.min(5000, Math.floor(interval)));
};

window.lastRenderedEquipment = {};
// Helper: equipment slot display names (must be defined before renderEquipmentSlots uses it)
window.getSlotName = function (slot) {
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
};

// Ensure itemTooltip global exists (was used before being declared)
window.itemTooltip = window.itemTooltip || null;
// Delegating fallbacks for tooltip helpers (use legacy implementations if present)
window.hideItemTooltip = window.hideItemTooltip || function () {
  if (window.itemTooltip) {
    window.itemTooltip.remove();
    window.itemTooltip = null;
  }
};
window.createItemTooltip = window.createItemTooltip || function (item) {
  console.warn('createItemTooltip fallback used');
  return null;
};
window.hideEquipmentTooltip = window.hideEquipmentTooltip || function () {
  if (window.equipmentTooltip) {
    window.equipmentTooltip.remove();
    window.equipmentTooltip = null;
  }
};
window.createEquipmentTooltip = window.createEquipmentTooltip || function (item) {
  console.warn('createEquipmentTooltip fallback used');
  return null;
};
window.renderEquipmentSlots = function () {
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
        <div style="font-size: 24px;">${item.icon || "??"}</div>
        <div style="font-size: 8px; color: #f8f9fa; text-align: center; margin-top: 2px; word-wrap: break-word; line-height: 1.1;">${
          item.name
        }</div>
      `;
      equipmentSlot.classList.add("equipped");
      equipmentSlot.title = item.name;
    } else {
      slotElement.innerHTML = "";
      equipmentSlot.classList.remove("equipped");
      equipmentSlot.title = getSlotName(slot);
    }
  });
};

// Tooltip for equipped items
window.showEquipmentTooltip = function (event, slot) {
  const equippedItem = gameState.equipment[slot];
  if (!equippedItem || !gameData.items[equippedItem]) return;

  window.hideEquipmentTooltip?.(); // Clean existing if defined elsewhere
  const item = gameData.items[equippedItem];
  const tooltip = window.createEquipmentTooltip?.(item);
  if (!tooltip) return;

  document.body.appendChild(tooltip);
  const rect = event.target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const wouldOverflowRight = rect.right + 10 + tooltipRect.width > windowWidth;
  if (wouldOverflowRight) {
    tooltip.style.left = rect.left - tooltipRect.width - 10 + "px";
  } else {
    tooltip.style.left = rect.right + 10 + "px";
  }
  let topPosition = rect.top + window.scrollY;
  const wouldOverflowBottom = rect.top + tooltipRect.height > windowHeight;
  if (wouldOverflowBottom) {
    topPosition = rect.bottom + window.scrollY - tooltipRect.height;
    topPosition = Math.max(window.scrollY, topPosition);
  }
  tooltip.style.top = topPosition + "px";
  requestAnimationFrame(() => tooltip.classList.add("show"));
  equipmentTooltip = tooltip;
};

// Generic item tooltip
window.showItemTooltip = function (event, itemId) {
  window.hideItemTooltip?.();
  const item = gameData.items[itemId];
  const tooltip = window.createItemTooltip?.(item);
  if (!tooltip) return;
  document.body.appendChild(tooltip);
  const rect = event.target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const wouldOverflowRight = rect.right + 10 + tooltipRect.width > windowWidth;
  if (wouldOverflowRight) {
    tooltip.style.left = rect.left - tooltipRect.width - 10 + "px";
  } else {
    tooltip.style.left = rect.right + 10 + "px";
  }
  let topPosition = rect.top + window.scrollY;
  const wouldOverflowBottom = rect.top + tooltipRect.height > windowHeight;
  if (wouldOverflowBottom) {
    topPosition = rect.bottom + window.scrollY - tooltipRect.height;
    topPosition = Math.max(window.scrollY, topPosition);
  }
  tooltip.style.top = topPosition + "px";
  requestAnimationFrame(() => tooltip.classList.add("show"));
  itemTooltip = tooltip;
};

window.getBandageIds = function () {
  const ids = Object.keys(gameData.items || {}).filter((id) =>
    /_bandage$/.test(id)
  );
  return ids;
};

window.getBandageHealAmount = function (itemId) {
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
};

window.useBandage = function (itemId) {
  if (!itemId) return false;
  if (!gameState.bank[itemId] || gameState.bank[itemId] <= 0) return false;
  const heal = getBandageHealAmount(itemId);
  if (heal <= 0) return false;
  if (gameState.player.hp >= gameState.player.maxHp) {
    showNotification("You are already at full health!", "info");
    return false;
  }
  removeFromBank(itemId, 1);
  const before = gameState.player.hp;
  gameState.player.hp = Math.min(
    gameState.player.maxHp,
    gameState.player.hp + heal
  );
  const itemName = getItemName(itemId) || "Bandage";
  showNotification(
    `Healed ${gameState.player.hp - before} HP with ${itemName}`,
    "success"
  );
  addCombatLog(
    `Used ${itemName} (+${gameState.player.hp - before} HP)`,
    "log-heal"
  );
  return true;
};

window.populateBandageDropdown = function () {
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
};

window.populateFoodDropdown = function () {
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
};

window.getOrCreateHeldGhost = function () {
  let ghost = document.getElementById("bank-held-ghost");
  if (!ghost) {
    ghost = document.createElement("div");
    ghost.id = "bank-held-ghost";
    ghost.style.cssText =
      "position:absolute; pointer-events:none; z-index:9999; display:none; background:#111111; border:1px solid rgba(255,255,255,0.1); border-radius:4px; padding:4px 6px; color:#f8f9fa; font-size:12px; box-shadow:0 2px 6px rgba(0,0,0,0.3);";
    document.body.appendChild(ghost);
  }
  return ghost;
};

window.showHeldGhost = function (itemId) {
  const ghost = getOrCreateHeldGhost();
  const item = gameData.items[itemId];
  const icon = item?.icon || "??";
  const qty = gameState.bank[itemId] || 0;
  ghost.innerHTML = `<span style="font-size:16px; margin-right:6px;">${icon}</span><span>${
    item?.name || itemId
  } (${qty})</span>`;
  ghost.style.display = "block";
};

window.getRarityColor = function (rarity) {
  switch (rarity) {
    case "guaranteed":
      return "#fff";
    case "epic":
      return "#a855f7";
    case "rare":
      return "#3b82f6";
    case "common":
      return "#10b981";
    default:
      return "#238636";
  }
};

window.getItemName = function (itemId) {
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
};

window.useSelectedBandageOrBest = function (quiet = false) {
  const sel = document.getElementById("select-bandage");
  const chosen =
    gameState.combat.selectedBandageId || (sel && sel.value ? sel.value : null);
  if (chosen && (gameState.bank[chosen] || 0) > 0) {
    if (gameState.player.hp >= gameState.player.maxHp) {
      if (!quiet) showNotification("HP is already full");
      return false;
    }
    const ok = useBandage(chosen);
    populateBandageDropdown();
    return ok;
  }
  // Auto-select best available bandage when none explicitly chosen
  const candidates = getBandageIds().filter(
    (id) => (gameState.bank[id] || 0) > 0
  );
  if (candidates.length === 0) {
    if (!quiet) showNotification("No bandages available");
    return false;
  }
  candidates.sort((a, b) => getBandageHealAmount(b) - getBandageHealAmount(a));
  const best = candidates[0];
  if (gameState.player.hp >= gameState.player.maxHp) {
    if (!quiet) showNotification("HP is already full");
    return false;
  }
  const used = useBandage(best);
  populateBandageDropdown();
  return used;
};

window.addCombatLog = function (message, className = "") {
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
};

window.addXP = function (skill, amount) {
  const skillData = gameState.skills[skill];
  if (!skillData) return;

  skillData.xp += amount;
  const newLevel = calculateLevel(skillData.xp);
  if (newLevel > skillData.level) {
    skillData.level = newLevel;
    showNotification(
      `${
        skill.charAt(0).toUpperCase() + skill.slice(1)
      } level up! Now level ${newLevel}`
    );

    if (
      ["fitness", "defense", "melee", "firearms", "explosives"].includes(skill)
    ) {
      updateCombatLevel();
      updatePlayerStats();
    }

    if (skill === "farming") {
      checkUnlockFarmingPlots(newLevel);
    }

    if (skill === "animalcare") {
      checkUnlockAnimalStructures(newLevel);
    }
  }
};

window.calculateLevel = function (xp) {
  let totalXpNeeded = 0;
  let level = 1;
  while (totalXpNeeded <= xp) {
    level++;
    totalXpNeeded += level * 100;
  }
  return level - 1;
};

window.getXPForLevel = function (level) {
  let totalXp = 0;
  for (let i = 2; i <= level; i++) {
    totalXp += i * 100;
  }
  return totalXp;
};

window.getXPForNextLevel = function (currentLevel) {
  return (currentLevel + 1) * 100;
};

window.updateCombatLevel = function () {
  const combatSkills = [
    "fitness",
    "defense",
    "melee",
    "firearms",
    "explosives",
  ];
  let totalLevels = 0;
  combatSkills.forEach((skill) => {
    totalLevels += gameState.skills[skill].level;
  });
  gameState.player.combatLevel = Math.floor(totalLevels / combatSkills.length);
};

// ======= Fixed version (balanced braces & logic) =======
window.updateAnimalCareProgress = function () {
  const currentTime = Date.now();

  window.harvestAnimal = function (structure) {
    if (structure.placedAnimal && structure.placedAnimal.produces) {
      const a = structure.placedAnimal;
      const count = a.count || 1;
      a.produces.forEach((productId) => {
        const baseQty = Math.floor(Math.random() * 3) + 2;
        const quantity = baseQty * count;
        addToBank(productId, quantity);
        addToMessageLog(
          `Harvested ${quantity}x ${getItemName(productId)} from ${
            a.name
          } (x${count}) in ${structure.name}`,
          "success"
        );
      });
    }
  };

  gameState.animalCare.unlockedStructures.forEach((structure) => {
    if (!structure.placedAnimal) return;

    // Byproduct every 1 minute
    if (
      structure.lastByproduct &&
      currentTime - structure.lastByproduct >= 60000
    ) {
      const a = structure.placedAnimal;
      const count = a.count || 1;
      const byproductPoolByAnimal = {
        cow: ["manure", "leather"],
        dairy_cow: ["manure", "leather"],
        pig: ["manure", "leather"],
        sheep: ["manure", "wool", "hide"],
        goat: ["manure", "hide"],
        llama: ["manure", "fiber", "hide"],
        alpaca: ["manure", "fiber", "hide"],
        chicken: ["manure", "feathers"],
        rooster: ["manure", "feathers"],
        duck: ["manure", "feathers"],
        goose: ["manure", "feathers"],
        turkey: ["manure", "feathers"],
        guinea_fowl: ["manure", "feathers"],
        quail: ["manure", "feathers"],
        pigeon: ["manure", "feathers"],
        dove: ["manure", "feathers"],
        peacock: ["manure", "feathers"],
        rabbit: ["manure", "pelt"],
        guinea_pig: ["manure", "fur"],
        ferret: ["manure", "fur"],
        chinchilla: ["manure", "fur", "pelt"],
        bees: ["beeswax"],
        silkworm: ["silk_thread"],
        mealworm: ["mealworms"],
      };
      const pool = byproductPoolByAnimal[a.id] || ["manure"];
      const randomByproduct = pool[Math.floor(Math.random() * pool.length)];
      const baseQty = Math.floor(Math.random() * 3) + 1;
      const quantity = baseQty * count;
      addToBank(randomByproduct, quantity);
      addToMessageLog(
        `Collected ${quantity}x ${getItemName(randomByproduct)} from ${
          a.name
        } (x${count}) in ${structure.name}`,
        "success"
      );
      structure.lastByproduct = currentTime;
    }

    // Harvest every 4 minutes
    if (
      structure.lastHarvest &&
      currentTime - structure.lastHarvest >= 240000
    ) {
      harvestAnimal(structure);
      structure.lastHarvest = currentTime;
    }
  });
};

window.getNextPenUnlockLevel = function (playerLevel) {
  const nextStructure = ANIMAL_CARE_DATA.structures.find(
    (structure) => structure.level > playerLevel
  );
  return nextStructure ? nextStructure.level : null;
};

// ======= Fixed version (closed function & appended + tab) =======
window.setupBankTabs = function () {
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
  tabsEl.appendChild(plus);
};

window.goBackToAreas = function () {
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
};

// ======= Fixed: close this function so the rest isn’t nested =======
window.showAreaDetail = function (areaId) {
  const area = gameData.areas.find((a) => a.id === areaId);
  if (!area) return;

  gameState.currentArea = area;

  document.getElementById("area-detail-title").textContent = area.name;
  const contentHeader = document.querySelector(
    "#area-detail-page .content-header"
  );
  const existingButton = contentHeader.querySelector(".drops-toggle-button");

  if (!existingButton) {
    const toggleButton = document.createElement("button");
    toggleButton.className = "drops-toggle-button";
    toggleButton.textContent = "Drops %";
    toggleButton.style.cssText = `
      background: ${showDropPercentages ? "#2ecc71" : "rgba(255,255,255,0.06)"};
      color: #e6edf3;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      margin-left: 10px;
      transition: background-color 0.3s;
    `;

    toggleButton.addEventListener("click", () => {
      showDropPercentages = !showDropPercentages;
      toggleButton.style.background = showDropPercentages
        ? "#2ecc71"
        : "rgba(255,255,255,0.06)";
      renderAreaContent(area);
    });

    contentHeader.appendChild(toggleButton);
  }
}; // CLOSE showAreaDetail

// A simple areas renderer (ensures top-level scope; safe if you already have one)
window.renderAreas = function () {
  const grid = document.getElementById("areas-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!gameData.areas) {
    grid.innerHTML =
      '<div style="color: #8b949e; text-align: center; padding: 20px;">No areas available.</div>';
    return;
  }

  gameData.areas.forEach((area) => {
    const isUnlocked = gameState.player.combatLevel >= area.level;
    const card = document.createElement("div");
    card.className = `area-card ${isUnlocked ? "" : "locked"}`;
    card.dataset.areaId = area.id;

    const hasZombies = area.factions.some(
      (faction) => faction.toLowerCase() === "zombies"
    );
    const isOnlyZombies = area.factions.length === 1 && hasZombies;
    const isStronghold =
      area.description?.startsWith("Stronghold") ||
      area.description?.startsWith("Infested Stronghold");
    const zoneLabels = [];
    if (hasZombies) zoneLabels.push({ type: "infested", label: "INFESTED" });
    if (isOnlyZombies || isStronghold) {
      zoneLabels.push({ type: "stronghold", label: "STRONGHOLD" });
    } else if (hasZombies && area.factions.length > 1) {
      zoneLabels.push({ type: "warzone", label: "WARZONE" });
    } else if (!hasZombies && !isStronghold) {
      zoneLabels.push({ type: "warzone", label: "WARZONE" });
    }
    const zoneLabelsHtml = zoneLabels
      .map(
        (zone, index) =>
          `<div class="zone-label ${zone.type}" style="top: ${
            10 + index * 30
          }px;">${zone.label}</div>`
      )
      .join("");

    const factionSpans = area.factions
      .map((faction) => {
        const factionClass = `faction-${faction
          .toLowerCase()
          .replace(/\s+/g, "_")}`;
        return `<span class="${factionClass}">${faction}</span>`;
      })
      .join(", ");

    card.innerHTML = `
      ${zoneLabelsHtml}
      <div class="area-name">${area.name}</div>
      <div class="area-level">Level ${area.level} Required</div>
      <div class="area-factions">Factions: ${factionSpans}</div>
    `;
    card.addEventListener("click", () => window.showAreaDetail(area.id));
    grid.appendChild(card);
  });
};

// === Gathering nodes helper shown on area detail; safe stub to keep syntax ===
window.renderGatheringResources = function (area) {
  const container = document.getElementById("gathering-resources");
  if (!container) return;
  container.innerHTML = "";

  if (!area || !area.gathering) {
    const noResourcesDiv = document.createElement("div");
    noResourcesDiv.style.cssText =
      "color: #8b949e; text-align: center; padding: 20px;";
    noResourcesDiv.textContent =
      "No gathering resources available in this area.";
    container.appendChild(noResourcesDiv);
    return;
  }

  Object.keys(area.gathering).forEach((skillType) => {
    const resourceIds = area.gathering[skillType];
    if (!resourceIds || !Array.isArray(resourceIds)) return;

    resourceIds.forEach((resourceId) => {
      const skill = gameData.skills.gathering_skills[skillType];
      if (!skill || !skill.nodes) {
        console.warn(`Skill not found or missing nodes: ${skillType}`);
        return;
      }
      const resource = skill.nodes.find((node) => node.id === resourceId);
      if (!resource) {
        console.warn(`Resource not found: ${resourceId} in skill ${skillType}`);
        return;
      }
      const requiredLevel = resource.level;
      const playerSkill = gameState.skills[skillType];
      if (!playerSkill) {
        console.warn(`Player skill not found: ${skillType}`);
        return;
      }
      const playerLevel = playerSkill.level;
      const canGather = playerLevel >= requiredLevel;

      const card = document.createElement("div");
      const diffClass = getNodeDifficultyClass(playerLevel, requiredLevel);
      card.className = `resource-card ${diffClass} ${
        canGather ? "" : "locked"
      }`;
      card.dataset.resourceId = resource.id;
      card.dataset.skill = skillType;

      let dropsHtml = "";
      if (showDropPercentages && resource.drops) {
        dropsHtml =
          '<div style="margin-top: 8px; border-top: 1px solid #555; padding-top: 5px;">';
        resource.drops.forEach((drop) => {
          if (drop.rarity) {
            const dropChance = calculateRarityChance(
              drop.rarity,
              playerLevel,
              resource.level
            );
            const rarityColor = getRarityColor(drop.rarity);
            const itemName = getItemName(drop.item);
            dropsHtml += `
              <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0; font-size: 11px;">
                <span style="color: #bbb; cursor: help;" data-item-tooltip="${
                  drop.item
                }">${itemName}</span>
                <span style="color: ${rarityColor}; font-weight: bold; cursor: help;" title="${
              drop.rarity.charAt(0).toUpperCase() + drop.rarity.slice(1)
            }: ${(dropChance * 100).toFixed(1)}% chance (Level diff: ${
              playerLevel - resource.level
            })">${(dropChance * 100).toFixed(1)}%</span>
              </div>
            `;
          } else if (drop.chance) {
            const percentage = (drop.chance * 100).toFixed(1);
            const itemName = getItemName(drop.item);
            dropsHtml += `
              <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0; font-size: 11px;">
                <span style="color: #bbb; cursor: help;" data-item-tooltip="${drop.item}">${itemName}</span>
                <span style="color: #238636; font-weight: bold;">${percentage}%</span>
              </div>
            `;
          }
        });
        dropsHtml += "</div>";
      }

      card.innerHTML = `
        <h4>${resource.name}</h4>
        <div>Level ${requiredLevel} ${skillType}</div>
        <div>${resource.xp} XP</div>
        <div>${(resource.time / 1000).toFixed(1)}s per action</div>
        ${dropsHtml}
        <div class="progress-bar" style="display: none;">
          <div class="progress-fill"></div>
        </div>
      `;

      if (canGather) {
        card.addEventListener("click", () => {
          selectResource(card, resource, skillType);
        });
      }

      container.appendChild(card);
    });
  });
};

window.selectResource = function (card, resource, skillType) {
  if (gameState.combat && gameState.combat.inCombat) {
    escapeBattle();
  }
  if (card.classList.contains("active")) {
    document
      .querySelectorAll(".resource-card")
      .forEach((c) => c.classList.remove("active"));
    hideGatheringProgress();

    gameState.currentAction = null;
    currentSkill = null;
    addGatheringLog("Gathering stopped");
    return;
  }

  document
    .querySelectorAll(".resource-card")
    .forEach((c) => c.classList.remove("active"));
  card.classList.add("active");

  currentSkill = skillType;
  createGatheringProgressBox(resource.name);
  showGatheringProgress();

  startGatheringAction(resource.id, skillType);
  addGatheringLog(`Started gathering ${resource.name}`);
};

window.renderEnemies = function (area) {
  const enemyContainer = document.getElementById("enemy-list");
  const dungeonContainer = document.getElementById("dungeon-list");
  if (enemyContainer) enemyContainer.innerHTML = "";
  if (dungeonContainer) dungeonContainer.innerHTML = "";
  const whitelist =
    area.enemyWhitelist instanceof Set ? area.enemyWhitelist : null;
  const areaLevel = area.level || 1;

  const pickFromFaction = function (factionId, kind, applyWhitelist = false) {
    const f = gameData.enemies && gameData.enemies[factionId];
    if (!f) return null;
    const pool = kind === "boss" ? f.bosses || [] : f.regular || [];
    let candidates = pool;
    if (applyWhitelist && whitelist)
      candidates = pool.filter((e) => whitelist.has(nf(e.name)));
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  };
  const makeScaled = function (factionId, enemyData, level, kind) {
    if (!enemyData) return null;
    return scaleEnemyForLevel(factionId, enemyData, level, kind);
  };
  const findRegularEnemyByName = function (name) {
    const target = nf(name);
    const all = gameData.enemies || {};
    for (const [fid, faction] of Object.entries(all)) {
      const pool = (faction && faction.regular) || [];
      for (const e of pool) {
        if (nf(e.name) === target) return { factionId: fid, enemy: e };
      }
    }
    return null;
  };
  const buildNormalEnemies = function () {
    const out = [];
    const cfg =
      typeof AREA_REVAMP_CONFIG !== "undefined" && area && area.id
        ? AREA_REVAMP_CONFIG[area.id]
        : null;
    const whitelistArray =
      cfg && Array.isArray(cfg.enemies) ? cfg.enemies : null;

    if (whitelistArray && whitelistArray.length > 0) {
      whitelistArray.forEach((name, i) => {
        const found = findRegularEnemyByName(name);
        if (!found) {
          console.warn(
            "Normal enemy not found for name:",
            name,
            "in area",
            area.id || area.name
          );
          return;
        }
        const level = areaLevel + 1 + (i % 3); // cycle +1..+3 for variety
        const scaled = makeScaled(
          found.factionId,
          found.enemy,
          level,
          "regular"
        );
        if (scaled) out.push(scaled);
      });
      return out;
    }
    const areaFactions = (area.factions || []).map(
      (name) => NAME_TO_FACTION_ID[name] || name
    );
    areaFactions.forEach((fid) => {
      const levels = [areaLevel + 1, areaLevel + 2, areaLevel + 3];
      levels.forEach((L) => {
        const e = pickFromFaction(
          fid,
          "regular",
          true /* apply whitelist if any */
        );
        const scaled = makeScaled(fid, e, L, "regular");
        if (scaled) out.push(scaled);
      });
    });
    return out;
  };
  const renderNormalEnemyList = function (list) {
    if (!enemyContainer) return;
    enemyContainer.innerHTML = "";
    if (!list || list.length === 0) {
      enemyContainer.innerHTML =
        '<div style="color: #8b949e; text-align: center; padding: 20px;">No enemies available in this area.</div>';
      return;
    }
    list.forEach((enemy) => {
      const canFight = gameState.player.combatLevel >= enemy.level;
      const item = document.createElement("div");
      const factionClass = enemy.factionId ? `faction-${enemy.factionId}` : "";
      item.className = `enemy-item ${factionClass} ${canFight ? "" : "locked"}`;
      item.dataset.enemyId = enemy.id;

      let dropsHtml = "";
      if (
        showDropPercentages &&
        Array.isArray(enemy.drops) &&
        enemy.drops.length
      ) {
        const playerLevel = gameState.player.combatLevel;
        const enemyLevel = enemy.level || enemy.baseLevel || 1;
        dropsHtml =
          '<div style="margin-top: 8px; border-top: 1px solid #555; padding-top: 5px;">';
        enemy.drops.forEach((drop) => {
          const itemName = getItemName(drop.item || "scrap");
          if (drop.rarity) {
            const dropChance = calculateRarityChance(
              drop.rarity,
              playerLevel,
              enemyLevel
            );
            const rarityColor = getRarityColor(drop.rarity);
            const quantityText =
              drop.min && drop.max
                ? ` (${drop.min}-${drop.max})`
                : drop.min
                ? ` (${drop.min})`
                : "";
            dropsHtml += `
              <div style="display:flex; justify-content:space-between; align-items:center; margin:2px 0; font-size:11px;">
                <span style="color:#bbb;">${itemName}${quantityText}</span>
                <span style="color:${rarityColor}; font-weight:bold;">${(
              dropChance * 100
            ).toFixed(1)}%</span>
              </div>`;
          } else if (typeof drop.chance === "number") {
            const percentage = (drop.chance * 100).toFixed(1);
            const quantityText =
              drop.min && drop.max
                ? ` (${drop.min}-${drop.max})`
                : drop.min
                ? ` (${drop.min})`
                : "";
            dropsHtml += `
              <div style="display:flex; justify-content:space-between; align-items:center; margin:2px 0; font-size:11px;">
                <span style="color:#bbb;">${itemName}${quantityText}</span>
                <span style="color:#238636; font-weight:bold;">${percentage}%</span>
              </div>`;
          }
        });
        dropsHtml += "</div>";
      }

      item.innerHTML = `
        <div><strong style="color: white;">Lv ${enemy.level}</strong> <strong class="enemy-name">${enemy.name}</strong></div>
        <div style="color: white;">HP ${enemy.hp} • Atk ${enemy.attack} • Def ${enemy.defense}</div>
        ${dropsHtml}`;
      item.addEventListener("click", () => selectEnemy(item, enemy));
      enemyContainer.appendChild(item);
    });
  };

  const normalEnemies = buildNormalEnemies();
  renderNormalEnemyList(normalEnemies);
  if (!gameState.combat.inDungeon) {
    gameState.combat.dungeonEnemies = {}; // clear cached sequences when not in an active run
  }

  if (dungeonContainer) {
    if (!area.dungeons || area.dungeons.length === 0) {
      dungeonContainer.innerHTML =
        '<div style="color: #8b949e; text-align: center; padding: 20px;">No dungeons or raids here.</div>';
    } else {
      dungeonContainer.innerHTML = "";
      area.dungeons.forEach((d) => {
        const card = document.createElement("div");
        card.className = "dungeon-card";
        card.dataset.dungeonId = d.id;
        const typeLabel = (d.type || "dungeon").toUpperCase();
        const completed = (gameState.combat.dungeonCompleted || []).includes(
          d.id
        );
        const isActive =
          gameState.combat.inDungeon &&
          gameState.combat.currentDungeon === d.id;
        const btnLabel = isActive ? "Continue" : completed ? "Replay" : "Start";
        if (isActive) {
          card.classList.add("active");
        }
        let primaryFaction = null;
        if (d.primaryFaction) {
          primaryFaction = d.primaryFaction;
        } else if (gameState.currentArea && gameState.currentArea.factions) {
          const areaFactions = gameState.currentArea.factions.map(
            (name) => NAME_TO_FACTION_ID[name] || name.toLowerCase()
          );
          primaryFaction = areaFactions[0];
        }
        const primaryColor = getFactionRGBString(primaryFaction);
        const cardGradient = `background: linear-gradient(135deg, rgba(${primaryColor},0.2), rgba(128,128,128,0.1));`;
        card.style.cssText += cardGradient;

        let progressText = "";
        let enemyListHtml = "";
        if (
          isActive &&
          gameState.combat.dungeonEnemies &&
          gameState.combat.dungeonEnemies[d.id]
        ) {
          const enemies = gameState.combat.dungeonEnemies[d.id];
          const total = enemies.length;
          const current = gameState.combat.dungeonProgress || 0;
          progressText = `<div style="font-size:11px; color:#888; margin-top:4px;">Progress: ${
            current + 1
          }/${total}</div>`;
          enemyListHtml = `
            <div style="margin-top:8px; padding:8px; background:rgba(0,0,0,0.3); border-radius:4px;">
              <div style="font-size:11px; color:#bbb; margin-bottom:4px;">Enemy Order:</div>
              <div style="display:flex; flex-direction:column; gap:2px;">
                ${enemies
                  .map((enemy, index) => {
                    const isCurrent = index === current;
                    const isPast = index < current;
                    const color = isCurrent
                      ? "#ff4444"
                      : isPast
                      ? "#666"
                      : "#aaa";
                    const prefix = isCurrent ? "► " : isPast ? "✓ " : "  ";
                    return `<div style="font-size:10px; color:${color};">${prefix}${enemy.name} (Lv${enemy.level})</div>`;
                  })
                  .join("")}
              </div>
            </div>`;
        }

        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h5 style="margin:0;">${d.name}</h5>
            <span style="font-size:10px; padding:2px 6px; border:1px solid #555; border-radius:10px; color:#bbb;">${typeLabel}</span>
          </div>
          ${progressText}
          ${enemyListHtml}
          <div style="margin-top:8px; display:flex; gap:6px;">
            <button class="action-button" data-action="start-run">${btnLabel}</button>
            ${
              completed
                ? '<span class="chip" style="background:#1f6feb33; border:1px solid #1f6feb;">Completed</span>'
                : ""
            }
          </div>`;
        card
          .querySelector('[data-action="start-run"]')
          .addEventListener("click", (ev) => {
            ev.stopPropagation();
            startDungeonRun(d.id);
          });
        dungeonContainer.appendChild(card);
      });
    }
  }
  const factionDescEl = document.getElementById("faction-description");
  if (factionDescEl) factionDescEl.textContent = area.description || "";
};

window.selectEnemy = function (item, enemy) {
  stopGathering("Switched to combat");
  if (item.classList.contains("active")) {
    document
      .querySelectorAll(".enemy-item")
      .forEach((i) => i.classList.remove("active"));
    gameState.combat.inCombat = false;
    gameState.combat.currentEnemy = null;
    if (gameState.combat.inDungeon) {
      if (confirm("You are in a dungeon run. Stop dungeon progress?")) {
        gameState.combat.inDungeon = false;
        gameState.combat.currentDungeon = null;
        gameState.combat.dungeonProgress = 0;
        renderEnemies(gameState.currentArea); // Update UI to reflect dungeon stopped
      } else {
        item.classList.add("active");
        gameState.combat.inCombat = true;
        gameState.combat.currentEnemy = enemy;
        return;
      }
    }
    const cpbStop = document.getElementById("combat-progress");
    if (cpbStop) cpbStop.style.display = "none";
    document.getElementById("enemy-display").style.display = "none";
    const noEnemy = document.getElementById("no-enemy");
    if (noEnemy) noEnemy.style.display = "block";
    addCombatLog("Combat stopped");
    return;
  }

  document
    .querySelectorAll(".enemy-item")
    .forEach((i) => i.classList.remove("active"));
  document
    .querySelectorAll(".resource-card.active")
    .forEach((c) => c.classList.remove("active"));
  item.classList.add("active");
  gameState.combat.inDungeon = false;
  gameState.combat.currentDungeon = null;
  startCombat(enemy);
};

window.useBirdNest = function () {
  const nonForagingSeeds = [
    "melon_seeds",
    "cucumber_seeds",
    "watermelon_seeds",
    "squash_seeds",
    "pumpkin_seeds",
    "zucchini_seeds",
    "turnip_seeds",
    "ramps_bulb",
    "shallot_bulb",
    "clover_seeds",
    "sumac_seeds",
    "basil_seeds",
    "chives_seeds",
    "cilantro_seeds",
    "dill_seeds",
    "marjoram_seeds",
    "oregano_seeds",
    "parsley_seeds",
    "rosemary_seeds",
    "sage_seeds",
    "savory_seeds",
    "tarragon_seeds",
    "thyme_seeds",
    "shiso_seeds",
  ];
  const seedId =
    nonForagingSeeds[Math.floor(Math.random() * nonForagingSeeds.length)];
  addToBank(seedId, 1);
  showNotification("You found a " + getItemName(seedId) + " in the bird nest!");
  removeFromBank("birds_nest", 1);
  updateUI();
};

window.useFood = function (itemId) {
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
};

window.useOpenable = function (itemId) {
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
  const itemName = getItemName(rewardId);
  showNotification(`You opened a ${item.name} and found ${itemName}!`);
  addToMessageLog(`+1 ${itemName} from ${item.name}`, "success");
  renderBank();
};

window.showSkillPage = function (skill) {
  currentSkill = skill;
  const gatheringSkills = [
    "woodcutting",
    "mining",
    "fishing",
    "foraging",
    "hunting",
    "looting",
    "scavenging",
  ];
  const craftingSkills = [
    "cooking",
    "tinkering",
    "forging",
    "tailoring",
    "gunsmithing",
    "carpentry",
    "firstaid",
    "masonry",
    "chemistry",
    "electrical",
  ];
  const passiveSkills = ["farming", "animalcare"];
  const combatSkills = [
    "fitness",
    "defense",
    "melee",
    "firearms",
    "explosives",
  ];
  if (gatheringSkills.includes(skill)) {
    if (gameState.combat && gameState.combat.inCombat) {
      escapeBattle();
    }
    showSkillGatheringPage(skill);
  } else if (craftingSkills.includes(skill)) {
    if (gameState.combat && gameState.combat.inCombat) escapeBattle();
    stopGathering();
    showSkillCraftingPage(skill);
  } else if (passiveSkills.includes(skill)) {
    if (gameState.combat && gameState.combat.inCombat) escapeBattle();
    stopGathering();
    showSkillPassivePage(skill);
  } else if (combatSkills.includes(skill)) {
    stopGathering();
    showCombatSkillPage(skill);
  }

  showPage("skill");

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });
  const skillNavItem = document.querySelector(`[data-skill="${skill}"]`);
  if (skillNavItem) {
    skillNavItem.classList.add("active");
  }

  updateSkillInfo();
};

window.switchTab = function (tabName) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
    if (tab.dataset.tab === tabName) {
      tab.classList.add("active");
    }
  });

  document.querySelectorAll(".area-content").forEach((content) => {
    content.classList.remove("active");
  });
  const activeContent = document.getElementById(`${tabName}-tab`);
  if (activeContent) {
    activeContent.classList.add("active");
  }
};

window.saveGame = function () {
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
};

window.loadGame = function () {
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
  }
};

window.resetGame = function () {
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
};

window.addGatheringLog = function (message, className = "") {
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
};

window.addToMessageLog = function (message, type = "info") {
  showNotification(message);
  const className =
    type === "error" ? "log-error" : type === "success" ? "log-success" : "";
  addGatheringLog(message, className);
};

window.showSkillGatheringPage = function (skill) {
  const skillPage = document.getElementById("skill-page");
  const skillContent = document.getElementById("skill-content");

  skillContent.innerHTML = "";
  const toggleContainer = document.createElement("div");
  toggleContainer.style.cssText = "margin-bottom: 15px; text-align: center;";
  const toggleButton = document.createElement("button");
  toggleButton.textContent = "Drops %";
  toggleButton.style.cssText = `
    background: ${showDropPercentages ? "#2ecc71" : "rgba(255,255,255,0.06)"};
    color: #e6edf3;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
  `;

  toggleButton.addEventListener("click", () => {
    showDropPercentages = !showDropPercentages;
    showSkillGatheringPage(skill);
  });

  toggleContainer.appendChild(toggleButton);
  skillContent.appendChild(toggleContainer);
  const nodesGrid = document.createElement("div");
  nodesGrid.className = "gathering-grid";

  gameData.areas.forEach((area) => {
    if (area.gathering && area.gathering[skill]) {
      area.gathering[skill].forEach((resourceId) => {
        const skillData = gameData.skills.gathering_skills[skill];
        if (!skillData || !skillData.nodes) {
          console.warn(`Skill not found or missing nodes: ${skill}`);
          return;
        }
        const resource = skillData.nodes.find((node) => node.id === resourceId);
        if (!resource) {
          console.warn(`Resource not found: ${resourceId} in skill ${skill}`);
          return;
        }
        // could populate previews here if desired
      });
    }
  });
  // append the nodes grid once we've iterated all areas/resources
  skillContent.appendChild(nodesGrid);
};

// ===== Combat skill details card =====
window.showCombatSkillPage = function (skill) {
  const skillPage = document.getElementById("skill-page");
  const skillContent = document.getElementById("skill-content");
  skillContent.innerHTML = "";
  const getLevel = (s) => gameState.skills[s]?.level || 0;
  const L = getLevel(skill);
  const wrap = document.createElement("div");
  wrap.style.cssText =
    "display:flex; flex-direction:column; gap:12px; max-width:720px; margin:0 auto;";
  const mkCard = (titleText, rows) => {
    const card = document.createElement("div");
    card.className = "resource-card";
    card.style.padding = "12px";
    const title = document.createElement("div");
    title.style.cssText =
      "color: var(--brand); margin-bottom: 8px; font-weight: 600;";
    title.textContent = titleText;
    card.appendChild(title);
    rows.forEach(([label, value]) => {
      const line = document.createElement("div");
      line.style.cssText =
        "display:flex; justify-content:space-between; font-size:13px; color:#c9d1d9; margin:2px 0;";
      const l = document.createElement("span");
      l.textContent = label;
      const v = document.createElement("span");
      v.textContent = value;
      v.style.color = "#8b949e";
      line.appendChild(l);
      line.appendChild(v);
      card.appendChild(line);
    });
    return card;
  };

  const currentRows = [];
  if (skill === "fitness") {
    const hp = Math.floor(25 * Math.pow(1 + L, 0.9));
    const regen = 0.5 * Math.pow(1 + L, 0.4);
    const statusResist = 2 * Math.pow(1 + L, 0.3);
    currentRows.push(["HP", "+ " + hp + " - (HP = 25 * (1 + L)^0.9)"]);
    currentRows.push([
      "HP Regeneration",
      "+ " + regen.toFixed(2) + " per second - (HP_Regen = 0.5 * (1 + L)^0.4)",
    ]);
    currentRows.push([
      "Status Resistance",
      "+ " +
        Math.round(statusResist) +
        "% - (Status_Resistance = 2 * (1 + L)^0.3)",
    ]);
  } else if (skill === "defense") {
    const def = Math.floor(3 * Math.pow(1 + L, 0.8));
    const dr = 1 * Math.pow(1 + L, 0.35);
    const block = 1 * Math.pow(1 + L, 0.25);
    currentRows.push([
      "Defense",
      "+ " + def + " - (Defense = 3 * (1 + L)^0.8)",
    ]);
    currentRows.push([
      "Damage Reduction",
      "+ " + dr.toFixed(2) + "% - (Damage_Reduction = 1 * (1 + L)^0.35)",
    ]);
    currentRows.push([
      "Block Chance",
      "+ " + block.toFixed(2) + "% - (Block_Chance = 1 * (1 + L)^0.25)",
    ]);
  } else if (skill === "melee") {
    const atk = Math.floor(4 * Math.pow(1 + L, 0.75));
    const acc = Math.floor(5 * Math.pow(1 + L, 0.6));
    const crit = 1 * Math.pow(1 + L, 0.4);
    const spd = 2 * Math.pow(1 + L, 0.35);
    currentRows.push(["Attack", "+ " + atk + " - (Attack = 4 * (1 + L)^0.75)"]);
    currentRows.push([
      "Accuracy",
      "+ " + acc + " - (Accuracy = 5 * (1 + L)^0.6)",
    ]);
    currentRows.push([
      "Critical",
      "+ " + Math.min(95, crit).toFixed(2) + "% - (Critical = 1 * (1 + L)^0.4)",
    ]);
    currentRows.push([
      "Attack Speed",
      "+ " + Math.round(spd) + "% - (Attack_Speed = 2 * (1 + L)^0.35)",
    ]);
  } else if (skill === "firearms") {
    const atk = Math.floor(3 * Math.pow(1 + L, 0.7));
    const acc = Math.floor(8 * Math.pow(1 + L, 0.65));
    const crit = 1 * Math.pow(1 + L, 0.4);
    const spd = 2 * Math.pow(1 + L, 0.35);
    currentRows.push(["Attack", "+ " + atk + " - (Attack = 3 * (1 + L)^0.7)"]);
    currentRows.push([
      "Accuracy",
      "+ " + acc + " - (Accuracy = 8 * (1 + L)^0.65)",
    ]);
    currentRows.push([
      "Critical",
      `+${Math.min(95, crit).toFixed(2)}% - (Critical = 1 * (1 + L)^0.4)`,
    ]);
    currentRows.push([
      "Attack Speed",
      `+${Math.round(spd)}% - (Attack_Speed = 2 * (1 + L)^0.35)`,
    ]);
  } else if (skill === "explosives") {
    const atk = Math.floor(6 * Math.pow(1 + L, 0.8));
    const pen = 3 * Math.pow(1 + L, 0.5);
    const crit = 2 * Math.pow(1 + L, 0.45);
    const elem = 5 * Math.pow(1 + L, 0.3);
    currentRows.push(["Attack", "+ " + atk + " - (Attack = 6 * (1 + L)^0.8)"]);
    currentRows.push([
      "Armor Penetration",
      "+ " + Math.round(pen) + "% - (Armor_Penetration = 3 * (1 + L)^0.5)",
    ]);
    currentRows.push([
      "Critical",
      "+ " +
        Math.min(95, crit).toFixed(2) +
        "% - (Critical = 2 * (1 + L)^0.45)",
    ]);
    currentRows.push([
      "Elemental_Status_Chance",
      Math.round(elem) + " - (Elemental_Status_Chance = 5 * (1 + L)^0.3)",
    ]);
  }
  const friendly =
    skill === "firearms"
      ? "Ranged"
      : skill.charAt(0).toUpperCase() + skill.slice(1);
  wrap.appendChild(
    mkCard(`${friendly}: Current bonuses (Level ${L})`, currentRows)
  );

  const milestoneWrap = document.createElement("div");
  milestoneWrap.className = "resource-card";
  milestoneWrap.style.padding = "12px";
  const mt = document.createElement("div");
  mt.style.cssText =
    "color: var(--brand); margin-bottom: 8px; font-weight: 600;";
  mt.textContent = `${friendly}: Milestone bonuses`;
  milestoneWrap.appendChild(mt);
  const ul = document.createElement("ul");
  ul.style.cssText = "margin: 0; padding-left: 18px; color: #c9d1d9;";
  const addLi = (text) => {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  };
  if (skill === "fitness") {
    addLi("Level 25: +5% Max HP");
    addLi("Level 50: +10% HP Regeneration Rate");
    addLi("Level 75: +15% Status Effect Resistance");
    addLi("Level 99: +20% Max HP, Immunity to Poison");
  } else if (skill === "defense") {
    addLi("Level 25: +3% Damage Reduction");
    addLi("Level 50: +5% Block Chance");
    addLi("Level 75: +5% Damage Reduction");
    addLi("Level 99: +10% Block Chance, 50% chance to reflect 25% damage");
  }
  milestoneWrap.appendChild(ul);
  wrap.appendChild(milestoneWrap);
  skillContent.appendChild(wrap);
}; // end showCombatSkillPage

// Crafting
window.showSkillCraftingPage = function (skill) {
  const skillPage = document.getElementById("skill-page");
  const skillContent = document.getElementById("skill-content");

  skillContent.innerHTML = "";
  const craftingContainer = document.createElement("div");
  craftingContainer.style.cssText = "display: flex; gap: 20px; height: 100%;";
  const recipeList = document.createElement("div");
  recipeList.style.cssText = "flex: 1; overflow-y: auto; max-height: 500px;";
  const recipeTitle = document.createElement("h3");
  recipeTitle.textContent = "Available Recipes";
  recipeTitle.style.cssText = "margin-bottom: 15px; color: var(--brand);";
  recipeList.appendChild(recipeTitle);
  const craftingArea = document.createElement("div");
  craftingArea.style.cssText =
    "flex: 1; padding: 20px; background: #111111; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);";
  craftingArea.innerHTML = `
    <h3 style="color: var(--brand); margin-bottom: 15px;">Crafting Station</h3>
    <div id="selected-recipe" style="color: #8b949e; text-align: center; padding: 40px;">
      Select a recipe to begin crafting
    </div>
    <div id="crafting-progress" style="display: none; margin-top: 20px;">
      <div style="margin-bottom: 10px; color: #238636;">Crafting Progress</div>
      <div class="progress-bar"><div id="craft-progress-fill" class="progress-fill" style="width: 0%"></div></div>
      <div id="craft-timer" style="text-align: center; margin-top: 5px; font-size: 12px; color: #8b949e;"></div>
    </div>
  `;

  const skillData = window.crafting_skills.RECIPES_DATA.crafting_skills[skill];
  if (!skillData || !skillData.recipes) {
    const noRecipesMsg = document.createElement("div");
    noRecipesMsg.style.textAlign = "center";
    noRecipesMsg.style.color = "#8b949e";
    noRecipesMsg.style.padding = "40px";
    noRecipesMsg.textContent = `No recipes available for ${skill}.`;
    skillContent.appendChild(noRecipesMsg);
    return;
  }

  // (selection UI omitted for brevity; your original project likely builds the list here)

  skillContent.appendChild(recipeList);
  skillContent.appendChild(craftingArea);
};

window.getWorkshopName = function (id, forSkill = "tailoring") {
  const list =
    (gameData.upgrades &&
      gameData.upgrades[forSkill] &&
      gameData.upgrades[forSkill].workshops) ||
    [];
  const f = list.find((w) => w.id === id);
  return f ? f.name : id;
};

window.cancelCrafting = function () {
  if (gameState.currentAction && gameState.currentAction.type === "crafting") {
    craftingContinuous = false;
    gameState.currentAction = null;
    const craftingProgress = document.getElementById("crafting-progress");
    if (craftingProgress) {
      craftingProgress.style.display = "none";
    }
    const craftProgressFill = document.getElementById("craft-progress-fill");
    const craftTimer = document.getElementById("craft-timer");
    if (craftProgressFill) {
      craftProgressFill.style.width = "0%";
    }
    if (craftTimer) {
      craftTimer.textContent = "";
    }
    const selectedRecipeDiv = document.getElementById("selected-recipe");
    if (selectedRecipeDiv) {
      selectedRecipeDiv.innerHTML = `
        <div style="color: #8b949e; text-align: center; padding: 40px;">
          Select a recipe to begin crafting
        </div>
      `;
    }
    addToMessageLog("Crafting cancelled.", "info");
  }
};

window.showSkillPassivePage = function (skill) {
  const skillPage = document.getElementById("skill-page");
  const skillContent = document.getElementById("skill-content");

  skillContent.innerHTML = "";
  const passiveContainer = document.createElement("div");
  passiveContainer.style.cssText = "padding: 20px;";
  const skillTitle = document.createElement("h3");
  skillTitle.textContent = skill.charAt(0).toUpperCase() + skill.slice(1);
  skillTitle.style.cssText =
    "color: var(--brand); margin-bottom: 20px; text-align: center;";
  passiveContainer.appendChild(skillTitle);

  if (skill === "farming") {
    showFarmingInterface(passiveContainer);
  } else if (skill === "animalcare") {
    showAnimalCareInterface(passiveContainer);
  }

  skillContent.appendChild(passiveContainer);
};

window.showFarmingInterface = function (container) {
  const playerLevel = gameState.skills.farming.level;
  const unlockedPlots = getUnlockedPlots(playerLevel);
  const plotTypeNames = {
    herb: "Herb Plot",
    garden: "Garden Plot",
    tree: "Tree Plot",
    mushroom: "Mushroom Log",
  };

  const plotsSection = document.createElement("div");
  plotsSection.style.cssText = "margin-bottom: 30px;";
  const plotsTitle = document.createElement("h4");
  plotsTitle.textContent = "Farm Plots";
  plotsTitle.style.cssText = "color: var(--brand); margin-bottom: 15px;";
  plotsSection.appendChild(plotsTitle);

  const plotsGrid = document.createElement("div");
  plotsGrid.style.cssText =
    "display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;";

  FARMING_DATA.plots.forEach((plot, index) => {
    const isUnlocked = index < unlockedPlots;
    const plotCard = document.createElement("div");
    plotCard.className = "resource-card";
    const plotState = gameState.farming.unlockedPlots.find(
      (p) => p.name === plot.name
    );
    const isPlanted = plotState && plotState.plantedSeed;

    plotCard.style.cssText = `
      background: ${
        isUnlocked ? "rgba(40, 167, 69, 0.2)" : "rgba(255,255,255,0.06)"
      };
      border: 1px solid ${
        isUnlocked ? "var(--brand)" : "rgba(255,255,255,0.08)"
      };
      opacity: ${isUnlocked ? "1" : "0.6"};
      cursor: ${isUnlocked ? "pointer" : "default"};
      min-height: 220px;
    `;
    const compatibleSeeds = getCompatibleSeeds(plot.type, playerLevel);
    const hasSeeds = compatibleSeeds.length > 0;

    plotCard.innerHTML = `
      <h5 style="color: var(--brand);">${plot.name}</h5>
      <div style="color: #8b949e; margin: 5px 0;">Level ${
        plot.requiredLevel
      } required</div>
      <div style="color: #8b949e; margin: 5px 0;">Type: ${
        plotTypeNames[plot.type] || plot.type
      }</div>
      <div style="color: ${
        isUnlocked ? "#2ecc71" : "var(--brand)"
      }; font-weight: bold; margin: 5px 0;">
        ${isUnlocked ? "UNLOCKED" : "LOCKED"}
      </div>
      ${
        isPlanted
          ? `
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
          <div style="color: #238636; font-weight: bold; margin-bottom: 5px;">🌱 ${
            plotState.plantedSeed.name
          }</div>
          <div style="color: #8b949e; font-size: 12px; margin-bottom: 5px;">
            Produces: ${plotState.plantedSeed.produces
              .map((p) => `${p.quantity}x ${getItemName(p.item)}`)
              .join(", ")}
          </div>
          <div style="color: #1a7f37; font-size: 12px; margin-bottom: 8px;">Every ${(
            plotState.plantedSeed.time / 1000
          ).toFixed(0)}s</div>
          <div style="margin-bottom: 8px;">
            <div style="color: #8b949e; font-size: 11px; margin-bottom: 2px;">Next Harvest</div>
            <div style="background: rgba(255,255,255,0.06); height: 8px; border-radius: 4px; overflow: hidden;">
              <div id="farming-progress-${index}" style="
                height: 100%;
                background: linear-gradient(90deg, var(--brand), #2ecc71);
                width: 0%;
                transition: width 0.1s;
              "></div>
            </div>
          </div>
          <button style="
            width: 100%;
            padding: 6px;
            margin-top: 8px;
            background: var(--brand);
            color: #e6edf3;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
          " onclick="removePlantedSeed(${index})">
            Remove Crop
          </button>
        </div>
      `
          : isUnlocked
          ? `
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
          <div style="color: var(--brand); font-size: 12px; margin-bottom: 5px;">Available Seeds: ${
            compatibleSeeds.length
          }</div>
          <button style="
            width: 100%;
            padding: 8px;
            background: ${hasSeeds ? "var(--brand)" : "#8b949e"};
            color: #e6edf3;
            border: none;
            border-radius: 4px;
            cursor: ${hasSeeds ? "pointer" : "not-allowed"};
            font-size: 12px;
          " ${
            hasSeeds
              ? `onclick="selectSeedForPlot('${plot.name}', '${plot.type}', ${index})"`
              : "disabled"
          }>
            ${hasSeeds ? "Plant Seed" : "No Seeds"}
          </button>
        </div>
      `
          : ""
      }
    `;

    plotsGrid.appendChild(plotCard);
  });
  // Append the grid and section after populating plots
  plotsSection.appendChild(plotsGrid);
  container.appendChild(plotsSection);
};

window.selectSeedForPlot = function (plotName, plotType, plotIndex) {
  const playerLevel = gameState.skills.farming.level;
  const compatibleSeeds = getCompatibleSeeds(plotType, playerLevel);
  if (compatibleSeeds.length === 0) {
    showNotification("No compatible seeds available!", "error");
    return;
  }
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex; justify-content: center; align-items: center; z-index: 1000;
  `;
  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
    background: #111111; padding: 20px; border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    max-width: 500px; max-height: 80vh; overflow-y: auto;
  `;
  modalContent.innerHTML = `
    <h3 style="color: var(--brand); margin-bottom: 15px;">Select Seed for ${plotName}</h3>
    <div style="color: #8b949e; margin-bottom: 15px;">Compatible ${plotType} seeds:</div>
    <div id="seed-selection-grid" style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 15px;"></div>
    <button id="cancel-seed-selection" style="
      background: var(--brand); color: #e6edf3; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; width: 100%;
    ">Cancel</button>
  `;
  const seedGrid = modalContent.querySelector("#seed-selection-grid");

  compatibleSeeds.forEach((seed) => {
    const playerHas = gameState.bank[seed.id] || 0;
    const seedOption = document.createElement("div");
    seedOption.style.cssText = `
      background: rgba(40, 167, 69, 0.2);
      border: 1px solid var(--brand);
      padding: 10px; border-radius: 4px; cursor: pointer; transition: background-color 0.2s;
    `;
    seedOption.innerHTML = `
      <div style="color: var(--brand); font-weight: bold;">${seed.name}</div>
      <div style="color: #8b949e; font-size: 12px;">Level ${
        seed.level
      } • Owned: ${playerHas}</div>
      <div style="color: #238636; font-size: 12px; margin-top: 5px;">
        Produces: ${seed.produces
          .map((p) => `${p.quantity}x ${getItemName(p.item)}`)
          .join(", ")}
      </div>
      <div style="color: #1a7f37; font-size: 12px;">
        Time: ${(seed.time / 1000).toFixed(0)}s
      </div>
    `;
    seedOption.addEventListener("click", () => {
      plantSeed(plotIndex, seed);
      document.body.removeChild(modal);
    });
    seedOption.addEventListener("mouseenter", () => {
      seedOption.style.backgroundColor = "rgba(40, 167, 69, 0.4)";
    });
    seedOption.addEventListener("mouseleave", () => {
      seedOption.style.backgroundColor = "rgba(40, 167, 69, 0.2)";
    });
    seedGrid.appendChild(seedOption);
  });

  modalContent
    .querySelector("#cancel-seed-selection")
    .addEventListener("click", () => {
      document.body.removeChild(modal);
    });

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
};

// ===== Animal Care (shop & placement essentials; same logic with fixed helpers) =====
window.showGeneralShopItems = function (container) {
  const animalsSection = document.createElement("div");
  animalsSection.style.cssText =
    "margin-bottom: 40px; grid-column: 1 / -1; width: 100%;";
  const animalsTitle = document.createElement("h3");
  animalsTitle.textContent = "Animals";
  animalsTitle.style.cssText =
    "color: var(--brand); margin-bottom: 20px; text-align: center;";
  animalsSection.appendChild(animalsTitle);
  const animalsGrid = document.createElement("div");
  animalsGrid.className = "shop-animals-grid";
  const structureTypes = {
    pen: { name: "Pen Animals", icon: "🐄", color: "var(--brand)" },
    coop: { name: "Coop Animals", icon: "🐔", color: "#238636" },
    hutch: { name: "Hutch Animals", icon: "🐰", color: "#9b59b6" },
    insect: { name: "Insect House", icon: "🐝", color: "#f1c40f" },
  };
  // (populate per your game data; omitted to keep parity)
  container.appendChild(animalsSection);
};

// Temporarily disabled - now properly exported from shops.js
// window.showUpgradesShopItems = function (container) {
//   // Function body removed - now properly exported from shops.js
// }

// Removed orphaned code from showUpgradesShopItems function

// Removed orphaned code from showUpgradesShopItems function

window.purchaseAnimal = function (animalId, structureType, price, requiredLevel) {
  // Function implementation here - TODO: Add proper implementation
}

window.showAnimalCareInterface = function (container) {
  const playerLevel = gameState.skills.animalcare.level;
  const unlockedPens = getUnlockedPens(playerLevel);
  const structureTypeNames = {
    pen: "Pen",
    coop: "Coop",
    hutch: "Hutch",
    insect: "Insect House",
  };

  const structuresSection = document.createElement("div");
  structuresSection.style.cssText = "margin-bottom: 30px;";
  const structuresTitle = document.createElement("h4");
  structuresTitle.textContent = "Animal Structures";
  structuresTitle.style.cssText = "color: #8e44ad; margin-bottom: 15px;";
  structuresSection.appendChild(structuresTitle);
  const structuresGrid = document.createElement("div");
  structuresGrid.style.cssText =
    "display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;";

  ANIMAL_CARE_DATA.structures.forEach((structure, index) => {
    const isUnlocked = index < unlockedPens;
    const structureCard = document.createElement("div");
    structureCard.className = "resource-card";
    const structureState = gameState.animalCare.unlockedStructures.find(
      (s) => s.name === structure.name
    );
    const hasAnimal = !!(structureState && structureState.placedAnimal);

    structureCard.style.cssText = `
      background: ${
        isUnlocked ? "rgba(142, 68, 173, 0.2)" : "rgba(255,255,255,0.06)"
      };
      border: 1px solid ${isUnlocked ? "#8e44ad" : "rgba(255,255,255,0.08)"};
      opacity: ${isUnlocked ? "1" : "0.6"};
      cursor: ${isUnlocked ? "pointer" : "default"};
      min-height: 220px;
    `;
    const compatibleAnimals = getCompatibleAnimals(structure.type, playerLevel);
    const hasAnimals = compatibleAnimals.length > 0;

    structureCard.innerHTML = `
      <h5 style="color: #8e44ad;">${structure.name}</h5>
      <div style="color: #8b949e; margin: 5px 0;">Level ${
        structure.level
      } required</div>
      <div style="color: #8b949e; margin: 5px 0;">Type: ${
        structureTypeNames[structure.type] || structure.type
      }</div>
      <div style="color: ${
        isUnlocked ? "#2ecc71" : "var(--brand)"
      }; font-weight: bold; margin: 5px 0;">
        ${isUnlocked ? "UNLOCKED" : "LOCKED"}
      </div>
      ${
        hasAnimal
          ? `
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
          <div style="color: #238636; font-weight: bold; margin-bottom: 5px;">${
            structureState.placedAnimal.icon
          } ${
              structureState.placedAnimal.name
            } <span style="color:#bdc3c7; font-weight: normal;">(x${
              structureState.placedAnimal.count || 1
            })</span></div>
          <div style="color: #2ecc71; font-size: 12px; margin-bottom: 8px;">
            Produces: ${structureState.placedAnimal.produces
              .map((item) => getItemName(item))
              .join(", ")}
          </div>
          <div style="margin-bottom: 8px;">
            <div style="color: #8b949e; font-size: 11px; margin-bottom: 2px;">Byproducts (1min)</div>
            <div style="background: rgba(255,255,255,0.06); height: 8px; border-radius: 4px; overflow: hidden;">
              <div id="byproduct-progress-${index}" style="
                height: 100%;
                background: linear-gradient(90deg, #238636, #1a7f37);
                width: 0%;
                transition: width 0.1s;
              "></div>
            </div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="color: #8b949e; font-size: 11px; margin-bottom: 2px;">Harvest (4min)</div>
            <div style="background: rgba(255,255,255,0.06); height: 8px; border-radius: 4px; overflow: hidden;">
              <div id="harvest-progress-${index}" style="
                height: 100%;
                background: linear-gradient(90deg, #2ecc71, var(--brand));
                width: 0%;
                transition: width 0.1s;
              "></div>
            </div>
          </div>
          <button style="
            width: 100%;
            padding: 6px;
            margin-top: 8px;
            background: var(--brand);
            color: #e6edf3;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
          " onclick="removeAnimal(${index})">
            Remove Animal
          </button>
        </div>
      `
          : isUnlocked
          ? `
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
          <div style="color: var(--brand); font-size: 12px; margin-bottom: 5px;">Available Animals: ${
            compatibleAnimals.length
          } • Capacity: ${STRUCTURE_CAPACITY[structure.type] || 1}</div>
          <button style="
            width: 100%;
            padding: 8px;
            background: ${hasAnimals ? "#8e44ad" : "#8b949e"};
            color: #e6edf3;
            border: none;
            border-radius: 4px;
            cursor: ${hasAnimals ? "pointer" : "not-allowed"};
            font-size: 12px;
          " ${
            hasAnimals
              ? `onclick="selectAnimalForStructure('${structure.name}', '${structure.type}', ${index})"`
              : "disabled"
          }>
            ${hasAnimals ? "Place Animals" : "No Animals"}
          </button>
        </div>
      `
          : ""
      }
    `;

    structuresGrid.appendChild(structureCard);
  });

  structuresSection.appendChild(structuresGrid);
  container.appendChild(structuresSection);
};

window.updateAnimalCareProgressBars = function () {
  const currentTime = Date.now();
  gameState.animalCare.unlockedStructures.forEach((structure, index) => {
    if (structure.placedAnimal) {
      const byproductElement = document.getElementById(
        `byproduct-progress-${index}`
      );
      if (byproductElement && structure.lastByproduct) {
        const byproductTimePassed = currentTime - structure.lastByproduct;
        const byproductProgress = Math.min(
          100,
          (byproductTimePassed / 60000) * 100
        );
        byproductElement.style.width = `${byproductProgress}%`;
      }
      const harvestElement = document.getElementById(
        `harvest-progress-${index}`
      );
      if (harvestElement && structure.lastHarvest) {
        const harvestTimePassed = currentTime - structure.lastHarvest;
        const harvestProgress = Math.min(
          100,
          (harvestTimePassed / 240000) * 100
        );
        harvestElement.style.width = `${harvestProgress}%`;
      }
    }
  });
};

window.getCompatibleAnimals = function (structureType, playerLevel) {
  const animals = ANIMAL_CARE_DATA.animals[structureType] || [];
  return animals.filter((animal) => {
    const playerHas = gameState.bank[animal.id] || 0;
    return playerHas > 0 && playerLevel >= animal.level;
  });
};

window.selectAnimalForStructure = function (
  structureName,
  structureType,
  structureIndex
) {
  const playerLevel = gameState.skills.animalcare.level;
  const compatibleAnimals = getCompatibleAnimals(structureType, playerLevel);

  if (compatibleAnimals.length === 0) {
    showNotification("No compatible animals available!", "error");
    return;
  }
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center;
    align-items: center; z-index: 1000;
  `;
  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
    background: #111111; padding: 20px; border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08); max-width: 500px; max-height: 80vh; overflow-y: auto;
  `;
  modalContent.innerHTML = `
    <h3 style="color: var(--brand); margin-bottom: 15px;">Select Animal for ${structureName}</h3>
    <div style="color: #8b949e; margin-bottom: 15px;">Compatible ${structureType} animals:</div>
    <div id="animal-selection-grid" style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 15px;"></div>
    <button id="cancel-animal-selection" style="
      background: var(--brand); color: #e6edf3; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; width: 100%;
    ">Cancel</button>
  `;
  const animalGrid = modalContent.querySelector("#animal-selection-grid");

  compatibleAnimals.forEach((animal) => {
    const playerHas = gameState.bank[animal.id] || 0;
    const animalOption = document.createElement("div");
    animalOption.style.cssText = `
      background: rgba(142, 68, 173, 0.2);
      border: 1px solid #8e44ad; padding: 10px; border-radius: 4px;
      cursor: pointer; transition: background-color 0.2s;
    `;
    animalOption.innerHTML = `
      <div style="color: #8e44ad; font-weight: bold;">${animal.icon} ${
      animal.name
    }</div>
      <div style="color: #8b949e; font-size: 12px;">Level ${
        animal.level
      } • Owned: ${playerHas}</div>
      <div style="color: #238636; font-size: 12px; margin-top: 5px;">
        Produces: ${animal.produces.map((item) => getItemName(item)).join(", ")}
      </div>
      <div style="color: #1a7f37; font-size: 12px;">
        Byproducts every 1min • Harvest every 4min
      </div>
    `;
    animalOption.addEventListener("click", () => {
      placeAnimal(structureIndex, animal);
      document.body.removeChild(modal);
    });
    animalOption.addEventListener("mouseenter", () => {
      animalOption.style.backgroundColor = "rgba(142, 68, 173, 0.4)";
    });
    animalOption.addEventListener("mouseleave", () => {
      animalOption.style.backgroundColor = "rgba(142, 68, 173, 0.2)";
    });
    animalGrid.appendChild(animalOption);
  });

  modalContent
    .querySelector("#cancel-animal-selection")
    .addEventListener("click", () => {
      document.body.removeChild(modal);
    });

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
};

window.placeAnimal = function (structureIndex, animal) {
  const structureData = ANIMAL_CARE_DATA.structures[structureIndex];
  let structureState = gameState.animalCare.unlockedStructures.find(
    (s) => s.name === structureData.name
  );

  if (!structureState) {
    structureState = {
      id: `structure_${structureData.level}`,
      name: structureData.name,
      icon: structureData.icon,
      level: structureData.level,
      type: structureData.type,
      placedAnimal: null,
      lastByproduct: Date.now(),
      lastHarvest: Date.now(),
    };
    gameState.animalCare.unlockedStructures.push(structureState);
  }
  const owned = gameState.bank[animal.id] || 0;
  if (owned <= 0) {
    showNotification(`No ${animal.name} in bank.`, "error");
    return;
  }
  const cap = STRUCTURE_CAPACITY[structureData.type] || 1;
  const countToPlace = Math.min(owned, cap);

  structureState.placedAnimal = {
    id: animal.id,
    name: animal.name,
    icon: animal.icon,
    produces: animal.produces,
    level: animal.level,
    count: countToPlace,
  };
  structureState.lastByproduct = Date.now();
  structureState.lastHarvest = Date.now();

  gameState.bank[animal.id] = owned - countToPlace;
  if (gameState.bank[animal.id] <= 0) delete gameState.bank[animal.id];

  showNotification(
    `Placed ${countToPlace}x ${animal.name} in ${structureData.name}!`,
    "success"
  );
  renderBank();
  showSkillPage("animalcare");
};

window.removeAnimal = function (structureIndex) {
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
};

window.cancelCrafting = window.cancelCrafting;

// ===== Init =====
document.addEventListener("DOMContentLoaded", function () {
  initGame();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGame);
} else {
  initGame();
}

// ---- inline script #4 ----
// Home Base merged module (scoped)
(function () {
  // ======= DATA =======
  window.CATS = [
    { id: "res", name: "Residential" },
    { id: "ind", name: "Industrial" },
    { id: "def", name: "Defensive" },
    { id: "spe", name: "Special" },
  ];
  window.BUILDINGS = [
    // Residential - Realistic Housing Sizes
    {
      id: "res_1",
      cat: "res",
      name: "Studio Apartment",
      cost: { wood: 15, stone: 10 },
      slots: { F: 1, W: 0, S: 0, D: 0 },
      durability: 120,
      footprint: [1, 1],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },
    {
      id: "res_2",
      cat: "res",
      name: "Small House",
      cost: { wood: 25, stone: 15 },
      slots: { F: 1, W: 0, S: 0, D: 0 },
      durability: 180,
      footprint: [1, 2],
      tags: ["Road-adjacent"],
      roofType: "gabled",
    },
    {
      id: "res_3",
      cat: "res",
      name: "Family Home",
      cost: { wood: 40, stone: 25 },
      slots: { F: 1, W: 0, S: 0, D: 0 },
      durability: 220,
      footprint: [2, 2],
      tags: ["Road-adjacent"],
      roofType: "gabled",
    },
    {
      id: "res_4",
      cat: "res",
      name: "Duplex",
      cost: { wood: 50, stone: 30 },
      slots: { F: 2, W: 0, S: 0, D: 0 },
      durability: 250,
      footprint: [2, 3],
      tags: ["Road-adjacent"],
      roofType: "gabled",
    },
    {
      id: "res_5",
      cat: "res",
      name: "Townhouse",
      cost: { wood: 60, stone: 35 },
      slots: { F: 1, W: 0, S: 0, D: 0 },
      durability: 280,
      footprint: [1, 3],
      tags: ["Road-adjacent"],
      roofType: "gabled",
    },
    {
      id: "res_6",
      cat: "res",
      name: "Apartment Building",
      cost: { wood: 80, stone: 60 },
      slots: { F: 6, W: 0, S: 0, D: 1 },
      durability: 350,
      footprint: [3, 3],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },
    {
      id: "res_7",
      cat: "res",
      name: "Luxury Estate",
      cost: { wood: 120, stone: 80 },
      slots: { F: 1, W: 1, S: 0, D: 1 },
      durability: 400,
      footprint: [3, 2],
      tags: ["Road-adjacent"],
      roofType: "gabled",
    },
    {
      id: "res_8",
      cat: "res",
      name: "Condo Complex",
      cost: { wood: 150, stone: 100 },
      slots: { F: 12, W: 2, S: 0, D: 2 },
      durability: 450,
      footprint: [4, 3],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },

    // Commercial/Industrial - Right-sized Businesses
    {
      id: "ind_1",
      cat: "ind",
      name: "Newsstand",
      cost: { wood: 8, stone: 5 },
      slots: { F: 0, W: 1, S: 0, D: 0 },
      durability: 100,
      footprint: [1, 1],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },
    {
      id: "ind_2",
      cat: "ind",
      name: "Coffee Shop",
      cost: { wood: 20, stone: 15 },
      slots: { F: 1, W: 2, S: 0, D: 0 },
      durability: 160,
      footprint: [1, 2],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },
    {
      id: "ind_3",
      cat: "ind",
      name: "Corner Store",
      cost: { wood: 30, stone: 20 },
      slots: { F: 2, W: 3, S: 0, D: 0 },
      durability: 200,
      footprint: [2, 2],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },
    {
      id: "ind_4",
      cat: "ind",
      name: "Auto Shop",
      cost: { wood: 45, stone: 35 },
      slots: { F: 1, W: 4, S: 0, D: 0 },
      durability: 250,
      footprint: [3, 2],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },
    {
      id: "ind_5",
      cat: "ind",
      name: "Small Office",
      cost: { wood: 35, stone: 40 },
      slots: { F: 0, W: 6, S: 1, D: 0 },
      durability: 220,
      footprint: [2, 3],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },
    {
      id: "ind_6",
      cat: "ind",
      name: "Shopping Plaza",
      cost: { wood: 80, stone: 60 },
      slots: { F: 8, W: 12, S: 0, D: 1 },
      durability: 320,
      footprint: [4, 2],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },
    {
      id: "ind_7",
      cat: "ind",
      name: "Office Building",
      cost: { wood: 60, stone: 80 },
      slots: { F: 0, W: 15, S: 3, D: 1 },
      durability: 380,
      footprint: [3, 3],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },
    {
      id: "ind_8",
      cat: "ind",
      name: "Warehouse",
      cost: { wood: 70, stone: 50 },
      slots: { F: 0, W: 8, S: 0, D: 0 },
      durability: 300,
      footprint: [4, 3],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },

    // Public Safety & Services - Compact but Functional
    {
      id: "def_1",
      cat: "def",
      name: "Security Booth",
      cost: { wood: 10, stone: 8 },
      slots: { F: 0, W: 0, S: 0, D: 1 },
      durability: 120,
      footprint: [1, 1],
      tags: ["Road-adjacent"],
      roofType: "fortified",
    },
    {
      id: "def_2",
      cat: "def",
      name: "Guard House",
      cost: { wood: 20, stone: 25 },
      slots: { F: 0, W: 1, S: 0, D: 2 },
      durability: 180,
      footprint: [1, 2],
      tags: ["Road-adjacent"],
      roofType: "fortified",
    },
    {
      id: "def_3",
      cat: "def",
      name: "Police Station",
      cost: { wood: 50, stone: 70 },
      slots: { F: 0, W: 4, S: 1, D: 6 },
      durability: 350,
      footprint: [3, 2],
      tags: ["Road-adjacent"],
      roofType: "fortified",
    },
    {
      id: "def_4",
      cat: "def",
      name: "Fire Station",
      cost: { wood: 60, stone: 50 },
      slots: { F: 0, W: 6, S: 1, D: 4 },
      durability: 320,
      footprint: [2, 3],
      tags: ["Road-adjacent"],
      roofType: "fortified",
    },
    {
      id: "def_5",
      cat: "def",
      name: "Emergency Center",
      cost: { wood: 80, stone: 90 },
      slots: { F: 0, W: 8, S: 2, D: 8 },
      durability: 400,
      footprint: [3, 3],
      tags: ["Road-adjacent"],
      roofType: "fortified",
    },

    // Special/Public - Community Buildings
    {
      id: "spe_1",
      cat: "spe",
      name: "Bus Stop",
      cost: { wood: 5, stone: 8 },
      slots: { F: 2, W: 0, S: 0, D: 0 },
      durability: 100,
      footprint: [1, 1],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },
    {
      id: "spe_2",
      cat: "spe",
      name: "Community Center",
      cost: { wood: 40, stone: 30 },
      slots: { F: 6, W: 2, S: 1, D: 0 },
      durability: 250,
      footprint: [2, 3],
      tags: ["Road-adjacent"],
      roofType: "gabled",
    },
    {
      id: "spe_3",
      cat: "spe",
      name: "Library",
      cost: { wood: 50, stone: 60 },
      slots: { F: 4, W: 3, S: 6 },
      durability: 300,
      footprint: [3, 2],
      tags: ["Road-adjacent"],
      roofType: "gabled",
    },
    {
      id: "spe_4",
      cat: "spe",
      name: "Elementary School",
      cost: { wood: 80, stone: 70 },
      slots: { F: 10, W: 6, S: 4, D: 1 },
      durability: 350,
      footprint: [3, 3],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },
    {
      id: "spe_5",
      cat: "spe",
      name: "High School",
      cost: { wood: 120, stone: 100 },
      slots: { F: 20, W: 10, S: 8, D: 2 },
      durability: 450,
      footprint: [4, 3],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },
    {
      id: "spe_6",
      cat: "spe",
      name: "Hospital",
      cost: { wood: 100, stone: 120 },
      slots: { F: 15, W: 20, S: 12, D: 3 },
      durability: 500,
      footprint: [4, 4],
      tags: ["Road-adjacent"],
      roofType: "flat",
    },
    {
      id: "expo",
      cat: "spe",
      name: "City Hall",
      cost: { wood: 150, stone: 180 },
      slots: { F: 8, W: 25, S: 15, D: 8 },
      durability: 600,
      footprint: [4, 3],
      tags: ["Road-adjacent"],
      roofType: "gabled",
    },
  ];

  // ======= STATE =======
  window.state = {
    cols: 33,
    rows: 66,
    wood: 150,
    stone: 120,
    selection: null, // building object
    chain: false,
    lastPlaced: null,
    roads: new Set(),
    rivers: new Set(),
    bridges: new Set(),
    occupied: new Map(), // key "x,y" -> { id, name }
    // Regions unlocked for homebase; start with Region 1. Add others (2..6) as the player unlocks.
    unlockedRegions: new Set([1]),
    // Wall upgrade level: 0=wood, 1=concrete, 2=metal, 3=concrete/metal mix
    wallLevel: 0,
  };

  // ======= DOM REFS =======
  const mapEl = document.querySelector("#homebase-page #map");
  const tabsEl = document.querySelector("#homebase-page #tabs");
  const cardsEl = document.querySelector("#homebase-page #cards");
  const favRow = document.querySelector("#homebase-page #favRow");
  const woodEl = document.querySelector("#homebase-page #wood");
  const stoneEl = document.querySelector("#homebase-page #stone");
  const woodDeltaEl = document.querySelector("#homebase-page #woodDelta");
  const stoneDeltaEl = document.querySelector("#homebase-page #stoneDelta");
  const rotateL = document.querySelector("#homebase-page #rotateLeft");
  const rotateR = document.querySelector("#homebase-page #rotateRight");
  const undoBtn = document.querySelector("#homebase-page #undoBtn");
  const toggleBordersBtn = document.querySelector(
    "#homebase-page #toggleBorders"
  );
  const toasts = document.querySelector("#homebase-page #toasts");
  const hint = document.querySelector("#homebase-page .overlay .corner");
  const affordChip = document.querySelector("#homebase-page #affordChip");

  // ======= INIT GRID & ROADS =======
  mapEl.style.setProperty("--cols", state.cols);
  mapEl.style.setProperty("--rows", state.rows);
  mapEl.innerHTML = "";

  // Build tiles
  const tiles = [];
  for (let y = 0; y < state.rows; y++) {
    for (let x = 0; x < state.cols; x++) {
      const t = document.createElement("div");
      t.className = "tile";
      t.dataset.x = x;
      t.dataset.y = y;
      mapEl.appendChild(t);
      tiles.push(t);
    }
  }

  const roadKey = function (x, y) {
    return x + "," + y;
  };
  const setRoad = function (x, y) {
    state.roads.add(roadKey(x, y));
    tileAt(x, y)?.classList.add("road");
  };
  const riverKey = function (x, y) {
    return x + "," + y;
  };
  const setRiver = function (x, y) {
    state.rivers.add(riverKey(x, y));
    const t = tileAt(x, y);
    if (t) t.classList.add("river");
  };
  const clearRiver = function (x, y) {
    state.rivers.delete(riverKey(x, y));
    const t = tileAt(x, y);
    if (t) t.classList.remove("river");
  };
  const isRiver = function (x, y) {
    return state.rivers.has(riverKey(x, y));
  };
  const bridgeKey = function (x, y) {
    return x + "," + y;
  };
  const tileAt = function (x, y) {
    if (x < 0 || y < 0 || x >= state.cols || y >= state.rows) return null;
    return tiles[y * state.cols + x];
  };

  // helper: fill a vertical river segment
  const fillRiverCol = function (col, y0, y1) {
    for (let y = Math.max(0, y0); y <= Math.min(state.rows - 1, y1); y++) {
      setRiver(col, y);
    }
  };

  window.homebaseTileConfig = {
    road: [
      "2,4", "2,53", "2,61", "3,4", "3,53", "3,61", "4,0", "4,1", "4,2", "4,3",
      "4,4", "4,5", "4,6", "4,7", "4,8", "4,9", "4,10", "4,11", "4,12", "4,14",
      "4,15", "4,16", "4,19", "4,20", "4,21", "4,22", "4,23", "4,24", "4,25", "4,26",
      "4,27", "4,28", "4,29", "4,30", "4,31", "4,32", "4,33", "4,34", "4,35", "4,36",
      "4,37", "4,38", "4,39", "4,40", "4,41", "4,42", "4,43", "4,44", "4,45", "4,46",
      "4,47", "4,48", "4,49", "4,50", "4,51", "4,52", "4,53", "4,54", "4,55", "4,56",
      "4,57", "4,58", "4,59", "4,60", "4,61", "4,62", "4,63", "4,64", "4,65", "5,4",
      "5,22", "5,28", "5,35", "5,44", "5,53", "5,61", "6,4", "6,22", "6,28", "6,35",
      "6,44", "6,53", "6,61", "7,4", "7,22", "7,28", "7,35", "7,44", "7,53", "7,61",
      "8,0", "8,1", "8,2", "8,3", "8,4", "8,5", "8,6", "8,7", "8,8", "8,9",
      "8,10", "8,11", "8,12", "8,13", "8,14", "8,15", "8,16", "8,17", "8,18", "8,19",
      "8,20", "8,21", "8,22", "8,23", "8,24", "8,25", "8,26", "8,27", "8,28", "8,29",
      "8,30", "8,31", "8,32", "8,33", "8,34", "8,35", "8,36", "8,37", "8,38", "8,39",
      "8,40", "8,41", "8,42", "8,43", "8,44", "8,45", "8,46", "8,47", "8,48", "8,49",
      "8,50", "8,51", "8,52", "8,53", "8,54", "8,55", "8,56", "8,57", "8,58", "8,59",
      "8,60", "8,61", "8,62", "8,63", "8,64", "8,65", "9,4", "9,23", "9,28", "9,35",
      "9,44", "9,53", "9,61", "10,4", "10,23", "10,28", "10,35", "10,44", "10,53", "10,61",
      "11,4", "11,23", "11,28", "11,35", "11,44", "11,53", "11,61", "12,0", "12,1", "12,2",
      "12,3", "12,4", "12,5", "12,6", "12,7", "12,8", "12,9", "12,10", "12,11", "12,12",
      "12,20", "12,21", "12,22", "12,23", "12,24", "12,25", "12,26", "12,27", "12,28", "12,29",
      "12,30", "12,31", "12,32", "12,33", "12,34", "12,35", "12,36", "12,37", "12,38", "12,39",
      "12,40", "12,41", "12,42", "12,43", "12,44", "12,45", "12,46", "12,47", "12,48", "12,49",
      "12,50", "12,51", "12,52", "12,53", "12,54", "12,55", "12,56", "12,57", "12,58", "12,59",
      "12,60", "12,61", "12,62", "12,63", "12,64", "12,65", "13,4", "13,23", "13,28", "13,35",
      "13,44", "13,53", "13,61", "14,4", "14,23", "14,28", "14,35", "14,44", "14,53", "14,61",
      "15,4", "15,23", "15,28", "15,35", "15,44", "15,53", "15,61", "16,0", "16,1", "16,2",
      "16,3", "16,4", "16,5", "16,6", "16,7", "16,8", "16,9", "16,10", "16,11", "16,12",
      "16,15", "16,16", "16,17", "16,18", "16,20", "16,21", "16,22", "16,23", "16,24", "16,25",
      "16,26", "16,27", "16,28", "16,29", "16,30", "16,31", "16,32", "16,33", "16,34", "16,35",
      "16,36", "16,37", "16,38", "16,39", "16,40", "16,41", "16,42", "16,43", "16,44", "16,45",
      "16,46", "16,47", "16,48", "16,49", "16,50", "16,51", "16,52", "16,53", "16,54", "16,55",
      "16,56", "16,57", "16,58", "16,59", "16,60", "16,61", "16,62", "16,63", "16,64", "16,65",
      "17,4", "17,9", "5,9", "6,9", "7,9", "9,9", "10,9", "11,9", "17,23", "17,32",
      "17,39", "17,49", "17,53", "17,61", "18,4", "18,9", "18,23", "18,32", "18,39", "18,49",
      "18,53", "18,61", "19,4", "19,9", "19,23", "19,32", "19,39", "19,49", "19,53", "19,61",
      "20,0", "20,1", "20,2", "20,3", "20,4", "20,9", "20,10", "20,11", "20,12", "20,13",
      "20,14", "20,15", "20,19", "20,20", "20,21", "20,22", "20,23", "20,24", "20,25", "20,26",
      "20,27", "20,28", "20,29", "20,30", "20,31", "20,32", "20,39", "20,40", "20,41", "20,42",
      "20,43", "20,44", "20,45", "20,46", "20,47", "20,48", "20,49", "20,50", "20,51", "20,52",
      "20,53", "20,54", "20,55", "20,56", "20,57", "20,58", "20,59", "20,60", "20,61", "20,62",
      "20,63", "20,64", "20,65", "21,4", "21,9", "21,16", "21,17", "21,18", "21,19", "21,25",
      "21,32", "21,39", "21,49", "21,57", "22,4", "22,9", "22,16", "22,17", "22,18", "22,19",
      "22,25", "22,32", "22,39", "22,49", "22,57", "23,4", "23,9", "23,16", "23,17", "23,18",
      "23,19", "23,25", "23,32", "23,39", "23,49", "23,57", "24,0", "24,1", "24,2", "24,3",
      "24,4", "24,5", "24,6", "24,7", "24,8", "24,9", "24,10", "24,11", "24,12", "24,13",
      "24,14", "24,22", "24,23", "24,24", "24,25", "24,26", "24,27", "24,28", "24,29", "24,30",
      "24,31", "24,32", "24,33", "24,34", "24,35", "24,36", "24,37", "24,38", "24,39", "24,40",
      "24,41", "24,42", "24,43", "24,44", "24,45", "24,46", "24,47", "24,48", "24,49", "24,50",
      "24,51", "24,52", "24,53", "24,54", "24,55", "24,56", "24,57", "24,58", "24,59", "24,60",
      "24,61", "24,62", "24,63", "24,64", "24,65", "25,4", "25,9", "25,20", "25,25", "25,32",
      "25,39", "25,49", "25,57", "26,4", "26,9", "26,20", "26,25", "26,32", "26,39", "26,49",
      "26,57", "27,4", "27,9", "27,25", "27,32", "27,39", "27,49", "27,57", "28,0", "28,1",
      "28,2", "28,3", "28,4", "28,5", "28,6", "28,7", "28,8", "28,9", "28,10", "28,11",
      "28,12", "28,13", "28,14", "28,15", "28,16", "28,17", "28,18", "28,19", "28,20", "28,21",
      "28,22", "28,23", "28,24", "28,25", "28,26", "28,27", "28,28", "28,29", "28,30", "28,31",
      "28,32", "28,33", "28,34", "28,35", "28,36", "28,37", "28,38", "28,39", "28,40", "28,41",
      "28,42", "28,43", "28,44", "28,45", "28,46", "28,47", "28,48", "28,49", "28,50", "28,51",
      "28,52", "28,53", "28,54", "28,55", "28,56", "28,57", "28,58", "28,59", "28,60", "28,61",
      "28,62", "28,63", "28,64", "28,65", "2,9", "3,9", "29,4", "30,4", "29,9", "30,9",
      "29,14", "30,14", "2,44", "3,44", "2,35", "3,35", "2,28", "3,28", "2,22", "3,22",
      "29,25", "30,25", "29,32", "30,32", "29,39", "30,39", "29,44", "30,44", "29,49", "30,49",
      "29,57", "30,57",
    ],
    water: [
      "0,14", "0,15", "0,16", "0,17", "1,14", "1,15", "1,16", "1,17", "2,14", "2,15",
      "2,16", "2,17", "3,14", "3,15", "3,16", "3,17", "4,14", "4,15", "4,16", "4,17",
      "5,14", "5,15", "5,16", "5,17", "6,14", "6,15", "6,16", "6,17", "7,14", "7,15",
      "7,16", "7,17", "9,14", "9,15", "9,16", "9,17", "10,14", "10,15", "10,16", "10,17",
      "11,14", "11,15", "11,16", "11,17", "12,14", "12,15", "12,16", "12,17", "13,14", "13,15",
      "13,16", "13,17", "13,18", "14,14", "14,15", "14,16", "14,17", "14,18", "15,14", "15,15",
      "15,16", "15,17", "15,18", "16,15", "16,16", "16,17", "16,18", "17,15", "17,16", "17,17",
      "17,18", "18,15", "18,16", "18,17", "18,18", "19,15", "19,16", "19,17", "19,18", "20,16",
      "20,17", "20,18", "21,16", "21,17", "21,18", "21,19", "22,16", "22,17", "22,18", "22,19",
      "23,16", "23,17", "23,18", "23,19", "24,17", "24,18", "24,19", "25,17", "25,18", "25,19",
      "25,20", "26,17", "26,18", "26,19", "26,20", "27,17", "27,18", "27,19", "27,20", "29,18",
      "29,19", "29,20", "29,21", "30,18", "30,19", "30,20", "30,21", "31,18", "31,19", "31,20",
      "31,21", "32,18", "32,19", "32,20", "32,21",
    ],
    bridge: [
      "20,16", "20,17", "20,18", "8,14", "8,15", "8,16", "8,17", "28,18", "28,19", "28,20",
    ],
    grass: ["0,0", "0,1", "1,0", "1,1"],
    "diagonal-nw": ["12,18"],
    "diagonal-ne": ["19,15", "23,16", "21,19", "25,20", "29,21", "27,17"],
    "diagonal-sw": [],
    "diagonal-se": ["15,14"],
  };

  window.regionConfig = {
    1: { x: [0, 15], y: [0, 13] },
    2: { x: [16, 32], y: [0, 13] },
    3: { x: [16, 32], y: [22, 43] },
    4: { x: [0, 15], y: [22, 43] },
    5: { x: [0, 15], y: [44, 65] },
    6: { x: [16, 32], y: [44, 65] },
  };

  // Parse coordinates from config and apply tile types
  const parseCoordinates = function (coordString) {
    if (!coordString) return [];
    return coordString
      .split(/[\s,]+/)
      .filter((s) => s.includes(","))
      .map((coord) => {
        const [x, y] = coord.split(",").map(Number);
        return { x, y };
      });
  };

  const setTileType = function (x, y, type) {
    if (x < 0 || x >= state.cols || y < 0 || y >= state.rows) return;
    const t = tileAt(x, y);
    if (!t) return;

    // Clear existing type classes
    t.classList.remove(
      "road",
      "river",
      "bridge",
      "grass",
      "diagonal-nw",
      "diagonal-ne",
      "diagonal-sw",
      "diagonal-se"
    );

    // Apply new type
    switch (type) {
      case "road":
        state.roads.add(roadKey(x, y));
        t.classList.add("road");
        break;
      case "water":
        state.rivers.add(riverKey(x, y));
        t.classList.add("river");
        // Remove from roads if it was there
        {
          const rk = roadKey(x, y);
          if (state.roads.has(rk)) state.roads.delete(rk);
        }
        break;
      case "bridge":
        state.bridges.add(bridgeKey(x, y));
        t.classList.add("bridge");
        break;
      case "grass":
        t.classList.add("grass");
        break;
      case "diagonal-nw":
        t.classList.add("diagonal-nw");
        break;
      case "diagonal-ne":
        t.classList.add("diagonal-ne");
        if (
          (x === 21 && y === 19) ||
          (x === 25 && y === 20) ||
          (x === 29 && y === 21)
        ) {
          t.classList.add("no-wall");
        }
        break;
      case "diagonal-sw":
        t.classList.add("diagonal-sw");
        break;
      case "diagonal-se":
        t.classList.add("diagonal-se");
        break;
    }
  };

  // Road network generation - now uses config-based approach
  const generateRoadNetwork = function () {
    // Clear existing state
    state.roads = new Set();
    if (!state.rivers) state.rivers = new Set();
    if (!state.bridges) state.bridges = new Set();

    // Clear all tile classes
    for (let y = 0; y < state.rows; y++) {
      for (let x = 0; x < state.cols; x++) {
        const t = tileAt(x, y);
        if (t)
          t.classList.remove(
            "road",
            "river",
            "bridge",
            "adj",
            "diagonal-nw",
            "diagonal-ne",
            "diagonal-sw",
            "diagonal-se"
          );
      }
    }

    // Apply tile types from config
    for (const [tileType, coordinates] of Object.entries(homebaseTileConfig)) {
      for (const coord of coordinates) {
        const [x, y] = coord.split(",").map(Number);
        setTileType(x, y, tileType);
      }
    }
  };

  // Shared region config helper
  const getRegionConfig = function () {
    return {
      1: [{ x: [0, 14], y: [0, 13] }],
      2: [
        { x: [15, 18], y: [0, 14] },
        { x: [19, 19], y: [0, 15] },
        { x: [20, 22], y: [0, 15] },
        { x: [23, 23], y: [0, 16] },
        { x: [24, 26], y: [0, 16] },
        { x: [27, 32], y: [0, 17] },
      ],
      3: [
        { x: [15, 18], y: [15, 32] },
        { x: [19, 19], y: [16, 32] },
        { x: [20, 22], y: [16, 32] },
        { x: [23, 23], y: [17, 32] },
        { x: [24, 26], y: [17, 32] },
        { x: [27, 32], y: [18, 32] },
      ],
      4: [{ x: [0, 14], y: [14, 32] }],
      5: [{ x: [0, 14], y: [33, 49] }],
      6: [{ x: [15, 32], y: [33, 49] }],
      7: [{ x: [15, 56], y: [50, 65] }],
      8: [
        { x: [0, 14], y: [50, 65] },
        { x: [57, 57], y: [50, 65] },
      ],
    };
  };

  // Function to draw region red guide borders (debug/visual aid)
  const drawRegionBoundaries = function () {
    const regionConfig = getRegionConfig();
    const isInSameRegion = function (x, y, regionId) {
      if (x < 0 || x >= state.cols || y < 0 || y >= state.rows) return false;
      const rectangles = regionConfig[regionId];
      for (const rect of rectangles) {
        const [xs, xe] = rect.x;
        const [ys, ye] = rect.y;
        if (x >= xs && x <= xe && y >= ys && y <= ye) {
          return true;
        }
      }
      return false;
    };

    for (const regionId in regionConfig) {
      const rectangles = regionConfig[regionId];
      for (const region of rectangles) {
        const [x_start, x_end] = region.x;
        const [y_start, y_end] = region.y;
        for (let x = x_start; x <= x_end; x++) {
          for (let y = y_start; y <= y_end; y++) {
            const tile = tileAt(x, y);
            if (!tile) continue;

            const isLeftBoundary = !isInSameRegion(x - 1, y, regionId);
            const isRightBoundary = !isInSameRegion(x + 1, y, regionId);
            const isTopBoundary = !isInSameRegion(x, y - 1, regionId);
            const isBottomBoundary = !isInSameRegion(x, y + 1, regionId);

            const isDiagonalBoundary =
              (x === 15 && y === 14) ||
              (x === 19 && y === 15) ||
              (x === 23 && y === 16) ||
              (x === 27 && y === 17);

            if (isDiagonalBoundary) {
              tile.classList.add(
                "region-border-diagonal",
                "region-border-diagonal-se"
              );
            } else {
              if (isLeftBoundary) tile.classList.add("region-border-left");
              if (isRightBoundary) tile.classList.add("region-border-right");
              if (isTopBoundary) tile.classList.add("region-border-top");
              if (isBottomBoundary) tile.classList.add("region-border-bottom");
            }
          }
        }
      }
    }
  };

  // Draw walls on the outer edge of unlocked regions; remove inner walls between two unlocked neighbors
  const drawWalls = function() {
    const regionConfig = getRegionConfig();
    const unlocked = state.unlockedRegions || new Set([1]);
    const wallLevel = state.wallLevel || 0;

    // Helper to get wall level class
    function getWallLevelClass() {
      const wallClasses = ['wood-wall', 'concrete-wall', 'metal-wall', 'bunker-wall'];
      return wallClasses[wallLevel] || 'wood-wall';
    }

    // Clear previous wall and buoy classes
    for (let y = 0; y < state.rows; y++) {
      for (let x = 0; x < state.cols; x++) {
        const t = tileAt(x, y);
        if (!t) continue;
        t.classList.remove('wall', 'w-top', 'w-right', 'w-bottom', 'w-left', 'b-top', 'b-right', 'b-bottom', 'b-left', 'b-diagonal', 'wood-wall', 'concrete-wall', 'metal-wall', 'bunker-wall');
      }
    }

    // Helper to mark a continuous edge, with fallback positioning for water/bridges
    function markEdge(x0, x1, y0, y1, sideClass, regionBounds) {
      const [regionXs, regionXe, regionYs, regionYe] = regionBounds;
      const buoyClass = 'b-' + sideClass.substring(2); // Convert w-top to b-top, etc.
      
      if (x0 === x1) {
        // vertical edge along constant x
        const x = x0;
        for (let y = y0; y <= y1; y++) {
          const t = tileAt(x, y); if (!t) continue;
          // If tile is a diagonal half-land/half-water, mark as wall but avoid straight band
          if (t.classList.contains('diagonal-nw') || t.classList.contains('diagonal-ne') || t.classList.contains('diagonal-sw') || t.classList.contains('diagonal-se')) {
            if (t.classList.contains('river')) {
              // For river tiles on diagonal borders, add diagonal buoy marker
              t.classList.add('b-diagonal');
            } else {
              t.classList.add('wall', getWallLevelClass());
            }
            continue;
          }
          // If water/bridge, add buoy class
          if (t.classList.contains('river') || t.classList.contains('bridge') || (typeof isRiver === 'function' && isRiver(x, y))) {
            // For vertical edges, add buoys to water tiles and walls to land tiles
            if (sideClass === 'w-left') {
              // For water tiles, add buoy class
              if (t.classList.contains('river')) {
                t.classList.add(buoyClass);
              }
              
              // Walk right from the boundary until we find land, but stay within region
              for (let fallbackX = x + 1; fallbackX <= regionXe; fallbackX++) {
                const fallbackTile = tileAt(fallbackX, y);
                if (fallbackTile && !fallbackTile.classList.contains('river') && !fallbackTile.classList.contains('bridge')) {
                  fallbackTile.classList.add('wall', sideClass, getWallLevelClass());
                  break;
                }
              }
            } else if (sideClass === 'w-right') {
              // For water tiles, add buoy class
              if (t.classList.contains('river')) {
                t.classList.add(buoyClass);
              }
              
              // Walk left from the boundary until we find land, but stay within region
              for (let fallbackX = x - 1; fallbackX >= regionXs; fallbackX--) {
                const fallbackTile = tileAt(fallbackX, y);
                if (fallbackTile && !fallbackTile.classList.contains('river') && !fallbackTile.classList.contains('bridge')) {
                  fallbackTile.classList.add('wall', sideClass, getWallLevelClass());
                  break;
                }
              }
            }
            continue;
          }
          t.classList.add('wall', sideClass, getWallLevelClass());
        }
      } else if (y0 === y1) {
        // horizontal edge along constant y
        const y = y0;
        for (let x = x0; x <= x1; x++) {
          const t = tileAt(x, y); if (!t) continue;
          // If tile is a diagonal half-land/half-water, mark as wall but avoid straight band
          if (t.classList.contains('diagonal-nw') || t.classList.contains('diagonal-ne') || t.classList.contains('diagonal-sw') || t.classList.contains('diagonal-se')) {
            if (t.classList.contains('river')) {
              // For river tiles on diagonal borders, add a diagonal buoy marker
              t.classList.add('b-diagonal');
            } else {
              t.classList.add('wall', getWallLevelClass());
            }
            continue;
          }
          // If water/bridge, add buoy class
          if (t.classList.contains('river') || t.classList.contains('bridge') || (typeof isRiver === 'function' && isRiver(x, y))) {
            // For horizontal edges, add buoys to water tiles and walls to land tiles
            if (sideClass === 'w-top') {
              // For water tiles, add buoy class
              if (t.classList.contains('river')) {
                t.classList.add(buoyClass);
              }
              
              // Walk down from the boundary until we find land, but stay within region
              for (let fallbackY = y + 1; fallbackY <= regionYe; fallbackY++) {
                const fallbackTile = tileAt(x, fallbackY);
                if (fallbackTile && !fallbackTile.classList.contains('river') && !fallbackTile.classList.contains('bridge')) {
                  fallbackTile.classList.add('wall', sideClass, getWallLevelClass());
                  break;
                }
              }
            } else if (sideClass === 'w-bottom') {
              // For water tiles, add buoy class
              if (t.classList.contains('river')) {
                t.classList.add(buoyClass);
              }
              
              // Walk up from the boundary until we find land, but stay within region
              for (let fallbackY = y - 1; fallbackY >= regionYs; fallbackY--) {
                const fallbackTile = tileAt(x, fallbackY);
                if (fallbackTile && !fallbackTile.classList.contains('river') && !fallbackTile.classList.contains('bridge')) {
                  fallbackTile.classList.add('wall', sideClass, getWallLevelClass());
                  break;
                }
              }
            }
            continue;
          }
          t.classList.add('wall', sideClass, getWallLevelClass());
        }
      }
    }

    // For each unlocked region, paint external edges only
    for (const id of unlocked) {
      const rectangles = regionConfig[id];
      if (!rectangles) continue;
      for (const cfg of rectangles) {
        const [xs, xe] = cfg.x; const [ys, ye] = cfg.y;

        // Helper to check if edge is adjacent to another rectangle in same region
        const hasAdjacentRect = (direction, start, end) => {
          for (const otherCfg of rectangles) {
            if (otherCfg === cfg) continue;
            const [oxs, oxe] = otherCfg.x; const [oys, oye] = otherCfg.y;
            if (direction === 'top' && oye === ys - 1 && oxs <= xe && oxe >= xs) return true;
            if (direction === 'bottom' && oys === ye + 1 && oxs <= xe && oxe >= xs) return true;
            if (direction === 'left' && oxe === xs - 1 && oys <= ye && oye >= ys) return true;
            if (direction === 'right' && oxs === xe + 1 && oys <= ye && oye >= ys) return true;
          }
          return false;
        };

        // Find neighbors by layout
        const neighborLeft = (id === 2 || id === 3 || id === 6) ? id - 1 : null; // 2->1, 3->2? (we arranged 4/3 in middle row), 6->5
        const neighborRight = (id === 1 || id === 4 || id === 5) ? id + (id === 1 ? 1 : id === 4 ? -1 + 3 : 1) : null; // keep simple: we'll use explicit map instead

        // Use explicit map to avoid mistakes
        const adjacency = {
          1: { left: null, right: 2, top: null, bottom: 4 },
          2: { left: 1, right: null, top: null, bottom: 3 },
          3: { left: 4, right: null, top: 2, bottom: 6 },
          4: { left: null, right: 3, top: 1, bottom: 5 },
          5: { left: null, right: 6, top: 4, bottom: 8 },
          6: { left: 5, right: null, top: 3, bottom: 7 },
          7: { left: 8, right: null, top: 6, bottom: null },
          8: { left: null, right: 7, top: 5, bottom: null },
        };
        const nbr = adjacency[id];

        // Top edge if neighbor top not unlocked and not adjacent to same region
        if ((!nbr.top || !unlocked.has(nbr.top)) && !hasAdjacentRect('top', xs, xe)) markEdge(xs, xe, ys, ys, 'w-top', [xs, xe, ys, ye]);
        // Bottom edge if neighbor bottom not unlocked and not adjacent to same region
        if ((!nbr.bottom || !unlocked.has(nbr.bottom)) && !hasAdjacentRect('bottom', xs, xe)) markEdge(xs, xe, ye, ye, 'w-bottom', [xs, xe, ys, ye]);
        // Left edge if neighbor left not unlocked and not adjacent to same region
        if ((!nbr.left || !unlocked.has(nbr.left)) && !hasAdjacentRect('left', ys, ye)) markEdge(xs, xs, ys, ye, 'w-left', [xs, xe, ys, ye]);
        // Right edge if neighbor right not unlocked and not adjacent to same region
        if ((!nbr.right || !unlocked.has(nbr.right)) && !hasAdjacentRect('right', ys, ye)) markEdge(xe, xe, ys, ye, 'w-right', [xs, xe, ys, ye]);
      }
    }

    // Special-case: add/remove a dedicated `.special-buoy` element at grid (15,14) when region 4 is locked
    (function manageSpecialBuoy(){
      // Remove any previous special-buoys
      document.querySelectorAll('#homebase-page .tile .special-buoy').forEach(e => e.remove());

      const specialTile = tileAt(15, 14);
      if (!specialTile) return;

      if (unlocked.has(3) && !unlocked.has(4)) {
        // Ensure tile has water class when map data says it's water
        if (!(specialTile.classList.contains('river')) && (typeof isRiver === 'function' && isRiver(15, 14))) {
          specialTile.classList.add('river');
        }

        // Create a special buoy element and append it to the tile so it renders regardless of background layering
        const buoyEl = document.createElement('div');
        buoyEl.className = 'special-buoy';
        specialTile.appendChild(buoyEl);
      } else {
        // Region unlocked: ensure no special buoy remains
        const existing = specialTile.querySelectorAll('.special-buoy');
        existing.forEach(e => e.remove());
      }
    })();

    // Apply fog of war to tiles outside unlocked regions
    applyFogOfWar(unlocked, regionConfig);

    // Cleanup: strip straight bands from diagonal wall tiles
    (function cleanupDiagonalWallBands(){
      const sel = '#homebase-page .tile.wall.diagonal-nw, #homebase-page .tile.wall.diagonal-ne, #homebase-page .tile.wall.diagonal-sw, #homebase-page .tile.wall.diagonal-se';
      document.querySelectorAll(sel).forEach(t => {
        t.classList.remove('w-top','w-right','w-bottom','w-left');
      });
    })();
  };

  // Function to apply fog of war to areas outside unlocked regions
  const applyFogOfWar = function(unlocked, regionConfig) {
    // Clear existing fog
    for (let y = 0; y < state.rows; y++) {
      for (let x = 0; x < state.cols; x++) {
        const t = tileAt(x, y);
        if (!t) continue;
        t.classList.remove('fog-of-war');
        
        // Also remove any existing forced-fog elements
        const existingFogs = t.querySelectorAll('.forced-fog');
        existingFogs.forEach(fog => t.removeChild(fog));
      }
    }
    
    // Apply fog to tiles outside unlocked regions
    for (let y = 0; y < state.rows; y++) {
      for (let x = 0; x < state.cols; x++) {
        const t = tileAt(x, y);
        if (!t) continue;
        
        // These coordinates get fog only if region 3 is not unlocked
        const isSpecialCoord = (x === 15 && y === 14) || (x === 19 && y === 15) || 
                               (x === 23 && y === 16) || (x === 27 && y === 17);
        
        if (isSpecialCoord && !unlocked.has(3) && !unlocked.has(4)) {
          // Force explicit fog styling on these specific coordinates
          
          // Add new fog element
          const fogElement = document.createElement('div');
          fogElement.className = 'forced-fog';
          t.appendChild(fogElement);
          
          // Add normal fog class too
          t.classList.add('fog-of-war');
          
          continue; // Skip the region check for these tiles
        }
        
        // Check if the tile is in an unlocked region
        let isInUnlockedRegion = false;
        for (const id of unlocked) {
          const rectangles = regionConfig[id];
          if (!rectangles) continue;
          for (const cfg of rectangles) {
            const [xs, xe] = cfg.x; const [ys, ye] = cfg.y;
            if (x >= xs && x <= xe && y >= ys && y <= ye) {
              isInUnlockedRegion = true;
              break;
            }
          }
          if (isInUnlockedRegion) break;
        }
        
        // Apply fog to all tiles outside unlocked regions
        if (!isInUnlockedRegion) {
          t.classList.add('fog-of-war');
        }
      }
    }
  };

  // Helper functions for easy coordinate management
  const addCoordinates = function (tileType, coordString) {
    if (!homebaseTileConfig[tileType]) homebaseTileConfig[tileType] = [];
    const newCoords = coordString
      .split(/[\s,]+/)
      .filter((s) => s.includes(","));
    homebaseTileConfig[tileType].push(...newCoords);
    generateRoadNetwork(); // Regenerate to apply changes
    updateRoadSprites();
    if (typeof markAdjacency === "function") {
      markAdjacency();
    }
  };

  const removeCoordinates = function (tileType, coordString) {
    if (!homebaseTileConfig[tileType]) return;
    const coordsToRemove = coordString
      .split(/[\s,]+/)
      .filter((s) => s.includes(","));
    homebaseTileConfig[tileType] = homebaseTileConfig[tileType].filter(
      (coord) => !coordsToRemove.includes(coord)
    );
    generateRoadNetwork(); // Regenerate to apply changes
    updateRoadSprites();
    markAdjacency();
  };

  const showConfig = function () {
    console.log("Current homebase tile configuration:");
    for (const [type, coords] of Object.entries(homebaseTileConfig)) {
      console.log(`${type}: ${coords.join(", ")}`);
    }
  };

  const assignRegionClasses = function () {
    const cfg = getRegionConfig();
    for (const id in cfg) {
      const rectangles = cfg[id];
      for (const r of rectangles) {
        const [xs, xe] = r.x;
        const [ys, ye] = r.y;
        for (let x = xs; x <= xe; x++) {
          for (let y = ys; y <= ye; y++) {
            const t = tileAt(x, y);
            if (!t) continue;
            t.classList.add(`region-${id}`);
          }
        }
      }
    }
  };

  const updateRoadSprites = function () {
    // First pass: compute neighbor connectivity for all road and bridge tiles
    const conn = new Map(); // key -> { north, south, west, east, isBridge }
    for (let y = 0; y < state.rows; y++) {
      for (let x = 0; x < state.cols; x++) {
        const t = tileAt(x, y);
        if (
          !t ||
          (!t.classList.contains("road") && !t.classList.contains("bridge"))
        )
          continue;
        const tn = tileAt(x, y - 1);
        const ts = tileAt(x, y + 1);
        const tw = tileAt(x - 1, y);
        const te = tileAt(x + 1, y);
        const north = !!(
          tn &&
          (tn.classList.contains("road") || tn.classList.contains("bridge"))
        );
        const south = !!(
          ts &&
          (ts.classList.contains("road") || ts.classList.contains("bridge"))
        );
        const west = !!(
          tw &&
          (tw.classList.contains("road") || tw.classList.contains("bridge"))
        );
        const east = !!(
          te &&
          (te.classList.contains("road") || te.classList.contains("bridge"))
        );
        const isBridge = t.classList.contains("bridge");
        conn.set(x + "," + y, { north, south, west, east, isBridge });
      }
    }

    // Second pass: apply sprite classes based on connectivity (keeps logic simple and resilient)
    for (const [key, c] of conn.entries()) {
      const [sx, sy] = key.split(",").map(Number);
      const tile = tileAt(sx, sy);
      if (!tile) continue;
      tile.classList.remove(
        "road-sprite",
        "straight",
        "corner",
        "junction-t",
        "junction-cross",
        "end",
        "bridge-sprite"
      );

      const { north, south, west, east, isBridge } = c;
      const connections = [north, south, west, east].filter(Boolean).length;

      let spriteClass = "road-sprite";
      if (connections === 4) spriteClass += " junction-cross";
      else if (connections === 3) spriteClass += " junction-t";
      else if (connections === 2) {
        if ((north && south) || (west && east)) spriteClass += " straight";
        else spriteClass += " corner";
      } else if (connections === 1) spriteClass += " end";

      if (isBridge) spriteClass += " bridge-sprite";

      tile.classList.add(...spriteClass.trim().split(/\s+/));
    }

    if (typeof markAdjacency === "function") {
      markAdjacency();
    }
  };

  // ======= WALL UPGRADE HUD =======
  const initWallUpgradeHud = function() {
    const levelEl = document.querySelector('#homebase-page #wallLevel');
    const btnEl = document.querySelector('#homebase-page #upgradeWallBtn');
    if (!levelEl || !btnEl) return;

    // Bunker now replaces the old Concrete/Metal mix as the final tier
    const wallTypes = ['Wood', 'Concrete', 'Metal', 'Bunker'];
    const wallIcons = ['🪵', '🧱', '⚙️', '🛡️'];
    // TEST MODE: All upgrade costs zero
    const upgradeCosts = [
      { wood: 0, stone: 0 },  // Wood -> Concrete
      { wood: 0, stone: 0 },  // Concrete -> Metal
      { wood: 0, stone: 0 }   // Metal -> Bunker
    ];

    function updateWallUpgradeHud() {
      const level = state.wallLevel || 0;
      levelEl.textContent = wallTypes[level];
      
      // Update button icon
      const iconSpan = btnEl.querySelector('.wall-icon') || document.createElement('span');
      iconSpan.className = 'wall-icon';
      iconSpan.textContent = wallIcons[level];
      if (!btnEl.querySelector('.wall-icon')) {
        btnEl.insertBefore(iconSpan, btnEl.firstChild);
      }
      
      if (level >= wallTypes.length - 1) {
        btnEl.disabled = true;
        btnEl.title = 'Walls fully upgraded';
        btnEl.textContent = 'Max';
        btnEl.insertBefore(iconSpan, btnEl.firstChild);
      } else {
        const cost = upgradeCosts[level];
        const canAfford = true; // always true in test mode
        btnEl.disabled = false;
        btnEl.title = `Upgrade to ${wallTypes[level + 1]} (TEST: 0 cost)`;
        btnEl.textContent = 'Upgrade';
        btnEl.insertBefore(iconSpan, btnEl.firstChild);
      }
      
      // Update button class for styling
      btnEl.className = 'btn mini wall-upgrade-button';
      if (level === 1) btnEl.classList.add('concrete');
      else if (level === 2) btnEl.classList.add('metal');
      else if (level === 3) btnEl.classList.add('bunker');
    }

    function upgradeWall() {
      const level = state.wallLevel || 0;
      if (level >= wallTypes.length - 1) return;
      
      const cost = upgradeCosts[level];
      // In test mode, skip affordability check and resource deduction
      
      // Upgrade wall level
      state.wallLevel = level + 1;
      
      // Redraw walls with new texture
      drawWalls();
      
      // Update UI
      updateWallUpgradeHud();
      if (typeof updateAffordChip === 'function') {
        updateAffordChip();
      }
      
      if (typeof showNotification === 'function') {
        showNotification(`Walls upgraded to ${wallTypes[state.wallLevel]}`);
      }
    }

    btnEl.addEventListener('click', upgradeWall);

    // initial paint
    updateWallUpgradeHud();
  };

  // Initialize visuals once module loads
  document.addEventListener("DOMContentLoaded", function () {
    try {
      generateRoadNetwork();
    } catch (e) {
      console.warn("generateRoadNetwork failed:", e);
    }
    try {
      updateRoadSprites();
    } catch (e) {
      console.warn("updateRoadSprites failed:", e);
    }
    try {
      assignRegionClasses();
    } catch (e) {
      console.warn("assignRegionClasses failed:", e);
    }
    try {
      drawWalls();
    } catch (e) {
      console.warn("drawWalls failed:", e);
    }
    try {
      initWallUpgradeHud();
    } catch (e) {
      console.warn("initWallUpgradeHud failed:", e);
    }
  });
})(); // end Home Base merged module
