// index.js (blank placeholder aggregator)
export default {
  initAllModules: function() {
    console.log("[GAME] All modules initialized");
  }
};

// Auto-split from monolith.js
// Source section: data/survivors.js

export function calculateRarityChance(baseRarity, playerLevel, sourceLevel) {
  const levelDifference = Math.max(0, playerLevel - sourceLevel);
  const bonusPercent = Math.floor(levelDifference / 5);

  let rarityChance;
  switch (baseRarity) {
    case "guaranteed":
      rarityChance = 1.0;
      break;
    case "epic":
      rarityChance = 0.02 + bonusPercent * 0.01;
      break;
    case "rare":
      rarityChance = 0.08 + bonusPercent * 0.01;
      break;
    case "common":
      rarityChance = Math.max(0.05, 0.4 - bonusPercent * 0.01);
      break;
    default:
      rarityChance = 1.0;
  }

  return Math.min(1.0, rarityChance);
}

export function addXP(skill, amount) {
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

function checkUnlockAnimalStructures(level) {
  ANIMAL_CARE_DATA.structures.forEach((structure) => {
    if (structure.level === level) {
      if (
        !gameState.animalCare.unlockedStructures.find((s) => s.level === level)
      ) {
        gameState.animalCare.unlockedStructures.push({
          id: `structure_${structure.level}`,
          name: structure.name,
          icon: structure.icon,
          level: structure.level,
          type: structure.type,
          animal: null,
          progress: 0,
          harvestTime: 0,
        });
        showNotification(`Unlocked ${structure.name}!`);
      }
    }
  });
}

export function getUnlockedPens(playerLevel) {
  return Math.min(
    ANIMAL_CARE_DATA.structures.filter(
      (structure) => playerLevel >= structure.level
    ).length,
    ANIMAL_CARE_DATA.structures.length
  );
}

export function getNextPenUnlockLevel(playerLevel) {
  const nextStructure = ANIMAL_CARE_DATA.structures.find(
    (structure) => structure.level > playerLevel
  );
  return nextStructure ? nextStructure.level : null;
}

export function updateSkillInfo() {
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

export function getNodeDifficultyClass(playerLevel, requiredLevel) {
  const diff = playerLevel - requiredLevel;
  if (diff >= 10) return "level-trivial"; // much lower level than player
  if (diff >= 5) return "level-easy"; // comfortably below player
  if (diff >= -4) return "level-even"; // around the same level
  if (diff >= -9) return "level-hard"; // somewhat above player
  return "level-deadly"; // far above player
}

// Auto-split from monolith.js
// Source section: data/game.js

(function () {
  function onReady(fn) {
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function maybeFixMojibake(text) {
    if (!text) return text;
    if (text.indexOf("�") === -1 && text.indexOf("�") === -1) return text;
    try {
      return decodeURIComponent(encodeURIComponent(text));
    } catch (_) {
      return text;
    }
  }
  function walkAndFix(node) {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    const updates = [];
    while (walker.nextNode()) {
      const cur = walker.currentNode;
      const fixed = maybeFixMojibake(cur.nodeValue);
      if (fixed && fixed !== cur.nodeValue) updates.push([cur, fixed]);
    }
    updates.forEach(([n, v]) => {
      n.nodeValue = v;
    });
  }
  function observeAndFix(root) {
    const mo = new MutationObserver((list) => {
      for (const m of list) {
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === 3) {
              const f = maybeFixMojibake(n.nodeValue);
              if (f !== n.nodeValue) n.nodeValue = f;
            } else if (n.nodeType === 1) {
              walkAndFix(n);
            }
          });
        } else if (m.type === "characterData") {
          const f = maybeFixMojibake(m.target.nodeValue);
          if (f !== m.target.nodeValue) m.target.nodeValue = f;
        }
      }
    });
    mo.observe(root, { childList: true, characterData: true, subtree: true });
  }
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
  function setupTabs() {
    document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
      function activate(tab) {
        tabs.forEach((t) => {
          const on = t === tab;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
          const panel = document.getElementById(
            t.getAttribute("aria-controls")
          );
          if (panel) {
            panel.classList.toggle("active", on);
            panel.hidden = !on;
          }
        });
      }
      tablist.addEventListener("click", (e) => {
        const t = e.target.closest('[role="tab"]');
        if (t) activate(t);
      });
      tablist.addEventListener("keydown", (e) => {
        const i = tabs.indexOf(document.activeElement);
        if (i >= 0) {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            const n = tabs[(i + 1) % tabs.length];
            n.focus();
            activate(n);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            const p = tabs[(i - 1 + tabs.length) % tabs.length];
            p.focus();
            activate(p);
          }
        }
      });
      tabs.forEach((t) => {
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        const on = t.classList.contains("active");
        if (panel) panel.hidden = !on;
        t.setAttribute("aria-selected", on ? "true" : "false");
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

export function showPage(pageId) {
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

// Expose functions globally
if (typeof window !== "undefined") {
  window.showPage = showPage;
  window.calculateLevel = calculateLevel;
  window.checkUnlockAnimalStructures = checkUnlockAnimalStructures;
}
