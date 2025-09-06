// homebase_all_override.js
// Same as homebase_all.js but assigns functions to window.<name> to override existing ones safely.
 Home Base related functions (by name/body match) ----
window.critPctToRating = function (pct) {
window.p = Math.max(0, Math.min(0.95, pct || 0));
      return Math.round((p / (1 - p)) * 200);
    }
window.scaleEnemyForLevel = function (factionId, baseEnemy, level, kind) {
window.f = (gameData && gameData.enemies && gameData.enemies[factionId]) || null;
      if (!f) return null;
window.L = Math.max(1, level | 0);
window.effLevel = L - 1; const e = f.scaling;
window.b = f.base[kind];
window.hp = Math.max(1, Math.floor(b.hp * Math.pow(1 + effLevel, e.hp)));
window.atk = Math.max(1, Math.floor(b.atk * Math.pow(1 + effLevel, e.atk)));
window.def = Math.max(0, Math.floor(b.def * Math.pow(1 + effLevel, e.def)));
window.acc = Math.max(1, Math.floor(b.acc * Math.pow(1 + effLevel, e.acc)));
window.critRating = critPctToRating((b.critPct || 0) * Math.pow(1 + effLevel, e.crit));
window.armPen = Math.round((b.armPenPct || 0) * Math.pow(1 + effLevel, e.armPen) * 100) / 1; const aspdScalar = (b.aspd || 1) * Math.pow(1 + effLevel, e.aspd);
window.attackSpeedPct = Math.round((aspdScalar - 1) * 100);
window.isBoss = kind === 'boss';
window.drops = [
        { item: "scrap", min: isBoss ? 6 : 2, max: isBoss ? 12 : 5, rarity: "common" }
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
        drops
      };
    }
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
      equipment: { helmet: null, armor: null, gloves: null, boots: null, weapon: null, offhand: null, accessory1: null, accessory2: null },
      upgrades: { mining: { purchased: {} }, forestry: { purchased: {} }, hunting: { purchased: {} }, foraging: { purchased: {} }, fishing: { purchased: {} }, tailoring: { purchased: {} }, firstaid: { purchased: {} }, forging: { purchased: {} }, gunsmithing: { purchased: {} }, scavenging: { purchased: {} }, carpentry: { purchased: {} }, tinkering: { purchased: {} }, cooking: { purchased: {} }, masonry: { purchased: {} }, chemistry: { purchased: {} }, electrical: { purchased: {} } },
      workshops: { tailoring: {}, firstaid: {}, forging: {}, gunsmithing: {}, carpentry: {}, tinkering: {}, cooking: {}, masonry: {}, chemistry: {}, electrical: {} },
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


      bank: {

      },
      bankPlacement: {
      },
      bankHeldItem: null,
      bankRenderScheduled: false,


      farming: {
        plots: [],
        unlockedPlots: []
      },

      animalCare: {
        structures: [],
        unlockedStructures: [],
        animals: []
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


    


    async function loadGameData() {
      try {
        showLoadingScreen();
        console.log("Loading embedded game data...");

        gameData.areas = AREAS_DATA.areas;
        gameData.skills = SKILLS_DATA;
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
        console.log(
          "Available items:",
          Object.keys(gameData.items || {}).length
        );
      } catch (error) {
        console.error("Failed to load game data:", error);
        showNotification(
          "Failed to load game data! Check console for details."
        );
      }
window.injectFactionCSS = function () {
window.styleId = 'dynamic-faction-styles';
window.existingStyle = document.getElementById(styleId);

      if (existingStyle) {
        existingStyle.remove();
      }
window.style = document.createElement('style');
      style.id = styleId;
      style.textContent = generateFactionCSS();
      document.head.appendChild(style);
    }
    
    Object.values(FACTION_CONFIG).forEach(faction => {
      NAME_TO_FACTION_ID[faction.name] = faction.id;
    }
window.nf = function (s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim(); }
window.applyDungeonRevamp = function () {
      if (!Array.isArray(gameData.areas)) return;
window.byId = Object.create(null);
      gameData.areas.forEach(a => { if (a && a.id) byId[a.id] = a; });
      Object.entries(AREA_REVAMP_CONFIG).forEach(([areaId, cfg]) => {
window.area = byId[areaId];
        if (!area) return;
        area.areaType = cfg.areaType;
window.areaFactions = (area.factions || []).map(name => NAME_TO_FACTION_ID[name] || name);
        area.dungeons = (cfg.dungeons || []).map(d => {
window.primary = d.primary;
window.secondary = areaFactions.filter(f => f !== primary);
          return { id: d.id, name: d.name, level: area.level, type: d.type, primaryFaction: primary, secondaryFactions: secondary };
        });
        area.enemyWhitelist = new Set((cfg.enemies || []).map(nf));
      });
    }
window.getHitChance = function (attacker, defender) {
window.acc = Math.max(0, attacker.accuracy ?? 50);
window.eva = Math.max(0, defender.evasion ?? 25);
      if (acc === 0 && eva === 0) return 0.5;
      return acc / (acc + eva);
    }
window.getCritChance = function (attacker) {
window.rating = Math.max(0, attacker.critical ?? 0);
      return Math.min(0.75, rating / (rating + 200));
    }
window.getEffectiveCritChance = function (attacker, defender) {
window.base = getCritChance(attacker);
window.resist = Math.max(0, Math.min(1, (defender.critResistance ?? 0) / 100));
      return Math.max(0, base - resist);
    }
window.getEffectiveDefense = function (defender, attacker) {
window.base = Math.max(0, defender.defense ?? 0);
window.penPctRaw = Math.max(0, Math.min(90, attacker.armorPen ?? 0));
window.penResist = Math.max(0, Math.min(90, defender.armorPenResistance ?? 0));
window.penPct = Math.max(0, penPctRaw - penResist);
      return base * (1 - penPct / 100);
    }
window.getDamageReduction = function (defenseValue) {
window.dr = defenseValue / (defenseValue + 100);
      return Math.min(0.95, Math.max(0, dr));
    }
window.computeDamage = function (attacker, defender) {
window.hitRollGuaranteed = false;
      if (attacker.alwaysHitIfAccHigher && (attacker.accuracy ?? 0) > (defender.evasion ?? 0)) {
        hitRollGuaranteed = true;
      }
      if (!hitRollGuaranteed && Math.random() >= getHitChance(attacker, defender)) return { damage: 0, crit: false, hit: false, blocked: false };
window.atk = Math.max(1, attacker.attack ?? 1);
window.effDef = getEffectiveDefense(defender, attacker);
window.dr = getDamageReduction(effDef);
window.drBonus = Math.max(0, (defender.damageReductionBonusPct || 0) / 100);
      dr = Math.min(0.95, dr + drBonus);
window.dmg = Math.max(1, Math.floor(atk * (1 - dr)));
window.isCrit = Math.random() < getEffectiveCritChance(attacker, defender);
      if (isCrit) {
window.mult = attacker.critMultiplier ?? 1.5;
        dmg = Math.max(1, Math.floor(dmg * mult));
      }
window.blocked = false;
window.reflectDamage = 0;
window.blockChance = Math.max(0, Math.min(1, (defender.blockChancePct || 0) / 100));
      if (Math.random() < blockChance) {
        blocked = true;
window.reflectChance = Math.max(0, Math.min(1, (defender.reflectOnBlockChancePct || 0) / 100));
        if (reflectChance > 0 && Math.random() < reflectChance) {
window.reflectPct = Math.max(0, Math.min(1, (defender.reflectOnBlockPct || 0) / 100));
          reflectDamage = Math.max(0, Math.floor(dmg * reflectPct));
        }
        dmg = 0;
      }
      return { damage: dmg, crit: isCrit, hit: true, blocked, reflectDamage };
    }
window.getAttackIntervalMs = function (attacker) {
window.base = Math.max(500, Math.min(5000, attacker.baseSpeedMs ?? 3000));
window.spd = Math.max(0, attacker.attackSpeed ?? 0);
window.interval = base / (1 + spd / 100);
      return Math.max(500, Math.min(5000, Math.floor(interval)));
    }
window.lastRenderedEquipment = {};
window.renderEquipmentSlots = function () {
      Object.keys(gameState.equipment).forEach((slot) => {
window.slotElement = document.getElementById(`${slot}-slot`);
window.equipmentSlot = document.querySelector(`[data-slot="${slot}"]`);

        if (!slotElement || !equipmentSlot) {
          console.warn(`Equipment slot element not found: ${slot}`);
          return;
        }
window.equippedItem = gameState.equipment[slot];

        if (equippedItem && gameData.items[equippedItem]) {
window.item = gameData.items[equippedItem];
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
window.getSlotName = function (slot) {
window.slotNames = {
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
window.showEquipmentTooltip = function (event, slot) {
window.equippedItem = gameState.equipment[slot];
      if (!equippedItem || !gameData.items[equippedItem]) return;

      hideEquipmentTooltip(); // Clean up any existing tooltip
window.item = gameData.items[equippedItem];
window.tooltip = createEquipmentTooltip(item);

      if (!tooltip) return;

      document.body.appendChild(tooltip);
window.rect = event.target.getBoundingClientRect();
window.tooltipRect = tooltip.getBoundingClientRect();
window.windowWidth = window.innerWidth;
window.windowHeight = window.innerHeight;
window.wouldOverflowRight = rect.right + 10 + tooltipRect.width > windowWidth;
      if (wouldOverflowRight) {
        tooltip.style.left = rect.left - tooltipRect.width - 10 + "px";
      } else {
        tooltip.style.left = rect.right + 10 + "px";
      }
window.topPosition = rect.top + window.scrollY;
window.wouldOverflowBottom = rect.top + tooltipRect.height > windowHeight;

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
window.showItemTooltip = function (event, itemId) {
      hideItemTooltip();
window.item = gameData.items[itemId];
      if (!item) {
        console.warn(`Item not found: ${itemId}`);
        return;
      }
window.tooltip = createItemTooltip(item);
      if (!tooltip) return;

      document.body.appendChild(tooltip);
window.rect = event.target.getBoundingClientRect();
window.tooltipRect = tooltip.getBoundingClientRect();
window.windowWidth = window.innerWidth;
window.windowHeight = window.innerHeight;
window.showOnLeft = rect.right + 10 + tooltipRect.width > windowWidth;
      if (showOnLeft) {
        tooltip.style.left = `${rect.left - tooltipRect.width - 10}px`;
      } else {
        tooltip.style.left = `${rect.right + 10}px`;
      }
window.topPosition = rect.top + window.scrollY;
window.wouldOverflowBottom = rect.top + tooltipRect.height > windowHeight;

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
window.hideItemTooltip = function () {
      if (itemTooltip) {
        itemTooltip.remove();
        itemTooltip = null;
      }
    }
window.createItemTooltip = function (item) {
      if (!item) {
        console.warn('createItemTooltip called with null item');
        return null;
      }
window.tooltip = document.createElement("div");
      tooltip.className = "equipment-tooltip";
window.content = `<h4>${item.name}</h4>`;
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
window.getBandageIds = function () {
window.ids = Object.keys(gameData.items || {}).filter(id => /_bandage$/.test(id));
      return ids;
    }
window.getBandageHealAmount = function (itemId) {
window.map = {
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
window.useBandage = function (itemId) {
      if (!itemId) return false;
      if (!gameState.bank[itemId] || gameState.bank[itemId] <= 0) return false;
window.heal = getBandageHealAmount(itemId);
      if (heal <= 0) return false;
      if (gameState.player.hp >= gameState.player.maxHp) {
        showNotification('You are already at full health!', "info");
        return false;
      }
      removeFromBank(itemId, 1);
window.before = gameState.player.hp;
      gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + heal);
window.itemName = getItemName(itemId) || 'Bandage';
      showNotification(`Healed ${gameState.player.hp - before} HP with ${itemName}`, "success");
      addCombatLog(`Used ${itemName} (+${gameState.player.hp - before} HP)`, 'log-heal');
      return true;
    }
window.populateBandageDropdown = function () {
window.sel = document.getElementById('select-bandage');
      if (!sel) return;
window.bandageIds = getBandageIds().filter(id => (gameState.bank[id] || 0) > 0);
      sel.innerHTML = '';
window.any = document.createElement('option'); any.value = ''; any.textContent = bandageIds.length ? 'Auto (best available)' : 'No bandages';
      sel.appendChild(any);
      bandageIds.sort((a, b) => getBandageHealAmount(b) - getBandageHealAmount(a));
      for (const id of bandageIds) {
window.opt = document.createElement('option');
window.it = gameData.items[id];
window.qty = gameState.bank[id] || 0;
window.heal = getBandageHealAmount(id);
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
window.populateFoodDropdown = function () {
window.sel = document.getElementById('select-food');
      if (!sel) return;
window.foods = Object.entries(gameData.items || {}).filter(([id, it]) => (it.type === 'food' || it.type === 'cooked_food') && it.healAmount && (gameState.bank[id] || 0) > 0);
      sel.innerHTML = '';
window.any = document.createElement('option'); any.value = ''; any.textContent = foods.length ? 'Auto (best available)' : 'No food';
      sel.appendChild(any);
      foods.sort((a, b) => (b[1].healAmount || 0) - (a[1].healAmount || 0));
      for (const [id, it] of foods) {
window.qty = gameState.bank[id] || 0;
window.opt = document.createElement('option');
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
window.getOrCreateHeldGhost = function () {
window.ghost = document.getElementById("bank-held-ghost");
      if (!ghost) {
        ghost = document.createElement("div");
        ghost.id = "bank-held-ghost";
        ghost.style.cssText = "position:absolute; pointer-events:none; z-index:9999; display:none; background:#111111; border:1px solid rgba(255,255,255,0.1); border-radius:4px; padding:4px 6px; color:#f8f9fa; font-size:12px; box-shadow:0 2px 6px rgba(0,0,0,0.3);";
        document.body.appendChild(ghost);
      }
      return ghost;
    }
window.showHeldGhost = function (itemId) {
window.ghost = getOrCreateHeldGhost();
window.item = gameData.items[itemId];
window.icon = item?.icon || "??";
window.qty = gameState.bank[itemId] || 0;
      ghost.innerHTML = `<span style="font-size:16px; margin-right:6px;">${icon}</span><span>${item?.name || itemId} (${qty})</span>`;
      ghost.style.display = "block";
    }
window.getRarityColor = function (rarity) {
      switch (rarity) {
        case 'guaranteed': return '#fff';
        case 'epic': return '#a855f7';
        case 'rare': return '#3b82f6';
        case 'common': return '#10b981';
        default: return '#238636';
      }
    }
window.getItemName = function (itemId) {
      if (!itemId) return '';
window.map = (typeof gameData !== 'undefined' && gameData.items) ? gameData.items : null;
window.named = map && map[itemId] && map[itemId].name;
      if (named) return named;
      return String(itemId)
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .trim()
        .replace(/\b\w/g, c => c.toUpperCase());
    }
window.useSelectedBandageOrBest = function (quiet = false) {
window.sel = document.getElementById('select-bandage');
window.chosen = (gameState.combat.selectedBandageId) || (sel && sel.value ? sel.value : null);
      if (chosen && (gameState.bank[chosen] || 0) > 0) {
        if (gameState.player.hp >= gameState.player.maxHp) { if (!quiet) showNotification('HP is already full'); return false; }
window.ok = useBandage(chosen);
        populateBandageDropdown();
        return ok;
      }
window.addCombatLog = function (message, className = "") {
window.log = document.getElementById("activity-log-content");
window.entry = document.createElement("div");
      entry.className = `log-entry ${className}`;
      entry.textContent = message;
      log.appendChild(entry);
      log.scrollTop = log.scrollHeight;

      while (log.children.length > 50) {
        log.removeChild(log.firstChild);
      }
    }
window.addXP = function (skill, amount) {
window.skillData = gameState.skills[skill];
      if (!skillData) return;

      skillData.xp += amount;
window.newLevel = calculateLevel(skillData.xp);
      if (newLevel > skillData.level) {
        skillData.level = newLevel;
        showNotification(
          `${skill.charAt(0).toUpperCase() + skill.slice(1)
          } level up! Now level ${newLevel}`
        );

        if (
          ["fitness", "defense", "melee", "firearms", "explosives"].includes(
            skill
          )
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
window.calculateLevel = function (xp) {
window.totalXpNeeded = 0;
window.level = 1;

      while (totalXpNeeded <= xp) {
        level++;
        totalXpNeeded += level * 100;
      }

      return level - 1;
    }
window.getXPForLevel = function (level) {
window.totalXp = 0;
      for (let i = 2; i <= level; i++) {
        totalXp += i * 100;
      }
      return totalXp;
    }
window.getXPForNextLevel = function (currentLevel) {
      return (currentLevel + 1) * 100;
    }
window.updateCombatLevel = function () {
window.combatSkills = [
        "fitness",
        "defense",
        "melee",
        "firearms",
        "explosives",
      ];
window.totalLevels = 0;

      combatSkills.forEach((skill) => {
        totalLevels += gameState.skills[skill].level;
      });

      gameState.player.combatLevel = Math.floor(
        totalLevels / combatSkills.length
      );
    }
window.updateAnimalCareProgress = function () {
window.currentTime = Date.now();

      gameState.animalCare.unlockedStructures.forEach(structure => {
        if (structure.placedAnimal) {
          if (structure.lastByproduct && currentTime - structure.lastByproduct >= 60000) {
window.a = structure.placedAnimal;
window.count = a.count || 1;
window.byproductPoolByAnimal = {
              cow: ['manure', 'leather'],
              dairy_cow: ['manure', 'leather'],
              pig: ['manure', 'leather'],
              sheep: ['manure', 'wool', 'hide'],
              goat: ['manure', 'hide'],
              llama: ['manure', 'fiber', 'hide'],
              alpaca: ['manure', 'fiber', 'hide'],
              chicken: ['manure', 'feathers'],
              rooster: ['manure', 'feathers'],
              duck: ['manure', 'feathers'],
              goose: ['manure', 'feathers'],
              turkey: ['manure', 'feathers'],
              guinea_fowl: ['manure', 'feathers'],
              quail: ['manure', 'feathers'],
              pigeon: ['manure', 'feathers'],
              dove: ['manure', 'feathers'],
              peacock: ['manure', 'feathers'],
              rabbit: ['manure', 'pelt'],
              guinea_pig: ['manure', 'fur'],
              ferret: ['manure', 'fur'],
              chinchilla: ['manure', 'fur', 'pelt'],
              bees: ['beeswax'],
              silkworm: ['silk_thread'],
              mealworm: ['mealworms']
            };
window.pool = byproductPoolByAnimal[a.id] || ['manure'];
window.randomByproduct = pool[Math.floor(Math.random() * pool.length)];
window.baseQty = Math.floor(Math.random() * 3) + 1;
window.quantity = baseQty * count;

            addToBank(randomByproduct, quantity);
            addToMessageLog(`${a.icon} ${a.name} (x${count}) produced ${quantity}x ${getItemName(randomByproduct)}`, "info");

            structure.lastByproduct = currentTime;
          }

          if (structure.lastHarvest && currentTime - structure.lastHarvest >= 240000) {
            harvestAnimal(structure);
          }
        }
      }
window.harvestAnimal = function (structure) {
      if (structure.placedAnimal && structure.placedAnimal.produces) {
window.a = structure.placedAnimal;
window.count = a.count || 1;
        a.produces.forEach(productId => {
window.baseQty = Math.floor(Math.random() * 3) + 2;
window.quantity = baseQty * count;
          addToBank(productId, quantity);
          addToMessageLog(`Harvested ${quantity}x ${getItemName(productId)} from ${a.name} (x${count}) in ${structure.name}`, "success");
        }
window.getNextPenUnlockLevel = function (playerLevel) {
window.nextStructure = ANIMAL_CARE_DATA.structures.find(structure => structure.level > playerLevel);
      return nextStructure ? nextStructure.level : null;
    }
window.setupBankTabs = function () {
window.tabsEl = document.getElementById("bank-tabs");
      if (!tabsEl) return;
      tabsEl.innerHTML = "";
      gameState.bankTabs.forEach(tab => {
        if (tab.id !== "all") {
window.used = getTabUsedSlots(tab.id);
          if (used === 0 && gameState.activeBankTab !== tab.id) return;
        }
window.el = document.createElement("div");
        el.className = "bank-tab" + (gameState.activeBankTab === tab.id ? " active" : "");
window.icon = computeTabIcon(tab.id);
        el.textContent = tab.id === "all" ? `All ${icon ? icon : ""}` : `${icon}`; el.title = tab.id === "all" ? `All (${getTabUsedSlots('all')}/${BANK_CAPACITY_SLOTS})` : `Tab ${tab.id} (${getTabUsedSlots(tab.id)})`;
        el.dataset.tabId = tab.id;
        el.onclick = () => {
          gameState.activeBankTab = tab.id;
          renderBank();
        };
        el.ondragover = (e) => { e.preventDefault(); el.classList.add("drag-over"); };
        el.ondragleave = () => el.classList.remove("drag-over");
        el.ondrop = (e) => {
          e.preventDefault();
          el.classList.remove("drag-over");
window.itemId = e.dataTransfer.getData("text/plain") || gameState.bankHeldItem;
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
window.plus = document.createElement("div");
      plus.className = "bank-tab";
      plus.textContent = "+";
      plus.title = "New Tab";
      plus.dataset.plus = "true";
      plus.onclick = () => {
window.newId = createBankTab();
        gameState.activeBankTab = newId;
        renderBank();
      }
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
    }
window.showAreaDetail = function (areaId) {
window.area = gameData.areas.find((a) => a.id === areaId);
      if (!area) return;

      gameState.currentArea = area;

      document.getElementById("area-detail-title").textContent = area.name;
window.contentHeader = document.querySelector("#area-detail-page .content-header");
window.existingButton = contentHeader.querySelector(".drops-toggle-button");

      if (!existingButton) {
window.toggleButton = document.createElement("button");
        toggleButton.className = "drops-toggle-button";
        toggleButton.textContent = "Drops %";
        toggleButton.style.cssText = `
            background: ${showDropPercentages ? '#2ecc71' : 'rgba(255,255,255,0.06)'};
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
          toggleButton.style.background = showDropPercentages ? '#2ecc71' : 'rgba(255,255,255,0.06)';
          renderAreaContent(area);
        });

        contentHeader.appendChild(toggleButton);
      }
window.renderAreas = function () {
window.grid = document.getElementById("areas-grid");
      grid.innerHTML = "";

      if (!gameData.areas) {
        grid.innerHTML =
          '<div style="color: #8b949e; text-align: center; padding: 20px;">No areas available.</div>';
        return;
      }

      gameData.areas.forEach((area) => {
window.isUnlocked = gameState.player.combatLevel >= area.level;
window.card = document.createElement("div");
        card.className = `area-card ${isUnlocked ? "" : "locked"}`;
        card.dataset.areaId = area.id;
window.hasZombies = area.factions.some(faction => faction.toLowerCase() === "zombies");
window.isOnlyZombies = area.factions.length === 1 && hasZombies;
window.isStronghold = area.description.startsWith("Stronghold") || area.description.startsWith("Infested Stronghold");
window.zoneLabels = [];

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
window.zoneLabelsHtml = zoneLabels.map((zone, index) =>
          `<div class="zone-label ${zone.type}" style="top: ${10 + (index * 30)}px;">${zone.label}</div>`
        ).join("");
window.factionSpans = area.factions.map(faction => {
window.factionClass = `faction-${faction.toLowerCase().replace(/\s+/g, '_')}`;
          return `<span class="${factionClass}">${faction}</span>`;
        }).join(", ");

        card.innerHTML = `
                  ${zoneLabelsHtml}
                  <div class="area-name">${area.name}</div>
                  <div class="area-level">Level ${area.level} Required</div>
                  <div class="area-factions">Factions: ${factionSpans}</div>
              `;

        grid.appendChild(card);
      }
window.renderGatheringResources = function (area) {
window.container = document.getElementById("gathering-resources");
      container.innerHTML = "";

      if (!area.gathering) {
window.noResourcesDiv = document.createElement("div");
        noResourcesDiv.style.cssText = "color: #8b949e; text-align: center; padding: 20px;";
        noResourcesDiv.textContent = "No gathering resources available in this area.";
        container.appendChild(noResourcesDiv);
        return;
      }

      Object.keys(area.gathering).forEach((skillType) => {
window.resourceIds = area.gathering[skillType];
        if (!resourceIds || !Array.isArray(resourceIds)) return;

        resourceIds.forEach((resourceId) => {
window.skill = gameData.skills.gathering_skills[skillType];
          if (!skill || !skill.nodes) {
            console.warn(`Skill not found or missing nodes: ${skillType}`);
            return;
          }
window.resource = skill.nodes.find(node => node.id === resourceId);
          if (!resource) {
            console.warn(`Resource not found: ${resourceId} in skill ${skillType}`);
            return;
          }
window.requiredLevel = resource.level;
window.playerSkill = gameState.skills[skillType];
          if (!playerSkill) {
            console.warn(`Player skill not found: ${skillType}`);
            return;
          }
window.playerLevel = playerSkill.level;
window.canGather = playerLevel >= requiredLevel;
window.card = document.createElement("div");
window.diffClass = getNodeDifficultyClass(playerLevel, requiredLevel);
          card.className = `resource-card ${diffClass} ${canGather ? "" : "locked"}`;
          card.dataset.resourceId = resource.id;
          card.dataset.skill = skillType;
window.dropsHtml = '';
          if (showDropPercentages && resource.drops) {
            dropsHtml = '<div style="margin-top: 8px; border-top: 1px solid #555; padding-top: 5px;">';
            resource.drops.forEach(drop => {
              if (drop.rarity) {
window.dropChance = calculateRarityChance(drop.rarity, playerLevel, resource.level);
window.rarityColor = getRarityColor(drop.rarity);
window.itemName = getItemName(drop.item);
                dropsHtml += `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0; font-size: 11px;">
                      <span style="color: #bbb; cursor: help;" data-item-tooltip="${drop.item}">${itemName}</span>
                      <span style="color: ${rarityColor}; font-weight: bold; cursor: help;" title="${drop.rarity.charAt(0).toUpperCase() + drop.rarity.slice(1)}: ${(dropChance * 100).toFixed(1)}% chance (Level diff: ${playerLevel - resource.level})">${(dropChance * 100).toFixed(1)}%</span>
                    </div>
                  `;
              } else if (drop.chance) {
window.percentage = (drop.chance * 100).toFixed(1);
window.itemName = getItemName(drop.item);
                dropsHtml += `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0; font-size: 11px;">
                      <span style="color: #bbb; cursor: help;" data-item-tooltip="${drop.item}">${itemName}</span>
                      <span style="color: #238636; font-weight: bold;">${percentage}%</span>
                    </div>
                  `;
              }
            });
            dropsHtml += '</div>';
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
    }
window.renderEnemies = function (area) {
window.enemyContainer = document.getElementById("enemy-list");
window.dungeonContainer = document.getElementById("dungeon-list");
      if (enemyContainer) enemyContainer.innerHTML = "";
      if (dungeonContainer) dungeonContainer.innerHTML = "";
window.whitelist = area.enemyWhitelist instanceof Set ? area.enemyWhitelist : null;
window.areaLevel = area.level || 1;
window.pickFromFaction = function (factionId, kind, applyWhitelist = false) {
window.f = gameData.enemies && gameData.enemies[factionId];
        if (!f) return null;
window.pool = kind === 'boss' ? (f.bosses || []) : (f.regular || []);
window.candidates = pool;
        if (applyWhitelist && whitelist) candidates = pool.filter(e => whitelist.has(nf(e.name)));
        if (candidates.length === 0) return null;
        return candidates[Math.floor(Math.random() * candidates.length)];
      }
window.makeScaled = function (factionId, enemyData, level, kind) {
        if (!enemyData) return null;
        return scaleEnemyForLevel(factionId, enemyData, level, kind);
      }
window.findRegularEnemyByName = function (name) {
window.target = nf(name);
window.all = gameData.enemies || {};
        for (const [fid, faction] of Object.entries(all)) {
window.pool = (faction && faction.regular) || [];
          for (const e of pool) {
            if (nf(e.name) === target) return { factionId: fid, enemy: e };
          }
        }
        return null;
      }
window.buildNormalEnemies = function () {
window.out = [];
window.cfg = (typeof AREA_REVAMP_CONFIG !== 'undefined' && area && area.id) ? AREA_REVAMP_CONFIG[area.id] : null;
window.whitelistArray = cfg && Array.isArray(cfg.enemies) ? cfg.enemies : null;

        if (whitelistArray && whitelistArray.length > 0) {
          whitelistArray.forEach((name, i) => {
window.found = findRegularEnemyByName(name);
            if (!found) {
              console.warn('Normal enemy not found for name:', name, 'in area', area.id || area.name);
              return;
            }
window.level = areaLevel + 1 + (i % 3); // cycle +1..+3 for variety
window.scaled = makeScaled(found.factionId, found.enemy, level, 'regular');
            if (scaled) out.push(scaled);
          });
          return out;
        }
window.areaFactions = (area.factions || []).map(name => NAME_TO_FACTION_ID[name] || name);
        areaFactions.forEach((fid) => {
window.levels = [areaLevel + 1, areaLevel + 2, areaLevel + 3];
          levels.forEach(L => {
window.e = pickFromFaction(fid, 'regular', true /* apply whitelist if any */);
window.scaled = makeScaled(fid, e, L, 'regular');
            if (scaled) out.push(scaled);
          });
        });
        return out;
      }
window.renderNormalEnemyList = function (list) {
        if (!enemyContainer) return;
        enemyContainer.innerHTML = "";
        if (!list || list.length === 0) {
          enemyContainer.innerHTML = '<div style="color: #8b949e; text-align: center; padding: 20px;">No enemies available in this area.</div>';
          return;
        }
        list.forEach(enemy => {
window.canFight = gameState.player.combatLevel >= enemy.level;
window.item = document.createElement('div');
window.factionClass = enemy.factionId ? `faction-${enemy.factionId}` : '';
          item.className = `enemy-item ${factionClass} ${canFight ? '' : 'locked'}`;
          item.dataset.enemyId = enemy.id;
window.dropsHtml = '';
          if (showDropPercentages && Array.isArray(enemy.drops) && enemy.drops.length) {
window.playerLevel = gameState.player.combatLevel;
window.enemyLevel = enemy.level || enemy.baseLevel || 1;
            dropsHtml = '<div style="margin-top: 8px; border-top: 1px solid #555; padding-top: 5px;">';
            enemy.drops.forEach(drop => {
window.itemName = getItemName(drop.item || 'scrap');
              if (drop.rarity) {
window.dropChance = calculateRarityChance(drop.rarity, playerLevel, enemyLevel);
window.rarityColor = getRarityColor(drop.rarity);
window.quantityText = drop.min && drop.max ? ` (${drop.min}-${drop.max})` : (drop.min ? ` (${drop.min})` : '');
                dropsHtml += `
                  <div style="display:flex; justify-content:space-between; align-items:center; margin:2px 0; font-size:11px;">
                    <span style="color:#bbb;">${itemName}${quantityText}</span>
                    <span style="color:${rarityColor}; font-weight:bold;">${(dropChance * 100).toFixed(1)}%</span>
                  </div>`;
              } else if (typeof drop.chance === 'number') {
window.percentage = (drop.chance * 100).toFixed(1);
window.quantityText = drop.min && drop.max ? ` (${drop.min}-${drop.max})` : (drop.min ? ` (${drop.min})` : '');
                dropsHtml += `
                  <div style="display:flex; justify-content:space-between; align-items:center; margin:2px 0; font-size:11px;">
                    <span style="color:#bbb;">${itemName}${quantityText}</span>
                    <span style="color:#238636; font-weight:bold;">${percentage}%</span>
                  </div>`;
              }
            });
            dropsHtml += '</div>';
          }

          item.innerHTML = `
            <div><strong style="color: white;">Lv ${enemy.level}</strong> <strong class="enemy-name">${enemy.name}</strong></div>
            <div style="color: white;">HP ${enemy.hp} • Atk ${enemy.attack} • Def ${enemy.defense}</div>
            ${dropsHtml}`;
          item.addEventListener('click', () => selectEnemy(item, enemy));
          enemyContainer.appendChild(item);
        });
      }
window.normalEnemies = buildNormalEnemies();
      renderNormalEnemyList(normalEnemies);
      if (!gameState.combat.inDungeon) {
        gameState.combat.dungeonEnemies = {}; // clear cached sequences when not in an active run
      }

      if (dungeonContainer) {
        if (!area.dungeons || area.dungeons.length === 0) {
          dungeonContainer.innerHTML = '<div style="color: #8b949e; text-align: center; padding: 20px;">No dungeons or raids here.</div>';
        } else {
          dungeonContainer.innerHTML = '';
          area.dungeons.forEach(d => {
window.card = document.createElement('div');
            card.className = 'dungeon-card';
            card.dataset.dungeonId = d.id;
window.typeLabel = (d.type || 'dungeon').toUpperCase();
window.completed = (gameState.combat.dungeonCompleted || []).includes(d.id);
window.isActive = gameState.combat.inDungeon && gameState.combat.currentDungeon === d.id;
window.btnLabel = isActive ? 'Continue' : (completed ? 'Replay' : 'Start');
            if (isActive) {
              card.classList.add('active');
            }
window.primaryFaction = null;
            if (d.primaryFaction) {
              primaryFaction = d.primaryFaction;
            } else if (gameState.currentArea && gameState.currentArea.factions) {
window.areaFactions = gameState.currentArea.factions.map(name => NAME_TO_FACTION_ID[name] || name.toLowerCase());
              primaryFaction = areaFactions[0];
            }
window.primaryColor = getFactionRGBString(primaryFaction);
window.cardGradient = `background: linear-gradient(135deg, rgba(${primaryColor},0.2), rgba(128,128,128,0.1));`;
            card.style.cssText += cardGradient;
window.progressText = '';
window.enemyListHtml = '';
            if (isActive && gameState.combat.dungeonEnemies && gameState.combat.dungeonEnemies[d.id]) {
window.enemies = gameState.combat.dungeonEnemies[d.id];
window.total = enemies.length;
window.current = gameState.combat.dungeonProgress || 0;
              progressText = `<div style="font-size:11px; color:#888; margin-top:4px;">Progress: ${current + 1}/${total}</div>`;
              enemyListHtml = `
                <div style="margin-top:8px; padding:8px; background:rgba(0,0,0,0.3); border-radius:4px;">
                  <div style="font-size:11px; color:#bbb; margin-bottom:4px;">Enemy Order:</div>
                  <div style="display:flex; flex-direction:column; gap:2px;">
                    ${enemies.map((enemy, index) => {
window.isCurrent = index === current;
window.isPast = index < current;
window.color = isCurrent ? '#ff4444' : (isPast ? '#666' : '#aaa');
window.prefix = isCurrent ? '► ' : (isPast ? '✓ ' : '  ');
                return `<div style="font-size:10px; color:${color};">${prefix}${enemy.name} (Lv${enemy.level})</div>`;
              }).join('')}
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
                ${completed ? '<span class="chip" style="background:#1f6feb33; border:1px solid #1f6feb;">Completed</span>' : ''}
              </div>`;
            card.querySelector('[data-action="start-run"]').addEventListener('click', (ev) => {
              ev.stopPropagation();
              startDungeonRun(d.id);
            });
            dungeonContainer.appendChild(card);
          });
        }
      }
window.factionDescEl = document.getElementById("faction-description");
      if (factionDescEl) factionDescEl.textContent = area.description || '';
    }
window.selectEnemy = function (item, enemy) {
      stopGathering("Switched to combat");
      if (item.classList.contains("active")) {
        document
          .querySelectorAll(".enemy-item")
          .forEach((i) => i.classList.remove("active"));
        gameState.combat.inCombat = false;
        gameState.combat.currentEnemy = null;
        if (gameState.combat.inDungeon) {
          if (confirm('You are in a dungeon run. Stop dungeon progress?')) {
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
window.cpbStop = document.getElementById("combat-progress"); if (cpbStop) cpbStop.style.display = "none";
        document.getElementById("enemy-display").style.display = "none";
window.noEnemy = document.getElementById("no-enemy");
        if (noEnemy) noEnemy.style.display = "block";

        addCombatLog("Combat stopped");
        return;
      }

      document
        .querySelectorAll(".enemy-item")
        .forEach((i) => i.classList.remove("active"));
      document.querySelectorAll('.resource-card.active').forEach(c => c.classList.remove('active'));
      item.classList.add("active");
      gameState.combat.inDungeon = false;
      gameState.combat.currentDungeon = null;
      startCombat(enemy);
    }
window.useBirdNest = function () {
window.nonForagingSeeds = [
        "melon_seeds", "cucumber_seeds", "watermelon_seeds", "squash_seeds", "pumpkin_seeds", "zucchini_seeds", "turnip_seeds", "ramps_bulb", "shallot_bulb", "clover_seeds", "sumac_seeds", "basil_seeds", "chives_seeds", "cilantro_seeds", "dill_seeds", "marjoram_seeds", "oregano_seeds", "parsley_seeds", "rosemary_seeds", "sage_seeds", "savory_seeds", "tarragon_seeds", "thyme_seeds", "shiso_seeds"
      ];
window.seedId = nonForagingSeeds[Math.floor(Math.random() * nonForagingSeeds.length)];
      addToBank(seedId, 1);
      showNotification("You found a " + getItemName(seedId) + " in the bird nest!");
      removeFromBank("birds_nest", 1);
      updateUI();
    }
window.useFood = function (itemId) {
window.item = gameData.items[itemId];
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
window.useOpenable = function (itemId) {
window.item = gameData.items[itemId];
      if (!item || !item.openable || !Array.isArray(item.openable.drops) || item.openable.drops.length === 0) return;
      if (!gameState.bank[itemId] || gameState.bank[itemId] <= 0) return;
window.table = item.openable.drops;
window.rewardId = table[Math.floor(Math.random() * table.length)];
      if (!gameData.items[rewardId]) {
        showNotification("Open failed: invalid reward.");
        return;
      }
      removeFromBank(itemId, 1);
      addToBank(rewardId, 1);
window.name = getItemName(rewardId);
      showNotification(`You opened a ${item.name} and found ${name}!`);
      addToMessageLog(`+1 ${name} from ${item.name}`, "success");
      renderBank();
    }
window.showSkillPage = function (skill) {
      currentSkill = skill;
window.gatheringSkills = [
        "woodcutting",
        "mining",
        "fishing",
        "foraging",
        "hunting",
        "looting",
        "scavenging",
      ];
window.craftingSkills = [
        "cooking",
        "tinkering",
        "forging",
        "tailoring",
        "gunsmithing",
        "carpentry",
        "firstaid",
        "masonry",
        "chemistry",
        "electrical"
      ];
window.passiveSkills = ["farming", "animalcare"];
window.combatSkills = ["fitness", "defense", "melee", "firearms", "explosives"];
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
window.skillNavItem = document.querySelector(`[data-skill="${skill}"]`);
      if (skillNavItem) {
        skillNavItem.classList.add("active");
      }

      updateSkillInfo();
    }
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
window.activeContent = document.getElementById(`${tabName}-tab`);
      if (activeContent) {
        activeContent.classList.add("active");
      }
    }
window.saveGame = function () {
window.saveData = {
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
          dungeonEnemies: gameState.combat.dungeonEnemies
        },
        timestamp: Date.now(),
      };

      try {
        localStorage.setItem(
          "postApocalypticIdleSave",
          JSON.stringify(saveData)
        );
        showNotification("Game saved!", "success");
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
        showNotification("Save failed - localStorage not available", "error");
      }
      gameState.lastSave = Date.now();
    }
window.loadGame = function () {
window.saveData = null;

      try {
window.localSave = localStorage.getItem("postApocalypticIdleSave");
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
        gameState.bankPlacement = saveData.bankPlacement || gameState.bankPlacement || {};
        gameState.bankTabSizes = saveData.bankTabSizes || gameState.bankTabSizes || {};
        gameState.bankTabs.forEach(t => {
          if (t.id !== 'all' && !(t.id in gameState.bankTabSizes)) {
            gameState.bankTabSizes[t.id] = getGlobalFreeSlots();
          }
        });
        gameState.activeBankTab = saveData.activeBankTab || gameState.activeBankTab || "all";
        if (!gameState.bankTabs.find(t => t.id === gameState.activeBankTab)) {
          gameState.activeBankTab = "all";
        }
        gameState.equipment = {
          ...gameState.equipment,
          ...saveData.equipment,
        };
        gameState.upgrades = saveData.upgrades || gameState.upgrades || { mining: { purchased: {} }, forestry: { purchased: {} } };
        gameState.workshops = saveData.workshops || gameState.workshops || { tailoring: {}, firstaid: {}, forging: {}, gunsmithing: {}, carpentry: {}, tinkering: {}, cooking: {}, masonry: {}, chemistry: {}, electrical: {} }
window.resetGame = function () {
window.proceed = confirm("This will erase your current progress and start a fresh game. Continue?");
      if (!proceed) return;

      try {
        localStorage.removeItem("postApocalypticIdleSave");
      } catch (_) { /* ignore */ }
window.fresh = {
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
        combatLevel: 1
      };
      gameState.player = { ...fresh };
      gameState.skills = JSON.parse(JSON.stringify({
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
      }));

      gameState.bank = {};
      gameState.bankTabs = [{ id: "all", name: "" }];
      gameState.bankPlacement = {};
      gameState.bankTabSizes = {};
      gameState.activeBankTab = "all";
      gameState.bankHeldItem = null;

      gameState.farming = { plots: [], unlockedPlots: [] };
      gameState.animalCare = { structures: [], unlockedStructures: [], animals: [] };

      gameState.equipment = { helmet: null, armor: null, gloves: null, boots: null, weapon: null, offhand: null, accessory1: null, accessory2: null };
      gameState.currentArea = null;
      gameState.currentAction = null;

      gameState.combat = { inCombat: false, currentEnemy: null, enemyHp: 0, enemyMaxHp: 0, inDungeon: false, currentDungeon: null, dungeonProgress: 0, dungeonEnemies: [], dungeonCompleted: [] };

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
window.addGatheringLog = function (message, className = "") {
window.log = document.getElementById("activity-log-content");
      if (!log) return;
window.entry = document.createElement("div");
      entry.className = `log-entry ${className}`;
      entry.textContent = message;
      log.appendChild(entry);
      log.scrollTop = log.scrollHeight;

      while (log.children.length > 50) {
        log.removeChild(log.firstChild);
      }
    }
window.addToMessageLog = function (message, type = "info") {
      showNotification(message);
window.className = type === "error" ? "log-error" : type === "success" ? "log-success" : "";
      addGatheringLog(message, className);
    }
window.showSkillGatheringPage = function (skill) {
window.skillPage = document.getElementById("skill-page");
window.skillContent = document.getElementById("skill-content");

      skillContent.innerHTML = "";
window.toggleContainer = document.createElement("div");
      toggleContainer.style.cssText = "margin-bottom: 15px; text-align: center;";
window.toggleButton = document.createElement("button");
      toggleButton.textContent = "Drops %";
      toggleButton.style.cssText = `
          background: ${showDropPercentages ? '#2ecc71' : 'rgba(255,255,255,0.06)'};
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
window.nodesGrid = document.createElement("div");
      nodesGrid.className = "gathering-grid";

      gameData.areas.forEach((area) => {
        if (area.gathering && area.gathering[skill]) {
          area.gathering[skill].forEach((resourceId) => {
window.skillData = gameData.skills.gathering_skills[skill];
            if (!skillData || !skillData.nodes) {
              console.warn(`Skill not found or missing nodes: ${skill}`);
              return;
            }
window.resource = skillData.nodes.find(node => node.id === resourceId);
            if (!resource) {
              console.warn(`Resource not found: ${resourceId} in skill ${skill}
window.showCombatSkillPage = function (skill) {
window.skillPage = document.getElementById("skill-page");
window.skillContent = document.getElementById("skill-content");
      skillContent.innerHTML = "";
window.getLevel = (s) => (gameState.skills[s]?.level || 0);
window.Lf = getLevel("fitness");
window.Ld = getLevel("defense");
window.Lm = getLevel("melee");
window.Lr = getLevel("firearms");
window.Le = getLevel("explosives");
window.wrap = document.createElement("div");
      wrap.style.cssText = "display:flex; flex-direction:column; gap:12px; max-width:720px; margin:0 auto;";
window.mkCard = (titleText, rows) => {
window.card = document.createElement("div");
        card.className = "resource-card";
        card.style.padding = "12px";
window.title = document.createElement("div");
        title.style.cssText = "color: var(--brand); margin-bottom: 8px; font-weight: 600;";
        title.textContent = titleText;
        card.appendChild(title);
        rows.forEach(([label, value]) => {
window.line = document.createElement("div");
          line.style.cssText = "display:flex; justify-content:space-between; font-size:13px; color:#c9d1d9; margin:2px 0;";
window.l = document.createElement("span"); l.textContent = label;
window.v = document.createElement("span"); v.textContent = value; v.style.color = "#8b949e";
          line.appendChild(l); line.appendChild(v); card.appendChild(line);
        });
        return card;
      };
window.L = getLevel(skill);
window.currentRows = [];
      if (skill === "fitness") {
window.hp = Math.floor(25 * Math.pow(1 + L, 0.9));
window.regen = 0.5 * Math.pow(1 + L, 0.4);
window.status = 2 * Math.pow(1 + L, 0.3);
        currentRows.push(["HP", `+${hp} - (HP = 25 × (1 + Level)^0.9)`]);
        currentRows.push(["HP Regeneration", `+${regen.toFixed(2)} per second - (HP_Regen = 0.5 × (1 + Level)^0.4)`]);
        currentRows.push(["Status Resistance", `+${Math.round(status)}% - (Status_Resistance = 2 × (1 + Level)^0.3)`]);
      } else if (skill === "defense") {
window.def = Math.floor(3 * Math.pow(1 + L, 0.8));
window.dr = 1 * Math.pow(1 + L, 0.35);
window.block = 1 * Math.pow(1 + L, 0.25);
        currentRows.push(["Defense", `+${def} - (Defense = 3 × (1 + Level)^0.8)`]);
        currentRows.push(["Damage Reduction", `+${dr.toFixed(2)}% - (Damage_Reduction = 1 × (1 + Level)^0.35)`]);
        currentRows.push(["Block Chance", `+${block.toFixed(2)}% - (Block_Chance = 1 × (1 + Level)^0.25)`]);
      } else if (skill === "melee") {
window.atk = Math.floor(4 * Math.pow(1 + L, 0.75));
window.acc = Math.floor(5 * Math.pow(1 + L, 0.6));
window.crit = 1 * Math.pow(1 + L, 0.4);
window.spd = 2 * Math.pow(1 + L, 0.35);
        currentRows.push(["Attack", `+${atk} - (Attack = 4 × (1 + Level)^0.75)`]);
        currentRows.push(["Accuracy", `+${acc} - (Accuracy = 5 × (1 + Level)^0.6)`]);
        currentRows.push(["Critical", `+${Math.min(95, crit).toFixed(2)}% - (Critical = 1 × (1 + Level)^0.4)`]);
        currentRows.push(["Attack Speed", `+${Math.round(spd)}% - (Attack_Speed = 2 × (1 + Level)^0.35)`]);
      } else if (skill === "firearms") {
window.atk = Math.floor(3 * Math.pow(1 + L, 0.7));
window.acc = Math.floor(8 * Math.pow(1 + L, 0.65));
window.crit = 1 * Math.pow(1 + L, 0.4);
window.spd = 2 * Math.pow(1 + L, 0.35);
        currentRows.push(["Attack", `+${atk} - (Attack = 3 × (1 + Level)^0.7)`]);
        currentRows.push(["Accuracy", `+${acc} - (Accuracy = 8 × (1 + Level)^0.65)`]);
        currentRows.push(["Critical", `+${Math.min(95, crit).toFixed(2)}% - (Critical = 1 × (1 + Level)^0.4)`]);
        currentRows.push(["Attack Speed", `+${Math.round(spd)}% - (Attack_Speed = 2 × (1 + Level)^0.35)`]);
      } else if (skill === "explosives") {
window.atk = Math.floor(6 * Math.pow(1 + L, 0.8));
window.pen = 3 * Math.pow(1 + L, 0.5);
window.crit = 2 * Math.pow(1 + L, 0.45);
window.elem = 5 * Math.pow(1 + L, 0.3);
        currentRows.push(["Attack", `+${atk} - (Attack = 6 × (1 + Level)^0.8)`]);
        currentRows.push(["Armor Penetration", `+${Math.round(pen)}% - (Armor_Penetration = 3 × (1 + Level)^0.5)`]);
        currentRows.push(["Critical", `+${Math.min(95, crit).toFixed(2)}% - (Critical = 2 × (1 + Level)^0.45)`]);
        currentRows.push(["Elemental_Status_Chance", `${Math.round(elem)} - (Elemental_Status_Chance = 5 × (1 + Level)^0.3)`]);
      }
window.friendly = skill === "firearms" ? "Ranged" : (skill.charAt(0).toUpperCase() + skill.slice(1));
      wrap.appendChild(mkCard(`${friendly}: Current bonuses (Level ${L})`, currentRows));
window.milestoneWrap = document.createElement("div");
      milestoneWrap.className = "resource-card";
      milestoneWrap.style.padding = "12px";
window.mt = document.createElement("div");
      mt.style.cssText = "color: var(--brand); margin-bottom: 8px; font-weight: 600;";
      mt.textContent = `${friendly}: Milestone bonuses`;
      milestoneWrap.appendChild(mt);
window.ul = document.createElement("ul");
      ul.style.cssText = "margin: 0; padding-left: 18px; color: #c9d1d9;";
window.addLi = (text) => { const li = document.createElement("li"); li.textContent = text; ul.appendChild(li); };
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
window.showSkillCraftingPage = function (skill) {
window.skillPage = document.getElementById("skill-page");
window.skillContent = document.getElementById("skill-content");

      skillContent.innerHTML = "";
window.craftingContainer = document.createElement("div");
      craftingContainer.style.cssText = "display: flex; gap: 20px; height: 100%;";
window.recipeList = document.createElement("div");
      recipeList.style.cssText = "flex: 1; overflow-y: auto; max-height: 500px;";
window.recipeTitle = document.createElement("h3");
      recipeTitle.textContent = "Available Recipes";
      recipeTitle.style.cssText = "margin-bottom: 15px; color: var(--brand);";
      recipeList.appendChild(recipeTitle);
window.craftingArea = document.createElement("div");
      craftingArea.style.cssText = "flex: 1; padding: 20px; background: #111111; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);";
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
window.skillData = gameData.skills.crafting_skills[skill];
      if (!skillData || !skillData.recipes) {
window.noRecipesMsg = document.createElement("div");
        noRecipesMsg.style.textAlign = "center";
        noRecipesMsg.style.color = "#8b949e";
        noRecipesMsg.style.padding = "40px";
        noRecipesMsg.textContent = `No recipes available for ${skill}.`;
        skillContent.appendChild(noRecipesMsg);
        return;
      }
window.selectRecipe = function (recipe, skill, canCraft) {
window.selectedRecipeDiv = document.getElementById("selected-recipe");
window.playerLevel = gameState.skills[skill].level;

      if (!canCraft) {
        selectedRecipeDiv.innerHTML = `
            <div style="color: var(--brand); text-align: center; padding: 20px;">
              <h4>${recipe.name}</h4>
              <p>Requires level ${recipe.level} ${skill}</p>
              <p>Your level: ${playerLevel}</p>
            </div>
          `;
        return;
      }
window.hasAllMaterials = true;
      if ((skill === 'tailoring' || skill === 'firstaid' || skill === 'forging' || skill === 'gunsmithing' || skill === 'carpentry' || skill === 'tinkering') && recipe.station) {
window.ws = (gameState.workshops && gameState.workshops[skill]) || {};
window.hasStation = !!ws[recipe.station];
        if (!hasStation) {
          selectedRecipeDiv.innerHTML = `
            <div style="text-align: center;">
              <h4 style="color: var(--brand); margin-bottom: 15px;">${recipe.name}</h4>
  <div style="color: var(--brand); margin-bottom: 10px;">Requires: ${getWorkshopName(recipe.station, skill)}</div>
  <div style="color: #8b949e;">Unlock it in Shop → Upgrades → ${skill === 'tailoring' ? 'Tailoring' : skill === 'firstaid' ? 'First Aid' : skill === 'forging' ? 'Forging' : skill === 'gunsmithing' ? 'Gunsmithing' : skill === 'carpentry' ? 'Carpentry' : 'Tinkering'}.</div>
            </div>`;
          return;
        }
      }
window.missingMaterials = [];
window.materialsHtml = "";
window.selectionsForRecipe = materialSelections[recipe.id] || (materialSelections[recipe.id] = {});

      if (recipe.materials) {
        recipe.materials.forEach((material, idx) => {
          if (material.item) {
window.playerAmount = gameState.bank[material.item] || 0;
window.hasEnough = playerAmount >= material.quantity;
            if (!hasEnough) {
              hasAllMaterials = false;
window.needed = material.quantity - playerAmount;
window.itemName = getItemName(material.item);
              missingMaterials.push(`${needed}x ${itemName}`);
            }
window.itemName = getItemName(material.item);
window.color = hasEnough ? '#2ecc71' : 'var(--brand)';
            materialsHtml += `
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>${itemName}</span>
                <span style="color: ${color};">${playerAmount}/${material.quantity}</span>
              </div>
            `;
            return;
          }
window.jtype = material.junktype;
window.ownedEligible = Object.keys(gameData.items || {})
            .filter(id => (gameData.items[id] && gameData.items[id].junktype === jtype) && (gameState.bank[id] || 0) > 0)
            .map(id => ({ id, name: getItemName(id), count: gameState.bank[id] || 0 }));
window.selectedId = selectionsForRecipe[idx];
          if (!selectedId) {
            selectedId = ownedEligible.length > 0 ? ownedEligible[0].id : null;
            selectionsForRecipe[idx] = selectedId || null;
          }
window.startCrafting = function (recipe, skill) {
      if (gameState.currentAction) {
        addToMessageLog("Already busy with another action.", "error");
        return;
      }
window.playerLevel = gameState.skills[skill].level;

      if (playerLevel < recipe.level) {
        addToMessageLog(`Need level ${recipe.level} ${skill} to craft this recipe.`, "error");
        return;
      }

      if ((skill === 'tailoring' || skill === 'firstaid' || skill === 'forging' || skill === 'gunsmithing' || skill === 'carpentry' || skill === 'tinkering') && recipe.station) {
window.ws = (gameState.workshops && gameState.workshops[skill]) || {};
        if (!ws[recipe.station]) {
          addToMessageLog(`Requires ${getWorkshopName(recipe.station, skill)} to craft this.`, "error");
          return;
        }
      }
window.hasAllMaterials = true;
window.missingMaterials = [];

      if (recipe.materials) {
        recipe.materials.forEach((material) => {
window.playerAmount = gameState.bank[material.item] || 0;
          if (playerAmount < material.quantity) {
            hasAllMaterials = false;
window.needed = material.quantity - playerAmount;
window.itemName = getItemName(material.item);
            missingMaterials.push(`${needed}x ${itemName}`);
          }
        });
      }

      if (!hasAllMaterials) {
        addToMessageLog(`Missing materials: ${missingMaterials.join(', ')}`, "error");
        return;
      }

      if (recipe.materials) {
        recipe.materials.forEach((material) => {
          gameState.bank[material.item] = (gameState.bank[material.item] || 0) - material.quantity;
          if (gameState.bank[material.item] <= 0) {
            delete gameState.bank[material.item];
          }
        });
      }

      gameState.currentAction = {
        type: "crafting",
        skill: skill,
        recipe: recipe,
        progress: 0,
        duration: recipe.time,
      };

      craftingContinuous = true;
window.craftProgressFill = document.getElementById("craft-progress-fill");
window.craftTimer = document.getElementById("craft-timer");
      if (craftProgressFill) {
        craftProgressFill.style.width = "0%";
      }
      if (craftTimer) {
        craftTimer.textContent = `${(recipe.time / 1000).toFixed(1)}s remaining`;
      }
window.selectedRecipeDiv = document.getElementById("selected-recipe");
window.craftingProgress = document.getElementById("crafting-progress");
window.itemName = recipe.randomResult && recipe.randomResult.type === 'bar'
        ? 'Random Bar'
        : getItemName(recipe.result.item);

      selectedRecipeDiv.innerHTML = `
          <div style="text-align: center;">
            <h4 style="color: #238636;">Crafting ${recipe.name}</h4>
            <div style="color: #2ecc71; margin: 10px 0;">
              Creating ${recipe.result.quantity}x ${itemName}
            </div>
            <div style="color: #8b949e; font-size: 12px; margin: 5px 0;">
              Duration: ${(recipe.time / 1000).toFixed(1)}s
            </div>
            <button id="cancel-crafting-btn" style="
              background: var(--brand); 
              color: #e6edf3; 
              border: none; 
              padding: 8px 16px; 
              border-radius: 4px; 
              cursor: pointer; 
              font-size: 12px;
            ">Cancel</button>
          </div>
        `;

      setTimeout(() => {
window.cancelBtn = document.getElementById("cancel-crafting-btn");
        if (cancelBtn) {
          cancelBtn.onclick = function () {
            cancelCrafting();
          };
        }
      }, 50);

      craftingProgress.style.display = "block";

      addToMessageLog(`Started crafting ${recipe.result.quantity}x ${itemName}.`, "info");
      renderBank();
      updateSkillInfo();
    }
window.getWorkshopName = function (id, forSkill = 'tailoring') {
window.list = (gameData.upgrades && gameData.upgrades[forSkill] && gameData.upgrades[forSkill].workshops) || [];
window.f = list.find(w => w.id === id);
      return f ? f.name : id;
    }
window.cancelCrafting = function () {
      if (gameState.currentAction && gameState.currentAction.type === "crafting") {
        craftingContinuous = false;
        gameState.currentAction = null;
window.craftingProgress = document.getElementById("crafting-progress");
        if (craftingProgress) {
          craftingProgress.style.display = "none";
        }
window.craftProgressFill = document.getElementById("craft-progress-fill");
window.craftTimer = document.getElementById("craft-timer");
        if (craftProgressFill) {
          craftProgressFill.style.width = "0%";
        }
        if (craftTimer) {
          craftTimer.textContent = "";
        }
window.selectedRecipeDiv = document.getElementById("selected-recipe");
        if (selectedRecipeDiv) {
          selectedRecipeDiv.innerHTML = `
              <div style="color: #8b949e; text-align: center; padding: 40px;">
                Select a recipe to begin crafting
              </div>
            `;
        }

        addToMessageLog("Crafting cancelled.", "info");
      }
    }

    window.cancelCrafting = cancelCrafting;
window.showSkillPassivePage = function (skill) {
window.skillPage = document.getElementById("skill-page");
window.skillContent = document.getElementById("skill-content");

      skillContent.innerHTML = "";
window.passiveContainer = document.createElement("div");
      passiveContainer.style.cssText = "padding: 20px;";
window.skillTitle = document.createElement("h3");
      skillTitle.textContent = skill.charAt(0).toUpperCase() + skill.slice(1);
      skillTitle.style.cssText = "color: var(--brand); margin-bottom: 20px; text-align: center;";
      passiveContainer.appendChild(skillTitle);

      if (skill === "farming") {
        showFarmingInterface(passiveContainer);
      } else if (skill === "animalcare") {
        showAnimalCareInterface(passiveContainer);
      }

      skillContent.appendChild(passiveContainer);
    }
window.showFarmingInterface = function (container) {
window.playerLevel = gameState.skills.farming.level;
window.unlockedPlots = getUnlockedPlots(playerLevel);
window.plotTypeNames = { herb: "Herb Plot", garden: "Garden Plot", tree: "Tree Plot", mushroom: "Mushroom Log" };
window.plotsSection = document.createElement("div");
      plotsSection.style.cssText = "margin-bottom: 30px;";
window.plotsTitle = document.createElement("h4");
      plotsTitle.textContent = "Farm Plots";
      plotsTitle.style.cssText = "color: var(--brand); margin-bottom: 15px;";
      plotsSection.appendChild(plotsTitle);
window.plotsGrid = document.createElement("div");
      plotsGrid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;";

      FARMING_DATA.plots.forEach((plot, index) => {
window.isUnlocked = index < unlockedPlots;
window.plotCard = document.createElement("div");
        plotCard.className = "resource-card";
window.plotState = gameState.farming.unlockedPlots.find(p => p.name === plot.name);
window.isPlanted = plotState && plotState.plantedSeed;

        plotCard.style.cssText = `
            background: ${isUnlocked ? 'rgba(40, 167, 69, 0.2)' : 'rgba(255,255,255,0.06)'};
            border: 1px solid ${isUnlocked ? 'var(--brand)' : 'rgba(255,255,255,0.08)'};
            opacity: ${isUnlocked ? '1' : '0.6'};
            cursor: ${isUnlocked ? 'pointer' : 'default'};
            min-height: 220px;
          `;
window.compatibleSeeds = getCompatibleSeeds(plot.type, playerLevel);
window.hasSeeds = compatibleSeeds.length > 0;

        plotCard.innerHTML = `
            <h5 style="color: var(--brand);">${plot.name}</h5>
            <div style="color: #8b949e; margin: 5px 0;">Level ${plot.requiredLevel} required</div>
            <div style="color: #8b949e; margin: 5px 0;">Type: ${plotTypeNames[plot.type] || plot.type}</div>
            <div style="color: ${isUnlocked ? '#2ecc71' : 'var(--brand)'}; font-weight: bold; margin: 5px 0;">
              ${isUnlocked ? 'UNLOCKED' : 'LOCKED'}
            </div>
            ${isPlanted ? `
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
                <div style="color: #238636; font-weight: bold; margin-bottom: 5px;">🌱 ${plotState.plantedSeed.name}</div>
                <div style="color: #8b949e; font-size: 12px; margin-bottom: 5px;">
                  Produces: ${plotState.plantedSeed.produces.map(p => `${p.quantity}x ${getItemName(p.item)}`).join(', ')}
                </div>
                <div style="color: #1a7f37; font-size: 12px; margin-bottom: 8px;">Every ${(plotState.plantedSeed.time / 1000).toFixed(0)}s</div>
                
                
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
            ` : isUnlocked ? `
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
                <div style="color: var(--brand); font-size: 12px; margin-bottom: 5px;">Available Seeds: ${compatibleSeeds.length}</div>
                <button style="
                  width: 100%; 
                  padding: 8px; 
                  background: ${hasSeeds ? 'var(--brand)' : '#8b949e'}; 
                  color: #e6edf3; 
                  border: none; 
                  border-radius: 4px; 
                  cursor: ${hasSeeds ? 'pointer' : 'not-allowed'};
                  font-size: 12px;
                " ${hasSeeds ? `onclick="selectSeedForPlot('${plot.name}', '${plot.type}', ${index})"` : 'disabled'}>
                  ${hasSeeds ? 'Plant Seed' : 'No Seeds'}
                </button>
              </div>
            ` : ''}
          `;

        plotsGrid.appendChild(plotCard);
      }
window.selectSeedForPlot = function (plotName, plotType, plotIndex) {
window.playerLevel = gameState.skills.farming.level;
window.compatibleSeeds = getCompatibleSeeds(plotType, playerLevel);

      if (compatibleSeeds.length === 0) {
        showNotification("No compatible seeds available!", "error");
        return;
      }
window.modal = document.createElement("div");
      modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        `;
window.modalContent = document.createElement("div");
      modalContent.style.cssText = `
          background: #111111;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        `;

      modalContent.innerHTML = `
          <h3 style="color: var(--brand); margin-bottom: 15px;">Select Seed for ${plotName}</h3>
          <div style="color: #8b949e; margin-bottom: 15px;">Compatible ${plotType} seeds:</div>
          <div id="seed-selection-grid" style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 15px;"></div>
          <button id="cancel-seed-selection" style="
            background: var(--brand);
            color: #e6edf3;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
          ">Cancel</button>
        `;
window.seedGrid = modalContent.querySelector("#seed-selection-grid");

      compatibleSeeds.forEach(seed => {
window.playerHas = gameState.bank[seed.id] || 0;
window.seedOption = document.createElement("div");
        seedOption.style.cssText = `
            background: rgba(40, 167, 69, 0.2);
            border: 1px solid var(--brand);
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
          `;

        seedOption.innerHTML = `
            <div style="color: var(--brand); font-weight: bold;">${seed.name}</div>
            <div style="color: #8b949e; font-size: 12px;">Level ${seed.level} • Owned: ${playerHas}</div>
            <div style="color: #238636; font-size: 12px; margin-top: 5px;">
              Produces: ${seed.produces.map(p => `${p.quantity}x ${getItemName(p.item)}`).join(', ')}
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

      modalContent.querySelector("#cancel-seed-selection").addEventListener("click", () => {
        document.body.removeChild(modal);
      });

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
    }
window.showGeneralShopItems = function (container) {
window.animalsSection = document.createElement('div');
      animalsSection.style.cssText = 'margin-bottom: 40px; grid-column: 1 / -1; width: 100%;';
window.animalsTitle = document.createElement('h3');
      animalsTitle.textContent = 'Animals';
      animalsTitle.style.cssText = 'color: var(--brand); margin-bottom: 20px; text-align: center;';
      animalsSection.appendChild(animalsTitle);
window.animalsGrid = document.createElement('div');
      animalsGrid.className = 'shop-animals-grid';
window.structureTypes = {
        pen: { name: "Pen Animals", icon: "🐄", color: "var(--brand)" },
        coop: { name: "Coop Animals", icon: "🐔", color: "#238636" },
        hutch: { name: "Hutch Animals", icon: "🐰", color: "#9b59b6" },
        insect: { name: "Insect House", icon: "🐝", color: "#f1c40f" }
      }
window.showEquipmentShopItems = function (container) {
      container.innerHTML = `
          <div style="text-align: center; color: #8b949e; padding: 40px;">
            Equipment shop coming soon...
          </div>
        `;
    }
window.showUpgradesShopItems = function (container) {
      container.innerHTML = '';
window.miningHeader = document.createElement('div');
      miningHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin-bottom: 10px; text-align: center;';
      miningHeader.innerHTML = '<h3 style="color: var(--brand);">Mining</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(miningHeader);
window.miningTools = (gameData.upgrades && gameData.upgrades.mining && gameData.upgrades.mining.tools) ? gameData.upgrades.mining.tools : [];
window.miningLevel = (gameState.skills && gameState.skills.mining && gameState.skills.mining.level) ? gameState.skills.mining.level : 1;

      if (miningTools.length === 0) {
window.empty = document.createElement('div');
        empty.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        empty.textContent = 'No mining upgrades available.';
        container.appendChild(empty);
      } else {
        miningTools.forEach(tool => {
window.purchased = !!(gameState.upgrades && gameState.upgrades.mining && gameState.upgrades.mining.purchased[tool.id]);
window.meetsLevel = miningLevel >= tool.requiredLevel;
window.canUnlock = !purchased && meetsLevel;
window.card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
            <div class="item-icon">⛏️</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Mining Lv ${tool.requiredLevel}</div>
            <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
          `;
window.btn = card.querySelector('button');
          btn.addEventListener('click', () => {
            if (!canUnlock) return;
            gameState.upgrades.mining.purchased[tool.id] = true;
            showNotification(`${tool.name} unlocked`);
            saveGame();
            showUpgradesShopItems(container);
          });

          container.appendChild(card);
        });
      }
window.forestryHeader = document.createElement('div');
      forestryHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      forestryHeader.innerHTML = '<h3 style="color: var(--brand);">Forestry</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(forestryHeader);
window.forestryTools = (gameData.upgrades && gameData.upgrades.forestry && gameData.upgrades.forestry.tools) ? gameData.upgrades.forestry.tools : [];
window.forestryLevel = (gameState.skills && gameState.skills.woodcutting && gameState.skills.woodcutting.level) ? gameState.skills.woodcutting.level : 1;

      if (forestryTools.length === 0) {
window.emptyF = document.createElement('div');
        emptyF.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        emptyF.textContent = 'No forestry upgrades available.';
        container.appendChild(emptyF);
      }
window.purchaseAnimal = function (animalId, structureType, price, requiredLevel) {
window.playerLevel = gameState.skills.animalcare.level;
window.playerCoins = gameState.bank.coins || 0;

      if (playerLevel < requiredLevel) {
        showNotification(`Need level ${requiredLevel} Animal Care to purchase this animal.`, "error");
        return;
      }

      if (!isFinite(price) || price <= 0) {
        showNotification(`This animal is not for sale.`, "error");
        return;
      }

      if (playerCoins < price) {
        showNotification(`Need ${price} coins to purchase this animal. You have ${playerCoins}.`, "error");
        return;
      }

      gameState.bank.coins = (gameState.bank.coins || 0) - price;
      if (gameState.bank.coins <= 0) {
        delete gameState.bank.coins;
      }

      gameState.bank[animalId] = (gameState.bank[animalId] || 0) + 1;
window.animalData = ANIMAL_CARE_DATA.animals[structureType].find(a => a.id === animalId);
      showNotification(`Purchased ${animalData.name} for ${price} coins! Added to bank.`, "success");
      renderBank();
      showShopTab('general');
    }

    window.purchaseAnimal = purchaseAnimal;
window.showAnimalCareInterface = function (container) {
window.playerLevel = gameState.skills.animalcare.level;
window.unlockedPens = getUnlockedPens(playerLevel);
window.structureTypeNames = { pen: "Pen", coop: "Coop", hutch: "Hutch", insect: "Insect House" };
window.structuresSection = document.createElement("div");
      structuresSection.style.cssText = "margin-bottom: 30px;";
window.structuresTitle = document.createElement("h4");
      structuresTitle.textContent = "Animal Structures";
      structuresTitle.style.cssText = "color: #8e44ad; margin-bottom: 15px;";
      structuresSection.appendChild(structuresTitle);
window.structuresGrid = document.createElement("div");
      structuresGrid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;";

      ANIMAL_CARE_DATA.structures.forEach((structure, index) => {
window.isUnlocked = index < unlockedPens;
window.structureCard = document.createElement("div");
        structureCard.className = "resource-card";
window.structureState = gameState.animalCare.unlockedStructures.find(s => s.name === structure.name);
window.hasAnimal = !!(structureState && structureState.placedAnimal);

        structureCard.style.cssText = `
            background: ${isUnlocked ? 'rgba(142, 68, 173, 0.2)' : 'rgba(255,255,255,0.06)'};
            border: 1px solid ${isUnlocked ? '#8e44ad' : 'rgba(255,255,255,0.08)'};
            opacity: ${isUnlocked ? '1' : '0.6'};
            cursor: ${isUnlocked ? 'pointer' : 'default'};
            min-height: 220px;
          `;
window.compatibleAnimals = getCompatibleAnimals(structure.type, playerLevel);
window.hasAnimals = compatibleAnimals.length > 0;

        structureCard.innerHTML = `
            <h5 style="color: #8e44ad;">${structure.name}</h5>
            <div style="color: #8b949e; margin: 5px 0;">Level ${structure.level} required</div>
            <div style="color: #8b949e; margin: 5px 0;">Type: ${structureTypeNames[structure.type] || structure.type}</div>
            <div style="color: ${isUnlocked ? '#2ecc71' : 'var(--brand)'}; font-weight: bold; margin: 5px 0;">
              ${isUnlocked ? 'UNLOCKED' : 'LOCKED'}
            </div>
            ${hasAnimal ? `
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
                <div style="color: #238636; font-weight: bold; margin-bottom: 5px;">${structureState.placedAnimal.icon} ${structureState.placedAnimal.name} <span style=\"color:#bdc3c7; font-weight: normal;\">(x${structureState.placedAnimal.count || 1})</span></div>
                <div style="color: #2ecc71; font-size: 12px; margin-bottom: 8px;">
                  Produces: ${structureState.placedAnimal.produces.map(item => getItemName(item)).join(', ')}
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
            ` : isUnlocked ? `
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
                <div style="color: var(--brand); font-size: 12px; margin-bottom: 5px;">Available Animals: ${compatibleAnimals.length} • Capacity: ${(STRUCTURE_CAPACITY[structure.type] || 1)}</div>
                <button style="
                  width: 100%; 
                  padding: 8px; 
                  background: ${hasAnimals ? '#8e44ad' : '#8b949e'}; 
                  color: #e6edf3; 
                  border: none; 
                  border-radius: 4px; 
                  cursor: ${hasAnimals ? 'pointer' : 'not-allowed'};
                  font-size: 12px;
                " ${hasAnimals ? `onclick="selectAnimalForStructure('${structure.name}', '${structure.type}', ${index})"` : 'disabled'}>
                  ${hasAnimals ? 'Place Animals' : 'No Animals'}
                </button>
              </div>
            ` : ''}
          `;

        structuresGrid.appendChild(structureCard);
      });

      structuresSection.appendChild(structuresGrid);
      container.appendChild(structuresSection);


    }
window.updateAnimalCareProgressBars = function () {
window.currentTime = Date.now();

      gameState.animalCare.unlockedStructures.forEach((structure, index) => {
        if (structure.placedAnimal) {
window.byproductElement = document.getElementById(`byproduct-progress-${index}`);
          if (byproductElement && structure.lastByproduct) {
window.byproductTimePassed = currentTime - structure.lastByproduct;
window.byproductProgress = Math.min(100, (byproductTimePassed / 60000) * 100);
            byproductElement.style.width = `${byproductProgress}%`;
          }
window.harvestElement = document.getElementById(`harvest-progress-${index}`);
          if (harvestElement && structure.lastHarvest) {
window.harvestTimePassed = currentTime - structure.lastHarvest;
window.harvestProgress = Math.min(100, (harvestTimePassed / 240000) * 100);
            harvestElement.style.width = `${harvestProgress}%`;
          }
        }
      });
    }
window.getCompatibleAnimals = function (structureType, playerLevel) {
window.animals = ANIMAL_CARE_DATA.animals[structureType] || [];
      return animals.filter(animal => {
window.playerHas = gameState.bank[animal.id] || 0;
        return playerHas > 0 && playerLevel >= animal.level;
      });
    }
window.selectAnimalForStructure = function (structureName, structureType, structureIndex) {
window.playerLevel = gameState.skills.animalcare.level;
window.compatibleAnimals = getCompatibleAnimals(structureType, playerLevel);

      if (compatibleAnimals.length === 0) {
        showNotification("No compatible animals available!", "error");
        return;
      }
window.modal = document.createElement("div");
      modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        `;
window.modalContent = document.createElement("div");
      modalContent.style.cssText = `
          background: #111111;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        `;

      modalContent.innerHTML = `
          <h3 style="color: var(--brand); margin-bottom: 15px;">Select Animal for ${structureName}</h3>
          <div style="color: #8b949e; margin-bottom: 15px;">Compatible ${structureType} animals:</div>
          <div id="animal-selection-grid" style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 15px;"></div>
          <button id="cancel-animal-selection" style="
            background: var(--brand);
            color: #e6edf3;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
          ">Cancel</button>
        `;
window.animalGrid = modalContent.querySelector("#animal-selection-grid");

      compatibleAnimals.forEach(animal => {
window.playerHas = gameState.bank[animal.id] || 0;
window.animalOption = document.createElement("div");
        animalOption.style.cssText = `
            background: rgba(142, 68, 173, 0.2);
            border: 1px solid #8e44ad;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
          `;

        animalOption.innerHTML = `
            <div style="color: #8e44ad; font-weight: bold;">${animal.icon} ${animal.name}</div>
            <div style="color: #8b949e; font-size: 12px;">Level ${animal.level} • Owned: ${playerHas}</div>
            <div style="color: #238636; font-size: 12px; margin-top: 5px;">
              Produces: ${animal.produces.map(item => getItemName(item)).join(', ')}
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

      modalContent.querySelector("#cancel-animal-selection").addEventListener("click", () => {
        document.body.removeChild(modal);
      });

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
    }
window.placeAnimal = function (structureIndex, animal) {
window.structureData = ANIMAL_CARE_DATA.structures[structureIndex];
window.structureState = gameState.animalCare.unlockedStructures.find(s => s.name === structureData.name);

      if (!structureState) {
        structureState = {
          id: `structure_${structureData.level}`,
          name: structureData.name,
          icon: structureData.icon,
          level: structureData.level,
          type: structureData.type,
          placedAnimal: null,
          lastByproduct: Date.now(),
          lastHarvest: Date.now()
        };
        gameState.animalCare.unlockedStructures.push(structureState);
      }
window.owned = gameState.bank[animal.id] || 0;
      if (owned <= 0) {
        showNotification(`No ${animal.name} in bank.`, "error");
        return;
      }
window.cap = STRUCTURE_CAPACITY[structureData.type] || 1;
window.countToPlace = Math.min(owned, cap);

      structureState.placedAnimal = {
        id: animal.id,
        name: animal.name,
        icon: animal.icon,
        produces: animal.produces,
        level: animal.level,
        count: countToPlace
      };
      structureState.lastByproduct = Date.now();
      structureState.lastHarvest = Date.now();

      gameState.bank[animal.id] = owned - countToPlace;
      if (gameState.bank[animal.id] <= 0) delete gameState.bank[animal.id];

      showNotification(`Placed ${countToPlace}x ${animal.name} in ${structureData.name}!`, "success");
      renderBank();
      showSkillPage("animalcare");
    }
window.removeAnimal = function (structureIndex) {
window.structureData = ANIMAL_CARE_DATA.structures[structureIndex];
window.structureState = gameState.animalCare.unlockedStructures.find(s => s.name === structureData.name);

      if (structureState && structureState.placedAnimal) {
window.count = structureState.placedAnimal.count || 1;
        gameState.bank[structureState.placedAnimal.id] = (gameState.bank[structureState.placedAnimal.id] || 0) + count;
        renderBank();
        showNotification(`Removed ${count}x ${structureState.placedAnimal.name} from ${structureData.name}.`, "info");
        structureState.placedAnimal = null;
        structureState.lastByproduct = null;
        structureState.lastHarvest = null;

        showSkillPage("animalcare");
      }
    }

    window.selectAnimalForStructure = selectAnimalForStructure;
    window.removeAnimal = removeAnimal;
    window.placeAnimal = placeAnimal;
    window.purchaseAnimal = purchaseAnimal;

    window.cancelCrafting = cancelCrafting;


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
        { id: 'res', name: 'Residential' },
        { id: 'ind', name: 'Industrial' },
        { id: 'def', name: 'Defensive' },
        { id: 'spe', name: 'Special' },
      ];
window.BUILDINGS = [
        // Residential - Realistic Housing Sizes
        { id: 'res_1', cat: 'res', name: 'Studio Apartment', cost: { wood: 15, stone: 10 }, slots: { F: 1, W: 0, S: 0, D: 0 }, durability: 120, footprint: [1, 1], tags: ['Road-adjacent'], roofType: 'flat' },
        { id: 'res_2', cat: 'res', name: 'Small House', cost: { wood: 25, stone: 15 }, slots: { F: 1, W: 0, S: 0, D: 0 }, durability: 180, footprint: [1, 2], tags: ['Road-adjacent'], roofType: 'gabled' },
        { id: 'res_3', cat: 'res', name: 'Family Home', cost: { wood: 40, stone: 25 }, slots: { F: 1, W: 0, S: 0, D: 0 }, durability: 220, footprint: [2, 2], tags: ['Road-adjacent'], roofType: 'gabled' },
        { id: 'res_4', cat: 'res', name: 'Duplex', cost: { wood: 50, stone: 30 }, slots: { F: 2, W: 0, S: 0, D: 0 }, durability: 250, footprint: [2, 3], tags: ['Road-adjacent'], roofType: 'gabled' },
        { id: 'res_5', cat: 'res', name: 'Townhouse', cost: { wood: 60, stone: 35 }, slots: { F: 1, W: 0, S: 0, D: 0 }, durability: 280, footprint: [1, 3], tags: ['Road-adjacent'], roofType: 'gabled' },
        { id: 'res_6', cat: 'res', name: 'Apartment Building', cost: { wood: 80, stone: 60 }, slots: { F: 6, W: 0, S: 0, D: 1 }, durability: 350, footprint: [3, 3], tags: ['Road-adjacent'], roofType: 'flat' },
        { id: 'res_7', cat: 'res', name: 'Luxury Estate', cost: { wood: 120, stone: 80 }, slots: { F: 1, W: 1, S: 0, D: 1 }, durability: 400, footprint: [3, 2], tags: ['Road-adjacent'], roofType: 'gabled' },
        { id: 'res_8', cat: 'res', name: 'Condo Complex', cost: { wood: 150, stone: 100 }, slots: { F: 12, W: 2, S: 0, D: 2 }, durability: 450, footprint: [4, 3], tags: ['Road-adjacent'], roofType: 'flat' },

        // Commercial/Industrial - Right-sized Businesses
        { id: 'ind_1', cat: 'ind', name: 'Newsstand', cost: { wood: 8, stone: 5 }, slots: { F: 0, W: 1, S: 0, D: 0 }, durability: 100, footprint: [1, 1], tags: ['Road-adjacent'], roofType: 'flat' },
        { id: 'ind_2', cat: 'ind', name: 'Coffee Shop', cost: { wood: 20, stone: 15 }, slots: { F: 1, W: 2, S: 0, D: 0 }, durability: 160, footprint: [1, 2], tags: ['Road-adjacent'], roofType: 'flat' },
        { id: 'ind_3', cat: 'ind', name: 'Corner Store', cost: { wood: 30, stone: 20 }, slots: { F: 2, W: 3, S: 0, D: 0 }, durability: 200, footprint: [2, 2], tags: ['Road-adjacent'], roofType: 'flat' },
        { id: 'ind_4', cat: 'ind', name: 'Auto Shop', cost: { wood: 45, stone: 35 }, slots: { F: 1, W: 4, S: 0, D: 0 }, durability: 250, footprint: [3, 2], tags: ['Road-adjacent'], roofType: 'flat' },
        { id: 'ind_5', cat: 'ind', name: 'Small Office', cost: { wood: 35, stone: 40 }, slots: { F: 0, W: 6, S: 1, D: 0 }, durability: 220, footprint: [2, 3], tags: ['Road-adjacent'], roofType: 'flat' },
        { id: 'ind_6', cat: 'ind', name: 'Shopping Plaza', cost: { wood: 80, stone: 60 }, slots: { F: 8, W: 12, S: 0, D: 1 }, durability: 320, footprint: [4, 2], tags: ['Road-adjacent'], roofType: 'flat' },
        { id: 'ind_7', cat: 'ind', name: 'Office Building', cost: { wood: 60, stone: 80 }, slots: { F: 0, W: 15, S: 3, D: 1 }, durability: 380, footprint: [3, 3], tags: ['Road-adjacent'], roofType: 'flat' },
        { id: 'ind_8', cat: 'ind', name: 'Warehouse', cost: { wood: 70, stone: 50 }, slots: { F: 0, W: 8, S: 0, D: 0 }, durability: 300, footprint: [4, 3], tags: ['Road-adjacent'], roofType: 'flat' },

        // Public Safety & Services - Compact but Functional
        { id: 'def_1', cat: 'def', name: 'Security Booth', cost: { wood: 10, stone: 8 }, slots: { F: 0, W: 0, S: 0, D: 1 }, durability: 120, footprint: [1, 1], tags: ['Road-adjacent'], roofType: 'fortified' },
        { id: 'def_2', cat: 'def', name: 'Guard House', cost: { wood: 20, stone: 25 }, slots: { F: 0, W: 1, S: 0, D: 2 }, durability: 180, footprint: [1, 2], tags: ['Road-adjacent'], roofType: 'fortified' },
        { id: 'def_3', cat: 'def', name: 'Police Station', cost: { wood: 50, stone: 70 }, slots: { F: 0, W: 4, S: 1, D: 6 }, durability: 350, footprint: [3, 2], tags: ['Road-adjacent'], roofType: 'fortified' },
        { id: 'def_4', cat: 'def', name: 'Fire Station', cost: { wood: 60, stone: 50 }, slots: { F: 0, W: 6, S: 1, D: 4 }, durability: 320, footprint: [2, 3], tags: ['Road-adjacent'], roofType: 'fortified' },
        { id: 'def_5', cat: 'def', name: 'Emergency Center', cost: { wood: 80, stone: 90 }, slots: { F: 0, W: 8, S: 2, D: 8 }, durability: 400, footprint: [3, 3], tags: ['Road-adjacent'], roofType: 'fortified' },

        // Special/Public - Community Buildings
        { id: 'spe_1', cat: 'spe', name: 'Bus Stop', cost: { wood: 5, stone: 8 }, slots: { F: 2, W: 0, S: 0, D: 0 }, durability: 100, footprint: [1, 1], tags: ['Road-adjacent'], roofType: 'flat' },
        { id: 'spe_2', cat: 'spe', name: 'Community Center', cost: { wood: 40, stone: 30 }, slots: { F: 6, W: 2, S: 1, D: 0 }, durability: 250, footprint: [2, 3], tags: ['Road-adjacent'], roofType: 'gabled' },
        { id: 'spe_3', cat: 'spe', name: 'Library', cost: { wood: 50, stone: 60 }, slots: { F: 4, W: 3, S: 6 }, durability: 300, footprint: [3, 2], tags: ['Road-adjacent'], roofType: 'gabled' },
        { id: 'spe_4', cat: 'spe', name: 'Elementary School', cost: { wood: 80, stone: 70 }, slots: { F: 10, W: 6, S: 4, D: 1 }, durability: 350, footprint: [3, 3], tags: ['Road-adjacent'], roofType: 'flat' },
        { id: 'spe_5', cat: 'spe', name: 'High School', cost: { wood: 120, stone: 100 }, slots: { F: 20, W: 10, S: 8, D: 2 }, durability: 450, footprint: [4, 3], tags: ['Road-adjacent'], roofType: 'flat' },
        { id: 'spe_6', cat: 'spe', name: 'Hospital', cost: { wood: 100, stone: 120 }, slots: { F: 15, W: 20, S: 12, D: 3 }, durability: 500, footprint: [4, 4], tags: ['Road-adjacent'], roofType: 'flat' },
        { id: 'expo', cat: 'spe', name: 'City Hall', cost: { wood: 150, stone: 180 }, slots: { F: 8, W: 25, S: 15, D: 8 }, durability: 600, footprint: [4, 3], tags: ['Road-adjacent'], roofType: 'gabled' },
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
      };

      // ======= DOM REFS =======
window.mapEl = document.querySelector('#homebase-page #map');
window.tabsEl = document.querySelector('#homebase-page #tabs');
window.cardsEl = document.querySelector('#homebase-page #cards');
window.favRow = document.querySelector('#homebase-page #favRow');
window.woodEl = document.querySelector('#homebase-page #wood');
window.stoneEl = document.querySelector('#homebase-page #stone');
window.woodDeltaEl = document.querySelector('#homebase-page #woodDelta');
window.stoneDeltaEl = document.querySelector('#homebase-page #stoneDelta');
window.rotateL = document.querySelector('#homebase-page #rotateLeft');
window.rotateR = document.querySelector('#homebase-page #rotateRight');
window.undoBtn = document.querySelector('#homebase-page #undoBtn');
window.toggleBordersBtn = document.querySelector('#homebase-page #toggleBorders');
window.toasts = document.querySelector('#homebase-page #toasts');
window.hint = document.querySelector('#homebase-page #hint');
window.corner = document.querySelector('#homebase-page .overlay .corner');
window.affordChip = document.querySelector('#homebase-page #affordChip');

      // ======= INIT GRID & ROADS =======
      mapEl.style.setProperty('--cols', state.cols);
      mapEl.style.setProperty('--rows', state.rows);

      // Clear any existing tiles
      mapEl.innerHTML = '';

      // Build tiles
window.tiles = [];
      for (let y = 0; y < state.rows; y++) {
        for (let x = 0; x < state.cols; x++) {
window.t = document.createElement('div');
          t.className = 'tile';
          t.dataset.x = x; t.dataset.y = y;
          mapEl.appendChild(t);
          tiles.push(t);
        }
      }
window.roadKey = function (x, y) { return x + "," + y; }
window.setRoad = function (x, y) { state.roads.add(roadKey(x, y)); tileAt(x, y)?.classList.add('road'); }
window.riverKey = function (x, y) { return x + "," + y; }
window.setRiver = function (x, y) { state.rivers.add(riverKey(x, y)); const t = tileAt(x, y); if (t) t.classList.add('river'); }
window.clearRiver = function (x, y) { state.rivers.delete(riverKey(x, y)); const t = tileAt(x, y); if (t) t.classList.remove('river'); }
window.isRiver = function (x, y) { return state.rivers.has(riverKey(x, y)); }
window.bridgeKey = function (x, y) { return x + "," + y; }
window.tileAt = function (x, y) { if (x < 0 || y < 0 || x >= state.cols || y >= state.rows) return null; return tiles[y * state.cols + x]; }

      // helper: fill a vertical river segment
window.fillRiverCol = function (col, y0, y1) {
        for (let y = Math.max(0, y0); y <= Math.min(state.rows - 1, y1); y++) { setRiver(col, y); }
      }
window.homebaseTileConfig = {
        road: [
          "2,4","2,53","2,61","3,4","3,53","3,61","4,0","4,1","4,2","4,3","4,4","4,5","4,6","4,7","4,8","4,9","4,10","4,11","4,12","4,14","4,15","4,16","4,19","4,20","4,21","4,22","4,23","4,24","4,25","4,26","4,27","4,28","4,29","4,30","4,31","4,32","4,33","4,34","4,35","4,36","4,37","4,38","4,39","4,40","4,41","4,42","4,43","4,44","4,45","4,46","4,47","4,48","4,49","4,50","4,51","4,52","4,53","4,54","4,55","4,56","4,57","4,58","4,59","4,60","4,61","4,62","4,63","4,64","4,65","5,4","5,22","5,28","5,35","5,44","5,53","5,61","6,4","6,22","6,28","6,35","6,44","6,53","6,61","7,4","7,22","7,28","7,35","7,44","7,53","7,61","8,0","8,1","8,2","8,3","8,4","8,5","8,6","8,7","8,8","8,9","8,10","8,11","8,12","8,13","8,14","8,15","8,16","8,17","8,18","8,19","8,20","8,21","8,22","8,23","8,24","8,25","8,26","8,27","8,28","8,29","8,30","8,31","8,32","8,33","8,34","8,35","8,36","8,37","8,38","8,39","8,40","8,41","8,42","8,43","8,44","8,45","8,46","8,47","8,48","8,49","8,50","8,51","8,52","8,53","8,54","8,55","8,56","8,57","8,58","8,59","8,60","8,61","8,62","8,63","8,64","8,65","9,4","9,23","9,28","9,35","9,44","9,53","9,61","10,4","10,23","10,28","10,35","10,44","10,53","10,61","11,4","11,23","11,28","11,35","11,44","11,53","11,61","12,0","12,1","12,2","12,3","12,4","12,5","12,6","12,7","12,8","12,9","12,10","12,11","12,12","12,20","12,21","12,22","12,23","12,24","12,25","12,26","12,27","12,28","12,29","12,30","12,31","12,32","12,33","12,34","12,35","12,36","12,37","12,38","12,39","12,40","12,41","12,42","12,43","12,44","12,45","12,46","12,47","12,48","12,49","12,50","12,51","12,52","12,53","12,54","12,55","12,56","12,57","12,58","12,59","12,60","12,61","12,62","12,63","12,64","12,65","13,4","13,23","13,28","13,35","13,44","13,53","13,61","14,4","14,23","14,28","14,35","14,44","14,53","14,61","15,4","15,23","15,28","15,35","15,44","15,53","15,61","16,0","16,1","16,2","16,3","16,4","16,5","16,6","16,7","16,8","16,9","16,10","16,11","16,12","16,15","16,16","16,17","16,18","16,20","16,21","16,22","16,23","16,24","16,25","16,26","16,27","16,28","16,29","16,30","16,31","16,32","16,33","16,34","16,35","16,36","16,37","16,38","16,39","16,40","16,41","16,42","16,43","16,44","16,45","16,46","16,47","16,48","16,49","16,50","16,51","16,52","16,53","16,54","16,55","16,56","16,57","16,58","16,59","16,60","16,61","16,62","16,63","16,64","16,65","17,4","17,9","5,9","6,9","7,9","9,9","10,9","11,9","17,23","17,32","17,39","17,49","17,53","17,61","18,4","18,9","18,23","18,32","18,39","18,49","18,53","18,61","19,4","19,9","19,23","19,32","19,39","19,49","19,53","19,61","20,0","20,1","20,2","20,3","20,4","20,9","20,10","20,11","20,12","20,13","20,14","20,15","20,19","20,20","20,21","20,22","20,23","20,24","20,25","20,26","20,27","20,28","20,29","20,30","20,31","20,32","20,39","20,40","20,41","20,42","20,43","20,44","20,45","20,46","20,47","20,48","20,49","20,50","20,51","20,52","20,53","20,54","20,55","20,56","20,57","20,58","20,59","20,60","20,61","20,62","20,63","20,64","20,65","21,4","21,9","21,16","21,17","21,18","21,19","21,25","21,32","21,39","21,49","21,57","22,4","22,9","22,16","22,17","22,18","22,19","22,25","22,32","22,39","22,49","22,57","23,4","23,9","23,16","23,17","23,18","23,19","23,25","23,32","23,39","23,49","23,57","24,0","24,1","24,2","24,3","24,4","24,5","24,6","24,7","24,8","24,9","24,10","24,11","24,12","24,13","24,14","24,22","24,23","24,24","24,25","24,26","24,27","24,28","24,29","24,30","24,31","24,32","24,33","24,34","24,35","24,36","24,37","24,38","24,39","24,40","24,41","24,42","24,43","24,44","24,45","24,46","24,47","24,48","24,49","24,50","24,51","24,52","24,53","24,54","24,55","24,56","24,57","24,58","24,59","24,60","24,61","24,62","24,63","24,64","24,65","25,4","25,9","25,20","25,25","25,32","25,39","25,49","25,57","26,4","26,9","26,20","26,25","26,32","26,39","26,49","26,57","27,4","27,9","27,25","27,32","27,39","27,49","27,57","28,0","28,1","28,2","28,3","28,4","28,5","28,6","28,7","28,8","28,9","28,10","28,11","28,12","28,13","28,14","28,15","28,16","28,17","28,18","28,19","28,20","28,21","28,22","28,23","28,24","28,25","28,26","28,27","28,28","28,29","28,30","28,31","28,32","28,33","28,34","28,35","28,36","28,37","28,38","28,39","28,40","28,41","28,42","28,43","28,44","28,45","28,46","28,47","28,48","28,49","28,50","28,51","28,52","28,53","28,54","28,55","28,56","28,57","28,58","28,59","28,60","28,61","28,62","28,63","28,64","28,65","2,9","3,9","29,4","30,4","29,9","30,9","29,14","30,14","2,44","3,44","2,35","3,35","2,28","3,28","2,22","3,22","29,25","30,25","29,32","30,32","29,39","30,39","29,44","30,44","29,49","30,49","29,57","30,57",
        ],
        water: [
          "0,14","0,15","0,16","0,17","1,14","1,15","1,16","1,17","2,14","2,15","2,16","2,17","3,14","3,15","3,16","3,17","4,14","4,15","4,16","4,17","5,14","5,15","5,16","5,17","6,14","6,15","6,16","6,17","7,14","7,15","7,16","7,17","9,14","9,15","9,16","9,17","10,14","10,15","10,16","10,17","11,14","11,15","11,16","11,17","12,14","12,15","12,16","12,17","13,14","13,15","13,16","13,17","13,18","14,14","14,15","14,16","14,17","14,18","15,14","15,15","15,16","15,17","15,18","16,15","16,16","16,17","16,18","17,15","17,16","17,17","17,18","18,15","18,16","18,17","18,18","19,15","19,16","19,17","19,18","20,16","20,17","20,18","21,16","21,17","21,18","21,19","22,16","22,17","22,18","22,19","23,16","23,17","23,18","23,19","24,17","24,18","24,19","25,17","25,18","25,19","25,20","26,17","26,18","26,19","26,20","27,17","27,18","27,19","27,20","29,18","29,19","29,20","29,21","30,18","30,19","30,20","30,21","31,18","31,19","31,20","31,21","32,18","32,19","32,20","32,21"
        ],
        bridge: [
          "20,16","20,17","20,18","8,14","8,15","8,16","8,17","28,18","28,19","28,20"
        ],
        grass: [
          "0,0","0,1","1,0","1,1"
        ],
        "diagonal-nw": [
          "12,18"
        ],
        "diagonal-ne": [
          "19,15","23,16","21,19","25,20","29,21","27,17"
        ],
        "diagonal-sw": [
        ],
        "diagonal-se": [
          "15,14"
        ]
      };
window.regionConfig = {
        1: { x: [0, 15], y: [0, 13] },
        2: { x: [16, 32], y: [0, 13] },
        3: { x: [16, 32], y: [22, 43] },
        4: { x: [0, 15], y: [22, 43] },
        5: { x: [0, 15], y: [44, 65] },
        6: { x: [16, 32], y: [44, 65] }
      };

      // Parse coordinates from config and apply tile types
window.parseCoordinates = function (coordString) {
        if (!coordString) return [];
        return coordString.split(/[\s,]+/).filter(s => s.includes(',')).map(coord => {
          const [x, y] = coord.split(',').map(Number);
          return { x, y };
        });
      }
window.setTileType = function (x, y, type) {
        if (x < 0 || x >= state.cols || y < 0 || y >= state.rows) return;
window.t = tileAt(x, y);
        if (!t) return;
        
        // Clear existing type classes
        t.classList.remove('road', 'river', 'bridge', 'grass', 'diagonal-nw', 'diagonal-ne', 'diagonal-sw', 'diagonal-se');
        
        // Apply new type
        switch (type) {
          case 'road':
            state.roads.add(roadKey(x, y));
            t.classList.add('road');
            break;
          case 'water':
            state.rivers.add(riverKey(x, y));
            t.classList.add('river');
            // Remove from roads if it was there
window.rk = roadKey(x, y);
            if (state.roads.has(rk)) state.roads.delete(rk);
            break;
          case 'bridge':
            state.bridges.add(bridgeKey(x, y));
            t.classList.add('bridge');
            // Bridges can cross water, so don't remove from rivers
            break;
          case 'grass':
            t.classList.add('grass');
            break;
          case 'diagonal-nw':
            t.classList.add('diagonal-nw');
            break;
          case 'diagonal-ne':
            t.classList.add('diagonal-ne');
            if ((x === 21 && y === 19) || (x === 25 && y === 20) || (x === 29 && y === 21)) {
              t.classList.add('no-wall');
            }
            break;
          case 'diagonal-sw':
            t.classList.add('diagonal-sw');
            break;
          case 'diagonal-se':
            t.classList.add('diagonal-se');
            break;
        }
      }

      // Road network generation - now uses config-based approach
window.generateRoadNetwork = function () {
        // Clear existing state
        state.roads = new Set();
        if (!state.rivers) state.rivers = new Set();
        if (!state.bridges) state.bridges = new Set();
        
        // Clear all tile classes
        for (let y = 0; y < state.rows; y++) {
          for (let x = 0; x < state.cols; x++) {
window.t = tileAt(x, y);
            if (t) t.classList.remove('road', 'river', 'bridge', 'adj', 'diagonal-nw', 'diagonal-ne', 'diagonal-sw', 'diagonal-se');
          }
        }
        
        // Apply tile types from config
        for (const [tileType, coordinates] of Object.entries(homebaseTileConfig)) {
          for (const coord of coordinates) {
            const [x, y] = coord.split(',').map(Number);
            setTileType(x, y, tileType);
          }
        }
      }

      // Shared region config helper
window.getRegionConfig = function () {
        return {
          1: [{ x: [0, 14], y: [0, 13] }],
          2: [
            { x: [15, 18], y: [0, 14] },
            { x: [19, 19], y: [0, 15] },
            { x: [20, 22], y: [0, 15] },
            { x: [23, 23], y: [0, 16] },
            { x: [24, 26], y: [0, 16] },
            { x: [27, 32], y: [0, 17] }
          ],
          3: [
            { x: [15, 18], y: [15, 32] },
            { x: [19, 19], y: [16, 32] },
            { x: [20, 22], y: [16, 32] },
            { x: [23, 23], y: [17, 32] },
            { x: [24, 26], y: [17, 32] },
            { x: [27, 32], y: [18, 32] }
          ],
          4: [{ x: [0, 14], y: [14, 32] }],
          5: [{ x: [0, 14], y: [33, 49] }],
          6: [{ x: [15, 32], y: [33, 49] }],
          7: [{ x: [15, 56], y: [50, 65] }],
          8: [{ x: [0, 14], y: [50, 65] }, { x: [57, 57], y: [50, 65] }]
        };
      }

      // Function to draw region red guide borders (debug/visual aid)
window.drawRegionBoundaries = function () {
window.regionConfig = getRegionConfig();
        for (const regionId in regionConfig) {
window.rectangles = regionConfig[regionId];
          
          // For each tile in the region, check if it's on the external boundary
          for (const region of rectangles) {
            const [x_start, x_end] = region.x;
            const [y_start, y_end] = region.y;
            for (let x = x_start; x <= x_end; x++) {
              for (let y = y_start; y <= y_end; y++) {
window.tile = tileAt(x, y);
                if (!tile) continue;
                
                // Check if this tile is on the external boundary of the combined region
window.isLeftBoundary = !isInSameRegion(x - 1, y, regionId);
window.isRightBoundary = !isInSameRegion(x + 1, y, regionId);
window.isTopBoundary = !isInSameRegion(x, y - 1, regionId);
window.isBottomBoundary = !isInSameRegion(x, y + 1, regionId);
                
                // Special handling for diagonal boundary coordinates
window.isDiagonalBoundary = (
                  (x === 15 && y === 14) || 
                  (x === 19 && y === 15) || 
                  (x === 23 && y === 16) || 
                  (x === 27 && y === 17)
                );
                
                if (isDiagonalBoundary) {
                  // These are southeast-facing diagonals (diagonal-se)
                  tile.classList.add('region-border-diagonal', 'region-border-diagonal-se');
                } else {
                  if (isLeftBoundary) tile.classList.add('region-border-left');
                  if (isRightBoundary) tile.classList.add('region-border-right');
                  if (isTopBoundary) tile.classList.add('region-border-top');
                  if (isBottomBoundary) tile.classList.add('region-border-bottom');
                }
              }
            }
          }
        }
        
        // Helper function to check if a coordinate is in the same region
window.isInSameRegion = function (x, y, regionId) {
          if (x < 0 || x >= state.cols || y < 0 || y >= state.rows) return false;
window.rectangles = regionConfig[regionId];
          for (const rect of rectangles) {
            const [xs, xe] = rect.x;
            const [ys, ye] = rect.y;
            if (x >= xs && x <= xe && y >= ys && y <= ye) {
              return true;
            }
          }
          return false;
        }
      }

      // Draw walls on the outer edge of unlocked regions; remove inner walls between two unlocked neighbors
window.drawWalls = function () {
window.regionConfig = getRegionConfig();
window.unlocked = state.unlockedRegions || new Set([1]);

        // Clear previous wall and buoy classes
        for (let y = 0; y < state.rows; y++) {
          for (let x = 0; x < state.cols; x++) {
window.t = tileAt(x, y);
            if (!t) continue;
            t.classList.remove('wall', 'w-top', 'w-right', 'w-bottom', 'w-left', 'b-top', 'b-right', 'b-bottom', 'b-left', 'b-diagonal');
          }
        }

        // Helper to mark a continuous edge, with fallback positioning for water/bridges
window.markEdge = function (x0, x1, y0, y1, sideClass, regionBounds) {
          const [regionXs, regionXe, regionYs, regionYe] = regionBounds;
window.buoyClass = 'b-' + sideClass.substring(2); // Convert w-top to b-top, etc.
          
          if (x0 === x1) {
            // vertical edge along constant x
window.x = x0;
            for (let y = y0; y <= y1; y++) {
window.t = tileAt(x, y); if (!t) continue;
              // If tile is a diagonal half-land/half-water, mark as wall but avoid straight band
              if (t.classList.contains('diagonal-nw') || t.classList.contains('diagonal-ne') || t.classList.contains('diagonal-sw') || t.classList.contains('diagonal-se')) {
                if (t.classList.contains('river')) {
                  // For river tiles on diagonal borders, add diagonal buoy marker
                  t.classList.add('b-diagonal');
                } else {
                  t.classList.add('wall');
                }
window.hasAdjacentRect = (direction, start, end) => {
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
window.neighborLeft = (id === 2 || id === 3 || id === 6) ? id - 1 : null; // 2->1, 3->2? (we arranged 4/3 in middle row), 6->5
window.neighborRight = (id === 1 || id === 4 || id === 5) ? id + (id === 1 ? 1 : id === 4 ? -1 + 3 : 1) : null; // keep simple: we'll use explicit map instead

            // Use explicit map to avoid mistakes
window.adjacency = {
              1: { left: null, right: 2, top: null, bottom: 4 },
              2: { left: 1, right: null, top: null, bottom: 3 },
              3: { left: 4, right: null, top: 2, bottom: 6 },
              4: { left: null, right: 3, top: 1, bottom: 5 },
              5: { left: null, right: 6, top: 4, bottom: 8 },
              6: { left: 5, right: null, top: 3, bottom: 7 },
              7: { left: 8, right: null, top: 6, bottom: null },
              8: { left: null, right: 7, top: 5, bottom: null },
            };
window.nbr = adjacency[id];

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
window.specialTile = tileAt(15, 14);
          if (!specialTile) return;

          if (unlocked.has(3) && !unlocked.has(4)) {
            // Ensure tile has water class when map data says it's water
            if (!(specialTile.classList.contains('river')) && (typeof isRiver === 'function' && isRiver(15, 14))) {
              specialTile.classList.add('river');
            }

            // Create a special buoy element and append it to the tile so it renders regardless of background layering
window.buoyEl = document.createElement('div');
            buoyEl.className = 'special-buoy';
            specialTile.appendChild(buoyEl);
          } else {
            // Region unlocked: ensure no special buoy remains
window.existing = specialTile.querySelectorAll('.special-buoy');
            existing.forEach(e => e.remove());
          }
        })();

        // Apply fog of war to tiles outside unlocked regions
        applyFogOfWar(unlocked, regionConfig);
      }

      // Function to apply fog of war to areas outside unlocked regions
window.applyFogOfWar = function (unlocked, regionConfig) {
        // Clear existing fog
        for (let y = 0; y < state.rows; y++) {
          for (let x = 0; x < state.cols; x++) {
window.t = tileAt(x, y);
            if (!t) continue;
            t.classList.remove('fog-of-war');
            
            // Also remove any existing forced-fog elements
window.existingFogs = t.querySelectorAll('.forced-fog');
            existingFogs.forEach(fog => t.removeChild(fog));
          }
        }
        
        // Apply fog to tiles outside unlocked regions
        for (let y = 0; y < state.rows; y++) {
          for (let x = 0; x < state.cols; x++) {
window.t = tileAt(x, y);
            if (!t) continue;
            
            // These coordinates get fog only if region 3 is not unlocked
window.isSpecialCoord = (x === 15 && y === 14) || (x === 19 && y === 15) || 
                                   (x === 23 && y === 16) || (x === 27 && y === 17);
            
            if (isSpecialCoord && !unlocked.has(3) && !unlocked.has(4)) {
              // Force explicit fog styling on these specific coordinates
              
              // Add new fog element
window.fogElement = document.createElement('div');
              fogElement.className = 'forced-fog';
              t.appendChild(fogElement);
              
              // Add normal fog class too
              t.classList.add('fog-of-war');
              
              continue; // Skip the region check for these tiles
            }
window.cleanupDiagonalWallBands = function (){
window.sel = '#homebase-page .tile.wall.diagonal-nw, #homebase-page .tile.wall.diagonal-ne, #homebase-page .tile.wall.diagonal-sw, #homebase-page .tile.wall.diagonal-se';
    document.querySelectorAll(sel).forEach(t => {
      t.classList.remove('w-top','w-right','w-bottom','w-left');
    });
  })();

      // Helper functions for easy coordinate management
window.addCoordinates = function (tileType, coordString) {
        if (!homebaseTileConfig[tileType]) homebaseTileConfig[tileType] = [];
window.newCoords = coordString.split(/[\s,]+/).filter(s => s.includes(','));
        homebaseTileConfig[tileType].push(...newCoords);
        generateRoadNetwork(); // Regenerate to apply changes
        updateRoadSprites();
        markAdjacency();
      }
window.removeCoordinates = function (tileType, coordString) {
        if (!homebaseTileConfig[tileType]) return;
window.coordsToRemove = coordString.split(/[\s,]+/).filter(s => s.includes(','));
        homebaseTileConfig[tileType] = homebaseTileConfig[tileType].filter(coord => !coordsToRemove.includes(coord));
        generateRoadNetwork(); // Regenerate to apply changes
        updateRoadSprites();
        markAdjacency();
      }
window.showConfig = function () {
        console.log('Current homebase tile configuration:');
        for (const [type, coords] of Object.entries(homebaseTileConfig)) {
          console.log(`${type}: ${coords.join(', ')}`);
        }
      }
window.assignRegionClasses = function () {
window.cfg = getRegionConfig();
        for (const id in cfg) {
window.rectangles = cfg[id];
          for (const r of rectangles) {
            const [xs, xe] = r.x; const [ys, ye] = r.y;
            for (let y = ys; y <= ye; y++) {
              for (let x = xs; x <= xe; x++) {
window.t = tileAt(x, y); if (!t) continue;
                t.classList.add(`region-${id}
window.updateRoadSprites = function () {
        // First pass: compute neighbor connectivity for all road and bridge tiles
window.conn = new Map(); // key -> { north, south, west, east, isBridge }
        for (let y = 0; y < state.rows; y++) {
          for (let x = 0; x < state.cols; x++) {
window.t = tileAt(x, y); if (!t || (!t.classList.contains('road') && !t.classList.contains('bridge'))) continue;
window.tn = tileAt(x, y - 1); const ts = tileAt(x, y + 1); const tw = tileAt(x - 1, y); const te = tileAt(x + 1, y);
window.north = !!(tn && (tn.classList.contains('road') || tn.classList.contains('bridge')));
window.south = !!(ts && (ts.classList.contains('road') || ts.classList.contains('bridge')));
window.west = !!(tw && (tw.classList.contains('road') || tw.classList.contains('bridge')));
window.east = !!(te && (te.classList.contains('road') || te.classList.contains('bridge')));
window.isBridge = t.classList.contains('bridge');
            conn.set(x + ',' + y, { north, south, west, east, isBridge });
          }
        }