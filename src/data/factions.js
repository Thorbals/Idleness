// factions.js (readable stub)
const FactionsModule = { id: "factions" };
if (typeof window !== "undefined") {
  window.gameModules = window.gameModules || {};
  window.gameModules.factions = FactionsModule;
}
export default FactionsModule;
// Auto-split from monolith.js
// Source section: lists/factions_list.js

function getFactionTextColor(factionId) {
  const faction = FACTION_CONFIG[factionId];
  if (!faction) return "rgba(255, 255, 255, 1)";
  return `rgba(${faction.color.r}, ${faction.color.g}, ${faction.color.b}, ${faction.textOpacity})`;
}

function getFactionBorderColor(factionId) {
  const faction = FACTION_CONFIG[factionId];
  if (!faction) return "rgba(255, 255, 255, 0.3)";
  return `rgba(${faction.color.r}, ${faction.color.g}, ${faction.color.b}, ${faction.borderOpacity})`;
}

function getFactionRGBString(factionId) {
  const faction = FACTION_CONFIG[factionId];
  if (!faction) return "128,128,128";
  return `${faction.color.r},${faction.color.g},${faction.color.b}`;
}

function generateFactionCSS() {
  let css = "";
  Object.values(FACTION_CONFIG).forEach((faction) => {
    css += `.faction-${faction.id} { color: ${getFactionTextColor(
      faction.id
    )}; }\n`;
  });
  Object.values(FACTION_CONFIG).forEach((faction) => {
    css += `.enemy-item.faction-${
      faction.id
    } .enemy-name { color: ${getFactionTextColor(faction.id)}; }\n`;
  });

  return css;
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

// Expose functions globally
if (typeof window !== "undefined") {
  window.generateFactionCSS = generateFactionCSS;
  window.pickFromFaction = pickFromFaction;
  window.getFactionTextColor = getFactionTextColor;
  window.getFactionBorderColor = getFactionBorderColor;
  window.getFactionRGBString = getFactionRGBString;
}
