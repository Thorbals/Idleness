export const MELEE_WEAPONS = {
  rusty_kitchen_knife: {
    id: "rusty_kitchen_knife",
    name: "Rusty Kitchen Knife",
    type: "weapon",
    subtype: "melee",
    icon: "🔪",
    attack: 8,
    accuracy: 5,
    criticalPct: 1,
  },
  crowbar: {
    id: "crowbar",
    name: "Crowbar",
    type: "weapon",
    subtype: "melee",
    icon: "🛠️",
    attack: 15,
    defense: 2,
    armorPen: 5,
    attackSpeed: -10,
  },
  police_baton: {
    id: "police_baton",
    name: "Police Baton",
    type: "weapon",
    subtype: "melee",
    icon: "🔨",
    attack: 12,
    accuracy: 8,
    attackSpeed: 15,
    criticalPct: 3,
  },
  military_combat_knife: {
    id: "military_combat_knife",
    name: "Military Combat Knife",
    type: "weapon",
    subtype: "melee",
    icon: "🗡️",
    attack: 22,
    accuracy: 12,
    criticalPct: 8,
    armorPen: 10,
  },
};

export const RANGED_WEAPONS = {
  assault_rifle: {
    id: "assault_rifle",
    name: "Assault Rifle",
    type: "weapon",
    subtype: "ranged",
    icon: "🔫",
    attack: 35,
    accuracy: 20,
    criticalPct: 5,
    attackSpeed: 25,
    armorPen: 15,
  },
};

export const EXPLOSIVE_WEAPONS = {
  molotov_cocktail: {
    id: "molotov_cocktail",
    name: "Molotov Cocktail",
    type: "weapon",
    subtype: "explosive",
    icon: "🔥",
    attack: 18,
    elementalStatus: 15,
    attackSpeed: -20,
    accuracy: -5,
  },
  pipe_bomb: {
    id: "pipe_bomb",
    name: "Pipe Bomb",
    type: "weapon",
    subtype: "explosive",
    icon: "🧨",
    attack: 25,
    armorPen: 12,
    elementalStatus: 10,
    attackSpeed: -30,
  },
  grenade_launcher: {
    id: "grenade_launcher",
    name: "Grenade Launcher",
    type: "weapon",
    subtype: "explosive",
    icon: "💥",
    attack: 40,
    accuracy: 10,
    elementalStatus: 20,
    attackSpeed: -25,
  },
  c4_explosive: {
    id: "c4_explosive",
    name: "C4 Explosive",
    type: "weapon",
    subtype: "explosive",
    icon: "🧱",
    attack: 55,
    armorPen: 25,
    elementalStatus: 25,
    attackSpeed: -40,
  },
  rocket_launcher: {
    id: "rocket_launcher",
    name: "Rocket Launcher",
    type: "weapon",
    subtype: "explosive",
    icon: "🚀",
    attack: 70,
    armorPen: 30,
    elementalStatus: 30,
    attackSpeed: -50,
    criticalPct: 10,
  },
};

export const HELMETS = {
  baseball_cap: {
    id: "baseball_cap",
    name: "Baseball Cap",
    type: "helmet",
    icon: "🧢",
    accuracy: 3,
  },
  hard_hat: {
    id: "hard_hat",
    name: "Hard Hat",
    type: "helmet",
    icon: "🥽",
    defense: 5,
    hp: 10,
  },
  motorcycle_helmet: {
    id: "motorcycle_helmet",
    name: "Motorcycle Helmet",
    type: "helmet",
    icon: "🏍️",
    defense: 8,
    hp: 15,
    accuracy: -3,
  },
  riot_helmet: {
    id: "riot_helmet",
    name: "Riot Helmet",
    type: "helmet",
    icon: "🪖",
    defense: 12,
    hp: 20,
    critResistance: 10,
  },
  combat_helmet: {
    id: "combat_helmet",
    name: "Combat Helmet",
    type: "helmet",
    icon: "🪖",
    defense: 16,
    hp: 25,
    accuracy: 8,
    criticalPct: 5,
  },
};

export const BODY_ARMOR = {
  torn_jacket: {
    id: "torn_jacket",
    name: "Torn Jacket",
    type: "armor",
    icon: "🧥",
    defense: 3,
  },
  leather_jacket: {
    id: "leather_jacket",
    name: "Leather Jacket",
    type: "armor",
    icon: "🥋",
    defense: 8,
    attackSpeed: 5,
  },
  construction_vest: {
    id: "construction_vest",
    name: "Construction Vest",
    type: "armor",
    icon: "🦺",
    defense: 12,
    accuracy: 5,
  },
  police_vest: {
    id: "police_vest",
    name: "Police Vest",
    type: "armor",
    icon: "🛡️",
    defense: 18,
    hp: 25,
  },
  military_body_armor: {
    id: "military_body_armor",
    name: "Military Body Armor",
    type: "armor",
    icon: "🛡️",
    defense: 28,
    hp: 40,
    armorPenResistance: 15,
  },
};

export const GLOVES = {
  work_gloves: {
    id: "work_gloves",
    name: "Work Gloves",
    type: "gloves",
    icon: "🧤",
    attack: 2,
    accuracy: 3,
  },
  rubber_gloves: {
    id: "rubber_gloves",
    name: "Rubber Gloves",
    type: "gloves",
    icon: "🧤",
    defense: 2,
    statusResistance: 10,
  },
  fingerless_gloves: {
    id: "fingerless_gloves",
    name: "Fingerless Gloves",
    type: "gloves",
    icon: "🧤",
    attack: 4,
    criticalPct: 3,
    attackSpeed: 5,
  },
  tactical_gloves: {
    id: "tactical_gloves",
    name: "Tactical Gloves",
    type: "gloves",
    icon: "🧤",
    attack: 6,
    accuracy: 6,
    criticalPct: 5,
  },
  power_gauntlets: {
    id: "power_gauntlets",
    name: "Power Gauntlets",
    type: "gloves",
    icon: "🧤",
    attack: 12,
    defense: 8,
    armorPen: 10,
    attackSpeed: -5,
  },
};

export const BOOTS = {
  worn_sneakers: {
    id: "worn_sneakers",
    name: "Worn Sneakers",
    type: "boots",
    icon: "👟",
    attackSpeed: 3,
  },
  work_boots: {
    id: "work_boots",
    name: "Work Boots",
    type: "boots",
    icon: "🥾",
    defense: 4,
    attack: 3,
  },
  hiking_boots: {
    id: "hiking_boots",
    name: "Hiking Boots",
    type: "boots",
    icon: "🥾",
    defense: 6,
    attackSpeed: 8,
    hp: 10,
  },
  combat_boots: {
    id: "combat_boots",
    name: "Combat Boots",
    type: "boots",
    icon: "🥾",
    defense: 8,
    attack: 5,
    hp: 15,
  },
  powered_boots: {
    id: "powered_boots",
    name: "Powered Boots",
    type: "boots",
    icon: "🤖",
    defense: 10,
    attackSpeed: 12,
    hp: 20,
    criticalPct: 3,
  },
};

export const ACCESSORIES = {
  wristwatch: {
    id: "wristwatch",
    name: "Wristwatch",
    type: "accessory",
    icon: "⌚",
    accuracy: 5,
  },
  dog_tags: {
    id: "dog_tags",
    name: "Dog Tags",
    type: "accessory",
    icon: "🏷️",
    hp: 15,
    criticalPct: 2,
  },
  gas_mask: {
    id: "gas_mask",
    name: "Gas Mask",
    type: "accessory",
    icon: "😷",
    statusResistance: 25,
    accuracy: -5,
  },
  night_vision_goggles: {
    id: "night_vision_goggles",
    name: "Night Vision Goggles",
    type: "accessory",
    icon: "🕶️",
    accuracy: 15,
    criticalPct: 8,
    defense: -3,
  },
  combat_stimulant_injector: {
    id: "combat_stimulant_injector",
    name: "Combat Stimulant Injector",
    type: "accessory",
    icon: "💉",
    attack: 10,
    attackSpeed: 20,
    hp: -10,
  },
};

export const EQUIPMENT_DATA = {
  ...MELEE_WEAPONS,
  ...RANGED_WEAPONS,
  ...EXPLOSIVE_WEAPONS,
  ...HELMETS,
  ...BODY_ARMOR,
  ...GLOVES,
  ...BOOTS,
  ...ACCESSORIES,
};

export const STARTER_EQUIPMENT = [
  "rusty_kitchen_knife",
  "torn_jacket",
  "baseball_cap",
  "work_gloves",
  "worn_sneakers",
  "wristwatch",
];

export default {
  MELEE_WEAPONS,
  RANGED_WEAPONS,
  EXPLOSIVE_WEAPONS,
  HELMETS,
  BODY_ARMOR,
  GLOVES,
  BOOTS,
  ACCESSORIES,
  EQUIPMENT_DATA,
  STARTER_EQUIPMENT,
};

// Equipment logic functions

let lastRenderedEquipment = {};

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
  gameState.player.accuracy = 50; gameState.player.evasion = 25; gameState.player.critical = 0; gameState.player.critMultiplier = 1.5; gameState.player.armorPen = 0; gameState.player.attackSpeed = 0; gameState.player.baseSpeedMs = 3000;
  gameState.player.statusResistance = 0; gameState.player.critResistance = 0; gameState.player.armorPenResistance = 0; gameState.player.elementalStatus = 0;
  gameState.player.hpRegenPerSec = 0; gameState.player.damageReductionBonusPct = 0; gameState.player.blockChancePct = 0; gameState.player.reflectOnBlockChancePct = 0; gameState.player.reflectOnBlockPct = 0; gameState.player.doubleAttackChancePct = 0; gameState.player.alwaysHitIfAccHigher = false; gameState.player.pierceTargets = 1; gameState.player.poisonImmune = false;
  Object.values(gameState.equipment).forEach((itemId) => {
    if (itemId && gameData.items[itemId]) {
      const item = gameData.items[itemId];
      if (item.attack) gameState.player.attack += item.attack;
      if (item.defense) gameState.player.defense += item.defense;
      if (item.hp) gameState.player.maxHp += item.hp;
      if (item.accuracy) gameState.player.accuracy += item.accuracy;
      if (item.evasion) gameState.player.evasion += item.evasion;
      if (item.critical) gameState.player.critical += item.critical;
      if (item.criticalPct) gameState.player.critical += Math.round((Math.max(0, Math.min(95, item.criticalPct)) / (100 - Math.max(0, Math.min(95, item.criticalPct)))) * 200);
      if (item.critMultiplier) gameState.player.critMultiplier = item.critMultiplier;
      if (item.armorPen) gameState.player.armorPen += item.armorPen;
      if (item.attackSpeed) gameState.player.attackSpeed += item.attackSpeed;
      if (item.baseSpeedMs) gameState.player.baseSpeedMs = item.baseSpeedMs;
      if (item.statusResistance) gameState.player.statusResistance += item.statusResistance;
      if (item.critResistance) gameState.player.critResistance += item.critResistance;
      if (item.armorPenResistance) gameState.player.armorPenResistance += item.armorPenResistance;
      if (item.elementalStatus) gameState.player.elementalStatus += item.elementalStatus;
    }
  });

  const Lf = gameState.skills.fitness.level || 0;
  const Ld = gameState.skills.defense.level || 0;
  const Lm = gameState.skills.melee.level || 0;
  const Lr = gameState.skills.firearms.level || 0; const Le = gameState.skills.explosives.level || 0;

  let fitnessHp = Math.floor(25 * Math.pow(1 + Lf, 0.9));
  let hpRegen = 0.5 * Math.pow(1 + Lf, 0.4);
  let statusResist = 2 * Math.pow(1 + Lf, 0.3);
  let maxHpPctBonus = 0;
  if (Lf >= 25) maxHpPctBonus += 5;
  if (Lf >= 50) hpRegen *= 1.10;
  if (Lf >= 75) statusResist += 15;
  if (Lf >= 99) { maxHpPctBonus += 20; gameState.player.poisonImmune = true; }
  gameState.player.maxHp += fitnessHp;
  gameState.player.hpRegenPerSec += hpRegen;
  gameState.player.statusResistance += Math.round(statusResist);

  const defAdd = Math.floor(3 * Math.pow(1 + Ld, 0.8));
  let drBonus = 1 * Math.pow(1 + Ld, 0.35);
  let blockChance = 1 * Math.pow(1 + Ld, 0.25);
  if (Ld >= 25) drBonus += 3;
  if (Ld >= 50) blockChance += 5;
  if (Ld >= 75) drBonus += 5;
  if (Ld >= 99) blockChance += 10;
  gameState.player.defense += defAdd;
  gameState.player.damageReductionBonusPct += drBonus;
  gameState.player.blockChancePct += blockChance;

  const meleeAdd = Math.floor(2 * Math.pow(1 + Lm, 0.75));
  let doubleAttack = 0.5 * Math.pow(1 + Lm, 0.3);
  if (Lm >= 25) doubleAttack += 1;
  if (Lm >= 50) doubleAttack += 1;
  if (Lm >= 75) doubleAttack += 2;
  if (Lm >= 99) doubleAttack += 3;
  gameState.player.attack += meleeAdd;
  gameState.player.doubleAttackChancePct += doubleAttack;

  const firearmAdd = Math.floor(2 * Math.pow(1 + Lr, 0.75));
  let pierce = 0;
  if (Lr >= 25) pierce = 1;
  if (Lr >= 50) pierce = 1;
  if (Lr >= 75) pierce = 2;
  if (Lr >= 99) pierce = 3;
  gameState.player.attack += firearmAdd;
  gameState.player.pierceTargets += pierce;

  const explosiveAdd = Math.floor(2 * Math.pow(1 + Le, 0.75));
  gameState.player.attack += explosiveAdd;

  gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);
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
    <div style="font-size: 24px;">${item.icon || "??"}</div>
          <div style="font-size: 8px; color: #f8f9fa; text-align: center; margin-top: 2px; word-wrap: break-word; line-height: 1.1;">${item.name}</div>
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

function showEquipmentTooltip(event, slot) {
  const equippedItem = gameState.equipment[slot];
  if (!equippedItem || !gameData.items[equippedItem]) return;

  hideEquipmentTooltip(); // Clean up any existing tooltip

  const item = gameData.items[equippedItem];
  const tooltip = createEquipmentTooltip(item);

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

  requestAnimationFrame(() => {
    tooltip.classList.add("show");
  });

  equipmentTooltip = tooltip;
}

function createEquipmentTooltip(item) {
  if (!item) {
    console.warn('createEquipmentTooltip called with null item');
    return null;
  }

  const tooltip = document.createElement("div");
  tooltip.className = "equipment-tooltip";

  let content = `<h4>${item.name}</h4>`;
  content += `<div class="item-type">${item.type.charAt(0).toUpperCase() + item.type.slice(1)
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

  content += `<div style="margin-top: 8px; color: #8b949e; font-size: 11px;">Click to unequip</div>`;

  tooltip.innerHTML = content;
  return tooltip;
}

// Export functions to window for global access
window.canEquipItem = canEquipItem;
window.equipItem = equipItem;
window.unequipItem = unequipItem;
window.getEquipmentSlot = getEquipmentSlot;
window.updatePlayerStats = updatePlayerStats;
window.renderEquipmentSlots = renderEquipmentSlots;
window.getSlotName = getSlotName;
window.showEquipmentTooltip = showEquipmentTooltip;
window.createEquipmentTooltip = createEquipmentTooltip;
