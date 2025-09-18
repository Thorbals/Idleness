// eslint-disable no-unused-vars
// combat.js (readable stub)
const CombatModule = { id: 'combat' };
if (typeof window !== 'undefined') { window.gameModules = window.gameModules || {}; window.gameModules.combat = CombatModule; }
export default CombatModule;
// Auto-split from monolith.js
// Source section: data/combat.js


function scaleEnemyForLevel(factionId, baseEnemy, level, kind) {
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
  const critRating = critPctToRating(
    (b.critPct || 0) * Math.pow(1 + effLevel, e.crit)
  );
  const armPen =
    Math.round((b.armPenPct || 0) * Math.pow(1 + effLevel, e.armPen) * 100) / 1;
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
        }


// End of combat.js

function getHitChance(attacker, defender) {
  const acc = Math.max(0, attacker.accuracy ?? 50);
  const eva = Math.max(0, defender.evasion ?? 25);
  if (acc === 0 && eva === 0) return 0.5;
  return acc / (acc + eva);
}

function getCritChance(attacker) {
  const rating = Math.max(0, attacker.critical ?? 0);
  return Math.min(0.75, rating / (rating + 200));
}

function getEffectiveCritChance(attacker, defender) {
  const base = getCritChance(attacker);
  const resist = Math.max(0, Math.min(1, (defender.critResistance ?? 0) / 100));
  return Math.max(0, base - resist);
}

function getEffectiveDefense(defender, attacker) {
  const base = Math.max(0, defender.defense ?? 0);
  const penPctRaw = Math.max(0, Math.min(90, attacker.armorPen ?? 0));
  const penResist = Math.max(0, Math.min(90, defender.armorPenResistance ?? 0));
  const penPct = Math.max(0, penPctRaw - penResist);
  return base * (1 - penPct / 100);
}

function getDamageReduction(defenseValue) {
  const dr = defenseValue / (defenseValue + 100);
  return Math.min(0.95, Math.max(0, dr));
}

function computeDamage(attacker, defender) {
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
}

function getAttackIntervalMs(attacker) {
  const base = Math.max(500, Math.min(5000, attacker.baseSpeedMs ?? 3000));
  const spd = Math.max(0, attacker.attackSpeed ?? 0);
  const interval = base / (1 + spd / 100);
  return Math.max(500, Math.min(5000, Math.floor(interval)));
}

function setupEventListeners() {
  document.addEventListener("click", handleClick);
  document.addEventListener("click", function (e) {
    const isTooltipElement = e.target.closest(
      ".bank-slot, .equipment-slot, [data-item-tooltip]"
    );
    if (!isTooltipElement) {
      hideItemTooltip();
      hideEquipmentTooltip();
    }
  });
  document.addEventListener("mouseover", function (e) {
    const tooltipElement = e.target.closest("[data-item-tooltip]");
    if (tooltipElement) {
      const itemId = tooltipElement.getAttribute("data-item-tooltip");
      showItemTooltip(e, itemId);
    }
  });

  document.addEventListener("mouseout", function (e) {
    const tooltipElement = e.target.closest("[data-item-tooltip]");
    if (tooltipElement) {
      hideItemTooltip();
    }
  });

  document.addEventListener("mousemove", function (e) {
    const ghost = document.getElementById("bank-held-ghost");
    if (gameState.bankHeldItem && ghost) {
      ghost.style.transform = `translate(${e.pageX + 12}px, ${e.pageY + 12}px)`;
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (gameState.bankHeldItem) {
        gameState.bankHeldItem = null;
        hideHeldGhost();
        return;
      }
      if (gameState.combat.inCombat) {
        if (confirm("Flee from combat? You will take damage.")) {
          const combat = gameState.combat;

          addCombatLog("You fled from combat!", "log-damage");
          gameState.player.hp = gameState.player.maxHp;
          if (combat.inDungeon) {
            addCombatLog("Dungeon run ended due to defeat!", "log-damage");
            if (combat.dungeonEnemies && combat.currentDungeon) {
              delete combat.dungeonEnemies[combat.currentDungeon];
            }

            combat.inDungeon = false;
            combat.currentDungeon = null;
            combat.dungeonProgress = 0;
            combat.dungeonEnemies = {};

            renderEnemies(gameState.currentArea);
          }

          combat.inCombat = false;
          combat.currentEnemy = null;
          hideCombatProgress();
          hideEnemyDisplay();
          const noEnemy = document.getElementById("no-enemy");
          if (noEnemy) noEnemy.classList.add("visible");

          showNotification("Fled from combat", "info");
        }
      }
    }
  });

  document.querySelectorAll(".equipment-slot").forEach(function (slot) {
    const slotName = slot.dataset.slot;

    slot.addEventListener("click", function (event) {
      event.stopPropagation();
      if (gameState.equipment[slotName]) {
        unequipItem(slotName);
      }
    });

    slot.addEventListener("mouseenter", function (event) {
      showEquipmentTooltip(event, slotName);
    });

    slot.addEventListener("mouseleave", function () {
      hideEquipmentTooltip();
    });
  });

  document.addEventListener("click", function (e) {
    const slot = e.target.closest(".bank-slot");
    if (!slot || !slot.classList.contains("has-item")) return;

    const itemId = slot.dataset.itemId;
    if (!itemId) return;

    const item = gameData.items[itemId];
    if (!item) return;

    if (
      (item.type === "food" || item.type === "cooked_food") &&
      item.healAmount
    ) {
      useFood(itemId);
    } else if (
      [
        "weapon",
        "helmet",
        "armor",
        "gloves",
        "boots",
        "offhand",
        "accessory",
      ].includes(item.type)
    ) {
      if (canEquipItem(itemId)) {
        equipItem(itemId);
      } else {
        showNotification(`Requires level ${item.level || 1}`, "warning");
      }
    }
  });
  const autoBtn = document.getElementById("btn-autoheal");
  if (autoBtn) {
    autoBtn.addEventListener("click", () => {
      gameState.combat.autohealEnabled = !gameState.combat.autohealEnabled;
      autoBtn.textContent = `Bandage Autoheal: ${
        gameState.combat.autohealEnabled ? "On" : "Off"
      }`;
      addCombatLog(
        `Bandage autoheal ${
          gameState.combat.autohealEnabled ? "enabled" : "disabled"
        }`
      );
    });
  }

  const eatBtn = document.getElementById("btn-eat-food");
  if (eatBtn) {
    eatBtn.addEventListener("click", () => {
      const healed = useSelectedFoodOrBest();
      if (!healed)
        showNotification("No usable food or already full HP", "warning");
    });
  }

  const escBtn = document.getElementById("btn-escape");
  if (escBtn) {
    escBtn.addEventListener("click", () => {
      escapeBattle();
    });
  }
  populateBandageDropdown();
  populateFoodDropdown();
}

function useBandage(itemId) {
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
}

function updateGame() {
  if (gameState.currentAction) {
    updateCurrentAction();
  }

  if (gameState.combat.inCombat) {
    updateCombat();
  }

  updatePassiveSystems();

  if (Date.now() - gameState.lastSave > 300000) {
    // 5 minutes
    saveGame();
  }
}

function updateCombat() {
  const combat = gameState.combat;
  if (!combat.inCombat || !combat.currentEnemy) return;
  if (combat.playerTimer == null) combat.playerTimer = 0;
  if (combat.enemyTimer == null) combat.enemyTimer = 0;
  combat.playerTimer += 100;
  combat.enemyTimer += 100;
  if (combat.playerTimer >= combat.playerInterval) {
    performPlayerAttack();
    if (
      gameState.player.doubleAttackChancePct &&
      Math.random() < gameState.player.doubleAttackChancePct / 100
    ) {
      performPlayerAttack();
    }
    combat.playerTimer -= combat.playerInterval;
  }
  if (combat.inCombat && combat.enemyTimer >= combat.enemyInterval) {
    performEnemyAttack();
    combat.enemyTimer -= combat.enemyInterval;
  }
  if (combat.autohealEnabled) {
    combat._autohealTicker = (combat._autohealTicker || 0) + 100;
    if (combat._autohealTicker >= (combat.autohealCooldownMs || 1500)) {
      combat._autohealTicker = 0;
      const threshold = Math.max(
        0.1,
        Math.min(0.95, combat.autohealThreshold || 0.7)
      );
      const hpRatio = gameState.player.hp / gameState.player.maxHp;
      if (hpRatio < threshold) {
        const usedBandage = useSelectedBandageOrBest(true);
        if (!usedBandage) {
          const healed = useSelectedFoodOrBest(true);
          if (!healed) {
          }
        }
      }
    }
  }

  combat._regenTicker = (combat._regenTicker || 0) + 100;
  if (combat._regenTicker >= 1000) {
    combat._regenTicker = 0;
    const regen = Math.max(0, gameState.player.hpRegenPerSec || 0);
    if (regen > 0 && gameState.player.hp < gameState.player.maxHp) {
      const healed = Math.min(
        gameState.player.maxHp - gameState.player.hp,
        Math.floor(regen)
      );
      if (healed > 0) {
        gameState.player.hp += healed;
        addCombatLog(`You regenerate ${healed} HP`, "log-heal");
      }
    }
  }

  updateCombatProgress();
}

function useBestAvailableFood(quiet = false) {
  let bestId = null;
  let bestHeal = 0;
  for (const [id, qty] of Object.entries(gameState.bank)) {
    if (!qty || qty <= 0) continue;
    const item = gameData.items[id];
    if (!item) continue;
    if (
      (item.type === "food" || item.type === "cooked_food") &&
      item.healAmount
    ) {
      if (item.healAmount > bestHeal) {
        bestHeal = item.healAmount;
        bestId = id;
      }
    }
  }
  if (!bestId) {
    if (!quiet) showNotification("No food available");
    return false;
  }
  if (gameState.player.hp >= gameState.player.maxHp) {
    if (!quiet) showNotification("HP is already full");
    return false;
  }
  const before = gameState.player.hp;
  useFood(bestId);
  const healed = gameState.player.hp - before;
  if (healed > 0)
    addCombatLog(`Ate ${getItemName(bestId)} (+${healed} HP)`, "log-heal");
  return healed > 0;
}

function useSelectedFoodOrBest(quiet = false) {
  const sel = document.getElementById("select-food");
  const chosen =
    gameState.combat.selectedFoodId || (sel && sel.value ? sel.value : null);
  if (chosen && (gameState.bank[chosen] || 0) > 0) {
    if (gameState.player.hp >= gameState.player.maxHp) {
      if (!quiet) showNotification("HP is already full");
      return false;
    }
    const before = gameState.player.hp;
    useFood(chosen);
    const healed = gameState.player.hp - before;
    if (healed > 0)
      addCombatLog(`Ate ${getItemName(chosen)} (+${healed} HP)`, "log-heal");
    populateFoodDropdown();
    return healed > 0;
  }
  const res = useBestAvailableFood(quiet);
  if (res) populateFoodDropdown();
  return res;
}

function useSelectedBandageOrBest(quiet = false) {
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
  const bandages = getBandageIds()
    .filter((id) => (gameState.bank[id] || 0) > 0)
    .sort((a, b) => getBandageHealAmount(b) - getBandageHealAmount(a));
  if (bandages.length === 0) return false;
  const best = bandages[0];
  if (gameState.player.hp >= gameState.player.maxHp) {
    if (!quiet) showNotification("HP is already full");
    return false;
  }
  const ok = useBandage(best);
  populateBandageDropdown();
  return ok;
}

function escapeBattle() {
  const combat = gameState.combat;
  if (!combat.inCombat) return;

  addCombatLog("You fled from combat!", "log-damage");
  gameState.player.hp = gameState.player.maxHp;
  if (combat.inDungeon) {
    addCombatLog("Dungeon run ended due to defeat!", "log-damage");
    if (combat.dungeonEnemies && combat.currentDungeon) {
      delete combat.dungeonEnemies[combat.currentDungeon];
    }

    combat.inDungeon = false;
    combat.currentDungeon = null;
    combat.dungeonProgress = 0;
    renderEnemies(gameState.currentArea);
  }

  combat.inCombat = false;
  combat.currentEnemy = null;
  hideCombatProgress();
  hideEnemyDisplay();
  const noEnemy = document.getElementById("no-enemy");
  if (noEnemy) noEnemy.classList.add("visible");

  document
    .querySelectorAll(".enemy-item")
    .forEach((i) => i.classList.remove("active"));
}

function critPctToRating(pct) {
  const p = Math.max(0, Math.min(0.95, pct || 0));
  return Math.round((p / (1 - p)) * 200);
}

function performPlayerAttack() {
  const combat = gameState.combat;
  const enemy = combat.currentEnemy;
  if (!enemy) return;

  const res = computeDamage(gameState.player, enemy);
  if (!res.hit) {
    addCombatLog(`You miss ${enemy.name}`, "log-damage");
  } else if (res.blocked) {
    addCombatLog(`${enemy.name} blocks your attack`, "log-damage");
    if (res.reflectDamage && res.reflectDamage > 0) {
      gameState.player.hp = Math.max(
        0,
        gameState.player.hp - res.reflectDamage
      );
      addCombatLog(
        `${enemy.name} reflects ${res.reflectDamage} damage to you`,
        "log-damage"
      );
    }
  } else {
    combat.enemyHp = Math.max(0, combat.enemyHp - res.damage);
    addCombatLog(
      `You deal ${res.damage}${res.crit ? " CRIT" : ""} to ${enemy.name}`,
      "log-damage"
    );
  }

  if (combat.enemyHp <= 0) {
    addCombatLog(`${enemy.name} defeated!`, "log-heal");

    addXP("fitness", enemy.xp);
    if (enemy.drops && !enemy.dungeonId) {
      const playerLevel = gameState.player.combatLevel;
      const enemyLevel = enemy.level || enemy.baseLevel || 1;

      const hasRaritySystem = enemy.drops.some((drop) => drop.rarity);

      if (hasRaritySystem) {
        const results = rollForRarityDrops(
          enemy.drops,
          playerLevel,
          enemyLevel
        );
        results.forEach((r) => {
          if (r.item === "scrap") {
            gameState.player.scrap += r.quantity;
            const rarityTag = r.rarity ? `[${r.rarity.toUpperCase()}] ` : "";
            addCombatLog(`+${r.quantity} ${rarityTag}Scrap`, "log-loot");
          } else {
            addToBank(r.item, r.quantity);
            const rarityTag = r.rarity ? `[${r.rarity.toUpperCase()}] ` : "";
            addCombatLog(
              `+${r.quantity} ${rarityTag}${getItemName(r.item)}`,
              "log-loot"
            );
          }
        });
      } else {
        enemy.drops.forEach((drop) => {
          if (drop.item === "scrap") {
            const amount =
              Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
            gameState.player.scrap += amount;
            addCombatLog(`+${amount} Scrap`, "log-loot");
          } else if (Math.random() < (drop.chance || 1)) {
            const amount = drop.min || 1;
            addToBank(drop.item, amount);
            addCombatLog(`+${amount} ${getItemName(drop.item)}`, "log-loot");
          }
        });
      }
    }
    if (combat.inDungeon && combat.currentDungeon) {
      const seq =
        (combat.dungeonEnemies &&
          combat.dungeonEnemies[combat.currentDungeon]) ||
        [];
      combat.dungeonProgress = (combat.dungeonProgress || 0) + 1;
      if (combat.dungeonProgress < seq.length) {
        const next = seq[combat.dungeonProgress];
        addCombatLog(`Next encounter: ${next.name}`);
        renderEnemies(gameState.currentArea);

        setTimeout(() => {
          startCombat(next);
        }, 600);
      } else {
        addCombatLog(`Dungeon cleared!`, "log-heal");
        if (!Array.isArray(combat.dungeonCompleted))
          combat.dungeonCompleted = [];
        if (!combat.dungeonCompleted.includes(combat.currentDungeon)) {
          combat.dungeonCompleted.push(combat.currentDungeon);
        }
        combat.inDungeon = false;
        combat.currentDungeon = null;
        combat.inCombat = false;
        combat.currentEnemy = null;
        combat.dungeonProgress = 0;
        hideCombatProgress();
        hideEnemyDisplay();
        const noEnemy = document.getElementById("no-enemy");
        if (noEnemy) noEnemy.classList.add("visible");
        renderEnemies(gameState.currentArea);
      }
    } else {
      const selectedEnemy = document.querySelector(".enemy-item.active");
      if (selectedEnemy && selectedEnemy.dataset.enemyId === enemy.id) {
        setTimeout(() => {
          combat.enemyHp = enemy.hp;
          combat.enemyMaxHp = enemy.hp;
          combat.playerTimer = 0;
          combat.enemyTimer = 0;
          const progressFill = document.getElementById("combat-progress-fill");
          const enemyHpBar = document.getElementById("enemy-hp-bar");
          if (progressFill) progressFill.classList.add("reset");
          if (enemyHpBar) enemyHpBar.classList.add("full");
          document.getElementById(
            "enemy-hp-text"
          ).textContent = `${enemy.hp}/${enemy.hp}`;
          addCombatLog(`${enemy.name} respawned! Fighting again...`);
        }, 800);
      } else {
        combat.inCombat = false;
        combat.currentEnemy = null;
        hideCombatProgress();
        hideEnemyDisplay();
        document.getElementById("combat-status").textContent =
          "Enemy defeated! Select another enemy.";
      }
    }

    return;
  }
}

function performEnemyAttack() {
  const combat = gameState.combat;
  const enemy = combat.currentEnemy;
  if (!enemy) return;
  const enemyAttacker = Object.assign({
    accuracy: enemy.accuracy ?? 50,
    evasion: enemy.evasion ?? 25,
    critical: enemy.critical ?? 0,
    critMultiplier: enemy.critMultiplier ?? 1.5,
    armorPen: enemy.armorPen ?? 0,
    attackSpeed: enemy.attackSpeed ?? 0,
    baseSpeedMs: enemy.baseSpeedMs ?? 3000,
    attack: enemy.attack ?? 1,
    defense: enemy.defense ?? 0,
  });
  const res = computeDamage(enemyAttacker, gameState.player);
  if (!res.hit) {
    addCombatLog(`${enemy.name} misses you`, "log-damage");
    return;
  } else if (res.blocked) {
    addCombatLog(`You block ${enemy.name}'s attack`, "log-heal");
    if (res.reflectDamage && res.reflectDamage > 0) {
      gameState.combat.enemyHp = Math.max(
        0,
        gameState.combat.enemyHp - res.reflectDamage
      );
      addCombatLog(
        `You reflect ${res.reflectDamage} damage back`,
        "log-damage"
      );
    }
  } else {
    gameState.player.hp = Math.max(0, gameState.player.hp - res.damage);
    addCombatLog(
      `${enemy.name} hits you for ${res.damage}${res.crit ? " CRIT" : ""}`,
      "log-damage"
    );
  }

  if (gameState.player.hp <= 0) {
    addCombatLog("You have been defeated!", "log-damage");
    gameState.player.hp = gameState.player.maxHp;
    if (combat.inDungeon) {
      addCombatLog("Dungeon run ended due to defeat!", "log-damage");
      if (combat.dungeonEnemies && combat.currentDungeon) {
        delete combat.dungeonEnemies[combat.currentDungeon];
      }

      combat.inDungeon = false;
      combat.currentDungeon = null;
      combat.dungeonProgress = 0;
      renderEnemies(gameState.currentArea);
    }

    combat.inCombat = false;
    combat.currentEnemy = null;
    hideCombatProgress();
    hideEnemyDisplay();
    const noEnemy = document.getElementById("no-enemy");
    if (noEnemy) noEnemy.classList.add("visible");
  }
}

function addCombatLog(message, className = "") {
  const log = document.getElementById("activity-log-content");
  const entry = document.createElement("div");
  entry.className = `log-entry ${className}`;
  entry.textContent = message;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;

  while (log.children.length > 50) {
    log.removeChild(log.firstChild);
  }
}

function addXP(skill, amount) {
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
}

function getXPForLevel(level) {
  let totalXp = 0;
  for (let i = 2; i <= level; i++) {
    totalXp += i * 100;
  }
  return totalXp;
}

function getXPForNextLevel(currentLevel) {
  return (currentLevel + 1) * 100;
}

function updateCombatLevel() {
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
}

function checkUnlockFarmingPlots(level) {
  FARMING_DATA.plots.forEach((plot) => {
    if (plot.requiredLevel === level) {
      if (
        !gameState.farming.unlockedPlots.find((p) => p.requiredLevel === level)
      ) {
        gameState.farming.unlockedPlots.push({
          id: `plot_${plot.requiredLevel}`,
          name: plot.name,
          icon: plot.icon,
          requiredLevel: plot.requiredLevel,
          type: plot.type,
          interval: plot.interval,
          output: plot.output,
          seed: null,
          progress: 0,
          lastHarvest: Date.now(),
        });
        showNotification(`Unlocked ${plot.name}!`);
      }
    }
  });
}

const STRUCTURE_CAPACITY = { pen: 10, coop: 12, hutch: 8, insect: 30 };

function updatePassiveSystems() {
  updateFarmingProgress();
  updateFarmingProgressBars();
  updateAnimalCareProgress();
  updateAnimalCareProgressBars();
}

function updateFarmingProgress() {
  const currentTime = Date.now();

  gameState.farming.unlockedPlots.forEach((plot) => {
    if (!plot.plantedSeed) return;

    const timeSinceLastHarvest = currentTime - plot.lastHarvest;
    const seedTime = plot.plantedSeed.time;

    if (timeSinceLastHarvest >= seedTime) {
      const harvestCount = Math.floor(timeSinceLastHarvest / seedTime);

      plot.plantedSeed.produces.forEach((product) => {
        const totalOutput = product.quantity * harvestCount;
        addToBank(product.item, totalOutput);
      });

      addXP("farming", 15 * harvestCount);

      plot.lastHarvest = currentTime;

      showNotification(
        `${plot.name} produced crops from ${plot.plantedSeed.name}!`
      );
    }
  });
}

function updateAnimalCareProgress() {
  const currentTime = Date.now();

  gameState.animalCare.unlockedStructures.forEach((structure) => {
    if (structure.placedAnimal) {
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
          `${a.icon} ${a.name} (x${count}) produced ${quantity}x ${getItemName(
            randomByproduct
          )}`,
          "info"
        );

        structure.lastByproduct = currentTime;
      }

      if (
        structure.lastHarvest &&
        currentTime - structure.lastHarvest >= 240000
      ) {
        harvestAnimal(structure);
      }
    }
  });
}

function harvestPlot(plot) {
  if (plot.seed && plot.seed.produces) {
    plot.seed.produces.forEach((product) => {
      const quantity =
        Math.floor(Math.random() * (product.max - product.min + 1)) +
        product.min;
      addToBank(product.item, quantity);
      addToMessageLog(
        `Harvested ${quantity}x ${getItemName(product.item)} from ${plot.name}`,
        "success"
      );
    });
  }

  addXP("farming", 10);

  plot.seed = null;
  plot.progress = 0;
  plot.harvestTime = 0;
}

function harvestAnimal(structure) {
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
    addToMessageLog(
      `${a.icon} ${a.name} (x${count}) have been harvested and removed.`,
      "warning"
    );
    structure.placedAnimal = null;
    structure.lastByproduct = null;
    structure.lastHarvest = null;
  }

  addXP("animalcare", 15);
}

function getUnlockedPlots(playerLevel) {
  return Math.min(
    FARMING_DATA.plots.filter((plot) => playerLevel >= plot.requiredLevel)
      .length,
    FARMING_DATA.plots.length
  );
}

function getUnlockedPens(playerLevel) {
  return Math.min(
    ANIMAL_CARE_DATA.structures.filter(
      (structure) => playerLevel >= structure.level
    ).length,
    ANIMAL_CARE_DATA.structures.length
  );
}

function getNextPlotUnlockLevel(playerLevel) {
  const nextPlot = FARMING_DATA.plots.find(
    (plot) => plot.requiredLevel > playerLevel
  );
  return nextPlot ? nextPlot.requiredLevel : null;
}

function getNextPenUnlockLevel(playerLevel) {
  const nextStructure = ANIMAL_CARE_DATA.structures.find(
    (structure) => structure.level > playerLevel
  );
  return nextStructure ? nextStructure.level : null;
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

function getTabCapacity(tabId) {
  return BANK_CAPACITY_SLOTS;
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

function updateUI() {
  document.getElementById("scrap-amount").textContent =
    gameState.player.scrap.toLocaleString();
  document.getElementById("combat-level").textContent =
    gameState.player.combatLevel;

  Object.keys(gameState.skills).forEach((skill) => {
    const element = document.getElementById(`${skill}-level`);
    if (element) {
      element.textContent = gameState.skills[skill].level;
    }
  });

  const bankItems = Object.keys(gameState.bank).length;
  const bankCountEl = document.getElementById("bank-count");
  if (bankCountEl)
    bankCountEl.textContent = `${bankItems}/${BANK_CAPACITY_SLOTS}`;
  const bankCapacityEl = document.getElementById("bank-capacity");
  if (bankCapacityEl) {
    bankCapacityEl.textContent = `${bankItems}/${BANK_CAPACITY_SLOTS}`;
  }

  document.getElementById(
    "player-hp"
  ).textContent = `${gameState.player.hp}/${gameState.player.maxHp}`;
  document.getElementById("player-attack").textContent =
    gameState.player.attack;
  document.getElementById("player-defense").textContent =
    gameState.player.defense;
  document.getElementById("player-combat-level").textContent =
    gameState.player.combatLevel;

  const hpPercent = (gameState.player.hp / gameState.player.maxHp) * 100;
  document.documentElement.style.setProperty(
    "--player-hp-width",
    `${hpPercent}%`
  );

  if (gameState.combat.currentEnemy) {
    const enemyHpPercent =
      (gameState.combat.enemyHp / gameState.combat.enemyMaxHp) * 100;
    document.documentElement.style.setProperty(
      "--enemy-hp-width",
      `${enemyHpPercent}%`
    );
    document.getElementById(
      "enemy-hp-text"
    ).textContent = `${gameState.combat.enemyHp}/${gameState.combat.enemyMaxHp}`;
  }

  updateSkillInfo();
  renderEquipmentSlots();
  populateBandageDropdown();
  populateFoodDropdown();
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

function updateActionProgress() {
  const action = gameState.currentAction;
  if (!action) return;

  const progressPercent = (action.progress / action.duration) * 100;

  if (action.type === "crafting") {
    const craftProgressFill = document.getElementById("craft-progress-fill");
    const craftTimer = document.getElementById("craft-timer");

    if (craftProgressFill) {
      document.documentElement.style.setProperty(
        "--crafting-progress-width",
        `${Math.min(100, progressPercent)}%`
      );
    }

    if (craftTimer) {
      const remainingMs = Math.max(0, action.duration - action.progress);
      const remainingTime = remainingMs / 1000;
      if (remainingTime <= 0.1) {
        craftTimer.textContent = "Completing...";
      } else {
        craftTimer.textContent = `${remainingTime.toFixed(1)}s remaining`;
      }
    }
  } else if (action.type === "gathering") {
    const gatheringProgressFill = document.getElementById(
      "gathering-progress-fill"
    );
    if (gatheringProgressFill) {
      document.documentElement.style.setProperty(
        "--gathering-progress-width",
        `${Math.min(100, progressPercent)}%`
      );
    } else {
      console.warn("Gathering progress fill element not found");
    }
  } else {
    document.documentElement.style.setProperty(
      "--progress-fill-width",
      `${progressPercent}%`
    );
  }
}

function updateCombatProgress() {
  const combat = gameState.combat;
  if (!combat.inCombat) return;
  const denom = combat.playerInterval || 2000;
  const numer = Math.min(denom, combat.playerTimer || 0);
  const progressPercent = (numer / denom) * 100;
  document.documentElement.style.setProperty(
    "--combat-progress-width",
    `${progressPercent}%`
  );
}

function updateSkillInfo() {
  if (!currentSkill) {
    const skillName = document.getElementById("skill-name");
    const skillXpInfo = document.getElementById("skill-xp-info");
    const skillPageTitle = document.getElementById("skill-page-title");

    if (skillName) skillName.textContent = "";
    if (skillXpInfo) skillXpInfo.textContent = "";
    if (skillPageTitle) skillPageTitle.textContent = "";

    return;
  }

  const skillData = gameState.skills[currentSkill];
  if (!skillData) return;

  const currentLevelXp = getXPForLevel(skillData.level);
  const nextLevelXp = getXPForNextLevel(skillData.level);
  const progressXp = skillData.xp - currentLevelXp;
  const progressPercent = (progressXp / nextLevelXp) * 100;

  let displayName = currentSkill;
  switch (currentSkill) {
    case "animalcare":
      displayName = "Animal Care";
      break;
    case "firstaid":
      displayName = "First Aid";
      break;
    case "tinkering":
      displayName = "Tinkering";
      break;
    default:
      displayName =
        currentSkill.charAt(0).toUpperCase() + currentSkill.slice(1);
  }

  const skillName = document.getElementById("skill-name");
  const skillXpInfo = document.getElementById("skill-xp-info");
  const skillXpBar = document.getElementById("skill-xp-bar");

  if (skillName) {
    skillName.textContent = displayName;
  }
  if (skillXpInfo) {
    skillXpInfo.textContent = `Level ${skillData.level} (${progressXp}/${nextLevelXp} XP)`;
  }
  if (skillXpBar) {
    document.documentElement.style.setProperty(
      "--skill-xp-width",
      `${progressPercent}%`
    );
  }

  const skillPageTitle = document.getElementById("skill-page-title");
  if (skillPageTitle) {
    skillPageTitle.textContent = displayName;
    document.getElementById("skill-level-display").textContent =
      skillData.level;
    document.getElementById("skill-xp-display").textContent = `${
      skillData.xp
    }/${getXPForLevel(skillData.level + 1)}`;
    document.documentElement.style.setProperty(
      "--skill-xp-width",
      `${progressPercent}%`
    );
  }
}

function hideAllTooltips() {
  hideEquipmentTooltip();
  hideItemTooltip();
}

function showPage(pageId) {
  hideAllTooltips();

  document.querySelectorAll(".page-content").forEach((page) => {
    page.classList.remove("visible");
  });

  const page = document.getElementById(`${pageId}-page`);
  if (page) {
    page.classList.add("visible");

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
    bar.classList.remove("visible");
  });
}

function showAreaDetail(areaId) {
  const area = gameData.areas.find((a) => a.id === areaId);
  if (!area) return;

  gameState.currentArea = area;

  document.getElementById("area-detail-title").textContent = area.name;

  const contentHeader = document.querySelector(
    "#area-detail-page .content-header"
  );
  let existingButton = contentHeader.querySelector(".drops-toggle-button");

  if (!existingButton) {
    const toggleButton = document.createElement("button");
    toggleButton.className = "drops-toggle-button";
    toggleButton.textContent = "Drops %";
    toggleButton.style.cssText = `
            background: ${
              showDropPercentages ? "#2ecc71" : "rgba(255,255,255,0.06)"
            };
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
  } else {
    existingButton.style.background = showDropPercentages
      ? "#2ecc71"
      : "rgba(255,255,255,0.06)";
  }

  renderAreaContent(area);

  document.getElementById("areas-page").classList.remove("visible");
  document.getElementById("area-detail-page").classList.add("visible");
}

function renderAreas() {
  const grid = document.getElementById("areas-grid");
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
    const isStronghold = area.factions.some(
      (faction) => faction.toLowerCase() === "stronghold"
    );
    const zoneLabels = [];
    if (isOnlyZombies) {
      zoneLabels.push({ type: "zombie", label: "ZOMBIE INFESTED" });
    }
    if (hasZombies) {
      zoneLabels.push({ type: "infested", label: "INFESTED" });
    }

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

    grid.appendChild(card);
  });
}

function showLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  const areasPage = document.getElementById("areas-page");
  if (loadingScreen) loadingScreen.classList.add("show");
  if (areasPage) areasPage.classList.add("hidden");
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  const areasPage = document.getElementById("areas-page");
  if (loadingScreen) loadingScreen.classList.remove("show");
  if (areasPage) areasPage.classList.remove("hidden");
  showPage("areas");
}

function showCombatProgress() {
  const combatProgress = document.getElementById("combat-progress");
  if (combatProgress) combatProgress.classList.remove("hidden");
}

function hideCombatProgress() {
  const combatProgress = document.getElementById("combat-progress");
  if (combatProgress) combatProgress.classList.add("hidden");
}

function showEnemyDisplay() {
  const enemyDisplay = document.getElementById("enemy-display");
  if (enemyDisplay) enemyDisplay.classList.remove("hidden");
}

function hideEnemyDisplay() {
  const enemyDisplay = document.getElementById("enemy-display");
  if (enemyDisplay) enemyDisplay.classList.add("hidden");
}

function renderAreaContent(area) {
  renderGatheringResources(area);
  renderEnemies(area);
}
function getNodeDifficultyClass(playerLevel, requiredLevel) {
  const diff = playerLevel - requiredLevel;
  if (diff >= 10) return "level-trivial"; // much lower level than player
  if (diff >= 5) return "level-easy"; // comfortably below player
  if (diff >= -4) return "level-even"; // around the same level
  if (diff >= -9) return "level-hard"; // somewhat above player
  return "level-deadly"; // far above player
}

function renderGatheringResources(area) {
  const container = document.getElementById("gathering-resources");
  container.innerHTML = "";

  if (!area.gathering) {
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
                      <div>${(resource.time / 1000).toFixed(
                        1
                      )}s per action</div>
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
}

function selectResource(card, resource, skillType) {
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
}

function startGatheringAction(resourceId, skillType) {
  const area = gameState.currentArea;
  if (!area || !area.gathering[skillType]) return;

  const skill = gameData.skills.gathering_skills[skillType];
  if (!skill || !skill.nodes) return;

  const resource = skill.nodes.find((node) => node.id === resourceId);
  if (!resource) return;

  if (resource.consumes) {
    for (const consume of resource.consumes) {
      const available = gameState.bank[consume.item] || 0;
      if (available < consume.quantity) {
        const itemName = getItemName(consume.item);
        addGatheringLog(
          `Need ${consume.quantity} ${itemName} to perform this action`,
          "log-error"
        );
        showNotification(`Need ${consume.quantity} ${itemName}`);
        return;
      }
    }
  }

  gameState.currentAction = {
    type: "gathering",
    skill: skillType,
    resource: resource,
    xp: resource.xp,
    drops: resource.drops,
    consumes: resource.consumes,
    duration: resource.time,
    progress: 0,
  };
  resetGatheringProgress();
}

function resetGatheringProgress() {
  document.documentElement.style.setProperty(
    "--gathering-progress-width",
    "0%"
  );
}

function createGatheringProgressBox(resourceName) {
  removeGatheringProgressBox();

  const gatheringMain = document.querySelector(".gathering-main");
  if (!gatheringMain) return;

  const progressBox = document.createElement("div");
  progressBox.id = "dynamic-gathering-progress";
  progressBox.style.cssText = `
        margin-bottom: 15px;
        background: rgba(18, 18, 18, 0.85);
        border-radius: 8px;
        padding: 15px;
        border: 1px solid var(--border);
      `;

  progressBox.innerHTML = `
        <div style="margin-bottom: 8px; color: var(--text); font-weight: 600;">Gathering: ${resourceName}</div>
        <div class="progress-bar" id="gathering-progress">
          <div class="progress-fill" id="gathering-progress-fill"></div>
        </div>
      `;
  const gatheringGrid = document.getElementById("gathering-resources");
  gatheringMain.insertBefore(progressBox, gatheringGrid);
}

function removeGatheringProgressBox() {
  const existingBox = document.getElementById("dynamic-gathering-progress");
  if (existingBox) {
    existingBox.remove();
  }
}

function showGatheringProgress() {
  const gatheringProgress = document.getElementById("gathering-progress");
  if (gatheringProgress) {
    gatheringProgress.classList.add("visible");
  }
}

function hideGatheringProgress() {
  removeGatheringProgressBox();
}
function stopGathering(reason = "") {
  if (gameState.currentAction && gameState.currentAction.type === "gathering") {
    gameState.currentAction = null;
    currentSkill = null;
    try {
      document
        .querySelectorAll(".resource-card")
        .forEach((c) => c.classList.remove("active"));
      hideGatheringProgress();
    } catch (error) {
      console.warn("Error stopping gathering:", error);
    }
    addGatheringLog(reason || "Gathering stopped");
  }
}

function renderEnemies(area) {
  const enemyContainer = document.getElementById("enemy-list");
  const dungeonContainer = document.getElementById("dungeon-list");
  if (enemyContainer) enemyContainer.innerHTML = "";
  if (dungeonContainer) dungeonContainer.innerHTML = "";

  const whitelist =
    area.enemyWhitelist instanceof Set ? area.enemyWhitelist : null;
  const areaLevel = area.level || 1;
  function pickFromFaction(factionId, kind, applyWhitelist = false) {
    const f = gameData.enemies && gameData.enemies[factionId];
    if (!f) return null;
    const pool = kind === "boss" ? f.bosses || [] : f.regular || [];
    let candidates = pool;
    if (applyWhitelist && whitelist)
      candidates = pool.filter((e) => whitelist.has(nf(e.name)));
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function makeScaled(factionId, enemyData, level, kind) {
    if (!enemyData) return null;
    return scaleEnemyForLevel(factionId, enemyData, level, kind);
  }
  function findRegularEnemyByName(name) {
    const target = nf(name);
    const all = gameData.enemies || {};
    for (const [fid, faction] of Object.entries(all)) {
      const pool = (faction && faction.regular) || [];
      for (const e of pool) {
        if (nf(e.name) === target) return { factionId: fid, enemy: e };
      }
    }
    return null;
  }
  function buildNormalEnemies() {
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
  }

  function renderNormalEnemyList(list) {
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
  }

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
}

function selectEnemy(item, enemy) {
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

    hideCombatProgress();
    hideEnemyDisplay();
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
}

function startCombat(enemy) {
  gameState.combat.inCombat = true;
  gameState.combat.currentEnemy = enemy;
  gameState.combat.enemyHp = enemy.hp;
  gameState.combat.enemyMaxHp = enemy.hp;
  gameState.combat.playerTimer = 0;
  gameState.combat.enemyTimer = 0;
  gameState.combat.playerInterval = getAttackIntervalMs(gameState.player);
  const enemyStats = {
    baseSpeedMs: enemy.baseSpeedMs ?? 3000,
    attackSpeed: enemy.attackSpeed ?? 0,
  };
  gameState.combat.enemyInterval = getAttackIntervalMs(enemyStats);
  const enemyNameEl = document.getElementById("current-enemy-name");
  const enemyDisplayEl = document.getElementById("enemy-display");

  if (enemyNameEl) {
    enemyNameEl.textContent = enemy.name;
  }

  if (enemyDisplayEl) {
    enemyDisplayEl.style.display = "block";
  }

  const noEnemy = document.getElementById("no-enemy");
  if (noEnemy) noEnemy.classList.remove("visible");

  const lvlEl = document.getElementById("enemy-level-display");
  const atkEl = document.getElementById("enemy-attack-display");
  const defEl = document.getElementById("enemy-defense-display");
  if (lvlEl) lvlEl.textContent = String(enemy.level ?? enemy.baseLevel ?? "-");
  if (atkEl) atkEl.textContent = String(enemy.attack ?? "-");
  if (defEl) defEl.textContent = String(enemy.defense ?? "-");

  const cpf0 = document.getElementById("combat-progress-fill");
  if (cpf0) cpf0.style.width = "0%";

  const enemyHpBar = document.getElementById("enemy-hp-bar");
  const enemyHpText = document.getElementById("enemy-hp-text");
  if (enemyHpBar) enemyHpBar.style.width = "100%";
  if (enemyHpText) enemyHpText.textContent = `${enemy.hp}/${enemy.hp}`;

  const combatSource = enemy.dungeonId ? "dungeon" : "normal";
  addCombatLog(`Combat started with ${enemy.name}! (${combatSource})`);
  showNotification(`Started fighting ${enemy.name}`);
}

function startDungeonRun(dungeonId) {
  stopGathering("Switched to dungeon");
  if (
    gameState.combat.inDungeon &&
    gameState.combat.currentDungeon === dungeonId
  ) {
    showNotification("Already running this dungeon");
    return;
  }
  if (
    gameState.combat.inDungeon &&
    gameState.combat.currentDungeon !== dungeonId
  ) {
    if (!confirm("You are already in a dungeon. Start a new one?")) {
      return;
    }
  }

  const area = gameState.currentArea;
  const dungeon =
    area && Array.isArray(area.dungeons)
      ? area.dungeons.find((d) => d.id === dungeonId)
      : null;
  if (!dungeon) {
    showNotification("Dungeon not found", "error");
    return;
  }
  const type =
    dungeon.type ||
    (area && area.areaType === "stronghold" && /raid/i.test(dungeon.name)
      ? "raid"
      : "dungeon");
  const areaLevel = (area && area.level) || 1;
  let primary, secondary;
  if (dungeon.primaryFaction) {
    primary = dungeon.primaryFaction;
    secondary = Array.isArray(dungeon.secondaryFactions)
      ? dungeon.secondaryFactions
      : [];
  } else if (Array.isArray(dungeon.enemies)) {
    const areaFactions = (area.factions || []).map(
      (name) => NAME_TO_FACTION_ID[name] || name.toLowerCase()
    );
    primary = areaFactions[0] || "zombies";
    secondary = areaFactions.slice(1);
    console.log("Using area factions for dungeon:", primary, secondary);
  } else {
    showNotification("Dungeon configuration error", "error");
    console.error("Dungeon has no faction data:", dungeon);
    return;
  }
  function pickFromFactionForRun(factionId, kind) {
    const faction = gameData.enemies && gameData.enemies[factionId];
    if (!faction) {
      console.warn(`Faction ${factionId} not found for dungeon`);
      return null;
    }
    const pool = kind === "boss" ? faction.bosses || [] : faction.regular || [];
    if (!pool || pool.length === 0) {
      console.warn(`No ${kind} enemies found in faction ${factionId}`);
      return null;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }
  const encounters = [];
  if (type === "raid") {
    const levels = [
      areaLevel + 6,
      areaLevel + 8,
      areaLevel + 10,
      areaLevel + 12,
      areaLevel + 14,
      areaLevel + 16,
      areaLevel + 18,
      areaLevel + 20,
      areaLevel + 22,
    ];
    const slots = [
      "reg",
      "reg",
      "boss",
      "reg",
      "reg",
      "boss",
      "reg",
      "reg",
      "boss",
    ];
    slots.forEach((slot, idx) => {
      const kind = slot === "boss" ? "boss" : "regular";
      const usePrimary = Math.random() < 0.75 || secondary.length === 0;
      const fid = usePrimary
        ? primary
        : secondary[Math.floor(Math.random() * secondary.length)];
      const e = pickFromFactionForRun(fid, kind);
      if (!e) {
        console.warn(
          `Failed to generate ${kind} enemy for faction ${fid} in raid slot ${idx}`
        );
        return;
      }
      const scaled = scaleEnemyForLevel(fid, e, levels[idx], kind);
      if (scaled) {
        scaled.dungeonId = dungeon.id;
        scaled.kind = kind;
        encounters.push(scaled);
      } else {
        console.warn(`Failed to scale ${kind} enemy for level ${levels[idx]}`);
      }
    });
  } else {
    const regLevels = [
      areaLevel + 2,
      areaLevel + 3,
      areaLevel + 4,
      areaLevel + 5,
      areaLevel + 6,
    ];
    regLevels.forEach((L) => {
      const usePrimary = Math.random() < 0.75 || secondary.length === 0;
      const fid = usePrimary
        ? primary
        : secondary[Math.floor(Math.random() * secondary.length)];
      const e = pickFromFactionForRun(fid, "regular");
      if (!e) {
        console.warn(
          `Failed to generate regular enemy for faction ${fid} at level ${L}`
        );
        return;
      }
      const scaled = scaleEnemyForLevel(fid, e, L, "regular");
      if (scaled) {
        scaled.dungeonId = dungeon.id;
        scaled.kind = "regular";
        encounters.push(scaled);
      } else {
        console.warn(`Failed to scale regular enemy for level ${L}`);
      }
    });
    const bossLevel = areaLevel + 8;
    const bossUsePrimary = Math.random() < 0.75 || secondary.length === 0;
    const bossFid = bossUsePrimary
      ? primary
      : secondary[Math.floor(Math.random() * secondary.length)];
    const bossData = pickFromFactionForRun(bossFid, "boss");
    if (!bossData) {
      console.warn(`Failed to generate boss enemy for faction ${bossFid}`);
    } else {
      const boss = scaleEnemyForLevel(bossFid, bossData, bossLevel, "boss");
      if (boss) {
        boss.dungeonId = dungeon.id;
        boss.kind = "boss";
        encounters.push(boss);
      } else {
        console.warn(`Failed to scale boss enemy for level ${bossLevel}`);
      }
    }
  }

  if (!gameState.combat.dungeonEnemies) gameState.combat.dungeonEnemies = {};
  gameState.combat.dungeonEnemies[dungeonId] = encounters;
  if (!encounters || encounters.length === 0) {
    showNotification(
      "No encounters could be generated - missing enemy data",
      "error"
    );
    console.error(
      "No encounters generated for dungeon:",
      dungeonId,
      "primary faction:",
      primary,
      "secondary factions:",
      secondary
    );
    return;
  }

  console.log(
    "Generated",
    encounters.length,
    "encounters for dungeon:",
    dungeonId
  );
  gameState.combat.inCombat = false;
  gameState.combat.currentEnemy = null;

  gameState.combat.inDungeon = true;
  gameState.combat.currentDungeon = dungeonId;
  gameState.combat.dungeonProgress = 0;

  const statusEl = document.getElementById("combat-status");
  if (statusEl) {
    statusEl.textContent = `Dungeon run started: ${dungeon.name}`;
  }
  renderEnemies(gameState.currentArea);

  startCombat(encounters[0]);
}

function renderBank() {
  if (
    gameState.bankHeldItem &&
    (!gameState.bank[gameState.bankHeldItem] ||
      gameState.bank[gameState.bankHeldItem] <= 0)
  ) {
    gameState.bankHeldItem = null;
    hideHeldGhost();
  }

  const grid = document.getElementById("bank-grid");
  grid.innerHTML = "";

  const allItemIds = Object.keys(gameState.bank).filter(
    (id) => gameState.bank[id] > 0
  );

  const maxSlots = BANK_CAPACITY_SLOTS;
  const placed = new Array(maxSlots).fill(null);
  allItemIds.forEach((id) => {
    const p = gameState.bankPlacement[id] || { slot: 0 };
    let s = Math.max(0, Math.min(maxSlots - 1, p.slot || 0));
    if (!placed[s]) {
      placed[s] = id;
    }
  });
  allItemIds.forEach((id) => {
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
    slot.dataset.slot = i;
    slot.ondragover = handleBankSlotDragOver;
    slot.ondrop = (e) => handleBankSlotDrop(e, i);

    const itemId = placed[i];
    if (itemId) {
      const item = gameData.items[itemId];
      const quantity = gameState.bank[itemId];
      if (item && quantity > 0) {
        slot.classList.add("has-item");
        let tooltipText = `${getItemName(itemId)} x${quantity}`;

        if (
          (item.type === "food" || item.type === "cooked_food") &&
          item.healAmount
        ) {
          slot.classList.add("food-item");
          if (item.type === "cooked_food") {
            slot.classList.add("cooked-food");
          }
          slot.onclick = (evt) => {
            evt.stopPropagation();
            useFood(itemId);
          };
        } else if (item.usable) {
          const canOpen =
            item.openable &&
            Array.isArray(item.openable.drops) &&
            item.openable.drops.length > 0;
          if (canOpen || itemId === "birds_nest") {
            slot.style.cursor = "pointer";
            slot.classList.add("usable-item");
            slot.onclick = (evt) => {
              evt.stopPropagation();
              if (canOpen) useOpenable(itemId);
              else if (itemId === "birds_nest") useBirdNest();
            };
          }
        } else if (
          [
            "weapon",
            "helmet",
            "armor",
            "gloves",
            "boots",
            "offhand",
            "accessory",
          ].includes(item.type)
        ) {
          if (canEquipItem(itemId)) {
            slot.onclick = (evt) => {
              evt.stopPropagation();
              evt.preventDefault();
              hideItemTooltip();
              hideEquipmentTooltip();
              slot.removeAttribute("title");
              equipItem(itemId);
              renderBank();
            };
          } else {
            tooltipText += ` - Requires level ${item.level || 1}`;
            slot.title = tooltipText;
          }
        }

        slot.innerHTML = `
          <div style="font-size: 20px;">${item.icon || "??"}</div>
          <div class="item-name" style="font-size: 10px; color: #f8f9fa; text-align: center; margin-top: 2px; word-wrap: break-word; line-height: 1.1;">${getItemName(itemId)}</div>
          <div class="item-quantity" style="font-size: 8px; color: #bbb; text-align: center;">x${quantity}</div>
        `;
        slot.title = tooltipText;
      }
    }

    grid.appendChild(slot);
  }
}

// Expose functions globally
if (typeof window !== "undefined") {
  window.updateUI = updateUI;
  window.renderBank = renderBank;
}
