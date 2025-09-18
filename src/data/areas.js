// areas.js (readable stub)
const AreasModule = { id: "areas" };
if (typeof window !== "undefined") {
  window.gameModules = window.gameModules || {};
  window.gameModules.areas = AreasModule;
}
export default AreasModule;
// Auto-split from monolith.js
// Source section: data/areas.js

function setupButtons() {
  const id = (s) => document.getElementById(s);
  const map = [
    ["btn-save", "saveGame"],
    ["btn-load", "loadGame"],
    ["btn-reset", "resetGame"],
    ["back-to-areas", "goBackToAreas"],
  ];
  map.forEach(([btnId, fnName]) => {
    const btn = id(btnId);
    if (btn && typeof window[fnName] === "function")
      btn.addEventListener("click", () => window[fnName]());
  });
}

function handleClick(event) {
  const target = event.target.closest(
    "[data-page], .nav-item[data-skill], .area-card, .enemy-item"
  );
  if (!target) return;

  if (target.dataset.page) {
    showPage(target.dataset.page);
  } else if (target.classList.contains("nav-item") && target.dataset.skill) {
    showSkillPage(target.dataset.skill);
  } else if (
    target.classList.contains("area-card") &&
    !target.classList.contains("locked")
  ) {
    showAreaDetail(target.dataset.areaId);
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

function renderAreaContent(area) {
  renderGatheringResources(area);
  renderEnemies(area);
}

function buildNormalEnemies(area) {
  const areaLevel = area.level || 1;
  const out = [];
  const cfg =
    typeof AREA_REVAMP_CONFIG !== "undefined" && area && area.id
      ? AREA_REVAMP_CONFIG[area.id]
      : null;
  const whitelistArray = cfg && Array.isArray(cfg.enemies) ? cfg.enemies : null;

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
      const scaled = makeScaled(found.factionId, found.enemy, level, "regular");
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

let gameData = {
  areas: null,
  enemies: null,
  items: null,
  skills: null,
};
// Auto-split from monolith.js
// Source section: lists/areas_list.js

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
