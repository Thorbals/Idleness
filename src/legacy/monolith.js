// monolith.js — generated from inline <script> tags in complete_game.html
// External script references that were present (not bundled due to unavailable files):
// --- begin extracted inline scripts ---


// ---- inline script #1 ----


          /* Old homebase system removed to avoid conflicts */






















        

// ---- inline script #2 ----


    (function () {
      function onReady(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
      }
      function maybeFixMojibake(text) {
        if (!text) return text;
        if (text.indexOf('�') === -1 && text.indexOf('�') === -1) return text;
        try { return decodeURIComponent(escape(text)); } catch (_) { return text; }
      }
      function walkAndFix(node) {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
        const updates = [];
        while (walker.nextNode()) {
          const cur = walker.currentNode;
          const fixed = maybeFixMojibake(cur.nodeValue);
          if (fixed && fixed !== cur.nodeValue) updates.push([cur, fixed]);
        }
        updates.forEach(([n, v]) => { n.nodeValue = v; });
      }
      function observeAndFix(root) {
        const mo = new MutationObserver((list) => {
          for (const m of list) {
            if (m.type === 'childList') {
              m.addedNodes.forEach(n => {
                if (n.nodeType === 3) { const f = maybeFixMojibake(n.nodeValue); if (f !== n.nodeValue) n.nodeValue = f; }
                else if (n.nodeType === 1) { walkAndFix(n); }
              });
            } else if (m.type === 'characterData') {
              const f = maybeFixMojibake(m.target.nodeValue); if (f !== m.target.nodeValue) m.target.nodeValue = f;
            }
          }
        });
        mo.observe(root, { childList: true, characterData: true, subtree: true });
      }
      function setupButtons() {
        const id = (s) => document.getElementById(s);
        const map = [
          ['btn-save', 'saveGame'],
          ['btn-load', 'loadGame'],
          ['btn-reset', 'resetGame'],
          ['back-to-areas', 'goBackToAreas']
        ];
        map.forEach(([btnId, fnName]) => {
          const btn = id(btnId);
          if (btn && typeof window[fnName] === 'function') btn.addEventListener('click', () => window[fnName]());
        });
      }
      function setupTabs() {
        document.querySelectorAll('[role="tablist"]').forEach(tablist => {
          const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
          function activate(tab) {
            tabs.forEach(t => {
              const on = t === tab;
              t.classList.toggle('active', on);
              t.setAttribute('aria-selected', on ? 'true' : 'false');
              const panel = document.getElementById(t.getAttribute('aria-controls'));
              if (panel) { panel.classList.toggle('active', on); panel.hidden = !on; }
            });
          }
          tablist.addEventListener('click', (e) => {
            const t = e.target.closest('[role="tab"]');
            if (t) activate(t);
          });
          tablist.addEventListener('keydown', (e) => {
            const i = tabs.indexOf(document.activeElement);
            if (i >= 0) {
              if (e.key === 'ArrowRight') { e.preventDefault(); const n = tabs[(i + 1) % tabs.length]; n.focus(); activate(n); }
              if (e.key === 'ArrowLeft') { e.preventDefault(); const p = tabs[(i - 1 + tabs.length) % tabs.length]; p.focus(); activate(p); }
            }
          });
          tabs.forEach(t => {
            const panel = document.getElementById(t.getAttribute('aria-controls'));
            const on = t.classList.contains('active');
            if (panel) panel.hidden = !on;
            t.setAttribute('aria-selected', on ? 'true' : 'false');
          });
        });
      }
      onReady(function () {
        walkAndFix(document.body);
        observeAndFix(document.body);
        setupButtons();
        setupTabs();
      });
    })();
  

// ---- inline script #3 ----




    


    

    // Code moved to items.js


    




    




    




    




    




    




    

    



    

    


    

    



    


    


    


    


    


    


    

    



    

    


    

    





    const STRUCTURE_CAPACITY = { pen: 10, coop: 12, hutch: 8, insect: 30 };

    function critPctToRating(pct) {
      const p = Math.max(0, Math.min(0.95, pct || 0));
      return Math.round((p / (1 - p)) * 200);
    }

    function scaleEnemyForLevel(factionId, baseEnemy, level, kind) {
      const f = (gameData && gameData.enemies && gameData.enemies[factionId]) || null;
      if (!f) return null;
      const L = Math.max(1, level | 0);
      const effLevel = L - 1; const e = f.scaling;
      const b = f.base[kind];
      const hp = Math.max(1, Math.floor(b.hp * Math.pow(1 + effLevel, e.hp)));
      const atk = Math.max(1, Math.floor(b.atk * Math.pow(1 + effLevel, e.atk)));
      const def = Math.max(0, Math.floor(b.def * Math.pow(1 + effLevel, e.def)));
      const acc = Math.max(1, Math.floor(b.acc * Math.pow(1 + effLevel, e.acc)));
      const critRating = critPctToRating((b.critPct || 0) * Math.pow(1 + effLevel, e.crit));
      const armPen = Math.round((b.armPenPct || 0) * Math.pow(1 + effLevel, e.armPen) * 100) / 1; const aspdScalar = (b.aspd || 1) * Math.pow(1 + effLevel, e.aspd);
      const attackSpeedPct = Math.round((aspdScalar - 1) * 100);
      const isBoss = kind === 'boss';
      const drops = [
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

    



    let gameData = {
      areas: null,
      enemies: null,
      items: null,
      skills: null,
    };

    const BANK_CAPACITY_SLOTS = 20;

    let craftingContinuous = false;
    const materialSelections = {};

    let gameState = {

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
    let currentSkill = null;
    let equipmentTooltip = null;
    let showDropPercentages = false;


    


    async function loadGameData() {
      try {
        showLoadingScreen();
        console.log("Loading embedded game data...");

        gameData.areas = AREAS_DATA.areas;
        gameData.skills = { ...window.gathering_skills.SKILLS_DATA, combat_skills: window.COMBAT_SKILLS_DATA, production_skills: window.PRODUCTION_SKILLS_DATA };
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
    }
    
    // Code moved to factions.js
    
    function nf(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim(); }
    

    function applyDungeonRevamp() {
      if (!Array.isArray(gameData.areas)) return;
      const byId = Object.create(null);
      gameData.areas.forEach(a => { if (a && a.id) byId[a.id] = a; });
      Object.entries(AREA_REVAMP_CONFIG).forEach(([areaId, cfg]) => {
        const area = byId[areaId];
        if (!area) return;
        area.areaType = cfg.areaType;
        const areaFactions = (area.factions || []).map(name => NAME_TO_FACTION_ID[name] || name);
        area.dungeons = (cfg.dungeons || []).map(d => {
          const primary = d.primary;
          const secondary = areaFactions.filter(f => f !== primary);
          return { id: d.id, name: d.name, level: area.level, type: d.type, primaryFaction: primary, secondaryFactions: secondary };
        });
        area.enemyWhitelist = new Set((cfg.enemies || []).map(nf));
      });
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
      if (fixed > 0) console.log(`ensureAllItemIcons: set defaults for ${fixed} item(s)`);
    }

    function showLoadingScreen() {
      document.getElementById("loading-screen").style.display = "flex";
      document.getElementById("areas-page").style.display = "none";
    }

    function hideLoadingScreen() {
      document.getElementById("loading-screen").style.display = "none";
      showPage("areas");
    }


    // canEquipItem moved to equipment.js

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
      if (Ld >= 99) { blockChance += 10; gameState.player.reflectOnBlockChancePct = 50; gameState.player.reflectOnBlockPct = 25; }
      gameState.player.defense += defAdd;
      gameState.player.damageReductionBonusPct += drBonus;
      gameState.player.blockChancePct += blockChance;

      const meleeAtk = Math.floor(4 * Math.pow(1 + Lm, 0.75));
      const meleeAcc = Math.floor(5 * Math.pow(1 + Lm, 0.6));
      let meleeCritPct = 1 * Math.pow(1 + Lm, 0.4);
      let meleeAS = 2 * Math.pow(1 + Lm, 0.35);
      if (Lm >= 25) meleeCritPct += 5;
      if (Lm >= 50) meleeAS += 10;
      if (Lm >= 75) gameState.player.critMultiplier = Math.max(gameState.player.critMultiplier, 1.65);
      if (Lm >= 99) { meleeAS += 20; gameState.player.doubleAttackChancePct = 20; }
      gameState.player.attack += meleeAtk;
      gameState.player.accuracy += meleeAcc;
      gameState.player.critical += critPctToRating(Math.min(0.95, (meleeCritPct || 0) / 100));
      gameState.player.attackSpeed += Math.round(meleeAS);

      const rangedAtk = Math.floor(3 * Math.pow(1 + Lr, 0.7));
      const rangedAccBase = Math.floor(8 * Math.pow(1 + Lr, 0.65));
      let rangedCritPct = 1 * Math.pow(1 + Lr, 0.4);
      let rangedAS = 2 * Math.pow(1 + Lr, 0.35);
      let accPctBonus = 0;
      if (Lr >= 25) accPctBonus += 10;
      if (Lr >= 50) rangedCritPct += 5;
      if (Lr >= 75) { rangedAS += 15; gameState.player.pierceTargets = Math.max(gameState.player.pierceTargets, 2); }
      if (Lr >= 99) { accPctBonus += 25; gameState.player.alwaysHitIfAccHigher = true; }
      gameState.player.attack += rangedAtk;
      gameState.player.accuracy += rangedAccBase;
      if (accPctBonus > 0) gameState.player.accuracy = Math.floor(gameState.player.accuracy * (1 + accPctBonus / 100));
      gameState.player.critical += critPctToRating(Math.min(0.95, (rangedCritPct || 0) / 100));
      gameState.player.attackSpeed += Math.round(rangedAS);

      const expAtk = Math.floor(6 * Math.pow(1 + Le, 0.8));
      let expArmPen = 3 * Math.pow(1 + Le, 0.5);
      let expCritPct = 2 * Math.pow(1 + Le, 0.45);
      let elemStatus = 5 * Math.pow(1 + Le, 0.3);
      if (Le >= 25) expArmPen += 15;
      if (Le >= 50) elemStatus += 10;
      if (Le >= 75) expCritPct += 10; if (Le >= 99) elemStatus += 20; gameState.player.attack += expAtk;
      gameState.player.armorPen += Math.round(expArmPen);
      gameState.player.critical += critPctToRating(Math.min(0.95, (expCritPct || 0) / 100));
      gameState.player.elementalStatus += Math.round(elemStatus);

      if (maxHpPctBonus > 0) gameState.player.maxHp = Math.floor(gameState.player.maxHp * (1 + maxHpPctBonus / 100));

      if (gameState.player.hp > gameState.player.maxHp) {
        gameState.player.hp = gameState.player.maxHp;
      }
    }

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
      if (attacker.alwaysHitIfAccHigher && (attacker.accuracy ?? 0) > (defender.evasion ?? 0)) {
        hitRollGuaranteed = true;
      }
      if (!hitRollGuaranteed && Math.random() >= getHitChance(attacker, defender)) return { damage: 0, crit: false, hit: false, blocked: false };
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
      const blockChance = Math.max(0, Math.min(1, (defender.blockChancePct || 0) / 100));
      if (Math.random() < blockChance) {
        blocked = true;
        const reflectChance = Math.max(0, Math.min(1, (defender.reflectOnBlockChancePct || 0) / 100));
        if (reflectChance > 0 && Math.random() < reflectChance) {
          const reflectPct = Math.max(0, Math.min(1, (defender.reflectOnBlockPct || 0) / 100));
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

    let lastRenderedEquipment = {};

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

    function hideEquipmentTooltip() {
      if (equipmentTooltip) {
        equipmentTooltip.remove();
        equipmentTooltip = null;
      }
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

    let itemTooltip = null;

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

    function hideItemTooltip() {
      if (itemTooltip) {
        itemTooltip.remove();
        itemTooltip = null;
      }
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


    async function initGame() {
      console.log("Initializing game...");

      await loadGameData();

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
      setTimeout(() => {
        renderEquipmentSlots();
      }, 100);

      startGameLoop();
      loadGame();

      checkUnlockFarmingPlots(1);
      checkUnlockAnimalStructures(1);
    }

    function setupEventListeners() {
      document.addEventListener("click", handleClick);
      document.addEventListener("click", function (e) {
        const isTooltipElement = e.target.closest('.bank-slot, .equipment-slot, [data-item-tooltip]');
        if (!isTooltipElement) {
          hideItemTooltip();
          hideEquipmentTooltip();
        }
      });
      document.addEventListener("mouseover", function (e) {
        const tooltipElement = e.target.closest('[data-item-tooltip]');
        if (tooltipElement) {
          const itemId = tooltipElement.getAttribute('data-item-tooltip');
          showItemTooltip(e, itemId);
        }
      });

      document.addEventListener("mouseout", function (e) {
        const tooltipElement = e.target.closest('[data-item-tooltip]');
        if (tooltipElement) {
          hideItemTooltip();
        }
      });

      document.addEventListener("mousemove", function (e) {
        const ghost = document.getElementById("bank-held-ghost");
        if (gameState.bankHeldItem && ghost) {
          ghost.style.left = (e.pageX + 12) + "px";
          ghost.style.top = (e.pageY + 12) + "px";
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
              const cpb2 = document.getElementById("combat-progress"); if (cpb2) cpb2.style.display = "none";
              document.getElementById("enemy-display").style.display = "none";
              const noEnemy = document.getElementById("no-enemy");
              if (noEnemy) noEnemy.style.display = "block";

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

        if ((item.type === "food" || item.type === "cooked_food") && item.healAmount) {
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
          autoBtn.textContent = `Bandage Autoheal: ${gameState.combat.autohealEnabled ? 'On' : 'Off'}`;
          addCombatLog(`Bandage autoheal ${gameState.combat.autohealEnabled ? 'enabled' : 'disabled'}`);
        });
      }

      const eatBtn = document.getElementById("btn-eat-food");
      if (eatBtn) {
        eatBtn.addEventListener("click", () => {
          const healed = useSelectedFoodOrBest();
          if (!healed) showNotification("No usable food or already full HP", "warning");
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

    function useBandage(itemId) {
      if (!itemId) return false;
      if (!gameState.bank[itemId] || gameState.bank[itemId] <= 0) return false;
      const heal = getBandageHealAmount(itemId);
      if (heal <= 0) return false;
      if (gameState.player.hp >= gameState.player.maxHp) {
        showNotification('You are already at full health!', "info");
        return false;
      }
      removeFromBank(itemId, 1);
      const before = gameState.player.hp;
      gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + heal);
      const itemName = getItemName(itemId) || 'Bandage';
      showNotification(`Healed ${gameState.player.hp - before} HP with ${itemName}`, "success");
      addCombatLog(`Used ${itemName} (+${gameState.player.hp - before} HP)`, 'log-heal');
      return true;
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

    function handleClick(event) {
      const target = event.target.closest(
        "[data-page], .nav-item[data-skill], .area-card, .enemy-item"
      );
      if (!target) return;

      if (target.dataset.page) {
        showPage(target.dataset.page);
      } else if (
        target.classList.contains("nav-item") &&
        target.dataset.skill
      ) {
        showSkillPage(target.dataset.skill);
      } else if (
        target.classList.contains("area-card") &&
        !target.classList.contains("locked")
      ) {
        showAreaDetail(target.dataset.areaId);
      }
    }


    function startGameLoop() {
      gameInterval = setInterval(() => {
        updateGame();
        updateUI();
      }, 50); // Smoother 20fps instead of 10fps
    }

    function updateGame() {
      if (gameState.currentAction) {
        updateCurrentAction();
      }

      if (gameState.combat.inCombat) {
        updateCombat();
      }

      updatePassiveSystems();

      if (Date.now() - gameState.lastSave > 300000) { // 5 minutes
        saveGame();
      }
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

    function calculateRarityChance(baseRarity, playerLevel, sourceLevel) {
      const levelDifference = Math.max(0, playerLevel - sourceLevel);
      const bonusPercent = Math.floor(levelDifference / 5);

      let rarityChance;
      switch (baseRarity) {
        case 'guaranteed':
          rarityChance = 1.0;
          break;
        case 'epic':
          rarityChance = 0.02 + (bonusPercent * 0.01);
          break;
        case 'rare':
          rarityChance = 0.08 + (bonusPercent * 0.01);
          break;
        case 'common':
          rarityChance = Math.max(0.05, 0.40 - (bonusPercent * 0.01));
          break;
        default:
          rarityChance = 1.0;
      }

      return Math.min(1.0, rarityChance);
    }

    function getRarityColor(rarity) {
      switch (rarity) {
        case 'guaranteed': return '#fff';
        case 'epic': return '#a855f7';
        case 'rare': return '#3b82f6';
        case 'common': return '#10b981';
        default: return '#238636';
      }
    }

    function getItemName(itemId) {
      if (!itemId) return '';
      const map = (typeof gameData !== 'undefined' && gameData.items) ? gameData.items : null;
      const named = map && map[itemId] && map[itemId].name;
      if (named) return named;
      return String(itemId)
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .trim()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    function rollForRarityDrop(drops, playerLevel, sourceLevel) {
      const roll = Math.random();
      let cumulativeChance = 0;

      const rarityOrder = ['guaranteed', 'epic', 'rare', 'common'];
      const sortedDrops = [...drops].sort((a, b) => {
        const aIndex = rarityOrder.indexOf(a.rarity || 'common');
        const bIndex = rarityOrder.indexOf(b.rarity || 'common');
        return aIndex - bIndex;
      });

      for (const drop of sortedDrops) {
        const rarityChance = calculateRarityChance(drop.rarity || 'common', playerLevel, sourceLevel);
        cumulativeChance += rarityChance;

        if (roll <= cumulativeChance) {
          return drop;
        }
      }

      return sortedDrops[sortedDrops.length - 1];
    }

    function rollForRarityDrops(drops, playerLevel, sourceLevel) {
      const results = [];
      if (!Array.isArray(drops)) return results;

      drops.forEach(drop => {
        const rarity = drop.rarity || 'common';
        let include = false;
        if (rarity === 'guaranteed') {
          include = true;
        } else {
          const chance = calculateRarityChance(rarity, playerLevel, sourceLevel);
          include = Math.random() <= chance;
        }

        if (include) {
          let quantity = 1;
          if (typeof drop.min === 'number' && typeof drop.max === 'number') {
            quantity = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
          } else if (typeof drop.min === 'number') {
            quantity = drop.min;
          }
          results.push({ item: drop.item, quantity, rarity });
        }
      });

      return results;
    }

    
    function getGatheringBonusChance(skill, playerLevel) {
      if (!BONUS_GATHERING_SKILLS.has(skill)) return 0;
      const tiers = Math.floor((playerLevel || 0) / 10);
      return Math.max(0, Math.min(1, tiers * 0.10));
    }

    function completeAction(action) {
      if (action.type === "crafting") {
        try {
          addXP(action.skill, action.recipe.xp);
          addToMessageLog(`+${action.recipe.xp} ${action.skill} XP`, "info");
          let resultItem = action.recipe.result.item;
          let resultQty = action.recipe.result.quantity;
          if (action.recipe.randomResult && action.recipe.randomResult.type === 'bar') {
            const playerLevel = gameState.skills.forging?.level || 1;
            const metalRecipes = (window.crafting_skills.RECIPES_DATA.crafting_skills?.forging?.recipes) || [];
            const eligibleBars = metalRecipes
              .filter(r => r.result && typeof r.result.item === 'string' && r.result.item.endsWith('_bar') && (r.level || 0) <= playerLevel)
              .map(r => r.result.item);
            if (eligibleBars.length > 0) {
              const pick = eligibleBars[Math.floor(Math.random() * eligibleBars.length)];
              resultItem = pick;
            }
          }

          addToBank(resultItem, resultQty);
          const awardedName = getItemName(resultItem);
          addToMessageLog(`Crafted ${resultQty}x ${awardedName}`, "success");

          renderBank();
          updateSkillInfo();

          const recipe = action.recipe;
          const skill = action.skill;
          let canContinue = craftingContinuous;
          let missingMaterials = [];

          if (canContinue && recipe.materials) {
            recipe.materials.forEach((material) => {
              const playerAmount = gameState.bank[material.item] || 0;
              if (playerAmount < material.quantity) {
                canContinue = false;
                const itemName = getItemName(material.item);
                missingMaterials.push(itemName);
              }
            });
          }

          if (canContinue && craftingContinuous) {
            setTimeout(() => {
              startCrafting(recipe, skill);
            }, 100);
          } else {
            craftingContinuous = false;

            const craftingProgress = document.getElementById("crafting-progress");
            if (craftingProgress) {
              craftingProgress.style.display = "none";
            }

            const selectedRecipeDiv = document.getElementById("selected-recipe");
            if (selectedRecipeDiv) {
              if (missingMaterials.length > 0) {
                selectedRecipeDiv.innerHTML = `
                    <div style="color: var(--brand); text-align: center; padding: 40px;">
                      <h4>Crafting Stopped</h4>
                      <p>Missing materials: ${missingMaterials.join(', ')}</p>
                      <div style="margin-top: 15px; color: #8b949e;">
                        Select a recipe to begin crafting
                      </div>
                    </div>
                  `;
                addToMessageLog(`Crafting stopped - missing materials: ${missingMaterials.join(', ')}`, "error");
              } else {
                selectedRecipeDiv.innerHTML = `
                    <div style="color: #8b949e; text-align: center; padding: 40px;">
                      Select a recipe to begin crafting
                    </div>
                  `;
              }
            }
          }
        } catch (error) {
          craftingContinuous = false;
          gameState.currentAction = null;

          const craftingProgress = document.getElementById("crafting-progress");
          if (craftingProgress) {
            craftingProgress.style.display = "none";
          }

          addToMessageLog("Crafting error occurred - system reset", "error");
        }

        return;
      }


      if (action.consumes) {
        action.consumes.forEach((consume) => {
          const success = removeFromBank(consume.item, consume.quantity);
          if (success) {
            const itemName = getItemName(consume.item);
            addGatheringLog(`-${consume.quantity} ${itemName}`, "log-consume");
          }
        });
      }

      addXP(action.skill, action.xp);
      addGatheringLog(`+${action.xp} ${action.skill} XP`);

      if (action.drops) {
        const playerLevel = gameState.skills[action.skill]?.level || 1;
        const sourceLevel = action.resource?.level || 1;

        const hasRaritySystem = action.drops.some(drop => drop.rarity);

        if (hasRaritySystem) {
          const rolled = rollForRarityDrops(action.drops, playerLevel, sourceLevel);
          if (rolled.length > 0) {
            const bonusChance = getGatheringBonusChance(action.skill, playerLevel);
            if (bonusChance > 0 && Math.random() < bonusChance) {
              rolled[0].quantity += 1;
            }
          }
          rolled.forEach(r => {
            addToBank(r.item, r.quantity);
            const itemName = getItemName(r.item);
            addGatheringLog(`+${r.quantity} ${itemName}`, "log-loot");
          });
        } else {
          action.drops.forEach((drop) => {
            if (drop.chance !== undefined) {
              let actualChance = drop.chance;

              if (action.skill === 'looting' && drop === action.drops[0]) {
                const playerLevel = gameState.skills.looting.level;
                const nodeLevel = action.resource.level;
                const levelDifference = Math.max(0, playerLevel - nodeLevel);
                const bonusChance = Math.floor(levelDifference / 5) * 0.01;
                actualChance = 0.05 + bonusChance;
              }

              if (Math.random() < actualChance) {
                let quantity = drop.min || 1;
                const isPrimary = drop === action.drops[0];
                const bonusChance = isPrimary ? getGatheringBonusChance(action.skill, playerLevel) : 0;
                if (bonusChance > 0 && Math.random() < bonusChance) quantity += 1;
                addToBank(drop.item, quantity);
                const itemName = getItemName(drop.item);
                addGatheringLog(`+${quantity} ${itemName}`, "log-loot");
              }
            } else {
              let quantity = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
              const isPrimary = drop === action.drops[0];
              const bonusChance = isPrimary ? getGatheringBonusChance(action.skill, playerLevel) : 0;
              if (bonusChance > 0 && Math.random() < bonusChance) quantity += 1;
              addToBank(drop.item, quantity);
              const itemName = getItemName(drop.item);
              addGatheringLog(`+${quantity} ${itemName}`, "log-loot");
            }
          });
        }
      }

      const resourceCard = document.querySelector(".resource-card.active");
      if (resourceCard) {
        const resourceId = resourceCard.dataset.resourceId;
        const skillType = resourceCard.dataset.skill;

        setTimeout(() => {
          startGatheringAction(resourceId, skillType);
        }, 200);
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
        if (gameState.player.doubleAttackChancePct && Math.random() < (gameState.player.doubleAttackChancePct / 100)) {
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
          const threshold = Math.max(0.1, Math.min(0.95, combat.autohealThreshold || 0.7));
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
          const healed = Math.min(gameState.player.maxHp - gameState.player.hp, Math.floor(regen));
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
        if ((item.type === 'food' || item.type === 'cooked_food') && item.healAmount) {
          if (item.healAmount > bestHeal) {
            bestHeal = item.healAmount;
            bestId = id;
          }
        }
      }
      if (!bestId) {
        if (!quiet) showNotification('No food available');
        return false;
      }
      if (gameState.player.hp >= gameState.player.maxHp) {
        if (!quiet) showNotification('HP is already full');
        return false;
      }
      const before = gameState.player.hp;
      useFood(bestId);
      const healed = gameState.player.hp - before;
      if (healed > 0) addCombatLog(`Ate ${getItemName(bestId)} (+${healed} HP)`, 'log-heal');
      return healed > 0;
    }

    function useSelectedFoodOrBest(quiet = false) {
      const sel = document.getElementById('select-food');
      const chosen = (gameState.combat.selectedFoodId) || (sel && sel.value ? sel.value : null);
      if (chosen && (gameState.bank[chosen] || 0) > 0) {
        if (gameState.player.hp >= gameState.player.maxHp) { if (!quiet) showNotification('HP is already full'); return false; }
        const before = gameState.player.hp;
        useFood(chosen);
        const healed = gameState.player.hp - before;
        if (healed > 0) addCombatLog(`Ate ${getItemName(chosen)} (+${healed} HP)`, 'log-heal');
        populateFoodDropdown();
        return healed > 0;
      }
      const res = useBestAvailableFood(quiet);
      if (res) populateFoodDropdown();
      return res;
    }

    function useSelectedBandageOrBest(quiet = false) {
      const sel = document.getElementById('select-bandage');
      const chosen = (gameState.combat.selectedBandageId) || (sel && sel.value ? sel.value : null);
      if (chosen && (gameState.bank[chosen] || 0) > 0) {
        if (gameState.player.hp >= gameState.player.maxHp) { if (!quiet) showNotification('HP is already full'); return false; }
        const ok = useBandage(chosen);
        populateBandageDropdown();
        return ok;
      }
      const bandages = getBandageIds().filter(id => (gameState.bank[id] || 0) > 0).sort((a, b) => getBandageHealAmount(b) - getBandageHealAmount(a));
      if (bandages.length === 0) return false;
      const best = bandages[0];
      if (gameState.player.hp >= gameState.player.maxHp) { if (!quiet) showNotification('HP is already full'); return false; }
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
      const cpb2 = document.getElementById("combat-progress"); if (cpb2) cpb2.style.display = "none";
      document.getElementById("enemy-display").style.display = "none";
      const noEnemy = document.getElementById("no-enemy");
      if (noEnemy) noEnemy.style.display = "block";

      document.querySelectorAll('.enemy-item').forEach((i) => i.classList.remove('active'));
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
          gameState.player.hp = Math.max(0, gameState.player.hp - res.reflectDamage);
          addCombatLog(`${enemy.name} reflects ${res.reflectDamage} damage to you`, "log-damage");
        }
      } else {
        combat.enemyHp = Math.max(0, combat.enemyHp - res.damage);
        addCombatLog(
          `You deal ${res.damage}${res.crit ? ' CRIT' : ''} to ${enemy.name}`,
          "log-damage"
        );
      }

      if (combat.enemyHp <= 0) {
        addCombatLog(`${enemy.name} defeated!`, "log-heal");

        addXP("fitness", enemy.xp);
        if (enemy.drops && !enemy.dungeonId) {
          const playerLevel = gameState.player.combatLevel;
          const enemyLevel = enemy.level || enemy.baseLevel || 1;

          const hasRaritySystem = enemy.drops.some(drop => drop.rarity);

          if (hasRaritySystem) {
            const results = rollForRarityDrops(enemy.drops, playerLevel, enemyLevel);
            results.forEach(r => {
              if (r.item === "scrap") {
                gameState.player.scrap += r.quantity;
                const rarityTag = r.rarity ? `[${r.rarity.toUpperCase()}] ` : '';
                addCombatLog(`+${r.quantity} ${rarityTag}Scrap`, "log-loot");
              } else {
                addToBank(r.item, r.quantity);
                const rarityTag = r.rarity ? `[${r.rarity.toUpperCase()}] ` : '';
                addCombatLog(`+${r.quantity} ${rarityTag}${getItemName(r.item)}`, "log-loot");
              }
            });
          } else {
            enemy.drops.forEach((drop) => {
              if (drop.item === "scrap") {
                const amount =
                  Math.floor(Math.random() * (drop.max - drop.min + 1)) +
                  drop.min;
                gameState.player.scrap += amount;
                addCombatLog(`+${amount} Scrap`, "log-loot");
              } else if (Math.random() < (drop.chance || 1)) {
                const amount = drop.min || 1;
                addToBank(drop.item, amount);
                addCombatLog(
                  `+${amount} ${getItemName(drop.item)}`,
                  "log-loot"
                );
              }
            });
          }
        }
        if (combat.inDungeon && combat.currentDungeon) {
          const seq = (combat.dungeonEnemies && combat.dungeonEnemies[combat.currentDungeon]) || [];
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
            if (!Array.isArray(combat.dungeonCompleted)) combat.dungeonCompleted = [];
            if (!combat.dungeonCompleted.includes(combat.currentDungeon)) {
              combat.dungeonCompleted.push(combat.currentDungeon);
            }
            combat.inDungeon = false;
            combat.currentDungeon = null;
            combat.inCombat = false;
            combat.currentEnemy = null;
            combat.dungeonProgress = 0;
            const cpb1 = document.getElementById("combat-progress"); if (cpb1) cpb1.style.display = "none";
            document.getElementById("enemy-display").style.display = "none";
            const noEnemy = document.getElementById("no-enemy");
            if (noEnemy) noEnemy.style.display = "block";
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
              document.getElementById("combat-progress-fill").style.width = "0%";
              document.getElementById("enemy-hp-bar").style.width = "100%";
              document.getElementById("enemy-hp-text").textContent = `${enemy.hp}/${enemy.hp}`;
              addCombatLog(`${enemy.name} respawned! Fighting again...`);
            }, 800);
          } else {
            combat.inCombat = false;
            combat.currentEnemy = null;
            document.getElementById("combat-progress").style.display = "none";
            document.getElementById("enemy-display").style.display = "none";
            document.getElementById("combat-status").textContent = "Enemy defeated! Select another enemy.";
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
        defense: enemy.defense ?? 0
      });
      const res = computeDamage(enemyAttacker, gameState.player);
      if (!res.hit) {
        addCombatLog(`${enemy.name} misses you`, "log-damage");
        return;
      } else if (res.blocked) {
        addCombatLog(`You block ${enemy.name}'s attack`, "log-heal");
        if (res.reflectDamage && res.reflectDamage > 0) {
          gameState.combat.enemyHp = Math.max(0, gameState.combat.enemyHp - res.reflectDamage);
          addCombatLog(`You reflect ${res.reflectDamage} damage back`, "log-damage");
        }
      } else {
        gameState.player.hp = Math.max(0, gameState.player.hp - res.damage);
        addCombatLog(
          `${enemy.name} hits you for ${res.damage}${res.crit ? ' CRIT' : ''}`,
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
        const cpb2 = document.getElementById("combat-progress"); if (cpb2) cpb2.style.display = "none";
        document.getElementById("enemy-display").style.display = "none";
        const noEnemy = document.getElementById("no-enemy");
        if (noEnemy) noEnemy.style.display = "block";
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

    function calculateLevel(xp) {
      let totalXpNeeded = 0;
      let level = 1;

      while (totalXpNeeded <= xp) {
        level++;
        totalXpNeeded += level * 100;
      }

      return level - 1;
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

      gameState.player.combatLevel = Math.floor(
        totalLevels / combatSkills.length
      );
    }


    function checkUnlockFarmingPlots(level) {
      FARMING_DATA.plots.forEach(plot => {
        if (plot.requiredLevel === level) {
          if (!gameState.farming.unlockedPlots.find(p => p.requiredLevel === level)) {
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
              lastHarvest: Date.now()
            });
            showNotification(`Unlocked ${plot.name}!`);
          }
        }
      });
    }

    function checkUnlockAnimalStructures(level) {
      ANIMAL_CARE_DATA.structures.forEach(structure => {
        if (structure.level === level) {
          if (!gameState.animalCare.unlockedStructures.find(s => s.level === level)) {
            gameState.animalCare.unlockedStructures.push({
              id: `structure_${structure.level}`,
              name: structure.name,
              icon: structure.icon,
              level: structure.level,
              type: structure.type,
              animal: null,
              progress: 0,
              harvestTime: 0
            });
            showNotification(`Unlocked ${structure.name}!`);
          }
        }
      });
    }

    function updatePassiveSystems() {
      updateFarmingProgress();
      updateFarmingProgressBars();
      updateAnimalCareProgress();
      updateAnimalCareProgressBars();
    }

    function updateFarmingProgress() {
      const currentTime = Date.now();

      gameState.farming.unlockedPlots.forEach(plot => {
        if (!plot.plantedSeed) return;

        const timeSinceLastHarvest = currentTime - plot.lastHarvest;
        const seedTime = plot.plantedSeed.time;

        if (timeSinceLastHarvest >= seedTime) {
          const harvestCount = Math.floor(timeSinceLastHarvest / seedTime);

          plot.plantedSeed.produces.forEach(product => {
            const totalOutput = product.quantity * harvestCount;
            addToBank(product.item, totalOutput);
          });

          addXP("farming", 15 * harvestCount);

          plot.lastHarvest = currentTime;

          showNotification(`${plot.name} produced crops from ${plot.plantedSeed.name}!`);
        }
      });
    }

    function updateAnimalCareProgress() {
      const currentTime = Date.now();

      gameState.animalCare.unlockedStructures.forEach(structure => {
        if (structure.placedAnimal) {
          if (structure.lastByproduct && currentTime - structure.lastByproduct >= 60000) {
            const a = structure.placedAnimal;
            const count = a.count || 1;
            const byproductPoolByAnimal = {
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
            const pool = byproductPoolByAnimal[a.id] || ['manure'];
            const randomByproduct = pool[Math.floor(Math.random() * pool.length)];
            const baseQty = Math.floor(Math.random() * 3) + 1;
            const quantity = baseQty * count;

            addToBank(randomByproduct, quantity);
            addToMessageLog(`${a.icon} ${a.name} (x${count}) produced ${quantity}x ${getItemName(randomByproduct)}`, "info");

            structure.lastByproduct = currentTime;
          }

          if (structure.lastHarvest && currentTime - structure.lastHarvest >= 240000) {
            harvestAnimal(structure);
          }
        }
      });
    }

    function harvestPlot(plot) {
      if (plot.seed && plot.seed.produces) {
        plot.seed.produces.forEach(product => {
          const quantity = Math.floor(Math.random() * (product.max - product.min + 1)) + product.min;
          addToBank(product.item, quantity);
          addToMessageLog(`Harvested ${quantity}x ${getItemName(product.item)} from ${plot.name}`, "success");
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
        a.produces.forEach(productId => {
          const baseQty = Math.floor(Math.random() * 3) + 2;
          const quantity = baseQty * count;
          addToBank(productId, quantity);
          addToMessageLog(`Harvested ${quantity}x ${getItemName(productId)} from ${a.name} (x${count}) in ${structure.name}`, "success");
        });
        addToMessageLog(`${a.icon} ${a.name} (x${count}) have been harvested and removed.`, "warning");
        structure.placedAnimal = null;
        structure.lastByproduct = null;
        structure.lastHarvest = null;
      }

      addXP("animalcare", 15);
    }

    function getUnlockedPlots(playerLevel) {
      return Math.min(
        FARMING_DATA.plots.filter(plot => playerLevel >= plot.requiredLevel).length,
        FARMING_DATA.plots.length
      );
    }

    function getUnlockedPens(playerLevel) {
      return Math.min(
        ANIMAL_CARE_DATA.structures.filter(structure => playerLevel >= structure.level).length,
        ANIMAL_CARE_DATA.structures.length
      );
    }

    function getNextPlotUnlockLevel(playerLevel) {
      const nextPlot = FARMING_DATA.plots.find(plot => plot.requiredLevel > playerLevel);
      return nextPlot ? nextPlot.requiredLevel : null;
    }

    function getNextPenUnlockLevel(playerLevel) {
      const nextStructure = ANIMAL_CARE_DATA.structures.find(structure => structure.level > playerLevel);
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

    function getUsedSlots() {
      return Object.keys(gameState.bank).filter(id => (gameState.bank[id] || 0) > 0).length;
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
      if (bankCountEl) bankCountEl.textContent = `${bankItems}/${BANK_CAPACITY_SLOTS}`;
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
      document.getElementById("player-hp-bar").style.width = `${hpPercent}%`;

      if (gameState.combat.currentEnemy) {
        const enemyHpPercent =
          (gameState.combat.enemyHp / gameState.combat.enemyMaxHp) * 100;
        document.getElementById(
          "enemy-hp-bar"
        ).style.width = `${enemyHpPercent}%`;
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
      gameState.bankTabs.forEach(tab => {
        if (tab.id !== "all") {
          const used = getTabUsedSlots(tab.id);
          if (used === 0 && gameState.activeBankTab !== tab.id) return;
        }
        const el = document.createElement("div");
        el.className = "bank-tab" + (gameState.activeBankTab === tab.id ? " active" : "");
        const icon = computeTabIcon(tab.id);
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
          const itemId = e.dataTransfer.getData("text/plain") || gameState.bankHeldItem;
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
      plus.ondragover = (e) => { e.preventDefault(); plus.classList.add("drag-over"); };
      plus.ondragleave = () => plus.classList.remove("drag-over");
      plus.ondrop = (e) => {
        e.preventDefault();
        plus.classList.remove("drag-over");
        const itemId = e.dataTransfer.getData("text/plain") || gameState.bankHeldItem;
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

    function updateActionProgress() {
      const action = gameState.currentAction;
      if (!action) return;

      const progressPercent = (action.progress / action.duration) * 100;

      if (action.type === "crafting") {
        const craftProgressFill = document.getElementById("craft-progress-fill");
        const craftTimer = document.getElementById("craft-timer");

        if (craftProgressFill) {
          craftProgressFill.style.width = `${Math.min(100, progressPercent)}%`;
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
        const gatheringProgressFill = document.getElementById("gathering-progress-fill");
        if (gatheringProgressFill) {
          gatheringProgressFill.style.width = `${Math.min(100, progressPercent)}%`;
        } else {
          console.warn("Gathering progress fill element not found");
        }
      } else {
        const progressElements = document.querySelectorAll(".progress-fill");
        progressElements.forEach((element) => {
          if (element.id !== "combat-progress-fill" &&
            element.id !== "craft-progress-fill" &&
            element.id !== "gathering-progress-fill") {
            element.style.width = `${progressPercent}%`;
          }
        });
      }
    }

    function updateCombatProgress() {
      const combat = gameState.combat;
      if (!combat.inCombat) return;
      const denom = combat.playerInterval || 2000;
      const numer = Math.min(denom, combat.playerTimer || 0);
      const progressPercent = (numer / denom) * 100;
      const cpf = document.getElementById("combat-progress-fill");
      if (cpf) cpf.style.width = `${progressPercent}%`;
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
        skillXpBar.style.width = `${progressPercent}%`;
      }

      const skillPageTitle = document.getElementById("skill-page-title");
      if (skillPageTitle) {
        skillPageTitle.textContent = displayName;
        document.getElementById("skill-level-display").textContent =
          skillData.level;
        document.getElementById("skill-xp-display").textContent = `${skillData.xp
          }/${getXPForLevel(skillData.level + 1)}`;
        document.getElementById(
          "skill-page-xp-bar"
        ).style.width = `${progressPercent}%`;
      }
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

    function showAreaDetail(areaId) {
      const area = gameData.areas.find((a) => a.id === areaId);
      if (!area) return;

      gameState.currentArea = area;

      document.getElementById("area-detail-title").textContent = area.name;

      const contentHeader = document.querySelector("#area-detail-page .content-header");
      let existingButton = contentHeader.querySelector(".drops-toggle-button");

      if (!existingButton) {
        const toggleButton = document.createElement("button");
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
      } else {
        existingButton.style.background = showDropPercentages ? '#2ecc71' : 'rgba(255,255,255,0.06)';
      }

      renderAreaContent(area);

      document.getElementById("areas-page").style.display = "none";
      document.getElementById("area-detail-page").style.display = "block";
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
        const hasZombies = area.factions.some(faction => faction.toLowerCase() === "zombies");
        const isOnlyZombies = area.factions.length === 1 && hasZombies;
        const isStronghold = area.description.startsWith("Stronghold") || area.description.startsWith("Infested Stronghold");

        let zoneLabels = [];

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
        const zoneLabelsHtml = zoneLabels.map((zone, index) =>
          `<div class="zone-label ${zone.type}" style="top: ${10 + (index * 30)}px;">${zone.label}</div>`
        ).join("");
        const factionSpans = area.factions.map(faction => {
          const factionClass = `faction-${faction.toLowerCase().replace(/\s+/g, '_')}`;
          return `<span class="${factionClass}">${faction}</span>`;
        }).join(", ");

        card.innerHTML = `
                  ${zoneLabelsHtml}
                  <div class="area-name">${area.name}</div>
                  <div class="area-level">Level ${area.level} Required</div>
                  <div class="area-factions">Factions: ${factionSpans}</div>
              `;

        grid.appendChild(card);
      });
    }

    function renderAreaContent(area) {
      renderGatheringResources(area);
      renderEnemies(area);
    }
    function getNodeDifficultyClass(playerLevel, requiredLevel) {
      const diff = playerLevel - requiredLevel;
      if (diff >= 10) return "level-trivial";   // much lower level than player
      if (diff >= 5) return "level-easy";      // comfortably below player
      if (diff >= -4) return "level-even";      // around the same level
      if (diff >= -9) return "level-hard";      // somewhat above player
      return "level-deadly";                    // far above player
    }

    function renderGatheringResources(area) {
      const container = document.getElementById("gathering-resources");
      container.innerHTML = "";

      if (!area.gathering) {
        const noResourcesDiv = document.createElement("div");
        noResourcesDiv.style.cssText = "color: #8b949e; text-align: center; padding: 20px;";
        noResourcesDiv.textContent = "No gathering resources available in this area.";
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

          const resource = skill.nodes.find(node => node.id === resourceId);
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
          card.className = `resource-card ${diffClass} ${canGather ? "" : "locked"}`;
          card.dataset.resourceId = resource.id;
          card.dataset.skill = skillType;

          let dropsHtml = '';
          if (showDropPercentages && resource.drops) {
            dropsHtml = '<div style="margin-top: 8px; border-top: 1px solid #555; padding-top: 5px;">';
            resource.drops.forEach(drop => {
              if (drop.rarity) {
                const dropChance = calculateRarityChance(drop.rarity, playerLevel, resource.level);
                const rarityColor = getRarityColor(drop.rarity);
                const itemName = getItemName(drop.item);
                dropsHtml += `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0; font-size: 11px;">
                      <span style="color: #bbb; cursor: help;" data-item-tooltip="${drop.item}">${itemName}</span>
                      <span style="color: ${rarityColor}; font-weight: bold; cursor: help;" title="${drop.rarity.charAt(0).toUpperCase() + drop.rarity.slice(1)}: ${(dropChance * 100).toFixed(1)}% chance (Level diff: ${playerLevel - resource.level})">${(dropChance * 100).toFixed(1)}%</span>
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

      const resource = skill.nodes.find(node => node.id === resourceId);
      if (!resource) return;

      if (resource.consumes) {
        for (const consume of resource.consumes) {
          const available = gameState.bank[consume.item] || 0;
          if (available < consume.quantity) {
            const itemName = getItemName(consume.item);
            addGatheringLog(`Need ${consume.quantity} ${itemName} to perform this action`, "log-error");
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
      const gatheringProgressFill = document.getElementById("gathering-progress-fill");
      if (gatheringProgressFill) {
        gatheringProgressFill.style.width = "0%";
      }
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
        gatheringProgress.style.display = "block";
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
          document.querySelectorAll(".resource-card").forEach(c => c.classList.remove("active"));
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

      const whitelist = area.enemyWhitelist instanceof Set ? area.enemyWhitelist : null;
      const areaLevel = area.level || 1;
      function pickFromFaction(factionId, kind, applyWhitelist = false) {
        const f = gameData.enemies && gameData.enemies[factionId];
        if (!f) return null;
        const pool = kind === 'boss' ? (f.bosses || []) : (f.regular || []);
        let candidates = pool;
        if (applyWhitelist && whitelist) candidates = pool.filter(e => whitelist.has(nf(e.name)));
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
        const cfg = (typeof AREA_REVAMP_CONFIG !== 'undefined' && area && area.id) ? AREA_REVAMP_CONFIG[area.id] : null;
        const whitelistArray = cfg && Array.isArray(cfg.enemies) ? cfg.enemies : null;

        if (whitelistArray && whitelistArray.length > 0) {
          whitelistArray.forEach((name, i) => {
            const found = findRegularEnemyByName(name);
            if (!found) {
              console.warn('Normal enemy not found for name:', name, 'in area', area.id || area.name);
              return;
            }
            const level = areaLevel + 1 + (i % 3); // cycle +1..+3 for variety
            const scaled = makeScaled(found.factionId, found.enemy, level, 'regular');
            if (scaled) out.push(scaled);
          });
          return out;
        }
        const areaFactions = (area.factions || []).map(name => NAME_TO_FACTION_ID[name] || name);
        areaFactions.forEach((fid) => {
          const levels = [areaLevel + 1, areaLevel + 2, areaLevel + 3];
          levels.forEach(L => {
            const e = pickFromFaction(fid, 'regular', true /* apply whitelist if any */);
            const scaled = makeScaled(fid, e, L, 'regular');
            if (scaled) out.push(scaled);
          });
        });
        return out;
      }

      function renderNormalEnemyList(list) {
        if (!enemyContainer) return;
        enemyContainer.innerHTML = "";
        if (!list || list.length === 0) {
          enemyContainer.innerHTML = '<div style="color: #8b949e; text-align: center; padding: 20px;">No enemies available in this area.</div>';
          return;
        }
        list.forEach(enemy => {
          const canFight = gameState.player.combatLevel >= enemy.level;
          const item = document.createElement('div');
          const factionClass = enemy.factionId ? `faction-${enemy.factionId}` : '';
          item.className = `enemy-item ${factionClass} ${canFight ? '' : 'locked'}`;
          item.dataset.enemyId = enemy.id;

          let dropsHtml = '';
          if (showDropPercentages && Array.isArray(enemy.drops) && enemy.drops.length) {
            const playerLevel = gameState.player.combatLevel;
            const enemyLevel = enemy.level || enemy.baseLevel || 1;
            dropsHtml = '<div style="margin-top: 8px; border-top: 1px solid #555; padding-top: 5px;">';
            enemy.drops.forEach(drop => {
              const itemName = getItemName(drop.item || 'scrap');
              if (drop.rarity) {
                const dropChance = calculateRarityChance(drop.rarity, playerLevel, enemyLevel);
                const rarityColor = getRarityColor(drop.rarity);
                const quantityText = drop.min && drop.max ? ` (${drop.min}-${drop.max})` : (drop.min ? ` (${drop.min})` : '');
                dropsHtml += `
                  <div style="display:flex; justify-content:space-between; align-items:center; margin:2px 0; font-size:11px;">
                    <span style="color:#bbb;">${itemName}${quantityText}</span>
                    <span style="color:${rarityColor}; font-weight:bold;">${(dropChance * 100).toFixed(1)}%</span>
                  </div>`;
              } else if (typeof drop.chance === 'number') {
                const percentage = (drop.chance * 100).toFixed(1);
                const quantityText = drop.min && drop.max ? ` (${drop.min}-${drop.max})` : (drop.min ? ` (${drop.min})` : '');
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

      const normalEnemies = buildNormalEnemies();
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
            const card = document.createElement('div');
            card.className = 'dungeon-card';
            card.dataset.dungeonId = d.id;
            const typeLabel = (d.type || 'dungeon').toUpperCase();
            const completed = (gameState.combat.dungeonCompleted || []).includes(d.id);
            const isActive = gameState.combat.inDungeon && gameState.combat.currentDungeon === d.id;
            const btnLabel = isActive ? 'Continue' : (completed ? 'Replay' : 'Start');
            if (isActive) {
              card.classList.add('active');
            }
            let primaryFaction = null;
            if (d.primaryFaction) {
              primaryFaction = d.primaryFaction;
            } else if (gameState.currentArea && gameState.currentArea.factions) {
              const areaFactions = gameState.currentArea.factions.map(name => NAME_TO_FACTION_ID[name] || name.toLowerCase());
              primaryFaction = areaFactions[0];
            }

            const primaryColor = getFactionRGBString(primaryFaction);
            const cardGradient = `background: linear-gradient(135deg, rgba(${primaryColor},0.2), rgba(128,128,128,0.1));`;
            card.style.cssText += cardGradient;

            let progressText = '';
            let enemyListHtml = '';
            if (isActive && gameState.combat.dungeonEnemies && gameState.combat.dungeonEnemies[d.id]) {
              const enemies = gameState.combat.dungeonEnemies[d.id];
              const total = enemies.length;
              const current = gameState.combat.dungeonProgress || 0;
              progressText = `<div style="font-size:11px; color:#888; margin-top:4px;">Progress: ${current + 1}/${total}</div>`;
              enemyListHtml = `
                <div style="margin-top:8px; padding:8px; background:rgba(0,0,0,0.3); border-radius:4px;">
                  <div style="font-size:11px; color:#bbb; margin-bottom:4px;">Enemy Order:</div>
                  <div style="display:flex; flex-direction:column; gap:2px;">
                    ${enemies.map((enemy, index) => {
                const isCurrent = index === current;
                const isPast = index < current;
                const color = isCurrent ? '#ff4444' : (isPast ? '#666' : '#aaa');
                const prefix = isCurrent ? '► ' : (isPast ? '✓ ' : '  ');
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

      const factionDescEl = document.getElementById("faction-description");
      if (factionDescEl) factionDescEl.textContent = area.description || '';
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

        const cpbStop = document.getElementById("combat-progress"); if (cpbStop) cpbStop.style.display = "none";
        document.getElementById("enemy-display").style.display = "none";
        const noEnemy = document.getElementById("no-enemy");
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
        attackSpeed: enemy.attackSpeed ?? 0
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
      if (noEnemy) noEnemy.style.display = "none";

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

      const combatSource = enemy.dungeonId ? 'dungeon' : 'normal';
      addCombatLog(`Combat started with ${enemy.name}! (${combatSource})`);
      showNotification(`Started fighting ${enemy.name}`);
    }

    function startDungeonRun(dungeonId) {
      stopGathering("Switched to dungeon");
      if (gameState.combat.inDungeon && gameState.combat.currentDungeon === dungeonId) {
        showNotification('Already running this dungeon');
        return;
      }
      if (gameState.combat.inDungeon && gameState.combat.currentDungeon !== dungeonId) {
        if (!confirm('You are already in a dungeon. Start a new one?')) {
          return;
        }
      }

      const area = gameState.currentArea;
      const dungeon = (area && Array.isArray(area.dungeons)) ? area.dungeons.find(d => d.id === dungeonId) : null;
      if (!dungeon) {
        showNotification('Dungeon not found', 'error');
        return;
      }
      const type = dungeon.type || (area && area.areaType === 'stronghold' && /raid/i.test(dungeon.name) ? 'raid' : 'dungeon');
      const areaLevel = (area && area.level) || 1;
      let primary, secondary;
      if (dungeon.primaryFaction) {
        primary = dungeon.primaryFaction;
        secondary = Array.isArray(dungeon.secondaryFactions) ? dungeon.secondaryFactions : [];
      } else if (Array.isArray(dungeon.enemies)) {
        const areaFactions = (area.factions || []).map(name => NAME_TO_FACTION_ID[name] || name.toLowerCase());
        primary = areaFactions[0] || 'zombies';
        secondary = areaFactions.slice(1);
        console.log('Using area factions for dungeon:', primary, secondary);
      } else {
        showNotification('Dungeon configuration error', 'error');
        console.error('Dungeon has no faction data:', dungeon);
        return;
      }
      function pickFromFactionForRun(factionId, kind) {
        const faction = gameData.enemies && gameData.enemies[factionId];
        if (!faction) {
          console.warn(`Faction ${factionId} not found for dungeon`);
          return null;
        }
        const pool = kind === 'boss' ? (faction.bosses || []) : (faction.regular || []);
        if (!pool || pool.length === 0) {
          console.warn(`No ${kind} enemies found in faction ${factionId}`);
          return null;
        }
        return pool[Math.floor(Math.random() * pool.length)];
      }
      const encounters = [];
      if (type === 'raid') {
        const levels = [areaLevel + 6, areaLevel + 8, areaLevel + 10, areaLevel + 12, areaLevel + 14, areaLevel + 16, areaLevel + 18, areaLevel + 20, areaLevel + 22];
        const slots = ['reg', 'reg', 'boss', 'reg', 'reg', 'boss', 'reg', 'reg', 'boss'];
        slots.forEach((slot, idx) => {
          const kind = slot === 'boss' ? 'boss' : 'regular';
          const usePrimary = Math.random() < 0.75 || secondary.length === 0;
          const fid = usePrimary ? primary : secondary[Math.floor(Math.random() * secondary.length)];
          const e = pickFromFactionForRun(fid, kind);
          if (!e) {
            console.warn(`Failed to generate ${kind} enemy for faction ${fid} in raid slot ${idx}`);
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
        const regLevels = [areaLevel + 2, areaLevel + 3, areaLevel + 4, areaLevel + 5, areaLevel + 6];
        regLevels.forEach(L => {
          const usePrimary = Math.random() < 0.75 || secondary.length === 0;
          const fid = usePrimary ? primary : secondary[Math.floor(Math.random() * secondary.length)];
          const e = pickFromFactionForRun(fid, 'regular');
          if (!e) {
            console.warn(`Failed to generate regular enemy for faction ${fid} at level ${L}`);
            return;
          }
          const scaled = scaleEnemyForLevel(fid, e, L, 'regular');
          if (scaled) {
            scaled.dungeonId = dungeon.id;
            scaled.kind = 'regular';
            encounters.push(scaled);
          } else {
            console.warn(`Failed to scale regular enemy for level ${L}`);
          }
        });
        const bossLevel = areaLevel + 8;
        const bossUsePrimary = Math.random() < 0.75 || secondary.length === 0;
        const bossFid = bossUsePrimary ? primary : secondary[Math.floor(Math.random() * secondary.length)];
        const bossData = pickFromFactionForRun(bossFid, 'boss');
        if (!bossData) {
          console.warn(`Failed to generate boss enemy for faction ${bossFid}`);
        } else {
          const boss = scaleEnemyForLevel(bossFid, bossData, bossLevel, 'boss');
          if (boss) {
            boss.dungeonId = dungeon.id;
            boss.kind = 'boss';
            encounters.push(boss);
          } else {
            console.warn(`Failed to scale boss enemy for level ${bossLevel}`);
          }
        }
      }

      if (!gameState.combat.dungeonEnemies) gameState.combat.dungeonEnemies = {};
      gameState.combat.dungeonEnemies[dungeonId] = encounters;
      if (!encounters || encounters.length === 0) {
        showNotification('No encounters could be generated - missing enemy data', 'error');
        console.error('No encounters generated for dungeon:', dungeonId, 'primary faction:', primary, 'secondary factions:', secondary);
        return;
      }

      console.log('Generated', encounters.length, 'encounters for dungeon:', dungeonId);
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

    function showSkillPage(skill) {
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
        "electrical"
      ];

      const passiveSkills = ["farming", "animalcare"];
      const combatSkills = ["fitness", "defense", "melee", "firearms", "explosives"];
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
    }

    function switchTab(tabName) {
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
        gameState.workshops = saveData.workshops || gameState.workshops || { tailoring: {}, firstaid: {}, forging: {}, gunsmithing: {}, carpentry: {}, tinkering: {}, cooking: {}, masonry: {}, chemistry: {}, electrical: {} };
        if (!gameState.upgrades.mining) gameState.upgrades.mining = { purchased: {} };
        if (!gameState.upgrades.mining.purchased) gameState.upgrades.mining.purchased = {};
        if (!gameState.upgrades.forestry) gameState.upgrades.forestry = { purchased: {} };
        if (!gameState.upgrades.forestry.purchased) gameState.upgrades.forestry.purchased = {};
        if (!gameState.upgrades.hunting) gameState.upgrades.hunting = { purchased: {} };
        if (!gameState.upgrades.hunting.purchased) gameState.upgrades.hunting.purchased = {};
        if (!gameState.upgrades.foraging) gameState.upgrades.foraging = { purchased: {} };
        if (!gameState.upgrades.foraging.purchased) gameState.upgrades.foraging.purchased = {};
        if (!gameState.upgrades.fishing) gameState.upgrades.fishing = { purchased: {} };
        if (!gameState.upgrades.fishing.purchased) gameState.upgrades.fishing.purchased = {};
        if (!gameState.upgrades.scavenging) gameState.upgrades.scavenging = { purchased: {} };
        if (!gameState.upgrades.scavenging.purchased) gameState.upgrades.scavenging.purchased = {};
        if (!gameState.upgrades.looting) gameState.upgrades.looting = { purchased: {} };
        if (!gameState.upgrades.looting.purchased) gameState.upgrades.looting.purchased = {};
        if (!gameState.upgrades.tailoring) gameState.upgrades.tailoring = { purchased: {} };
        if (!gameState.upgrades.tailoring.purchased) gameState.upgrades.tailoring.purchased = {};
        if (!gameState.upgrades.firstaid) gameState.upgrades.firstaid = { purchased: {} };
        if (!gameState.upgrades.firstaid.purchased) gameState.upgrades.firstaid.purchased = {};
        if (!gameState.upgrades.forging) gameState.upgrades.forging = { purchased: {} };
        if (!gameState.upgrades.forging.purchased) gameState.upgrades.forging.purchased = {};
        if (!gameState.upgrades.gunsmithing) gameState.upgrades.gunsmithing = { purchased: {} };
        if (!gameState.upgrades.gunsmithing.purchased) gameState.upgrades.gunsmithing.purchased = {};
        if (!gameState.upgrades.carpentry) gameState.upgrades.carpentry = { purchased: {} };
        if (!gameState.upgrades.carpentry.purchased) gameState.upgrades.carpentry.purchased = {};
        if (!gameState.upgrades.tinkering) gameState.upgrades.tinkering = { purchased: {} };
        if (!gameState.upgrades.tinkering.purchased) gameState.upgrades.tinkering.purchased = {};
        if (!gameState.workshops) gameState.workshops = { tailoring: {}, firstaid: {}, forging: {}, gunsmithing: {}, carpentry: {}, tinkering: {}, cooking: {}, masonry: {}, chemistry: {}, electrical: {} };
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
          gameState.combat.currentDungeon = saveData.dungeonState.currentDungeon || null;
          gameState.combat.dungeonProgress = saveData.dungeonState.dungeonProgress || 0;
          gameState.combat.dungeonEnemies = saveData.dungeonState.dungeonEnemies || {};
        }

        updateCombatLevel();
        updatePlayerStats();
        Object.keys(gameState.bank).forEach(id => {
          const existing = gameState.bankPlacement[id];
          const targetTab = existing && gameState.bankTabs.find(t => t.id === existing.tabId) ? existing.tabId : "all";
          if (!existing || targetTab === "all") {
            gameState.bankPlacement[id] = { tabId: targetTab, slot: findNextFreeSlot(targetTab) };
          } else {
            const cap = targetTab === 'all' ? BANK_CAPACITY_SLOTS : getTabCapacity(targetTab);
            const desiredSlot = Math.max(0, Math.min(cap - 1, existing.slot || 0));
            const conflict = Object.entries(gameState.bankPlacement).find(([otherId, p]) => otherId !== id && p.tabId === targetTab && p.slot === desiredSlot && (gameState.bank[otherId] || 0) > 0);
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
        Object.keys(gameState.bank).forEach(id => {
          if (!gameState.bankPlacement[id]) {
            const tabId = inferTabForItem(id);
            gameState.bankPlacement[id] = { tabId, slot: findNextFreeSlot(tabId) };
          }
        });
        renderBank();
      }
    }

    function resetGame() {
      const proceed = confirm("This will erase your current progress and start a fresh game. Continue?");
      if (!proceed) return;

      try {
        localStorage.removeItem("postApocalypticIdleSave");
      } catch (_) { /* ignore */ }
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

    function addToMessageLog(message, type = "info") {
      showNotification(message);

      const className = type === "error" ? "log-error" : type === "success" ? "log-success" : "";
      addGatheringLog(message, className);
    }

    function showSkillGatheringPage(skill) {
      const skillPage = document.getElementById("skill-page");
      const skillContent = document.getElementById("skill-content");

      skillContent.innerHTML = "";

      const toggleContainer = document.createElement("div");
      toggleContainer.style.cssText = "margin-bottom: 15px; text-align: center;";

      const toggleButton = document.createElement("button");
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

            const resource = skillData.nodes.find(node => node.id === resourceId);
            if (!resource) {
              console.warn(`Resource not found: ${resourceId} in skill ${skill}`);
              return;
            }

            const requiredLevel = resource.level;
            const playerLevel = gameState.skills[skill].level;
            const canGather = playerLevel >= requiredLevel;
            const isAreaUnlocked = gameState.player.combatLevel >= area.level;

            const card = document.createElement("div");
            const diffClass = getNodeDifficultyClass(playerLevel, requiredLevel);
            card.className = `resource-card ${diffClass} ${canGather && isAreaUnlocked ? "" : "locked"}`;

            let dropsHtml = '';
            if (showDropPercentages && resource.drops) {
              const playerLevelLocal = gameState.skills[skill].level;
              dropsHtml = '<div style="margin-top: 8px; border-top: 1px solid #555; padding-top: 5px;">';
              resource.drops.forEach(drop => {
                if (drop.rarity) {
                  const dropChance = calculateRarityChance(drop.rarity, playerLevelLocal, resource.level);
                  const rarityColor = getRarityColor(drop.rarity);
                  const itemName = getItemName(drop.item);
                  const quantityText = drop.min && drop.max ? ` (${drop.min}-${drop.max})` : '';
                  dropsHtml += `
                      <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0; font-size: 11px;">
                        <span style="color: #bbb; cursor: help;" data-item-tooltip="${drop.item}">${itemName}${quantityText}</span>
                        <span style="color: ${rarityColor}; font-weight: bold; cursor: help;" title="${drop.rarity.charAt(0).toUpperCase() + drop.rarity.slice(1)}: ${(dropChance * 100).toFixed(1)}% chance (Level diff: ${playerLevelLocal - resource.level})">${(dropChance * 100).toFixed(1)}%</span>
                      </div>
                    `;
                } else if (drop.chance) {
                  const percentage = (drop.chance * 100).toFixed(1);
                  const itemName = getItemName(drop.item);
                  const quantityText = drop.min && drop.max ? ` (${drop.min}-${drop.max})` : '';
                  dropsHtml += `
                      <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0; font-size: 11px;">
                        <span style="color: #bbb; cursor: help;" data-item-tooltip="${drop.item}">${itemName}${quantityText}</span>
                        <span style="color: #238636; font-weight: bold;">${percentage}%</span>
                      </div>
                    `;
                }
              });
              dropsHtml += '</div>';
            }

            card.innerHTML = `
                          <h4>${resource.name || 'Unknown Resource'}</h4>
                          <div>Level ${requiredLevel} ${skill}</div>
                          <div>${resource.xp || 0} XP</div>
                          <div>${(resource.time ? resource.time / 1000 : 0).toFixed(
              1
            )}s per action</div>
                          <div style="font-size: 12px; color: #8b949e; margin-top: 8px;">${area.name
              }</div>
                          ${dropsHtml}
                          <div style="font-size: 10px; color: var(--brand); margin-top: 5px;">${canGather && isAreaUnlocked
                ? "Click to go to area"
                : isAreaUnlocked
                  ? "Level too low"
                  : "Area locked"
              }</div>
                      `;

            if (canGather && isAreaUnlocked) {
              card.style.cursor = "pointer";
              card.addEventListener("click", () => {
                currentSkill = null;

                document.querySelectorAll(".page-content").forEach((page) => {
                  page.style.display = "none";
                });

                document.querySelectorAll(".nav-item").forEach((item) => {
                  item.classList.remove("active");
                });

                const areasNavItem = document.querySelector(
                  '[data-page="areas"]'
                );
                if (areasNavItem) {
                  areasNavItem.classList.add("active");
                }

                showAreaDetail(area.id);

                switchTab("gathering");

                setTimeout(() => {
                  const resourceCard = document.querySelector(
                    `[data-resource-id="${resource.id}"][data-skill="${skill}"]`
                  );
                  if (
                    resourceCard &&
                    !resourceCard.classList.contains("locked")
                  ) {
                    selectResource(resourceCard, resource, skill);
                  }
                }, 200);
              });
            } else {
              card.style.cursor = "not-allowed";
              card.style.opacity = "0.6";
            }

            nodesGrid.appendChild(card);
          });
        }
      });

      if (nodesGrid.children.length === 0) {
        const noNodesMsg = document.createElement("div");
        noNodesMsg.style.textAlign = "center";
        noNodesMsg.style.color = "#8b949e";
        noNodesMsg.style.padding = "40px";
        noNodesMsg.textContent = `No ${skill} nodes available yet. Explore more areas!`;
        skillContent.appendChild(noNodesMsg);
      } else {
        skillContent.appendChild(nodesGrid);
      }
    }

    function showCombatSkillPage(skill) {
      const skillPage = document.getElementById("skill-page");
      const skillContent = document.getElementById("skill-content");
      skillContent.innerHTML = "";

      const getLevel = (s) => (gameState.skills[s]?.level || 0);
      const Lf = getLevel("fitness");
      const Ld = getLevel("defense");
      const Lm = getLevel("melee");
      const Lr = getLevel("firearms");
      const Le = getLevel("explosives");

      const wrap = document.createElement("div");
      wrap.style.cssText = "display:flex; flex-direction:column; gap:12px; max-width:720px; margin:0 auto;";

      const mkCard = (titleText, rows) => {
        const card = document.createElement("div");
        card.className = "resource-card";
        card.style.padding = "12px";
        const title = document.createElement("div");
        title.style.cssText = "color: var(--brand); margin-bottom: 8px; font-weight: 600;";
        title.textContent = titleText;
        card.appendChild(title);
        rows.forEach(([label, value]) => {
          const line = document.createElement("div");
          line.style.cssText = "display:flex; justify-content:space-between; font-size:13px; color:#c9d1d9; margin:2px 0;";
          const l = document.createElement("span"); l.textContent = label;
          const v = document.createElement("span"); v.textContent = value; v.style.color = "#8b949e";
          line.appendChild(l); line.appendChild(v); card.appendChild(line);
        });
        return card;
      };
      const L = getLevel(skill);
      const currentRows = [];
      if (skill === "fitness") {
        const hp = Math.floor(25 * Math.pow(1 + L, 0.9));
        const regen = 0.5 * Math.pow(1 + L, 0.4);
        const status = 2 * Math.pow(1 + L, 0.3);
        currentRows.push(["HP", `+${hp} - (HP = 25 × (1 + Level)^0.9)`]);
        currentRows.push(["HP Regeneration", `+${regen.toFixed(2)} per second - (HP_Regen = 0.5 × (1 + Level)^0.4)`]);
        currentRows.push(["Status Resistance", `+${Math.round(status)}% - (Status_Resistance = 2 × (1 + Level)^0.3)`]);
      } else if (skill === "defense") {
        const def = Math.floor(3 * Math.pow(1 + L, 0.8));
        const dr = 1 * Math.pow(1 + L, 0.35);
        const block = 1 * Math.pow(1 + L, 0.25);
        currentRows.push(["Defense", `+${def} - (Defense = 3 × (1 + Level)^0.8)`]);
        currentRows.push(["Damage Reduction", `+${dr.toFixed(2)}% - (Damage_Reduction = 1 × (1 + Level)^0.35)`]);
        currentRows.push(["Block Chance", `+${block.toFixed(2)}% - (Block_Chance = 1 × (1 + Level)^0.25)`]);
      } else if (skill === "melee") {
        const atk = Math.floor(4 * Math.pow(1 + L, 0.75));
        const acc = Math.floor(5 * Math.pow(1 + L, 0.6));
        const crit = 1 * Math.pow(1 + L, 0.4);
        const spd = 2 * Math.pow(1 + L, 0.35);
        currentRows.push(["Attack", `+${atk} - (Attack = 4 × (1 + Level)^0.75)`]);
        currentRows.push(["Accuracy", `+${acc} - (Accuracy = 5 × (1 + Level)^0.6)`]);
        currentRows.push(["Critical", `+${Math.min(95, crit).toFixed(2)}% - (Critical = 1 × (1 + Level)^0.4)`]);
        currentRows.push(["Attack Speed", `+${Math.round(spd)}% - (Attack_Speed = 2 × (1 + Level)^0.35)`]);
      } else if (skill === "firearms") {
        const atk = Math.floor(3 * Math.pow(1 + L, 0.7));
        const acc = Math.floor(8 * Math.pow(1 + L, 0.65));
        const crit = 1 * Math.pow(1 + L, 0.4);
        const spd = 2 * Math.pow(1 + L, 0.35);
        currentRows.push(["Attack", `+${atk} - (Attack = 3 × (1 + Level)^0.7)`]);
        currentRows.push(["Accuracy", `+${acc} - (Accuracy = 8 × (1 + Level)^0.65)`]);
        currentRows.push(["Critical", `+${Math.min(95, crit).toFixed(2)}% - (Critical = 1 × (1 + Level)^0.4)`]);
        currentRows.push(["Attack Speed", `+${Math.round(spd)}% - (Attack_Speed = 2 × (1 + Level)^0.35)`]);
      } else if (skill === "explosives") {
        const atk = Math.floor(6 * Math.pow(1 + L, 0.8));
        const pen = 3 * Math.pow(1 + L, 0.5);
        const crit = 2 * Math.pow(1 + L, 0.45);
        const elem = 5 * Math.pow(1 + L, 0.3);
        currentRows.push(["Attack", `+${atk} - (Attack = 6 × (1 + Level)^0.8)`]);
        currentRows.push(["Armor Penetration", `+${Math.round(pen)}% - (Armor_Penetration = 3 × (1 + Level)^0.5)`]);
        currentRows.push(["Critical", `+${Math.min(95, crit).toFixed(2)}% - (Critical = 2 × (1 + Level)^0.45)`]);
        currentRows.push(["Elemental_Status_Chance", `${Math.round(elem)} - (Elemental_Status_Chance = 5 × (1 + Level)^0.3)`]);
      }

      const friendly = skill === "firearms" ? "Ranged" : (skill.charAt(0).toUpperCase() + skill.slice(1));
      wrap.appendChild(mkCard(`${friendly}: Current bonuses (Level ${L})`, currentRows));
      const milestoneWrap = document.createElement("div");
      milestoneWrap.className = "resource-card";
      milestoneWrap.style.padding = "12px";
      const mt = document.createElement("div");
      mt.style.cssText = "color: var(--brand); margin-bottom: 8px; font-weight: 600;";
      mt.textContent = `${friendly}: Milestone bonuses`;
      milestoneWrap.appendChild(mt);
      const ul = document.createElement("ul");
      ul.style.cssText = "margin: 0; padding-left: 18px; color: #c9d1d9;";
      const addLi = (text) => { const li = document.createElement("li"); li.textContent = text; ul.appendChild(li); };
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
      } else if (skill === "melee") {
        addLi("Level 25: +5% Critical Hit Chance");
        addLi("Level 50: +10% Attack Speed");
        addLi("Level 75: +15% Critical Hit Damage (1.65x instead of 1.5x)");
        addLi("Level 99: +20% Attack Speed, Chance for Double Attack");
      } else if (skill === "firearms") {
        addLi("Level 25: +10% Accuracy");
        addLi("Level 50: +5% Critical Hit Chance");
        addLi("Level 75: +15% Attack Speed, Piercing Shots (hit 2 enemies)");
        addLi("Level 99: +25% Accuracy, Always hit if target accuracy < yours");
      } else if (skill === "explosives") {
        addLi("Level 25: +15% Armor Penetration");
        addLi("Level 50: +10% Elemental Status Chance");
        addLi("Level 75: +10% Critical Chance, Burn Effect (3 turns)");
        addLi("Level 99: +20% Elemental Status Chance");
      }
      milestoneWrap.appendChild(ul);
      wrap.appendChild(milestoneWrap);

      skillContent.appendChild(wrap);
    }

    function showSkillCraftingPage(skill) {
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

      const playerLevel = gameState.skills[skill].level;

      skillData.recipes.forEach((recipe) => {
        const canCraft = playerLevel >= recipe.level;
        let hasStation = true;
        if (recipe.station && (skill === 'tailoring' || skill === 'firstaid' || skill === 'forging' || skill === 'gunsmithing' || skill === 'carpentry' || skill === 'tinkering')) {
          const ws = (gameState.workshops && gameState.workshops[skill]) || {};
          hasStation = !!ws[recipe.station];
        }

        const card = document.createElement("div");
        card.className = "resource-card";
        card.style.cssText = `
            margin-bottom: 10px; 
            cursor: ${canCraft ? 'pointer' : 'not-allowed'}; 
            opacity: ${(canCraft && hasStation) ? 1 : 0.4};
            border-left: 4px solid ${(canCraft && hasStation) ? 'var(--brand)' : 'rgba(255,255,255,0.08)'};
            background: ${(canCraft && hasStation) ? 'rgba(255,255,255,0.06)' : 'rgba(127, 140, 141, 0.2)'};
          `;

        const resultName = recipe.randomResult && recipe.randomResult.type === 'bar'
          ? 'Random Bar'
          : getItemName(recipe.result.item);

        card.innerHTML = `
            <h4 style="color: ${canCraft ? '#fff' : '#8b949e'};">${recipe.name}</h4>
            <div style="font-size: 12px; color: ${(canCraft && hasStation) ? '#8b949e' : '#555'};">Level ${recipe.level} ${skill} ${(canCraft ? '' : '(LOCKED)')} ${((skill === 'tailoring' || skill === 'firstaid' || skill === 'forging' || skill === 'gunsmithing' || skill === 'carpentry' || skill === 'tinkering') && recipe.station && !hasStation) ? `• Requires: ${getWorkshopName(recipe.station, skill)} (LOCKED)` : ''}</div>
            <div style="font-size: 12px; color: ${canCraft ? '#238636' : '#8b949e'};">Creates: ${recipe.result.quantity}x ${resultName}</div>
            <div style="font-size: 12px; color: ${canCraft ? '#2ecc71' : '#8b949e'};">${recipe.xp} XP • ${(recipe.time / 1000).toFixed(1)}s</div>
          `;

        if (canCraft && hasStation) {
          card.addEventListener("click", () => {
            selectRecipe(recipe, skill, canCraft);
          });
        } else {
          card.addEventListener("click", () => {
            if (!canCraft) {
              addToMessageLog(`Requires level ${recipe.level} ${skill}. Your level: ${playerLevel}`, "error");
            } else if ((skill === 'tailoring' || skill === 'firstaid' || skill === 'forging' || skill === 'gunsmithing' || skill === 'carpentry' || skill === 'tinkering') && recipe.station && !hasStation) {
              addToMessageLog(`Requires ${getWorkshopName(recipe.station, skill)} for this recipe.`, "error");
            }
          });
        }

        recipeList.appendChild(card);
      });

      craftingContainer.appendChild(recipeList);
      craftingContainer.appendChild(craftingArea);
      skillContent.appendChild(craftingContainer);
    }

    function selectRecipe(recipe, skill, canCraft) {
      const selectedRecipeDiv = document.getElementById("selected-recipe");
      const playerLevel = gameState.skills[skill].level;

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

      let hasAllMaterials = true;
      if ((skill === 'tailoring' || skill === 'firstaid' || skill === 'forging' || skill === 'gunsmithing' || skill === 'carpentry' || skill === 'tinkering') && recipe.station) {
        const ws = (gameState.workshops && gameState.workshops[skill]) || {};
        const hasStation = !!ws[recipe.station];
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
      let missingMaterials = [];
      let materialsHtml = "";

      const selectionsForRecipe = materialSelections[recipe.id] || (materialSelections[recipe.id] = {});

      if (recipe.materials) {
        recipe.materials.forEach((material, idx) => {
          if (material.item) {
            const playerAmount = gameState.bank[material.item] || 0;
            const hasEnough = playerAmount >= material.quantity;
            if (!hasEnough) {
              hasAllMaterials = false;
              const needed = material.quantity - playerAmount;
              const itemName = getItemName(material.item);
              missingMaterials.push(`${needed}x ${itemName}`);
            }

            const itemName = getItemName(material.item);
            const color = hasEnough ? '#2ecc71' : 'var(--brand)';
            materialsHtml += `
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>${itemName}</span>
                <span style="color: ${color};">${playerAmount}/${material.quantity}</span>
              </div>
            `;
            return;
          }
          const jtype = material.junktype;
          const ownedEligible = Object.keys(gameData.items || {})
            .filter(id => (gameData.items[id] && gameData.items[id].junktype === jtype) && (gameState.bank[id] || 0) > 0)
            .map(id => ({ id, name: getItemName(id), count: gameState.bank[id] || 0 }));

          let selectedId = selectionsForRecipe[idx];
          if (!selectedId) {
            selectedId = ownedEligible.length > 0 ? ownedEligible[0].id : null;
            selectionsForRecipe[idx] = selectedId || null;
          }

          const selectedCount = selectedId ? (gameState.bank[selectedId] || 0) : 0;
          const qty = material.quantity || 1;
          const hasEnough = selectedCount >= qty;
          if (!hasEnough) {
            hasAllMaterials = false;
            missingMaterials.push(`${qty}x ${jtype} junk`);
          }

          const color = hasEnough ? '#2ecc71' : 'var(--brand)';
          const label = `${jtype.charAt(0).toUpperCase()}${jtype.slice(1)} Junk`;
          const selectId = `material-select-${recipe.id}-${idx}`;
          const countId = `material-count-${recipe.id}-${idx}`;

          const optionsHtml = ownedEligible.map(opt => `
            <option value="${opt.id}" ${opt.id === selectedId ? 'selected' : ''}>${opt.name} (${opt.count})</option>
          `).join('');

          const selectHtml = ownedEligible.length > 0 ? `
            <select id="${selectId}" data-role="material-select" data-recipe="${recipe.id}" data-index="${idx}" style="width: 100%; padding: 6px; border-radius: 4px; background: rgba(255,255,255,0.06); color: #e6edf3; border: 1px solid rgba(255,255,255,0.08);">
              ${optionsHtml}
            </select>
          ` : `
            <select id="${selectId}" disabled style="width: 100%; padding: 6px; border-radius: 4px; background: rgba(127,140,141,0.2); color: #8b949e; border: 1px solid rgba(255,255,255,0.08);">
              <option>(No ${label} owned)</option>
            </select>
          `;

          materialsHtml += `
            <div style="margin: 8px 0;">
              <div style="display:flex; justify-content: space-between; align-items:center; margin-bottom: 6px;">
                <span>${label}</span>
                <span id="${countId}" style="color: ${color};">${selectedCount}/${qty}</span>
              </div>
              ${selectHtml}
            </div>
          `;
        });
      }

      const resultName = recipe.randomResult && recipe.randomResult.type === 'bar'
        ? 'Random Bar'
        : getItemName(recipe.result.item);

      if (!hasAllMaterials) {
        selectedRecipeDiv.innerHTML = `
            <div style="text-align: center;">
              <h4 style="color: #238636; margin-bottom: 15px;">${recipe.name}</h4>
              ${(skill === 'tailoring' || skill === 'firstaid' || skill === 'forging' || skill === 'gunsmithing' || skill === 'carpentry' || skill === 'tinkering') && recipe.station ? `<div style=\"color:#8b949e; font-size:12px; margin-bottom:8px;\">Station: ${getWorkshopName(recipe.station, skill)}</div>` : ''}
              <div style="color: var(--brand); margin-bottom: 15px;">Missing Materials:</div>
              <div style="color: var(--brand); margin-bottom: 20px;">${missingMaterials.join(', ')}</div>
              <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 15px;">
                <div style="color: #8b949e; margin-bottom: 10px;">Required Materials:</div>
                ${materialsHtml}
              </div>
            </div>
          `;

        addToMessageLog(`Missing materials: ${missingMaterials.join(', ')}`, "error");
        return;
      }

      selectedRecipeDiv.innerHTML = `
          <div style="text-align: center;">
            <h4 style="color: #238636; margin-bottom: 15px;">${recipe.name}</h4>
            ${(skill === 'tailoring' || skill === 'firstaid' || skill === 'forging' || skill === 'gunsmithing' || skill === 'carpentry' || skill === 'tinkering') && recipe.station ? `<div style=\"color:#8b949e; font-size:12px; margin-bottom:8px;\">Station: ${getWorkshopName(recipe.station, skill)}</div>` : ''}
            <div style="color: #2ecc71; margin-bottom: 15px;">
              Creates: ${recipe.result.quantity}x ${resultName}
            </div>
            <div style="color: var(--brand); margin-bottom: 15px;">
              ${recipe.xp} XP • ${(recipe.time / 1000).toFixed(1)} seconds
            </div>
            <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 15px; margin-bottom: 20px;">
              <div style="color: #8b949e; margin-bottom: 10px;">Required Materials:</div>
              ${materialsHtml}
            </div>
            <button id="craft-button" style="
              background: #2ecc71; 
              color: #e6edf3; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 5px; 
              cursor: pointer; 
              font-size: 14px;
              font-weight: bold;
            ">Start Crafting</button>
          </div>
        `;
      const selects = selectedRecipeDiv.querySelectorAll('select[data-role="material-select"]');
      selects.forEach(sel => {
        sel.addEventListener('change', (e) => {
          const rid = sel.getAttribute('data-recipe');
          const idx = sel.getAttribute('data-index');
          const val = sel.value;
          if (!materialSelections[rid]) materialSelections[rid] = {};
          materialSelections[rid][idx] = val;
          const countId = `material-count-${rid}-${idx}`;
          const qty = (recipe.materials && recipe.materials[idx] && (recipe.materials[idx].quantity || 1)) || 1;
          const newCount = gameState.bank[val] || 0;
          const el = document.getElementById(countId);
          if (el) {
            el.textContent = `${newCount}/${qty}`;
            el.style.color = (newCount >= qty) ? '#2ecc71' : 'var(--brand)';
          }
        });
      });

      document.getElementById("craft-button").addEventListener("click", () => {
        const resolved = JSON.parse(JSON.stringify(recipe));
        if (resolved.materials) {
          for (let i = 0; i < resolved.materials.length; i++) {
            const mat = resolved.materials[i];
            if (mat && mat.junktype) {
              const sel = (materialSelections[recipe.id] || {})[i];
              if (!sel) {
                addToMessageLog(`Choose a ${mat.junktype} junk item to use.`, "error");
                return;
              }
              const qty = mat.quantity || 1;
              const have = gameState.bank[sel] || 0;
              if (have < qty) {
                addToMessageLog(`Not enough of selected item. Need ${qty}.`, "error");
                return;
              }
              resolved.materials[i] = { item: sel, quantity: qty };
            }
          }
        }
        startCrafting(resolved, skill);
      });
    }

    function startCrafting(recipe, skill) {
      if (gameState.currentAction) {
        addToMessageLog("Already busy with another action.", "error");
        return;
      }

      const playerLevel = gameState.skills[skill].level;

      if (playerLevel < recipe.level) {
        addToMessageLog(`Need level ${recipe.level} ${skill} to craft this recipe.`, "error");
        return;
      }

      if ((skill === 'tailoring' || skill === 'firstaid' || skill === 'forging' || skill === 'gunsmithing' || skill === 'carpentry' || skill === 'tinkering') && recipe.station) {
        const ws = (gameState.workshops && gameState.workshops[skill]) || {};
        if (!ws[recipe.station]) {
          addToMessageLog(`Requires ${getWorkshopName(recipe.station, skill)} to craft this.`, "error");
          return;
        }
      }

      let hasAllMaterials = true;
      let missingMaterials = [];

      if (recipe.materials) {
        recipe.materials.forEach((material) => {
          const playerAmount = gameState.bank[material.item] || 0;
          if (playerAmount < material.quantity) {
            hasAllMaterials = false;
            const needed = material.quantity - playerAmount;
            const itemName = getItemName(material.item);
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

      const craftProgressFill = document.getElementById("craft-progress-fill");
      const craftTimer = document.getElementById("craft-timer");
      if (craftProgressFill) {
        craftProgressFill.style.width = "0%";
      }
      if (craftTimer) {
        craftTimer.textContent = `${(recipe.time / 1000).toFixed(1)}s remaining`;
      }

      const selectedRecipeDiv = document.getElementById("selected-recipe");
      const craftingProgress = document.getElementById("crafting-progress");
      const itemName = recipe.randomResult && recipe.randomResult.type === 'bar'
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
        const cancelBtn = document.getElementById("cancel-crafting-btn");
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

    function getWorkshopName(id, forSkill = 'tailoring') {
      const list = (gameData.upgrades && gameData.upgrades[forSkill] && gameData.upgrades[forSkill].workshops) || [];
      const f = list.find(w => w.id === id);
      return f ? f.name : id;
    }

    function cancelCrafting() {
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
    }

    window.cancelCrafting = cancelCrafting;

    function showSkillPassivePage(skill) {
      const skillPage = document.getElementById("skill-page");
      const skillContent = document.getElementById("skill-content");

      skillContent.innerHTML = "";

      const passiveContainer = document.createElement("div");
      passiveContainer.style.cssText = "padding: 20px;";

      const skillTitle = document.createElement("h3");
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

    function showFarmingInterface(container) {
      const playerLevel = gameState.skills.farming.level;
      const unlockedPlots = getUnlockedPlots(playerLevel);
      const plotTypeNames = { herb: "Herb Plot", garden: "Garden Plot", tree: "Tree Plot", mushroom: "Mushroom Log" };

      const plotsSection = document.createElement("div");
      plotsSection.style.cssText = "margin-bottom: 30px;";

      const plotsTitle = document.createElement("h4");
      plotsTitle.textContent = "Farm Plots";
      plotsTitle.style.cssText = "color: var(--brand); margin-bottom: 15px;";
      plotsSection.appendChild(plotsTitle);

      const plotsGrid = document.createElement("div");
      plotsGrid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;";

      FARMING_DATA.plots.forEach((plot, index) => {
        const isUnlocked = index < unlockedPlots;
        const plotCard = document.createElement("div");
        plotCard.className = "resource-card";

        const plotState = gameState.farming.unlockedPlots.find(p => p.name === plot.name);
        const isPlanted = plotState && plotState.plantedSeed;

        plotCard.style.cssText = `
            background: ${isUnlocked ? 'rgba(40, 167, 69, 0.2)' : 'rgba(255,255,255,0.06)'};
            border: 1px solid ${isUnlocked ? 'var(--brand)' : 'rgba(255,255,255,0.08)'};
            opacity: ${isUnlocked ? '1' : '0.6'};
            cursor: ${isUnlocked ? 'pointer' : 'default'};
            min-height: 220px;
          `;

        const compatibleSeeds = getCompatibleSeeds(plot.type, playerLevel);
        const hasSeeds = compatibleSeeds.length > 0;

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
      });

      plotsSection.appendChild(plotsGrid);
      container.appendChild(plotsSection);


    }

    function updateFarmingProgressBars() {
      const currentTime = Date.now();

      gameState.farming.unlockedPlots.forEach((plot, index) => {
        if (plot.plantedSeed) {
          const progressElement = document.getElementById(`farming-progress-${index}`);
          if (progressElement && plot.lastHarvest) {
            const timePassed = currentTime - plot.lastHarvest;
            const seedTime = plot.plantedSeed.time;
            const progress = Math.min(100, (timePassed / seedTime) * 100);
            progressElement.style.width = `${progress}%`;
          }
        }
      });
    }

    function getCompatibleSeeds(plotType, playerLevel) {
      const seeds = FARMING_DATA.seeds[plotType] || [];
      return seeds.filter(seed => {
        const playerHas = gameState.bank[seed.id] || 0;
        return playerHas > 0 && playerLevel >= seed.level;
      });
    }

    function selectSeedForPlot(plotName, plotType, plotIndex) {
      const playerLevel = gameState.skills.farming.level;
      const compatibleSeeds = getCompatibleSeeds(plotType, playerLevel);

      if (compatibleSeeds.length === 0) {
        showNotification("No compatible seeds available!", "error");
        return;
      }

      const modal = document.createElement("div");
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

      const modalContent = document.createElement("div");
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

      const seedGrid = modalContent.querySelector("#seed-selection-grid");

      compatibleSeeds.forEach(seed => {
        const playerHas = gameState.bank[seed.id] || 0;
        const seedOption = document.createElement("div");
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

    function plantSeed(plotIndex, seed) {
      if (gameState.bank[seed.id] > 0) {
        gameState.bank[seed.id]--;
        if (gameState.bank[seed.id] === 0) {
          delete gameState.bank[seed.id];
        }
      }

      const plotData = FARMING_DATA.plots[plotIndex];
      let plotState = gameState.farming.unlockedPlots.find(p => p.name === plotData.name);

      if (!plotState) {
        plotState = {
          id: `plot_${plotData.requiredLevel}`,
          name: plotData.name,
          icon: plotData.icon,
          requiredLevel: plotData.requiredLevel,
          type: plotData.type,
          interval: plotData.interval,
          output: plotData.output,
          seed: null,
          progress: 0,
          lastHarvest: Date.now()
        };
        gameState.farming.unlockedPlots.push(plotState);
      }

      plotState.plantedSeed = seed;
      plotState.lastPlanted = Date.now();

      showNotification(`Planted ${seed.name} in ${plotData.name}!`, "success");
      renderBank();

      showSkillPage("farming");
    }

    function removePlantedSeed(plotIndex) {
      const plotData = FARMING_DATA.plots[plotIndex];
      const plotState = gameState.farming.unlockedPlots.find(p => p.name === plotData.name);

      if (plotState && plotState.plantedSeed) {
        showNotification(`Removed ${plotState.plantedSeed.name} from ${plotData.name}.`, "info");
        plotState.plantedSeed = null;
        plotState.lastPlanted = null;

        showSkillPage("farming");
      }
    }

    window.selectSeedForPlot = selectSeedForPlot;
    window.removePlantedSeed = removePlantedSeed;

    function initializeShop() {
      setupShopTabs();
      showShopTab('general');
    }

    function setupShopTabs() {
      document.querySelectorAll('.tab[data-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
          const tabName = tab.dataset.tab;
          showShopTab(tabName);
        });
      });
    }

    function showShopTab(tabName) {
      document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
          tab.classList.add('active');
        }
      });

      const shopItems = document.getElementById('shop-items');
      shopItems.innerHTML = '';

      switch (tabName) {
        case 'general':
          showGeneralShopItems(shopItems);
          break;
        case 'equipment':
          showEquipmentShopItems(shopItems);
          break;
        case 'upgrades':
          showUpgradesShopItems(shopItems);
          break;
      }
    }

    function showGeneralShopItems(container) {
      const animalsSection = document.createElement('div');
      animalsSection.style.cssText = 'margin-bottom: 40px; grid-column: 1 / -1; width: 100%;';

      const animalsTitle = document.createElement('h3');
      animalsTitle.textContent = 'Animals';
      animalsTitle.style.cssText = 'color: var(--brand); margin-bottom: 20px; text-align: center;';
      animalsSection.appendChild(animalsTitle);

      const animalsGrid = document.createElement('div');
      animalsGrid.className = 'shop-animals-grid';

      const structureTypes = {
        pen: { name: "Pen Animals", icon: "🐄", color: "var(--brand)" },
        coop: { name: "Coop Animals", icon: "🐔", color: "#238636" },
        hutch: { name: "Hutch Animals", icon: "🐰", color: "#9b59b6" },
        insect: { name: "Insect House", icon: "🐝", color: "#f1c40f" }
      };

      Object.entries(structureTypes).forEach(([structureType, typeInfo]) => {
        const animals = ANIMAL_CARE_DATA.animals[structureType];
        if (!animals || animals.length === 0) return;

        animals.forEach(animal => {
          const animalCard = document.createElement('div');
          animalCard.className = 'resource-card shop-animal-card';
          animalCard.style.cssText = `border: 1px solid ${typeInfo.color};`;

          const playerLevel = gameState.skills.animalcare.level;
          const price = typeof animal.price === 'number' ? animal.price : Infinity; // if price absent, block purchase
          const timeMs = typeof animal.time === 'number' ? animal.time : 4 * 60 * 60 * 1000; // default 4h
          const icon = animal.icon || '🐾';
          const canPurchase = playerLevel >= animal.level && (gameState.bank.coins || 0) >= price && isFinite(price);

          const producesChips = animal.produces.map(item => {
            const itemName = getItemName(item);
            return `<span class="chip">${itemName}</span>`;
          }).join('');

          animalCard.innerHTML = `
              <div class="animal-card-header">
                <div class="animal-icon">${icon}</div>
                <h4 class="animal-name" style="color: ${typeInfo.color};">${animal.name}</h4>
              </div>

              <div class="animal-meta">
                <div><span class="meta-label">Lvl</span> ${animal.level}</div>
                <div><span class="meta-label">Cost</span> 💰 ${isFinite(price) ? price : 'N/A'}</div>
                <div><span class="meta-label">Prod</span> ${(timeMs / 3600000).toFixed(1)}h</div>
              </div>

              <div class="animal-produces">
                <div class="label">Produces</div>
                <div class="chips">${producesChips}</div>
              </div>

              <div class="animal-actions">
                <button class="action-button shop-buy" onclick="purchaseAnimal('${animal.id}', '${structureType}', ${isFinite(price) ? price : 0}, ${animal.level})" ${!canPurchase ? 'disabled' : ''}>
                  ${canPurchase ? 'Purchase' : (playerLevel < animal.level ? 'Level Too Low' : 'Not Enough Coins')}
                </button>
                <div class="requires">Requires: ${structureType.charAt(0).toUpperCase() + structureType.slice(1)}</div>
              </div>
            `;

          animalCard.addEventListener('mouseenter', () => {
            if (canPurchase) {
              animalCard.style.transform = 'translateY(-2px)';
              animalCard.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.3)`;
            }
          });

          animalCard.addEventListener('mouseleave', () => {
            animalCard.style.transform = 'translateY(0)';
            animalCard.style.boxShadow = 'none';
          });

          animalsGrid.appendChild(animalCard);
        });
      });

      animalsSection.appendChild(animalsGrid);
      container.appendChild(animalsSection);
    }

    function showEquipmentShopItems(container) {
      container.innerHTML = `
          <div style="text-align: center; color: #8b949e; padding: 40px;">
            Equipment shop coming soon...
          </div>
        `;
    }

    function showUpgradesShopItems(container) {
      container.innerHTML = '';

      const miningHeader = document.createElement('div');
      miningHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin-bottom: 10px; text-align: center;';
      miningHeader.innerHTML = '<h3 style="color: var(--brand);">Mining</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(miningHeader);

      const miningTools = (gameData.upgrades && gameData.upgrades.mining && gameData.upgrades.mining.tools) ? gameData.upgrades.mining.tools : [];
      const miningLevel = (gameState.skills && gameState.skills.mining && gameState.skills.mining.level) ? gameState.skills.mining.level : 1;

      if (miningTools.length === 0) {
        const empty = document.createElement('div');
        empty.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        empty.textContent = 'No mining upgrades available.';
        container.appendChild(empty);
      } else {
        miningTools.forEach(tool => {
          const purchased = !!(gameState.upgrades && gameState.upgrades.mining && gameState.upgrades.mining.purchased[tool.id]);
          const meetsLevel = miningLevel >= tool.requiredLevel;
          const canUnlock = !purchased && meetsLevel;

          const card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
            <div class="item-icon">⛏️</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Mining Lv ${tool.requiredLevel}</div>
            <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
          `;

          const btn = card.querySelector('button');
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

      const forestryHeader = document.createElement('div');
      forestryHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      forestryHeader.innerHTML = '<h3 style="color: var(--brand);">Forestry</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(forestryHeader);

      const forestryTools = (gameData.upgrades && gameData.upgrades.forestry && gameData.upgrades.forestry.tools) ? gameData.upgrades.forestry.tools : [];
      const forestryLevel = (gameState.skills && gameState.skills.woodcutting && gameState.skills.woodcutting.level) ? gameState.skills.woodcutting.level : 1;

      if (forestryTools.length === 0) {
        const emptyF = document.createElement('div');
        emptyF.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        emptyF.textContent = 'No forestry upgrades available.';
        container.appendChild(emptyF);
      } else {
        forestryTools.forEach(tool => {
          const purchased = !!(gameState.upgrades && gameState.upgrades.forestry && gameState.upgrades.forestry.purchased[tool.id]);
          const meetsLevel = forestryLevel >= tool.requiredLevel;
          const canUnlock = !purchased && meetsLevel;

          const card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
            <div class="item-icon">🪓</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Woodcutting Lv ${tool.requiredLevel}</div>
            <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
          `;

          const btn = card.querySelector('button');
          btn.addEventListener('click', () => {
            if (!canUnlock) return;
            gameState.upgrades.forestry.purchased[tool.id] = true;
            showNotification(`${tool.name} unlocked`);
            saveGame();
            showUpgradesShopItems(container);
          });

          container.appendChild(card);
        });
      }

      const foragingHeader = document.createElement('div');
      foragingHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      foragingHeader.innerHTML = '<h3 style="color: var(--brand);">Foraging</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(foragingHeader);

      const foragingTools = (gameData.upgrades && gameData.upgrades.foraging && gameData.upgrades.foraging.tools) ? gameData.upgrades.foraging.tools : [];
      const foragingLevel = (gameState.skills && gameState.skills.foraging && gameState.skills.foraging.level) ? gameState.skills.foraging.level : 1;

      if (foragingTools.length === 0) {
        const emptyFo = document.createElement('div');
        emptyFo.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        emptyFo.textContent = 'No foraging upgrades available.';
        container.appendChild(emptyFo);
      } else {
        foragingTools.forEach(tool => {
          const purchased = !!(gameState.upgrades && gameState.upgrades.foraging && gameState.upgrades.foraging.purchased[tool.id]);
          const meetsLevel = foragingLevel >= tool.requiredLevel;
          const canUnlock = !purchased && meetsLevel;

          const card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
              <div class="item-icon">🌾</div>
              <div class="item-name">${tool.name}</div>
              <div class="item-meta">Requires Foraging Lv ${tool.requiredLevel}</div>
              <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
            `;

          const btn = card.querySelector('button');
          btn.addEventListener('click', () => {
            if (!canUnlock) return;
            gameState.upgrades.foraging.purchased[tool.id] = true;
            showNotification(`${tool.name} unlocked`);
            saveGame();
            showUpgradesShopItems(container);
          });

          container.appendChild(card);
        });
      }

      const huntingHeader = document.createElement('div');
      huntingHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      huntingHeader.innerHTML = '<h3 style="color: var(--brand);">Hunting</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(huntingHeader);

      const huntingTools = (gameData.upgrades && gameData.upgrades.hunting && gameData.upgrades.hunting.tools) ? gameData.upgrades.hunting.tools : [];
      const huntingLevel = (gameState.skills && gameState.skills.hunting && gameState.skills.hunting.level) ? gameState.skills.hunting.level : 1;

      if (huntingTools.length === 0) {
        const emptyH = document.createElement('div');
        emptyH.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        emptyH.textContent = 'No hunting upgrades available.';
        container.appendChild(emptyH);
      } else {
        huntingTools.forEach(tool => {
          const purchased = !!(gameState.upgrades && gameState.upgrades.hunting && gameState.upgrades.hunting.purchased[tool.id]);
          const meetsLevel = huntingLevel >= tool.requiredLevel;
          const canUnlock = !purchased && meetsLevel;

          const card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
              <div class="item-icon">🪤</div>
              <div class="item-name">${tool.name}</div>
              <div class="item-meta">Requires Hunting Lv ${tool.requiredLevel}</div>
              <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
            `;

          const btn = card.querySelector('button');
          btn.addEventListener('click', () => {
            if (!canUnlock) return;
            gameState.upgrades.hunting.purchased[tool.id] = true;
            showNotification(`${tool.name} unlocked`);
            saveGame();
            showUpgradesShopItems(container);
          });

          container.appendChild(card);
        });
      }

      const fishingHeader = document.createElement('div');
      fishingHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      fishingHeader.innerHTML = '<h3 style="color: var(--brand);">Fishing</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(fishingHeader);

      const fishingTools = (gameData.upgrades && gameData.upgrades.fishing && gameData.upgrades.fishing.tools) ? gameData.upgrades.fishing.tools : [];
      const fishingLevel = (gameState.skills && gameState.skills.fishing && gameState.skills.fishing.level) ? gameState.skills.fishing.level : 1;

      if (fishingTools.length === 0) {
        const emptyFi = document.createElement('div');
        emptyFi.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        emptyFi.textContent = 'No fishing upgrades available.';
        container.appendChild(emptyFi);
      } else {
        fishingTools.forEach(tool => {
          const purchased = !!(gameState.upgrades && gameState.upgrades.fishing && gameState.upgrades.fishing.purchased[tool.id]);
          const meetsLevel = fishingLevel >= tool.requiredLevel;
          const canUnlock = !purchased && meetsLevel;

          const card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
                <div class="item-icon">🎣</div>
                <div class="item-name">${tool.name}</div>
                <div class="item-meta">Requires Fishing Lv ${tool.requiredLevel}</div>
                <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
              `;

          const btn = card.querySelector('button');
          btn.addEventListener('click', () => {
            if (!canUnlock) return;
            gameState.upgrades.fishing.purchased[tool.id] = true;
            showNotification(`${tool.name} unlocked`);
            saveGame();
            showUpgradesShopItems(container);
          });

          container.appendChild(card);
        });
      }
      const lootHeader = document.createElement('div');
      lootHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      lootHeader.innerHTML = '<h3 style="color: var(--brand);">Looting</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(lootHeader);

      const lootTools = (gameData.upgrades && gameData.upgrades.looting && gameData.upgrades.looting.tools) ? gameData.upgrades.looting.tools : [];
      const lootLevel = (gameState.skills && gameState.skills.looting && gameState.skills.looting.level) ? gameState.skills.looting.level : 1;

      if (lootTools.length === 0) {
        const emptyLo = document.createElement('div');
        emptyLo.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        emptyLo.textContent = 'No looting upgrades available.';
        container.appendChild(emptyLo);
      } else {
        lootTools.forEach(tool => {
          const purchased = !!(gameState.upgrades && gameState.upgrades.looting && gameState.upgrades.looting.purchased && gameState.upgrades.looting.purchased[tool.id]);
          const meetsLevel = lootLevel >= tool.requiredLevel;
          const canUnlock = !purchased && meetsLevel;

          const card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
                <div class="item-icon">🗝️</div>
                <div class="item-name">${tool.name}</div>
                <div class="item-meta">Requires Looting Lv ${tool.requiredLevel}</div>
                <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
              `;

          const btn = card.querySelector('button');
          btn.addEventListener('click', () => {
            if (!canUnlock) return;
            if (!gameState.upgrades.looting) gameState.upgrades.looting = { purchased: {} };
            if (!gameState.upgrades.looting.purchased) gameState.upgrades.looting.purchased = {};
            gameState.upgrades.looting.purchased[tool.id] = true;
            showNotification(`${tool.name} unlocked`);
            saveGame();
            showUpgradesShopItems(container);
          });

          container.appendChild(card);
        });
      }

      const scavHeader = document.createElement('div');
      scavHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      scavHeader.innerHTML = '<h3 style="color: var(--brand);">Scavenging</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(scavHeader);

      const scavTools = (gameData.upgrades && gameData.upgrades.scavenging && gameData.upgrades.scavenging.tools) ? gameData.upgrades.scavenging.tools : [];
      const scavLevel = (gameState.skills && gameState.skills.scavenging && gameState.skills.scavenging.level) ? gameState.skills.scavenging.level : 1;

      if (scavTools.length === 0) {
        const emptySc = document.createElement('div');
        emptySc.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        emptySc.textContent = 'No scavenging upgrades available.';
        container.appendChild(emptySc);
      } else {
        scavTools.forEach(tool => {
          const purchased = !!(gameState.upgrades && gameState.upgrades.scavenging && gameState.upgrades.scavenging.purchased && gameState.upgrades.scavenging.purchased[tool.id]);
          const meetsLevel = scavLevel >= tool.requiredLevel;
          const canUnlock = !purchased && meetsLevel;

          const card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
                <div class="item-icon">🔧</div>
                <div class="item-name">${tool.name}</div>
                <div class="item-meta">Requires Scavenging Lv ${tool.requiredLevel}</div>
                <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
              `;

          const btn = card.querySelector('button');
          btn.addEventListener('click', () => {
            if (!canUnlock) return;
            if (!gameState.upgrades.scavenging) gameState.upgrades.scavenging = { purchased: {} };
            if (!gameState.upgrades.scavenging.purchased) gameState.upgrades.scavenging.purchased = {};
            gameState.upgrades.scavenging.purchased[tool.id] = true;
            showNotification(`${tool.name} unlocked`);
            saveGame();
            showUpgradesShopItems(container);
          });

          container.appendChild(card);
        });
      }

      const tailoringHeader = document.createElement('div');
      tailoringHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      tailoringHeader.innerHTML = '<h3 style="color: var(--brand);">Tailoring</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(tailoringHeader);

      const tailoringTools = (gameData.upgrades && gameData.upgrades.tailoring && gameData.upgrades.tailoring.tools) ? gameData.upgrades.tailoring.tools : [];
      const tailoringLevel = (gameState.skills && gameState.skills.tailoring && gameState.skills.tailoring.level) ? gameState.skills.tailoring.level : 1;

      if (tailoringTools.length === 0) {
        const emptyT = document.createElement('div');
        emptyT.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        emptyT.textContent = 'No tailoring upgrades available.';
        container.appendChild(emptyT);
      } else {
        tailoringTools.forEach(tool => {
          const purchased = !!(gameState.upgrades && gameState.upgrades.tailoring && gameState.upgrades.tailoring.purchased[tool.id]);
          const meetsLevel = tailoringLevel >= tool.requiredLevel;
          const canUnlock = !purchased && meetsLevel;

          const card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
            <div class="item-icon">🧵</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Tailoring Lv ${tool.requiredLevel}</div>
            <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
          `;

          const btn = card.querySelector('button');
          btn.addEventListener('click', () => {
            if (!canUnlock) return;
            if (!gameState.upgrades.tailoring) gameState.upgrades.tailoring = { purchased: {} };
            if (!gameState.upgrades.tailoring.purchased) gameState.upgrades.tailoring.purchased = {};
            gameState.upgrades.tailoring.purchased[tool.id] = true;
            showNotification(`${tool.name} unlocked`);
            saveGame();
            showUpgradesShopItems(container);
          });

          container.appendChild(card);
        });
      }

      const wsHeader = document.createElement('div');
      wsHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 10px 0; text-align: center;';
      wsHeader.innerHTML = '<div class="muted" style="margin-top: -6px;">Workshops</div>';
      container.appendChild(wsHeader);

      const workshops = (gameData.upgrades && gameData.upgrades.tailoring && gameData.upgrades.tailoring.workshops) ? gameData.upgrades.tailoring.workshops : [];
      workshops.forEach(ws => {
        const meetsLevel = tailoringLevel >= (ws.requiredLevel || 1);
        const owned = !!(gameState.workshops && gameState.workshops.tailoring && gameState.workshops.tailoring[ws.id]);
        const hasScrap = (gameState.player.scrap || 0) >= (ws.scrapCost || 0);
        const canBuy = !owned && meetsLevel && hasScrap;

        const card = document.createElement('div');
        card.className = 'shop-item';
        card.innerHTML = `
          <div class="item-icon">🏭</div>
          <div class="item-name">${ws.name}</div>
          <div class="item-meta">Lv ${ws.requiredLevel || 1} • Cost: ${ws.scrapCost || 0} Scrap</div>
          <button class="action-button shop-buy" ${canBuy ? '' : 'disabled'}>${owned ? 'Owned' : (meetsLevel ? (hasScrap ? 'Buy' : 'Need Scrap') : 'Level Too Low')}</button>
        `;

        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
          if (!canBuy) return;
          gameState.player.scrap -= (ws.scrapCost || 0);
          if (!gameState.workshops) gameState.workshops = { tailoring: {}, firstaid: {}, forging: {}, gunsmithing: {}, carpentry: {}, tinkering: {}, cooking: {}, masonry: {}, chemistry: {}, electrical: {} };
          if (!gameState.workshops.tailoring) gameState.workshops.tailoring = {};
          gameState.workshops.tailoring[ws.id] = true;
          showNotification(`${ws.name} purchased`);
          saveGame();
          updatePlayerStats();
          showUpgradesShopItems(container);
        });

        container.appendChild(card);
      });

      const faHeader = document.createElement('div');
      faHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      faHeader.innerHTML = '<h3 style="color: var(--brand);">First Aid</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(faHeader);

      const faTools = (gameData.upgrades && gameData.upgrades.firstaid && gameData.upgrades.firstaid.tools) ? gameData.upgrades.firstaid.tools : [];
      const faLevel = (gameState.skills && gameState.skills.firstaid && gameState.skills.firstaid.level) ? gameState.skills.firstaid.level : 1;

      if (faTools.length === 0) {
        const emptyFA = document.createElement('div');
        emptyFA.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        emptyFA.textContent = 'No first aid upgrades available.';
        container.appendChild(emptyFA);
      } else {
        faTools.forEach(tool => {
          const purchased = !!(gameState.upgrades && gameState.upgrades.firstaid && gameState.upgrades.firstaid.purchased[tool.id]);
          const meetsLevel = faLevel >= tool.requiredLevel;
          const canUnlock = !purchased && meetsLevel;

          const card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
            <div class="item-icon">🪡</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires First Aid Lv ${tool.requiredLevel}</div>
            <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
          `;

          const btn = card.querySelector('button');
          btn.addEventListener('click', () => {
            if (!canUnlock) return;
            if (!gameState.upgrades.firstaid) gameState.upgrades.firstaid = { purchased: {} };
            if (!gameState.upgrades.firstaid.purchased) gameState.upgrades.firstaid.purchased = {};
            gameState.upgrades.firstaid.purchased[tool.id] = true;
            showNotification(`${tool.name} unlocked`);
            saveGame();
            showUpgradesShopItems(container);
          });

          container.appendChild(card);
        });
      }

      const faWsHeader = document.createElement('div');
      faWsHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 10px 0; text-align: center;';
      faWsHeader.innerHTML = '<div class="muted" style="margin-top: -6px;">Workshops</div>';
      container.appendChild(faWsHeader);

      const faWorkshops = (gameData.upgrades && gameData.upgrades.firstaid && gameData.upgrades.firstaid.workshops) ? gameData.upgrades.firstaid.workshops : [];
      faWorkshops.forEach(ws => {
        const meetsLevel = faLevel >= (ws.requiredLevel || 1);
        const owned = !!(gameState.workshops && gameState.workshops.firstaid && gameState.workshops.firstaid[ws.id]);
        const hasScrap = (gameState.player.scrap || 0) >= (ws.scrapCost || 0);
        const canBuy = !owned && meetsLevel && hasScrap;

        const card = document.createElement('div');
        card.className = 'shop-item';
        card.innerHTML = `
          <div class="item-icon">🏥</div>
          <div class="item-name">${ws.name}</div>
          <div class="item-meta">Lv ${ws.requiredLevel || 1} • Cost: ${ws.scrapCost || 0} Scrap</div>
          <button class="action-button shop-buy" ${canBuy ? '' : 'disabled'}>${owned ? 'Owned' : (meetsLevel ? (hasScrap ? 'Buy' : 'Need Scrap') : 'Level Too Low')}</button>
        `;

        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
          if (!canBuy) return;
          gameState.player.scrap -= (ws.scrapCost || 0);
          if (!gameState.workshops) gameState.workshops = { tailoring: {}, firstaid: {}, forging: {}, gunsmithing: {}, carpentry: {}, tinkering: {}, cooking: {}, masonry: {}, chemistry: {}, electrical: {} };
          if (!gameState.workshops.firstaid) gameState.workshops.firstaid = {};
          gameState.workshops.firstaid[ws.id] = true;
          showNotification(`${ws.name} purchased`);
          saveGame();
          updatePlayerStats();
          showUpgradesShopItems(container);
        });

        container.appendChild(card);
      });

      const forgingHeader = document.createElement('div');
      forgingHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      forgingHeader.innerHTML = '<h3 style="color: var(--brand);">Forging</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(forgingHeader);

      const forgingTools = (gameData.upgrades && gameData.upgrades.forging && gameData.upgrades.forging.tools) ? gameData.upgrades.forging.tools : [];
      const forgingLevel = (gameState.skills && gameState.skills.forging && gameState.skills.forging.level) ? gameState.skills.forging.level : 1;

      if (forgingTools.length === 0) {
        const emptyFG = document.createElement('div');
        emptyFG.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        emptyFG.textContent = 'No forging upgrades available.';
        container.appendChild(emptyFG);
      } else {
        forgingTools.forEach(tool => {
          const purchased = !!(gameState.upgrades && gameState.upgrades.forging && gameState.upgrades.forging.purchased[tool.id]);
          const meetsLevel = forgingLevel >= tool.requiredLevel;
          const canUnlock = !purchased && meetsLevel;

          const card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
            <div class="item-icon">⚒️</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Forging Lv ${tool.requiredLevel}</div>
            <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
          `;

          const btn = card.querySelector('button');
          btn.addEventListener('click', () => {
            if (!canUnlock) return;
            if (!gameState.upgrades.forging) gameState.upgrades.forging = { purchased: {} };
            if (!gameState.upgrades.forging.purchased) gameState.upgrades.forging.purchased = {};
            gameState.upgrades.forging.purchased[tool.id] = true;
            showNotification(`${tool.name} unlocked`);
            saveGame();
            showUpgradesShopItems(container);
          });

          container.appendChild(card);
        });
      }

      const fgWsHeader = document.createElement('div');
      fgWsHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 10px 0; text-align: center;';
      fgWsHeader.innerHTML = '<div class="muted" style="margin-top: -6px;">Workshops</div>';
      container.appendChild(fgWsHeader);

      const forgingWorkshops = (gameData.upgrades && gameData.upgrades.forging && gameData.upgrades.forging.workshops) ? gameData.upgrades.forging.workshops : [];
      forgingWorkshops.forEach(ws => {
        const meetsLevel = forgingLevel >= (ws.requiredLevel || 1);
        const owned = !!(gameState.workshops && gameState.workshops.forging && gameState.workshops.forging[ws.id]);
        const canBuy = !owned && meetsLevel;

        const card = document.createElement('div');
        card.className = 'shop-item';
        card.innerHTML = `
          <div class="item-icon">🏭</div>
          <div class="item-name">${ws.name}</div>
          <div class="item-meta">Lv ${ws.requiredLevel || 1}</div>
          <button class="action-button shop-buy" ${canBuy ? '' : 'disabled'}>${owned ? 'Owned' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
        `;

        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
          if (!canBuy) return;
          if (!gameState.workshops) gameState.workshops = { tailoring: {}, firstaid: {}, forging: {}, gunsmithing: {}, carpentry: {}, tinkering: {}, cooking: {}, masonry: {}, chemistry: {}, electrical: {} };
          if (!gameState.workshops.forging) gameState.workshops.forging = {};
          gameState.workshops.forging[ws.id] = true;
          showNotification(`${ws.name} unlocked`);
          saveGame();
          updatePlayerStats();
          showUpgradesShopItems(container);
        });

        container.appendChild(card);
      });

      const gunsHeader = document.createElement('div');
      gunsHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      gunsHeader.innerHTML = '<h3 style="color: var(--brand);">Gunsmithing</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(gunsHeader);

      const gunsTools = (gameData.upgrades && gameData.upgrades.gunsmithing && gameData.upgrades.gunsmithing.tools) ? gameData.upgrades.gunsmithing.tools : [];
      const gunsLevel = (gameState.skills && gameState.skills.gunsmithing && gameState.skills.gunsmithing.level) ? gameState.skills.gunsmithing.level : 1;

      if (gunsTools.length === 0) {
        const emptyGS = document.createElement('div');
        emptyGS.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        emptyGS.textContent = 'No gunsmithing upgrades available.';
        container.appendChild(emptyGS);
      } else {
        gunsTools.forEach(tool => {
          const purchased = !!(gameState.upgrades && gameState.upgrades.gunsmithing && gameState.upgrades.gunsmithing.purchased[tool.id]);
          const meetsLevel = gunsLevel >= tool.requiredLevel;
          const canUnlock = !purchased && meetsLevel;

          const card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
            <div class="item-icon">🪛</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Gunsmithing Lv ${tool.requiredLevel}</div>
            <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
          `;

          const btn = card.querySelector('button');
          btn.addEventListener('click', () => {
            if (!canUnlock) return;
            if (!gameState.upgrades.gunsmithing) gameState.upgrades.gunsmithing = { purchased: {} };
            if (!gameState.upgrades.gunsmithing.purchased) gameState.upgrades.gunsmithing.purchased = {};
            gameState.upgrades.gunsmithing.purchased[tool.id] = true;
            showNotification(`${tool.name} unlocked`);
            saveGame();
            showUpgradesShopItems(container);
          });

          container.appendChild(card);
        });
      }

      const gsWsHeader = document.createElement('div');
      gsWsHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 10px 0; text-align: center;';
      gsWsHeader.innerHTML = '<div class="muted" style="margin-top: -6px;">Workshops</div>';
      container.appendChild(gsWsHeader);

      const gsWorkshops = (gameData.upgrades && gameData.upgrades.gunsmithing && gameData.upgrades.gunsmithing.workshops) ? gameData.upgrades.gunsmithing.workshops : [];
      gsWorkshops.forEach(ws => {
        const meetsLevel = gunsLevel >= (ws.requiredLevel || 1);
        const owned = !!(gameState.workshops && gameState.workshops.gunsmithing && gameState.workshops.gunsmithing[ws.id]);
        const hasScrap = (gameState.player.scrap || 0) >= (ws.scrapCost || 0);
        const canBuy = !owned && meetsLevel && hasScrap;

        const card = document.createElement('div');
        card.className = 'shop-item';
        card.innerHTML = `
          <div class="item-icon">🏗️</div>
          <div class="item-name">${ws.name}</div>
          <div class="item-meta">Lv ${ws.requiredLevel || 1} • Cost: ${ws.scrapCost || 0} Scrap</div>
          <button class="action-button shop-buy" ${canBuy ? '' : 'disabled'}>${owned ? 'Owned' : (meetsLevel ? (hasScrap ? 'Buy' : 'Need Scrap') : 'Level Too Low')}</button>
        `;

        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
          if (!canBuy) return;
          gameState.player.scrap -= (ws.scrapCost || 0);
          if (!gameState.workshops) gameState.workshops = { tailoring: {}, firstaid: {}, forging: {}, gunsmithing: {}, carpentry: {}, tinkering: {}, cooking: {}, masonry: {}, chemistry: {}, electrical: {} };
          if (!gameState.workshops.gunsmithing) gameState.workshops.gunsmithing = {};
          gameState.workshops.gunsmithing[ws.id] = true;
          showNotification(`${ws.name} purchased`);
          saveGame();
          updatePlayerStats();
          showUpgradesShopItems(container);
        });

        container.appendChild(card);
      });


      const carpHeader = document.createElement('div');
      carpHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      carpHeader.innerHTML = '<h3 style="color: var(--brand);">Carpentry</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(carpHeader);

      const carpTools = (gameData.upgrades && gameData.upgrades.carpentry && gameData.upgrades.carpentry.tools) ? gameData.upgrades.carpentry.tools : [];
      const carpLevel = (gameState.skills && gameState.skills.carpentry && gameState.skills.carpentry.level) ? gameState.skills.carpentry.level : 1;

      if (carpTools.length === 0) {
        const emptyCP = document.createElement('div');
        emptyCP.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        emptyCP.textContent = 'No carpentry upgrades available.';
        container.appendChild(emptyCP);
      } else {
        carpTools.forEach(tool => {
          const purchased = !!(gameState.upgrades && gameState.upgrades.carpentry && gameState.upgrades.carpentry.purchased && gameState.upgrades.carpentry.purchased[tool.id]);
          const meetsLevel = carpLevel >= tool.requiredLevel;
          const canUnlock = !purchased && meetsLevel;

          const card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
            <div class="item-icon">🪚</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Carpentry Lv ${tool.requiredLevel}</div>
            <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
          `;

          const btn = card.querySelector('button');
          btn.addEventListener('click', () => {
            if (!canUnlock) return;
            if (!gameState.upgrades.carpentry) gameState.upgrades.carpentry = { purchased: {} };
            if (!gameState.upgrades.carpentry.purchased) gameState.upgrades.carpentry.purchased = {};
            gameState.upgrades.carpentry.purchased[tool.id] = true;
            showNotification(`${tool.name} unlocked`);
            saveGame();
            showUpgradesShopItems(container);
          });

          container.appendChild(card);
        });
      }

      const carpWsHeader = document.createElement('div');
      carpWsHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 10px 0; text-align: center;';
      carpWsHeader.innerHTML = '<div class="muted" style="margin-top: -6px;">Workshops</div>';
      container.appendChild(carpWsHeader);

      const carpWorkshops = (gameData.upgrades && gameData.upgrades.carpentry && gameData.upgrades.carpentry.workshops) ? gameData.upgrades.carpentry.workshops : [];
      carpWorkshops.forEach(ws => {
        const meetsLevel = carpLevel >= (ws.requiredLevel || 1);
        const owned = !!(gameState.workshops && gameState.workshops.carpentry && gameState.workshops.carpentry[ws.id]);
        const hasScrap = (gameState.player.scrap || 0) >= (ws.scrapCost || 0);
        const canBuy = !owned && meetsLevel && hasScrap;

        const card = document.createElement('div');
        card.className = 'shop-item';
        card.innerHTML = `
          <div class="item-icon">🏭</div>
          <div class="item-name">${ws.name}</div>
          <div class="item-meta">Lv ${ws.requiredLevel || 1} • Cost: ${ws.scrapCost || 0} Scrap</div>
          <button class="action-button shop-buy" ${canBuy ? '' : 'disabled'}>${owned ? 'Owned' : (meetsLevel ? (hasScrap ? 'Buy' : 'Need Scrap') : 'Level Too Low')}</button>
        `;

        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
          if (!canBuy) return;
          gameState.player.scrap -= (ws.scrapCost || 0);
          if (!gameState.workshops) gameState.workshops = { tailoring: {}, firstaid: {}, forging: {}, gunsmithing: {}, carpentry: {}, tinkering: {}, cooking: {}, masonry: {}, chemistry: {}, electrical: {} };
          if (!gameState.workshops.carpentry) gameState.workshops.carpentry = {};
          gameState.workshops.carpentry[ws.id] = true;
          showNotification(`${ws.name} purchased`);
          saveGame();
          updatePlayerStats();
          showUpgradesShopItems(container);
        });

        container.appendChild(card);
      });
      const tinkHeader = document.createElement('div');
      tinkHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 20px 0 10px; text-align: center;';
      tinkHeader.innerHTML = '<h3 style="color: var(--brand);">Tinkering</h3><div class="muted" style="margin-top: -6px;">Tools</div>';
      container.appendChild(tinkHeader);

      const tinkTools = (gameData.upgrades && gameData.upgrades.tinkering && gameData.upgrades.tinkering.tools) ? gameData.upgrades.tinkering.tools : [];
      const tinkLevel = (gameState.skills && gameState.skills.tinkering && gameState.skills.tinkering.level) ? gameState.skills.tinkering.level : 1;

      if (tinkTools.length === 0) {
        const emptyTK = document.createElement('div');
        emptyTK.style.cssText = 'grid-column: 1 / -1; color: #8b949e; padding: 20px; text-align: center;';
        emptyTK.textContent = 'No tinkering upgrades available.';
        container.appendChild(emptyTK);
      } else {
        tinkTools.forEach(tool => {
          const purchased = !!(gameState.upgrades && gameState.upgrades.tinkering && gameState.upgrades.tinkering.purchased && gameState.upgrades.tinkering.purchased[tool.id]);
          const meetsLevel = tinkLevel >= tool.requiredLevel;
          const canUnlock = !purchased && meetsLevel;

          const card = document.createElement('div');
          card.className = 'shop-item';
          card.innerHTML = `
            <div class="item-icon">🛠️</div>
            <div class="item-name">${tool.name}</div>
            <div class="item-meta">Requires Tinkering Lv ${tool.requiredLevel}</div>
            <button class="action-button shop-buy" ${canUnlock ? '' : 'disabled'}>${purchased ? 'Purchased' : (meetsLevel ? 'Unlock' : 'Level Too Low')}</button>
          `;

          const btn = card.querySelector('button');
          btn.addEventListener('click', () => {
            if (!canUnlock) return;
            if (!gameState.upgrades.tinkering) gameState.upgrades.tinkering = { purchased: {} };
            if (!gameState.upgrades.tinkering.purchased) gameState.upgrades.tinkering.purchased = {};
            gameState.upgrades.tinkering.purchased[tool.id] = true;
            showNotification(`${tool.name} unlocked`);
            saveGame();
            showUpgradesShopItems(container);
          });

          container.appendChild(card);
        });
      }

      const tinkWsHeader = document.createElement('div');
      tinkWsHeader.style.cssText = 'grid-column: 1 / -1; width: 100%; margin: 10px 0; text-align: center;';
      tinkWsHeader.innerHTML = '<div class="muted" style="margin-top: -6px;">Workshops</div>';
      container.appendChild(tinkWsHeader);

      const tinkWorkshops = (gameData.upgrades && gameData.upgrades.tinkering && gameData.upgrades.tinkering.workshops) ? gameData.upgrades.tinkering.workshops : [];
      tinkWorkshops.forEach(ws => {
        const meetsLevel = tinkLevel >= (ws.requiredLevel || 1);
        const owned = !!(gameState.workshops && gameState.workshops.tinkering && gameState.workshops.tinkering[ws.id]);
        const hasScrap = (gameState.player.scrap || 0) >= (ws.scrapCost || 0);
        const canBuy = !owned && meetsLevel && hasScrap;

        const card = document.createElement('div');
        card.className = 'shop-item';
        card.innerHTML = `
          <div class="item-icon">🏭</div>
          <div class="item-name">${ws.name}</div>
          <div class="item-meta">Lv ${ws.requiredLevel || 1} • Cost: ${ws.scrapCost || 0} Scrap</div>
          <button class="action-button shop-buy" ${canBuy ? '' : 'disabled'}>${owned ? 'Owned' : (meetsLevel ? (hasScrap ? 'Buy' : 'Need Scrap') : 'Level Too Low')}</button>
        `;

        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
          if (!canBuy) return;
          gameState.player.scrap -= (ws.scrapCost || 0);
          if (!gameState.workshops) gameState.workshops = { tailoring: {}, firstaid: {}, forging: {}, gunsmithing: {}, carpentry: {}, tinkering: {}, cooking: {}, masonry: {}, chemistry: {}, electrical: {} };
          if (!gameState.workshops.tinkering) gameState.workshops.tinkering = {};
          gameState.workshops.tinkering[ws.id] = true;
          showNotification(`${ws.name} purchased`);
          saveGame();
          updatePlayerStats();
          showUpgradesShopItems(container);
        });

        container.appendChild(card);
      });
    }

    function purchaseAnimal(animalId, structureType, price, requiredLevel) {
      const playerLevel = gameState.skills.animalcare.level;
      const playerCoins = gameState.bank.coins || 0;

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
      const animalData = ANIMAL_CARE_DATA.animals[structureType].find(a => a.id === animalId);
      showNotification(`Purchased ${animalData.name} for ${price} coins! Added to bank.`, "success");
      renderBank();
      showShopTab('general');
    }

    window.purchaseAnimal = purchaseAnimal;

    function showAnimalCareInterface(container) {
      const playerLevel = gameState.skills.animalcare.level;
      const unlockedPens = getUnlockedPens(playerLevel);
      const structureTypeNames = { pen: "Pen", coop: "Coop", hutch: "Hutch", insect: "Insect House" };

      const structuresSection = document.createElement("div");
      structuresSection.style.cssText = "margin-bottom: 30px;";

      const structuresTitle = document.createElement("h4");
      structuresTitle.textContent = "Animal Structures";
      structuresTitle.style.cssText = "color: #8e44ad; margin-bottom: 15px;";
      structuresSection.appendChild(structuresTitle);

      const structuresGrid = document.createElement("div");
      structuresGrid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;";

      ANIMAL_CARE_DATA.structures.forEach((structure, index) => {
        const isUnlocked = index < unlockedPens;
        const structureCard = document.createElement("div");
        structureCard.className = "resource-card";

        const structureState = gameState.animalCare.unlockedStructures.find(s => s.name === structure.name);
        const hasAnimal = !!(structureState && structureState.placedAnimal);

        structureCard.style.cssText = `
            background: ${isUnlocked ? 'rgba(142, 68, 173, 0.2)' : 'rgba(255,255,255,0.06)'};
            border: 1px solid ${isUnlocked ? '#8e44ad' : 'rgba(255,255,255,0.08)'};
            opacity: ${isUnlocked ? '1' : '0.6'};
            cursor: ${isUnlocked ? 'pointer' : 'default'};
            min-height: 220px;
          `;

        const compatibleAnimals = getCompatibleAnimals(structure.type, playerLevel);
        const hasAnimals = compatibleAnimals.length > 0;

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

    function updateAnimalCareProgressBars() {
      const currentTime = Date.now();

      gameState.animalCare.unlockedStructures.forEach((structure, index) => {
        if (structure.placedAnimal) {
          const byproductElement = document.getElementById(`byproduct-progress-${index}`);
          if (byproductElement && structure.lastByproduct) {
            const byproductTimePassed = currentTime - structure.lastByproduct;
            const byproductProgress = Math.min(100, (byproductTimePassed / 60000) * 100);
            byproductElement.style.width = `${byproductProgress}%`;
          }

          const harvestElement = document.getElementById(`harvest-progress-${index}`);
          if (harvestElement && structure.lastHarvest) {
            const harvestTimePassed = currentTime - structure.lastHarvest;
            const harvestProgress = Math.min(100, (harvestTimePassed / 240000) * 100);
            harvestElement.style.width = `${harvestProgress}%`;
          }
        }
      });
    }

    function getCompatibleAnimals(structureType, playerLevel) {
      const animals = ANIMAL_CARE_DATA.animals[structureType] || [];
      return animals.filter(animal => {
        const playerHas = gameState.bank[animal.id] || 0;
        return playerHas > 0 && playerLevel >= animal.level;
      });
    }

    function selectAnimalForStructure(structureName, structureType, structureIndex) {
      const playerLevel = gameState.skills.animalcare.level;
      const compatibleAnimals = getCompatibleAnimals(structureType, playerLevel);

      if (compatibleAnimals.length === 0) {
        showNotification("No compatible animals available!", "error");
        return;
      }

      const modal = document.createElement("div");
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

      const modalContent = document.createElement("div");
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

      const animalGrid = modalContent.querySelector("#animal-selection-grid");

      compatibleAnimals.forEach(animal => {
        const playerHas = gameState.bank[animal.id] || 0;
        const animalOption = document.createElement("div");
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

    function placeAnimal(structureIndex, animal) {
      const structureData = ANIMAL_CARE_DATA.structures[structureIndex];
      let structureState = gameState.animalCare.unlockedStructures.find(s => s.name === structureData.name);

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

    function removeAnimal(structureIndex) {
      const structureData = ANIMAL_CARE_DATA.structures[structureIndex];
      const structureState = gameState.animalCare.unlockedStructures.find(s => s.name === structureData.name);

      if (structureState && structureState.placedAnimal) {
        const count = structureState.placedAnimal.count || 1;
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
      const CATS = [
        { id: 'res', name: 'Residential' },
        { id: 'ind', name: 'Industrial' },
        { id: 'def', name: 'Defensive' },
        { id: 'spe', name: 'Special' },
      ];

      const BUILDINGS = [
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
      const state = {
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
      const mapEl = document.querySelector('#homebase-page #map');
      const tabsEl = document.querySelector('#homebase-page #tabs');
      const cardsEl = document.querySelector('#homebase-page #cards');
      const favRow = document.querySelector('#homebase-page #favRow');
      const woodEl = document.querySelector('#homebase-page #wood');
      const stoneEl = document.querySelector('#homebase-page #stone');
      const woodDeltaEl = document.querySelector('#homebase-page #woodDelta');
      const stoneDeltaEl = document.querySelector('#homebase-page #stoneDelta');
  const rotateL = document.querySelector('#homebase-page #rotateLeft');
      const rotateR = document.querySelector('#homebase-page #rotateRight');
      const undoBtn = document.querySelector('#homebase-page #undoBtn');
  const toggleBordersBtn = document.querySelector('#homebase-page #toggleBorders');
      const toasts = document.querySelector('#homebase-page #toasts');
      const hint = document.querySelector('#homebase-page #hint');
      const corner = document.querySelector('#homebase-page .overlay .corner');
  const affordChip = document.querySelector('#homebase-page #affordChip');

      // ======= INIT GRID & ROADS =======
      mapEl.style.setProperty('--cols', state.cols);
      mapEl.style.setProperty('--rows', state.rows);

      // Clear any existing tiles
      mapEl.innerHTML = '';

      // Build tiles
      const tiles = [];
      for (let y = 0; y < state.rows; y++) {
        for (let x = 0; x < state.cols; x++) {
          const t = document.createElement('div');
          t.className = 'tile';
          t.dataset.x = x; t.dataset.y = y;
          mapEl.appendChild(t);
          tiles.push(t);
        }
      }

      function roadKey(x, y) { return x + "," + y; }
      function setRoad(x, y) { state.roads.add(roadKey(x, y)); tileAt(x, y)?.classList.add('road'); }
      function riverKey(x, y) { return x + "," + y; }
      function setRiver(x, y) { state.rivers.add(riverKey(x, y)); const t = tileAt(x, y); if (t) t.classList.add('river'); }
      function clearRiver(x, y) { state.rivers.delete(riverKey(x, y)); const t = tileAt(x, y); if (t) t.classList.remove('river'); }
      function isRiver(x, y) { return state.rivers.has(riverKey(x, y)); }
      function bridgeKey(x, y) { return x + "," + y; }
      function tileAt(x, y) { if (x < 0 || y < 0 || x >= state.cols || y >= state.rows) return null; return tiles[y * state.cols + x]; }

      // helper: fill a vertical river segment
      function fillRiverCol(col, y0, y1) {
        for (let y = Math.max(0, y0); y <= Math.min(state.rows - 1, y1); y++) { setRiver(col, y); }
      }

      const homebaseTileConfig = {
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

      const regionConfig = {
        1: { x: [0, 15], y: [0, 13] },
        2: { x: [16, 32], y: [0, 13] },
        3: { x: [16, 32], y: [22, 43] },
        4: { x: [0, 15], y: [22, 43] },
        5: { x: [0, 15], y: [44, 65] },
        6: { x: [16, 32], y: [44, 65] }
      };

      // Parse coordinates from config and apply tile types
      function parseCoordinates(coordString) {
        if (!coordString) return [];
        return coordString.split(/[\s,]+/).filter(s => s.includes(',')).map(coord => {
          const [x, y] = coord.split(',').map(Number);
          return { x, y };
        });
      }

      function setTileType(x, y, type) {
        if (x < 0 || x >= state.cols || y < 0 || y >= state.rows) return;
        
        const t = tileAt(x, y);
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
            const rk = roadKey(x, y);
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
      function generateRoadNetwork() {
        // Clear existing state
        state.roads = new Set();
        if (!state.rivers) state.rivers = new Set();
        if (!state.bridges) state.bridges = new Set();
        
        // Clear all tile classes
        for (let y = 0; y < state.rows; y++) {
          for (let x = 0; x < state.cols; x++) {
            const t = tileAt(x, y);
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
      function getRegionConfig() {
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
      function drawRegionBoundaries() {
        const regionConfig = getRegionConfig();
        for (const regionId in regionConfig) {
          const rectangles = regionConfig[regionId];
          
          // For each tile in the region, check if it's on the external boundary
          for (const region of rectangles) {
            const [x_start, x_end] = region.x;
            const [y_start, y_end] = region.y;
            for (let x = x_start; x <= x_end; x++) {
              for (let y = y_start; y <= y_end; y++) {
                const tile = tileAt(x, y);
                if (!tile) continue;
                
                // Check if this tile is on the external boundary of the combined region
                const isLeftBoundary = !isInSameRegion(x - 1, y, regionId);
                const isRightBoundary = !isInSameRegion(x + 1, y, regionId);
                const isTopBoundary = !isInSameRegion(x, y - 1, regionId);
                const isBottomBoundary = !isInSameRegion(x, y + 1, regionId);
                
                // Special handling for diagonal boundary coordinates
                const isDiagonalBoundary = (
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
        function isInSameRegion(x, y, regionId) {
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
        }
      }

      // Draw walls on the outer edge of unlocked regions; remove inner walls between two unlocked neighbors
      function drawWalls() {
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
      }

      // Function to apply fog of war to areas outside unlocked regions
      function applyFogOfWar(unlocked, regionConfig) {
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
      }

      // Run road generation using new config-based approach
  generateRoadNetwork();
  assignRegionClasses();
  drawRegionBoundaries();
  drawWalls();
  // Cleanup: strip straight bands from diagonal wall tiles just in case
  (function cleanupDiagonalWallBands(){
    const sel = '#homebase-page .tile.wall.diagonal-nw, #homebase-page .tile.wall.diagonal-ne, #homebase-page .tile.wall.diagonal-sw, #homebase-page .tile.wall.diagonal-se';
    document.querySelectorAll(sel).forEach(t => {
      t.classList.remove('w-top','w-right','w-bottom','w-left');
    });
  })();

      // Helper functions for easy coordinate management
      function addCoordinates(tileType, coordString) {
        if (!homebaseTileConfig[tileType]) homebaseTileConfig[tileType] = [];
        const newCoords = coordString.split(/[\s,]+/).filter(s => s.includes(','));
        homebaseTileConfig[tileType].push(...newCoords);
        generateRoadNetwork(); // Regenerate to apply changes
        updateRoadSprites();
        markAdjacency();
      }

      function removeCoordinates(tileType, coordString) {
        if (!homebaseTileConfig[tileType]) return;
        const coordsToRemove = coordString.split(/[\s,]+/).filter(s => s.includes(','));
        homebaseTileConfig[tileType] = homebaseTileConfig[tileType].filter(coord => !coordsToRemove.includes(coord));
        generateRoadNetwork(); // Regenerate to apply changes
        updateRoadSprites();
        markAdjacency();
      }

      function showConfig() {
        console.log('Current homebase tile configuration:');
        for (const [type, coords] of Object.entries(homebaseTileConfig)) {
          console.log(`${type}: ${coords.join(', ')}`);
        }
      }

      // Expose config and helpers to console for easy editing
      window.homebaseTileConfig = homebaseTileConfig;
      window.addCoordinates = addCoordinates;
      window.removeCoordinates = removeCoordinates;
      window.showConfig = showConfig;

      // Tag each tile with its region class (region-1..region-6)
      function assignRegionClasses() {
        const cfg = getRegionConfig();
        for (const id in cfg) {
          const rectangles = cfg[id];
          for (const r of rectangles) {
            const [xs, xe] = r.x; const [ys, ye] = r.y;
            for (let y = ys; y <= ye; y++) {
              for (let x = xs; x <= xe; x++) {
                const t = tileAt(x, y); if (!t) continue;
                t.classList.add(`region-${id}`);
              }
            }
          }
        }
      }

      // Update road and bridge sprite classes to show connected center-lines
      function updateRoadSprites() {
        // First pass: compute neighbor connectivity for all road and bridge tiles
        const conn = new Map(); // key -> { north, south, west, east, isBridge }
        for (let y = 0; y < state.rows; y++) {
          for (let x = 0; x < state.cols; x++) {
            const t = tileAt(x, y); if (!t || (!t.classList.contains('road') && !t.classList.contains('bridge'))) continue;
            const tn = tileAt(x, y - 1); const ts = tileAt(x, y + 1); const tw = tileAt(x - 1, y); const te = tileAt(x + 1, y);
            const north = !!(tn && (tn.classList.contains('road') || tn.classList.contains('bridge')));
            const south = !!(ts && (ts.classList.contains('road') || ts.classList.contains('bridge')));
            const west = !!(tw && (tw.classList.contains('road') || tw.classList.contains('bridge')));
            const east = !!(te && (te.classList.contains('road') || te.classList.contains('bridge')));
            const isBridge = t.classList.contains('bridge');
            conn.set(x + ',' + y, { north, south, west, east, isBridge });
          }
        }

        // Second pass: update DOM based on the connectivity map
        for (let y = 0; y < state.rows; y++) {
          for (let x = 0; x < state.cols; x++) {
            const t = tileAt(x, y); if (!t) continue;
            const key = x + ',' + y;
            const c = conn.get(key);
            if (!c) {
              // not a road or bridge: remove all cap and side classes/elements (including bridge center lines)
              t.classList.remove('cap-n', 'cap-s', 'cap-w', 'cap-e', 'side-n', 'side-s', 'side-w', 'side-e', 'bridge-cap-n', 'bridge-cap-s', 'bridge-cap-w', 'bridge-cap-e', 'bridge-side-n', 'bridge-side-s', 'bridge-side-w', 'bridge-side-e', 'bridge-line-n', 'bridge-line-s', 'bridge-line-w', 'bridge-line-e');
              ['cap-n', 'cap-s', 'cap-w', 'cap-e', 'side-n', 'side-s', 'side-w', 'side-e', 'bridge-cap-n', 'bridge-cap-s', 'bridge-cap-w', 'bridge-cap-e', 'bridge-side-n', 'bridge-side-s', 'bridge-side-w', 'bridge-side-e', 'bridge-line-n', 'bridge-line-s', 'bridge-line-w', 'bridge-line-e'].forEach(nm => { const el = t.querySelector('.' + nm); if (el) el.remove(); });
              continue;
            }

            const { north, south, west, east, isBridge } = c;

            if (isBridge) {
              // Remove any bridge caps so adjacent bridges join with no center lines
              t.classList.remove('bridge-cap-n', 'bridge-cap-s', 'bridge-cap-w', 'bridge-cap-e');
              ['bridge-cap-n','bridge-cap-s','bridge-cap-w','bridge-cap-e'].forEach(nm => { const el = t.querySelector('.' + nm); if (el) el.remove(); });

              // Remove bridge railings from bridge tiles themselves
              t.classList.remove('bridge-side-n', 'bridge-side-s', 'bridge-side-w', 'bridge-side-e');
              ['bridge-side-n', 'bridge-side-s', 'bridge-side-w', 'bridge-side-e'].forEach(nm => { const el = t.querySelector('.' + nm); if (el) el.remove(); });

              // Add sidewalks to bridge tiles where they don't connect to roads/bridges
              if (!north) { 
                t.classList.add('side-n'); 
                if (!t.querySelector('.side-n')) { const s = document.createElement('div'); s.className = 'side-n'; t.appendChild(s); }
                if (!t.querySelector('.bridge-walk-rail-n')) { const r = document.createElement('div'); r.className = 'bridge-walk-rail-n'; t.appendChild(r); }
              } else { 
                t.classList.remove('side-n'); 
                const s = t.querySelector('.side-n'); if (s) s.remove();
                const r = t.querySelector('.bridge-walk-rail-n'); if (r) r.remove();
              }
              if (!south) { 
                t.classList.add('side-s'); 
                if (!t.querySelector('.side-s')) { const s = document.createElement('div'); s.className = 'side-s'; t.appendChild(s); }
                if (!t.querySelector('.bridge-walk-rail-s')) { const r = document.createElement('div'); r.className = 'bridge-walk-rail-s'; t.appendChild(r); }
              } else { 
                t.classList.remove('side-s'); 
                const s = t.querySelector('.side-s'); if (s) s.remove();
                const r = t.querySelector('.bridge-walk-rail-s'); if (r) r.remove();
              }
              if (!west) { 
                t.classList.add('side-w'); 
                if (!t.querySelector('.side-w')) { const s = document.createElement('div'); s.className = 'side-w'; t.appendChild(s); }
                if (!t.querySelector('.bridge-walk-rail-w')) { const r = document.createElement('div'); r.className = 'bridge-walk-rail-w'; t.appendChild(r); }
              } else { 
                t.classList.remove('side-w'); 
                const s = t.querySelector('.side-w'); if (s) s.remove();
                const r = t.querySelector('.bridge-walk-rail-w'); if (r) r.remove();
              }
              if (!east) { 
                t.classList.add('side-e'); 
                if (!t.querySelector('.side-e')) { const s = document.createElement('div'); s.className = 'side-e'; t.appendChild(s); }
                if (!t.querySelector('.bridge-walk-rail-e')) { const r = document.createElement('div'); r.className = 'bridge-walk-rail-e'; t.appendChild(r); }
              } else { 
                t.classList.remove('side-e'); 
                const s = t.querySelector('.side-e'); if (s) s.remove();
                const r = t.querySelector('.bridge-walk-rail-e'); if (r) r.remove();
              }

              // Bridge center white lines: show center-line segments where bridge connects to other roads/bridges
              if (north) { if (!t.querySelector('.bridge-line-n')) { const ln = document.createElement('div'); ln.className = 'bridge-line-n'; t.appendChild(ln); } } else { const ln = t.querySelector('.bridge-line-n'); if (ln) ln.remove(); }
              if (south) { if (!t.querySelector('.bridge-line-s')) { const ls = document.createElement('div'); ls.className = 'bridge-line-s'; t.appendChild(ls); } } else { const ls = t.querySelector('.bridge-line-s'); if (ls) ls.remove(); }
              if (west) { if (!t.querySelector('.bridge-line-w')) { const lw = document.createElement('div'); lw.className = 'bridge-line-w'; t.appendChild(lw); } } else { const lw = t.querySelector('.bridge-line-w'); if (lw) lw.remove(); }
              if (east) { if (!t.querySelector('.bridge-line-e')) { const le = document.createElement('div'); le.className = 'bridge-line-e'; t.appendChild(le); } } else { const le = t.querySelector('.bridge-line-e'); if (le) le.remove(); }
            } else {
              // Handle regular road connections
              // caps
              if (north) { t.classList.add('cap-n'); if (!t.querySelector('.cap-n')) { const el = document.createElement('div'); el.className = 'cap-n'; t.appendChild(el); } } else { t.classList.remove('cap-n'); const el = t.querySelector('.cap-n'); if (el) el.remove(); }
              if (south) { t.classList.add('cap-s'); if (!t.querySelector('.cap-s')) { const el = document.createElement('div'); el.className = 'cap-s'; t.appendChild(el); } } else { t.classList.remove('cap-s'); const el = t.querySelector('.cap-s'); if (el) el.remove(); }
              if (west) { t.classList.add('cap-w'); if (!t.querySelector('.cap-w')) { const el = document.createElement('div'); el.className = 'cap-w'; t.appendChild(el); } } else { t.classList.remove('cap-w'); const el = t.querySelector('.cap-w'); if (el) el.remove(); }
              if (east) { t.classList.add('cap-e'); if (!t.querySelector('.cap-e')) { const el = document.createElement('div'); el.className = 'cap-e'; t.appendChild(el); } } else { t.classList.remove('cap-e'); const el = t.querySelector('.cap-e'); if (el) el.remove(); }

              // sidewalks: show side if this tile is road and neighbor is NOT a road/bridge
              if (!north) { t.classList.add('side-n'); if (!t.querySelector('.side-n')) { const s = document.createElement('div'); s.className = 'side-n'; t.appendChild(s); } } else { t.classList.remove('side-n'); const s = t.querySelector('.side-n'); if (s) s.remove(); }
              if (!south) { t.classList.add('side-s'); if (!t.querySelector('.side-s')) { const s = document.createElement('div'); s.className = 'side-s'; t.appendChild(s); } } else { t.classList.remove('side-s'); const s = t.querySelector('.side-s'); if (s) s.remove(); }
              if (!west) { t.classList.add('side-w'); if (!t.querySelector('.side-w')) { const s = document.createElement('div'); s.className = 'side-w'; t.appendChild(s); } } else { t.classList.remove('side-w'); const s = t.querySelector('.side-w'); if (s) s.remove(); }
              if (!east) { t.classList.add('side-e'); if (!t.querySelector('.side-e')) { const s = document.createElement('div'); s.className = 'side-e'; t.appendChild(s); } } else { t.classList.remove('side-e'); const s = t.querySelector('.side-e'); if (s) s.remove(); }

              // Create corner fills on road tiles when they form T or 4-way intersections
              const neighborCount = (north?1:0) + (south?1:0) + (west?1:0) + (east?1:0);
              // place corner elements for T / 4-way (3 or 4 neighbors) or perpendicular elbows (2 neighbors that are perpendicular)
              const isElbowNW = north && west && !south && !east;
              const isElbowNE = north && east && !south && !west;
              const isElbowSW = south && west && !north && !east;
              const isElbowSE = south && east && !north && !west;
              if (neighborCount >= 3 || isElbowNW || isElbowNE || isElbowSW || isElbowSE) {
                if (!t.querySelector('.corner-nw')) { const c = document.createElement('div'); c.className = 'corner-nw'; t.appendChild(c); }
                if (!t.querySelector('.corner-ne')) { const c = document.createElement('div'); c.className = 'corner-ne'; t.appendChild(c); }
                if (!t.querySelector('.corner-sw')) { const c = document.createElement('div'); c.className = 'corner-sw'; t.appendChild(c); }
                if (!t.querySelector('.corner-se')) { const c = document.createElement('div'); c.className = 'corner-se'; t.appendChild(c); }

                // Intersection: remove center line caps so there is no center-line visual
                ['cap-n','cap-s','cap-w','cap-e'].forEach(nm => { t.classList.remove(nm); const el = t.querySelector('.' + nm); if (el) el.remove(); });
              } else {
                ['corner-nw','corner-ne','corner-sw','corner-se'].forEach(nm => { const el = t.querySelector('.' + nm); if (el) el.remove(); });
                // not an intersection: nothing to do regarding crosswalks
              }
            }
          }
        }

        // Third pass: add bridge railings to adjacent water tiles
        for (let y = 0; y < state.rows; y++) {
          for (let x = 0; x < state.cols; x++) {
            const t = tileAt(x, y);
            if (!t || !t.classList.contains('river')) continue; // Only process water tiles

            // Check adjacent tiles for bridges
            const northTile = tileAt(x, y - 1);
            const southTile = tileAt(x, y + 1);
            const westTile = tileAt(x - 1, y);
            const eastTile = tileAt(x + 1, y);

            const hasNorthBridge = northTile && northTile.classList.contains('bridge');
            const hasSouthBridge = southTile && southTile.classList.contains('bridge');
            const hasWestBridge = westTile && westTile.classList.contains('bridge');
            const hasEastBridge = eastTile && eastTile.classList.contains('bridge');

            // Remove existing bridge railings from water tiles
            t.classList.remove('bridge-side-n', 'bridge-side-s', 'bridge-side-w', 'bridge-side-e');
            ['bridge-side-n', 'bridge-side-s', 'bridge-side-w', 'bridge-side-e'].forEach(nm => {
              const el = t.querySelector('.' + nm);
              if (el) el.remove();
            });

            // Add bridge railings on the side facing the bridge
            if (hasNorthBridge) {
              t.classList.add('bridge-side-n');
              if (!t.querySelector('.bridge-side-n')) {
                const s = document.createElement('div');
                s.className = 'bridge-side-n';
                t.appendChild(s);
              }
            }
            if (hasSouthBridge) {
              t.classList.add('bridge-side-s');
              if (!t.querySelector('.bridge-side-s')) {
                const s = document.createElement('div');
                s.className = 'bridge-side-s';
                t.appendChild(s);
              }
            }
            if (hasWestBridge) {
              t.classList.add('bridge-side-w');
              if (!t.querySelector('.bridge-side-w')) {
                const s = document.createElement('div');
                s.className = 'bridge-side-w';
                t.appendChild(s);
              }
            }
            if (hasEastBridge) {
              t.classList.add('bridge-side-e');
              if (!t.querySelector('.bridge-side-e')) {
                const s = document.createElement('div');
                s.className = 'bridge-side-e';
                t.appendChild(s);
              }
            }
          }
        }

        // Fourth pass: add riverside pathways to grass tiles adjacent to rivers
        for (let y = 0; y < state.rows; y++) {
          for (let x = 0; x < state.cols; x++) {
            const t = tileAt(x, y);
            // Process tiles that are grass or default tiles (not roads, bridges, rivers, or diagonal tiles)
            if (!t || t.classList.contains('road') || t.classList.contains('bridge') || t.classList.contains('river') || 
                t.classList.contains('diagonal-nw') || t.classList.contains('diagonal-ne') || 
                t.classList.contains('diagonal-sw') || t.classList.contains('diagonal-se')) continue;

            // Check adjacent tiles for rivers
            const northTile = tileAt(x, y - 1);
            const southTile = tileAt(x, y + 1);
            const westTile = tileAt(x - 1, y);
            const eastTile = tileAt(x + 1, y);

            const hasNorthRiver = northTile && northTile.classList.contains('river');
            const hasSouthRiver = southTile && southTile.classList.contains('river');
            const hasWestRiver = westTile && westTile.classList.contains('river');
            const hasEastRiver = eastTile && eastTile.classList.contains('river');

            // Remove existing riverside elements
            t.classList.remove('river-side-n', 'river-side-s', 'river-side-w', 'river-side-e');
            ['river-side-n', 'river-side-s', 'river-side-w', 'river-side-e', 'river-path-n', 'river-path-s', 'river-path-w', 'river-path-e', 'river-grass-n', 'river-grass-s', 'river-grass-w', 'river-grass-e'].forEach(nm => {
              const el = t.querySelector('.' + nm);
              if (el) el.remove();
            });

            // Add riverside pathways on the side facing the river
            if (hasNorthRiver) {
              t.classList.add('river-side-n');
              // Add railing
              if (!t.querySelector('.river-side-n')) {
                const railing = document.createElement('div');
                railing.className = 'river-side-n';
                t.appendChild(railing);
              }
              // Add grass strip
              if (!t.querySelector('.river-grass-n')) {
                const grass = document.createElement('div');
                grass.className = 'river-grass-n';
                t.appendChild(grass);
              }
              // pathway removed: grass tiles should not receive asphalt paths
            }
            if (hasSouthRiver) {
              t.classList.add('river-side-s');
              if (!t.querySelector('.river-side-s')) {
                const railing = document.createElement('div');
                railing.className = 'river-side-s';
                t.appendChild(railing);
              }
              if (!t.querySelector('.river-grass-s')) {
                const grass = document.createElement('div');
                grass.className = 'river-grass-s';
                t.appendChild(grass);
              }
              // pathway removed: grass tiles should not receive asphalt paths
            }
            if (hasWestRiver) {
              t.classList.add('river-side-w');
              if (!t.querySelector('.river-side-w')) {
                const railing = document.createElement('div');
                railing.className = 'river-side-w';
                t.appendChild(railing);
              }
              if (!t.querySelector('.river-grass-w')) {
                const grass = document.createElement('div');
                grass.className = 'river-grass-w';
                t.appendChild(grass);
              }
              // pathway removed: grass tiles should not receive asphalt paths
            }
            if (hasEastRiver) {
              t.classList.add('river-side-e');
              if (!t.querySelector('.river-side-e')) {
                const railing = document.createElement('div');
                railing.className = 'river-side-e';
                t.appendChild(railing);
              }
              if (!t.querySelector('.river-grass-e')) {
                const grass = document.createElement('div');
                grass.className = 'river-grass-e';
                t.appendChild(grass);
              }
              // pathway removed: grass tiles should not receive asphalt paths
            }
          }
        }

        // Handle diagonal tiles - automatically detect water adjacency and create appropriate diagonal
        for (let y = 0; y < state.rows; y++) {
          for (let x = 0; x < state.cols; x++) {
            const t = tileAt(x, y);
            if (!t) continue;

            // Clear any existing diagonal classes and elements
            const diagonalClasses = ['diagonal-nw', 'diagonal-ne', 'diagonal-sw', 'diagonal-se'];
            const diagonalElements = ['diagonal-rail-nw', 'diagonal-rail-ne', 'diagonal-rail-sw', 'diagonal-rail-se',
                                    'diagonal-grass-nw', 'diagonal-grass-ne', 'diagonal-grass-sw', 'diagonal-grass-se',
                                    'diagonal-path-nw', 'diagonal-path-ne', 'diagonal-path-sw', 'diagonal-path-se'];
            
            diagonalClasses.forEach(cls => {
              t.classList.remove(cls);
              const el = t.querySelector('.' + cls);
              if (el) el.remove();
            });

            diagonalElements.forEach(elClass => {
              const el = t.querySelector('.' + elClass);
              if (el) el.remove();
            });

            // Check if this tile is marked for diagonal treatment in config
            let shouldBeDiagonal = false;
            let configDiagonalType = null;
            
            for (const [tileType, coordinates] of Object.entries(homebaseTileConfig)) {
              if (tileType.startsWith('diagonal-')) {
                for (const coord of coordinates) {
                  const [configX, configY] = coord.split(',').map(Number);
                  if (configX === x && configY === y) {
                    shouldBeDiagonal = true;
                    configDiagonalType = tileType;
                    break;
                  }
                }
              }
              if (shouldBeDiagonal) break;
            }

            if (shouldBeDiagonal) {
              // Check adjacent tiles for water
              const northTile = tileAt(x, y - 1);
              const southTile = tileAt(x, y + 1);
              const westTile = tileAt(x - 1, y);
              const eastTile = tileAt(x + 1, y);

              const hasNorthWater = northTile && northTile.classList.contains('river');
              const hasSouthWater = southTile && southTile.classList.contains('river');
              const hasWestWater = westTile && westTile.classList.contains('river');
              const hasEastWater = eastTile && eastTile.classList.contains('river');

              // Determine diagonal orientation based on water adjacency
              let diagonalType = null;
              
              if (hasNorthWater && hasWestWater) {
                diagonalType = 'diagonal-nw'; // Water in northwest
              } else if (hasNorthWater && hasEastWater) {
                diagonalType = 'diagonal-ne'; // Water in northeast
              } else if (hasSouthWater && hasWestWater) {
                diagonalType = 'diagonal-sw'; // Water in southwest
              } else if (hasSouthWater && hasEastWater) {
                diagonalType = 'diagonal-se'; // Water in southeast
              } else if (hasNorthWater) {
                diagonalType = 'diagonal-nw'; // Default to northwest if only north water
              } else if (hasSouthWater) {
                diagonalType = 'diagonal-sw'; // Default to southwest if only south water
              } else if (hasWestWater) {
                diagonalType = 'diagonal-nw'; // Default to northwest if only west water
              } else if (hasEastWater) {
                diagonalType = 'diagonal-ne'; // Default to northeast if only east water
              } else {
                // Fallback to config type if no water detected
                diagonalType = configDiagonalType;
              }

              if (diagonalType) {
                t.classList.add(diagonalType);
                // Create diagonal element if it doesn't exist
                if (!t.querySelector('.' + diagonalType)) {
                  const diagonalElement = document.createElement('div');
                  diagonalElement.className = diagonalType;
                  t.appendChild(diagonalElement);
                }

                // Create diagonal rail, grass, and path elements
                const railClass = 'diagonal-rail-' + diagonalType.split('-')[1];
                const grassClass = 'diagonal-grass-' + diagonalType.split('-')[1];
                const pathClass = 'diagonal-path-' + diagonalType.split('-')[1];

                if (!t.querySelector('.' + railClass)) {
                  const railElement = document.createElement('div');
                  railElement.className = railClass;
                  t.appendChild(railElement);
                }

                if (!t.querySelector('.' + grassClass)) {
                  const grassElement = document.createElement('div');
                  grassElement.className = grassClass;
                  t.appendChild(grassElement);
                }

                // Do not create diagonal asphalt path elements for diagonal tiles
              }
            }
          }
        }
      }

      // ======= Debug Borders Toggle =======
      if (toggleBordersBtn) {
        toggleBordersBtn.addEventListener('click', () => {
          const page = document.querySelector('#homebase-page');
          if (!page) return;
          page.classList.toggle('debug-borders');
        });
      }

      // Precompute adjacency (non-road/bridge tiles touching a road or bridge)
      function markAdjacency() {
        for (let y = 0; y < state.rows; y++) {
          for (let x = 0; x < state.cols; x++) {
            const t = tileAt(x, y); if (!t || t.classList.contains('road') || t.classList.contains('bridge')) continue;
            // clear previous adj state
            t.classList.remove('adj', 'adj-n', 'adj-s', 'adj-w', 'adj-e');
            ['corner-nw','corner-ne','corner-sw','corner-se'].forEach(nm => { const el = t.querySelector('.' + nm); if (el) el.remove(); });

            const northIsRoadOrBridge = state.roads.has(roadKey(x, y - 1)) || state.bridges.has(bridgeKey(x, y - 1));
            const southIsRoadOrBridge = state.roads.has(roadKey(x, y + 1)) || state.bridges.has(bridgeKey(x, y + 1));
            const westIsRoadOrBridge = state.roads.has(roadKey(x - 1, y)) || state.bridges.has(bridgeKey(x - 1, y));
            const eastIsRoadOrBridge = state.roads.has(roadKey(x + 1, y)) || state.bridges.has(bridgeKey(x + 1, y));

            if (northIsRoadOrBridge || southIsRoadOrBridge || westIsRoadOrBridge || eastIsRoadOrBridge) {
              t.classList.add('adj');
            }
            if (northIsRoadOrBridge) t.classList.add('adj-n');
            if (southIsRoadOrBridge) t.classList.add('adj-s');
            if (westIsRoadOrBridge) t.classList.add('adj-w');
            if (eastIsRoadOrBridge) t.classList.add('adj-e');

            // corners for non-road tiles are no longer created here (they're handled on road tiles)
          }
        }
      }
      // Update sprites then compute adjacency
      updateRoadSprites();
      markAdjacency();

      // Expose helpers for console/debugging
      window.generateRoadNetwork = generateRoadNetwork;
      window.updateRoadSprites = updateRoadSprites;
      window.markAdjacency = markAdjacency;

      // ======= PALETTE TABS & CARDS =======
      let activeCat = 'res';
      // Defensive: avoid duplicate initialization if this module is evaluated twice
      if (!tabsEl.dataset._homebaseInited) {
        CATS.forEach((c, i) => {
          const el = document.createElement('div');
          el.className = 'tab' + (i === 0 ? ' active' : '');
          el.textContent = c.name;
          el.onclick = () => { activeCat = c.id; renderCards();[...tabsEl.children].forEach(n => n.classList.remove('active')); el.classList.add('active'); };
          tabsEl.appendChild(el);
        });
        tabsEl.dataset._homebaseInited = '1';
      }

      function renderCards() {
        cardsEl.innerHTML = '';
        const list = BUILDINGS.filter(b => b.cat === activeCat);
        for (const b of list) {
          const card = document.createElement('div'); card.className = 'card';
          const afford = canAfford(b);
          if (state.selection && state.selection.id === b.id) card.classList.add('selected');
          card.innerHTML = `
        <h4>${b.name}</h4>
        <div class="row">
          <span class="chip ${afford ? '' : 'red'}">🪵 ${b.cost.wood}</span>
          <span class="chip ${afford ? '' : 'red'}">🪨 ${b.cost.stone}</span>
          <span class="chip">🛡 ${b.durability} dur</span>
          <span class="chip">📐 ${b.footprint[0]}×${b.footprint[1]}</span>
        </div>
        <div class="slots">
          ${b.slots.F ? `<span class='slot'>🪑 ×${b.slots.F}</span>` : ''}
          ${b.slots.W ? `<span class='slot'>🛠️ ×${b.slots.W}</span>` : ''}
          ${b.slots.S ? `<span class='slot'>📦 ×${b.slots.S}</span>` : ''}
          ${b.slots.D ? `<span class='slot'>🛡️ ×${b.slots.D}</span>` : ''}
        </div>
        <div class="desc">${b.tags.join(' • ')}</div>
        <div class="choose"><button class="btn primary" ${state.selection && state.selection.id === b.id ? 'disabled' : ''}>${state.selection && state.selection.id === b.id ? 'Selected' : 'Select'}</button></div>
      `;
          card.querySelector('button').onclick = () => selectBuilding(b);
          cardsEl.appendChild(card);
        }
      }
      renderCards();

      // Favorites row (recent 3)
      const fav = [];
      function pushFav(b) {
        const idx = fav.findIndex(x => x.id === b.id);
        if (idx !== -1) fav.splice(idx, 1);
        fav.unshift(b);
        if (fav.length > 3) fav.pop();
        favRow.innerHTML = '';
        fav.forEach(f => {
          const el = document.createElement('div'); el.className = 'pill'; el.textContent = f.name; el.onclick = () => selectBuilding(f); favRow.appendChild(el);
        })
      }

      // ======= SELECTION & GHOST =======
      let ghostEl = null; let ghostTip = null; let ghostMeta = null;
      let hoverCell = { x: null, y: null };

      function selectBuilding(b) {
        state.selection = b;
        document.body.classList.add('show-adj');
        pushFav(b);
        hint.textContent = `Placing: ${b.name} — Rotate Q/E · Hold Shift to stamp`;
        updateDeltas();
        renderCards();
        highlightValidTiles();
        updateAffordChip();
      }

      function clearSelectable() {
        document.querySelectorAll('#homebase-page .tile.selectable').forEach(t => t.classList.remove('selectable'));
      }

      function highlightValidTiles() {
        clearSelectable();
        if (!state.selection) return;
        const { w, h } = footprintSize();
        for (let y = 0; y <= state.rows - h; y++) {
          for (let x = 0; x <= state.cols - w; x++) {
            if (validatePlacement(x, y, w, h).ok) {
              const t = tileAt(x, y);
              if (t) t.classList.add('selectable');
            }
          }
        }
      }

      function ensureGhost() {
        removeGhost();
        if (!state.selection) return;
        ghostEl = document.createElement('div');
        ghostEl.className = 'ghost-cell';
        ghostMeta = document.createElement('div'); ghostMeta.className = 'ghost-meta'; ghostEl.appendChild(ghostMeta);
        ghostTip = document.createElement('div'); ghostTip.className = 'tip'; ghostTip.style.display = 'none'; ghostEl.appendChild(ghostTip);
        mapEl.appendChild(ghostEl);
        updateGhostMeta();
        positionGhost();
      }
      function removeGhost() { if (ghostEl) { ghostEl.remove(); ghostEl = null; ghostMeta = null; ghostTip = null; } }

      function footprintSize() {
        const [w, h] = state.selection ? state.selection.footprint : [1, 1];
        return { w, h };
      }

      function updateGhostMeta() {
        if (!state.selection || !ghostMeta) return;
        const s = state.selection.slots; ghostMeta.innerHTML = '';
        if (s.D) ghostMeta.appendChild(chip(`🛡️ +${s.D}`));
        if (s.W) ghostMeta.appendChild(chip(`🛠️ +${s.W}`));
        if (s.S) ghostMeta.appendChild(chip(`📦 +${s.S}`));
        if (s.F) ghostMeta.appendChild(chip(`🪑 +${s.F}`));
        function chip(text) { const el = document.createElement('div'); el.className = 'gchip'; el.textContent = text; return el; }
      }

      function positionGhost() {
        if (!ghostEl || hoverCell.x == null) return;
        const { w, h } = footprintSize();
        const x = Math.min(hoverCell.x, state.cols - w);
        const y = Math.min(hoverCell.y, state.rows - h);
        const cellSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell'));
        const left = x * (cellSize + 3);
        const top = y * (cellSize + 3);
        ghostEl.style.width = `calc(${w} * var(--cell) + ${(w - 1) * 3}px)`;
        ghostEl.style.height = `calc(${h} * var(--cell) + ${(h - 1) * 3}px)`;
        ghostEl.style.left = left + "px";
        ghostEl.style.top = top + "px";

        const validity = validatePlacement(x, y, w, h);
        ghostEl.classList.toggle('valid', validity.ok);
        ghostEl.classList.toggle('invalid', !validity.ok);
        if (ghostTip) {
          if (validity.ok) { ghostTip.style.display = 'none'; }
          else { ghostTip.style.display = 'block'; ghostTip.textContent = validity.reason; }
        }
        showProjectedDeltas(validity);
      }

      function showProjectedDeltas(validity) {
        if (!validity.ok || !state.selection) { 
          updateDeltas(true); 
          return; 
        }
        const b = state.selection;
        woodDeltaEl.textContent = '−' + b.cost.wood; 
        woodDeltaEl.className = 'delta minus';
        stoneDeltaEl.textContent = '−' + b.cost.stone; 
        stoneDeltaEl.className = 'delta minus';
      }

      // Hover tracking and coordinate HUD
      // create coord hud if missing
      let coordHud = document.querySelector('#homebase-coord-hud');
      if (!coordHud) {
        coordHud = document.createElement('div');
        coordHud.id = 'homebase-coord-hud';
        coordHud.className = 'coord-hud';
        document.body.appendChild(coordHud);
      }

      mapEl.addEventListener('mousemove', e => {
        const t = e.target.closest('.tile');
        if (!t) { coordHud.style.display = 'none'; return; }
        const tx = +t.dataset.x, ty = +t.dataset.y;
        hoverCell = { x: tx, y: ty };

        // show coord HUD near cursor
        coordHud.style.display = 'block';
        coordHud.textContent = `x:${tx} y:${ty}`;
        // offset slightly from cursor
        coordHud.style.left = (e.clientX + 12) + 'px';
        coordHud.style.top = (e.clientY + 12) + 'px';
        coordHud.style.transform = 'translate(0,0)';
      });

      mapEl.addEventListener('mouseleave', () => { hoverCell = { x: null, y: null }; coordHud.style.display = 'none'; });

      // ======= AUTO-FIT PLACEMENT SYSTEM =======
      // Removed rotation system - replaced with auto-fit that prioritizes left then down
      function findBestFit(clickX, clickY, w, h) {
        // Priority order: left first, then down
        const offsets = [
          [0, 0],     // clicked position
          [-1, 0],    // left
          [-2, 0],    // further left
          [0, -1],    // up
          [-1, -1],   // up-left
          [0, 1],     // down
          [-1, 1],    // down-left
          [-2, 1],    // down further left
          [1, 0],     // right (lower priority)
          [1, -1],    // up-right
          [1, 1],     // down-right
        ];

        for (const [dx, dy] of offsets) {
          const testX = clickX + dx;
          const testY = clickY + dy;
          
          if (validatePlacement(testX, testY, w, h).ok) {
            return { x: testX, y: testY };
          }
        }
        
        return null; // No valid placement found
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') state.chain = true;
        if (e.key === 'z' || e.key === 'Z') { undo(); }
      });
      document.addEventListener('keyup', (e) => { if (e.key === 'Shift') state.chain = false; });

      // ======= VALIDATION =======
      function canAfford(b) { return state.wood >= b.cost.wood && state.stone >= b.cost.stone; }

      /**
       * Validates if a building can be placed at the specified location
       * Checks for:
       * - Out of bounds
       * - Roads/rivers/bridges
       * - Occupied spaces
       * - Walls
       * - Fog of war (locked regions)
       * - Road adjacency requirements
       */
      function validatePlacement(x, y, w, h) {
        const b = state.selection; if (!b) return { ok: false, reason: 'No selection' };
        if (x < 0 || y < 0 || x + w > state.cols || y + h > state.rows) return { ok: false, reason: 'Out of bounds' };
        for (let yy = y; yy < y + h; yy++) {
          for (let xx = x; xx < x + w; xx++) {
            const key = xx + "," + yy;
            if (state.roads.has(key) || state.rivers.has(key) || state.bridges.has(key)) return { ok: false, reason: 'Cannot place on a road, river, or bridge' };
            if (state.occupied.has(key)) return { ok: false, reason: 'Space occupied' };
            
            // Check if tile has a wall - buildings cannot be placed on walls
            const tile = tileAt(xx, yy);
            if (tile && tile.classList.contains('wall')) return { ok: false, reason: 'Cannot place on walls' };
            
            // Check if tile is in fog of war (locked region) - prevent building in areas you don't own
            if (tile && tile.classList.contains('fog-of-war')) return { ok: false, reason: 'Cannot build in locked regions' };
            
            // For road-adjacent buildings, also check if tile is directly touching rivers or bridges
            if (b.tags.includes('Road-adjacent')) {
              const n = [[xx + 1, yy], [xx - 1, yy], [xx, yy + 1], [xx, yy - 1]];
              for (const [nx, ny] of n) {
                if (state.rivers.has(nx + "," + ny) || state.bridges.has(nx + "," + ny)) {
                  return { ok: false, reason: 'Road-adjacent buildings cannot touch rivers or bridges' };
                }
              }
            }
          }
        }
        let adjacent = false;
        outer: for (let yy = y; yy < y + h; yy++) {
          for (let xx = x; xx < x + w; xx++) {
            const n = [[xx + 1, yy], [xx - 1, yy], [xx, yy + 1], [xx, yy - 1]];
            for (const [nx, ny] of n) { 
              // Check building requirements based on tags
              const hasRoadAdjacency = b.tags.includes('Road-adjacent');
              if (hasRoadAdjacency) {
                // Only roads count for adjacency, not rivers or bridges
                if (state.roads.has(nx + "," + ny)) { 
                  adjacent = true; 
                  break outer; 
                }
              } else {
                // For buildings without road requirement, allow any infrastructure
                if (state.roads.has(nx + "," + ny) || state.rivers.has(nx + "," + ny) || state.bridges.has(nx + "," + ny)) { 
                  adjacent = true; 
                  break outer; 
                }
              }
            }
          }
        }
        if (!adjacent) return { ok: false, reason: 'Needs road adjacency' };
        if (!canAfford(b)) return { ok: false, reason: 'Insufficient resources' };
        return { ok: true, reason: 'OK' };
      }

      // ======= PLACE / UNDO =======
      mapEl.addEventListener('click', (e) => {
        if (!state.selection) return;
        const t = e.target.closest('.tile'); if (!t) return;
        const clickX = +t.dataset.x; 
        const clickY = +t.dataset.y;
        const { w, h } = footprintSize();
        
        // Use auto-fit system to find best placement position
        const bestFit = findBestFit(clickX, clickY, w, h);
        if (!bestFit) {
          // Check if trying to place in fog of war
          const hasFog = t.classList.contains('fog-of-war');
          if (hasFog) {
            toast('Cannot build in locked regions - unlock this area first', 'warn');
          } else {
            toast('Cannot place building in this area', 'warn');
          }
          return;
        }
        
        doPlace(bestFit.x, bestFit.y, w, h);
        if (!state.chain) { state.selection = null; clearSelectable(); document.body.classList.remove('show-adj'); hint.textContent = 'Pick another building or select again to continue.'; updateDeltas(true); renderCards(); updateAffordChip(); }
        else { updateAffordChip(); }
      });

      function doPlace(x, y, w, h) {
        const b = state.selection;
        
        // Check if player can afford the building
        if (!canAfford(b)) {
          toast(`Not enough resources! Need ${b.cost.wood} wood and ${b.cost.stone} stone`, 'warn');
          return;
        }
        
        tickResources(-b.cost.wood, -b.cost.stone);

        const cover = document.createElement('div');
        cover.className = 'placed';
        cover.dataset.cat = b.cat;
        cover.dataset.w = w;
        cover.dataset.h = h;
        cover.dataset.roof = b.roofType;
        cover.style.position = 'absolute';
        cover.style.left = `calc(${x} * var(--cell))`;
        cover.style.top = `calc(${y} * var(--cell))`;
        cover.style.width = `calc(${w} * var(--cell))`;
        cover.style.height = `calc(${h} * var(--cell))`;
        const label = document.createElement('div'); label.className = 'name'; label.textContent = b.name; cover.appendChild(label);
        mapEl.appendChild(cover);
        cover.animate([{ transform: 'scale(.96)', opacity: .0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 220, easing: 'ease-out' });

        const cells = [];
        for (let yy = y; yy < y + h; yy++) {
          for (let xx = x; xx < x + w; xx++) {
            const key = xx + "," + yy; state.occupied.set(key, { id: b.id, name: b.name }); cells.push(key);
          }
        }
        state.lastPlaced = { b, x, y, w, h, el: cover, cells };
        undoBtn.disabled = false;
        toast(`Placed ${b.name}`, 'info', true);
      }

      function undo() {
        const lp = state.lastPlaced; if (!lp) return;
        tickResources(lp.b.cost.wood, lp.b.cost.stone);
        lp.cells.forEach(k => state.occupied.delete(k));
        lp.el.remove();
        state.lastPlaced = null;
        undoBtn.disabled = true;
        toast('Undo placement');
        updateAffordChip();
        highlightValidTiles();
      }
      undoBtn.onclick = undo;

      function tickResources(dw, ds) {
        state.wood += dw; state.stone += ds; woodEl.textContent = state.wood; stoneEl.textContent = state.stone;
        woodEl.animate([{ transform: 'scale(1.0)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1.0)' }], { duration: 240 });
        stoneEl.animate([{ transform: 'scale(1.0)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1.0)' }], { duration: 240 });
      }

      function updateDeltas(clear) {
        if (clear || !state.selection) { woodDeltaEl.textContent = ''; stoneDeltaEl.textContent = ''; return; }
        woodDeltaEl.textContent = '−' + state.selection.cost.wood; woodDeltaEl.className = 'delta minus';
        stoneDeltaEl.textContent = '−' + state.selection.cost.stone; stoneDeltaEl.className = 'delta minus';
      }

      function updateAffordChip() {
  if (!affordChip) return; // afford chip UI removed; no-op
  const b = state.selection; if (!b) { affordChip.textContent = ''; affordChip.disabled = true; return; }
        const w = Math.floor(state.wood / b.cost.wood);
        const s = Math.floor(state.stone / b.cost.stone);
        const count = Math.max(0, Math.min(w, s));
        affordChip.textContent = `${count}× affordable`;
        affordChip.disabled = false;
      }

      // ======= TOASTS =======
      function toast(msg, type = 'info', withUndo = false) {
        const t = document.createElement('div'); t.className = 'toast';
        t.style.borderLeftColor = type === 'warn' ? 'var(--warn)' : type === 'error' ? 'var(--danger)' : 'var(--accent)';
        t.textContent = msg;
        if (withUndo) { const a = document.createElement('span'); a.className = 'link'; a.textContent = 'Undo'; a.onclick = undo; t.appendChild(a); }
        toasts.appendChild(t);
        setTimeout(() => { t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350 }); setTimeout(() => t.remove(), 360); }, 2200);
      }

      window.initializeHomeBase = window.initializeHomeBase || function () { };

      // ======= REGIONS HUD =======
      (function initRegionsHud() {
        const statusEl = document.querySelector('#homebase-page #regionsStatus');
        const btnEl = document.querySelector('#homebase-page #unlockRegionBtn');
        if (!statusEl || !btnEl) return;
        const total = Object.keys(getRegionConfig()).length;

        function updateRegionsHud() {
          const count = (state.unlockedRegions && typeof state.unlockedRegions.size === 'number') ? state.unlockedRegions.size : 1;
          statusEl.textContent = `${count}/${total}`;
          btnEl.disabled = count >= total;
          btnEl.title = count >= total ? 'All regions unlocked' : 'Unlock next region';
        }

        function nextRegionId() {
          // unlock in ascending order 1..N
          for (let i = 1; i <= total; i++) {
            if (!state.unlockedRegions.has(i)) return i;
          }
          return null;
        }

        btnEl.addEventListener('click', () => {
          const id = nextRegionId();
          if (!id) return;
          state.unlockedRegions.add(id);
          drawWalls();
          showNotification(`Unlocked region ${id}`);
          updateRegionsHud();
        });

        // initial paint
        updateRegionsHud();
      })();

      // ======= WALL UPGRADE HUD =======
      (function initWallUpgradeHud() {
        const levelEl = document.querySelector('#homebase-page #wallLevel');
        const btnEl = document.querySelector('#homebase-page #upgradeWallBtn');
        if (!levelEl || !btnEl) return;

        // Bunker now replaces the old Concrete/Metal mix as the final tier; bunker-tier removed.
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
          updateAffordChip();
          
          showNotification(`Walls upgraded to ${wallTypes[state.wallLevel]}`);
        }

        btnEl.addEventListener('click', upgradeWall);

        // initial paint
        updateWallUpgradeHud();
      })();

    })();
  

// ---- inline script #5 ----

function initializeHomeBase() { }
